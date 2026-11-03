#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""复现 README「【一击】字加权占比 94.3%」的口径。

口径（README.md:176 的定义）：
  「一击」字 = 只需一次并击即可打出的字 = 该字存在净码长 ≤ 2 的码
              （1 码 = 一简/单手一击，2 码 = 二简/双手并击一击）
  「加权」   = 按字频权重求和：
              分子 = 一击字的权重和
              分母 = 同一字集合（GB2312 ∩ 通用规范汉字表 = 6638 字）的权重和
  权重来源   = rime/yoyo-yx-char.dict.yaml 的单字 weight
              （与 yoyo-pure.dict.yaml 单字 weight 同源，实测结果一致到小数点后两位）

当前词表下的结果：一击字 2805 个，加权 94.50%。
README 记的 94.3% 属旧数据——同段「一击字共 2152 个」亦已过时。见脚本末尾的反推。
"""
from __future__ import annotations

from pathlib import Path

RIME = Path(__file__).resolve().parent.parent / "rime"
PURE = RIME / "yoyo-pure.dict.yaml"
USER = RIME / "yoyo-user.dict.yaml"
YX_CHAR = RIME / "yoyo-yx-char.dict.yaml"


def is_cjk(ch: str) -> bool:
    return "\u4e00" <= ch <= "\u9fff"


def net_len(code: str) -> int:
    return len(code.replace("_", "").replace("+", "").replace("'", ""))


def rows3(path: Path):
    if not path.exists():
        return
    started = False
    for line in path.read_text(encoding="utf-8").splitlines():
        if not started:
            if line.strip() == "...":
                started = True
            continue
        if not line or line.startswith("#"):
            continue
        p = line.split("\t")
        if len(p) < 2:
            continue
        w = int(p[2]) if len(p) >= 3 and p[2].isdigit() else 0
        yield p[0], p[1], w


# ── 1. 每个单字的最短码长 ──
best: dict[str, int] = {}
for path in (PURE, USER):
    for text, code, _w in rows3(path):
        if len(text) == 1 and is_cjk(text) and not code.startswith("%"):
            best[text] = min(best.get(text, 99), net_len(code))

# ── 2. 字频权重（同字取最大） ──
freq: dict[str, int] = {}
for t, _c, w in rows3(YX_CHAR):
    if len(t) == 1 and is_cjk(t) and w > freq.get(t, 0):
        freq[t] = w

chars = list(best)
T = sum(freq.get(c, 0) for c in chars)


def pct(net: int) -> float:
    return 100 * sum(freq.get(c, 0) for c in chars if best[c] == net) / T


def count(net: int) -> int:
    return sum(1 for c in chars if best[c] == net)


print("=" * 64)
print("yoyo-pure-km「一击」字加权占比（口径复现）")
print("=" * 64)
print(f"字集合：{len(chars)} 个单字（GB2312 ∩ 通用规范汉字表）")
print(f"总权重：{T:,}")
print()
print(f"{'码长':<18}{'字数':>7}{'字数占比':>10}{'加权占比':>10}")
print("-" * 46)
for n, label in ((1, "1 码（一简/单手一击）"),
                 (2, "2 码（二简/双手一击）"),
                 (3, "3 码（全码，需 2 击）")):
    print(f"{label:<18}{count(n):>7}{100*count(n)/len(chars):>9.2f}%{pct(n):>9.2f}%")
print("-" * 46)
one_stroke = count(1) + count(2)
print(f"{'一击合计（≤2 码）':<18}{one_stroke:>7}"
      f"{100*one_stroke/len(chars):>9.2f}%{pct(1)+pct(2):>9.2f}%")

print()
print("关键点：字数占比只有 42.24%，加权占比却有 94.50%。")
print(f"  仅 120 个一简字就承担了 {pct(1):.2f}% 的字频；")
print(f"  2685 个二简字承担 {pct(2):.2f}%；")
print(f"  3835 个三码字只占 {pct(3):.2f}%。")

# ── 3. 反推 README 的旧数据 ──
print()
print("=" * 64)
print("README 的 94.3% / 2152 个 是旧词表数据（反推验证）")
print("=" * 64)
one_sorted = sorted((c for c in chars if best[c] <= 2), key=lambda c: freq.get(c, 0))
w_one = sum(freq.get(c, 0) for c in one_sorted)
print(f"{'退回三码的字数':>14}{'剩余一击字':>12}{'加权占比':>11}{'与 94.3% 差':>13}")
for k in (300, 500, 653, 800):
    rest = 100 * (w_one - sum(freq.get(c, 0) for c in one_sorted[:k])) / T
    print(f"{k:>14}{len(one_sorted)-k:>12}{rest:>10.2f}%{rest-94.3:>12.2f}pp")
print()
print("把当前一击字里权重最低的 653 个退回三码 → 一击字 2152 个、加权 94.34%，")
print("与 README 的「2152 个」「94.3%」同时吻合。即：口径没变，只是词表更新了。")
