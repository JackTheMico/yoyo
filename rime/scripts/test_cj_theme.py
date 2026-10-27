#!/usr/bin/env python3
"""#57 LyraIME 键盘布局与映射数据的对齐校验。

为什么必须自动比对：键盘配置与 `speller.alphabet` 是两份独立数据，错一位不会
报错，只会静默打出另一个字——而 `K` 与 `k` 在串击方案里是两个不同码位。

做法：在桩 DSL 里真执行主题 Lua（`dump_cj_theme.lua`），把每个按键的
click / swipe_up / long_click 解析成「实际送出的码元」，再与 `cj_keymap.lua`
逐条对账。两侧都是「引擎真正会读到的东西」，没有文本模式匹配。

运行：/usr/bin/python3 rime/scripts/test_cj_theme.py
"""

import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
THEME = ROOT / "rime/lyraime/themes/yoyo-pure-cj.lua"
KEYMAP = ROOT / "rime/lua/yoyo/data/cj_keymap.lua"
QUICKBAR = ROOT / "rime/lua/yoyo/data/cj_quickbar.lua"
SCHEMA = ROOT / "rime/yoyo-pure-cj.schema.yaml"
DUMPER = ROOT / "rime/scripts/dump_cj_theme.lua"

FAILS = []


def check(name, cond, detail=""):
    if cond:
        print(f"  ok   {name}")
    else:
        FAILS.append(f"{name} {detail}".strip())
        print(f"  FAIL {name} {detail}")


def lua(path, script):
    p = ROOT / ".workbuddy/tmp" / ("_t57_" + pathlib.Path(script).stem + ".lua")
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(script, encoding="utf-8")
    res = subprocess.run(["lua", str(p), str(path)],
                         capture_output=True, text=True, timeout=120)
    if res.returncode != 0:
        raise SystemExit(f"Lua 执行失败（{path.name}）：\n{res.stderr[:2000]}")
    return res.stdout


def load_keymap():
    out = lua(KEYMAP, 'local M = dofile(arg[1])\n'
                      'for _, e in ipairs(M.entries) do\n'
                      '  io.write(string.format("e\\t%s\\t%s\\t%s\\t%s\\n", '
                      'e.code, e.key, e.layer, e.via))\n'
                      'end\n')
    entries = []
    for line in out.splitlines():
        f = line.split("\t")
        if f[0] == "e":
            entries.append({"code": f[1], "key": f[2], "layer": f[3], "via": f[4]})
    return entries


def load_quickbar():
    out = lua(QUICKBAR, 'local M = dofile(arg[1])\n'
                        'for _, s in ipairs(M.slots) do io.write("c\\t", s.char, "\\n") end\n')
    return [ln.split("\t")[1] for ln in out.splitlines() if ln.startswith("c\t")]


def load_theme():
    """返回 {(row, idx): {field: (raw, value, kind)}}, 以及 label/symbol。"""
    res = subprocess.run(["lua", str(DUMPER), str(THEME)],
                         capture_output=True, text=True, timeout=60)
    if res.returncode != 0:
        raise SystemExit(f"主题加载失败：\n{res.stderr[:2000]}")
    keys, labels, symbols = {}, {}, {}
    for line in res.stdout.splitlines():
        f = line.split("\t")
        if f[0] == "key":
            _, _kb, ri, ki, field, raw, val, kind = f
            k = (int(ri), int(ki))
            keys.setdefault(k, {})[field] = {"raw": raw, "value": val, "kind": kind}
        elif f[0] == "label":
            labels[(int(f[2]), int(f[3]))] = f[4]
        elif f[0] == "symbol":
            symbols[(int(f[2]), int(f[3]))] = f[4]
    return keys, labels, symbols


def schema_alphabet():
    text = SCHEMA.read_text(encoding="utf-8")
    m = re.search(r"^\s*alphabet:\s*\"([^\"]*)\"", text, re.M)
    return m.group(1) if m else ""


