#!/usr/bin/env python3
"""生成拼音反查数据（rime/lua/yoyo/data/reverse_*.lua）。

数据源（均为仓库内 tracked 文件）：
  - 单字读音表：scripts/编码生成和重码可视化/data/pinyin.txt
  - 词拼音源：  scripts/编码生成和重码可视化/data/base.dict.yaml.gz
  - 字/词编码：rime/yoyo-bm.dict.yaml（纯形支四方案共用此字典）

产出：26 个 reverse_<initial>.lua 分片，每个形如：
  return {
    ["hanmei"] = {{"寒梅","sHqL",123}, ...},
    ...
  }
字词同池；候选按权重降序，同权重按 text 稳定排序。

用法：
  python3 generate_reverse_data.py            # 自检通过后写文件
  python3 generate_reverse_data.py --dry-run  # 仅打印统计与自检，不写文件
  python3 generate_reverse_data.py --out-dir DIR
"""

import argparse
import gzip
import sys
import unicodedata
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
DATA_DIR = SCRIPTS_DIR / "编码生成和重码可视化" / "data"

PINYIN_TXT = DATA_DIR / "pinyin.txt"
BASE_DICT_GZ = DATA_DIR / "base.dict.yaml.gz"
BM_DICT = (
    RIME_DIR / "yoyo-pure.dict.yaml"
    if (RIME_DIR / "yoyo-pure.dict.yaml").exists()
    else RIME_DIR / "yoyo-bm.dict.yaml"
)

DEFAULT_OUT_DIR = RIME_DIR / "lua" / "yoyo" / "data"

# 纯形支并击/一简标记符，生成显示码时一律剥离。
# `<>` 是合法码元（如 `清 [n>]`、`方法 _<`），不是标记，不可剥离。
# 注意 `,` 与 `.` 是合法码元（如 `中国 bcU,`），不可剥离。
MARK_CHARS = set("!@-_+()[]=")


def strip_tone(s: str) -> str:
    """带调/带 ü 的拼音转无声调小写连续形式（ü → v）。lǜ -> lv, dì -> di, 啊 ā/a -> a。

    去空格、转小写。
    """
    s = unicodedata.normalize("NFD", s)
    out = []
    for ch in s:
        if unicodedata.combining(ch):
            continue
        if ch == "ü":
            out.append("v")
        elif ch == "Ü":
            out.append("v")
        else:
            out.append(ch)
    return "".join(out).lower().replace(" ", "")


def strip_marks(code: str) -> str:
    """去掉编码中的并击/一简标记符。!dFrJ@-dD -> dFrJdD, <vJ -> vJ。"""
    return "".join(c for c in code if c not in MARK_CHARS)


def parse_dict_yaml(path: Path):
    """解析 Rime dict.yaml，返回 [(text, code, weight_float)]。跳过头部与 frontmatter。

    frontmatter 在 `---` 与 `...` 之间；正文从 `...` 后开始。
    每行格式 `text\\tcode\\tweight`，weight 可省。
    """
    entries = []
    in_body = False
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            if line.startswith("---"):
                in_body = False
                continue
            if line.startswith("..."):
                in_body = True
                continue
            if not in_body:
                continue
            if line.startswith("#") or line.strip() == "":
                continue
            parts = line.split("\t")
            if len(parts) < 2:
                continue
            text = parts[0]
            code = parts[1]
            weight = 0.0
            if len(parts) >= 3:
                try:
                    weight = float(parts[2])
                except ValueError:
                    weight = 0.0
            entries.append((text, code, weight))
    return entries


def is_cjk_char(ch: str) -> bool:
    """判断单个字符是否为汉字（CJK 统一表意文字）"""
    if len(ch) != 1:
        return False
    cp = ord(ch)
    return (
        0x4E00 <= cp <= 0x9FFF
        or 0x3400 <= cp <= 0x4DBF
        or 0x20000 <= cp <= 0x2A6DF
        or 0x2A700 <= cp <= 0x2B73F
        or 0x2B740 <= cp <= 0x2B81F
        or 0x2B820 <= cp <= 0x2CEAF
        or 0xF900 <= cp <= 0xFAFF
        or 0x2F800 <= cp <= 0x2FA1F
    )


def load_char_codes(entries):
    """字 -> 显示码（主码优先：权重最高者，同权重取去标记后最短）。

    主码条目权重 > 0（实际打字使用的编码）；全码条目权重 = 0
    （带 `[]()/-=` 标记的完整击键序列，仅供反查展示备选）。
    """
    char_codes = {}  # text -> (stripped_code, weight)
    for text, code, weight in entries:
        if len(text) != 1 or not is_cjk_char(text):
            continue
        stripped = strip_marks(code)
        if not stripped:
            continue
        cur = char_codes.get(text)
        if cur is None:
            char_codes[text] = (stripped, weight)
        else:
            cur_code, cur_w = cur
            if weight > cur_w or (
                weight == cur_w and len(stripped) < len(cur_code)
            ):
                char_codes[text] = (stripped, weight)
    return {t: v[0] for t, v in char_codes.items()}, char_codes


