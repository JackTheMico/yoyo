#!/usr/bin/env python3
"""精确优化两码字词的声母键位和韵母指法排布。"""

from __future__ import annotations

import argparse
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Iterable, Iterator, Mapping, Sequence


from dict_model import RIME_ROOT, SCRIPT_DIR

DEFAULT_DICTIONARY = RIME_ROOT / "0--core/resource-yoyo音形终版/char.dict.yaml"
DEFAULT_LEXICON = SCRIPT_DIR / "data/词库-chai-ordered.txt"
DEFAULT_KEY_EASE = SCRIPT_DIR / "prompts/键位分布目标.txt"
DEFAULT_OUTPUT = SCRIPT_DIR / "prompts/声韵母最省力排布结果.md"
DEFAULT_MIN_CODE_EASE = {"gA": Decimal("1.5")}
TOP_A_REVIEW_LIMIT = 105

KEY_ORDER = tuple("qwertasdfgzxcvb")
FINGER_ORDER = tuple("ABCDEFGHIJKL")

INITIAL_GROUPS: dict[str, tuple[str, ...]] = {
    "q": ("b",),
    "w": ("p", "sh"),
    "e": ("m", "ch"),
    "r": ("f", "x"),
    "t": ("z", "q"),
    "a": ("d", "r"),
    "s": ("t",),
    "d": ("n", "zh"),
    "f": ("l",),
    "g": ("c", "w"),
    "z": ("g",),
    "x": ("k", "j"),
    "c": ("h",),
    "v": ("y",),
    "b": ("s", "0"),
}

FINAL_GROUPS: dict[str, tuple[str, ...]] = {
    "A": ("ong", "o", "iao", "un"),
    "B": ("iong", "m", "uan", "er", "eng", "v"),
    "C": ("ang", "ia", "ua", "ve"),
    "D": ("ao", "ian"),
    "E": ("i",),
    "F": ("ui", "ei"),
    "G": ("uai", "a", "ue", "iang"),
    "H": ("an", "in"),
    "I": ("ng", "en", "ie", "uo"),
    "J": ("ai", "iu", "uang"),
    "K": ("ou", "u"),
    "L": ("ing", "e"),
}

PINYIN_INITIALS = (
    "sh",
    "ch",
    "zh",
    "b",
    "p",
    "m",
    "f",
    "d",
    "t",
    "n",
    "l",
    "g",
    "k",
    "h",
    "j",
    "q",
    "x",
    "r",
    "y",
    "w",
    "z",
    "c",
    "s",
)
INITIAL_TO_GROUP = {
    initial: group
    for group, initials in INITIAL_GROUPS.items()
    for initial in initials
}
FINAL_TO_GROUP = {
    final: group
    for group, finals in FINAL_GROUPS.items()
    for final in finals
}

FINGER_EASE: dict[str, Decimal] = {
    "A": Decimal("1"),
    **{finger: Decimal("0.5") for finger in "BCDEF"},
    **{finger: Decimal("0.1") for finger in "GHIJKL"},
}

TWO_CODE_RE = re.compile(
    rf"[{re.escape(''.join(KEY_ORDER))}][{FINGER_ORDER[0]}-{FINGER_ORDER[-1]}]"
)


@dataclass(frozen=True)
class Entry:
    text: str
    code: str
    weight: Decimal
    line_number: int
    pinyin: str | None = None


@dataclass(frozen=True)
class OptimizationResult:
    initial_to_key: dict[str, str]
    final_to_finger: dict[str, str]
    current_score: Decimal
    unconstrained_score: Decimal
    optimized_score: Decimal
    total_weight: Decimal
    assignments_checked: int
    minimum_code_ease: dict[str, Decimal]
    a_position_weight: Decimal
    a_final_group: str
    special_a: bool


def load_entries(path: Path) -> list[Entry]:
    """读取已经带有两码编码的 Rime 字典。"""
    entries: list[Entry] = []
    seen: set[tuple[str, str]] = set()

    with path.open(encoding="utf-8") as source:
        for line_number, line in enumerate(source, 1):
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 3:
                continue

            text, code, raw_weight = parts[:3]
            if TWO_CODE_RE.fullmatch(code) is None:
                continue

            try:
                weight = Decimal(raw_weight)
            except InvalidOperation as error:
                raise ValueError(
                    f"{path}:{line_number} 的权重不是数字: {raw_weight!r}"
                ) from error

            identity = (text, code)
            if identity in seen:
                raise ValueError(
                    f"{path}:{line_number} 存在重复的两码条目: {text!r} {code}"
                )
            if weight < 0:
                raise ValueError(
                    f"{path}:{line_number} 的两码条目权重不能为负数: {weight}"
                )

            seen.add(identity)
            entries.append(Entry(text, code, weight, line_number))

    if not entries:
        raise ValueError(f"{path} 中没有找到两码条目")
    return entries


