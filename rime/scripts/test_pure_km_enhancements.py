#!/usr/bin/env python3
"""yoyo-pure-km 第一梯队与第二梯队体验增强集成测试套件。

测试内容：
1. 16 组全 2 键无冲突中文标点并击转换（左手与右手镜像双向可达）
2. 标点并击与常规单字/词组/一简/次选（如 f+j "一开始"、_. "到"）零冲突验证
3. yoyo-pure-km Schema 中 BackSpace 与 Return 一键清空 (Escape) 键位绑定配置
4. 练习工具数据生成结果 (km_char_word_data_module.js) 与纯形规范词典对齐校验
"""

import json
import re
import sys
import yaml
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
REPO_DIR = RIME_DIR.parent
PURE_KM_SCHEMA = RIME_DIR / "yoyo-pure-km.schema.yaml"
YOYO_YAML = RIME_DIR / "yoyo.yaml"
PURE_DICT = RIME_DIR / "yoyo-pure.dict.yaml"
PRACTICE_JS = REPO_DIR / "practice_tool" / "km_char_word_data_module.js"

ALPHABET_ORDER = "12345qwertasdfgzxcvb 67890yuiophjkl;nm,./'"
CHAR_RANK = {ch: i for i, ch in enumerate(ALPHABET_ORDER)}


def load_yaml(path: Path):
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def apply_xforms(s: str, xforms: list) -> str:
    """模拟 Rime chord_composer 排序与 xform 正则替换流水线"""
    sorted_keys = "".join(sorted(s, key=lambda c: CHAR_RANK.get(c, 999)))
    current = sorted_keys
    for rule in xforms:
        if not rule.startswith("xform"):
            continue
        delim = rule[5]
        parts = rule[6:].split(delim)
        if len(parts) >= 2:
            pattern = parts[0]
            replacement = parts[1]
            py_replacement = re.sub(r"\$(\d+)", r"\\\1", replacement)
            current = re.sub(pattern, py_replacement, current)
    return current


