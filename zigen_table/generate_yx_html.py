#!/usr/bin/env python3
"""生成音形（yoyo-yx）字根表 HTML。

和纯形字根表的区别在于码位结构：纯形是 60 个键位一维铺开，音形是
声母键（15，小写）× 韵母指法（12，大写）= 180 个码元的二维表格。

指法读 fingering-yx.json（由 practice_tool/generate_yx_data.py 从
rime/yoyo.yaml 的「折梅」规则推出），不在这里重新实现一遍；仅 bA–bL
按布局规范固定为专用的左右手标准指法，避免自动最短组合覆盖展示结果。
"""

from __future__ import annotations

import argparse
import html
import json
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent

# 声母键在键盘上的排布，同时决定表格列序
SHENGMU_ROWS = ["qwert", "asdfg", "zxcvb"]
SHENGMU_KEYS = "".join(SHENGMU_ROWS)
YUNMU_KEYS = "ABCDEFGHIJKL"

# 真实汉语音节表（按声母分组）。与 practice_tool/yx_practice_hm.js 的 INITIAL_SYLLABLES
# 保持一致，字根表与练习工具对同一码元反查出的音节完全一致；改拼音方案需两处同步。
SYLLABLES = {
    "b": ["ba", "bo", "bi", "bu", "bai", "bei", "bao", "ban", "ben", "bang", "beng", "bing"],
    "p": ["pa", "po", "pi", "pu", "pai", "pei", "pao", "pan", "pen", "pang", "peng", "ping"],
    "m": ["ma", "mo", "mi", "mu", "mai", "mei", "mao", "man", "men", "mang", "meng", "ming"],
    "f": ["fa", "fo", "fu", "fei", "fan", "fen", "fang", "feng"],
    "d": ["da", "de", "di", "du", "dai", "dei", "dao", "dou", "dan", "dang", "deng", "ding", "dong", "duan", "dui", "dun"],
    "t": ["ta", "te", "ti", "tu", "tai", "tao", "tou", "tan", "tang", "teng", "ting", "tong", "tuan", "tui", "tun"],
    "n": ["na", "ne", "ni", "nu", "nv", "nai", "nei", "nao", "nan", "nen", "nang", "neng", "ning", "nong", "nian", "niang", "niao", "nin", "nuan", "nve"],
    "l": ["la", "le", "li", "lu", "lv", "lai", "lei", "lao", "lou", "lan", "lang", "leng", "ling", "long", "lia", "lie", "liao", "liu", "lian", "lin", "liang", "luan", "lun", "lve"],
    "g": ["ga", "ge", "gu", "gai", "gei", "gao", "gou", "gan", "gen", "gang", "geng", "gong", "gua", "guo", "guai", "gui", "guan", "gun", "guang"],
    "k": ["ka", "ke", "ku", "kai", "kao", "kou", "kan", "ken", "kang", "keng", "kong", "kua", "kuo", "kuai", "kui", "kuan", "kun", "kuang"],
    "h": ["ha", "he", "hu", "hai", "hei", "hao", "hou", "han", "hen", "hang", "heng", "hong", "hua", "huo", "huai", "hui", "huan", "hun", "huang"],
    "j": ["ji", "ju", "jia", "jie", "jiao", "jiu", "jian", "jin", "jiang", "jing", "jiong", "juan", "jun", "jue"],
    "q": ["qi", "qu", "qia", "qie", "qiao", "qiu", "qian", "qin", "qiang", "qing", "qiong", "quan", "qun", "que"],
    "x": ["xi", "xu", "xia", "xie", "xiao", "xiu", "xian", "xin", "xiang", "xing", "xiong", "xuan", "xun", "xue"],
    "zh": ["zha", "zhe", "zhi", "zhu", "zhai", "zhao", "zhou", "zhan", "zhen", "zhang", "zheng", "zhong", "zhua", "zhuo", "zhuai", "zhui", "zhuan", "zhun", "zhuang"],
    "ch": ["cha", "che", "chi", "chu", "chai", "chao", "chou", "chan", "chen", "chang", "cheng", "chong", "chuo", "chuai", "chui", "chuan", "chun", "chuang"],
    "sh": ["sha", "she", "shi", "shu", "shai", "shao", "shou", "shan", "shen", "shang", "sheng", "shua", "shuo", "shuai", "shui", "shuan", "shun", "shuang"],
    "r": ["re", "ri", "ru", "rao", "rou", "ran", "ren", "rang", "reng", "rong", "ruo", "rui", "ruan", "run"],
    "z": ["za", "ze", "zi", "zu", "zai", "zei", "zao", "zou", "zan", "zen", "zang", "zeng", "zong", "zuan", "zui", "zun"],
    "c": ["ca", "ce", "ci", "cu", "cai", "cao", "cou", "can", "cen", "cang", "ceng", "cong", "cuan", "cui", "cun"],
    "s": ["sa", "se", "si", "su", "sai", "sao", "sou", "san", "sen", "sang", "seng", "song", "suan", "sui", "sun"],
    "y": ["ya", "ye", "yi", "yu", "yao", "you", "yan", "yin", "yang", "ying", "yong", "yuan", "yun", "yue"],
    "w": ["wa", "wo", "wu", "wai", "wei", "wan", "wen", "wang", "weng"],
    "零声母": ["a", "o", "e", "ai", "ei", "ao", "ou", "an", "en", "ang", "eng", "er"],
}