def pinyin_to_code(pinyin: str) -> str | None:
    """按首音节声韵母归属生成旧布局下的两码编码。"""
    syllable = re.sub(r"\d+", "", pinyin.lower()).replace("ü", "v")
    if not syllable:
        return None

    initial = "0"
    final = syllable
    # m、ng 等成音节鼻音应作为零声母韵母，不能先拆成声母。
    if syllable not in FINAL_TO_GROUP:
        for candidate in PINYIN_INITIALS:
            if syllable.startswith(candidate):
                initial = candidate
                final = syllable[len(candidate) :]
                break

    initial_group = INITIAL_TO_GROUP.get(initial)
    final_group = FINAL_TO_GROUP.get(final)
    if initial_group is None or final_group is None:
        return None
    return initial_group + final_group


def load_lexicon_entries(path: Path, per_cell: int = 2) -> list[Entry]:
    """从词库中按首音节归属，为每个击法选权重最高的字或词。"""
    if per_cell <= 0:
        raise ValueError("每格候选数必须大于 0")

    candidates: dict[str, dict[str, Entry]] = defaultdict(dict)
    with path.open(encoding="utf-8") as source:
        for line_number, line in enumerate(source, 1):
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 3:
                continue

            text, pinyin_text, raw_weight = parts[:3]
            pinyins = pinyin_text.split()
            if not text or not pinyins:
                continue
            try:
                weight = Decimal(raw_weight)
            except InvalidOperation as error:
                raise ValueError(
                    f"{path}:{line_number} 的权重不是数字: {raw_weight!r}"
                ) from error
            if weight < 0:
                raise ValueError(
                    f"{path}:{line_number} 的权重不能为负数: {weight}"
                )

            first_pinyin = pinyins[0]
            code = pinyin_to_code(first_pinyin)
            if code is None:
                continue

            entry = Entry(text, code, weight, line_number, first_pinyin)
            previous = candidates[code].get(text)
            if previous is None or entry.weight > previous.weight:
                candidates[code][text] = entry

    selected: list[Entry] = []
    for initial in KEY_ORDER:
        for final in FINGER_ORDER:
            code = initial + final
            ranked = sorted(
                candidates[code].values(),
                key=lambda entry: (
                    -entry.weight,
                    entry.line_number,
                    entry.text,
                ),
            )
            selected.extend(ranked[:per_cell])

    if not selected:
        raise ValueError(f"{path} 中没有找到可归入击法的字词")
    return selected


def build_special_a_candidates(
    candidate_pool: Sequence[Entry],
    per_cell: int = 2,
) -> tuple[list[Entry], dict[str, list[Entry]]]:
    """生成只看声母的 A 快捷候选，并回填其余常规声韵格。"""
    by_initial: dict[str, dict[str, Entry]] = defaultdict(dict)
    for entry in candidate_pool:
        initial = entry.code[0]
        previous = by_initial[initial].get(entry.text)
        if previous is None or entry.weight > previous.weight:
            by_initial[initial][entry.text] = entry

    a_shortcuts: dict[str, list[Entry]] = {}
    for initial in KEY_ORDER:
        ranked = sorted(
            by_initial[initial].values(),
            key=lambda entry: (
                -entry.weight,
                entry.line_number,
                entry.text,
            ),
        )
        a_shortcuts[initial] = ranked[:per_cell]
        if len(a_shortcuts[initial]) < per_cell:
            raise ValueError(f"声母组 {initial!r} 不足 {per_cell} 个 A 快捷候选")

    promoted = {
        (initial, entry.text)
        for initial, shortcuts in a_shortcuts.items()
        for entry in shortcuts
    }
    by_code: dict[str, list[Entry]] = defaultdict(list)
    for entry in candidate_pool:
        if (entry.code[0], entry.text) not in promoted:
            by_code[entry.code].append(entry)

    regular_entries: list[Entry] = []
    for initial in KEY_ORDER:
        for final in FINGER_ORDER:
            code = initial + final
            ranked = sorted(
                by_code[code],
                key=lambda entry: (
                    -entry.weight,
                    entry.line_number,
                    entry.text,
                ),
            )
            regular_entries.extend(ranked[:per_cell])
    return regular_entries, a_shortcuts


def load_key_ease(path: Path) -> dict[str, Decimal]:
    scores: dict[str, Decimal] = {}

    with path.open(encoding="utf-8") as source:
        for line_number, line in enumerate(source, 1):
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 2 or parts[0] not in KEY_ORDER:
                continue

            key = parts[0]
            if key in scores:
                raise ValueError(f"{path}:{line_number} 重复定义键位 {key!r}")
            try:
                score = Decimal(parts[1])
            except InvalidOperation as error:
                raise ValueError(
                    f"{path}:{line_number} 的容易度不是数字: {parts[1]!r}"
                ) from error
            if score <= 0:
                raise ValueError(f"{path}:{line_number} 的容易度必须大于 0")
            scores[key] = score

    missing = [key for key in KEY_ORDER if key not in scores]
    if missing:
        raise ValueError(f"{path} 缺少键位容易度: {', '.join(missing)}")
    return scores