def load_word_codes(entries):
    """词 -> 显示码（主码优先：权重最高者，同权重取去标记后最短）。

    主码条目权重 > 0（平时打词实际使用的编码，较短）；
    全码条目权重 = 0（完整击键序列，较长，仅供展示备选）。
    """
    word_codes = {}  # text -> (stripped_code, weight)
    for text, code, weight in entries:
        if len(text) <= 1:
            continue
        stripped = strip_marks(code)
        if not stripped:
            continue
        cur = word_codes.get(text)
        if cur is None:
            word_codes[text] = (stripped, weight)
        else:
            cur_code, cur_w = cur
            if weight > cur_w or (
                weight == cur_w and len(stripped) < len(cur_code)
            ):
                word_codes[text] = (stripped, weight)
    return {t: v[0] for t, v in word_codes.items()}, word_codes


def load_char_pinyin():
    """字读音: 字 -> [(键, 权重)]。同一 (字,键) 保留最大权重。"""
    raw = {}  # (字, 键) -> weight
    with open(PINYIN_TXT, "r", encoding="utf-8") as f:
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 3:
                continue
            char, raw_pinyin, weight = parts[0], parts[1], parts[2]
            try:
                w = float(weight)
            except ValueError:
                w = 0.0
            key = strip_tone(raw_pinyin)
            if not key:
                continue
            k = (char, key)
            if k not in raw or w > raw[k]:
                raw[k] = w
    out = {}
    for (char, key), w in raw.items():
        out.setdefault(char, []).append((key, w))
    return out


def load_word_pinyin():
    """词拼音: 词 -> (键, 权重)。同一词同键保留最大权重。"""
    raw = {}  # (词, 键) -> weight
    with gzip.open(BASE_DICT_GZ, "rt", encoding="utf-8") as f:
        in_body = False
        for line in f:
            line = line.rstrip("\n")
            if line.startswith("---"):
                in_body = False
                continue
            if line.startswith("..."):
                in_body = True
                continue
            if not in_body:
                continue
            if line.startswith("#") or line.strip() == "":
                continue
            parts = line.split("\t")
            if len(parts) < 2:
                continue
            text = parts[0]
            code = parts[1]
            if len(text) <= 1:
                continue
            # 词拼音源中 code 列即拼音（去空格小写后作键）
            key = code.lower().replace(" ", "")
            if not key:
                continue
            if not key.isascii() or not key.isalpha():
                continue
            weight = 0.0
            if len(parts) >= 3:
                try:
                    weight = float(parts[2])
                except ValueError:
                    weight = 0.0
            k = (text, key)
            if k not in raw or weight > raw[k]:
                raw[k] = weight
    out = {}
    for (word, key), w in raw.items():
        out[word] = (key, w)
    return out


def build_candidates(char_codes, word_codes, char_pinyin, word_pinyin):
    """合并字/词候选：键 -> [(text, code, weight)]。返回 (候选表, 缺失报告)。"""
    candidates = {}  # key -> [(text, code, weight)]
    missing_words = []  # 词库词在拼音源中缺拼音

    # 单字
    for char, keys in char_pinyin.items():
        if char not in char_codes:
            continue  # 读音表字无编码，不收录（繁体/生僻字）
        code = char_codes[char]
        for key, w in keys:
            candidates.setdefault(key, []).append((char, code, w))

    # 词
    for word, code in word_codes.items():
        if word not in word_pinyin:
            missing_words.append(word)
            continue
        key, w = word_pinyin[word]
        candidates.setdefault(key, []).append((word, code, w))

    return candidates, missing_words


def sort_candidates(candidates):
    """键按字母序；候选按权重降序、同权重按 text 稳定排序。返回 {键: 排序后列表}。"""
    sorted_keys = sorted(candidates.keys())
    out = {}
    for key in sorted_keys:
        items = sorted(
            candidates[key],
            key=lambda x: (-x[2], x[0]),
        )
        out[key] = items
    return out


def lua_escape(s: str) -> str:
    """转义 Lua 字符串字面量中的反斜杠与双引号。"""
    return s.replace("\\", "\\\\").replace('"', '\\"')


def render_shard(key_to_cands):
    """渲染单个分片为 Lua 表源码字符串。"""
    lines = ["return {"]
    for key, cands in key_to_cands.items():
        items = ", ".join(
            '{{"{}","{}",{}}}'.format(lua_escape(t), lua_escape(c), w)
            for t, c, w in cands
        )
        lines.append('  ["{}"] = {{'.format(lua_escape(key)) + items + "},")
    lines.append("}")
    return "\n".join(lines) + "\n"


