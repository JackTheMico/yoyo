-- 反查 translator 集成路径测试（stub 模拟 librime 的 env/segment/Candidate/yield）
-- 用法: lua5.4 rime/scripts/test_reverse_integration.lua
-- 覆盖: init 默认配置 / reverse 段配置 / has_tag 分支 / 前缀剥离 / 空拼音 / 非法字符

local root = arg[0]:match("^(.*)[/\\][^/\\]*$")
package.path = root .. "/../lua/?.lua;" .. package.path

local reverse = require "yoyo.reverse"

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
_G.Candidate = function(typ, s, e, text, comment)
  return { type = typ, start = s, _end = e, text = text, comment = comment }
end
_G.yield = function(c)
  out[#out + 1] = c
end

local function make_seg(has_tag)
  return { start = 0, _end = 8, has_tag = has_tag or function(self, t) return t == "reverse" end }
end

local function make_env(reverse_cfg)
  local cfg = {}
  if reverse_cfg then
    cfg.get_map = function(self, name)
      if name == "reverse" then
        return {
          get_value = function(self, k)
            local v = reverse_cfg[k]
            if v == nil then return nil end
            return { get_string = function() return tostring(v) end, get_int = function() return v end }
          end,
        }
      end
      return nil
    end
  else
    cfg.get_map = function() return nil end
  end
  return {
    engine = {
      schema = { config = cfg },
      context = { input = "" },
    },
  }
end

-- 1. init 默认配置
local env = make_env(nil)
reverse.init(env)
check(env.reverse.prefix == "`" and env.reverse.max_candidates == 100,
  "init 默认: prefix=` max_candidates=100")

-- 2. init 读 reverse 段配置
local env2 = make_env({ prefix = "`", max_candidates = 50 })
reverse.init(env2)
check(env2.reverse.max_candidates == 50, "init 读 reverse/max_candidates=50")

-- 3. 集成: `hanmei → 寒梅/sHqL
out = {}
env.engine.context.input = "`hanmei"
local seg = make_seg()
reverse.func("`hanmei", seg, env)
check(#out > 0 and out[1].text == "寒梅" and out[1].comment == "sHqL",
  "func(`hanmei) 首候选 寒梅/sHqL, 实际 " .. (out[1] and out[1].text or "空") .. "/" .. (out[1] and out[1].comment or ""))

-- 4. 非 reverse 段不产出
out = {}
env.engine.context.input = "abcd"
local seg_plain = make_seg(function() return false end)
reverse.func("abcd", seg_plain, env)
check(#out == 0, "非 reverse 段无候选")

-- 5. 前缀剥离: ` 不在开头不产出
out = {}
env.engine.context.input = "han`mei"
reverse.func("han`mei", seg, env)
check(#out == 0, "前缀键不在开头不产出")

-- 6. 空拼音无候选
out = {}
env.engine.context.input = "`"
reverse.func("`", seg, env)
check(#out == 0, "空拼音无候选")

-- 7. 非法字符（非 a-z）无候选
out = {}
env.engine.context.input = "`Han"
reverse.func("`Han", seg, env)
check(#out == 0, "大写输入无候选")

-- 8. max_candidates 生效
out = {}
env2.engine.context.input = "`zh"
reverse.func("`zh", make_seg(), env2)
check(#out <= 50, "max_candidates=50 生效, 实际 " .. #out)

print(("通过 %d 项断言"):format(passed))
if ok then
  print("ALL PASS")
  os.exit(0)
else
  print("SOME FAIL")
  os.exit(1)
end
