# 两键并击标点自定义指南（km_punct）

> 本指南说明「状态机里一击上屏的两键并击符号」写在哪、改什么、怎么改。
> 这套机制和 `yoyo_kf.dict.yaml`（单键快符）**完全无关**——去掉 `yoyo_kf` 不影响本套符号。

## 一、机制总览（两层 + 接线）

打一个符号分两步，物理「两键并击」→ 中间标记 → 实际符号：

```
键盘两键并击
   │  (chord_composer 状态机)
   ▼
~comma / ~dquote ...   （~ 开头的内部标记串，不直接上屏）
   │  (第 1 层：键位 → 标记，在 yoyo.yaml 定义)
   ▼
km_punct.lua 拦截标记串 → 先顶出缓冲区挂起的字 → 把符号一击直接上屏
   │  (第 2 层：标记 → 实际符号，在 km_punct.lua 定义)
   ▼
， 。 “” ……   （最终打出来的字）
```

**接线位置**：`rime/yoyo-pure-km.schema.yaml` 处理器链（约 46–48 行）

```yaml
- chord_composer
- lua_processor@*yoyo.km_punct     # 第 2 层翻译器
- lua_processor@*yoyo.pure_popping
```

所以「改键位」动 `yoyo.yaml`，「改输出的符号 / 加新符号」动 `km_punct.lua`，二者通过 `~xxx` 标记名对齐。

---

## 二、第 1 层：键位 → 标记（`rime/yoyo.yaml`）

归属方案：**空明拳**（yoyo-km），位于 `rime/yoyo.yaml` 第 **678–694** 行（`空明拳:` 段内，`# 标点符号并击（16 组全 2 键无冲突）：` 注释下）。

```yaml
  # 标点符号并击（16 组全 2 键无冲突）：
    - xform/^[_+](fg|gf)$/~comma/
    - xform/^[_+](ad|da)$/~period/
    - xform/^[_+](ag|ga)$/~enum_comma/
    - xform/^[_+](xb|bx)$/~semicolon/
    - xform/^[_+](rt|tr)$/~colon/
    - xform/^[_+](zb|bz)$/~question/
    - xform/^[_+](zc|cz)$/~exclamation/
    - xform/^[_+](vb|bv)$/~ellipsis/
    - xform/^[_+](qe|eq)$/~dash/
    - xform/^[_+](cb|bc)$/~middledot/
    - xform/^[_+](fb|bf)$/~dquote/
    - xform/^[_+](ac|ca)$/~squote/
    - xform/^[_+](ax|xa)$/~book_quote/
    - xform/^[_+](fv|vf)$/~paren/
    - xform/^[_+](ab|ba)$/~bracket/
    - xform/^[_+](dc|cd)$/~corner_bracket/
```

### 当前完整映射表

| 并击（左右键，顺序无关） | 标记 | 符号 |
|---|---|---|
| f g / g f | `~comma` | ， |
| a d / d a | `~period` | 。 |
| a g / g a | `~enum_comma` | 、 |
| x b / b x | `~semicolon` | ； |
| r t / t r | `~colon` | ： |
| z b / b z | `~question` | ？ |
| z c / c z | `~exclamation` | ！ |
| v b / b v | `~ellipsis` | …… |
| q e / e q | `~dash` | —— |
| c b / b c | `~middledot` | · |
| f b / b f | `~dquote` | “ ” |
| a c / c a | `~squote` | ‘ ’ |
| a x / x a | `~book_quote` | 《 》 |
| f v / v f | `~paren` | （ ） |
| a b / b a | `~bracket` | 【 】 |
| d c / c d | `~corner_bracket` | 「 」 |

> 注意：每条规则的 `fg|gf` 是被 chord_composer 排序后的键名（按字母序），改键位时务必用排序后的串，且并击两个键要都覆盖正反两种顺序。

---

## 三、第 2 层：标记 → 实际符号（`rime/lua/yoyo/km_punct.lua`）

位于 `rime/lua/yoyo/km_punct.lua` 第 **11–31** 行，两张表：

