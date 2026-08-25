#!/usr/bin/env python3
"""
真实时序单元测试：模拟 chord_composer 逐字符注入后 pure_popping 的行为。

关键约束（来自 librime chord_composer.cc 源码）：
  - chord_composer::FinishChord() 调用 engine->ProcessKey() 逐字符重新注入
  - 每个字符走完整处理器链：pure_popping → ... → speller
  - pure_popping 收到第 N 个字符时，context.input 只含前 N-1 个字符

测试方法：
  simulate_char(env, ctx, incoming):
    1. pure_popping.func(key=incoming) 被调用（input 还没有 incoming）
    2. speller 紧接着 push_input(incoming)（pure_popping 返回 kNoop 时）
"""

import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
TEST_LUA = SCRIPTS_DIR / "_tmp_test_pure_realistic.lua"

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

-- 模拟真实时序：pure_popping 先看，speller 再 push
local function sim(env, ctx, incoming)
  pure_popping.func(make_key(incoming), env)
  ctx:push_input(incoming)  -- speller 总是 push（pure_popping 返回 kNoop）
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

print("\n🧪 真实时序 pure_popping 单元测试（chord_composer 逐字符注入）\n")

-- T1: 一简接一简（_d + +e）
-- pure_popping 收到 incoming='+' 时 input='_d' → 顶屏
print("T1: 一简接一简 _d\"的\" + +e\"有\"")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "_"); sim(env, ctx, "d")
  -- input='_d', committed=0
  check("_d: input", ctx.input == "_d", ctx.input, "_d")
  check("_d: no commit", #ctx.committed == 0, #ctx.committed, 0)

  -- 接下一简 '+e'：先发 '+'
  -- pure_popping 在收到 '+' 时 input='_d' → Pattern: 一简 + 一简前缀 → 顶屏 _d，kNoop
  -- speller push '+' → input='+'
  sim(env, ctx, "+")
  check("recv +: '的' committed", ctx.committed[1] == "的", ctx.committed[1], "的")
  check("recv +: input='+'", ctx.input == "+", ctx.input, "+")

  sim(env, ctx, "e")  -- input before='+', speller push → '+e'
  check("recv e: input='+e'", ctx.input == "+e", ctx.input, "+e")
  check("recv e: still 1 committed", #ctx.committed == 1, #ctx.committed, 1)
end

-- T2: 两码字接一简（iG + +e）
-- 收到 '+' 时 input='iG' → kNoop（等下一字符）
-- 收到 'e' 时 input='iG+' → 顶屏 iG，restore '+', kNoop → speller push 'e' → '+e'
print("\nT2: 两码字接一简 iG\"打\" + +e\"有\"")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "i"); sim(env, ctx, "G")
  check("iG: input", ctx.input == "iG", ctx.input, "iG")
  check("iG: no commit", #ctx.committed == 0, #ctx.committed, 0)

  sim(env, ctx, "+")  -- input before='iG', incoming='+'
  -- pure_popping: 两码 + '+' 前缀，等下一字符，kNoop
  -- speller push '+' → 'iG+'
  check("recv +: no commit yet", #ctx.committed == 0, #ctx.committed, 0)
  check("recv +: input='iG+'", ctx.input == "iG+", ctx.input, "iG+")

  sim(env, ctx, "e")  -- input before='iG+', incoming='e'
  -- pure_popping: iG+ + e → chars_3code['iGe'] = nil → 顶屏 iG, clear, push '+', kNoop
  -- speller push 'e' → '+e'
  check("recv e: '打' committed", ctx.committed[1] == "打", ctx.committed[1], "打")
  check("recv e: input='+e'", ctx.input == "+e", ctx.input, "+e")
end

-- T3: 两码字+3码字第3码（bX + _n → bX_n "鸣"，不误顶）
print("\nT3: bX_n\"鸣\" 不误顶")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "b"); sim(env, ctx, "X")
  sim(env, ctx, "_")  -- input before='bX', incoming='_' → 两码后接前缀，kNoop → input='bX_'
  check("bX_: no commit", #ctx.committed == 0, #ctx.committed, 0)
  check("bX_: input='bX_'", ctx.input == "bX_", ctx.input, "bX_")

  sim(env, ctx, "n")  -- input before='bX_', incoming='n' → chars_3code['bXn']=true → kNoop
  check("bX_n: no commit (是3码字)", #ctx.committed == 0, #ctx.committed, 0)
  check("bX_n: input='bX_n'", ctx.input == "bX_n", ctx.input, "bX_n")
end

-- T4: 4码词 rTah "类似" 不误切分
print("\nT4: 4码词 rTah\"类似\" 不误切分")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "r"); sim(env, ctx, "T"); sim(env, ctx, "a")
  sim(env, ctx, "h")  -- input before='rTa', incoming='h' → words_4code['rTah']=true → kNoop
  check("rTah: no commit", #ctx.committed == 0, #ctx.committed, 0)
  check("rTah: input='rTah'", ctx.input == "rTah", ctx.input, "rTah")
end

-- T5: 4码词 ISoY "空格" 不出"空间格"
print("\nT5: ISoY\"空格\" 不出\"空间格\"")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "I"); sim(env, ctx, "S"); sim(env, ctx, "o")
  sim(env, ctx, "Y")  -- words_4code['ISoY']=true → kNoop
  check("ISoY: no commit", #ctx.committed == 0, #ctx.committed, 0)
  check("ISoY: input='ISoY'", ctx.input == "ISoY", ctx.input, "ISoY")
end

-- T6: 4码非词 slcb → 顶出 sl"了"，留 cb"不"
-- 收到 'b' 时 input='slc' → words_4code['slcb']=nil → 顶出 sl, push 'c', kNoop → speller push 'b' → 'cb'
print("\nT6: 4码非词 slcb → 顶出sl\"了\"，留cb\"不\"")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "s"); sim(env, ctx, "l"); sim(env, ctx, "c")
  check("slc: no commit", #ctx.committed == 0, #ctx.committed, 0)

  sim(env, ctx, "b")  -- input before='slc', incoming='b' → words_4code['slcb']=nil
  check("recv b: '了' committed", ctx.committed[1] == "了", ctx.committed[1], "了")
  check("recv b: input='cb'", ctx.input == "cb", ctx.input, "cb")
end

-- T7: 4码词接下一字 → 顶出词
-- rTah + i → 顶出 rTah"类似"
print("\nT7: 4码词 rTah 接下一字 i → 顶出\"类似\"")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "r"); sim(env, ctx, "T"); sim(env, ctx, "a"); sim(env, ctx, "h")

  sim(env, ctx, "i")  -- input before='rTah', incoming='i'
  -- rTah 是4码词，下一击来了 → 顶屏：commit rTah, clear, kNoop → speller push 'i' → 'i'
  check("recv i: '类似' committed", ctx.committed[1] == "类似", ctx.committed[1], "类似")
  check("recv i: input='i'", ctx.input == "i", ctx.input, "i")
end

-- T8: 3码字接下一字 → 顶出3码字
-- bX_n + i → 顶出 bX_n"鸣"
print("\nT8: 3码字 bX_n 接下一字 i → 顶出\"鸣\"")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "b"); sim(env, ctx, "X"); sim(env, ctx, "_"); sim(env, ctx, "n")

  sim(env, ctx, "i")  -- input before='bX_n', incoming='i' → 顶出3码字
  local got = ctx.committed[1]
  check("recv i: '鸣' committed", got == "鸣", got, "鸣")
  check("recv i: input='i'", ctx.input == "i", ctx.input, "i")
end

-- T9: 次选键 KP_2 不顶屏
print("\nT9: 次选键 KP_2 不顶屏")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "a"); sim(env, ctx, ";")
  local kp2 = { keycode=0xffb2, release=function() return false end,
    alt=function() return false end, ctrl=function() return false end,
    caps=function() return false end, shift=function() return false end }
  pure_popping.func(kp2, env)
  check("KP_2: no commit", #ctx.committed == 0, #ctx.committed, 0)
  check("KP_2: input='a;'", ctx.input == "a;", ctx.input, "a;")
end

-- T10: 你好 aLZF —— 4码词不切分
print("\nT10: 你好 aLZF 完整4码词不切分")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "a"); sim(env, ctx, "L"); sim(env, ctx, "Z")
  sim(env, ctx, "F")  -- words_4code['aLZF']=true → kNoop
  check("aLZF: no commit", #ctx.committed == 0, #ctx.committed, 0)
  check("aLZF: input='aLZF'", ctx.input == "aLZF", ctx.input, "aLZF")
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
