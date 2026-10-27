# LyraIME 移植可行性 & 「并击改串击」技术评估

日期：2026-10-26
状态：调研完成，设计待决策
结论摘要：**移植可行；「串击化」不是配置问题，而是方案重设计问题。**

---

## 1. 目标平台事实

### 1.1 LyraIME 是什么

| 项目 | 事实 | 证据 |
|---|---|---|
| 身份 | Trime（osfans/trime）的 fork，`com.carlson.lyraime`，版本 5.5.2 | `app/build.gradle.kts:29,33` |
| 开发分支 | `lyraime`（`main` 分支只是上游 Trime 镜像） | 仓库根 README、`doc/theme-dsl.lua` 链接 |
| 实质改动 | 离线语音（sherpa-onnx）、高通 NPU 加速、主题 DSL、外部方案包导入 | 仓库 README「特色功能」 |
| 内嵌引擎 | **自研 librime 分支 `Carlson24/librime-custom`，版本 1.17.0** | `.gitmodules`（librime 指向 librime-custom）、`CMakeLists.txt:9` |

### 1.2 引擎组件清单（决定移植上限）

`librime-custom` 同时注册了两个并击处理器：

```
src/rime/gear/gears_module.cc:49  r.Register("chord_composer", new ChordComposerComponent);
src/rime/gear/gears_module.cc:60  r.Register("streaming_chord_processor", ...);
```

- **`chord_composer`**：Rime 原生并击，要求**多键物理同时按住**才成弦。
  `finish_chord_on_first_key_release_` 默认 `false`（`chord_composer.h:73`），
  完成判定为 `finish_chord_on_all_keys_released(state_)`（`chord_composer.cc:106-113`）。
- **`streaming_chord_processor`**：流式并击，**用落键时间窗把连续按键合成和弦**，专为无 KeyUp / 弱 KeyUp 平台设计
  （架构文档 `doc/chording.md`、配置指南 `doc/chording_configuration.md`）。
- 另含 librime-lua（`lua55` 目录，Lua 5.5）、lua-utf8、octagram、predict、calculator、ids-search。
- Prism 5.0 + Syllabifier 步进重排（为 canonicalize 后的非前缀单调性做的引擎改造，`doc/chording.md` 七张机）。

**结论**：yoyo-pure-km 依赖的 `chord_composer` 与 `lua_processor` 在 LyraIME 上都存在，容器不是障碍。

---

## 2. 决定性约束：软键盘没有「按住」态

yoyo-pure-km 的并击语义建立在「多键同时 down」之上，而 Android 软键盘的派发路径是：

```
KeyView.onPress    → 仅 keyboardActionListener.onPress(code)  // 只有按键音与预览
KeyView.onRelease  → processKeyAction(...)                     // 此时才发 keydown
CommonKeyboardActionListener.onRelease → processKey(value, Release)  // 紧接着补发 keyup
```

证据：`KeyView.kt:126-130`（onPress 只调 onPress/预览）、`KeyView.kt:155-165`（onRelease 才 `processKeyAction`）、
`CommonKeyboardActionListener.kt:144-154`（onRelease 中补发 `KeyModifier.Release`）。

后果：
- 双指同时按下时，Rime 侧看到的是**两次「抬起瞬间」背靠背发出的 down+up**，中间无 held 状态 → `chord_composer` 永远不会完成和弦。
- 现有 Trime/LyraIME 的 `KeyBehavior.COMBO` 只支持「第一键 + 第二键」两键组合（`Keyboard.kt:106`、`KeyView.kt:158-160`），
  且无 `pointerId` / `ACTION_POINTER_DOWN` 处理，不支持任意多键并击。

**因此：原方案照搬 → 在软键盘上打不出字。** 这不是配置能修的。

---

## 3. 方案本体的两个硬数字

从 `rime/yoyo-pure.dict.yaml` 实测：

