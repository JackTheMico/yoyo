# 编码生成和重码可视化

从仓库内的最终拆分数据和完整基础词库，生成音形方案的初始单字/词编码、Rime
字典以及分层重码报告。`main.py` 已合并原来的四个分步脚本，**只依赖 Python
3 标准库**。

## 一键运行

在仓库根目录执行：

```bash
python3 "rime/scripts/编码生成和重码可视化/main.py"
```

也可以进入本目录后执行 `python3 main.py`。默认路径都基于 `main.py` 所在目录，
因此从哪里启动都一样。

默认一次完成：

1. `code.txt` + `elements.txt` + `pinyin.txt` → 单字编码；
2. 完整白霜基础词库 → 多字词全码与简码；
3. 单字/多字词 × 全码/简码的分层重码报告；
4. JSONL → Rime YAML 字典。

当前数据的基准结果：

- 单字编码记录：8,454 条，对应 8,105 个不同汉字；
- 多字词编码记录：1,493,563 条，对应 1,491,231 个不同词；
- 完整运行约生成 293 MiB 的 JSONL/YAML，另加重码详情。

## 输入

```text
编码生成和重码可视化/
├── main.py
├── config.yaml
├── data/
│   ├── code.txt               # huma 导出：词条 → 全码/简码
│   ├── elements.txt           # huma 导出：词条 → 拆分序列；与 code.txt 逐行对齐
│   ├── pinyin.txt             # 单字读音与权重
│   └── base.dict.yaml.gz      # 完整白霜基础词库，无损 gzip 压缩
└── output/                    # 生成物，已被 git 忽略
```

这里仅保留默认流程必需的四份输入。原目录中的 `jichu.dict.yaml`、chai 词库、
字根优化 YAML 等是备用来源或重复数据，不参与默认生成，因此没有复制进仓库。

`base.dict.yaml.gz` 解压后是普通 Rime YAML，压缩只为把仓库占用从 45.3 MiB
降到 14.5 MiB；`main.py` 会直接流式读取，不需要手动解压。来源与数据边界见
[`data/README.md`](data/README.md)。

## 输出

| 路径 | 内容 |
|---|---|
| `output/zi.jsonl` | 单字读音、全码、简码、权重 |
| `output/word.jsonl` | 多字词读音、全码、简码、权重 |
| `output/char.dict.yaml` | 初始单字 Rime 字典 |
| `output/word.dict.yaml` | 初始多字词 Rime 字典 |
| `output/重码详情/` | 按词频层级拆分的重码组 |

每次运行会覆盖同名结果。输出目录只保存派生物，不应提交 Git；任何结果都应能由
仓库内输入重新生成。

### 多音字修复数据（随 Git 跟踪，不归 `output/`）

`fix_polyphone_codes.py`（修复 `rime/yoyo-yx-word.dict.yaml` 多音字错误编码，
见 commit 346858c）使用/产出的两个数据文件放在本目录而非 `output/`，因为
它们是修复的**输入依赖与人工复核交付物**：

| 路径 | 内容 |
|---|---|
| `zi-full.jsonl` | `(字, 无声调拼音) → 编码` 查表，8538 条。由 `output/zi.jsonl`
  补全 87 个缺失读音（如 六 lu、乘 sheng）合成而来，是修复脚本的读音依据 |
| `fix-polyphone-review.txt` | 768 个同词多读音词的人工复核清单：候选读音、
  权重、编码与脚本决策，供人工确认取舍（如 密钥→mì yuè、打的→dǎ dī） |

重新生成 `zi-full.jsonl` 的方法见 `rime/scripts/fix_polyphone_codes.py` 顶部说明。

## 重要：这里输出的是布局处理前的初始字典

`main.py` 负责“从拆分数据得到编码并统计重码”，不会执行声韵母重排、A 位指定、
码位顺延/补位和发布词库裁剪。因此 `output/*.dict.yaml` **不能直接当作仓库中的
最终 `yoyo-yx-*.dict.yaml` 部署**。

需要从头重建最终发布字典时：

1. 一键运行本目录的 `main.py`；
2. 将 `output/char.dict.yaml`、`output/word.dict.yaml` 分别复制为
   `rime/yoyo-yx-char.dict.yaml`、`rime/yoyo-yx-word.dict.yaml`；
3. 按
   [`声韵母按权重重排键位指法/README.md`](../声韵母按权重重排键位指法/README.md)
   的顺序运行 `remap_codes.py`、`assign_a_codes.py`、`fill_vacant_codes.py`；
4. 最后用 `../trim_word_dict.py` 生成仓库提交的精简词表。

第 2～4 步会原地改写字典，日常查看重码时不要执行。

## 常用参数

```bash
# 只统计全码 / 只统计简码 / 两者都统计（默认）
python3 main.py -q
python3 main.py -j
python3 main.py -a

# 只改了 config.yaml：复用已有 zi.jsonl，重跑词编码
python3 main.py --skip-zi

# 改输出位置
python3 main.py --output-dir /tmp/yoyo-output

# 使用其他词库；格式支持 base / chai / wanxiang
python3 main.py --ciku /path/to/词库.txt --format chai
```

`--skip-zi` / `--skip-word` 的语义是复用对应 JSONL；文件不存在时会立即报错，
不会悄悄用空数据继续跑。

## 自检

脚本在写输出前检查所有输入是否存在，并在读取时校验：

- `code.txt` 与 `elements.txt` 行数相同；
- 两文件每一行的词条相同；
- `config.yaml` 的规则结构完整；
- 跳过某一步时，对应的既有 JSONL 确实存在。

任一条件不满足都会以非零状态退出。