# 指法变体：yx = 折梅（含数字行），hm = 寒梅（纯字母三行、右手 / 补全 z 的对称）。
# 各档定义画指法示意图用的按键网格、bA–bL 专用左右手指法及产物文件名。
VARIANTS = {
    "yx": {
        "label": "折梅",
        "key_grid": ["12345", "qwert", "asdfg", "zxcvb"],
        "right_key_grid": ["=-098", "[poiu", ";lkjh", ".,mny"],
        "b_left": "b gb fb db sb vb fgb dfb sdb dgb sfb dxb".split(),
        "b_right": "y 7y 8y 9y 0y yu 78y 89y 90y 79y 80y 9yo".split(),
        "fingering": "fingering-yx.json",
        "output": "zigen_table-yx.html",
        "title": "呦呦 · 音形字根表",
        "grid_rows": "四行",
        "grid_label": "12345 / qwert / asdfg / zxcvb",
        "subtitle_note": "",
    },
    "hm": {
        "label": "寒梅",
        "key_grid": ["qwert", "asdfg", "zxcvb"],
        "right_key_grid": ["poiuy", ";lkjh", "/.,mn"],
        "b_left": "b qb ab zb gb wb xb dxb eb cb sb db".split(),
        "b_right": "n pn ;n /n hn on .n k.n in ,n ln kn".split(),
        "fingering": "fingering-hm.json",
        "output": "zigen_table-yx-hm.html",
        "title": "呦呦 · 音形字根表 · 寒梅",
        "grid_rows": "三行",
        "grid_label": "qwert / asdfg / zxcvb",
        "subtitle_note": "（寒梅指法：不使用 0-9 与 - = [ ]，右手 / 补全 z 的对称输入）",
    },
}

# 当前变体的运行时配置（parse_args 后由 main 设置）
KEY_GRID = VARIANTS["yx"]["key_grid"]
RIGHT_KEY_GRID = VARIANTS["yx"]["right_key_grid"]
MIRROR_KEYS = dict(zip("".join(KEY_GRID), "".join(RIGHT_KEY_GRID)))
B_FINGERING = {
    f"b{finger}": (left, right)
    for finger, left, right in zip(YUNMU_KEYS, VARIANTS["yx"]["b_left"], VARIANTS["yx"]["b_right"])
}
TITLE = VARIANTS["yx"]["title"]
GRID_ROWS = VARIANTS["yx"]["grid_rows"]
GRID_LABEL = VARIANTS["yx"]["grid_label"]
SUBTITLE_NOTE = VARIANTS["yx"]["subtitle_note"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--variant",
        choices=["yx", "hm"],
        default="yx",
        help="指法变体：yx=折梅（默认），hm=寒梅（纯字母）",
    )
    parser.add_argument("--mapping", type=Path, default=HERE / "mapping-yx.yaml")
    parser.add_argument("--fingering", type=Path, default=None)
    parser.add_argument("--output", type=Path, default=None)
    return parser.parse_args()


def load_mapping(path: Path) -> tuple[dict[str, list[str]], dict[str, list[str]], dict[str, dict]]:
    """mapping-yx.yaml 是本脚本生成的固定格式，按行读即可，不引 PyYAML。"""
    shengmu: dict[str, list[str]] = {}
    yunmu: dict[str, list[str]] = {}
    roots: dict[str, dict] = {}
    section = None
    current = None
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
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
                roots[current][key] = value.strip("'").replace("''", "'")
    return shengmu, yunmu, roots


