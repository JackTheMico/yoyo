#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""二简覆盖率优化求解器（最终版）：零新增重码 + 可调「挤词成本上限」。

不变量
------
「不新增重码」严格口径 = 每个 XY 码位上挂的 text 数不增加。
单个单字只能占「空位」或「仅词位」（把词挤走，码位仍只挂 1 个 text）；
永不允许把单字塞进已挂单字的码位。求解后由 assert 校验。

助记事实（实测）
----------------
- 单字 2 码 = 3 码全码前两根（2472/2472，零例外）
- 一个 3 根字共 C(3,2)×2 = **6 个形状可推导的两码候选**（取哪两根 × 左右手谁在前）
- 左右手都能产出全部 60 码元（research/probe_dau_hands.py 实测）
- 3 码前缀仅 2581 个，却有 6400 个三码字要抢 → 前缀本身不够分，这是缺口的结构性根因

用法
----
    python research/solve_2code_plan.py            # 打印分档方案 + 成本扫描
"""
from __future__ import annotations

from collections import Counter, defaultdict
from pathlib import Path

RIME = Path(__file__).resolve().parent.parent / "rime"
PURE = RIME / "yoyo-pure.dict.yaml"
CHAR_FREQ = RIME / "yoyo-yx-char.dict.yaml"
WORD_FREQ = RIME / "yoyo-yx-word.dict.yaml"

DAU = sorted(set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") | set(";:,<.>/?"))
ALL_SLOTS = {a + b for a in DAU for b in DAU}

RULES = {
    "前两根": lambda c: c[0] + c[1],
    "次+首": lambda c: c[1] + c[0],
    "首+末": lambda c: c[0] + c[2],
    "末+首": lambda c: c[2] + c[0],
    "次+末": lambda c: c[1] + c[2],
    "末+次": lambda c: c[2] + c[1],
}


def is_cjk(c: str) -> bool:
    return "\u4e00" <= c <= "\u9fff"


def net_len(c: str) -> int:
    return len(c.replace("_", "").replace("+", "").replace("'", ""))


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


# ───────────────────────── 静态数据 ─────────────────────────
char_codes: dict[str, list[str]] = defaultdict(list)
word_codes: dict[str, list[str]] = defaultdict(list)
word_slot_w: dict[str, int] = {}
for t, c, w in iter_body3(PURE):
    if c.startswith("%"):
        continue
    if len(t) == 1 and is_cjk(t):
        char_codes[t].append(c)
    elif len(t) >= 2 and all(is_cjk(x) for x in t):
        word_codes[t].append(c)
        if net_len(c) == 2 and w > word_slot_w.get(c, 0):
            word_slot_w[c] = w

freq: dict[str, int] = {}
for t, c, w in iter_body3(CHAR_FREQ):
    if len(t) == 1 and is_cjk(t) and w > freq.get(t, 0):
        freq[t] = w
wfreq: dict[str, int] = {}
for t, c, w in iter_body3(WORD_FREQ):
    if len(t) >= 2 and w > wfreq.get(t, 0):
        wfreq[t] = w


def wweight(slot: str, word: str) -> int:
    return max(word_slot_w.get(slot, 0), wfreq.get(word, 0))


char1: dict[str, str] = {}
char3: dict[str, str] = {}
for ch, cs in char_codes.items():
    for c in cs:
        if net_len(c) == 1:
            char1[ch] = c
            break
    for c in cs:
        if net_len(c) == 3:
            char3[ch] = c
            break

BASE_SLOT_CHAR: dict[str, str] = {}
for ch, cs in char_codes.items():
    for c in cs:
        if net_len(c) == 2 and not c.startswith(("_", "+")):
            BASE_SLOT_CHAR[c] = ch
BASE_SLOT_WORD: dict[str, str] = {}
for t, cs in word_codes.items():
    for c in cs:
        if net_len(c) == 2 and not c.startswith(("_", "+")):
            BASE_SLOT_WORD.setdefault(c, t)
BASE_WORD_ONLY = {s: t for s, t in BASE_SLOT_WORD.items() if s not in BASE_SLOT_CHAR}
BASE_FREE = ALL_SLOTS - set(BASE_SLOT_CHAR) - set(BASE_SLOT_WORD)

PREFIX_GROUP: dict[str, list[str]] = defaultdict(list)
for ch, c3 in char3.items():
    PREFIX_GROUP[c3[:2]].append(ch)

RANKED = sorted(freq.items(), key=lambda kv: -kv[1])
TOP = [c for c, _ in RANKED[:1500]]
TOPW = sum(freq[c] for c in TOP)
BASE_SHORT = {ch for ch, cs in char_codes.items() if any(net_len(c) <= 2 for c in cs)}


def shape_cands(ch: str) -> list[str]:
    if ch not in char3:
        return []
    c3 = char3[ch]
    out, seen = [], set()
    for fn in RULES.values():
        c = fn(c3)
        if c not in seen:
            seen.add(c)
            out.append(c)
    return out


def kuhn(items, cand_fn, pool):
    """最大二分匹配（按 cand_fn 返回顺序偏好取位）。"""
    match: dict[str, str] = {}

    def aug(u, seen):
        for s in cand_fn(u):
            if s in seen or s not in pool:
                continue
            seen.add(s)
            if s not in match or aug(match[s], seen):
                match[s] = u
                return True
        return False

    for u in items:
        aug(u, set())
    return match


# ───────────────────────── 求解器 ─────────────────────────
def solve(cap: int | None = None):
    """cap = 允许挤占的词位最大词频（None = 不限）。返回结果字典。"""
    slot_char = dict(BASE_SLOT_CHAR)
    word_only = dict(BASE_WORD_ONLY)
    free = set(BASE_FREE)
    tags: dict[str, str] = {}
    evicted: dict[str, str] = {}

    def short_map():
        s: dict[str, set[str]] = defaultdict(set)
        for ch, c in char1.items():
            s[ch].add(c)
        for slot, ch in slot_char.items():
            s[ch].add(slot)
        return s

    def losers():
        s = short_map()
        ls = [c for c in TOP if not s.get(c)]
        ls.sort(key=lambda c: -freq[c])
        return ls, s

    # S0 组内让位（保住「前两根」助记）
    s = short_map()
    for p, ms in PREFIX_GROUP.items():
        holder = slot_char.get(p)
        if holder is None or not (char1.get(holder) or char3.get(holder)):
            continue
        cands = [c for c in ms if c != holder and not s.get(c)]
        if not cands:
            continue
        best = max(cands, key=lambda c: freq.get(c, 0))
        if bool(s.get(holder, set()) - {p}) or freq.get(best, 0) > freq.get(holder, 0):
            slot_char[p] = best
            s[holder].discard(p)
            s[best].add(p)
            tags[best] = "前两根(组内让位)"

    # S1 六解 → 空闲位
    ls, _ = losers()
    for s_, ch in kuhn(ls, shape_cands, free).items():
        free.discard(s_)
        slot_char[s_] = ch
        tags[ch] = next(n for n, fn in RULES.items() if fn(char3[ch]) == s_)

    # S2 根 + 固定后缀 → 空闲位（半助记）
    ls, _ = losers()
    best_suf, best_n = None, 0
    for suf in DAU:
        slots = {a + suf for a in DAU} & free
        if not slots:
            continue
        n = sum(1 for ch in ls if ch in char3
                and any(char3[ch][i] + suf in slots for i in range(3)))
        if n > best_n:
            best_suf, best_n = suf, n
    if best_suf:
        slots = {a + best_suf for a in DAU} & free

        def cand(ch):
            if ch not in char3:
                return []
            return [char3[ch][i] + best_suf for i in range(3)
                    if char3[ch][i] + best_suf in slots]

        for s_, ch in kuhn(ls, cand, slots).items():
            free.discard(s_)
            slot_char[s_] = ch
            tags[ch] = f"根+后缀{best_suf}"

    # S3 任意空闲位（纯记忆）
    ls, _ = losers()
    for ch in ls:
        if not free:
            break
        s_ = free.pop()
        slot_char[s_] = ch
        tags[ch] = "纯记忆"

    # S4 六解 → 仅词位（优先最便宜的词）
    ls, _ = losers()
    pool = {s_ for s_ in word_only if cap is None or wweight(s_, word_only[s_]) <= cap}

    def cand_cost(ch):
        return sorted((c for c in shape_cands(ch) if c in pool),
                      key=lambda c: wweight(c, word_only[c]))

    for s_, ch in kuhn(ls, cand_cost, pool).items():
        evicted[s_] = word_only.pop(s_)
        slot_char[s_] = ch
        tags[ch] = next(n for n, fn in RULES.items() if fn(char3[ch]) == s_) + "(挤词)"

    # S5 任意仅词位（最便宜优先）
    ls, _ = losers()
    pool = {s_ for s_ in word_only if cap is None or wweight(s_, word_only[s_]) <= cap}
    for ch in ls:
        if not pool:
            break
        s_ = min(pool, key=lambda x: wweight(x, word_only[x]))
        pool.discard(s_)
        evicted[s_] = word_only.pop(s_)
        slot_char[s_] = ch
        tags[ch] = "纯记忆(挤词)"

    # 校验
    assert len(set(slot_char.values())) == len(slot_char), "出现单字共用码位"
    residual = set(BASE_SLOT_WORD) - set(evicted) - set(slot_char)
    assert not (set(slot_char) & residual), "新增单字与残留词撞位"

    s = short_map()
    n3 = sum(1 for c in TOP if not s.get(c))
    cov = 100 * sum(freq[c] for c in TOP if s.get(c)) / TOPW
    cost = sum(wweight(s_, t) for s_, t in evicted.items())
    gain = sum(freq[c] for c in TOP if s.get(c) and c not in BASE_SHORT)
    return dict(n3=n3, cov=cov, cost=cost, gain=gain, evicted=evicted,
                tags=tags, slot_char=slot_char, free_left=len(free))


def mnemonic_split(tags: dict[str, str], target: set[str]) -> Counter:
    c = Counter()
    for ch, t in tags.items():
        if ch not in target:
            continue
        if "挤词" in t:
            c["形状可推导(挤词位)" if not t.startswith("纯记忆") else "纯记忆(挤词位)"] += 1
        elif t.startswith("纯记忆"):
            c["纯记忆(空闲位)"] += 1
        else:
            c["形状可推导(空闲位)"] += 1
    return c


if __name__ == "__main__":
    print("=" * 86)
    print("资源盘点（实测）")
    print("=" * 86)
    print(f"XY 码位 3600 = 单字码位 {len(BASE_SLOT_CHAR)}"
          f"（其中与词共位 {sum(1 for s in BASE_SLOT_CHAR if s in BASE_SLOT_WORD)}）"
          f" + 仅词位 {len(BASE_WORD_ONLY)} + 空闲 {len(BASE_FREE)}")
    print(f"3 码前缀 {len(PREFIX_GROUP)} 个 vs 三码字 {len(char3)} 个 → "
          f"平均 {len(char3)/len(PREFIX_GROUP):.2f} 字争 1 个前缀位")

    base = solve(cap=0)
    print(f"现状：前 1500 中只能三码 {len([c for c in TOP if c not in BASE_SHORT])} 个，"
          f"加权覆盖 96.73%")
    print()

    print("=" * 86)
    print("成本扫描：允许挤占的词位词频上限 vs 效果")
    print("=" * 86)
    print(f"{'挤词上限':>10} {'缺口':>6} {'加权覆盖':>9} {'挤词数':>7} {'词频损失':>12} {'收益/成本':>9}")
    for cap in (0, 1000, 5000, 20000, 100000, 500000, None):
        r = solve(cap=cap)
        ratio = r["gain"] / r["cost"] if r["cost"] else float("inf")
        cap_s = "不限" if cap is None else f"{cap:,}"
        print(f"{cap_s:>10} {r['n3']:>6} {r['cov']:>8.2f}% {len(r['evicted']):>7} "
              f"{r['cost']:>12,} {ratio:>8.1f}:1")
    print()

    rec = solve(cap=None)
    print("=" * 86)
    print("推荐方案（cap=不限，按最小成本贪心）：分档结果")
    print("=" * 86)
    for cap, name in ((0, "A 档：不挤任何词（只吃空闲位）"),
                      (20000, "B 档：只挤词频 ≤ 2 万的词位"),
                      (None, "C 档：挤词不限（缺口清零）")):
        r = solve(cap=cap)
        print(f"{name}")
        print(f"    缺口 {r['n3']:>3}   加权覆盖 {r['cov']:.2f}%   "
              f"挤词 {len(r['evicted'])} 个 / 词频 {r['cost']:,}   "
              f"净收益 {r['gain']-r['cost']:,}")
    print()

    target = {c for c in TOP if c not in BASE_SHORT}
    print(f"179 个目标字的助记来源（C 档）：")
    for k, v in mnemonic_split(rec["tags"], target).most_common():
        print(f"    {k:<22} {v}")
    print()
    print("被挤占的最重 8 个词（C 档）：")
    for s_, t in sorted(rec["evicted"].items(), key=lambda kv: -wweight(*kv))[:8]:
        print(f"    {t} ({s_}) 词频={wweight(s_, t):,} → 让给 {rec['slot_char'][s_]} "
              f"(字频={freq[rec['slot_char'][s_]]:,})")
