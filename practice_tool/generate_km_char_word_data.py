#!/usr/bin/env python3
"""生成空明拳（yoyo-km）常用单字 / 常用词组 / 一简字词练习数据。

数据来源：rime/yoyo-pure.dict.yaml（麓鸣·纯形·空明 规范字典）。
单字全码为三码：前两码由两手并击打出，第三码由单手击键完成。
部分常用字只有二码（二简），直接用两手并击一次完成。
词组由 4 码构成（两击两手并击）。

一简字词是单手一击直出（_ 左 / + 右）。

常用单字 / 常用词组各按词频分成三段：前 500 / 中 500 / 后 500。
每个字的取码优先级：一简（_X/+X，单手一击）> 二简（XY，双手并击一次）>
三码全码（XX_Y/XX+Y）。字典里每条 text→code 都是可独立上屏的完整码，
二简/一简一旦存在就不该再要求打第三码。
另外单独生成全部一简字词（KM_JIAN），供“简码字词”子页面使用。

用法:
  python3 generate_km_char_word_data.py
"""

from __future__ import annotations

import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
DICT_PATH = REPO / "rime" / "yoyo-pure.dict.yaml"
OUTPUT = HERE / "km_char_word_data_module.js"

# 每段取多少个
SEGMENT_SIZE = 500
# 分段数
SEGMENTS = 3

# 码元字符（空明拳可打出的码元，不含数字）
CODE_RE = re.compile(r"^[a-zA-Z,./;:<>?]+$")
JIAN_RE = re.compile(r"^[_+]([a-zA-Z,./;:<>?])$")


def load_entries(path: Path) -> list[tuple[str, str, int]]:
    """读取 Rime 字典，返回 [(text, code, weight), ...]。"""
    entries: list[tuple[str, str, int]] = []
    in_data = False
    for line in path.open(encoding="utf-8"):
        if not in_data:
            in_data = line.strip() == "..."
            continue
        line = line.rstrip("\n")
        if not line.strip() or line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) >= 2:
            text, code = parts[0], parts[1]
            weight = int(parts[2]) if len(parts) > 2 and parts[2].strip().isdigit() else 0
            entries.append((text, code, weight))
    return entries


def build_single_char_steps(code: str) -> list[dict] | None:
    """把单字编码转成练习步骤。返回 None 表示无法解析（跳过该字）。"""
    if not CODE_RE.match(code):
        return None
    if len(code) == 3:
        first_two = list(code[0:2])
        third = code[2]
        return [
            {"target": first_two, "hand": "both"},
            {"target": [third], "hand": "either"},
        ]
    elif len(code) == 2:
        return [
            {"target": list(code), "hand": "both"},
        ]
    elif len(code) == 1:
        return [
            {"target": list(code), "hand": "either"},
        ]
    return None


def build_word_steps(code: str) -> list[dict] | None:
    """把词组编码转成练习步骤。"""
    if not CODE_RE.match(code) or len(code) < 2:
        return None
    # 词前两码：两手并击
    steps = [{"target": list(code[0:2]), "hand": "both"}]
    # 后续每两码一组（词全码四码，共两击）
    for i in range(2, len(code), 2):
        chunk = list(code[i : i + 2])
        if len(chunk) == 2:
            steps.append({"target": chunk, "hand": "both"})
        else:
            # 三码词：第三码单手，左右手皆可
            steps.append({"target": chunk, "hand": "either"})
    return steps


def build_jian_steps(code: str) -> list[dict] | None:
    """把一简码转成练习步骤：单手一击。"""
    m = JIAN_RE.match(code)
    if not m:
        return None
    return [
        {"target": [m.group(1)], "hand": "left" if code[0] == "_" else "right"},
    ]


def collect_ranked_items(entries, is_char: bool) -> list[dict]:
    """按词频降序生成可练习的条目列表（全部）。

    每个字/词优先使用一简码（如果有），否则使用全码/多码。
    """
    if is_char:
        forms: dict[str, list[tuple[str, int]]] = {}
        for text, code, weight in entries:
            if len(text) != 1:
                continue
            forms.setdefault(text, []).append((code, weight))

        items: list[dict] = []
        for text, form_list in sorted(
            forms.items(), key=lambda kv: -max(w for _, w in kv[1])
        ):
            jian_code = None
            full3 = None
            code2 = None
            for code, w in form_list:
                if JIAN_RE.match(code) and jian_code is None:
                    jian_code = code
                elif len(code) == 3 and CODE_RE.match(code) and full3 is None:
                    full3 = code
                elif len(code) == 2 and CODE_RE.match(code) and code2 is None:
                    code2 = code
            # 优先一简码（单手一击）；其次二简（双手并击一次，weight 通常远高于三码全码）；
            # 最后才用三码全码。字典里每条 text→code 都是可独立上屏的完整码，
            # 故二简/一简一旦存在就不应再要求打第三码。
            chosen = None
            steps = None
            if jian_code:
                chosen = jian_code
                steps = build_jian_steps(jian_code)
            if not steps and code2:
                chosen = code2
                steps = build_single_char_steps(code2)
            if not steps and full3:
                chosen = full3
                steps = build_single_char_steps(full3)
            if not steps:
                continue
            items.append({"char": text, "code": chosen, "steps": steps})
        return items
    else:
        word_forms: dict[str, dict[str, int]] = {}
        for text, code, weight in entries:
            if len(text) < 2 or not (CODE_RE.match(code) or JIAN_RE.match(code)):
                continue
            word_forms.setdefault(text, {})
            if code not in word_forms[text] or weight > word_forms[text][code]:
                word_forms[text][code] = weight

        items = []
        for text, code_map in sorted(
            word_forms.items(),
            key=lambda kv: -max(kv[1].values()),
        ):
            # 优先一简码
            jian_code = None
            for code in code_map:
                if JIAN_RE.match(code):
                    if jian_code is None or code_map[code] > code_map[jian_code]:
                        jian_code = code
            chosen = None
            steps = None
            if jian_code:
                chosen = jian_code
                steps = build_jian_steps(jian_code)
            if not steps:
                # 取权重最高的非一简码（优先4码，其次3码/2码）
                candidates = {k: v for k, v in code_map.items() if not JIAN_RE.match(k)}
                if candidates:
                    chosen = max(candidates.items(), key=lambda kv: kv[1])[0]
                    steps = build_word_steps(chosen)
            if not steps:
                continue
            items.append({"text": text, "code": chosen, "steps": steps})
        return items