| 指标 | 数值 | 说明 |
|---|---|---|
| 条目总数 | 114,515 | |
| 码元字符种类 | **62 种**（26 小写 + 26 大写 + `; : , . / < > ?` + `_ +`） | `_`/`+` 为派生前缀，真实码元 60 种 |
| 2 码条目 | 6,395（其中纯 2 码单字 **2,832**，一简 `_X`/`+X` 3,563） | 2 码单字全唯一 |
| 3 码单字 | 6,400，唯一码 6,333（67 码位重码） | 与「6638 字零重码」描述不完全一致 |
| 4 码词 | 101,720，唯一码 100,622 | 平均 1.011 条/码 |

### 硬约束 A：码元数 > 键数

60 个真实码元 vs 26 个字母键。这就是「空明拳」必须用**多键并击表示一个码元**的根本原因
（如 `Q` = 左手 `s+e+f`，`>` = `t+d`，`;` = `a+f`，见 `rime/yoyo.yaml:547+`）。
**串击无法绕开这个比例**——除非引入 Shift 层或符号层，或缩小码元集（那就要重排码表）。

### 硬约束 B：一简的消歧依赖「同时按键数」

字典里 `_d`（的）、`+e`（有）这类一简条目，与码元 `d`、`e` 本身**共用同一个物理键**。
并击方案靠「这一击同时按了几个键、在哪只手」来消歧：

- 只按 `d` → chord 输出 `_d` → 一简出「的」
- `d` 与右手键同时按 → 输出 `d#X` → 两个码元

串击下这个信息**完全丢失**：按一下 `d` 既可能是「一简 d」，也可能是「码元 d 的第一击」。
必须引入新的消歧机制（空格确认 / 独立一简层 / 长度回溯），任何选择都会改变打字节奏。

---

## 4. 三条可走路线

### 路线 A：保留并击，改客户端派发（保真度 100%，改动在 Kotlin）

在 `KeyboardView` 层实现真正的多指跟踪：`ACTION_POINTER_DOWN` 时立即发 keydown，`ACTION_POINTER_UP` 时发 keyup，
并按 pointerId 维护按下集合。这样 `chord_composer` 拿到真实 held 状态，原 schema/lua **零改动**。

- 代价：改 LyraIME 的触摸分发（需维护 fork）；且与 Trime 的 `KeyBehavior.COMBO`、滑动、长按逻辑交叉，回归面大。
- 风险：物理键位在 26 键屏上要容纳 60 码元的组合，手指遮挡与误触是体验级问题（不是技术阻塞）。

### 路线 B：换 `streaming_chord_processor`（编码不动，时序合成）

把 `chord_composer` 换成 `streaming_chord_processor`，配 `initial_keys`（左手区）/`final_keys`（右手区）、
`key_map`（物理键→码元）、`canonicalize`（复用现有心法 xform）、`chord_duration_ms=60`。

- 优点：引擎自带、LyraIME 已编译进去，无需改 APK。
- **致命问题**：`pure_popping.lua` 的整套 FSM 建立在「chord 输出逐字符注入、`context.input` 只含前 N-1 个字符」这一时序假设上
  （`pure_popping.lua:4-7` 明确写明）。而 streaming chord 是**先累积原始键、抬手/超时才 pop+canonicalize+push 整体标准码**。
  FSM 看到的是 `sef` 而不是 `Q`，长度判定与前瞻全部失效 → **顶屏逻辑要重写**。
- 且一个码元含 2-3 键时，需在 60ms 内连敲完（`Q`=`sef` 三键 60ms），生理上不现实。

### 路线 C：真·线性串击（等于新方案）

放弃码元→多键的映射，每个码元直接对应一次击键。

- 受硬约束 A 限制：26 键装不下 60 码元，必须二层布局（Shift/符号层）或改码表。
- 受硬约束 B 限制：一简必须重新消歧。
- `pure_popping.lua` 可大幅简化（纯长度判定，无 `_`/`+` 前缀），这是唯一「变简单」的部分。
- 实质：这不是 yoyo-pure-km 的移植，而是以同一副字根/码表另立一个移动端方案。

---

## 5. 判断

