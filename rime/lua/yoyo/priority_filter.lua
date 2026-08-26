-- 候选词分类重排过滤器 (priority_filter.lua)
-- 作用：根据 word_priority 开关状态，动态重排候选列表
-- 1. word_priority = false (主单模式 · 默认)：单字优先排前，词组排后
-- 2. word_priority = true  (主词模式)：词组优先排前，单字排后
-- 保持相同长度类别内部的原始词频相对顺序不变

local filter = {}
local yield_cand = yield or coroutine.yield

function filter.init(env)
end

function filter.fini(env)
end

function filter.func(input, env)
  local context = env.engine.context
  local is_word_priority = context:get_option("word_priority")

  local chars = {}
  local words = {}

  for cand in input:iter() do
    if utf8.len(cand.text) == 1 then
      table.insert(chars, cand)
    else
      table.insert(words, cand)
    end
  end

  local first_group = is_word_priority and words or chars
  local second_group = is_word_priority and chars or words

  for _, cand in ipairs(first_group) do
    yield_cand(cand)
  end
  for _, cand in ipairs(second_group) do
    yield_cand(cand)
  end
end

return filter
