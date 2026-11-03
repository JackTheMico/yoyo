#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""二简（2 字符码）空间占用审计 —— 为「让更多常用字两码打出」提供事实基线。

产出：
  1. 2 字符码三个分区（_X / +X / XY）的占用情况
  2. XY 码位按「只有单字 / 只有词 / 单字+词 / 空」分类
  3. 同时有 3 码全码与 2 码简码的单字：2 码是怎么从 3 码推出来的（推导规则验证）
  4. 目标集（前 N 常用字中只能打三码者）与其 3 码全码
"""
from __future__ import annotations

import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

RIME = Path(__file__).resolve().parent.parent / "rime"
sys.path.insert(0, str(RIME / "scripts"))

PURE = RIME / "yoyo-pure.dict.yaml"
CHAR_FREQ = RIME / "yoyo-yx-char.dict.yaml"


def is_cjk(ch: str) -> bool:
    return "\u4e00" <= ch <= "\u9fff"


def net_len(code: str) -> int:
    return len(code.replace("_", "").replace("+", "").replace("'", ""))


def iter_body3(path: Path):
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
            p = line.split("\t")
            if len(p) < 2:
                continue
            try:
                w = int(p[2]) if len(p) > 2 else 0
            except ValueError:
                w = 0
            yield p[0], p[1], w


# ── 载入 ──
char_codes: dict[str, list[tuple[str, int]]] = defaultdict(list)
word_codes: dict[str, list[tuple[str, int]]] = defaultdict(list)
for text, code, w in iter_body3(PURE):
    if code.startswith("%"):
        continue
    if len(text) == 1 and is_cjk(text):
        char_codes[text].append((code, w))
    elif len(text) >= 2 and all(is_cjk(c) for c in text):
        word_codes[text].append((code, w))

freq: dict[str, int] = {}
for text, code, w in iter_body3(CHAR_FREQ):
    if len(text) == 1 and is_cjk(text) and w > freq.get(text, 0):
        freq[text] = w

# ── 1 & 2. XY 码位占用 ──
slot_chars: dict[str, list[str]] = defaultdict(list)
slot_words: dict[str, list[str]] = defaultdict(list)
one_slot_chars: dict[str, list[str]] = defaultdict(list)
one_slot_words: dict[str, list[str]] = defaultdict(list)

for t, cs in char_codes.items():
    for c, _w in cs:
        nl = net_len(c)
        if nl == 1:
            one_slot_chars[c].append(t)
        elif nl == 2:
            slot_chars[c].append(t)
for t, cs in word_codes.items():
    for c, _w in cs:
        nl = net_len(c)
        if nl == 1:
            one_slot_words[c].append(t)
        elif nl == 2:
            slot_words[c].append(t)

XY = {c for c in set(slot_chars) | set(slot_words) if not c.startswith(("_", "+"))}
all_slots = slot_chars.keys() | slot_words.keys()

cat = Counter()
for c in sorted(XY | {c for c in all_slots if not c.startswith(("_", "+"))}):
    hc, hw = c in slot_chars, c in slot_words
    if hc and hw:
        cat["单字+词"] += 1
    elif hc:
        cat["仅单字"] += 1
    elif hw:
        cat["仅词"] += 1
    else:
        cat["空"] += 1

print("=== 2 字符码空间 ===")
print(f"码位理论容量: 3600（XY = 左手 60 码元 × 右手 60 码元）")
print(f"实际占用 {len(XY)}，分类:")
for k in ("仅单字", "仅词", "单字+词"):
    print(f"  {k:>6}: {cat[k]}")
print(f"  空闲: {3600 - len(XY)}")
print()
print(f"_X/+X 一简码位: 单字 {len(one_slot_chars)} 位 / 词 {len(one_slot_words)} 位 /"
      f" 交集 {len(set(one_slot_chars) & set(one_slot_words))}")
print(f"_X/+X 位上挂多个单字的码位: "
      f"{sum(1 for v in one_slot_chars.values() if len(v) > 1)}")
print(f"XY 位上挂多个单字的码位: "
      f"{sum(1 for v in slot_chars.values() if len(v) > 1)}")
print(f"XY 位上挂多个词的码位: "
      f"{sum(1 for v in slot_words.values() if len(v) > 1)}")
print()

# ── 3. 2 码简码与 3 码全码的推导关系 ──
print("=== 单字：3 码全码 与 2 码简码 的关系 ===")
rel = Counter()
samples = defaultdict(list)
for ch, cs in char_codes.items():
    codes3 = [c for c, _ in cs if net_len(c) == 3]
    codes2 = [c for c, _ in cs if net_len(c) == 2]
    codes1 = [c for c, _ in cs if net_len(c) == 1]
    if not codes2 or not codes3:
        continue
    c3 = codes3[0]
    c2 = codes2[0]
    if c2 == c3[:2]:
        k = "2码 = 3码前2字符"
    elif c2 == c3[0] + c3[2]:
        k = "2码 = 3码第1+第3字符"
    elif c2 == c3[1:3]:
        k = "2码 = 3码后2字符"
    else:
        k = "其他"
    rel[k] += 1
    if len(samples[k]) < 12:
        samples[k].append(f"{ch}:{c3}->{c2}")
for k, v in rel.most_common():
    print(f"  {k}: {v}")
    print(f"      {' '.join(samples[k])}")
print()

# ── 4. 目标集 ──
ranked = sorted(freq.items(), key=lambda kv: -kv[1])
for N in (1500,):
    top = [c for c, _ in ranked[:N]]
    three_only = [(ch, freq[ch], [c for c, _ in char_codes[ch]])
                  for ch in top
                  if min(net_len(c) for c, _ in char_codes[ch]) == 3]
    print(f"=== 前 {N} 常字中只能打三码的 {len(three_only)} 字 ===")
    for ch, w, cs in three_only[:40]:
        # 检查其 3 码前两字符是否可作为 XY 码位
        c3 = cs[0]
        cand = c3[:2]
        state = ("空" if cand not in slot_chars and cand not in slot_words else
                 "仅单字占用" if cand in slot_chars and cand not in slot_words else
                 "仅词占用" if cand in slot_words and cand not in slot_chars else
                 "单字+词占用")
        print(f"  {ch} w={w:<9} 3码={c3}  前2码位 {cand}: {state}")
    print()

# 空闲 XY 码位具体清单
free = [c for c in sorted(all_2 for all_2 in
                          {a + b for a in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ;:,<.>/?"
                           for b in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ;:,<.>/?"})
        if all_2 not in slot_chars and all_2 not in slot_words]
print(f"=== 空闲 XY 码位（按 dau 全组合算，{len(free)} 个）===")
print(" ".join(free[:120]))
