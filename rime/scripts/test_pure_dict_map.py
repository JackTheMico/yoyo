#!/usr/bin/env python3
"""纯形字典双轨映射表 (pure_dict_map) 单元测试。

验证内容：
1. pure_dict_map 导出 char_first (主单表) 与 word_first (主词表)
2. char_first 表中：
   - 120 个一简 100% 首选为单字、次选为词组
   - 混合两码 (如 cI) 首选为单字 "简"、次选为词组 "简单"
3. word_first 表中：
   - 120 个一简 100% 首选为词组、次选为单字
   - 混合两码 (如 cI) 首选为词组 "简单"、次选为单字 "简"
4. 根级 dict_map / dict_map_2 向后兼容默认代理到 char_first
"""

import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
RIME_DIR = SCRIPTS_DIR.parent
TEST_LUA = SCRIPTS_DIR / "_tmp_test_dict_map.lua"

LUA_CODE = r"""
package.path = package.path .. ";rime/lua/?.lua;rime/lua/?/init.lua;lua/?.lua"

local pure_data = require "yoyo.data.pure_dict_map"

assert(pure_data.char_first ~= nil, "char_first 必须存在")
assert(pure_data.word_first ~= nil, "word_first 必须存在")
assert(pure_data.char_first.dict_map ~= nil, "char_first.dict_map 必须存在")
assert(pure_data.char_first.dict_map_2 ~= nil, "char_first.dict_map_2 必须存在")
assert(pure_data.word_first.dict_map ~= nil, "word_first.dict_map 必须存在")
assert(pure_data.word_first.dict_map_2 ~= nil, "word_first.dict_map_2 必须存在")

-- 1. 验证主单模式 (char_first)
local cf = pure_data.char_first
assert(cf.dict_map["_e"] == "在", "char_first _e 必须为 '在'")
assert(cf.dict_map_2["_e"] == "真的", "char_first _e' 必须为 '真的'")
assert(cf.dict_map["_n"] == "没", "char_first _n 必须为 '没' (单字)")
assert(cf.dict_map_2["_n"] == "没有", "char_first _n' 必须为 '没有' (词组)")
assert(cf.dict_map["_I"] == "此", "char_first _I 必须为 '此' (单字)")
assert(cf.dict_map_2["_I"] == "问题", "char_first _I' 必须为 '问题' (词组)")
assert(cf.dict_map["cI"] == "简", "char_first cI 必须为 '简' (单字)")
assert(cf.dict_map_2["cI"] == "简单", "char_first cI' 必须为 '简单' (词组)")

-- 2. 验证主词模式 (word_first)
local wf = pure_data.word_first
assert(wf.dict_map["_e"] == "真的", "word_first _e 必须为 '真的' (词组)")
assert(wf.dict_map_2["_e"] == "在", "word_first _e' 必须为 '在' (单字)")
assert(wf.dict_map["_n"] == "没有", "word_first _n 必须为 '没有' (词组)")
assert(wf.dict_map_2["_n"] == "没", "word_first _n' 必须为 '没' (单字)")
assert(wf.dict_map["_I"] == "问题", "word_first _I 必须为 '问题' (词组)")
assert(wf.dict_map_2["_I"] == "此", "word_first _I' 必须为 '此' (单字)")
assert(wf.dict_map["cI"] == "简单", "word_first cI 必须为 '简单' (词组)")
assert(wf.dict_map_2["cI"] == "简", "word_first cI' 必须为 '简' (单字)")

-- 3. 验证 120 个一简在主单模式下 100% 首选为单字，次选为词组
local jian_count = 0
for code, first_text in pairs(cf.dict_map) do
  if code:sub(1,1) == "_" or code:sub(1,1) == "+" then
    jian_count = jian_count + 1
    local second_text = cf.dict_map_2[code]
    assert(utf8.len(first_text) == 1, string.format("主单模式下一简首选必须为单字: %s -> %s", code, first_text))
    assert(second_text ~= nil and utf8.len(second_text) > 1, string.format("主单模式下一简次选必须为词组: %s -> %s", code, tostring(second_text)))
    
    -- 主词模式下必须反转
    local wf_first = wf.dict_map[code]
    local wf_second = wf.dict_map_2[code]
    assert(utf8.len(wf_first) > 1, string.format("主词模式下一简首选必须为词组: %s -> %s", code, wf_first))
    assert(utf8.len(wf_second) == 1, string.format("主词模式下一简次选必须为单字: %s -> %s", code, wf_second))
  end
end

assert(jian_count == 120, string.format("一简数量必须为 120: got %d", jian_count))

-- 4. 向后兼容性检查
assert(pure_data.dict_map["_e"] == "在", "向后兼容 dict_map['_e'] 必须为 '在'")
assert(pure_data.dict_map_2["_e"] == "真的", "向后兼容 dict_map_2['_e'] 必须为 '真的'")

print(string.format("✓ pure_dict_map 双轨映射测试 100%% 通过: 一简验证 %d 条, 主单/主词反转完全一致", jian_count))
"""

def run():
    TEST_LUA.write_text(LUA_CODE, encoding="utf-8")
    try:
        res = subprocess.run(["lua", str(TEST_LUA)], capture_output=True, text=True)
        print(res.stdout)
        if res.returncode != 0:
            print(res.stderr, file=sys.stderr)
        return res.returncode == 0
    finally:
        if TEST_LUA.exists():
            TEST_LUA.unlink()

if __name__ == "__main__":
    sys.exit(0 if run() else 1)
