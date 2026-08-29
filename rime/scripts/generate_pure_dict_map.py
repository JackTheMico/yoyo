#!/usr/bin/env python3
"""生成纯形顶屏静态映射表 (rime/lua/yoyo/data/pure_dict_map.lua)。

从 rime/yoyo-pure.dict.yaml 提取：
1. dict_map: 编码 -> 首选中文文本映射
2. words_4code: 四码词集合（用于状态机区分合法4码词与非词自动切分）
3. chars_3code: 三码单字集合（用于状态机区分3码单字全码与两码字接一简）
从 rime/yoyo-user.dict.yaml（及主词表，防御性）额外提取：
4. brief_map: 前置单引号扩展简词映射（码形 '_X / '+X / 'XY -> 词）
   —— 状态机 Pattern H 顶屏用；' 码不进入 dict_map 等既有映射。
5. space_brief_map: 空格并击简词映射（码形 %XY / %_X / %+X -> 词）
   —— 状态机 Pattern S 一击上屏用；% 码同样不进入其他映射。
   %XY = 双手+空格，%_X = 左手+空格，%+X = 右手+空格（见纯形统一心法）。
"""

import json
import sys
import unicodedata
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
SOURCE_DICT = RIME_DIR / "yoyo-pure.dict.yaml"
USER_DICT = RIME_DIR / "yoyo-user.dict.yaml"
OUTPUT_LUA = RIME_DIR / "lua" / "yoyo" / "data" / "pure_dict_map.lua"


def generate():
    if not SOURCE_DICT.exists():
        print(f"Error: Source dictionary {SOURCE_DICT} not found.", file=sys.stderr)
        sys.exit(1)

    print(f"Reading pure dictionary: {SOURCE_DICT}")
    lines = SOURCE_DICT.read_text(encoding="utf-8").splitlines()
    if USER_DICT.exists():
        print(f"Reading user dictionary: {USER_DICT}")
        lines += USER_DICT.read_text(encoding="utf-8").splitlines()

    code_to_candidates = {}
    clean_to_candidates = {}
    words_4code = set()
    chars_3code = set()
    brief_map = {}
    space_brief_map = {}

    for l in lines:
        if "\t" not in l or l.startswith("#"):
            continue
        parts = l.split("\t")
        text = parts[0]
        raw_code = parts[1]

        # 空格并击简词（% 前缀）：单独收入 space_brief_map，不进入其他映射
        if raw_code.startswith("%"):
            if len(raw_code) == 3:
                space_brief_map.setdefault(raw_code, text)
            continue
        # 前置单引号扩展简词：单独收入 brief_map，不进入其他映射
        if raw_code.startswith("'"):
            if len(raw_code) == 3:
                brief_map.setdefault(raw_code, text)
            continue

        clean_code = raw_code.replace("_", "").replace("+", "")

        # 记录 4 码词
        if len(clean_code) == 4 and len(text) > 1:
            words_4code.add(clean_code)
        # 记录 3 码单字（必须为单字汉字，排除标点符号与快符）
        elif len(clean_code) == 3 and len(text) == 1 and unicodedata.category(text).startswith("L"):
            chars_3code.add(clean_code)

        # 记录候选词列表（按词典原始权重顺序）
        cand_list = code_to_candidates.setdefault(raw_code, [])
        if text not in cand_list:
            cand_list.append(text)

        clean_cand_list = clean_to_candidates.setdefault(clean_code, [])
        if text not in clean_cand_list:
            clean_cand_list.append(text)

    # 生成主单 (char_first) 与主词 (word_first) 两种视图
    cf_top_word = {}
    cf_second_word = {}
    wf_top_word = {}
    wf_second_word = {}

    def process_cands(code, cands, top_dict, sec_dict, char_first=True):
        if not cands:
            return
        chars = [t for t in cands if len(t) == 1]
        words = [t for t in cands if len(t) > 1]
        ordered = (chars + words) if char_first else (words + chars)
        if ordered and code not in top_dict:
            top_dict[code] = ordered[0]
        if len(ordered) > 1 and code not in sec_dict:
            sec_dict[code] = ordered[1]

    for code, cands in code_to_candidates.items():
        process_cands(code, cands, cf_top_word, cf_second_word, char_first=True)
        process_cands(code, cands, wf_top_word, wf_second_word, char_first=False)

    for clean, cands in clean_to_candidates.items():
        process_cands(clean, cands, cf_top_word, cf_second_word, char_first=True)
        process_cands(clean, cands, wf_top_word, wf_second_word, char_first=False)

    out = [
        "-- Auto-generated pure shape dictionary dual-track maps & sets",
        "local M = {",
        "  char_first = {",
        "    dict_map = {",
    ]
    for code, text in sorted(cf_top_word.items()):
        out.append(f"      [{json.dumps(code, ensure_ascii=False)}] = {json.dumps(text, ensure_ascii=False)},")
    out.append("    },")
    out.append("    dict_map_2 = {")
    for code, text in sorted(cf_second_word.items()):
        out.append(f"      [{json.dumps(code, ensure_ascii=False)}] = {json.dumps(text, ensure_ascii=False)},")
    out.append("    },")
    out.append("  },")

    out.append("  word_first = {")
    out.append("    dict_map = {")
    for code, text in sorted(wf_top_word.items()):
        out.append(f"      [{json.dumps(code, ensure_ascii=False)}] = {json.dumps(text, ensure_ascii=False)},")
    out.append("    },")
    out.append("    dict_map_2 = {")
    for code, text in sorted(wf_second_word.items()):
        out.append(f"      [{json.dumps(code, ensure_ascii=False)}] = {json.dumps(text, ensure_ascii=False)},")
    out.append("    },")
    out.append("  },")

    out.append("  words_4code = {")
    for c in sorted(words_4code):
        out.append(f"    [{json.dumps(c, ensure_ascii=False)}] = true,")
    out.append("  },")

    out.append("  chars_3code = {")
    for c in sorted(chars_3code):
        out.append(f"    [{json.dumps(c, ensure_ascii=False)}] = true,")
    out.append("  },")

    out.append("  brief_map = {")
    for code, text in sorted(brief_map.items()):
        out.append(f"    [{json.dumps(code, ensure_ascii=False)}] = {json.dumps(text, ensure_ascii=False)},")
    out.append("  },")

    out.append("  space_brief_map = {")
    for code, text in sorted(space_brief_map.items()):
        out.append(f"    [{json.dumps(code, ensure_ascii=False)}] = {json.dumps(text, ensure_ascii=False)},")
    out.append("  },")
    out.append("}")
    out.append("M.dict_map = M.char_first.dict_map")
    out.append("M.dict_map_2 = M.char_first.dict_map_2")
    out.append("return M")

    OUTPUT_LUA.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_LUA.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"Successfully generated {OUTPUT_LUA}")
    print(f"  - char_first dict_map entries: {len(cf_top_word)}")
    print(f"  - word_first dict_map entries: {len(wf_top_word)}")
    print(f"  - words_4code entries: {len(words_4code)}")
    print(f"  - chars_3code entries: {len(chars_3code)}")
    print(f"  - brief_map entries:   {len(brief_map)}")
    print(f"  - space_brief_map entries: {len(space_brief_map)}")


if __name__ == "__main__":
    generate()
