#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Q1：yoyo-pure 的 2 码（一击）空间占用明细与剩余空位。

━━━━━━━━━━━━━━━━ 统计口径 ━━━━━━━━━━━━━━━━

【数据来源】rime/yoyo-pure.dict.yaml（主字典，114515 条词条）

【理论容量 3720 的推导】（与 rime/scripts/gen_brief_words.py:build_slots 同口径）
    空明拳单手 1~3 键可产出 60 个码元 dau（26 小写 + 26 大写 + 8 符号 `;:,<.>/?`），
    且左右手 dau 集合完全相同（本脚本实算，不硬编码）。
        _X  左手单手并击      60 位
        +X  右手单手并击      60 位
        XY  双手并击 60 × 60  3600 位
        合计                  3720 位
    注意：% 简词空间也是 3720（3 字符，多一个 `%` 前缀），是**另一套命名空间**，
    与本脚本统计的 2 字符码不冲突。

【占用口径】「已占用」= 主字典 body 中真实出现过的 2 字符 code 的去重个数。
    （不统计 speller derive 出来的 3 字符变体 `AB_C`，那是输入态而非码位。）

【候选分类】对一个 2 字符码位上的全部候选词条：
    纯单字  = 所有候选 text 长度均为 1（这类码位是「二简字」位）
    纯多字词 = 所有候选 text 长度均 ≥ 2（这类码位是「一击词」位）
    混合    = 既有单字又有多字词 → char_first.dict_map_2 会命中它
    （dict_map_2 的定义见 generate_pure_dict_map.py：候选 ≥ 2 时记录次选）

【剩余空位】理论 3720 − 已占用 3620，并列出全部空位码。

复现：python3 research/audit_codelen_space.py
"""

from __future__ import annotations

import sys
from collections import Counter

sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parent))

from audit_codelen_common import (  # noqa: E402
    PURE_DICT, DICT_MAP_LUA, build_code_map, theoretical_1stroke_space,
    all_2char_slots, iter_lua_table, pct, bar,
)

TABLE_CF_DICT_MAP_2 = "    dict_map_2 = {"


def main():
    total = theoretical_1stroke_space()
    slots = all_2char_slots()
    assert len(slots) == total, (len(slots), total)

    cmap = build_code_map(PURE_DICT, code_filter=lambda c: len(c) == 2)
    used = set(cmap)
    n_entries = sum(len(v) for v in cmap.values())

    # ── 分类 ──
    yijian = {c: v for c, v in cmap.items() if c[0] in "_+"}   # 一简位 _X / +X
    plain = {c: v for c, v in cmap.items() if c[0] not in "_+"}  # 普通 2 码 XY

    def kind(cands):
        chars = [t for t, _ in cands if len(t) == 1]
        words = [t for t, _ in cands if len(t) > 1]
        return "纯单字" if not words else ("纯多字词" if not chars else "混合")

    plain_kind = {c: kind(v) for c, v in plain.items()}
    yijian_kind = {c: kind(v) for c, v in yijian.items()}
    mix = {c for c, k in plain_kind.items() if k == "混合"} | {
        c for c, k in yijian_kind.items() if k == "混合"}

    print("=" * 72)
    print("Q1 · yoyo-pure 2 码（一击）空间占用明细")
    print("=" * 72)
    print(f"数据源    : {PURE_DICT}")
    print(f"理论容量  : {total}   （_X 60 + +X 60 + XY 60×60，实算自空明拳指法）")
    print(f"已占用码位: {len(used)}  ({pct(len(used), total):.2f}%)")
    print(f"词条总数  : {n_entries} 条挂在 {len(used)} 个 2 字符码位上")
    print(f"剩余空位  : {total - len(used)}  ({pct(total - len(used), total):.2f}%)")
    print(f"越界码位  : {len(used - slots)}（应为 0；非 0 说明字典里出现了非法码元）")
    print()

    print("── 2 码位构成 ──")
    print(f"{'类别':<14}{'码位数':>8}{'词条数':>10}{'占比':>10}  说明")
    rows = [
        ("一简位 _X/+X", yijian, "单手并击，1 击"),
        ("普通 2 码 XY", plain, "双手并击，1 击（二简字 + 一击词）"),
    ]
    for name, d, note in rows:
        e = sum(len(v) for v in d.values())
        print(f"{name:<14}{len(d):>8}{e:>10}{pct(len(d), total):>9.2f}%  {note}")
    print(f"{'合计':<14}{len(used):>8}{n_entries:>10}{pct(len(used), total):>9.2f}%")
    print()

    print("── 一简位 _X / +X 的候选数分布 ──")
    print(f"一简位共 {len(yijian)} 个（左手 60 + 右手 60，已满配）")
    dist = Counter(len(v) for v in yijian.values())
    for n in sorted(dist):
        print(f"  挂 {n:>2} 个候选 : {dist[n]:>4} 位  {bar(dist[n], len(yijian), 24)}")
    print(f"  候选合计   : {sum(len(v) for v in yijian.values())} 条，"
          f"平均每码位 {sum(len(v) for v in yijian.values())/len(yijian):.2f} 个候选")
    print(f"  形态       : {dict(Counter('单字' if len(t)==1 else '多字词' for v in yijian.values() for t,_ in v))}")
    print()

    print("── 普通 2 码 XY 的挂载对象 ──")
    kc = Counter(plain_kind.values())
    ek = Counter()
    for c, v in plain.items():
        ek[plain_kind[c]] += len(v)
    for k in ("纯单字", "纯多字词", "混合"):
        print(f"  {k:<8} 码位 {kc[k]:>5}  词条 {ek[k]:>6}  "
              f"{bar(kc[k], len(plain), 24)} {pct(kc[k], len(plain)):5.2f}%")
    print(f"  {'合计':<8} 码位 {len(plain):>5}  词条 {sum(ek.values()):>6}")
    print()

    print("── 「单字 + 词」共用同一 2 码位（char_first.dict_map_2 命中口径）──")
    print(f"  命中码位数: {len(mix)}  （普通 XY {len(mix & set(plain))} + 一简 {len(mix & set(yijian))}）")
    for c in sorted(mix)[:8]:
        print(f"    {c!r:<8} -> {[t for t, _ in cmap[c]][:6]}"
              f"{' …' if len(cmap[c]) > 6 else ''}")
    if len(mix) > 8:
        print(f"    … 共 {len(mix)} 位")
    # 与运行时映射表交叉验证：char_first.dict_map_2 里 2 字符 key 的个数
    lua2 = sum(1 for k, _ in iter_lua_table(DICT_MAP_LUA, TABLE_CF_DICT_MAP_2) if len(k) == 2)
    print(f"  交叉验证  : pure_dict_map.lua 的 char_first.dict_map_2 中 2 字符 key = {lua2}"
          f"（口径一致则应 ≈ {len(mix)}）")
    print()

    print("── 剩余空位明细（理论 3720 − 占用 3620 = 100）──")
    free = sorted(slots - used)
    print(f"  共 {len(free)} 个，全部落在普通 2 码 XY（一简位 _X/+X 已满配）")
    for i in range(0, len(free), 10):
        print("   " + "  ".join(free[i:i + 10]))


if __name__ == "__main__":
    main()
