-- 反查候选注释「逐位码位对齐」测试 (test_reverse_zigen.lua)
-- 用法：lua5.4 test_reverse_zigen.lua
--
-- 加载真实的 reverse_lookup.lua 与真实的 zigen_align.lua，用 stub 的
-- Candidate / yield / log 驱动翻译器，验证：
--   1. 开关 no_zigen 打开时不加载拆分表，注释退回主码（分片 c[2]，不是全码）
--   2. 三种取码形态各按「根+字母贴身」渲染，且不再带全码前缀
--   3. 私用区字根归一到主字根、笔画根归一成笔画名
--   4. 硬约束：注释里的字母数恒等于该字全码长度（防「部分归属」静默吞字母）
--   5. 词条注释形态不变，且一简标记只给单字（词的主码可能也是一位）
--   6. 降级字退回纯编码
--   7. 一简标记的判定规则（单字 + 分片码长 1），用真实候选压规则
--   8. 数据守卫：一简码恒等于全码首码（否则「一简」标在首根之后的读法就是假话）

local SCRIPTS_DIR = (arg and arg[0] and arg[0]:match("(.*/)")) or "./"
package.path = SCRIPTS_DIR .. "../lua/?.lua;" .. package.path
local DICT_PATH = SCRIPTS_DIR .. "../yoyo-pure.dict.yaml"

-- rime 环境的 stub
log = { info = function() end, warning = function() end, error = function() end }

