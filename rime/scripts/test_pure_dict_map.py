#!/usr/bin/env python3
"""纯形字典映射表 (pure_dict_map) 单元测试。

验证内容：
1. pure_dict_map 直接导出 dict_map / dict_map_2（单轨，按权重降序，不区分字/词）
2. 同码候选按实际使用频率排序：
   - Q/：首选「所有」(2.2M)、次选「幞」(387)
   - _e：首选「在」(57M)、次选「真的」(3.2M)
   - _n：首选「没有」(10M)、次选「没」(7.1M)
   - cI：首选「简单」(1.6M)、次选「简」(0.4M)
3. 不再存在 char_first / word_first 双轨结构
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

assert(pure_data.dict_map ~= nil, "dict_map 必须存在")
assert(pure_data.dict_map_2 ~= nil, "dict_map_2 必须存在")
assert(pure_data.char_first == nil, "char_first 双轨结构已移除，不应存在")
assert(pure_data.word_first == nil, "word_first 双轨结构已移除，不应存在")

-- 按权重降序：高频候选排前，不区分单字/词组
assert(pure_data.dict_map["Q/"] == "所有", "Q/ 首选必须为 '所有' (权重 2.2M)")
assert(pure_data.dict_map_2["Q/"] == "幞", "Q/ 次选必须为 '幞' (权重 387)")

assert(pure_data.dict_map["_e"] == "在", "_e 首选必须为 '在'")
assert(pure_data.dict_map_2["_e"] == "真的", "_e 次选必须为 '真的'")

assert(pure_data.dict_map["_n"] == "没有", "_n 首选必须为 '没有' (词组，词频更高)")
assert(pure_data.dict_map_2["_n"] == "没", "_n 次选必须为 '没' (单字)")

assert(pure_data.dict_map["cI"] == "简单", "cI 首选必须为 '简单' (词组，词频更高)")
assert(pure_data.dict_map_2["cI"] == "简", "cI 次选必须为 '简' (单字)")

-- 一简数量统计
local jian_count = 0
for code in pairs(pure_data.dict_map) do
  if code:sub(1,1) == "_" or code:sub(1,1) == "+" then
    jian_count = jian_count + 1
  end
end
assert(jian_count == 120, string.format("一简数量必须为 120: got %d", jian_count))

print(string.format("✓ pure_dict_map 单轨权重排序测试 100%% 通过: 一简 %d 条, Q/=所有/幞, _n=没有/没", jian_count))
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
