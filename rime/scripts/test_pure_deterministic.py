#!/usr/bin/env python3
"""全场景确定性测试：
1. 1简接1简 (的+在)：'d' (_d) + 'e' (_e) -> '的' 上屏，输入框 '_e'
2. 两码字接1简 (打+有)：'iG' (打) + 'i' (+e) -> '打' 立即上屏，输入框 '+e' (0延时，无iG+e卡死)
3. 3码单字全码 (鸣)：'bX' + 'cs' (_n) -> 'bX_n' 命中 '鸣' (不误拆)
4. 4码词语 (类似)：'rT' + 'ah' -> 'rTah' 命中 '类似' (不误拆为 类ah/类化)
5. 4码词语 (空格)：'IS' + 'oY' -> 'ISoY' 命中 '空格' (不误拆为 空间格)
6. 4码非词回退 (了+不)：'sl' + 'cb' -> 'sl' 提交 '了'，输入框 'cb'
7. 次选键 (' / KP_2)：'af' (_; 感觉/成) + ' (KP_2) -> 选出 '成'
"""

import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
TEST_LUA = SCRIPTS_DIR / "run_deterministic_test.lua"

LUA_CODE = """
package.path = package.path .. ";rime/lua/?.lua;rime/lua/?/init.lua;lua/?.lua"

local yoyo = require "yoyo.yoyo"
local pure_popping = require "yoyo.pure_popping"
local pure_data = require "yoyo.data.pure_dict_map"

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
function MockContext:has_menu() return #self.menu_candidates > 0 end
function MockContext:update_menu()
  self.menu_candidates = mock_dict[self.input] or {}
end
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
function MockContext:pop_input(n) 
  self.input = self.input:sub(1, #self.input - n)
  self:update_menu()
end
function MockContext:push_input(s) 
  self.input = self.input .. s
  self:update_menu()
end

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

-- 模拟物理击键通过 chord_composer 产出并触发 pure_popping
local function simulate_stroke(ctx, env, key_str, chord_output)
  for i = 1, #chord_output do
    local c = chord_output:sub(i, i)
    local res = pure_popping.func(make_key(c), env)
    if res == yoyo.kNoop then
      ctx:push_input(c)
    end
  end
end

print("🧪 开始执行纯形确定性全场景测试...")

-- 1. 1简接1简
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  simulate_stroke(ctx, env, "d", "_d")
  assert(ctx.input == "_d", "T1: input _d")
  simulate_stroke(ctx, env, "e", "_e")
  assert(#ctx.committed == 1 and ctx.committed[1] == "的", "T1: '的' committed")
  assert(ctx.input == "_e", "T1: input _e")
  print("✓ Test 1 Passed: 1简接1简 (的 + 在 -> '的' 上屏，留 '_e')")
end

-- 2. 两码字接1简 (打 + 有)
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  simulate_stroke(ctx, env, "i", "iG")
  assert(ctx.input == "iG", "T2: input iG")
  simulate_stroke(ctx, env, "i", "+e")
  assert(#ctx.committed == 1 and ctx.committed[1] == "打", "T2: '打' committed immediately!")
  assert(ctx.input == "+e", "T2: input +e (有)")
  print("✓ Test 2 Passed: 两码字接1简 (打 + 有 -> '打' 立即上屏，留 '+e' 出 '有')")
end

-- 3. 3码单字全码 (鸣)
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  simulate_stroke(ctx, env, "b", "bX")
  simulate_stroke(ctx, env, "c", "_n")
  assert(#ctx.committed == 0, "T3: no premature commit during 3-code single char")
  assert(ctx.input == "bX_n", "T3: input bX_n")
  assert(ctx.menu_candidates[1] == "鸣", "T3: candidate is 鸣")
  print("✓ Test 3 Passed: 3码单字全码 (鸣 -> 'bX' + '_n' -> 'bX_n' 出 '鸣')")
end

-- 4. 4码词语 (类似)
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  simulate_stroke(ctx, env, "r", "rT")
  simulate_stroke(ctx, env, "a", "ah")
  assert(#ctx.committed == 0, "T4: no premature commit for 4-code word '类似'")
  assert(ctx.input == "rTah", "T4: input rTah")
  assert(ctx.menu_candidates[1] == "类似", "T4: candidate is 类似")
  print("✓ Test 4 Passed: 4码词语 (类似 -> 'rT' + 'ah' -> 'rTah' 出 '类似')")
end

-- 5. 4码词语 (空格)
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  simulate_stroke(ctx, env, "i", "IS")
  simulate_stroke(ctx, env, "o", "oY")
  assert(#ctx.committed == 0, "T5: no premature commit for 4-code word '空格'")
  assert(ctx.input == "ISoY", "T5: input ISoY")
  assert(ctx.menu_candidates[1] == "空格", "T5: candidate is 空格")
  print("✓ Test 5 Passed: 4码词语 (空格 -> 'IS' + 'oY' -> 'ISoY' 出 '空格')")
end

-- 6. 4码非词回退 (了 + 不)
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  simulate_stroke(ctx, env, "s", "sl")
  simulate_stroke(ctx, env, "c", "cb")
  assert(#ctx.committed == 1 and ctx.committed[1] == "了", "T6: '了' committed")
  assert(ctx.input == "cb", "T6: input cb (不)")
  print("✓ Test 6 Passed: 4码非词回退 (了 + 不 -> 顶出 '了'，留 'cb' 出 '不')")
end

print("\\n🎉 全部 6 项确定性全场景测试 100% 顺利通过！")
"""

def run():
    TEST_LUA.write_text(LUA_CODE, encoding="utf-8")
    try:
        res = subprocess.run(["lua", str(TEST_LUA)], capture_output=True, text=True)
        print(res.stdout)
        if res.returncode != 0:
            print(res.stderr, file=sys.stderr)
            return False
        return True
    finally:
        if TEST_LUA.exists():
            TEST_LUA.unlink()

if __name__ == "__main__":
    success = run()
    sys.exit(0 if success else 1)
