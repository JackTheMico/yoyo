"""yoyo-pure-km 一击（一次并击）字词统计。

定义（沿用 research/analyze_kongmingmas_one_chord.py）：
  net_len(code) = len(code 去掉 _ + ' 后的字母数)
  一击 = 该条目只需一次并击(chord)即可上屏。

三种口径：
  A. 字面口径：所有「一次并击即上屏」的字词（单字 + 多字词 + 空格简词）。
  B. 项目约定口径：仅多字词（len>=2）且 net_len<=2 的「一击词」（既有报告记为 3566）。
  C. 设计型一击捷径：单手一击一简(码长2且_/+前缀) + 空格并击简词(%码)。
"""
from pathlib import Path
from collections import Counter

RIME = Path("rime")
DICTS = [RIME / "yoyo-pure.dict.yaml", RIME / "yoyo-user.dict.yaml"]


def net_len(code: str) -> int:
    return len(code.replace("_", "").replace("+", "").replace("'", ""))


def is_cjk(ch):
    return "\u4e00" <= ch <= "\u9fff"


rows = []
for d in DICTS:
    started = False
    for l in d.read_text(encoding="utf-8").splitlines():
        if not started:
            if l.strip() == "...":
                started = True
            continue
        if not l or l.startswith("#"):
            continue
        p = l.split("\t")
        if len(p) >= 2:
            rows.append((p[0], p[1]))

one_stroke_chars = set()
one_stroke_words = set()
space_brief = {}
for t, c in rows:
    if c.startswith("%"):
        if len(c) == 3:
            space_brief.setdefault(c, t)
        continue
    nl = net_len(c)
    if nl <= 2:
        if len(t) == 1 and is_cjk(t[0]):
            one_stroke_chars.add(t)
        elif len(t) >= 2 and all(is_cjk(ch) for ch in t):
            one_stroke_words.add(t)

total = len(one_stroke_chars) + len(one_stroke_words) + len(space_brief)

# 单字一击的码长分布
char_by_net = Counter()
for t, c in rows:
    if c.startswith("%"):
        continue
    if len(t) == 1 and is_cjk(t[0]) and net_len(c) <= 2:
        char_by_net[net_len(c)] += 1
# 多字词一击的码长分布
word_by_net = Counter()
for t in one_stroke_words:
    # 找该 text 的码（取首个非%码）
    for tt, cc in rows:
        if tt == t and not cc.startswith("%"):
            word_by_net[net_len(cc)] += 1
            break

print("=== yoyo-pure-km 一击字词统计 ===")
print(f"[A] 字面口径（一次并击即上屏）合计: {total}")
print(f"    单字一击: {len(one_stroke_chars)}  (1码一简 {char_by_net.get(1,0)} + 2码二简等 {char_by_net.get(2,0)})")
print(f"    多字词一击: {len(one_stroke_words)}  (净码长1 {word_by_net.get(1,0)} + 净码长2 {word_by_net.get(2,0)})")
print(f"    空格并击简词(%): {len(space_brief)}")
print()
print(f"[B] 项目约定口径（净码长<=2 多字词一击词）: {len(one_stroke_words)}  (既有报告 3566)")
print()
# [C] 设计型捷径：单手一击一简（含双候选）+ 空格并击简词
yijian_rows = [(t, c) for t, c in rows if len(c) == 2 and c[0] in "_+" and not c.startswith("%")]
yijian_codes_n = len({c for t, c in yijian_rows})
yijian_texts_n = len({t for t, c in yijian_rows})
print(f"[C] 设计型一击捷径:")
print(f"    单手一击一简: {yijian_codes_n} 码位 / {yijian_texts_n} 候选(120单字+120词)")
print(f"    空格并击简词: {len(space_brief)}")
print(f"    合计(候选级): {yijian_texts_n + len(space_brief)}  码位级: {yijian_codes_n + len(space_brief)}")
