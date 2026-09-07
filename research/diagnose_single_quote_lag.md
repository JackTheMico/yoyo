# 单引号并击「卡顿」诊断报告

> 触发：用户反馈「用单引号并击词语时，有时会感觉到卡顿」。
> 方法：diagnosing-bugs 技能 —— 先建可量化回路，再排假设。

## 一、结论速览

- **纯 Lua 侧不是瓶颈。** `pure_popping` 的 `'` 路径实测 **0.07 µs/键**，比人类可感知卡顿阈值（~16 ms @60fps）低约 **23 万倍**。8.3MB 数据文件加载为一次性 72 ms（部署/启动时），不发生在按键时。
- **真正嫌疑：`'` 在当前方案里已不是「简词」，而是「次选拦截」，且覆盖率极低。** 229,200 个首选码中仅 **7,918 个（≈3.5%）有次选**。按 `'` 而无次选时，`pure_popping` 返回 `kNoop`，`'` 顺着处理器链漏进 `speller` 被塞进拼写缓冲 → 表现为「卡住 / 不灵 / 要再敲一下才动」，即用户感知的卡顿。
- 「有时」完全吻合覆盖模型：恰好命中那 3.5% 的和键时一击上屏（顺畅），其余 96.5% 漏进缓冲（卡顿）。

## 二、可量化回路（Phase 1）

- 文件：`research/bench_pure_popping.lua`
- 做法：用桩对象替代 rime 引擎，加载**真实** `pure_dict_map.lua`（8.3MB / 337,179 行），对 `pure_popping.func` 跑 50 万次计时（LuaJIT，贴近 Rime 运行时）。
- 结果：

| 路径 | 单键耗时 |
|---|---|
| `'` 命中次选（有 2nd candidate） | 0.070 µs |
| `'` 未命中次选 | 0.067 µs |
| 4 码词末键（普通） | 0.217 µs |
| 一简顶屏（`_w`） | 0.122 µs |

- 结论：所有路径均为亚微秒级，`pure_popping` 的 CPU/GC 不可能造成可感知卡顿。

## 三、`'` 现在的真实代码路径

1. `yoyo-pure-km.schema.yaml:70` —— `'` 在 `chord_composer` 的 `alphabet` 内，是「次选修饰符」；和击末尾加 `'` 会被保留为后缀（`:116/118/119` 的 `xform` 保留 `[']?`）。
2. chord 合成后逐字符注入：`… → '` 到达 `pure_popping`。
3. `pure_popping.lua:113-126` —— `incoming == "'"` 时查 `dict_map_2[input]`：
   - **命中** → 提交次选、`kAccepted`（一击上屏，快）。
   - **未命中** → `return kNoop`，`'`（在 `speller.alphabet` 内，`:92-93`）被加入拼写缓冲。
4. 中间处理器 `commit_raw`（只拦 Ctrl）、`km_punct`（只处理 `~xxx` 标点）均不截胡 `'`，故未命中时必然漏到 `speller`。

> 注：旧的「`' 前缀简词」（Pattern H，一击上屏词）已于 2026-08-29 移除；当前 `'` 只剩「次选拦截」单一角色（`'` 简词可行性代码已并入 `chord_utils.py`，未启用）。

## 四、排名假设（Phase 3，待用户用领域知识校准）

**H1（最可能）—— `'` 无次选时漏进 speller 缓冲，造成「假死/卡顿」**
- 证据：3.5% 次选覆盖率 + 代码确认 kNoop 漏到 speller。
- 预测：若把 `'` 未命中改为直接 `context:clear()`（丢弃该 `'` 与待定和键），卡顿消失，且仅在「该和键本无次选」时出现。
- 与「有时」完全吻合。

**H2（设计错位）—— 用户心智模型仍是旧的 `'` 简词（一击上屏词）**
- 证据：`'` 简词已被移除，用户却以「单引号并击词语」描述，预期 `'XY`→词。
- 预测：恢复 `'` 简词（Pattern H + 重生成 `brief_map`）后，`'` 和击稳定产出词且一击上屏，卡顿感知消失。

**H3（chord_composer 和键等待）—— `'` 作为 alphabet 成员，某些和键组合下等待稳定/超时**
- 本机无法验证（无头 librime 崩溃，无法真机计时）。按 rime「稳定即提交」模型，`'` 作末尾修饰符通常立即提交，概率较低。
- 预测：若卡顿与「具体和键是否完整」无关、只与「是否按了 `'`」强相关，则更支持 H1/H2。

**H4（Lua GC 偶发暂停）—— `'` 路径每次 `gsub` 分配字符串，长会话累积触发 GC**
- Loop 实测 0.07 µs，单一路径分配极小，难以造成可感知暂停，概率低。
- 预测：若卡顿与「会话时长/总按键数」强相关而与具体和键无关，则支持 H4（需真机 rime 日志/perf 观察）。

## 五、建议下一步

- 真机确认：在 fcitx5 里开关输入法、打开 rime 日志，复现一次「卡顿」并看 `'` 是否进入了拼写缓冲（composition 末尾出现 `'`）。
- 修复方向二选一（取决于 `'` 想要什么语义）：
  - **方向 A（修 H1）**：未命中次选时 `context:clear()`，避免 `'` 污染拼写。改动最小、零数据重生成。
  - **方向 B（修 H2）**：恢复 `'` 简词（Pattern H + `brief_map` 重新生成），让 `'` 和击回到「一击上屏词」。改动较大、需重生成数据。

## 六、已应用修复（2026-08-30，方向 A）

用户选择「保留次选·修漏缓冲」。改动：

- `rime/lua/yoyo/pure_popping.lua:113-126` 的 `'` 次选拦截，未命中分支由
  `return yoyo.kNoop` 改为 `return yoyo.kAccepted`：吞掉 `'`，保留已输入的和键，
  不再漏进 speller 污染拼写。纯粹返回值的改动，零数据重生成。
- 回归测试：`rime/scripts/test_brief_words.lua` 新增「次选未命中」分支（断言 kAccepted +
  不上屏 + 保护和键）。修复前该断言红（返回 kNoop），修复后绿。

验证（全绿）：
- `lua5.4 rime/scripts/test_brief_words.lua` → 19/0
- `python3 rime/scripts/test_pure_popping_realistic.py` → 96/96
- `python3 rime/scripts/test_pure_popping_secondary.py` → 35/35
- `python3 rime/scripts/test_pure_chord_secondary.py` → 全过
- 计时回路 `research/bench_pure_popping.lua`（`'` miss 0.066 µs/键，无回退）

**生效条件**：`pure_popping.lua` 在 schema 部署时加载，需重新部署 fcitx5（re-deploy / 重启输入法）后修复才会生效。
