#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""探测 % 空格并击命名空间能否给「三码字」当二简溢出通道。

机制依据 rime/lua/yoyo/pure_popping.lua:137-159（Pattern S）：
  任意 `%XY`（3 字符）到达即查 space_brief_map，命中就 commit + kAccepted，
  与 text 长度无关 → 单字同样可以挂 % 码，且仍是「一次并击上屏」。
  空格是并击的一部分（chord_composer 插入分隔符），不额外多一击。
"""
from __future__ import annotations

import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RIME = ROOT / "rime"
PURE = RIME / "yoyo-pure.dict.yaml"
CHAR_FREQ = RIME / "yoyo-yx-char.dict.yaml"
LUA = RIME / "lua" / "yoyo" / "data" / "pure_dict_map.lua"

DAU = sorted(set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") | set(";:,<.>/?"))


def is_cjk(c: str) -> bool:
    return "\u4e00" <= c <= "\u9fff"


def net_len(c: str) -> int:
    return len(c.replace("_", "").replace("+", "").replace("'", ""))


def iter_rows(path: Path):
    started = False
    for line in path.read_text(encoding="utf-8").splitlines():
        if not started:
            if line.strip() == "...":
                started = True
            continue
        if not line or line.startswith("#"):
            continue
        p = line.split("\t")
        if len(p) >= 2:
            yield p[0], p[1]


# ── space_brief_map 的键（流式扫描，不整体 parse）──
space_keys: set[str] = set()
in_tbl = False
indent = len("  space_brief_map = {") - len("  space_brief_map = {".lstrip())
for line in LUA.open(encoding="utf-8"):
    line = line.rstrip("\n")
    if not in_tbl:
        if line.strip() == "space_brief_map = {":
            in_tbl = True
        continue
    if line.strip() == "}," and (len(line) - len(line.lstrip())) <= indent:
        break
    m = re.match(r'\s*\["(.+?)"\]\s*=', line)
    if m:
        space_keys.add(m.group(1))

print("=" * 76)
print("% 空格并击命名空间")
print("=" * 76)
print(f"已占用码位 (space_brief_map): {len(space_keys)}")
print(f"形态分布: {Counter(k[:2] for k in space_keys).most_common(5)}")
print(f"理论容量: 3720（%XY 60×60 + %_X 60 + %+X 60）→ 剩余 {3720-len(space_keys)}")
print()

# ── 现状 179 缺口 ──
char1: dict[str, str] = {}
char3: dict[str, str] = {}
char2: dict[str, str] = {}
for t, c in iter_rows(PURE):
    if c.startswith("%") or len(t) != 1 or not is_cjk(t):
        continue
    n = net_len(c)
    if n == 1:
        char1.setdefault(t, c)
    elif n == 2:
        char2.setdefault(t, c)
    elif n == 3:
        char3.setdefault(t, c)

freq: dict[str, int] = {}
for t, c in ((p[0], p[1]) for p in ()):
    pass
started = False
for line in CHAR_FREQ.read_text(encoding="utf-8").splitlines():
    if not started:
        if line.strip() == "...":
            started = True
        continue
    p = line.split("\t")
    if len(p) >= 3 and len(p[0]) == 1 and is_cjk(p[0]) and p[2].isdigit():
        freq[p[0]] = max(freq.get(p[0], 0), int(p[2]))

top = [c for c, _ in sorted(freq.items(), key=lambda kv: -kv[1])[:1500]]
short = set(char1) | set(char2)
losers = [c for c in top if c not in short]
print(f"前 1500 中「只有三码」的字: {len(losers)}")

RULES = {
    "前两根": lambda c: c[0] + c[1],
    "次+首": lambda c: c[1] + c[0],
    "首+末": lambda c: c[0] + c[2],
    "末+首": lambda c: c[2] + c[0],
    "次+末": lambda c: c[1] + c[2],
    "末+次": lambda c: c[2] + c[1],
}
hit = Counter()
served = {}
taken = set(space_keys)          # 已占（含本方案刚分配的，逐字贪心、按字频降序）
for ch in losers:
    c3 = char3.get(ch)
    if not c3:
        continue
    for name, fn in RULES.items():
        cand = "%" + fn(c3)
        if cand not in taken:
            hit[name] += 1
            served[ch] = (name, c3, cand)
            taken.add(cand)
            break
print(f"其中「前两根 + 空格」(%XY) 位可用: {hit['前两根']}"
      f"（{100*hit['前两根']/len(losers):.0f}%）")
print(f"六解全部计入后可用 % 位补上的: {len(served)} / {len(losers)}")
print(f"仍需其他办法的: {len(losers)-len(served)}")
print()
print("各规则命中:")
for k, v in hit.most_common():
    print(f"  {k}: {v}")
print()
print("示例（前 12 个）：")
for ch, (name, c3, cand) in list(served.items())[:12]:
    print(f"  {ch}  全码={c3}  →  %{cand[1:]}（{name}，空格并击；字频={freq[ch]:,}）")
print()
print("无解的字:", "".join(c for c in losers if c not in served))
