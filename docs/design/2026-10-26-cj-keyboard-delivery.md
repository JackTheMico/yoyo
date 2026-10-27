# 串击版键盘层送达结论（issue #50）

结论先行：**一个大写或符号码元可以一次触摸送达 librime 的 speller，条件是键盘层用「文本」动作送字面量字符，而不是用「Shift + 按键」动作。**

实验环境：librime 1.17.0 + `/usr/lib/rime-plugins/librime-lua.so`；探针 `tools/probe/probe.c`；方案 `yoyo-pure-cj`（`speller.alphabet` = 60 码元）。

## 1. 三条通路实测对照

`tools/probe/probe.c` 提供三种注入方式，对同一码位 `,K`（→「猷」）分别注入：

| 注入方式 | 探针命令 | 引擎收到的 input | 结果 |
|---|---|---|---|
| 字面量大写 keycode | `process_key('K', 0)` | `,K` | ✅ 命中 `,K`，出一候选「猷」 |
| Shift 修饰 | `process_key('k', kShiftMask)` | `,k` | ❌ 落到另一个码位（首候选「瑜伽」） |
| 文本动作（LyraIME 同款） | `simulate_key_sequence("K")` | `,K` | ✅ 与字面量一致 |

关键事实：**librime 的 `KeyEvent` 只看 keycode，不看 shift 位**。Shift+k 送进来的仍是小写 `k`，不会自动变成 `K`。因此「上滑出大写码元」这种设计若在键盘层实现成「Shift+字母键」，必然打错字——错得还很隐蔽（落在一个合法码位上，出的是另一个字）。

对应的两条探针用例（已固化在 `tools/probe/cases/20-cj-alphabet60.case`）：

```
case cj_输送方式_字面量大写K_是猷        # step K   -> input ",K" -> 空格出「猷」
case cj_输送方式_Shift加k_不是大写码元_是瑜伽  # step S+k -> input ",k" -> 空格出「瑜伽」
```

## 2. LyraIME 的按键派发路径

触屏按键走到 Rime 的链路（`Carlson24/LyraIME`，分支 `lyraime`）：

1. 主题里按键声明 `text` 动作 —— `doc/theme-dsl.lua:496`（`text?: string  # 多步动作序列`），键位级 swipe 声明在 `doc/theme-dsl.lua:829`（`swipe_up?: KeyName`）。
2. 执行时进入 `CommonKeyboardActionListener.onText`（`app/src/main/java/com/osfans/trime/ime/keyboard/CommonKeyboardActionListener.kt:598`）。
3. 文本先做 `{}` 转义（`:602`），再按 `TEXT_INPUT_PATTERN`（`:649`）切成若干段：`{xxx}` 段当按键名解析，其余**逐字符**拆开（`:603-613`）。
4. 逐段分发（`:615` 的 `postKeyJob`）：
   - `{xxx}` → `onAction(KeyActionManager.getAction(token))`（`:620`）
   - 非 ASCII 可打印字符 → `commitComposition(appendText = value)`（`:626`），**直接上屏，不经过 speller**
   - 其余 ASCII 可打印字符 → `simulateKeySequence(value)`（`:629`）
5. `simulateKeySequence` → 原生 `simulateRimeKeySequence`（`app/src/main/java/com/osfans/trime/core/Rime.kt:168`、`:611`），即 librime 的 `simulate_key_sequence`。

因此：**用 `text = "K"` 声明的按键，走的正是上表第三行那条已验证可用的通路。**

## 3. 限制与坑

- **逐字符分发**：`text` 里写多字符（如 `"ab"`）会被拆成两次 `simulateKeySequence`，等价于两次独立击键。串击版一个键只能出一个码元，这正好合用，但不要指望用一条 `text` 送多个码元。
- **非 ASCII 不走 speller**：`commitComposition` 直接上屏。所以 `text` 里绝不能出现全角字符或中文，否则码元会被当作正文提交给宿主应用。
- **`{}` 是转义语法**：`text = "{"` 会被当按键名解析而失败；需要时用 `{}` 写法绕开（`:602` 的 `replace`）。
- **`send` 动作未验证**：`send?` 是 `KeyName`（`doc/theme-dsl.lua:829` 同行文档），解析走 `KeyCode.parse`（`app/src/main/java/com/osfans/trime/ime/keyboard/KeyCode.kt:68`），`K` 会解析成 keycode `K` 且无修饰位，理论等价于字面量通路，但实际派发是否绕同一入口未在真机确认。**首选 `text`，`send` 作为备选。**
- **滑动目标用 `KeyName`**：`swipe_up` 指向一个预设按键名，所以上滑层的 16 个码元要先在 `preset_keys` 里各注册一个 `text` 动作，再被 `swipe_up` 引用。

