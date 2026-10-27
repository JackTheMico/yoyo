#!/usr/bin/env python3
"""串击切分规则的选型评估（可复跑）。

用途：验证 docs/design/cj-parsing-rules.md §2 的结论。改动切分规则前后都应重跑，
确保「按权重猜」确实不可用、确定性规则确实 100%。

方法
----
1. 从 yoyo-pure.dict.yaml 建三张判定表（2 码单元 / 3 码字 / 4 码词），
   字频按「该字全部条目最大值」回填到 2/3 码码位。
2. 按条目权重抽样 N 条「主导条目」作为输入意图（同码位非主导条目属固有多义，排除）。
3. 把意图的码元连成一条**连续按键流**（中间不插空格），逐条规则跑，
   核对上屏序列与意图序列。
4. 另跑「用户按空格定界」的协议：某条意图敲完没出字就按一次空格。

关键：连续输入是重点。单意图隔离测试会给出恒真的 100%（等得久必然对），
掩盖真实失败模式。

用法：python3 research/eval_cj_parsing_rules.py [--n 20000] [--seed 53]
"""

import argparse
import collections
import difflib
import pathlib
import random

ROOT = pathlib.Path(__file__).resolve().parents[1]
DICT = ROOT / "rime/yoyo-pure.dict.yaml"


def clean(code):
    return code.replace("_", "").replace("+", "")


def read_dict():
    rows, body = [], False
    for line in DICT.read_text(encoding="utf-8").splitlines():
        if line.startswith("..."):
            body = True
            continue
        if not body:
            continue
        p = line.split("\t")
        if len(p) < 2:
            continue
        w = int(p[2]) if len(p) > 2 and p[2].strip().isdigit() else 0
        rows.append((p[0], p[1].strip(), w))
    return rows


def build(rows):
    char_freq = collections.defaultdict(int)
    for t, _, w in rows:
        if len(t) == 1:
            char_freq[t] = max(char_freq[t], w)
    unit2, char3, word4 = {}, {}, {}
    for t, code, w in rows:
        c = clean(code)
        eff = char_freq.get(t, w) if len(t) == 1 else w
        tgt = {2: unit2, 3: char3, 4: word4}.get(len(c))
        if tgt is None:
            continue
        if c not in tgt or eff > tgt[c][1]:
            tgt[c] = (t, eff)
    w4max = collections.defaultdict(int)
    for c, (t, w) in word4.items():
        w4max[c[:3]] = max(w4max[c[:3]], w)
    longer2 = {c[:2] for c in char3} | {c[:2] for c in word4}
    prefix = set()
    for c in list(unit2) + list(char3) + list(word4):
        for i in range(1, len(c)):
            prefix.add(c[:i])
    return {"unit2": unit2, "char3": char3, "word4": word4, "w4max": w4max,
            "longer2": longer2, "prefix": prefix}


def corpus(T, rows, n, seed, mix=None):
    pool = []
    for t, code, w in rows:
        c = clean(code)
        if not (2 <= len(c) <= 4) or w <= 0:
            continue
        tbl = {2: "unit2", 3: "char3", 4: "word4"}[len(c)]
        if c not in T[tbl] or T[tbl][c][0] != t:
            continue
        pool.append((c, t, w, len(c)))
    rnd = random.Random(seed)
    if mix is None:
        return [pool[i] for i in rnd.choices(
            range(len(pool)), weights=[p[2] for p in pool], k=n)]
    out = []
    for L, share in mix.items():
        sub = [i for i, p in enumerate(pool) if p[3] == L]
        k = int(n * share)
        if k:
            out.extend(pool[i] for i in rnd.choices(
                sub, weights=[pool[i][2] for i in sub], k=k))
    rnd.shuffle(out)
    return out


# ─── 贪心规则族（流式，无空格） ──────────────────────────────────────────
class Greedy:
    def __init__(self, T, kind):
        self.T, self.kind = T, kind
        self.buf, self.out, self.keys, self.dead = "", [], 0, 0

    def w(self, tbl, code):
        v = self.T[tbl].get(code)
        return v[1] if v else -1

    def emit(self, text, suffix):
        self.out.append(text)
        self.buf = suffix

    def feed(self, ch):
        self.keys += 1
        self.buf += ch
        while self._rule(self.buf):
            pass
        b = self.buf
        if b and not (b in self.T["unit2"] or b in self.T["char3"]
                      or b in self.T["word4"] or b in self.T["prefix"]
                      or b in self.T["longer2"]):
            self.dead += 1
            self.buf = ""

    def _rule(self, buf):
        T, k = self.T, len(buf)
        b3, b2 = buf[:3], buf[:2]
        if k >= 4:
            b4 = buf[:4]
            if self.w("word4", b4) >= 0:
                self.emit(T["word4"][b4][0], buf[4:])
                return True
            if self.w("char3", b3) > self.w("unit2", b2) and self.w("char3", b3) >= 0:
                self.emit(T["char3"][b3][0], buf[3:])
                return True
            if self.w("unit2", b2) >= 0:
                self.emit(T["unit2"][b2][0], buf[2:])
                return True
            return False
        if k == 3:
            w3, w2 = self.w("char3", b3), self.w("unit2", b2)
            if self.kind == "R2_wait4":
                return False
            if self.kind == "R3_prefix4" and b3 in T["w4max"]:
                return False
            if self.kind == "R1_weight3" or self.kind == "R3_prefix4":
                if w2 >= 0 and w2 >= w3:
                    self.emit(T["unit2"][b2][0], buf[2:])
                    return True
            return False
        return False

    def flush(self):
        while self.buf:
            self.keys += 1
            b, self.buf = self.buf, ""
            while b:
                for L in (4, 3, 2):
                    if len(b) >= L and b[:L] in {4: self.T["word4"], 3: self.T["char3"],
                                                 2: self.T["unit2"]}[L]:
                        self.out.append({4: self.T["word4"], 3: self.T["char3"],
                                         2: self.T["unit2"]}[L][b[:L]][0])
                        b = b[L:]
                        break
                else:
                    b = b[1:]