| 路线 | 方案改动 | 客户端改动 | 打字体验 | 可行性 |
|---|---|---|---|---|
| A 保留并击 | 无 | 大（多指触摸分发） | 与原方案一致，但手机双指并击受屏幕尺寸限制 | 技术可行，体验待验证 |
| B 时序并击 | 大（FSM 重写） | 无 | 需 60ms 连敲，三键码元不可行 | 不推荐 |
| C 真串击 | 极大（编码重做） | 无 | 击键数约翻倍，但节奏自由 | 等于新方案 |

**结论**：用户所问的「改成串击并移植」，若指 C，则不是移植而是重做；若指 B，则被 `pure_popping` 的时序假设与三键码元双重卡住；
真正的保真路径是 A——先做多指派发的可行性验证，再谈移植。

---

## 5.5 串击路线的实测修正（2026-10-26 决策后）

用户选定「真线性串击（一码元一击）」后，对码表做了进一步实测，两个候选设计被数据推翻：

### 修正一：「长度回溯顶屏」无法实现一简

原设想：一简去掉 `_`/`+` 前缀后，靠「后续码元组不成更长码」触发顶出。

实测（`2 码字 ∪ 3 码字前缀` 覆盖 2 字符组合空间）：

| 指标 | 数值 |
|---|---|
| 2 字符组合空间 | 62 × 62 = 3,844 |
| 2 码字码位 | 3,500 |
| `2码字 ∪ 3码字前缀` | 3,500（完全包含） |
| 覆盖率 | **91.1%** |
| 一简码元中「开头无 2 码字」的 | **0 / 60** |
| 以 `d` 开头的 2 码字 / 3 码字前缀 | 58 / 37 |

结论：敲下任一码元后，九成情况下后续码元都会构成合法 2 码字或 3 码字前缀，一简永远等不到顶出时机。**根因是 `_`/`+` 前缀是唯一承载「这是一简」语义的载体，删掉它即丢失定界信息。**

### 修正二：「双击同键 = 一简」100% 冲突

`rr`=人、`dd`=替替代、`SS`=多少……60 个码元的 `XX` 全部已是合法 2 码字（因 3,500 个 2 码字已占满空间 91%）。受影响一简条目 240/240。

### 结论

串击下「一击出高频字」在**编码层无解**：单键被 60 个码元占满，单键组合被 2 码字占满 91%。并击的一简红利来自「同按几键」这一额外维度，串击无法复现。一简只能退到 UI 层（候选置顶 + 快捷字条），或占用键位第二层。

### 随之简化的部分

去掉一简后，`pure_popping.lua` 的 Pattern A/B/C/D/E（全部围绕 `_`/`+` 前缀）整体删除，只保留 Pattern F/G 的长度回溯：

- 输入 3 码：若 `3码+新码` 是 4 码词 → 继续；否则前 2 码是 2 码字则顶出，第 3 码作新字首码
- 输入 4 码：顶出词或字

这与桌面版既有逻辑同构，是串击化唯一「变简单」的部分。

## 6. 未确认项（不做推测）

- `librime-custom` 的确切 commit（tarball 无 `.git`，只能定位到 `1.17.0`）。
- LyraIME 的「外部方案包」导入格式与安装路径（`app/data` 为 submodule，tarball 未含；未读到具体实现）。
- Lua 5.5 下 `utf8.char` / `require "yoyo.data.*"` 的实际行为（未在真机验证）。
- Android 软键盘同时按压多键时，`MotionEvent` 在该机型上的 pointer 事件序列（需真机实测）。
- LyraIME 主题 DSL 能否表达含 `; ' , . / < > ? % _ +` 的键位（未读 `doc/theme-dsl.lua` 全部）。

## 7. 建议的下一步（最小验证）

1. 真机上装 LyraIME，导入一个只含 `chord_composer` + 两点并击的**最小测试方案**，确认软键盘是否真的打不出和弦（验证第 2 节结论）。
2. 若确认，先在 LyraIME 里给 `KeyboardView` 加 pointerId 跟踪的 down/up 派发，用同一最小方案复测。
3. 二者都通过后，再评估 60 码元在手机 26 键上的实际可操作性——这一步才是决定「并击 or 串击」的真正依据。
