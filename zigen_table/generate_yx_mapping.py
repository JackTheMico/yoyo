#!/usr/bin/env python3
"""生成音形（yoyo-yx）码表 mapping-yx.yaml。

音形的「字根 → 码元」对应关系在仓库里从未以扁平表存在过：它隐含在 huma 字根
优化 YAML 的两段映射里，又经过 remap_codes.py 的一次字母置换。与其复现那条链
（易随上游变动而失效），本脚本直接从**已发布的产物**反推：

    rime/scripts/编码生成和重码可视化/data/elements.txt
                              yoyo-yx-char.dict.yaml
    鸣 = 声母m 韵母ing 口.0 口.1 鸟.0 鸟.1   ←→   鸣 = q F v C a I

每个字的拆分序列恰好 6 个元素实例，与 6 字母全码逐位对应，因此每个元素实例
唯一确定一个字母。8105 个字互相交叉验证，零冲突即可认为反推正确；脚本会在
出现任何冲突时报错退出，所以这份表不会悄悄错。

用法（默认参数已指向仓库内文件，直接跑即可）:
  python3 generate_yx_mapping.py

`elements.txt` 是汉字自动拆分系统（huma）的导出产物，7.6 MB / 77874 行，是
形码部分的上游真源；它与编码生成工具共用，仓库只保留一份。
日常使用只需读生成好的 mapping-yx.yaml。
"""

from __future__ import annotations

import argparse
import sys
from collections import defaultdict
from pathlib import Path

# 音形用 1-6 表示六种基本笔画，这里给出可读名字（由高频用字反查确认）
STROKE_NAMES = {"1": "一", "2": "丨", "3": "丿", "4": "丶", "5": "乛", "6": "乙"}

SHENGMU_PREFIX = "双拼声母-"
YUNMU_PREFIX = "双拼韵母-"

# 拆分数据里零声母记作 0，输出时给个人话名字
SHENGMU_LABELS = {"0": "零声母"}


def parse_args() -> argparse.Namespace:
    here = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(description="生成音形码表")
    parser.add_argument(
        "--elements",
        type=Path,
        default=(
            here.parent
            / "rime"
            / "scripts"
            / "编码生成和重码可视化"
            / "data"
            / "elements.txt"
        ),
        help="huma 拆分导出（字 → 拆分序列）",
    )
    parser.add_argument(
        "--char-dict",
        type=Path,
        default=here.parent / "rime" / "yoyo-yx-char.dict.yaml",
        help="音形单字表",
    )
    parser.add_argument("--output", type=Path, default=here / "mapping-yx.yaml")
    parser.add_argument(
        "--chars-output",
        type=Path,
        default=here / "yx-chars.txt",
        help="单字拆分表（字\\t全码\\t音节\\t首字根\\t末字根，权重降序）",
    )
    parser.add_argument(
        "--chars-limit", type=int, default=3000, help="单字拆分表保留的字数"
    )
    return parser.parse_args()


def load_full_codes(path: Path) -> dict[str, list[str]]:
    """取每个字的全码（6 个字母），保留出现顺序以对齐多音字。"""
    codes: dict[str, list[str]] = defaultdict(list)
    in_data = False
    for line in path.open(encoding="utf-8"):
        if not in_data:
            in_data = line.strip() == "..."
            continue
        if not line.strip():
            continue
        text, code, *_ = line.rstrip("\n").split("\t")
        letters = "".join(ch for ch in code if ch.isalpha())
        if len(letters) == 6:
            codes[text].append(letters)
    return codes


def load_decompositions(path: Path) -> tuple[dict[str, list[list[str]]], dict[str, int]]:
    """取每个单字的拆分序列与权重。"""
    seqs: dict[str, list[list[str]]] = defaultdict(list)
    weight: dict[str, int] = {}
    for line in path.open(encoding="utf-8"):
        parts = line.rstrip("\n").split("\t")
        if len(parts) < 2 or len(parts[0]) != 1:
            continue
        text = parts[0]
        seqs[text].append(parts[1].split())
        weight[text] = max(weight.get(text, 0), int(parts[2]) if len(parts) > 2 else 0)
    return seqs, weight


def derive(
    seqs: dict[str, list[list[str]]], codes: dict[str, list[str]]
) -> dict[str, str]:
    """把元素实例逐位对齐到字母，并要求全局无冲突。"""
    observed: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for text, variants in seqs.items():
        for seq, code in zip(variants, codes.get(text, [])):
            if len(seq) != 6:
                continue
            for element, letter in zip(seq, code):
                observed[element][letter] += 1

    conflicts = {e: dict(v) for e, v in observed.items() if len(v) > 1}
    if conflicts:
        print("元素实例到字母的映射存在冲突，拒绝生成：", file=sys.stderr)
        for element, letters in list(conflicts.items())[:20]:
            print(f"  {element}: {letters}", file=sys.stderr)
        sys.exit(1)
    return {e: next(iter(v)) for e, v in observed.items()}


