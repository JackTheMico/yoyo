# 调研报告：yoyo-pure-km 连打「不是任何」掉出「是」→ 变成「不任何」

> **状态**：根因已定位、已用 Lua 沙盘端到端复现并验证修复 · 2026-11-02
> **问题**：并击打「不是任何」，期望 `c+b`→「不是」首选、`a+N`→「任何」首选、连起来=「不是任何」；
> 实际连起来只出「不任何」——第一个词的第二个字「是」被整段吞掉。
> **结论先行**：这是 `pure_dict_map.lua` 主表取首选逻辑的 bug：生成器**信任文件行序=权重序、却不解析权重**，
> 导致 `cb` 这类「高权重 2 码词 + 同码零权重单字」冲突码，被零权重单字「不」抢走首选；
> 连打时 `pure_popping` 的 Pattern F 直接提交 `cb`，从主表取到「不」而非「不是」。
> 该冲突**不是孤例**：全库共 **138 个**同模式编码受影响。修复在生成器按真实权重排序取首选，已验证生效。

---

## 1. 复现（Lua 沙盘，模拟 chord_composer 逐字符注入）

用仓库已有的 `test_pure_popping_realistic.py` 同款 Mock 框架，直接驱动 `pure_popping.func`，
对 `cbaN`（chord1=`cb` 不是，chord2=`aN` 任何，左-right 并击产出裸码）逐字符注入：

**修复前（现状 `rime/lua/yoyo/data/pure_dict_map.lua`）：**
```
=== 不是+任何 (bare cb + aN) ===
  seq chars: [c b a N ]
  committed = 不            ← BUG：应提交「不是」，只出了「不」
  final buffer = [aN]       ← 「任何」正确留在待选区
  dict_map[cb]      = 不    ← 主表错取单字
  dict_map_2[cb]    = 不是  ← 「不是」被挤到次选表
  dict_map[aN]      = 任何
```

**修复后（生成器按权重排序重生成）：**
```
=== 不是+任何 (bare cb + aN) ===
  committed = 不是          ← 已修复
  final buffer = [aN]
  dict_map[cb]      = 不是  ← 主表现在正确
  dict_map_2[cb]    = 不
```

> 注：单独打 `cb` 时 `committed` 为空、buffer 停留 `cb`，候选首位仍是「不是」——
> 这与用户「c+b 打出不是在首选」一致；只有**连打**（第二 chord 触发提交）才会暴露「是」丢失。
> 这正是本 bug 只在高亮「连起来」场景出现的原因。

---

## 2. 根因链（全部来自一手源码/数据）

### 2.1 词典里 `cb` 是同码双义，且单字条目排在词之前
`rime/yoyo-pure.dict.yaml`：
- `36: 不   cb   0`        ← 零权重冗余单字条目（「不」主码其实是 `_c`，见下）
- `239: 不是 cb   5186654` ← 2 码词，权重 5.1M
- `37: 不   _c   32331838` ← 「不」真正的主码（一简）

即 `cb` 同时是「不」(0) 与「不是」(5.1M) 的码，且**零权重单字行排在高频词行之前**。

### 2.2 生成器信任文件行序=权重序，不解析权重
`rime/scripts/generate_pure_dict_map.py`：
- docstring（第 14 行）明确写「首选/次选严格按词典权重降序（yoyo-pure.dict.yaml 的 sort: by_weight）」——
  即**假设源词典已按权重排好序**，生成器本身只按**文件行序**取 `cands[0]` 当首选。
- 实际 `code_to_candidates["cb"]` 按文件序 = `["不"(0), "不是"(5.1M)]`，
  `process_cands` 直接 `top_dict[code] = cands[0]`（第 85 行），于是 `cb`→「不」进主 `dict_map`，
  「不是」落到 `dict_map_2`（次选）。
- 该函数还有守卫 `if code in top_dict: return`（第 83 行），一旦某码定下首选就不再更新，
  所以 clean 码循环里的 `cb` 也无法纠正。

### 2.3 pure_popping 提交走主表，且默认没有 word_first/char_first
`rime/lua/yoyo/pure_popping.lua`：
- `get_active_tables`（69–75 行）：若 `word_priority` 关（km 方案 switches 里**无此开关**，
  `get_option` 返回 nil）→ 取 `pure_data.char_first or pure_data`。
  而 `pure_dict_map.lua` 实际**没有 `word_first`/`char_first` 子表**（已 grep 确认），
  故 `active_tables = pure_data`，提交用 `pure_data.dict_map`（主表）。
- `commit_and_restore`（78–90 行）：`text = dict_map[code] or dict_map[clean]`，
  对 `cb` → `dict_map["cb"]` = **「不」**。

### 2.4 连打触发 Pattern F 提交 `cb`
`pure_popping.func` 的 Pattern F（219–228 行）：当输入已是 3 字符纯字母（如 chord1 的 `cb` 后接 chord2 首字符 `a` → `cba`），
且 `words_4code["cbaN"]` 非词时，`commit_and_restore(input:sub(1,2), input:sub(3,3))`
→ 提交前 2 字符 `cb`（经 2.3 取到「不」）、把第 3 字符 `a`（属 chord2）restore 回去。
结果：第一个词提交成「不」、「是」消失；chord2 的 `a`+`N` 重组出「任何」待选 → 屏幕呈「不任何」。

**一句话根因**：`cb` 在主 `dict_map` 取到了零权重单字「不」而非高权重词「不是」，
而连打时的确定性提交只认主表 → 「是」整段丢失。候选框（table_translator 走真实权重）显示「不是」首选只是假象。

---

## 3. 影响范围（一类 bug，非孤例）

