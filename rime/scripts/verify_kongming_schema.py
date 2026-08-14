#!/usr/bin/env python3
"""验证 yoyo 空明拳 schema（yoyo-bm-km / yoyo-wx-km）全链路。

模拟 librime chord_composer.algebra（内功心法 → 指法 顺序替换），验证：
1. 两个新 schema 存在，schema_id/name、心法段引用、指法段引用（空明拳）、词典复用正确；
2. 心法段按键折叠规则把四种击键方式折叠成正确格式标记；
3. 心法 + 空明拳指法组合规则链下，键组合折叠成码元：65 码元全可达、无冲突、左右手镜像对称；
4. 复用词典（yoyo-bm / yoyo-wx）编码字符集 ⊆ 空明拳 65 码元集。
"""
import re
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
RIME_DIR = HERE.parent
YOYO_YAML = RIME_DIR / "yoyo.yaml"

# schema_id -> 期望结构
SCHEMAS = {
    "yoyo-bm-km": {
        "name": "麓鸣·北冥·空明",
        "xinfa": "北冥神功",        # 主单字：无空格 -> [左右]，带空格 -> (左右)
        "dict": "yoyo-bm",
        "ns": ("[", "]"),           # 无空格并击（单字前两码）
        "ws": ("(", ")"),           # 带空格并击（词前两码）
    },
    "yoyo-wx-km": {
        "name": "麓鸣·无相·空明",
        "xinfa": "小无相功",        # 主词：无空格 -> (左右)，带空格 -> [左右]
        "dict": "yoyo-wx",
        "ns": ("(", ")"),           # 无空格并击（词前两码）
        "ws": ("[", "]"),           # 带空格并击（单字前两码）
    },
}

# 空明拳右手键 -> 左手键（与 yoyo.yaml 空明拳段镜像一致）
MIRROR = {
    "y": "t", "u": "r", "i": "e", "o": "w", "p": "q",
    "h": "g", "j": "f", "k": "d", "l": "s", ";": "a",
    "n": "b", "m": "v", ",": "c", ".": "x", "/": "z",
}
INV = {v: k for k, v in MIRROR.items()}  # 左手键 -> 右手键
DIGIT_MIRROR = {"6": "5", "7": "4", "8": "3", "9": "2", "0": "1"}
LEFT_KEYS = set("12345qwertasdfgzxcvb")
RIGHT_KEYS = set("67890yuiophjkl;nm,./")
EXPECTED = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ;,./:<>?") | set("06789")
MARK_CHARS = set("[]()'_-+=!@")  # 格式标记/显示码辅助符（非码元）


def load_xforms(rules):
    """从 yaml 规则列表提取 (pattern, repl)，含清引号 xform|'||。"""
    out = []
    for r in rules:
        if not isinstance(r, str) or not r.startswith("xform|"):
            continue
        body = r[len("xform|"):].rstrip("|")
        if body == "'":
            out.append(("'", ""))  # 清除所有单引号
            continue
        parts = body.split("|")
        if len(parts) != 2:
            continue
        out.append((parts[0], parts[1]))
    return out


def to_py_repl(repl):
    """librime/oniguruma 的 $1 替换引用 -> Python re 的 \\g<1>。"""
    return re.sub(r"\$(\d+)", r"\\g<\1>", repl)


def apply(s, rules):
    for pat, repl in rules:
        s = re.sub(pat, to_py_repl(repl), s)
    return s


def load_km_rules():
    """加载 yoyo.yaml 空明拳段，返回 (镜像规则, 码元规则, 清引号规则)。"""
    d = yaml.safe_load(YOYO_YAML.read_text(encoding="utf-8"))
    rules = load_xforms(d["空明拳"]["__append"])
    mirror, yuan, clear_q = [], [], []
    for src, dst in rules:
        if src == "'":
            clear_q.append((src, dst))
            continue
        src_norm = src.replace("\\.", ".")
        if len(src_norm) == 1 and len(dst) == 1 and src_norm in (set(MIRROR) | set(DIGIT_MIRROR)):
            mirror.append((src, dst))
        else:
            yuan.append((src, dst))
    return mirror, yuan, clear_q


