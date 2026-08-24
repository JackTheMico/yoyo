-- 纯形·统一流·后置状态机处理器 (pure_popping_post.lua)
-- 作用：紧随 chord_composer 之后执行，在码元推入输入框的瞬间完成：
-- 1. 空码自动切分 (3码无字 如 iG+e -> 立即提交 iG "打", 留 +e "有"; 4码无词 如 slcb -> 立即提交 sl "了", 留 cb "不")
-- 2. 3码单字直出模式 (当 instant_commit_3code 开关开启时立即上屏)

local yoyo = require "yoyo.yoyo"

local processor = {}

---@param env Env
function processor.init(env)
  env.processing = false
end

---@param key_event KeyEvent
---@param env Env
---@return integer
function processor.func(key_event, env)
  if env.processing then
    return yoyo.kNoop
  end

  -- 忽略释放键和修饰键 (Ctrl/Alt/Caps)
  if key_event:release() or key_event:alt() or key_event:ctrl() or key_event:caps() then
    return yoyo.kNoop
  end

  local context = env.engine.context
  local input = yoyo.current(context)

  if not input or input == "" then
    return yoyo.kNoop
  end

  -- 特殊模式绕过
  if input:sub(1, 1) == "`" or input:sub(1, 1) == "'" or input:match("^e?[6L]") or input:match("^fg") then
    return yoyo.kNoop
  end

  local clean_input = input:gsub("[_+]", "")
  local effective_len = #clean_input

  -- 1. 3 码单字即刻直出模式 (当 instant_commit_3code 开关开启时)
  if effective_len == 3 and context:get_option("instant_commit_3code") and context:has_menu() then
    env.processing = true
    context:confirm_current_selection()
    context:commit()
    context:clear()
    env.processing = false
    return yoyo.kNoop
  end

  -- 2. 空码即时切分回退 (3码无字 或 4码无词)
  -- 在 chord_composer 产出码元的瞬间立即切分，无需等待第 3 个字！
  if (effective_len == 3 or effective_len == 4) and not context:has_menu() then
    env.processing = true
    local first_two = clean_input:sub(1, 2)
    local remainder = input:sub(#first_two + 1)
    
    context:pop_input(#input)
    context:push_input(first_two)
    if context:has_menu() then
      context:confirm_current_selection()
      context:commit()
      context:clear()
    else
      env.engine:commit_text(first_two)
      context:clear()
    end
    context:push_input(remainder)
    env.processing = false
    return yoyo.kNoop
  end

  return yoyo.kNoop
end

return processor
