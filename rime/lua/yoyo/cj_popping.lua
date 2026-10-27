-- yoyo-pure-cj 串击处理器
--
-- 职责：把线性码元流按 cj_parser 的规则切分并上屏，处理空格定界、退格清空、
-- 死缓冲清理。不并击、不用 chord_composer。
--
-- 与 yoyo-pure-km 的 pure_popping.lua 的关键差异：
--   - 没有 _ / + 前缀状态机，没有一简，没有次选修饰键
--   - 上屏判定完全由数据驱动（cj_decision.lua），不含概率猜测

local yoyo = require "yoyo.yoyo"
local parser = require "yoyo.cj_parser"

local processor = {}

-- 与 pure_popping.lua 同构：显式初始化，别依赖 nil 的假值语义
function processor.init(env)
  env.processing = false
end

-- 当前 2 码位视图（#55）：word_priority 关闭 = 主单（默认），开启 = 主词。
-- 与桌面并击版同名同义，切换键也相同（Control+Shift+C）。
local function view_of(ctx)
  if ctx:get_option("word_priority") then return parser.VIEW_WF end
  return parser.VIEW_CF
end

-- 清空缓冲并可选回填残留
local function flush(env, ctx, texts, restore)
  env.processing = true
  if texts then
    for _, t in ipairs(texts) do
      if t ~= "" then env.engine:commit_text(t) end
    end
  end
  ctx:clear()
  if restore and restore ~= "" then
    ctx:push_input(restore)
  end
  env.processing = false
end

function processor.func(key_event, env)
  if env.processing then return yoyo.kNoop end
  if key_event:alt() or key_event:ctrl() or key_event:caps() then
    return yoyo.kNoop
  end

  local ctx = env.engine.context
  local kc = key_event.keycode
  local input = ctx.input or ""

  -- ── 退格：有缓冲则整段清空，一次退格撤掉整个单元 ──────────────────────
  if kc == 0xff08 then            -- XK_BackSpace
    if input ~= "" then
      flush(env, ctx, nil, "")
      return yoyo.kAccepted
    end
    return yoyo.kNoop
  end

  -- ── 转义：清空缓冲，不上屏 ─────────────────────────────────────────
  if kc == 0xff1b then            -- XK_Escape
    if input ~= "" then
      flush(env, ctx, nil, "")
      return yoyo.kAccepted
    end
    return yoyo.kNoop
  end

  -- 只处理可见 ASCII
  if kc < 0x20 or kc > 0x7e then return yoyo.kNoop end
  local incoming = string.char(kc)
  local view = view_of(ctx)

  -- ── 次选修饰键 '：直出当前 2 码位的另一类 ─────────────────────────────────
  -- 与桌面并击版同一手法（pure_popping.lua 的「' 次选拦截」）：不依赖
  -- speller/auto_select（本方案 auto_select = false），直接 commit。
  -- ' 不在 60 码元内，若返回 kNoop 会被 punctuator 当标点插入，因此
  -- 命中即 kAccepted；未命中同样吞掉，避免 ' 漏进拼写缓冲。
  if incoming == "'" then
    if input == "" then return yoyo.kNoop end  -- 无缓冲：当普通撇号处理
    local second = #input == 2 and parser.second2(input, view) or nil
    if second then
      flush(env, ctx, { second }, "")
    end
    return yoyo.kAccepted
  end

  -- ── 空格：定界符 ──────────────────────────────────────────────────
  if incoming == " " then
    if input == "" then return yoyo.kNoop end
    -- 本表不认识的四码以上缓冲一律不猜：用户加词表（yoyo-user）里的词
    -- 只存在于 Rime 的 translator 里，本表没有。强行按 2+2 切分会把
    -- 「家乡话」拆成「宏话」。所以这里放行，交给 selector 选中候选。
    if #input >= 4 and not parser.known_word(input) then
      return yoyo.kNoop
    end
    local texts = parser.force_resolve(input, view)
    flush(env, ctx, texts, "")
    return yoyo.kAccepted
  end

  -- 非码元字符放行给后续处理器（标点、数字等）
  if not parser.is_code_unit(incoming) then return yoyo.kNoop end

  -- ── 码元：拼接后尝试切分 ───────────────────────────────────────────
  local buf = input .. incoming
  local texts, rest = parser.resolve_all(buf, view)

  if #texts == 0 then
    if not parser.is_prefix(buf) then
      -- 死缓冲：整段作废，吞掉本次按键，不进拼写缓冲
      flush(env, ctx, nil, "")
      return yoyo.kAccepted
    end
    -- 还不能定，交给 speller 把它并入拼写缓冲（保持候选/preedit 正常显示）
    return yoyo.kNoop
  end

  flush(env, ctx, texts, rest)
  return yoyo.kAccepted
end

return processor
