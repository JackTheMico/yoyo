# 空明码如何进一步降低重码率 / 避免选重 —— 一手来源研究

> 研究目标：回答「空明码要如何才能进一步降低遇到重码的机率，或者说怎么尽量避免选重」。
> 方法：所有结论均回溯到一手来源——本仓词库（`.reasonix/kongmingma.dict.yaml`、`rime/yoyo-bm.dict.yaml`、`rime/yoyo-pure.dict.yaml`）、编码脚本（`.reasonix/compare_duplicate_rate.py`、`rime/scripts/generate_pure_dict_map.py`）、并击代数（`.reasonix/kongmingma.schema.yaml`、`rime/yoyo-pure-km.schema.yaml`）、交互状态机（`rime/lua/yoyo/pure_popping.lua`），以及空明码作者官方文档/站点（web 检索）。
> 口径说明：**【实测】**= 本仓脚本跑出的数字；**【官方声称】**= 作者/官网声明（本仓无可独立复现的权重列）；**【设计建议】**= 基于上述事实的策略推演，非已测量结果。
> 重码率口径统一为「条数重码率 = 共享同一编码的条目数 / 总条目数」（见 `.reasonix/duplicate-rate-comparison.md:6` 与 `compare_duplicate_rate.py:7-12`）。

---

## 摘要（结论先行）

1. **空明码的高重码率是「一义多码 + 短码 + 巨库」设计的固有代价，不是缺陷。**【实测】单字 49.92%、词 74.70%（`.reasonix/duplicate-rate-comparison.md:65-66`）；但 9.85% 的文本拥有多条编码（一义多码，`compare_duplicate_rate.py` 实测 268943/2727981），单条碰撞可换码绕过。
2. **空明码原生抗重码有四大机制**：音码路径零重码【官方声称 10252 音码汉字无重码】、一义多码换码、一码直出（一击字）、消歧后缀（本仓复算约 9700 条「X y」型，kongmingma 304万版实测 9701、kongmingmas 宏版S 9143，如 `Ab`→`艾 r`/`蔼 p`）、词组优先 + 顶功。
3. **重码高度集中在短码与定长码**：【实测·独立复算】单字 2 码 76.02%、4 码 52.29%；词 2 码 92.56%、4 码 76.00%；而**词 5 码及以上断崖至 <1%（5~7 码 0.43%~1.28%，8 码+≈0）**。因此「用更长词组/成语替代单字拼接」是降重码的最强杠杆。
4. **yoyo-pure-km 方向正确**：一义一码 + 单字 3 码 100% 零重码 + 0 空格 FSM 顶屏（`rime/lua/yoyo/pure_popping.lua`），但最大短板是**词库规模（8.2 万 vs 空明 300 万）**，应优先扩充。
5. **落地优先级**：P0 = 词库分层 + 长词扩充、一简/二码扩容；P1 = 选重键 `[`/`]` 翻页、`Control+u/i/w/e` 选 2~5、BackSpace 整码清空、标点并击；P2 = 导入空明码一击词、探索等长辅助码通道。**切勿为降重码而破坏单字 3 码零重码保证。**

---

## 一、空明码重码现状与成因（含实测数据）

### 1.1 全量重码率（本仓可复现）

来源：`.reasonix/compare_duplicate_rate.py`（读取 `.reasonix/kongmingma.dict.yaml` 3049550 条），与 `.reasonix/duplicate-rate-comparison.md:59-68` 一致。

| 维度 | 条目数 | 重码条目 | 条数重码率 |
|------|--------|----------|------------|
| 单字 | 36306（纯汉字 35940） | 18123 | **49.92%**（纯汉字 50.24%） |
| 词 | 3013139（纯汉字 3003348） | 2250694 | **74.70%**（纯汉字 74.62%） |
| 全量 | 3049550 | — | — |

对照 yoyo 纯形（`.reasonix/duplicate-rate-comparison.md:52-55`）：yoyo-bm 单字 6638、全码重码 67 组/134 字（2.02%），词 2.77%。**空明码全量重码率远高于 yoyo，但口径不可直接比较**——空明码是一义多码（同字多码，碰撞可换），yoyo 是一义一码（碰撞即真选重）。

### 1.2 重码按码长分布（本仓独立复算：对 `.reasonix/kongmingma.dict.yaml` v2025/08/06 按码长分组统计，口径与 `.reasonix/compare_duplicate_rate.py` 一致）

