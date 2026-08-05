#!/usr/bin/env python3
"""生成音形练习工具的数据模块 yx_data_module.js。

并击表的来源只有一个：rime/yoyo.yaml 的「折梅」或「寒梅」段。那是一串 xform 重写
规则，**Rime 运行时真正执行的就是它**。练习工具教错指法比不教更糟，所以本脚本不抄
任何副本，而是直接模拟这些规则：枚举左手所有 1–5 键组合，按 chord_composer 的
alphabet 次序归一化，逐条套用 xform，看哪些组合落到合法码元（小写声母键 + 大写
指法字母）上。

右手不单独枚举：方案开头的镜像规则把右手键改写成左手键，两手输出同一批码元。

用 --variant hm 生成寒梅（yoyo-yx-hm）版本的同一套数据。

校验的不变量是「字典里用到的每个码元都必须能被折梅打出来」——这是唯一真正要紧
的性质，脚本会读字表词表核对，缺一个就报错退出。

注意 rime/lua/yoyo/qcode_map_for_win.lua 里也有一张显式并击表，但它是**旧版
180 指法**，与现行折梅（195 指法）的 E/F/I/J/K/L 分配已经不同，且该处理器默认
没有挂进 engine，不参与运行时。本脚本会顺带报告二者差异条数，仅作提醒。

用法:
  python3 generate_yx_data.py
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from itertools import combinations
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent

# 指法变体：yx = 折梅（数字行参与），hm = 寒梅（纯字母、直列键盘人体工程、右手 / 补全）。
# 每档各自定义 chord_composer.alphabet、左手物理键、镜像规则与产物文件名。
VARIANTS = {
    "yx": {
        "label": "折梅",
        "section": "折梅",
        "alphabet": "123456qwertasdfgzxcvb 7890-=uiop[hjkl;ynm,.",
        "left_keys": "12345qwertasdfgzxcvb",
        "mirror": dict(zip("12345qwertasdfgzxcvb", ["=", "-", "0", "9", "8"] + list("[poiu;lkjh.,mny"))),
        "code_re": re.compile(r"^[a-z][A-L]$"),
        "data_module": "yx_data_module.js",
        "fingering": "fingering-yx.json",
    },
    "hm": {
        "label": "寒梅",
        "section": "寒梅",
        "alphabet": "123456qwertasdfgzxcvb 7890-=uiop[hjkl;ynm,./",
        "left_keys": "qwertasdfgzxcvb",
        "mirror": dict(zip("qwertasdfgzxcvb", "poiuy;lkjh/.,mn")),
        "code_re": re.compile(r"^[a-z][A-L]$"),
        "data_module": "yx_data_module_hm.js",
        "fingering": "fingering-hm.json",
    },
}

# 当前变体的运行时配置（parse_args 后由 main 设置；函数引用模块级全局）
ALPHABET = VARIANTS["yx"]["alphabet"]
LEFT_KEYS = VARIANTS["yx"]["left_keys"]
MIRROR = VARIANTS["yx"]["mirror"]
CODE_RE = VARIANTS["yx"]["code_re"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="生成音形练习数据")
    parser.add_argument("--yoyo-yaml", type=Path, default=REPO / "rime" / "yoyo.yaml")
    parser.add_argument(
        "--lua", type=Path, default=REPO / "rime" / "lua" / "yoyo" / "qcode_map_for_win.lua"
    )
    parser.add_argument(
        "--mapping", type=Path, default=REPO / "zigen_table" / "mapping-yx.yaml"
    )
    parser.add_argument(
        "--chars", type=Path, default=REPO / "zigen_table" / "yx-chars.txt"
    )
    parser.add_argument(
        "--variant",
        choices=["yx", "hm"],
        default="yx",
        help="指法变体：yx=折梅（默认），hm=寒梅（纯字母）",
    )
    parser.add_argument("--output", type=Path, default=None, help="默认按变体取 yx_data_module[_hm].js")
    parser.add_argument(
        "--fingering-output",
        type=Path,
        default=None,
        help="码元 → 左手指法，供字根表 HTML 复用同一份推导结果",
    )
    return parser.parse_args()


def load_rules(path: Path, section: str = "折梅") -> list[tuple[str, str]]:
    """抽出指定方案（折梅/寒梅）段里的 xform 规则，保持原有顺序。"""
    lines = path.read_text(encoding="utf-8").splitlines()
    start = next(i for i, l in enumerate(lines) if l.startswith(section + ":"))
    rules = []
    for line in lines[start + 1 :]:
        if line and not line[0].isspace():
            break
        item = line.strip()
        if not item.startswith("- xform|"):
            continue
        parts = item[len("- xform|") :].split("|")
        if len(parts) >= 2:
            rules.append((parts[0], parts[1]))
    return rules


def apply_rules(chord: str, rules: list[tuple[str, str]]) -> str:
    for pattern, repl in rules:
        chord = re.sub(pattern, repl, chord)
    return chord


def normalize(keys: tuple[str, ...]) -> str:
    return "".join(sorted(keys, key=ALPHABET.index))


def derive_chords(rules: list[tuple[str, str]]) -> dict[str, str]:
    """枚举左手 1–4 键组合，找出落到合法码元上的那些。"""
    found: dict[str, str] = {}
    for size in range(1, 6):
        for combo in combinations(LEFT_KEYS, size):
            chord = normalize(combo)
            result = apply_rules(chord, rules)
            if CODE_RE.match(result):
                found[chord] = result
    return found


def load_lua_map(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    text = path.read_text(encoding="utf-8")
    start = text.find("local left_raw_map")
    end = text.find("}", start)
    return {
        normalize(tuple(k)): v
        for k, v in re.findall(r'\["([^"]+)"\]="([^"]+)"', text[start:end])
    }


def load_dict_entries(path: Path):
    """产出 (词条, 前缀, 码元列表)。前缀 _ + < > 分别对应四条输入通道。"""
    in_data = False
    for line in path.open(encoding="utf-8"):
        if not in_data:
            in_data = line.strip() == "..."
            continue
        if not line.strip():
            continue
        text, code, *rest = line.rstrip("\n").split("\t")
        letters = "".join(ch for ch in code if ch.isalpha())
        elements = [letters[i : i + 2] for i in range(0, len(letters) - 1, 2)]
        prefix = code[0] if code[0] in "_+<>" else ""
        yield text, prefix, elements, int(rest[0]) if rest else 0


def collect_jian(paths: list[Path]) -> list[dict]:
    """700 个一简：一次单手并击直接上屏的字/词。"""
    # 前缀语义见 yoyo-yx.schema.yaml 的「八荒六合」：不带空格 _ 左 / + 右，带空格 < 左 / > 右
    channel = {"_": "B", "+": "C", "<": "b", ">": "c"}
    out = []
    for path in paths:
        for text, prefix, elements, weight in load_dict_entries(path):
            if len(elements) == 1 and prefix in channel:
                out.append(
                    {
                        "text": text,
                        "code": elements[0],
                        "channel": channel[prefix],
                        "weight": weight,
                    }
                )
    out.sort(key=lambda e: -e["weight"])
    return out


def min_levels(path: Path) -> dict[str, int]:
    """每个字最少几个码元能定位到它（1=一简，2=两码，3=全码）。"""
    best: dict[str, int] = {}
    for text, _, elements, _ in load_dict_entries(path):
        n = len(elements)
        if n and (text not in best or n < best[text]):
            best[text] = n
    return best


def codes_used_by_dicts(paths: list[Path]) -> set[str]:
    """字表词表里实际用到的码元集合。"""
    used = set()
    for path in paths:
        in_data = False
        for line in path.open(encoding="utf-8"):
            if not in_data:
                in_data = line.strip() == "..."
                continue
            if not line.strip():
                continue
            letters = "".join(ch for ch in line.split("\t")[1] if ch.isalpha())
            for i in range(0, len(letters) - 1, 2):
                used.add(letters[i : i + 2])
    return used


def check_coverage(derived: dict[str, str], used: set[str]) -> None:
    reachable = set(derived.values())
    missing = sorted(used - reachable)
    if missing:
        print(
            f"字典用到 {len(missing)} 个码元，折梅规则却打不出来，拒绝生成：",
            file=sys.stderr,
        )
        print("  " + " ".join(missing[:40]), file=sys.stderr)
        sys.exit(1)
    print(f"覆盖校验通过：字典用到的 {len(used)} 个码元全部可由当前变体打出")
    spare = sorted(reachable - used)
    if spare:
        print(f"当前变体另有 {len(spare)} 个码元未被字典使用（预留）：{' '.join(spare[:20])}")


def report_lua_drift(derived: dict[str, str], lua: dict[str, str]) -> None:
    if not lua:
        return
    drift = {k: (v, derived.get(k)) for k, v in lua.items() if derived.get(k) != v}
    if drift:
        print(
            f"提醒：qcode_map_for_win.lua 的 {len(drift)}/{len(lua)} 条指法与现行折梅不一致（该处理器默认未启用）"
        )


def load_mapping(path: Path) -> tuple[dict[str, list[str]], dict[str, list[str]], dict[str, dict]]:
    shengmu: dict[str, list[str]] = {}
    yunmu: dict[str, list[str]] = {}
    roots: dict[str, dict] = {}
    section = None
    current = None
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        if not line[0].isspace():
            section = line.rstrip(":")
            continue
        if section in ("声母", "韵母"):
            key, _, value = line.strip().partition(": ")
            items = [x.strip() for x in value.strip("[]").split(",")]
            (shengmu if section == "声母" else yunmu)[key] = items
        elif section == "mapping":
            stripped = line.strip()
            if line.startswith("  ") and not line.startswith("    "):
                current = stripped.rstrip(":").strip("'").replace("''", "'")
                roots[current] = {}
            elif current is not None:
                key, _, value = stripped.partition(": ")
                roots[current][key] = value
    return shengmu, yunmu, roots


def js_literal(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, sort_keys=False)


def main() -> None:
    args = parse_args()
    global ALPHABET, LEFT_KEYS, MIRROR, CODE_RE
    variant = VARIANTS[args.variant]
    ALPHABET, LEFT_KEYS, MIRROR, CODE_RE = (
        variant["alphabet"],
        variant["left_keys"],
        variant["mirror"],
        variant["code_re"],
    )
    if args.output is None:
        args.output = HERE / variant["data_module"]
    if args.fingering_output is None:
        args.fingering_output = REPO / "zigen_table" / variant["fingering"]
    rules = load_rules(args.yoyo_yaml, variant["section"])
    derived = derive_chords(rules)
    print(f"{variant['label']}规则覆盖 {len(derived)} 种左手组合 → {len(set(derived.values()))} 个码元")
    check_coverage(
        derived,
        codes_used_by_dicts(
            [
                REPO / "rime" / "yoyo-yx-char.dict.yaml",
                REPO / "rime" / "yoyo-yx-word.dict.yaml",
            ]
        ),
    )
    report_lua_drift(derived, load_lua_map(args.lua))

    # 每个码元的推荐指法：按键数最少者优先，其次按 alphabet 次序，取最省力那个
    best: dict[str, str] = {}
    for chord, code in sorted(derived.items(), key=lambda kv: (len(kv[1]), kv[0])):
        if code not in best or (len(chord), chord) < (len(best[code]), best[code]):
            best[code] = chord

    # 指法只在这里从 yoyo.yaml 推一次；字根表 HTML 读这份 JSON，避免两处实现各自漂移
    args.fingering_output.write_text(
        json.dumps(best, ensure_ascii=False, indent=1, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(f"码元指法 {len(best)} 条 → {args.fingering_output}")

    shengmu, yunmu, roots = load_mapping(args.mapping)
    char_dict = REPO / "rime" / "yoyo-yx-char.dict.yaml"
    levels = min_levels(char_dict)
    jian = collect_jian([char_dict, REPO / "rime" / "yoyo-yx-word.dict.yaml"])
    chars = []
    for line in args.chars.read_text(encoding="utf-8").splitlines():
        text, full, syllable, first, last = line.split("\t")
        chars.append(
            {
                "char": text,
                "code": full,
                "syllable": syllable,
                "first": first,
                "last": last,
                "level": levels.get(text, 3),
            }
        )

    out = [
        "// 音形（yoyo-yx/yoyo-yx-hm）练习数据 —— 由 generate_yx_data.py 生成，请勿手改。",
        "// 并击表由 rime/yoyo.yaml 的「折梅」/「寒梅」规则模拟得出，并校验过字表词表用到的码元全部可达。",
        "",
        f"// 左手按键组合 → 码元（{len(derived)} 种组合，含等价写法）",
        f"const YX_CHORDS = {js_literal(derived)};",
        "",
        f"// 每个码元的推荐（最省力）左手指法，共 {len(best)} 个码元",
        f"const YX_BEST_CHORD = {js_literal(best)};",
        "",
        "// 左手键 → 右手镜像键；两手打出同一批码元",
        f"const YX_MIRROR = {js_literal(MIRROR)};",
        "",
        "// 同一击内按键的归一化次序（取自 chord_composer.alphabet 的左手段）",
        f"const YX_LEFT_ORDER = {js_literal(LEFT_KEYS)};",
        "",
        "// 声母 → 键位",
        f"const YX_SHENGMU = {js_literal(shengmu)};",
        "",
        "// 韵母 → 指法",
        f"const YX_YUNMU = {js_literal(yunmu)};",
        "",
        f"// 字根 → 码元（{len(roots)} 个）",
        f"const YX_ZIGEN = {js_literal(roots)};",
        "",
        f"// 单字：全码 / 音节码 / 首字根 / 末字根 / 最少码元数（按词频降序，{len(chars)} 字）",
        f"const YX_CHARS = {js_literal(chars)};",
        "",
        f"// 一简：一次单手并击直接上屏的字词（{len(jian)} 个）",
        "// channel: B=左手不带空格 C=右手不带空格 b=左手带空格 c=右手带空格",
        f"const YX_JIAN = {js_literal(jian)};",
        "",
        "if (typeof module !== 'undefined') {",
        "  module.exports = { YX_CHORDS, YX_BEST_CHORD, YX_MIRROR, YX_LEFT_ORDER,"
        " YX_SHENGMU, YX_YUNMU, YX_ZIGEN, YX_CHARS, YX_JIAN };",
        "}",
        "",
    ]
    args.output.write_text("\n".join(out), encoding="utf-8")
    size = args.output.stat().st_size / 1024
    print(f"字根 {len(roots)}，单字 {len(chars)} → {args.output}（{size:.0f} KiB）")


if __name__ == "__main__":
    main()
