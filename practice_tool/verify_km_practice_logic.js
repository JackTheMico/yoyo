#!/usr/bin/env node
// 反馈回路：用真实的 km_practice.js 逻辑驱动全部「常用单字 / 常用词组 / 一简字词」条目，
// 校验其练习步骤是否符合「纯形统一流 (yoyo-pure-km)」的 0 空格并击方案。
//
// 判定标准（来自 rime/lua/yoyo/pure_popping.lua 注释 §编码类型 + custom_words_guide.md §2）：
//   - 一简  = _X / +X  → 单手一击，无空格
//   - 两码字 = XY      → 双手并击，无空格
//   - 3码字 = XX_Y/XX+Y → 第一击双手并击前两码，第二击单手第三码，无空格
//   - 4码词 = XYZW     → 两击双手并击，无空格
// 核心断言：每一步 step.space 必须为 false（yoyo-pure-km 全程 0 空格，空格仅用于选字/翻页）。

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

// 由 code 推导 yoyo-pure-km 期望的步骤结构（仅 hand/target 数量，不含 space）
function expectedSteps(code) {
  const isJian = /^[_+][a-zA-Z,./;:<>?]$/.test(code);
  if (isJian) {
    return [{ hand: code[0] === '_' ? 'left' : 'right', len: 1 }];
  }
  const plain = code.replace(/[_+]/g, '');
  const steps = [];
  // 前两码（若有）为双手并击
  if (plain.length >= 2) steps.push({ hand: 'both', len: 2 });
  // 剩余每两码一组双手并击，落单一码单手
  for (let i = 2; i < plain.length; i += 2) {
    const chunk = plain.slice(i, i + 2);
    steps.push(chunk.length === 2 ? { hand: 'both', len: 2 } : { hand: 'either', len: 1 });
  }
  if (steps.length === 0) steps.push({ hand: 'either', len: 1 });
  return steps;
}

function checkSegment(items, type, segName) {
  let total = 0, spaceBad = 0, structBad = 0, bad = [];
  for (const item of items) {
    const built = kmp.charWordItem(item, type);
    total += built.steps.length;
    const exp = expectedSteps(item.code);
    // 结构校验
    if (exp.length !== built.steps.length) {
      structBad++;
      if (bad.length < 10) bad.push(`${segName} ${JSON.stringify(item.code)} 结构: 期望${exp.length}步 实际${built.steps.length}步`);
    } else {
      built.steps.forEach((s, i) => {
        if (s.hand !== exp[i].hand || s.target.length !== exp[i].len) {
          structBad++;
          if (bad.length < 10) bad.push(`${segName} ${JSON.stringify(item.code)} 第${i + 1}步: 期望${exp[i].hand}/${exp[i].len}码 实际${s.hand}/${s.target.length}码`);
        }
      });
    }
    // 空格校验（核心 bug 断言）
    built.steps.forEach((s, i) => {
      if (s.space === true) {
        spaceBad++;
        if (bad.length < 10) bad.push(`${segName} ${JSON.stringify(item.code)} 第${i + 1}步 错误地要求按空格`);
      }
    });
  }
  return { total, spaceBad, structBad, bad };
}

let all = { total: 0, spaceBad: 0, structBad: 0, bad: [] };
function merge(r) {
  all.total += r.total; all.spaceBad += r.spaceBad; all.structBad += r.structBad;
  all.bad.push(...r.bad);
}

for (let i = 0; i < KM_CHARS.length; i++) merge(checkSegment(KM_CHARS[i], 'char', `单字[${i}]`));
for (let i = 0; i < KM_WORDS.length; i++) merge(checkSegment(KM_WORDS[i], 'word', `词组[${i}]`));
merge(checkSegment(KM_JIAN, 'word', '一简'));

// 针对性断言：用户明确要求「等」用二简 cV 打，不再要求第三码 z。
(() => {
  let deng = null;
  for (const seg of KM_CHARS) {
    const found = seg.find((it) => it.char === '等');
    if (found) { deng = found; break; }
  }
  if (!deng) {
    all.bad.push('针对性断言: 常用单字数据中未找到「等」');
    return;
  }
  if (deng.code !== 'cV') {
    all.bad.push(`针对性断言: 「等」应取二简 cV，实际 code=${deng.code}`);
    return;
  }
  const built = kmp.charWordItem(deng, 'char');
  if (built.steps.length !== 1) {
    all.bad.push(`针对性断言: 「等」应为 1 步（cV 双手并击），实际 ${built.steps.length} 步`);
    return;
  }
  const s = built.steps[0];
  const ok = s.hand === 'both' && s.target.join('') === 'cV' && s.space === false;
  if (!ok) {
    all.bad.push(`针对性断言: 「等」步骤应为 {hand:both, target:cV, space:false}，实际 ${JSON.stringify(s)}`);
  }
})();

console.log(`扫描条目步骤总数: ${all.total}`);
console.log(`结构不符(yoyo-pure-km模型): ${all.structBad}`);
console.log(`要求按空格的步骤数 (应为 0): ${all.spaceBad}`);
if (all.bad.length) {
  console.log('\n问题样例:');
  all.bad.forEach((b) => console.log('  - ' + b));
}
if (all.spaceBad === 0 && all.structBad === 0) {
  console.log('\nPASS: 全部步骤符合纯形统一流 0 空格方案。');
  process.exit(0);
} else {
  console.log('\nFAIL: 存在不符合 yoyo-pure-km 方案的步骤。');
  process.exit(1);
}
