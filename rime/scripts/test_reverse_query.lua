-- 拼音反查查询逻辑单测（纯 Lua 运行，无需 librime）
-- 用法: lua5.4 rime/scripts/test_reverse_query.lua
-- 覆盖: 精确查询 / 前缀补全 / 多音字双键 / 空候选 / 上限截断 / 权重降序 /
--       单字全码 / 一简词主码 / 缺片( i/u/v )容错

local root = arg[0]:match("^(.*)[/\\][^/\\]*$")
package.path = root .. "/../lua/?.lua;" .. package.path

local reverse = require "yoyo.reverse"

local ok = true
local passed = 0
local function check(cond, msg)
  if cond then
    passed = passed + 1
  else
    ok = false
    print("FAIL: " .. msg)
  end
end

-- 辅助：找 text 的 code
local function find_code(items, text)
  for _, it in ipairs(items) do
    if it[1] == text then
      return it[2]
    end
  end
  return nil
end

-- 1. 精确查询: 寒梅 → sHqL
local r = reverse.query("h", "hanmei", 10)
check(r and r[1] and r[1][1] == "寒梅", "hanmei 精确查询首条应为寒梅")
check(find_code(r, "寒梅") == "sHqL", "寒梅 编码应为 sHqL")

-- 2. 前缀补全: hanm → 含寒梅
local r2 = reverse.query("h", "hanm", 200)
check(find_code(r2, "寒梅") == "sHqL", "hanm 前缀应命中寒梅")

-- 3. 多音字: 行 在 hang 与 xing 双键
local rh = reverse.query("h", "hang", 100)
local rx = reverse.query("x", "xing", 100)
check(find_code(rh, "行") ~= nil, "hang 键应有行")
check(find_code(rx, "行") ~= nil, "xing 键应有行")

-- 4. 无效拼音: 空候选不崩溃
local rq = reverse.query("q", "qqq", 10)
check(type(rq) == "table" and #rq == 0, "qqq 应为空候选")

-- 5. 上限截断
local rz = reverse.query("z", "zh", 3)
check(#rz == 3, "上限截断: zh 只应返回 3 条, 实际 " .. #rz)

-- 6. 权重降序（精确段 + 前缀段各自降序，段边界允许 1 处逆序）
local rd = reverse.query("d", "de", 100)
local inversions = 0
for i = 2, #rd do
  if rd[i - 1][3] < rd[i][3] then
    inversions = inversions + 1
  end
end
check(inversions <= 1, "de 键候选应大致按权重降序（逆序点 " .. inversions .. " 处）")
check(rd[1][1] == "的", "de 键首条应为 的")

-- 7. 单字全码: 的 → dFrJdD
local rde = reverse.query("d", "de", 100)
check(find_code(rde, "的") == "dFrJdD", "的 应为全码 dFrJdD")

-- 8. 一简词主码: 所以 → bA（只显码元）
local rsy = reverse.query("s", "suoyi", 100)
check(find_code(rsy, "所以") == "bA", "所以 应为 bA")

-- 9. 词库现实: 及其 → 6 码元（12 字符）主码（无短码）
local rjq = reverse.query("j", "jiqi", 100)
local jq = find_code(rjq, "及其")
check(jq ~= nil, "及其 应可反查到")
if jq then
  check(#jq == 12, "及其 主码应为 6 码元(12 字符), 实际 " .. #jq)
end

-- 10. 缺片容错: i/u/v 无合法拼音开头，应返回空表不崩
local ri = reverse.query("i", "ian", 10)
check(type(ri) == "table" and #ri == 0, "i 片应为空")

-- 11. 同 text 跨键去重（前缀查询不重复出现）
local rxh = reverse.query("x", "x", 300)
local counts = {}
for _, it in ipairs(rxh) do
  counts[it[1]] = (counts[it[1]] or 0) + 1
end
local dup = false
for t, c in pairs(counts) do
  if c > 1 then
    dup = true
    print("  (去重提示) x 前缀下重复: " .. t .. " x" .. c)
  end
end
check(not dup, "x 前缀查询不应有同 text 重复候选")

print(("通过 %d 项断言"):format(passed))
if ok then
  print("ALL PASS")
  os.exit(0)
else
  print("SOME FAIL")
  os.exit(1)
end
