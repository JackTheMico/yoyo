#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""统计 yoyo-pure-km 下「常用字前 1500」中必须打到三码（全码）才能上屏的字数。

口径（与 research/audit_codelen_common.py、count_one_stroke.py 保持一致）：
  net_len(code) = 去掉 `_` `+` `'` 后的字符数
    1  -> 一简（单手一击）
    2  -> 二简（双手并击一击）
    3  -> 单字全码，需 2 击（并击 + 单键）
  「需要三码」= 该字在词表里所有码的 net_len 最小值 == 3。

常用字排序来源：rime/yoyo-yx-char.dict.yaml（按词频权重降序，同一字取最大 weight），
与 yoyo-pure.dict.yaml 的权重同源（如「的」两侧均为 92123018）。
"""
from __future__ import annotations

import sys
from collections import Counter, defaultdict
from pathlib import Path

RIME = Path(__file__).resolve().parent.parent / "rime"
PURE = RIME / "yoyo-pure.dict.yaml"
CHAR_FREQ = RIME / "yoyo-yx-char.dict.yaml"
TOP_N = 1500


def is_cjk(ch: str) -> bool:
    return "\u4e00" <= ch <= "\u9fff"


def net_len(code: str) -> int:
    return len(code.replace("_", "").replace("+", "").replace("'", ""))


def iter_body(path: Path):
    started = False
    with open(path, encoding="utf-8") as f:
        for line in f:
            if not started:
                if line.strip() == "...":
                    started = True
                continue
            line = line.rstrip("\n")
            if not line or line.startswith("#"):
                continue
            parts = line.split("\t")
            if len(parts) < 2:
                continue
            yield parts[0], parts[1]


def iter_body3(path: Path):
    """(text, code, weight)，weight 非数字按 0。"""
    started = False
    with open(path, encoding="utf-8") as f:
        for line in f:
            if not started:
                if line.strip() == "...":
                    started = True
                continue
            line = line.rstrip("\n")
            if not line or line.startswith("#"):
                continue
            parts = line.split("\t")
            if len(parts) < 3:
                continue
            try:
                weight = int(parts[2])
            except ValueError:
                weight = 0
            yield parts[0], parts[1], weight


# ── 1. 单字 -> 全部码 ──
char_codes: dict[str, list[str]] = defaultdict(list)
for text, code in iter_body(PURE):
    if len(text) == 1 and is_cjk(text) and not code.startswith("%"):
        char_codes[text].append(code)

# ── 2. 字频排序（同一字取最大 weight） ──
freq: dict[str, int] = {}
for text, code, weight in iter_body3(CHAR_FREQ):
    if len(text) != 1 or not is_cjk(text):
        continue
    if weight > freq.get(text, 0):
        freq[text] = weight

ranked = sorted(freq.items(), key=lambda kv: -kv[1])
top = [c for c, _ in ranked[:TOP_N]]

# ── 3. 统计 ──
dist = Counter()
three_code = []
missing = []
for ch in top:
    codes = char_codes.get(ch)
    if not codes:
        dist["无码"] += 1
        missing.append(ch)
        continue
    best = min(net_len(c) for c in codes)
    dist[best] += 1
    if best == 3:
        three_code.append((ch, freq[ch], sorted(codes, key=net_len)))

n3 = dist[3]
print(f"统计范围：字频前 {TOP_N} 个单字（共取到 {len(top)} 个）")
print(f"其中字典里查不到码的：{dist['无码']} 个" + (f" {' '.join(missing)}" if missing else ""))
print()
print("最短码长分布：")
for k in (1, 2, 3):
    print(f"  {k} 码（净码长 {k}）: {dist[k]:>4}  {100*dist[k]/len(top):5.1f}%")
print()
print(f"★ 必须三码（全码，2 击）才能打出：{n3} / {len(top)} = {100*n3/len(top):.1f}%")

print()
print("前 60 个最高频的「必须三码」单字：")
for i, (ch, w, codes) in enumerate(three_code[:60], 1):
    print(f"{i:>3}. {ch}  w={w:<9} codes={','.join(codes)}")

print()
print("全部「必须三码」单字（按字频降序）：")
print("".join(ch for ch, _, _ in three_code))

# 交叉参考：全表口径
all_best = Counter()
for ch, codes in char_codes.items():
    all_best[min(net_len(c) for c in codes)] += 1
print()
print(f"[参考] 全部 {len(char_codes)} 个单字的最短码长分布："
      + ", ".join(f"{k}码 {all_best[k]}" for k in (1, 2, 3)))

# ── 4. 规模敏感性 ──
print()
print("[敏感性] 不同「常用字」规模下的三码占比：")
for n in (500, 1000, 1500, 2000, 2500, 3000):
    sub = [c for c, _ in ranked[:n]]
    k3 = sum(1 for ch in sub
             if ch in char_codes and min(net_len(c) for c in char_codes[ch]) == 3)
    print(f"  前 {n:>4} 字：三码 {k3:>4}（{100*k3/len(sub):5.1f}%）  非三码 {len(sub)-k3:>4}")

# ── 5. 字频加权占比 ──
tot_w = sum(freq[c] for c in top)
w3 = sum(freq[ch] for ch, _, _ in three_code)
print()
print(f"[加权] 前 1500 字的总词频中，三码字占 {100*w3/tot_w:.2f}%"
      f"（非三码 {100*(1-w3/tot_w):.2f}%）")

# ── 6. 用户词表是否给这些字补了短码 ──
user = RIME / "yoyo-user.dict.yaml"
if user.exists():
    rescued = []
    for text, code, _w in iter_body3(user):
        if text in {c for c, _, _ in three_code} and not code.startswith("%"):
            if net_len(code) < 3:
                rescued.append((text, code))
    print()
    print(f"[用户词表 yoyo-user] 为三码字补短码的条目：{len(rescued)}"
          + (f"  {rescued}" if rescued else "  （无）"))
