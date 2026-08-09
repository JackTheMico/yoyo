#!/usr/bin/env python3
"""双方案（折梅/寒梅）拼音反查一致性校验（T3 验收自动化部分）。

背景: 两方案共用同一套反查组件（reverse_input 门卫 / reverse_segmentor 分段器 /
reverse 翻译器）与同一份 23 片数据（rime/lua/yoyo/data/reverse_*.lua）。
本脚本断言两个 schema 的反查挂载块逐字一致、speller 字母表都含反查前缀键 `、
数据分片唯一存在 —— 防止将来改一个方案漏掉另一个。

用法: python3 rime/scripts/check_reverse_schema_parity.py
退出码: 0 = 通过；1 = 任一断言失败。
"""
import sys
import yaml

RIME_DIR = "rime"
SCHEMAS = ["yoyo-yx.schema.yaml", "yoyo-yx-hm.schema.yaml"]
PARITY_KEYS = [
    "engine/processors",
    "engine/segmentors",
    "engine/translators",
    "reverse",
]
DATA_DIR = f"{RIME_DIR}/lua/yoyo/data"

# 反查挂载块中引用到的组件（保证两方案指向同一份 Lua 实现）
REQUIRED_COMPONENTS = [
    "lua_processor@*yoyo.reverse_input",
    "lua_segmentor@*yoyo.reverse_segmentor",
    "lua_translator@*yoyo.reverse",
]


def load_patch(schema: str):
    with open(f"{RIME_DIR}/{schema}", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("__patch", {})


def main() -> int:
    ok = True

    def check(cond: bool, msg: str):
        nonlocal ok
        tag = "ok" if cond else "FAIL"
        print(f"  [{tag}] {msg}")
        ok = ok and cond

    patches = {s: load_patch(s) for s in SCHEMAS}
    print(f"== 反查挂载块一致性（{len(SCHEMAS)} 方案） ==")
    for key in PARITY_KEYS:
        vals = {s: patches[s].get(key) for s in SCHEMAS}
        check(
            vals[SCHEMAS[0]] == vals[SCHEMAS[1]] and vals[SCHEMAS[0]] is not None,
            f"{key} 完全一致",
        )

    print("== 组件引用一致（共用同一份 Lua 实现） ==")
    for comp in REQUIRED_COMPONENTS:
        for s in SCHEMAS:
            procs = patches[s].get("engine/processors", [])
            segs = patches[s].get("engine/segmentors", [])
            trans = patches[s].get("engine/translators", {})
            if isinstance(trans, dict):
                trans_list = trans.get("__append", [])
            elif isinstance(trans, list):
                trans_list = trans
            else:
                trans_list = []
            all_refs = list(procs) + list(segs) + list(trans_list)
            check(comp in all_refs, f"{s}: 引用 {comp}")

    print("== speller 字母表支持反查 ==")
    for s in SCHEMAS:
        alphabet = patches[s]["speller"]["alphabet"]
        has_backtick = "`" in alphabet
        has_az = all(c in alphabet for c in "abcdefghijklmnopqrstuvwxyz")
        check(has_backtick and has_az, f"{s}: alphabet 含 ` 与全部小写 a-z")

    print("== 反查数据分片唯一存在（无重复数据源） ==")
    import glob

    shards = sorted(glob.glob(f"{DATA_DIR}/reverse_[a-z].lua"))
    check(len(shards) == 23, f"23 片数据齐全（实际 {len(shards)} 片）")
    check(
        len(glob.glob(f"{DATA_DIR}/reverse_*.lua")) == 23,
        "数据目录无其它 reverse_* 文件（仅 23 片）",
    )

    print()
    print("PASS" if ok else "SOME FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
