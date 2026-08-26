#!/usr/bin/env python3
"""小说写作语料抽取与纯空码位零重码优选流水线 (extract_novel_corpus.py)。

功能：
1. 读取 rime/scripts/data/novel_corpus/ 下的多维度小说与文学语料
2. 基于 yoyo-pure 单字字根，计算规范 4 码纯形编码
3. 严格比对现有词典（yoyo-pure.dict.yaml）的编码槽位
4. 筛选并优选出占用全新空码位的零重码新词（1 槽 1 词）
5. 输出标准格式的增量词条与冲突候选数据
"""

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
SOURCE_DICT = RIME_DIR / "yoyo-pure.dict.yaml"
CORPUS_DIR = SCRIPTS_DIR / "data" / "novel_corpus"
DATA_OUTPUT_DIR = SCRIPTS_DIR / "data"

CATEGORY_PRIORITY = {
    "网络小说/修真武侠": 100,
    "神态动作描写": 95,
    "外貌容貌描写": 90,
    "容颜身段描写": 85,
    "面庞表情描写": 80,
    "发型仪态描写": 75,
    "性格心理描写": 70,
    "写作三字词": 65,
    "写作通用语汇": 60,
    "古风文雅词汇": 55,
    "成语大辞典": 50,
    "古典文学词汇": 40,
}

CORPUS_FILES = {
    "yy_novel.json": "网络小说/修真武侠",
    "shentai_action.json": "神态动作描写",
    "waimao_desc.json": "外貌容貌描写",
    "beauty_desc.json": "容颜身段描写",
    "face_desc.json": "面庞表情描写",
    "hair_desc.json": "发型仪态描写",
    "character_trait.json": "性格心理描写",
    "writing_3words.json": "写作三字词",
    "writing_general.json": "写作通用语汇",
    "ancient_words.json": "古风文雅词汇",
    "idiom.json": "成语大辞典",
    "ancient_general.json": "古典文学词汇",
}


def load_pure_char_roots():
    """解析 yoyo-pure.dict.yaml，获取单字前两码字根表 (char -> 2-code prefix)"""
    if not SOURCE_DICT.exists():
        raise FileNotFoundError(f"Source dict {SOURCE_DICT} not found.")

    lines = SOURCE_DICT.read_text(encoding="utf-8").splitlines()
    char_roots = {}
    in_body = False

    for line in lines:
        if line.strip() == "...":
            in_body = True
            continue
        if not in_body or not line.strip() or line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) >= 2:
            text, code = parts[0], parts[1]
            if len(text) == 1 and not (code.startswith("_") or code.startswith("+")):
                if len(code) == 3:
                    char_roots[text] = code[:2]
                elif len(code) == 2 and text not in char_roots:
                    char_roots[text] = code

    return char_roots


def load_existing_dict_keys():
    """解析 yoyo-pure.dict.yaml，获取既有四码词集合与既有词汇集合"""
    lines = SOURCE_DICT.read_text(encoding="utf-8").splitlines()
    existing_words = set()
    existing_4codes = set()
    in_body = False

    for line in lines:
        if line.strip() == "...":
            in_body = True
            continue
        if not in_body or not line.strip() or line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) >= 2:
            text, code = parts[0], parts[1]
            if len(text) > 1:
                existing_words.add(text)
                if len(code) == 4 and not (code.startswith("_") or code.startswith("+")):
                    existing_4codes.add(code)

    return existing_words, existing_4codes


