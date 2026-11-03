#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""方案汇总：% 空格并击通道 vs 严格 XY 两码通道，两条路线的完整账。

输出
----
1. 严格 XY 两码路线（挤词位）的成本扫描
2. % 空格并击路线的覆盖数与挤词成本
3. 两条路线的对比表
"""
from __future__ import annotations

import importlib.util
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location(
    "solver", ROOT / "research" / "solve_2code_plan.py")
solver = importlib.util.module_from_spec(spec)
sys.modules["solver"] = solver
spec.loader.exec_module(solver)

RULES = solver.RULES
freq = solver.freq
char3 = solver.char3
TOP = solver.TOP
BASE_SHORT = solver.BASE_SHORT
wfreq = solver.wfreq
wweight = solver.wweight

# space_brief_map（在 yoyo-user.dict.yaml 里）
space: dict[str, tuple[str, int]] = {}
for t, c, w in solver.iter_body3(solver.RIME / "yoyo-user.dict.yaml"):
    if c.startswith("%"):
        space[c] = (t, w)

losers = [c for c in TOP if c not in BASE_SHORT]
print("=" * 78)
print("% 空格并击路线")
print("=" * 78)
taken = dict(space)
served = {}
evicted_pct = {}
stuck = []
for ch in losers:
    c3 = char3.get(ch)
    if not c3:
        stuck.append(ch)
        continue
    for name, fn in RULES.items():
        cand = "%" + fn(c3)
        if cand not in taken:
            served[ch] = (name, cand, 0)
            taken[cand] = (ch, 0)
            break
    else:
        opts = sorted((space["%" + fn(c3)][1], name, "%" + fn(c3))
                      for name, fn in RULES.items() if "%" + fn(c3) in space)
        if opts:
            w, name, cand = opts[0]
            served[ch] = (name, cand, w)
            evicted_pct[cand] = space[cand]
            taken[cand] = (ch, 0)
        else:
            stuck.append(ch)

print(f"目标缺口: {len(losers)}")
print(f"  直接占空闲 % 位: {sum(1 for v in served.values() if v[2] == 0)}")
print(f"  挤掉近死词换 % 位: {len(evicted_pct)}，"
      f"词频损失 {sum(w for _, w in evicted_pct.values()):,}")
print(f"  仍无解: {len(stuck)} {''.join(stuck)}")
by_rule = Counter(v[0] for v in served.values())
print(f"  助记分布: {dict(by_rule.most_common())}")
gain = sum(freq[c] for c in served)
print(f"  收益: 新增 {len(served)} 字可一击，合计字频 {gain:,}")
print(f"  词频损失合计 {sum(w for _, w in evicted_pct.values()):,} "
      f"→ 收益/成本 {gain/max(1,sum(w for _,w in evicted_pct.values())):.0f}:1")
print(f"  % 空间占用: {len(taken)}/3720（新增 {len(served)}），剩余 {3720-len(taken)}")
print()
print("  挤掉的词（按词频降序前 10）：")
for c, (t, w) in sorted(evicted_pct.items(), key=lambda kv: -kv[1][1])[:10]:
    print(f"    {c} ← {t}（词频 {w:,}）")
print()

print("=" * 78)
print("严格 XY 两码路线（对照）")
print("=" * 78)
print(f"{'挤词上限':>10} {'缺口':>5} {'挤词数':>6} {'词频损失':>11} {'收益/成本':>9}")
for cap in (0, 1000, 5000, None):
    r = solver.solve(cap=cap)
    cost = r["cost"]
    ratio = f"{r['gain']/cost:.0f}:1" if cost else "∞"
    print(f"{('不限' if cap is None else f'{cap:,}'):>10} {r['n3']:>5} "
          f"{len(r['evicted']):>6} {cost:>11,} {ratio:>9}")

print()
r = solver.solve(cap=5000)
target = {c for c in TOP if c not in BASE_SHORT}
print("严格 XY 路线（cap=5000，缺口已清零）的助记来源：")
for k, v in solver.mnemonic_split(r["tags"], target).most_common():
    print(f"  {k:<22} {v}")
