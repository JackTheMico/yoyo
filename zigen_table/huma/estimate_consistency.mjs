// 票 #60 的附带体检：分析器给出的拆分序列，能不能按取码规则重现已发布的全码？
//
// 这不是正式闸门（那属于票 #63），只是给「这条路走不走得通」一个数，
// 免得等把全量数据灌完才发现拆分与已发布编码系统性对不上。
//
// 用法：node estimate_consistency.mjs [样本数，默认 300]

import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { 读取配置, 获取字库, 获取词典 } from "hanzi-chai";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const 配置路径 = join(ROOT, "zigen_table", "yoyo-analysis-0.4.yaml");
const 码表路径 = join(ROOT, "rime", "yoyo-pure.dict.yaml");
const 样本数 = Number(process.argv[2] ?? 300);

const HAND = new Set(["_", "+"]); // 并击手别前缀，不是码元

/** 从已发布码表读出「单字 → 全码」 */
function 读取全码() {
  const 表 = new Map();
  for (const 行 of readFileSync(码表路径, "utf-8").split("\n")) {
    if (!行 || 行.startsWith("#")) continue;
    const [字, 码] = 行.split("\t");
    if (!字 || !码 || [...字].length !== 1) continue;
    if (HAND.has(码[0])) continue; // 简码
    if ([...码].length !== 3) continue; // 非三码全码
    表.set(字, 码);
  }
  return 表;
}

const config = 读取配置(配置路径);
const 字库 = 获取字库(config);
if (!字库.ok) {
  console.error("获取字库失败", 字库.error);
  process.exit(1);
}

const 全码表 = 读取全码();
const 目标字 = [...全码表.keys()].slice(0, 样本数);
const 结果 = 字库.value.拆分(
  {
    分析配置: config.analysis ?? {},
    决策: config.form.mapping,
    决策空间: config.form.mapping_space ?? {},
  },
  new Set(目标字),
);
if (!结果.ok) {
  console.error("字形分析失败", 结果.error);
  process.exit(1);
}

const codes = new Map(Object.entries(config.form.mapping).map(([根, 码]) => [根, String(码)]));
const { 部件分析结果, 复合体分析结果 } = 结果.value;

let 一致 = 0;
let 无分析 = 0;
let 缺根 = 0;
const 不一致样例 = [];

for (const 字 of 目标字) {
  const 分析 = 部件分析结果.get(字) ?? 复合体分析结果.get(字);
  if (!分析) {
    无分析 += 1;
    continue;
  }
  const 序列 = 分析.字根序列;
  const 码表 = 序列.map((根) => codes.get(根));
  if (码表.some((x) => x === undefined)) {
    缺根 += 1;
    continue;
  }
  let 预测;
  if (序列.length === 1) {
    预测 = 码表[0];
  } else if (序列.length === 2) {
    预测 = 码表[0][0] + 码表[1];
  } else {
    预测 = 码表[0][0] + 码表[1][0] + 码表[码表.length - 1][0];
  }
  const 实际 = 全码表.get(字);
  if (预测 === 实际) {
    一致 += 1;
  } else if (不一致样例.length < 12) {
    不一致样例.push(`${字}\t序列=${序列.join(" ")}\t预测=${预测}\t实际=${实际}`);
  }
}

const 可判 = 目标字.length - 无分析 - 缺根;
console.log(`样本 ${目标字.length} 字（取已发布码表前 N 个三码全码字）`);
console.log(`  无分析结果 ${无分析} / 字根缺码 ${缺根} / 可判 ${可判}`);
console.log(`  自洽 ${一致} / ${可判} = ${((一致 / 可判) * 100).toFixed(1)}%`);
console.log(`\n前 12 个不一致：`);
for (const 行 of 不一致样例) console.log("  " + 行);
