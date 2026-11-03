# RIME 自动上屏 / 自动分词 研究

> 调研时间：2026-11-02
> 目标：研究 speller 自动提交、table_translator / chord_composer 交互、Lua 强制代码边界方案

---

## 一、Speller 配置项详解

### 1.1 核心配置速查

`speller` 是拼写处理器（processor），负责接受字符按键、编辑输入、执行拼写运算。以下是全部与自动上屏/分词相关的配置项：

| 配置项 | 类型 | 说明 | 来源 |
|---|---|---|---|
| `alphabet` | string | 本方案的全部输入键字母表 | 官方 |
| `initials` | string | 仅作始码之键（优化拼写运算） | 官方 |
| `finals` | string | 仅作末码之键（优化拼写运算） | 官方 |
| `delimiter` | string | 上屏时的音节间分音符 | 官方 |
| `algebra` | list | 拼写运算规则（xform/derive/abbrev/fuzz/xlit/erase） | 官方 |
| `max_code_length` | number | 形码最大码长，超过则顶字上屏 | 官方 |
| **`auto_select`** | bool | **自动上屏开关**：候选唯一时自动上屏 | 官方 |
| **`auto_select_pattern`** | regex | **自动上屏规则**：正则匹配输入串，匹配成功则自动顶字上屏 | 官方（Rime 1.8+ 新增） |
| `use_space` | bool | 以空格作输入码 | 官方 |
| `auto_clear` | enum | 空码时的清屏策略：manual / auto / max_length | 社区（非官方，但 yoyo 方案在用） |
| `popping` | list | 顶功规则集（match + accept），自定义 Lua processor 实现 | 社区（yoyo 自研） |

> ⚠️ **重要**：官方文档中**没有** `auto_select_length` 这个配置项！我在完整的 RimeInn schema 详解、LEOYoon-Tsaw 维护的参考文档、librime 源码中都没找到。这个概念可以用 `auto_select_pattern` 的正则来实现（例如 `^\w{3}$` 匹配恰好 3 码的输入）。

### 1.2 `auto_select` — 候选唯一时自动上屏

**行为**：当输入码翻译后只剩一个候选项时，自动上屏，无需按空格/数字键确认。

**典型用法（五笔四码唯一自动上屏）**：
```yaml
speller:
  max_code_length: 4
  auto_select: true
```

**注意**：
- `auto_select` 只在 **候选唯一** 时触发。有重码时不会自动上屏。
- 通常与 `max_code_length` 配合使用——四码到顶，唯一自动上，有重码则让用户选。
- 如果开启了 `table_translator.enable_sentence: true`（自动造句），要小心造句产生的扩展候选可能影响唯一性判断。

### 1.3 `auto_select_pattern` — 正则驱动的自动上屏

**引入版本**：鼠须管 1.0.3 / Rime 算法库相应版本之后新增。

**行为**：当正在输入的原始编码字符串能被正则表达式匹配时，自动顶字上屏。**不要求候选唯一**。

**示例 1：四码上屏（虎码 Tigress）**
```yaml
speller:
  auto_select: true
  auto_select_pattern: '^\w{4}$'
```

**示例 2：四码或分号开头的快符上屏**
```yaml
speller:
  auto_select_pattern: '^;\w+|^\w{4}$'
```

**示例 3：3 码单字自动上屏**
```yaml
speller:
  auto_select_pattern: '^[a-z]{3}$'
```

**示例 4：混合模式——2 码一简 + 3 码单字 + 4 码词**
```yaml
speller:
  auto_select_pattern: '^[a-z]{2}$|^[a-z]{3}$|^[a-z]{4}$'
```

**实战要点**：
- 正则匹配的是 **原始输入串**，还没经过 `algebra` 运算。
- 可以用 `^` 和 `$` 锚定边界，例如 `^\w{3}$` 只匹配"恰好 3 码"，不匹配 4 码。
- `auto_select: true` + `auto_select_pattern` 可以共存——前者处理唯一候选，后者处理正则命中的场景。
- 如果设置了 `auto_select_pattern` 但 `auto_select` 没开，正则命中的情况下 **依然会自动上屏**（独立生效）。

