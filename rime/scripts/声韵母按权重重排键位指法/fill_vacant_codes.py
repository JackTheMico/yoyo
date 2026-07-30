#!/usr/bin/env python3
"""补足非 A 槽空缺的两码位，并排定同槽前缀次序。

字词迁入 A 位后会腾出原来的两码位（`的` 从 `_dF` 走了），此脚本从更长的
码位按权重把最合适的条目提上来，并递归补它腾出的坑。

A 槽（qA…bA）由 assign_a_codes 的 A_SLOTS 完整指定，包括故意留空的位，
故此处一概不动。其余槽位各自在本文件的默认前缀上补满两位：
字表 `_` `+`，词表 `<` `>`。

某槽没有任何可用候选（如 sE/fB/fJ/fL/xE）时保持空缺，不视为错误。

用法:
  python3 fill_vacant_codes.py [--dict char|word|all]
"""

from __future__ import annotations

import argparse

from assign_a_codes import A_SLOTS
from dict_model import (
    ALL_SLOTS,
    CODECS,
    Codec,
    Store,
    load,
    order_slot,
    promote,
    save,
    shorts_on,
)


def fill_slot(store: Store, codec: Codec, slot: str) -> tuple[list[str], int]:
    """补满一个槽，返回 (变更日志, 仍空缺的位数)。"""
    logs: list[str] = []

    # 先把已有条目挪到靠前的前缀，空位集中到尾部。
    for target_prefix, entry in zip(codec.default_prefixes, shorts_on(store, codec, slot)):
        store.rekey(entry, f"{target_prefix}{slot}")

    for prefix in codec.default_prefixes:
        if store.live_by_code(f"{prefix}{slot}"):
            continue
        new = promote(store, codec, slot, codec.levels[0], prefix)
        if new is not None:
            logs.append(f"{codec.name} {prefix}{slot} ← {new.text}（w={new.weight}）")

    if order_slot(store, codec, slot):
        logs.append(f"{codec.name} {slot} 前缀次序按权重调整")

    vacant = len(codec.default_prefixes) - len(shorts_on(store, codec, slot))
    return logs, vacant


def run(codec: Codec) -> tuple[Store, list[str], list[str]]:
    store = load(codec)
    logs: list[str] = []
    vacant: list[str] = []
    for slot in ALL_SLOTS:
        if slot in A_SLOTS:
            continue
        slot_logs, missing = fill_slot(store, codec, slot)
        logs.extend(slot_logs)
        if missing > 0:
            vacant.append(f"{slot}×{missing}")
    return store, logs, vacant


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="补足空缺的两码位")
    parser.add_argument(
        "--dict",
        choices=("char", "word", "all"),
        default="all",
        help="处理目标：char=字表，word=词表，all=两者（默认）",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    targets = list(CODECS) if args.dict == "all" else [args.dict]

    for name in targets:
        codec = CODECS[name]
        store, logs, vacant = run(codec)
        total = save(codec, store)

        print(f"\n{codec.name}表：变更 {len(logs)} 处，共 {total} 条目")
        for line in logs:
            print(f"  {line}")
        if vacant:
            print(f"  仍空缺（无候选）: {' '.join(vacant)}")


if __name__ == "__main__":
    main()
