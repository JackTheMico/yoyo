# 设计研究：yoyo-pure-km 继续降码长 —— 以空明码为参考

> **状态**：设计完成 (Design Completed) · 2026-11-02
> **问题**：在「物理一击最多 2 码元、纯形、0 空格顶功」约束下，yoyo-pure-km 还能怎么继续降码长？以原生空明码（kongmingma）为参考。
> **方法**：核对当前实现状态（grep 实测 `%` 占用、TIER1 词源体量）；引用仓库既有量化报告；以**一手源文件**复核空明码的 `* / ! / @` 短语前缀机制（`/home/jackwy/.local/share/fcitx5/rime/kongmingma*.yaml`）；用 codebase-design 的「深模块」框架设计 L2。
> **结论先行**：降码长有三条路线，按收益排序——**L1（立即·零风险·纯数据）** 把 `%` 简词从 996 补到 3720（换词源为词频排 2 字词），下界 0.762→0.668（−12.4%）；**L3（中期·最大杠杆·对标空明码 300 万库）** 分层大词库（Core 8 万 + Extended 20–30 万），直接消除「字典没词→拆单字 2 击」回落——这是空明码赢 yoyo 的那 9% 的全部来源；**L2（中长期·空明码招牌机制·短语前缀命名空间）** 给超高频 4–8 字短语配 2 击短码，聚合收益小（5+ 字词仅占文本 1.2%）但压得住固定搭配、提升体感，且是空明码「码长极短」的标志性设计。

---

## 1. 当前状态盘点（实测，非推测）

| 项 | 实测值 | 说明 |
| :--- | :--- | :--- |
| `%` 简词占用 | **996 / 3720** | `yoyo-user.dict.yaml` 中 `\t%` 行数；剩 **2724** 空位 |
| L1（补满 `%`） | **未执行** | `research/km_one_chord_tier1.txt` 仍约 1100 行（原 ~995 词源），未换成词频排 2 字词 |
| 2码‑覆盖 route‑P（给 179 单字加 `%` 码） | **未部署** | `docs/research/yoyo-pure-km-2code-coverage.md` 已设计，当前 `%` 仍为 996（非 1160） |
| L2（短语前缀 `* / ! / @`） | **未启动** | speller 字母表无 `* ! @`；无对应 pure_popping Pattern |
| L3（分层大词库） | **未启动** | 主字典仍 8.2 万 |

> 注：2026‑09‑02 的 `yoyo-pure-km-code-length-reduction.md` 已把 L1 量化到位（0.762→0.668）；2026‑10‑26 的 `yoyo-pure-km-2code-coverage.md` 已把「单字溢出 `%`」量化到位（179→0）。两份都是**已规划未落地**。本文件不重复它们的量化，只做状态确认 + 把 L2 设计落地 + 把 L3 提上日程。

---

## 2. L1 · 立即、零风险、纯数据（已规划，建议先执行）

**机制**：`%XY / %_X / %+X` 是独立于 2 码空间的命名空间，末字符到达即由 `pure_popping` 的 Pattern S 一击上屏（`docs/research/yoyo-pure-km-code-length-reduction.md` §4、§5 已详述）。

**唯一改动**：把 `gen_brief_words.py` 的词源 `TIER1`（≈1100 候选词）换成 `yoyo-yx-word.dict.yaml` 中「2 字词且未在库 1 击」按词频降序的前 3720 词，过滤已 1 击者，保留手动段与冲突回退逻辑不变。`--write` 后自动重生成 `pure_dict_map.lua` + 反查分片，再部署。**零代码改动、零行为回归风险。**

**收益（引用既有投影）**：补满 2724 位后整体每字击键率 0.762 → **0.668（−12.4%）**。这是当前性价比最高的一步，应优先于一切结构性改动。

---

## 3. L3 · 最大杠杆：分层大词库（对标空明码 300 万库）

### 3.1 为什么这是「参考空明码」的真正答案

`docs/research/2026-10-26-赛文实测-yoyo-pure-km-vs-空明码.md` 的结论：
- 隔离词库规模（只许两库共有词条）后，纯形 **0.873 击/字 < 空明码 0.899**——纯形的编码效率反而更高。
- 放开词库后空明码 0.795，比纯形 0.873 省 9%；省下的全部来自「库里恰好有那条 4 码长词/短语」（如 `是情感`、`通过屏幕`）。
- 一句话：**空明码赢在词库，纯形赢在确定性与不用选重；词库拉齐后纯形编码还略高。**

因此，「继续降码长、以空明码为参考」的头号杠杆不是编码技巧，而是**把词库做大**，让更多「字典没词→拆单字 2 击」的回落变成 1–2 击词。

### 3.2 落地

