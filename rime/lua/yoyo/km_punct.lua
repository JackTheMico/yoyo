-- 空明拳并击标点拦截处理器 (km_punct.lua)
-- 放置位置：位于 chord_composer 之后，pure_popping 之前
-- 拦截 chord_composer 产出的 ~ 开头的标点标记串并瞬间直接上屏 (Direct Commit)

local yoyo = require "yoyo.yoyo"

local processor = {}

local STATIC_PUNCT = {
  ["~comma"] = "，",
  ["~period"] = "。",
  ["~enum_comma"] = "、",
  ["~semicolon"] = "；",
  ["~colon"] = "：",
  ["~question"] = "？",
  ["~exclamation"] = "！",
  ["~ellipsis"] = "……",
  ["~dash"] = "——",
  ["~middledot"] = "·",
}

local TOGGLE_PUNCT = {
  ["~dquote"] = { open = "“", close = "”", key = "dquote" },
  ["~squote"] = { open = "‘", close = "’", key = "squote" },
  ["~book_quote"] = { open = "《", close = "》", key = "book_quote" },
  ["~paren"] = { open = "（", close = "）", key = "paren" },
  ["~bracket"] = { open = "【", close = "】", key = "bracket" },
  ["~corner_bracket"] = { open = "「", close = "」", key = "corner_bracket" },
}

function processor.init(env)
  env.in_punct = false
  env.punct_buf = ""
  env.toggles = {
    dquote = false,
    squote = false,
    book_quote = false,
    paren = false,
    bracket = false,
    corner_bracket = false,
  }
end

function processor.func(key_event, env)
  if key_event:alt() or key_event:ctrl() or key_event:caps() then
    return yoyo.kNoop
  end

  local kc = key_event.keycode
  if kc < 0x20 or kc > 0x7e then return yoyo.kNoop end
  local ch = utf8.char(kc)

  -- 标点标记串起始检测
  if not env.in_punct then
    if ch == "~" then
      env.in_punct = true
      env.punct_buf = "~"
      return yoyo.kAccepted
    end
    return yoyo.kNoop
  end

  -- 处于标点标记串收集状态
  env.punct_buf = env.punct_buf .. ch

  -- 1. 检查静态单标点
  local static_sym = STATIC_PUNCT[env.punct_buf]
  if static_sym then
    env.engine:commit_text(static_sym)
    env.engine.context:clear()
    env.in_punct = false
    env.punct_buf = ""
    return yoyo.kAccepted
  end

  -- 2. 检查成对 Toggle 标点
  local toggle_cfg = TOGGLE_PUNCT[env.punct_buf]
  if toggle_cfg then
    local k = toggle_cfg.key
    local is_open = not env.toggles[k]
    env.toggles[k] = is_open
    local sym = is_open and toggle_cfg.open or toggle_cfg.close
    env.engine:commit_text(sym)
    env.engine.context:clear()
    env.in_punct = false
    env.punct_buf = ""
    return yoyo.kAccepted
  end

  -- 3. 溢出保护（防止异常字符串死锁）
  if #env.punct_buf > 25 then
    env.in_punct = false
    env.punct_buf = ""
    return yoyo.kNoop
  end

  return yoyo.kAccepted
end

return processor
