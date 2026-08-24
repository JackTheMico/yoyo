#!/usr/bin/env python3
"""生成纯形规范词典 (rime/yoyo-pure.dict.yaml)。

数据源：rime/yoyo-bm.dict.yaml
处理：
  1. 剥离所有语法控制标记 (!@-_+()[]=)
  2. 生成标准的规范词典头部 (name: yoyo-pure)
  3. 保留所有合法码元（含大写字母、小写字母、数字码元、合法符号如 < > , . : ; ? /）
  4. 严格保持词条顺序与权重
"""

import re
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
SOURCE_DICT = RIME_DIR / "yoyo-bm.dict.yaml"
OUTPUT_DICT = RIME_DIR / "yoyo-pure.dict.yaml"

MARKER_REGEX = re.compile(r"[\[\]\(\)\-_=+!@]")

PURE_HEADER = """# Rime dictionary: yoyo-pure
# encoding: utf-8
---
name: yoyo-pure
version: 1.0
sort: by_weight
columns:
  - text
  - code
  - weight
encoder:
  rules:
    - length_equal: 2
      formula: "AbAcBbBc"
    - length_equal: 3
      formula: "AbBbCbCc"
    - length_in_range: [4, 99]
      formula: "AbBbCbZb"
import_tables:
  - yoyo_kf
  - yoyo_char_kuozhan
...
"""


def generate():
    if not SOURCE_DICT.exists():
        print(f"Error: Source dictionary {SOURCE_DICT} not found.")
        sys.exit(1)

    print(f"Reading source dictionary: {SOURCE_DICT}")
    lines = SOURCE_DICT.read_text(encoding="utf-8").splitlines()

    in_header = True
    out_lines = [PURE_HEADER.rstrip()]
    converted_count = 0

    for line in lines:
        if line.strip() == "...":
            in_header = False
            continue
        if in_header or not line.strip() or line.startswith("#"):
            continue

        parts = line.split("\t")
        if len(parts) < 2:
            continue

        text = parts[0]
        code = parts[1]
        weight = parts[2] if len(parts) > 2 else "0"

        # 1-jian 条目保留左右手前缀 (_ 为左手，+ 为右手)
        if code.startswith("_") or code.startswith("+"):
            prefix = code[0]
            clean_body = MARKER_REGEX.sub("", code[1:])
            clean_code = f"{prefix}{clean_body}"
        else:
            # 2/3/4 码条目剥离所有控制标记
            clean_code = MARKER_REGEX.sub("", code)
            
        out_lines.append(f"{text}\t{clean_code}\t{weight}")
        converted_count += 1

    OUTPUT_DICT.write_text("\n".join(out_lines) + "\n", encoding="utf-8")
    print(f"Successfully generated {OUTPUT_DICT} with {converted_count} entries.")


if __name__ == "__main__":
    generate()
