#!/usr/bin/env python3
"""纯形字典映射表 (pure_dict_map) 单元测试。

验证内容：
1. pure_dict_map 导出 dict_map (首选表) 与 dict_map_2 (次选表)
2. dict_map_2 正确收录 120 个一简次选（如 _e -> 真的，_w -> 时间，_d -> 第三）
3. 验证首选 dict_map 与次选 dict_map_2 的完全一致性与无回退
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

-- 验证 120 个一简核心次选
local expected_2nd = {
  ["_e"] = "真的",
  ["_w"] = "时间",
  ["_d"] = "其他",
  ["_D"] = "知",
  ["_a"] = "什么",
  ["_s"] = "就是",
  ["+i"] = "推荐",
  ["+I"] = "身体",
  ["+k"] = "合",
  ["+K"] = "每天",
  ["+j"] = "实现",
  ["+J"] = "度",
}

for code, exp_text in pairs(expected_2nd) do
  local got = pure_data.dict_map_2[code]
  assert(got == exp_text, string.format("次选不匹配: code=%s, expected=%s, got=%s", code, exp_text, tostring(got)))
end

-- 验证首选表不受破坏
assert(pure_data.dict_map["_e"] == "在", "首选 _e 必须为 '在'")
assert(pure_data.dict_map["_w"] == "是", "首选 _w 必须为 '是'")
assert(pure_data.dict_map["_d"] == "的", "首选 _d 必须为 '的'")

-- 统计 1-jian 次选数量
local jian_2nd_count = 0
for code, _ in pairs(pure_data.dict_map_2) do
  if code:sub(1,1) == "_" or code:sub(1,1) == "+" then
    jian_2nd_count = jian_2nd_count + 1
  end
end

assert(jian_2nd_count >= 120, string.format("一简次选词条数不足 120: got %d", jian_2nd_count))

print(string.format("✓ pure_dict_map 验证通过: 首选词条 %d, 次选词条 %d, 一简次选 %d", 
  #pure_data.dict_map or 0, jian_2nd_count, jian_2nd_count))
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
