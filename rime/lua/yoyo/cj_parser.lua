-- yoyo-pure-cj 串击解析器（纯函数，无副作用，可脱离引擎单测）
--
-- 设计依据见 docs/design/cj-parsing-rules.md。核心结论：
-- 「当前缓冲解析唯一」不能作为上屏依据——`SS` 的唯一解析是 2 码「多少」，
-- 而 `SSuy` 是 4 码词「多言」，早提交会砍断长码。因此只有在
-- **不可能再有更长码** 时才自动上屏，其余一律等用户按空格。
--
-- 规则：
--   2 码：不存在以它为前缀的 3/4 码 → 立即上屏 2 码单元
--   3 码：不是任何 4 码词的前缀   → 立即上屏 3 码字
--   4 码：存在 4 码词            → 立即上屏
--   其余：等待空格定界
-- 实测正确率 100%，代价是空格率 15%–52%（视码长分布）。

local data = require "yoyo.data.cj_decision"

local M = {}

-- 60 个可敲码元（与 schema 的 speller.alphabet 必须一致，由测试自动校验）
M.ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ;:,.<>/?"

local unit_set = {}
for ch in M.ALPHABET:gmatch(".") do unit_set[ch] = true end

function M.is_code_unit(ch)
  return unit_set[ch] == true
end

--- 2 码位的两个视图（#55）。并击版靠「哪只手/几个键」区分同一个 2 码位上的
--- 单字与词，串击只剩码元本身，因此必须显式选择视图。
M.VIEW_CF = "cf"  -- 主单：优先单字（默认，与桌面并击版默认一致）
M.VIEW_WF = "wf"  -- 主词：优先词

--- 取 2 码位在当前视图下的上屏文本。
---@param code string 2 个码元
---@param view string|nil M.VIEW_CF / M.VIEW_WF
---@return string|nil
function M.unit2_text(code, view)
  local u = data.unit2[code]
  if not u then return nil end
  local s = data.split2[code]
  if not s then return u[1] end        -- 单一类别：两视图相同
  if view == M.VIEW_WF then return s[2] end
  return s[1]
end

--- 取 2 码位在当前视图下的「次选」（另一类的首选）。
--- 单一类别的位置没有次选——不凭空造字。
---@param code string
---@param view string|nil
---@return string|nil
function M.second2(code, view)
  local s = data.split2[code]
  if not s then return nil end
  if view == M.VIEW_WF then return s[1] end
  return s[2]
end

--- 查一个「恰好 L 长」的码段在当前视图下的上屏文本。
--- 只做查表，不做「是否还能延长」的判断——那是 step 的职责，
--- force_resolve 是用户按空格后的强制切分，不需要这个判断。
---@param seg string 长度为 2 / 3 / 4 的码段
---@param view string|nil
---@return string|nil
local function text_of(seg, view)
  local L = #seg
  if L == 4 then return data.word4[seg] end
  if L == 3 then
    local c = data.char3[seg]
    return c and c[1]
  end
  return M.unit2_text(seg, view)
end

--- 判定当前缓冲能否上屏。
---@param buf string 码元缓冲
---@param view string|nil 2 码位视图
---@return string|nil text 要上屏的文本
---@return number|nil used 消耗的码元个数
function M.step(buf, view)
  local k = #buf
  if k == 2 then
    if data.longer2[buf] then return nil end
    local t = text_of(buf, view)
    if t then return t, 2 end
    return nil
  elseif k == 3 then
    if data.prefix3[buf] then return nil end
    local t = text_of(buf, view)
    if t then return t, 3 end
    return nil
  elseif k >= 4 then
    local t = text_of(buf:sub(1, 4), view)
    if t then return t, 4 end
    return nil
  end
  return nil
end

--- 反复切分，直到无法再切。
---@param buf string
---@param view string|nil
---@return table texts 按序上屏的文本列表
---@return string rest 剩余缓冲
function M.resolve_all(buf, view)
  local texts, b = {}, buf
  while true do
    local text, used = M.step(b, view)
    if not text then break end
    texts[#texts + 1] = text
    b = b:sub(used + 1)
  end
  return texts, b
end

--- 空格定界：按最长可解析前缀强制切分，无法解析的码元丢弃。
---@param buf string
---@param view string|nil
---@return table texts
function M.force_resolve(buf, view)
  local texts, b = {}, buf
  while #b > 0 do
    local used = false
    for _, L in ipairs({ 4, 3, 2 }) do
      if #b >= L then
        local text = text_of(b:sub(1, L), view)
        if text then
          texts[#texts + 1] = text
          b = b:sub(L + 1)
          used = true
          break
        end
      end
    end
    if not used then b = b:sub(2) end
  end
  return texts
end

--- 该缓冲是否还可能构成合法码（死缓冲判定）。
---@param buf string
---@return boolean
function M.is_prefix(buf)
  local k = #buf
  if k == 0 then return true end
  if k == 1 then return data.start[buf] == true end
  if k == 2 then return data.unit2[buf] ~= nil or data.longer2[buf] == true end
  if k == 3 then return data.char3[buf] ~= nil or data.prefix3[buf] == true end
  return true
end

--- 该缓冲的前 4 位是否为本表已知的 4 码词（判定「要不要交还 Rime」）。
---@param buf string
---@return boolean
function M.known_word(buf)
  return data.word4[buf:sub(1, 4)] ~= nil
end

--- 供测试：把一张「码序列」跑成上屏文本序列（含空格定界，模拟真实交互）。
---@param keys string 连续的码元串，用 "|" 表示按空格
---@param view string|nil
---@return table texts
function M.simulate(keys, view)
  local texts, buf = {}, ""
  for ch in keys:gmatch(".") do
    if ch == "|" then
      local t = M.force_resolve(buf, view)
      for _, v in ipairs(t) do texts[#texts + 1] = v end
      buf = ""
    else
      buf = buf .. ch
      local t, rest = M.resolve_all(buf, view)
      for _, v in ipairs(t) do texts[#texts + 1] = v end
      buf = rest
    end
  end
  return texts, buf
end

return M
