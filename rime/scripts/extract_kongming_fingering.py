#!/usr/bin/env python3
"""从空明码 schema 提取 60 码元的键位指法，镜像右手→左手，生成 yoyo 空明拳格式规则。

用法: python3 extract_kongming_fingering.py [kongmingma.schema.yaml]
"""
import re
import sys
from collections import defaultdict
from pathlib import Path

KONG = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(
    "/home/jackwy/codes/rime/yoyo/.reasonix/kongmingma.schema.yaml")

# 空明码右手键 -> 左手镜像键（QWERTY 同排水平对称）
MIRROR = {
    "y": "t", "u": "r", "i": "e", "o": "w", "p": "q",
    "h": "g", "j": "f", "k": "d", "l": "s", "F": "a",  # F = 右手 ;
    "n": "b", "m": "v", "D": "c", "J": "x", "G": "z",  # D=, J=. G=/
}
LEFT_KEYS = set("qwertasdfgzxcvb")
# 空明码形码码元（字母 + 符号）；排除数字与特殊功能符号
YAN_YUAN = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ;:,.<!=?")


def load_algebra(path):
    lines = path.read_text(encoding="utf-8").splitlines()
    start = next(i for i, l in enumerate(lines) if l.strip() == "chord_composer:")
    end = next(i for i, l in enumerate(lines) if i > start and l.strip() == "prompt_format:")
    return [l.strip() for l in lines[start:end] if l.strip().startswith("- xform")]


def mirror(keys):
    """把键元组镜像到左手（右手键转左手，左手键不变）。"""
    return tuple(sorted(MIRROR.get(k, k) for k in keys))


def main():
    algebra = load_algebra(KONG)
    mapping = defaultdict(list)  # 码元 -> 左手键元组列表

    for rule in algebra:
        # 字符类单键规则: xform/[aF]-/a/
        m = re.match(r"- xform/\[(.+?)\]-/(.)/\s*$", rule)
        if m:
            chars, dst = m.group(1), m.group(2)
            if dst in YAN_YUAN:
                for ch in chars:
                    # 每个字符都是单键
                    mapping[dst].append(mirror((ch,)))
            continue
        # 组合规则: xform/(q-v-|m-p-)/Q/  —— 要求带 '-' 后缀（跳过 (nm)/m/ 等容错规则）
        m = re.match(r"- xform[=/]\((.+?)\)[=/](.)[=/]\s*$", rule)
        if m:
            src, dst = m.group(1), m.group(2)
            if dst in YAN_YUAN and "-" in src:
                for g in src.split("|"):
                    keys = re.findall(r"[a-zA-Z]", g)
                    if keys:
                        mapping[dst].append(mirror(tuple(keys)))
            continue

    # 每个码元取唯一标准键组合：优先单键，其次键数最少
    final = {}
    multi = []
    for yuan in sorted(mapping):
        combos = sorted(set(mapping[yuan]), key=lambda t: (len(t), t))
        final[yuan] = combos[0]
        if len(combos) > 1:
            multi.append((yuan, combos))

    print(f"== 提取到 {len(final)} 个码元键位 ==")
    print("== 多组合码元（取键数最少）==")
    for yuan, combos in multi:
        print(f"  {yuan}: {['+'.join(c) for c in combos]}")

    # 反向冲突检查
    reverse = defaultdict(list)
    for yuan, keys in final.items():
        reverse[keys].append(yuan)
    print("\n== 键组合冲突检查 ==")
    dup = False
    for keys, yuans in sorted(reverse.items(), key=lambda kv: kv[0]):
        if len(yuans) > 1:
            dup = True
            print(f"  冲突! {'+'.join(keys)} -> {yuans}")
    if not dup:
        print("  无冲突。")

    # 输出 yoyo 空明拳格式
    print("\n== yoyo 空明拳码元规则（xform|键组合|码元|，双键双向）==")
    single = []
    for yuan in sorted(final):
        keys = final[yuan]
        if len(keys) == 1:
            k = keys[0]
            if k == yuan and k in LEFT_KEYS:
                single.append(yuan)
            else:
                print(f"  xform|{k}|{yuan}|")
        else:
            a, b = keys
            print(f"  xform|{a}{b}|{yuan}|")
            print(f"  xform|{b}{a}|{yuan}|")
    print("\n== 单键直出码元（无需规则）==")
    print("  ", " ".join(single))


if __name__ == "__main__":
    main()