local yielded
function yield(cand)
  yielded[#yielded + 1] = cand
end

--- Candidate 的 stub。第 5 个参数就是翻译器传进来的raw_code，单独记一份，
--- 因为紧接着 cand.comment 会被 make_comment 覆盖。
function Candidate(kind, start, _end, text, comment)
  return { type = kind, start = start, _end = _end, text = text, comment = comment, raw_code = comment }
end

-- 开关关闭时，拆分表一次都不该被 require。
-- 必须在任何会触发载入的用例之前装好探针。
local real_require = require
local align_loads = 0
require = function(name)
  if name == "yoyo/data.zigen_align" then
    align_loads = align_loads + 1
  end
  return real_require(name)
end

local reverse_lookup = require "yoyo.reverse_lookup"

local passed, failed = 0, 0
local function check(name, cond, detail)
  if cond then
    passed = passed + 1
  else
    failed = failed + 1
    print(string.format("FAIL  %s%s", name, detail and ("  ← " .. detail) or ""))
  end
end

local SEG = { start = 0, _end = 3 }

--- 构造带分量的 env。no_zigen 打开 = 只有纯码。
---@param no_zigen boolean
local function env(no_zigen)
  return {
    engine = {
      context = {
        get_option = function(_, name)
          return name == "no_zigen" and no_zigen or false
        end,
      },
    },
  }
end

--- 跑一次反查，返回候选表
local function lookup(input, no_zigen)
  yielded = {}
  reverse_lookup.func(input, SEG, env(no_zigen))
  return yielded
end

--- 找某字的候选
local function cand_of(input, text, no_zigen)
  for _, c in ipairs(lookup(input, no_zigen)) do
    if c.text == text then
      return c
    end
  end
  return nil
end

--- 找某字的注释
local function comment_of(input, text, no_zigen)
  local c = cand_of(input, text, no_zigen)
  return c and c.comment or nil
end

-- 1. 开关关闭：注释退回主码（分片里的 c[2]，不是全码——全码只有拆分串才带），
--    且拆分表一次都不载入。「的」是 120 个一简字之一，主码即一简码，故带一简标记。
local off_comment = comment_of("`de", "的", true)
check("关闭时 的 注释 = 主码 + 一简标记", off_comment == "d 一简", off_comment)
check("关闭时未加载拆分表", align_loads == 0, align_loads .. " 次")

-- 2. 三种取码形态。和/的 是一简字，注释尾部带「 一简」，其余不带。
check("单根占两码：鹿", comment_of("`lu", "鹿") == "鹿Al", comment_of("`lu", "鹿"))
check("双根末根占两码：和", comment_of("`he", "和") == "禾x·口bk 一简", comment_of("`he", "和"))
check("多根首次末各一码：的", comment_of("`de", "的") == "白d·勹.·丶O 一简", comment_of("`de", "的"))

-- 3. 中间根不显示；私用区根与笔画根要归一
check("五个根只显示首/次/末：德", comment_of("`de", "德") == "彳g·十e·心:", comment_of("`de", "德"))
check("四个根只显示首/次/末：寒", comment_of("`han", "寒") == "宀j·井h·冫S", comment_of("`han", "寒"))
check("私用区根归一成主字根：你", comment_of("`ni", "你") == "亻a·角L·小E 一简", comment_of("`ni", "你"))
check("私用区根归一成主字根：是", comment_of("`shi", "是") == "日w·疋Cs 一简", comment_of("`shi", "是"))
check("笔画根归一成笔画名：上", comment_of("`shang", "上") == "卜x·一fi 一简", comment_of("`shang", "上"))

-- 4. 硬约束：注释里的字母数 == 该字全码长度
--    没有这条，「部分归属」时会把 Al 渲染成 鹿A 而没人发现。
--    全码取自码表（独立真值源），不能拿候选的 c[2]——那是主码，高频字往往只有一简。
local function load_full_codes(path)
  local map = {}
  local in_body = false
  for line in io.lines(path) do
    if line:sub(1, 3) == "..." then
      in_body = true
    elseif in_body and line ~= "" and line:sub(1, 1) ~= "#" then
      local ch, code = line:match("^([^\t]+)\t([^\t]+)")
      if ch and utf8.len(ch) == 1 and code then
        -- 去掉并击手别等标记，只留码元
        local bare = code:gsub("[!@%-_+%(%)%[%]=]", "")
        local prev = map[ch]
        if bare ~= "" and (not prev or #bare > #prev) then
          map[ch] = bare
        end
      end
    end
  end
  return map
end

local full_codes = load_full_codes(DICT_PATH)
local function ascii_count(s)
  local n = 0
  for i = 1, #s do
    local b = s:byte(i)
    if b > 0x20 and b < 0x7f then
      n = n + 1
    end
  end
  return n
end
local bad_len, checked = {}, 0
for _, input in ipairs({ "`shi", "`de", "`han", "`wo", "`yi" }) do
  for _, c in ipairs(lookup(input)) do
    local full = full_codes[c.text]
    if utf8.len(c.text) == 1 and full and c.comment:find("·", 1, true) then
      checked = checked + 1
      if ascii_count(c.comment) ~= #full then
        bad_len[#bad_len + 1] = string.format("%s 注释=%s 字母%d≠全码%d(%s)",
          c.text, c.comment, ascii_count(c.comment), #full, full)
      end
    end
  end
end
check("单字注释字母数 == 全码长度（" .. checked .. " 字）", #bad_len == 0, table.concat(bad_len, " / "))
print(string.format("  字母数不变量覆盖 %d 字", checked))

-- 5. 词条注释形态不变，且一简标记只给单字：
--    「可以」的主码就是一位（x），若按「码长 1」判定就会误标，故必须带单字判定
local word_comment = comment_of("`keyi", "可以")
check("词条注释保持纯编码（主码一位也不加一简）", word_comment == "x", word_comment)

-- 6. 过不了「全有或全无」的字退回纯编码（不加标记、不留占位符）
--    哀 与 微 是全量数据里真实降级的两个字，分属不同分片
for _, case in ipairs({ { "`ai", "哀" }, { "`wei", "微" } }) do
  local c = cand_of(case[1], case[2])
  check("降级字 " .. case[2] .. " 退回纯编码", c and c.comment == c.raw_code,
    c and (c.comment .. " ≠ " .. c.raw_code) or "无此候选")
end

-- 7. 全量候选注释非空
local empty, total = 0, 0
for _, c in ipairs(lookup("`shi")) do
  total = total + 1
  if not c.comment or c.comment == "" then
    empty = empty + 1
  end
end
check("`shi 候选均有注释", total > 0 and empty == 0, string.format("%d/%d 为空", empty, total))

-- 8. 一简标记的判定规则：单字且分片编码只有一位。
--    这条用真实候选压规则本身，防止标记加错对象（词、多码字）或漏标。
local mark_bad, mark_checked, mark_brief = {}, 0, 0
for _, input in ipairs({ "`de", "`shi", "`ni", "`wo", "`yi", "`bu", "`shi" }) do
  for _, c in ipairs(lookup(input)) do
    if utf8.len(c.text) == 1 then
      mark_checked = mark_checked + 1
      local marked = c.comment:find(" 一简", 1, true) ~= nil
      local expect = #c.raw_code == 1
      if expect then
        mark_brief = mark_brief + 1
      end
      if marked ~= expect then
        mark_bad[#mark_bad + 1] = string.format("%s 码=%s 注释=%s 期望%s", c.text, c.raw_code,
          c.comment, expect and "带标记" or "不带标记")
      end
    end
  end
end
check(string.format("一简标记判定（%d 字，其中一简 %d）", mark_checked, mark_brief),
  #mark_bad == 0 and mark_brief > 0, table.concat(mark_bad, " / "))

-- 9. 数据守卫：一简码恒等于全码首码。
--    「 一简」标在首根之后，读者会把它读成「首码可单打」；若哪天数据里
--    一简与首码脱钩，这个读法就成了假话，必须先在这里炸掉。
local off_brief, brief_total, seen = {}, 0, {}
for _, initial in ipairs({ "a", "b", "c", "d", "e", "f", "g", "h", "j", "k", "l", "m", "n",
  "o", "p", "q", "r", "s", "t", "w", "x", "y", "z" }) do
  local ok, shard = pcall(real_require, "yoyo/data.reverse_" .. initial)
  if ok and type(shard) == "table" then
    for _, cands in pairs(shard) do
      for _, c in ipairs(cands) do
        if utf8.len(c[1]) == 1 and #c[2] == 1 and not seen[c[1]] then
          seen[c[1]] = true
          brief_total = brief_total + 1
          local full = full_codes[c[1]]
          if not full or full:sub(1, 1) ~= c[2] then
            off_brief[#off_brief + 1] = c[1] .. " 一简=" .. c[2] .. " 全码=" .. tostring(full)
          end
        end
      end
    end
  end
end
check(string.format("一简码 == 全码首码（%d 个一简字）", brief_total),
  #off_brief == 0 and brief_total > 0, table.concat(off_brief, " / "))

require = real_require
print(string.format("\n通过 %d，失败 %d", passed, failed))
os.exit(failed == 0 and 0 or 1)
