#!/usr/bin/env python3
"""把第一档空明码一击词写入 yoyo-user.dict.yaml（' 前缀简词码位分配）。

码位空间（时序前缀路径，见 test_apostrophe_prefix_brief.py）：
  '_X（' + 左手一击）/ '+X（' + 右手一击）/ 'XY（' + 左右并击），X/Y ∈ 60 码元。

分配策略（v2，2026-08-29 用户规则）：
  1. 过滤：词的**每个字**都是一简字（yoyo-pure 中有单字母母码 _X/+X）→ 不占简词位
     （逐字一简已是两击，如「不用」「人的」）。
  2. 首选码 = ' + 字1首根 + 字2首根（取每字最长形码，与词编码器同一 cc 表），
     与 yoyo-pure-km 词编码公式（2字 AbAcBbBc / 3字 AbBbCbCc）的字根完全一致：
     最多→'wS（最wFv[0]+多SSx[0]）、看起来→'id（看iTm[0]+起dPj[0]）。
  3. 冲突（同码多词/缺字根）：词频高者得首选码，其余按人体工学次序回退分配
     （单键 30 位 > 跨手1+1 并击 225 位 > 同手双键 > …）。

用法：python3 gen_brief_words.py            # 预览统计（不写文件）
      python3 gen_brief_words.py --write    # 实际写入 yoyo-user.dict.yaml
"""

import sys
from collections import defaultdict
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS_DIR))

from test_apostrophe_prefix_brief import (  # noqa: E402
    LEFT_KEYS, RIGHT_KEYS, YOYO_YAML, KM_SCHEMA,
    build_pipelines, enumerate_dau, apply_xforms, load_yaml,
)

RIME_DIR = SCRIPTS_DIR.parent
PURE_DICT = RIME_DIR / "yoyo-pure.dict.yaml"
USER_DICT = RIME_DIR / "yoyo-user.dict.yaml"
TIER1 = SCRIPTS_DIR.parent.parent / "research" / "km_one_chord_tier1.txt"

REGULAR_HEADER = """# Rime dictionary: yoyo-user
# encoding: utf-8
---
name: yoyo-user
version: 1.0
sort: by_weight
columns:
  - text
  - code
  - weight
...
"""

BRIEF_COMMENT = """
# ── 前置单引号扩展简词（' + 左手一击 / 右手一击 / 左右并击，共 3720 位）──
# 用法：先点按-松开 '，再击键；与「' 同按=次选」时序分流，互不冲突。
# 码形：'_X（左手一击）/ '+X（右手一击）/ 'XY（左右并击），X/Y 为码元。
# 编码规则：' + 字1首根 + 字2首根（每字取最长形码，与词编码公式字根一致）；
#   冲突或字根缺失者按人体工学次序回退；全一简字词不入简词位。
# 来源：research/km_one_chord_tier1.txt（空明码一击词 ∩ 万象词频）。
# 生成：gen_brief_words.py --write（重跑可重新分配，会覆盖本段、保留普通词条）。
"""


def load_char_codes():
    """返回 (cc: 字->最长形码, yijian: 一简字集合)，口径与词编码器一致。"""
    char_code = defaultdict(list)
    started = False
    for line in PURE_DICT.read_text(encoding="utf-8").splitlines():
        if not started:
            if line.strip() == "...":
                started = True
            continue
        if not line or line.startswith("#"):
            continue
        p = line.split("\t")
        if len(p) < 2 or len(p[0]) != 1:
            continue
        clean = p[1].replace("_", "").replace("+", "")
        if clean:
            char_code[p[0]].append(clean)
    cc = {ch: max(v, key=len) for ch, v in char_code.items() if v}
    yijian = {ch for ch, v in char_code.items() if 1 in {len(c) for c in v}}
    return cc, yijian