### 1.4 `max_code_length` — 顶字上屏阈值

**行为**：当输入码长度达到 `max_code_length` 后再继续输入，会把当前最长匹配的候选先顶上去，然后继续处理后续输入。

**示例（五笔）**：
```yaml
speller:
  max_code_length: 4
```
打 `aaaaa`：第 4 个 `a` 输入后若候选唯一/被 auto_select_pattern 命中，自动上屏；否则保持 4 码。输入第 5 个 `a` 时，触发顶字，前 4 码被上屏，第 5 个 `a` 成为新一轮输入。

---

## 二、让 3 码单字自动上屏的方案

### 方案 A：纯 `auto_select`（最简单，但有前提）

```yaml
speller:
  max_code_length: 3
  auto_select: true
```

**前提**：码表中 3 码必须唯一（或绝大多数唯一）。如果某些 3 码有重码，那些重码就不会自动上屏。

### 方案 B：`auto_select_pattern` 强制 3 码上屏（推荐）

```yaml
speller:
  max_code_length: 3
  auto_select: true
  auto_select_pattern: '^[a-z]{3}$'
```

**效果**：
- 无论 3 码是否唯一，到达 3 码长度时一律自动上屏。
- 有重码时会自动上屏 **第一个候选**（默认排序最高的那个）。
- 如果想在有重码时弹菜单让用户选，只保留 `auto_select: true` 不加 pattern 即可。

### 方案 C：Lua Processor 精细控制（最灵活）

当需要更复杂的逻辑（比如"3 码唯一自动上，3 码重码弹菜单；4 码一律上屏"），可以用 Lua processor 实现。参考万象虎 `auto_commit.lua` 的做法：

```lua
function M.func(input, env)
  local context = env.engine.context
  local input_str = context.input
  local input_len = utf8_len(input_str)

  -- 码长 = 3 时，检查候选数
  if input_len == 3 then
    local count = 0
    for cand in input:iter() do count = count + 1 end
    if count == 1 then
      -- 唯一：yield + auto commit
      for cand in input:iter() do
        yield(cand)
        env.engine:commit_text(cand.text)
        context:clear()
      end
      return
    end
  end

  -- 其他情况正常输出
  for cand in input:iter() do yield(cand) end
end
```

---

## 三、table_translator 与 chord_composer 交互模式

### 3.1 架构关系

```
键盘事件
  │
  ▼
chord_composer (processor)     ← 并击 → 字母表排序 → algebra → 输出编码串
  │
  ▼
speller (processor)            ← 接受 chord_composer 输出的编码 + 用户串击
  │                              执行 algebra（拼写运算）
  ▼
segmentors                     ← abc_segmentor 标记 abc tag
  │
  ▼
translators
  ├─ table_translator          ← 查码表，产出候选
  └─ echo_translator           ← 没有候选时回显
  │
  ▼
filters
  └─ simplifier / uniquifier / ...
```

### 3.2 chord_composer 配置要点

```yaml
engine:
  processors:
    - chord_composer    # 必须在 speller 之前！
    - lua_processor@popping
    - recognizer
    - key_binder
    - speller          # 接收 chord_composer 产出的编码
    - punctuator
    - selector
    - navigator
    - express_editor

chord_composer:
  # 字母表：并击按键按字母表顺序排列
  # 左手在左、右手在右，空格分隔两组
  alphabet: "12345qwertasdfgzxcvb 67890yuiophjkl;nm,./"

  # 拼写运算：把物理按键组合 → 码元编码
  algebra:
    - xform/^([0-9a-z]+)([0-9a-z]+)$/[$1$2]/    # 左右并击 → 方括号格式
    - xform/^([0-9a-z]+) ([0-9a-z]+)$/($1$2)/    # 带空格并击 → 圆括号格式
    # ... 更多指法映射规则

  # 并击完成后的输出格式
  output_format:
    - xform|^[-=_+]([0-9]+)$|$1|

  # 并击过程中显示的提示格式
  prompt_format:
    - xform/\[(..)\]/$1/g
    - xform/\((..)\)/$1/g
    - xform/[-=_+]//g
```

### 3.3 chord_composer → table_translator 数据流