用与生成器同口径解析 `yoyo-pure.dict.yaml`，对比「文件序首选」与「权重序首选」：

| 指标 | 数值 |
| :--- | :--- |
| 总编码数 | 110,575 |
| 首选不一致（文件序≠权重序）的编码数 | **138** |
| 模式 | 全部为「高权重 2 码词」被「同码零/低权重单字」抢走首选 |

样例（code | 当前错取 | 应按权重取 | 被掩盖项）：
```
sl  → 了   (应为 了得)      fi → 一   (应为 一般)
rr  → 人   (应为 人员)      zy → 也   (应为 也有)
Td  → 大   (应为 大量)      Ex → 小   (应为 小时)
Be  → 而   (应为 而且)      qy → 用   (应为 用于)
wr  → 日   (应为 日本)      mc → 从   (应为 从而)
Pl  → 里   (应为 里程)      Li → 之   (应为 之前)
nb  → 本   (应为 本人)      Hy → 月   (应为 月份)
cb  → 不   (应为 不是)      ds → 三   (应为 三星)
... (共 138 个)
```
> 注意 `aN`（任何）不在此列：`aN` 文件序首选已=权重首选（任何），故「任何」本身未被此 bug 影响——
> 用户报告的「任何」正常，问题只在「不是」。

**后果**：凡是这类 2 码词后面再接一个 chord（连打顶功），FSM 都会把词错提交成单字、丢掉第二个字。
例：`了得`+下文 →「了X」、`一般`+下文 →「一X」、`人员`+下文 →「人X」…… 口径一致。

---

## 4. 修复方案（已验证）

### 4.1 推荐修复：生成器按真实权重排序取首选
改 `rime/scripts/generate_pure_dict_map.py`：解析第 3 列权重，对每个码的候选按
**权重降序、同权重按文件序稳定**排序后再取首选/次选。与 translator 行为对齐，且一次性修掉全部 138 个。

关键改动（仅 `process_cands` 与其入参）：
```python
# 收集候选时保存 (text, weight, file_idx)
w = 0
if len(parts) >= 3:
    try: w = int(parts[2])
    except ValueError: w = 0
cand_list = code_to_candidates.setdefault(raw_code, [])
if text not in {t for (t,_,_) in cand_list}:
    cand_list.append((text, w, file_idx)); file_idx += 1
# …clean 码同理…

def process_cands(code, cands, top_dict, sec_dict):
    if not cands or code in top_dict:
        return
    ordered = sorted(cands, key=lambda x: (-x[1], x[2]))   # 权重降序、稳定
    top_dict[code] = ordered[0][0]
    if len(ordered) > 1:
        sec_dict[code] = ordered[1][0]
```

### 4.2 验证结果
- 重生成后 `dict_map["cb"]="不是"`、`dict_map_2["cb"]="不"`（其余 137 个同样修正）。
- 同 2.1 的 Lua 沙盘复现：连打 `cbaN` → `committed = "不是"` + `aN` 待选，即「不是任何」。✅
- `words_4code`(100642) / `chars_3code`(6333) / `space_brief_map`(996) 三个集合不受改动影响（它们由码长独立计算）。

### 4.3 备选修复（不推荐单独使用）
- 直接删除源词典里 `36: 不 cb 0` 这类零权重冗余单字码别名。能修 `cb` 一个，但：
  (a) 不修生成器则其余 137 个仍在；
  (b) 这类别名是否另有用途需先确认，改动面更难评估。
- 给 `pure_popping` 增加 `word_first` 子表并默认启用。改动在 FSM 侧，但 `pure_dict_map.lua` 本就不产该子表，
  仍要先修生成器才有数据 —— 不如 4.1 直接。

---

## 5. 落地注意事项 / 风险
1. **回归面**：4.1 只改变「同码多候选」的首选/次选排序，不影响 `dict_map` 的键集合与 4 码词/3 码字判定。
   但重生成会刷新 `pure_dict_map.lua` 全部首选，若有测试断言了旧的（buggy）取值（如 `cb`→「不」），需同步更新。
   建议重生成后用 `rime/scripts/test_pure_popping*.py` 跑一遍回归。
2. **单手 2 码词的限制仍在**：若用户把 2 码词当单手 chord 打（如 `_cb`），`_c` 会在 Pattern A 阶段被提前顶成「不」，
   与本次「左-right 并击」场景无关——2 码词本就应按左右手并击（裸 `XY`）。本次修复不涵盖该输入方式。
3. **源词典排序**：根子上 `yoyo-pure.dict.yaml` 并非严格 by_weight（零权重行排在高频词前）。
   4.1 在生成器层兜住，比依赖词典排序更稳；如日后修词典排序，两者方向一致、不冲突。

---

## 6. 复现与验证所用材料（均在仓库内，未改动生产文件）
- 沙盘驱动：`rime/lua/yoyo/pure_popping.lua` + `rime/lua/yoyo/data/pure_dict_map.lua`（Mock 框架同 `test_pure_popping_realistic.py`）。
- 临时验证脚本（workspace 内 `.workbuddy/tmp/`，非提交物）：
  - `repro.lua`：模拟 `cbaN` 注入、打印 committed / buffer / dict_map 取值（修复前后各跑一次）。
  - `gen_fixed.py`：生成器按权重排序的补丁副本，输出到 `.workbuddy/tmp/pure_dict_map.lua`。
  - `verify_fix.py`：量化 138 个受影响编码。
- 词典反编译核验：`rime_table_decompiler` 解出 `build/yoyo-pure.table.bin`，确认 speller 侧 `cb`→「不是」(5.1M) 胜出、
  `aN`→「任何」(1.5M) 胜出——印证「候选框正确、FSM 提交错」的二分。
