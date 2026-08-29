-- 纯形·统一流·确定性状态机处理器 (pure_popping.lua)
-- 放置位置：位于 chord_composer 之后，speller 之前
--
-- 关键时序约束（来自 librime chord_composer.cc 源码）：
--   chord_composer::FinishChord() 把合成码元逐字符注入 engine->ProcessKey()，
--   每个字符走完整处理器链（pure_popping → ... → speller）。
--   因此：pure_popping 收到 incoming 字符时，context.input 只含前 N-1 个字符。
--
-- 设计原则：基于 (context.input, incoming) 二元组做前瞻推断
--
-- 编码类型：
--   一简  = _X 或 +X（2字符，以 _ 或 + 开头，如 _w, +e）
--   两码字 = XY（2字符，均为普通字母，如 iG, bT）
--   3码字 = XX_Y 或 XX+Y（4字符，含 _/+，如 bX_n, wC+s）
--   4码词 = XYZW（4字符，均为普通字母，如 rTah, ISoY）
--
-- 模式识别（input=已有内容，incoming=当前字符，尚未进 speller）：
--
-- A. input=一简(_X/+X)，incoming=任意可见键
--    → 顶出一简，kNoop（speller 自然 push incoming）
--    覆盖：_w+b（是吧），_d++（的+有），_w+_（是+在）
--
-- B. input=两码(XX)，incoming=_/+（一简前缀）
--    → kNoop，等下一字符
--
-- C. input=两码+前缀(XX_/XX+)，incoming=字母Y
--    → if chars_3code[XXY]: kNoop（3码字，继续等）
--    → else: 顶出XX，restore前缀，kNoop（speller push Y → +Y/已有_加上Y → 一简）
--
-- D. input=一简+一字符(_XY/+XY, ilen=3)，incoming=任意普通字母
--    → 顶出一简(_X/+X)，restore Y，kNoop（speller push incoming）
--    覆盖：input='_wb', incoming='T' → 顶出_w，restore b，→ speller 'T' → input='bT'
--
-- E. input=完整3码字(XX_Y/XX+Y, ilen=4)，incoming=任意可见键
--    → 顶出3码字，kNoop
--
-- F. input=3字符纯字母(XYZ)，incoming=普通字母W
--    → if words_4code[XYZW]: kNoop（4码词，继续等）
--    → else: 顶出XY，restore Z，kNoop（speller push W）
--
-- G. input=4字符纯字母(XYZW)，incoming=任意可见键
--    → 顶出XYZW（词或字），kNoop
--
-- S. 空格并击简词（% 前缀：%XY 双手+空格 / %_X 左手+空格 / %+X 右手+空格）
--    chord 输出是逐字符注入的（% → X → Y），故在「末字符 incoming」到达时：
--    → if space_brief_map[input .. incoming]: 顶出简词并 kAccepted（吞掉末字符）
--      ⇒ 真正的一击上屏，无需再接下一键；
--    → else: 拼满 3 字符仍未命中则清空死缓冲，kNoop
--    与 ' 版互不干扰：两套编码不同（'XY vs %XY），可并存。

local yoyo = require "yoyo.yoyo"
local pure_data = require "yoyo.data.pure_dict_map"

local processor = {}

function processor.init(env)
  env.processing = false
end

local function is_jian_prefix(c)
  return c == "_" or c == "+"
end

local function is_plain(c)
  return c:match("[a-zA-Z;:,<.>/?]") ~= nil
end

-- 获取当前生效的数据表（主单模式 vs 主词模式）
local function get_active_tables(context)
  local is_word_priority = context:get_option("word_priority")
  if is_word_priority and pure_data.word_first then
    return pure_data.word_first
  end
  return pure_data.char_first or pure_data
end