1. 用户 **并击** 多个键 → `chord_composer` 把按键按 `alphabet` 排序，组合成一个"并击码"
2. `chord_composer` 的 `algebra` 把物理键序列转换成码元编码（例如双键并击 `q`+`w` → `B`）
3. 转换后的编码追加到输入缓冲区（作为一个原子单元）
4. 用户可以继续 **串击** → `speller` 接受普通字符
5. 最终完整编码传给 `abc_segmentor` → `table_translator` 查码表出候选

**关键点**：`chord_composer` 产出的编码和 `speller` 串击输入的编码，在进入翻译阶段前是 **一视同仁** 的。码表里只需要定义最终的编码序列即可，不需要区分来源是并击还是串击。

### 3.4 实战：麓鸣（yoyo-bm）方案的交互模式

```yaml
# 引擎顺序
engine:
  processors:
    - chord_composer        # 1. 处理并击 → 输出排序编码
    - lua_processor@popping  # 2. 顶功 Lua processor
    - lua_processor@commit_raw # 3. 纯码元上屏
    - speller              # 4. 接受并击+串击 → 执行 algebra

chord_composer:
  alphabet: "12345qwertasdfgzxcvb 67890yuiophjkl;nm,./"
  algebra:
    __patch:
      - 北冥神功   # 并击 → [左右] / (左右) / -左 / =右 / _左 / +右 格式

speller:
  alphabet: "zyxwvutsrqponmlkjihgfedcba;,./ZYXWVUTSRQPONMLKJIHGFEDCBA:<>?[]()_+-='"
  auto_select: true
  auto_select_pattern: "'.+"  # 快符候选唯一则顶屏
  algebra:
    - xform|^([a-zA-Z;:,<.>/?]{2})([a-zA-Z;:,<.>/?]*)$|($1)$2|    # 处理词编码
    - derive|^(\([a-zA-Z;:,<.>/?]{2}\))([a-zA-Z;:,<.>/?]{2})$|$1($2)|
    # ...

translator:
  dictionary: yoyo-bm
  prism: yoyo-bm
  enable_sentence: false
  enable_completion: false
```

**并击+串击混合示例**：
- 双手并击 `qw + yt` → chord_composer 输出 `(qwy t)` → speller 拼成 `(qwyt)` → translator 查码表出词
- 左手并击 `qw` + 串击 `r` + 右手并击 `yt` → 经过多层 algebra 转换 → translator 出字

---

## 四、Lua 强制代码边界方案

当内置配置无法满足需求时，可以用 Lua processor 在 **按键处理阶段** 注入自定义的顶屏/分屏逻辑。

### 4.1 可用的 Lua 对象 API（关键接口）

| 对象 | 方法/属性 | 用途 |
|---|---|---|
| `env.engine.context` | `.input` | 当前输入编码字符串 |
| | `.caret_pos` | 光标位置 |
| | `.has_menu()` | 是否有候选菜单 |
| | `.is_composing()` | 是否正在输入 |
| | `.push_input(text)` | 在光标处插入编码 |
| | `.pop_input(num)` | 删除光标前 N 个编码 |
| | `.clear()` | 清空输入 |
| | `.commit()` | 上屏当前选中的候选 |
| | `.confirm_current_selection()` | 确认当前候选（但不上屏） |
| | `.get_option(name)` | 读取开关状态 |
| `env.engine` | `.commit_text(text)` | 直接上屏原始文本 |
| `context.composition:back()` | `.selected_index` | 当前选中候选下标 |
| | `.menu:candidate_count()` | 已加载候选数 |
| `env.engine.schema.config` | `.get_string(key)` / `.get_bool(key)` | 读取方案配置 |
| | `.get_list(key)` | 读取列表型配置（如 popping 规则） |

### 4.2 方案一：popping 顶功（yoyo 自研）

popping 是一个 **自定义 Lua processor**（不在官方 Rime 中），通过 YAML 配置规则实现"上下文感知的顶屏"。

**配置位置**：`speller/popping`

**每条规则结构**：
```yaml
speller:
  popping:
    - match: "正则匹配当前输入"
      accept: "正则匹配即将按下的键"
      when: "可选：依赖某个开关"
      prefix: 可选数字，顶屏后保留的编码长度
      strategy: pop | append | conditional
```