## 4. 已在源码层面定论的两项（不需要真机）

原先这两项被列为「必须真机确认」，读 LyraIME 源码后可以下结论，留证据在此免得再查一遍。

### 4.1 次选键 `'` 能送达（原风险 3）——结论：可用

`click = "'"` 不是预设按键名，走 `KeyAction.init` 的 else 分支（`KeyAction.kt:180`）：
`KeyCode.parse("'")` → `nameToKeyCode("'")` 依次试
`upperNameToCode`（只有 A–Z，不中）→ `symbolNameToCode`（只有 `exclam/quotedbl/colon/less/...` 这类名字，不中）→
`charToCode("'")`，而 `charToCodePairs` 明确含 `"'" to "KEYCODE_APOSTROPHE"`
（`codegen/src/main/java/com/osfans/trime/codegen/GenKeyMapping.kt:244`）。得到 `KEYCODE_APOSTROPHE`

回程同样闭合：`handleKey` 里 `KeyCode.codeToKeyName(KEYCODE_APOSTROPHE)` → `keyCodeToName` 的 `pairs` 表把
`0x0027` 命回 `"apostrophe"`（同文件 :64）→ `RimeKeyEvent.getKeycodeByName("apostrophe")` → librime 的
`XK_apostrophe = 0x27`，正是 `cj_popping.lua` 里 `incoming == "'"` 的分支。

所以备选方案（改用 `text = "'"`）不必启用。

### 4.2 快速连打的顺序（原风险 2）——结论：**没有契约保证**，但机制已知

`postKeyJob` 的实现是（`TrimeInputMethodService.kt:180`）：

```kotlin
fun postKeyJob(block: suspend RimeApi.() -> Unit) {
    rime.lifecycleScope.launch { rime.runOnReady(block) }
}
```

三点事实：

1. `rime.lifecycleScope` 的 `coroutineContext` 只有 `SupervisorJob()`（`RimeLifecycle.kt:93`），**没有调度器**，
   `launch` 会落到 `Dispatchers.Default` —— 一个多线程池。
2. 同文件 `:171-177` 的注释把这件事挑明了：「Unlike `rime.runOnReady` or `rime.launchOnReady` where
   subsequent operations **can start if the prior operation is not finished**, `postRimeJob` ensures that
   operations are executed **sequentially**」。也就是说顺序保证是 `postRimeJob` 的属性，`postKeyJob` 没有。
3. engine 已处于 READY 时，`runOnReady` 不再挂起（`RimeLifecycle.kt:106` 的 `state == currentState` 分支直接
   调 `block`），因此每个按键就是一个「短小的同步块」被投进 Default 池的队列。

推论：**顺序保障不来自 API 契约，而来自「FIFO 投递 + 每块只有微秒级」这两点经验事实**。理论上两块可能被不同
worker 同时执行（Default 池并发度 ≥ 2），一旦发生，串击的码元会换位 —— 表现出来是「打出另一个合法字」，
而不是报错。这不是串击版独有的问题（Trime 所有软键盘按键都走这条路），但对串击更致命，因为并击版还有
`chord_composer` 的成弦窗口在缓冲。

要在真机上确认的只有一件事：**快速连打时是否观察到码元换位**。若出现，出路不在本方案内（需改客户端派发，
属 issue #47 Out of Scope 的「不碰 Kotlin 层」）。

## 5. 仍需真机确认的三项

1. `swipe_up` 从按下到抬手的判定阈值，是否会把「上滑」误判为「点击」，导致一次触摸同时送出两个码元。
2. 上滑手势与输入法自身的「滑动光标 / 滑动删除」是否冲突（`doc/theme-dsl.lua:496` 附近有
   `slide_cursor` / `slide_delete` 字段）。
3. `preset_keys` 数量（26 个大写码元 + 12 个快捷字条）是否影响键盘加载耗时。
4. 数字键「点击出大写码元、长按出数字」的长按是否被弹窗键盘（`KeyView` 的 popup）或系统手势抢走——
   这决定数字行上 10 个大写码元是否需要另找落点。

另有 `ctx:push_input` 在 Android 上的行为，见 [切分规则 §8](cj-parsing-rules.md) 的未验证项 2 —— 它影响
「长缓冲切分后残留码元的回填」，与键盘层无关，故不列在这里。

