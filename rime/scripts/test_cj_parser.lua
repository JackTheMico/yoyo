-- 串击解析器的全量属性测试（issue #53）
--
-- 与 tools/probe 的真引擎用例分工：
--   probe  验「引擎里能不能出字」（schema、speller、lua 加载、上屏时序）
--   本脚本 验「规则在全部 11 万个码位上是否自洽」（不需要引擎，秒级）
--
-- 用法：lua rime/scripts/test_cj_parser.lua

package.path = "rime/lua/?.lua;" .. package.path

local parser = require "yoyo.cj_parser"
local data = require "yoyo.data.cj_decision"

local fails = 0
local checks = 0

local function check(name, cond, detail)
  checks = checks + 1
  if cond then
    print("  ok   " .. name)
  else
    fails = fails + 1
    print("  FAIL " .. name .. (detail and ("  " .. detail) or ""))
  end
end

local function join(t)
  return table.concat(t, ",")
end

-- ── A. 码元表与 schema 一致性 ────────────────────────────────────────────
print("\n[A] 码元表")
local seen, n = {}, 0
for ch in parser.ALPHABET:gmatch(".") do
  n = n + 1
  seen[ch] = true
end
check("alphabet 长度 60", n == 60, "实际 " .. n)
local uniq = 0
for _ in pairs(seen) do uniq = uniq + 1 end
check("alphabet 无重复", uniq == 60, "唯一 " .. uniq)

-- ── B. 逐码位验证判定规则 ────────────────────────────────────────────────
print("\n[B] 判定规则（全量逐码位）")

local bad = { word4 = 0, char3_free = 0, char3_gated = 0, unit2_free = 0, unit2_gated = 0 }
local cnt = { word4 = 0, char3_free = 0, char3_gated = 0, unit2_free = 0, unit2_gated = 0 }
local first_bad = {}

local function note(kind, code, got, want)
  if not first_bad[kind] then
    first_bad[kind] = string.format("首个: %s 实际{%s} 期望{%s}", code, got, want)
  end
end

-- 4 码词：第 4 键必须自动上屏
for code, text in pairs(data.word4) do
  cnt.word4 = cnt.word4 + 1
  local texts, rest = parser.resolve_all(code)
  if #texts ~= 1 or texts[1] ~= text or rest ~= "" then
    bad.word4 = bad.word4 + 1
    note("word4", code, join(texts) .. "|rest=" .. rest, text)
  end
end

-- 3 码：非 4 码词前缀 → 立即上屏；是前缀 → 等待
for code, v in pairs(data.char3) do
  local texts, rest = parser.resolve_all(code)
  if data.prefix3[code] then
    cnt.char3_gated = cnt.char3_gated + 1
    if #texts ~= 0 or rest ~= code then
      bad.char3_gated = bad.char3_gated + 1
      note("char3_gated", code, join(texts), "{}")
    end
  else
    cnt.char3_free = cnt.char3_free + 1
    if #texts ~= 1 or texts[1] ~= v[1] then
      bad.char3_free = bad.char3_free + 1
      note("char3_free", code, join(texts), v[1])
    end
  end
end

-- 2 码：无更长码 → 立即上屏；有更长码 → 等待
for code, v in pairs(data.unit2) do
  local texts = parser.resolve_all(code)
  if data.longer2[code] then
    cnt.unit2_gated = cnt.unit2_gated + 1
    if #texts ~= 0 then
      bad.unit2_gated = bad.unit2_gated + 1
      note("unit2_gated", code, join(texts), "{}")
    end
  else
    cnt.unit2_free = cnt.unit2_free + 1
    if #texts ~= 1 or texts[1] ~= v[1] then
      bad.unit2_free = bad.unit2_free + 1
      note("unit2_free", code, join(texts), v[1])
    end
  end
end

check("4 码词 " .. cnt.word4 .. " 个：第 4 键全部自动上屏", bad.word4 == 0,
  first_bad.word4)