这是判断「重码集中在哪」的关键证据：

```
=== 单字（text 长度=1）重码率（按码长，独立复算）===
  码长1(符号): 条目=149    重码率=85.91%
  码长2(简/形码): 条目=1622  重码率=76.02%
  码长3: 条目=3     重码率=100.00%
  码长4(形码全码): 条目=31836 重码率=52.29%   ← 体量主体
  码长5: 条目=2     重码率=0.00%
=== 词（text 长度≥2）重码率（按码长，独立复算）===
  码长2(一击简词): 条目=13724 重码率=92.56%
  码长4(定长全码词): 条目=2948982 重码率=76.00%  ← 体量主体
  码长5: 条目=19903  重码率=0.43%
  码长6: 条目=3969   重码率=1.28%
  码长7: 条目=28889  重码率=0.43%
  码长8+: 条目=471   重码率≈0.00%
```

**结论**：重码几乎全部集中在两类——(a) 一击短码（2 码单字 76.02%、2 码词 92.56%，这是为「码长短」付出的代价）；(b) 标准定长码（4 码词 76.00%，因为 300 万词库挤进 4 码空间）。**越长的词组越唯一**：5 码及以上词组重码率断崖到 <1%。这直接指向「词组优先 / 用长词替代单字」是降重码首要杠杆（见第三节 b、第四节 P0）。

### 1.3 结构性重码成因：形码路径同字根群组

空明码是音形并击，「形码」路径按汉字部件取码，同字根字天然同码。本仓实测最典型：

- `ijpv`（心字底）同码 **56 个汉字**：忑/志/忢/怘/怷/恐/恥/恵/恶/悪/悫/惎/惠/惡/惪…（本仓复算；`duplicate-rate-comparison.md:65` 记为「心字底 8 字同码」，系举例，实际群组远大于 8，是取码规则使然）。
- `iggz`（冒/圜/岨/岫…）34 字；`igpv`（忠/思/恩/患/悬…）34 字；`iypv`（忘/応/恋/恣/意…）33 字；`iqpv`（怎/愁/憩…）32 字。

作者对此的官方态度（见第二节）是**刻意保留**——「1 万单字仅 15~25 对重码，且为非常用汉字，选重可忽略」（来源 tieba 贴吧 miouqq，空明作者思路）。

### 1.4 一义多码结构确认（本仓词库直证）

采样 `.reasonix/kongmingma.dict.yaml` 头部及全量统计，空明码每个字/词存在多条编码轨道：

- `志` 同时有 `ijpv` 与 `zjp=`（音码 z+jp / 形码 ijpv）——`duplicate-rate-comparison.md:64` 实证。
- `电脑` 有 `d5n=`/`d7`/`dgNd`/`dN`/`od` 等 5 条（`duplicate-rate-comparison.md:64`）。
- 全量：**268943 / 2727981（9.85%）纯汉字文本拥有 ≥2 条编码**（`compare_duplicate_rate.py` 实测）。

这正是「遇到重码换一条码就行」的底层机制（官方称「音码汉字无重码」，音码轨道与形码轨道天然分流）。

---

## 二、空明码原生的抗重码设计（官方/作者理念 + 本仓数据印证）

### 2.1 作者与方案背景【官方声称 / web】

- 作者：**黄贤飞**（设计于 2015 年），又名「声韵形并击码 / 曌码」；取名「空明」源自空明拳（周伯通左右互搏），对应左右手并击（gitee sharpcout README、github rime-kmm README）。
- 码元：60 个（a–Z 大小写 + `,.?!<;:/=` 等符号），左右手镜像各 60 码元，并击一次输出 2 码元。
- 继承「超强两笔」：10 个字根 + 5 种笔划（横竖撇点折），取码规律强、首码含声韵（音形结合）。

### 2.2 六条原生抗重码机制

