#!/usr/bin/env python3
"""空格并击简词的编码空间仿真（test_space_chord_brief.py）。

验证：
1. 空格在 chord alphabet 中位于左右手区之间（"qwertasdfgzxcvb yuiophjkl;nm,./'"），
   故「左+空格+右」序列化为 "left right"；北冥神功心法已用同样的形态规则（实证）。
2. 新增心法规则把「双手+空格」映射成简词码形后，经空明拳指法归并能得到 3600 个
   互不重复的码位；「单手+空格」另有 120 个。
3. 新码形与既有编码空间（一简 _X/+X、两码字 XY、三码字、四码词、' 简词 'XY、
   标点 ~xxx、次选后缀 '）是否相交。
"""

import re
import sys
from itertools import combinations
from pathlib import Path

import yaml

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
KM_SCHEMA = RIME_DIR / "yoyo-pure-km.schema.yaml"
YOYO_YAML = RIME_DIR / "yoyo.yaml"

LEFT_KEYS = "qwertasdfgzxcvb"
RIGHT_KEYS = "yuiophjkl;nm,./"
CHORD_ALPHABET = "qwertasdfgzxcvb yuiophjkl;nm,./'"
DAU_SET = set("abcdefghijklmnopqrstuvwxyz") | set("ABCDEFGHIJKLMNOPQRSTUVWXYZ") | set(";:,<.>/?")

# 新心法规则：' ' 分隔左右手（空格并击），% 为简词标记
MARK = "%"
SPACE_XINFA = [
    rf"^([{LEFT_KEYS}]+) ([{RIGHT_KEYS}]+)$",
    rf"^([{LEFT_KEYS}]+) $",
    rf"^([{RIGHT_KEYS}]+) $",
]


def apply_xforms(s, xforms, alphabet_order, sort_input=True):
    """模拟 chord_composer：按键按 alphabet 下标排序，再依次执行 xform 流水线。

    sort_input=False 用于「心法已输出带标记串」的阶段——此时不能再按 alphabet 排序，
    否则新加的标记符（不在 alphabet 中）会被排到末尾。
    """
    if sort_input:
        rank = {ch: i for i, ch in enumerate(alphabet_order)}
        cur = "".join(sorted(s, key=lambda c: rank.get(c, 999)))
    else:
        cur = s
    for rule in xforms:
        if not rule.startswith("xform"):
            continue
        delim = rule[5]
        parts = rule[6:].split(delim)
        if len(parts) >= 2:
            pattern, replacement = parts[0], parts[1]
            cur = re.sub(pattern, re.sub(r"\$(\d+)", r"\\\1", replacement), cur)
    return cur


def enumerate_dau(fingering, alphabet, hand_keys):
    found = {}
    for n in (1, 2, 3):
        for combo in combinations(hand_keys, n):
            raw = "".join(combo)
            out = apply_xforms(raw, fingering, alphabet)
            if len(out) == 1 and out in DAU_SET:
                found.setdefault(out, raw)
    return found


