#!/usr/bin/env python3
"""生成「单字 → 逐位码位对齐的字根拆分」表（rime/lua/yoyo/data/zigen_align.lua）。

用途：拼音反查时在候选注释里显示该字的字根拆分，让用户看到「这个字凭什么这么打」。

数据源（均为仓库内 tracked 文件）：
  - 拆分序列： zigen_table/decomposition.tsv（huma/hanzi-chai 分析产出，中间产物入库）
  - 字根码表： zigen_table/yoyo-analysis-0.4.yaml 的 form.mapping
              已展开从属字根（539 个），每个根带两字母码
  - 单字全码： rime/yoyo-pure.dict.yaml
  - 字根名：   zigen_table/mapping.yaml 的 name 字段（仅私用区根需要）

渲染规则只有一条（不写形态分支表）：
  把全码逐字母分配给拆分序列里的字根，同一根拿到的连续字母并成一组，
  每组写成「根 + 它的字母」，组间用 · 连接。

  取码规则规定的三种分配就是这条规则的三个实例：
    单根字      r1 → (大码, 小码)             鹿Al
    双字根字    r1 → (大码), r2 → (大码, 小码)  禾x·口bk
    多字根字    r1 → (大码), r2 → (大码), r末 → (大码)   白d·勹.·丶O

硬约束——全有或全无：分配必须覆盖全码的每一个字母，否则整字不写表项。
没有这条，部分归属时会静默吞掉没归属的字母（Al 被渲染成 鹿A），比不写更糟。

字根码直接取 form.mapping 的值，不再从已发布编码反推：
该表与 mapping.yaml 有 7 处不一致（乛/乙、彡、疋、屮、疒、辶），实测 form.mapping
是对的——用它的值重现已发布全码，6400 字里自洽 99.2%。自洽率本身即是对这张表的检验，
每次生成都打印出来，不静默吞掉。

产物形态（字 → 可直接拼进候选注释的串，不含全码前缀）：
  return {
    ["的"] = "白d·勹.·丶O",
    ["和"] = "禾x·口bk",
    ["鹿"] = "鹿Al",
  }

用法：
  python3 gen_zigen_align.py            # 写文件 + 打印覆盖率
  python3 gen_zigen_align.py --dry-run  # 只打印，不写文件
"""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from pathlib import Path

import yaml

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
REPO_DIR = RIME_DIR.parent

DECOMPOSITION = REPO_DIR / "zigen_table" / "decomposition.tsv"
ANALYSIS_CONFIG = REPO_DIR / "zigen_table" / "yoyo-analysis-0.4.yaml"
MAPPING = REPO_DIR / "zigen_table" / "mapping.yaml"
PURE_DICT = RIME_DIR / "yoyo-pure.dict.yaml"
OUTPUT = RIME_DIR / "lua" / "yoyo" / "data" / "zigen_align.lua"

MARK_CHARS = set("!@-_+()[]=")
STROKE_ROOTS = set("123456")
STROKE_NAMES = {"1": "一", "2": "丨", "3": "丿", "4": "丶", "5": "乛", "6": "乙"}


# ── 读取 ────────────────────────────────────────────────────────────────


def load_root_codes(path: Path) -> dict[str, str]:
    """字根 -> 两字母码。form.mapping 已展开从属字根，值即最终码。"""
    cfg = yaml.safe_load(path.read_text(encoding="utf-8"))
    return {str(k): str(v) for k, v in (cfg.get("form", {}).get("mapping") or {}).items()}


def load_sub_of(path: Path) -> dict[str, str]:
    """从属字根 -> 主字根。私用区根靠它换成可读的字。"""
    cfg = yaml.safe_load(path.read_text(encoding="utf-8"))
    return {str(k): str(v) for k, v in (cfg.get("form", {}).get("grouping") or {}).items()}


def load_root_names(path: Path) -> dict[str, str]:
    """字根 -> 中文名（少数私用区根在 mapping.yaml 里有描述）。"""
    if not path.exists():
        return {}
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    out = {}
    for root, spec in (data.get("mapping") or {}).items():
        if isinstance(spec, dict) and spec.get("name"):
            out[str(root)] = str(spec["name"]).split("，")[0].split(",")[0].strip()
    return out


def load_decomposition(path: Path) -> dict[str, list[str]]:
    """字 -> 拆分序列。状态非 ok 的行（miss）直接跳过，让该字降级。"""
    out: dict[str, list[str]] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line or line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) < 3:
            continue
        ch, seq, status = parts[0], parts[1].strip(), parts[2].strip()
        if status != "ok" or len(ch) != 1:
            continue
        roots = [r for r in seq.split(" ") if r]
        if roots:
            out[ch] = roots
    return out


def load_char_codes(path: Path) -> dict[str, list[tuple[str, int]]]:
    """单字 -> 全部编码（去并击标记），保留 (code, weight)。"""
    out: dict[str, list[tuple[str, int]]] = defaultdict(list)
    in_body = False
    for line in path.open(encoding="utf-8"):
        if line.startswith("..."):
            in_body = True
            continue
        if not in_body:
            continue
        line = line.rstrip("\n")
        if not line or line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) < 2 or len(parts[0]) != 1:
            continue
        code = "".join(c for c in parts[1] if c not in MARK_CHARS)
        try:
            w = int(parts[2]) if len(parts) > 2 else 0
        except ValueError:
            w = 0
        if code:
            out[parts[0]].append((code, w))
    return out


