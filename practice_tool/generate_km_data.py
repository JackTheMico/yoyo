#!/usr/bin/env python3
"""生成空明拳（yoyo-km）纯形练习工具的数据模块 km_data_module.js。

并击表的来源只有一个：rime/yoyo.yaml 的「空明拳」段。那是一串 xform 重写规则，
**Rime 运行时真正执行的就是它**。练习工具教错指法比不教更糟，所以本脚本不抄任何
副本，而是直接模拟这些规则（与 generate_yx_data.py 同一套方法）：枚举左手所有
1–5 键组合，按 chord_composer 的 alphabet 次序归一化，逐条套用 xform，看哪些组合
落到合法码元上。

空明拳的码元是**单字符**（字根编码用到的 60 个字母 + 符号，不含数字），与音形
（声母小写 + 韵母大写两字符码元）不同。右手不单独枚举：方案开头的镜像规则把
右手键改写成左手键，两手输出同一批码元。

校验的不变量是「字根表用到的每个码元都必须能被空明拳打出」——脚本会读
zigen_table/mapping.yaml 的 code 核对，缺一个就报错退出。

用法:
  python3 generate_km_data.py
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from itertools import combinations
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent

# 空明拳 chord_composer.alphabet（见 rime/yoyo-bm-km.schema.yaml）：
#   "12345qwertasdfgzxcvb 67890yuiophjkl;nm,./"
# 左半段是左手键，右半段是右手键。镜像规则把右手键改写成左手键。
LEFT_KEYS = "12345qwertasdfgzxcvb"

# 键盘物理布局按行分组；镜像 = 同指对称，即每行左手从左到右配右手从右到左。
_LEFT_ROWS = ["12345", "qwert", "asdfg", "zxcvb"]
_RIGHT_ROWS = ["67890", "yuiop", "hjkl;", "nm,./"]

# 左手键 → 右手镜像键（每行右手反转后按位配对）。
MIRROR: dict[str, str] = {}
for _lrow, _rrow in zip(_LEFT_ROWS, _RIGHT_ROWS):
    for _l, _r in zip(_lrow, _rrow[::-1]):
        MIRROR[_l] = _r

# 合法码元 = 字根编码用到的 60 个字符（字母 + 符号，不含数字）。
CODES = set(",./:;<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="生成空明拳纯形练习数据")
    parser.add_argument("--yoyo-yaml", type=Path, default=REPO / "rime" / "yoyo.yaml")
    parser.add_argument("--mapping", type=Path, default=REPO / "zigen_table" / "mapping.yaml")
    parser.add_argument("--output", type=Path, default=HERE / "km_data_module.js")
    return parser.parse_args()


def load_rules(path: Path, section: str = "空明拳") -> list[tuple[str, str]]:
    """抽出「空明拳」段里的 xform 规则，保持原有顺序。"""
    lines = path.read_text(encoding="utf-8").splitlines()
    start = next(i for i, l in enumerate(lines) if l.startswith(section + ":"))
    rules = []
    for line in lines[start + 1 :]:
        if line and not line[0].isspace():
            break
        item = line.strip()
        if not item.startswith("- xform|"):
            continue
        parts = item[len("- xform|") :].split("|")
        if len(parts) >= 2:
            rules.append((parts[0], parts[1]))
    return rules


def apply_rules(chord: str, rules: list[tuple[str, str]]) -> str:
    for pattern, repl in rules:
        chord = re.sub(pattern, repl, chord)
    return chord


def normalize(keys: tuple[str, ...]) -> str:
    return "".join(sorted(keys, key=LEFT_KEYS.index))


def derive_chords(rules: list[tuple[str, str]]) -> dict[str, str]:
    """枚举左手 1–5 键组合，找出落到合法码元上的那些（组合 → 码元）。"""
    found: dict[str, str] = {}
    for size in range(1, 6):
        for combo in combinations(LEFT_KEYS, size):
            chord = normalize(combo)
            result = apply_rules(chord, rules)
            if result in CODES:
                found[chord] = result
    return found


def codes_used_by_mapping(path: Path) -> set[str]:
    """mapping.yaml 里所有字根 code 用到的码元字符。"""
    import yaml

    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    used: set[str] = set()
    for info in data.get("mapping", {}).values():
        for ch in info.get("code", ""):
            used.add(ch)
    return used


def check_coverage(reachable: set[str], used: set[str]) -> None:
    missing = sorted(used - reachable)
    if missing:
        print(
            f"字根表用到 {len(missing)} 个码元，空明拳规则却打不出来，拒绝生成：",
            file=sys.stderr,
        )
        print("  " + " ".join(missing), file=sys.stderr)
        sys.exit(1)
    print(f"覆盖校验通过：字根表用到的 {len(used)} 个码元全部可由空明拳打出")


def js_literal(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, sort_keys=False)


def main() -> None:
    args = parse_args()
    rules = load_rules(args.yoyo_yaml, "空明拳")
    derived = derive_chords(rules)
    reachable = set(derived.values())
    print(f"空明拳规则覆盖 {len(derived)} 种左手组合 → {len(reachable)} 个码元")

    used = codes_used_by_mapping(args.mapping)
    check_coverage(reachable, used)

    # 每个码元的推荐指法：按键数最少者优先，其次按 alphabet 次序取最省力那个。
    # 空明拳每个码元只有一种左手组合（左右手经镜像落到同一排序串），故即一对一。
    best: dict[str, str] = {}
    for chord, code in sorted(derived.items(), key=lambda kv: (len(kv[1]), kv[0])):
        if code not in best or (len(chord), chord) < (len(best[code]), best[code]):
            best[code] = chord

    out = [
        "// 空明拳（yoyo-km）纯形练习数据 —— 由 generate_km_data.py 生成，请勿手改。",
        "// 并击表由 rime/yoyo.yaml 的「空明拳」规则模拟得出，并校验过字根表用到的码元全部可达。",
        "// 码元是单字符（字根编码用到的 60 个字母 + 符号，不含数字）。",
        "",
        f"// 左手按键组合（排序串）→ 码元（{len(derived)} 种组合）",
        f"const KM_CHORDS = {js_literal(derived)};",
        "",
        f"// 每个码元的推荐左手指法，共 {len(best)} 个码元",
        f"const KM_BEST_CHORD = {js_literal(best)};",
        "",
        "// 左手键 → 右手镜像键；两手打出同一批码元",
        f"const KM_MIRROR = {js_literal(MIRROR)};",
        "",
        "// 同一击内按键的归一化次序（取自 chord_composer.alphabet 的左手段）",
        f"const KM_LEFT_ORDER = {js_literal(LEFT_KEYS)};",
        "",
        "if (typeof module !== 'undefined') {",
        "  module.exports = { KM_CHORDS, KM_BEST_CHORD, KM_MIRROR, KM_LEFT_ORDER };",
        "}",
        "",
    ]
    args.output.write_text("\n".join(out), encoding="utf-8")
    size = args.output.stat().st_size / 1024
    print(f"码元指法 {len(best)} 条 → {args.output}（{size:.1f} KiB）")


if __name__ == "__main__":
    main()
