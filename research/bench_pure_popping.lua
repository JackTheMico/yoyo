-- 量化回路：测量 pure_popping 在 ' 次选路径上的单键 CPU 耗时
-- 用桩对象替代 rime 引擎，加载真实 pure_dict_map.lua（8.3MB）
local rime_lua = "/home/jackwy/codes/rime/yoyo/rime/lua"

-- 桩：utf8（LuaJIT 默认无，仅用到 utf8.char 做 ASCII 转换）
utf8 = utf8 or { char = function(c) return string.char(c) end }

-- 桩：yoyo.yoyo
local yoyo = { kNoop = 0, kAccepted = 1 }
function yoyo.current(ctx) return ctx._input end
package.loaded["yoyo.yoyo"] = yoyo

package.path = rime_lua .. "/?.lua;" .. package.path

-- 加载真实数据（顺便测加载耗时）
local t_load0 = os.clock()
local pure_data = require("yoyo.data.pure_dict_map")
local t_load1 = os.clock()
print(string.format("[load] pure_dict_map.lua 加载耗时: %.1f ms", (t_load1 - t_load0) * 1000))

-- 找一个确实存在于 dict_map_2 的候选码，用于测量“命中”路径
local hit_code
for k, _ in pairs(pure_data.dict_map_2 or {}) do hit_code = k; break end
print("[info] dict_map_2 条目数:", hit_code and "有" or "无", " 样例码:", tostring(hit_code))

-- 桩引擎/上下文
local env = {
  engine = { commit_text = function() end, context = nil },
  processing = false,
}
local context = {
  _input = "",
  clear = function(self) self._input = "" end,
  push_input = function(self, s) self._input = self._input .. s end,
  get_option = function() return false end,
}
env.engine.context = context

local key_event = {
  keycode = 0,
  alt = function() return false end,
  ctrl = function() return false end,
  caps = function() return false end,
}
local processor = require("yoyo.pure_popping")

local function bench(label, input_str, kc, n)
  context._input = input_str
  key_event.keycode = kc
  -- 预热
  for i = 1, 2000 do processor.func(key_event, env) end
  local t0 = os.clock()
  for i = 1, n do
    context._input = input_str
    processor.func(key_event, env)
  end
  local t1 = os.clock()
  local per = (t1 - t0) / n * 1e6  -- 微秒/次
  print(string.format("[bench] %-28s input=%-6s -> %.3f us/key  (%.2f ms / %d次)",
    label, input_str, per, (t1 - t0) * 1000, n))
  return per
end

local N = 500000
print("--- 测量 ' 次选路径 ---")
-- 命中：input 是 dict_map_2 里的码
bench("' hit (有次选)", hit_code or "aB", string.byte("'"), N)
-- 未命中：普通两码字，没有次选
bench("' miss (无次选)", "aB", string.byte("'"), N)
-- 对照：普通 4 码词末键
bench("4码词末键(普通)", "rTah", string.byte("Y"), N)
-- 对照：一简顶屏
bench("一简顶屏(_w)", "_w", string.byte("b"), N)

print("--- 结论阈值：人类可感知卡顿约 >16ms/次 (60fps 帧预算) ---")
