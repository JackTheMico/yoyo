#!/usr/bin/env python3
"""校验 yoyo-pure-cj 的 schema 结构约束（issue #49 / #50 的验收项）。

必须校验**构建后**的 schema（build/ 目录里那份），而不是源文件：
源文件用 `__include: yoyo:/` + `__patch:` 组装，处理器链与 speller 都是合并后的结果，
只看源文件会漏掉基文件带来的 chord_composer。

用法：
    python3 rime/scripts/verify_cj_schema.py <构建后的 schema.yaml> \
        [--expect-alphabet "zyxw...a"] [--forbid-upper] [--require-upper]
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import yaml

FAIL = []


def check(name: str, ok: bool, detail: str = "") -> None:
    if ok:
        print(f"  OK   {name}")
    else:
        FAIL.append(name)
        print(f"  FAIL {name}{('：' + detail) if detail else ''}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("schema", type=Path)
    ap.add_argument("--expect-alphabet", help="期望的 speller.alphabet（按字符集比对，不看顺序）")
    ap.add_argument("--forbid-upper", action="store_true", help="禁止出现大写码元（tracer 阶段）")
    ap.add_argument("--require-upper", action="store_true", help="必须出现大写码元（60 码元阶段）")
    args = ap.parse_args()

    if not args.schema.exists():
        print(f"找不到 schema：{args.schema}", file=sys.stderr)
        return 2
    cfg = yaml.safe_load(args.schema.read_text(encoding="utf-8")) or {}

    speller = cfg.get("speller") or {}
    engine = cfg.get("engine") or {}
    processors = [str(p) for p in (engine.get("processors") or [])]
    alphabet = str(speller.get("alphabet") or "")
    alphabet_set = set(alphabet)
    algebra = [str(a) for a in (speller.get("algebra") or [])]

    print(f"schema: {args.schema}")

    # ── 1. 不得有并击组件 ────────────────────────────────────────────────
    chord_procs = [p for p in processors if "chord" in p.lower()]
    check("处理器链不含 chord/streaming 组件", not chord_procs, ", ".join(chord_procs))
    check("顶层无 chord_composer 段", "chord_composer" not in cfg,
          ", ".join(cfg.keys()) if "chord_composer" in cfg else "")

    # ── 2. 不得有 _/+ 手别派生（并击版的 3 码字分隔符）───────────────────
    bad_derive = [a for a in algebra if "derive" in a and ("_" in a or "+" in a)]
    check("speller.algebra 无 _/+ 派生规则", not bad_derive, "; ".join(bad_derive))
    check("字母表不含 _ 与 +", "_" not in alphabet_set and "+" not in alphabet_set,
          "".join(sorted(alphabet_set & {"_", "+"})))

    # ── 3. 字母表范围 ────────────────────────────────────────────────────
    if args.expect_alphabet:
        want = set(args.expect_alphabet)
        missing = sorted(want - alphabet_set)
        extra = sorted(alphabet_set - want)
        check("alphabet 与期望码元集一致", not missing and not extra,
              f"缺 {''.join(missing)}；多 {''.join(extra)}")
    if args.forbid_upper:
        upper = sorted(c for c in alphabet_set if c.isupper())
        check("tracer 阶段不含大写码元", not upper, "".join(upper))
    if args.require_upper:
        upper = sorted(c for c in alphabet_set if c.isupper())
        check("60 码元阶段含 26 个大写码元", len(upper) == 26, f"实际 {len(upper)}: {''.join(upper)}")

    # ── 4. 用户加词表仍然生效 ────────────────────────────────────────────
    translator = cfg.get("translator") or {}
    imports = [str(t) for t in (translator.get("import_tables") or [])]
    check("translator.import_tables 含 yoyo-user", "yoyo-user" in imports, ", ".join(imports))

    # ── 5. 翻译器指向串击自己的 prism，不能借用并击的 ────────────────────
    prism = str(translator.get("prism") or "")
    check("translator.prism 为 yoyo-pure-cj", prism == "yoyo-pure-cj", prism)
    check("translator.dictionary 为 yoyo-pure", str(translator.get("dictionary") or "") == "yoyo-pure",
          str(translator.get("dictionary") or ""))

    print()
    if FAIL:
        print(f"共 {len(FAIL)} 项不通过：{', '.join(FAIL)}")
        return 1
    print("全部检查通过")
    return 0


if __name__ == "__main__":
    sys.exit(main())
