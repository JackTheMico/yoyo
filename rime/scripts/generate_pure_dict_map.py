#!/usr/bin/env python3
"""生成纯形顶屏静态映射表 (rime/lua/yoyo/data/pure_dict_map.lua)。

从 rime/yoyo-pure.dict.yaml 提取：
1. dict_map: 编码 -> 首选中文文本映射（按词典权重降序，字/词不分类）
2. dict_map_2: 编码 -> 次选中文文本映射（同码第二高频候选）
3. words_4code: 四码词集合（用于状态机区分合法4码词与非词自动切分）
4. chars_3code: 三码单字集合（用于状态机区分3码单字全码与两码字接一简）
从 rime/yoyo-user.dict.yaml（及主词表，防御性）额外提取：
5. space_brief_map: 空格并击简词映射（码形 %XY / %_X / %+X -> 词）
   —— 状态机 Pattern S 一击上屏用；% 码同样不进入其他映射。
   %XY = 双手+空格，%_X = 左手+空格，%+X = 右手+空格（见纯形统一心法）。

注：首选/次选严格按词典原始权重排序（yoyo-pure.dict.yaml 的 sort: by_weight），
不再区分单字/词组。例如 Q/ 编码下「所有」(权重 2.2M) 为首选、「幞」(权重 387) 为次选。
"""

import json
import sys
import unicodedata
from pathlib import Path


def _add_cand(cand_list, text, weight, idx):
    """向候选列表追加 (text, weight, idx)。

    按 text 去重，同一 text 保留权重最高者（同权重保留最先出现者）。
    weight 为 int，idx 为源文件行序号，用于同权重时稳定排序。
    """
    for i, (t, w, j) in enumerate(cand_list):
        if t == text:
            if weight > w:
                cand_list[i] = (text, weight, idx)
            return
    cand_list.append((text, weight, idx))


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
    space_brief_map = {}

    idx = 0  # 源文件行序号，用于同权重时的稳定排序（序号小者优先）

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

        clean_code = raw_code.replace("_", "").replace("+", "")

        # 记录 4 码词
        if len(clean_code) == 4 and len(text) > 1:
            words_4code.add(clean_code)
        # 记录 3 码单字（必须为单字汉字，排除标点符号与快符）
        elif len(clean_code) == 3 and len(text) == 1 and unicodedata.category(text).startswith("L"):
            chars_3code.add(clean_code)

        # 解析权重（第三列，整数）；缺失或非整数按 0 处理
        weight = 0
        if len(parts) >= 3:
            try:
                weight = int(parts[2])
            except ValueError:
                weight = 0

        # 候选词列表：存 (text, weight, idx)，按 text 去重并保留最高权重
        cand_list = code_to_candidates.setdefault(raw_code, [])
        _add_cand(cand_list, text, weight, idx)

        clean_cand_list = clean_to_candidates.setdefault(clean_code, [])
        _add_cand(clean_cand_list, text, weight, idx)

        idx += 1

    # 单轨：首选/次选严格按权重降序（同权重按文件行序稳定），不区分单字/词组
    top_word = {}
    second_word = {}

    def process_cands(code, cands, top_dict, sec_dict):
        if not cands or code in top_dict:
            return
        # 按权重降序、同权重按文件行序升序稳定排序，取首选/次选
        ordered = sorted(cands, key=lambda x: (-x[1], x[2]))
        top_dict[code] = ordered[0][0]
        if len(ordered) > 1:
            sec_dict[code] = ordered[1][0]

    for code, cands in code_to_candidates.items():
        process_cands(code, cands, top_word, second_word)

    for clean, cands in clean_to_candidates.items():
        process_cands(clean, cands, top_word, second_word)

    out = [
        "-- Auto-generated pure shape dictionary maps & sets (weight-ordered, single track)",
        "local M = {",
        "  dict_map = {",
    ]
    for code, text in sorted(top_word.items()):
        out.append(f"    [{json.dumps(code, ensure_ascii=False)}] = {json.dumps(text, ensure_ascii=False)},")
    out.append("  },")
    out.append("  dict_map_2 = {")
    for code, text in sorted(second_word.items()):
        out.append(f"    [{json.dumps(code, ensure_ascii=False)}] = {json.dumps(text, ensure_ascii=False)},")
    out.append("  },")

    out.append("  words_4code = {")
    for c in sorted(words_4code):
        out.append(f"    [{json.dumps(c, ensure_ascii=False)}] = true,")
    out.append("  },")

    out.append("  chars_3code = {")
    for c in sorted(chars_3code):
        out.append(f"    [{json.dumps(c, ensure_ascii=False)}] = true,")
    out.append("  },")

    out.append("  space_brief_map = {")
    for code, text in sorted(space_brief_map.items()):
        out.append(f"    [{json.dumps(code, ensure_ascii=False)}] = {json.dumps(text, ensure_ascii=False)},")
    out.append("  },")
    out.append("}")
    out.append("return M")

    OUTPUT_LUA.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_LUA.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"Successfully generated {OUTPUT_LUA}")
    print(f"  - dict_map entries: {len(top_word)}")
    print(f"  - dict_map_2 entries: {len(second_word)}")
    print(f"  - words_4code entries: {len(words_4code)}")
    print(f"  - chars_3code entries: {len(chars_3code)}")
    print(f"  - space_brief_map entries: {len(space_brief_map)}")


if __name__ == "__main__":
    generate()
