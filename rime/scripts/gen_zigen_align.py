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
import sys
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

LEGACY_ELEMENTS = SCRIPTS_DIR / "编码生成和重码可视化" / "data" / "elements.txt"

# 闸门与体检线（见 docs/design/2026-10-28-反查字根拆分-第二根设计.md 第 2 节）
GATE_CONSISTENCY = 0.95  # 自洽率下限：低于此值拆分不可信，停止
GATE_DRIFT = 0.05  # 漂移率上限：超过说明与 0.2 历史分歧过大，停下来重估

MARK_CHARS = set("!@-_+()[]=")
STROKE_ROOTS = set("123456")
STROKE_NAMES = {"1": "一", "2": "丨", "3": "丿", "4": "丶", "5": "乛", "6": "乙"}
SHENGMU_PREFIX = "双拼声母-"
YUNMU_PREFIX = "双拼韵母-"


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


def load_legacy_elements(path: Path) -> dict[str, tuple[str, str]]:
    """旧口径的首根/末根，只作漂移体检的对照物，不参与生成。

    每行给出「首根.0 首根.1 末根.0 末根.1」（单根字则两对同根）。取权重最高的一行。
    """
    if not path.exists():
        return {}
    best: dict[str, tuple[list[str], int]] = {}
    for line in path.open(encoding="utf-8"):
        parts = line.rstrip("\n").split("\t")
        if len(parts) < 2 or len(parts[0]) != 1:
            continue
        try:
            w = int(parts[2]) if len(parts) > 2 else 0
        except ValueError:
            w = 0
        prev = best.get(parts[0])
        if prev is None or w > prev[1]:
            inst = [
                e
                for e in parts[1].split()
                if not e.startswith((SHENGMU_PREFIX, YUNMU_PREFIX))
            ]
            best[parts[0]] = (inst, w)
    out: dict[str, tuple[str, str]] = {}
    for ch, (inst, _w) in best.items():
        if len(inst) >= 4:
            out[ch] = (inst[0].rpartition(".")[0], inst[2].rpartition(".")[0])
        elif len(inst) == 2:
            root = inst[0].rpartition(".")[0]
            if inst[1].rpartition(".")[0] == root:
                out[ch] = (root, root)
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
    consistency = len(align) / total if total else 0.0
    print(f"拆分序列 {total} 字 | 可显示 {len(align)} 字")
    print(f"  自洽率 {consistency * 100:.1f}%（闸门 ≥{GATE_CONSISTENCY * 100:g}%）")
    for k, v in stats.most_common():
        print(f"  {k}: {v}")
    if unknown:
        print(f"  未知字根 {len(unknown)} 个：{''.join(sorted(unknown)[:20])}")
    if degraded:
        print(f"  降级字 {len(degraded)} 个（注释退回纯编码）：{''.join(sorted(degraded)[:40])}")

    # 漂移体检：新首/末根与旧口径不一致的比例。只作体检，不是数据对错的判据。
    legacy = load_legacy_elements(LEGACY_ELEMENTS)
    both = [ch for ch in decomposition if ch in legacy]
    drifted = [
        ch for ch in both
        if (decomposition[ch][0], decomposition[ch][-1]) != legacy[ch]
    ]
    drift = len(drifted) / len(both) if both else 0.0
    print(
        f"  漂移率 {drift * 100:.1f}%（体检线 ≤{GATE_DRIFT * 100:g}%；"
        f"与旧口径可比 {len(both)} 字，分歧 {len(drifted)} 字）"
    )
    for ch in drifted[:12]:
        print(f"     {ch}  新 {'/'.join((decomposition[ch][0], decomposition[ch][-1]))}"
              f"  旧 {'/'.join(legacy[ch])}")

    order = ["的", "和", "你", "德", "鹿", "寒", "是", "上", "梅", "能", "中"]
    print("\n样例:")
    for ch in order:
        if ch in align:
            full = max((c for c, _ in chars[ch]), key=len)
            print(f"   {ch}  {full:4s}  →  {align[ch]}")

    # ── 闸门 ──
    # 自洽率不达标 = 拆分无法重现已发布编码，数据不可信，停止。
    # 漂移率超线 ≠ 数据错——它是「0.4 与 0.2 分歧过大，该人来看一眼」的信号，
    # 所以用不同的退出码区分，别让后来的人把它当成同一个问题。
    if consistency < GATE_CONSISTENCY:
        print(
            f"\n[闸门不通过] 自洽率 {consistency * 100:.1f}% < {GATE_CONSISTENCY * 100:g}%："
            "拆分无法重现已发布编码，数据不可信，不写文件。",
            file=sys.stderr,
        )
        raise SystemExit(1)
    if drift > GATE_DRIFT:
        print(
            f"\n[体检报警] 漂移率 {drift * 100:.1f}% > {GATE_DRIFT * 100:g}%："
            "与 0.2 历史分歧过大，停下重估信任口径。"
            "注意这不算数据错——分歧本身是 ADR-0001 允许的，报警只为了让人看一眼。",
            file=sys.stderr,
        )
        raise SystemExit(2)

    if args.dry_run:
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
