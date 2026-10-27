#!/usr/bin/env python3
"""#51 码元→键位映射数据的验收测试。

口径：本测试只验「数据自洽 + 与 schema 对齐」，不验手感。
数据由 gen_cj_keymap.py 生成，产物是 rime/lua/yoyo/data/cj_keymap.lua。

运行：/usr/bin/python3 rime/scripts/test_cj_keymap.py
"""

import re
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
DATA = ROOT / "rime/lua/yoyo/data/cj_keymap.lua"
SCHEMA = ROOT / "rime/yoyo-pure-cj.schema.yaml"
DICT = ROOT / "rime/yoyo-pure.dict.yaml"

FAILS = []


def check(name, cond, detail=""):
    if cond:
        print(f"  ok   {name}")
    else:
        FAILS.append(f"{name} {detail}".strip())
        print(f"  FAIL {name} {detail}")


def load_keymap():
    """从生成的 lua 数据里读出 entries 表（纯文本解析，避免依赖 lua 运行时）。"""
    text = DATA.read_text(encoding="utf-8")
    entries = []
    # 形如：{ code = "T", key = "5", layer = "digit", via = "text" },
    pat = re.compile(
        r'\{\s*code\s*=\s*"(?P<code>.)"\s*,\s*key\s*=\s*"(?P<key>[^"]+)"\s*,'
        r'\s*layer\s*=\s*"(?P<layer>[a-z_]+)"'
    )
    for m in pat.finditer(text):
        entries.append(m.groupdict())
    return entries


def dict_code_units():
    units = set()
    body = False
    for line in DICT.read_text(encoding="utf-8").splitlines():
        if line.startswith("..."):
            body = True
            continue
        if not body:
            continue
        parts = line.split("\t")
        if len(parts) < 2:
            continue
        units.update(parts[1].strip())
    return units - {"_", "+"}


def schema_alphabet():
    text = SCHEMA.read_text(encoding="utf-8")
    m = re.search(r'alphabet:\s*"([^"]+)"', text)
    return m.group(1) if m else ""


def main():
    if not DATA.exists():
        print(f"FAIL 数据文件不存在：{DATA}")
        return 1

    entries = load_keymap()
    expected_units = dict_code_units()
    alpha = schema_alphabet()
    entry_units = {e["code"] for e in entries}

    print("\n[A] 覆盖性")
    check("码元条目数 = 60", len(entries) == 60, f"实际 {len(entries)}")
    check(
        "与字典码元集合完全一致（无遗漏）",
        expected_units == entry_units,
        f"缺 {sorted(expected_units - entry_units)} 多 {sorted(entry_units - expected_units)}",
    )
    check("无重复码元", len(entry_units) == len(entries), f"{len(entries)} 条 / {len(entry_units)} 唯一")

    print("\n[B] 落键唯一性")
    click = [e for e in entries if e["layer"] != "swipe_up"]
    swipe = [e for e in entries if e["layer"] == "swipe_up"]
    click_keys = [e["key"] for e in click]
    check("点击层无同键冲突", len(click_keys) == len(set(click_keys)),
          f"冲突 {sorted({k for k in click_keys if click_keys.count(k) > 1})}")
    check("上滑层无同键冲突", len(swipe) == len(set(e["key"] for e in swipe)))
    # 票面要求：同一物理键的点击层与上滑层不得承载**同一码元**。
    # 上滑层刻意复用同名小写字母键（q 键点击出 q、上滑出 Q），因此允许键位重叠，
    # 但两层码元必须不同——否则同一个手指动作会对应两个码元，映射失去确定性。
    by_key = {}
    for e in entries:
        by_key.setdefault(e["key"], {})[e["layer"]] = e["code"]
    same_unit = [
        k for k, layers in by_key.items()
        if len(layers) > 1 and len(set(layers.values())) != len(layers)
    ]
    check("同键的点击层与上滑层码元不同", not same_unit, f"冲突 {sorted(same_unit)}")
    layered = [k for k, layers in by_key.items() if len(layers) > 1]
    check("上滑层确实复用了字母键（16 个键双层）", len(layered) == 16,
          f"实际 {len(layered)}")

    print("\n[C] 层内分布符合票面约定")
    letter_click = [e for e in click if e["layer"] == "letter"]
    digit_click = [e for e in click if e["layer"] == "digit"]
    symbol_click = [e for e in click if e["layer"] == "symbol"]
    check("26 个小写码元在字母键点击层", len(letter_click) == 26, f"实际 {len(letter_click)}")
    check("小写码元与其键位同名", all(e["code"] == e["key"] for e in letter_click))
    check("数字键 10 个", len(digit_click) == 10, f"实际 {len(digit_click)}")
    check("符号键 8 个", len(symbol_click) == 8, f"实际 {len(symbol_click)}")
    check("上滑层 16 个", len(swipe) == 16, f"实际 {len(swipe)}")
    check("上滑层全是大写码元", all(e["code"].isupper() for e in swipe))
    check("上滑键位 = 同名小写字母键", all(e["key"] == e["code"].lower() for e in swipe))

    print("\n[D] 与 schema alphabet 对齐")
    check("alphabet 非空", bool(alpha))
    check("alphabet 字符集 = 60 码元", set(alpha) == expected_units,
          f"差 {sorted(expected_units ^ set(alpha))}")
    check("alphabet 无重复字符", len(alpha) == len(set(alpha)))
    check("映射码元 ⊆ alphabet", entry_units <= set(alpha))

    print("\n[E] 可读表")
    table = ROOT / "docs/design/cj-keymap-table.md"
    check("人读映射表已生成", table.exists())
    if table.exists():
        body = table.read_text(encoding="utf-8")
        check("映射表含全部 60 码元", all(e["code"] in body for e in entries))
        check("映射表标注了层", all(w in body for w in ("字母键", "数字键", "符号键", "上滑")))

    print()
    if FAILS:
        print(f"---- {len(FAILS)} 项失败 ----")
        for f in FAILS:
            print("  *", f)
        return 1
    print("---- 全部通过 ----")
    return 0


if __name__ == "__main__":
    sys.exit(main())
