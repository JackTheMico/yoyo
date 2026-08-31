#!/usr/bin/env python3
"""简词码位分配器：把第一档空明码一击词写入 yoyo-user.dict.yaml。

码形：%XY（双手+空格）/ %_X（左手+空格）/ %+X（右手+空格），空格与码元同时并击，
末字符到达即一击上屏（由 pure_popping 的 Pattern S 提交并吞掉）。

分配规则：
  1. 过滤：词的每个字都是一简字（yoyo-pure 中有单字母母码 _X/+X）→ 不占简词位
     （逐字一简已是两击，如「不用」「人的」）
  2. 首选码 = % + 字1首根 + 字2首根（取每字最长形码，与词编码公式
     AbAcBbBc / AbBbCbCc 的字根一致：最多→%wS、看起来→%id）
  3. 词频最高的 120 个词改用「单手+空格」位 %_X（左，前 60 词）
     与 %+X（右，第 61~120 词），键数最少；取不到则回退到 %XY
  4. 冲突（同码多词/缺字根）→ 词频高者得，其余按人体工学次序回退分配

用法：python3 gen_brief_words.py            # 预览
      python3 gen_brief_words.py --write    # 写入 yoyo-user.dict.yaml
      python3 gen_brief_words.py --space        # 预览（同默认）
      python3 gen_brief_words.py --space --write  # 写入（同默认，兼容旧调用）
"""

import sys
import subprocess
from collections import defaultdict
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS_DIR))

from chord_utils import (  # noqa: E402
    LEFT_KEYS, RIGHT_KEYS, YOYO_YAML, KM_SCHEMA,
    build_pipelines, enumerate_dau, apply_xforms, load_yaml,
)

RIME_DIR = SCRIPTS_DIR.parent
PURE_DICT = RIME_DIR / "yoyo-pure.dict.yaml"
USER_DICT = RIME_DIR / "yoyo-user.dict.yaml"
TIER1 = SCRIPTS_DIR.parent.parent / "research" / "km_one_chord_tier1.txt"