| # | 机制 | 作者理念【官方声称】 | 本仓数据印证 |
|---|------|----------------------|--------------|
| 1 | **音码路径零重码** | 「10252 个音码汉字无重码」「GB2312 零选重」（rime-kmm README） | 音码轨道（如 `zjp=`）与形码（`ijpv`）分流，碰撞可换轨 |
| 2 | **一义多码 / 多轨** | 音码 + 形码 + 简码并存 | 9.85% 文本多编码（§1.4） |
| 3 | **一码直出（一击字）** | 「一击字 1500+」「一击词 1500+」「一击高频词 600+」（rime-kmm / jsxiaoshi 博客） | kongmingmas 一击单字 3079 + 一击词 1647（km_one_chord_words_recommend.md:10-11）；单键直出如 `啊 a=`/`安 A=`/`视 s=`。【官方声称一击字 1500+，本仓仅计 kongmingmas 宏版S 数据】 |
| 4 | **消歧后缀（原生辅助码）** | 未显式命名，但「分左右一简、右手单击顶功」隐含 | 本仓复算 **9701 条「X y」型条目**（kongmingma 304万版；kongmingmas 宏版S 9143，见 `research/km_one_chord_words_recommend.md:12`），如 `艾 r`/`蔼 p` 同码 `Ab`，`Ab`+`r` 直出「艾」、`Ab`+`p` 直出「蔼」— 见 §2.3 |
| 5 | **词组优先 + 大词库** | 「词库 300 万」「8 万高频词重码 0.09%」「高频词低重码」 | 词 5 码+ 几乎零重码（§1.2）；schema description 载「8 万高频词重码少(0.09%)」（`.reasonix/kongmingma.schema.yaml:12`） |
| 6 | **顶功（无空格上屏）** | 「右手单击顶功」「无后续编码自动上屏」 | `speller/auto_select: true`（`.reasonix/kongmingma.schema.yaml:81`） |

### 2.3 消歧后缀：空明码最被低估的原生抗重码技巧（本仓直证）

`Ab` 这个并击码在词库中挂了 8 个候选（本仓复算）：`艾`/`蔼 p`/`蔜 h`/`菴 k`/`荌 o`/`芺 q`/`艾 r`/`蓭 y`。其中：

```
艾      Ab        ← 基础码（首选）
蔼 p    Ab        ← 文本带后缀字母 p，敲 Ab 再敲 p 直出「蔼」
艾 r    Ab        ← 敲 Ab 再敲 r 直出「艾」
蔼      Abp=      ← 显式全码（后缀已并入码串）
艾      Abr=      ← 显式全码
```

**机制**：以「字根基础码」开候选组，用**一个消歧后缀字母**直接顶出组内特定字，避免翻页选重。本仓复算 `kongmingma.dict.yaml` 中此类「汉字+空格+字母」条目共 **9701 条**（kongmingmas 宏版S 为 9143 条，见 `research/km_one_chord_words_recommend.md:12`）。这正是五笔「末笔识别码」思想的并击化版本——**用第 4 个区分元消除同根重码**，且完全不增加主码长（后缀是附加击）。

### 2.4 候选调序与选重键（交互层）

- `speller/auto_select: true`（`.reasonix/kongmingma.schema.yaml:81`）：无后续编码即自动上屏首选，无需空格——顶功核心。
- 选重键体系（`kongmingma.schema.yaml:203-208`）：`[`/`]` 翻页（`bracketleft→Page_Up`、`bracketright→Page_Down`）；`Control+u/i/w/e` 直选第 2/3/4/5 候选（主键区，不离开基准键）。
- **动态用户词未开启**：`translator/enable_user_dict: false`（`.reasonix/kongmingma.schema.yaml:191`）——作者依赖巨库而非个性化调频。

### 2.5 与 yoyo 哲学的根本分歧

| | 空明码 | yoyo-pure-km |
|---|--------|--------------|
| 编码哲学 | 一义**多码**（音/形/简多轨） | 一义**一码** |
| 单字零重码 | 仅音码轨道；形码轨道保留少量重码（作者刻意） | 单字 3 码 **100% 零重码**（派生纯形保证） |
| 降重码主武器 | 换码 + 顶功 + 词组优先 | 编码唯一 + FSM 0 空格顶屏 |
| 词库 | 300 万巨库 | 8.2 万精选 |

> 关键洞察：空明码的「高重码率」被其**多轨换码 + 顶功 + 巨库词组**三重缓冲吸收，实际选重体验并不差；yoyo 把确定性押在「编码唯一」上，反而对词库规模和调序更敏感。

---

## 三、降低重码 / 避免选重的策略分类

每条标注：【依据】+【可操作性】+ 适用对象（空明码 / yoyo-pure-km / 两者）。

### (a) 编码层