def build_weight_matrix(entries: Iterable[Entry]) -> dict[tuple[str, str], Decimal]:
    weights = {
        (initial, final): Decimal(0)
        for initial in KEY_ORDER
        for final in FINGER_ORDER
    }
    for entry in entries:
        weights[(entry.code[0], entry.code[1])] += entry.weight
    return weights


def distinct_score_assignments(
    groups: Sequence[str], physical_scores: Iterable[Decimal]
) -> Iterator[dict[str, Decimal]]:
    """生成分数多重集在各码元组上的所有不同分配。"""
    remaining = Counter(physical_scores)
    score_order = sorted(remaining, reverse=True)
    assignment: dict[str, Decimal] = {}

    def visit(index: int) -> Iterator[dict[str, Decimal]]:
        if index == len(groups):
            yield assignment.copy()
            return

        group = groups[index]
        for score in score_order:
            if remaining[score] == 0:
                continue
            remaining[score] -= 1
            assignment[group] = score
            yield from visit(index + 1)
            remaining[score] += 1

    yield from visit(0)


def stable_bijection(
    items: Iterable[str],
    slots: Iterable[str],
    canonical_order: Sequence[str],
) -> dict[str, str]:
    """优先保留原位置，再按既定顺序完成同分位置间的映射。"""
    item_set = set(items)
    slot_set = set(slots)
    if len(item_set) != len(slot_set):
        raise ValueError("码元组数与位置数不一致")

    result = {
        item: item
        for item in canonical_order
        if item in item_set and item in slot_set
    }
    remaining_items = [
        item for item in canonical_order if item in item_set and item not in result
    ]
    occupied_slots = set(result.values())
    remaining_slots = [
        slot
        for slot in canonical_order
        if slot in slot_set and slot not in occupied_slots
    ]
    result.update(zip(remaining_items, remaining_slots))
    return result


def assign_available_initial_groups(
    rows: Iterable[str],
    slots: Iterable[str],
    row_coefficients: Mapping[str, Decimal],
    key_ease: Mapping[str, Decimal],
) -> dict[str, str]:
    """用重排不等式将高系数声母组分配到高容易度键位。"""
    order_index = {key: index for index, key in enumerate(KEY_ORDER)}
    rows = sorted(
        rows, key=lambda row: (row_coefficients[row], order_index[row])
    )
    slots = sorted(
        slots, key=lambda key: (key_ease[key], order_index[key])
    )
    if len(rows) != len(slots):
        raise ValueError("声母码元组数与可用键位数不一致")

    result: dict[str, str] = {}
    offset = 0
    while offset < len(slots):
        end = offset + 1
        while end < len(slots) and key_ease[slots[end]] == key_ease[slots[offset]]:
            end += 1
        result.update(
            stable_bijection(rows[offset:end], slots[offset:end], KEY_ORDER)
        )
        offset = end
    return result


def assign_initial_groups(
    row_coefficients: Mapping[str, Decimal],
    key_ease: Mapping[str, Decimal],
) -> dict[str, str]:
    return assign_available_initial_groups(
        KEY_ORDER, KEY_ORDER, row_coefficients, key_ease
    )


def constrained_initial_assignments(
    row_coefficients: Mapping[str, Decimal],
    key_ease: Mapping[str, Decimal],
    final_group_scores: Mapping[str, Decimal],
    minimum_code_ease: Mapping[str, Decimal],
    special_a: bool = False,
) -> Iterator[dict[str, str]]:
    """枚举受保护声母组的键位，其余声母组仍由重排不等式精确求解。"""
    required_key_ease: dict[str, Decimal] = {}
    for code, minimum in minimum_code_ease.items():
        initial, final = code
        finger_ease = (
            FINGER_EASE["A"]
            if special_a and final == "A"
            else final_group_scores[final]
        )
        required = minimum / finger_ease
        required_key_ease[initial] = max(
            required_key_ease.get(initial, Decimal(0)), required
        )

    constrained_rows = sorted(
        required_key_ease,
        key=lambda row: (
            -required_key_ease[row],
            KEY_ORDER.index(row),
        ),
    )
    if len(constrained_rows) > 3:
        raise ValueError("精确保护约束最多支持 3 个不同的声母码元组")

    assigned: dict[str, str] = {}
    available_slots = set(KEY_ORDER)

    def visit(index: int) -> Iterator[dict[str, str]]:
        if index == len(constrained_rows):
            remaining_rows = [
                row for row in KEY_ORDER if row not in assigned
            ]
            remaining_slots = [
                key for key in KEY_ORDER if key in available_slots
            ]
            result = assigned.copy()
            result.update(
                assign_available_initial_groups(
                    remaining_rows,
                    remaining_slots,
                    row_coefficients,
                    key_ease,
                )
            )
            yield result
            return

        row = constrained_rows[index]
        for key in KEY_ORDER:
            if (
                key not in available_slots
                or key_ease[key] < required_key_ease[row]
            ):
                continue
            assigned[row] = key
            available_slots.remove(key)
            yield from visit(index + 1)
            available_slots.add(key)
            del assigned[row]

    yield from visit(0)


