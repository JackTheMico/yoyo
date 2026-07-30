#!/usr/bin/env python3
"""yoyo-yx 字典的码位模型与通用升降级操作。

两个正交维度：

1. **前缀 = 输入路径**。schema 的 八荒六合 给出四条互不相干的击键动作：
   `_左` `+右` 单手不带空格、`<左` `>右` 单手带空格。四者与条目是字还是词无关，
   故 `PREFIXES` 是全局常量，不属于某个字典。
   两个 dict 文件被 yoyo-yx.dict.yaml 一并 import 成同一部词典，因此两码槽位
   空间是全局的（15 键 × 12 指 × 4 前缀 = 720 个），跨文件必须唯一。

2. **码长分层 = 条目类型**（码长只数字母，`_ + ! @ - < >` 不计）：

       单字：2 → 4 `!XXXX@` → 6 `!XXXX@-XX`
       多字：2 → 4 `XXXX`  → 8 `XXXXXXXX` → 12（全码）

   分层由文本长度决定，所以条目该写进哪个文件也由文本长度决定（见 codec_for），
   与它占用哪个前缀无关。

降级（顺延）与升级（补位）两个分层用的是同一套算法，故统一由 Codec 参数化。
"""

from __future__ import annotations

import re
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, Iterable


def find_rime_root() -> Path:
    here = Path(__file__).resolve().parent
    for candidate in (here, *here.parents):
        if (candidate / "yoyo-yx-word.dict.yaml").is_file():
            return candidate
    raise SystemExit("向上未找到 yoyo-yx-word.dict.yaml，无法定位 Rime 根目录")


RIME_ROOT = find_rime_root()
SCRIPT_DIR = Path(__file__).resolve().parent

KEY_ORDER = "qwertasdfgzxcvb"
FINGER_ORDER = "ABCDEFGHIJKL"
ALL_SLOTS = tuple(k + f for k in KEY_ORDER for f in FINGER_ORDER)

# 四条单手输入路径，任何两码槽位都可由它们中任一个占用。
PREFIXES = ("_", "+", "<", ">")


def letters(code: str) -> str:
    return "".join(ch for ch in code if ch.isalpha())


# ---------------------------------------------------------------- 条目与索引


@dataclass
class Entry:
    text: str
    code: str
    weight: int
    alive: bool = True


@dataclass
class Store:
    """字典条目集合，按 code / text 建索引；删除用墓碑标记以保持行序。"""

    entries: list[Entry]
    header: str = ""
    by_code: dict[str, list[Entry]] = field(default_factory=lambda: defaultdict(list))
    by_text: dict[str, list[Entry]] = field(default_factory=lambda: defaultdict(list))

    @classmethod
    def from_entries(cls, entries: list[Entry], header: str = "") -> Store:
        store = cls(entries=entries, header=header)
        for e in entries:
            store.by_code[e.code].append(e)
            store.by_text[e.text].append(e)
        return store

    def live_by_code(self, code: str) -> list[Entry]:
        return [e for e in self.by_code.get(code, []) if e.alive]

    def live_by_text(self, text: str) -> list[Entry]:
        return [e for e in self.by_text.get(text, []) if e.alive]

    def kill(self, entry: Entry) -> int:
        if not entry.alive:
            return 0
        entry.alive = False
        return entry.weight

    def add(self, text: str, code: str, weight: int, before: Entry | None = None) -> Entry:
        """插入新条目。before 指定行位置，缺省则紧邻该字/词的首条活条目。"""
        new = Entry(text, code, weight)
        anchor = before if (before is not None and before.alive) else None
        index = None
        for i, e in enumerate(self.entries):
            if anchor is not None:
                if e is anchor:
                    index = i
                    break
            elif e.alive and e.text == text:
                index = i
                break
        if index is None:
            self.entries.append(new)
        else:
            self.entries.insert(index, new)
        self.by_code[code].append(new)
        self.by_text[text].append(new)
        return new

    def rekey(self, entry: Entry, new_code: str) -> None:
        if entry.code == new_code:
            return
        bucket = self.by_code[entry.code]
        self.by_code[entry.code] = [e for e in bucket if e is not entry]
        entry.code = new_code
        self.by_code[new_code].append(entry)

    def compact(self) -> list[Entry]:
        return [e for e in self.entries if e.alive]


# ---------------------------------------------------------------------- 码型