def quote(text: str) -> str:
    """字根里有 PUA 字符和会被 YAML 当作数字/特殊值的键，一律加引号。"""
    return "'" + text.replace("'", "''") + "'"


def main() -> None:
    args = parse_args()
    codes = load_full_codes(args.char_dict)
    seqs, weight = load_decompositions(args.elements)
    letter_of = derive(seqs, codes)

    shengmu: dict[str, list[str]] = defaultdict(list)
    yunmu: dict[str, list[str]] = defaultdict(list)
    roots: dict[str, dict[int, str]] = defaultdict(dict)
    for element, letter in letter_of.items():
        name, _, index = element.rpartition(".")
        if name.startswith(SHENGMU_PREFIX):
            raw = name[len(SHENGMU_PREFIX) :]
            shengmu[letter].append(SHENGMU_LABELS.get(raw, raw))
        elif name.startswith(YUNMU_PREFIX):
            yunmu[letter].append(name[len(YUNMU_PREFIX) :])
        else:
            roots[name][int(index)] = letter

    # 字根码元 = 大码（index 0）+ 小码（index 1）
    root_code = {
        name: parts[0] + parts[1]
        for name, parts in roots.items()
        if parts.keys() >= {0, 1}
    }

    # 示例字：取权重最高的、拆分中用到该字根的单字，排除字根本身
    examples: dict[str, list[str]] = defaultdict(list)
    for text, variants in sorted(seqs.items(), key=lambda kv: -weight[kv[0]]):
        if text not in codes:
            continue
        used = {e.rpartition(".")[0] for seq in variants for e in seq}
        for name in used & root_code.keys():
            if text != name and len(examples[name]) < 3:
                examples[name].append(text)

    lines = [
        "# 音形（yoyo-yx）码表",
        "# 由 generate_yx_mapping.py 从 elements.txt 与 yoyo-yx-char.dict.yaml 反推生成，请勿手改。",
        "#",
        "# 码元 = 声母键（小写）+ 韵母指法（大写），如 vC。字根码元同样是两个字母。",
        f"# 声母 {sum(len(v) for v in shengmu.values())} 个 / 韵母 "
        f"{sum(len(v) for v in yunmu.values())} 个 / 字根 {len(root_code)} 个。",
        "",
        "# 声母 → 键位",
        "声母:",
    ]
    for key in sorted(shengmu):
        lines.append(f"  {key}: [{', '.join(sorted(shengmu[key]))}]")
    lines += ["", "# 韵母 → 指法", "韵母:"]
    for key in sorted(yunmu):
        lines.append(f"  {key}: [{', '.join(sorted(yunmu[key]))}]")
    lines += ["", "# 音形用 1-6 代表六种基本笔画", "笔画:"]
    for key, name in STROKE_NAMES.items():
        lines.append(f"  {quote(key)}: {name}")
    lines += ["", "# 字根 → 码元", "mapping:"]
    for name in sorted(root_code, key=lambda n: (root_code[n], n)):
        lines.append(f"  {quote(name)}:")
        lines.append(f"    code: {root_code[name]}")
        if name in STROKE_NAMES:
            lines.append(f"    stroke: {STROKE_NAMES[name]}")
        if examples[name]:
            lines.append(f"    examples: {' '.join(examples[name])}")

    args.output.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(
        f"字根 {len(root_code)} 个，声母 {sum(len(v) for v in shengmu.values())} 个，"
        f"韵母 {sum(len(v) for v in yunmu.values())} 个 → {args.output}"
    )

    # 单字拆分表：练习工具要显示「鸣 = 音 míng + 口 + 鸟」，光靠码元反查不出字根
    # （466 个字根挤在 180 个码元上，必然多对一），所以在这里落一份小的派生数据。
    rows = []
    for text, _ in sorted(seqs.items(), key=lambda kv: -weight[kv[0]]):
        variants = seqs[text]
        full = codes.get(text)
        if not full or len(variants[0]) != 6:
            continue
        seq = variants[0]
        first = seq[2].rpartition(".")[0]
        last = seq[4].rpartition(".")[0]
        # 单字根字的第三个码元是音节码重复，此时末字根即首字根
        if last.startswith((SHENGMU_PREFIX, YUNMU_PREFIX)):
            last = first
        rows.append(f"{text}\t{full[0]}\t{full[0][:2]}\t{first}\t{last}")
        if len(rows) >= args.chars_limit:
            break
    args.chars_output.write_text("\n".join(rows) + "\n", encoding="utf-8")
    print(f"单字拆分 {len(rows)} 条 → {args.chars_output}")


if __name__ == "__main__":
    main()
