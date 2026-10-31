#!/usr/bin/env node
// 反馈回路：校验 practice_tool 的空明拳键位表是否与 rime/yoyo.yaml「空明拳」段一致。
//
// 背景：练习页的指法（KM_BEST_CHORD）是 yoyo.yaml 键位规则的**手抄副本**，
// 没有任何机制保证两者同步。历史上 `>` 码元由 de/ik 改绑 td/yk 时，
// 该副本未同步，导致「常用单字·中500」里的 麦（>/）与 丰（>f）仍按旧指法显示。
//
// 断言：
//   1. yoyo.yaml 里每个码元的左手键位，与 KM_BEST_CHORD / KM_CHORDS 完全一致；
//   2. KM_BEST_CHORD 里的每个码元，yoyo.yaml 里都必须有对应规则（无幽灵码元）；
//   3. 练习数据里出现的每个码元都能查到指法（否则页面显示 ?）；
//   4. 具体条目落地检查：中500 的 麦 / 丰 显示的左手键位。
//
// 用法：
//   node practice_tool/verify_km_binding.js                 # 校验工作区的 rime/yoyo.yaml
//   node practice_tool/verify_km_binding.js --yaml <path>   # 校验指定 yaml（如 git show main:rime/yoyo.yaml）
//   node practice_tool/verify_km_binding.js --verbose       # 打印每个码元的键位对照

const fs = require('fs');
const path = require('path');

const KM = require('./km_data_module');
const KMCW = require('./km_char_word_data_module');

// 注入 km_practice.js 依赖的全局变量（浏览器里由 <script> 提供）
global.KM_CHORDS = KM.KM_CHORDS;
global.KM_BEST_CHORD = KM.KM_BEST_CHORD;
global.KM_MIRROR = KM.KM_MIRROR;
global.KM_LEFT_ORDER = KM.KM_LEFT_ORDER;
global.KM_CHARS = KMCW.KM_CHARS;
global.KM_WORDS = KMCW.KM_WORDS;
global.KM_JIAN = KMCW.KM_JIAN;

const kmp = require('./km_practice');

const argv = process.argv.slice(2);
const yamlIndex = argv.indexOf('--yaml');
const YAML_PATH = yamlIndex >= 0
  ? path.resolve(argv[yamlIndex + 1])
  : path.join(__dirname, '..', 'rime', 'yoyo.yaml');
const VERBOSE = argv.includes('--verbose');

/** 按 KM_LEFT_ORDER 归一化键序（chord_composer 也是按下标排序后匹配）。 */
function normalizeChord(keys) {
  return keys
    .split('')
    .sort((a, b) => KM.KM_LEFT_ORDER.indexOf(a) - KM.KM_LEFT_ORDER.indexOf(b))
    .join('');
}

/** 解析 yoyo.yaml 的「空明拳」段，返回 Map<码元, Set<归一化左手键位>>。 */
function parseKongmingquan(yamlPath) {
  const lines = fs.readFileSync(yamlPath, 'utf8').split('\n');
  const start = lines.findIndex((line) => /^空明拳\s*:/.test(line));
  if (start < 0) throw new Error(`${yamlPath}: 找不到「空明拳」段`);

  const map = new Map();
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    // 遇到下一个顶级节点（顶格且非注释）即止
    if (trimmed && !trimmed.startsWith('#') && /^\S/.test(line)) break;
    const m = line.match(/^\s*-\s*xform\|([^|]*)\|([^|]*)\|/);
    if (!m) continue;
    // yaml 里 `\.` 是转义后的「.」键
    const keys = m[1].replace(/\\(.)/g, '$1');
    const code = m[2];
    if (!keys || !code) continue;
    // 段首的右手镜像规则（y→t、u→r …）不属于码元指法
    if (keys.length === 1 && code.length === 1 && keys !== code) continue;
    if (!map.has(code)) map.set(code, new Set());
    map.get(code).add(normalizeChord(keys));
  }
  if (map.size === 0) throw new Error(`${yamlPath}: 「空明拳」段未解析到任何码元规则`);
  return map;
}

const problems = [];

function report(msg) {
  problems.push(msg);
}