def load_schema(schema_id):
    path = RIME_DIR / f"{schema_id}.schema.yaml"
    if not path.exists():
        return None
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def main():
    fails = []
    mirror, yuan, clear_q = load_km_rules()
    km_rules = mirror + yuan + clear_q
    print(f"空明拳段: 镜像 {len(mirror)} 条, 码元 {len(yuan)} 条, 清引号 {len(clear_q)} 条")

    # 码元 -> 左手键组合（纯左手侧）
    combo = {}
    for src, dst in yuan:
        keys = tuple(sorted(c for c in src if c in LEFT_KEYS))
        if len(keys) == len(src):  # 纯左手组合才做代表
            combo[keys] = dst
    for k in "qwertasdfgzxcvb":  # 单键直出
        combo[(k,)] = k
    print(f"码元键组合: {len(combo)} 个 (期望 65)")

    for schema_id, info in SCHEMAS.items():
        print(f"\n===== {schema_id}（{info['name']}）=====")
        schema = load_schema(schema_id)
        if schema is None:
            print(f"  ✗ schema 文件不存在: {schema_id}.schema.yaml")
            fails.append(schema_id)
            continue

        # 1. 结构断言
        s = schema["schema"]
        checks = [
            ("schema_id", s.get("schema_id"), schema_id),
            ("name", s.get("name"), info["name"]),
            ("指法引用", schema.get("指法", {}).get("__include"), "yoyo:/空明拳"),
            ("心法引用", schema.get("内功心法", {}).get("__include"), info["xinfa"]),
        ]
        patch = schema.get("__patch", {})
        if isinstance(patch, dict):
            checks.append(("词典", patch.get("translator/dictionary"), info["dict"]))
            checks.append(("prism", patch.get("translator/prism"), info["dict"]))
        ok = True
        for label, got, want in checks:
            good = got == want
            ok &= good
            print(f"  {'✓' if good else '✗'} {label}: {got!r} (期望 {want!r})")
        xinfa_rules = load_xforms(schema[info["xinfa"]]["__append"])
        print(f"  {'✓' if len(xinfa_rules) >= 7 else '✗'} 心法段 {info['xinfa']} 规则数: {len(xinfa_rules)} (期望 ≥7)")
        ok &= len(xinfa_rules) >= 7

        # 2. 心法折叠断言（四种击键方式）
        ns0, ns1 = info["ns"]
        ws0, ws1 = info["ws"]
        fold_cases = [
            ("qp", f"{ns0}q'p{ns1}"),  # 双手并击无空格 -> 单字前两码（心法层插引号，指法层清除）
            ("q p", f"{ws0}q'p{ws1}"),  # 双手并击带空格 -> 词前两码（同上）
            ("qa", "_qa"),             # 左手无空格 -> 一简（串击）
            ("q a", "-qa"),            # 左手带空格 -> 一简/单字第三码
            ("p;", "+p;"),             # 右手无空格 -> 一简（串击）
            ("p ;", "=p;"),            # 右手带空格 -> 一简/单字第三码
        ]
        for inp, want in fold_cases:
            got = apply(inp, xinfa_rules)
            good = got == want
            ok &= good
            print(f"  {'✓' if good else '✗'} 心法折叠 {inp!r} -> {got!r} (期望 {want!r})")

        # 3. 全链路：心法 + 空明拳指法（四种击键方式 × 65 码元）
        all_rules = xinfa_rules + km_rules
        total = passed = 0
        chain_fails = []
        for keys, code in sorted(combo.items(), key=lambda kv: kv[1]):
            left = "".join(keys)
            has_right = all(k in INV for k in keys)
            right = "".join(sorted(INV[k] for k in keys)) if has_right else None
            cases = [
                (left, f"_{code}"),          # 左手无空格
                (left + " ", f"-{code}"),    # 左手带空格
            ]
            if has_right:
                cases += [
                    (right, f"+{code}"),         # 右手无空格（镜像）
                    (right + " ", f"={code}"),   # 右手带空格（镜像）
                    (left + right, f"{ns0}{code}{code}{ns1}"),     # 双手并击
                    (left + " " + right, f"{ws0}{code}{code}{ws1}"),  # 双手带空格
                ]
            for inp, want in cases:
                total += 1
                got = apply(inp, all_rules)
                if got == want:
                    passed += 1
                else:
                    chain_fails.append((inp, want, got))
        good = passed == total
        ok &= good
        print(f"  {'✓' if good else '✗'} 全链路可达: {passed}/{total}"
              + ("" if good else f"，首 5 个失败: {chain_fails[:5]}"))

        if not ok:
            fails.append(schema_id)

    # 4. 词典编码字符集可达性（import 壳递归展开）
    print("\n===== 词典编码字符集可达性 =====")

    def collect_codes(name, seen):
        path = RIME_DIR / f"{name}.dict.yaml"
        if not path.exists() or name in seen:
            return set()
        seen.add(name)
        codes = set()
        text = path.read_text(encoding="utf-8")
        try:
            d = yaml.safe_load(text) if "---" in text else {}
        except yaml.YAMLError:
            d = {}  # 部分词库头非标准 YAML，仅按条目收集
        for tbl in d.get("import_tables", []):
            codes |= collect_codes(tbl, seen)
        for line in text.splitlines():
            if line.startswith("#") or "\t" not in line:
                continue
            parts = line.split("\t")
            if len(parts) < 2:
                continue
            for ch in parts[1]:
                if ch not in MARK_CHARS and ch != " ":
                    codes.add(ch)
        return codes

    for schema_id, info in SCHEMAS.items():
        seen = set()
        codes = collect_codes(info["dict"], seen)
        bad = codes - EXPECTED
        good = not bad
        print(f"  {'✓' if good else '✗'} {info['dict']}（含 import 表 {len(seen)} 个）词典码元 {len(codes)} 个"
              + ("" if good else f"，超出空明拳码元集: {sorted(bad)}"))
        if not good:
            fails.append(schema_id)

    print(f"\n{'== 全部通过 ==' if not fails else '== 存在失败: ' + ', '.join(fails) + ' =='}")
    return 0 if not fails else 1


if __name__ == "__main__":
    sys.exit(main())
