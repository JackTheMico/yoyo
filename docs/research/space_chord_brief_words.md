# 空格并击简词可行性调研

> 问题：与其用 `'` 前置引导简词（当前实现：点 `'` → 并击 → 再接一键顶屏，2.5 击），
> 能否用「**空格参与并击**」让简词**一击上屏**？
> 结论：**可行，而且比 `'` 前缀更好**——双手+空格是 yoyo-pure-km 里**完全空闲**的命名空间，
> 容量 3600 位，机制上可做到真正的一击上屏（无需再接下一键）。

## 一、证据链

### 1. 空格并击在 librime 里真的可用 —— 本仓库已有生产实现

`rime/yoyo-bm-km.schema.yaml:83` 的「北冥神功」心法（一个已投入使用的方案）三条规则全部匹配空格：

```yaml
# 双手带空格 → 词的前两码（(XY) 括号形式）
- xform|^(?=.*[12345qwertasdfgzxcvb])(?=.*[67890yuiophjkl;nm,./])([0-9a-z;,./]*) ([0-9a-z;,./]*)$|($1$2)|
# 单手（左）带空格 → 单字/词的第三、四码（-X 形式）
- xform|^(?=.*[12345qwertasdfgzxcvb])([12345qwertasdfgzxcvb]*) ([12345qwertasdfgzxcvb]*)$|-$1$2|
# 单手（右）带空格 → 单字/词的第三、四码（=X 形式）
- xform|^(?=.*[67890yuiophjkl;nm,./])([67890yuiophjkl;nm,./]*) ([67890yuiophjkl;nm,./]*)$|=$1$2|
```

这说明：① chord_composer 的 alphabet 里的空格字符是**合法并击键**；② 空格在序列化输出串中的
位置由 alphabet 下标决定——`yoyo-bm-km` 的 alphabet 是
`"12345qwertasdfgzxcvb 67890yuiophjkl;nm,./"`，空格位于左右手区之间，所以输出形如 `左 右`。

`yoyo-pure-km` 的 alphabet 同样是 `qwertasdfgzxcvb␣yuiophjkl;nm,./'`（空格下标 15，也在两手之间），
形态一致 ✓

> 未取得 librime C++ 源码核实（本轮后台抓取失败）。上述结论来自**本仓库内正在使用的方案配置**，
> 属于一手的、可运行的事实证据，强于源码推断。如需源码级确认，再抓
> `rime/librime:src/rime/gear/chord_composer.cc` 的 `chording_keys_` 解析部分。

### 2. yoyo-pure-km 的心法**没有**任何空格规则 ⇒ 命名空间全空

`rime/yoyo-pure-km.schema.yaml:104` 的「纯形统一心法」只有 3 条：

```yaml
- xform|^([qwertasdfgzxcvb]+)([yuiophjkl;nm,./]+)([']?)$|$1#$2$3|   # 双手（无空格）
- xform|^([qwertasdfgzxcvb]+)([']?)$|_$1$2|                          # 左手（无空格）→ 一简
- xform|^([yuiophjkl;nm,./]+)([']?)$|+$1$2|                          # 右手（无空格）→ 一简
```

三条都不含空格 ⇒ **空格相关的三个命名空间（双手+空格 / 左手+空格 / 右手+空格）全部空闲**。

仿真验证现有规则对空格和弦的行为（`rime/scripts/test_space_chord_brief.py`）：

```
'sd hj' → 心法+指法 → 'k gf'
```

即：现有规则**不改写**它，指法把两手各归并成码元后，空格**原样留在中间**下传给 speller。
而 `yoyo-pure-km` 的 `speller/alphabet`（`:91`）**不含空格** ⇒ 这个串目前是「裸漏」状态，
打出来要么被吞掉空格（变成 `kgf` 三码），要么报非法——**没有任何既有功能占用它**。

### 3. 编码空间仿真：3600 位，零冲突

`rime/scripts/test_space_chord_brief.py`（全部断言通过）：

| 项 | 结果 |
|---|---|
| 双手+空格（`左 右`） | **3600 位**（60 左手码元 × 60 右手码元，互不重复） |
| 单手+空格 | 60 位（若区分左右手可扩到 120） |
| 与既有空间重叠 | **0**（一简 `_X/+X`、两码字 `XY`、三码字、四码词、`'` 简词 `'XY`、次选 `XY'` 全不相交） |
| 新码形 | 统一 `%XY`（3 字符、不含空格） |

### 4. prism 实证：`%` 标记码能编译、能 roundtrip

`/tmp/rimetest2`（`rime_deployer --build` + `rime_table_decompiler` 反编译），7/7 条目通过：

```
最多    %wS    80      # 双手+空格码位
看起来  %id    70
扩展简词 %xy    90
他们    %+w    60      # 单手+空格（右手）
时间    %_w    50      # 单手+空格（左手）
```

与之前 `'` 编码的实证结论一致：prism/table 对非常规标记字符没有限制。

