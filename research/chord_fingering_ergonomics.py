#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""空明拳并击指法工效分析（可重跑）。

用途
====
1. 枚举「两指不同指」的 63 个键位格（即 docs/design/kongmingquan-chord-fingering-optimization.md
   里那张 9 行 × 7 列表），标出空明拳的占用、标点占用与空闲格；
2. 用 rime/yoyo-pure.dict.yaml 算每个码元的真实使用权重；
3. 给出两套难度模型：A（结构启发式，参数见 W_* / K_* 常量）、
   B（由 13 个实测难度系数反推的线性模型）；
4. 打印候选方案（最小手术 / 小指减压 / +跨两排）的 Σ(权重×难度) 变化，
   并用 心法 → 指法 规则管道验证新键位左右手都能打出、与既有规则零冲突。

一手材料
========
- rime/yoyo.yaml            「空明拳」段：码元 → 键位（唯一真源）
- rime/yoyo-pure.dict.yaml  码元使用权重
- yoyo-pure-km.schema.yaml  「纯形统一心法」：左手/右手并击的前缀规则

用法
====
    cd <repo>
    python3 research/chord_fingering_ergonomics.py
"""
from __future__ import annotations

import re
import sys
from collections import defaultdict
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
YOYO = ROOT / "rime" / "yoyo.yaml"
DICT = ROOT / "rime" / "yoyo-pure.dict.yaml"

# ══════════════════════════════════════════════════════════════════════════
# 1. 键盘几何：左手 5 指 × 3 排。右手为同排水平镜像，指法难度等价。
# ══════════════════════════════════════════════════════════════════════════
FINGERS = ["小", "无", "中", "食外", "食内"]          # 由外到内
ROWS = ["上", "中", "下"]
KEYS = {
    "小":   {"上": "q", "中": "a", "下": "z"},
    "无":   {"上": "w", "中": "s", "下": "x"},
    "中":   {"上": "e", "中": "d", "下": "c"},
    "食外": {"上": "r", "中": "f", "下": "v"},
    "食内": {"上": "t", "中": "g", "下": "b"},
}
KEYPOS = {k: (FINGERS.index(f), ROWS.index(r)) for f in FINGERS for r in ROWS
          for k in [KEYS[f][r]]}
ALPHABET = "qwertasdfgzxcvb"        # chord_composer/alphabet 左手段顺序
R_ALPHABET = "yuiophjkl;nm,./"
MIRROR = {"y": "t", "u": "r", "i": "e", "o": "w", "p": "q", "h": "g", "j": "f",
          "k": "d", "l": "s", ";": "a", "n": "b", "m": "v", ",": "c",
          ".": "x", "/": "z"}       # 右手键 → 左手镜像键
INV_MIRROR = {v: k for k, v in MIRROR.items()}

ROWCOMBOS = [(0, 0), (0, 1), (1, 0), (1, 1), (1, 2), (2, 1), (2, 2)]
ROWLABEL = {(0, 0): "同上", (0, 1): "上→中", (1, 0): "中→上", (1, 1): "同中",
            (1, 2): "中→下", (2, 1): "下→中", (2, 2): "同下"}

# 16 组标点并击：与码元共用同一「2 键码位空间」，同样占坑
PUNCT = {"fg": "，", "ad": "。", "ag": "、", "xb": "；", "rt": "：", "zb": "？",
         "zc": "！", "vb": "……", "qe": "——", "cb": "·", "fb": "“”",
         "ac": "‘’", "ax": "《》", "fv": "（）", "ab": "【】", "dc": "「」"}


# ══════════════════════════════════════════════════════════════════════════
# 2. 模型 A：结构启发式。改这 6 个常量即可做敏感性分析。
# ══════════════════════════════════════════════════════════════════════════
W_FINGER = {"小": 1.50, "无": 1.20, "中": 1.00, "食外": 0.85, "食内": 0.90}
W_ROW = {"上": 1.08, "中": 1.00, "下": 1.15}
K_SPREAD = 0.10      # 跨指宽度罚：K_SPREAD × (指距−1)^1.6
K_ROWPEN = 0.35      # 两键不同排但相邻排
K_FARROW = 0.90      # 两键跨两排（上↔下）
K_SAME_H = 0.25      # 同指横向压条（同排相邻两列）
K_SAME_V = 1.20      # 同指纵向压条（如 de / ik）
BENCH = W_FINGER["小"] * W_ROW["中"] + W_FINGER["无"] * W_ROW["中"]  # a+s = 1.00


def key_effort(k):
    f, r = KEYPOS[k]
    return W_FINGER[FINGERS[f]] * W_ROW[ROWS[r]]


def score_a(keys):
    if len(keys) == 1:
        return key_effort(keys[0]) / BENCH
    s = sum(key_effort(k) for k in keys) + 0.30 * max(0, len(keys) - 2)
    byf = defaultdict(list)
    for k in keys:
        byf[KEYPOS[k][0]].append(k)
    for ks in byf.values():
        if len(ks) >= 2:
            cols = sorted(KEYPOS[k][1] for k in ks)
            s += (K_SAME_H if len(set(cols)) == 1 else K_SAME_V) * (len(ks) - 1)
    fs = [KEYPOS[k][0] for k in keys]
    rs = [KEYPOS[k][1] for k in keys]
    if len(set(fs)) >= 2:
        s += K_SPREAD * (max(fs) - min(fs) - 1) ** 1.6
    rd = max(rs) - min(rs)
    s += K_ROWPEN if rd == 1 else K_FARROW if rd == 2 else 0
    return s / BENCH


# ══════════════════════════════════════════════════════════════════════════
# 3. 模型 B：用 13 个实测难度系数反推（见 fit_model_b）
# ══════════════════════════════════════════════════════════════════════════
MEASURED = {"qs": 1.19, "wa": 1.35, "ax": 1.33, "sz": 1.46, "zx": 1.18,
            "qe": 1.22, "qd": 1.39, "ea": 1.20, "ac": 1.27, "dz": 1.26,
            "zc": 1.22, "zb": 1.18, "sc": 0.99}
FEATURES = ["常数", "小指参与", "无名参与", "指距−1", "行差", "两键都在上排",
            "两键都在下排", "上排键数", "下排键数"]


def feats(keys):
    pos = [KEYPOS[k] for k in keys]
    fs = [p[0] for p in pos]
    rs = [p[1] for p in pos]
    return [1.0, float(0 in fs), float(1 in fs),
            float(max(fs) - min(fs) - 1) if len(set(fs)) >= 2 else 0.0,
            float(max(rs) - min(rs)),
            float(all(r == 0 for r in rs)), float(all(r == 2 for r in rs)),
            float(rs.count(0)), float(rs.count(2))]


def fit_model_b():
    """最小二乘（正规方程 + 高斯消元），返回 (系数, R²)。"""
    X = [feats(k) for k in MEASURED]
    Y = [MEASURED[k] for k in MEASURED]
    n, p = len(X), len(X[0])
    A_mat = [[sum(X[i][a] * X[i][b] for i in range(n)) for b in range(p)] for a in range(p)]
    b_vec = [sum(X[i][a] * Y[i] for i in range(n)) for a in range(p)]
    M = [row[:] + [b_vec[i]] for i, row in enumerate(A_mat)]
    for c in range(p):
        piv = max(range(c, p), key=lambda r: abs(M[r][c]))
        if abs(M[piv][c]) < 1e-12:
            continue
        M[c], M[piv] = M[piv], M[c]
        pv = M[c][c]
        M[c] = [v / pv for v in M[c]]
        for r in range(p):
            if r != c and abs(M[r][c]) > 1e-15:
                f = M[r][c]
                M[r] = [a - f * b for a, b in zip(M[r], M[c])]
    beta = [M[i][p] for i in range(p)]
    pred = [sum(bb * ff for bb, ff in zip(beta, x)) for x in X]
    ss_res = sum((y - pr) ** 2 for y, pr in zip(Y, pred))
    ss_tot = sum((y - sum(Y) / n) ** 2 for y in Y)
    return beta, 1 - ss_res / ss_tot


def make_scorer_b(beta):
    def score(keys):
        s = sum(bb * ff for bb, ff in zip(beta, feats(keys)))
        if len(keys) >= 3:
            s += 0.30
        if len({KEYPOS[k][0] for k in keys}) < len(keys):   # 同指压条：模型外，单列罚项
            s += 0.90 * (len(keys) - len({KEYPOS[k][0] for k in keys}))
        return s
    return score


# ══════════════════════════════════════════════════════════════════════════
# 4. 63 格枚举 / 空明拳映射 / 词库权重
# ══════════════════════════════════════════════════════════════════════════
def build_cells():
    cells = []
    for i in range(len(FINGERS)):
        for j in range(i + 1, len(FINGERS)):
            f1, f2 = FINGERS[i], FINGERS[j]
            if (f1, f2) == ("食外", "食内"):     # 同一根食指，属「压条」而非两指分工
                continue
            for r1, r2 in ROWCOMBOS:
                k1, k2 = KEYS[f1][ROWS[r1]], KEYS[f2][ROWS[r2]]
                cells.append(dict(
                    f1=f1, f2=f2, r1=r1, r2=r2,
                    label=f"{f1}+{f2}/{ROWLABEL[(r1, r2)]}",
                    keys="".join(sorted([k1, k2], key=ALPHABET.index))))
    return cells


def load_fingering():
    """解析 yoyo.yaml「空明拳」段 → {码元: 左手键串}（右手镜像键折算到左手）。"""
    d = yaml.safe_load(YOYO.read_text(encoding="utf-8"))
    bag = defaultdict(set)
    for r in d["空明拳"]["__append"]:
        if not isinstance(r, str) or not r.startswith("xform|"):
            continue
        parts = r[len("xform|"):].rstrip("|").split("|")
        if len(parts) != 2:
            continue
        src, dst = parts[0].replace("\\.", "."), parts[1]
        if len(dst) != 1 or not src or not all(c in ALPHABET for c in src):
            continue
        bag[dst].add("".join(sorted(src, key=ALPHABET.index)))
    out = {y: min(v, key=lambda c: (len(c), c)) for y, v in bag.items()}
    for k in ALPHABET:                                # 15 个单键直出
        out.setdefault(k, k)
    return out


def load_weights():
    """按词库权重累计每个码元被击打的次数（一简/二简条目带权重，全码条目为 0）。"""
    w, total, lines = defaultdict(float), 0.0, 0
    with DICT.open(encoding="utf-8") as fh:
        for line in fh:
            if line.startswith("#") or line.startswith("---") or "\t" not in line:
                continue
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 3:
                continue
            try:
                weight = float(parts[2])
            except ValueError:
                continue
            lines += 1
            if weight <= 0:
                continue
            for ch in parts[1].lstrip("%_+").replace("#", ""):
                w[ch] += weight
                total += weight
    return w, total, lines


# ══════════════════════════════════════════════════════════════════════════
# 5. 候选方案
# ══════════════════════════════════════════════════════════════════════════
PLANS = {
    "方案 A 最小手术（1 处）": {">": "td"},
    "方案 B 小指减压（6 处）": {">": "td", "T": "ts", "p": "db", "Z": "gc",
                                "H": "sb", "B": "gx"},
    "方案 C B+治跨两排（8 处）": {">": "td", "T": "ts", "p": "db", "Z": "gc",
                                  "H": "sb", "B": "gx", "E": "ea", "W": "dz"},
    "方案 D B+Q降双键（7 处）": {">": "td", "T": "ts", "p": "db", "Z": "gc",
                                  "H": "sb", "B": "gx", "Q": "ea"},
}


def main():
    beta, r2 = fit_model_b()
    score_b = make_scorer_b(beta)
    cells = build_cells()
    fingering = load_fingering()
    w, total, n_lines = load_weights()

    cell_a = {c["keys"]: score_a(c["keys"]) for c in cells}
    cell_b = {c["keys"]: score_b(c["keys"]) for c in cells}
    cellof = {c["keys"]: c for c in cells}
    # 多键码元：44 个双键 + 1 个三键（Q = esf）
    doubles = {y: k for y, k in fingering.items() if len(k) >= 2}
    share = {y: w.get(y, 0) / total * 100 for y in doubles}

    print("=" * 96)
    print(f"词库 {n_lines} 条；单键码元承担 {sum(w.get(c, 0) for c in ALPHABET) / total * 100:.1f}% "
          f"击打权重，多键码元（双键 44 + 三键 1）{sum(share.values()):.1f}%")
    print("模型 B（反推自 13 个实测系数）R² = %.3f" % r2)
    for name, bb in zip(FEATURES, beta):
        print(f"    {name:<10}{bb:+.4f}")

    # ── 63 格全表 ────────────────────────────────────────────────────────
    print("\n" + "=" * 96)
    print("63 格全表（左手指法；右手镜像）  [码元 / ·标点 / 空]")
    print("=" * 96)
    print(f"{'指对':<10}" + "".join(f"{ROWLABEL[rc]:>16}" for rc in ROWCOMBOS))
    occ = defaultdict(list)
    for y, k in doubles.items():
        occ[k].append(y)
    for i in range(len(FINGERS)):
        for j in range(i + 1, len(FINGERS)):
            f1, f2 = FINGERS[i], FINGERS[j]
            if (f1, f2) == ("食外", "食内"):
                continue
            row = f"{f1}+{f2}".ljust(8)
            for r1, r2 in ROWCOMBOS:
                k = "".join(sorted([KEYS[f1][ROWS[r1]], KEYS[f2][ROWS[r2]]],
                                   key=ALPHABET.index))
                got = occ.get(k)
                tag = "/".join(got) if got else ("·" + PUNCT[k] if k in PUNCT else "空")
                row += f"{k:>4}{tag:<12}"
            print(row)

    free = [c["keys"] for c in cells if c["keys"] not in occ and c["keys"] not in PUNCT]
    print(f"\n空闲格 {len(free)} 个（含小指的排在后面）：")
    for k in sorted(free, key=lambda k: cell_b[k]):
        flag = "含小指" if cellof[k]["label"].startswith("小") else "无小指"
        print(f"    {k:<4}{cellof[k]['label']:<18}{flag:<6}"
              f"模型A {cell_a[k]:.3f}   模型B {cell_b[k]:.3f}")

    # ── 表外键位 ─────────────────────────────────────────────────────────
    print("\n表外键位（不属于 63 格）：")
    for y, k in sorted(doubles.items()):
        if k in cellof:
            continue
        print(f"    {y!r:<4}{k:<5}A {score_a(k):.3f}  B {score_b(k):.3f}  权重 {share[y]:.2f}%")

    # ── 方案对比 ─────────────────────────────────────────────────────────
    def totals(asg, cell, scorer):
        return sum(share[y] * (cell.get(asg[y]) or scorer(asg[y])) for y in doubles)

    base_a = totals(doubles, cell_a, score_a)
    base_b = totals(doubles, cell_b, score_b)
    print("\n" + "=" * 96)
    print(f"方案对比（基线 Σ_A={base_a:.4f}  Σ_B={base_b:.4f}）")
    print("=" * 96)
    print(f"{'方案':<24}{'改动':>4}{'Σ_A':>10}{'Δ_A':>8}{'Σ_B':>10}{'Δ_B':>8}")
    for name, plan in PLANS.items():
        asg = dict(doubles)
        asg.update(plan)
        ta, tb = totals(asg, cell_a, score_a), totals(asg, cell_b, score_b)
        print(f"{name:<24}{len(plan):>4}{ta:>10.4f}{(ta-base_a)/base_a*100:>7.1f}%"
              f"{tb:>10.4f}{(tb-base_b)/base_b*100:>7.1f}%")

    # ── 全量重排下界 ─────────────────────────────────────────────────────
    pool = sorted({k for k in doubles.values() if k in cellof} | set(free),
                  key=lambda k: cell_a[k])
    heavy = sorted(doubles, key=lambda y: -share[y])
    print("\n完全重排下界（44+1 个多键码元按权重顺序对号入座）：")
    for tag, cell, scorer, base in (("模型 A", cell_a, score_a, base_a),
                                    ("模型 B", cell_b, score_b, base_b)):
        ideal = sum(share[y] * cell[k] for y, k in zip(heavy, sorted(pool, key=lambda k: cell[k])))
        print(f"    {tag}: Σ {ideal:.4f}  ({(ideal-base)/base*100:+.1f}%)  "
              f"需改 {sum(1 for y, k in zip(heavy, sorted(pool, key=lambda k: cell[k])) if doubles[y] != k)} 个键位")

    # ── 规则管道验证 ─────────────────────────────────────────────────────
    d = yaml.safe_load(YOYO.read_text(encoding="utf-8"))
    rules = []
    for r in d["空明拳"]["__append"]:
        if not isinstance(r, str):
            continue
        if r.startswith("xform|"):
            parts = r[len("xform|"):].rstrip("|").split("|")
        elif r.startswith("xform/"):
            body = r[len("xform/"):].rstrip("/")
            i = body.rfind("/")
            parts = [body[:i], body[i + 1:]] if i >= 0 else []
        else:
            continue
        if len(parts) == 2:
            rules.append(tuple(parts))
    punct_at = next(i for i, (p, _) in enumerate(rules) if p.startswith("^"))

    def run(s, rs):
        if re.fullmatch(f"[{ALPHABET}]+", s):
            s = "_" + s
        elif re.fullmatch(f"[{R_ALPHABET}]+", s):
            s = "+" + s
        for pat, repl in rs:
            s = re.sub(pat, repl, s)
        return s

    print("\n" + "=" * 96)
    print("规则管道验证（心法 → 指法，左右手各一遍）")
    print("=" * 96)
    for name, plan in PLANS.items():
        new_rules = rules[:]
        ins = punct_at
        for y, k in plan.items():
            ks = "".join(sorted(k, key=ALPHABET.index))
            new_rules[ins:ins] = [(ks, y), (ks[::-1], y)]
            ins += 2
        allok = True
        print(f"\n【{name}】")
        for y, k in plan.items():
            rk = "".join(sorted((INV_MIRROR[c] for c in k), key=R_ALPHABET.index))
            ok = (run(k, new_rules).lstrip("_+") == y
                  and run(rk, new_rules).lstrip("_+") == y and k in cellof)
            allok &= ok
            print(f"    {y!r:<4} 左手 {k:<4} 右手 {rk:<4} "
                  f"难度 A {cell_a[k]:.3f} / B {cell_b[k]:.3f}  "
                  f"权重 {share[y]:.2f}%  {'✓' if ok else '✗'}")
        print(f"    → {'全部可用' if allok else '存在冲突'}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
