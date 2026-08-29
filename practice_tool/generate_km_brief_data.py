#!/usr/bin/env python3
"""生成 practice_tool/km_brief_data_module.js（前置单引号简词练习数据）。

数据源：rime/yoyo-user.dict.yaml 中 `'` 前缀码条目（gen_brief_words.py 的产物）。
输出按词频降序的 {text, code, weight} 列表，并校验每个码位字符都是合法码元
（与 practice_tool/km_data_module.js 的 KM_BEST_CHORD 一致）。
"""

import json
from pathlib import Path

TOOL = Path(__file__).resolve().parent
USER_DICT = TOOL.parent / "rime" / "yoyo-user.dict.yaml"
OUT = TOOL / "km_brief_data_module.js"

# 合法码元集合：直接取 km_data_module.js 的 KM_BEST_CHORD 键（60 个），保证一致
_km_src = (TOOL / "km_data_module.js").read_text(encoding="utf-8")
_m = __import__("re").search(r"const KM_BEST_CHORD = (\{.*?\});", _km_src, __import__("re").S)
VALID_DAUS = set(json.loads(_m.group(1)).keys())
assert len(VALID_DAUS) == 60, f"码元数应 60，实得 {len(VALID_DAUS)}"


def main():
    words = []
    started = False
    for line in USER_DICT.read_text(encoding="utf-8").splitlines():
        if not started:
            if line.strip() == "...":
                started = True
            continue
        if not line or line.startswith("#"):
            continue
        p = line.split("\t")
        if len(p) >= 2 and p[1].startswith("'"):
            text, code = p[0], p[1]
            assert len(code) == 3, f"非法简词码 {text} {code}"
            assert code[1] in "_+" or code[1] in VALID_DAUS, f"非法码位 {text} {code}"
            rest = code[2] if code[1] in "_+" else code[1:]
            assert all(ch in VALID_DAUS for ch in rest), f"非法码元 {text} {code}"
            weight = int(p[2]) if len(p) > 2 else 0
            words.append({"text": text, "code": code, "weight": weight})

    words.sort(key=lambda x: -x["weight"])
    print(f"简词 {len(words)} 条；码形统计:",
          {"单手L": sum(1 for w in words if w['code'][1] == '_'),
           "单手R": sum(1 for w in words if w['code'][1] == '+'),
           "并击": sum(1 for w in words if w['code'][1] not in '_+')})

    js = (
        "// 空明拳（yoyo-km）前置单引号简词练习数据 —— 由 generate_km_brief_data.py 生成，请勿手改。\n"
        "// 数据源：rime/yoyo-user.dict.yaml 的 ' 前缀码条目（gen_brief_words.py 分配）。\n"
        "// code 码形：'_X（' + 左手一击）/ '+X（' + 右手一击）/ 'XY（' + 左右并击）。\n"
        f"const KM_BRIEF_WORDS = {json.dumps(words, ensure_ascii=False, separators=(',', ':'))};\n"
        "\nif (typeof module !== 'undefined') {\n"
        "  module.exports = { KM_BRIEF_WORDS };\n"
        "}\n"
    )
    OUT.write_text(js, encoding="utf-8")
    print(f"已写 {OUT.name}（{OUT.stat().st_size / 1024:.0f} KB）")


if __name__ == "__main__":
    main()
