#!/usr/bin/env python3
"""空明拳并击代数工具库 (chord_utils.py)。

把 yoyo.yaml 的「空明拳」指法代数与 yoyo-pure-km 的「纯形统一心法」chord 规则
用纯 Python 等价仿真，供 gen_brief_words.py 等离线工具复用（不依赖 Rime 运行时）。

提供：
  - load_yaml / YOYO_YAML / KM_SCHEMA：加载配置
  - build_pipelines：从配置还原 chord 心法流水线（现行「后置」路径）
  - enumerate_dau：暴力枚举单手 1~3 键能产出的码元
  - apply_xforms：按 alphabet 下标排序按键并依次执行 xform 流水线

librime 源码依据（chord_composer.cc，已核实）：
  - SerializeChord 按 chording_keys_（= alphabet 解析顺序）迭代 → 输出按 alphabet 下标排序；
  - chord 在「所有按下的键都松开」时结束（finish_chord_on_all_keys_released）；
  - FinishChord 把输出串按 KeySequence 逐键 engine_->ProcessKey() 重新注入完整处理链。
"""

import re
from itertools import combinations
from pathlib import Path

import yaml

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
KM_SCHEMA = RIME_DIR / "yoyo-pure-km.schema.yaml"
YOYO_YAML = RIME_DIR / "yoyo.yaml"

LEFT_KEYS = "qwertasdfgzxcvb"
RIGHT_KEYS = "yuiophjkl;nm,./:"

# 码元字符集：单键 15 + 小写双键 11 + 大写 26 + 符号 8 = 60
DAU_SET = set("abcdefghijklmnopqrstuvwxyz") | set("ABCDEFGHIJKLMNOPQRSTUVWXYZ") | set(";:,<.>/?")


def load_yaml(path: Path):
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def apply_xforms(s: str, xforms: list, alphabet_order: str) -> str:
    """模拟 chord_composer：按 alphabet 下标排序按键，再依次执行 xform 流水线。"""
    char_rank = {ch: i for i, ch in enumerate(alphabet_order)}
    current = "".join(sorted(s, key=lambda c: char_rank.get(c, 999)))
    for rule in xforms:
        if not rule.startswith("xform"):
            continue
        delim = rule[5]
        parts = rule[6:].split(delim)
        if len(parts) >= 2:
            pattern, replacement = parts[0], parts[1]
            py_replacement = re.sub(r"\$(\d+)", r"\\\1", replacement)
            current = re.sub(pattern, py_replacement, current)
    return current


def build_pipelines(yoyo_data, km_data):
    fingering = yoyo_data["空明拳"]["__append"]
    xinfa_suffix = km_data["纯形统一心法"]["__append"]  # 现行：' 在末尾（次选后缀）

    alphabet_suffix = km_data["__patch"]["chord_composer"]["alphabet"]

    return {
        "A 后置": (alphabet_suffix, xinfa_suffix + fingering),
    }


def enumerate_dau(pipeline, alphabet, hand_keys):
    """暴力枚举某只手 1~3 键的所有组合，看能产出哪些单码元。"""
    found = {}
    for n in (1, 2, 3):
        for combo in combinations(hand_keys, n):
            raw = "".join(combo)
            out = apply_xforms(raw, pipeline, alphabet)
            if len(out) == 1 and out in DAU_SET:
                found.setdefault(out, raw)
    return found


_PIPE_CACHE = None
_PIPE_ALPHABET = None


def _get_pipe():
    """懒加载并缓存 chord_composer 的 A后置 管线（含字母表）。"""
    global _PIPE_CACHE, _PIPE_ALPHABET
    if _PIPE_CACHE is None:
        yoyo = load_yaml(YOYO_YAML)
        km = load_yaml(KM_SCHEMA)
        _PIPE_CACHE = build_pipelines(yoyo, km)["A 后置"]
        _PIPE_ALPHABET = _PIPE_CACHE[0]
    return _PIPE_CACHE, _PIPE_ALPHABET


def chord_keys_to_code(keys: str):
    """把"实际按下的空格并击按键串"（不含空格触发符）算成 `%` 简词码。

    空格并击的 `%` 前缀来自 chord_composer 在并击时自动插入的空格分隔符；
    用户输入通常不含空格，这里替他补一个（空格在字母表中位于左右手键区之间，
    排序后自然落在左右手按键之间，命中 %XY / %_X / %+X 规则）。

    返回 (code, valid, error)：
      - code:  算出的码（可能非法，如两右键得到 %+XY 4 字符）
      - valid: code 以 % 开头且恰好 3 字符（mapgen 只收这种）
      - error: 非空表示按键串本身非法（含字母表外字符/空）
    """
    pipe, alphabet = _get_pipe()
    k = keys.replace(" ", "")
    if not k:
        return None, False, "空输入：请传入并击按键串（如 er:）"
    bad = [c for c in k if c not in set(alphabet)]
    if bad:
        return None, False, f"非法并击键 {bad}：不在字母表 {alphabet!r}"
    code = apply_xforms(k + " ", pipe[1], alphabet)
    valid = code.startswith("%") and len(code) == 3
    return code, valid, ""


if __name__ == "__main__":
    import sys

    if len(sys.argv) >= 3 and sys.argv[1] == "keys-to-code":
        code, valid, err = chord_keys_to_code(sys.argv[2])
        if err:
            print(f"ERROR: {err}", file=sys.stderr)
            sys.exit(1)
        if not valid:
            print(f"ERROR: 按键串 {sys.argv[2]!r} 不能构成合法空格并击简词码"
                  f"（得到 {code!r}，需 %+2字符）", file=sys.stderr)
            sys.exit(2)
        print(code)
        sys.exit(0)
    print("usage: python3 chord_utils.py keys-to-code <按键串>", file=sys.stderr)
    sys.exit(1)

