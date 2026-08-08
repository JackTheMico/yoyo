#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
输入法编码生成与重码可视化工具（仅用 Python 标准库，一键生成）

功能：
1. 根据 code.txt 和 elements.txt 生成单字编码（JSONL格式）
2. 根据词库生成多字词的全码和简码
3. 支持三种词库格式：chai格式、白霜格式、万象格式
4. 生成重码统计可视化报告
5. 输出 char.dict.yaml（单字）和 word.dict.yaml（多字词）

内置资源：code.txt、elements.txt、pinyin.txt、base.dict.yaml.gz

使用方法：
# 使用仓库内的完整输入，一键生成全部结果
python main.py

# 指定词库文件和格式
python main.py --ciku data/词库-chai.txt --format chai

# 只统计全码
python main.py -q

# 只统计简码
python main.py -j

# 全码和简码都统计（默认）
python main.py -a
"""

from __future__ import annotations

import gzip
import json
import re
import argparse
from pathlib import Path
from collections import defaultdict
from itertools import zip_longest

# ==================== 配置 ====================
BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DATA_DIR = BASE_DIR / 'data'
DEFAULT_OUTPUT_DIR = BASE_DIR / 'output'


def open_text(filepath: str):
    """透明读取普通文本或 gzip 文本。"""
    if str(filepath).endswith('.gz'):
        return gzip.open(filepath, 'rt', encoding='utf-8')
    return open(filepath, 'r', encoding='utf-8')


def load_config(filepath: str) -> dict:
    """读取本工具的受限 YAML 配置，无需安装 PyYAML。

    这里只解析 config.yaml 已公开的两类结构：多字词规则、简码设定。
    这是有意的约束：配置格式固定，脚本便可在全新的 Python 环境里直接运行。
    """
    config = {'多字词规则': [], '简码设定': []}
    section = None
    current_setting = None
    current_short = None

    with open(filepath, 'r', encoding='utf-8') as f:
        for line_no, raw in enumerate(f, 1):
            line = raw.split('#', 1)[0].rstrip()
            if not line.strip():
                continue
            text = line.strip()

            if not line[0].isspace():
                section = text.rstrip(':')
                continue

            if section == '多字词规则':
                match = re.fullmatch(r'-\s*([^:]+):\s*(\S+)', text)
                if not match:
                    raise ValueError(f'config.yaml 第 {line_no} 行无法解析: {raw.rstrip()}')
                config['多字词规则'].append({match.group(1): match.group(2)})
                continue

            if section != '简码设定':
                continue

            if text.startswith('- 词长:'):
                current_setting = {
                    '词长': int(text.split(':', 1)[1].strip()),
                    '出简配置': [],
                }
                config['简码设定'].append(current_setting)
                current_short = None
            elif text == '- 词长范围:':
                current_setting = {'词长范围': {}, '出简配置': []}
                config['简码设定'].append(current_setting)
                current_short = None
            elif text.startswith('最小值:') or text.startswith('最大值:'):
                if current_setting is None or '词长范围' not in current_setting:
                    raise ValueError(f'config.yaml 第 {line_no} 行缺少「词长范围」')
                key, value = text.split(':', 1)
                current_setting['词长范围'][key] = int(value.strip())
            elif text == '出简配置:':
                if current_setting is None:
                    raise ValueError(f'config.yaml 第 {line_no} 行缺少词长设定')
            elif text.startswith('- 码长:'):
                if current_setting is None:
                    raise ValueError(f'config.yaml 第 {line_no} 行缺少词长设定')
                current_short = {'码长': int(text.split(':', 1)[1].strip())}
                current_setting['出简配置'].append(current_short)
            elif text.startswith('数量:'):
                if current_short is None:
                    raise ValueError(f'config.yaml 第 {line_no} 行缺少「码长」')
                current_short['数量'] = int(text.split(':', 1)[1].strip())
            else:
                raise ValueError(f'config.yaml 第 {line_no} 行无法解析: {raw.rstrip()}')

    if not config['多字词规则']:
        raise ValueError('config.yaml 缺少「多字词规则」')
    for setting in config['简码设定']:
        for short in setting['出简配置']:
            if '数量' not in short:
                raise ValueError('config.yaml 的每个「码长」都必须指定「数量」')
    return config

# 声调映射表
TONE_MAP = {
    'ǚ': ('v', '3'), 'ǜ': ('v', '4'), 'ǘ': ('v', '2'), 'ǖ': ('v', '1'),
    'ā': ('a', '1'), 'á': ('a', '2'), 'ǎ': ('a', '3'), 'à': ('a', '4'),
    'ē': ('e', '1'), 'é': ('e', '2'), 'ě': ('e', '3'), 'è': ('e', '4'),
    'ī': ('i', '1'), 'í': ('i', '2'), 'ǐ': ('i', '3'), 'ì': ('i', '4'),
    'ō': ('o', '1'), 'ó': ('o', '2'), 'ǒ': ('o', '3'), 'ò': ('o', '4'),
    'ū': ('u', '1'), 'ú': ('u', '2'), 'ǔ': ('u', '3'), 'ù': ('u', '4'),
    'ü': ('v', '0'),
    'ň': ('n', '3'), 'ń': ('n', '2'), 'ǹ': ('n', '4'),
    'ḿ': ('m', '2'),
    '\u0300': ('', '4'),
    '\u0301': ('', '2'),
    '\u030C': ('', '3'),
}

TONE_MARKS = {
    'ā': ('a', 1), 'á': ('a', 2), 'ǎ': ('a', 3), 'à': ('a', 4),
    'ē': ('e', 1), 'é': ('e', 2), 'ě': ('e', 3), 'è': ('e', 4),
    'ī': ('i', 1), 'í': ('i', 2), 'ǐ': ('i', 3), 'ì': ('i', 4),
    'ō': ('o', 1), 'ó': ('o', 2), 'ǒ': ('o', 3), 'ò': ('o', 4),
    'ū': ('u', 1), 'ú': ('u', 2), 'ǔ': ('u', 3), 'ù': ('u', 4),
    'ǖ': ('v', 1), 'ǘ': ('v', 2), 'ǚ': ('v', 3), 'ǜ': ('v', 4),
    'ń': ('n', 2), 'ň': ('n', 3), 'ǹ': ('n', 4),
    'ḿ': ('m', 2),
    'ü': ('v', 0),
}

SINGLE_TIERS = [300, 500, 1500, 3000, 4500, 6000, "全部", "加权"]
MULTI_TIERS = [2000, 5000, 10000, 20000, 40000, 60000, "全部", "加权"]


# ==================== 拼音处理 ====================
def convert_pinyin_tone(pinyin: str) -> str:
    """将带声调标记的拼音转换为 '英文字母+数字声调' 形式"""
    tone_digit = '0'
    result = []
    for char in pinyin:
        if char in TONE_MAP:
            plain_vowel, digit = TONE_MAP[char]
            result.append(plain_vowel)
            tone_digit = digit
        else:
            result.append(char)
    return ''.join(result) + tone_digit


def tone_mark_to_number(syllable):
    """将带声调标记的音节转换为数字声调形式"""
    result = []
    tone = 0
    for ch in syllable:
        if ch in TONE_MARKS:
            base, t = TONE_MARKS[ch]
            result.append(base)
            if t > 0:
                tone = t
        else:
            result.append(ch)
    if tone > 0:
        result.append(str(tone))
    return ''.join(result)


def strip_tone(pinyin: str) -> str:
    """去掉数字声调，并规范化 ü → v，供无调匹配。"""
    if not pinyin:
        return ''
    s = pinyin.replace('ü', 'v').replace('Ü', 'v').lower()
    if s[-1] in '01234':
        s = s[:-1]
    return s


# ==================== 数据加载 ====================
def load_pinyin_by_char(filepath: str) -> dict:
    """加载 pinyin.txt，按字分组返回"""
    pinyin_data = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split('\t')
            if len(parts) >= 3:
                char = parts[0]
                raw_pinyin = parts[1]
                weight = int(parts[2])
                converted_pinyin = convert_pinyin_tone(raw_pinyin)
                if char not in pinyin_data:
                    pinyin_data[char] = []
                pinyin_data[char].append({
                    'ori_pinyin': raw_pinyin,
                    'pinyin': converted_pinyin,
                    'weight': weight
                })
    return pinyin_data


def load_aligned_data(code_filepath: str, elements_filepath: str):
    """加载 code.txt 和 elements.txt，按行号对齐"""
    aligned_data = []
    with open(code_filepath, 'r', encoding='utf-8') as code_f, \
         open(elements_filepath, 'r', encoding='utf-8') as elements_f:
        for line_no, pair in enumerate(zip_longest(code_f, elements_f), 1):
            line_code, line_elements = pair
            if line_code is None or line_elements is None:
                raise ValueError(
                    f'code.txt 与 elements.txt 行数不同（第 {line_no} 行开始不对齐）'
                )
            line_code = line_code.strip()
            line_elements = line_elements.strip()
            if not line_code and not line_elements:
                continue
            if not line_code or not line_elements:
                raise ValueError(
                    f'code.txt 与 elements.txt 第 {line_no} 行空行位置不同'
                )
            parts_code = line_code.split('\t')
            parts_elements = line_elements.split('\t')
            if len(parts_code) >= 5 and len(parts_elements) >= 3:
                char = parts_code[0]
                if char != parts_elements[0]:
                    raise ValueError(
                        f'code.txt 与 elements.txt 第 {line_no} 行词条不同: '
                        f'{char!r} != {parts_elements[0]!r}'
                    )
                if len(char) != 1:
                    continue
                full_code = parts_code[1]
                short_code = parts_code[3]
                element_weight = int(parts_elements[2])
                aligned_data.append({
                    'char': char,
                    'full_code': full_code,
                    'short_code': short_code,
                    'weight': element_weight
                })
    return aligned_data


def generate_zi_jsonl(aligned_data: list, pinyin_data: dict, output_filepath: str) -> list:
    """生成单字 JSONL 文件"""
    results = []
    missing_pinyin_count = 0
    char_codes = {}
    for item in aligned_data:
        char = item['char']
        if char not in char_codes:
            char_codes[char] = []
        char_codes[char].append({
            'full_code': item['full_code'],
            'short_code': item['short_code'],
            'weight': item['weight']
        })

    for char, codes in char_codes.items():
        pinyin_list = pinyin_data.get(char, [])
        for i, code_info in enumerate(codes):
            if i < len(pinyin_list):
                pinyin = pinyin_list[i]['pinyin']
                ori_pinyin = pinyin_list[i]['ori_pinyin']
            else:
                pinyin = ''
                ori_pinyin = ''
                missing_pinyin_count += 1
            record = {
                'name': char,
                'pinyin': pinyin,
                'ori_pinyin': ori_pinyin,
                'full_code': code_info['full_code'],
                'short_code': code_info['short_code'],
                'weight': code_info['weight']
            }
            results.append(record)

    with open(output_filepath, 'w', encoding='utf-8') as f:
        for record in results:
            f.write(json.dumps(record, ensure_ascii=False) + '\n')

    if missing_pinyin_count > 0:
        print(f"   警告: {missing_pinyin_count} 个code行在 pinyin.txt 中没有对应拼音")

    return results


# ==================== 词库解析 ====================
def load_dict_chai(filepath: str):
    """解析 chai 格式词库：词语\t拼音数字\t权重"""
    words = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split('\t')
            if len(parts) >= 3:
                word = parts[0]
                pinyin = parts[1]
                try:
                    weight = int(parts[2])
                except ValueError:
                    weight = 0
                words.append({'name': word, 'pinyin': pinyin, 'weight': weight})
    return words


def load_dict_base(filepath: str):
    """解析白霜格式词库（base.dict.yaml）：词语 拼音 权重"""
    words = []
    in_data = False
    with open_text(filepath) as f:
        for line in f:
            line = line.strip()
            if not in_data:
                in_data = line == '...'
                continue
            if not line or line.startswith('#'):
                continue
            parts = line.split()
            if len(parts) >= 2:
                word = parts[0]
                weight = 0
                for i in range(len(parts)-1, 0, -1):
                    try:
                        weight = int(parts[i])
                        pinyin = ' '.join(parts[1:i])
                        break
                    except ValueError:
                        continue
                else:
                    pinyin = ' '.join(parts[1:])
                words.append({'name': word, 'pinyin': pinyin, 'weight': weight})
    return words


def load_dict_wanxiang(filepath: str):
    """解析万象格式词库（jichu.dict.yaml）：词语\t带调拼音\t权重"""
    words = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or line.startswith('---') or line == '...':
                continue
            if line.startswith('name:') or line.startswith('version:') or line.startswith('sort:'):
                continue
            parts = line.split('\t')
            if len(parts) >= 3:
                word = parts[0]
                pinyin = parts[1]
                try:
                    weight = int(parts[2])
                except ValueError:
                    weight = 0
                words.append({'name': word, 'pinyin': pinyin, 'weight': weight})
    return words


def load_ciku(filepath: str, format_type: str):
    """根据格式类型加载词库"""
    if format_type == 'chai':
        return load_dict_chai(filepath)
    elif format_type == 'base':
        return load_dict_base(filepath)
    elif format_type == 'wanxiang':
        return load_dict_wanxiang(filepath)
    else:
        raise ValueError(f"不支持的词库格式: {format_type}")


# ==================== 编码生成 ====================
def load_zi_data(filepath: str):
    """加载单字编码数据，支持精确/无调/按读音权重回退匹配。

    返回:
      exact_map: (字, 带调拼音) → 全码
      toneless_map: (字, 无调拼音) → [(weight, code), ...]，按 weight 降序
      char_readings: 字 → [(weight, code), ...]，按 weight 降序
    """
    exact_map = {}
    toneless_map = defaultdict(list)
    char_readings = defaultdict(list)
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            data = json.loads(line)
            char = data['name']
            pinyin = data['pinyin']
            code = data['full_code']
            try:
                weight = int(data.get('weight', 0))
            except (TypeError, ValueError):
                weight = 0
            exact_map[(char, pinyin)] = code
            entry = (weight, code)
            toneless_map[(char, strip_tone(pinyin))].append(entry)
            char_readings[char].append(entry)

    for key in toneless_map:
        toneless_map[key].sort(key=lambda item: item[0], reverse=True)
    for char in char_readings:
        char_readings[char].sort(key=lambda item: item[0], reverse=True)

    return exact_map, dict(toneless_map), dict(char_readings)


def resolve_char_code(char: str, pinyin: str, exact_map: dict,
                      toneless_map: dict, char_readings: dict):
    """按 精确带调 → 无调匹配 → 该字最高权读音 解析单字全码。

    返回 (全码, 匹配方式)；匹配方式为 exact / toneless / weight；失败为 (None, None)。
    无调仍对应多个读音时，取 weight 最高者。
    """
    if not char:
        return None, None

    exact = exact_map.get((char, pinyin))
    if exact is not None:
        return exact, 'exact'

    toneless = strip_tone(pinyin)
    candidates = toneless_map.get((char, toneless))
    if candidates:
        return candidates[0][1], 'toneless'

    readings = char_readings.get(char)
    if readings:
        return readings[0][1], 'weight'
    return None, None


def parse_formula(formula_str: str):
    """解析编码公式，如 AaAbBaBb"""
    tokens = []
    i = 0
    while i < len(formula_str) - 1:
        upper = formula_str[i]
        lower = formula_str[i + 1]
        if upper.isupper() and lower.islower():
            tokens.append((upper, lower))
        i += 2
    return tokens


def resolve_char_index(char_ref: str, word_len: int):
    """解析字符位置引用"""
    if char_ref == 'Z':
        return word_len - 1
    elif char_ref == 'Y':
        return word_len - 2
    else:
        return ord(char_ref) - ord('A')


def resolve_pos_index(pos_ref: str, code_len: int):
    """解析编码位置引用"""
    if pos_ref == 'z':
        return code_len - 1
    elif pos_ref == 'y':
        return code_len - 2
    else:
        return ord(pos_ref) - ord('a')


def generate_full_code(word: str, char_codes: list, formula_tokens: list):
    """根据公式生成全码"""
    word_len = len(word)
    result = []
    for char_ref, pos_ref in formula_tokens:
        char_idx = resolve_char_index(char_ref, word_len)
        if char_idx < 0 or char_idx >= word_len:
            continue
        code = char_codes[char_idx]
        code_len = len(code)
        pos_idx = resolve_pos_index(pos_ref, code_len)
        if pos_idx < 0 or pos_idx >= code_len:
            continue
        result.append(code[pos_idx])
    return ''.join(result)


def get_formula_for_word_len(config: dict, word_len: int):
    """根据词长获取编码公式"""
    rules = config.get('多字词规则', [])
    for rule in rules:
        if isinstance(rule, dict):
            for key, formula in rule.items():
                if '到' in key:
                    match = re.search(r'(\d+)到(\d+)', key)
                    if match:
                        min_len = int(match.group(1))
                        max_len = int(match.group(2))
                        if min_len <= word_len <= max_len:
                            return formula
                else:
                    match = re.search(r'(\d+)字词', key)
                    if match:
                        target_len = int(match.group(1))
                        if word_len == target_len:
                            return formula
    return None


def get_short_code_setting(config: dict, word_len: int):
    """获取匹配的简码设定条目（整条 setting）"""
    settings = config.get('简码设定', [])
    for setting in settings:
        if '词长' in setting and '词长范围' not in setting:
            if setting['词长'] == word_len:
                return setting
        elif '词长范围' in setting:
            range_cfg = setting['词长范围']
            if range_cfg['最小值'] <= word_len <= range_cfg['最大值']:
                return setting
    return None


def _short_code_group_key(setting: dict, word_len: int):
    """同一出简配额池的分组键。

    - 精确「词长」：该长度单独一池
    - 「词长范围」：范围内所有词长共享一池（数量配额不按长度重复计算）
    """
    if setting is None:
        return ('none', word_len)
    if '词长范围' in setting:
        range_cfg = setting['词长范围']
        return ('range', range_cfg['最小值'], range_cfg['最大值'])
    return ('len', setting['词长'])


def generate_short_codes(results: list, config: dict):
    """生成简码。

    配额语义：同一简码设定条目内，每个前缀最多分配「数量」个简码；
    「词长范围」下各词长共享该配额，而不是每个词长各自一份。
    """
    groups = defaultdict(list)
    setting_by_key = {}

    for i, word_data in enumerate(results):
        word_len = len(word_data['name'])
        setting = get_short_code_setting(config, word_len)
        key = _short_code_group_key(setting, word_len)
        groups[key].append(i)
        if setting is not None:
            setting_by_key[key] = setting

    for key, indices in groups.items():
        indices.sort(key=lambda i: results[i]['weight'], reverse=True)
        setting = setting_by_key.get(key)
        short_config = setting.get('出简配置', []) if setting else []
        if not short_config:
            for i in indices:
                results[i]['short_code'] = results[i]['full_code']
            continue

        short_config_sorted = sorted(short_config, key=lambda x: x['码长'])
        assigned = set()

        for cfg in short_config_sorted:
            code_len = cfg['码长']
            max_count = cfg['数量']
            prefix_count = defaultdict(int)
            for i in indices:
                if i in assigned:
                    continue
                full_code = results[i]['full_code']
                if len(full_code) < code_len:
                    continue
                prefix = full_code[:code_len]
                if prefix_count[prefix] < max_count:
                    results[i]['short_code'] = prefix
                    prefix_count[prefix] += 1
                    assigned.add(i)

        for i in indices:
            if i not in assigned:
                results[i]['short_code'] = results[i]['full_code']


def generate_word_codes(zi_jsonl_path: str, ciku_path: str, config: dict, 
                        output_path: str, format_type: str):
    """生成多字词编码"""
    print("加载单字词编码数据...")
    exact_map, toneless_map, char_readings = load_zi_data(zi_jsonl_path)
    print(f"加载了 {len(exact_map)} 个单字编码")

    print(f"解析词库 ({format_type} 格式)...")
    ciku_words = load_ciku(ciku_path, format_type)
    print(f"解析了 {len(ciku_words)} 个词语")

    print("生成全码...")
    results = []
    skipped = 0
    match_counts = {'exact': 0, 'toneless': 0, 'weight': 0}

    for word_data in ciku_words:
        word = word_data['name']
        pinyin_input = word_data['pinyin']
        weight = word_data['weight']
        word_len = len(word)

        if word_len < 2:
            skipped += 1
            continue

        if format_type == 'chai':
            pinyin_parts = pinyin_input.split()
            pinyin_with_tone = pinyin_input
            ori_pinyin = pinyin_input
        else:
            pinyin_parts = pinyin_input.split()
            if len(pinyin_parts) != word_len:
                skipped += 1
                continue
            pinyin_with_tone = pinyin_input
            ori_pinyin = ' '.join(tone_mark_to_number(p) for p in pinyin_parts)

        char_codes = []
        skip = False
        for i, ch in enumerate(word):
            if format_type == 'chai':
                tone_num_pinyin = pinyin_parts[i] if i < len(pinyin_parts) else ''
            else:
                tone_num_pinyin = tone_mark_to_number(pinyin_parts[i])
            code, how = resolve_char_code(
                ch, tone_num_pinyin, exact_map, toneless_map, char_readings
            )
            if code is None:
                skip = True
                break
            match_counts[how] += 1
            char_codes.append(code)

        if skip or len(char_codes) != word_len:
            skipped += 1
            continue

        formula = get_formula_for_word_len(config, word_len)
        if formula is None:
            skipped += 1
            continue

        formula_tokens = parse_formula(formula)
        full_code = generate_full_code(word, char_codes, formula_tokens)

        if not full_code:
            skipped += 1
            continue

        results.append({
            'name': word,
            'pinyin': pinyin_with_tone,
            'ori_pinyin': ori_pinyin,
            'full_code': full_code,
            'weight': weight,
        })

    print(
        f"成功生成 {len(results)} 个全码，跳过 {skipped} 个；"
        f"音节匹配 exact={match_counts['exact']} "
        f"toneless={match_counts['toneless']} "
        f"weight={match_counts['weight']}"
    )

    print("生成简码...")
    generate_short_codes(results, config)

    print(f"写入输出文件: {output_path}")
    with open(output_path, 'w', encoding='utf-8') as f:
        for item in results:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')

    return results


# ==================== 重码统计 ====================
def is_single_char(word: str) -> bool:
    return len(word) == 1


def is_valid_simple_dup(code: str) -> bool:
    return len(code) >= 6


def get_words_by_weight(codes: dict, weights: dict, word_type: str):
    """按权重排序获取词语列表"""
    if isinstance(codes, dict) and "full" in codes:
        code_dict = codes["full"]
    else:
        code_dict = codes
    words = [w for w in code_dict.keys() if (is_single_char(w) if word_type == "single" else not is_single_char(w))]
    words.sort(key=lambda w: weights.get(w, 0), reverse=True)
    return words


def find_duplicates_in_top_n(words: list, codes: dict, weights: dict, n, code_type: str = "full"):
    """查找前N个词中的重码"""
    code_dict = codes.get(code_type, codes) if isinstance(codes, dict) else codes

    if n == "全部":
        subset = words
    elif n == "加权":
        return find_weighted_duplicates(words, codes, weights, code_type)
    else:
        subset = words[:n]

    code_to_words = defaultdict(list)
    for word in subset:
        code = code_dict[word]
        if code_type == "simple" and not is_valid_simple_dup(code):
            continue
        code_to_words[code].append(word)

    duplicate_codes = {code: ws for code, ws in code_to_words.items() if len(ws) > 1}

    dup_groups = []
    for code, ws in duplicate_codes.items():
        max_weight = max(weights.get(w, 0) for w in ws)
        dup_groups.append((ws, code, max_weight))

    dup_groups.sort(key=lambda x: x[2], reverse=True)
    return dup_groups


def find_weighted_duplicates(words: list, codes: dict, weights: dict, code_type: str = "full"):
    """查找加权重码"""
    if isinstance(codes, dict) and "full" in codes:
        code_dict = codes[code_type]
    else:
        code_dict = codes

    total_weight = sum(weights.get(w, 0) for w in words)
    dup_groups = []

    code_to_words = defaultdict(list)
    for word in words:
        code = code_dict[word]
        if code_type == "simple" and not is_valid_simple_dup(code):
            continue
        code_to_words[code].append(word)

    for code, ws in code_to_words.items():
        if len(ws) > 1:
            dup_weight = sum(weights.get(w, 0) for w in ws)
            dup_pct = (dup_weight / total_weight * 100) if total_weight > 0 else 0
            max_weight = max(weights.get(w, 0) for w in ws)
            dup_groups.append((ws, code, max_weight, dup_pct, dup_weight))

    if dup_groups:
        dup_groups.sort(key=lambda x: x[3], reverse=True)

    return [(ws, code, max_w) for ws, code, max_w, pct, wt in dup_groups], \
           [(ws, code, max_w, pct) for ws, code, max_w, pct, wt in dup_groups]


def write_detail_file(filepath: str, dup_groups: list, weights: dict):
    """写入重码详情文件"""
    with open(filepath, "w", encoding="utf-8") as f:
        for item in dup_groups:
            ws, code = item[0], item[1]
            words_str = "\t".join(f"{w}({weights.get(w, 0)})" for w in ws)
            f.write(f"{code}\t{words_str}\n")


def generate_stats(codes: dict, weights: dict, word_type: str, tiers: list, 
                   output_dir: Path, code_type: str = "full", prefix_suffix: str = ""):
    """生成重码统计"""
    output_dir.mkdir(parents=True, exist_ok=True)

    words = get_words_by_weight(codes, weights, word_type)
    total_count = len(words)
    total_weight = sum(weights.get(w, 0) for w in words)

    prefix = f"单字{prefix_suffix}" if word_type == "single" else f"多字{prefix_suffix}"
    print(f"\n{'='*60}")
    print(f"{prefix}词重码统计表")
    print(f"{'='*60}")
    print(f"{'层级':<12} {'重码数':<10} {'详情文件'}")
    print("-" * 60)

    results = []
    weighted_dup_groups = None
    weighted_dup_groups_with_pct = None

    for tier in tiers:
        if tier == "加权":
            if weighted_dup_groups is None:
                weighted_dup_groups, weighted_dup_groups_with_pct = find_weighted_duplicates(words, codes, weights, code_type)
            dup_count = len(weighted_dup_groups)
            dup_weight_pct = sum(pct for _, _, _, pct in weighted_dup_groups_with_pct)

            detail_file = output_dir / f"{prefix}_加权.txt"
            write_detail_file(str(detail_file), weighted_dup_groups, weights)
            abs_path = str(detail_file.resolve())

            print(f"{'加权':<12} {dup_count:<10} {abs_path}")
            print(f"  -> 加权重码百分比: {dup_weight_pct:.2f}%")
            results.append(("加权", dup_count, dup_weight_pct, abs_path))
        elif tier == "全部":
            dup_groups = find_duplicates_in_top_n(words, codes, weights, "全部", code_type)
            dup_count = len(dup_groups)

            detail_file = output_dir / f"{prefix}_全部.txt"
            write_detail_file(str(detail_file), dup_groups, weights)
            abs_path = str(detail_file.resolve())

            all_weight = sum(weights.get(w, 0) for w in words)
            dup_weight = sum(max(weights.get(w, 0) for w in ws) for ws, *_ in dup_groups)
            dup_weight_pct = (dup_weight / all_weight * 100) if all_weight > 0 else 0

            print(f"{'全部':<12} {dup_count:<10} {abs_path}")
            results.append(("全部", dup_count, dup_weight_pct, abs_path))
        else:
            dup_groups = find_duplicates_in_top_n(words, codes, weights, tier, code_type)
            dup_count = len(dup_groups)

            detail_file = output_dir / f"{prefix}_前{tier}.txt"
            write_detail_file(str(detail_file), dup_groups, weights)
            abs_path = str(detail_file.resolve())

            subset_words = words[:tier]
            subset_weight = sum(weights.get(w, 0) for w in subset_words)
            dup_weight = sum(max(weights.get(w, 0) for w in ws) for ws, *_ in dup_groups)
            dup_weight_pct = (dup_weight / subset_weight * 100) if subset_weight > 0 else 0

            print(f"{f'前{tier}':<12} {dup_count:<10} {abs_path}")
            results.append((f"前{tier}", dup_count, dup_weight_pct, abs_path))

    return results


def load_codes_for_stats(jsonl_path: str):
    """加载编码数据用于统计"""
    full_codes = {}
    simple_codes = {}
    weights = {}

    with open(jsonl_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                data = json.loads(line)
                word = data.get("name", "")
                if not word:
                    continue
                full_codes[word] = data.get("full_code", "")
                simple_codes[word] = data.get("short_code", "")
                try:
                    weights[word] = int(data.get("weight", 0))
                except ValueError:
                    weights[word] = 0
            except json.JSONDecodeError:
                continue

    return {"full": full_codes, "simple": simple_codes}, weights


# ==================== YAML输出 ====================
def _decorate_letters(code: str, kind: str, prefix: str | None = None) -> str:
    """把裸字母码转成 remap/assign/fill 所需的 Rime schema 码型。

    字：2=`_XX`/`+XX`，4=`!XXXX@`，6=`!XXXX@-XX`
    词：2=`<XX`/`>XX`，更长码保持裸字母
    """
    if not code or not code.isalpha():
        return code
    n = len(code)
    if kind == 'char':
        if n == 2:
            if prefix not in ('_', '+'):
                raise ValueError(f'单字两码需要 _/+ 前缀，得到 {prefix!r}')
            return f'{prefix}{code}'
        if n == 4:
            return f'!{code}@'
        if n == 6:
            return f'!{code[:4]}@-{code[4:]}'
        return code
    if n == 2:
        if prefix not in ('<', '>'):
            raise ValueError(f'词两码需要 </> 前缀，得到 {prefix!r}')
        return f'{prefix}{code}'
    return code


def convert_to_yaml(input_jsonl: str, output_yaml: str, dict_name: str,
                    kind: str | None = None):
    """将 JSONL 转换为 YAML 格式（Rime字典格式，含 schema 码型装饰）。"""
    if kind is None:
        kind = 'char' if 'char' in dict_name else 'word'
    if kind not in ('char', 'word'):
        raise ValueError(f'kind 必须是 char 或 word，得到 {kind!r}')

    two_prefixes = ('_', '+') if kind == 'char' else ('<', '>')
    records = []
    with open(input_jsonl, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            data = json.loads(line)
            name = data.get('name')
            full_code = data.get('full_code') or ''
            short_code = data.get('short_code') or ''
            try:
                weight = int(data.get('weight', 0))
            except (TypeError, ValueError):
                weight = 0
            if not name or not full_code:
                continue
            records.append({
                'name': name,
                'full_code': full_code,
                'short_code': short_code,
                'weight': weight,
                'two_prefix': None,
            })

    # 多音字：整字最多保留一条二简（权重最高的读音）；其余读音退到四码。
    if kind == 'char':
        by_name_two = defaultdict(list)
        for i, rec in enumerate(records):
            short = rec['short_code']
            if short and short != rec['full_code'] and len(short) == 2 and short.isalpha():
                by_name_two[rec['name']].append(i)
        for idxs in by_name_two.values():
            if len(idxs) <= 1:
                continue
            idxs.sort(key=lambda i: records[i]['weight'], reverse=True)
            for i in idxs[1:]:
                full = records[i]['full_code']
                records[i]['short_code'] = full[:4] if len(full) >= 4 else full

    by_two = defaultdict(list)
    for i, rec in enumerate(records):
        short = rec['short_code']
        if short and short != rec['full_code'] and len(short) == 2 and short.isalpha():
            by_two[short].append(i)
    for idxs in by_two.values():
        idxs.sort(key=lambda i: records[i]['weight'], reverse=True)
        for rank, i in enumerate(idxs):
            if rank < len(two_prefixes):
                records[i]['two_prefix'] = two_prefixes[rank]

    word_entries = {}
    for rec in records:
        name = rec['name']
        full_code = rec['full_code']
        short_code = rec['short_code']
        weight = rec['weight']
        if name not in word_entries:
            word_entries[name] = []

        decorated_full = _decorate_letters(full_code, kind)
        if (
            short_code
            and short_code != full_code
            and short_code.isalpha()
            and (len(short_code) != 2 or rec['two_prefix'] is not None)
        ):
            prefix = rec['two_prefix'] if len(short_code) == 2 else None
            decorated_short = _decorate_letters(short_code, kind, prefix)
            word_entries[name].append([name, decorated_short, weight])
            word_entries[name].append([name, decorated_full, 0])
        else:
            word_entries[name].append([name, decorated_full, weight])

    sorted_words = sorted(
        word_entries.items(),
        key=lambda x: x[1][0][2] if x[1] else 0,
        reverse=True,
    )

    with open(output_yaml, 'w', encoding='utf-8') as f:
        f.write('# Rime dictionary\n')
        f.write('# encoding: utf-8\n')
        f.write('---\n')
        f.write(f'name: {dict_name}\n')
        f.write('sort: by_weight\n')
        f.write("version: '1.0'\n")
        f.write('...\n')
        for word, entries in sorted_words:
            for entry in entries:
                f.write(f"{entry[0]}\t{entry[1]}\t{entry[2]}\n")


# ==================== 主程序 ====================
def validate_inputs(args, parser, output_dir: Path):
    """在写任何输出前验证输入，避免跑到中途才发现缺文件。"""
    required = []
    if not args.skip_zi:
        required.extend([
            ('code.txt', args.code),
            ('elements.txt', args.elements),
            ('pinyin.txt', args.pinyin),
        ])
    if not args.skip_word:
        required.extend([
            ('词库', args.ciku),
            ('配置', args.config),
        ])

    missing = [f'{label}: {path}' for label, path in required if not Path(path).is_file()]
    if args.skip_zi and not (output_dir / 'zi.jsonl').is_file():
        missing.append(f"跳过单字时必须已有: {output_dir / 'zi.jsonl'}")
    if args.skip_word and not (output_dir / 'word.jsonl').is_file():
        missing.append(f"跳过多字词时必须已有: {output_dir / 'word.jsonl'}")
    if missing:
        parser.error('缺少输入文件:\n  ' + '\n  '.join(missing))


def main():
    parser = argparse.ArgumentParser(
        description='输入法编码生成与重码可视化工具',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 使用仓库内置的完整白霜基础词库，一键生成全部结果
  python main.py

  # 指定词库文件和格式
  python main.py --ciku /path/to/词库.txt --format chai

  # 只统计全码
  python main.py -q

  # 只统计简码
  python main.py -j

  # 全码和简码都统计
  python main.py -a

支持格式:
  chai     - chai格式: 词语\t拼音数字\t权重 (如: 姑父\tgu1 fu4\t6360)
  base     - 白霜格式: 词语 拼音 权重 (如: 姑父\tgu fu\t456)
  wanxiang - 万象格式: 词语\t带调拼音\t权重 (如: 姑父\tgū fu\t491)
        """
    )

    # 文件路径参数
    parser.add_argument('--code', default=str(DEFAULT_DATA_DIR / 'code.txt'),
                        help='code.txt 文件路径 (默认: data/code.txt)')
    parser.add_argument('--elements', default=str(DEFAULT_DATA_DIR / 'elements.txt'),
                        help='elements.txt 文件路径 (默认: data/elements.txt)')
    parser.add_argument('--pinyin', default=str(DEFAULT_DATA_DIR / 'pinyin.txt'),
                        help='pinyin.txt 文件路径 (默认: data/pinyin.txt，内置)')
    parser.add_argument('--ciku', default=str(DEFAULT_DATA_DIR / 'base.dict.yaml.gz'),
                        help='词库文件路径 (默认: data/base.dict.yaml.gz)')
    parser.add_argument('--config', default=str(BASE_DIR / 'config.yaml'),
                        help='配置文件路径 (默认: config.yaml)')
    parser.add_argument('--output-dir', default=str(DEFAULT_OUTPUT_DIR),
                        help='输出目录 (默认: output/)')
    parser.add_argument('--char-name', default='yoyo-yx-char',
                        help='单字 YAML 的 Rime 词典名 (默认: yoyo-yx-char)')
    parser.add_argument('--word-name', default='yoyo-yx-word',
                        help='多字词 YAML 的 Rime 词典名 (默认: yoyo-yx-word)')

    # 词库格式
    parser.add_argument('--format', choices=['chai', 'base', 'wanxiang'], default='base',
                        help='词库格式 (默认: base)')

    # 统计类型
    group = parser.add_mutually_exclusive_group()
    group.add_argument('-q', action='store_true', help='只统计全码')
    group.add_argument('-j', action='store_true', help='只统计简码')
    group.add_argument('-a', action='store_true', help='全码和简码都统计 (默认)')

    # 跳过步骤
    parser.add_argument('--skip-zi', action='store_true', help='跳过单字编码生成')
    parser.add_argument('--skip-word', action='store_true', help='跳过多字词编码生成')
    parser.add_argument('--skip-stats', action='store_true', help='跳过重码统计')
    parser.add_argument('--skip-yaml', action='store_true', help='跳过YAML输出')

    args = parser.parse_args()

    output_dir = Path(args.output_dir)
    validate_inputs(args, parser, output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    zi_jsonl_path = output_dir / 'zi.jsonl'
    word_jsonl_path = output_dir / 'word.jsonl'
    char_yaml_path = output_dir / 'char.dict.yaml'
    word_yaml_path = output_dir / 'word.dict.yaml'
    stats_dir = output_dir / '重码详情'

    print("=" * 70)
    print("输入法编码生成与重码可视化工具")
    print("=" * 70)

    # 步骤1: 生成单字编码
    if not args.skip_zi:
        print("\n【步骤1】生成单字编码...")
        print(f"  code.txt: {args.code}")
        print(f"  elements.txt: {args.elements}")
        print(f"  pinyin.txt: {args.pinyin}")

        pinyin_data = load_pinyin_by_char(args.pinyin)
        print(f"  加载了 {len(pinyin_data)} 个不同的字的拼音")

        aligned_data = load_aligned_data(args.code, args.elements)
        print(f"  加载了 {len(aligned_data)} 条对齐记录")

        results = generate_zi_jsonl(aligned_data, pinyin_data, str(zi_jsonl_path))
        print(f"  生成单字编码: {zi_jsonl_path} ({len(results)} 条)")
    else:
        print(f"\n【步骤1】跳过单字编码生成，使用已有文件: {zi_jsonl_path}")

    # 步骤2: 生成多字词编码
    if not args.skip_word:
        print(f"\n【步骤2】生成多字词编码...")
        print(f"  词库文件: {args.ciku}")
        print(f"  词库格式: {args.format}")

        config = load_config(args.config)

        results = generate_word_codes(
            str(zi_jsonl_path), args.ciku, config,
            str(word_jsonl_path), args.format
        )
        print(f"  生成多字词编码: {word_jsonl_path} ({len(results)} 条)")
    else:
        print(f"\n【步骤2】跳过多字词编码生成，使用已有文件: {word_jsonl_path}")

    # 步骤3: 重码统计
    if not args.skip_stats:
        print(f"\n【步骤3】重码统计...")

        # 合并单字和多字词数据
        all_codes = {"full": {}, "simple": {}}
        all_weights = {}

        # 加载单字
        if zi_jsonl_path.exists():
            codes, weights = load_codes_for_stats(str(zi_jsonl_path))
            all_codes["full"].update(codes["full"])
            all_codes["simple"].update(codes["simple"])
            all_weights.update(weights)

        # 加载多字词
        if word_jsonl_path.exists():
            codes, weights = load_codes_for_stats(str(word_jsonl_path))
            all_codes["full"].update(codes["full"])
            all_codes["simple"].update(codes["simple"])
            all_weights.update(weights)

        single_count = sum(1 for w in all_codes["full"] if is_single_char(w))
        multi_count = len(all_codes["full"]) - single_count
        print(f"总词数: {len(all_codes['full'])} (单字: {single_count}, 多字: {multi_count})")

        if args.q:
            generate_stats(all_codes, all_weights, "single", SINGLE_TIERS, stats_dir, "full", "_全码")
            generate_stats(all_codes, all_weights, "multi", MULTI_TIERS, stats_dir, "full", "_全码")
        elif args.j:
            generate_stats(all_codes, all_weights, "single", SINGLE_TIERS, stats_dir, "simple", "_简码")
            generate_stats(all_codes, all_weights, "multi", MULTI_TIERS, stats_dir, "simple", "_简码")
        else:  # 默认或 -a
            generate_stats(all_codes, all_weights, "single", SINGLE_TIERS, stats_dir, "full", "_全码")
            generate_stats(all_codes, all_weights, "multi", MULTI_TIERS, stats_dir, "full", "_全码")
            generate_stats(all_codes, all_weights, "single", SINGLE_TIERS, stats_dir, "simple", "_简码")
            generate_stats(all_codes, all_weights, "multi", MULTI_TIERS, stats_dir, "simple", "_简码")

        print(f"\n重码详情目录: {stats_dir.resolve()}")

    # 步骤4: 生成YAML输出
    if not args.skip_yaml:
        print(f"\n【步骤4】生成YAML字典文件...")

        if zi_jsonl_path.exists():
            convert_to_yaml(
                str(zi_jsonl_path), str(char_yaml_path), args.char_name, kind='char'
            )
            print(f"  单字字典: {char_yaml_path}")

        if word_jsonl_path.exists():
            convert_to_yaml(
                str(word_jsonl_path), str(word_yaml_path), args.word_name, kind='word'
            )
            print(f"  多字词字典: {word_yaml_path}")

    # 输出文件路径汇总
    print("\n" + "=" * 70)
    print("处理完成！输出文件路径:")
    print("=" * 70)
    if zi_jsonl_path.exists():
        print(f"  单字编码 (JSONL): {zi_jsonl_path.resolve()}")
    if word_jsonl_path.exists():
        print(f"  多字词编码 (JSONL): {word_jsonl_path.resolve()}")
    if char_yaml_path.exists():
        print(f"  单字字典 (YAML): {char_yaml_path.resolve()}")
    if word_yaml_path.exists():
        print(f"  多字词字典 (YAML): {word_yaml_path.resolve()}")
    if not args.skip_stats:
        print(f"  重码详情目录: {stats_dir.resolve()}")


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError) as exc:
        raise SystemExit(f'错误: {exc}')
