# 反查（Reverse Lookup）能否包含空格并击简词（`%` 版）编码？

> 调查结论先说：**能，而且现在就已经"部分、偶然"地包含了**——只是大部分简码被权重选择覆盖、单手简码还被 `strip_marks` 误剥了手指示符。要让它"完整且正确"地包含，需改 `generate_reverse_data.py`（必要时小改 `reverse_lookup.lua`），并与 `pure_popping.lua` 的 `space_brief_map` 互不冲突。
>
> **实施状态（2026-08-31）**：已采用本报告 §4.2「方案 B（主码+简码并存）」落地，并修正了原方案未预见的两点：
> 1. `load_word_codes` 改为同时产出 `full_map`（非 `%` 全码）与 `brief_map`（`%` 简码），**主码固定取全码**而非按权重被简码反超（否则如 `艾灸` 只显示 `%pL` 而丢失全码 `plLO`）；用户新增纯简码词（无全码）回退为简码仍可反查。
> 2. 简码作为候选第 4 元素 `{text, code, weight, brief}` 挂载；`self_check` 第 8 项对 `%` 前缀主码整体跳过（否则 `%+M` 类纯简码词触发中断）。
> 反查注释现为 `全码 | 简码`（例：`vpxb | %_v`、`plLO | %pL`）。`gen_brief_words.py --write` 已同步重生成反查分片。改动文件：`generate_reverse_data.py`、`reverse_lookup.lua`、`gen_brief_words.py`。

所有论断均引用一手源码（文件路径 + 行号）。

---

## 1. 反查数据结构

**文件**：`rime/lua/yoyo/data/reverse_a.lua`（24 个分片之一，按拼音首字母分文件）

反查表**不是**「汉字/词 → 编码」，而是「**无声调全拼键 → [{字词, 显示码, 权重}, ...]**」。键是拼音（如 `a`、`aijiu`），值是一个数组，每个元素是 `{text, code, weight}` 三元组。

真实示例（`reverse_a.lua:2-3`）：

```lua
return {
  ["a"] = {{"啊","bY",915.0}, {"阿","Yx",749.0}, {"啊","bY",537.0}, ...},
```

带简词的真实示例（从 `reverse_*.lua` 中抽取，行号因分片而异，非固定行）：

```lua
["aijiu"] = {{"艾灸","%pL",629.0}},
["aiwo"]  = {{"爱我","%At",1144.0}},
["anquandiyi"] = {{"安全第一","%L",352.0}},
```

> **纠正一个前提假设**：调查报告里设想的 `reverse_a["啊"] = "..."` 形式并不存在。反查的索引键是**拼音**，不是汉字。用户反查时输入 `` ` `` + 拼音（如 `` `aijiu ``），`reverse_lookup.lua:39-100` 按拼音前缀匹配，把命中词作为候选，**注释（comment）就是显示码**（`reverse_lookup.lua:87-98` 中 `cand.comment = c[2]`）。

---

## 2. 反查生成逻辑（`generate_reverse_data.py` 全文）

### 2.1 源数据从哪里来

- **核心字/词主码**：`select_core_dict()`（`generate_reverse_data.py:45-50`）优先 `rime/yoyo-pure.dict.yaml`，缺失回退 `yoyo-bm.dict.yaml`。
- **用户词表（含 `%` 简词）**：`USER_DICT = RIME_DIR / "yoyo-user.dict.yaml"`（`:42`）。主流程 `:538-544` 把 core + user dict 合并成 `entries_all`：

```python
dict_sources = [core]
if USER_DICT.exists():
    dict_sources.append(USER_DICT)
entries_all = []
for s in dict_sources:
    entries_all.extend(parse_dict_yaml(s))
word_codes_map, word_codes_full = load_word_codes(entries_all)
```

**结论**：`generate_reverse_data.py` **确实读取** `yoyo-user.dict.yaml` 里的 `%` 简词条（经 `parse_dict_yaml` 解析为 `(text, code, weight)`），并不是只从 `yoyo-pure/yoyo-bm` 读。

### 2.2 它是否过滤/跳过 `%` 前缀？——**否**

`load_word_codes`（`generate_reverse_data.py:162-184`）对所有 `len(text) > 1` 的条目，统一 `stripped = strip_marks(code)` 后按**权重最大**者入选（同权重取去标记后最短）。`%` 简词条也会经此入选，只要它的权重 ≥ core 主码权重。

`strip_marks`（`generate_reverse_data.py:79-81`）依赖 `MARK_CHARS`：

```python
MARK_CHARS = set("!@-_+()[]=")          # 行 57
def strip_marks(code: str) -> str:
    return "".join(c for c in code if c not in MARK_CHARS)
```

