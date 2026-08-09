-- 反查分段器：input 以反查前缀键 ` 开头时，产出覆盖全输入的 reverse 段。
-- 放在 abc_segmentor 之前，使拼音部分不再被 abc_segmentor 当码元分词；
-- 不用 recognizer 建段（reverse_input 用 kAccepted 拦截按键会阻断 recognizer 处理器）。
--
-- 注意（librime 1.17 内置 librime-lua）：
--   * segmentor 的 func 签名是 func(segmentation, env)，输入串取 segmentation.input；
--   * segmentor 不被 coroutine 包装，不能 yield，只能 return 段列表；
--   * 段 tag 需通过 s.tags = {reverse = true} 设置（构造第 3 参数不生效）。
-- 反查翻译器用 env.engine.context.input 判断前缀，不依赖本段被采纳与否。

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

---@param segmentation Segmentation 当前分词器（含 .input 完整输入串）
---@param env ReverseSegmentorEnv
function segmentor.func(segmentation, env)
  local input = segmentation.input or ""
  local prefix = env.reverse_segmentor and env.reverse_segmentor.prefix or "`"
  if input:sub(1, #prefix) == prefix then
    local s = Segment(0, #input)
    s.tags = { reverse = true }
    return { s }
  end
  -- 非反查输入必须返回空表（返回 nil 会让 librime 认为分词失败，中断后续 segmentor 导致无候选）
  return {}
end

return segmentor
