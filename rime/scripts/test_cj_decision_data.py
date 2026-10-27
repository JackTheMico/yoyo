#!/usr/bin/env python3
"""#52 串击判定数据的验收测试。

口径：与 yoyo-pure.dict.yaml 逐条对账，而不是与生成器自己对账。
数据文件由 gen_cj_decision_data.py 生成；本测试用真 Lua 解释器加载数据
（lua 5.5.1，与 librime-lua 的 liblua.so.5.5 同版本），因此同时验证：
  1. 生成的文件是合法 Lua；
  2. 加载后每张表的码位集合、条数、上屏文本与字典一致；
  3. 字频回填规则被正确执行；
  4. 体积与冷加载耗时在预算内。

运行：/usr/bin/python3 rime/scripts/test_cj_decision_data.py
"""

import pathlib
import random
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
DICT = ROOT / "rime/yoyo-pure.dict.yaml"
DATA = ROOT / "rime/lua/yoyo/data/cj_decision.lua"
DOC = ROOT / "docs/design/cj-decision-data.md"

BUDGET_BYTES = 4 * 1024 * 1024
BUDGET_MS = 300

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


def expected_tables(rows):
    """按票面规则从字典推出期望的三张表。"""
    # 字频 = 该字全部条目（含一简）的最大权重
    char_freq = {}
    for text, code, w in rows:
        if len(text) == 1:
            char_freq[text] = max(char_freq.get(text, 0), w)

    def effective(text, w):
        return char_freq.get(text, w) if len(text) == 1 else w

    unit2, char3, word4 = {}, {}, {}
    for text, code, w in rows:
        c = clean(code)
        if len(c) < 2 or len(c) > 4:
            continue
        eff = effective(text, w)
        tgt = {2: unit2, 3: char3, 4: word4}[len(c)]
        if c not in tgt or eff > tgt[c][1]:
            tgt[c] = (text, eff)
    return unit2, char3, word4


LUA_DUMPER = ROOT / "rime/scripts/dump_cj_decision.lua"


def load_via_lua():
    res = subprocess.run(
        ["lua", str(LUA_DUMPER), str(DATA)],
        capture_output=True, text=True, timeout=180,
    )
    if res.returncode != 0:
        raise SystemExit(f"Lua 加载失败：\n{res.stderr[:2000]}")
    u2, c3, w4, p3, st = {}, {}, {}, set(), set()
    load_ms = None
    for line in res.stdout.splitlines():
        f = line.split("\t")
        if f[0] == "u2":
            u2[f[1]] = (f[2], int(f[3]))
        elif f[0] == "c3":
            c3[f[1]] = (f[2], int(f[3]))
        elif f[0] == "w4":
            w4[f[1]] = f[2]
        elif f[0] == "p3":
            p3.add(f[1])
        elif f[0] == "st":
            st.add(f[1])
        elif f[0] == "meta":
            load_ms = float(f[2])
    return u2, c3, w4, p3, st, load_ms


