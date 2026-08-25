-- 纯形·统一流·确定性状态机处理器 (pure_popping.lua)
-- 放置位置：位于 chord_composer 之后，speller 之前
--
-- 关键时序约束（来自 librime chord_composer.cc 源码）：
--   chord_composer::FinishChord() 把合成码元逐字符注入 engine->ProcessKey()，
--   每个字符走完整处理器链（pure_popping → ... → speller）。
--   因此：pure_popping 收到 incoming 字符时，context.input 只含前 N-1 个字符。
--
-- 设计原则：基于 (context.input, incoming) 二元组做前瞻推断
--
-- 编码类型：
--   一简  = _X 或 +X（2字符，以 _ 或 + 开头，如 _w, +e）
--   两码字 = XY（2字符，均为普通字母，如 iG, bT）
--   3码字 = XX_Y 或 XX+Y（4字符，含 _/+，如 bX_n, wC+s）
--   4码词 = XYZW（4字符，均为普通字母，如 rTah, ISoY）
--
-- 模式识别（input=已有内容，incoming=当前字符，尚未进 speller）：
--
-- A. input=一简(_X/+X)，incoming=任意可见键
--    → 顶出一简，kNoop（speller 自然 push incoming）
--    覆盖：_w+b（是吧），_d++（的+有），_w+_（是+在）
--
-- B. input=两码(XX)，incoming=_/+（一简前缀）
--    → kNoop，等下一字符
--
-- C. input=两码+前缀(XX_/XX+)，incoming=字母Y
--    → if chars_3code[XXY]: kNoop（3码字，继续等）
--    → else: 顶出XX，restore前缀，kNoop（speller push Y → +Y/已有_加上Y → 一简）
--
-- D. input=一简+一字符(_XY/+XY, ilen=3)，incoming=任意普通字母
--    → 顶出一简(_X/+X)，restore Y，kNoop（speller push incoming）
--    覆盖：input='_wb', incoming='T' → 顶出_w，restore b，→ speller 'T' → input='bT'
--
-- E. input=完整3码字(XX_Y/XX+Y, ilen=4)，incoming=任意可见键
--    → 顶出3码字，kNoop
--
-- F. input=3字符纯字母(XYZ)，incoming=普通字母W
--    → if words_4code[XYZW]: kNoop（4码词，继续等）
--    → else: 顶出XY，restore Z，kNoop（speller push W）
--
-- G. input=4字符纯字母(XYZW)，incoming=任意可见键
--    → 顶出XYZW（词或字），kNoop

local yoyo = require "yoyo.yoyo"
local pure_data = require "yoyo.data.pure_dict_map"

local processor = {}

function processor.init(env)
  env.processing = false
end

local function is_jian_prefix(c)
  return c == "_" or c == "+"
end

local function is_plain(c)
  return c:match("[a-zA-Z;:,<.>/?]") ~= nil
end

-- 提交中文，可选 restore 一段前缀回 input，然后让 incoming 继续走向 speller
local function commit_and_restore(env, ctx, code, restore)
  local clean = code:gsub("[_+]", "")
  local text = pure_data.dict_map[code] or pure_data.dict_map[clean]
  if not text then return end
  env.processing = true
  env.engine:commit_text(text)
  ctx:clear()
  if restore and restore ~= "" then
    ctx:push_input(restore)
  end
  env.processing = false
end

