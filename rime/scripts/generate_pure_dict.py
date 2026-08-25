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

    # 第一遍：提取 3 码词语的权重，用于赋权给对应的 4 码全码词
    word_3code_weights = {}
    for line in lines:
        if line.strip() == "..." or not line.strip() or line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) < 2:
            continue
        text, code = parts[0], parts[1]
        weight = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 0
        if len(text) > 1 and not (code.startswith("_") or code.startswith("+")):
            clean_code = MARKER_REGEX.sub("", code)
            if len(clean_code) == 3 and weight > 0:
                word_3code_weights[text] = max(word_3code_weights.get(text, 0), weight)

    # 第二遍：生成纯净词典
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
        weight = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 0

        # 1-jian 条目保留左右手前缀 (_ 为左手，+ 为右手)
        if code.startswith("_") or code.startswith("+"):
            prefix = code[0]
            clean_body = MARKER_REGEX.sub("", code[1:])
            clean_code = f"{prefix}{clean_body}"
            out_lines.append(f"{text}\t{clean_code}\t{weight}")
            converted_count += 1
        else:
            clean_code = MARKER_REGEX.sub("", code)
            # 过滤多字词的 3 码缩写（三简词），避免在打 4 码词时造成第 3 码前缀拦截！
            if len(text) > 1 and len(clean_code) == 3:
                continue
            
            # 若 4 码词对应的 3 码词有更高权重，继承之
            if len(text) > 1 and len(clean_code) == 4 and text in word_3code_weights:
                if weight == 0 or word_3code_weights[text] > weight:
                    weight = word_3code_weights[text]

            out_lines.append(f"{text}\t{clean_code}\t{weight}")
            converted_count += 1

    OUTPUT_DICT.write_text("\n".join(out_lines) + "\n", encoding="utf-8")
    print(f"Successfully generated {OUTPUT_DICT} with {converted_count} entries.")

    # 自动同步生成 Lua 静态映射表 (pure_dict_map.lua)
    try:
        from generate_pure_dict_map import generate as generate_map
        generate_map()
    except Exception as e:
        print(f"Warning: Failed to auto-generate pure_dict_map.lua: {e}")


if __name__ == "__main__":
    generate()