- **`%` 不在 `MARK_CHARS` 中** → `%` 被保留。
- **`_` 和 `+` 在 `MARK_CHARS` 中** → 会被剥掉。这正是单手简码 `%_X`/`%+X` 的"手指示符"，剥掉后变成 `%X`，**丢失了"左手+空格/右手+空格"的关键信息**（详见 §3、§4）。
- 空格本身不在 `MARK_CHARS`，但简码形如 `%XY`/`%_X`/`%+X`，**码内不含空格**，所以空格问题不涉及。
- 冒号 `:` 也不在 `MARK_CHARS`，如 `%u:` 保留为 `%u:`。

### 2.3 词如何进入反查（拼音键的来源）

`load_word_pinyin`（`generate_reverse_data.py:212-254`）从 `base.dict.yaml.gz`（白霜词库）读词拼音；`build_candidates`（`:288-309`）只在 `word in word_pinyin` 时才把该词加入候选（`:302-307`）。即：**一个词要进反查，必须同时 (a) 在 base 拼音源里有拼音，(b) 其 `%` 条目的权重在 `load_word_codes` 的"最大权重"竞争中胜出**。

---

## 3. 简词编码现状（grep 实证）

### 3.1 反查当前已含 `%` 简码，但是「部分、偶然」

```
$ grep -l "%" rime/lua/yoyo/data/reverse_*.lua | wc -l     # 22 个分片含 %
$ grep -hoE "%[A-Za-z_+:]+" reverse_*.lua | wc -l          # 共 108 条 % 码
```

源数据侧：`yoyo-user.dict.yaml` 共有 **995 条** `%` 简词（自动段 ~935 + 手动段若干；脚本 `gen_brief_words.py` 生成，权重为词频）。

用脚本精确比对「简码是否进反查」（`/tmp/analyze.py` 实证）：

- 995 条 `%` 简词**全部**在 base 拼音源里有拼音 → 都能进 `build_candidates` 的候选池。
- 但 `load_word_codes` 按**最大权重**选码：core 主码权重是语料词频（常见词达百万级，如 `这种` core 权重 3182828、`记忆` 568293），而自动段简码权重是 tier1 词频（如 `这种` 273350）、手动段简码权重仅 `100.0`。
- 结果：**仅约 115 条** `%` 简词因简码权重 ≥ core 主码权重而入选 → 反查里实际出现 **108 条** `%` 码（其余 ~880 条高频简词被 core 主码"权重覆盖"，反查显示的是普通形码，如 `这种` 显示 `vpxb` 而非 `%_v`）。

### 3.2 单手简码被 `strip_marks` 误剥（显示 bug）

108 条 `%` 码的形态分布：

- **93 条是双手续 `%XY` 形式**（无 `_`/`+`，不被剥），显示正确，如 `%pL`、`%At`、`%L`。
- **15 条是单手 `%_X`/`%+X` 形式**，但 `_`/`+` 被 `strip_marks` 剥掉，显示成 `%X`（如应为 `%_a` 却显示 `%a`）——共 15 条（`grep -hoE "\"%[A-Za-z]\","` 计数）。这是**误导性显示**：用户照着打的 `%a` 并不在 `space_brief_map` 里（那里是 `%_a`），打不出词。

```
$ grep -hoE "%_[A-Za-z]" reverse_*.lua | wc -l   # 0（反查里已无完整 %_ 形态）
$ grep -hoE "%\+[A-Za-z]" reverse_*.lua | wc -l  # 0（反查里已无完整 %+ 形态）
```

### 3.3 `'` 反查条目——确认已移除

```
$ grep -rn "'" rime/lua/yoyo/data/reverse_*.lua   # 空，无任何单引号码
```

Git 历史印证：

- `faeb5e4 feat(纯形): 新增前置单引号扩展简词（' 前缀 3720 码位，已落库 992 条）` —— 曾加入 `'` 简词。
- `d4a9280 refactor(pure-km): 移除单引号前置简词，仅保留空格并击版` —— `'` 简词从源 `yoyo-user.dict.yaml` 移除。
- `1ce6696 fix(rime): 拼音反查支持用户词表并加拼音兜底` —— 反查改为读取 user dict。

因为反查数据源就是 user dict，源里删了 `'`，反查自然不再含 `'` 条目。**现状：反查含 `%` 简码（部分/偶然），不含 `'` 简码。** 与 working memory「reverse_*.lua 移除 ' 反查条目」一致。

---

## 4. 可行性结论

**核心问题：能不能把 `%` 版简词的编码加进反查？**

**能。** 机制上已经"自动"把 user dict 的 `%` 条目读进来了，只是被两道关卡挡住/改坏：

1. **权重覆盖**：`load_word_codes` 取最大权重 → 绝大多数高频简词让位于 core 主码（§3.1）。
2. **`strip_marks` 误剥 `_`/`+`**：单手简码手指示符丢失（§3.2）。

