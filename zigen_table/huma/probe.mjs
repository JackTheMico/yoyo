// 票 #60 的探针：验证 hanzi-chai 能对指定汉字吐出**完整拆分序列**（不只是首根+末根）。
//
// 用法：node probe.mjs [配置路径]
// 默认读 ../yoyo-analysis-0.4.yaml（由 make_analysis_config.py 生成）。
//
// 退出码 0 = 拿到了完整序列；1 = 走不通（打印失败点）。

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { 读取配置, 获取字库, 获取词典 } from "hanzi-chai";

const HERE = dirname(fileURLToPath(import.meta.url));
const 配置路径 = process.argv[2] ?? join(HERE, "..", "yoyo-analysis-0.4.yaml");

// 样本字：既要有常用字，也要挑几个拆分链明显长于 3 的
const 样本 = ["的", "寒", "鹿", "你", "德", "麓", "鸣"];

function 失败(阶段, 详情) {
  console.error(`[不可行] 卡在「${阶段}」：${详情}`);
  process.exit(1);
}

const config = 读取配置(配置路径);
console.log(`配置：${配置路径}`);
console.log(`  顶层键：${Object.keys(config).join(", ")}`);
console.log(`  字根词汇（form.mapping 键数）：${Object.keys(config.form?.mapping ?? {}).length}`);
console.log(`  分析段键：${Object.keys(config.analysis ?? {}).join(", ")}`);
console.log(`  是否有 encoder / optimization：${"encoder" in config} / ${"optimization" in config}`);

const 字库 = 获取字库(config);
if (!字库.ok) 失败("获取字库", 字库.error?.message ?? String(字库.error));

const 词典 = 获取词典();
if (!词典) 失败("获取词典", "返回空");

const 汉字集合 = new Set(样本);
console.log(`\n对 ${样本.length} 个字跑分析……`);

const t0 = Date.now();
const 结果 = 字库.value.拆分(
  {
    分析配置: config.analysis ?? {},
    决策: config.form.mapping,
    决策空间: config.form.mapping_space ?? {},
  },
  汉字集合,
);
const 耗时 = Date.now() - t0;

if (!结果.ok) 失败("字形分析", 结果.error?.message ?? String(结果.error));

const { 部件分析结果, 复合体分析结果 } = 结果.value;
console.log(`完成，${耗时} ms。部件 ${部件分析结果.size} 个 / 复合体 ${复合体分析结果.size} 个\n`);

let 长序列 = 0;
for (const 字 of 样本) {
  const 分析 = 部件分析结果.get(字) ?? 复合体分析结果.get(字);
  if (!分析) {
    console.log(`${字}\t（未分析到）`);
    continue;
  }
  const 序列 = 分析.字根序列;
  if (序列.length >= 3) 长序列 += 1;
  const 来源 = 部件分析结果.has(字) ? "部件" : "复合体";
  console.log(`${字}\t${序列.length} 根\t${序列.join(" ")}\t[${来源}]`);
}

console.log(`\n序列长度 ≥3 的字：${长序列} / ${样本.length}`);
if (长序列 < 3) {
  console.error("[不可行] 没有 ≥3 个字的拆分序列长度 ≥3——拿不到中间根");
  process.exit(1);
}
console.log("[可行] 拿到了完整拆分序列");

// 顺带记录：私用区字根在上游输出里长什么形态
const 私用区 = new Set();
for (const 表 of [部件分析结果, 复合体分析结果]) {
  for (const [, 分析] of 表) {
    for (const 根 of 分析.字根序列) {
      if (/[\ue000-\uf8ff]/.test(根)) 私用区.add(根);
    }
  }
}
console.log(`\n样本里出现的私用区字根：${私用区.size} 个`);
const 分组 = config.form?.grouping ?? {};
for (const 根 of [...私用区]) {
  const 字形 = 字库.value.查询字形(根);
  const 主根 = 分组[根];
  console.log(
    `  U+${根.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}` +
      `  字形名=${字形?.name ?? "（无）"}` +
      `  从属于=${主根 ?? "（grouping 无记录）"}`,
  );
}