def image_path(root: str) -> str:
    return f"char_images/{ord(root[0]):04x}.png"


def render_fingering(chord: str, right_chord=None) -> str:
    """把并击按键画成 4×5 的小格子，亮的是要按的键。"""
    cells = []
    for row in KEY_GRID:
        for key in row:
            on = " on" if key in chord else ""
            cells.append(f'<i class="fk{on}"></i>')
    if right_chord is None:
        right_chord = "".join(MIRROR_KEYS[key] for key in chord)
    escaped_left = html.escape(chord, quote=True)
    escaped_right = html.escape(right_chord, quote=True)
    return (
        f'<span class="fingering" data-left-keys="{escaped_left}"'
        f' data-right-keys="{escaped_right}" tabindex="0"'
        f' aria-label="左手按键：{escaped_left}；右手按键：{escaped_right}">'
        f'{"".join(cells)}</span>'
    )


def is_pua(char: str) -> bool:
    return len(char) == 1 and 0xE000 <= ord(char) <= 0xF8FF


def code_syllables(key: str, finger: str, shengmu: dict, yunmu: dict) -> list[str]:
    """码元（声母键 + 指法字母）能拼出的全部合法音节，按声母/韵母顺序排列。

    与练习工具的 codeToSyllables 同逻辑：声母项「零声母」直接拼韵母本身，
    其余声母拼出的音节必须在真实音节表里才算合法。
    """
    out: list[str] = []
    for initial in shengmu.get(key, []):
        for final in yunmu.get(finger, []):
            if initial == "零声母":
                if final in SYLLABLES["零声母"]:
                    out.append(final)
            else:
                syl = initial + final
                if syl in SYLLABLES.get(initial, []):
                    out.append(syl)
    return out


def build_chord_index(fingering: dict[str, str]) -> dict[str, str]:
    """并击组合（归一化：去重 + 排序，并击无先后）→ 码元的反向索引。

    占用判定必须无歧义：若归一化后同一组合被多个码元使用，直接失败，
    防止未来重排键位引入组合冲突时错误索引静默上线。
    """
    index: dict[str, str] = {}
    for code, chord in fingering.items():
        norm = "".join(sorted(set(chord)))
        prev = index.get(norm)
        if prev is not None and prev != code:
            raise SystemExit(
                f"组合 {norm} 同时被码元 {prev} 与 {code} 占用，"
                f"占用判定存在歧义，请先重排键位"
            )
        index[norm] = code
    return index


def build_cells(roots: dict[str, dict]) -> dict[str, list[dict]]:
    """码元 → 字根列表，按字根出现顺序（即字表频序）保留。"""
    cells: dict[str, list[dict]] = defaultdict(list)
    for root, info in roots.items():
        code = info.get("code")
        if not code:
            continue
        # 六个基本笔画在字表里写作 1-6，要显示成 一丨丿丶乛乙
        glyph = info.get("stroke") or root
        note = info.get("name") or info.get("examples") or ""
        if info.get("stroke"):
            note = f"基本笔画 {glyph}"
        elif info.get("examples"):
            note = f"如 {info['examples']}"
        cells[code].append({"glyph": glyph, "note": note, "pua": is_pua(glyph)})
    return cells


