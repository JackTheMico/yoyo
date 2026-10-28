# huma 分析管线（离线段）

用上游 [hanzi-chai](https://github.com/hanzi-chai/hanzi-chai.github.io) 的核心算法，对麓鸣码的
字符集做**字形拆分**，产出「字 → 完整字根序列」——只是拆分，不产出任何编码。

它是整条反查字根特性的第一段：产物入库后，下游改注释格式只需重跑 Python，不必再碰这里。

## 环境

Node ≥ 20（实测 v26.12.1），依赖版本由 `package.json` 精确锁定、`package-lock.json` 复现：

```
npm ci
```

`node_modules/` 不入库（仓库根的 `.gitignore` 已覆盖）。整套分析**离线**：字库、词典、笔画数据
都随包发布（`node_modules/hanzi-chai/dist/data/`），不需要联网抓字形。

## 跑

```bash
python3 make_analysis_config.py     # 生成 ../yoyo-analysis-0.4.yaml
node probe.mjs                      # 抽查若干字的完整拆分序列
node estimate_consistency.mjs 8000  # 体检：拆分能否重现已发布全码
```

`probe.mjs` 退出码 0 表示拿到了完整序列（序列长度 ≥3 的字不少于 3 个）。

## 两个必须知道的坑

**1. 字根词表要把从属字根展开。** `yoyo-chai.yaml` 的 `form.mapping` 只有 277 个主字根，
而字库里大量部件是私用区字形（例如 `是` 的下半是 U+E03A，`grouping` 记着它从属于 `疋`）。
分析器只认 `决策` 的键、不认 `grouping`，所以词表不展开的话它会把 U+E03A 拆成一堆笔画，
拆分与已发布编码对不上——实测只带主字根时自洽率仅 **50%**，展开后（539 个根）**99.2%**。

**2. `form.mapping` 必须保留，但只用它的键。** `拆分()` 靠它确定「哪些根合法」
（`repertoire.js` 把单字键当词表，`component.js` / `compound.js` 里对它的消费全是 `.has(名称)`），
值从不被读取。所以它是**字根词汇表**，不是编码规则——真正的编码规则是 `alphabet` /
`mapping_type`，这些一个都不带（见 ADR-0002）。

## 私用区字根在上游输出里的形态

上游输出的是私用区字符本身，`查询字形()` 的 `name` 字段取不到（实测 6 个样本全为空）。
可读身份来自 **`form.grouping`**：每个私用区根都被映射到一个主字根（U+E00D→冫、U+E020→角、
U+E450→八、U+F001→井、U+E079→匕、U+E0DC→鹿）。渲染层应当先做这层归一，再决定显示什么。
