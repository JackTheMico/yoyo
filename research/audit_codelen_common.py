#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""audit_codelen_common —— yoyo-pure 码长/码位审计的共享解析工具。

本模块只提供「读取 + 口径常量」，不含任何分析逻辑，供 research/audit_codelen_*.py 复用。

════════════════ 统计口径（全项目统一） ════════════════

【词条 entry】
    yoyo-pure.dict.yaml 的 body 段（`...` 之后）中形如 `text\tcode\tweight` 的一行。
    空行、`#` 注释行、`\t` 数 < 2 的行一律跳过。
    weight 缺省或非数字按 0 计（与 rime/scripts/verify_pure_dict.py 一致）。

【码位 slot】
    不同的 code 字符串。一个码位可挂 1~N 个候选 text。

【击数 stroke】—— 由 yoyo-pure-km.schema.yaml 的心法决定
    1 击（并击一次）：2 字符码
        - 一简  `_X` / `+X`：单手并击（左手 60 位 / 右手 60 位）
        - 二简  `XY`      ：双手并击（左 dau × 右 dau）
    2 击：3 字符码（单字全码）、4 字符码（词全码）
        speller 的 `derive|^(..)(.)$|$1_$2|` 把 3 码拆成「并击 + 单键」两击。
    本模块不做击数判定，只暴露 code 长度，由各脚本自行解释。

【dau（码元）】
    空明拳单手 1~3 键能产出的单字符码元，左右手各 60 个，且**两手的 dau 集合完全相同**
    （26 小写 + 26 大写 + 8 符号 `;:,<.>/?`）。由 chord_utils.enumerate_dau 实算，
    不硬编码。

【理论码位空间】
    1 击空间（2 字符码） = |_X| 60 + |+X| 60 + |XY| 60*60 = 3720
    % 简词空间（3 字符，% 前缀） = 同上 = 3720（见 gen_brief_words.py build_slots）
