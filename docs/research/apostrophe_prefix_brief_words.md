# 前置单引号扩展简词 — 可行性研究报告

> ⚠️ **已弃用（2026-08-29）**：本方案（前置单引号 `'` 简词）经评估后未采用，
> 最终只保留**空格并击版**（% 前缀，一击上屏，见 `space_chord_brief_words.md`）。
> 文中的编码空间仿真代码已并入 `rime/scripts/chord_utils.py`（通用并击代数工具库），
> 状态机测试见 `rime/scripts/test_brief_words.lua`，冲突检测见 `rime/scripts/test_space_chord_brief.py`。
> 下文保留当时（' 版）的可行性分析记录。

日期：2026-08-29
问题：目前单引号 `'` 只用于并击上屏次选。设想用**前置单引号**打扩展简词：
1. `'` + 左手一击（60 种码元）
2. `'` + 右手一击（60 种码元）
3. `'` + 左右手同时并击（60×60 = 3600 种码元）

合计 3720 个新简词编码位。能否实现？

## 结论（一句话）

**能。3720 个编码位全部成立，且有一条「alphabet 零改动、次选功能完全保留」的实现路径——时序前缀：先点按并松开 `'`，再击键。**

## 证据链

### 1. librime 源码核实（chord_composer.cc）

来源：<https://raw.githubusercontent.com/rime/librime/master/src/rime/gear/chord_composer.cc>

三个关键机制（均为源码原文证实，非推测）：

**(a) 输出按 alphabet 下标排序。** `SerializeChord` 按 `chording_keys_`（由
`chord_composer/alphabet` 字符串解析而来）的顺序迭代取按下的键：

```cpp
string ChordComposer::SerializeChord(const Chord& chord) {
  KeySequence key_sequence;
  for (KeyEvent key : chording_keys_) {          // ← alphabet 顺序
    if (chord.find(key.keycode()) != chord.end())
      key_sequence.push_back(key);
  }
  ...
}
```

当前 `alphabet: "qwertasdfgzxcvb yuiophjkl;nm,./'"` 中 `'` 排末位，故**同按**
时 `'` 总在输出的最后（现行次选的码形 `_e'` 即由此而来）。

**(b) chord 在「所有按下的键都松开」时结束。**

```cpp
inline static bool finish_chord_on_all_keys_released(const ChordingState& state) {
  return state.pressed_keys.empty();
}
```

⇒ 单独点按并松开 `'`，它会**立即作为一个独立 chord 结束并输出**，不会等后续按键。
这是「先点 `'` 再击键」与「`'` 与键同按」天然分流的引擎级保证——纯时序区分，
不需要任何配置开关。

**(c) 输出逐键重新注入完整处理链。**

```cpp
void ChordComposer::FinishChord(const Chord& chord) {
  ...
  if (key_sequence.Parse(code) && !key_sequence.empty()) {
    sending_chord_ = true;
    for (const KeyEvent& key : key_sequence) {
      if (!engine_->ProcessKey(key)) { ... }
    }
    sending_chord_ = false;
  }
}
```

⇒ `'` 独立成击后，其输出字符会走完整 processor 链
（`km_punct → pure_popping → commit_raw → recognizer → key_binder → speller …`），
由 speller 推入 `context.input`。

### 2. 本地方案配置核实

- `yoyo-pure-km.schema.yaml:91-92`：`speller/alphabet` 与 `speller/initials`
  **均已包含 `'`**（末位）⇒ 空输入时点 `'`，speller 会直接把它收进 input 缓冲，
  **speller 层零改动**。
- `pure_popping.lua:99`：`if not input or input == "" then return yoyo.kNoop end`
  ⇒ input 为空时 `'` 到达不触发任何拦截，放行给 speller。
- `pure_popping.lua:107`：现行次选拦截只在 **input 非空** 且 `dict_map_2` 有次选
  时触发。简词流程中 `'` 到达时 input 恒为空 ⇒ **零冲突**。
- key_binder 的 `{accept: apostrophe, …, when: has_menu}`：input 为裸 `'` 时无
  候选菜单，不触发 ⇒ 零冲突。

### 3. 词典层实证（rime_deployer 实测）

在 `/tmp/rimetest` 用最小 schema 编译含 `'` 编码的词典，再用
`rime_table_decompiler` 反编译 roundtrip 验证：

- 前置编码 `'_e`、`'+w`、`'sl`、`'wC` ✅ 全部保真进入 `aptest.table.bin`
- 后置编码 `XY'` ✅ 同样保真

⇒ **prism/table 对 `'` 编码无任何硬约束**，`rime_deployer` 正常编译。
（dict.yaml 中含 `'` 的编码行建议用双引号包裹，避免 YAML 单引号转义歧义。）

### 4. 编码空间仿真（现并入 `rime/scripts/chord_utils.py`，参见 `test_space_chord_brief.py`）

对现行心法+空明拳指法做 1~3 键暴力枚举仿真，全部断言通过：