def main():
    if not DATA.exists():
        print(f"FAIL 数据文件不存在：{DATA}")
        return 1

    rows = read_dict()
    print(f"字典条目 {len(rows)}")
    exp2, exp3, exp4 = expected_tables(rows)

    print("\n[A] Lua 可加载")
    got2, got3, got4, gotp3, got_st, load_ms = load_via_lua()
    check("文件是合法 Lua 且可 dofile", True)

    print("\n[B] 码位集合与条数对账")
    check("unit2 码位数一致", set(got2) == set(exp2),
          f"期望 {len(exp2)} 实际 {len(got2)}，"
          f"缺 {sorted(set(exp2) - set(got2))[:5]} 多 {sorted(set(got2) - set(exp2))[:5]}")
    check("char3 码位数一致", set(got3) == set(exp3),
          f"期望 {len(exp3)} 实际 {len(got3)}")
    check("word4 码位数一致", set(got4) == set(exp4),
          f"期望 {len(exp4)} 实际 {len(got4)}")

    print("\n[C] 上屏文本与权重逐条一致")
    diff_text = [c for c in exp2 if c in got2 and got2[c][0] != exp2[c][0]]
    check("unit2 文本全一致", not diff_text, f"{len(diff_text)} 处不符，如 {diff_text[:3]}")
    diff_text3 = [c for c in exp3 if c in got3 and got3[c][0] != exp3[c][0]]
    check("char3 文本全一致", not diff_text3, f"{len(diff_text3)} 处不符，如 {diff_text3[:3]}")
    diff_text4 = [c for c in exp4 if c in got4 and got4[c] != exp4[c][0]]
    check("word4 文本全一致", not diff_text4, f"{len(diff_text4)} 处不符，如 {diff_text4[:3]}")

    bad_w2 = [c for c in exp2 if c in got2 and got2[c][1] != exp2[c][1]]
    check("unit2 权重全一致（含回填）", not bad_w2, f"{len(bad_w2)} 处不符，如 {bad_w2[:3]}")
    bad_w3 = [c for c in exp3 if c in got3 and got3[c][1] != exp3[c][1]]
    check("char3 权重全一致（含回填）", not bad_w3, f"{len(bad_w3)} 处不符，如 {bad_w3[:3]}")

    print("\n[D] 抽样 200 条逐条复核")
    rnd = random.Random(52)
    sample = rnd.sample(sorted(exp4), 200)
    bad = [c for c in sample if got4.get(c) != exp4[c][0]]
    check("抽样 200 条 4 码词上屏文本一致", not bad, f"{len(bad)} 处不符，如 {bad[:3]}")

    print("\n[E] 字频回填真的生效了")
    # 找一个「有 2/3 码、且字频挂在别的条目上」的字，验证回填值 > 原条目权重
    char_freq = {}
    for text, code, w in rows:
        if len(text) == 1:
            char_freq[text] = max(char_freq.get(text, 0), w)
    raw3 = {}
    for text, code, w in rows:
        c = clean(code)
        if len(c) == 3 and len(text) == 1:
            raw3[c] = max(raw3.get(c, 0), w)
    backfilled = [c for c in raw3 if c in got3 and got3[c][1] > raw3[c]]
    check("存在被回填抬高的 3 码码位", len(backfilled) > 0,
          f"实际 {len(backfilled)} 个")
    if backfilled:
        c = backfilled[0]
        print(f"       例：3 码码位 {c} 原权重 {raw3[c]} → 回填后 {got3[c][1]}")
    sample_bf = rnd.sample(backfilled, min(50, len(backfilled)))
    bad_bf = []
    for c in sample_bf:
        # 回填后权重应等于该字字频
        text = got3[c][0]
        if got3[c][1] != char_freq[text]:
            bad_bf.append(c)
    check("抽样 50 个回填码位权重 = 该字字频", not bad_bf, f"{bad_bf[:3]}")

    print("\n[F] 前缀集合")
    exp_p3 = {c[:3] for c in exp4}
    check("prefix3 = 4 码词的 3 字前缀集合", gotp3 == exp_p3,
          f"期望 {len(exp_p3)} 实际 {len(gotp3)}")
    exp_start = {c[:1] for c in set(exp2) | set(exp3) | set(exp4)}
    check("start = 全部合法码的首码元集合", got_st == exp_start,
          f"期望 {len(exp_start)} 实际 {len(got_st)}，差 {sorted(exp_start ^ got_st)[:5]}")

    print("\n[G] 体积与冷加载耗时")
    size = DATA.stat().st_size
    print(f"       体积 {size / 1024 / 1024:.2f} MB / {size} 字节")
    print(f"       冷加载 {load_ms:.1f} ms（lua 5.5.1，与 librime-lua 同版本）")
    check(f"体积 ≤ {BUDGET_BYTES // 1024 // 1024} MB", size <= BUDGET_BYTES,
          f"实际 {size / 1024 / 1024:.2f} MB")
    check(f"冷加载 ≤ {BUDGET_MS} ms", load_ms is not None and load_ms <= BUDGET_MS,
          f"实际 {load_ms:.1f} ms")
    if size > BUDGET_BYTES or (load_ms or 0) > BUDGET_MS:
        print("       → 超预算，需按记录在案的裁剪方案处理")

    print("\n[H] 文档")
    check("数据说明文档已生成", DOC.exists())
    if DOC.exists():
        body = DOC.read_text(encoding="utf-8")
        check("文档记录了体积", "MB" in body)
        check("文档记录了加载耗时", "ms" in body)
        check("文档说明了权重尺度差异", "尺度" in body or "口径" in body)

    print()
    if FAILS:
        print(f"---- {len(FAILS)} 项失败 ----")
        for f in FAILS:
            print("  *", f)
        return 1
    print("---- 全部通过 ----")
    return 0


if __name__ == "__main__":
    sys.exit(main())
