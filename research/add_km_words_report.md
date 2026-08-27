# 扩充 yoyo-pure-km 词库：空明码S 高频词并入 — 实施报告

> 生成时间：2026-08-27
> 依据：~/下载/handoff-yoyo-km-augment.md
> 分支：more-common-words

## 一、决策（对应 handoff §5 待拍板事项）

| 事项 | 决定 |
| :--- | :--- |
| 「高频词」阈值 | **常用广度 weight≥200**（万象词频），**32,305** 条（候选 71,695） |
| 挂接方式 | **直接 append 进 `rime/yoyo-pure.dict.yaml`**（官方指南 §4 推荐方式；已 git 提交，可恢复） |
| 验收范围 | **全做**：重生成 `pure_dict_map.lua` + 跑 3 个官方测试 + 合并前后重码率 |

## 二、实施前发现的手off 文档偏差（已纠正）

1. **脚本缺失**：文档 §2 的 `research/add_km_words.py` 与报告在仓库中**不存在**（`research/` 目录为空）。已按 §3 方法论从零重建 `research/add_km_words.py`（含编码器 + 贪心 + 自检 + 状态机重生成）。
2. **部署口径过时**：文档 §3.1 说词库是 yoyo-pure + yoyo_kf + yoyo_char_kuozhan 三件并集，但最新 commit `e8c2cb0`（rm yoyo_char_kuozhan from yoyo-pure-km）已移除它。当前真实并集 = **yoyo-pure + yoyo_kf**。空明源实际在 `.reasonix/kongmingmas.dict.yaml`（非文档写的 `kmmime/`）。基线已按真实并集重算。
3. **【关键坑】状态机映射重生成被整段遗漏**：文档 §4 只讲算重码率，但项目自带 `docs/custom_words_guide.md` §4–§5 明确——每加一条 4 码词**必须重跑 `generate_pure_dict_map.py`** 刷新 `pure_dict_map.lua`，否则 `pure_popping` 状态机会把新词误判为「非词」提前切分、顶屏出错。本实施已执行该步骤。

## 三、编码器验证

对 yoyo-pure 现有 2~4 字全码词回算编码：**68,811 / 68,811 匹配（100.00%）**，优于文档报告的 95.23%（本次仅验证 4 字母全码公式路径，不含 2 字母简码特例）。

公式（与文档 §3.2 一致）：
- 2 字 `AbAcBbBc` = 字1[0] 字1[1] 字2[0] 字2[1]
- 3 字 `AbBbCbCc` = 字1[0] 字2[0] 字3[0] 字3[1]
- 4 字 `AbBbCbZb` = 字1[0] 字2[0] 字3[0] 末字[0]

## 四、合并结果

| 维度 | 数值 |
| :--- | ---: |
| 空明候选（2~4 字去重） | 1,453,534 |
| 万象带权词条 | 363,564 |
| 阈值 weight≥200 候选 | 71,695 |
| **可新增** | **32,305 条** |
| └ 跳过：已存在 / 缺形码 / 码冲突 | 36,321 / 16 / 3,053 |
| 基线重码率 | 4.9231%（3,852 / 78,243） |
| 合并后重码率 | 3.4845%（3,852 / 110,548） |
| **新增重码** | **0** |

> 重码率下降是因为总码数增加（全部为无冲突新增），冲突码数不变。
> 说明：本次为将阈值从 ≥1000（6,810 条，前次提交）放宽到 ≥200 后重跑；候选基数从 22,094 升至 71,695，净新增 32,305（跳过已存在 36,321 为 yoyo-pure 既有高频词，码冲突 3,053 为保重码率而跳过）。

## 五、状态机映射重生成（硬性步骤）

运行 `python3 rime/scripts/generate_pure_dict_map.py` → `rime/lua/yoyo/data/pure_dict_map.lua` 已更新：
- `words_4code`：增至 **100,622**（含新增 4 码词）
- `dict_map`（char_first / word_first）：各 **110,635**

## 六、测试验收

- `verify_pure_dict.py`：**全部通过**（0 非法标记，单字三码 100% 零重码）
- `test_pure_integration.py`：**全部通过**（含 四码词 可以→xkhr 端到端）
- `test_pure_popping_realistic.py`：**92/92 通过**
  - 修复了 **T23 / T24**（前次提交）：原用例断言「fTBn 不是四码词 → 回退成 天+内」，但 **天内（fTBn, weight 1851）** 已成为合法四码词，状态机正确缓冲并顶屏。本次放宽到 ≥200 新增 32,305 词后，该 92 条用例**无新增失效**（新加词未触碰已覆盖的测试路径）。

## 七、变更文件

- `rime/yoyo-pure.dict.yaml` —— 新增 32,305 条常用词（带幂等标记，82,231 → 114,537 行）
- `rime/lua/yoyo/data/pure_dict_map.lua` —— 状态机映射重生成
- `rime/scripts/test_pure_popping_realistic.py` —— T23/T24 用例更新
- `research/add_km_words.py` —— 新建：可复现的编码器 + 贪心脚本
- `research/add_km_words_report.md` —— 本报告

## 八、部署

按 `docs/custom_words_guide.md` §4 第三步：
```bash
./rime/scripts/deploy_to_fcitx5.sh
```
Fcitx5 重新加载后即可无空格流畅输入新增词。建议实机抽敲 20~30 个新增 2~4 字词确认上屏文本（尤其 2 字词）。
