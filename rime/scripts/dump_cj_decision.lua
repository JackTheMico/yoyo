-- #52 测试辅助：加载 cj_decision.lua 并以 TSV 输出，供 test_cj_decision_data.py 对账。
-- 用法：lua rime/scripts/dump_cj_decision.lua <path-to-cj_decision.lua>
--
-- 之所以独立成文件而不是用 `lua -e`：`lua -e chunk file` 会把 file 也当脚本再跑一遍，
-- 且 `-e` 块里的 `...` 取不到后续参数。

local path = arg[1]
if not path then
  io.stderr:write("usage: lua dump_cj_decision.lua <path>\n")
  os.exit(2)
end

local t0 = os.clock()
local M = dofile(path)
local load_ms = (os.clock() - t0) * 1000

local buf = {}
local function emit(fmt, ...)
  buf[#buf + 1] = string.format(fmt, ...)
end

for code, v in pairs(M.unit2) do emit("u2\t%s\t%s\t%d\n", code, v[1], v[2]) end
if M.split2 then
  for code, v in pairs(M.split2) do emit("s2\t%s\t%s\t%s\n", code, v[1], v[2]) end
end
for code, v in pairs(M.char3) do emit("c3\t%s\t%s\t%d\n", code, v[1], v[2]) end
for code, t in pairs(M.word4) do emit("w4\t%s\t%s\n", code, t) end
for code in pairs(M.prefix3) do emit("p3\t%s\n", code) end
for code in pairs(M.start) do emit("st\t%s\n", code) end
emit("meta\tload_ms\t%.2f\n", load_ms)

io.write(table.concat(buf))
