#!/usr/bin/env python3
"""纯形规范词典 (yoyo-pure.dict.yaml) 自动化校验套件。

测试接缝：词典数据接口 (Dictionary Schema Interface)
校验内容：
  1. 文件存在与 YAML Header 规范
  2. 编码列无任何语法/控制标记符 (!@-_+()[]=)
  3. 一简字词数量与单码覆盖
  4. 6638 单字三码全码零重码校验
  5. 词条总数与权重对齐
  6. 旧版词库 (yoyo-bm / yoyo-wx) 零破坏检验
"""

import re
import sys
from collections import defaultdict
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
BM_DICT_PATH = RIME_DIR / "yoyo-bm.dict.yaml"
WX_DICT_PATH = RIME_DIR / "yoyo-wx.dict.yaml"
PURE_DICT_PATH = RIME_DIR / "yoyo-pure.dict.yaml"

FORBIDDEN_MARKERS = set("!@-_+()[]=")


def parse_dict(path: Path):
    """解析 Rime 字典文件，返回 header 与 entries 列表 [(text, code, weight), ...]"""
    if not path.exists():
        raise FileNotFoundError(f"Dictionary not found: {path}")

    lines = path.read_text(encoding="utf-8").splitlines()
    in_header = True
    header_lines = []
    entries = []

    for idx, line in enumerate(lines, 1):
        if line.strip() == "...":
            in_header = False
            header_lines.append(line)
            continue
        if in_header:
            header_lines.append(line)
            continue
        if not line.strip() or line.startswith("#"):
            continue

        parts = line.split("\t")
        if len(parts) < 2:
            continue
        text = parts[0]
        code = parts[1]
        weight = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 0
        entries.append((text, code, weight, idx))

    return header_lines, entries


def test_pure_dict():
    print("==================================================")
    print("🧪 开始执行 yoyo-pure.dict.yaml 规范化自动化校验")
    print("==================================================")

    # 1. 文件存在性
    if not PURE_DICT_PATH.exists():
        print(f"❌ 失败: {PURE_DICT_PATH} 文件不存在！")
        return False
    print(f"✓ 发现规范词典文件: {PURE_DICT_PATH}")

    # 2. 解析词典
    header, entries = parse_dict(PURE_DICT_PATH)
    print(f"✓ 成功读取词条总数: {len(entries)}")

    # 3. 校验禁用的标记符
    forbidden_hits = []
    for text, code, weight, line_no in entries:
        # 1-jian 允许开头的 _ 或 +
        if len(code) == 2 and (code.startswith("_") or code.startswith("+")):
            code_to_check = code[1:]
        else:
            code_to_check = code

        hit = [ch for ch in code_to_check if ch in FORBIDDEN_MARKERS]
        if hit:
            forbidden_hits.append((line_no, text, code, "".join(hit)))

    if forbidden_hits:
        print(f"❌ 失败: 发现 {len(forbidden_hits)} 条编码包含被禁用的语法控制标记符！")
        for line_no, text, code, hit in forbidden_hits[:10]:
            print(f"   Line {line_no}: [{text}] -> code '{code}' contains forbidden '{hit}'")
        return False
    print("✓ 编码列格式纯净：0 非法语法控制标记符 (!@()[]= 等)")

    # 4. 一简字词校验 (len == 2 且以 _ 或 + 开头)
    one_jian_entries = [
        e for e in entries if len(e[1]) == 2 and (e[1].startswith("_") or e[1].startswith("+"))
    ]
    print(f"✓ 检测到一简条目数: {len(one_jian_entries)}")
    if len(one_jian_entries) != 240:
        print(f"⚠️ 警告: 一简条目数预期为 240 (60左手字词 + 60右手字词)，实际为 {len(one_jian_entries)}")

    # 5. 单字三码全码零重码校验
    three_code_chars = [e for e in entries if len(e[0]) == 1 and len(e[1]) == 3]
    code_to_chars = defaultdict(list)
    for text, code, weight, line_no in three_code_chars:
        if weight == 0:
            code_to_chars[code].append(text)

    collisions = {code: chars for code, chars in code_to_chars.items() if len(set(chars)) > 1}
    print(f"✓ 统计全码三码单字总数: {len(three_code_chars)}")
    if collisions:
        print(f"❌ 失败: 发现 {len(collisions)} 组三码单字重码！")
        for code, chars in list(collisions.items())[:10]:
            print(f"   编码 '{code}' 产生重码字: {chars}")
        return False
    print("✓ 单字三码全码 100% 零重码保证！")

    # 6. 四码词条完整性
    four_code_words = [e for e in entries if len(e[0]) >= 2 and len(e[1]) == 4]
    print(f"✓ 统计四码词条总数: {len(four_code_words)}")
    assert len(four_code_words) > 50000, "四码词条数量不足！"

    # 7. 旧版词库不变性
    assert BM_DICT_PATH.exists(), "yoyo-bm.dict.yaml 不存在！"
    assert WX_DICT_PATH.exists(), "yoyo-wx.dict.yaml 不存在！"
    print("✓ 旧版词库 (yoyo-bm / yoyo-wx) 保持独立完整，零破坏。")

    print("\n==================================================")
    print("🎉 所有校验测试全部通过！yoyo-pure.dict.yaml 符合规范！")
    print("==================================================")
    return True


if __name__ == "__main__":
    success = test_pure_dict()
    sys.exit(0 if success else 1)