def main():
    for p in (THEME, KEYMAP, QUICKBAR, SCHEMA):
        if not p.exists():
            print(f"FAIL 缺少文件：{p}")
            return 1

    entries = load_keymap()
    quick = load_quickbar()
    keys, labels, symbols = load_theme()
    alphabet = schema_alphabet()

    # ── 把主题按键还原成「物理键 → 各层码元」 ───────────────────────────────
    # 物理键的判定口径与映射数据一致：
    #   字母键 = click 是单个小写字母；数字键 = long_click 是数字；
    #   符号键 = click 是 8 个符号之一；快捷字条 = click 命中 cjqNN
    code_units = set(alphabet)
    theme_map = {}          # (physical_key, layer) -> code
    quickbar_seq = []
    tappable = {}

    for (ri, ki), fields in sorted(keys.items()):
        click = fields.get("click")
        swipe = fields.get("swipe_up")
        long = fields.get("long_click")
        click_v = click["value"] if click else ""
        raw_click = click["raw"] if click else ""

        if raw_click.startswith("cjq"):
            quickbar_seq.append(click_v)
            continue

        # 数字键：click 出一个码元，long_click 是数字
        if long and re.fullmatch(r"\d", long["value"]) and click_v in code_units:
            physical = long["value"]
            theme_map[(physical, "digit")] = click_v
            tappable[(physical, "long_click")] = long["value"]
            continue

        if click_v in code_units:
            if re.fullmatch(r"[a-z]", click_v) and long is None:
                physical, layer = click_v, "letter"
            else:
                physical, layer = click_v, "symbol"
            theme_map[(physical, layer)] = click_v
            if swipe:
                theme_map[(physical, "swipe_up")] = swipe["value"]
            continue

        # 功能键（空格 / 回车 / 中英 / 次选）不入映射
        tappable[("_fn", raw_click)] = click_v
        if swipe:
            tappable[("_fn_swipe", raw_click)] = swipe["value"]

    # ── A. 60 码元逐个对齐 ──────────────────────────────────────────────────
    print("\n[A] 键位 → 码元 与映射数据完全一致")
    expect = {(e["key"], e["layer"]): e["code"] for e in entries}
    missing = [(k, v) for k, v in expect.items() if theme_map.get(k) != v]
    extra = [(k, v) for k, v in theme_map.items() if expect.get(k) != v]
    check(f"映射数据 {len(expect)} 条逐条命中", not missing,
          f"{len(missing)} 处不符，如 {missing[:3]}")
    check("主题无多余映射（无映射数据之外的键位→码元）", not extra,
          f"{len(extra)} 处多余，如 {extra[:3]}")

    # ── B. 码元覆盖 ────────────────────────────────────────────────────────
    print("\n[B] 覆盖")
    covered = set(theme_map.values())
    check("60 个码元全部落位", covered == code_units,
          f"缺 {sorted(code_units - covered)} 多 {sorted(covered - code_units)}")
    check("码元不重复落位（同一码元只出现一次）",
          len(theme_map) == len(covered), f"{len(theme_map)} 个键位 vs {len(covered)} 个码元")
    layers = {}
    for (_, layer) in theme_map:
        layers[layer] = layers.get(layer, 0) + 1
    print(f"       分层计数：{layers}")
    check("四层计数与设计一致（letter 26 / digit 10 / symbol 8 / swipe_up 16）",
          layers == {"letter": 26, "digit": 10, "symbol": 8, "swipe_up": 16},
          str(layers))

    # ── C. 三层互不重叠 ────────────────────────────────────────────────────
    print("\n[C] 同一物理键的三层互不重叠")
    per_key = {}
    for (pk, layer), code in theme_map.items():
        per_key.setdefault(pk, []).append(code)
    dup = {k: v for k, v in per_key.items() if len(set(v)) != len(v)}
    check("没有任何键在同一码元上出现两次", not dup, str(list(dup)[:3]))
    # 点击层与上滑层可以共用一个物理键（q 点击出 q、上滑出 Q），但码元必须不同
    both = {k: v for k, v in per_key.items() if len(v) > 1}
    check("复用键位的码元互不相同", all(len(set(v)) == len(v) for v in both.values()),
          str(list(both)[:5]))

    # ── D. 数字键长按不被码元占用 ──────────────────────────────────────────
    print("\n[D] 数字键长按仍出数字")
    bad_num = [k for (k, f), v in tappable.items()
               if f == "long_click" and not re.fullmatch(r"\d", v)]
    check("10 个数字键的长按都是数字", not bad_num, str(bad_num))
    check("数字键长按与数字码元不冲突", not (set("0123456789") & code_units),
          "码元里出现了数字，会导致长按与编码争用")

    # ── E. 快捷字条 ────────────────────────────────────────────────────────
    print("\n[E] 快捷字条")
    check(f"字条 {len(quick)} 个字与数据一致", quickbar_seq == quick,
          f"主题 {quickbar_seq} vs 数据 {quick}")
    qlabels = [labels.get((1, i + 1)) for i in range(len(quick))]
    check("字条每格标签 = 直出字", qlabels == quick, f"{qlabels}")

    # ── F. 交付约束 ────────────────────────────────────────────────────────
    print("\n[F] 交付约束")
    text = THEME.read_text(encoding="utf-8")
    shift_actions = [f"{k}{v['raw']}" for k, fields in keys.items()
                     for v in fields.values() if "Shift" in v["raw"]]
    check("没有任何键动作使用 Shift 修饰（大写码元必须走字面量）",
          not shift_actions, str(shift_actions[:3]))
    check("主题不含 __include / __patch（LyraIME 的 Lua 主题不用 YAML 合并）",
          "__include" not in text and "__patch" not in text)
    check("装机路径在 themes/ 子目录（LyraIME 的扫描目录）",
          "themes/yoyo-pure-cj.lua" in text)
    kt = list((ROOT / "rime/lyraime").rglob("*.kt")) + list((ROOT / "rime/lyraime").rglob("*.java"))
    check("rime/lyraime 下不含客户端源码改动", not kt, str(kt[:3]))

    print()
    if FAILS:
        print(f"---- {len(FAILS)} 项失败 ----")
        for f in FAILS:
            print("  *", f)
        return 1
    print("---- 全部通过 ----")
    return 0


if __name__ == "__main__":
    sys.exit(main())