-- 提交中文，可选 restore 一段前缀回 input，然后让 incoming 继续走向 speller
local function commit_and_restore(env, ctx, code, restore, active_tables)
  local clean = code:gsub("[_+]", "")
  local dict_map = active_tables and active_tables.dict_map or pure_data.dict_map
  local text = dict_map[code] or dict_map[clean]
  if not text then return end
  env.processing = true
  env.engine:commit_text(text)
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

  local context = env.engine.context
  local kc = key_event.keycode
  -- 只处理可见 ASCII 字符（0x20-0x7e）
  if kc < 0x20 or kc > 0x7e then return yoyo.kNoop end
  local incoming = utf8.char(kc)
  local input = yoyo.current(context)

  if not input or input == "" then return yoyo.kNoop end

  local active_tables = get_active_tables(context)

  -- 特殊模式绕过（反查模式）
  if input:sub(1,1) == "`" then return yoyo.kNoop end

  -- 次选修饰键 ' 拦截：若当前 input 存在次选，直接提交次选上屏并清空缓冲区
  if incoming == "'" then
    local clean = input:gsub("[_+]", "")
    local dict_map_2 = active_tables.dict_map_2 or pure_data.dict_map_2
    local second_text = dict_map_2 and (dict_map_2[input] or dict_map_2[clean])
    if second_text then
      env.processing = true
      env.engine:commit_text(second_text)
      context:clear()
      env.processing = false
      return yoyo.kAccepted
    end
    return yoyo.kNoop
  end

  -- 选字/翻页键放行：空格、数字
  if incoming == " " or (incoming >= "0" and incoming <= "9") then
    return yoyo.kNoop
  end

  local ilen = #input

  -- ─── Pattern S: 空格并击简词(% 前缀，一击上屏) ──────────────────────────
  -- chord 输出逐字符注入：'%' → 'X' → 'Y'。末字符到达时 input..incoming 才完整，
  -- 此时命中 space_brief_map 立即提交并吞掉该字符（kAccepted），实现一击上屏。
  -- 与「' 次选拦截」同一手法，不依赖 speller/auto_select（本方案为 false）。
  if input:sub(1, 1) == "%" then
    local full = input .. incoming
    local space_map = pure_data.space_brief_map
    local text = space_map and space_map[full]
    if text then
      env.processing = true
      env.engine:commit_text(text)
      context:clear()
      env.processing = false
      return yoyo.kAccepted
    end
    -- 未命中且已拼满 3 字符（%XY / %_X / %+X 都是 3 字符）→ 清空死缓冲
    if #full >= 3 then
      env.processing = true
      context:clear()
      env.processing = false
    end
    return yoyo.kNoop
  end

  -- ─── Pattern A: 一简完整(_X 或 +X)，接任意可见键 ──────────────────────────
  -- input='_w', incoming='b' → 顶出 _w("是")，kNoop → speller push 'b'
  -- input='_d', incoming='+' → 顶出 _d("的")，kNoop → speller push '+'
  if ilen == 2 and is_jian_prefix(input:sub(1,1)) and is_plain(input:sub(2,2)) then
    commit_and_restore(env, context, input, nil, active_tables)
    return yoyo.kNoop
  end

  -- ─── Pattern B: 两码(XX)，接一简前缀(_/+) → kNoop，等下一字符 ─────────────
  if ilen == 2 and is_plain(input:sub(1,1)) and is_plain(input:sub(2,2))
     and is_jian_prefix(incoming) then
    return yoyo.kNoop
  end

  -- ─── Pattern C: 两码+前缀(XX_/XX+)，接字母 → 判断是否3码字 ─────────────────
  if ilen == 3 and is_plain(input:sub(1,1)) and is_plain(input:sub(2,2))
     and is_jian_prefix(input:sub(3,3)) and is_plain(incoming) then
    local chord2 = input:sub(1,2)
    local jian_head = input:sub(3,3)
    -- 去掉 chord2 内部可能携带的分隔符(/ _ +) 再拼 incoming 作为 3 码字判定键。
    -- 否则 做(a/) 接 自己(_g) 时 chord2..incoming="a/g" 会误命中 3 码字 估(a/g)，
    -- 导致状态机一直等待、不顶出 做。strip 后 candidate="ag"（非 3 码字）→ 正常顶出。
    -- 普通两码字(如 bX)内部无分隔符，strip 为 no-op，bX+n→bXn 仍正确命中 鸣。
    local candidate = chord2:gsub("[/_+]", "") .. incoming
    if pure_data.chars_3code[candidate] then
      return yoyo.kNoop  -- 是3码字（如 bXn）
    else
      commit_and_restore(env, context, chord2, jian_head, active_tables)
      return yoyo.kNoop
    end
  end

  -- ─── Pattern D: 一简+一字母(_XY/+XY, ilen=3)，接普通字母 ───────────────────
  -- input='_wb', incoming='T' → 顶出_w("是")，restore 'b'，kNoop
  -- input='_da', incoming='h' → 顶出_d("的")，restore 'a'，kNoop
  if ilen == 3 and is_jian_prefix(input:sub(1,1)) and is_plain(input:sub(2,2))
     and is_plain(input:sub(3,3)) and is_plain(incoming) then
    local jian = input:sub(1,2)   -- '_w'
    local next1 = input:sub(3,3)  -- 'b'（两码字的第1字符）
    commit_and_restore(env, context, jian, next1, active_tables)
    return yoyo.kNoop
  end

  -- ─── Pattern E: 完整3码字(XX_Y/XX+Y, ilen=4)，接任意可见键 ─────────────────
  if ilen == 4 and is_plain(input:sub(1,1)) and is_plain(input:sub(2,2))
     and is_jian_prefix(input:sub(3,3)) and is_plain(input:sub(4,4)) then
    commit_and_restore(env, context, input, nil, active_tables)
    return yoyo.kNoop
  end

  -- ─── Pattern F: 3字符纯字母(XYZ)，接任意键 ──────────────────────────────────
  if ilen == 3 and not input:find("[_+]") then
    if is_plain(incoming) and pure_data.words_4code[input .. incoming] then
      return yoyo.kNoop  -- 是4码词（如 rTah，eLjY），继续等第4码
    elseif is_plain(incoming) then
      -- 四码非词（如 fTB+n="天内", slc+b="了不"）：字1(前2码)上屏，字2第1字符(第3码)保留
      commit_and_restore(env, context, input:sub(1,2), input:sub(3,3), active_tables)
      return yoyo.kNoop
    end
  end

  -- ─── Pattern G: 4字符纯字母(XYZW)，接任意可见键 → 顶出词/字 ─────────────────
  if ilen == 4 and not input:find("[_+]") then
    local dict_map = active_tables.dict_map or pure_data.dict_map
    local text = dict_map[input]
    if text then commit_and_restore(env, context, input, nil, active_tables) end
    return yoyo.kNoop
  end

  return yoyo.kNoop
end

return processor