### 4.1 触发与显示

- 反查按**拼音**索引，`%` 码只是 `cand.comment` 显示的字符串（`reverse_lookup.lua:87-98`，对 `%` 无任何过滤）。所以 `%u:`、`%_v` 这类码在反查界面**能正常显示**。
- 用户选中反查候选时提交的是**词本身**（如「艾灸」），不是码；`%` 码不参与触发，因此**不存在触发冲突**。
- 唯一风险是"误剥后的 `%a`"会误导用户去打一个不存在的码（见 §3.2、§4.3）。

### 4.2 要改哪些文件、改什么

**A. `rime/scripts/generate_reverse_data.py`（主要改造点）**

1. **让 `%` 简码"必中"**：在 `load_word_codes` 之后（或之内）对 `%` 条目做 overlay：单独解析 user dict 的 `%` 条目成 `brief_map = {text: raw_code}`，对 `word_codes_map` 里命中 `brief_map` 的词，强制把显示码设为简码（不参加权重竞争）。这样 995 条简词全部显示简码。
2. **修复 `strip_marks` 对 `%` 码的误剥**：`%` 码的 `_`/`+` 是手指示符，必须保留。最小改法——在调用 `strip_marks` 处特判：`stripped = code if code.startswith("%") else strip_marks(code)`（建议放在 `load_word_codes` 的 `:172` 附近，以及 `load_char_codes` 不受影响无需动）。
3. **`self_check` 必须放过 `%` 码（关键！否则生成会中断）**：第 8 项自检（`generate_reverse_data.py:477-498`）会 `if any(c in MARK_CHARS for c in code)` 报 `[FAIL]` 并 `sys.exit(1)`（`:576-578`）。保留 `_`/`+` 后的 `%_v` 含 `_` ∈ `MARK_CHARS`，会被判异常而**拒绝写文件**。必须在 item 8 跳过 `code.startswith("%")` 的条目；同时该检查里的"码长奇数"判定（`len(code) % 2 != 0`，`:484`）对 `%` 码无意义，也应跳过。

**B. `rime/lua/yoyo/reverse_lookup.lua`（按需小改）**

- **若只"用简码替换主码"**：本文件**无需改动**——它只渲染 `c[2]` 为 comment（`:87-98`），`generate_reverse_data.py` 把 `c[2]` 写成 `%` 码即可。
- **若想"主码 + 简码同时显示"**：需改数据形态。`render_shard`（`generate_reverse_data.py:330-340`）现为 `{"text","code",weight}`，可扩成 `{"text","main","%brief",weight}`；`reverse_lookup.lua` 则把 comment 拼成 `主码 | %简码`，并留意 `:74` 的 `yielded[text]` 去重——同一词只出一次候选，正好容纳两个码，无需调整去重。

**C. `tools/yoyo-km-tui`（Rust）`rebuild()`**

- 据现有设计，`rebuild()` 已会重生成 `pure_dict_map.lua` + `reverse_*.lua` + 部署（见任务背景）。改完 `generate_reverse_data.py` 后，加词/重写流程自动重算反查，**该 Rust 工具无需改**（除非你新增独立反查源）。

### 4.3 与 `pure_popping.lua` 的 `space_brief_map` 是否冲突？

**不冲突，是两套独立机制，且有互补价值。**

- `space_brief_map`（`generate_pure_dict_map.py:50-54` 生成、`pure_dict_map.lua:135-138` 输出）= `%code → 词`，供**输入时**一击上屏：Pattern S（`pure_popping.lua:137-159`，`input:sub(1,1)=="%"` 时逐字符注入、末字符命中即提交并吞掉）调用。
- 反查 `reverse_*.lua` = 拼音 → 只读显示，供**查码/学码**。
- 两者文件不同、表不同、代码路径不同；往 `reverse_*.lua` 加 `%` 码**不会触碰** `space_brief_map`。
- 真正的关系是**正向协同**：用户在反查里看到 `%_v` → 学会后用空格并击打出来（走 Pattern S）。所以反查里**必须显示完整的 `%_v`/`%+X`**，而不能是被剥成 `%v` 的残码——这反过来要求 §4.2-A.2/3 的修复。

---

## 5. 最小可行改造方案（含示例）

**目标**：让全部 995 条 `%` 简词在反查里显示**正确且完整**的简码（以简码替换主码；主码场景仍可用常规反查路径覆盖不到时回退）。

**改动 1 — `generate_reverse_data.py`，`load_word_codes` 内（约 :162-184）**