def generate(shengmu, yunmu, roots, fingering) -> str:
    cells = build_cells(roots)
    total_roots = sum(len(v) for v in cells.values())
    filled = sum(1 for k in cells if cells[k])

    # 按键组合占用查询的嵌入数据：反向索引 + 码元说明（生成时自检组合冲突）
    chord_index = build_chord_index(fingering)
    code_info: dict[str, dict] = {}
    for code in fingering:
        sm, ym = code[0], code[1]
        syls = " / ".join(code_syllables(sm, ym, shengmu, yunmu))
        glyphs = " ".join(item["glyph"] for item in cells.get(code, []))
        code_info[code] = {"sm": sm, "ym": ym, "syls": syls, "roots": glyphs}
    allowed_keys = "".join(KEY_GRID)
    chord_json = json.dumps(chord_index, ensure_ascii=False).replace("<", "\\u003c")
    info_json = json.dumps(code_info, ensure_ascii=False).replace("<", "\\u003c")
    allowed_json = json.dumps(allowed_keys)

    head = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>呦呦·音形字根表</title>
    <style>
        :root {{
            --ink-black: oklch(0.15 0.01 65);
            --ink-dark: oklch(0.25 0.01 65);
            --ink-medium: oklch(0.42 0.01 65);
            --ink-light: oklch(0.65 0.01 65);
            --paper-white: oklch(0.97 0.005 90);
            --paper-cream: oklch(0.95 0.01 85);
            --cinnabar-red: oklch(0.55 0.18 25);
            --border-color: oklch(0.85 0.01 85);
        }}
        @font-face {{
            font-family: "ChaiPUA";
            src: url("ChaiPUA-0.2.7.ttf") format("truetype");
        }}
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
            background: linear-gradient(135deg, var(--paper-cream) 0%, var(--paper-white) 100%);
            min-height: 100vh; padding: 15px; color: var(--ink-black);
        }}
        .container {{ max-width: 1750px; margin: 0 auto; }}
        h1 {{
            font-family: "Noto Serif SC", Georgia, serif; text-align: center;
            font-size: 1.9em; font-weight: 700; letter-spacing: .05em; margin-bottom: 6px;
        }}
        .subtitle {{
            text-align: center; color: var(--ink-medium); font-size: 13px;
            margin-bottom: 14px; line-height: 1.7;
        }}
        table {{ border-collapse: collapse; width: 100%; table-layout: fixed; }}
        th, td {{ border: 1px solid var(--border-color); vertical-align: top; }}
        thead th {{
            background: var(--paper-cream); padding: 4px 2px; text-align: center;
            position: sticky; top: 0; z-index: 5;
        }}
        .sm-key {{ font-size: 15px; font-weight: 700; font-family: ui-monospace, monospace; }}
        .sm-list {{ font-size: 10px; color: var(--ink-medium); margin-top: 1px; }}
        .corner {{ width: 74px; }}
        tbody th {{
            background: var(--paper-cream); padding: 4px 5px; text-align: left;
            width: 74px; position: sticky; left: 0; z-index: 4;
        }}
        .ym-key {{ font-size: 15px; font-weight: 700; font-family: ui-monospace, monospace; }}
        .ym-list {{ font-size: 10px; color: var(--ink-medium); line-height: 1.35; }}
        td {{ padding: 3px; height: 58px; }}
        td.empty {{ background: repeating-linear-gradient(45deg,
            transparent, transparent 5px, var(--border-color) 5px, var(--border-color) 6px); }}
        .cell-head {{ display: flex; align-items: center; gap: 3px; margin-bottom: 2px; }}
        .code {{
            font-family: ui-monospace, monospace; font-size: 11px;
            color: var(--ink-dark); font-weight: 700;
        }}
        .roots {{ display: flex; flex-wrap: wrap; gap: 1px; align-items: flex-end; }}
        .root-img {{ width: 24px; height: 24px; object-fit: contain; cursor: pointer;
            transition: transform .15s; }}
        .root-img:hover {{ transform: scale(1.4); }}
        .root-text {{ font-size: 18px; line-height: 24px; cursor: pointer; }}
        .root-text.pua {{ font-family: "ChaiPUA", "Noto Sans SC", sans-serif; }}
        .syls {{ font-size: 10px; color: var(--ink-light); line-height: 1.3; margin-top: 2px;
            word-break: break-all; user-select: none; }}

        /* 指法示意：并击按键网格（yx 四行 / hm 三行） */
        .fingering {{
            display: grid; grid-template-columns: repeat(5, 4px);
            grid-auto-rows: 4px; gap: 1px; flex-shrink: 0; cursor: help;
        }}
        .fingering:focus-visible {{ outline: 2px solid var(--cinnabar-red); outline-offset: 2px; }}
        .fk {{ background: oklch(0.9 0.005 85); border-radius: 1px; }}
        .fk.on {{ background: var(--cinnabar-red); }}

        .legend {{
            margin-top: 14px; text-align: center; color: var(--ink-medium);
            font-size: 12px; line-height: 1.9;
        }}
        .legend code {{ background: var(--paper-cream); padding: 1px 4px; border-radius: 3px; }}

        /* 按键组合占用查询 */
        .chord-query {{
            max-width: 680px; margin: 0 auto 16px; display: flex;
            flex-direction: column; gap: 7px; align-items: center;
        }}
        .chord-query input {{
            width: 100%; padding: 8px 12px; font-size: 15px; text-align: center;
            font-family: ui-monospace, monospace; color: var(--ink-black);
            background: var(--paper-white); border: 1px solid var(--border-color);
            border-radius: 6px; outline: none; transition: border-color .15s, box-shadow .15s;
        }}
        .chord-query input:focus {{
            border-color: var(--cinnabar-red);
            box-shadow: 0 0 0 2px oklch(0.55 0.18 25 / .15);
        }}
        .chord-result {{
            min-height: 20px; font-size: 13px; color: var(--ink-medium);
            line-height: 1.7; text-align: center;
        }}
        .chord-result .hit {{
            color: var(--cinnabar-red); font-weight: 700;
            font-family: ui-monospace, monospace;
        }}
        .tooltip {{
            position: fixed; background: var(--paper-white); border: 1px solid var(--border-color);
            border-radius: 6px; padding: 14px 18px; box-shadow: 0 4px 20px rgba(0,0,0,.15);
            font-size: 14px; max-width: 220px; z-index: 1000;
            opacity: 0; visibility: hidden; transition: opacity .2s, visibility .2s;
        }}
        .tooltip.visible {{ opacity: 1; visibility: visible; }}
        .tooltip-img {{ width: 64px; height: 64px; object-fit: contain; display: block;
            margin: 0 auto 8px; }}
        .tooltip-name {{ text-align: center; color: var(--ink-medium); line-height: 1.6; }}
        .tooltip-code {{ text-align: center; font-family: ui-monospace, monospace;
            color: var(--cinnabar-red); font-weight: 700; margin-top: 4px; }}
        .key-tooltip {{
            position: fixed; z-index: 1100; padding: 8px 11px;
            background: var(--ink-black); color: var(--paper-white);
            border-radius: 5px; box-shadow: 0 4px 14px rgba(0,0,0,.22);
            font-size: 12px; line-height: 1.65; white-space: nowrap; pointer-events: none;
            opacity: 0; visibility: hidden; transform: translateY(-2px);
            transition: opacity .12s, visibility .12s, transform .12s;
        }}
        .key-tooltip.visible {{
            opacity: 1; visibility: visible; transform: translateY(0);
        }}
        .key-tooltip kbd {{
            margin-left: 5px; color: oklch(0.82 0.15 35);
            font-family: ui-monospace, monospace; font-size: 13px; font-weight: 700;
        }}
        .key-tooltip-row {{ display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }}
    </style>
