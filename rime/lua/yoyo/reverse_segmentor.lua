-- 反查分段器：input 以反查前缀键 ` 开头时，产出覆盖全输入的 reverse 段。
-- 放在 abc_segmentor 之前，使拼音部分不再被 abc_segmentor 当码元分词；
-- 不用 recognizer 建段（reverse_input 用 kAccepted 拦截按键会阻断 recognizer 处理器）。

local segmentor = {}

---@param env Env
function segmentor.init(env)
  env.reverse_segmentor = env.reverse_segmentor or {}
  local config = env.engine.schema.config
  local reverse_config = config:get_map("reverse")
  env.reverse_segmentor.prefix = "`"
  if reverse_config then
    local p = reverse_config:get_value("prefix")
    if p then
      env.reverse_segmentor.prefix = p:get_string()
    end
  end
end

---@param input string 完整输入串
---@param segment Segment 当前待分词空隙
---@param env ReverseSegmentorEnv
function segmentor.func(input, segment, env)
  local prefix = env.reverse_segmentor and env.reverse_segmentor.prefix or "`"
  if input:sub(1, #prefix) == prefix then
    yield(Segment(segment.start, segment._end, "reverse"))
  end
end

return segmentor
