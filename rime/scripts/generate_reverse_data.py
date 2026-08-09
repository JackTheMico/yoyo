#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成拼音反查数据（产出 rime/lua/yoyo/data/reverse_<首字母>.lua）。

用法:
    python3 generate_reverse_data.py             # 生成数据文件（默认）
    python3 generate_reverse_data.py --dry-run   # 只打印统计与自检，不写文件
    python3 generate_reverse_data.py --out-dir <dir>

数据源（全部为仓库内 tracked 文件，禁用 output/ 构建中间产物——其编码已过期）:
    1. 单字读音:   编码生成和重码可视化/data/pinyin.txt   （字  读音[可带调/ü]  权重）
    2. 词拼音:     编码生成和重码可视化/data/base.dict.yaml.gz （rime-ice 白霜：词  空格分隔全拼  权重，ü 记为 v）
    3. 单字编码:   yoyo-yx-char.dict.yaml  （text  code  weight；全码条目形如 !dFrJ@-dD，一简形如 _dA/+dA）
    4. 词编码:     yoyo-yx-word.dict.yaml  （text  code  weight；一简形如 <vJ/+bA/>fA，主码 4 码元定长）

输出数据形状（每片）:
    return { [拼音键] = { {text, code, weight}, ... }, ... }   -- 键按字母序，候选按权重降序
    拼音键 = 无声调小写连续全拼（ü 转 v、去空格），如 "hanmei"。

编码提取规则（与 CONTEXT.md / docs/adr/0001 一致）:
    - 单字显示码: 该字全部条目去标记（! @ - _ +）后取最长者（全码优先）；同长取权重高者。
    - 词显示码:   该词主条目（权重≠0）去标记（< > +）后取最短者（主码优先，一简只显码元）；同长取权重高者。

生成期自检（失败即 exit 1）:
    1. 覆盖率: 词库主条目词全部能在白霜词库中找到拼音；单字读音全部能在单字表找到编码。
    2. 编码一致性: 生成的词码/字码均来自词库条目（抽样全量比对，无凭空产物）。
    3. 数据形状: 每片非空、拼音键无重复、候选按权重降序。
    4. 去标记: 字码长度 ∈ {2,4,6} 且无残留标记符；词码长度为偶数且 ≤ 24。