</head>
<body>
<div class="container">
    <h1>{TITLE}</h1>
    <div class="subtitle">
        码元 = 声母键（列，小写 15 个）+ 韵母指法（行，大写 12 个），共 180 个码元，
        承载 {total_roots} 个字根，占用 {filled} 个码位。{SUBTITLE_NOTE}<br>
        每格左上角的小方阵是这个码元的左手并击指法，<b style="color:var(--cinnabar-red)">红点</b>为要按下的键
        （{GRID_ROWS}对应 <code>{GRID_LABEL}</code>，鼠标悬停可看具体按键）。
        右手通常镜像等价，<code>bA–bL</code> 采用悬停所示的专用右手指法。
        每格底部的小字是该码元能拼出的全部合法音节，方便对照声韵练习。
    </div>
    <div class="chord-query">
        <input type="text" id="chord-input" inputmode="none" autocomplete="off"
               spellcheck="false" autocapitalize="off"
               placeholder="查询按键组合占用：输入 1–3 个键，如 wt（键位：{GRID_LABEL}）">
        <div class="chord-result" id="chord-result" role="status" aria-live="polite"></div>
    </div>
    <script>
const ALLOWED_KEYS = {allowed_json};
const CHORD_TO_CODE = {chord_json};
const CODE_INFO = {info_json};
    </script>
    <table>
        <thead>
            <tr><th class="corner"></th>