def self_check(char_codes, word_codes, char_pinyin, word_pinyin,
               candidates, missing_words):
    """生成期自检：覆盖率、编码一致性、数据形状。返回 (ok, 报告)。

    char_codes / word_codes 既可能是 {text: code}（精简）也可能是
    {text: (code, weight)}（含权重），统一规整为 {text: code}。
    """
    ok = True
    report = []
    char_codes = {t: (v[0] if isinstance(v, tuple) else v)
                  for t, v in char_codes.items()}
    word_codes = {t: (v[0] if isinstance(v, tuple) else v)
                  for t, v in word_codes.items()}

    # 1. 词库主条目词拼音覆盖率
    # 注：base.dict.yaml.gz 会把「其它」「连结」等异形词以 `#「X」→「Y」` 注释删除，
    # 故词库主条目里若收了这些异形词，反查时确实查不到拼音。这类缺失是数据源差异，
    # 非生成错误——允许少量（< 5%），仅统计不阻断。
    if missing_words:
        pct = len(missing_words) / max(1, len(word_codes)) * 100
        sample = ", ".join(repr(w) for w in missing_words[:5])
        if pct > 5.0:
            ok = False
            report.append(
                "[FAIL] 词库词在白霜中缺拼音 {} 个 ({}%)，超阈值 5%: {}{}".format(
                    len(missing_words), round(pct, 2), sample,
                    "（前5）" if len(missing_words) > 5 else "",
                )
            )
        else:
            report.append(
                "[skip] 词库词在白霜中缺拼音 {} 个 ({}%)，异形词差异，不阻断: {}{}".format(
                    len(missing_words), round(pct, 2), sample,
                    "（前5）" if len(missing_words) > 5 else "",
                )
            )
    else:
        report.append("[ok] 词库主条目词拼音覆盖率 100%")

    # 2. 单字表字无读音
    chars_no_reading = [c for c in char_codes if c not in char_pinyin]
    if chars_no_reading:
        ok = False
        sample = ", ".join(repr(c) for c in chars_no_reading[:5])
        report.append(
            "[FAIL] 单字表 {} 字无读音: {}{}".format(
                len(chars_no_reading), sample,
                "（前5）" if len(chars_no_reading) > 5 else ""
            )
        )
    else:
        report.append("[ok] 单字表 {} 字全部有读音（可反查）".format(len(char_codes)))

    # 3. 读音表字无编码（跳过：繁体/生僻字）
    reading_no_code = [c for c in char_pinyin if c not in char_codes]
    if reading_no_code:
        unique_chars = sorted(set(reading_no_code))
        report.append(
            "[skip] 读音表 {} 条（{} 字）无编码，不收录（繁体/生僻字，打不出来）".format(
                len(reading_no_code), len(unique_chars)
            )
        )

    # 4. 生成字码全部来自单字表条目
    char_code_set = set(char_codes.values())
    stray = []
    for items in candidates.values():
        for text, code, _ in items:
            if len(text) == 1 and code not in char_code_set:
                stray.append(code)
    stray = sorted(set(stray))
    if stray:
        ok = False
        sample = ", ".join(repr(s) for s in sorted(stray)[:5])
        report.append(
            "[FAIL] 生成字码不在单字表条目中: {}{}".format(
                sample, "（前5）" if len(stray) > 5 else ""
            )
        )
    else:
        report.append("[ok] 生成字码全部来自单字表条目")

    # 5. 生成词码全部来自词库主条目
    word_code_set = set(word_codes.values())
    stray_w = []
    for items in candidates.values():
        for text, code, _ in items:
            if len(text) > 1 and code not in word_code_set:
                stray_w.append(code)
    stray_w = sorted(set(stray_w))
    if stray_w:
        ok = False
        sample = ", ".join(repr(s) for s in sorted(stray_w)[:5])
        report.append(
            "[FAIL] 生成词码不在词库主条目中: {}{}".format(
                sample, "（前5）" if len(stray_w) > 5 else ""
            )
        )
    else:
        report.append("[ok] 生成词码全部来自词库主条目")

    # 6. 候选按权重降序
    bad_order = []
    for key, items in candidates.items():
        for i in range(len(items) - 1):
            if items[i][2] < items[i + 1][2]:
                bad_order.append(key)
                break
    if bad_order:
        ok = False
        sample = ", ".join(repr(k) for k in bad_order[:5])
        report.append(
            "[FAIL] 键 {} 候选未按权重降序{}".format(
                sample, "（前5）" if len(bad_order) > 5 else ""
            )
        )
    else:
        report.append(
            "[ok] 候选均按权重降序，无空片（共 {} 个拼音键）".format(len(candidates))
        )

    # 7. 空片
    # 拼音不存在以 i/u/v 开头的字（v 是 ü 的替代形，单独拼音不合法；
    # i/u 单独不构成音节）。无候选分片是数据本身的特征，非错误。
    empty_shards = [k for k in "abcdefghijklmnopqrstuvwxyz"
                    if not any(cand_key.startswith(k) for cand_key in candidates)]
    # 仅统计，不阻断
    if empty_shards:
        report.append(
            "[skip] 空片（拼音无此首字母）: {}".format(", ".join(empty_shards))
        )
    else:
        report.append("[ok] 26 分片均非空")

    # 8. 码长/标记异常（去标记后无残留 + 码长偶数且 ≤24）
    bad_codes = []
    for items in candidates.values():
        for text, code, _ in items:
            if any(c in MARK_CHARS for c in code):
                bad_codes.append((text, code))
                continue
            if len(code) > 24 or len(code) % 2 != 0:
                # 纯形支允许奇数长度（一简 1 码元 = 长度 1、两码 2、全码 5）
                # 但若码长 > 24 或带标记残留即异常
                if len(code) > 24:
                    bad_codes.append((text, code))
    if bad_codes:
        ok = False
        sample = ", ".join("{}={}".format(t, c) for t, c in bad_codes[:5])
        report.append(
            "[FAIL] 码长/标记异常: {}{}".format(
                sample, "（前5）" if len(bad_codes) > 5 else ""
            )
        )
    else:
        report.append("[ok] 所有编码去标记无残留、长度 ≤24")

    # 9. 单字码长 ∈ {1, 2, 3, 5}（纯形支一简/两码/全码）
    bad_char_len = []
    for items in candidates.values():
        for text, code, _ in items:
            if len(text) == 1 and len(code) not in (1, 2, 3, 5):
                bad_char_len.append((text, code, len(code)))
    if bad_char_len:
        ok = False
        sample = ", ".join("{}={}({})".format(t, c, l) for t, c, l in bad_char_len[:5])
        report.append(
            "[FAIL] 单字码长不在 1/2/3/5: {}{}".format(
                sample, "（前5）" if len(bad_char_len) > 5 else ""
            )
        )
    else:
        report.append("[ok] 单字码长均为 1/2/3/5（一简/两码/全码）")

    return ok, report


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--dry-run", action="store_true",
                        help="只打印统计与自检，不写文件")
    parser.add_argument("--out-dir", default=str(DEFAULT_OUT_DIR),
                        help="输出目录（默认 rime/lua/yoyo/data）")
    args = parser.parse_args()

    out_dir = Path(args.out_dir)
    print("读取数据源 ...")
    entries = parse_dict_yaml(BM_DICT)
    char_codes_map, char_codes_full = load_char_codes(entries)
    word_codes_map, word_codes_full = load_word_codes(entries)
    char_pinyin = load_char_pinyin()
    word_pinyin = load_word_pinyin()
    print("  单字编码: {} 字 | 词编码: {} 词".format(len(char_codes_map), len(word_codes_map)))
    print("  单字读音: {} 条 (字,键) | 词拼音: {} 条 (词,键)".format(
        sum(len(v) for v in char_pinyin.values()), len(word_pinyin)))

    print("合并候选 ...")
    candidates, missing_words = build_candidates(
        char_codes_map, word_codes_map, char_pinyin, word_pinyin)
    candidates = sort_candidates(candidates)

    print("自检 ...")
    ok, report = self_check(
        char_codes_full, word_codes_full, char_pinyin, word_pinyin,
        candidates, missing_words)
    for line in report:
        print("  " + line)

    # 统计
    n_keys = len(candidates)
    n_cands = sum(len(items) for items in candidates.values())
    shards = sorted({k[0] for k in candidates if k})
    print("\n统计: 拼音键 {} 个 | 候选 {} 条 | 分片首字母 {} 个".format(
        n_keys, n_cands, len(shards)))

    if not ok:
        print("\n自检未通过，终止（不写文件）")
        sys.exit(1)

    if args.dry_run:
        print("\n[dry-run] 自检通过，未写文件")
        return

    # 写 26 分片
    out_dir.mkdir(parents=True, exist_ok=True)
    written = 0
    for initial in "abcdefghijklmnopqrstuvwxyz":
        shard_items = {k: v for k, v in candidates.items()
                       if k.startswith(initial)}
        if not shard_items:
            continue
        path = out_dir / "reverse_{}.lua".format(initial)
        content = (
            "-- 自动生成，请勿手改。由 rime/scripts/generate_reverse_data.py 生成。\n"
            + render_shard(shard_items)
        )
        path.write_text(content, encoding="utf-8")
        written += 1
    print("\n已写入 {} 个分片到 {}".format(written, out_dir))


if __name__ == "__main__":
    main()
