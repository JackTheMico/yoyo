-- 反查输入门卫：反查模式（input 以反查前缀键 ` 开头）下直接消费按键进 input，
-- 绕过 chord_composer —— 否则拼音字母会被并击和弦吞掉（chord alphabet 覆盖全部小写字母）。
--
-- 处理范围（反查模式下）:
--   a-z        -> 直接 push_input（原始拼音，不经 speller algebra）
--   BackSpace  -> pop_input(1) 逐字符删（并击方案 key_binder 的连发 BackSpace 会跳删 3 码）
--   数字/空格  -> 吞掉（防 chord_composer 和弦化；反查选候选走 ' / Tab / Enter）
--   其他       -> 放行（Escape/Enter/'/Tab 走正常处理器链）
--
-- 注意: 反查 segment 由 reverse_segmentor 在分词阶段建立（本 processor 用 kAccepted
-- 拦截按键会阻断 recognizer，故不用 recognizer 建段）。

local yoyo = require "yoyo.yoyo"

local processor = {}

---@param env Env
function processor.init(env)
  env.reverse_input = env.reverse_input or {}
  local config = env.engine.schema.config
  local reverse_config = config:get_map("reverse")
  env.reverse_input.prefix = "`"
  if reverse_config then
    local p = reverse_config:get_value("prefix")
    if p then
      env.reverse_input.prefix = p:get_string()
    end
  end
end

---@param key_event KeyEvent
---@param env ReverseInputEnv
function processor.func(key_event, env)
  if key_event:release() or key_event:alt() or key_event:ctrl() or key_event:caps() or key_event:shift() then
    return yoyo.kNoop
  end
  local context = env.engine.context
  local input = context.input or ""
  local prefix = env.reverse_input and env.reverse_input.prefix or "`"
  -- 非反查模式：放行。注意反查前缀键 ` 本身也走这里——它不在 chord_composer
  -- 字母表，会经 recognizer/key_binder 落到 speller 加入 input（speller alphabet 含 `），
  -- 下一键起本处理器进入反查模式接管。
  if input:sub(1, #prefix) ~= prefix then
    return yoyo.kNoop
  end
  local keycode = key_event.keycode
  -- a-z: 直接进 input（原始拼音）
  if keycode >= 0x61 and keycode <= 0x7a then
    context:push_input(utf8.char(keycode))
    return yoyo.kAccepted
  end
  -- BackSpace: 逐字符删
  if keycode == 0xff08 then
    if input ~= "" then
      context:pop_input(1)
      return yoyo.kAccepted
    end
    return yoyo.kNoop
  end
  -- 数字/空格: 吞掉（防 chord 化；选候选用 ' / Tab / Enter）
  if (keycode >= 0x30 and keycode <= 0x39) or keycode == 0x20 then
    return yoyo.kAccepted
  end
  return yoyo.kNoop
end

return processor