"""

from __future__ import annotations

import sys
from collections import defaultdict
from pathlib import Path

RESEARCH_DIR = Path(__file__).resolve().parent
RIME_DIR = RESEARCH_DIR.parent / "rime"
SCRIPTS_DIR = RIME_DIR / "scripts"

sys.path.insert(0, str(SCRIPTS_DIR))

from chord_utils import (  # noqa: E402  (需要先注入 sys.path)
    DAU_SET,
    LEFT_KEYS,
    RIGHT_KEYS,
    YOYO_YAML,
    KM_SCHEMA,
    build_pipelines,
    enumerate_dau,
    load_yaml,
)

PURE_DICT = RIME_DIR / "yoyo-pure.dict.yaml"
USER_DICT = RIME_DIR / "yoyo-user.dict.yaml"
YX_WORD_DICT = RIME_DIR / "yoyo-yx-word.dict.yaml"
YX_CHAR_DICT = RIME_DIR / "yoyo-yx-char.dict.yaml"
DICT_MAP_LUA = RIME_DIR / "lua" / "yoyo" / "data" / "pure_dict_map.lua"


# ────────────────────────── 码位空间 ──────────────────────────

def get_dau():
    """返回 (left_dau, right_dau)：两手各自的「码元 -> 按键串」字典（各 60 项）。

    实算而非硬编码：从 yoyo.yaml 的「空明拳」指法 + yoyo-pure-km.schema.yaml 的
    「纯形统一心法」还原 chord_composer 管线后暴力枚举 1~3 键组合。
    """
    yoyo = load_yaml(YOYO_YAML)
    km = load_yaml(KM_SCHEMA)
    alphabet, _pipeline = build_pipelines(yoyo, km)["A 后置"]
    # 注意：enumerate_dau 第一个参数要传「空明拳」指法段（fingering），
    # 不是 build_pipelines 拼好的完整管线 —— 与 gen_brief_words.build_slots 一致。
    fingering = yoyo["空明拳"]["__append"]
    return (enumerate_dau(fingering, alphabet, LEFT_KEYS),
            enumerate_dau(fingering, alphabet, RIGHT_KEYS))


def theoretical_1stroke_space():
    """1 击（2 字符码）理论容量 = 60(_X) + 60(+X) + 60*60(XY) = 3720。"""
    left, right = get_dau()
    return len(left) + len(right) + len(left) * len(right)


def all_2char_slots():
    """枚举全部 2 字符理论码位，返回 set。"""
    left, right = get_dau()
    return ({f"_{d}" for d in left}
            | {f"+{d}" for d in right}
            | {a + b for a in left for b in right})


def theoretical_brief_slots():
    """% 简词理论容量，口径与 gen_brief_words.build_slots 一致：3720。

    单手位 %_X / %+X 各 60，双手位 %XY = 60*60。
    """
    return theoretical_1stroke_space()


# ────────────────────────── 字典解析 ──────────────────────────

def iter_entries(path):
    """流式 yield (text, code, weight)。口径见模块 docstring。"""
    started = False
    with open(path, encoding="utf-8") as f:
        for line in f:
            if not started:
                if line.strip() == "...":
                    started = True
                continue
            line = line.rstrip("\n")
            if not line or line.startswith("#"):
                continue
            parts = line.split("\t")
            if len(parts) < 2:
                continue
            weight = int(parts[2]) if len(parts) > 2 and parts[2].lstrip("-").isdigit() else 0
            yield parts[0], parts[1], weight


def build_code_map(path, code_filter=None):
    """返回 {code: [(text, weight), ...]}，保持字典原始（by_weight）顺序。

    code_filter(code) -> bool 可只保留关心的码。
    """
    m = defaultdict(list)
    for text, code, weight in iter_entries(path):
        if code_filter and not code_filter(code):
            continue
        m[code].append((text, weight))
    return m


def load_freq(path, text_filter=None):
    """从音形词频表读 {text: max_weight}。

    口径：yoyo-yx-word/char.dict.yaml 同一 text 有多行（首行挂真实词频，
    其余行 weight=0），这里取该 text 出现过的**最大** weight 作为词频。
    只借用「词 + 权重」，忽略其 code 列（音形码与 yoyo-pure 无关）。
    """
    freq = {}
    started = False
    with open(path, encoding="utf-8") as f:
        for line in f:
            if not started:
                if line.strip() == "...":
                    started = True
                continue
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 3:
                continue
            try:
                w = int(parts[2])
            except ValueError:
                continue
            if w <= 0:
                continue
            text = parts[0]
            if text_filter and not text_filter(text):
                continue
            if text not in freq or w > freq[text]:
                freq[text] = w
    return freq


# ────────────────────────── lua 映射表流式统计 ──────────────────────────

def iter_lua_table(path, table_header):
    """流式 yield pure_dict_map.lua 中某张表的 (key, value) 字符串。

    只逐行扫到目标表头再逐行读到闭合 `},`，**不整体 parse、不 eval**。
    table_header 形如 `  space_brief_map = {`。
    """
    in_table = False
    indent = len(table_header) - len(table_header.lstrip())
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if not in_table:
                if line == table_header:
                    in_table = True
                continue
            # 闭合：缩进不大于表头缩进的 `},`
            if line.strip().rstrip(",") == "}" and (len(line) - len(line.lstrip())) <= indent:
                break
            s = line.strip()
            if not s.startswith("["):
                continue
            key, _, rest = s[1:].partition("]")
            key = key.strip()
            if not (key.startswith('"') and key.endswith('"')):
                continue
            key = key[1:-1]
            rest = rest.strip()
            if rest.startswith("= "):
                rest = rest[2:].strip()
            if rest.endswith(","):
                rest = rest[:-1].strip()
            yield key, rest


def count_lua_table(path, table_header):
    """统计某张表的条目数（流式，常量内存）。"""
    return sum(1 for _ in iter_lua_table(path, table_header))


# ────────────────────────── 小工具 ──────────────────────────

def pct(a, b):
    return (100.0 * a / b) if b else float("nan")


def bar(a, b, width=30):
    """文本条形图，b 为总量。"""
    if not b:
        return ""
    n = int(round(width * a / b))
    return "█" * n + "·" * (width - n)


def weighted_ratio(items_hit, items_all, freq):
    """按词频加权的命中比例。

    items_hit / items_all: 可迭代的 text 集合或 [(text, ...), ...]。
    口径：**分母只算在 freq 表里查得到词频的条目**（查不到的条目既不计入
    分子也不计入分母），避免「无频条目」稀释比例。
    返回 (weighted_hit, weighted_all, ratio, covered_hit, covered_all)。
    """
    def texts(xs):
        return [x[0] if isinstance(x, (tuple, list)) else x for x in xs]

    hit, all_ = set(texts(items_hit)), set(texts(items_all))
    hit_f = sum(freq.get(t, 0) for t in hit)
    all_f = sum(freq.get(t, 0) for t in all_)
    cov_hit = sum(1 for t in hit if t in freq)
    cov_all = sum(1 for t in all_ if t in freq)
    return hit_f, all_f, (hit_f / all_f if all_f else float("nan")), cov_hit, cov_all