check("3 码非前缀 " .. cnt.char3_free .. " 个：第 3 键全部自动上屏", bad.char3_free == 0,
  first_bad.char3_free)
check("3 码为 4 码词前缀 " .. cnt.char3_gated .. " 个：全部等待", bad.char3_gated == 0,
  first_bad.char3_gated)
check("2 码无更长码 " .. cnt.unit2_free .. " 个：第 2 键全部自动上屏", bad.unit2_free == 0,
  first_bad.unit2_free)
check("2 码有更长码 " .. cnt.unit2_gated .. " 个：全部等待", bad.unit2_gated == 0,
  first_bad.unit2_gated)
print(string.format("       2 码中「无更长码」仅 %d / %d = %.2f%%",
  cnt.unit2_free, cnt.unit2_free + cnt.unit2_gated,
  cnt.unit2_free / (cnt.unit2_free + cnt.unit2_gated) * 100))

-- ── C. 空格定界必须能打出每一个码 ─────────────────────────────────────────
-- 2 码位的期望文本按「主单视图」算（#55）：字词共存的位置优先单字，
-- 而 unit2 存的是权重最大的那条，两者可能不同（如 zv 权重最大的是词）。
print("\n[C] 空格定界")
local function cf_text(code)
  return parser.unit2_text(code, parser.VIEW_CF)
end
local bad_force = 0
local fb = nil
for code, v in pairs(data.unit2) do
  local t = parser.force_resolve(code)
  if #t ~= 1 or t[1] ~= cf_text(code) then
    bad_force = bad_force + 1
    fb = fb or ("2码 " .. code)
  end
end
for code, v in pairs(data.char3) do
  local t = parser.force_resolve(code)
  if #t ~= 1 or t[1] ~= v[1] then
    bad_force = bad_force + 1
    fb = fb or ("3码 " .. code)
  end
end
for code, text in pairs(data.word4) do
  local t = parser.force_resolve(code)
  if #t ~= 1 or t[1] ~= text then
    bad_force = bad_force + 1
    fb = fb or ("4码 " .. code)
  end
end
check("全部 2/3/4 码位都能被空格正确打出", bad_force == 0, fb)

-- ── D. 死缓冲判定 ────────────────────────────────────────────────────────
print("\n[D] 死缓冲")
local ok_unit = true
for ch in parser.ALPHABET:gmatch(".") do
  if not parser.is_prefix(ch) then ok_unit = false end
end
check("60 个码元都是合法起始", ok_unit)
check("lk 是死缓冲", parser.is_prefix("lk") == false,
  "unit2=" .. tostring(data.unit2.lk) .. " longer2=" .. tostring(data.longer2.lk))
check("sl 是合法前缀", parser.is_prefix("sl") == true)