function processor.func(key_event, env)
  if env.processing then return yoyo.kNoop end

  if key_event:alt() or key_event:ctrl() or key_event:caps() then
    return yoyo.kNoop
  end

  local context = env.engine.context
  local kc = key_event.keycode
  -- 只处理可见 ASCII 字符（0x20-0x7e）
  if kc < 0x20 or kc > 0x7e then return yoyo.kNoop end
  local incoming = utf8.char(kc)
  local input = yoyo.current(context)

  if not input or input == "" then return yoyo.kNoop end

  -- 特殊模式绕过
  if input:sub(1,1) == "`" or input:sub(1,1) == "'" then return yoyo.kNoop end
  if input:match("^fg") or input:match("^e?[6L]") then return yoyo.kNoop end

  -- 选字/翻页键放行：空格、'、数字
  if incoming == " " or incoming == "'" or (incoming >= "0" and incoming <= "9") then
    return yoyo.kNoop
  end

  local ilen = #input

  -- ─── Pattern A: 一简完整(_X 或 +X)，接任意可见键 ──────────────────────────
  -- input='_w', incoming='b' → 顶出 _w("是")，kNoop → speller push 'b'
  -- input='_d', incoming='+' → 顶出 _d("的")，kNoop → speller push '+'
  if ilen == 2 and is_jian_prefix(input:sub(1,1)) and is_plain(input:sub(2,2)) then
    commit_and_restore(env, context, input, nil)
    return yoyo.kNoop
  end

  -- ─── Pattern B: 两码(XX)，接一简前缀(_/+) → kNoop，等下一字符 ─────────────
  if ilen == 2 and is_plain(input:sub(1,1)) and is_plain(input:sub(2,2))
     and is_jian_prefix(incoming) then
    return yoyo.kNoop
  end

  -- ─── Pattern C: 两码+前缀(XX_/XX+)，接字母 → 判断是否3码字 ─────────────────
  if ilen == 3 and is_plain(input:sub(1,1)) and is_plain(input:sub(2,2))
     and is_jian_prefix(input:sub(3,3)) and is_plain(incoming) then
    local chord2 = input:sub(1,2)
    local jian_head = input:sub(3,3)
    if pure_data.chars_3code[chord2 .. incoming] then
      return yoyo.kNoop  -- 是3码字（如 bXn）
    else
      commit_and_restore(env, context, chord2, jian_head)
      return yoyo.kNoop
    end
  end

  -- ─── Pattern D: 一简+一字母(_XY/+XY, ilen=3)，接普通字母 ───────────────────
  -- input='_wb', incoming='T' → 顶出_w("是")，restore 'b'，kNoop
  -- input='_da', incoming='h' → 顶出_d("的")，restore 'a'，kNoop
  if ilen == 3 and is_jian_prefix(input:sub(1,1)) and is_plain(input:sub(2,2))
     and is_plain(input:sub(3,3)) and is_plain(incoming) then
    local jian = input:sub(1,2)   -- '_w'
    local next1 = input:sub(3,3)  -- 'b'（两码字的第1字符）
    commit_and_restore(env, context, jian, next1)
    return yoyo.kNoop
  end

  -- ─── Pattern E: 完整3码字(XX_Y/XX+Y, ilen=4)，接任意可见键 ─────────────────
  if ilen == 4 and is_plain(input:sub(1,1)) and is_plain(input:sub(2,2))
     and is_jian_prefix(input:sub(3,3)) and is_plain(input:sub(4,4)) then
    commit_and_restore(env, context, input, nil)
    return yoyo.kNoop
  end

  -- ─── Pattern F: 3字符纯字母(XYZ)，接普通字母W → 判断是否4码词 ───────────────
  if ilen == 3 and not input:find("[_+]") and is_plain(incoming) then
    if pure_data.words_4code[input .. incoming] then
      return yoyo.kNoop  -- 是4码词（如 rTah）
    else
      commit_and_restore(env, context, input:sub(1,2), input:sub(3,3))
      return yoyo.kNoop
    end
  end

  -- ─── Pattern G: 4字符纯字母(XYZW)，接任意可见键 → 顶出词/字 ─────────────────
  if ilen == 4 and not input:find("[_+]") then
    local text = pure_data.dict_map[input]
    if text then commit_and_restore(env, context, input, nil) end
    return yoyo.kNoop
  end

  return yoyo.kNoop
end

return processor