**yoyo-bm 中的实战规则**：
```yaml
speller:
  popping:
    # 一简字词（无前缀标记），打出任何非 ' 键 → 顶屏
    - match: "[^']+"
      accept: "[_+]"

    # 单字前两码已出，再打 [ 或 ( → 顶屏（准备下一个字）
    - match: "[[][a-zA-Z;:,<.>/?]{2}[]]"
      accept: "[[(]"

    # 单字前三码全码已出，再打非数字空格'的键 → 顶屏
    - match: "[[][a-zA-Z;:,<.>/?]{2}[]][-=][a-zA-Z;:,<.>/?]"
      accept: "[^0-9 ']"

    # 带空格并击两次（词全码），再打非数字空格'的键 → 顶屏
    - match: (\([a-zA-Z;:,<.>/?]{2}\)){2}
      accept: "[^0-9 ']"
```

**popping.lua 核心逻辑**（简化版）：
```lua
function processor.func(key_event, env)
  local incoming = utf8.char(key_event.keycode)
  local input = yoyo.current(context)

  for _, rule in ipairs(env.popping) do
    if rime_api.regex_match(input, rule.match)
       and rime_api.regex_match(incoming, rule.accept) then
      -- 策略：pop = 顶屏后不清屏；append = 不顶屏直接追加
      if context:has_menu() then
        context:confirm_current_selection()
        context:commit()
      end
    end
  end
  return yoyo.kNoop  -- 让后续 processor 继续处理
end
```

### 4.3 方案二：Lua Filter 自动提交（万象虎 auto_commit.lua）

在 filter 阶段对特定码长进行检查，唯一候选时自动上屏：

```lua
function M.func(input, env)
  local context = env.engine.context
  local input_str = context.input
  local input_len = utf8_len(input_str)

  if input_len == 3 then
    local count = 0
    local first_cand = nil
    for cand in input:iter() do
      count = count + 1
      first_cand = cand
    end
    if count == 1 then
      yield(first_cand)
      env.engine:commit_text(first_cand.text)
      context:clear()
      return
    end
  end

  for cand in input:iter() do yield(cand) end
end
```

### 4.4 方案三：Lua Processor 在按键时主动 commit

在 processor 阶段拦截特定按键序列，检测到完整编码后主动上屏：

```lua
function auto_split_processor(key_event, env)
  local context = env.engine.context
  local input = context.input
  local incoming = utf8.char(key_event.keycode)

  -- 检测：当前已有 3 码且即将输入第 4 个字符 → 顶屏
  if input:len() == 3 and context:has_menu() then
    -- 检查码表中是否存在以当前 3 码为前缀的 4 码编码
    -- 如果不存在（即 3 码已经是完整编码），顶屏
    context:confirm_current_selection()
    context:commit()
  end

  return 2  -- kNoop：让后续 processor 继续处理
end
```

### 4.5 方案对比

| 方案 | 作用阶段 | 精确度 | 配置难度 | 灵活性 |
|---|---|---|---|---|
| `auto_select` | speller 内部 | 仅唯一候选 | 最低（YAML 一个开关） | 低 |
| `auto_select_pattern` | speller 内部 | 正则驱动 | 低（写正则） | 中 |
| `max_code_length` | speller 内部 | 纯长度阈值 | 最低 | 低 |
| **popping**（yoyo 自研） | lua_processor | 上下文+前瞻 | 中（写规则） | **高** |
| **auto_commit filter** | lua_filter | 候选数检查 | 中 | **高** |
| **processor 拦截** | lua_processor | 按键级精确控制 | 高（写 Lua） | **最高** |

---

## 五、完整配置示例

### 示例：3 码单字自动上屏方案