```python
# 读取 % 简词（来自 user dict），作为强制 overlay
brief_map = {}  # text -> raw %code（保留 %/_/+，不剥）
for text, code, _w in entries:
    if code.startswith("%"):
        brief_map.setdefault(text, code)

# 现有循环里把 stripped 计算改为：
for text, code, weight in entries:
    if len(text) <= 1:
        continue
    # % 简码保留原样（含 _/+ 手指示符），其余照常去标记
    stripped = code if code.startswith("%") else strip_marks(code)
    if not stripped:
        continue
    cur = word_codes.get(text)
    if cur is None:
        word_codes[text] = (stripped, weight)
    else:
        cur_code, cur_w = cur
        if weight > cur_w or (weight == cur_w and len(stripped) < len(cur_code)):
            word_codes[text] = (stripped, weight)

# 循环后强制 overlay：简词一律显示简码
for text, brief in brief_map.items():
    word_codes[text] = (brief, word_codes.get(text, (brief, 0.0))[1])
```

**改动 2 — `self_check` 第 8 项（约 :477-498）放过 `%` 码**

```python
for text, code, _ in items:
    if code.startswith("%"):
        continue  # % 简码含 _/+ 与奇长度，跳过标记/长度自检
    if any(c in MARK_CHARS for c in code):
        bad_codes.append((text, code))
        continue
    if len(code) > 24:
        bad_codes.append((text, code))
```

> 注：`render_shard`（`generate_reverse_data.py:330-340`）与 `reverse_lookup.lua` 的 `cand.comment = c[2]`（`:87-98`）**无需改动**，简码会原样显示。

**改造前后示例对照**

| 词 | 当前反查显示 | 改造后显示 | 说明 |
|----|------------|-----------|------|
| 艾灸 | `%pL` | `%pL` | 双手续码，原本就正确（权重恰好胜出） |
| 这种 | `vpxb`（主码） | `%_v` | 单手简码原本被 core 权重覆盖，且 `_` 会被剥；改造后强制显示完整 `%_v` |
| 记忆（手动 `%u:`） | 不显示简码（显示主码或缺失） | `%u:` | 手动简码权重仅 100，原被 core 568293 覆盖；改造后强制显示 |
| 某单手简词 | `%a`（误剥，打不出） | `%_a` | 修复 strip_marks 误剥，恢复手指示符 |

**验证建议**

```bash
cd rime && python3 scripts/generate_reverse_data.py --dry-run   # 自检应通过
grep -hoE "%[A-Za-z_+:]+" lua/yoyo/data/reverse_*.lua | wc -l    # 应从 108 增至 ~995
python3 scripts/generate_reverse_data.py                        # 实际写文件
```
再用 `yoyo-km-tui` 加/重写词触发 `rebuild()` 验证自动化链路。

---

## 附：关键代码位置速查

| 关注点 | 文件:行 |
|--------|---------|
| 反查分片真实形态 | `rime/lua/yoyo/data/reverse_a.lua:2-3` |
| 反查翻译器（按拼音、comment=c[2]） | `rime/lua/yoyo/reverse_lookup.lua:39-100`，注释赋值 `:87-98` |
| 核心/用户词典来源合并 | `generate_reverse_data.py:42, 45-50, 538-544` |
| 词码按最大权重入选 | `generate_reverse_data.py:162-184` |
| `MARK_CHARS`（含 `_`/`+`，不含 `%`） | `generate_reverse_data.py:57` |
| `strip_marks`（会剥 `_`/`+`） | `generate_reverse_data.py:79-81` |
| 词进反查需有拼音 | `generate_reverse_data.py:212-254, 288-309` |
| 自检第 8 项（会误判 `%` 码致中断） | `generate_reverse_data.py:477-498, 576-578` |
| 分片渲染形态 | `generate_reverse_data.py:330-340` |
| `space_brief_map` 生成（输入时一击上屏） | `generate_pure_dict_map.py:50-54, 135-138` |
| Pattern S 调用 `space_brief_map` | `rime/lua/yoyo/pure_popping.lua:137-159` |
| 简词生成/写入 user dict | `rime/scripts/gen_brief_words.py:264-279` |

---

## 未能从源码确认的点（明确标注）

- **`tools/yoyo-km-tui` 的 `rebuild()` 具体实现**：未在本次调查中打开 Rust 源码，无法逐行确认它确实调用了 `generate_reverse_data.py`。依据的是任务背景描述（"会调用 rebuild() → 重生成 pure_dict_map.lua + reverse_*.lua + 部署"）。若需绝对确认，应读 `tools/yoyo-km-tui` 中 `rebuild()` 的实现。
- **为何部分 `%` 简码权重恰好胜出**（如 `艾灸` 629 > core）：未逐一核对每个胜出词的 core 权重分布，仅以脚本统计得出"约 115 条胜出"的整体结论；个别词的胜负原因未逐条考证。
