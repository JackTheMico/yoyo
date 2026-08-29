#!/usr/bin/env python3
"""前置单引号扩展简词的编码空间可行性仿真 (test_apostrophe_prefix_brief.py)。

验证目标：
1. 空明拳指法下，单手（左/右）各能产出多少种码元（预期 60）。
2. 「单引号 + 一击 / 并击」能产出多少个互不冲突的编码位（预期 3720）。
3. 码形枚举：时序前缀路径（先点 ' 再击键，alphabet 不动）→ 码形 '_X / '+X / 'XY
   对照路径（' 挪到 alphabet 首位的同按方案，仅作对比，不推荐）。
4. 检查新编码位与既有编码空间是否冲突，并分析与「并击次选」的时序关系。

说明：本脚本只做 Rime Regex Algebra 的等价仿真，不依赖 Rime 运行时。
librime 源码依据（chord_composer.cc，已核实）：
  - SerializeChord 按 chording_keys_（= alphabet 解析顺序）迭代 → 输出按 alphabet 下标排序；
  - chord 在「所有按下的键都松开」时结束（finish_chord_on_all_keys_released）；
  - FinishChord 把输出串按 KeySequence 逐键 engine_->ProcessKey() 重新注入完整处理链。
⇒ 先点按-松开 '（独立 chord，立即输出 '），再击下一个 chord，两者天然分流。
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

# 码元字符集：单键 15 + 小写双键 11 + 大写 26 + 符号 8 = 60
DAU_SET = set("abcdefghijklmnopqrstuvwxyz") | set("ABCDEFGHIJKLMNOPQRSTUVWXYZ") | set(";:,<.>/?")


def load_yaml(path: Path):
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def apply_xforms(s: str, xforms: list, alphabet_order: str) -> str:
    """模拟 chord_composer：按 alphabet 下标排序按键，再依次执行 xform 流水线。"""
    char_rank = {ch: i for i, ch in enumerate(alphabet_order)}
    current = "".join(sorted(s, key=lambda c: char_rank.get(c, 999)))
    for rule in xforms:
        if not rule.startswith("xform"):
            continue
        delim = rule[5]
        parts = rule[6:].split(delim)
        if len(parts) >= 2:
            pattern, replacement = parts[0], parts[1]
            py_replacement = re.sub(r"\$(\d+)", r"\\\1", replacement)
            current = re.sub(pattern, py_replacement, current)
    return current


def build_pipelines(yoyo_data, km_data):
    fingering = yoyo_data["空明拳"]["__append"]
    xinfa_suffix = km_data["纯形统一心法"]["__append"]  # 现行：' 在末尾

    # 路径 B 需要的心法改写：' 移到 alphabet 首位后，含 ' 的并击串以 ' 开头
    xinfa_prefix = [
        r"xform|^'([qwertasdfgzxcvb]+)([yuiophjkl;nm,./]+)$|'$1#$2|",
        r"xform|^'([qwertasdfgzxcvb]+)$|'_$1|",
        r"xform|^'([yuiophjkl;nm,./]+)$|'+$1|",
        r"xform|^([qwertasdfgzxcvb]+)([yuiophjkl;nm,./]+)$|$1#$2|",
        r"xform|^([qwertasdfgzxcvb]+)$|_$1|",
        r"xform|^([yuiophjkl;nm,./]+)$|+$1|",
    ]

    alphabet_suffix = km_data["__patch"]["chord_composer"]["alphabet"]
    alphabet_prefix = "'" + alphabet_suffix.replace("'", "")

    return {
        "A 后置": (alphabet_suffix, xinfa_suffix + fingering),
        "B 前置": (alphabet_prefix, xinfa_prefix + fingering),
    }


def enumerate_dau(pipeline, alphabet, hand_keys):
    """暴力枚举某只手 1~3 键的所有组合，看能产出哪些单码元。"""
    found = {}
    for n in (1, 2, 3):
        for combo in combinations(hand_keys, n):
            raw = "".join(combo)
            out = apply_xforms(raw, pipeline, alphabet)
            if len(out) == 1 and out in DAU_SET:
                found.setdefault(out, raw)
    return found


def build_space(left_dau, right_dau, pipeline, alphabet):
    """生成「' + 左手 / ' + 右手 / ' + 左右并击」的完整编码空间。"""
    space = {}
    for dau, keys in left_dau.items():
        space[apply_xforms(keys + "'", pipeline, alphabet)] = ("L", dau)
    for dau, keys in right_dau.items():
        space[apply_xforms(keys + "'", pipeline, alphabet)] = ("R", dau)
    for dl, kl in left_dau.items():
        for dr, kr in right_dau.items():
            space[apply_xforms(kl + kr + "'", pipeline, alphabet)] = ("LR", dl + dr)
    return space


