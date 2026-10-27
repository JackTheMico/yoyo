#!/usr/bin/env python3
"""#56 快捷字条字表的验收测试。

背景：串击版取消了编码层的「一简」（一击出高频字），这是硬约束下的必然
（60 码元占满单键、2 码组合被 2 码字占 97%）。补偿通道是把最高频的若干字
放在键盘上方的可点字条里，点一下直出——不占编码空间，也就零冲突。

口径：字频与判定数据同源同法——**该字全部条目（含一简）权重的最大值**。
码取该字最短的可打码，且必须真的能在判定数据里查到（否则字条点了打不出）。

运行：/usr/bin/python3 rime/scripts/test_cj_quickbar.py
"""

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
DICT = ROOT / "rime/yoyo-pure.dict.yaml"
DECISION = ROOT / "rime/lua/yoyo/data/cj_decision.lua"
QUICKBAR = ROOT / "rime/lua/yoyo/data/cj_quickbar.lua"
DOC = ROOT / "docs/design/cj-quickbar.md"
SLOTS = 12

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


def expected_quickbar(rows):
    """按票面口径推出期望的 12 条：字频降序，码取最短可打码。"""
    freq = {}
    for text, code, w in rows:
        if len(text) == 1:
            freq[text] = max(freq.get(text, 0), w)

    # 每个字的最短可打码（只收净码长 2/3 的码，与判定数据同口径）
    codes = {}
    for text, code, w in rows:
        c = clean(code)
        if len(text) != 1 or len(c) not in (2, 3):
            continue
        if text not in codes or len(c) < len(codes[text]):
            codes[text] = c

    cand = [(ch, codes[ch], freq[ch]) for ch in codes if freq.get(ch, 0) > 0]
    cand.sort(key=lambda x: (-x[2], x[0]))
    return cand[:SLOTS]


def load_quickbar():
    script = (
        'local M = dofile(arg[1])\n'
        'for i, s in ipairs(M.slots) do\n'
        '  io.write(string.format("s\\t%d\\t%s\\t%s\\t%s\\t%d\\n", '
        'i, s.key, s.char, s.code, s.freq))\n'
        'end\n'
    )
    path = ROOT / ".workbuddy/tmp/_dump_quickbar.lua"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(script, encoding="utf-8")
    res = subprocess.run(["lua", str(path), str(QUICKBAR)],
                         capture_output=True, text=True, timeout=60)
    if res.returncode != 0:
        raise SystemExit(f"Lua 加载失败：\n{res.stderr[:2000]}")
    slots = []
    for line in res.stdout.splitlines():
        f = line.split("\t")
        if f[0] == "s":
            slots.append({"idx": int(f[1]), "key": f[2], "char": f[3],
                          "code": f[4], "freq": int(f[5])})
    return slots


def load_decision_codes():
    """用同一套 Lua 加载判定数据，校验字条里的码真的可打。"""
    script = (
        'local M = dofile(arg[1])\n'
        'for c in pairs(M.unit2) do io.write("u2\\t", c, "\\n") end\n'
        'for c in pairs(M.char3) do io.write("c3\\t", c, "\\n") end\n'
    )
    path = ROOT / ".workbuddy/tmp/_dump_codes.lua"
    path.write_text(script, encoding="utf-8")
    res = subprocess.run(["lua", str(path), str(DECISION)],
                         capture_output=True, text=True, timeout=180)
    u2, c3 = set(), set()
    for line in res.stdout.splitlines():
        f = line.split("\t")
        if f[0] == "u2":
            u2.add(f[1])
        elif f[0] == "c3":
            c3.add(f[1])
    return u2, c3


def main():
    if not QUICKBAR.exists():
        print(f"FAIL 数据文件不存在：{QUICKBAR}")
        return 1

    rows = read_dict()
    exp = expected_quickbar(rows)
    got = load_quickbar()

    print("\n[A] 条数与顺序")
    check(f"恰好 {SLOTS} 条", len(got) == SLOTS, f"实际 {len(got)}")
    exp_chars = [c for c, _, _ in exp]
    got_chars = [s["char"] for s in got]
    check("字与字频降序一致", got_chars == exp_chars,
          f"期望 {exp_chars} 实际 {got_chars}")
    freqs = [s["freq"] for s in got]
    check("频次单调不增", all(a >= b for a, b in zip(freqs, freqs[1:])), str(freqs))

    print("\n[B] 频次与字典同口径")
    freq = {}
    for text, code, w in rows:
        if len(text) == 1:
            freq[text] = max(freq.get(text, 0), w)
    bad = [s["char"] for s in got if s["freq"] != freq.get(s["char"])]
    check("每条的频次 = 该字全部条目最大权重", not bad, f"{bad[:3]}")

    print("\n[C] 每个字都能在字典里查到")
    dict_chars = {t for t, _, _ in rows if len(t) == 1}
    missing = [s["char"] for s in got if s["char"] not in dict_chars]
    check("12 个字全在 yoyo-pure.dict.yaml 内", not missing, f"缺 {missing}")

    print("\n[D] 字条里的码真的可打（在判定数据中）")
    u2, c3 = load_decision_codes()
    unreachable = [s["char"] for s in got
                   if s["code"] not in u2 and s["code"] not in c3]
    check("每条的码都在 unit2/char3 中", not unreachable, f"不可打 {unreachable}")

    print("\n[E] 键值与上屏字一一对应")
    keys = [s["key"] for s in got]
    check("键值互不相同", len(set(keys)) == len(keys), str(keys))
    check("上屏字互不相同", len(set(got_chars)) == len(got_chars), str(got_chars))
    check("每条都有非空 text 可送（char 非空）", all(s["char"] for s in got))

    print("\n[F] 文档")
    check("字表文档已生成", DOC.exists())
    if DOC.exists():
        body = DOC.read_text(encoding="utf-8")
        check("文档含全部 12 字", all(s["char"] in body for s in got))
        check("文档写明与一简的关系", "一简" in body)

    print()
    if FAILS:
        print(f"---- {len(FAILS)} 项失败 ----")
        for f in FAILS:
            print("  *", f)
        return 1
    print(f"---- 全部通过（{SLOTS} 字）----")
    return 0


if __name__ == "__main__":
    sys.exit(main())
