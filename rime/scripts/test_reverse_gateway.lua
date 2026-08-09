-- 反查门卫（reverse_input processor）与分段器（reverse_segmentor）单测
-- 用法: lua5.4 rime/scripts/test_reverse_gateway.lua

local root = arg[0]:match("^(.*)[/\\][^/\\]*$")
package.path = root .. "/../lua/?.lua;" .. package.path

local input_processor = require "yoyo.reverse_input"
local segmentor = require "yoyo.reverse_segmentor"
local yoyo = require "yoyo.yoyo"

local ok = true
local passed = 0
local function check(cond, msg)
  if cond then
    passed = passed + 1
  else
    ok = false
    print("FAIL: " .. msg)
  end
end

-- ---- stub librime 全局 ----
local out
_G.yield = function(s)
  out[#out + 1] = s
end
_G.Segment = function(s, e)
  return {
    start = s,
    _end = e,
    tags = {},
    has_tag = function(self, t)
      return self.tags[t] == true
    end,
  }
end

-- ---- stub Context ----
local function make_context(init_input)
  return {
    input = init_input or "",
    push_input = function(self, s)
      self.input = self.input .. s
    end,
    pop_input = function(self, n)
      self.input = self.input:sub(1, #self.input - n)
    end,
  }
end

-- ---- stub KeyEvent ----
local function make_key(keycode, opts)
  opts = opts or {}
  return {
    keycode = keycode,
    release = function() return opts.release or false end,
    alt = function() return opts.alt or false end,
    ctrl = function() return opts.ctrl or false end,
    caps = function() return opts.caps or false end,
    shift = function() return opts.shift or false end,
  }
end

-- ---- stub Env ----
local function make_env(init_input)
  return {
    engine = {
      schema = { config = { get_map = function() return nil end } },
      context = make_context(init_input),
    },
  }
end

-- ---- reverse_input: init ----
local env = make_env()
input_processor.init(env)
check(env.reverse_input.prefix == "`", "init 默认 prefix=`")

-- 1. 非反查模式放行
local env1 = make_env("")
check(input_processor.func(make_key(0x61), env1) == yoyo.kNoop, "非反查按 a 应 kNoop(2)")
check(env1.engine.context.input == "", "非反查 input 不变")

-- 2. 反查 a-z 直入 input
local env2 = make_env("`")
local r = input_processor.func(make_key(0x61), env2) -- a
check(r == yoyo.kAccepted, "反查按 a 应 kAccepted(1)")
local r2 = input_processor.func(make_key(0x6e), env2) -- n
check(env2.engine.context.input == "`an", "反查连续输入应直入 input, 实际 " .. env2.engine.context.input)

-- 3. BackSpace 逐字符删
local r3 = input_processor.func(make_key(0xff08), env2)
check(r3 == yoyo.kAccepted and env2.engine.context.input == "`a", "反查 BackSpace 应删 1 字符, 实际 " .. env2.engine.context.input)

-- 4. BackSpace 删空退出反查
local r4 = input_processor.func(make_key(0xff08), env2)
check(r4 == yoyo.kAccepted and env2.engine.context.input == "`", "删到只剩前缀键, 实际 " .. env2.engine.context.input)

-- 5. 数字吞掉
local env5 = make_env("`han")
local r5 = input_processor.func(make_key(0x31), env5)
check(r5 == yoyo.kAccepted and env5.engine.context.input == "`han", "数字应吞掉不污染 input")

-- 5b. 前缀键 ` 进 input（speller initials 不含 `，必须由本处理器接管）
local env5b = make_env("")
local r5b = input_processor.func(make_key(0x60), env5b)
check(r5b == yoyo.kAccepted and env5b.engine.context.input == "`",
  "前缀键应推入 input, 实际 '" .. env5b.engine.context.input .. "'")
-- 5c. 已在反查模式时重复前缀键吞掉
local r5c = input_processor.func(make_key(0x60), env5b)
check(r5c == yoyo.kAccepted and env5b.engine.context.input == "`",
  "反查模式下重复前缀键应吞掉, 实际 '" .. env5b.engine.context.input .. "'")

-- 6. 空格吞掉
local r6 = input_processor.func(make_key(0x20), env5)
check(r6 == yoyo.kAccepted and env5.engine.context.input == "`han", "空格应吞掉不污染 input")

-- 7. Escape/Enter 放行
check(input_processor.func(make_key(0xff1b), env5) == yoyo.kNoop, "Escape 应放行")
check(input_processor.func(make_key(0xff0d), env5) == yoyo.kNoop, "Enter 应放行")

-- 8. 修饰键/释放事件放行
check(input_processor.func(make_key(0x61, { release = true }), env5) == yoyo.kNoop, "release 事件放行")
check(input_processor.func(make_key(0x61, { ctrl = true }), env5) == yoyo.kNoop, "ctrl 组合放行")
check(input_processor.func(make_key(0x61, { shift = true }), env5) == yoyo.kNoop, "shift 组合放行")

-- ---- reverse_segmentor（真实签名 func(segmentation, env)，返回段列表） ----
local senv = { reverse_segmentor = { prefix = "`" } }
local segs = segmentor.func({ input = "`han" }, senv)
check(#segs == 1 and segs[1]:has_tag("reverse") and segs[1].start == 0 and segs[1]._end == 4,
  "反查 input 应产出整段 reverse 段, 实际 " .. #segs .. " 段")

local segs2 = segmentor.func({ input = "han" }, senv)
check(#segs2 == 0, "非反查 input 不产出段")

local segs3 = segmentor.func({ input = "`" }, senv)
check(#segs3 == 1 and segs3[1]:has_tag("reverse"), "仅前缀键也建 reverse 段")

print(("通过 %d 项断言"):format(passed))
if ok then
  print("ALL PASS")
  os.exit(0)
else
  print("SOME FAIL")
  os.exit(1)
end
