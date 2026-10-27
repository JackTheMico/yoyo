#!/usr/bin/env python3
"""#55 主单/主词路由与次选直出的数据验收。

串击版与并击版的关键差异：并击的 2 码位靠「按在哪只手、按了几个键」区分，
串击只剩码元本身，所以「同一 2 码位既是单字又是词」必须由数据显式分开。

本测试对账口径与 test_cj_decision_data.py 一致：**与 yoyo-pure.dict.yaml 逐条对账**，
不与生成器自己对账。数据经真 Lua 解释器加载（与 librime-lua 同版本）。

运行：/usr/bin/python3 rime/scripts/test_cj_views.py
"""

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
DICT = ROOT / "rime/yoyo-pure.dict.yaml"
DATA = ROOT / "rime/lua/yoyo/data/cj_decision.lua"
DUMPER = ROOT / "rime/scripts/dump_cj_decision.lua"
DOC = ROOT / "docs/design/cj-decision-data.md"

FAILS = []


def check(name, cond, detail=""):
    if cond:
        print(f"  ok   {name}")
    else:
        FAILS.append(f"{name} {detail}".strip())
        print(f"  FAIL {name} {detail}")


def clean(code):
    return code.replace("_", "").replace("+", "")


def read_dict():
    out = []
    body = False
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
        out.append((p[0], p[1].strip(), w))
    return out


def expected_split2(rows):
    """按票面口径推出「同时有单字与词」的 2 码位及其两类首选。"""
    char_freq = {}
    for text, code, w in rows:
        if len(text) == 1:
            char_freq[text] = max(char_freq.get(text, 0), w)

    chars, words = {}, {}
    for text, code, w in rows:
        c = clean(code)
        if len(c) != 2:
            continue
        if len(text) == 1:
            eff = char_freq.get(text, w)
            if c not in chars or eff > chars[c][1]:
                chars[c] = (text, eff)
        else:
            if c not in words or w > words[c][1]:
                words[c] = (text, w)
    both = {c: (chars[c][0], words[c][0]) for c in chars if c in words}
    return both, set(chars), set(words)


def load_via_lua():
    res = subprocess.run(["lua", str(DUMPER), str(DATA)],
                         capture_output=True, text=True, timeout=180)
    if res.returncode != 0:
        raise SystemExit(f"Lua 加载失败：\n{res.stderr[:2000]}")
    split2, u2, meta = {}, {}, {}
    for line in res.stdout.splitlines():
        f = line.split("\t")
        if f[0] == "s2":
            split2[f[1]] = (f[2], f[3])
        elif f[0] == "u2":
            u2[f[1]] = (f[2], int(f[3]))
        elif f[0] == "meta":
            meta = dict(zip(f[1::2], f[2::2]))
    return split2, u2, meta


def main():
    if not DATA.exists():
        print(f"FAIL 数据文件不存在：{DATA}")
        return 1

    rows = read_dict()
    exp_split, exp_chars, exp_words = expected_split2(rows)
    print(f"字典条目 {len(rows)}；2 码位有字的 {len(exp_chars)}、有词的 {len(exp_words)}")

    got_split, got_u2, _ = load_via_lua()

    print("\n[A] split2 覆盖「同时有字与词」的 2 码位")
    check("码位集合与字典一致", set(got_split) == set(exp_split),
          f"期望 {len(exp_split)} 实际 {len(got_split)}，"
          f"缺 {sorted(set(exp_split) - set(got_split))[:5]} "
          f"多 {sorted(set(got_split) - set(exp_split))[:5]}")

    print("\n[B] 两类首选逐条对账")
    bad_c = [c for c in exp_split if c in got_split and got_split[c][0] != exp_split[c][0]]
    bad_w = [c for c in exp_split if c in got_split and got_split[c][1] != exp_split[c][1]]
    check("主单首选 = 该位权重最高的单字", not bad_c, f"{len(bad_c)} 处不符，如 {bad_c[:3]}")
    check("主词首选 = 该位权重最高的词", not bad_w, f"{len(bad_w)} 处不符，如 {bad_w[:3]}")

    print("\n[C] 不该进 split2 的位置确实没进")
    only_one = exp_chars ^ exp_words  # 只有一类的位置
    leaked = [c for c in only_one if c in got_split]
    check("单一类别的位置不进 split2", not leaked, f"{len(leaked)} 处泄漏，如 {leaked[:3]}")

    print("\n[D] 两个视图都能覆盖全部 2 码位（含单一类别）")
    # 主单视图：split2 有则取 char，否则取 unit2 的首选
    missing_cf = [c for c in got_u2
                  if not (c in got_split or got_u2[c][0])]
    check("每个 2 码位在主单视图下都有上屏文本", not missing_cf,
          f"{len(missing_cf)} 处缺失，如 {missing_cf[:3]}")
    # 主词视图：split2 有则取 word，否则取 unit2 的首选
    check("每个 2 码位在主词视图下都有上屏文本", all(got_u2[c][0] for c in got_u2
                                            if c not in got_split),
          "存在空文本")

    print("\n[E] 次选直出的语义：另一类的首选")
    # 主单视图的次选 = 主词首选；主词视图的次选 = 主单首选。
    # 这是纯推演关系，验证 split2 的两列确实互为对方的次选。
    no_second = [c for c in got_split if got_split[c][0] == got_split[c][1]]
    check("次选与被选中的首选不相同（否则一键直出无意义）", not no_second,
          f"{len(no_second)} 处相同，如 {no_second[:3]}")

    print("\n[F] 文档记录了两视图与次选")
    body = DOC.read_text(encoding="utf-8") if DOC.exists() else ""
    check("文档存在", DOC.exists())
    check("文档说明主单/主词视图", "主单" in body and "主词" in body)
    check("文档说明次选键", "次选" in body)

    print()
    if FAILS:
        print(f"---- {len(FAILS)} 项失败 ----")
        for f in FAILS:
            print("  *", f)
        return 1
    print(f"---- 全部通过（{len(got_split)} 个双类 2 码位）----")
    return 0


if __name__ == "__main__":
    sys.exit(main())