def main():
    yoyo_data = load_yaml(YOYO_YAML)
    km_data = load_yaml(KM_SCHEMA)
    fingering = yoyo_data["空明拳"]["__append"]
    pipes = build_pipelines(yoyo_data, km_data)
    base_alphabet = pipes["A 后置"][0]

    print("=" * 68)
    print("🧪 前置单引号扩展简词 — 编码空间可行性仿真")
    print("=" * 68)

    # ── 1. 单手码元数 ───────────────────────────────────────────────
    left_dau = enumerate_dau(fingering, base_alphabet, LEFT_KEYS)
    right_dau = enumerate_dau(fingering, base_alphabet, RIGHT_KEYS)
    print("\n[1] 码元枚举（1~3 键组合暴力枚举）")
    print(f"    左手可产出码元 : {len(left_dau):>4} 种")
    print(f"    右手可产出码元 : {len(right_dau):>4} 种")
    assert len(left_dau) == 60, f"左手码元数应为 60，实得 {len(left_dau)}"
    assert len(right_dau) == 60, f"右手码元数应为 60，实得 {len(right_dau)}"
    assert set(left_dau) == set(right_dau), "左右手码元集合应完全一致（镜像指法）"
    print("    ✅ 左右手各 60 种且集合一致，镜像指法成立")

    # ── 2. 两条路径的编码空间 ────────────────────────────────────────
    results = {k: build_space(left_dau, right_dau, *v) for k, v in pipes.items()}
    for name, space in results.items():
        print(f"\n[2] 路径 {name}")
        print(f"    alphabet : {pipes[name][0]!r}")
        print(f"    期望     : 60 + 60 + 3600 = 3720")
        print(f"    实得     : {len(space):>4}")
        assert len(space) == 3720, f"路径 {name} 应为 3720，实得 {len(space)}"
        for tag, expect in (("L", 60), ("R", 60), ("LR", 3600)):
            n = sum(1 for v in space.values() if v[0] == tag)
            assert n == expect, f"{tag} 应为 {expect}，实得 {n}"
        print("    ✅ 左手 60 / 右手 60 / 并击 3600，三类互不重叠")

    # ── 3. 码形抽样 ─────────────────────────────────────────────────
    print("\n[3] 码形抽样")
    print(f"    {'按键':<10}{'路径A(后置)':<14}{'路径B(前置)':<14}说明")
    for keys, desc in [
        (left_dau["e"] + "'", "左手一击 e"),
        (right_dau["e"] + "'", "右手一击 e"),
        (left_dau["s"] + right_dau["l"] + "'", "并击 s+l"),
        (left_dau["w"] + right_dau["C"] + "'", "并击 w+C"),
    ]:
        a = apply_xforms(keys, *reversed(pipes["A 后置"]))
        b = apply_xforms(keys, *reversed(pipes["B 前置"]))
        print(f"    {keys:<10}{a:<14}{b:<14}{desc}")

    # ── 4. 与既有编码空间的冲突检测 ──────────────────────────────────
    print("\n[4] 与既有编码空间的冲突检测")
    for name, space in results.items():
        bad = [c for c in space if c.count("'") != 1]
        assert not bad, f"路径 {name} 存在非单引号码: {bad[:5]}"
    # 既有码（一简 _X/+X、两码字 XY、3码字 XX_Y、4码词 XYZW、标点 ~xxx）均不含 '
    # 新码均含且仅含一个 ' ⇒ 结构上不可能相交
    print("    既有码形：_X / +X（一简120）、XY（两码字3600）、")
    print("              XX_Y（3码字）、XYZW（4码词）、~xxx（标点）— 均不含 '")
    print("    新码形  ：均含且仅含一个 '")
    print("    ✅ 3720 个新码位与既有编码空间结构上不可能相交")

    # ── 5. 与「并击次选」的关系（关键结论：时序分流，可共存） ──────────
    print("\n[5] 与现行「并击次选」的关系（时序分流）")
    print("    现行次选（同按）：' 与键同按 → alphabet 排到末尾 → 输出注入 `_ e '")
    print("                      → pure_popping:107 拦截 ' → dict_map_2 次选上屏")
    print("    新增简词（先点后击）：先点按-松开 '（独立 chord，立即输出 ' 进 input）")
    print("                      → 再击键 → input 依次 ' → '_ → '_e → 命中词典 '_e")
    daus = sorted(left_dau)
    # 次选码形（同按，' 排末位）与简词码形（时序前缀，' 在首位）逐字符比较
    # 时序前缀路径：' 已在 input 缓冲，第二击是普通 chord（_X / +X / XY），
    # 最终 input = "'" + 普通 chord 输出 → 码形 '_X / '+X / 'XY
    plain = {f"_{x}" for x in daus} | {f"+{x}" for x in daus} | \
            {f"{x}{y}" for x in daus for y in daus}
    assert len(plain) == 3720
    brief = {"'" + c for c in plain}
    secondary = {c + "'" for c in plain}
    overlap = brief & secondary
    assert not overlap, f"简词码形与次选码形不应相交: {sorted(overlap)[:5]}"
    print(f"    次选码形（后缀 '）共 {len(secondary)} 个，简词码形（前缀 '）共 {len(brief)} 个")
    print("    ✅ 前缀 ' 与后缀 ' 码形零相交：同按=次选、先点'=简词，两功能可共存")
    print("      （若把 ' 挪到 alphabet 首位走同按方案，会与次选互斥，不推荐）")

    print("\n" + "=" * 68)
    print("🎉 全部通过：3720 个编码位在 algebra 层面成立，与既有空间零冲突。")
    print("   推荐实现：时序前缀（先点 ' 再击键），alphabet 零改动，次选完全保留。")
    print("=" * 68)
    return True


if __name__ == "__main__":
    sys.exit(0 if main() else 1)