@dataclass(frozen=True)
class Codec:
    """一类条目（单字 / 多字）的码位分层规则与落地文件。"""

    name: str
    path: Path
    levels: tuple[int, ...]
    # 该类条目在非 A 槽默认占用的两条输入路径。A 槽的前缀由 A 位方案显式指定，
    # 不受此约束。
    default_prefixes: tuple[str, str]
    render_long: Callable[[str], str]
    # 多音字：同一文本可在不同读音（不同两码前缀）下各持一套码。
    # 词无此情况，其资格判定以整词为范围。
    multi_reading: bool

    @property
    def full_level(self) -> int:
        return self.levels[-1]

    def render(self, code_letters: str, prefix: str | None = None) -> str:
        level = len(code_letters)
        if level not in self.levels:
            raise ValueError(f"{self.name}: 非法码长 {level}（{code_letters}）")
        if level == self.levels[0]:
            if prefix not in PREFIXES:
                raise ValueError(f"{self.name}: 两码需指定前缀，得到 {prefix!r}")
            return f"{prefix}{code_letters}"
        return self.render_long(code_letters)

    def parse(self, code: str) -> tuple[int, str, str | None] | None:
        """返回 (码长, 字母串, 前缀)；不符合本分层码型则返回 None。"""
        prefix = code[0] if code[:1] in PREFIXES else None
        body = letters(code)
        level = len(body)
        if level not in self.levels:
            return None
        if level == self.levels[0]:
            return (level, body, prefix) if prefix else None
        return (level, body, None) if prefix is None else None

    def next_level(self, level: int) -> int | None:
        i = self.levels.index(level)
        return self.levels[i + 1] if i + 1 < len(self.levels) else None

    def prev_level(self, level: int) -> int | None:
        i = self.levels.index(level)
        return self.levels[i - 1] if i > 0 else None


def _char_long(code_letters: str) -> str:
    head, tail = code_letters[:4], code_letters[4:]
    return f"!{head}@-{tail}" if tail else f"!{head}@"


CHAR = Codec(
    name="字",
    path=RIME_ROOT / "yoyo-yx-char.dict.yaml",
    levels=(2, 4, 6),
    default_prefixes=("_", "+"),
    render_long=_char_long,
    multi_reading=True,
)

WORD = Codec(
    name="词",
    path=RIME_ROOT / "yoyo-yx-word.dict.yaml",
    levels=(2, 4, 8, 12),
    default_prefixes=("<", ">"),
    render_long=lambda code_letters: code_letters,
    multi_reading=False,
)

CODECS = {"char": CHAR, "word": WORD}


def codec_for(text: str) -> Codec:
    """条目归哪套分层、写进哪个文件，只看文本长度。"""
    return CHAR if len(text) == 1 else WORD


# ------------------------------------------------------------------ 读写字典


def load(codec: Codec) -> Store:
    raw = codec.path.read_text(encoding="utf-8")
    header: list[str] = []
    entries: list[Entry] = []
    in_data = False
    for line in raw.splitlines(keepends=True):
        if not in_data:
            header.append(line)
            if line.strip() == "...":
                in_data = True
            continue
        stripped = line.rstrip("\n")
        if not stripped.strip():
            continue
        parts = stripped.split("\t")
        weight = int(parts[2]) if len(parts) > 2 else 0
        entries.append(Entry(parts[0], parts[1], weight))
    return Store.from_entries(entries, "".join(header))


def save(codec: Codec, store: Store) -> int:
    live = store.compact()
    codec.path.write_text(
        store.header + "".join(f"{e.text}\t{e.code}\t{e.weight}\n" for e in live),
        encoding="utf-8",
    )
    return len(live)


# ------------------------------------------------------------------ 查询原语


def shorts_on(store: Store, codec: Codec, slot: str) -> list[Entry]:
    """本文件在该槽位默认前缀上的两码条目（每前缀至多一条）。"""
    out: list[Entry] = []
    for prefix in codec.default_prefixes:
        out.extend(store.live_by_code(f"{prefix}{slot}"))
    return out


def short_of(store: Store, codec: Codec, slot: str, prefix: str) -> Entry | None:
    found = store.live_by_code(f"{prefix}{slot}")
    return found[0] if found else None


def codes_at(store: Store, codec: Codec, text: str, level: int) -> list[Entry]:
    out = []
    for e in store.live_by_text(text):
        parsed = codec.parse(e.code)
        if parsed and parsed[0] == level:
            out.append(e)
    return out


def full_letters(store: Store, codec: Codec, text: str, hint: str = "") -> str:
    """该字/词全码的字母串。

    hint 用于多音字消歧：优先取以 hint 开头的全码。A 位简码故意打破了
    "简码是全码前缀" 的关系（如 `的` 挂 `_dA` 而全码为 `dFrJdD`），
    因此匹配不到时退回第一条全码，而不是报错。
    """
    fulls = codes_at(store, codec, text, codec.full_level)
    if not fulls:
        raise ValueError(f"{codec.name} {text!r} 缺少全码")
    if hint:
        for e in fulls:
            if letters(e.code).startswith(hint):
                return letters(e.code)
    return letters(fulls[0].code)


def has_shorter_code(store: Store, codec: Codec, text: str, level: int, reading: str) -> bool:
    """text 是否已在比 level 更短的层级持码。

    多音字按读音（两码前缀）分别判定，避免一个字的不同读音互相排斥。
    """
    for e in store.live_by_text(text):
        parsed = codec.parse(e.code)
        if parsed is None or parsed[0] >= level:
            continue
        if codec.multi_reading and letters(e.code)[:2] != reading:
            continue
        return True
    return False