```lua
local STATIC_PUNCT = {          -- 固定单符号：一对一并击直接上屏
  ["~comma"] = "，",
  ["~period"] = "。",
  ["~enum_comma"] = "、",
  ["~semicolon"] = "；",
  ["~colon"] = "：",
  ["~question"] = "？",
  ["~exclamation"] = "！",
  ["~ellipsis"] = "……",
  ["~dash"] = "——",
  ["~middledot"] = "·",
}

local TOGGLE_PUNCT = {          -- 成对开/闭符号：第一次按出左、再按出右
  ["~dquote"] = { open = "“", close = "”", key = "dquote" },
  ["~squote"] = { open = "‘", close = "’", key = "squote" },
  ["~book_quote"] = { open = "《", close = "》", key = "book_quote" },
  ["~paren"] = { open = "（", close = "）", key = "paren" },
  ["~bracket"] = { open = "【", close = "】", key = "bracket" },
  ["~corner_bracket"] = { open = "「", close = "」", key = "corner_bracket" },
}
```

- **STATIC_PUNCT**：每次并击都输出同一个符号（逗号、句号、顿号等）。
- **TOGGLE_PUNCT**：开闭成对。第一次按出 `open`，第二次按出 `close`，第三次又回到 `open`……（由 `processor.init` 里的 `env.toggles` 状态决定）。`key` 字段必须与表项键名一致，用于区分各符号的开关状态。

---

## 四、常见改动清单

### A. 改「输出什么符号」（不改键位）
只动 `km_punct.lua`。例如把 `~comma` 的输出改成英文逗号：

```lua
  ["~comma"] = ",",
```

或对成对符号换一组括号：

```lua
  ["~paren"] = { open = "(", close = ")", key = "paren" },
```

> ⚠️ 成对符号的 `key` 字段不要改；改了会破坏开关状态。

### B. 改「哪个并击出这个符号」（不改输出）
只动 `yoyo.yaml` 第 678–694 行。例如把逗号改由 `qw` 并击打出：

```yaml
    - xform/^[_+](qw|wq)$/~comma/
```

（同时把原来那行 `fg|gf` 删掉或改去别的标记，避免一个并击映射两个标记。）

### C. 增加一个新符号
**两层都要加，且 `~xxx` 标记名必须一致**：

1. `yoyo.yaml` 加一条键位规则：
   ```yaml
       - xform/^[_+](eg|ge)$/~percent/     # 例：e+g 并击 → ~percent
   ```
2. `km_punct.lua` 加一条对应表项（单符号进 STATIC_PUNCT，成对进 TOGGLE_PUNCT）：
   ```lua
   local STATIC_PUNCT = {
     ...
     ["~percent"] = "%",
   }
   ```
   若为成对符号，还要在 `processor.init` 的 `env.toggles` 里加一个开关字段：
   ```lua
   env.toggles = {
     dquote = false,
     ...
     percent = false,   -- 新增
   }
   ```

### D. 删除一个符号
对应地从 `yoyo.yaml` 和 `km_punct.lua` 两处都删掉即可。

---

## 五、改动后如何生效

`yoyo.yaml`（YAML 配置）和 `km_punct.lua`（Lua 处理器）都是**部署时加载**，无需重编译词典。改完执行：

```bash
fcitx5-remote -r     # 或 在 fcitx5 配置里点「重新部署」
```

部署后即可在 yoyo-km 方案下用新的并击打出符号。

---

## 六、易错点提醒

1. **第 1 层规则里的键名是 chord_composer 排序后的串**（按字母序）。并击两个键要同时写正反两种顺序（`fg|gf`），否则只覆盖一种手序。
2. **标记名（`~xxx`）两层必须完全一致**，否则第 2 层查不到，符号打不出来。
3. **成对符号的 `key` 字段别乱改**，它是开/闭状态机的索引。
4. 本套符号**不经过拼音反查**，也没有收录进 `pure_dict_map.lua`，与 `yoyo_kf` 单键快符是两套独立机制。
5. `km_punct.lua` 在提交上屏符号前会先调用 `commit_pending_input` 顶出缓冲区里挂起的字（如一简、两码字、四码词），所以并击标点能「插」在已输入的字之前直接上屏，不会吞掉前面的字。
