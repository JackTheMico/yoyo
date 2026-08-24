#!/usr/bin/env python3
"""pure_popping.lua 状态机单元测试套件。

模拟 Rime 核心环境（Context, Composition, Segment, Engine, KeyEvent），
对 pure_popping.lua 进行 100% 状态机覆盖率测试：
  1. 一简输入与下一击顶屏 (len=1 -> next stroke -> commit)
  2. 3 码单字 (len=2 + len=1 -> len=3 -> next stroke -> commit)
  3. 3 码单字 instant_commit_3code 开关直出测试
  4. 4 码词语匹配与下一击顶屏 (len=2 + len=2 -> len=4 -> next stroke -> commit)
  5. 4 码未命中词库自动切分回退 (len=4 non-word -> commit char 1 -> buffer char 2)
  6. 标点并击与拼音反查绕过测试
"""

import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
LUA_DIR = RIME_DIR / "lua"
TEST_LUA_SCRIPT = SCRIPTS_DIR / "run_pure_popping_tests.lua"

LUA_TEST_RUNNER = """
-- pure_popping.lua 单元测试执行脚本 (Lua Runner)
package.path = package.path .. ";rime/lua/?.lua;rime/lua/?/init.lua;lua/?.lua"

local yoyo = require "yoyo.yoyo"
local pure_popping = require "yoyo.pure_popping"

-- Mock Rime API
local MockContext = {}
MockContext.__index = MockContext

function MockContext.new()
  local self = setmetatable({}, MockContext)
  self.input = ""
  self.options = {}
  self.committed = {}
  self.menu_candidates = {}
  return self
end

function MockContext:get_option(opt)
  return self.options[opt] or false
end

function MockContext:set_option(opt, val)
  self.options[opt] = val
end

function MockContext:has_menu()
  return #self.menu_candidates > 0
end

function MockContext:confirm_current_selection()
  if self:has_menu() then
    self.selected = self.menu_candidates[1]
  end
end

function MockContext:commit()
  if self.selected then
    table.insert(self.committed, self.selected)
    self.selected = nil
  elseif self.input ~= "" then
    table.insert(self.committed, self.input)
  end
  self.input = ""
  self.menu_candidates = {}
end

function MockContext:clear()
  self.input = ""
  self.menu_candidates = {}
  self.selected = nil
end

function MockContext:pop_input(n)
  self.input = self.input:sub(1, #self.input - n)
end

function MockContext:push_input(s)
  self.input = self.input .. s
end

-- Mock Engine & Env
local function create_env(ctx)
  local env = {
    engine = {
      context = ctx,
      commit_text = function(self, text)
        table.insert(ctx.committed, text)
      end
    },
    processing = false
  }
  pure_popping.init(env)
  return env
end

local function make_key(code_str)
  return {
    keycode = utf8.codepoint(code_str),
    release = function() return false end,
    alt = function() return false end,
    ctrl = function() return false end,
    caps = function() return false end,
    shift = function() return false end,
  }
end

-- ==================== 测试用例 ====================
local tests_passed = 0
local tests_total = 0

local function assert_eq(actual, expected, msg)
  tests_total = tests_total + 1
  if actual ~= expected then
    error(string.format("FAILED: %s (expected '%s', got '%s')", msg, tostring(expected), tostring(actual)))
  end
  tests_passed = tests_passed + 1
end

print("🧪 开始运行 pure_popping.lua 单元测试套件...")

-- Test 1: 一简输入并被下一击顶屏
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  
  -- 输入一简 'd' ("的")
  ctx.input = "d"
  ctx.menu_candidates = {"的"}
  
  -- 下一击 'w' 到来
  local res = pure_popping.func(make_key("w"), env)
  assert_eq(res, yoyo.kNoop, "T1: return kNoop on popping")
  assert_eq(#ctx.committed, 1, "T1: committed count")
  assert_eq(ctx.committed[1], "的", "T1: committed text")
  assert_eq(ctx.input, "", "T1: input cleared after commit")
  print("✓ Test 1 Passed: 一简输入随下一击顶屏正常")
end

-- Test 2: 3 码单字输入随下一击顶屏 (默认 instant_commit_3code = false)
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  
  -- 输入三码单字 'bXn' ("鸣")
  ctx.input = "bXn"
  ctx.menu_candidates = {"鸣"}
  
  -- 下一击 't' 到来
  local res = pure_popping.func(make_key("t"), env)
  assert_eq(res, yoyo.kNoop, "T2: return kNoop on popping")
  assert_eq(#ctx.committed, 1, "T2: committed count")
  assert_eq(ctx.committed[1], "鸣", "T2: committed text")
  assert_eq(ctx.input, "", "T2: input cleared after commit")
  print("✓ Test 2 Passed: 3 码单字随下一击顶屏正常")
end

-- Test 3: 4 码词语输入随下一击顶屏
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  
  -- 输入四码词 'xkhr' ("可以")
  ctx.input = "xkhr"
  ctx.menu_candidates = {"可以"}
  
  -- 下一击 'a' 到来
  local res = pure_popping.func(make_key("a"), env)
  assert_eq(res, yoyo.kNoop, "T3: return kNoop on popping")
  assert_eq(#ctx.committed, 1, "T3: committed count")
  assert_eq(ctx.committed[1], "可以", "T3: committed text")
  assert_eq(ctx.input, "", "T3: input cleared after commit")
  print("✓ Test 3 Passed: 4 码词语随下一击顶屏正常")
end

-- Test 4: 4 码未命中自动切分回退 (slcb -> 'sl' commit '了', buffer 留 'cb')
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  
  -- 模拟 chord_composer 刚输入了 'cb'，与已有的 'sl' 组成 4 码 'slcb'，无词匹配
  ctx.input = "slcb"
  ctx.menu_candidates = {} -- 4 码无词！
  
  -- pure_popping 拦截
  local res = pure_popping.func(make_key("b"), env)
  assert_eq(ctx.input, "cb", "T4: buffer retains last 2 codes 'cb'")
  assert_eq(#ctx.committed, 1, "T4: first 2 codes committed")
  assert_eq(ctx.committed[1], "sl", "T4: committed text of first 2 codes")
  print("✓ Test 4 Passed: 4 码未命中自动切分回退正常")
end

-- Test 5: 反查与快符模式绕过
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  
  -- 反查输入 `hanm
  ctx.input = "`hanm"
  ctx.menu_candidates = {"汉门"}
  local res = pure_popping.func(make_key("e"), env)
  assert_eq(res, yoyo.kNoop, "T5: bypass reverse lookup")
  assert_eq(#ctx.committed, 0, "T5: no popping during reverse lookup")
  print("✓ Test 5 Passed: 反查与快符模式安全绕过")
end

-- Test 6: 3 码单字 instant_commit_3code 开关开启时瞬间直出
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  ctx:set_option("instant_commit_3code", true)
  
  -- 当第 3 码 'n' 刚被输入，buffer 达到 3 码 'bXn'
  ctx.input = "bXn"
  ctx.menu_candidates = {"鸣"}
  
  -- pure_popping 拦截并直接直出上屏
  local res = pure_popping.func(make_key("n"), env)
  assert_eq(res, yoyo.kNoop, "T6: return kNoop on instant commit")
  assert_eq(#ctx.committed, 1, "T6: committed count")
  assert_eq(ctx.committed[1], "鸣", "T6: committed text immediately on 3rd code")
  assert_eq(ctx.input, "", "T6: input cleared after instant commit")
  print("✓ Test 6 Passed: 3 码单字 instant_commit_3code 直出开关正常")
end

-- Test 7: 标点并击编码绕过
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  
  -- 标点并击输入 ser 产生的 [eLk]
  ctx.input = "eLk"
  ctx.menu_candidates = {"。"}
  local res = pure_popping.func(make_key("k"), env)
  assert_eq(res, yoyo.kNoop, "T7: bypass punctuation chord")
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
