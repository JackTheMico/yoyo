#!/usr/bin/env python3
"""验证 pure_popping (Pre) 与 pure_popping_post (Post) 双阶段状态机流水线。

测试用例：
1. 一简顶屏：'d' (的) + 'e' (在) -> '的' 上屏，输入框保留 '+e' (在)
2. 两码字接一简 (打+有)：'iG' (打) + 'i' (+e 有) -> '打' 立即上屏，输入框保留 '+e' (有) [0 延时，无需第3字！]
3. 四码词 (类似)：'rT' (类) + 'ah' (类似) -> 输入框展示 '类似' [无拆分错误！]
4. 四码非词回退 (了+不)：'sl' (了) + 'cb' (不) -> '了' 立即上屏，输入框保留 'cb' (不)
5. 次选键 (' / KP_2)：'af' (_; 感觉/成) + ' (KP_2) -> 选中 '成'
"""

import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
TEST_LUA = SCRIPTS_DIR / "run_pipeline_test.lua"

LUA_CODE = """
package.path = package.path .. ";rime/lua/?.lua;rime/lua/?/init.lua;lua/?.lua"

local yoyo = require "yoyo.yoyo"
local pure_popping = require "yoyo.pure_popping"

-- Mock Dict
local mock_dict = {
  ["_d"] = {"的"},
  ["+e"] = {"有"},
  ["_e"] = {"在"},
  ["iG"] = {"打"},
  ["rT"] = {"类"},
  ["rTah"] = {"类似"},
  ["sl"] = {"了"},
  ["cb"] = {"不"},
  ["bXn"] = {"鸣"},
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

-- 模拟 Pipeline 执行一击
local function pipeline_stroke(ctx, env, key_str, chord_output)
  -- 1. Pre-processor (pure_popping)
  local key = make_key(key_str)
  local pre_res = pure_popping.func(key, env)
  
  -- 2. chord_composer 产生输出推入 context
  if chord_output and chord_output ~= "" then
    ctx:push_input(chord_output)
  end
  
  -- 3. Post-processor (pure_popping.post_func)
  local post_res = pure_popping.post_func(key, env)
end

print("🧪 开始运行纯形流水线双阶段测试...")

-- Test 1: 一简顶屏
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  
  pipeline_stroke(ctx, env, "d", "_d")
  assert(ctx.input == "_d", "Stroke 1: input should be _d")
  assert(#ctx.committed == 0, "Stroke 1: no commit yet")
  
  pipeline_stroke(ctx, env, "e", "_e")
  assert(#ctx.committed == 1 and ctx.committed[1] == "的", "Stroke 2: '的' should be committed!")
  assert(ctx.input == "_e", "Stroke 2: input should be _e (在)")
  print("✓ Test 1 Passed: 一简顶屏 (的 + 在 -> 顶出'的'，留'_e')")
end

-- Test 2: 两码字接一简 (打 + 有) 0 延时切分
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  
  pipeline_stroke(ctx, env, "i", "iG")
  assert(ctx.input == "iG", "Stroke 1: input should be iG")
  assert(#ctx.committed == 0, "Stroke 1: no commit yet")
  
  -- 打 'i' (有)，chord_composer 产出 '+e'
  pipeline_stroke(ctx, env, "i", "+e")
  assert(#ctx.committed == 1 and ctx.committed[1] == "打", "Stroke 2: '打' must be immediately committed without 3rd char!")
  assert(ctx.input == "+e", "Stroke 2: input must be '+e' (有), got: " .. ctx.input)
  print("✓ Test 2 Passed: 两码字接一简 (打 + 有 -> 立即顶出'打'，留'+e'出'有')")
end

-- Test 3: 四码词 (类似) 完整匹配无误切
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  
  pipeline_stroke(ctx, env, "r", "rT")
  assert(ctx.input == "rT", "Stroke 1: input should be rT")
  
  pipeline_stroke(ctx, env, "a", "ah")
  assert(#ctx.committed == 0, "Stroke 2: '类似' is valid word, should NOT commit prematurely!")
  assert(ctx.input == "rTah", "Stroke 2: input should be rTah")
  assert(ctx.menu_candidates[1] == "类似", "Stroke 2: candidate should be '类似'")
  print("✓ Test 3 Passed: 四码词 (类似 -> 'rT' + 'ah' -> 'rTah' 出 '类似')")
end

-- Test 4: 四码非词 (了 + 不) 自动切分
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  
  pipeline_stroke(ctx, env, "s", "sl")
  pipeline_stroke(ctx, env, "c", "cb")
  assert(#ctx.committed == 1 and ctx.committed[1] == "了", "Stroke 2: '了' must be committed!")
  assert(ctx.input == "cb", "Stroke 2: input should be 'cb' (不)")
  print("✓ Test 4 Passed: 四码非词 (了 + 不 -> 立即顶出'了'，留'cb'出'不')")
end

-- Test 5: 次选键 (' / KP_2)
do
  local ctx = MockContext.new()
  local env = create_env(ctx)
  
  pipeline_stroke(ctx, env, "a", "_;")
  assert(ctx.input == "_;", "Stroke 1: input should be _;")
  assert(ctx.menu_candidates[1] == "感觉" and ctx.menu_candidates[2] == "成", "Candidates correct")
  
  -- 按 ' 触发 KP_2 选次选
  local kp2_key = make_key(0xffb2)
  local res = pure_popping.func(kp2_key, env)
  assert(res == yoyo.kNoop, "KP_2 must return kNoop")
  assert(#ctx.committed == 0, "KP_2 must NOT trigger popping!")
  print("✓ Test 5 Passed: 次选键 KP_2 放行正常")
end

print("\\n🎉 全部 5 项流水线测试 100% 顺利通过！")
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