- 保持 `yoyo-pure.dict.yaml` 作为 Core（8–10 万，保障确定性、0 误触）。
- 新建 `yoyo-pure-extended.dict.yaml`（20–30 万），覆盖成语大辞典、全国地名、现代科技术语、流行词汇，经 `translator/import_tables` 引入（现有 `import_tables: [yoyo-user]` 机制可直接扩展）。
- **风险/权衡**：扩展库的 4 码词可能与 Core 的 4 码词重码（表内同码多文），需在 `priority_filter.lua` 里用词频定序，且会轻微削弱「6638 字零重码」的纯单字口径（不影响 3 码单字空间）。属 P2 探索，但收益是三条路线里最大的。

---

## 4. L2 · 空明码招牌机制：短语前缀命名空间（深模块设计）

### 4.1 空明码的一手机制（已复核源文件）

空明码用三个前缀字符做「超短码长词/短语」命名空间，与正常音节码**零碰撞**：

| 前缀 | 语义 | 条目数 | 码形 | 击数 |
| :--- | :--- | :--- | :--- | :--- |
| `*` | 宏词/专名（爱国主义、爱因斯坦） | 58 | `*A`（前缀+1 字母） | 2 击 |
| `!` | 短语/简词（本来、劳动） | 44 | `!b` | 2 击 |
| `@` | 常用口语短语（并不是、负责人） | 93 | `@B` | 2 击 |

实现要点（来自 `kongmingma.schema.yaml` 一手）：
1. **`speller.alphabet` 含 `* ! ~ @ _`**（`"...=.?!<;:/='\`7890~@*_"`），故这些字符可被拼写/进候选。
2. **`chord_composer` 的 algebra `xform` 从特定并击发射前缀**：`xform/(70)/*/`、`xform/(a-g-|h-F-)/!/`、`xform/(jkl;)/@/`。即一次并击（如 `70`）输出单个 `*` 字符（把 2 键的并击折叠成 1 个前缀符）。
3. **`recognizer` 无需特殊 pattern**——前缀码只是「首字符是 `* / ! / @` 的普通字典码」，与音节码天然不同命名空间。
4. 字典里 `*A → 爱国主义` 等是 **2 字符码 = 2 击**，对任意 4–8 字短语都成立，故长短语从 3–4 击压到 2 击。

> 关键可移植差异：空明码 `speller.alphabet` 含 `* ! ~ @`；yoyo-pure-km 的 `speller.alphabet`（`"zyxwvutsrqponmlkjihgfedcba;,./%ZYXWVUTSRQPONMLKJIHGFEDCBA:<>?_+'"`）**只含 `%`，缺 `* ! @`**——这就是 yoyo-pure-km 没有短语前缀命名空间的根因。

### 4.2 yoyo-pure-km 的 L2 设计（深模块）

**模块边界**：一个「短语前缀命名空间」——对外暴露的接口极小：`*`/`!`/`@` 三个前缀字符 + 一套「前缀码→短语」映射 + 一个 FSM 拦截 Pattern；内部隐藏发射、查表、提交逻辑。与现有 `%` 简词模块（Pattern S）结构同构、互不干扰。

**接口（调用方/用户须知）**：
- 手势：一次并击发射前缀（如 `*`，对应某保留并击组合），再一次并击出 1 个根字符 → `*X` = **2 击** 打出一条 4–8 字短语。
- 不变量：`*X` 与任何 `_X / +X / XY / %XY` 都不碰撞（首字符不同）。
- 性能：纯字典查表 + 长度判定，无正则、无 grammar，不破坏「零重码确定性」卖点。

**具体改动（4 处，均小且局部）**：

1. **`yoyo-pure-km.schema.yaml` + `yoyo.yaml`（空明拳/心法基）**：
   - `speller.alphabet` / `initials` 增加 `* ! @`（与 `%` 并列）。
   - `chord_composer.algebra` 增加发射规则（仿空明码 `xform`）：选 3 个**当前极少用的并击输出对**折叠成前缀，例如
     ```
     - xform/^XX$|*/     # 例：左 q 右 p 的并击折叠成 *（具体键位待定，原则是挑低频根对，代价仅丢失该根对码）
     - xform/^YY$|!/     # 同理发射 !
     - xform/^ZZ$|@/     # 同理发射 @
     ```
     > 设计决策点：前缀发射用「折叠某并击对」还是「新增修饰键」（如把某个符号键加进 `chord_composer.alphabet`）——前者零新增键、代价是丢 3 个根对码（可接受，挑低频对）；后者更干净但改动 `chord_composer.alphabet` 面更大。推荐前者，与空明码 `70→*` 同构。

2. **`lua/yoyo/pure_popping.lua`**：新增 **Pattern P**，与 Pattern S 完全同构，仅换首字符与映射表：
   ```lua
   -- ─── Pattern P: 短语前缀简词(* / ! / @ 前缀, 2击上屏) ──
   if input:sub(1,1):match("[*!@]") then
     local full = input .. incoming
     local text = pure_data.phrase_map and pure_data.phrase_map[full]
     if text then
       env.processing = true
       ctx:commit_text(text); return kAccepted   -- 吞掉末字符, 2击上屏
     elseif #full >= 2 then
       ctx:clear(); return kNoop                  -- 死码清空
     end
   end
   ```
   注：前缀并击折叠后输出单字符（`*`），下一并击出 1 根字符（`X`），故 `input..incoming` 在第 2 击末字符到达时凑成 `*X`，与空明码 `*A` 同构。

