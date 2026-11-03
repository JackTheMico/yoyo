#!/usr/bin/env python3
"""候选词过滤器 (priority_filter.lua) 单元测试。

直通模式：过滤器不再按单字/词组分类重排，候选按翻译器原始权重顺序原样输出。
验证场景：
1. 混合字/词候选列表保持原始顺序不变（如 ["简单", "简"] -> ["简单", "简"]）
2. 纯单字候选列表保持原序
3. 纯词组候选列表保持原序
"""

import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
TEST_LUA = SCRIPTS_DIR / "_tmp_test_priority_filter.lua"

LUA_CODE = r"""
package.path = package.path .. ";rime/lua/?.lua;rime/lua/?/init.lua;lua/?.lua"

local priority_filter = require "yoyo.priority_filter"

local MockCandidate = {}
MockCandidate.__index = MockCandidate
function MockCandidate.new(text)
  return setmetatable({ text = text }, MockCandidate)
end

local function make_input_iter(texts)
  local cands = {}
  for _, t in ipairs(texts) do
    table.insert(cands, MockCandidate.new(t))
  end
  local i = 0
  return {
    iter = function(self)
      return function()
        i = i + 1
        return cands[i]
      end
    end
  }
end

local function run_filter(texts)
  local input = make_input_iter(texts)
  local env = { engine = { context = {} } }
  if priority_filter.init then priority_filter.init(env) end

  local results = {}
  local co = coroutine.create(function()
    priority_filter.func(input, env)
  end)

  while coroutine.status(co) ~= "dead" do
    local ok, res = coroutine.resume(co)
    if ok and res and res.text then
      table.insert(results, res.text)
    end
  end

  return results
end

local PASS, FAIL = 0, 0
local function check(name, got, exp)
  local match = (#got == #exp)
  if match then
    for i = 1, #got do
      if got[i] ~= exp[i] then match = false; break end
    end
  end
  if match then
    PASS = PASS + 1
    io.write("  ✓ " .. name .. "\n")
  else
    FAIL = FAIL + 1
    io.write(string.format("  ✗ %s (got=[%s] want=[%s])\n", name, table.concat(got, ", "), table.concat(exp, ", ")))
  end
end

print("\n🧪 开始执行 priority_filter 直通单元测试\n")

-- 直通：不做字/词重排，保持原始权重顺序
print("1. 混合字/词保持原始顺序（权重序）")
check("简单/简 -> 简单/简", run_filter({"简单", "简"}), {"简单", "简"})
check("没有/没 -> 没有/没", run_filter({"没有", "没"}), {"没有", "没"})
check("所有/幞 -> 所有/幞", run_filter({"所有", "幞"}), {"所有", "幞"})

print("\n2. 纯单字与纯词组顺序不变")
check("纯单字 ['甲', '乙', '丙']", run_filter({"甲", "乙", "丙"}), {"甲", "乙", "丙"})
check("纯词组 ['可以', '类似', '我们']", run_filter({"可以", "类似", "我们"}), {"可以", "类似", "我们"})

print(string.format("\n%s %d/%d 通过\n", FAIL==0 and "🎉" or "💥", PASS, PASS+FAIL))
if FAIL > 0 then os.exit(1) end
"""

def run():
    TEST_LUA.write_text(LUA_CODE, encoding="utf-8")
    try:
        res = subprocess.run(["lua", str(TEST_LUA)], capture_output=True, text=True)
        print(res.stdout)
        if res.returncode != 0:
            print(res.stderr, file=sys.stderr)
        return res.returncode == 0
    finally:
        if TEST_LUA.exists():
            TEST_LUA.unlink()

if __name__ == "__main__":
    sys.exit(0 if run() else 1)
