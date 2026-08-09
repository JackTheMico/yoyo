#!/usr/bin/env python3
"""重排寒梅键位:让并击组合满足人体工程约束,并尽量少用三指按键。

背景
----
rime/yoyo.yaml 的「寒梅」段定义音形方案的并击指法:165 个槽
(15 声母键 × 11 码元 B–L),每个槽是一个 2/3 键的物理按键组合,
由 xform 规则把「按键组合 → 码元字母」映射出来。词库编码由
「声母键字母 + 码元字母」组成,因此**码元字母不变,词库零改动**,
重排只改 yoyo.yaml 寒梅段。

按键组合的允许范围(用户指定,2026-08 版)
----------------------------------------
2 键组合(两指或一指横压)放宽为两类:
  A. 任意两指组合:两个键分属不同手指,允许跨排(如 wc、wv、ae、
     ar、at、qg、ev;右手镜像 om、hp、mi 由镜像规则自动覆盖)
  B. 同列横压:同一根手指横压同一列相邻两排(qa ws ed rf tg
     az sx dc fv gb)
  禁止:同指但不同列/不相邻(如 qz、wx、ec、rt、fg 式)。
3 键组合仍保留原硬约束:
  1. 同指≤1(小指/无名/中指最多 1 键;食指最多 2 键)
  2. 禁「上+下」跨排(qwert 与 zxcvb 不同时出现)
  3. b 声母三指时食指只允许 b 自身
组合全局唯一、必含声母键。

优化目标
--------
最大化 2 键槽数量(最少化「三指」= 3 键槽):
  2 键池放宽后共 91 个组合,165 槽中最多 91 个可用 2 键,
  其余 74 个槽用 3 键。用带权匈牙利:2 键列成本 = 人体工程,
  虚拟列(3 键)成本 = 大惩罚,自动优先填满 2 键。
MANUAL 手动指定槽默认锁定(用户点名,不改动);`--free-manual` 时
全部 165 槽统一优化(手动指定也参与 2 键化)。

用法
----
python3 重排寒梅键位.py             # dry-run:打印修复明细 + 预览
python3 重排寒梅键位.py --free-manual   # dry-run:手动指定槽也参与优化
python3 重排寒梅键位.py --apply     # 备份 rime/yoyo.yaml 后改写
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
import time
from collections import Counter
from itertools import combinations, permutations
from pathlib import Path

HERE = Path(__file__).resolve().parent
RIME_ROOT = HERE.parent  # rime/
YOYO_YAML = RIME_ROOT / "yoyo.yaml"

# chord_composer alphabet 的左手键次序(与 practice_tool/generate_yx_data.py 一致)
ALPHABET = "123456qwertasdfgzxcvb 7890-=uiop[hjkl;ynm,./"
LEFT_KEYS = "qwertasdfgzxcvb"

# 手指归属:列 → 手指;食指两列(rfv / tgb)合并为同一根手指
FINGER = {}
for i, col in enumerate(("qaz", "wsx", "edc", "rfv", "tgb")):
    f = 4 if i >= 3 else i  # 食指统一编号 4
    for k in col:
        FINGER[k] = f

# 排归属:上=qwert、中=asdfg、下=zxcvb;列归属(直列键盘)
ROW = {}
COL = {}
for i, k in enumerate("qwert"):
    ROW[k], COL[k] = 0, i
for i, k in enumerate("asdfg"):
    ROW[k], COL[k] = 1, i
for i, k in enumerate("zxcvb"):
    ROW[k], COL[k] = 2, i

XIAO = set("qaz")      # 小指列
WUMING = set("wsx")    # 无名指列

# 同列横压:同一根手指横压同列相邻两排(用户点名允许)
SAME_COL = {"qa", "az", "ws", "sx", "ed", "dc", "rf", "fv", "tg", "gb"}

RULE_RE = re.compile(r"^\s+- xform\|([^|]+)\|([^|]+)\|")

# 用户点名的手动指定槽:槽 -> 强制组合(其余槽在排除这些组合后自动分配)
MANUAL: dict[tuple[str, str], str] = {
    ("a", "D"): "asf",  # 小指 a + 无名 s 同排顺势
    ("q", "K"): "qwr",  # 小指 q + 无名 w 同排顺势
    ("a", "L"): "asc",  # 小指 a + 无名 s 同排 + 中指 c
    ("z", "D"): "dzx",  # 就近:中指 d + 小指 z + 无名 x,不用食指
    ("z", "L"): "zxc",  # 就近 0 食指(挤 zB)
    ("q", "I"): "eqs",  # q+e+s 就近 0 食指(挤 sG)
    ("t", "I"): "etf",  # t+e+f 就近(挤 eH)
    ("b", "G"): "xb",   # b+x 无名指顺势按下(挤 bE)
    ("q", "L"): "qwd",  # q+w+d 小指+无名同排(挤 wG)
    ("q", "J"): "qwf",  # q+w+f 小指+无名同排(挤 fH)
    ("a", "G"): "asr",  # a+s+r 小指+无名同排(空闲,无挤占)
    ("b", "J"): "cb",   # free-manual 优化后:cb(2 键)
    ("b", "H"): "bdx",  # b+d+x 中指+无名(空闲)
    ("z", "K"): "fzx",  # free-manual 优化后:fzx
    ("e", "J"): "wef",  # e+w+f 无名参与(挤 fG)
    ("b", "I"): "eb",   # free-manual 优化后:eb(2 键)
    ("t", "D"): "qwt",  # free-manual 优化后:qwt
    ("d", "K"): "cd",   # dK 定点:用户指定 cd(同列横压,手动指定)
    ("s", "K"): "esg",  # sK 定点:用户指定 seg/esg(esg 为 chord 归一化序,原 eM 组合)
}


def is_2key_allowed(combo: str) -> bool:
    """2 键组合允许:两指(不同手指,任意排) 或 同列横压(同指同列相邻排)。"""
    if len(combo) != 2:
        return False
    a, b = combo
    if FINGER[a] != FINGER[b]:
        return True
    return COL[a] == COL[b] and abs(ROW[a] - ROW[b]) == 1


def pool_2key(exclude: set[str] | None = None) -> list[str]:
    """全部允许的 2 键组合(norm 序)。"""
    exclude = exclude or set()
    out = []
    for a, b in combinations(LEFT_KEYS, 2):
        c = norm_keys(a + b)
        if is_2key_allowed(c) and c not in exclude:
            out.append(c)
    return out


def same_finger(combo: str) -> bool:
    """同指双键(硬):小指/无名/中指 ≤1;食指允许 ≤2(跨度约束控制)。"""
    fc = Counter(FINGER[k] for k in combo)
    for f, v in fc.items():
        lim = 2 if f == 4 else 1  # 食指(4)放宽到 2
        if v > lim:
            return True
    return False


def hard_violate(combo: str) -> bool:
    """3 键硬约束违例 = 同指双键(按食指≤2) 或 上+下跨排。"""
    if same_finger(combo):
        return True
    rows = {ROW[k] for k in combo}
    return 0 in rows and 2 in rows


def norm_keys(keys: str) -> str:
    return "".join(sorted(keys, key=ALPHABET.index))


def perm_of(base: str, variant: str) -> list[int]:
    return [base.index(ch) for ch in variant]


def rule_src(combo: str, perm: list[int] | None = None) -> str:
    if perm is None:
        ordered = combo
    else:
        ordered = "".join(combo[p] for p in perm)
    return "".join(ch + "A" for ch in ordered)


def classify(line: str) -> tuple[str, tuple[str, str] | None, str | None]:
    m = RULE_RE.match(line)
    if not m:
        return "keep", None, None
    src, dst = m.group(1), m.group(2)
    keys = re.sub(r"[A-Z]", "", src)
    if (
        len(keys) >= 2
        and len(dst) == 2
        and dst[0].islower()
        and dst[1].isupper()
    ):
        return "bm", (dst[0], dst[1]), keys
    return "keep", None, None


def parse_section(lines: list[str]) -> tuple[int, list[str]]:
    start = next(i for i, l in enumerate(lines) if l.startswith("寒梅:"))
    return start, lines[start:]


def build_slots(body: list[str]) -> dict:
    slots = {}
    for idx, line in enumerate(body):
        kind, slot, keys = classify(line)
        if kind != "bm":
            continue
        s = slots.setdefault(slot, {"base": None, "variants": [], "lines": []})
        s["variants"].append(keys)
        s["lines"].append(idx)
    for s in slots.values():
        s["base"] = norm_keys(s["variants"][0])
    return slots


def candidates(shengmu: str, n: int) -> list[str]:
    """含声母键、同键数、符合约束的组合。

    n=2:两指或同列横压(is_2key_allowed);
    n=3:同指规则(小指/无名/中指≤1,食指≤2),b 声母三指时食指只 1 个(仅 b 自身)。
    """
    others = [k for k in LEFT_KEYS if k != shengmu]
    out = []
    for extra in combinations(others, n - 1):
        combo = norm_keys(shengmu + "".join(extra))
        if n == 2:
            if not is_2key_allowed(combo):
                continue
        elif same_finger(combo):
            continue
        if shengmu == "b" and n == 3:
            index_keys = [k for k in combo if FINGER[k] == 4]
            if len(index_keys) != 1:   # 食指只能 b 一个
                continue
        out.append(combo)
    return out


def soft_cost2(slot: tuple[str, str], combo: str, old_base: str) -> float:
    """2 键软成本:同列横压最优;小指-无名同排偏好;跨度;a 偏好;少用食指。"""
    c = 0.0
    if combo in SAME_COL:            # 同列横压:1 指,最优
        c -= 2
    xiao = [k for k in combo if k in XIAO]
    wuming = [k for k in combo if k in WUMING]
    if xiao and wuming:
        if any(ROW[k] != ROW[x] for k in wuming for x in xiao):
            c += 4                      # 小指+无名跨排
        else:
            c -= 1                      # 小指+无名同排:无名指顺势按下(偏好)
    elif xiao:
        c += 2                          # 小指按下时无名指难抬起,缺无名偏好
    if combo != old_base:            # 换组合
        c += 1
    span = max(COL[k] for k in combo) - min(COL[k] for k in combo) + (
        max(ROW[k] for k in combo) - min(ROW[k] for k in combo)
    )
    if span > 3:                     # 跨度惩罚(≤3 免费,超 3 每单位 2)
        c += (span - 3) * 2
    if slot[0] == "a":               # a 声母偏好上两排
        c += sum(1 for k in combo if ROW[k] == 2)
    # 少用食指:声母键之外的食指辅助键尽量少(就近按下,不刻意用食指)
    extra_index = sum(1 for k in combo if FINGER[k] == 4 and k != slot[0])
    c += extra_index * 2
    return c


def soft_cost(slot: tuple[str, str], combo: str, old_base: str) -> float:
    """3 键软成本:破例(上+下)=100,小指-无名跨排=5,换组合=1,跨度/a偏好≈1。"""
    c = 0.0
    rows = {ROW[k] for k in combo}
    if 0 in rows and 2 in rows:          # 「上+下」破例
        c += 100
    xiao = [k for k in combo if k in XIAO]
    wuming = [k for k in combo if k in WUMING]
    if xiao and wuming:
        if any(ROW[k] != ROW[x] for k in wuming for x in xiao):
            c += 4                          # 小指+无名跨排
        else:
            c -= 1                          # 小指+无名同排:无名指顺势按下(偏好)
    elif xiao:
        c += 2                              # 小指按下时无名指难抬起,缺无名偏好
    if combo != old_base:                # 换组合
        c += 1
    span = max(COL[k] for k in combo) - min(COL[k] for k in combo) + (
        max(ROW[k] for k in combo) - min(ROW[k] for k in combo)
    )
    if span > 3:                         # 跨度惩罚(≤3 免费,超 3 每单位 2)
        c += (span - 3) * 2
    if slot[0] == "a":                   # a 声母偏好上两排
        c += sum(1 for k in combo if ROW[k] == 2)
    if slot[0] == "b" and len(combo) == 3:  # b 列三指:另两键偏好中指+无名,靠食指
        others = [k for k in combo if k != "b"]
        if {FINGER[k] for k in others} == {1, 2}:  # 无名+中指
            c -= 2
        elif any(k in XIAO for k in others):        # 含小指远离 b
            c += 2
    # 少用食指:声母键之外的食指辅助键尽量少(就近按下,不刻意用食指)
    extra_index = sum(1 for k in combo if FINGER[k] == 4 and k != slot[0])
    c += extra_index * 2
    return c


def hungarian(cost: list[list[float]]) -> tuple[float, list[int]]:
    """经典匈牙利算法(最小化指派)。cost: n×n。返回 (总成本, 行→列指派)。"""
    n = len(cost)
    u = [0.0] * (n + 1)
    v = [0.0] * (n + 1)
    p = [0] * (n + 1)
    way = [0] * (n + 1)
    for i in range(1, n + 1):
        p[0] = i
        j0 = 0
        minv = [float("inf")] * (n + 1)
        used = [False] * (n + 1)
        while True:
            used[j0] = True
            i0 = p[j0]
            delta = float("inf")
            j1 = 0
            for j in range(1, n + 1):
                if not used[j]:
                    cur = cost[i0 - 1][j - 1] - u[i0] - v[j]
                    if cur < minv[j]:
                        minv[j] = cur
                        way[j] = j0
                    if minv[j] < delta:
                        delta = minv[j]
                        j1 = j
            for j in range(n + 1):
                if used[j]:
                    u[p[j]] += delta
                    v[j] -= delta
                else:
                    minv[j] -= delta
            j0 = j1
            if p[j0] == 0:
                break
        while True:
            j1 = way[j0]
            p[j0] = p[j1]
            j0 = j1
            if j0 == 0:
                break
    assign = [-1] * n
    for j in range(1, n + 1):
        if p[j] > 0:
            assign[p[j] - 1] = j - 1
    total = sum(cost[i][assign[i]] for i in range(n) if assign[i] >= 0)
    return total, assign


def assign_2key_maximize(
    free: list[tuple[str, str]], pool2: list[str], old_map: dict
) -> tuple[dict[tuple[str, str], str], list[tuple[str, str]]]:
    """最大化 2 键槽:行=自由槽,列=2 键组合+虚拟列(3 键,BIG 惩罚)。

    匈牙利完美匹配:2 键列成本=soft_cost2(不可达=INF,自动剔除落空列),
    虚拟列成本=大惩罚 → 优先填满 2 键。返回 (got2, rest 槽列表)。
    """
    n = len(free)
    INF = 1e9
    BIG = 1000.0     # 原 3 键槽 → 虚拟列(保持 3 键,可接受)
    BIG2 = 1e6       # 原 2 键槽 → 虚拟列(2 键退化为 3 键,尽量禁止)
    p2 = list(pool2)
    while True:
        N = max(n, len(p2))
        cost = [[INF] * N for _ in range(N)]
        for i, (sm, _mf) in enumerate(free):
            is2 = len(old_map[free[i]]) == 2
            for j, c in enumerate(p2):
                if sm in c:
                    cost[i][j] = soft_cost2(free[i], c, old_map[free[i]])
            for j in range(len(p2), N):
                cost[i][j] = BIG2 if is2 else BIG   # 虚拟列 = 3 键
        # 剔除完全不可达的 2 键列(落空,该组合弃用)
        bad = [j for j in range(len(p2)) if all(cost[i][j] >= INF for i in range(n))]
        if not bad:
            break
        for j in sorted(bad, reverse=True):
            p2.pop(j)
    N = max(n, len(p2))
    cost = [[BIG] * N for _ in range(N)]
    for i, (sm, _mf) in enumerate(free):
        is2 = len(old_map[free[i]]) == 2
        for j, c in enumerate(p2):
            if sm in c:
                cost[i][j] = soft_cost2(free[i], c, old_map[free[i]])
        for j in range(len(p2), N):
            cost[i][j] = BIG2 if is2 else BIG
    total, assign = hungarian(cost)
    assert total < 1e8, "2 键分配出现不可达匹配,需人工处理"
    got2, rest = {}, []
    for i, s in enumerate(free):
        j = assign[i]
        if j < len(p2):
            got2[s] = p2[j]
        else:
            rest.append(s)
    return got2, rest


def assign_group(
    group: list[tuple[tuple[str, str], dict]], n: int, reserved: set[str] | None = None
) -> dict[tuple[str, str], str]:
    """对一组同键数槽做带权匈牙利分配,返回 {slot: 新组合}。reserved=已被占用的组合。"""
    reserved = reserved or set()
    pool = sorted({c for _s, info in group for c in candidates(_s[0], n) if c not in reserved})
    if len(pool) < len(group):
        raise SystemExit(f"该键数分组候选不足({len(pool)}<{len(group)}),需人工处理")
    pidx = {c: i for i, c in enumerate(pool)}
    n_, m = len(group), len(pool)
    N = max(n_, m)
    INF = 10**6
    cost = [[INF] * N for _ in range(N)]
    for i, (s, info) in enumerate(group):
        old_base = info["base"]
        for c in candidates(s[0], n):
            if c in reserved:
                continue
            cost[i][pidx[c]] = soft_cost(s, c, old_base)
    for i in range(n_, N):
        cost[i] = [0.0] * N
    total, assign = hungarian(cost)
    if total >= INF:
        raise SystemExit("该键数分组无法全部分配,需人工处理")
    return {s: pool[assign[i]] for i, (s, _info) in enumerate(group)}


def right_perm(combo: str) -> str:
    """右手输入 combo 的镜像,按右手 alphabet 归一化后再镜像回左手——即 Rime 实际
    右手路径产生的左手排列(与左手 alphabet 归一化不同,需单独补规则)。"""
    right = "".join(MIR_FWD[k] for k in combo)
    nr = "".join(sorted(right, key=ALPHABET.index))
    return "".join(MIR_BWD[ch] for ch in nr)


MIR_FWD = dict(zip("qwertasdfgzxcvb", "poiuy;lkjh/.,mn"))
MIR_BWD = dict(zip("poiuy;lkjh/.,mn", "qwertasdfgzxcvb"))


def row3_ok(combo: str) -> bool:
    """3 键组合禁止「同排三键且跨度≥4」(单排横跨过远,如 qet/adg/zcb)。"""
    if len(combo) != 3:
        return True
    rows = {ROW[k] for k in combo}
    if len(rows) != 1:
        return True
    return (max(COL[k] for k in combo) - min(COL[k] for k in combo)) < 4


def rebuild(body: list[str], slots: dict) -> tuple[list[str], dict, dict]:
    """重建寒梅段行列表。返回 (新行列表, 修复明细, 统计信息)。

    ① MANUAL 槽锁定;② 自由槽最大化 2 键(匈牙利);③ 剩余槽 3 键分配。
    """
    # ---- 第一步:MANUAL 槽锁定值 ----
    locked: dict[tuple[str, str], str] = {}
    for (sm, mf), combo in MANUAL.items():
        locked[(sm, mf)] = norm_keys(combo)

    # ---- 第二步:自由槽最大化 2 键 ----
    free = [s for s in slots if s not in MANUAL]
    old_map = {s: info["base"] for s, info in slots.items()}
    used2 = {c for c in locked.values() if len(c) == 2}
    pool2 = pool_2key(used2)
    got2, rest = assign_2key_maximize(free, pool2, old_map)

    # ---- 第三步:剩余槽 3 键分配 ----
    used3 = {c for c in locked.values() if len(c) == 3}
    group3 = [(s, slots[s]) for s in rest]
    got3 = assign_group(group3, 3, used3) if group3 else {}

    full = dict(locked)
    full.update(got2)
    full.update(got3)

    # ---- 第四步:生成规则行,重建 B-M 区(3 键在前、2 键在后) ----
    # 顺序必须保证「长规则在前、短规则在后」:2 键规则(如 rAaA)若混入
    # 3 键区会截断 3 键规则(如 rAaAsA),导致码元打不出来。
    all_lines = [li for info in slots.values() for li in info["lines"]]
    bm_start, bm_end = min(all_lines), max(all_lines)
    fixes = {}
    stats = {
        "破例(上+下)": [],
        "小指-无名跨排": [],
        "a列下排键": [],
        "跨度>3": [],
        "3键槽": [],
        "2→3": [],
        "3→2": [],
    }
    zone3, zone2 = [], []
    for (sm, mf), info in slots.items():
        new_base = full[(sm, mf)]
        old_base = info["base"]  # yoyo.yaml 原始组合(规则行基准)
        rows = {ROW[k] for k in new_base}
        if 0 in rows and 2 in rows and len(new_base) == 3:
            stats["破例(上+下)"].append(sm + mf)
        xiao = [k for k in new_base if k in XIAO]
        wuming = [k for k in new_base if k in WUMING]
        if xiao and wuming and any(ROW[k] != ROW[x] for k in wuming for x in xiao):
            stats["小指-无名跨排"].append(sm + mf)
        span = max(COL[k] for k in new_base) - min(COL[k] for k in new_base) + (
            max(ROW[k] for k in new_base) - min(ROW[k] for k in new_base)
        )
        if span > 3:
            stats["跨度>3"].append(f"{sm+mf}({new_base},span{span})")
        if sm == "a":
            stats["a列下排键"].append(sum(1 for k in new_base if ROW[k] == 2))
        if len(new_base) == 3:
            stats["3键槽"].append(sm + mf)
        if len(old_base) == 2 and len(new_base) == 3:
            stats["2→3"].append(sm + mf)
        if len(old_base) == 3 and len(new_base) == 2:
            stats["3→2"].append(sm + mf)

        # 规则排列:现有变体(按原排列模式)+ 右手归一化排列(缺失则补);
        # 键数变化时用新组合全排列
        if len(new_base) == len(old_base):
            perms = [perm_of(old_base, v) for v in info["variants"]]
        else:
            perms = [list(p) for p in permutations(range(len(new_base)))]
        existing = {"".join(new_base[i] for i in p) for p in perms}
        rp = right_perm(new_base)
        if rp not in existing:
            perms.append(perm_of(new_base, rp))
        dst = sm + mf
        lines = [f"    - xform|{rule_src(new_base, p)}|{dst}|\n" for p in perms]
        (zone3 if len(new_base) == 3 else zone2).extend(lines)
        if new_base != old_base:
            fixes[(sm, mf)] = (old_base, new_base)

    new_body = body[:bm_start] + zone3 + zone2 + body[bm_end + 1 :]
    return new_body, fixes, stats


def verify(body: list[str], fixes: dict) -> None:
    """内置校验:结构、约束、唯一、覆盖。"""
    slots = build_slots(body)
    assert len(slots) == 165, f"槽数 {len(slots)} != 165"
    # 每个槽的所有规则行键数必须一致(防止键数变化后残留旧规则行)
    for (sm, mf), s in slots.items():
        combos = {norm_keys(v) for v in s["variants"]}
        assert len(combos) == 1, f"{sm}{mf} 残留键数不一的规则行: {combos}"
    # 约束:2 键 ∈ 两指∪同列横压;3 键同指≤1 且禁上+下;b 三指食指唯一
    for (sm, mf), s in slots.items():
        if (sm, mf) in MANUAL:
            continue
        combo = s["base"]
        if len(combo) == 2:
            assert is_2key_allowed(combo), f"2 键违例: {sm}{mf}={combo}"
            assert sm in combo, f"缺声母键: {sm}{mf}={combo}"
        else:
            assert not same_finger(combo), f"同指违例: {sm}{mf}={combo}"
            rows = {ROW[k] for k in combo}
            assert not (0 in rows and 2 in rows), f"上+下违例: {sm}{mf}={combo}"
            if sm == "b":
                idx = [k for k in combo if FINGER[k] == 4]
                assert len(idx) == 1, f"b 三指食指违例: {sm}{mf}={combo}"
            assert sm in combo, f"缺声母键: {sm}{mf}={combo}"
    # 全部槽组合全局唯一
    seen: set[str] = set()
    for (_sm, _mf), s in slots.items():
        assert s["base"] not in seen, f"组合重复: {s['base']}"
        seen.add(s["base"])
    # 码元字母与声母键集合不变
    assert {s for s, _ in slots} == set(LEFT_KEYS)
    assert {m for _, m in slots} == set("BCDEFGHIJKL")
    # 修复明细:新旧不同、约束不违例(MANUAL 手动指定槽允许例外)
    for (sm, mf), (old, new) in fixes.items():
        assert old != new
        if (sm, mf) not in MANUAL:
            if len(new) == 2:
                assert is_2key_allowed(new)
            else:
                assert not same_finger(new)
                rows = {ROW[k] for k in new}
                assert not (0 in rows and 2 in rows)
        assert sm in new
    # 全量可达性:枚举左手组合模拟 xform 规则链,165 码元必须全部能打出
    # (防止 2 键规则混入 3 键区截断长规则等顺序问题)
    rules = []
    for line in body:
        item = line.strip()
        if item.startswith("- xform|"):
            parts = item[len("- xform|"):].split("|")
            if len(parts) >= 2:
                rules.append((parts[0], parts[1]))
    reach = set()
    for size in range(1, 6):
        for combo in combinations(LEFT_KEYS, size):
            c = norm_keys("".join(combo))
            for pat, repl in rules:
                c = re.sub(pat, repl, c)
            if re.match(r"^[a-z][B-M]$", c):
                reach.add(c)
    missing = {a + b for a in LEFT_KEYS for b in "BCDEFGHIJKL"} - reach
    assert not missing, f"打不出的码元: {sorted(missing)}"


def print_report(fixes: dict, stats: dict) -> None:
    n2 = 165 - len(stats["3键槽"])
    print(f"修复槽数: {len(fixes)}")
    print(f"2键槽: {n2} 个(3→2 减少 {len(stats['3→2'])} 个;2→3 增加 {len(stats['2→3'])} 个)")
    three = stats["3键槽"]
    print(f"三指槽(3键): {len(three)} 个" + (" " + " ".join(three) if three else ""))
    for key in ("破例(上+下)", "小指-无名跨排"):
        v = stats[key]
        print(f"{key}: {len(v)} 个{' ' + ' '.join(v) if v else ''}")
    span = stats["跨度>3"]
    print(f"跨度>3: {len(span)} 个{' ' + ' '.join(span[:10]) if span else ''}")
    a_down = stats["a列下排键"]
    if a_down:
        print(f"a 声母含下排键的槽: {len(a_down)} 个, 下排键总数 {sum(a_down)}")
    print()
    print(f"{'槽':<6}{'旧组合':<10}{'新组合':<10}{'共用':<4}变化")
    for slot in sorted(fixes, key=lambda x: (x[0], x[1])):
        old, new = fixes[slot]
        common = len(set(old) & set(new))
        removed = "".join(k for k in old if k not in new)
        added = "".join(k for k in new if k not in old)
        rows = {ROW[k] for k in new}
        mark = " ←上+下破例" if (0 in rows and 2 in rows and len(new) == 3) else ""
        mark += " [3→2]" if len(old) == 3 and len(new) == 2 else ""
        mark += " [2→3]" if len(old) == 2 and len(new) == 3 else ""
        print(f"{slot[0] + slot[1]:<6}{old:<10}{new:<10}{common:<4}{removed}→{added}{mark}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--free-manual", action="store_true",
                    help="手动指定槽也参与优化(默认保留 MANUAL 锁定)")
    ap.add_argument("--apply", action="store_true", help="备份后改写 rime/yoyo.yaml")
    args = ap.parse_args()

    if args.free_manual:
        MANUAL.clear()

    text = YOYO_YAML.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    start, body = parse_section(lines)
    slots = build_slots(body)
    new_body, fixes, stats = rebuild(body, slots)
    verify(new_body, fixes)
    print_report(fixes, stats)

    full = "".join(lines[:start] + new_body)
    if args.apply:
        bak = YOYO_YAML.with_name(f"yoyo.yaml.bak-{time.strftime('%Y%m%d-%H%M%S')}")
        shutil.copy2(YOYO_YAML, bak)
        YOYO_YAML.write_text(full, encoding="utf-8")
        print(f"\n已备份 {bak.name} 并改写 {YOYO_YAML}")
    else:
        preview = YOYO_YAML.with_name("yoyo.yaml.寒梅重排预览")
        preview.write_text(full, encoding="utf-8")
        print(f"\n预览全文已写入 {preview.name}(未改动 yoyo.yaml)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