def materialize_finger_mapping(
    group_scores: Mapping[str, Decimal],
) -> dict[str, str]:
    result: dict[str, str] = {}
    for score in sorted(set(FINGER_EASE.values()), reverse=True):
        groups = [
            group for group in FINGER_ORDER if group_scores[group] == score
        ]
        slots = [
            finger for finger in FINGER_ORDER if FINGER_EASE[finger] == score
        ]
        result.update(stable_bijection(groups, slots, FINGER_ORDER))
    return result


def calculate_score(
    weights: Mapping[tuple[str, str], Decimal],
    key_ease: Mapping[str, Decimal],
    initial_to_key: Mapping[str, str],
    final_to_finger: Mapping[str, str],
    a_shortcut_weights: Mapping[str, Decimal] | None = None,
) -> Decimal:
    if a_shortcut_weights is not None:
        displaced_final = next(
            final
            for final, finger in final_to_finger.items()
            if finger == "A"
        )
        return sum(
            key_ease[initial_to_key[initial]]
            * (
                a_shortcut_weights[initial] * FINGER_EASE["A"]
                + sum(
                    weights[(initial, final)]
                    * FINGER_EASE[final_to_finger[final]]
                    for final in FINGER_ORDER
                    if final != displaced_final
                )
            )
            for initial in KEY_ORDER
        )

    return sum(
        weights[(initial, final)]
        * key_ease[initial_to_key[initial]]
        * FINGER_EASE[final_to_finger[final]]
        for initial in KEY_ORDER
        for final in FINGER_ORDER
    )


def optimize(
    weights: Mapping[tuple[str, str], Decimal],
    key_ease: Mapping[str, Decimal],
    minimum_code_ease: Mapping[str, Decimal] | None = None,
    a_shortcut_weights: Mapping[str, Decimal] | None = None,
) -> OptimizationResult:
    minimum_code_ease = dict(minimum_code_ease or {})
    special_a = a_shortcut_weights is not None
    if special_a:
        missing_shortcuts = [
            initial
            for initial in KEY_ORDER
            if initial not in a_shortcut_weights
        ]
        if missing_shortcuts:
            raise ValueError(
                "A 快捷层缺少声母组: " + ", ".join(missing_shortcuts)
            )
    for code, minimum in minimum_code_ease.items():
        if TWO_CODE_RE.fullmatch(code) is None:
            raise ValueError(f"保护约束编码无效: {code!r}")
        if minimum <= 0:
            raise ValueError(f"{code} 的最低容易度必须大于 0")

    current_score = calculate_score(
        weights,
        key_ease,
        {key: key for key in KEY_ORDER},
        {finger: finger for finger in FINGER_ORDER},
        a_shortcut_weights,
    )

    best_rank: (
        tuple[Decimal, Decimal, int, int, tuple[Decimal, ...]] | None
    ) = None
    best_initial_mapping: dict[str, str] | None = None
    best_final_mapping: dict[str, str] | None = None
    best_a_position_weight: Decimal | None = None
    best_a_final_group: str | None = None
    unconstrained_rank: tuple[Decimal, Decimal] | None = None
    unconstrained_score = Decimal("-Infinity")
    assignments_checked = 0

    for final_group_scores in distinct_score_assignments(
        FINGER_ORDER, FINGER_EASE.values()
    ):
        assignments_checked += 1
        final_mapping = materialize_finger_mapping(final_group_scores)
        a_final_group = next(
            final
            for final in FINGER_ORDER
            if final_mapping[final] == "A"
        )
        if special_a:
            assert a_shortcut_weights is not None
            a_position_weight = sum(a_shortcut_weights.values())
            row_coefficients = {
                initial: (
                    a_shortcut_weights[initial] * FINGER_EASE["A"]
                    + sum(
                        weights[(initial, final)]
                        * final_group_scores[final]
                        for final in FINGER_ORDER
                        if final != a_final_group
                    )
                )
                for initial in KEY_ORDER
            }
        else:
            a_position_weight = sum(
                weights[(initial, a_final_group)]
                for initial in KEY_ORDER
            )
            row_coefficients = {
                initial: sum(
                    weights[(initial, final)] * final_group_scores[final]
                    for final in FINGER_ORDER
                )
                for initial in KEY_ORDER
            }

        unrestricted_mapping = assign_initial_groups(
            row_coefficients, key_ease
        )
        unrestricted_score = sum(
            row_coefficients[initial]
            * key_ease[unrestricted_mapping[initial]]
            for initial in KEY_ORDER
        )
        current_unconstrained_rank = (
            a_position_weight,
            unrestricted_score,
        )
        if (
            unconstrained_rank is None
            or current_unconstrained_rank > unconstrained_rank
        ):
            unconstrained_rank = current_unconstrained_rank
            unconstrained_score = unrestricted_score

        for initial_mapping in constrained_initial_assignments(
            row_coefficients,
            key_ease,
            final_group_scores,
            minimum_code_ease,
            special_a,
        ):
            score = sum(
                row_coefficients[initial]
                * key_ease[initial_mapping[initial]]
                for initial in KEY_ORDER
            )
            same_tier_count = sum(
                key_ease[initial] == key_ease[initial_mapping[initial]]
                for initial in KEY_ORDER
            ) + sum(
                FINGER_EASE[final] == final_group_scores[final]
                for final in FINGER_ORDER
            )
            same_position_count = sum(
                initial == key
                for initial, key in initial_mapping.items()
            ) + sum(
                final == finger
                for final, finger in final_mapping.items()
            )
            rank = (
                a_position_weight,
                score,
                same_tier_count,
                same_position_count,
                tuple(
                    final_group_scores[final]
                    for final in FINGER_ORDER
                ),
            )

            if best_rank is None or rank > best_rank:
                best_rank = rank
                best_initial_mapping = initial_mapping
                best_final_mapping = final_mapping
                best_a_position_weight = a_position_weight
                best_a_final_group = a_final_group

    if (
        best_rank is None
        or best_initial_mapping is None
        or best_final_mapping is None
        or best_a_position_weight is None
        or best_a_final_group is None
    ):
        raise RuntimeError("没有生成任何可行排布")

    optimized_score = calculate_score(
        weights,
        key_ease,
        best_initial_mapping,
        best_final_mapping,
        a_shortcut_weights,
    )
    if optimized_score != best_rank[1]:
        raise RuntimeError("优化分数与最终排布的复算结果不一致")
    for code, minimum in minimum_code_ease.items():
        finger_ease = (
            FINGER_EASE["A"]
            if special_a and code[1] == "A"
            else FINGER_EASE[best_final_mapping[code[1]]]
        )
        actual = (
            key_ease[best_initial_mapping[code[0]]]
            * finger_ease
        )
        if actual < minimum:
            raise RuntimeError(
                f"{code} 的最终容易度 {actual} 未达到约束 {minimum}"
            )

    total_weight = (
        sum(a_shortcut_weights.values())
        + sum(
            weights[(initial, final)]
            for initial in KEY_ORDER
            for final in FINGER_ORDER
            if final != best_a_final_group
        )
        if special_a and a_shortcut_weights is not None
        else sum(entry_weight for entry_weight in weights.values())
    )

    return OptimizationResult(
        initial_to_key=best_initial_mapping,
        final_to_finger=best_final_mapping,
        current_score=current_score,
        unconstrained_score=unconstrained_score,
        optimized_score=optimized_score,
        total_weight=total_weight,
        assignments_checked=assignments_checked,
        minimum_code_ease=minimum_code_ease,
        a_position_weight=best_a_position_weight,
        a_final_group=best_a_final_group,
        special_a=special_a,
    )


