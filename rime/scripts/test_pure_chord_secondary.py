#!/usr/bin/env python3
"""并击心法与指法单引号次选修饰 (test_pure_chord_secondary.py) 单元测试。

验证内容：
1. chord_composer 规则对携带单引号修饰键的并击输入能够正确捕获与转换
2. 心法与指法不误吃物理单引号，输出携带 ' 的标准次选码元
3. 覆盖空明拳 (yoyo-pure-km) 与六脉神剑 (yoyo-pure)
"""

import re
import sys
import yaml
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
PURE_KM_SCHEMA = RIME_DIR / "yoyo-pure-km.schema.yaml"
PURE_SCHEMA = RIME_DIR / "yoyo-pure.schema.yaml"
YOYO_YAML = RIME_DIR / "yoyo.yaml"


def load_yaml(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def apply_xforms(s: str, xforms: list, alphabet_order: str) -> str:
    """模拟 Rime chord_composer 按 alphabet 排序按键并依次执行 xform 正则流水线"""
    char_rank = {ch: i for i, ch in enumerate(alphabet_order)}
    sorted_keys = "".join(sorted(s, key=lambda c: char_rank.get(c, 999)))
    current = sorted_keys
    for rule in xforms:
        if not rule.startswith("xform"):
            continue
        delim = rule[5]
        parts = rule[6:].split(delim)
        if len(parts) >= 2:
            pattern = parts[0]
            replacement = parts[1]
            py_replacement = re.sub(r"\$(\d+)", r"\\\1", replacement)
            current = re.sub(pattern, py_replacement, current)
    return current


def test_chord_secondary():
    print("==================================================")
    print("🧪 开始验证并击单引号次选心法与指法规则...")
    print("==================================================")

    km_data = load_yaml(PURE_KM_SCHEMA)
    pure_data = load_yaml(PURE_SCHEMA)
    yoyo_data = load_yaml(YOYO_YAML)

    # 1. 验证 chord_composer.alphabet 必须包含单引号 '
    km_alphabet = km_data.get("__patch", {}).get("chord_composer", {}).get("alphabet", "")
    pure_alphabet = pure_data.get("__patch", {}).get("chord_composer", {}).get("alphabet", "")
    assert "'" in km_alphabet, f"yoyo-pure-km alphabet 必须包含单引号: got '{km_alphabet}'"
    assert "'" in pure_alphabet, f"yoyo-pure alphabet 必须包含单引号: got '{pure_alphabet}'"

    # 2. 提取空明拳流水线
    km_fingering = yoyo_data.get("空明拳", {}).get("__append", [])
    km_xinfa = km_data.get("纯形统一心法", {}).get("__append", [])
    km_pipeline = km_xinfa + km_fingering

    # 测试用例：(输入按键, 期望输出码元, 说明)
    test_cases_km = [
        # 一简首选（无单引号）
        ("e", "_e", "左手单键 e -> _e (首选 在)"),
        ("d", "_d", "左手单键 d -> _d (首选 的)"),
        ("i", "+e", "右手单键 i -> +e (首选 有)"),
        # 一简次选（并击单引号）
        ("e'", "_e'", "左手 e + 右手 ' -> _e' (次选 真的)"),
        ("w'", "_w'", "左手 w + 右手 ' -> _w' (次选 时间)"),
        ("d'", "_d'", "左手 d + 右手 ' -> _d' (次选 其他)"),
        ("i'", "+e'", "右手 i + 右手 ' -> +e' (次选 推荐)"),
        ("k'", "+d'", "右手 k + 右手 ' -> +d' (次选 每天)"),
        # 两码字并击（首选与次选）
        ("sjl", "sl", "两码字 s + jl -> sl (首选 了)"),
        ("sjl'", "sl'", "两码字 s + jl + ' -> sl' (次选)"),
        ("w,j", "wC", "两码字 w + ,j -> wC (首选 是)"),
        ("w,j'", "wC'", "两码字 w + ,j + ' -> wC' (次选)"),
    ]

    for raw_input, expected_code, desc in test_cases_km:
        actual_code = apply_xforms(raw_input, km_pipeline, km_alphabet)
        assert actual_code == expected_code, (
            f"FAIL: {desc}\n  Input: {raw_input}\n  Expected: {expected_code}\n  Actual: {actual_code}"
        )
        print(f"✓ {desc} -> 产出: '{actual_code}'")

    print("\n🎉 全部并击单引号心法与指法规则测试通过！")
    return True


if __name__ == "__main__":
    success = test_chord_secondary()
    sys.exit(0 if success else 1)