-- ── E. 确定性 ────────────────────────────────────────────────────────────
print("\n[E] 确定性")
local sample_codes = {}
local c = 0
for code in pairs(data.word4) do
  c = c + 1
  if c % 97 == 0 then sample_codes[#sample_codes + 1] = code end
  if c > 20000 then break end
end
local nondet = 0
for _, code in ipairs(sample_codes) do
  local a = parser.resolve_all(code)
  local b = parser.resolve_all(code)
  if join(a) ~= join(b) then nondet = nondet + 1 end
end
check("resolve_all 是纯函数（抽样 " .. #sample_codes .. " 个码位）", nondet == 0)

-- ── F. 协议级模拟：逐条意图按「没出字就按空格」的规则打字 ────────────────
print("\n[F] 协议级模拟（每条意图独立，含空格定界）")
local function type_once(code, expected)
  local buf = ""
  local out = {}
  for ch in code:gmatch(".") do
    buf = buf .. ch
    local texts, rest = parser.resolve_all(buf)
    for _, t in ipairs(texts) do out[#out + 1] = t end
    buf = rest
  end
  if #out == 0 and buf ~= "" then
    local t = parser.force_resolve(buf)
    for _, v in ipairs(t) do out[#out + 1] = v end
  end
  return join(out) == expected
end

local total, good = 0, 0
local errs = {}
local step = 11
for code, v in pairs(data.unit2) do
  total = total + 1
  if type_once(code, cf_text(code)) then good = good + 1
  elseif #errs < 3 then errs[#errs + 1] = "2码 " .. code end
end
for code, v in pairs(data.char3) do
  total = total + 1
  if type_once(code, v[1]) then good = good + 1
  elseif #errs < 3 then errs[#errs + 1] = "3码 " .. code end
end
local cw = 0
for code, text in pairs(data.word4) do
  cw = cw + 1
  if cw % step == 0 then
    total = total + 1
    if type_once(code, text) then good = good + 1
    elseif #errs < 3 then errs[#errs + 1] = "4码 " .. code end
  end
end
check(string.format("协议级正确率 %.2f%%（%d / %d）", good / total * 100, good, total),
  good == total, table.concat(errs, ", "))

-- ── G. 主单/主词视图与次选（#55）────────────────────────────────────────
print("\n[G] 主单 / 主词 / 次选")
local n_split = 0
local bad_cf, bad_wf, bad_sec_cf, bad_sec_wf = 0, 0, 0, 0
for code, pair in pairs(data.split2) do
  n_split = n_split + 1
  if parser.unit2_text(code, parser.VIEW_CF) ~= pair[1] then bad_cf = bad_cf + 1 end
  if parser.unit2_text(code, parser.VIEW_WF) ~= pair[2] then bad_wf = bad_wf + 1 end
  if parser.second2(code, parser.VIEW_CF) ~= pair[2] then bad_sec_cf = bad_sec_cf + 1 end
  if parser.second2(code, parser.VIEW_WF) ~= pair[1] then bad_sec_wf = bad_sec_wf + 1 end
end
check("字词共存的 2 码位 " .. n_split .. " 个：主单视图全部取单字", bad_cf == 0,
  tostring(bad_cf))
check("同上：主词视图全部取词", bad_wf == 0, tostring(bad_wf))
check("同上：主单视图次选 = 词", bad_sec_cf == 0, tostring(bad_sec_cf))
check("同上：主词视图次选 = 单字", bad_sec_wf == 0, tostring(bad_sec_wf))

local bad_fallback, no_second_total = 0, 0
for code in pairs(data.unit2) do
  if not data.split2[code] then
    no_second_total = no_second_total + 1
    -- 单一类别：两视图相同，且没有次选（不凭空造字）
    if parser.unit2_text(code, parser.VIEW_CF) ~= parser.unit2_text(code, parser.VIEW_WF)
        or parser.second2(code, parser.VIEW_CF) ~= nil
        or parser.second2(code, parser.VIEW_WF) ~= nil then
      bad_fallback = bad_fallback + 1
    end
  end
end
check("单一类别 2 码位 " .. no_second_total .. " 个：两视图相同且无次选", bad_fallback == 0,
  tostring(bad_fallback))

-- 空格定界也要遵守视图：zv 在主单出单字、主词出词
local z_v_cf = parser.force_resolve("zv", parser.VIEW_CF)
local z_v_wf = parser.force_resolve("zv", parser.VIEW_WF)
if data.split2.zv then
  check("空格定界遵守主单视图（zv）", z_v_cf[1] == data.split2.zv[1],
    tostring(z_v_cf[1]))
  check("空格定界遵守主词视图（zv）", z_v_wf[1] == data.split2.zv[2],
    tostring(z_v_wf[1]))
end

-- ── 汇总 ─────────────────────────────────────────────────────────────────
print()
if fails > 0 then
  print(string.format("---- %d / %d 项失败 ----", fails, checks))
  os.exit(1)
end
print(string.format("---- %d 项全部通过 ----", checks))
