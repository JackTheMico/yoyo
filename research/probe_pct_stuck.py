from __future__ import annotations

import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RIME = ROOT / "rime"
USER = RIME / "yoyo-user.dict.yaml"
PURE = RIME / "yoyo-pure.dict.yaml"
CHAR_FREQ = RIME / "yoyo-yx-char.dict.yaml"
LUA = RIME / "lua" / "yoyo" / "data" / "pure_dict_map.lua"

DAU = sorted(set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") | set(";:,<.>/?"))


def is_cjk(c):
    return "\u4e00" <= c <= "\u9fff"


def net_len(c):
    return len(c.replace("_", "").replace("+", "").replace("'", ""))


def rows(path):
    started = False
    for line in path.read_text(encoding="utf-8").splitlines():
        if not started:
            if line.strip() == "...":
                started = True
            continue
        if not line or line.startswith("#"):
            continue
        p = line.split("\t")
        if len(p) >= 2:
            yield p[0], p[1], (int(p[2]) if len(p) > 2 and p[2].isdigit() else 0)


# % 码出自哪个词典
for name, path in (("yoyo-pure", PURE), ("yoyo-user", USER)):
    n = sum(1 for t, c, w in rows(path) if c.startswith("%"))
    print(f"{name} 中 % 码条目: {n}")
print()

# 目标 15 字与其 % 位占用者
space: dict[str, tuple[str, int]] = {}
for t, c, w in rows(USER):
    if c.startswith("%"):
        space[c] = (t, w)

char1, char2, char3 = {}, {}, {}
for t, c, w in rows(PURE):
    if c.startswith("%") or len(t) != 1 or not is_cjk(t):
        continue
    n = net_len(c)
    if n == 1:
        char1.setdefault(t, c)
    elif n == 2:
        char2.setdefault(t, c)
    elif n == 3:
        char3.setdefault(t, c)

freq = {}
started = False
for line in CHAR_FREQ.read_text(encoding="utf-8").splitlines():
    if not started:
        if line.strip() == "...":
            started = True
        continue
    p = line.split("\t")
    if len(p) >= 3 and len(p[0]) == 1 and is_cjk(p[0]) and p[2].isdigit():
        freq[p[0]] = max(freq.get(p[0], 0), int(p[2]))

top = [c for c, _ in sorted(freq.items(), key=lambda kv: -kv[1])[:1500]]
short = set(char1) | set(char2)
losers = [c for c in top if c not in short]

RULES = {
    "前两根": lambda c: c[0] + c[1],
    "次+首": lambda c: c[1] + c[0],
    "首+末": lambda c: c[0] + c[2],
    "末+首": lambda c: c[2] + c[0],
    "次+末": lambda c: c[1] + c[2],
    "末+次": lambda c: c[2] + c[1],
}

taken = set(space)
stuck = []
served = {}
for ch in losers:
    c3 = char3.get(ch)
    if not c3:
        continue
    for name, fn in RULES.items():
        cand = "%" + fn(c3)
        if cand not in taken:
            served[ch] = (name, cand)
            taken.add(cand)
            break
    else:
        stuck.append(ch)

print(f"可用 % 位补上: {len(served)}，卡住: {len(stuck)} → {''.join(stuck)}")
print()
print("卡住各字的 6 个 % 候选位占用情况（词/词频）：")
for ch in stuck:
    c3 = char3[ch]
    print(f"  {ch} 全码={c3} 字频={freq[ch]:,}")
    for name, fn in RULES.items():
        cand = "%" + fn(c3)
        occ = space.get(cand)
        print(f"      {name} {cand:<4} → "
              + (f"被 {occ[0]} 占（词频={occ[1]:,}）" if occ else "空"))