def encode_pure_word(word: str, char_roots: dict):
    """依据纯形统一流规则对词语编码为 4 码。
    2字词: AbAcBbBc
    3字词: AbBbCbCc
    4+字词: AbBbCbZb
    """
    for ch in word:
        if ch not in char_roots:
            return None

    if len(word) == 2:
        c1 = char_roots[word[0]]
        c2 = char_roots[word[1]]
        if len(c1) >= 2 and len(c2) >= 2:
            return c1[:2] + c2[:2]
    elif len(word) == 3:
        c1 = char_roots[word[0]][0]
        c2 = char_roots[word[1]][0]
        c3 = char_roots[word[2]]
        if len(c3) >= 2:
            return c1 + c2 + c3[:2]
    elif len(word) >= 4:
        c1 = char_roots[word[0]][0]
        c2 = char_roots[word[1]][0]
        c3 = char_roots[word[2]][0]
        cz = char_roots[word[-1]][0]
        return c1 + c2 + c3 + cz

    return None


def extract_and_filter_novel_corpus():
    """从本地语料库提取、编码并筛选出纯零重码小说词条"""
    char_roots = load_pure_char_roots()
    existing_words, existing_4codes = load_existing_dict_keys()

    word_regex = re.compile(r"^[\u4e00-\u9fa5]{2,10}$")
    raw_candidates = [] # list of (word, category)

    for filename, category in CORPUS_FILES.items():
        file_path = CORPUS_DIR / filename
        if not file_path.exists():
            continue
        try:
            data = json.loads(file_path.read_text(encoding="utf-8"))
            if isinstance(data, list):
                for item in data:
                    tok = None
                    if isinstance(item, dict):
                        tok = item.get("token") or item.get("word") or item.get("name")
                    elif isinstance(item, str):
                        tok = item
                    if tok and word_regex.match(tok) and tok not in existing_words:
                        raw_candidates.append((tok, category))
        except Exception as e:
            print(f"Warning: Failed to parse {filename}: {e}", file=sys.stderr)

    # 计算编码并按槽位分组
    empty_slots = defaultdict(list) # code -> list of (word, category)
    colliding_slots = defaultdict(list) # code -> list of (word, category)

    for word, category in raw_candidates:
        code = encode_pure_word(word, char_roots)
        if not code or len(code) != 4:
            continue
        if code in existing_4codes:
            colliding_slots[code].append((word, category))
        else:
            empty_slots[code].append((word, category))

    # 对全新空码位进行 1 槽 1 词优选
    zero_collision_entries = [] # list of (word, code, category)
    for code, cand_list in sorted(empty_slots.items()):
        # 排序策略：类别优先级降序 > 词长适中 (4字/3字/2字优先) > 字典序
        cand_list.sort(
            key=lambda x: (
                -CATEGORY_PRIORITY.get(x[1], 0),
                0 if len(x[0]) in (4, 3, 2) else 1,
                x[0],
            )
        )
        best_word, best_cat = cand_list[0]
        zero_collision_entries.append((best_word, code, best_cat))

    return zero_collision_entries, colliding_slots


def main():
    DATA_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print("开始抽取小说语料并进行纯空码位零重码优选...")
    zero_collision_entries, colliding_slots = extract_and_filter_novel_corpus()

    print(f"✓ 成功提取出零重码小说新词总数: {len(zero_collision_entries)} 条")
    print(f"✓ 识别出编码冲突候补编码槽总数: {len(colliding_slots)} 个")

    # 保存零重码词条 JSON
    zero_json_path = DATA_OUTPUT_DIR / "novel_zero_collision_words.json"
    zero_json_data = [
        {"text": text, "code": code, "category": cat}
        for text, code, cat in zero_collision_entries
    ]
    zero_json_path.write_text(
        json.dumps(zero_json_data, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"✓ 保存零重码词条数据: {zero_json_path}")

    # 保存冲突候补词条 JSON
    colliding_json_path = DATA_OUTPUT_DIR / "novel_colliding_candidates.json"
    colliding_json_data = {
        code: [{"text": t, "category": cat} for t, cat in cands]
        for code, cands in colliding_slots.items()
    }
    colliding_json_path.write_text(
        json.dumps(colliding_json_data, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"✓ 保存冲突候补词条数据: {colliding_json_path}")


if __name__ == "__main__":
    main()
