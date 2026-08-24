#!/usr/bin/env python3
"""纯形状态机 Lua 单元测试 runner。
运行纯形顶功处理器 pure_popping.lua 的全部单元测试。
"""

import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
TEST_LUA_SCRIPT = SCRIPTS_DIR / "run_pure_popping_tests.lua"

LUA_TEST_RUNNER = """
package.path = package.path .. ";rime/lua/?.lua;rime/lua/?/init.lua;lua/?.lua"

local yoyo = require "yoyo.yoyo"
local pure_popping = require "yoyo.pure_popping"
local pure_words = require "yoyo.data.pure_words_set"

-- 简单的测试辅助函数
local tests_passed = 0
local tests_total = 0

local function assert_eq(actual, expected, msg)
  tests_total = tests_total + 1
  if actual == expected then
    tests_passed = tests_passed + 1
  else
    error(string.format("FAILED: %s (expected '%s', got '%s')", msg or "", tostring(expected), tostring(actual)))
  end
end

-- Mock Dict
local mock_dict = {
  ["_d"] = {"的"},
  ["+e"] = {"有"},
  ["_e"] = {"在"},
  ["iG"] = {"打"},
  ["rT"] = {"类"},
  ["rTah"] = {"类似"},
  ["IS"] = {"空间"},
  ["ISoY"] = {"空格"},
  ["sl"] = {"了"},
  ["cb"] = {"不"},
  ["bX"] = {"鸣"},
  ["bX_n"] = {"鸣"},
  ["_;"] = {"感觉", "成"},
}

-- Mock Context
local MockContext = {}
MockContext.__index = MockContext

function MockContext.new()
  return setmetatable({input = "", options = {}, committed = {}, menu_candidates = {}}, MockContext)
end
function MockContext:get_option(opt) return self.options[opt] or false end
function MockContext:set_option(opt, val) self.options[opt] = val end
function MockContext:has_menu() return #self.menu_candidates > 0 end
function MockContext:update_menu() self.menu_candidates = mock_dict[self.input] or {} end
function MockContext:confirm_current_selection()
  if self:has_menu() then self.selected = self.menu_candidates[1] end
end
function MockContext:commit()
  if self.selected then table.insert(self.committed, self.selected); self.selected = nil
  elseif self.input ~= "" then table.insert(self.committed, self.input) end
  self.input = ""
  self.menu_candidates = {}
end
function MockContext:clear() self.input = ""; self.menu_candidates = {}; self.selected = nil end
function MockContext:pop_input(n) self.input = self.input:sub(1, #self.input - n); self:update_menu() end
function MockContext:push_input(s) self.input = self.input .. s; self:update_menu() end

local function create_env(ctx)
  local env = {
    engine = { context = ctx, commit_text = function(self, t) table.insert(ctx.committed, t) end },
    processing = false
  }
  pure_popping.init(env)
  return env
end

local function make_key(code_val)
  local keycode = type(code_val) == "string" and utf8.codepoint(code_val) or code_val
  return {
    keycode = keycode,
    release = function() return false end,
    alt = function() return false end,
    ctrl = function() return false end,
    caps = function() return false end,
    shift = function() return false end,
  }
end

local function simulate_stroke(ctx, env, key_str, chord_output)
  local key = make_key(key_str)
  if chord_output and chord_output ~= "" then
    ctx:push_input(chord_output)
  end
  pure_popping.func(key, env)
end

print("🧪 开始运行 pure_popping.lua 单元测试套件...")

-- Test 1: 一简输入随下一击顶屏
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  simulate_stroke(ctx, env, "d", "_d")
  simulate_stroke(ctx, env, "e", "_e")
  assert_eq(#ctx.committed, 1, "T1: committed count")
  assert_eq(ctx.committed[1], "的", "T1: committed text")
  assert_eq(ctx.input, "_e", "T1: input _e")
  print("✓ Test 1 Passed: 一简输入随下一击顶屏正常")
end

-- Test 2: 两码字接一简 (打 + 有)
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  simulate_stroke(ctx, env, "i", "iG")
  simulate_stroke(ctx, env, "i", "+e")
  assert_eq(#ctx.committed, 1, "T2: '打' committed immediately")
  assert_eq(ctx.committed[1], "打", "T2: text '打'")
  assert_eq(ctx.input, "+e", "T2: input '+e'")
  print("✓ Test 2 Passed: 两码字接一简 (打+有 0延时立即顶屏)")
end

-- Test 3: 3 码单字 (鸣)
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  simulate_stroke(ctx, env, "b", "bX")
  simulate_stroke(ctx, env, "c", "_n")
  assert_eq(#ctx.committed, 0, "T3: no commit during 3-code single char")
  assert_eq(ctx.input, "bX_n", "T3: input bX_n")
  
  -- 下一击到来顶出鸣
  simulate_stroke(ctx, env, "t", "_t")
  assert_eq(#ctx.committed, 1, "T3: committed count after next stroke")
  assert_eq(ctx.committed[1], "鸣", "T3: committed '鸣'")
  assert_eq(ctx.input, "_t", "T3: input '_t'")
  print("✓ Test 3 Passed: 3 码单字随下一击顶屏正常")
end

-- Test 4: 4 码词语 (类似 & 空格)
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  simulate_stroke(ctx, env, "r", "rT")
  simulate_stroke(ctx, env, "a", "ah")
  assert_eq(#ctx.committed, 0, "T4: no premature commit for '类似'")
  assert_eq(ctx.input, "rTah", "T4: input 'rTah'")
  print("✓ Test 4 Passed: 4 码词语 (类似) 完整保留无误拆")
end

-- Test 5: 4 码非词回退 (了 + 不)
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  simulate_stroke(ctx, env, "s", "sl")
  simulate_stroke(ctx, env, "c", "cb")
  assert_eq(#ctx.committed, 1, "T5: '了' committed")
  assert_eq(ctx.committed[1], "了", "T5: text '了'")
  assert_eq(ctx.input, "cb", "T5: input 'cb'")
  print("✓ Test 5 Passed: 4 码未命中自动切分回退正常")
end

-- Test 6: 次选键放行
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  simulate_stroke(ctx, env, "a", "_;")
  local kp2_key = make_key(0xffb2)
  local res = pure_popping.func(kp2_key, env)
  assert_eq(res, yoyo.kNoop, "T6: return kNoop on KP_2")
  assert_eq(#ctx.committed, 0, "T6: no popping on KP_2")
  assert_eq(ctx.input, "_;", "T6: input preserved for selector")
  print("✓ Test 6 Passed: 次选键 KP_2 放行正常")
end

-- Test 7: 标点并击编码绕过
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  simulate_stroke(ctx, env, "k", "eLk")
  assert_eq(#ctx.committed, 0, "T7: no premature popping during punctuation")
  print("✓ Test 7 Passed: 标点并击安全绕过正常")
end

print(string.format("\\n🎉 全部 %d/%d 个 Lua 状态机单元测试顺利通过！", tests_passed, tests_total))
"""

def run_tests():
    TEST_LUA_SCRIPT.write_text(LUA_TEST_RUNNER, encoding="utf-8")
    try:
        res = subprocess.run(["lua", str(TEST_LUA_SCRIPT)], capture_output=True, text=True)
        print(res.stdout)
        if res.returncode != 0:
            print(res.stderr, file=sys.stderr)
            return False
        return True
    finally:
        if TEST_LUA_SCRIPT.exists():
            TEST_LUA_SCRIPT.unlink()

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