def build_slots():
    """返回 [(rank_tuple, code)]，rank 越小码位越好打。"""
    yoyo_data = load_yaml(YOYO_YAML)
    km_data = load_yaml(KM_SCHEMA)
    pipes = build_pipelines(yoyo_data, km_data)
    alphabet, pipeline = pipes["A 后置"]
    fingering = yoyo_data["空明拳"]["__append"]  # 指法单独用于码元枚举

    left_dau = enumerate_dau(fingering, alphabet, LEFT_KEYS)
    right_dau = enumerate_dau(fingering, alphabet, RIGHT_KEYS)
    assert len(left_dau) == 60 and len(right_dau) == 60

    # 校验：码元的最小键组合经完整代数链输出的确是 _X / +X 形
    for dau, keys in list(left_dau.items())[:5] + list(right_dau.items())[:5]:
        plain = apply_xforms(keys, pipeline, alphabet)
        expect = ("_" if keys[0] in LEFT_KEYS else "+") + dau
        assert plain == expect, f"{keys} -> {plain!r} != {expect!r}"

    slots = []
    # 单手码元位：'_X / '+X（同手多键给 +1 惩罚，排在同键数跨手并击之后）
    for hand, (daus, mark) in enumerate(((left_dau, "_"), (right_dau, "+"))):
        for d, keys in daus.items():
            n = len(keys)
            slots.append(((n, 1 if n > 1 else 0, f"{hand}{d}"), f"'{mark}{d}"))
    # 并击位：'XY（键数 = 左键数 + 右键数，跨手先于同手多键）
    for ld, kl in left_dau.items():
        for rd, kr in right_dau.items():
            n = len(kl) + len(kr)
            slots.append(((n, 0, f"{kl}{kr}"), f"'{ld}{rd}"))
    slots.sort(key=lambda x: x[0])
    return slots


def main():
    write = "--write" in sys.argv
    cc, yijian = load_char_codes()
    print(f"yoyo-pure 字根表: {len(cc)} 字，其中一简字 {len(yijian)}")

    slots = build_slots()
    print(f"码位总数: {len(slots)}（应 3720）")
    assert len(slots) == 3720
    assert len({c for _, c in slots}) == 3720

    # 读第一档并应用规则 1：全一简字词跳过
    words = []  # (word, freq)
    skipped = []
    for line in TIER1.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        w, f, _src = line.split("\t")
        if all(ch in yijian for ch in w):
            skipped.append(w)
            continue
        words.append((w, int(f)))
    words.sort(key=lambda x: (-x[1], x[0]))
    print(f"第一档 {len(words) + len(skipped)} → 规则1(全一简字)剔除 {len(skipped)} → "
          f"待分配 {len(words)}")
    print(f"  剔除样例: {skipped[:12]}")

    # 规则 2：首选码 = ' + 字1首根 + 字2首根；冲突回退人体工学码位
    used = set()
    assigned = []   # (code, word, freq)
    fallback = []   # 需要回退的 (word, freq)
    slot_iter = iter(slots)

    def next_free_slot():
        for rank, code in slot_iter:
            if code not in used:
                return code
        return None

    for w, f in words:
        s1, s2 = cc.get(w[0]), cc.get(w[1])
        desired = ("'" + s1[0] + s2[0]) if (s1 and s2) else None
        if desired and desired not in used:
            used.add(desired)
            assigned.append((desired, w, f))
        else:
            fallback.append((w, f))

    # 冲突者按词频降序（已在序）依次取剩余最好打的码位
    clashes = 0
    for w, f in fallback:
        code = next_free_slot()
        assert code, "码位耗尽"
        used.add(code)
        assigned.append((code, w, f))
        clashes += 1
    print(f"规则2 首选码直配 {len(assigned) - clashes}，冲突/缺字根回退 {clashes}")

    # 分布统计
    from collections import Counter
    shape = Counter("单手" if ("_" in c or "+" in c) else "并击" for c, _, _ in assigned)
    print(f"码形分布: {dict(shape)}")
    print(f"前 12 分配: {[(w, c) for c, w, _ in assigned[:12]]}")
    print(f"回退样例  : {[(w, c) for c, w, _ in assigned[-clashes:][:6]]}")

    if not write:
        print("（预览模式，加 --write 实际写入）")
        return

    # 写入：保留普通用户词条（非 ' 码行），重写简词段
    lines = USER_DICT.read_text(encoding="utf-8").splitlines()
    regular = []
    for l in lines:
        if not l.strip() or l.startswith("#"):
            continue
        p = l.split("\t")
        if len(p) >= 2 and not p[1].startswith("'"):
            regular.append(l)

    out = [REGULAR_HEADER.rstrip("\n"), ""]
    out += regular
    out.append(BRIEF_COMMENT.rstrip("\n"))
    for code, w, f in assigned:
        out.append(f"{w}\t{code}\t{f}")
    USER_DICT.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"✅ 已写入 {USER_DICT.name}：普通词条 {len(regular)} + 简词 {len(assigned)}")


if __name__ == "__main__":
    main()
