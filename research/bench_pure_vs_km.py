#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""yoyo-pure-km（纯形·空明）vs kongmingma（原生空明码）打字性能对比。

——口径（已用 librime 引擎实测校准，见文末「口径依据」）——
* 一次「击」= 一次并击(chord)。chord_composer 的 FinishChord 把一次并击
  序列化为 2 个码字符（左手出 1 个、右手出 1 个；单侧只有一只手时就补 `=`），
  所以：**击数 = ceil(码字符数 / 2)**。
  实测：空明码 'a' → `a=`、'y' → `=t`、双手 'ay' → `at`，每个 chord 恰好 2 字符。
* 纯形 yoyo-pure 的编码里 `_ + %` 是通道/简码标记，不占码元，算净长度。
* 顶功 / auto_select 自动上屏不额外按键，不计空格。
* 重码：同一编码下不是首选的字词，按 +1 击（选重）计。
* 标点：两套方案都是并击直出 1 击，故不计入「汉字击数」，单独列出。

用法：
  python3 research/bench_pure_vs_km.py [赛文.txt] [--report out.md]
"""
from __future__ import annotations

import argparse
import math
import pathlib
from collections import Counter, defaultdict

ROOT = pathlib.Path(__file__).resolve().parent.parent
PURE_DICT = ROOT / "rime/yoyo-pure.dict.yaml"
USER_DICT = ROOT / "rime/yoyo-user.dict.yaml"
KM_DICT = pathlib.Path.home() / ".local/share/fcitx5/rime/kongmingma.dict.yaml"
DEFAULT_TEXT = pathlib.Path.home() / "文档/打字练习素材/异地相处的情感感悟.txt"

MAX_WORD = 8
CJK = lambda ch: "\u4e00" <= ch <= "\u9fff" or "\u3400" <= ch <= "\u4dbf"
PUNCT = set("，。、；：“”‘’（）《》！？…—·「」【】,.;:!?()<>\"'")


def chords(symbols: int) -> int:
    return max(1, math.ceil(symbols / 2))


def read_dict(path: pathlib.Path):
    """流式读 rime 词典正文，yield (text, code, order)。"""
    inbody = False
    order = 0
    with open(path, encoding="utf-8-sig") as f:
        for line in f:
            if not inbody:
                if line.strip() == "...":
                    inbody = True
                continue
            if not line.strip() or line.startswith("#"):
                continue
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 2:
                continue
            text, code = parts[0], parts[1].strip()
            if not code or not text:
                continue
            order += 1
            yield text, code, order


def yoyo_symbols(code: str) -> int:
    c = code
    while c and c[0] in "_+%":
        c = c[1:]
    return len(c)


def km_symbols(code: str) -> int:
    return len([ch for ch in code if ch not in "﻿"])


def build_table(paths, sym, cand, limit_order=None):
    """返回 token -> (symbols, rank)。rank=1 表示该编码的首选。"""
    best = {}
    for path in paths:
        for text, code, order in read_dict(path):
            if limit_order is not None and order > limit_order:
                break
            if text not in cand:
                continue
            n = sym(code)
            cur = best.get(text)
            if cur is None or n < cur[0]:
                best[text] = (n, code)
    codes = {v[1] for v in best.values()}
    first = {}
    for path in paths:
        for text, code, order in read_dict(path):
            if limit_order is not None and order > limit_order:
                break
            if code in codes and code not in first:
                first[code] = text
    return {t: (n, 1 if first.get(c) == t else 2) for t, (n, c) in best.items()}


def segment(text, table, token_cost):
    """最小击数切分（DP）。返回 (总击数, tokens)。"""
    n = len(text)
    INF = float("inf")
    cost = [INF] * (n + 1)
    back = [None] * (n + 1)
    cost[0] = 0
    for i in range(n):
        if cost[i] == INF:
            continue
        for L in range(1, min(MAX_WORD, n - i) + 1):
            w = text[i:i + L]
            c = token_cost(w)
            if c is None:
                continue
            if cost[i] + c < cost[i + L]:
                cost[i + L] = cost[i] + c
                back[i + L] = (i, w)
    toks = []
    j = n
    while j > 0 and back[j]:
        i, w = back[j]
        toks.append(w)
        j = i
    toks.reverse()
    return cost[n], toks


def make_cost(table):
    """词 → 击数。表里没有的多字词返回 None（不可切）；未收录单字兜底 3 击。"""
    def cost(w):
        e = table.get(w)
        if e is None:
            return 3 if len(w) == 1 else None
        return chords(e[0]) + (e[1] - 1)
    return cost


def analyse(name, table, han, punct_n):
    ctab = {k: v for k, v in table.items() if len(k) == 1}

    total, toks = segment(han, table, make_cost(table))
    # 纯单字基线（只用单字码，不用词）
    char_total, _ = segment(han, ctab, make_cost(ctab))

    hist = Counter()
    hist_chars = Counter()
    rank2 = 0
    cost_fn = make_cost(table)
    for t in toks:
        c = cost_fn(t)
        hist[c] += 1
        hist_chars[c] += len(t)
        e = table.get(t)
        if e is not None and e[1] > 1:
            rank2 += len(t)
    missing = [ch for ch in han if ch not in ctab]
    uncovered = len(missing)
    word_chars = sum(len(t) for t in toks if len(t) > 1)
    return dict(
        name=name, total=total, toks=toks, hist=hist, hist_chars=hist_chars,
        char_total=char_total, word_chars=word_chars, rank2_chars=rank2,
        uncovered=uncovered, punct_n=punct_n, vocab=len(ctab), words=len(table),
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("text", nargs="?", default=str(DEFAULT_TEXT))
    ap.add_argument("--report", default=None)
    args = ap.parse_args()

    src = pathlib.Path(args.text)
    raw = src.read_text(encoding="utf-8").strip()
    han = "".join(ch for ch in raw if CJK(ch))
    punct_n = sum(1 for ch in raw if ch in PUNCT)

    cand = set()
    for i in range(len(han)):
        for L in range(1, MAX_WORD + 1):
            if i + L <= len(han):
                cand.add(han[i:i + L])

    pure = build_table([PURE_DICT, USER_DICT], yoyo_symbols, cand)
    km = build_table([KM_DICT], km_symbols, cand)

    A = analyse("yoyo-pure-km", pure, han, punct_n)
    B = analyse("kongmingma", km, han, punct_n)

    # 共同词表对照组：只允许两库都有的 token，隔离「编码效率」与「词库规模」两个变量
    shared = {t for t in pure if t in km}
    A2 = analyse("yoyo@共同词表", {t: v for t, v in pure.items() if t in shared}, han, punct_n)
    B2 = analyse("km@共同词表", {t: v for t, v in km.items() if t in shared}, han, punct_n)

    # 不计选重惩罚（只看编码本身的长度）
    norank = lambda tab: {t: (v[0], 1) for t, v in tab.items()}
    A3 = analyse("yoyo@不计选重", norank(pure), han, punct_n)
    B3 = analyse("km@不计选重", norank(km), han, punct_n)

    # 只用单字 + 二字词（贴近真实打词习惯：实测打词率 ~80%，长词很少用）
    short = lambda tab: {t: v for t, v in tab.items() if len(t) <= 2}
    A4 = analyse("yoyo@只单字二词", short(pure), han, punct_n)
    B4 = analyse("km@只单字二词", short(km), han, punct_n)

    def fmt(x, y, z):
        return f"{x:>14}{y:>14}{z:>14}"

    lines = []
    add = lines.append
    n = len(han)
    add("# 打字性能对比：yoyo-pure-km vs 空明码（kongmingma）\n")
    add(f"- 赛文：`{src}`")
    add(f"- 长度：总字符 {len(raw)}｜汉字 {n}｜标点 {punct_n}")
    add("- 口径：1 击 = 2 个码字符；击数 = ceil(码字符/2)；重码非首选 +1 击；标点两者皆 1 击直出（不计入）\n")

    add("## 一、各自完整词库（真实使用状态）\n")
    add("| 指标 | yoyo-pure-km | 空明码 kongmingma |")
    add("| :--- | ---: | ---: |")
    add(f"| 总击数（汉字部分） | {A['total']} | {B['total']} |")
    add(f"| **码长（击/字）** | **{A['total']/n:.3f}** | **{B['total']/n:.3f}** |")
    add(f"| 纯单字基线码长 | {A['char_total']/n:.3f} | {B['char_total']/n:.3f} |")
    add(f"| 词覆盖字数 | {A['word_chars']}（{A['word_chars']/n:.1%}） | {B['word_chars']}（{B['word_chars']/n:.1%}） |")
    add(f"| 一击直出字数 | {A['hist_chars'].get(1,0)}（{A['hist_chars'].get(1,0)/n:.1%}） | {B['hist_chars'].get(1,0)}（{B['hist_chars'].get(1,0)/n:.1%}） |")
    add(f"| 非首选需选重字数 | {A['rank2_chars']}（{A['rank2_chars']/n:.1%}） | {B['rank2_chars']}（{B['rank2_chars']/n:.1%}） |")
    add(f"| 码长（不计选重惩罚） | {A3['total']/n:.3f} | {B3['total']/n:.3f} |")
    add(f"| 词库规模 | 8.2 万条 | 305 万条 |")
    add(f"| 本文命中词条数 | {A['words']} | {B['words']} |")
    add(f"| 可打字数 | {A['vocab']}/{len(set(han))} | {B['vocab']}/{len(set(han))} |")
    add("")

    add("## 二、同词表对照（隔离词库规模，只看编码效率）\n")
    add(f"只允许两库共有的 {len(shared)} 个 token 参与切分，各自用自己的编码算击数：\n")
    add("| 指标 | yoyo-pure-km | 空明码 kongmingma |")
    add("| :--- | ---: | ---: |")
    add(f"| 总击数 | {A2['total']} | {B2['total']} |")
    add(f"| **码长（击/字）** | **{A2['total']/n:.3f}** | **{B2['total']/n:.3f}** |")
    add(f"| 词覆盖字数 | {A2['word_chars']}（{A2['word_chars']/n:.1%}） | {B2['word_chars']}（{B2['word_chars']/n:.1%}） |")
    add(f"| 一击直出字数 | {A2['hist_chars'].get(1,0)} | {B2['hist_chars'].get(1,0)} |")
    add("")

    add("## 三、只用单字 + 二字词（贴近真实打词习惯）\n")
    add("实测打词率约 80%，长词/短语很少真用；限制词长 ≤2 后的对照：\n")
    add("| 指标 | yoyo-pure-km | 空明码 |")
    add("| :--- | ---: | ---: |")
    add(f"| 总击数 | {A4['total']} | {B4['total']} |")
    add(f"| **码长（击/字）** | **{A4['total']/n:.3f}** | **{B4['total']/n:.3f}** |")
    add(f"| 词覆盖字数 | {A4['word_chars']}（{A4['word_chars']/n:.1%}） | {B4['word_chars']}（{B4['word_chars']/n:.1%}） |")
    add("")

    add("## 四、击数分布（token 数 / 覆盖字数）\n")
    add("| 击数 | yoyo-pure-km | 空明码 |")
    add("| ---: | :--- | :--- |")
    for k in sorted(set(A['hist']) | set(B['hist'])):
        add(f"| {k} 击 | {A['hist'].get(k,0)} / {A['hist_chars'].get(k,0)} | {B['hist'].get(k,0)} / {B['hist_chars'].get(k,0)} |")
    add("")

    add("## 五、理论速度换算\n")
    add("假定两方案击速相同（都是单手双键并击），速度与码长成反比：\n")
    add("| 击速假设 | yoyo-pure-km | 空明码 |")
    add("| :--- | ---: | ---: |")
    for cps in (6, 7, 8):
        sa = cps * 60 / (A['total'] / n)
        sb = cps * 60 / (B['total'] / n)
        add(f"| {cps} 击/秒 | {sa:.0f} 字/分 | {sb:.0f} 字/分 |")
    add("")

    add("## 六、切分对照（前 60 个 token）\n")
    add(f"- yoyo-pure-km：`{' / '.join(A['toks'][:60])}`")
    add(f"- 空明码：`{' / '.join(B['toks'][:60])}`")
    add("")

    add("## 七、口径依据（librime 引擎实测）\n")
    add("```")
    add("kongmingma chord_composer 探针（真引擎，非推测）：")
    add("  单手 'a'  → 码串 a=   （一次击输出 2 个码字符，右手位补 = 占位）")
    add("  单手 'y'  → 码串 =t   （右手，左手位补 =）")
    add("  双手 'ay' → 码串 at   （一次击，两手各出 1 个）")
    add("=> 2 码字符 = 1 击，与纯形「双手并击 = 2 码元 = 1 击」同构。")
    add("```")
    add("")
    add("## 八、注意\n")
    add("- 理论最优 ≠ 实战：上面是「每处都选最优切分」的下界。用户 10/25 极速杯实测" )
    add("  空明码 码长 1.0（491 字 / 503 键）、打词率 80.04%，比本表 0.795 高约 26%，")
    add("  差额来自回改、选词犹豫、没用上长词短码。")
    add("- 未含标点：61 个标点两方案都是 1 击直出，双方持平，故未计入汉字击数。")
    add("- 空明码重码占比可能偏高：DP 偏爱长词，而长词在 305 万库中重码更多；")
    add("  真人偏好高频词，实际选重负担应低于 22.8%。")
    add("- 击速假设两边相同；真实手感差异（空明声韵单手 vs 纯形字根单手）未建模。")


    out = "\n".join(lines)
    print(out)
    if args.report:
        pathlib.Path(args.report).write_text(out + "\n", encoding="utf-8")
        print(f"\n报告已写入 {args.report}")


if __name__ == "__main__":
    main()
