# convert_to_dazhu.py 替换逻辑说明

## 概述

`convert_to_dazhu.py` 用于将原始码表转换为大竹码表格式，并按照特定规则替换编码中的特殊字符。

## 替换规则

### 优先级 1：整个编码只有两个字符

如果编码**整个**是 `-x` 或 `=x`（恰好两个字符），使用特殊的替换集：

| 原始格式 | 替换集 | 说明 |
|---------|--------|------|
| `-x` | `fourth_set` | 整个编码是两个字符的 `-字母` |
| `=x` | `fifth_set` | 整个编码是两个字符的 `=字母` |

**示例：**
- `-d` → `𝕕`
- `=e` → `𝐞`

### 优先级 2：圆括号处理

圆括号 `(..)` 直接删除括号，保留内部内容（内部内容不做任何替换）。

**示例：**
- `(aw)` → `aw`
- `(XB)(Af)` → `XBAf`

### 优先级 3：方括号处理

方括号 `[xy]` 用 `second_set` 替换其中的字符，按每两个字符一组进行处理。

**示例：**
- `[rr]` → `𝕣𝕣`
- `[fi]` → `𝕗𝚒`
- `[d.]` → `𝑑．`

### 优先级 4：混合情况（-x 和 =x）

如果 `-x` 或 `x` 不是整个编码（前面还有其他部分），则使用：

| 格式 | 替换集 |
|------|--------|
| `-x` | `first_set` |
| `=x` | `third_set` |

**示例：**
- `[d.]-O` → `𝑑．𝙾`（方括号用 `second_set`，`-O` 用 `first_set`）
- `[wC]=s` → `𝑤𝐂𝒔`（方括号用 `second_set`，`=s` 用 `third_set`）

## 替换集对应关系

| 替换集 | 包含内容 | 用途 |
|--------|----------|------|
| `first_set` | `monospace_set` + `symbol_1` | 普通 `-x` 替换 |
| `second_set` | `roman_set` + `symbol_2` | 方括号 `[xy]` 替换 |
| `third_set` | `bold_italic_set` + `symbol_3` | 普通 `=x` 替换 |
| `fourth_set` | `shuangxian` + `symbol_4` | 整个 `-x` 替换 |
| `fifth_set` | `bold_set` + `symbol_5` | 整个 `=x` 替换 |

## 使用方法

```bash
python convert_to_dazhu.py <输入文件> <输出文件>
```

**示例：**
```bash
python convert_to_dazhu.py for_dazhu.yaml yoyo-dazhu.txt
```

## 输入输出格式

**输入格式：**
```
词    编码    词频
```

**输出格式：**
```
编码    候选1    候选2    候选3    ...
```

## generate_reverse_data.py 拼音反查派生数据生成

### 用途

为纯形支四方案（`yoyo-bm`、`yoyo-wx`、`yoyo-bm-km`、`yoyo-wx-km`）生成拼音反查派生数据。
输入 `` ` `` + 无声调全拼即可反查字/词并显示纯形码元。

### 数据源（均为仓库内 tracked 文件）

- `rime/scripts/编码生成和重码可视化/data/pinyin.txt` — 单字读音
- `rime/scripts/编码生成和重码可视化/data/base.dict.yaml.gz` — 词拼音源（白霜词库）
- `rime/yoyo-bm.dict.yaml` — 字/词编码（四方案共享此字典）

### 产出

`rime/lua/yoyo/data/reverse_<initial>.lua`，按拼音首字母分 23 片
（`i`/`u`/`v` 不构成合法拼音首字母，无对应分片）。
每片形如 `return { ["key"] = {{"text","code","weight"}[,"brief"], ...}, ... }`。

第 4 元素 `brief` 是空格并击简码（`%` 前缀，保留 `_`/`+` 手指示符），
反查注释因此显示为 `全码 | 简码`（例：`vpxb | %_v`）。
仅当简码与全码不同才挂第 4 元素；用户词表里只有简码、无全码的词，
主码本身就取简码（注释即 `%tD`），不再重复显示。

### 用法

```bash
python3 rime/scripts/generate_reverse_data.py            # 自检通过后写 26 分片
python3 rime/scripts/generate_reverse_data.py --dry-run  # 仅自检不写文件
python3 rime/scripts/generate_reverse_data.py --check    # 校验磁盘分片是否陈旧（不一致退出码 1）
python3 rime/scripts/generate_reverse_data.py --out-dir DIR
```

`--check` 是**陈旧守卫**。分片是 tracked 的生成物，与数据源脱钩不会报错也不会崩，
只会安静地按过期数据出候选（2026-09-07 就发生过一次：`brief` 字段整批丢失，
反查里 996 条空格并击简词全部退回只显示全码，直到 2026-10-29 才被发现）。
改动数据源或生成器后请先跑 `--check`，它通过才说明仓库里的分片是当前的。

### 自检门槛

- 词库主条目词拼音覆盖率（异形词缺失 < 5% 不阻断）
- 单字表所有字有读音
- 生成字码全部来自单字表条目；生成词码全部来自词库主条目
- 候选按权重降序
- 编码去标记后无 `! @ - < > + _ [ ] ( ) =` 残留，长度 ≤ 24
- 单字码长 ∈ {1, 2, 3, 5}（一简 / 两码 / 全码）

### 联动

**键位重排 / 改词库后必须重跑此脚本**，否则反查候选注释里的纯形码元会过期。
`gen_brief_words.py --write` 写完 `yoyo-user.dict.yaml` 后已自动重跑本脚本；
手工加词、改 `yoyo-pure.dict.yaml`、或改本脚本人手改后，请自行重跑，
并用 `--check` 确认分片已跟上。
