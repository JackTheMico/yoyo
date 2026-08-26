#!/usr/bin/env python3
"""自动化测试：小说语料抽取与纯空码位零重码优选 (test_extract_novel_corpus.py)"""

import sys
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
sys.path.insert(0, str(SCRIPTS_DIR))

from extract_novel_corpus import (
    load_pure_char_roots,
    load_existing_dict_keys,
    encode_pure_word,
    extract_and_filter_novel_corpus,
)


class TestExtractNovelCorpus(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.char_roots = load_pure_char_roots()
        cls.existing_words, cls.existing_4codes = load_existing_dict_keys()

    def test_01_char_roots_loaded(self):
        """单字字根库应包含 6000+ 字符"""
        self.assertGreaterEqual(len(self.char_roots), 6400)
        self.assertIn("可", self.char_roots)
        self.assertIn("以", self.char_roots)

    def test_02_encode_pure_word_rules(self):
        """验证 2 字、3 字、4+ 字词编码公式正确性"""
        # 可以: 可(xk) + 以(hr) -> xkhr
        self.assertEqual(encode_pure_word("可以", self.char_roots), "xkhr")
        # 为什么: 为(O) + 什(a) + 么(tB) -> OatB
        self.assertEqual(encode_pure_word("为什么", self.char_roots), "OatB")
        # 人民共和国: 人(r) + 民(w) + 共(x) + 国(U) -> rwxU
        self.assertEqual(encode_pure_word("人民共和国", self.char_roots), "rwRU")

    def test_03_zero_collision_extraction(self):
        """验证提取出的零重码小说词条性质"""
        zero_collision_entries, colliding_entries = extract_and_filter_novel_corpus()

        # 1. 数量应大于 50,000
        self.assertGreaterEqual(len(zero_collision_entries), 50000)

        # 2. 编码格式合法性与唯一性
        seen_codes = set()
        for text, code, category in zero_collision_entries:
            self.assertEqual(len(code), 4, f"词条 [{text}] 的编码 [{code}] 长度不为 4")
            self.assertFalse(code.startswith("_") or code.startswith("+"))
            # 必须不在既有词典 4 码键中
            self.assertNotIn(
                code,
                self.existing_4codes,
                f"零重码词 [{text}] 编码 [{code}] 存在于既有词典中！",
            )
            # 自身内部 0 重码
            self.assertNotIn(
                code, seen_codes, f"零重码列表中出现重复编码 [{code}] ([{text}])"
            )
            seen_codes.add(code)

        print(f"\n✓ 成功验证 {len(zero_collision_entries)} 条小说新词 100% 零重码！")


if __name__ == "__main__":
    unittest.main()
