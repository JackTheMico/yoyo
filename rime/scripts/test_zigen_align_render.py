#!/usr/bin/env python3
"""渲染规则测试（test_zigen_align_render.py）

用法：python3 test_zigen_align_render.py

只测 gen_zigen_align.render 这一条规则：把全码逐字母分配给字根。
期望值全部来自 README 的取码规则与已发布码表的真实样例，不由被测函数推导。

为什么这条规则要单独测：它带一条硬约束——分配必须覆盖全码每个字母，否则整字不写表项。
样本数据里恰好每个字都满足约束，所以端到端测试（Lua 侧的字母数不变量）碰不到守卫失效的
情形；守卫被删掉也不会有人发现。这里直接喂不满足的数据进去。
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from gen_zigen_align import render  # noqa: E402

# 真实字根码（取自 form.mapping）
CODES = {
    "鹿": "Al",
    "禾": "xh",
    "口": "bk",
    "白": "db",
    "勹": ".k",
    "4": "Od",
    "日": "wr",
    "疋": "Cs",
}

passed, failed = 0, 0


def check(name: str, cond: bool, detail: str = "") -> None:
    global passed, failed
    if cond:
        passed += 1
    else:
        failed += 1
        print(f"FAIL  {name}" + (f"  ← {detail}" if detail else ""))


# 单根字：一根独占两码
check("单根 鹿Al", render("Al", ["鹿"], CODES) == [("鹿", "Al")], str(render("Al", ["鹿"], CODES)))

# 双字根字：首根取大码，次根占两码
check(
    "双根 禾x·口bk",
    render("xbk", ["禾", "口"], CODES) == [("禾", "x"), ("口", "bk")],
    str(render("xbk", ["禾", "口"], CODES)),
)

# 多字根字：首/次/末各取大码，中间根不参与
check(
    "多根 白d·勹.·丶O",
    render("d.O", ["白", "勹", "4"], CODES) == [("白", "d"), ("勹", "."), ("4", "O")],
    str(render("d.O", ["白", "勹", "4"], CODES)),
)

# 双根但次根不是末根：疋 的小码是 s，全码 wCs 要求次根占两码
check(
    "双根 日w·疋Cs",
    render("wCs", ["日", "疋"], CODES) == [("日", "w"), ("疋", "Cs")],
    str(render("wCs", ["日", "疋"], CODES)),
)

# ── 硬约束：覆盖不全一律不给结果 ──
# 单根字但全码不是该根的双码（旧实现会把 Al 渲染成 鹿A，静默吞掉一个字母）
check("单根但全码对不上 → None", render("Ax", ["鹿"], CODES) is None, str(render("Ax", ["鹿"], CODES)))
check("单根但全码只有一码 → None", render("A", ["鹿"], CODES) is None, str(render("A", ["鹿"], CODES)))

# 根序列推出来的字母比全码长/短，都不接受
check("双根字母数与全码不符 → None", render("xb", ["禾", "口"], CODES) is None, str(render("xb", ["禾", "口"], CODES)))
check("多根字母数与全码不符 → None", render("d.", ["白", "勹", "4"], CODES) is None, str(render("d.", ["白", "勹", "4"], CODES)))

# 全码字母顺序与根序不符（首根大码不是全码首字母）
check("首根大码不符 → None", render("xbk", ["鹿", "口"], CODES) is None, str(render("xbk", ["鹿", "口"], CODES)))

# 缺根（不在码表里）→ 由调用方拦，render 本身会 KeyError，这里确认它不会静默通过
try:
    render("xbk", ["禾", "不存在"], CODES)
    check("缺根应当抛错", False, "没有抛 KeyError")
except KeyError:
    check("缺根应当抛错", True)

# 空序列
check("空序列 → None", render("xbk", [], CODES) is None)

print(f"\n通过 {passed}，失败 {failed}")
sys.exit(0 if failed == 0 else 1)
