-- 扩展简词（前置单引号）pure_popping 状态机测试 (test_brief_words.lua)
-- 用法：lua5.4 test_brief_words.lua
--
-- 直接加载真实的 pure_popping.lua 与 pure_dict_map.lua，用 stub 的
-- engine/context/key_event 驱动状态机，验证：
--   1. 简词完整流程：' → '_ → '_w → 接下一键顶出简词
--   2. 中间态放行（ilen<3 不误触发）
--   3. 未定义简词位 → 清空死缓冲、不上屏
--   4. 回归：次选拦截（' 同按语义）不受影响
--   5. 回归：Pattern A 一简顶屏不受影响

local SCRIPTS_DIR = (arg and arg[0] and arg[0]:match("(.*/)")) or "./"
package.path = SCRIPTS_DIR .. "../lua/?.lua;" .. package.path

local yoyo = require "yoyo.yoyo"
local pure_popping = require "yoyo.pure_popping"
local pure_data = require "yoyo.data.pure_dict_map"

local passed, failed = 0, 0
local function check(name, cond, detail)
  if cond then
    passed = passed + 1
    print(("  ✓ %s"):format(name))
  else
    failed = failed + 1
    print(("  ✗ %s  %s"):format(name, detail or ""))
  end
end

-- ── stubs ────────────────────────────────────────────────────────────
local function make_env()
  local commits = {}
  local cleared = 0
  local ctx
  ctx = {
    input = "",
    get_option = function(_, name) return false end,
    clear = function(_) ctx.input = ""; cleared = cleared + 1 end,
    push_input = function(_, s) ctx.input = ctx.input .. s end,
  }
  local engine = {
    context = ctx,
    commit_text = function(_, text) table.insert(commits, text) end,
  }
  local env = { engine = engine, context = ctx, processing = false }
  return env, ctx, commits, function() return cleared end
end

local function key(char)
  local kc = string.byte(char)
  return {
    keycode = kc,
    alt = function() return false end,
    ctrl = function() return false end,
    caps = function() return false end,
  }
end

-- 模拟完整击键序列：每字符先过状态机，kNoop 则由 speller push 进 input
local function feed(env, ctx, seq)
  for i = 1, #seq do
    local ch = seq:sub(i, i)
    local r = pure_popping.func(key(ch), env)
    if r == yoyo.kNoop then
      ctx.input = ctx.input .. ch
    end
  end
end

print("==================================================")
print("🧪 前置单引号扩展简词 — pure_popping 状态机测试")
print("==================================================")

-- 1. 简词完整流程（数据驱动：取 brief_map 里任一 '_X 形条目）
local sample_left, sample_right, sample_chord
for code, text in pairs(pure_data.brief_map or {}) do
  if #code == 3 then
    if code:sub(2, 2) == "_" and not sample_left then sample_left = { code, text } end
    if code:sub(2, 2) == "+" and not sample_right then sample_right = { code, text } end
    if code:sub(2, 2) ~= "_" and code:sub(2, 2) ~= "+" and not sample_chord then
      sample_chord = { code, text }
    end
  end
end

do
  local env, ctx, commits = make_env()
  pure_popping.init(env)
  feed(env, ctx, "'")          -- 点按 ' → input="'"
  check("点 ' 入缓冲", ctx.input == "'", "input=" .. ctx.input)
  feed(env, ctx, sample_left[1]:sub(2, 2))
  check("中间态放行(2)", ctx.input == sample_left[1]:sub(1, 2), "input=" .. ctx.input)
  feed(env, ctx, sample_left[1]:sub(3, 3))
  check("中间态放行(3)", ctx.input == sample_left[1], "input=" .. ctx.input)
  local r = pure_popping.func(key("b"), env)
  check("完整简词接下一键 kNoop", r == yoyo.kNoop, "r=" .. tostring(r))
  check("顶出简词", commits[1] == sample_left[2], "commit=" .. tostring(commits[1]))
  check("缓冲已清空", ctx.input == "", "input=" .. ctx.input)
end

-- 2. 右手一击与并击简词
do
  local env, ctx, commits = make_env()
  pure_popping.init(env)
  feed(env, ctx, sample_right[1])
  pure_popping.func(key("b"), env)
  check("右手简词 " .. sample_right[1] .. " 顶出", commits[1] == sample_right[2],
        "commit=" .. tostring(commits[1]))
end
do
  local env, ctx, commits = make_env()
  pure_popping.init(env)
  feed(env, ctx, sample_chord[1])
  pure_popping.func(key("_"), env)
  check("并击简词 " .. sample_chord[1] .. " 顶出", commits[1] == sample_chord[2],
        "commit=" .. tostring(commits[1]))
end

-- 3. 未定义简词位 → 清空死缓冲，不上屏（取一个不在 brief_map 的 3 长度 ' 码）
do
  local env, ctx, commits = make_env()
  pure_popping.init(env)
  local undefined
  local charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ;:,<.>/?"
  for i = 1, #charset do
    for j = 1, #charset do
      local cand = "'" .. charset:sub(i, i) .. charset:sub(j, j)
      if not pure_data.brief_map[cand] then undefined = cand break end
    end
    if undefined then break end
  end
  assert(undefined, "找不到未定义简词位")
  feed(env, ctx, undefined)
  check("中间态未误触发", #commits == 0 and ctx.input == undefined,
        ("input=%s commits=%s"):format(ctx.input, table.concat(commits, ",")))
  local r = pure_popping.func(key("b"), env)
  check("未定义简词位 kNoop", r == yoyo.kNoop)
  check("未定义简词位不上屏", #commits == 0, "commits=" .. table.concat(commits, ","))
  check("死缓冲已清空", ctx.input == "", "input=" .. ctx.input)
end

-- 4. 回归：次选拦截（' 与键同按 → 注入序列 _ w '，最后一步 incoming='）
do
  local env, ctx, commits = make_env()
  pure_popping.init(env)
  feed(env, ctx, "_w")
  local expect2 = pure_data.dict_map_2["_w"] or pure_data.dict_map_2["w"]
  local r = pure_popping.func(key("'"), env)
  check("次选拦截保留: kAccepted", r == yoyo.kAccepted, "r=" .. tostring(r))
  check("次选上屏内容一致", commits[1] == expect2,
        ("commit=%s expect=%s"):format(tostring(commits[1]), tostring(expect2)))
end

-- 5. 回归：Pattern A 一简顶屏
do
  local env, ctx, commits = make_env()
  pure_popping.init(env)
  feed(env, ctx, "_w")
  local expect1 = pure_data.dict_map["_w"] or pure_data.dict_map["w"]
  pure_popping.func(key("b"), env)
  check("一简顶屏保留", commits[1] == expect1,
        ("commit=%s expect=%s"):format(tostring(commits[1]), tostring(expect1)))
end

-- 6. brief_map 数据完整性
do
  local bm = pure_data.brief_map or {}
  local n = 0
  for _ in pairs(bm) do n = n + 1 end
  check("brief_map 非空（≥900 条）", n >= 900, "n=" .. tostring(n))
  check("样例条目在位", bm[sample_left[1]] ~= nil and bm[sample_right[1]] ~= nil
        and bm[sample_chord[1]] ~= nil)
  check("dict_map 未被 ' 码污染",
        (pure_data.dict_map["'_a"] == nil) and (pure_data.dict_map["'a"] == nil))
end

print(("==================================================\n%s: %d 通过, %d 失败\n"):format(
  failed == 0 and "🎉 全部通过" or "❌ 存在失败", passed, failed))
os.exit(failed == 0 and 0 or 1)