3. **`scripts/generate_pure_dict_map.py`**：在已有 `space_brief_map` 收集逻辑旁，新增 `phrase_map`：凡 `raw_code[1] in "*!@"` 且 `len==2`，收进 `phrase_map[code]=text`，并 `continue` 使其**不进入** `dict_map / chars_3code / words_4code`（与 `%` 同处理，不污染既有状态机）。

4. **`yoyo-user.dict.yaml`（或新增 `yoyo-pure-phrase.dict.yaml` 经 `import_tables` 引入）**：新增「短语前缀简词段」，频率排序取 top ~150–200 条 4–8 字短语：
   ```
   # === 短语前缀简词(仿空明码 * / ! / @, gen 写入) ===
   爱国主义	*A	0
   中华人民共和国	!Z	0
   中国特色社会主义	@B	0
   ```
   助记：前缀按语义分桶（`*` 专名/宏词、`!` 通用短语、`@` 口语惯用语），比空明码更规整；单字符索引（`*a…*Z`）每桶 ~52 槽，三桶 ~156 槽，足够覆盖头部固定搭配。

### 4.3 L2 的收益与边界（诚实口径）

- **聚合收益小**：`yoyo-pure-km-code-length-reduction.md` 词长分布显示 5+ 字词仅占文本 **1.2%**。L2 只压这部分（从 3–4 击→2 击），对整体「击/字」的下界改善约 **0.01–0.02**，远小于 L1（−12.4%）与 L3（更大）。
- **体感与对标价值大**：固定搭配（公文、标语、专有名词）一键 2 击，是空明码「码长极短」的标志性体验，且实现成本极低、风险可控。
- **不要高估**：L2 不是降码长的主战场，是「补齐空明码同款能力、顺手压固定搭配」的锦上添花。主战场是 L1 + L3。

---

## 5. 落地路线与建议

| 优先级 | 路线 | 改动性质 | 预期收益 | 风险 |
| :---: | :--- | :--- | :--- | :--- |
| **P0** | **L1 补满 `%`（换词源）** | 纯数据（改 `gen_brief_words.py` 词源 + `--write`） | 0.762→0.668（−12.4%） | 零 |
| **P0** | **2码‑覆盖 route‑P（179 单字进 `%`）** | 纯数据（追加 179 行 + 重生成 lua） | 前 1500 常用字 2 击覆盖率 100% | 低（需真机回归验证 `%` 单字一击） |
| **P1** | **L3 分层大词库 Core+Extended** | 新增 dict + `import_tables` + `priority_filter` 定序 | 最大杠杆，消除单字回落 | 中（重码定序、略削弱零重码口径） |
| **P2** | **L2 短语前缀命名空间** | schema 字母表 + chord xform + Pattern P + phrase_map + 词典段 | 固定搭配 2 击；体感/对标 | 低（挑低频根对发射前缀） |

**建议顺序**：先 P0（L1 + route‑P 都是纯数据、零风险，立即吃掉大部分剩余红利）；再做 P1 的 L3（这是真正对标空明码、拉开差距的一步）；L2 作为 P2 顺手补齐空明码同款招牌能力。

> 物理现实（沿用 2026‑09‑02 结论）：本架构在最优分词下可达地板约 **0.65–0.70 击/字**。L1 即吃掉大部分红利；L3 是突破地板的主结构性手段；L2 在小众长短语上锦上添花。

---

## 6. 来源与复现

| 依据 | 来源 |
| :--- | :--- |
| `%` 占用 996/3720、L1/L2/L3 未执行 | 本文件 grep `yoyo-user.dict.yaml` `\t%` 实测；`research/km_one_chord_tier1.txt` 行数 |
| L1 投影 0.762→0.668 | `docs/research/yoyo-pure-km-code-length-reduction.md` §4–§5（脚本 `research/audit_codelen_projection.py`） |
| route‑P 179→0 | `docs/research/yoyo-pure-km-2code-coverage.md` §3 |
| 空明码赢在词库（非编码） | `docs/research/2026-10-26-赛文实测-yoyo-pure-km-vs-空明码.md` 结论 |
| 空明码 `* / ! / @` 一手机制 | 一手源文件 `/home/jackwy/.local/share/fcitx5/rime/kongmingma.schema.yaml`、`kongmingma.dict.yaml`（背景研究 agent 复核：speller 含 `* ! ~ @ _`；`xform/(70)/*/` 等发射规则；`*`58/`!`44/`@`93 条；码形 `*A`=2 字符=2 击） |
| `%` 简词 / Pattern S 现有实现 | `rime/lua/yoyo/pure_popping.lua` L137–159；`rime/scripts/gen_brief_words.py`；`rime/scripts/generate_pure_dict_map.py` |