"""

    parts = [head]
    for key in SHENGMU_KEYS:
        initials = " ".join(shengmu.get(key, []))
        parts.append(
            f'                <th><div class="sm-key">{key}</div>'
            f'<div class="sm-list">{html.escape(initials)}</div></th>\n'
        )
    parts.append("            </tr>\n        </thead>\n        <tbody>\n")

    for finger in YUNMU_KEYS:
        finals = " ".join(yunmu.get(finger, []))
        parts.append(
            f'            <tr>\n                <th><div class="ym-key">{finger}</div>'
            f'<div class="ym-list">{html.escape(finals)}</div></th>\n'
        )
        for key in SHENGMU_KEYS:
            code = key + finger
            items = cells.get(code, [])
            chord = fingering.get(code, "")
            chord, right_chord = B_FINGERING.get(code, (chord, None))
            body = [
                '                    <div class="cell-head">',
                render_fingering(chord, right_chord),
                f'<span class="code">{code}</span></div>',
            ]
            if items:
                body.append('<div class="roots">')
                for item in items:
                    glyph, note = item["glyph"], item["note"]
                    payload = html.escape(
                        json.dumps([glyph, note, code], ensure_ascii=False), quote=True
                    )
                    text_cls = "root-text pua" if item["pua"] else "root-text"
                    fallback = f'<span class="{text_cls}">{html.escape(glyph)}</span>'
                    if len(glyph) == 1:
                        body.append(
                            f'<img class="root-img" src="{image_path(glyph)}"'
                            f' alt="{html.escape(glyph)}" title="{html.escape(note or glyph)}"'
                            f' data-info="{payload}"'
                            f" onerror=\"this.outerHTML=this.dataset.fallback\""
                            f" data-fallback='{fallback}'>"
                        )
                    else:
                        body.append(
                            f'<span class="{text_cls}" data-info="{payload}">'
                            f"{html.escape(glyph)}</span>"
                        )
                body.append("</div>")
            syls = code_syllables(key, finger, shengmu, yunmu)
            if syls:
                body.append(f'<div class="syls">{html.escape(" / ".join(syls))}</div>')
            cls = "" if items else ' class="empty"'
            parts.append(f"                <td{cls}>{''.join(body)}</td>\n")
        parts.append("            </tr>\n")

    parts.append(
        """        </tbody>
    </table>
    <div class="legend">
        点击字根看放大图与说明　·　空白斜纹格 = 该码元没挂字根（只用于音节码）<br>
        字根图片与纯形字根表共用同一套；<code>v</code> = ü，<code>ue</code> 是 jue/que/xue 的韵母，
        <code>ve</code> 是 lve/nve 的韵母
    </div>
</div>

<div class="key-tooltip" id="key-tooltip" role="tooltip">
    <div class="key-tooltip-row">左手按键 <kbd id="key-tooltip-left"></kbd></div>
    <div class="key-tooltip-row">右手按键 <kbd id="key-tooltip-right"></kbd></div>
</div>

<div class="tooltip" id="tooltip">
    <img class="tooltip-img" id="tooltip-img" src="" alt="">
    <div class="tooltip-name" id="tooltip-name"></div>
    <div class="tooltip-code" id="tooltip-code"></div>
</div>

<script>
const tooltip = document.getElementById('tooltip');
const tooltipImg = document.getElementById('tooltip-img');
const tooltipName = document.getElementById('tooltip-name');
const tooltipCode = document.getElementById('tooltip-code');
const keyTooltip = document.getElementById('key-tooltip');
const keyTooltipLeft = document.getElementById('key-tooltip-left');
const keyTooltipRight = document.getElementById('key-tooltip-right');

function showKeyTooltip(target) {
    keyTooltipLeft.textContent = target.dataset.leftKeys;
    keyTooltipRight.textContent = target.dataset.rightKeys;
    keyTooltip.classList.add('visible');

    const rect = target.getBoundingClientRect();
    const width = keyTooltip.offsetWidth;
    const height = keyTooltip.offsetHeight;
    const left = Math.min(
        Math.max(8, rect.left + rect.width / 2 - width / 2),
        window.innerWidth - width - 8
    );
    let top = rect.bottom + 7;
    if (top + height > window.innerHeight - 8) {
        top = Math.max(8, rect.top - height - 7);
    }
    keyTooltip.style.left = left + 'px';
    keyTooltip.style.top = top + 'px';
}

function hideKeyTooltip() {
    keyTooltip.classList.remove('visible');
}

document.querySelectorAll('.fingering').forEach((target) => {
    target.addEventListener('mouseenter', () => showKeyTooltip(target));
    target.addEventListener('mouseleave', hideKeyTooltip);
    target.addEventListener('focus', () => showKeyTooltip(target));
    target.addEventListener('blur', hideKeyTooltip);
});

