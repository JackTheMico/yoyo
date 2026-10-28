// 全字符集拆分序列导出 → zigen_table/decomposition.tsv
//
// 用法：node export_decomposition.mjs [--chars <文件>]
// 默认字符集取自 rime/yoyo-pure.dict.yaml 的所有单字条目。
//
// 产物是中间产物（入库）：下游 rime/scripts/gen_zigen_align.py 只读这份文件，
// 以后调注释格式不必再跑上游、不必联网。

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { 读取配置, 获取字库 } from "hanzi-chai";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const 配置路径 = join(ROOT, "zigen_table", "yoyo-analysis-0.4.yaml");
const 码表路径 = join(ROOT, "rime", "yoyo-pure.dict.yaml");
const 输出路径 = join(ROOT, "zigen_table", "decomposition.tsv");

const 批次 = 400; // 一次分析多少字；单批失败时回退到逐字，避免一个字带崩整批
const MARK = new Set(["_", "+"]);

/** 码表里所有单字，按出现顺序去重 */
function 读取字符集() {
  const 字 = [];
  const 已见 = new Set();
  let inBody = false;
  for (const line of readFileSync(码表路径, "utf-8").split("\n")) {
    if (line.startsWith("...")) {
      inBody = true;
      continue;
    }
    if (!inBody || !line || line.startsWith("#")) continue;
    const ch = line.split("\t")[0];
    if (!ch || [...ch].length !== 1 || 已见.has(ch)) continue;
    已见.add(ch);
    字.push(ch);
  }
  return 字;
}

const config = 读取配置(配置路径);
const 字库 = 获取字库(config);
if (!字库.ok) {
  console.error("[致命] 获取字库失败：", 字库.error?.message ?? 字库.error);
  process.exit(1);
}

const base = {
  分析配置: config.analysis ?? {},
  决策: config.form.mapping,
  决策空间: config.form.mapping_space ?? {},
};

const 字符集 = 读取字符集();
console.log(`字符集 ${字符集.length} 字（来自 yoyo-pure.dict.yaml 单字条目）`);

const 结果 = new Map(); // 字 -> { seq, status }
let 失败批次 = 0;

function 收录(字列表, 分析结果) {
  for (const 字 of 字列表) {
    const 分析 = 分析结果.部件分析结果.get(字) ?? 分析结果.复合体分析结果.get(字);
    if (分析 && 分析.字根序列.length > 0) {
      结果.set(字, { seq: 分析.字根序列, status: "ok" });
    } else {
      结果.set(字, { seq: [], status: "miss" });
    }
  }
}

const t0 = Date.now();
for (let i = 0; i < 字符集.length; i += 批次) {
  const 片 = 字符集.slice(i, i + 批次);
  const r = 字库.value.拆分(base, new Set(片));
  if (r.ok) {
    收录(片, r.value);
    continue;
  }
  // 整批失败：逐字重试，把坏字单独记成 miss，不连累同批其它字
  失败批次 += 1;
  console.error(`  [批 ${i}-${i + 片.length - 1}] 分析失败，逐字重试：${r.error?.message ?? r.error}`);
  for (const 字 of 片) {
    const one = 字库.value.拆分(base, new Set([字]));
    if (one.ok) {
      收录([字], one.value);
    } else {
      结果.set(字, { seq: [], status: "miss" });
    }
  }
}

const 耗时 = ((Date.now() - t0) / 1000).toFixed(1);
const 成功 = [...结果.values()].filter((x) => x.status === "ok").length;
const 缺 = 结果.size - 成功;
const 根数分布 = new Map();
for (const { seq, status } of 结果.values()) {
  if (status !== "ok") continue;
  const k = seq.length === 1 ? "1" : seq.length === 2 ? "2" : "≥3";
  根数分布.set(k, (根数分布.get(k) ?? 0) + 1);
}

console.log(`完成，${耗时}s。成功 ${成功} / 缺 ${缺}${失败批次 ? `（含 ${失败批次} 个失败批次）` : ""}`);
console.log(
  "  根数分布：" +
    [...根数分布.entries()].sort().map(([k, v]) => `${k}→${v}`).join("  "),
);

const 行 = [
  "# 字根拆分序列（中间产物，下游 gen_zigen_align.py 的唯一输入）",
  "# 格式：字<TAB>根序列（空格分隔）<TAB>状态",
  "# 状态 ok=分析成功 / miss=分析不出（该字在注释里降级为纯编码）",
  `# 由 zigen_table/huma/export_decomposition.mjs + hanzi-chai 分析产出，勿手改。`,
  "# 私用区字根原样保留；显示名转换在渲染层（gen_zigen_align.py 的 root_label）。",
];
for (const 字 of 字符集) {
  const 项 = 结果.get(字);
  if (!项) continue;
  行.push([字, 项.seq.join(" "), 项.status].join("\t"));
}
writeFileSync(输出路径, 行.join("\n") + "\n", "utf-8");
console.log(`已写入 ${输出路径}（${(Buffer.byteLength(行.join("\n")) / 1024).toFixed(0)} KB / ${结果.size} 行）`);
