-- 纯形支拼音反查翻译器
-- 输入以反引号 ` 开头即进入反查模式，剩余串作为无声调全拼键，
-- 按拼音首字母懒加载 26 分片（rime/lua/yoyo/data/reverse_<initial>.lua），
-- 支持前缀补全匹配。
-- 候选注释：
--   单字 → 「根+它产生的字母」逐位贴身，组间用 · 连接，如 的 → "白d·勹.·丶O 一简"
--   一简字 → 尾部追加「 一简」（一简码恒等于全码首码，故标在首根之后即可读懂）
--   词   → 主码；若词有简码（分片候选第4元素 % 前缀），显示为「全码 | 简码」
-- 字根拆分见 docs/research/2026-10-27-反查候选注释加字根拆分.md 与
-- docs/design/2026-10-28-反查字根拆分-第二根设计.md；
-- 反查本身详见 CONTEXT.md「反查（拼音反查）」与 issue #18。

local yoyo = require "yoyo.yoyo"

local translator = {}

-- 分片缓存：首字母 -> 拼音键 -> 候选数组
local shards = {}

-- 数据目录（相对 Rime 用户目录下的 lua/yoyo/data）
local DATA_DIR = "yoyo/data"

-- 字根拆分表：首次反查时才载入（不在启动时读）
local align_table = nil
local align_loaded = false

--- 是否显示字根拆分。
--- 开关语义取反：名字是 no_zigen。未声明该开关的方案，get_option 返回 false 或 nil
--- 都等于「没开 no_zigen」，于是默认显示——新增方案不必记得补声明。
---@param env Env|nil
---@return boolean
local function hint_enabled(env)
  local ctx = env and env.engine and env.engine.context
  if not ctx or not ctx.get_option then
    return true
  end
  return not ctx:get_option("no_zigen")
end

---@param text string
---@param env Env|nil
---@return string|nil
local function align_of(text, env)
  if not hint_enabled(env) then
    return nil
  end
  if not align_loaded then
    align_loaded = true
    local ok, result = pcall(require, DATA_DIR .. ".zigen_align")
    if ok and type(result) == "table" then
      align_table = result
    else
      yoyo.warnf("reverse_lookup: 字根拆分表载入失败: %s", tostring(result))
    end
  end
  return align_table and align_table[text] or nil
end

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

--- 一简字标记：接在注释尾部，与「全码 | 简码」的竖线约定区分开。
local BRIEF_MARK = " 一简"

--- 反查注释。
--- 单字：有字根拆分数据就用「根+它产生的字母」（如 白d·勹.·丶O），
--- 让用户看到每个字母是哪个字根给的；没有数据时退回纯编码。
--- 一简字（分片编码只有一位）在注释尾部追加「 一简」，与普通字区分开：
--- 一简码恒等于全码首码（见 test_reverse_zigen.lua 第 9 条守卫），所以读者
--- 看到的正好是「首根那一位可以单独上屏」。全码最短两位，码长 1 不会与全码混淆。
--- 词：全码（c[2]）；若该词有简码（c[4]，% 前缀且不同于全码），
--- 显示为「全码 | 简码」，帮助用户同时记忆两种打法。词不加一简标记——
--- 即使它的主码只有一位（如 可以 = x），也走词自己的约定。
---@param c table  候选 {text, code, weight, brief?}
---@param env Env|nil
---@param is_char boolean  是否单字（由调用方判定，避免重复计算 UTF-8 长度）
---@return string
local function make_comment(c, env, is_char)
  local brief = is_char and #c[2] == 1
  local align = align_of(c[1], env)
  if align then
    return brief and (align .. BRIEF_MARK) or align
  end
  local comment = c[2]
  local word_brief = c[4]
  if word_brief and word_brief ~= "" and word_brief ~= c[2] then
    comment = comment .. " | " .. word_brief
  end
  return brief and (comment .. BRIEF_MARK) or comment
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
      cand.comment = make_comment(c, env, true)
      yield(cand)
    end
  end
  for _, c in ipairs(words) do
    local cand = Candidate("yoyo", seg.start, seg._end, c[1], c[2])
    if cand then
      cand.comment = make_comment(c, env, false)
      yield(cand)
    end
  end
end

return translator