# ── 渲染 ────────────────────────────────────────────────────────────────


def root_label(root: str, names: dict[str, str], sub_of: dict[str, str]) -> str:
    """字根在候选注释里的显示名。

    笔画根（1-6）→ 笔画名；私用区根 → mapping.yaml 的中文描述，没有就用它从属的主字根；
    其余就是字根本身。
    """
    if root in STROKE_ROOTS:
        return STROKE_NAMES[root]
    if 0xE000 <= ord(root) <= 0xF8FF:
        return names.get(root) or sub_of.get(root) or "·"
    return root


def render(
    full: str, roots: list[str], code_of: dict[str, str]
) -> list[tuple[str, str]] | None:
    """把全码逐字母分配给字根，返回 [(根, 该根拿到的字母)]；对不上则 None。

    这是本文件唯一的渲染规则，三种取码形态是它的三个实例。字母是从**字根码**推出来的，
    不是从全码切出来的——否则「字母拼起来等于全码」恒成立，等于没校验。
    """
    n = len(roots)
    if n == 0:
        return None
    if n == 1:
        # 单根字：该根独占两码
        groups = [(roots[0], code_of[roots[0]])]
    elif n == 2:
        # 双字根：首根只取大码，次根占两码
        groups = [(roots[0], code_of[roots[0]][:1]), (roots[1], code_of[roots[1]])]
    else:
        # 多字根：首根、次根、末根各取大码；中间根不参与取码，也不显示
        groups = [
            (roots[0], code_of[roots[0]][:1]),
            (roots[1], code_of[roots[1]][:1]),
            (roots[-1], code_of[roots[-1]][:1]),
        ]
    if any(not letters for _, letters in groups):
        return None
    if "".join(letters for _, letters in groups) != full:
        return None
    return groups


# ── 主流程 ──────────────────────────────────────────────────────────────


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--out", type=Path, default=OUTPUT)
    args = parser.parse_args()

    root_codes = load_root_codes(ANALYSIS_CONFIG)
    sub_of = load_sub_of(ANALYSIS_CONFIG)
    root_names = load_root_names(MAPPING)
    decomposition = load_decomposition(DECOMPOSITION)
    chars = load_char_codes(PURE_DICT)

    align: dict[str, str] = {}
    stats = Counter()
    unknown: set[str] = set()
    degraded: list[str] = []

    for ch, roots in decomposition.items():
        forms = chars.get(ch)
        if not forms:
            stats["码表无此字"] += 1
            continue
        full = max((c for c, _ in forms), key=len)
        missing = [r for r in roots if r not in root_codes]
        if missing:
            stats["根不在表"] += 1
            unknown.update(missing)
            degraded.append(ch)
            continue
        groups = render(full, roots, root_codes)
        if groups is None:
            stats["无法逐位对齐"] += 1
            degraded.append(ch)
            continue
        stats["按根数 " + ("1" if len(roots) == 1 else "2" if len(roots) == 2 else "≥3")] += 1
        align[ch] = "·".join(
            f"{root_label(root, root_names, sub_of)}{letters}" for root, letters in groups
        )

    total = len(decomposition)
    print(f"拆分序列 {total} 字 | 可显示 {len(align)} 字（{len(align) / total * 100:.1f}%）")
    for k, v in stats.most_common():
        print(f"  {k}: {v}")
    if unknown:
        print(f"  未知字根 {len(unknown)} 个：{''.join(sorted(unknown)[:20])}")
    if degraded:
        print(f"  降级字 {len(degraded)} 个（注释退回纯编码）：{''.join(sorted(degraded)[:40])}")

    order = ["的", "和", "你", "德", "鹿", "寒", "是", "上", "梅", "能", "中"]
    print("\n样例:")
    for ch in order:
        if ch in align:
            full = max((c for c, _ in chars[ch]), key=len)
            print(f"   {ch}  {full:4s}  →  {align[ch]}")

    if args.dry_run:
        print("\n[dry-run] 未写文件")
        return

    lines = [
        "-- 自动生成，请勿手改。由 rime/scripts/gen_zigen_align.py 生成。",
        "-- 单字 → 逐位码位对齐的字根拆分，供拼音反查候选注释使用。",
        "-- 形态：根+它产生的字母，组间用 · 连接，如 白d·勹.·丶O。不含全码前缀。",
        "-- 私用区字根显示其中文描述或从属的主字根；笔画根显示笔画名。",
        "return {",
    ]
    for ch in sorted(align):
        lines.append(f'  ["{ch}"] = "{align[ch]}",')
    lines.append("}")
    args.out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"\n已写入 {args.out}（{args.out.stat().st_size / 1024:.1f} KB / {len(align)} 条）")


if __name__ == "__main__":
    main()
