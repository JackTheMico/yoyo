#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""投影：把 % 简词空间补满(995->3720) 后，整体每字击键率变化。

口径与 v2 / audit_codelen_addressable 一致：打词优先 + 简码优先 最优分词下界。
promote 策略：取 yoyo-yx-word 中「尚未 1 击」的 2 字词，按词频降序，
最多取 free_pct 个，把它们降级为 1 击(视为获得 % 简词)。重算加权击键率。
"""
import math
from collections import defaultdict
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from audit_codelen_common import PURE_DICT, USER_DICT, YX_WORD_DICT, iter_entries, load_freq

USED_PCT = 995
TOTAL_PCT = 3720


def token_net_map():
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


def char_net_map():
    def nl(code):
        return len(code.replace("_", "").replace("+", ""))
    m = {}
    for text, code, w in iter_entries(PURE_DICT):
        if len(text) == 1:
            n = nl(code)
            if text not in m or n < m[text]:
                m[text] = n
    return m


def rate(token_net, char_net, promote=set()):
    """返回 (总击键, 总字符) 加权。"""
    wfreq = load_freq(YX_WORD_DICT)
    total_chords = 0.0
    total_chars = 0.0
    for text, f in wfreq.items():
        if len(text) < 2:
            continue
        total_chars += f * len(text)
        if text in promote:
            total_chords += f * 1          # 1 击
        elif text in token_net:
            total_chords += f * math.ceil(token_net[text] / 2)
        else:
            for ch in text:
                nl = char_net.get(ch, 3)
                total_chords += f * math.ceil(nl / 2)
    return total_chords, total_chars


def main():
    token_net, nl = token_net_map()
    char_net = char_net_map()
    one_stroke = {t for t, n in token_net.items() if n <= 2}
    wfreq = load_freq(YX_WORD_DICT)
    twochar = {w: f for w, f in wfreq.items() if len(w) == 2}
    not1 = sorted(((w, f) for w, f in twochar.items() if w not in one_stroke),
                  key=lambda x: -x[1])
    free = TOTAL_PCT - USED_PCT
    print("当前已用 % 简词:", USED_PCT, " 理论容量:", TOTAL_PCT, " 剩余:", free)
    print("未 1 击 2 字词(可补 % 的对象)去重:", len(not1))

    base_c, base_ch = rate(token_net, char_net)
    print("\n当前(补满前) 每字击键率 ≈ %.3f  (击键 %.0f / 字符 %.0f)"
          % (base_c / base_ch, base_c, base_ch))

    for k in (0, 500, 1000, 1500, 2000, 2500, 2725):
        promote = set(w for w, _ in not1[:k])
        c, ch = rate(token_net, char_net, promote)
        saved = 100 * (1 - c / base_c)
        print("补 %d 个 %% 简词 -> 每字击键率 ≈ %.3f  (省 %.1f%%)" % (k, c / ch, saved))


if __name__ == "__main__":
    main()
