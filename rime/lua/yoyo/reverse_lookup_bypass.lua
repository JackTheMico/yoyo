-- 反查模式键直通处理器
-- 放在 chord_composer 之前：输入以 ` 开头时，把按键直接推入输入缓冲
-- 并返回 kAccepted，阻止 chord_composer 把后续 a–z 键当作并击键缓冲。
-- 无 ` 前缀时返回 kNoop，不影响正常并击。
-- 反查模式下 [ ] 用作翻页键：librime-lua 的 Context 没有 page_up/page_down，
-- 但有 highlight(idx)（方法）。用 env 自行跟踪翻页偏移量（不依赖
-- selected_index，它可能在段重建后重置为 0），每次翻页前通过
-- segment:get_candidate_at(idx) 触发 Menu::Prepare(idx+1) 懒加载候选。

local yoyo = require "yoyo.yoyo"

local processor = {}

---@param env Env
---@return integer
local function get_page_size(env)
  local config = env.engine.schema.config
  if config then
    local v = config:get_int("menu/page_size")
    if v and v > 0 then return v end
  end
  return 5
end

--- 获取当前 Segment（用于访问 menu 相关方法）
---@param context Context
---@return Segment|nil
local function get_segment(context)
  local ok, seg = pcall(function()
    return context.composition:toSegmentation():back()
  end)
  if ok and seg then return seg end
  return nil
end

---@param env Env
function processor.init(env)
  env.rv_offset = 0
  env.rv_input = ""
end

--- 翻页：用 env 自跟踪偏移量，先触发候选懒加载，再 highlight
---@param env Env
---@param context Context
---@param page_size integer
---@param delta integer  正=下页，负=上页
local function turn_page(env, context, page_size, delta)
  local offset = env.rv_offset or 0
  local new_idx = offset + delta * page_size
  if new_idx < 0 then new_idx = 0 end

  -- 先触发候选懒加载：get_candidate_at 内部调用 Menu::Prepare(idx+1)。
  -- 若候选不存在（已到末页），get_candidate_at 返回 nil → 不翻页。
  local seg = get_segment(context)
  if seg then
    local ok_load, cand = pcall(function()
      return seg:get_candidate_at(new_idx)
    end)
    if ok_load and not cand then
      return
    end
  end

  -- 候选已加载，highlight 到目标索引
  pcall(function()
    context:highlight(new_idx)
  end)
  env.rv_offset = new_idx
end

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
    -- 输入变化时（用户继续打拼音），重置翻页偏移
    if input ~= (env.rv_input or "") then
      env.rv_offset = 0
      env.rv_input = input
    end

    local incoming = utf8.char(key_event.keycode)

    -- [ = 上一页，] = 下一页（反查模式下始终拦截，阻止 chord_composer/speller 处理）
    if incoming == ']' then
      turn_page(env, context, get_page_size(env), 1)
      return yoyo.kAccepted
    end
    if incoming == '[' then
      turn_page(env, context, get_page_size(env), -1)
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

  -- 不在反查模式：重置状态
  env.rv_offset = 0
  env.rv_input = ""

  -- 检查当前键是否为 `（反查入口键）
  local incoming = utf8.char(key_event.keycode)
  if incoming == '`' then
    context:push_input(incoming)
    return yoyo.kAccepted
  end

  return yoyo.kNoop
end

return processor
