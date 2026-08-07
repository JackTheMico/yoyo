#!/usr/bin/env python3
"""修复 yoyo-yx-word.dict.yaml 中多音字错误编码（v2）。

背景
----
发布版词库（rime/yoyo-yx-word.dict.yaml）由旧链路从无调拼音（base/白霜格式，
如 "lu lu xu xu"）生成：main.py 对无调拼音查不到带调的单字表，全部走
`char_map[ch][0]` 兜底 —— 多音字一律取"字的第一读音"编码（陆→liù、觉→jiào、
行→háng、提→dī、系→jì…），无视词内语境读音。单字库正确（陆主 lù=cC、觉主
jué=vG），于是同一部词典内"陆"单字打 cC、词里却要 cJ。

例：
    陆陆续续  cJcJ        （陆取 liù，应为 lù → cCcC）
    不知不觉  rCaErCvI    （觉取 jiào，应为 jué → rCaErCvG）

v2 相对 v1 的修正
-----------------
1. gen_full_code 支持公式中的 Z（末字）/Y（倒数第二字）特判（与
   main.py resolve_char_index 一致）—— v1 漏掉 6+ 字词末字 2 码。
2. 同词多读音条目（word.jsonl 同名多条）不再"后者覆盖"：按权重决策——
   权重最高者唯一 → 取其编码；权重平局且发布版原码 ∈ 候选 → 该词保持原样
   （不修改，避免把规范读音误改为末条异读）；平局且原码 ∉ 候选 → 取末条。
3. 输出"人工裁决清单"：凡原码 ∈ 候选但按规则仍被修改的词，以及权重规则
   可能与规范读音冲突的词（如 密钥 mì yuè vs mi yao、打的 dǎ dī vs da de），
   写入 fix-polyphone-review.txt 供人工复核。

用法
----
    python3 fix_polyphone_codes.py --dry-run   # 只统计，不写文件
    python3 fix_polyphone_codes.py             # 应用修复（先自动备份 .bak）
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from collections import Counter, defaultdict
from pathlib import Path

RIME_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = RIME_ROOT / "scripts" / "编码生成和重码可视化" / "output"
WORD_JSONL = OUT_DIR / "word.jsonl"
ZI_FULL = OUT_DIR / "zi-full.jsonl"
PUB_WORD = RIME_ROOT / "yoyo-yx-word.dict.yaml"
REVIEW_OUT = OUT_DIR / "fix-polyphone-review.txt"

# 旧键位(output) → 发布版键位 的字母置换（与 声韵母按权重重排键位指法/remap_codes.py 一致）
LOWER = {
    "q": "r", "w": "e", "e": "q", "r": "t", "t": "g",
    "a": "d", "s": "z", "d": "a", "f": "c", "g": "w",
    "z": "x", "x": "v", "c": "s", "v": "f", "b": "b",
}
UPPER = {
    "A": "I", "B": "K", "C": "A", "D": "D", "E": "E",
    "F": "L", "G": "G", "H": "H", "I": "B", "J": "J",
    "K": "C", "L": "F",
}
TABLE = str.maketrans({**LOWER, **UPPER})

# 词长编码公式（与 rime/yoyo-yx.dict.yaml encoder.rules 及 config.yaml 一致）
FORMULAS = {
    2: "AaAbBaBbBcBdBeBfAcAdAeAf",
    3: "AaAbBaBbCaCbCcCdCeCfAcAd",
    4: "AaAbBaBbCaCbDaDbDcDdDeDf",
    5: "AaAbBaBbCaCbDaDbEaEbEcEd",
    6: "AaAbBaBbCaCbDaDbEaEbZaZb",
}


def formula_for(word_len: int) -> str:
    return FORMULAS.get(word_len, FORMULAS[6])


def resolve_char_index(char_ref: str, word_len: int) -> int:
    if char_ref == "Z":
        return word_len - 1
    if char_ref == "Y":
        return word_len - 2
    return ord(char_ref) - ord("A")


def resolve_pos_index(pos_ref: str, code_len: int) -> int:
    if pos_ref == "z":
        return code_len - 1
    if pos_ref == "y":
        return code_len - 2
    return ord(pos_ref) - ord("a")


def load_zi_full(path: Path) -> dict[tuple[str, str], str]:
    """(字, 无声调拼音) → 编码"""
    out = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        d = json.loads(line)
        out[(d["name"], d["pinyin"])] = d["full_code"]
    return out


def load_words(path: Path) -> list[dict]:
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines()]


def gen_full_code(word: str, pinyins: list[str], zi_full: dict) -> str | None:
    """按词长公式重算全码（未 remap）。任一读音缺失返回 None。"""
    codes = []
    for ch, py in zip(word, pinyins):
        code = zi_full.get((ch, py))
        if code is None:
            return None
        codes.append(code)
    formula = formula_for(len(word))
    out = []
    for i in range(0, len(formula), 2):
        char_ref, pos_ref = formula[i], formula[i + 1]
        char_idx = resolve_char_index(char_ref, len(word))
        pos_idx = resolve_pos_index(pos_ref, len(codes[char_idx]) if char_idx < len(codes) else 0)
        if char_idx < len(codes) and pos_idx < len(codes[char_idx]):
            out.append(codes[char_idx][pos_idx])
    return "".join(out)


def load_pub_full_codes(path: Path) -> dict[str, str]:
    """发布版每词当前全码（最长无前缀行）。"""
    cur: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        p = line.split("\t")
        if len(p) < 2 or p[0] in ("---", "...") or p[0].startswith(("name:", "sort:", "#")):
            continue
        if p[1][0] not in "<>_+" and len(cur.get(p[0], "")) < len(p[1]):
            cur[p[0]] = p[1]
    return cur


def build_table(words: list[dict], zi_full: dict, pub_before: dict) -> tuple[dict[str, str], dict[str, list], Counter]:
    """返回 ({词: 新全码(已 remap)}, 多读音词详情, 统计)。

    多读音决策：
      - 权重最高者唯一            → 取其编码
      - 权重平局且原码 ∈ 候选      → 该词保持原样（不在返回表中）
      - 权重平局且原码 ∉ 候选      → 取末条编码
    保持原样的词不进入返回表，应用时不会被触碰。
    """
    table: dict[str, str] = {}
    details: dict[str, list] = {}
    stat = Counter()
    groups: dict[str, list[dict]] = defaultdict(list)
    for d in words:
        groups[d["name"]].append(d)

    for name, items in groups.items():
        cands = []
        for it in items:
            pys = it["pinyin"].split()
            if len(name) < 2 or len(pys) != len(name):
                continue
            full = gen_full_code(name, pys, zi_full)
            if full is not None:
                cands.append({"pinyin": it["pinyin"], "weight": it["weight"],
                              "code": full.translate(TABLE)})
        if not cands:
            stat["跳过(读音缺失或拼音未对齐)"] += 1
            continue
        if len(cands) == 1:
            table[name] = cands[0]["code"]
            continue
        # 多读音
        details[name] = cands
        max_w = max(c["weight"] for c in cands)
        top = [c for c in cands if c["weight"] == max_w]
        top_codes = {c["code"] for c in top}
        if len(top_codes) == 1:
            table[name] = top[0]["code"]          # 权重最高唯一
            continue
        # 权重平局且码不同
        before_code = pub_before.get(name)
        if before_code in {c["code"] for c in cands}:
            stat["保持(平局且原码在候选)"] += 1    # 不修改
            continue
        table[name] = cands[-1]["code"]           # 取末条
        stat["修改(平局且原码不在候选)"] += 1
    return table, details, stat


def apply_fix(path: Path, table: dict[str, str], dry_run: bool) -> dict:
    rows = path.read_text(encoding="utf-8").splitlines(keepends=True)
    changed = 0
    total_data = 0
    kept_prefixed = 0
    not_in_table = 0
    new_rows = []
    for row in rows:
        stripped = row.rstrip("\n")
        if not stripped.strip() or stripped.startswith("#") or stripped in ("---", "..."):
            new_rows.append(row)
            continue
        parts = stripped.split("\t")
        if len(parts) < 2 or parts[0].startswith(("name:", "sort:")):
            new_rows.append(row)
            continue
        total_data += 1
        word, code = parts[0], parts[1]
        if code[0] in "<>_+":
            kept_prefixed += 1
            new_rows.append(row)
            continue
        new_full = table.get(word)
        if new_full is None:
            not_in_table += 1
            new_rows.append(row)
            continue
        new_code = new_full[:len(code)]
        if new_code != code:
            parts[1] = new_code
            changed += 1
            new_rows.append("\t".join(parts) + ("\n" if row.endswith("\n") else ""))
        else:
            new_rows.append(row)

    if not dry_run:
        backup = path.with_suffix(path.suffix + ".bak")
        shutil.copy2(path, backup)
        path.write_text("".join(new_rows), encoding="utf-8")
    return {
        "数据行": total_data,
        "码变更": changed,
        "保留前缀一简": kept_prefixed,
        "词不在对照表": not_in_table,
        "备份": str(backup) if not dry_run else "(dry-run)",
    }


def write_review(details: dict[str, list], pub_before: dict, path: Path) -> None:
    lines = [
        "多音字词读音人工复核清单（同词多读音条目，脚本按权重/原码规则决策）",
        "格式: 词 | 候选读音(拼音/权重/编码) | 发布版原码 | 脚本决策",
        "",
    ]
    for name in sorted(details):
        cands = details[name]
        codes = {c["code"] for c in cands}
        before = pub_before.get(name)
        max_w = max(c["weight"] for c in cands)
        top_codes = {c["code"] for c in cands if c["weight"] == max_w}
        if before in codes and len(top_codes) > 1:
            decision = "保持原码"
        elif len(top_codes) == 1:
            decision = "取权重最高"
        else:
            decision = "取末条"
        lines.append(f"{name}\t决策={decision}\t原码={before}")
        for c in cands:
            lines.append(f"    {c['pinyin']}  权重{c['weight']}  码{c['code']}")
        lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true", help="只统计不写文件")
    ap.add_argument("--word-jsonl", type=Path, default=WORD_JSONL)
    ap.add_argument("--zi-full", type=Path, default=ZI_FULL)
    ap.add_argument("--pub-word", type=Path, default=PUB_WORD)
    args = ap.parse_args()

    zi_full = load_zi_full(args.zi_full)
    print(f"读音→编码表: {len(zi_full)} 条")
    words = load_words(args.word_jsonl)
    print(f"词条: {len(words)} 条（唯一词 {len({d['name'] for d in words})}）")

    pub_before = load_pub_full_codes(args.pub_word)
    table, details, stat = build_table(words, zi_full, pub_before)
    print(f"对照表: {len(table)} 词（{dict(stat)}）")

    diff = sum(1 for w, new_full in table.items()
               if pub_before.get(w) is not None and pub_before[w] != new_full)
    print(f"与发布版全码不一致(将变更): {diff} 词")

    result = apply_fix(args.pub_word, table, args.dry_run)
    print("应用结果:", result)

    write_review(details, pub_before, REVIEW_OUT)
    print(f"人工复核清单: {len(details)} 词 → {REVIEW_OUT}")
    if args.dry_run:
        print("（--dry-run：未写文件）")


if __name__ == "__main__":
    sys.exit(main())
