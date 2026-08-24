-- 纯形·统一流·确定性状态机处理器 (pure_popping.lua)
-- 放置位置：位于 chord_composer 之后
-- 每次 chord_composer 输出码元后，在此处执行确定性分流与顶屏判定：
-- 1. 反查模式 (`)、快符模式 (')、标点并击 (e?[6L]|fg) 放行
-- 2. 选字/翻页键（空格、单引号、数字 0-9、小键盘 KP_0-KP_9）放行
-- 3. 模式识别与确定性顶屏：
--    a. 连续一简 (如 _d+e, _d_e)：提交 _d ("的")，留 +e ("有")
--    b. 两码字接一简 (如 iG+e)：如果 iGe 不是 3 码单字 -> 提交 iG ("打")，留 +e ("有")
--    c. 三码单字后接新击键 (如 bX_n_t 或 bX_n+e 或 bX_nsl)：提交 bXn ("鸣")，留新击键
--    d. 四码词语后接新击键 (如 rTah_t 或 ISoY_e 或 rTahsl)：提交 rTah ("类似")，留新击键
--    e. 四码非词自动回退 (如 slcb)：若 slcb 不是词库中的 4 码词 -> 提交 sl ("了")，留 cb ("不")
--    f. 3 码单字直出开关 (instant_commit_3code)：开启时 3 码命中立即直出

local yoyo = require "yoyo.yoyo"
local pure_data = require "yoyo.data.pure_dict_map"

local processor = {}

function processor.init(env)
  env.processing = false
end

function processor.func(key_event, env)
  if env.processing then
    return yoyo.kNoop
  end

  -- 忽略修饰键 (Ctrl/Alt/Caps)，但不忽略 release，因为 chord_composer 在 key-up 时才输出码元
  if key_event:alt() or key_event:ctrl() or key_event:caps() then
    return yoyo.kNoop
  end

  local context = env.engine.context
  local incoming = utf8.char(key_event.keycode)
  local input = yoyo.current(context)

  if not input or input == "" then
    return yoyo.kNoop
  end

  -- 特殊模式绕过
  if input:sub(1, 1) == "`" or input:sub(1, 1) == "'" or input:match("^e?[6L]") or input:match("^fg") then
    return yoyo.kNoop
  end

  -- 选字键/翻页键放行 (空格, ', 0-9, KP_0-KP_9)
  local kc = key_event.keycode
  if incoming == " " or incoming == "'" or (incoming >= "0" and incoming <= "9") or
     (kc >= 0xffb0 and kc <= 0xffb9) or (kc >= 0x30 and kc <= 0x39) or kc == 0x20 or kc == 0x27 then
    return yoyo.kNoop
  end

  -- 确定性提交前部中文，并保留后部拼写进入干净输入框
  local function commit_text_and_retain(first_code, remainder_code)
    local clean_first = first_code:gsub("[_+]", "")
    local text_to_commit = pure_data.dict_map[first_code] or pure_data.dict_map[clean_first]
    if text_to_commit then
      env.processing = true
      env.engine:commit_text(text_to_commit)
      context:clear()
      if remainder_code and remainder_code ~= "" then
        context:push_input(remainder_code)
      end
      env.processing = false
      return yoyo.kNoop
    end
    return yoyo.kNoop
  end

  -- Pattern A: 1简接1简 (如 _d+e, _d_e, +e_e, +e+e)
  local jian1, jian2 = input:match("^([_+][^_%s])([_+][^_%s])$")
  if jian1 and jian2 then
    return commit_text_and_retain(jian1, jian2)
  end

  -- Pattern B: 两码字/词接1简 (如 iG+e, sl_d)
  local chord2, jian = input:match("^([^_%s][^_%s])([_+][^_%s])$")
  if chord2 and jian then
    local candidate_3code = chord2 .. jian:sub(2)
    -- 如果 chord2 + jian 构成了词库中合法的 3 码单字 (如 bX_n -> bXn "鸣")，则保留
    if pure_data.chars_3code[candidate_3code] then
      -- 3码单字直出模式
      if context:get_option("instant_commit_3code") then
        return commit_text_and_retain(candidate_3code, "")
      end
      return yoyo.kNoop
    else
      -- 否则是两码字接1简 (如 iG+e "打"+"有") -> 立即提交两码字中文 "打"，留1简 "+e"！
      return commit_text_and_retain(chord2, jian)
    end
  end

  -- Pattern C: 3码单字接后序按键 (如 bX_n_t, bX_n+e, bX_nsl)
  local char3, next_stroke = input:match("^([^_%s][^_%s][_+][^_%s])(.+)$")
  if char3 and next_stroke then
    return commit_text_and_retain(char3, next_stroke)
  end

  -- Pattern D: 4码输入 (如 rTah, ISoY, aLZF, slcb)
  if #input == 4 and not input:find("[_+]") then
    -- 如果是词库中的 4 码词 (如 rTah "类似", ISoY "空格", aLZF "你好", xkhr "可以")
    if pure_data.words_4code[input] then
      return yoyo.kNoop  -- 完整词语，保持不拆！
    else
      -- 4码非词回退 (如 slcb "了不") -> 提交前2码中文 (sl "了")，留后2码 (cb "不")
      local first_two = input:sub(1, 2)
      local last_two = input:sub(3, 4)
      return commit_text_and_retain(first_two, last_two)
    end
  end

  -- Pattern E: 4码词接后序按键 (如 rTah_t, ISoY_e, xkhrsl)
  local word4, next_stroke4 = input:match("^([^_%s][^_%s][^_%s][^_%s])(.+)$")
  if word4 and next_stroke4 and not word4:find("[_+]") then
    return commit_text_and_retain(word4, next_stroke4)
  end

  return yoyo.kNoop
end

return processor