def format_number(value: Decimal, places: int | None = None) -> str:
    if places is None and value == value.to_integral():
        return f"{int(value):,}"
    if places is None:
        places = 4
    return f"{value:,.{places}f}"


def group_text(members: Sequence[str]) -> str:
    return "、".join(members)


def entry_kind(entry: Entry) -> str:
    return "字" if len(entry.text) == 1 else "词"


def relative_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(RIME_ROOT))
    except ValueError:
        return str(path.resolve())


def build_layout_entries(
    entries: Sequence[Entry],
    result: OptimizationResult,
    a_shortcuts: Mapping[str, Sequence[Entry]] | None = None,
) -> list[tuple[Entry, str, bool]]:
    """返回本轮真正占据两码快捷位的条目、新编码及 A 快捷标记。"""
    placed: list[tuple[Entry, str, bool]] = []
    if result.special_a:
        if a_shortcuts is None:
            raise ValueError("特殊 A 布局缺少 A 快捷候选")
        for initial in KEY_ORDER:
            new_code = result.initial_to_key[initial] + "A"
            placed.extend(
                (entry, new_code, True)
                for entry in a_shortcuts[initial]
            )
        placed.extend(
            (
                entry,
                result.initial_to_key[entry.code[0]]
                + result.final_to_finger[entry.code[1]],
                False,
            )
            for entry in entries
            if entry.code[1] != result.a_final_group
        )
    else:
        placed.extend(
            (
                entry,
                result.initial_to_key[entry.code[0]]
                + result.final_to_finger[entry.code[1]],
                result.final_to_finger[entry.code[1]] == "A",
            )
            for entry in entries
        )
    return placed


