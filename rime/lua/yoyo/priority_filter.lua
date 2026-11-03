-- 候选词过滤器 (priority_filter.lua)
-- 直通模式：不再按单字/词组分类重排，候选顺序直接采用翻译器的权重降序输出
-- （词典 sort: by_weight，首选/次选由实际使用频率决定，不再区分字/词）。
-- 保留此文件以维持 schema 过滤器链的向后兼容；如需彻底移除可从 engine/filters 中注销。

local filter = {}
local yield_cand = yield or coroutine.yield

function filter.init(env)
end

function filter.fini(env)
end

function filter.func(input, env)
  for cand in input:iter() do
    yield_cand(cand)
  end
end

return filter