**A1. 码长策略 —— 用更长码吸收重码**
- 【依据】本仓实测词 5 码+ 重码率 <1%（§1.2）；空明码官方「8 万高频词 0.09%」靠的是短码高频+长词唯一。
- 【可操作性】yoyo-pure-km 已固定「单字 3 码 / 词 4 码」（`rime/yoyo-pure.dict.yaml:13-18` 的 encoder formula）。对 4 字以上长词，可考虑**加长到 5~6 码**（空明码长词即如此），自然数百倍降低碰撞。但会牺牲码长——属【设计建议】，需权衡。
- 【适用】yoyo-pure-km（长词扩容时）。

**A2. 辅助码 / 识别码（第 4 区分元）—— 空明码「消歧后缀」范式**
- 【依据】本仓实测 `ijpv` 心字底 56 字同码（§1.3），而空明码用「基础码+后缀字母」约 9700 条化解（§2.3）；五笔末笔识别码同思路。
- 【可操作性】对 yoyo 纯形 3 码全码**已零重码**的 6638 字，**不可**在主线加第 4 码（会破坏保证）。但可设**独立辅助码通道**：当某 3 码字真需选重时，允许追加第 4 码（如末笔/结构索引）精确定位——类似空明码 `Ab`→`Abr=`。【设计建议】
- 【适用】yoyo-pure-km（长尾），空明码（已原生具备）。

**A3. 字根拆分 / 取码顺序细化**
- 【依据】空明码形码重码源于「同字根统一取码」（ijpv/iggz/igpv…）；yoyo 纯形已在编码里用 `b`/`c` 表示首/末部件索引（0/1）来离散（`yoyo-pure.dict.yaml` phrase formula `AbBbCbZb` 中 `b`/`c` 即 index）。
- 【可操作性】对高频同根群组，微调取码顺序或增加结构维度（上下/左右）降低同码。【设计建议】
- 【适用】两者（编码修订成本高，优先级低）。

**A4. 一义多码（多轨）**
- 【依据】空明码 9.85% 文本多码，换码即绕开（§1.4）。
- 【可操作性】yoyo 一义一码，不建议把多轨引入单字**主表**（会丢掉零重码卖点）；但可在**简码层**并存长短码（一简/二码/三码），已在做（一简 120 / 二码 3500 / 三码 6367，见 `research/yoyo-pure-km-one-stroke-count.md:22`）。
- 【适用】空明码（原生）；yoyo（仅限简码层）。

### (b) 词库层

**B1. 词组优先（最大杠杆）**
- 【依据】本仓实测词 5 码+ 近零重码（§1.2）；空明码 300 万词库使「打词不打字」成为常态。
- 【可操作性】yoyo-pure-km 现 8.2 万条（`docs/research/yoyo-pure-km-improvement-and-kongming-comparison.md:41`），4 字以上长词占比小，常回退为「2+2 拼词 / 逐字单打」——这正是选重高发场景。**扩充词库到 20~30 万 + 引入 4~8 字长词/成语**可显著降低单字拼接频率与选重。【实测指向】
- 【适用】yoyo-pure-km（最高优先级）。

**B2. 简码分配（高频字短码唯一）**
- 【依据】空明码一击字 1500+【官方声称】；yoyo 一简 120 / 二码 3500 / 三码 6367（`yoyo-pure-km-one-stroke-count.md`）。
- 【可操作性】把最高频 1500~3000 字都配一击/二码且保证唯一，等效空明码一码直出体验。【设计建议】
- 【适用】两者。

**B3. 词库分层 / 低频裁剪**
- 【依据】空明码全量词重码 74.7% 但集中于低频（高频 8 万仅 0.09%）；yoyo 全量重码率低但体量小。
- 【可操作性】yoyo 采用 **Core（8~10 万，零误触保证）+ Extended（20~30 万，import_tables 引入）** 分层（`docs/research/yoyo-pure-km-improvement-and-kongming-comparison.md:63-65`）。核心集保确定性，扩展集覆盖长尾。【设计建议】
- 【适用】yoyo-pure-km。

**B4. 动态用户词 / 频率学习**
- 【依据】空明码**未开** `enable_user_dict`（`.reasonix/kongmingma.schema.yaml:191`）；yoyo-pure-km **已开**（`rime/yoyo-pure-km.schema.yaml:26` `import_tables: [yoyo-user]`）。频加权重码率 yoyo 单字 0.00850 / 词 0.00356（`compare_duplicate_rate.py` 断言）。
- 【可操作性】强化用户词频学习（个人高频词自动上浮到 #1），让首选即所需。【实测指向】
- 【适用】yoyo-pure-km（已具备，可强化）。

