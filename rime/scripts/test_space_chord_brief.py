#!/usr/bin/env python3
"""空格并击简词的编码空间仿真（test_space_chord_brief.py）。

直接读取**真实配置**验证：
  - 心法：rime/yoyo-pure-km.schema.yaml 的「纯形统一心法」（含新增的空格并击规则）
  - 指法：rime/yoyo.yaml 的「空明拳」
  - chord alphabet：yoyo-pure-km.schema.yaml 的 chord_composer/alphabet

验证内容：
1. 空格在 alphabet 中位于左右手键区之间 ⇒ 双手+空格序列化为 "左 右"、
   左手+空格为 "左 "、右手+空格为 " 右"（右手键下标大于空格，故空格在前）。
2. 心法 + 指法把三类空格并击分别归一为 %XY（3600）/ %_X（60）/ %+X（60）。
3. 这些新码形与既有编码空间（一简 _X/+X、两码字 XY、三码字、四码词、
   ' 简词 'XY、次选 XY'）零冲突。
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
DAU_SET = set("abcdefghijklmnopqrstuvwxyz") | set("ABCDEFGHIJKLMNOPQRSTUVWXYZ") | set(";:,<.>/?")
MARK = "%"


def apply_xforms(s, xforms, alphabet_order, sort_input=True):
    """模拟 chord_composer：按键按 alphabet 下标排序后执行 xform 流水线。

    sort_input=False 用于「心法已输出带标记串」的阶段（此时不能再按 alphabet 排序，
    否则新加的标记符会被排到末尾）。
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
            cur = re.sub(parts[0], re.sub(r"\$(\d+)", r"\\\1", parts[1]), cur)
    return cur


def chord_out(keys, xinfa, fingering, alphabet):
    """一次并击（keys 为按键集合，可含空格）经 心法+指法的最终输出。"""
    return apply_xforms("".join(keys), xinfa + fingering, alphabet)


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

    print("=" * 72)
    print("🧪 空格并击简词 — 编码空间仿真（读取真实心法/指法）")
    print("=" * 72)
    print(f"chord alphabet : {alphabet!r}")
    print(f"空格下标       : {alphabet.index(' ')}（左手区之后、右手区之前）")
    print(f"心法规则数     : {len(xinfa)}（前 3 条为空格并击规则）")

    left_dau = enumerate_dau(fingering, alphabet, LEFT_KEYS)
    right_dau = enumerate_dau(fingering, alphabet, RIGHT_KEYS)
    assert len(left_dau) == 60 and len(right_dau) == 60
    print(f"码元枚举       : 左手 {len(left_dau)}、右手 {len(right_dau)}")

    # ── 1. 三类空格并击的码位 ──────────────────────────────────────────
    print("\n[1] 空格并击码位")
    both = {}
    for dl, kl in left_dau.items():
        for dr, kr in right_dau.items():
            code = chord_out(kl + " " + kr, xinfa, fingering, alphabet)
            assert code.startswith(MARK) and len(code) == 3 and " " not in code, \
                f"双手+空格码形异常 {kl}+空格+{kr} -> {code!r}"
            both[code] = (kl, kr, dl, dr)
    print(f"    双手+空格 → %XY : {len(both)} 位")
    assert len(both) == 3600, f"应为 3600，实得 {len(both)}"

    left_one, right_one = {}, {}
    for d, keys in left_dau.items():
        code = chord_out(keys + " ", xinfa, fingering, alphabet)
        assert code.startswith(f"{MARK}_") and len(code) == 3, \
            f"左手+空格码形异常 {keys} -> {code!r}"
        left_one[code] = (keys, d)
    for d, keys in right_dau.items():
        code = chord_out(" " + keys, xinfa, fingering, alphabet)
        assert code.startswith(f"{MARK}+") and len(code) == 3, \
            f"右手+空格码形异常 {keys} -> {code!r}"
        right_one[code] = (keys, d)
    print(f"    左手+空格 → %_X : {len(left_one)} 位")
    print(f"    右手+空格 → %+X : {len(right_one)} 位")
    assert len(left_one) == 60 and len(right_one) == 60
    print(f"    合计 {len(both) + len(left_one) + len(right_one)} 位")

    # ── 2. 样例对照（与 ' 版同键位，只是把 ' 换成空格）──────────────────
    print("\n[2] 样例")
    for (kl, kr, dl, dr) in [both[c] for c in list(both)[:3]]:
        print(f"    左手 {kl:>3} + 空格 + 右手 {kr:<3} → {chord_out(kl + ' ' + kr, xinfa, fingering, alphabet)}")
    for code, (keys, d) in list(left_one.items())[:2]:
        print(f"    左手 {keys:>3} + 空格（无右手）      → {code}")
    for code, (keys, d) in list(right_one.items())[:2]:
        print(f"    右手 {keys:>3} + 空格（无左手）      → {code}")

    # ── 3. 无空格的既有规则未受影响 ────────────────────────────────────
    print("\n[3] 回归：无空格并击仍走原路径")
    for keys, expect_prefix in ((left_dau["a"], "_"), (right_dau["a"], "+")):
        out = chord_out(keys, xinfa, fingering, alphabet)
        print(f"    {keys!r} → {out!r}")
        assert out.startswith(expect_prefix) and not out.startswith(MARK), out
    out_both = chord_out(left_dau["w"] + right_dau["S"], xinfa, fingering, alphabet)
    print(f"    {left_dau['w'] + right_dau['S']!r}（双手无空格）→ {out_both!r}")
    assert out_both == "wS", out_both  # 与「最多」的全码前两码一致
    print("    ✅ 一简(_X/+X) 与两码字(XY) 未被空格规则影响")

    # ── 4. 冲突检测 ──────────────────────────────────────────────────
    print("\n[4] 冲突检测")
    daus = sorted(left_dau)
    existing = set()
    existing |= {f"_{x}" for x in daus} | {f"+{x}" for x in daus}
    existing |= {f"{x}{y}" for x in daus for y in daus}
    existing |= {f"{x}{y}{z}" for x in daus[:6] for y in daus[:6] for z in daus[:6]}
    existing |= {f"{a}{b}{c}{d}" for a in daus[:4] for b in daus[:4]
                 for c in daus[:4] for d in daus[:4]}
    existing |= {f"'{x}{y}" for x in daus for y in daus}     # 现 ' 简词
    existing |= {f"{x}{y}'" for x in daus for y in daus}     # 次选
    new_codes = set(both) | set(left_one) | set(right_one)
    overlap = new_codes & existing
    print(f"    既有码形样本 {len(existing)} 个，新码位 {len(new_codes)} 个，重叠 {len(overlap)} 个")
    assert not overlap, f"存在重叠: {sorted(overlap)[:5]}"
    print("    三类空格码位互不重复：",
          len(set(both) | set(left_one) | set(right_one)) == len(both) + len(left_one) + len(right_one))

    print("\n" + "=" * 72)
    print("🎉 全部通过：双手+空格 3600 + 左手+空格 60 + 右手+空格 60 = 3720 位，")
    print("   与既有编码空间零冲突；配合 pure_popping 的 Pattern S 可一击上屏。")
    print("=" * 72)
    return True


if __name__ == "__main__":
    sys.exit(0 if main() else 1)
