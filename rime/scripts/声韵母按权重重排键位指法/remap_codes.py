#!/usr/bin/env python3
"""将 yoyo-yx 字典中的旧码机械替换为新码（全串一次换码，避免链式覆盖）。

用法:
  python3 scripts/remap_codes.py              # char + word
  python3 scripts/remap_codes.py --dict char  # 仅字表
  python3 scripts/remap_codes.py --dict word  # 仅词表
"""

from __future__ import annotations

import argparse
from pathlib import Path

def find_rime_root() -> Path:
    here = Path(__file__).resolve().parent
    for candidate in (here, *here.parents):
        if (candidate / "yoyo-yx-word.dict.yaml").is_file():
            return candidate
    raise SystemExit("向上未找到 yoyo-yx-word.dict.yaml，无法定位 Rime 根目录")


ROOT = find_rime_root()

LOWER = {
    "q": "r",
    "w": "e",
    "e": "q",
    "r": "t",
    "t": "g",
    "a": "d",
    "s": "z",
    "d": "a",
    "f": "c",
    "g": "w",
    "z": "x",
    "x": "v",
    "c": "s",
    "v": "f",
    "b": "b",
}
UPPER = {
    "A": "I",
    "B": "K",
    "C": "A",
    "D": "D",
    "E": "E",
    "F": "L",
    "G": "G",
    "H": "H",
    "I": "B",
    "J": "J",
    "K": "C",
    "L": "F",
}

TABLE = str.maketrans({**LOWER, **UPPER})

DICT_PATHS = {
    "char": ROOT / "yoyo-yx-char.dict.yaml",
    "word": ROOT / "yoyo-yx-word.dict.yaml",
    # "word": Path("/Users/bytedance/Library/Rime/0--core/scripts/编码生成和重码可视化/output/word.dict.yaml")
}


def remap_code(code: str) -> str:
    return code.translate(TABLE)


def remap_dict(path: Path) -> tuple[int, int]:
    """返回 (总数据行数, 码发生变化的行数)。"""
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    out: list[str] = []
    in_data = False
    total = 0
    changed = 0

    for line in lines:
        if not in_data:
            out.append(line)
            if line.strip() == "...":
                in_data = True
            continue

        raw = line.rstrip("\n")
        if not raw.strip():
            out.append(line)
            continue

        parts = raw.split("\t")
        if len(parts) < 2:
            out.append(line)
            continue

        total += 1
        old_code = parts[1]
        new_code = remap_code(old_code)
        if new_code != old_code:
            changed += 1
        parts[1] = new_code
        newline = "\n" if line.endswith("\n") else ""
        out.append("\t".join(parts) + newline)

    path.write_text("".join(out), encoding="utf-8")
    return total, changed


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="旧码→新码全串机械替换")
    parser.add_argument(
        "--dict",
        choices=("char", "word", "all"),
        default="all",
        help="处理目标：char=字表，word=词表，all=两者（默认）",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if len(LOWER) != len(set(LOWER.values())) or set(LOWER) != set(LOWER.values()):
        raise SystemExit("小写映射不是置换")
    if len(UPPER) != len(set(UPPER.values())) or set(UPPER) != set(UPPER.values()):
        raise SystemExit("大写映射不是置换")

    targets = (
        list(DICT_PATHS.values())
        if args.dict == "all"
        else [DICT_PATHS[args.dict]]
    )
    for path in targets:
        total, changed = remap_dict(path)
        print(f"{path.name}: 数据行 {total}, 码变更 {changed}")


if __name__ == "__main__":
    main()
