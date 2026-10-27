-- #57 测试辅助：在桩 DSL 里加载 LyraIME 主题，dump 每个按键的原始动作与解析结果。
-- 用法：lua rime/scripts/dump_cj_theme.lua <theme.lua> <cj_decision 路径不用>
--
-- 为什么用桩而不是正则解析：主题是 Lua，key/row/theme 都是 DSL 函数。
-- 把未定义的全局名统统替换成「恒等函数」，就能原样执行主题并获得最终表结构，
-- 这样测的是「主题被引擎读到的东西」，而不是「文本长得像什么」。

local path = arg[1]
if not path then
  io.stderr:write("usage: lua dump_cj_theme.lua <theme.lua>\n")
  os.exit(2)
end

local function ident(t)
  return t
end

local env = setmetatable({}, {
  __index = function(_, k)
    local v = _G[k]
    if v ~= nil then return v end
    return ident
  end,
})

-- pk / scheme / bg 这类多参数 DSL 函数不能直接用恒等（恒等只返回第一个参数），
-- 必须按各自语义实现，否则 preset_keys 会变成「id 字符串」而不是定义表。
env.pk = function(_, t) return t end
env.scheme = function(id, colors) return { id = id, colors = colors } end

local chunk, err = loadfile(path, "t", env)
if not chunk then
  io.stderr:write(err, "\n")
  os.exit(1)
end
local ok, theme = pcall(chunk)
if not ok then
  io.stderr:write(tostring(theme), "\n")
  os.exit(1)
end

local buf = {}

-- 解析一个 KeyName：命中 preset_keys 就取其 text / commit，否则就是字面键名
local function resolve(name)
  if type(name) ~= "string" then return "", "" end
  local pk = theme.preset_keys and theme.preset_keys[name]
  if pk then
    return pk.text or pk.commit or "", "preset"
  end
  return name, "literal"
end

for id, kb in pairs(theme.preset_keyboards or {}) do
  for ri, row in ipairs(kb.rows or {}) do
    for ki, k in ipairs(row.keys or {}) do
      local function emit(field)
        local raw = k[field]
        if type(raw) ~= "string" or raw == "" then return end
        local val, kind = resolve(raw)
        buf[#buf + 1] = string.format("key\t%s\t%d\t%d\t%s\t%s\t%s\t%s\n",
          id, ri, ki, field, raw, val, kind)
      end
      emit("click")
      emit("swipe_up")
      emit("long_click")
      if k.label then
        buf[#buf + 1] = string.format("label\t%s\t%d\t%d\t%s\n", id, ri, ki, tostring(k.label))
      end
      if k.label_symbol then
        buf[#buf + 1] = string.format("symbol\t%s\t%d\t%d\t%s\n",
          id, ri, ki, tostring(k.label_symbol))
      end
    end
  end
end

io.write(table.concat(buf))