# ─── 确定性规则（采用） ──────────────────────────────────────────────────
class Deterministic:
    def __init__(self, T):
        self.T = T
        self.buf, self.out, self.keys, self.spaces, self.dead = "", [], 0, 0, 0

    def feed(self, ch):
        self.keys += 1
        self.buf += ch
        while True:
            b = self.buf
            k = len(b)
            if k <= 1:
                return
            if k == 2:
                if b not in self.T["longer2"] and b in self.T["unit2"]:
                    self.out.append(self.T["unit2"][b][0])
                    self.buf = b[2:]
                    continue
                return
            if k == 3:
                if b not in self.T["w4max"] and b in self.T["char3"]:
                    self.out.append(self.T["char3"][b][0])
                    self.buf = b[3:]
                    continue
                return
            if b[:4] in self.T["word4"]:
                self.out.append(self.T["word4"][b[:4]][0])
                self.buf = b[4:]
                continue
            return

    def space(self):
        self.keys += 1
        self.spaces += 1
        b, self.buf = self.buf, ""
        while b:
            for L in (4, 3, 2):
                if len(b) >= L and b[:L] in {4: self.T["word4"], 3: self.T["char3"],
                                             2: self.T["unit2"]}[L]:
                    self.out.append({4: self.T["word4"], 3: self.T["char3"],
                                     2: self.T["unit2"]}[L][b[:L]][0])
                    b = b[L:]
                    break
            else:
                b = b[1:]

    def prune(self):
        b = self.buf
        if not b:
            return
        k = len(b)
        tbl = {2: self.T["unit2"], 3: self.T["char3"], 4: self.T["word4"]}.get(k, {})
        ok = (b in tbl or b in self.T["prefix"] or b in self.T["longer2"] or k >= 4)
        if not ok:
            self.dead += 1
            self.buf = ""


def run_greedy(T, intents, kind):
    m = Greedy(T, kind)
    for code, _, _, _ in intents:
        for ch in code:
            m.feed(ch)
    m.flush()
    want = [t for _, t, _, _ in intents]
    sm = difflib.SequenceMatcher(None, want, m.out, autojunk=False)
    matched = sum(b.size for b in sm.get_matching_blocks())
    return matched / len(want) * 100, m.keys / len(want)


def run_det(T, intents):
    f = Deterministic(T)
    ok = 0
    for code, text, _, _ in intents:
        before = len(f.out)
        for ch in code:
            f.feed(ch)
            f.prune()
        if len(f.out) == before:
            f.space()
        if "".join(f.out[before:]) == text:
            ok += 1
        if f.buf:
            f.space()
    return ok / len(intents) * 100, f.keys / len(intents), f.spaces / len(intents) * 100


SCENARIOS = {
    "加权混合": None,
    "词为主 80/12/8": {4: 0.80, 3: 0.12, 2: 0.08},
    "字为主 45/25/30": {3: 0.45, 2: 0.25, 4: 0.30},
    "纯 4 码词": {4: 1.0},
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=20000)
    ap.add_argument("--seed", type=int, default=53)
    a = ap.parse_args()

    rows = read_dict()
    T = build(rows)
    print(f"字典 {len(rows)} 条 | unit2 {len(T['unit2'])} char3 {len(T['char3'])} "
          f"word4 {len(T['word4'])}")
    free2 = sum(1 for c in T["unit2"] if c not in T["longer2"])
    print(f"2 码位中无更长码的：{free2} / {len(T['unit2'])} = "
          f"{free2/len(T['unit2'])*100:.2f}%（这些才能在第 2 键自动上屏）")
    free3 = sum(1 for c in T["char3"] if c not in T["w4max"])
    print(f"3 码位中非 4 码词前缀的：{free3} / {len(T['char3'])} = "
          f"{free3/len(T['char3'])*100:.1f}%（这些能在第 3 键自动上屏）")

    for name, mix in SCENARIOS.items():
        intents = corpus(T, rows, a.n, a.seed, mix)
        avg = sum(len(c) for c, _, _, _ in intents) / len(intents)
        print(f"\n=== {name}（{len(intents)} 条，平均码长 {avg:.2f}）===")
        print(f"{'规则':<22}{'意图正确率':>11}{'平均击键':>10}")
        print("-" * 45)
        for kind, label in (("R1_weight3", "R1 3码权重比较（原案）"),
                            ("R2_wait4", "R2 等满4码"),
                            ("R3_prefix4", "R3 有4码前缀才等")):
            acc, keys = run_greedy(T, intents, kind)
            print(f"{label:<22}{acc:>10.2f}%{keys:>10.3f}")
        acc, keys, sp = run_det(T, intents)
        print(f"{'R_det 确定性（采用）':<22}{acc:>10.2f}%{keys:>10.3f}  空格率 {sp:.1f}%")


if __name__ == "__main__":
    main()