def collect_jian_items(entries) -> list[dict]:
    """收集全部一简字词，用于专门的一击上屏练习。"""
    items = []
    for text, code, weight in entries:
        steps = build_jian_steps(code)
        if not steps:
            continue
        items.append({
            "text": text,
            "code": code,
            "steps": steps,
            "weight": weight,
            "is_char": len(text) == 1,
        })
    # 按权重降序
    items.sort(key=lambda x: -x["weight"])
    return items


def split_segments(items: list[dict], segment_size: int) -> list[list[dict]]:
    """把已按词频降序排列的条目切分成若干段。"""
    segments = []
    for i in range(0, len(items), segment_size):
        segment = items[i : i + segment_size]
        if segment:
            segments.append(segment)
    return segments


def main() -> None:
    entries = load_entries(DICT_PATH)

    char_items = collect_ranked_items(entries, is_char=True)
    word_items = collect_ranked_items(entries, is_char=False)
    jian_items = collect_jian_items(entries)

    char_segments = split_segments(char_items, SEGMENT_SIZE)[:SEGMENTS]
    word_segments = split_segments(word_items, SEGMENT_SIZE)[:SEGMENTS]

    # ---- 输出 JS ----
    out = [
        "// 空明拳（yoyo-km）常用单字 / 常用词组 / 一简字词练习数据 —— 由 generate_km_char_word_data.py 生成，请勿手改。",
        "// 数据来源：rime/yoyo-pure.dict.yaml（麓鸣·纯形·空明 规范字典）。",
        "// steps 表示一次输入需要进行的并击步骤（不含 space，由前端按体系决定）：",
        "//   hand=both 双手并击；hand=left/right 单手并击；hand=either 单手左右皆可。",
        "//",
        "// 常用单字 / 常用词组各分三段（按词频降序）：",
        "//   KM_CHARS[0] = 前 500，KM_CHARS[1] = 中 500，KM_CHARS[2] = 后 500",
        "//   KM_WORDS[0] = 前 500，KM_WORDS[1] = 中 500，KM_WORDS[2] = 后 500",
        "// 每个字取码优先级：一简（单手一步）> 二简（双手并击一步）> 三码全码（双手+单手两步）；",
        "//   二简/一简存在时不再要求打第三码。",
        f"// 全部一简字词：{len(jian_items)} 个（单字 {sum(1 for x in jian_items if x['is_char'])} + 词组 {sum(1 for x in jian_items if not x['is_char'])}）",
        "",
        f"// 常用单字（{sum(len(s) for s in char_segments)} 个，分 {len(char_segments)} 段）",
        f"const KM_CHARS = {json.dumps(char_segments, ensure_ascii=False, indent=2)};",
        "",
        f"// 常用词组（{sum(len(s) for s in word_segments)} 个，分 {len(word_segments)} 段）",
        f"const KM_WORDS = {json.dumps(word_segments, ensure_ascii=False, indent=2)};",
        "",
        f"// 一简字词（{len(jian_items)} 个，按词频降序）",
        f"const KM_JIAN = {json.dumps(jian_items, ensure_ascii=False, indent=2)};",
        "",
        "if (typeof module !== 'undefined') {",
        "  module.exports = { KM_CHARS, KM_WORDS, KM_JIAN };",
        "}",
        "",
    ]
    OUTPUT.write_text("\n".join(out), encoding="utf-8")

    sizes = [len(s) for s in char_segments]
    wsizes = [len(s) for s in word_segments]
    jian_chars = sum(1 for x in jian_items if x["is_char"])
    jian_words = sum(1 for x in jian_items if not x["is_char"])
    print(f"常用单字：{sizes} → {OUTPUT}")
    print(f"常用词组：{wsizes}")
    print(f"一简字词：{len(jian_items)}（单字 {jian_chars} + 词组 {jian_words}）")


if __name__ == "__main__":
    main()
