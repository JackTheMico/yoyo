#!/usr/bin/env python3
"""次选并击直出与状态机时序单元测试 (test_pure_popping_secondary.py)。

测试接缝：pure_popping 状态机对单引号次选修饰的处理
验证场景：
1. 并击 e' -> 产出 _e + incoming=''' -> 瞬间直出 "真的"，input 立即清空，0 延迟
2. 并击 w' -> 产出 _w + incoming=''' -> 瞬间直出 "时间"，input 立即清空
3. 并击 d' -> 产出 _d + incoming=''' -> 瞬间直出 "其他"，input 立即清空
4. 并击 i' -> 产出 +e + incoming=''' -> 瞬间直出 "推荐"，input 立即清空
5. 单击 e (首选) + 下一击 d -> 顶出 "在"，input 留 "_d"
6. 串击 e 弹出菜单后按 KP_2 / ' -> 选出 "真的"
7. 连续并击次选：e' + w' -> 依次直接直出 "真的" 和 "时间"
"""

import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
TEST_LUA = SCRIPTS_DIR / "_tmp_test_popping_secondary.lua"

LUA_CODE = r"""
package.path = package.path .. ";rime/lua/?.lua;rime/lua/?/init.lua;lua/?.lua"

local yoyo = require "yoyo.yoyo"
local pure_popping = require "yoyo.pure_popping"
local pure_data = require "yoyo.data.pure_dict_map"

local MockContext = {}
MockContext.__index = MockContext
function MockContext.new()
  return setmetatable({ input="", options={}, committed={} }, MockContext)
end
function MockContext:get_option(opt) return self.options[opt] or false end
function MockContext:has_menu()
  return pure_data.dict_map[self.input] ~= nil
end
function MockContext:pop_input(n) self.input = self.input:sub(1, #self.input - n) end
function MockContext:push_input(s) self.input = self.input .. s end
function MockContext:clear() self.input = "" end

local function make_env(ctx)
  local env = {
    engine = {
      context = ctx,
      commit_text = function(self, t) table.insert(ctx.committed, t) end
    },
    processing = false
  }
  pure_popping.init(env)
  return env
end

local function make_key(c)
  local kc = (type(c)=="number") and c or utf8.codepoint(c)
  return {
    keycode=kc,
    release=function() return false end,
    alt=function() return false end,
    ctrl=function() return false end,
    caps=function() return false end,
    shift=function() return false end,
  }
end

-- 模拟真实时序：pure_popping 先处理 key，若返回 kNoop 则 speller push
local function sim(env, ctx, incoming)
  local res = pure_popping.func(make_key(incoming), env)
  if res == yoyo.kNoop then
    ctx:push_input(incoming)
  end
  return res
end

local PASS, FAIL = 0, 0
local function check(name, cond, got, exp)
  if cond then
    PASS = PASS + 1
    io.write("  ✓ " .. name .. "\n")
  else
    FAIL = FAIL + 1
    io.write("  ✗ " .. name .. " (got=" .. tostring(got) .. " want=" .. tostring(exp) .. ")\n")
  end
end

print("\n🧪 开始运行次选瞬间直出 (Instant Commit) 状态机单元测试\n")

-- T1: 并击 e' 瞬间直出 "真的"
print("T1: 并击 e' -> 瞬间直出 '真的'")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "_")
  sim(env, ctx, "e")
  check("before ': input='_e'", ctx.input == "_e", ctx.input, "_e")
  check("before ': committed=0", #ctx.committed == 0, #ctx.committed, 0)

  local res = sim(env, ctx, "'")
  check("recv ': returned kAccepted", res == yoyo.kAccepted, res, yoyo.kAccepted)
  check("recv ': '真的' committed", ctx.committed[1] == "真的", ctx.committed[1], "真的")
  check("recv ': input is cleared", ctx.input == "", ctx.input, "")
end

-- T2: 并击 w' 瞬间直出 "时间"
print("\nT2: 并击 w' -> 瞬间直出 '时间'")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "_")
  sim(env, ctx, "w")
  local res = sim(env, ctx, "'")
  check("recv ': returned kAccepted", res == yoyo.kAccepted, res, yoyo.kAccepted)
  check("recv ': '时间' committed", ctx.committed[1] == "时间", ctx.committed[1], "时间")
  check("recv ': input is cleared", ctx.input == "", ctx.input, "")
end

-- T3: 并击 i' 瞬间直出 "有点" (右手 i 镜像为码元 +e)
print("\nT3: 并击 i' -> 瞬间直出 '有点'")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "+")
  sim(env, ctx, "e")
  local res = sim(env, ctx, "'")
  check("recv ': returned kAccepted", res == yoyo.kAccepted, res, yoyo.kAccepted)
  check("recv ': '有点' committed", ctx.committed[1] == "有点", ctx.committed[1], "有点")
  check("recv ': input is cleared", ctx.input == "", ctx.input, "")
end

-- T4: 连续并击次选 e' + w'
print("\nT4: 连续并击次选 e' + w' -> 依次直出 '真的' '时间'")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  -- 击第1个: e'
  sim(env, ctx, "_"); sim(env, ctx, "e"); sim(env, ctx, "'")
  check("1st: '真的' committed", ctx.committed[1] == "真的", ctx.committed[1], "真的")
  check("1st: input empty", ctx.input == "", ctx.input, "")
  -- 击第2个: w'
  sim(env, ctx, "_"); sim(env, ctx, "w"); sim(env, ctx, "'")
  check("2nd: '时间' committed", ctx.committed[2] == "时间", ctx.committed[2], "时间")
  check("2nd: input empty", ctx.input == "", ctx.input, "")
  check("total committed 2", #ctx.committed == 2, #ctx.committed, 2)
end

-- T5: 单击 e 首选 "在" 随下一击顶屏不退化
print("\nT5: 单击 e 首选 '在' 随下一击顶屏")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "_"); sim(env, ctx, "e")
  check("input='_e'", ctx.input == "_e", ctx.input, "_e")
  check("no commit yet", #ctx.committed == 0, #ctx.committed, 0)
  -- 下一击到来
  sim(env, ctx, "_"); sim(env, ctx, "d")
  check("'在' committed on next stroke", ctx.committed[1] == "在", ctx.committed[1], "在")
  check("input='_d'", ctx.input == "_d", ctx.input, "_d")
end

-- T6: 主单模式下按 n 出单字 "没"，并击 n' 直出 "没有"
print("\nT6: 主单模式下按 n' -> 直出 '没有'，单按 n -> 顶出 '没'")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  -- 次选直出
  sim(env, ctx, "_"); sim(env, ctx, "n"); sim(env, ctx, "'")
  check("n': '没有' committed", ctx.committed[1] == "没有", ctx.committed[1], "没有")
  check("n': input empty", ctx.input == "", ctx.input, "")

  -- 首选顶屏
  sim(env, ctx, "_"); sim(env, ctx, "n")
  sim(env, ctx, "_"); sim(env, ctx, "d")
  check("n + d: '没' committed", ctx.committed[2] == "没", ctx.committed[2], "没")
end

-- T7: 主单模式下按 cI 出单字 "简"，并击 cI' 直出 "简单"
print("\nT7: 主单模式下 cI' -> 直出 '简单'，cI + d -> 顶出 '简'")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  -- 次选直出
  sim(env, ctx, "c"); sim(env, ctx, "I"); sim(env, ctx, "'")
  check("cI': '简单' committed", ctx.committed[1] == "简单", ctx.committed[1], "简单")
  check("cI': input empty", ctx.input == "", ctx.input, "")

  -- 首选顶屏
  sim(env, ctx, "c"); sim(env, ctx, "I")
  sim(env, ctx, "_"); sim(env, ctx, "d")
  check("cI + d: '简' committed", ctx.committed[2] == "简", ctx.committed[2], "简")
end

-- T8: 主词模式 (word_priority=true) 下 e' -> 直出单字 '在'，e -> 顶出词组 '真的'
print("\nT8: 主词模式下 e' -> 直出单字 '在'，e + d -> 顶出词组 '真的'")
do
  local ctx = MockContext.new(); ctx.options["word_priority"] = true; local env = make_env(ctx)
  -- 次选直出
  sim(env, ctx, "_"); sim(env, ctx, "e"); sim(env, ctx, "'")
  check("word_priority e': '在' committed", ctx.committed[1] == "在", ctx.committed[1], "在")
  check("word_priority e': input empty", ctx.input == "", ctx.input, "")

  -- 首选顶屏
  sim(env, ctx, "_"); sim(env, ctx, "e")
  sim(env, ctx, "_"); sim(env, ctx, "d")
  check("word_priority e + d: '真的' committed", ctx.committed[2] == "真的", ctx.committed[2], "真的")
end

-- T9: 主词模式 (word_priority=true) 下 n' -> 直出单字 '没'，n -> 顶出词组 '没有'
print("\nT9: 主词模式下 n' -> 直出单字 '没'，n + d -> 顶出词组 '没有'")
do
  local ctx = MockContext.new(); ctx.options["word_priority"] = true; local env = make_env(ctx)
  -- 次选直出
  sim(env, ctx, "_"); sim(env, ctx, "n"); sim(env, ctx, "'")
  check("word_priority n': '没' committed", ctx.committed[1] == "没", ctx.committed[1], "没")
  check("word_priority n': input empty", ctx.input == "", ctx.input, "")

  -- 首选顶屏
  sim(env, ctx, "_"); sim(env, ctx, "n")
  sim(env, ctx, "_"); sim(env, ctx, "d")
  check("word_priority n + d: '没有' committed", ctx.committed[2] == "没有", ctx.committed[2], "没有")
end

-- T10: 主词模式 (word_priority=true) 下 cI' -> 直出单字 '简'，cI -> 顶出词组 '简单'
print("\nT10: 主词模式下 cI' -> 直出单字 '简'，cI + d -> 顶出词组 '简单'")
do
  local ctx = MockContext.new(); ctx.options["word_priority"] = true; local env = make_env(ctx)
  -- 次选直出
  sim(env, ctx, "c"); sim(env, ctx, "I"); sim(env, ctx, "'")
  check("word_priority cI': '简' committed", ctx.committed[1] == "简", ctx.committed[1], "简")
  check("word_priority cI': input empty", ctx.input == "", ctx.input, "")

  -- 首选顶屏
  sim(env, ctx, "c"); sim(env, ctx, "I")
  sim(env, ctx, "_"); sim(env, ctx, "d")
  check("word_priority cI + d: '简单' committed", ctx.committed[2] == "简单", ctx.committed[2], "简单")
end

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