- 左手可产出码元 **60 种**，右手 **60 种**，集合完全一致（镜像指法成立）
- 时序前缀码形：`'_X`（60）+ `'+X`（60）+ `'XY`（3600）= **3720 个，互不重叠**
- 与既有编码空间（`_X`/`+X` 一简、`XY` 两码字、`XX_Y` 三码字、`XYZW` 四码词、
  `~xxx` 标点）**结构上不可能相交**（新码均含且仅含一个 `'`，旧码均不含 `'`）
- 与现行次选码形（`_X'`/`+X'`/`XY'`，后缀 `'`）**逐字符零相交**

## 两条实现路径对比

| | 路径①时序前缀（推荐） | 路径②同按前缀 |
|---|---|---|
| 操作 | 先点按-松开 `'`，再击键 | 把 `'` 挪到 alphabet 首位，与键同按 |
| alphabet/心法改动 | **零改动** | 改 alphabet + 重写心法 3 条 xform |
| 码形 | `'_e` / `'+e` / `'sl` | `'_e` / `'+e` / `'sl`（相同） |
| 与次选关系 | **完全共存**（同按=次选，先点=简词） | **互斥**：同按 `'` 变成简词，次选被顶掉 |
| 击键成本 | 多一次 `'` 点按 | 与次选手感一致 |
| 引擎级保证 | chord 在全部键松开时结束（源码已证） | 需重构心法排序规则 |

**推荐路径①**：代价最小、可回退、不碰现有任何行为。

## 落地改动清单（路径①）

1. **词典**：新增简词条目到 `rime/yoyo-user.dict.yaml`（不会被
   `generate_pure_dict.py` 覆盖），编码写 `'_e` / `'+e` / `'sl` 等。
   注意含 `'` 的编码行用双引号包裹。
2. **pure_popping.lua**：新增 `'XX` 输入形态的处理模式——
   - input=`'XY`（简词已完整）+ 任意可见键 → 顶出简词（仿 Pattern A）
   - 需要把 `'` 开头的码加入其状态机判断，且**不得**在 `input:sub(1,1)=="'"`
     时提前清屏
3. **可选**：简词自动上屏策略（一简式顶屏 vs 空格确认），以及
   `key_binder` 里给 `has_menu` 状态下的 `'` 留意（简词候选出现后菜单非空，
   此时点 `'` 会发 KP_2——若不想干扰可给 `'`-开头 input 加例外）。
4. **工具链**：`tools/yoyo-km-tui` 加词时支持 `'` 前缀码；重跑
   `generate_pure_dict_map.py`（若简词进 4 码 map 体系则必须，参考
   `docs/custom_words_guide.md` §4–§5 硬规则）。

## 风险与边界

- **回删**：input=`'_e` 时 BackSpace 走 `when: composing` 绑定发 Escape 清空
  整串（现有一简同样行为，非新增风险）。
- **误触**：若用户习惯「点 `'` 后又想取消」，需 Escape/BackSpace 清缓冲；
  `'` 悬在 input 里不会自动消失（与裸 `_` 前缀同理）。
- **次选手感**：次选要求 `'` 与键**同按**；若用户次选实际是「先点 `'` 再击键」
  的时序习惯，则会落入简词命名空间——需确认实际指法习惯后再放词。

## 复现

```bash
python3 rime/scripts/test_space_chord_brief.py       # 空格并击码位仿真 + 冲突检测
lua rime/scripts/test_brief_words.lua                  # 状态机集成测试（16 用例）
# 词典编译实证见 /tmp/rimetest（rime_deployer --build + rime_table_decompiler）
```

## 实现状态（2026-08-29 已落地并部署）

已确认用户次选手法为「' 与键同按」→ 时序前缀路径零冲突，按路径①实现完毕：

| 改动 | 文件 | 内容 |
|---|---|---|
| 词典 | `rime/yoyo-user.dict.yaml` | 新增 3 条示例简词（`'_w` / `'+w` / `'sl`），可替换 |
| 生成器(Python) | `rime/scripts/generate_pure_dict_map.py` | 读取 yoyo-pure+yoyo-user 并集；`'` 码单独收入 `brief_map`，不污染 dict_map 等；顺带修复了 Python 版不读 yoyo-user 的口径分歧 |
| 生成器(Rust) | `tools/yoyo-km-tui/src/mapgen.rs` | 同步 brief_map 逻辑（输出与 Python 版逐字节等价），TUI 加词重生成不会抹掉简词 |
| 状态机 | `rime/lua/yoyo/pure_popping.lua` | 新增 Pattern H：`'` 前缀输入 ilen<3 放行；ilen≥3 命中 brief_map 顶出上屏、未命中清空死缓冲 |
| 测试 | `rime/scripts/test_brief_words.lua` | 16 用例全过：简词顶出、中间态、未定义位、次选/一简回归、数据完整性 |

已通过 `deploy_to_fcitx5.sh` 部署，反编译 `build/yoyo-user.table.bin` 确认
`'` 编码保真（num_entries=6）。alphabet / 心法 / 指法 / speller 全部零改动。
