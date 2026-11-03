#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""汇总最终结论数字（写报告用）。"""
from __future__ import annotations

import importlib.util
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("solver", ROOT / "research" / "solve_2code_plan.py")
s = importlib.util.module_from_spec(spec)
sys.modules["solver"] = s
spec.loader.exec_module(s)

RULES, freq, char3, TOP, BASE_SHORT = s.RULES, s.freq, s.char3, s.TOP, s.BASE_SHORT

space = {}
for t, c, w in s.iter_body3(s.RIME / "yoyo-user.dict.yaml"):
    if c.startswith("%"):
        space[c] = (t, w)

losers = [c for c in TOP if c not in BASE_SHORT]
taken = dict(space)
mine: set[str] = set()      # 本方案已分配的 % 位
free_hit, evict_hit, stuck = 0, [], []
for ch in losers:
    c3 = char3.get(ch)
    if not c3:
        stuck.append(ch)
        continue
    done = False
    for name, fn in RULES.items():
        cand = "%" + fn(c3)
        if cand not in taken:
            taken[cand] = (ch, 0)
            mine.add(cand)
            free_hit += 1
            done = True
            break
    if done:
        continue
    opts = sorted((space["%" + fn(c3)][1], name, "%" + fn(c3))
                  for name, fn in RULES.items()
                  if "%" + fn(c3) in space and "%" + fn(c3) not in mine)
    if opts:
        w, name, cand = opts[0]
        evict_hit.append((ch, cand, space[cand][0], w))
        taken[cand] = (ch, 0)
        mine.add(cand)
    else:
        stuck.append(ch)

print("=== 路线 P：% 空格并击 ===")
print(f"目标 {len(losers)} 字")
print(f"  直接占空闲 % 位: {free_hit}")
print(f"  挤占已有词位: {len(evict_hit)}，词频合计 {sum(x[3] for x in evict_hit):,}")
print(f"  无解: {len(stuck)}")
print(f"  % 空间条目 996 → {len(taken)}，剩余容量 {3720-len(taken)}")
print("  挤占明细:")
for ch, cand, t, w in sorted(evict_hit, key=lambda x: -x[3]):
    print(f"    {cand} {t}(词频{w:,}) → {ch}")

print()
print("=== 路线 X：严格 XY 两码 ===")
for cap in (0, 5000, None):
    r = s.solve(cap=cap)
    tgt = {c for c in TOP if c not in BASE_SHORT}
    split = s.mnemonic_split(r["tags"], tgt)
    label = "不限" if cap is None else f"{cap:,}"
    print(f"  cap={label:<8} 缺口 {r['n3']:>3}  挤词 {len(r['evicted']):>3}  "
          f"词频损失 {r['cost']:>10,}  助记 {dict(split)}")

print()
print("=== 现状基线 ===")
print(f"前 1500 只有三码: {len(losers)}")
print(f"全表 6640 字中只有三码: "
      f"{sum(1 for ch in s.char_codes if ch not in BASE_SHORT)}")
