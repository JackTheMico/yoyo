#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""yoyo-pure-km 击键经济学审计 v2。

口径（务必先读 README 顶部「纯形统一流 0 空格」约定）：
  一次「击」= 一次并击(chord)。空明拳物理层：
    - 双手并击 → 产出 2 个码元 = 1 击
    - 单手一击 → 产出 1 个码元 = 1 击
  净码长 net = code 去掉 _ + 后的字母数；击键数 chord = ceil(net/2)：
    net1(一简) → 1 击；net2(二简/2码词, 双手并击) → 1 击
    net3(三码单字) → 2 击；net4(词) → 2 击
  顶功只消除「确认键」，不改变击键数；故本表只算 chord。
"""
import math
from collections import defaultdict, Counter

PURE = "rime/yoyo-pure.dict.yaml"
USER = "rime/yoyo-user.dict.yaml"
YX_CHAR = "rime/yoyo-yx-char.dict.yaml"
YX_WORD = "rime/yoyo-yx-word.dict.yaml"


def net_len(code: str) -> int:
    return len(code.replace("_", "").replace("+", ""))


def chords_of(code: str) -> int:
    return math.ceil(net_len(code) / 2)


def chords_by_nl(nl: int) -> int:
    """净码长直接算击键数。"""
    return math.ceil(nl / 2)


def load_dict(path):
    """返回 list[(text, code, weight)]，跳过表头与空行。"""
    out = []
    in_body = False
    for line in open(path, encoding="utf-8"):
        if line.strip() == "...":
            in_body = True
            continue
        if not in_body:
            continue
        if not line.strip() or line.startswith("#"):
            continue
        p = line.rstrip("\n").split("\t")
        if len(p) < 2:
            continue
        out.append((p[0], p[1], int(p[2]) if len(p) > 2 and p[2].isdigit() else 0))
    return out


def load_yx_freq(path):
    """音形词频表 (text, code, weight)，weight 当词频。"""
    return load_dict(path)


print("== 加载主字典 ==")
pure = load_dict(PURE)
user = load_dict(USER)
all_entries = pure + user

# text -> 最小净码长
token_net = {}
for text, code, w in all_entries:
    nl = net_len(code)
    if text not in token_net or nl < token_net[text]:
        token_net[text] = nl

# 单字 -> 最小净码长（仅 yoyo-pure，6638 字）
char_net = {}
for text, code, w in pure:
    if len(text) == 1:
        nl = net_len(code)
        if text not in char_net or nl < char_net[text]:
            char_net[text] = nl

print("主字典条目:", len(pure), "| 用户条目:", len(user), "| 去重 token:", len(token_net))
print("单字数(主字典):", len(char_net))

# ── 1. 2 码空间剖析 ───────────────────────────────────────────────
print("\n== 1. 2 码空间占用明细 ==")
codes_2 = defaultdict(list)  # code -> [(text,weight)]
for text, code, w in pure:
    if len(code) == 2:
        codes_2[code].append((text, w))
n_2 = len(codes_2)
jian_codes = [c for c in codes_2 if c[0] in "_+"]
plain_2 = [c for c in codes_2 if c[0] not in "_+"]
print("2 字符码去重数:", n_2)
print("  其中一简(_X/+X):", len(jian_codes))
print("  普通 2 码(XY):", len(plain_2))
# 普通 2 码里是单字还是词
plain_2_char = [c for c in plain_2 if any(len(t) == 1 for t, _ in codes_2[c])]
plain_2_word = [c for c in plain_2 if any(len(t) >= 2 for t, _ in codes_2[c])]
plain_2_both = [c for c in plain_2 if c in plain_2_char and c in plain_2_word]
print("  普通 2 码中挂单字:", len(plain_2_char), "| 挂词:", len(plain_2_word), "| 两者都有:", len(plain_2_both))
# 一简码位各自挂几个候选
jian_multi = sum(1 for c in jian_codes if len(codes_2[c]) >= 2)
print("  一简码位挂≥2候选:", jian_multi, "/", len(jian_codes))
# 一个 2 码位同时挂「单字+词」(dict_map_2 命中)
both_cand = sum(1 for c in codes_2 if any(len(t) == 1 for t, _ in codes_2[c]) and any(len(t) >= 2 for t, _ in codes_2[c]))
print("  2 码位同时含单字+词:", both_cand)
print("  2 码空间剩余(按 60×60=3600 上限, 但含 _/+ 前缀不占码元位, 仅作参考):", max(0, 3600 - n_2))

# ── 2. 单字一击覆盖率(按字频加权) ───────────────────────────────
print("\n== 2. 单字一击覆盖率(字频加权) ==")
yx_char = load_yx_freq(YX_CHAR)
total_char_freq = 0
one_chord_freq = 0
no_cover = 0
for text, code, w in yx_char:
    if len(text) != 1:
        continue
    total_char_freq += w
    nl = char_net.get(text)
    if nl is not None and nl <= 2:
        one_chord_freq += w
    else:
        no_cover += 1
print("字频表单字数:", len([1 for t, _, _ in yx_char if len(t) == 1]))
print("单字总频(字频表):", total_char_freq)
print("可 1 击(有简码)的加权频:", one_chord_freq, "占比 %.1f%%" % (100 * one_chord_freq / total_char_freq))
print("字频表中不在 yoyo-pure 的单字:", no_cover)

# 按 net 分布
nl_dist = Counter(char_net.get(t, 9) for t, _, _ in yx_char if len(t) == 1)
print("单字净码长分布(字频加权):", dict(sorted(nl_dist.items())))

# ── 3. 词长分布(4 码) 与词频加权 ─────────────────────────────────
print("\n== 3. 词长分布与词频加权 ==")
word_len_plain = Counter()
for text, code, w in pure:
    if len(text) >= 2 and len(code) == 4:
        word_len_plain[len(text)] += 1
print("yoyo-pure 中 4 码词条按词长:", dict(sorted(word_len_plain.items())))
yx_word = load_yx_freq(YX_WORD)
wl_freq = Counter()
total_word_freq = 0
covered_freq = 0
for text, code, w in yx_word:
    if len(text) < 2:
        continue
    total_word_freq += w
    wl_freq[len(text)] += w
    if text in token_net:
        covered_freq += w
print("词频表词(≥2字)总频:", total_word_freq)
print("词频按词长(加权):", dict(sorted(wl_freq.items())))
print("能在 yoyo-pure 命中的加权频: %.1f%%" % (100 * covered_freq / total_word_freq))

# ── 4. % 空格简词码位空间 ───────────────────────────────────────
print("\n== 4. % 空格简词码位空间 ==")
pct = [code for text, code, w in user if code.startswith("%")]
print("已填 % 简词:", len(pct))
# 理论容量: 读 gen_brief_words 口径 — %XY(双手+空格) / %_X(左手+空格) / %+X(右手+空格)
# 自算: 双手 = 左码元×右码元；单手 = 60/_ + 60/+
# 左码元 = qwertasdfgzxcvb 系(15单键 + 双键?)；这里直接按 chord_utils.DAU_SET 60 码元估算上限
# 双手并击(左×右, 各 30 个并击码元) + 单手(60 left + 60 right)
left_dau = 30  # 左手可产出的码元数(单键15+双键15) 估算
right_dau = 30
cap_both = left_dau * right_dau
cap_left = 60  # %_X: X 为左手码元
cap_right = 60  # %+X: X 为右手码元
print("理论容量(估): 双手+空格 %d, 左手+空格 %d, 右手+空格 %d → 共 %d" % (cap_both, cap_left, cap_right, cap_both + cap_left + cap_right))
print("已用 %d → 剩余约 %d" % (len(pct), cap_both + cap_left + cap_right - len(pct)))

# ── 5. 重码真实情况 ─────────────────────────────────────────────
print("\n== 5. 重码情况 ==")
dup = Counter(len(v) for v in codes_2.values())
print("2 码位重码分布(码位数: 候选数):", dict(sorted(dup.items())))
all_dup_codes = [c for c, v in codes_2.items() if len(v) >= 2]
print("2 码重码码位数:", len(all_dup_codes))
# 跨码长重码
duplen = Counter()
for text, code, w in pure:
    duplen[len(code)] += 0
code_texts = defaultdict(set)
for text, code, w in pure:
    code_texts[code].add(text)
multi = sum(1 for c, s in code_texts.items() if len(s) >= 2)
print("全字典同码挂多文的码数:", multi, "/", len(code_texts))
print("  其中 2 码:", sum(1 for c, s in code_texts.items() if len(c) == 2 and len(s) >= 2))
print("  其中 3 码:", sum(1 for c, s in code_texts.items() if len(c) == 3 and len(s) >= 2))
print("  其中 4 码:", sum(1 for c, s in code_texts.items() if len(c) == 4 and len(s) >= 2))

# ── 6. 击键率(打词优先 + 简码优先 最优分词下界) ───────────────────
print("\n== 6. 击键率测算(最优分词下界) ==")
# 模型: 每个词频表的「词」出现一次, 用它在 yoyo-pure 的最佳 token(若命中)的 chord;
#        不命中的词, 拆成单字用各自最佳 chord 累加。
# 单字频表的单字单独出现时用最佳 chord(已含在词分解里? 这里单独加单字频做对比)
total_chords = 0.0
total_chars = 0.0
unmatched_words = 0
for text, code, w in yx_word:
    if len(text) < 2:
        continue
    total_chars += w * len(text)
    if text in token_net:
        total_chords += w * chords_by_nl(token_net[text])
    else:
        unmatched_words += w
        # 拆字
        for ch in text:
            nl = char_net.get(ch, 3)
            total_chords += w * chords_by_nl(nl)
print("词频表覆盖词频:", total_word_freq - unmatched_words, "/", total_word_freq)
print("  (未命中词频", unmatched_words, "按单字分解估算)")
print("加权总字符:", int(total_chars))
print("加权总击键:", round(total_chords))
print(">> 当前(打词优先) 每字击键数 ≈ %.3f" % (total_chords / total_chars))

# 单字全量基线(假设全打单字, 不用词)
sc = 0.0
scc = 0.0
for text, code, w in yx_char:
    if len(text) != 1:
        continue
    nl = char_net.get(text)
    if nl is None:
        continue
    sc += w * chords_by_nl(nl)
    scc += w
print(">> 纯单字(不用词) 每字击键数 ≈ %.3f" % (sc / scc))