### (c) 交互层（即使碰撞也避免选重）

**C1. 首选直出 / 顶功**
- 【依据】空明码 `speller/auto_select: true`（`.reasonix/kongmingma.schema.yaml:81`）；yoyo `pure_popping.lua` 用 FSM 实现 0 空格顶屏（更先进，详见 `pure_popping.lua:161-236` 的 Pattern A/E/G）。
- 【可操作性】yoyo 顶功架构领先，保持；确保 `auto_select` 在词组模式正确（当前 yoyo-pure-km `speller/auto_select: false`，靠 FSM 顶屏，见 `yoyo-pure-km.schema.yaml:94`）。
- 【适用】两者。

**C2. 智能调序 / 语境**
- 【依据】频加权后 yoyo 重码率降至 0.85%（单字）/0.36%（词）（`compare_duplicate_rate.py` tier3 断言）。
- 【可操作性】用 `sort: by_weight` + 用户词频 + n-gram 语境让 #1 候选正确；Rime `table_translator` 权重排序天然支持（`yoyo-pure.dict.yaml:6` 已是 by_weight）。
- 【适用】两者。

**C3. 次选直出（避免翻页）**
- 【依据】yoyo-pure-km 有 `'` 并击次选直出（`pure_popping.lua:113-128`）与 `%` 空格简词 995 条一击上屏（`:141-159`）；空明码靠 `Control+u/i/w/e` 选 2~5。
- 【可操作性】yoyo 的 `'` 次选比空明码数字键更丝滑，保留并扩展候选数（现 dict_map_2 仅存第 2 候选，`generate_pure_dict_map.py:108-111`）。
- 【适用】yoyo-pure-km（领先），空明码（可借鉴）。

**C4. 选重键人体工学**
- 【依据】空明码 `[`/`]` 翻页 + `Control+u/i/w/e` 选 2~5（`kongmingma.schema.yaml:203-208`），主键区不离手。
- 【可操作性】yoyo-pure-km 当前长尾（3 选+）仍靠数字键 `3/4/5`（`yoyo-pure-km-improvement-and-kongming-comparison.md:116`）。建议补 `[`/`]` 翻页 + `Control+u/i/w/e` 选 2~5（几乎零成本，照抄空明码 key_binder）。
- 【适用】yoyo-pure-km（补强）。

**C5. 一义多码换码（遇重换码）**
- 【依据】空明码 `艾 Abr=` 替代 `Ab` 直出（`§2.3`）。
- 【可操作性】yoyo 一义一码无法换码；但可暴露「等长辅助码通道」（A2）达到同等效果。
- 【适用】空明码（原生）；yoyo（通道化）。

### (d) Rime 具体实现点

| Rime 特性 | 实现位置 | 作用 |
|-----------|----------|------|
| `speller/auto_select` | `.reasonix/kongmingma.schema.yaml:81`（空明码 true）；`yoyo-pure-km.schema.yaml:94`（false，靠 FSM） | 顶功/首选直出 |
| `table_translator` `enable_user_dict` | `.reasonix/kongmingma.schema.yaml:191`（false）；`yoyo-pure-km.schema.yaml:26`（import yoyo-user，true） | 动态用户词 |
| `table_translator` `enable_completion` | `.reasonix/kongmingma.schema.yaml:189`（true） | 编码未输全即显示候选 |
| `lua_processor@pure_popping` | `rime/yoyo-pure-km.schema.yaml:48` | 0 空格 FSM 顶屏 / 4 码切分 |
| `lua_processor@km_punct` | `yoyo-pure-km.schema.yaml:47` | 标点并击 |
| `lua_filter@priority_filter` | `yoyo-pure-km.schema.yaml:59` | 主单/主词优先级调序 |
| `reverse_lookup`（反查） | `rime/lua/yoyo/reverse_lookup.lua` + `yoyo.yaml` | 看编码反查，辅助记码 |
| `simplifier`（OpenCC s2t） | `.reasonix/kongmingma.schema.yaml:58-60` | 简繁切换 |
| `key_binder`（选重/翻页/BackSpace） | `.reasonix/kongmingma.schema.yaml:199-213`；`yoyo-pure-km.schema.yaml:63-67` | 选重键人体工学 |
| `chord_composer/algebra` | `.reasonix/kongmingma.schema.yaml:90-180` | 并击→码元映射（编码心脏） |