ONE_HAND_SLOTS = 60          # 单手+空格位：左手 60 + 右手 60
MARK_SPACE = "%"

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
# ── 空格并击简词（空格 + 码元同时按，一击上屏，共 3720 位）──
# 码形：%XY（双手+空格）/ %_X（左手+空格）/ %+X（右手+空格）。
# 编码规则：% + 字1首根 + 字2首根（每字取最长形码，与词编码公式字根一致）；
#   词频最高的 120 个词占用更短的单手+空格位 %_X / %+X（取字1首根）。
# 一击上屏由 pure_popping 的 Pattern S 完成（末字符到达即提交并吞掉），
#   不需要 speller/auto_select。
# 生成：gen_brief_words.py --write（重跑可重新分配，保留普通词条与手动简词段）。
"""

# 手动简词段标记：加词工具（yoyo-km-tui --brief）写入的 % 简词，
# 用 MANUAL_START/END 包住；gen_brief_words.py --write 重跑时原样保留，
# 且手动码位会被预占（used），保证手动优先（自动词不抢手动码）。
AUTO_START = "# === 自动空格并击简词（gen_brief_words.py 生成，勿手改）==="
AUTO_END = "# === 自动段结束 ==="
MANUAL_START = "# === 手动空格并击简词（加词工具写入，gen_brief_words.py 保留）==="
MANUAL_END = "# === 手动段结束 ==="


def _parse_user_dict(path: Path):
    """拆出 yoyo-user.dict.yaml 的「普通词条」与「手动简词段」。

    返回 (regular, manual_lines)：
      - regular:     真实词条（含 \\t 且码非 %/'），YAML 头/注释/空行丢弃，由 REGULAR_HEADER 重建
      - manual_lines: 手动段标记之间的 % 行（原样保留）
    """
    lines = path.read_text(encoding="utf-8").splitlines()
    regular: list[str] = []
    manual_lines: list[str] = []
    in_manual = False
    for l in lines:
        s = l.strip()
        if s == MANUAL_START:
            in_manual = True
            continue
        if s == MANUAL_END:
            in_manual = False
            continue
        if s == AUTO_START or s == AUTO_END:  # 旧自动段标记，若有则丢弃（下方重写）
            continue
        if in_manual:
            manual_lines.append(l)
            continue
        if "\t" in l:
            p = l.split("\t")
            if len(p) >= 2 and (p[1].startswith("'") or p[1].startswith(MARK_SPACE)):
                continue  # % / ' 简词不进 regular，自动段下方重写、手动段上方保留
            regular.append(l)
        # 无 \t 的行（YAML 头/注释/空行）一律丢弃
    return regular, manual_lines



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


def build_slots(mark):
    """返回 [(rank_tuple, code)]，rank 越小码位越好打（键数少、跨手优先）。"""
    yoyo_data = load_yaml(YOYO_YAML)
    km_data = load_yaml(KM_SCHEMA)
    pipes = build_pipelines(yoyo_data, km_data)
    alphabet, pipeline = pipes["A 后置"]
    fingering = yoyo_data["空明拳"]["__append"]

    left_dau = enumerate_dau(fingering, alphabet, LEFT_KEYS)
    right_dau = enumerate_dau(fingering, alphabet, RIGHT_KEYS)
    assert len(left_dau) == 60 and len(right_dau) == 60

    for dau, keys in list(left_dau.items())[:5] + list(right_dau.items())[:5]:
        plain = apply_xforms(keys, pipeline, alphabet)
        expect = ("_" if keys[0] in LEFT_KEYS else "+") + dau
        assert plain == expect, f"{keys} -> {plain!r} != {expect!r}"

    slots = []
    # 单手位：%_X / %+X（空格版单手+空格）
    for hand, (daus, sym) in enumerate(((left_dau, "_"), (right_dau, "+"))):
        for d, keys in daus.items():
            n = len(keys)
            slots.append(((n, 1 if n > 1 else 0, f"{hand}{d}"), f"{mark}{sym}{d}"))
    # 双手位：%XY（键数 = 左键数 + 右键数，跨手优先）
    for ld, kl in left_dau.items():
        for rd, kr in right_dau.items():
            slots.append(((len(kl) + len(kr), 0, f"{kl}{kr}"), f"{mark}{ld}{rd}"))
    slots.sort(key=lambda x: x[0])
    return slots


def main():
    write = "--write" in sys.argv
    mark = MARK_SPACE
    label = "空格并击版(%)"

    cc, yijian = load_char_codes()
    print(f"模式：{label}　码前缀：{mark}")
    print(f"yoyo-pure 字根表: {len(cc)} 字，其中一简字 {len(yijian)}")

    slots = build_slots(mark)
    assert len(slots) == 3720 and len({c for _, c in slots}) == 3720
    print(f"码位总数: {len(slots)}（应 3720）")

    # 读第一档并应用规则 1
    words, skipped = [], []
    for line in TIER1.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        w, f, _src = line.split("\t")
        if all(ch in yijian for ch in w):
            skipped.append(w)
            continue
        words.append((w, int(f)))
    words.sort(key=lambda x: (-x[1], x[0]))
    print(f"第一档 {len(words) + len(skipped)} → 规则1剔除 {len(skipped)} → 待分配 {len(words)}")

    # 读取已有手动简词段（加词工具写入），重跑保留 + 预占码位（手动优先）
    regular_lines, manual_lines = _parse_user_dict(USER_DICT)
    manual_codes = {
        l.split("\t")[1]
        for l in manual_lines
        if len(l.split("\t")) >= 2 and l.split("\t")[1].startswith(mark)
    }
    if manual_codes:
        print(f"手动简词段：{len(manual_codes)} 条（重跑保留，码位预占）")

    used, assigned, fallback = set(manual_codes), [], []

    def two_dau_code(w):
        s1, s2 = cc.get(w[0]), cc.get(w[1])
        return (mark + s1[0] + s2[0]) if (s1 and s2) else None

    def one_hand_code(w, sym):
        s1 = cc.get(w[0])
        return (mark + sym + s1[0]) if s1 else None

    # 规则 3：最高频 120 词占用单手+空格位
    top_one_hand = []
    if True:
        for i, (w, f) in enumerate(words[:ONE_HAND_SLOTS * 2]):
            sym = "_" if i < ONE_HAND_SLOTS else "+"
            code = one_hand_code(w, sym)
            if code and code not in used:
                used.add(code)
                assigned.append((code, w, f))
                top_one_hand.append(w)
        print(f"规则3 单手+空格位分配：{len(top_one_hand)} 词")

    for w, f in words:
        if w in top_one_hand:
            continue
        code = two_dau_code(w)
        if code and code not in used:
            used.add(code)
            assigned.append((code, w, f))
        else:
            fallback.append((w, f))

    slot_iter = iter(slots)
    clashes = 0
    for w, f in fallback:
        code = None
        for _rank, cand in slot_iter:
            if cand not in used:
                code = cand
                break
        assert code, "码位耗尽"
        used.add(code)
        assigned.append((code, w, f))
        clashes += 1
    print(f"规则2 字根码直配 {len(assigned) - clashes}，冲突/缺字根回退 {clashes}")

    from collections import Counter
    shape = Counter("单手位" if (c[1] in "_+") else "双手位" for c, _, _ in assigned)
    print(f"码形分布: {dict(shape)}")
    print(f"前 8 分配  : {[(w, c) for c, w, _ in assigned[:8]]}")
    print(f"末 4 分配  : {[(w, c) for c, w, _ in assigned[-4:]]}")

    if not write:
        print("（预览模式，加 --write 实际写入）")
        return

    # 写入：普通词条（regular_lines，单头重建）+ 手动简词段（原样保留）+ 自动段（重写）
    out = [REGULAR_HEADER.rstrip("\n"), ""]
    out += regular_lines
    out.append("")
    out.append(MANUAL_START)
    out += manual_lines
    out.append(MANUAL_END)
    out.append("")
    out.append(AUTO_START)
    out.append(BRIEF_COMMENT.rstrip("\n"))
    for code, w, f in assigned:
        out.append(f"{w}\t{code}\t{f}")
    out.append(AUTO_END)
    out.append("")
    USER_DICT.write_text("\n".join(out) + "\n", encoding="utf-8")
    manual_info = f" + 手动 {len(manual_codes)}（保留）" if manual_codes else ""
    print(f"✅ 已写入 {USER_DICT.name}：普通 {len(regular_lines)} + 自动 {label} {len(assigned)}{manual_info}")

    # 写完词条后必须重生成 pure_dict_map.lua（否则 space_brief_map
    # 为空 → 状态机 Pattern S 查不到 → 简词落 speller 成候选，需再按一次空格）。
    try:
        subprocess.run([sys.executable, str(SCRIPTS_DIR / "generate_pure_dict_map.py")],
                      check=True)
    except Exception as e:  # 重生成失败不阻断写词，仅告警
        print(f"⚠️ 自动重生成 pure_dict_map.lua 失败：{e}；请手动跑 "
              f"scripts/generate_pure_dict_map.py 后再部署。")

    # 同步重生成反查分片（reverse_lookup 现在会在注释里同时显示
    # 词的「全码 | 简码」；不重跑则新简词进了字典却不进反查）。
    try:
        subprocess.run([sys.executable, str(SCRIPTS_DIR / "generate_reverse_data.py")],
                      check=True)
        print("✅ 已同步重生成反查分片（含简码）")
    except Exception as e:  # 重生成失败不阻断写词，仅告警
        print(f"⚠️ 自动重生成反查分片失败：{e}；请手动跑 "
              f"scripts/generate_reverse_data.py 后再部署。")


if __name__ == "__main__":
    main()
