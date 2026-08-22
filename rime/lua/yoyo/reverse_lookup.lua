-- 纯形支拼音反查翻译器
-- 输入以反引号 ` 开头即进入反查模式，剩余串作为无声调全拼键，
-- 按拼音首字母懒加载 26 分片（rime/lua/yoyo/data/reverse_<initial>.lua），
-- 支持前缀补全匹配。候选注释显示去并击标记的纯形码元（单字全码 / 词主码）。
-- 详见 CONTEXT.md「反查（拼音反查）」与 issue #18。

local yoyo = require "yoyo.yoyo"

local translator = {}

-- 分片缓存：首字母 -> 拼音键 -> 候选数组
local shards = {}

-- 数据目录（相对 Rime 用户目录下的 lua/yoyo/data）
local DATA_DIR = "yoyo/data"

--- 首次命中某首字母时载入对应分片
---@param initial string  单字母
---@return table  分片表（键 -> 候选数组）
local function get_shard(initial)
  if shards[initial] ~= nil then
    return shards[initial]
  end
  -- 缺失分片（拼音无此首字母，如 i/u/v）返回空表，避免重复尝试
  shards[initial] = {}
  local modname = DATA_DIR .. ".reverse_" .. initial
  local ok, result = pcall(require, modname)
  if ok and type(result) == "table" then
    shards[initial] = result
  else
    yoyo.warnf("reverse_lookup: 分片 %s 载入失败: %s", modname, tostring(result))
  end
  return shards[initial]
end

---@param input string  当前输入（含反查前缀 `）
---@param seg Segment
---@param env Env
function translator.func(input, seg, env)
  -- 仅处理以 ` 开头的输入
  if input:sub(1, 1) ~= "`" then
    return
  end
  local key = input:sub(2):lower()
  -- `` 单独（无拼音）不产候选，但保留反查模式（等用户继续输入拼音）
  if key == "" then
    return
  end
  if not key:match("^[a-z]+$") then
    return
  end

  local initial = key:sub(1, 1)
  local shard = get_shard(initial)

  -- 前缀补全匹配：键是完整拼音键的前缀即命中。
  -- 收集命中键并按字母序排序，保证翻页顺序稳定。
  local matched_keys = {}
  for full_key in pairs(shard) do
    if full_key:sub(1, #key) == key then
      matched_keys[#matched_keys + 1] = full_key
    end
  end
  table.sort(matched_keys)

  local yielded = {}  -- text -> true，去重
  -- 先收集所有命中候选，分单字/词两组
  local chars = {}
  local words = {}
  for _, full_key in ipairs(matched_keys) do
    local cands = shard[full_key]
    for _, c in ipairs(cands) do
      local text, code = c[1], c[2]
      if not yielded[text] then
        yielded[text] = true
        local len = utf8 and utf8.len(text) or #text
        if len == 1 then
          chars[#chars + 1] = c
        else
          words[#words + 1] = c
        end
      end
    end
  end
  -- 单字优先，词在后；各自组内按权重降序（已在生成阶段保证）
  for _, c in ipairs(chars) do
    local cand = Candidate("yoyo", seg.start, seg._end, c[1], c[2])
    if cand then
      cand.comment = c[2]
      yield(cand)
    end
  end
  for _, c in ipairs(words) do
    local cand = Candidate("yoyo", seg.start, seg._end, c[1], c[2])
    if cand then
      cand.comment = c[2]
      yield(cand)
    end
  end
end

return translator
