-- 纯形·统一流·前置状态机处理器 (pure_popping.lua)
-- 作用：位于 chord_composer 之前执行。
-- 当输入框中已有完成内容（一简、3码单字、4码词）且用户按下下一个新击键时，
-- 立即将已完成内容顶屏提交上屏，并清空输入框，使后续击键进入全新的空输入环境。

local yoyo = require "yoyo.yoyo"

local processor = {}

---@param env Env
function processor.init(env)
  env.processing = false
end

---@param key_event KeyEvent
---@param env Env
---@return integer
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

  -- 2. 选字/翻页键（空格、单引号、数字键 0-9、小键盘 KP_0-KP_9 等）不触发自动顶屏，交由后续 selector/speller 处理
  local kc = key_event.keycode
  if incoming == " " or incoming == "'" or (incoming >= "0" and incoming <= "9") or
     (kc >= 0xffb0 and kc <= 0xffb9) or (kc >= 0x30 and kc <= 0x39) or kc == 0x20 or kc == 0x27 then
    return yoyo.kNoop
  end

  -- 3. 状态机分流逻辑
  local clean_input = input:gsub("[_+]", "")
  local effective_len = #clean_input
  local is_1jian = (#input == 2 and (input:sub(1, 1) == "_" or input:sub(1, 1) == "+")) or (effective_len == 1)

  -- 当输入框已有一简 (is_1jian) 或 已有3码单字 (effective_len == 3) 或 已有4码词 (effective_len >= 4):
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

  return yoyo.kNoop
end

-- 兼容独立后置调用
local post_processor = require "yoyo.pure_popping_post"
processor.post_func = post_processor.func

return processor
