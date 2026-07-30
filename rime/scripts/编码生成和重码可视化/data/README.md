# 输入数据

本目录只放 `main.py` 默认流程不可替代的输入，不放任何生成结果。

| 文件 | 规模 | 作用 |
|---|---:|---|
| `code.txt` | 77,874 行 / 1.9 MiB | huma 最终导出；词条、全码、简码 |
| `elements.txt` | 77,874 行 / 7.3 MiB | huma 最终导出；词条、拆分序列、权重 |
| `pinyin.txt` | 51,040 行 / 604 KiB | 单字读音、读音权重 |
| `base.dict.yaml.gz` | 14.5 MiB（解压后 45.3 MiB） | 生成 149 万词的完整基础词库 |

## 对齐约束

`code.txt` 和 `elements.txt` 是同一次 huma 生成任务的两种视图，必须同时更新：

- 行数必须相同；
- 每一行开头的词条必须相同；
- 单字行提供 `zi.jsonl`，多字行不参与第一步；
- `elements.txt` 同时由仓库根目录的
  [`zigen_table/generate_yx_mapping.py`](../../../../zigen_table/generate_yx_mapping.py)
  读取，是形码拆分的单一数据源。

`main.py` 会逐行校验前两项，错位时立即退出。

`pinyin.txt` 在原导出基础上补了一条 `哼	hng	0`：`code.txt` 同时有
`heng`、`hng` 两个编码，原读音表只有前者，会导致第二条记录缺读音。该补充只影响
JSONL 的读音元数据，不改变 Rime 编码或权重。

## 基础词库来源

`base.dict.yaml.gz` 是
[iDvel/rime-ice](https://github.com/iDvel/rime-ice) 的
`cn_dicts/base.dict.yaml`，文件内版本为 `2024-05-21`。原文件头保留了详细词库
组成与修订说明；这里只做了确定性 gzip 压缩，内容没有改动。

上游采用
[GPL-3.0-only](https://github.com/iDvel/rime-ice/blob/main/LICENSE)，许可证副本见
[`LICENSE.rime-ice`](LICENSE.rime-ice)。

## SHA-256

```text
35e83a11d2f09f531429b4f4fd85b346fd59022551d9165be4bc4f951b37262a  code.txt
d2a72b2fa3ab905b51154a0e246915379de8cf0b64b8773d4157d951ffb9c66e  elements.txt
afbe290a11a58db5da981071fe4d38d17a7d9df77de2f28a387bd3022aca6b2f  pinyin.txt
1ad3a6df25e9de8501c560db598765dd7fdf8a988ba098d34f4841aca6f760da  base.dict.yaml.gz
396afa156642b6c44c6cb6720859916440e4d8af8a94c0026d23584b83dc9757  base.dict.yaml（解压后）
```

若主动修改输入，应同步更新本节校验值；脚本本身不强制哈希，以允许方案继续演进。
