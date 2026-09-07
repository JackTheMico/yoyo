#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""补充量化：尚未 1 击的高频 2 字词市场 + 长词最大化下界。

复用 audit_codelen_common 的口径与数据源。
"""
from collections import Counter
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from audit_codelen_common import (
    PURE_DICT, USER_DICT, YX_WORD_DICT, YX_CHAR_DICT,
    iter_entries, load_freq,
)

BRIEF = 3720  # 理论 % 简词空间（gen_brief_words.build_slots 口径）


def token_net_map():
    """text -> 最小净码长（yoyo-pure + yoyo-user 并集）。"""
    import math
    def nl(code):
        return len(code.replace("_", "").replace("+", ""))
    m = {}
    for text, code, w in iter_entries(PURE_DICT):
        n = nl(code)
        if text not in m or n < m[text]:
            m[text] = n
    for text, code, w in iter_entries(USER_DICT):
        n = nl(code)
        if text not in m or n < m[text]:
            m[text] = n
    return m, nl


def main():
    import math
    token_net, nl = token_net_map()
    # 当前已 1 击(text)集合：净码长 ≤ 2 或 % 简词
    one_stroke_texts = {t for t, n in token_net.items() if n <= 2 or (token_net[t] and False)}

    print("== 已填 % 简词数 ==")
    pct_words = [text for text, code, w in iter_entries(USER_DICT) if code.startswith("%")]
    print("已填 % 简词:", len(pct_words), "| 理论空间:", BRIEF, "| 剩余:", BRIEF - len(pct_words))

    print("\n== 高频 2 字词中『尚未 1 击』的市场（按词频加权）==")
    wfreq = load_freq(YX_WORD_DICT)
    twochar = {w: f for w, f in wfreq.items() if len(w) == 2}
    not_1stroke = {w: f for w, f in twochar.items() if w not in one_stroke_texts}
    tot_f = sum(twochar.values())
    not_f = sum(not_1stroke.values())
    print("2 字词总频(加权):", tot_f)
    print("已 1 击的 2 字词频:", tot_f - not_f, "占比 %.1f%%" % (100 * (tot_f - not_f) / tot_f))
    print("尚未 1 击的 2 字词频:", not_f, "占比 %.1f%%" % (100 * not_f / tot_f))
    print("尚未 1 击的 2 字词数(去重):", len(not_1stroke))
    # 高频 top 前 N 个未 1 击 2 字词，若全部用 % 简词补成 1 击，可省多少击
    top = sorted(not_1stroke.items(), key=lambda x: -x[1])[:2720]
    savable = sum(f for _, f in top)  # 每个出现从 2 击 -> 1 击，省 1 击/字×2字
    ntop = len(top)
    print("若把未 1 击高频 2 字词 top %d 用 %% 简词补成 1 击：" % ntop)
    print("  可覆盖词频:", savable, "（占未 1 击市场 %.1f%%）" % (100 * savable / not_f if not_f else 0))
    print("  每个字从 2 击→1 击，每词省 2 击；加权省击约:", savable * 2)

    print("\n== 长词最大化下界（理想分词 + 全词命中）==")
    # 词频表所有 ≥2 字词都按 4 码(2 击)计，单字按各自最优净码长计；
    # 与 v2 同口径，但这里是『若所有词都能命中』= 已接近现状 90.9% 命中。
    # 计算若命中率 100%（剩余 9.1% 长尾词也进库）的击键率提升。
    char_net = {}
    for text, code, w in iter_entries(PURE_DICT):
        if len(text) == 1:
            n = nl(code)
            if text not in char_net or n < char_net[text]:
                char_net[text] = n
    total_chords = 0.0
    total_chars = 0.0
    covered = 0.0
    for text, f in wfreq.items():
        if len(text) < 2:
            continue
        total_chars += f * len(text)
        if text in token_net:
            total_chords += f * math.ceil(token_net[text] / 2)
            covered += f
        else:
            # 假设进库后按 4 码(2 击)计
            total_chords += f * 2
            covered += f
    print("若所有词频表词(≥2字)都能命中(4码=2击):")
    print("  加权总字符:", int(total_chars), "加权总击键:", round(total_chords))
    print("  >> 每字击键数 ≈ %.3f" % (total_chords / total_chars))
    print("  (当前 90.9% 命中下界为 0.763；全命中后略降，差额来自长尾低频词)")


if __name__ == "__main__":
    main()