---

## 四、针对 yoyo-pure-km 的落地路线图

原则：**吸收空明码的「词组优先 + 一码直出 + 顶功 + 选重键人体工学」；不破坏「单字 3 码 100% 零重码」这一 yoyo 核心卖点。** 所有「降重码」努力应优先投向词库与交互，而非改动单字主编码。

### P0（高优先级，杠杆最大）

**P0-1 词库分层 + 长词/成语扩充**
- 改动：新建 `rime/yoyo-pure-ext.dict.yaml`（20~30 万，覆盖成语大辞典、全国地名、科技术语、流行词），在 `rime/yoyo-pure-km.schema.yaml:26` 的 `import_tables` 增加 `yoyo-pure-ext`；并扩充 4~8 字长词。
- 预期收益：直接降低「单字拼接 / 2+2 拼词」频率（选重高发场景）。空明码实证长词近零重码（§1.2），yoyo 长词若加至 5~6 码亦可数百倍降碰撞。
- 工作量：3~4 h（含 `generate_pure_dict_map.py` 重跑）。
- 依据：本仓 §1.2、§3.B1；`docs/research/yoyo-pure-km-improvement-and-kongming-comparison.md:63-65`。

**P0-2 一简 / 二码扩容（高频字唯一短码）**
- 改动：`rime/yoyo-pure.dict.yaml` 扩大一简（120→更高）、二码（3500→覆盖更高频字），保证短码唯一。
- 预期收益：等效空明码一码直出（1500+ 字），进一步减少选重。【设计建议，需保证唯一性】
- 工作量：1~2 h。
- 依据：§2.2 机制 3、§3.B2。

### P1（中优先级，体验补强）

**P1-1 选重键 `[`/`]` 翻页 + `Control+u/i/w/e` 选 2~5**
- 改动：`rime/yoyo-pure-km.schema.yaml` `key_binder` 照抄空明码（`.reasonix/kongmingma.schema.yaml:203-208`）。
- 预期收益：长尾 3 选+ 不必移手上数字键，选重更顺。
- 工作量：0.5 h。
- 依据：§2.4、§3.C4。

**P1-2 BackSpace 整码清空（误触流控）**
- 改动：`yoyo-pure-km.schema.yaml:65` 已有 `BackSpace→Escape`；在 `pure_popping.lua` 拦截 BackSpace 实现按「击/码元」整块回退（现 FSM 按字符长度推断，删半码会残断头）。
- 预期收益：盲打误触后一键重打，避免断头码导致的假死/误顶。
- 工作量：0.5 h。
- 依据：`docs/research/yoyo-pure-km-improvement-and-kongming-comparison.md:75-88`。

**P1-3 常用标点并击补全**
- 改动：`rime/lua/yoyo/km_punct.lua` 补全 `。`/`，`/！/`？/`《》/`（）` 双手并击映射，对标空明码 `chord_composer`（`kongmingma.schema.yaml:92-98`）。
- 预期收益：标点全程 0 空格并击，减少「打标点打断顶功流」带来的选重上下文丢失。
- 工作量：1.5 h。
- 依据：`docs/research/yoyo-pure-km-improvement-and-kongming-comparison.md:90-101`。

**P1-4 默认「主词优先」或智能切换**
- 改动：`yoyo-pure-km.schema.yaml:39-41` 已有 `word_priority` 开关（`Control+Shift+C` 切换）；建议默认或按上下文自动主词（词组优先即降重码）。
- 预期收益：常用输入直接出词，减少单字选重。
- 工作量：0.5 h。
- 依据：§3.B1、§2.2 机制 5。

### P2（低优先级，长尾/探索）

**P2-1 导入空明码一击词**
- 改动：将 `research/km_one_chord_tier1.txt` 的 1166 个差集候选（词频降序，已剔除重叠）写入 `rime/yoyo-user.dict.yaml`；重跑 `generate_pure_dict_map.py`。
- 预期收益：一击词 3563 → 4730+（`yoyo-pure-km-one-stroke-count.md:23,48`），一击覆盖率追平空明码一击词 1500+【官方声称】水平。
- 工作量：1 h。
- 依据：`research/km_one_chord_words_recommend.md`（含分档建议）、§2.2 机制 3。

