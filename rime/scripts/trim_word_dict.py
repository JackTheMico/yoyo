#!/usr/bin/env python3
"""从完整词库生成发布用的精简词库。

完整词库 149 万词 / 68.5 MiB 里有 89 万词权重为 0，它们是词库自动生成时留下的
长尾噪声（如「有那些」「不通的」「好伐」），排序永远在最后，对输入体验没有贡献，
只占体积。默认阈值 `--min-weight 1` 把它们全部剔除：

    全部  1,491,231 词  68.5 MiB  加权覆盖 100.000%
    >=1     599,890 词  27.1 MiB  加权覆盖 100.000%   ← 默认
    >=10    390,036 词  17.5 MiB  加权覆盖  99.596%
    >=50    207,136 词   9.1 MiB  加权覆盖  97.505%

一个词的权重取它所有编码行里的最大值；保留某词时它的全部编码行（一简 / 二码 /
四码 / 全码）一并保留，因此不会破坏码位分层的自洽性。删词只会腾空码位，
不会引入重码。

用法:
  python3 trim_word_dict.py 完整词库.yaml 输出.yaml [--min-weight 1]
"""

from __future__ import annotations

import argparse
from collections import defaultdict
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="生成发布用的精简词库")
    parser.add_argument("source", type=Path, help="完整词库")
    parser.add_argument("target", type=Path, help="输出路径")
    parser.add_argument(
        "--min-weight", type=int, default=1, help="保留权重不低于此值的词（默认 1）"
    )
    parser.add_argument(
        "--name", default="yoyo-yx-word", help="写入 YAML 头的 name 字段"
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    header: list[str] = []
    rows: list[tuple[str, str]] = []
    weight: dict[str, int] = defaultdict(int)

    in_data = False
    for line in args.source.open(encoding="utf-8"):
        if not in_data:
            if line.startswith("name:"):
                line = f"name: {args.name}\n"
            header.append(line)
            in_data = line.strip() == "..."
            continue
        if not line.strip():
            continue
        text, _, rest = line.rstrip("\n").partition("\t")
        rows.append((text, rest))
        code, _, w = rest.partition("\t")
        weight[text] = max(weight[text], int(w) if w else 0)

    keep = {t for t, w in weight.items() if w >= args.min_weight}
    kept = [(t, rest) for t, rest in rows if t in keep]

    with args.target.open("w", encoding="utf-8") as out:
        out.writelines(header)
        out.writelines(f"{t}\t{rest}\n" for t, rest in kept)

    src_mb = args.source.stat().st_size / 2**20
    dst_mb = args.target.stat().st_size / 2**20
    total = sum(weight.values())
    covered = sum(weight[t] for t in keep)
    print(f"词 {len(weight):,} → {len(keep):,}；条目 {len(rows):,} → {len(kept):,}")
    print(f"体积 {src_mb:.1f} MiB → {dst_mb:.1f} MiB；加权覆盖 {covered / total * 100:.3f}%")


if __name__ == "__main__":
    main()