function main() {
  const yamlMap = parseKongmingquan(YAML_PATH);
  const best = KM.KM_BEST_CHORD;
  const chords = KM.KM_CHORDS;

  console.log(`YAML: ${YAML_PATH}`);
  console.log(`解析到码元 ${yamlMap.size} 个；KM_BEST_CHORD ${Object.keys(best).length} 个\n`);

  // 1 + 2：双向一致性
  for (const [code, yamlChords] of yamlMap) {
    const chord = best[code];
    if (!chord) {
      report(`码元 ${code}：yoyo.yaml 有规则（${[...yamlChords].join('/')}），KM_BEST_CHORD 缺失`);
      continue;
    }
    const norm = normalizeChord(chord);
    if (!yamlChords.has(norm)) {
      report(`码元 ${code}：KM_BEST_CHORD 为 ${chord}（归一 ${norm}），yoyo.yaml 为 ${[...yamlChords].join(' / ')}`);
    }
    if (chords[chord] !== code) {
      report(`码元 ${code}：KM_CHORDS[${chord}] = ${chords[chord] || '(缺)'}，未回指该码元`);
    }
    if (VERBOSE) console.log(`  ${code}\t左 ${chord}\t右 ${chord.split('').map((k) => KM.KM_MIRROR[k]).join('')}`);
  }
  for (const code of Object.keys(best)) {
    // 单键码元直出，yoyo.yaml 里本就没有 xform 规则（见「单键码元（15 个）」注释）
    if (best[code] === code) continue;
    if (!yamlMap.has(code)) report(`码元 ${code}：KM_BEST_CHORD 有，yoyo.yaml 无（幽灵码元）`);
  }

  // 3：练习数据用到的码元都要能查到指法
  // KM_CHARS / KM_WORDS 是「分段数组」，KM_JIAN 是平铺数组
  const segmentsOf = (bank) => (Array.isArray(bank[0]) ? bank : [bank]);
  const used = new Set();
  for (const bank of [KMCW.KM_CHARS, KMCW.KM_WORDS, KMCW.KM_JIAN]) {
    for (const seg of segmentsOf(bank)) {
      for (const item of seg) {
        for (const step of item.steps) {
          for (const code of step.target) used.add(code);
        }
      }
    }
  }
  for (const code of used) {
    if (!kmp.fingeringOf(code)) report(`练习数据用到码元 ${code}，但查不到指法（页面会显示 ?）`);
  }

  // 4：落地检查——中500 的 麦 / 丰
  const mid = KMCW.KM_CHARS[1];
  for (const char of ['麦', '丰']) {
    const item = mid && mid.find((it) => it.char === char);
    if (!item) {
      report(`「常用单字·中500」找不到「${char}」`);
      continue;
    }
    const step = item.steps[0];
    if (step.hand !== 'both' || step.target.length !== 2) {
      report(`${char}（${item.code}）：首击应为双手并击两码，实际 ${step.hand}/${step.target.length}`);
      continue;
    }
    const left = kmp.fingeringOf(step.target[0]);
    const right = kmp.fingeringOf(step.target[1]);
    if (!left || !right) {
      report(`${char}（${item.code}）：码元指法缺失`);
      continue;
    }
    const leftKeys = left.left.join(' ');
    const rightKeys = right.right.join(' ');
    console.log(`${char}  编码 ${item.code}  →  左手 ${leftKeys} 打 ${step.target[0]}，右手 ${rightKeys} 打 ${step.target[1]}`);
    if (leftKeys !== 't d') {
      report(`${char}（${item.code}）：${step.target[0]} 的左手指法应为 t d（> = td/yk），实际 ${leftKeys}`);
    }
  }

  console.log('');
  if (problems.length === 0) {
    console.log(`PASS 键位表与 yoyo.yaml 一致（${yamlMap.size} 个码元），中500 麦/丰 指法正确`);
    return 0;
  }
  console.log(`FAIL ${problems.length} 处不一致：`);
  for (const p of problems.slice(0, 40)) console.log(`  - ${p}`);
  if (problems.length > 40) console.log(`  ... 另有 ${problems.length - 40} 处`);
  return 1;
}

process.exit(main());
