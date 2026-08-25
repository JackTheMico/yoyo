-- 纯形·统一流·确定性状态机处理器 (pure_popping.lua)
-- 放置位置：位于 chord_composer 之后，speller 之前
--
-- 关键时序约束（来自 librime chord_composer.cc 源码）：
--   chord_composer::FinishChord() 把合成码元逐字符注入 engine->ProcessKey()，
--   每个字符独立走完整处理器链（pure_popping → ... → speller）。
--   因此：pure_popping 收到 incoming 字符时，context.input 只含前 N-1 个字符。
--
-- 设计原则：基于 (context.input, incoming) 二元组做前瞻推断
--
-- 模式识别（input = 已有内容，incoming = 当前字符，还未进 speller）：
--
-- A. input='_X' 或 '+X'（一简完整），incoming='+'/'_'（新一简前缀）
--    → 顶出一简，kNoop（speller 自然 push incoming）
--
-- B. input='XX'（两码），incoming='+'/'_'（一简前缀）
--    → kNoop，等下一字符
--
-- C. input='XX+' 或 'XX_'（两码 + 一简前缀），incoming=字母
--    → if chars_3code['XX'+incoming]: kNoop（是3码字，继续等）
--    → else: 顶出 XX，clear，push '+'/'-'，kNoop（speller 自然 push incoming → '+e'）
--
-- D. input='XX_Y' 或 'XX+Y'（完整3码字），incoming=任意可见键
--    → 顶出3码字，clear，kNoop（speller push incoming）
--    → 特殊：如果 incoming 是 '+'/'_'，需要 push 它再 kNoop
--
-- E. input='XYZ'（3字符，无 _/+），incoming=普通字母 W
--    → 检查 words_4code['XYZW'] → 是：kNoop（等完整4码词）；否：顶出 XY，push Z，kNoop
--
-- F. input='XYZW'（完整4码词），incoming=任意可见键
--    → 顶出 XYZW，clear，kNoop
--
-- G. input='XYZW'（4字符，words_4code 为 nil），incoming 到来
--    → 无法到达（E 在第4字符到达前已经处理了非词情况）

local yoyo = require "yoyo.yoyo"
local pure_data = require "yoyo.data.pure_dict_map"

local processor = {}

function processor.init(env)
  env.processing = false
end

-- 判断字符是否是一简前缀
local function is_jian_prefix(c)
  return c == "_" or c == "+"
end

-- 判断字符是否是普通可见字母（非 _/+ 前缀）
local function is_plain_char(c)
  return c:match("[a-zA-Z;:,<.>/?]") ~= nil
end

-- 提交中文并可选 restore 前缀，然后让 incoming 继续走向 speller
-- 注意：不 push incoming！让 speller 自然处理它
local function commit_and_restore(env, ctx, code, restore_prefix)
  local clean = code:gsub("[_+]", "")
  local text = pure_data.dict_map[code] or pure_data.dict_map[clean]
  if not text then return end
  env.processing = true
  env.engine:commit_text(text)
  ctx:clear()
  if restore_prefix and restore_prefix ~= "" then
    ctx:push_input(restore_prefix)
  end
  env.processing = false
end