词库更新/重排键位后必须重跑本脚本，否则反查注释中的编码会过期。
"""

import argparse
import gzip
import sys
import unicodedata
from pathlib import Path

# ---- 路径 ----
SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
DATA_DIR = SCRIPTS_DIR / "编码生成和重码可视化" / "data"
PINYIN_TXT = DATA_DIR / "pinyin.txt"
BASE_DICT_GZ = DATA_DIR / "base.dict.yaml.gz"
CHAR_DICT = RIME_DIR / "yoyo-yx-char.dict.yaml"
WORD_DICT = RIME_DIR / "yoyo-yx-word.dict.yaml"
DEFAULT_OUT_DIR = RIME_DIR / "lua" / "yoyo" / "data"

# 编码中的标记符（并击/一简标记，非码元字符）
MARK_CHARS = "!@-_+<>"

def strip_tone(pinyin: str) -> str:
    """带调/带 ü 的拼音转无声调小写连续形式（ü 系 → v）。

    lǜ -> lv, dì -> di, 啊 ā/a -> a。去空格、转小写。
    """
    s = unicodedata.normalize("NFD", pinyin)
    out = []
    i = 0
    n = len(s)
    while i < n:
        ch = s[i]
        if ch in ("u", "U") and i + 1 < n and s[i + 1] == "\u0308":  # u + 分音符 = ü
            out.append("v" if ch == "u" else "V")
            i += 2
        elif unicodedata.combining(ch):  # 声调/附加符
            i += 1
        else:
            out.append(ch)
            i += 1
    return "".join(out).lower().replace(" ", "")


def strip_marks(code: str) -> str:
    """去掉编码中的并击/一简标记符。!dFrJ@-dD -> dFrJdD, <vJ -> vJ。"""
    return "".join(ch for ch in code if ch not in MARK_CHARS)


def parse_dict_yaml(path: Path):
    """解析 Rime dict.yaml，返回 [(text, code, weight_float)]。跳过头部与 frontmatter。

    兼容两种 frontmatter 写法（`---` 开头 `...` 结尾的 Rime 格式，以及标准 YAML 双 `---`）。
    """
    rows = []
    in_body = False
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if line.startswith("---"):
                in_body = True  # 无论第几个 `---`，其后即数据区
                continue
            if line.startswith("..."):
                continue  # Rime frontmatter 结束符
            if not in_body or not line or line.startswith("#"):
                continue
            parts = line.split("\t")
            if len(parts) < 3:
                continue
            try:
                weight = float(parts[2])
            except ValueError:
                continue
            rows.append((parts[0], parts[1], weight))
    if not rows:
        raise SystemExit(f"[FATAL] {path} 未解析到任何数据行（格式漂移？）")
    return rows


def load_char_codes():
    """字 -> 显示码（全码优先：去标记后最长，同长取权重高）。"""
    best = {}
    for text, code, weight in parse_dict_yaml(CHAR_DICT):
        plain = strip_marks(code)
        cur = best.get(text)
        if cur is None or len(plain) > len(cur[0]) or (len(plain) == len(cur[0]) and weight > cur[1]):
            best[text] = (plain, weight)
    return {t: c for t, (c, _) in best.items()}


def load_word_codes():
    """词 -> 显示码（主码优先：主条目去标记后最短，同长取权重高）。"""
    best = {}
    for text, code, weight in parse_dict_yaml(WORD_DICT):
        if weight == 0:
            continue  # 全码条目（权重 0）不参与主码选择
        plain = strip_marks(code)
        cur = best.get(text)
        if cur is None or len(plain) < len(cur[0]) or (len(plain) == len(cur[0]) and weight > cur[1]):
            best[text] = (plain, weight)
    return {t: c for t, (c, _) in best.items()}


def load_char_pinyin():
    """字读音: 字 -> [(键, 权重)]。同一 (字, 键) 保留最大权重。"""
    best = {}
    for line in PINYIN_TXT.read_text(encoding="utf-8").splitlines():
        parts = line.split("\t")
        if len(parts) < 3:
            continue
        text, raw, weight = parts[0], parts[1], float(parts[2])
        key = strip_tone(raw)
        if not key:
            continue
        cur = best.get((text, key))
        if cur is None or weight > cur:
            best[(text, key)] = weight
    return best


def load_word_pinyin():
    """词拼音: 词 -> (键, 权重)。同一词同键保留最大权重。"""
    best = {}
    with gzip.open(BASE_DICT_GZ, "rt", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if not line or line.startswith("#") or line.startswith("---") or line.startswith("..."):
                continue
            parts = line.split("\t")
            if len(parts) < 3:
                continue
            text, raw, weight = parts[0], parts[1], float(parts[2])
            key = raw.replace(" ", "").lower()
            if not key or not key.isascii() or not key.isalpha():
                continue
            cur = best.get((text, key))
            if cur is None or weight > cur:
                best[(text, key)] = weight
    return best


def build_candidates(char_pinyin, word_pinyin, char_codes, word_codes):
    """合并字/词候选：键 -> [(text, code, weight)]。返回 (候选表, 缺失报告)。"""
    by_key = {}
    missing_words = []  # yoyo 词库有、白霜无拼音（应为空）
    skipped_chars = []  # pinyin.txt 有读音、单字表无编码（打不出来，跳过不收录）
    no_pinyin_chars = []  # 单字表有、pinyin.txt 无读音（真缺陷）

    for (text, key), weight in char_pinyin.items():
        code = char_codes.get(text)
        if code is None:
            skipped_chars.append((text, key))
            continue
        by_key.setdefault(key, []).append((text, code, weight))

    for (text, key), weight in word_pinyin.items():
        code = word_codes.get(text)
        if code is None:
            continue  # 白霜有、本方案词库没有的词：不打不收录
        by_key.setdefault(key, []).append((text, code, weight))

    # 反向覆盖：单字表（能打的字）必须全部能在读音表找到读音，否则反查无门
    pinyin_texts = {t for t, _ in char_pinyin}
    for text in char_codes:
        if text not in pinyin_texts:
            no_pinyin_chars.append(text)

    # 反向覆盖：词库（能打的词）必须全部能在白霜找到拼音，否则反查无门
    pinyin_words = {t for t, _ in word_pinyin}
    for text in word_codes:
        if text not in pinyin_words:
            missing_words.append(text)

    return by_key, missing_words, skipped_chars, no_pinyin_chars


def sort_candidates(by_key):
    """键按字母序；候选按权重降序、同权重按 text 稳定排序。返回 {键: 排序后列表}。"""
    for key in by_key:
        by_key[key].sort(key=lambda t: (-t[2], t[0]))
    return dict(sorted(by_key.items()))


def lua_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def render_shard(key_to_cands):
    lines = ["return {"]
    for key, cands in key_to_cands.items():
        items = ",".join(
            '{"%s","%s",%g}' % (lua_escape(t), lua_escape(c), w)
            for t, c, w in cands
        )
        lines.append('  ["%s"] = {%s},' % (lua_escape(key), items))
    lines.append("}")
    return "\n".join(lines) + "\n"


def main():
    ap = argparse.ArgumentParser(description="生成拼音反查数据（rime/lua/yoyo/data/reverse_*.lua）")
    ap.add_argument("--dry-run", action="store_true", help="只打印统计与自检，不写文件")
    ap.add_argument("--out-dir", type=Path, default=DEFAULT_OUT_DIR, help="输出目录（默认 rime/lua/yoyo/data）")
    args = ap.parse_args()

    print("读取数据源 ...")
    char_codes = load_char_codes()
    word_codes = load_word_codes()
    char_pinyin = load_char_pinyin()
    word_pinyin = load_word_pinyin()
    print(f"  单字编码: {len(char_codes)} 字 | 词编码: {len(word_codes)} 词")
    print(f"  单字读音: {len(char_pinyin)} 条 (字,键) | 词拼音: {len(word_pinyin)} 条 (词,键)")

    print("合并候选 ...")
    by_key, missing_words, skipped_chars, no_pinyin_chars = build_candidates(
        char_pinyin, word_pinyin, char_codes, word_codes
    )
    by_key = sort_candidates(by_key)

    print("自检 ...")
    ok = True
    # 覆盖率
    if missing_words:
        ok = False
        print(f"  [FAIL] 词库词在白霜中缺拼音 {len(missing_words)} 个: {missing_words[:10]}")
    else:
        print("  [ok] 词库主条目词拼音覆盖率 100%")
    if no_pinyin_chars:
        ok = False
        print(f"  [FAIL] 单字表 {len(no_pinyin_chars)} 字无读音: {no_pinyin_chars[:10]}")
    else:
        print(f"  [ok] 单字表 {len(char_codes)} 字全部有读音（可反查）")
    if skipped_chars:
        print(f"  [skip] 读音表 {len(skipped_chars)} 条（{len(set(t for t, _ in skipped_chars))} 字）无编码，不收录（繁体/生僻字，打不出来）")
    # 编码一致性（生成码均来自词库条目：反向校验所有生成码都能在词库条目中找到）
    all_word_codes = {strip_marks(c) for _, c, w in parse_dict_yaml(WORD_DICT) if w != 0}
    all_char_codes = {strip_marks(c) for _, c, _ in parse_dict_yaml(CHAR_DICT)}
    gen_chars = {c for k in by_key for t, c, _ in by_key[k] if len(t) == 1}
    gen_words = {c for k in by_key for t, c, _ in by_key[k] if len(t) > 1}
    if not gen_chars <= all_char_codes:
        ok = False
        print(f"  [FAIL] 生成字码不在单字表条目中: {(gen_chars - all_char_codes) or ''}（前5）: {sorted(gen_chars - all_char_codes)[:5]}")
    else:
        print("  [ok] 生成字码全部来自单字表条目")
    if not gen_words <= all_word_codes:
        ok = False
        print(f"  [FAIL] 生成词码不在词库主条目中: {sorted(gen_words - all_word_codes)[:5]}")
    else:
        print("  [ok] 生成词码全部来自词库主条目")
    # 形状
    empty_shards = []
    for key in sorted(by_key):
        cands = by_key[key]
        if not cands:
            empty_shards.append(key)
        for i in range(1, len(cands)):
            if cands[i - 1][2] < cands[i][2]:
                ok = False
                print(f"  [FAIL] 键 {key} 候选未按权重降序")
                break
    if empty_shards:
        ok = False
        print(f"  [FAIL] 空片: {empty_shards}")
    else:
        print(f"  [ok] 候选均按权重降序，无空片（共 {len(by_key)} 个拼音键）")
    # 去标记
    bad_len = [
        (t, c)
        for k in by_key
        for t, c, _ in by_key[k]
        if len(c) % 2 != 0 or len(c) > 24 or any(ch in MARK_CHARS for ch in c)
    ]
    bad_char = [
        (t, c) for k in by_key for t, c, _ in by_key[k] if len(t) == 1 and len(c) not in (2, 4, 6)
    ]
    if bad_len:
        ok = False
        print(f"  [FAIL] 码长/标记异常: {bad_len[:5]}")
    else:
        print("  [ok] 所有编码为偶数长度且 ≤24，无标记残留")
    if bad_char:
        ok = False
        print(f"  [FAIL] 单字码长不在 {2,4,6}: {bad_char[:5]}")
    else:
        print("  [ok] 单字码长均为 2/4/6（1-3 码元）")

    # 统计
    total = sum(len(v) for v in by_key.values())
    shard_count = len({k[0] for k in by_key})
    print(f"\n统计: 拼音键 {len(by_key)} 个 | 候选 {total} 条 | 分片首字母 {shard_count} 个")

    if not ok:
        print("\n自检未通过，终止（不写文件）")
        sys.exit(1)

    if args.dry_run:
        for letter in sorted({k[0] for k in by_key}):
            cnt = sum(len(v) for k, v in by_key.items() if k[0] == letter)
            print(f"  {letter}: {cnt} 候选")
        print("\n[dry-run] 自检通过，未写文件")
        return

    args.out_dir.mkdir(parents=True, exist_ok=True)
    for letter in sorted({k[0] for k in by_key}):
        shard = {k: v for k, v in by_key.items() if k[0] == letter}
        path = args.out_dir / f"reverse_{letter}.lua"
        path.write_text(
            "-- 自动生成，请勿手改。由 rime/scripts/generate_reverse_data.py 生成。\n"
            + render_shard(shard),
            encoding="utf-8",
        )
    print(f"已写入 {shard_count} 个分片到 {args.out_dir}")


if __name__ == "__main__":
    main()
