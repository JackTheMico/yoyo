-- 反查模式键直通处理器
-- 放在 chord_composer 之前：输入以 ` 开头时，把按键直接推入输入缓冲
-- 并返回 kAccepted，阻止 chord_composer 把后续 a–z 键当作并击键缓冲。
-- 无 ` 前缀时返回 kNoop，不影响正常并击。
-- 反查模式下 [ ] 用作翻页键（避免与正常并击的 [ ] chord 标记冲突）。

local yoyo = require "yoyo.yoyo"

local processor = {}

---@param key_event KeyEvent
---@param env Env
function processor.func(key_event, env)
  if key_event:release() or key_event:alt() or key_event:ctrl() or key_event:caps() then
    return yoyo.kNoop
  end

  local context = env.engine.context
  local input = context.input

  -- 输入以 ` 开头 = 已在反查模式
  if input ~= "" and input:sub(1, 1) == '`' then
    local incoming = utf8.char(key_event.keycode)

    -- [ = 上一页，] = 下一页（反查模式下始终拦截，阻止 chord_composer 处理）
    if incoming == '[' then
      context:page_up()
      return yoyo.kAccepted
    end
    if incoming == ']' then
      context:page_down()
      return yoyo.kAccepted
    end

    -- 只放行 a–z（反查拼音）到输入缓冲
    if incoming:match("^[a-z]$") then
      context:push_input(incoming)
      return yoyo.kAccepted
    end
    -- BackSpace 等控制键交给后续 processor 处理
    return yoyo.kNoop
  end

  -- 不在反查模式：检查当前键是否为 `（反查入口键）
  local incoming = utf8.char(key_event.keycode)
  if incoming == '`' then
    context:push_input(incoming)
    return yoyo.kAccepted
  end

  return yoyo.kNoop
end

return processor