function processor.func(key_event, env)
  if env.processing then return yoyo.kNoop end

  -- 忽略修饰键（chord_composer 送来的合成键是 key-down，release 不忽略）
  if key_event:alt() or key_event:ctrl() or key_event:caps() then
    return yoyo.kNoop
  end

  local context = env.engine.context
  local kc = key_event.keycode
  local incoming = (kc >= 0x20 and kc <= 0x7e) and utf8.char(kc) or nil
  local input = yoyo.current(context)

  if not input or input == "" then return yoyo.kNoop end
  if not incoming then return yoyo.kNoop end  -- 功能键（KP_2 等）放行

  -- 特殊模式绕过：反查(`)、快符(')、标点并击(fg/e?[6L])
  if input:sub(1,1) == "`" or input:sub(1,1) == "'" then return yoyo.kNoop end
  if input:match("^fg") or input:match("^e?[6L]") then return yoyo.kNoop end

  -- 选字/翻页键放行：空格、'、0-9
  if incoming == " " or incoming == "'" or (incoming >= "0" and incoming <= "9") then
    return yoyo.kNoop
  end

  local ilen = #input

  -- ─── Pattern A: 一简完整（_X 或 +X），接到一简前缀（+/_） ─────────────────
  -- input='_d', incoming='+' → 顶出 _d("的"), kNoop → speller push '+' → '+'
  if ilen == 2 and is_jian_prefix(input:sub(1,1)) and is_plain_char(input:sub(2,2))
     and is_jian_prefix(incoming) then
    commit_and_restore(env, context, input, nil)  -- 不 restore，让 speller push incoming('+')
    return yoyo.kNoop
  end

  -- ─── Pattern B: 两码字（XX），接到一简前缀 ────────────────────────────────
  -- input='iG', incoming='+' → kNoop，等下一字符（要看到 'e' 才能判断是否 3码字）
  if ilen == 2 and is_plain_char(input:sub(1,1)) and is_plain_char(input:sub(2,2))
     and is_jian_prefix(incoming) then
    return yoyo.kNoop  -- 等下一字符
  end

  -- ─── Pattern C: 两码 + 一简前缀（XX+ 或 XX_），接到字母 ──────────────────
  -- input='iG+', incoming='e' → 检查 chars_3code['iGe'] → nil → 顶 iG, restore '+', kNoop
  -- input='bX_', incoming='n' → 检查 chars_3code['bXn'] → true → kNoop（3码字，不顶）
  if ilen == 3 and is_plain_char(input:sub(1,1)) and is_plain_char(input:sub(2,2))
     and is_jian_prefix(input:sub(3,3)) and is_plain_char(incoming) then
    local chord2 = input:sub(1,2)
    local jian_head = input:sub(3,3)
    local candidate_3code = chord2 .. incoming
    if pure_data.chars_3code[candidate_3code] then
      return yoyo.kNoop  -- 是合法3码字（如 bXn "鸣"），不顶
    else
      -- 是两码字接一简（如 iG+e "打有"）→ 顶出 iG，保留前缀，让 'e' 走 speller
      commit_and_restore(env, context, chord2, jian_head)
      return yoyo.kNoop
    end
  end

  -- ─── Pattern D: 完整3码字（XX_Y 或 XX+Y），接到任意可见键 ─────────────────
  -- input='bX_n', incoming='i' → 顶出 bX_n("鸣"), clear, kNoop → speller push 'i'
  -- input='bX_n', incoming='+' → 顶出 bX_n, kNoop → speller push '+' （作为下一简前缀）
  if ilen == 4 and is_plain_char(input:sub(1,1)) and is_plain_char(input:sub(2,2))
     and is_jian_prefix(input:sub(3,3)) and is_plain_char(input:sub(4,4)) then
    commit_and_restore(env, context, input, nil)
    return yoyo.kNoop
  end

  -- ─── Pattern E: 3字符纯字母（XYZ），接到字母 W → 判断 XYZW 是否4码词 ────────
  -- input='rTa', incoming='h' → words_4code['rTah']=true → kNoop（等完整4码词）
  -- input='slc', incoming='b' → words_4code['slcb']=nil  → 顶出 sl，push 'c', kNoop
  if ilen == 3 and not input:find("[_+]") and is_plain_char(incoming) then
    local w4 = input .. incoming
    if pure_data.words_4code[w4] then
      return yoyo.kNoop  -- 是合法4码词，等 speller 把 incoming push 进去
    else
      -- 不是词 → 顶出前两码，把第3码 restore 进 input，让 incoming 走 speller
      local first_two = input:sub(1,2)
      local third = input:sub(3,3)
      commit_and_restore(env, context, first_two, third)
      return yoyo.kNoop
    end
  end

  -- ─── Pattern F: 完整4码词（XYZW），接到任意可见键 → 顶出词 ─────────────────
  -- input='rTah', incoming='i' → 顶出 rTah("类似"), clear, kNoop → speller push 'i'
  if ilen == 4 and not input:find("[_+]") then
    -- 如果是4码词，接到新的触发键就顶屏
    local text = pure_data.dict_map[input]
    if text then
      commit_and_restore(env, context, input, nil)
    end
    return yoyo.kNoop
  end

  return yoyo.kNoop
end

return processor
