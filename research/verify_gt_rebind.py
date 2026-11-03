#!/usr/bin/env python3
"""验证 `>` 改键：把 t+d（左手）/ y+k（右手）跑真实 心法+指法 流水线，看是否都产出 `>`。"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
YOYO = ROOT / "rime" / "yoyo.yaml"
KM = ROOT / "rime" / "yoyo-pure-km.schema.yaml"

ALPHABET = "qwertasdfgzxcvb yuiophjkl;nm,./:'"   # chord_composer.alphabet
RANK = {c: i for i, c in enumerate(ALPHABET)}


def chord_sort(s: str) -> str:
    return "".join(sorted(s, key=lambda c: RANK.get(c, 999)))


def load_rules():
    """从 yoyo.yaml 取 空明拳 的 __append 规则 + 纯形统一心法。"""
    text = YOYO.read_text()
    # 空明拳 段
    i = text.index("空明拳:")
    j = text.index("\n寒梅:", i)
    block = text[i:j]
    fingering = [m.group(1) for m in re.finditer(r"^\s*-\s*(xform\S+)\s*$", block, re.M)]
    # 心法段
    i2 = KM.read_text().index("纯形统一心法:")
    xinfa_block = KM.read_text()[i2:]
    xinfa = [m.group(1) for m in re.finditer(r"^\s*-\s*(xform\S+)\s*$", xinfa_block, re.M)]
    return xinfa + fingering


def apply_xforms(s: str, rules) -> str:
    cur = s
    for rule in rules:
        if not rule.startswith("xform"):
            continue
        delim = rule[5]
        body = rule[6:]
        # 去掉末尾的分隔符
        if body.endswith(delim):
            body = body[:-1]
        parts = body.split(delim)
        if len(parts) != 2:
            continue
        pat, repl = parts
        cur = re.sub(pat, repl.replace("$", "\\"), cur)
    return cur


def main():
    rules = load_rules()
    print(f"规则数 {len(rules)}；alphabet = {ALPHABET!r}")
    tests = [
        (">", "de", "右手 i+k"),
        ("",  "ed", "左手 e+d"),
        ("?", "td", "左手 t+d"),
        ("?", "yk", "右手 y+k"),
    ]
    # 先看现状
    print("\n── 现状基线 ──")
    for label, keys, desc in tests:
        print(f"  {keys:>3} ({desc}) → {apply_xforms(chord_sort(keys), rules)!r}")

    # 模拟把 de/ed 规则替换为 td/dt
    patched = []
    for r in rules:
        if r in ("xform|de|>|", "xform|ed|>|"):
            patched.append("xform|td|>|")
            continue
        patched.append(r)
    print("\n── 改成 td 后 ──")
    for keys, desc in (("td", "左手 t+d"), ("yk", "右手 y+k"),
                       ("dt", "左手 d+t(反序)"), ("ky", "右手 k+y(反序)"),
                       ("de", "旧位 e+d"), ("ik", "旧位 i+k")):
        out = apply_xforms(chord_sort(keys), patched)
        flag = "✅" if out == ">" else "  "
        print(f"  {flag} {keys:>3} ({desc}) → {out!r}")

    # 检测 :dt / :td 是否被别的规则抢走
    print("\n── 冲突检查：td / dt / yk / ky 是否已被别的规则占用 ──")
    for r in patched:
        if any(k in r for k in ("|td|", "|dt|", "|yk|", "|ky|")):
            print(f"  {r}")


if __name__ == "__main__":
    main()
