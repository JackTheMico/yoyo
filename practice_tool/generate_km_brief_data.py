#!/usr/bin/env python3
"""生成 practice_tool/km_brief_data_module.js（简词练习数据，含两套编码）。

数据源：rime/yoyo-user.dict.yaml 中 `'` 前缀（' 版，两击）与 `%` 前缀
（空格并击版，一击上屏）的简词条目，均由 gen_brief_words.py 分配。

输出：
  KM_BRIEF_WORDS    ' 版：{text, code, weight}，按词频降序
  KM_BRIEF_SPACE    % 版：{text, code, weight}，按词频降序

校验：每个码位字符都是合法码元（与 km_data_module.js 的 KM_BEST_CHORD 一致）。
"""

import json
import re
from pathlib import Path

TOOL = Path(__file__).resolve().parent
USER_DICT = TOOL.parent / "rime" / "yoyo-user.dict.yaml"
OUT = TOOL / "km_brief_data_module.js"

# 合法码元集合：直接取 km_data_module.js 的 KM_BEST_CHORD 键（60 个），保证一致
_src = (TOOL / "km_data_module.js").read_text(encoding="utf-8")
VALID_DAUS = set(json.loads(re.search(r"const KM_BEST_CHORD = (\{.*?\});", _src, re.S).group(1)).keys())
assert len(VALID_DAUS) == 60, f"码元数应 60，实得 {len(VALID_DAUS)}"


def collect(mark):
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
        if len(p) >= 2 and p[1].startswith(mark):
            text, code = p[0], p[1]
            assert len(code) == 3, f"非法简词码 {text} {code}"
            # 码形：mark + XY（双手）或 mark + _X/+X（单手，仅空格版）
            rest = code[2] if code[1] in "_+" else code[1:]
            assert all(ch in VALID_DAUS for ch in rest), f"非法码元 {text} {code}"
            # 注：' 版的 '_X / '+X = 点 ' 再单手一击（两击）；
            #     % 版的 %_X / %+X = 空格与单手码元同时并击（一击）。形态相同、机制不同。
            weight = int(p[2]) if len(p) > 2 else 0
            words.append({"text": text, "code": code, "weight": weight})
    words.sort(key=lambda x: -x["weight"])
    return words


def shape_stat(words):
    return {
        "双手并击": sum(1 for w in words if w["code"][1] not in "_+"),
        "左手一击": sum(1 for w in words if w["code"][1] == "_"),
        "右手一击": sum(1 for w in words if w["code"][1] == "+"),
    }


def main():
    apostrophe = collect("'")
    space = collect("%")
    print(f"' 版简词 {len(apostrophe)} 条 {shape_stat(apostrophe)}")
    print(f"% 版简词 {len(space)} 条 {shape_stat(space)}")

    def dump(name, words):
        return (f"const {name} = "
                f"{json.dumps(words, ensure_ascii=False, separators=(',', ':'))};\n")

    js = (
        "// 空明拳（yoyo-km）简词练习数据 —— 由 generate_km_brief_data.py 生成，请勿手改。\n"
        "// 数据源：rime/yoyo-user.dict.yaml 的 ' 前缀与 % 前缀简词（gen_brief_words.py 分配）。\n"
        "// KM_BRIEF_WORDS  ' 版：' + 字1首根 + 字2首根，先点 ' 再并击，接下一键顶屏（两击）\n"
        "// KM_BRIEF_SPACE  % 版：空格与码元同时并击，末字符到达即上屏（一击）\n"
        "//                 码形 %XY（双手+空格）/ %_X（左手+空格）/ %+X（右手+空格）\n"
        + dump("KM_BRIEF_WORDS", apostrophe)
        + dump("KM_BRIEF_SPACE", space)
        + "\nif (typeof module !== 'undefined') {\n"
        "  module.exports = { KM_BRIEF_WORDS, KM_BRIEF_SPACE };\n"
        "}\n"
    )
    OUT.write_text(js, encoding="utf-8")
    print(f"已写 {OUT.name}（{OUT.stat().st_size / 1024:.0f} KB）")


if __name__ == "__main__":
    main()