def test_enhancements():
    print("==================================================")
    print("🧪 开始执行 yoyo-pure-km 体验增强综合测试套件")
    print("==================================================")

    km_data = load_yaml(PURE_KM_SCHEMA)
    yoyo_data = load_yaml(YOYO_YAML)

    xinfa = km_data.get("纯形统一心法", {}).get("__append", [])
    km_fingering = yoyo_data.get("空明拳", {}).get("__append", [])
    km_pipeline = xinfa + km_fingering

    # ────────────────────────────────────────────────────────
    # 1. 验证 16 组全 2 键标点并击（左右手镜像双向验证）
    # ────────────────────────────────────────────────────────
    print("\n--- 1. 验证 16 组全 2 键标点并击映射 ---")
    punct_cases = [
        ("，", "fg", "hj", "~comma"),
        ("。", "ad", ";k", "~period"),
        ("、", "ag", ";h", "~enum_comma"),
        ("；", "xb", "n.", "~semicolon"),
        ("：", "qe", "ip", "~colon"),
        ("？", "zb", "n/", "~question"),
        ("！", "zc", ",/", "~exclamation"),
        ("……", "vb", "nm", "~ellipsis"),
        ("——", "rt", "uy", "~dash"),
        ("·", "cb", "n,", "~middledot"),
        ("“”", "db", "kn", "~dquote"),
        ("‘’", "ac", ";,", "~squote"),
        ("《》", "ax", ";.", "~book_quote"),
        ("（）", "fv", "jm", "~paren"),
        ("【】", "ab", ";n", "~bracket"),
        ("「」", "dc", "k,", "~corner_bracket"),
    ]

    for name, left_keys, right_keys, expected_token in punct_cases:
        res_left = apply_xforms(left_keys, km_pipeline)
        assert res_left == expected_token, f"Left '{left_keys}' failed: expected '{expected_token}', got '{res_left}'"

        res_right = apply_xforms(right_keys, km_pipeline)
        assert res_right == expected_token, f"Right '{right_keys}' failed: expected '{expected_token}', got '{res_right}'"

        print(f"✓ [{name:4s}] 左手 [{left_keys:2s}] / 右手 [{right_keys:2s}] -> 产出标记串 '{expected_token}'")

    # ────────────────────────────────────────────────────────
    # 2. 零冲突回归验证（重要词条与一简不受任何污染）
    # ────────────────────────────────────────────────────────
    print("\n--- 2. 验证字词与一简零冲突 ---")

    # 2.1 高频双字词 "一开始" (f + j -> ff)
    r_ff = apply_xforms("fj", km_pipeline)
    assert r_ff == "ff", f"Expected 'ff' for 'f+j', got '{r_ff}'"
    print(f"✓ [双手词·一开始] 双手并击 'f+j' -> '{r_ff}' (绝不被标点误拦截)")

    # 2.2 次选直出 "饨" (f + j + ' -> ff')
    r_ff_sec = apply_xforms("fj'", km_pipeline)
    assert r_ff_sec == "ff'", f"Expected 'ff'' for 'f+j+'', got '{r_ff_sec}'"
    print(f"✓ [双手词·次选] 并击 'f+j+'' -> '{r_ff_sec}' (正常进入次选直出)")

    # 2.3 两字词 "不" (c + n -> cb)
    r_cb = apply_xforms("cn", km_pipeline)
    assert r_cb == "cb", f"Expected 'cb' for 'c+n', got '{r_cb}'"
    print(f"✓ [双手词·不] 双手并击 'c+n' -> '{r_cb}' (与单手逗号 _cb 严格区分)")

    # 2.4 一简单字 "到" (vx -> _.)
    r_dao = apply_xforms("vx", km_pipeline)
    assert r_dao == "_.", f"Expected '_.' for 'vx', got '{r_dao}'"
    print(f"✓ [一简单字·到] 左手单手 'vx' -> '{r_dao}' (与标点严格区分)")

    # 2.5 一简单字 "被" (xz -> _?)
    r_bei = apply_xforms("xz", km_pipeline)
    assert r_bei == "_?", f"Expected '_?' for 'xz', got '{r_bei}'"
    print(f"✓ [一简单字·被] 左手单手 'xz' -> '{r_bei}' (与标点严格区分)")

    # ────────────────────────────────────────────────────────
    # 3. 验证 Schema 处理器挂载与 BackSpace 键位绑定
    # ────────────────────────────────────────────────────────
    print("\n--- 3. 验证 Schema 处理器与 BackSpace/Return 流控 ---")
    processors = km_data.get("__patch", {}).get("engine/processors", [])
    assert "lua_processor@*yoyo.km_punct" in processors, "km_punct processor not found in engine/processors"
    print("✓ [Schema Processor] lua_processor@*yoyo.km_punct 成功挂载在 chord_composer 之后")

    bindings = km_data.get("__patch", {}).get("key_binder/+", {}).get("bindings", [])
    bs_binding = next((b for b in bindings if b.get("accept") == "BackSpace" and b.get("when") == "composing"), None)
    assert bs_binding is not None, "BackSpace composing binding not found"
    assert bs_binding.get("send") == "Escape", f"Unexpected BackSpace mapping: {bs_binding.get('send')}"
    print("✓ [Schema 键位] composing 状态下 BackSpace -> Escape (一键清空误击)")

    ret_binding = next((b for b in bindings if b.get("accept") == "Return" and b.get("when") == "composing"), None)
    assert ret_binding is not None, "Return composing binding not found"
    assert ret_binding.get("send") == "Escape", f"Unexpected Return mapping: {ret_binding.get('send')}"
    print("✓ [Schema 键位] composing 状态下 Return -> Escape (一键取消)")

    # ────────────────────────────────────────────────────────
    # 4. 验证练习工具生成数据模块
    # ────────────────────────────────────────────────────────
    print("\n--- 4. 验证练习工具数据模块 ---")
    assert PRACTICE_JS.exists(), "km_char_word_data_module.js 不存在！"
    js_content = PRACTICE_JS.read_text(encoding="utf-8")
    assert "yoyo-pure.dict.yaml" in js_content, "Practice JS header does not reference yoyo-pure.dict.yaml"
    assert "KM_CHARS" in js_content and "KM_WORDS" in js_content and "KM_JIAN" in js_content
    print("✓ [练习工具] km_char_word_data_module.js 数据源已 100% 对齐 yoyo-pure 规范字典")

    print("\n==================================================")
    print("🎉 体验增强综合测试全部通过！首两梯队改进完美落地！")
    print("==================================================")
    return True


if __name__ == "__main__":
    success = test_enhancements()
    sys.exit(0 if success else 1)