**P2-2 等长辅助码通道（探索）**
- 改动：对 3 码全码已零重码的 6638 字**保持不动**；仅对「确需选重」的长尾（扩展字/罕见同根）开放第 4 码辅助通道（末笔/结构识别，仿空明码消歧后缀 `Ab`→`Abr=`）。**绝不污染主零重码保证**。
- 预期收益：长尾选重近乎归零，且不破坏核心确定性。
- 工作量：4 h（需验证不与 FSM 冲突）。
- 依据：§2.3、§3.A2。
- ⚠️ 风险：可能干扰 `pure_popping.lua` 的 4 码词自动切分（Pattern F/G），须以独立前缀/后缀位区分「辅助码」与「4 码词」。

**P2-3 动态用户词频学习强化**
- 改动：`yoyo-pure-km.schema.yaml` translator 强化 `enable_user_dict` + 用户词频持久化；`priority_filter.lua` 引入个人 n-gram。
- 预期收益：个人高频词自动上浮 #1（频加权已实测降至 0.85%/0.36%，§3.C2）。
- 工作量：1 h。

**P2-4 简繁 / Emoji / 日期生态挂载**
- 改动：引入 OpenCC `s2t.json`、`emoji.json`、`date_translator`（对标 `kongmingma.schema.yaml:58-65`）。
- 预期收益：开箱即用体验追平空明码，间接减少因切换输入法带来的选重中断。
- 工作量：1~2 h。

### 不采纳项（明确禁止）

- ❌ **不要在单字主表引入一义多码或第 4 码到全码层**——会破坏 yoyo「单字 3 码 100% 零重码」的核心保证（`yoyo-pure-km.schema.yaml:7` 的卖点）。辅助码只能走独立通道（P2-2）。
- ❌ **不要盲目照搬空明码 300 万全量词库**——其 74.7% 词重码率会污染 yoyo 的确定性；必须分层（P0-1）且核心集保零误触。

---

## 五、参考来源

### 本仓一手文件（repo，绝对路径）