def render_report(
    entries: Sequence[Entry],
    weights: Mapping[tuple[str, str], Decimal],
    key_ease: Mapping[str, Decimal],
    result: OptimizationResult,
    entry_source_path: Path,
    source_mode: str,
    key_ease_path: Path,
    a_shortcuts: Mapping[str, Sequence[Entry]] | None = None,
) -> str:
    layout_entries = build_layout_entries(entries, result, a_shortcuts)
    cells: dict[str, list[Entry]] = defaultdict(list)
    for entry, new_code, _ in layout_entries:
        cells[new_code].append(entry)

    all_codes = [
        initial + final for initial in KEY_ORDER for final in FINGER_ORDER
    ]
    empty_codes = [code for code in all_codes if not cells[code]]
    size_counts = Counter(len(cells[code]) for code in all_codes)
    text_counts = Counter(entry.text for entry, _, _ in layout_entries)
    duplicate_texts = [
        f"{text}×{count}"
        for text, count in text_counts.items()
        if count > 1
    ]

    gain = (
        (result.optimized_score / result.current_score - 1) * 100
        if result.current_score
        else Decimal(0)
    )
    guardrail_cost = (
        (1 - result.optimized_score / result.unconstrained_score) * 100
        if result.unconstrained_score
        else Decimal(0)
    )
    current_mean = result.current_score / result.total_weight
    optimized_mean = result.optimized_score / result.total_weight
    entries_by_code: dict[str, list[str]] = defaultdict(list)
    for entry in entries:
        entries_by_code[entry.code].append(entry.text)
    if result.special_a and a_shortcuts is not None:
        for initial in KEY_ORDER:
            entries_by_code[initial + "A"] = [
                entry.text for entry in a_shortcuts[initial]
            ]
    guardrail_text = "、".join(
        f"`{code}`（{'、'.join(entries_by_code[code])}）≥"
        f"{format_number(minimum)}"
        for code, minimum in result.minimum_code_ease.items()
    )
    source_description = (
        "字词候选来源"
        if source_mode == "lexicon"
        else "预编码候选来源"
    )
    selection_description = (
        "- A 是独立声母快捷层：每个声母组忽略韵母选权重最高的两条；"
        "入选 A 的字词从常规声韵格移除并顺次回填。"
        if result.special_a
        else "- 每格在单字和词中统一选权重最高的两条。"
    )
    a_result_description = (
        f"- A 声母快捷层字词总权重："
        f"{format_number(result.a_position_weight)}；"
        f"常规韵母组 `{result.a_final_group}`"
        f"（{group_text(FINAL_GROUPS[result.a_final_group])}）"
        "让出 A 的前两候选位。"
        if result.special_a
        else f"- A 指法承载原韵母组 `{result.a_final_group}`"
        f"（{group_text(FINAL_GROUPS[result.a_final_group])}），"
        f"字词总权重：{format_number(result.a_position_weight)}"
    )
    entries_with_new_code = sorted(
        layout_entries,
        key=lambda item: (
            -item[0].weight,
            item[0].text,
            item[0].code,
            item[1],
        ),
    )
    a_entries = [
        (entry, new_code, is_a)
        for entry, new_code, is_a in entries_with_new_code
        if is_a
    ]
    top_review_entries = entries_with_new_code[:TOP_A_REVIEW_LIMIT]
    top_non_a_entries = [
        (rank, entry, new_code)
        for rank, (entry, new_code, is_a) in enumerate(top_review_entries, 1)
        if not is_a
    ]

    lines = [
        "# 声韵母最省力排布结果",
        "",
        "## 本轮完整字词表（优化前先核对）",
        "",
        f"> 本轮实际选出 {len(layout_entries)} 条两码字词记录、"
        f"{len(text_counts)} 个不同字词，并非 360 条。"
        f"缺少的 {360 - len(layout_entries)} 条来自空格："
        f"{('、'.join(empty_codes) if empty_codes else '无')}。",
        "> 下列记录严格按权重从高到低排列；`【A位】` 表示该字词在本轮排布后的"
        "新编码使用指法 A。",
        "",
        "### 本轮 A 指法位置",
        "",
        f"共 {len(a_entries)} 条记录：",
        "",
    ]

    for key in KEY_ORDER:
        code = key + "A"
        occupants = [
            f"{entry.text}[{entry_kind(entry)}]（{format_number(entry.weight)}）"
            for entry, new_code, _ in a_entries
            if new_code == code
        ]
        lines.append(f"- `{code}`：{'、'.join(occupants) if occupants else '空'}")

    lines.extend(
        [
            "",
            f"### 权重前 {len(top_review_entries)} 中未进入 A 的字词",
            "",
            f"共 {len(top_non_a_entries)} 条，按全局权重排名从高到低排列：",
            "",
        ]
    )
    for rank, entry, new_code in top_non_a_entries:
        lines.append(
            f"- 全局第 {rank}：{entry.text}[{entry_kind(entry)}] — "
            f"权重 {format_number(entry.weight)}；原编码 `{entry.code}`；"
            f"本轮新编码 `{new_code}`"
        )

    lines.extend(["", "### 全部两码记录（权重降序）", ""])
    for rank, (entry, new_code, is_a) in enumerate(entries_with_new_code, 1):
        marker = " **【A位】**" if is_a else ""
        lines.append(
            f"{rank}. {entry.text}[{entry_kind(entry)}]{marker} — 权重 "
            f"{format_number(entry.weight)}；原编码 `{entry.code}`；"
            f"本轮新编码 `{new_code}`"
        )

    lines.extend(
        [
            "",
        "## 计算口径",
        "",
        f"- {source_description}：`{relative_path(entry_source_path)}`。",
        "- 词按首音节归入一个“声母码元组 × 韵母码元组”；"
        "单字和词统一按权重竞争。",
        selection_description,
        f"- 键位容易度来源：`{relative_path(key_ease_path)}` 的前两列。",
        f"- 共选出 {len(layout_entries)} 条两码记录、"
        f"{len(text_counts)} 个不同字词；"
        f"重复字词为 {('、'.join(duplicate_texts) if duplicate_texts else '无')}。",
        f"- 180 格中，{size_counts[2]} 格各有 2 条记录，"
        f"{size_counts[0]} 格为空（{('、'.join(empty_codes) if empty_codes else '无')}）。",
        "- 优化第一优先级：每个声母组权重最高的两条必须进入 A。",
        "- 次级目标函数：`Σ(字词权重 × 新键位容易度 × 新指法容易度)`。",
        f"- 最低容易度保护：{guardrail_text if guardrail_text else '无'}。",
        f"- 穷举 {result.assignments_checked} 种不同的指法档位分配；"
        "精确枚举受保护码元组的可行键位，再用重排不等式求其余声母组最优解；"
        "因此结果是约束目标下的全局最优。",
        "- 同容易度位置不影响目标值；下方优先保留原位置，其余按文档顺序确定。",
        "",
        "## 优化效果",
        "",
        f"- 总权重：{format_number(result.total_weight)}",
        a_result_description,
        f"- 当前目标值：{format_number(result.current_score, 1)}",
        f"- 满足 A 最高优先级时的无保护上限："
        f"{format_number(result.unconstrained_score, 1)}",
        f"- 保护约束下最优值：{format_number(result.optimized_score, 1)}",
        f"- 保护代价：{format_number(guardrail_cost, 4)}%",
        f"- 提升：{format_number(gain, 4)}%",
        f"- 加权平均组合容易度：{format_number(current_mean, 4)}"
        f" → {format_number(optimized_mean, 4)}",
        "",
        "## 最终声母键位",
        "",
        ]
    )

    key_to_initial = {
        key: initial for initial, key in result.initial_to_key.items()
    }
    for key in KEY_ORDER:
        initial = key_to_initial[key]
        lines.append(
            f"- `{key}`（容易度 {format_number(key_ease[key])}）"
            f" ← `{group_text(INITIAL_GROUPS[initial])}`（原位置 `{initial}`）"
        )

    lines.extend(["", "旧位置到新键位：", ""])
    lines.append(
        "`"
        + "  ".join(
            f"{initial}→{result.initial_to_key[initial]}"
            for initial in KEY_ORDER
        )
        + "`"
    )

    lines.extend(["", "## 最终韵母指法", ""])
    finger_to_final = {
        finger: final for final, finger in result.final_to_finger.items()
    }
    for finger in FINGER_ORDER:
        final = finger_to_final[finger]
        if result.special_a and finger == "A":
            lines.append(
                f"- `A`（容易度 {format_number(FINGER_EASE[finger])}）"
                " ← 每个声母组最高频两条（忽略韵母）；"
                f"常规组 `{final}` 仅保留为底层映射"
            )
        else:
            lines.append(
                f"- `{finger}`（容易度 {format_number(FINGER_EASE[finger])}）"
                f" ← `{group_text(FINAL_GROUPS[final])}`（原位置 `{final}`）"
            )

    mapping_label = (
        "常规韵母旧位置到新指法（A 顶层由声母快捷覆盖）："
        if result.special_a
        else "旧位置到新指法："
    )
    lines.extend(["", mapping_label, ""])
    lines.append(
        "`"
        + "  ".join(
            f"{final}→{result.final_to_finger[final]}"
            for final in FINGER_ORDER
        )
        + "`"
    )

    lines.extend(["", "## 高频字词变化", ""])
    for entry, new_code, _ in entries_with_new_code[:30]:
        old_ease = key_ease[entry.code[0]] * FINGER_EASE[entry.code[1]]
        new_ease = (
            key_ease[new_code[0]] * FINGER_EASE[new_code[1]]
        )
        lines.append(
            f"- {entry.text}[{entry_kind(entry)}]"
            f"（{format_number(entry.weight)}）："
            f"`{entry.code}` / {format_number(old_ease, 2)}"
            f" → `{new_code}` / {format_number(new_ease, 2)}"
        )

    lines.extend(
        [
            "",
            "> 注意：加权总和最优不等于每个高频字词都变容易；"
            "码元组必须整体移动，局部退化是全局耦合的结果。",
            "",
        ]
    )
    return "\n".join(lines)