```yaml
schema:
  name: 三字码方案
  schema_id: sanzi
  version: 1.0

engine:
  processors:
    - ascii_composer
    - recognizer
    - key_binder
    - speller          # 处理输入 + 自动上屏
    - punctuator
    - selector
    - navigator
    - express_editor
  segmentors:
    - ascii_segmentor
    - matcher
    - abc_segmentor
    - punct_segmentor
    - fallback_segmentor
  translators:
    - punct_translator
    - table_translator
    - echo_translator
  filters:
    - uniquifier
    - single_char_filter    # 遮蔽词组，单字优先

speller:
  alphabet: abcdefghijklmnopqrstuvwxyz
  max_code_length: 3
  auto_select: true
  auto_select_pattern: '^[a-z]{3}$'    # 恰好 3 码时一律自动上屏
  use_space: true

translator:
  dictionary: sanzi
  enable_sentence: false    # 关闭自动造句，避免干扰唯一性判断
  enable_encoder: false
  enable_completion: false  # 不做编码提示

switches:
  - name: ascii_mode
    reset: 0
    states: [中文, 西文]
```

### 示例：并击 + 串击混合码表方案（麓鸣骨架）

```yaml
engine:
  processors:
    - ascii_composer
    - chord_composer         # 并击处理
    - lua_processor@popping  # 顶功
    - recognizer
    - key_binder
    - speller               # 串击 + 拼写运算
    - punctuator
    - selector
    - navigator
    - express_editor

chord_composer:
  alphabet: "12345qwertasdfgzxcvb 67890yuiophjkl;nm,./"
  algebra:
    - xform|^([0-9a-z]+)([0-9a-z]+)$|[$1$2]|
    - xform|^([0-9a-z]+) ([0-9a-z]+)$|($1$2)|
    # 指法映射...

speller:
  max_code_length: 6
  auto_select: true
  auto_select_pattern: "'.+"
  algebra:
    # 把 chord_composer 输出的格式 → 码表实际编码
    - xform|^\[([a-zA-Z]{2})\]([a-zA-Z]*)$|$1$2|
    # ...

translator:
  dictionary: myscheme
  prism: myscheme
  enable_sentence: false
```

---

## 六、踩坑与注意事项

1. **`auto_select_pattern` 的正则匹配原始输入**：还没经过 `algebra` 变换。如果你用 chord_composer 输出了非字母字符（如 `[`、`]`、`(`、`)`），正则要匹配的是这些中间格式。

2. **关闭 auto_encoder**：如果码表是严格定长码，建议关掉 `table_translator.enable_encoder` 和 `enable_sentence`，防止自动造词干扰 auto_select 的唯一性判断。

3. **Lua processor 返回值**：
   - `0` = kRejected（处理完毕，交还 OS）
   - `1` = kAccepted（处理完毕，不再流转）
   - `2` = kNoop（不处理，交给下一个 processor）

4. **popping 的 `accept` 前瞻**：popping 规则用 `accept` 匹配"下一个即将按下的键"。实现上是 processor 先于 speller 执行，此时输入区还没包含这个新键，所以 popping 需要自己判断"如果用户按下 X，是否应该顶屏"。

5. **`auto_select_length` 不存在**：这个概念在社区讨论中偶尔出现，但不是官方配置。用 `auto_select_pattern: '^[a-z]{3}$'` 实现"3 码自动上屏"即可。

6. **多 translator 场景**：如果你同时有 `table_translator` 和 `script_translator`，auto_select 的唯一性判断是基于 **当前 active translator** 的候选数。确保 segmentor 正确标记了 tag。

---

## 七、参考资源

| 资源 | 链接 |
|---|---|
| Rime 官方 Wiki | https://github.com/rime/home/wiki |
| RimeInn Schema 详解 | https://rimeinn.github.io/rime/schema.html |
| RimeInn Lua API | https://rimeinn.github.io/plugin/lua/API.html |
| LEOYoon-Tsaw 配置详解 | https://github.com/LEOYoon-Tsaw/Rime_collections |
| librime 源码 | https://github.com/rime/librime |
| 麓鸣方案（本地） | `/home/jackwy/codes/rime/yoyo/rime/` |
| 万象虎 auto_commit.lua | `/home/jackwy/codes/rime/wxzhh/lua/auto_commit.lua` |
| 虎码 Tigress 四码上屏 | https://old-y.github.io/blog/p/%E8%99%8E%E7%A0%81%E7%94%A8%E6%B3%95%E8%AE%B0%E5%BD%95/ |
