#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""二简覆盖率优化量化：在「不新增重码」前提下让更多常用字可两码打出。

事实基线
--------
1. XY 码位 = 左手 60 码元 × 右手 60 码元 = 3600；已占 3500，仅词 788，空 100。
   每个码位至多挂 1 个单字（0 个码位挂 2 个单字）→ 单字维度确实零重码。
2. 单字 2 码 = 其 3 码全码的前两个码元（2472/2472，零例外）。
   因此「能否两码」≡「该字 3 码前缀有没有被别的字占走」。
3. 3 码前缀共 2581 个，远少于需 2 码的三码字 6307 个 → 前缀空间才是真瓶颈。

四条路线
--------
T0 组内让位：同前缀组内把码位让给字频最高的、且无短码的成员（零重码、零助记损失）
T1 反手序：2 码 = 同样的两根、左右手对调（物理合法，助记 ="两根不变换手"）
T2 挤占仅词位：把词独占的码位让给单字（码位数不变，词退回 2 击）
T3 全局按频重排：单字 2 码完全按字频分配（放弃形状助记）
"""
from __future__ import annotations

from collections import Counter, defaultdict
from pathlib import Path

RIME = Path(__file__).resolve().parent.parent / "rime"
PURE = RIME / "yoyo-pure.dict.yaml"
CHAR_FREQ = RIME / "yoyo-yx-char.dict.yaml"

DAU = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") | set(";:,<.>/?")


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


# ── 载入 ──
char_codes: dict[str, list[str]] = defaultdict(list)
word_codes: dict[str, list[str]] = defaultdict(list)
word_slot_w: dict[str, int] = {}      # 2 码词码位 -> 该词权重（词表把频挂在最短码那行）
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

# 码位占用表
slot_char: dict[str, str] = {}
for ch, cs in char_codes.items():
    for c in cs:
        if net_len(c) == 2 and not c.startswith(("_", "+")):
            slot_char[c] = ch
slot_word: dict[str, str] = {}
for t, cs in word_codes.items():
    for c in cs:
        if net_len(c) == 2 and not c.startswith(("_", "+")):
            slot_word.setdefault(c, t)

short_of: dict[str, set[str]] = {}
for ch, cs in char_codes.items():
    s = {c for c in cs if net_len(c) <= 2}
    if s:
        short_of[ch] = s

prefix_group: dict[str, list[str]] = defaultdict(list)
for ch, cs in char_codes.items():
    for c in cs:
        if net_len(c) == 3:
            prefix_group[c[:2]].append(ch)
            break

ranked = sorted(freq.items(), key=lambda kv: -kv[1])
TOP = [c for c, _ in ranked[:1500]]
TOPW = sum(freq[c] for c in TOP)


def stats(slot2: dict[str, str]):
    """返回 (前 1500 中无短码的字数, 字频加权覆盖率%)。

    短码 = 任何 net_len ≤ 2 的码，既包括 _X/+X 一简，也包括 XY 二简。
    """
    short_codes: dict[str, set[str]] = defaultdict(set)
    for code, ch in slot2.items():
        short_codes[ch].add(code)
    for ch, cs in char_codes.items():
        for c in cs:
            if net_len(c) == 1:
                short_codes[ch].add(c)
    n3 = sum(1 for c in TOP if not short_codes.get(c))
    w = sum(freq[c] for c in TOP if short_codes.get(c))
    return n3, 100 * w / TOPW


print("=" * 72)
print("一、基线")
print("=" * 72)
n3, cov = stats(slot_char)
print(f"前 1500 常用字：只能三码 {n3} 个（{n3/15:.1f}%），有短码 {1500-n3} 个")
print(f"字频加权覆盖率（单字一击占比）: {cov:.2f}%")
print(f"XY 码位: 单字 {len(slot_char)} / 仅词 {sum(1 for s in slot_word if s not in slot_char)}"
      f" / 空 {3600-len(set(slot_char)|set(slot_word))}")
print(f"3 码前缀 {len(prefix_group)} 个；需 2 码的三码字 "
      f"{sum(1 for ch,cs in char_codes.items() if any(net_len(c)==3 for c in cs))} 个"
      f" → 前缀不够分")
print()

# ── 二、反手序是否物理合法（两种顺序是不是两个不同 chord）──
print("=" * 72)
print("二、反手序（同两根、左右手对调）是否为独立合法码位")
print("=" * 72)
used = set(slot_char) | set(slot_word)
pairs = {frozenset((c[0], c[1])) for c in used if len(c) == 2}
both = sum(1 for p in pairs if len(p) == 2
           and (c0 := sorted(p)[0]) + sorted(p)[1] in used
           and sorted(p)[1] + c0 in used)
print(f"已用码位涉及 {len(pairs)} 个无序码元对；其中正反两种顺序都被使用: {both}"
      f"（{100*both/max(1,len(pairs)):.0f}%）")
print("说明：chord_composer 按 alphabet 下标排序按键 → 输出恒为「左手码元+右手码元」；"
      "两手都能产出全部 60 码元，故 XY 与 YX 是两个不同 chord。")
print(f"→ 反手序把「形状可推导」的助记码位上限从 {len(prefix_group)}（前缀）"
      f"提到 ≈{2*len(prefix_group)}")
print()

# ── 三、T0 组内让位 ──
print("=" * 72)
print("三、T0 组内让位（保留前两码元助记，零重码）")
print("=" * 72)
groups = {p: ms for p, ms in prefix_group.items() if len(ms) > 1}
print(f"多字共用同一前缀的组: {len(groups)}，卷入 {sum(len(m) for m in groups.values())} 字")

redundant = [p for p in prefix_group
             if slot_char.get(p) and any(net_len(c) == 1 for c in char_codes[slot_char[p]])]
print(f"前缀位被「已有一简的字」白占的: {len(redundant)}")

swaps = []
for p, ms in prefix_group.items():
    holder = slot_char.get(p)
    if holder is None:
        continue
    cands = [c for c in ms if c != holder and not short_of.get(c)]
    if not cands:
        continue
    best = max(cands, key=lambda c: freq.get(c, 0))
    holder_needs = holder not in short_of or not (short_of[holder] - {p})
    if holder_needs and freq.get(best, 0) <= freq.get(holder, 0):
        continue
    swaps.append((p, holder, best, holder_needs, freq.get(best, 0) - freq.get(holder, 0)))

t0 = dict(slot_char)
for p, holder, best, _hn, _d in swaps:
    t0[p] = best
n3_t0, cov0 = stats(t0)
print(f"值得让位的码位: {len(swaps)}"
      f"（其中原持有者本就有短码、纯白捡的: {sum(1 for s in swaps if not s[3])}）")
print(f"→ T0 后只能三码 {n3_t0}（改善 {n3-n3_t0}），加权覆盖 {cov0:.2f}%")
print("  收益最大的 10 处：")
for p, holder, best, hn, d in sorted(swaps, key=lambda x: -x[4])[:10]:
    tag = "白捡" if not hn else "置换"
    print(f"    {p}: {holder}({freq.get(holder,0)}) → {best}({freq.get(best,0)})  [{tag}]")
print()

# ── 四、T1 反手序补位 ──
print("=" * 72)
print("四、T1 反手序规则给「前缀被占」的字补 2 码")
print("=" * 72)
have_now = set(t0.values())
losers = [c for c in TOP if c not in have_now and
          not any(net_len(x) == 1 for x in char_codes[c])]
print(f"T0 后仍缺短码的常用字: {len(losers)}")

free = [a + b for a in sorted(DAU) for b in sorted(DAU)
        if a + b not in slot_char and a + b not in slot_word]
free_set = set(free)

rules = {
    "前两根(2码=全码前2)": lambda c: c[0] + c[1],
    "反手序(次+首)": lambda c: c[1] + c[0],
    "首+末": lambda c: c[0] + c[2],
    "末+首": lambda c: c[2] + c[0],
    "次+末": lambda c: c[1] + c[2],
    "末+次": lambda c: c[2] + c[1],
}
hit = Counter()
served = {}
no3 = []
for ch in losers:
    c3s = [c for c in char_codes[ch] if net_len(c) == 3]
    if not c3s:
        no3.append((ch, char_codes[ch]))
        continue
    c3 = c3s[0]
    for name, fn in rules.items():
        cand = fn(c3)
        if cand in free_set:
            hit[name] += 1
            served.setdefault(ch, (name, c3, cand))
            break
print("各规则命中空位的字数（按优先级取第一个可用）:")
for name in rules:
    print(f"  {name}: {hit[name]}")
if no3:
    print(f"  [异常] 无 3 码全码的字 {len(no3)}: {no3[:5]}")
print(f"→ 缺口中有 {len(served)} 个可用「形状可推导」的码位补上，"
      f"剩 {len(losers)-len(served)-len(no3)} 个无解")
print("  示例：")
for ch, (name, c3, cand) in list(served.items())[:15]:
    print(f"    {ch} 全码={c3} → 2码={cand}（{name}，w={freq[ch]}）")
print()

# ── 五、T2 挤占仅词码位 ──
print("=" * 72)
print("五、T2 挤占「仅词」码位（码位总数不变，代价=该词 1 击→2 击）")
print("=" * 72)
word_only = [(s, t) for s, t in slot_word.items() if s not in slot_char]
print(f"仅词码位 {len(word_only)} 个，词频合计 {sum(word_slot_w.get(s,0) for s,_ in word_only)}")
wv = sorted(word_only, key=lambda x: word_slot_w.get(x[0], 0))
print("  最低价值的 10 个：")
for s, t in wv[:10]:
    print(f"    {s} → {t}  词频={word_slot_w.get(s,0)}")
print(f"  挤掉 {len(losers)} 个最便宜的仅词位可覆盖全部缺口；"
      f"被挤词合计词频 {sum(word_slot_w.get(s,0) for s,_ in wv[:len(losers)])}"
      f"（占前 1500 字总频 {TOPW} 的 "
      f"{100*sum(word_slot_w.get(s,0) for s,_ in wv[:len(losers)])/TOPW:.3f}%）")
print()

# ── 六、T3 全局按频重排 ──
print("=" * 72)
print("六、T3 单字 2 码按字频全局重排")
print("=" * 72)
print(f"单字可用 2 码位 {len(slot_char)} 个 ≥ 1500 → 前 1500 字可 100% 两码内")
print(f"代价：完全放弃「前两码元」助记，2781 个字要重新记位")