def render_details(
    entries: Sequence[Entry],
    key_ease: Mapping[str, Decimal],
    result: OptimizationResult,
    a_shortcuts: Mapping[str, Sequence[Entry]] | None = None,
) -> str:
    lines = [
        "字词\t类型\t原编码\t新编码\tA位\t权重\t原组合容易度\t新组合容易度\t加权变化"
    ]
    for entry, new_code, is_a in sorted(
        build_layout_entries(entries, result, a_shortcuts),
        key=lambda item: (
            -item[0].weight,
            item[0].text,
            item[0].code,
            item[1],
        ),
    ):
        old_ease = key_ease[entry.code[0]] * FINGER_EASE[entry.code[1]]
        new_ease = (
            key_ease[new_code[0]] * FINGER_EASE[new_code[1]]
        )
        weighted_delta = entry.weight * (new_ease - old_ease)
        lines.append(
            "\t".join(
                (
                    entry.text,
                    entry_kind(entry),
                    entry.code,
                    new_code,
                    "A" if is_a else "",
                    str(entry.weight),
                    str(old_ease),
                    str(new_ease),
                    str(weighted_delta),
                )
            )
        )
    return "\n".join(lines) + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="根据字词权重精确优化声母键位和韵母指法排布"
    )
    source_group = parser.add_mutually_exclusive_group()
    source_group.add_argument(
        "--lexicon",
        type=Path,
        default=DEFAULT_LEXICON,
        help="字词及拼音权重来源（默认使用词库-chai-ordered.txt）",
    )
    source_group.add_argument(
        "--dictionary",
        type=Path,
        help="可选：改用已经选好两码候选的 Rime 字典",
    )
    parser.add_argument(
        "--per-cell",
        type=int,
        default=2,
        help="每个声韵组合保留的最高权重字词数（默认 2）",
    )
    parser.add_argument("--key-ease", type=Path, default=DEFAULT_KEY_EASE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument(
        "--details-output",
        type=Path,
        help="可选：输出全部两码字词的新旧编码明细（制表符分隔）",
    )
    parser.add_argument(
        "--min-code-ease",
        action="append",
        metavar="编码=最低容易度",
        help="最低容易度保护，可重复；默认 gA=1.5",
    )
    parser.add_argument(
        "--unconstrained",
        action="store_true",
        help="关闭默认及命令行最低容易度保护",
    )
    return parser.parse_args()


def parse_minimum_code_ease(
    values: Sequence[str] | None,
    unconstrained: bool,
) -> dict[str, Decimal]:
    if unconstrained:
        if values:
            raise ValueError("--unconstrained 不能与 --min-code-ease 同时使用")
        return {}

    result = DEFAULT_MIN_CODE_EASE.copy()
    for value in values or ():
        try:
            code, raw_minimum = value.split("=", 1)
            minimum = Decimal(raw_minimum)
        except (ValueError, InvalidOperation) as error:
            raise ValueError(
                f"最低容易度格式应为 编码=数字，实际为 {value!r}"
            ) from error
        result[code] = minimum
    return result


def main() -> None:
    args = parse_args()
    if args.dictionary is not None:
        candidate_pool = load_entries(args.dictionary)
        entry_source_path = args.dictionary
        source_mode = "dictionary"
    else:
        candidate_pool = load_lexicon_entries(
            args.lexicon, args.per_cell * 2
        )
        entry_source_path = args.lexicon
        source_mode = "lexicon"
    entries, a_shortcuts = build_special_a_candidates(
        candidate_pool, args.per_cell
    )
    a_shortcut_weights = {
        initial: sum(entry.weight for entry in shortcuts)
        for initial, shortcuts in a_shortcuts.items()
    }
    key_ease = load_key_ease(args.key_ease)
    weights = build_weight_matrix(entries)
    minimum_code_ease = parse_minimum_code_ease(
        args.min_code_ease, args.unconstrained
    )
    result = optimize(
        weights,
        key_ease,
        minimum_code_ease,
        a_shortcut_weights,
    )
    report = render_report(
        entries,
        weights,
        key_ease,
        result,
        entry_source_path,
        source_mode,
        args.key_ease,
        a_shortcuts,
    )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(report, encoding="utf-8")
    if args.details_output:
        args.details_output.parent.mkdir(parents=True, exist_ok=True)
        args.details_output.write_text(
            render_details(entries, key_ease, result, a_shortcuts),
            encoding="utf-8",
        )

    gain = (
        (result.optimized_score / result.current_score - 1) * 100
        if result.current_score
        else Decimal(0)
    )
    print(
        f"两码字词: "
        f"{len(build_layout_entries(entries, result, a_shortcuts))}"
    )
    print(f"检查档位分配: {result.assignments_checked}")
    print(
        f"目标值: {format_number(result.current_score, 1)}"
        f" -> {format_number(result.optimized_score, 1)}"
        f" (+{format_number(gain, 4)}%)"
    )
    print(f"结果: {args.output}")
    if args.details_output:
        print(f"明细: {args.details_output}")


if __name__ == "__main__":
    main()
