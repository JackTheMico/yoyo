#!/usr/bin/env python3
"""量化：多字根字第 2 码的歧义有多大（决定「补第二根」值不值得）。

用法：python3 research/probe_second_root.py
"""
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "rime" / "scripts"))
from gen_zigen_align import (  # noqa: E402
    ELEMENTS, MAPPING, PURE_DICT,
    parse_mapping, load_elements, load_char_codes, derive_letters,
)

root_code, root_name = parse_mapping(MAPPING)
elements = load_elements(ELEMENTS)
chars = load_char_codes(PURE_DICT)

rows = []
for ch, forms in chars.items():
    full = max((c for c, _ in forms), key=len)
    inst = elements.get(ch)
    if not inst or len(full) != 3 or len(inst) != 4:
        continue
    rows.append((ch, full, inst[0].rpartition(".")[0], inst[2].rpartition(".")[0]))

big, small, _ = derive_letters(rows, root_code)

# 每个大码下有哪几个主字根
by_big = defaultdict(list)
for r, b in big.items():
    by_big[b].append(r)

multi = []
for ch, full, first, last in rows:
    fb, lb = big.get(first), big.get(last)
    if not fb or not lb or first == last:
        continue
    ls = small.get(last)
    if full[1] == lb and ls and full[2] == ls:
        continue  # 双根，三码已全对齐
    if full[2] == lb:
        multi.append((ch, full, first, last))

print(f"多字根字（第2码来自未知的第二根）: {len(multi)} 字\n")
sizes = Counter()
for ch, full, first, last in multi:
    cands = by_big.get(full[1], [])
    sizes[len(cands)] += 1

print("第2码对应大码下「候选主字根数」分布：")
tot = sum(sizes.values())
for k in sorted(sizes):
    print(f"  {k:2d} 个候选: {sizes[k]:5d} 字 ({sizes[k]/tot*100:.1f}%)")
print(f"  中位数候选数: {sorted([len(by_big.get(f[1], [])) for _, f, _, _ in multi])[len(multi)//2]}")
print(f"  平均候选数: {sum(len(by_big.get(f[1], [])) for _, f, _, _ in multi)/len(multi):.1f}")

print("\n样例（第2码 → 可能的字根）:")
for ch, full, first, last in multi[:12]:
    cands = by_big.get(full[1], [])
    print(f"  {ch} {full}  首根={first} 末根={last}  第2码 '{full[1]}' → {cands}")
