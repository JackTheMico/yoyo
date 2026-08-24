-- 麓鸣纯形统一流上下文感知顶功状态机 (Pure Popping FSM Processor)
-- 实现单字、一简、四码词、四码未命中自动回退与直出开关的统一分流引擎

local yoyo = require "yoyo.yoyo"

local processor = {}

---@class PurePoppingEnv: Env
---@field processing boolean

---@param env PurePoppingEnv
function processor.init(env)
  env.processing = false
end

---@param key_event KeyEvent
---@param env PurePoppingEnv
function processor.func(key_event, env)
  if env.processing then
    return yoyo.kNoop
  end

  -- 忽略释放键和修饰键 (Ctrl/Alt/Caps)
  if key_event:release() or key_event:alt() or key_event:ctrl() or key_event:caps() then
    return yoyo.kNoop
  end

  local context = env.engine.context
  local incoming = utf8.char(key_event.keycode)
  local input = yoyo.current(context)

  -- 1. 空输入或特殊前缀模式直接放行
  if not input or input == "" then
    return yoyo.kNoop
  end

  -- 反查模式 (以 ` 开头) 绕过顶功
  if input:sub(1, 1) == "`" or incoming == "`" then
    return yoyo.kNoop
  end

  -- 快符模式 (以 ' 开头) 绕过顶功
  if input:sub(1, 1) == "'" or incoming == "'" then
    return yoyo.kNoop
  end

  -- 标点并击编码 (以 6, e6, L, eL 或 fg 开头) 绕过顶功
  if input:match("^e?[6L]") or input:match("^fg") then
    return yoyo.kNoop
  end

  -- 2. 选字/翻页键（空格、单引号、数字键 0-9）不触发自动顶屏，交由后续 selector/speller 处理
  if incoming == " " or incoming == "'" or (incoming >= "0" and incoming <= "9") then
    return yoyo.kNoop
  end

  -- 3. 状态机分流逻辑
  local clean_input = input:gsub("[_+]", "")
  local effective_len = #clean_input
  local is_1jian = (#input == 2 and (input:sub(1, 1) == "_" or input:sub(1, 1) == "+")) or (effective_len == 1)

  -- Case A: 四码输入未命中词库时的自动回退切分
  -- 当 effective_len 达到 4 码且无匹配词（无 menu）时：
  -- 将前 2 码提交上屏（字 1），将后 2 码保留在 buffer 中（字 2）
  if effective_len == 4 and not context:has_menu() then
    env.processing = true
    local first_two = clean_input:sub(1, 2)
    local last_two = clean_input:sub(3, 4)
    
    context:pop_input(#input)
    context:push_input(first_two)
    if context:has_menu() then
      context:confirm_current_selection()
      context:commit()
    else
      env.engine:commit_text(first_two)
      context:clear()
    end
    context:push_input(last_two)
    env.processing = false
    return yoyo.kNoop
  end

  -- Case B: 3 码单字即刻直出模式 (当 instant_commit_3code 开关开启时)
  if effective_len == 3 and context:get_option("instant_commit_3code") and context:has_menu() then
    env.processing = true
    context:confirm_current_selection()
    context:commit()
    context:clear()
    env.processing = false
    return yoyo.kNoop
  end

  -- Case C: 已有一简 (is_1jian) 或 已有三码单字 (effective_len == 3) 或 已有四码/长码词 (effective_len >= 4)
  -- 当用户输入下一个非选字击键时，前序内容已完成，执行顶屏并提交上屏
  if is_1jian or effective_len == 3 or effective_len >= 4 then
    if context:has_menu() then
      env.processing = true
      context:confirm_current_selection()
      context:commit()
      context:clear()
      env.processing = false
      return yoyo.kNoop
    end
  end

  -- Case D: 已有两码 (effective_len == 2 且非一简)
  -- 此时 incoming 可能是：
  --   1. 单手按键 (1 码) -> 构成 3 码单字
  --   2. 双手并击 (2 码) -> 构成 4 码词
  -- 放行给 chord_composer/speller 进行追加
  return yoyo.kNoop
end

return processor
