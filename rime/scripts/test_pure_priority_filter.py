#!/usr/bin/env python3
"""候选词分类重排过滤器 (priority_filter.lua) 单元测试。

验证场景：
1. 主单模式 (word_priority=false/nil)：
   - 输入候选列表包含单字与词组（如 ["简单", "简"]）-> 重排为 ["简", "简单"]
   - 输入候选列表（如 ["没有", "没"]）-> 重排为 ["没", "没有"]
   - 输入候选列表（如 ["在", "真的"]）-> 保持 ["在", "真的"]
2. 主词模式 (word_priority=true)：
   - 输入候选列表（如 ["在", "真的"]）-> 重排为 ["真的", "在"]
   - 输入候选列表（如 ["简", "简单"]）-> 重排为 ["简单", "简"]
3. 纯单字或纯词组候选列表在两种模式下均保持原有顺序不变。
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

local function run_filter(texts, is_word_priority)
  local input = make_input_iter(texts)
  local env = {
    engine = {
      context = {
        get_option = function(self, opt)
          if opt == "word_priority" then return is_word_priority end
          return false
        end
      }
    }
  }
  if priority_filter.init then priority_filter.init(env) end

  local results = {}
  -- 在测试环境下模拟 yield
  local old_yield = yield
  -- 使用 coroutine 捕获 yield
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

print("\n🧪 开始执行 priority_filter 单元测试\n")

-- 1. 主单模式 (word_priority = false)
print("1. 主单模式 (word_priority = false)")
check("简单/简 -> 简/简单", run_filter({"简单", "简"}, false), {"简", "简单"})
check("没有/没 -> 没/没有", run_filter({"没有", "没"}, false), {"没", "没有"})
check("在/真的 -> 在/真的", run_filter({"在", "真的"}, false), {"在", "真的"})
check("问题/此 -> 此/问题", run_filter({"问题", "此"}, false), {"此", "问题"})

-- 2. 主词模式 (word_priority = true)
print("\n2. 主词模式 (word_priority = true)")
check("在/真的 -> 真的/在", run_filter({"在", "真的"}, true), {"真的", "在"})
check("简/简单 -> 简单/简", run_filter({"简", "简单"}, true), {"简单", "简"})
check("没/没有 -> 没有/没", run_filter({"没", "没有"}, true), {"没有", "没"})
check("此/问题 -> 问题/此", run_filter({"此", "问题"}, true), {"问题", "此"})

-- 3. 纯单字或纯词组保持相对顺序不变
print("\n3. 纯单字与纯词组顺序不变性")
check("纯单字 ['甲', '乙', '丙']", run_filter({"甲", "乙", "丙"}, false), {"甲", "乙", "丙"})
check("纯词组 ['可以', '类似', '我们']", run_filter({"可以", "类似", "我们"}, true), {"可以", "类似", "我们"})

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
