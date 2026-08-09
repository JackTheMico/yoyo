-- 拼音反查翻译器：反查段（reverse tag，由 reverse_segmentor 建立）中，把 ` 后的无声调全拼/前缀
-- 翻译为候选列表：字词 + 本方案编码注释（单字全码 / 词主码，去并击标记的纯码元序列）。
--
-- 数据源: rime/lua/yoyo/data/reverse_<首字母>.lua
--   （由 rime/scripts/generate_reverse_data.py 生成，勿手改；词库更新后须重跑该脚本）
-- 惰性加载: 首次输入某拼音首字母才 require 对应分片，启动/方案切换零负担。
--
-- 交互契约:
--   - 选中候选即上屏（segment 覆盖整个反查输入），编码区自动清空
--   - 反查输入由 reverse_input 门卫接管（绕过 chord_composer），选候选走 ' / Tab / Enter
--   - 无效拼音（如 qqq）无匹配则空候选，不崩溃

local translator = {}

local DEFAULTS = { prefix = "`", max_candidates = 100 }

-- 已加载分片缓存: 首字母 -> shard 表（空表也缓存，避免重复 require 失败）
local loaded = {}
-- 各片键列表缓存（按字母序）: 首字母 -> { 键... }
local keys_cache = {}
-- 两字符前缀桶: 首字母 -> { 2字符前缀 -> { 键... } }（懒构建，加速前缀补全）
local bucket_cache = {}

---加载（并缓存）某首字母的分片。无此片（如 i/u/v）返回空表。
---@param first string 拼音首字母 a-z
---@return table shard 拼音键 -> 候选数组
local function load_shard(first)
  local cached = loaded[first]
  if cached ~= nil then
    return cached
  end
  local ok, shard = pcall(require, "yoyo.data.reverse_" .. first)
  if not ok or type(shard) ~= "table" then
    shard = {}
  end
  loaded[first] = shard
  return shard
end

---获取某片全部键（字母序），缓存。
---@param first string
---@return string[] keys
local function shard_keys(first)
  local keys = keys_cache[first]
  if keys ~= nil then
    return keys
  end
  keys = {}
  for k in pairs(load_shard(first)) do
    keys[#keys + 1] = k
  end
  table.sort(keys)
  keys_cache[first] = keys
  return keys
end

---两字符前缀桶（懒构建）：给定首字母与前两字符，返回候选键列表。
---@param first string
---@param prefix2 string 前两个拼音字符
---@return string[] keys
local function bucket_keys(first, prefix2)
  local by2 = bucket_cache[first]
  if not by2 then
    by2 = {}
    for _, k in ipairs(shard_keys(first)) do
      local p2 = k:sub(1, 2)
      local lst = by2[p2]
      if not lst then
        lst = {}
        by2[p2] = lst
      end
      lst[#lst + 1] = k
    end
    bucket_cache[first] = by2
  end
  return by2[prefix2] or {}
end

---查询候选：精确键命中 + 前缀补全，保持数据权重降序；同 text 去重（保留先出现者）。
---纯函数（不依赖 librime 全局），供单测直接调用。
---@param first string 拼音首字母
---@param pinyin string 去掉反查前缀键后的拼音串（a-z）
---@param max_n number 最大候选数
---@return table[] items {text, code, weight} 数组，按权重降序
function translator.query(first, pinyin, max_n)
  local out = {}
  local seen = {}

  -- 1) 精确键命中（该键内候选已按权重降序）
  local exact = load_shard(first)[pinyin]
  if exact then
    for _, item in ipairs(exact) do
      out[#out + 1] = item
      seen[item[1]] = true
    end
  end
  if #out >= max_n then
    local t = {}
    for i = 1, max_n do
      t[i] = out[i]
    end
    return t
  end

  -- 2) 前缀补全：>=2 字符用桶索引，1 字符全扫该片；段内按权重降序统一排序
  local pool
  if #pinyin >= 2 then
    pool = bucket_keys(first, pinyin:sub(1, 2))
  else
    pool = shard_keys(first)
  end
  local tail = {}
  local tail_n = 0
  for _, key in ipairs(pool) do
    if key ~= pinyin and key:sub(1, #pinyin) == pinyin then
      for _, item in ipairs(load_shard(first)[key]) do
        if not seen[item[1]] then
          tail_n = tail_n + 1
          tail[tail_n] = item
          seen[item[1]] = true
        end
      end
    end
  end
  table.sort(tail, function(a, b) return a[3] > b[3] end)
  for _, item in ipairs(tail) do
    out[#out + 1] = item
    if #out >= max_n then
      break
    end
  end
  return out
end

---@param env Env
function translator.init(env)
  env.reverse = env.reverse or {}
  local config = env.engine.schema.config
  local reverse_config = config:get_map("reverse")
  env.reverse.prefix = DEFAULTS.prefix
  env.reverse.max_candidates = DEFAULTS.max_candidates
  if reverse_config then
    local p = reverse_config:get_value("prefix")
    if p then
      env.reverse.prefix = p:get_string()
    end
    local m = reverse_config:get_value("max_candidates")
    if m then
      env.reverse.max_candidates = m:get_int()
    end
  end
end

---@param input string 当前输入串（含反查前缀键）
---@param segment Segment
---@param env ReverseEnv
function translator.func(input, segment, env)
  if not segment:has_tag("reverse") then
    return
  end
  local cfg = env.reverse or DEFAULTS
  local prefix = cfg.prefix
  if input:sub(1, #prefix) ~= prefix then
    return
  end
  local pinyin = input:sub(#prefix + 1)
  if pinyin == "" or not pinyin:match("^[a-z]*$") then
    return
  end
  local items = translator.query(pinyin:sub(1, 1), pinyin, cfg.max_candidates)
  for _, item in ipairs(items) do
    local text, code = item[1], item[2]
    -- 注释直接显示去标记纯码元序列（如 dFrJdD / sHqL / vJ）
    yield(Candidate("reverse", segment.start, segment._end, text, code))
  end
end

return translator