# ------------------------------------------------------- 降级（顺延）与升级


def demote(store: Store, codec: Codec, text: str, level: int) -> None:
    """把 text 从 level 挤到下一层；目标层的占用者递归下挤。"""
    own = codes_at(store, codec, text, level)
    if not own:
        return
    hint = letters(own[0].code) if level > codec.levels[0] else ""
    full = full_letters(store, codec, text, hint)
    weight = max((store.kill(e) for e in own), default=0)
    target = codec.next_level(level)
    if target is None:
        return
    _occupy(store, codec, text, full, target, weight)


def _occupy(store: Store, codec: Codec, text: str, full: str, level: int, weight: int) -> None:
    """让 text 取得 level 层码位；已在此的其他文本递归下挤。"""
    code = codec.render(full[:level])
    if level == codec.full_level:
        # 全码条目恒存在，不新建，只把权重并入。
        for e in store.live_by_code(code):
            if e.text == text:
                e.weight = max(e.weight, weight)
                return
        store.add(text, code, weight)
        return

    for other in sorted({e.text for e in store.live_by_code(code) if e.text != text}):
        demote(store, codec, other, level)
    for e in list(store.live_by_code(code)):
        if e.text == text:
            store.kill(e)

    deeper = codec.next_level(level)
    anchor = None
    if deeper is not None:
        deeper_code = codec.render(full[:deeper])
        anchor = next(
            (e for e in store.live_by_text(text) if e.code == deeper_code), None
        )
    store.add(text, code, weight, before=anchor)


def promote(store: Store, codec: Codec, slot_letters: str, level: int,
            prefix: str | None = None) -> Entry | None:
    """填补 level 层的空码位：从下一层挑权重最高者上提。

    上提后原位置腾出的坑递归再补。返回新条目，无候选则 None。
    """
    code = codec.render(slot_letters, prefix)
    if store.live_by_code(code):
        return None
    source_level = codec.next_level(level)
    if source_level is None:
        return None

    best: Entry | None = None
    for e in store.entries:
        if not e.alive or e.weight <= 0:
            continue
        parsed = codec.parse(e.code)
        if parsed is None or parsed[0] != source_level:
            continue
        body = parsed[1]
        if not body.startswith(slot_letters):
            continue
        if any(x.code == code for x in store.live_by_text(e.text)):
            continue
        if has_shorter_code(store, codec, e.text, source_level, slot_letters[:2]):
            continue
        if best is None or e.weight > best.weight:
            best = e

    if best is None:
        # 下一层也空：先把它补上，再重试本层。
        deeper = codec.next_level(source_level)
        if deeper is None:
            return None
        for e in store.entries:
            if not e.alive or e.weight <= 0:
                continue
            parsed = codec.parse(e.code)
            if parsed is None or parsed[0] != deeper:
                continue
            if not parsed[1].startswith(slot_letters):
                continue
            if promote(store, codec, parsed[1][:source_level], source_level):
                return promote(store, codec, slot_letters, level, prefix)
            break
        return None

    source_body = letters(best.code)
    if source_level == codec.full_level:
        # 全码条目保留，仅移交权重。
        new = store.add(best.text, code, best.weight, before=best)
        best.weight = 0
        return new

    store.kill(best)
    deeper = codec.next_level(source_level)
    anchor = None
    if deeper is not None:
        anchor = next(
            (
                e
                for e in store.live_by_text(best.text)
                if (p := codec.parse(e.code)) and p[0] >= deeper
            ),
            None,
        )
    new = store.add(best.text, code, best.weight, before=anchor)
    promote(store, codec, source_body, source_level)
    return new


def order_slot(store: Store, codec: Codec, slot: str) -> bool:
    """按约定让首个默认前缀持较高权重（左右手成本对等，仅求次序可预期）。"""
    first, second = codec.default_prefixes
    a = short_of(store, codec, slot, first)
    b = short_of(store, codec, slot, second)
    if a is None or b is None or b.weight <= a.weight:
        return False
    store.rekey(a, f"{second}{slot}")
    store.rekey(b, f"{first}{slot}")
    return True


def place_short(store: Store, codec: Codec, text: str, slot: str, prefix: str) -> None:
    """把 text 挂到指定两码位：优先改挂现有两码，否则从更长码位提上来。"""
    target = f"{prefix}{slot}"
    existing = codes_at(store, codec, text, codec.levels[0])
    if any(e.code == target for e in existing):
        return
    if existing:
        store.rekey(existing[0], target)
        return

    source_level = codec.next_level(codec.levels[0])
    weight = 0
    if source_level is not None:
        for e in codes_at(store, codec, text, source_level):
            weight = max(weight, store.kill(e))
    if weight <= 0:
        weight = max((e.weight for e in store.live_by_text(text)), default=0)
    anchor = next(
        (
            e
            for e in store.live_by_text(text)
            if (p := codec.parse(e.code)) and p[0] == codec.full_level
        ),
        None,
    )
    store.add(text, target, weight, before=anchor)
