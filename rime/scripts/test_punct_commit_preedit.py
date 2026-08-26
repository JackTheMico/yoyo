#!/usr/bin/env python3
"""
复现与回归测试：验证标点并击是否正确顶出缓冲区中挂起的字词 (test_punct_commit_preedit.py)
"""

import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
TEST_LUA = SCRIPTS_DIR / "_tmp_test_punct_popping.lua"

LUA_CODE = r"""
package.path = package.path .. ";rime/lua/?.lua;rime/lua/?/init.lua;lua/?.lua"

local yoyo = require "yoyo.yoyo"
local km_punct = require "yoyo.km_punct"
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
  km_punct.init(env)
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

-- 模拟处理器链：km_punct -> pure_popping -> speller (push)
local function sim(env, ctx, incoming)
  local key = make_key(incoming)
  local res1 = km_punct.func(key, env)
  if res1 == yoyo.kAccepted then
    return res1
  end
  local res2 = pure_popping.func(key, env)
  if res2 == yoyo.kNoop then
    ctx:push_input(incoming)
  end
  return res2
end

local function inject_token(env, ctx, token)
  for i = 1, #token do
    local ch = token:sub(i, i)
    sim(env, ctx, ch)
  end
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

print("\n🧪 标点顶屏前置挂起字词单元测试\n")

-- T1: 一简 _d (的) + 标点 ~comma (，)
-- 期望：先顶出 '的'，再顶出 '，'，committed={"的", "，"}
print("T1: 一简 _d'的' + 标点 ~comma'，'")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "_"); sim(env, ctx, "d")
  check("_d in input", ctx.input == "_d", ctx.input, "_d")
  check("nothing committed yet", #ctx.committed == 0, #ctx.committed, 0)

  inject_token(env, ctx, "~comma")
  check("total 2 committed", #ctx.committed == 2, #ctx.committed, 2)
  check("word '的' committed 1st", ctx.committed[1] == "的", ctx.committed[1], "的")
  check("punct '，' committed 2nd", ctx.committed[2] == "，", ctx.committed[2], "，")
  check("input cleared", ctx.input == "", ctx.input, "")
end

-- T2: 两码字 sl (了) + 标点 ~period (。)
-- 期望：先顶出 '了'，再顶出 '。'，committed={"了", "。"}
print("\nT2: 两码字 sl'了' + 标点 ~period'。'")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "s"); sim(env, ctx, "l")
  check("sl in input", ctx.input == "sl", ctx.input, "sl")

  inject_token(env, ctx, "~period")
  check("total 2 committed", #ctx.committed == 2, #ctx.committed, 2)
  check("word '了' committed 1st", ctx.committed[1] == "了", ctx.committed[1], "了")
  check("punct '。' committed 2nd", ctx.committed[2] == "。", ctx.committed[2], "。")
  check("input cleared", ctx.input == "", ctx.input, "")
end

-- T3: 3码单字 bX_n (鸣) + 标点 ~comma (，)
-- 期望：先顶出 '鸣'，再顶出 '，'，committed={"鸣", "，"}
print("\nT3: 3码单字 bX_n'鸣' + 标点 ~comma'，'")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "b"); sim(env, ctx, "X"); sim(env, ctx, "_"); sim(env, ctx, "n")
  check("bX_n in input", ctx.input == "bX_n", ctx.input, "bX_n")

  inject_token(env, ctx, "~comma")
  check("total 2 committed", #ctx.committed == 2, #ctx.committed, 2)
  check("word '鸣' committed 1st", ctx.committed[1] == "鸣", ctx.committed[1], "鸣")
  check("punct '，' committed 2nd", ctx.committed[2] == "，", ctx.committed[2], "，")
  check("input cleared", ctx.input == "", ctx.input, "")
end

-- T4: 4码词语 xkhr (可以) + 标点 ~comma (，)
-- 期望：先顶出 '可以'，再顶出 '，'，committed={"可以", "，"}
print("\nT4: 4码词语 xkhr'可以' + 标点 ~comma'，'")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  sim(env, ctx, "x"); sim(env, ctx, "k"); sim(env, ctx, "h"); sim(env, ctx, "r")
  check("xkhr in input", ctx.input == "xkhr", ctx.input, "xkhr")

  inject_token(env, ctx, "~comma")
  check("total 2 committed", #ctx.committed == 2, #ctx.committed, 2)
  check("word '可以' committed 1st", ctx.committed[1] == "可以", ctx.committed[1], "可以")
  check("punct '，' committed 2nd", ctx.committed[2] == "，", ctx.committed[2], "，")
  check("input cleared", ctx.input == "", ctx.input, "")
end

-- T5: 纯标点连续输入 ~comma + ~period
print("\nT5: 纯标点输入 ~comma + ~period")
do
  local ctx = MockContext.new(); local env = make_env(ctx)
  inject_token(env, ctx, "~comma")
  check("comma committed", ctx.committed[1] == "，", ctx.committed[1], "，")
  inject_token(env, ctx, "~period")
  check("period committed", ctx.committed[2] == "。", ctx.committed[2], "。")
  check("total 2 committed", #ctx.committed == 2, #ctx.committed, 2)
  check("input cleared", ctx.input == "", ctx.input, "")
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