## 二、实施方案（4 处改动）

### 1. 心法加规则（`yoyo-pure-km.schema.yaml` 的 `纯形统一心法`，**置于现有 3 条之前**）

```yaml
- xform|^([qwertasdfgzxcvb]+) ([yuiophjkl;nm,./]+)$|%$1#$2|   # 双手+空格 → 简词（沿用 # 隔离）
- xform|^([qwertasdfgzxcvb]+) $|%_$1|                         # 左手+空格（可选，60 位）
- xform|^([yuiophjkl;nm,./]+) $|%+$1|                         # 右手+空格（可选，60 位）
```

`%` 是简词标记；`#` 是现有隔离符，指法末尾的 `xform|#||`（`yoyo.yaml:412/544`）会自动清除它，
两手各自归并成码元 ⇒ 最终 `%XY`。

### 2. speller alphabet 加 `%`

```yaml
speller:
  alphabet: "zyxwvutsrqponmlkjihgfedcba;,./%ZYXWVUTSRQPONMLKJIHGFEDCBA:<>?_+'"   # 插入 %
  initials: "…同上…"
```

### 3. pure_popping 加「末字符到达即顶屏」Pattern（真·一击上屏的关键）

chord 输出是**逐字符注入**的：`%` → `X` → `Y`。所以在 `Y` 作为 `incoming` 到达时，
`input .. incoming == "%XY"` 命中简词表就**立即提交 + 吞掉该字符**（`kAccepted`）——
与现行「`'` 次选拦截」（`pure_popping.lua:113`）同一手法，不依赖 `speller/auto_select`
（本方案该值为 `false`，不用改）。

```lua
-- Pattern S：空格并击简词（% 前缀，一击上屏）
if input:sub(1,1) == "%" then
  local full = input .. incoming
  local text = pure_data.space_brief_map and pure_data.space_brief_map[full]
  if text then
    env.processing = true
    env.engine:commit_text(text)
    context:clear()
    env.processing = false
    return yoyo.kAccepted          -- 吞掉末字符，不再进 input
  end
  if #full >= 3 then               -- 未定义位：清空死缓冲
    context:clear()
  end
  return yoyo.kNoop
end
```

注意 `%` 开头的输入必须先于其他 Pattern 判定（放在 `incoming == "'"` 拦截之后、
各字母 Pattern 之前即可）。

### 4. 词典与生成器

- 简词条目写入 `yoyo-user.dict.yaml`，编码 `%XY`（与现有 `'XY` 互不干扰）
- `generate_pure_dict_map.py` 增加 `space_brief_map`（与 `brief_map` 同样只收 `%` 前缀码）
- `gen_brief_words.py` 增加 `--space` 模式：把 992 条简词分配 `%XY` 码位（可沿用字根规则）
- `practice_tool`：`km_brief_practice.js` 加一格「空格并击」模式（第 1 击步骤改为 `空格+双手`）

## 三、关键决策与权衡

| 问题 | 结论 |
|---|---|
| 标记符为什么选 `%` | `~` 被 km_punct 的内部标记（`~comma` 等）占用；`()[]` 是北冥风格的词标记；字母与 `;:,<.>/?` 是码元本身；`_ + '` 分别为一简左右手 / 次选。只剩 `:` `<` `>` `?`…这些是码元，故只能**新增一个字符**，`%` 最干净 |
| 一击上屏怎么做到 | 靠「末字符 incoming 时匹配提交并吞掉」，与 `'` 次选同机制；**不需要** `auto_select` |
| 与 `'` 简词的关系 | 两套**可并存**（`'` 前缀 2 击 vs 空格并击 1 击）。建议迁到空格版，`'` 版保留若干高频词作为「不占用拇指」的备选，或最终删除 |
| 误触发风险 | 空格+双手要求**左右手各至少一键 + 拇指空格**才会误触，比「单手+空格」安全得多——这也是建议只启用双手位的原因。北冥的「双手+空格 = 词前两码」属于同量级风险且已在生产使用中。误触代价=上屏一个词（可退格） |
| 容量 | 3600 位 vs 现有 992 条简词，余量充足；后续还能再吃下空明码第二档 |

## 四、遗留待确认

1. librime 源码级确认（空格在 `chording_keys_` 的解析、注入串里空格字符的命运）——本轮未取到源码，
   由「北冥方案在用」间接证实。
2. 空格与「候选首选上屏」的默认绑定：当前 input 里出现 `%` 前缀不会产生候选，故不冲突；
   但 `when: composing` 的空格行为建议实机验证一次。
3. 误触率：建议先在小范围（例如只开放高频 200 词的码位）用一周再全量放。

## 复现

```bash
python3 rime/scripts/test_space_chord_brief.py     # 编码空间仿真（含零冲突断言）
python3 /tmp/rimetest2/mkdict.py && cd /tmp/rimetest2 && rime_deployer --build . \
  && rime_table_decompiler build/sptest.table.bin  # % 码编译 roundtrip 实证
```
