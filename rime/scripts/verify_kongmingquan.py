#!/usr/bin/env python3
"""验证 yoyo 纯形空明拳指法：65 码元全覆盖（60 字母符号 + 5 数字）、键组合无歧义、左右手镜像一致。

模拟 librime chord_composer 的 algebra（xform 顺序替换），对每个码元的键组合
（左手直打 + 右手镜像）验证能正确折叠成码元。
"""
import re
import sys
from collections import defaultdict
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
YOYO_YAML = HERE.parent / "yoyo.yaml"

# 空明码右手键 -> 左手镜像键（与 yoyo.yaml 空明拳镜像一致）
MIRROR = {
    "y": "t", "u": "r", "i": "e", "o": "w", "p": "q",
    "h": "g", "j": "f", "k": "d", "l": "s", ";": "a",
    "n": "b", "m": "v", ",": "c", ".": "x", "/": "z",
}
DIGIT_MIRROR = {"6": "5", "7": "4", "8": "3", "9": "2", "0": "1"}
LEFT_KEYS = set("12345qwertasdfgzxcvb")
RIGHT_KEYS = set("67890yuiophjkl;nm,./")
RIGHT_SYMBOL = set(MIRROR)  # 右手可镜像键


def load_rules():
    """解析 yoyo.yaml 空明拳段，返回 (镜像规则, 码元规则) 列表。"""
    d = yaml.safe_load(YOYO_YAML.read_text(encoding="utf-8"))
    rules = d["空明拳"]["__append"]
    mirror = []
    yuan = []
    for r in rules:
        if not isinstance(r, str) or not r.startswith("xform|"):
            continue
        body = r[len("xform|"):].rstrip("|")
        parts = body.split("|")
        if len(parts) != 2:
            continue
        src, dst = parts[0], parts[1]
        if src == "'":  # 清除单引号
            continue
        src_norm = src.replace("\\.", ".")  # 处理 xform|\.|x| 的转义点
        # 镜像规则：单字符右手键 -> 单字符左手键
        if len(src_norm) == 1 and len(dst) == 1 and src_norm in (RIGHT_SYMBOL | set(DIGIT_MIRROR)):
            mirror.append((src, dst))
        else:
            yuan.append((src, dst))
    return mirror, yuan


def apply_xforms(s, rules):
    for pat, repl in rules:
        s = re.sub(pat, repl, s)
    return s


def main():
    mirror, yuan = load_rules()
    print(f"镜像规则 {len(mirror)} 条, 码元规则 {len(yuan)} 条")

    # 键组合(排序) -> 码元
    combo = {}
    for src, dst in yuan:
        keys = tuple(sorted(src))
        combo[keys] = dst
    for k in "qwertasdfgzxcvb":  # 单键直出
        combo[(k,)] = k

    # 65 码元覆盖检查（60 字母符号 + 5 数字）
    all_yuan = set(combo.values())
    expected = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ;,./:<>?") | set("06789")
    print(f"字母符号+数字码元: 键组合 {len(combo)} 个, 码元 {len(all_yuan)} 个 (期望 65)")
    missing = expected - all_yuan
    extra = all_yuan - expected
    if missing:
        print(f"  缺失: {sorted(missing)}")
    if extra:
        print(f"  多余: {sorted(extra)}")
    if not missing and not extra:
        print("  ✓ 65 码元全覆盖")

    # 无歧义检查
    reverse = defaultdict(list)
    for keys, y in combo.items():
        reverse[keys].append(y)
    dup = {k: v for k, v in reverse.items() if len(v) > 1}
    print(f"键组合冲突: {len(dup)} 个")
    for k, v in sorted(dup.items()):
        print(f"  冲突! {'+'.join(k)} -> {v}")

    # 模拟 chord：镜像 + 码元规则
    all_rules = mirror + yuan
    print(f"\n模拟 chord（镜像 + 码元，共 {len(all_rules)} 条）:")
    ok = 0
    fails = []
    for keys, y in sorted(combo.items(), key=lambda kv: kv[1]):
        out = apply_xforms("".join(keys), all_rules)
        if out == y:
            ok += 1
        else:
            fails.append((keys, y, out))
    print(f"  左手键组合可达: {ok}/{len(combo)}")
    for keys, y, out in fails[:15]:
        print(f"    ✗ {'+'.join(keys)} -> 期望 {y!r} 实际 {out!r}")

    # 右手镜像验证
    inv = {v: k for k, v in MIRROR.items()}
    right_ok = 0
    right_fail = []
    total_double = 0
    for keys, y in sorted(combo.items(), key=lambda kv: kv[1]):
        if len(keys) != 2:
            continue
        total_double += 1
        if all(k in inv for k in keys):
            rk = tuple(sorted(inv[k] for k in keys))
            out = apply_xforms("".join(rk), all_rules)
            if out == y:
                right_ok += 1
            else:
                right_fail.append((rk, y, out))
    print(f"  右手镜像可达: {right_ok}/{total_double}")
    for rk, y, out in right_fail[:15]:
        print(f"    ✗ {'+'.join(rk)} -> 期望 {y!r} 实际 {out!r}")

    ok_all = (not missing and not extra and not dup and not fails and not right_fail)
    print(f"\n{'== 全部通过 ==' if ok_all else '== 存在失败 =='}")
    return 0 if ok_all else 1


if __name__ == "__main__":
    sys.exit(main())