| 数据点 | 文件:行 |
|--------|---------|
| 空明码全量重码率 49.92%/74.70% | `/home/jackwy/codes/rime/yoyo/.reasonix/duplicate-rate-comparison.md:59-68` |
| 统计口径（条数重码率） | `/home/jackwy/codes/rime/yoyo/.reasonix/duplicate-rate-comparison.md:6,28-34` |
| 一义多码 9.9%（2727981 中 268943） | `/home/jackwy/codes/rime/yoyo/.reasonix/duplicate-rate-comparison.md:64` |
| 心字底 ijpv 同码、单字/词重码示例 | `/home/jackwy/codes/rime/yoyo/.reasonix/duplicate-rate-comparison.md:65-66` |
| 对比脚本（可复现） | `/home/jackwy/codes/rime/yoyo/.reasonix/compare_duplicate_rate.py`（main 289-336；断言 178-260；频加权 158-166,226-228） |
| 空明码词库 3049550 条 | `/home/jackwy/codes/rime/yoyo/.reasonix/kongmingma.dict.yaml`（首部 + 全量） |
| `啊 a=`/`安 A=` 等一码直出 | `/home/jackwy/codes/rime/yoyo/.reasonix/kongmingma.dict.yaml:8-65`（head） |
| `艾 Ab`/`蔼 p Ab`/`艾 r Ab` 消歧后缀 | `/home/jackwy/codes/rime/yoyo/.reasonix/kongmingma.dict.yaml:1157,1159,1169`（grep 实测） |
| 空明码并击代数（编码心脏） | `/home/jackwy/codes/rime/yoyo/.reasonix/kongmingma.schema.yaml:90-180` |
| 空明码 `speller/auto_select: true` | `/home/jackwy/codes/rime/yoyo/.reasonix/kongmingma.schema.yaml:81` |
| 空明码 `enable_user_dict: false` | `/home/jackwy/codes/rime/yoyo/.reasonix/kongmingma.schema.yaml:191` |
| 空明码选重键 `[`/`]` + Ctrl+u/i/w/e | `/home/jackwy/codes/rime/yoyo/.reasonix/kongmingma.schema.yaml:203-208` |
| 空明码 schema description（300万/0.09%） | `/home/jackwy/codes/rime/yoyo/.reasonix/kongmingma.schema.yaml:12` |
| yoyo-bm 单字 6638、重码 67组/134字、词2.77% | `/home/jackwy/codes/rime/yoyo/.reasonix/duplicate-rate-comparison.md:52-55`；`compare_duplicate_rate.py:285-311` |
| yoyo 编码归一 `[-=_+]//g` | `/home/jackwy/codes/rime/yoyo/rime/yoyo-bm.schema.yaml:34`（见 md:31） |
| yoyo-pure-km 单字3码100%零重码描述 | `/home/jackwy/codes/rime/yoyo/rime/yoyo-pure-km.schema.yaml:7` |
| yoyo-pure-km 词组 formula（2字 AbAcBbBc / 3字 AbBbCbCc / 4字 AbBbCbZb） | `/home/jackwy/codes/rime/yoyo/rime/yoyo-pure.dict.yaml:11-18` |
| yoyo-pure-km `auto_select: false`（靠FSM） | `/home/jackwy/codes/rime/yoyo/rime/yoyo-pure-km.schema.yaml:94` |
| yoyo-pure-km 开关（word_priority / 顶屏） | `/home/jackwy/codes/rime/yoyo/rime/yoyo-pure-km.schema.yaml:36-41` |
| yoyo-pure-km key_binder（BackSpace/word_priority） | `/home/jackwy/codes/rime/yoyo/rime/yoyo-pure-km.schema.yaml:63-67` |
| yoyo-pure-km 并击心法（% 空格简词 / _ + 前缀） | `/home/jackwy/codes/rime/yoyo/rime/yoyo-pure-km.schema.yaml:105-119` |
| pure_popping.lua FSM 顶屏（Pattern A/E/G、'次选、%简词） | `/home/jackwy/codes/rime/yoyo/rime/lua/yoyo/pure_popping.lua:113-159,161-236` |
| generate_pure_dict_map.py（dict_map/words_4code/chars_3code/space_brief_map） | `/home/jackwy/codes/rime/yoyo/rime/scripts/generate_pure_dict_map.py:43-151` |
| 一击量统计（yoyo 7363 / 空明差集1166） | `/home/jackwy/codes/rime/yoyo/research/yoyo-pure-km-one-stroke-count.md`（全篇） |
| 空明码一击词→yoyo 增补（3079+9143+1647；差集1166） | `/home/jackwy/codes/rime/yoyo/research/km_one_chord_words_recommend.md:5-19,33-75` |
| 空明码/ yoyo 对比与改进（分层词库/标点/选重键） | `/home/jackwy/codes/rime/yoyo/docs/research/yoyo-pure-km-improvement-and-kongming-comparison.md`（全篇，尤 63-117） |
| 本仓按码长重码分布、一击字、消歧后缀、ijpv 群组（本报告独立复算，脚本 `/tmp/verify_km_dup.py`，已对 `kongmingma.dict.yaml` v2025/08/06 直接计算） | — |

### Web 一手 / 官方来源（作者理念）

| 主题 | URL |
|------|-----|
| 空明码简介（作者黄贤飞 / 速录宝，60码元、音码无重码、300万词库、一击字1500+） | https://gitee.com/miounet/sharpcout （README「空明码简介」段） |
| rime-kmm（空明码并击方案，10252音码汉字无重码、GB2312零选重、一击字1500+、平均码长0.8） | https://www.github.com/miounet/rime-kmm （README） |
| 空明码使用体验（重码比五笔低20倍、1万汉字25对重码为非常用、一击字3000+/一击高频词600+、分左右一简、右手单击顶功） | http://cloud.jsxiaoshi.com/post_index/tid/3221 （打字圈 jsxiaoshi 博客） |
| 空明码作者思路（1万单字仅15~25对重码、3500内无重码、刻意保留重码、60码元+并击解决重码） | https://static.tieba.baidu.com/p/7791426748 （贴吧 miouqq） |
| 顶功 / 前缀码 术语定义（用于界定空明码 auto_select 与 yoyo FSM 顶屏） | https://shurufa.app/zht/docs/concepts （琼林撷英·中文输入法术语） |

---

> 说明：本报告中所有【实测】数字均来自本仓脚本（`.reasonix/compare_duplicate_rate.py` 及本次独立复算脚本，对 `.reasonix/kongmingma.dict.yaml` v2025/08/06 与 `rime/yoyo-bm.dict.yaml` 直接计算，复算脚本见 `/tmp/verify_km_dup.py`）；【官方声称】来自作者站点且本仓无权重列可独立复现，引用时请连同口径。两仓字典版本若有更新，重跑脚本即可刷新。