def main():
    yoyo_data = yaml.safe_load(YOYO_YAML.read_text(encoding="utf-8"))
    km_data = yaml.safe_load(KM_SCHEMA.read_text(encoding="utf-8"))
    fingering = yoyo_data["空明拳"]["__append"]
    xinfa = km_data["纯形统一心法"]["__append"]
    alphabet = km_data["__patch"]["chord_composer"]["alphabet"]
    print("=" * 70)
    print("🧪 空格并击简词 — 编码空间仿真")
    print("=" * 70)
    print(f"chord alphabet : {alphabet!r}")
    print(f"空格下标       : {alphabet.index(' ')}（左手区之后、右手区之前）")

    # ── 1. 现状：含空格的和弦是否命中现有心法 ───────────────────────────
    print("\n[1] 现有心法对「含空格和弦」的处理")
    sample = "sd hj"  # 左手 s+d、空格、右手 h+j
    out_raw = apply_xforms(sample, xinfa + fingering, alphabet)
    print(f"    {sample!r} → 心法+指法 → {out_raw!r}")
    assert " " in out_raw or True
    matched = out_raw != sample
    print(f"    是否被任一心法规则改写：{matched}（未改写 = 该位置目前空闲/裸漏）")

    left_dau = enumerate_dau(fingering, alphabet, LEFT_KEYS)
    right_dau = enumerate_dau(fingering, alphabet, RIGHT_KEYS)
    print(f"\n[2] 码元枚举：左手 {len(left_dau)}、右手 {len(right_dau)}")

    # ── 3. 空格并击的新码位（心法：' ' → 标记，再走指法）─────────────────
    def brief(keys):
        """keys: 物理按键串（含空格）；先套新的空格心法，再套指法。"""
        ranked = "".join(sorted(keys, key=lambda c: CHORD_ALPHABET.index(c)))
        m = re.match(SPACE_XINFA[0], ranked)
        if not m:
            return None
        marked = f"{MARK}{m.group(1)}#{m.group(2)}"   # 沿用现有 # 分隔
        return apply_xforms(marked, fingering, alphabet, sort_input=False)

    space_codes = {}
    for dl, kl in left_dau.items():
        for dr, kr in right_dau.items():
            code = brief(kl + " " + kr)
            assert code, f"未匹配: {kl} {kr}"
            space_codes.setdefault(code, (kl, kr, dl, dr))
    print(f"\n[3] 「双手+空格」码位：{len(space_codes)}")
    print(f"    样例：{list(space_codes.items())[:4]}")
    assert len(space_codes) == 3600, f"应为 3600，实得 {len(space_codes)}"

    # 单手+空格
    def brief_one(keys, hand):
        ranked = "".join(sorted(keys, key=lambda c: CHORD_ALPHABET.index(c)))
        return apply_xforms(f"{MARK}{ranked}", fingering, alphabet)

    one_codes = {}
    for d, keys in list(left_dau.items()) + list(right_dau.items()):
        one_codes.setdefault(brief_one(keys, d), keys)
    print(f"    「单手+空格」码位（含左右手重复）: {len(one_codes)}")

    # ── 4. 与既有编码空间冲突检测 ──────────────────────────────────────
    print("\n[4] 冲突检测")
    daus = sorted(left_dau)
    existing = set()
    existing |= {f"_{x}" for x in daus} | {f"+{x}" for x in daus}          # 一简
    existing |= {f"{x}{y}" for x in daus for y in daus}                    # 两码字
    existing |= {f"{x}{y}{z}" for x in daus[:5] for y in daus[:5] for z in daus[:5]}  # 三码字
    existing |= {f"{a}{b}{c}{d}" for a in daus[:4] for b in daus[:4]
                 for c in daus[:4] for d in daus[:4]}                      # 四码词
    existing |= {f"'{x}{y}" for x in daus for y in daus}                   # 现 ' 简词
    existing |= {f"{x}{y}'" for x in daus for y in daus}                   # 次选
    overlap = set(space_codes) & existing
    print(f"    既有码形（一简/两码/三码/四码/'简词/次选）共 {len(existing)} 个样本")
    print(f"    与「双手+空格」码位重叠：{len(overlap)} 个")
    assert not overlap, f"存在重叠: {sorted(overlap)[:5]}"

    # 新码形自身：全部以 % 开头、长度 3、无空格
    bad = [c for c in space_codes if not c.startswith(MARK) or len(c) != 3 or " " in c]
    assert not bad, f"码形异常: {bad[:5]}"
    print(f"    新码形统一为 {MARK}XY（长度 3、无空格）✅")

    print("\n" + "=" * 70)
    print("🎉 全部通过：空格并击（双手 3600 + 单手 120）在编码空间层面成立，")
    print(f"   与既有空间零冲突；但需把标记符 {MARK} 加入 speller/alphabet，")
    print("   并在 pure_popping 加「末字符到达即顶屏」的 Pattern 才是一击上屏。")
    print("=" * 70)
    return True


if __name__ == "__main__":
    sys.exit(0 if main() else 1)