document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-info]');
    if (!target) {
        tooltip.classList.remove('visible');
        return;
    }
    const [root, name, code] = JSON.parse(target.dataset.info);
    if (target.tagName === 'IMG') {
        tooltipImg.src = target.src;
        tooltipImg.style.display = 'block';
    } else {
        tooltipImg.style.display = 'none';
    }
    tooltipName.textContent = name || root;
    tooltipCode.textContent = code;
    const rect = target.getBoundingClientRect();
    let left = Math.min(Math.max(10, rect.left + rect.width / 2 - 110), window.innerWidth - 230);
    let top = rect.bottom + 10;
    if (top > window.innerHeight - 200) top = Math.max(10, rect.top - 190);
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.classList.add('visible');
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        tooltip.classList.remove('visible');
        hideKeyTooltip();
    }
});

// 按键组合占用查询：归一化（去重 + 排序，并击无先后）后查反向索引
const chordInput = document.getElementById('chord-input');
const chordResult = document.getElementById('chord-result');

function normalizeChord(raw) {
    const keys = new Set();
    for (const ch of raw.toLowerCase()) {
        if (ALLOWED_KEYS.includes(ch)) keys.add(ch);
    }
    return [...keys].sort().join('');
}

function updateChordResult() {
    const raw = chordInput.value;
    if (!raw.trim()) {
        chordResult.textContent = '';
        return;
    }
    const keys = normalizeChord(raw);
    if (!keys) {
        chordResult.textContent =
            '未识别到有效按键（本表可用键位：' + ALLOWED_KEYS + '）';
        return;
    }
    const code = CHORD_TO_CODE[keys];
    if (code) {
        const info = CODE_INFO[code] || { sm: code[0], ym: code[1], syls: '', roots: '' };
        const bits = [
            `已占用：组合 <span class="hit">${keys}</span> 对应码元 <span class="hit">${code}</span>` +
            `（声母 ${info.sm} · 韵母 ${info.ym}）`
        ];
        if (info.syls) bits.push(`音节：${info.syls}`);
        if (info.roots) bits.push(`字根：${info.roots}`);
        chordResult.innerHTML = bits.join('，');
    } else {
        chordResult.textContent =
            `空闲：组合 ${keys} 未被任何码元占用，可用于扩展`;
    }
}

chordInput.addEventListener('input', updateChordResult);
// 故意不 stopPropagation：让 document 级 Escape 监听一并关闭 tooltip
chordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        chordInput.value = '';
        updateChordResult();
    }
});
</script>
</body>
</html>
"""
    )
    return "".join(parts)


def main() -> None:
    args = parse_args()
    global KEY_GRID, RIGHT_KEY_GRID, MIRROR_KEYS, B_FINGERING, TITLE, GRID_ROWS, GRID_LABEL, SUBTITLE_NOTE
    variant = VARIANTS[args.variant]
    KEY_GRID = variant["key_grid"]
    RIGHT_KEY_GRID = variant["right_key_grid"]
    MIRROR_KEYS = dict(zip("".join(KEY_GRID), "".join(RIGHT_KEY_GRID)))
    B_FINGERING = {
        f"b{finger}": (left, right)
        for finger, left, right in zip(YUNMU_KEYS, variant["b_left"], variant["b_right"])
    }
    assert len(variant["b_left"]) == len(YUNMU_KEYS) == len(variant["b_right"]), (
        f"{args.variant} b 硬编码表长度须为 {len(YUNMU_KEYS)}"
    )
    TITLE, GRID_ROWS, GRID_LABEL, SUBTITLE_NOTE = (
        variant["title"], variant["grid_rows"], variant["grid_label"], variant["subtitle_note"],
    )
    if args.fingering is None:
        args.fingering = HERE / variant["fingering"]
    if args.output is None:
        args.output = HERE / variant["output"]
    shengmu, yunmu, roots = load_mapping(args.mapping)
    fingering = json.loads(args.fingering.read_text(encoding="utf-8"))

    missing = [
        key + finger
        for key in SHENGMU_KEYS
        for finger in YUNMU_KEYS
        if key + finger not in fingering
    ]
    if missing:
        raise SystemExit(f"指法表缺 {len(missing)} 个码元，先跑 practice_tool/generate_yx_data.py：{missing[:10]}")

    html_text = generate(shengmu, yunmu, roots, fingering)
    args.output.write_text(html_text, encoding="utf-8")
    print(
        f"声母 {len(shengmu)} / 韵母 {len(yunmu)} / 字根 {len(roots)}"
        f" → {args.output}（{len(html_text) / 1024:.0f} KiB）"
    )


if __name__ == "__main__":
    main()
