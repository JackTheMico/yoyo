// km_brief_practice.js 冒烟测试：node test_km_brief.js
// stub 浏览器环境后加载真实练习逻辑，驱动状态机验证两套打法（空格并击 / ' 前缀）。

const path = require('path');
process.chdir(path.join(__dirname));

// ---- 浏览器 stubs（必须在 require 之前）----
// 记录监听器，便于后面直接派发真实 keydown/keyup 事件（走真实输入入口）
const listeners = {};
global.document = {
  addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
  getElementById: () => ({ set innerHTML(_v) {}, set textContent(_v) {}, set className(_v) {} }),
  querySelectorAll: () => [],
};

/** 派发一个按键事件；返回是否被 preventDefault 以及处理器是否抛错。 */
function fire(type, key, code) {
  let prevented = false;
  let threw = null;
  const ev = {
    key, code, keycode: key.charCodeAt(0),
    repeat: false, metaKey: false, ctrlKey: false, altKey: false,
    preventDefault() { prevented = true; },
  };
  for (const fn of listeners[type] || []) {
    try { fn(ev); } catch (e) { threw = e; }
  }
  return { prevented, threw };
}
global.window = { addEventListener() {} };
global.localStorage = { getItem: () => null, setItem() {} };

const kmData = require('./km_data_module.js');
const { KM_BRIEF_WORDS, KM_BRIEF_SPACE } = require('./km_brief_data_module.js');
// km_brief_practice.js 依赖浏览器全局作用域里的数据常量，挂到 global 再加载
Object.assign(global, kmData);
global.KM_BRIEF_WORDS = KM_BRIEF_WORDS;
global.KM_BRIEF_SPACE = KM_BRIEF_SPACE;
const bp = require('./km_brief_practice.js');

let passed = 0, failed = 0;
function check(name, cond, detail) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}  ${detail || ''}`); }
}

// ---- 1. 数据完整性（两套）----
check('简词两套各 992 条',
  KM_BRIEF_WORDS.length === 992 && KM_BRIEF_SPACE.length === 992,
  `${KM_BRIEF_WORDS.length}/${KM_BRIEF_SPACE.length}`);
for (const [label, list, mark] of [["' 版", KM_BRIEF_WORDS, "'"], ['% 版', KM_BRIEF_SPACE, '%']]) {
  check(`${label} 码形 3 字符且前缀正确`,
    list.every((w) => w.code.length === 3 && w.code[0] === mark));
  check(`${label} 码元均在 KM_BEST_CHORD 中`,
    list.every((w) => {
      const rest = w.code[1] === '_' || w.code[1] === '+' ? w.code[2] : w.code.slice(1);
      return [...rest].every((ch) => kmData.KM_BEST_CHORD[ch]);
    }));
  check(`${label} 码位唯一`, new Set(list.map((w) => w.code)).size === list.length);
}
check("% 版码形覆盖三类", (() => {
  const kinds = new Set(KM_BRIEF_SPACE.map((w) => (w.code[1] === '_' ? 'L' : w.code[1] === '+' ? 'R' : 'B')));
  return kinds.has('L') && kinds.has('R') && kinds.has('B');
})());

// ---- 2. 码形解析 ----
check("最多 %wS → 双手 + 空格",
  JSON.stringify(bp.parseBriefCode('%wS')) === JSON.stringify({ daus: ['w', 'S'], hand: 'both' }));
check("这种 %_v → 左手 + 空格",
  JSON.stringify(bp.parseBriefCode('%_v')) === JSON.stringify({ daus: ['v'], hand: 'left' }));
check("看起来 %+i → 右手 + 空格",
  JSON.stringify(bp.parseBriefCode('%+i')) === JSON.stringify({ daus: ['i'], hand: 'right' }));

// ---- 3. 空格版：一击完成流程 ----
function forceFirst(mode, bankIndex) {
  bp.loadMode(mode);
  const p = bp.state.progress.slice();
  const pos = p.findIndex((x) => x.index === bankIndex);
  [p[0], p[pos]] = [p[pos], p[0]];
  bp.state.progress = p;
}

// 3a. 双手+空格（最多 %wS）
bp.loadMode('space_0');
const bothIdx = bp.state.bank.findIndex((it) => it.answer.includes('%wS'));
forceFirst('space_0', bothIdx);
bp._setStroke(['w', 'l', 'm'], true);   // 左手 w 打 w、右手 l+m 打 S，同时按空格
bp.settleStroke();
check('空格版 双手+空格（最多 %wS）一击通过',
  bp.state.stats.done === 1 && bp.state.stats.right === 1,
  `done=${bp.state.stats.done} right=${bp.state.stats.right}`);

// 3b. 漏按空格应判错
forceFirst('space_0', bothIdx);
bp._setStroke(['w', 'l', 'm'], false);
bp.settleStroke();
check('空格版 漏按空格判错', bp.state.stats.done === 0 && bp.state.stats.right === 0);

// 3c. 单手+空格（这种 %_v）
const leftIdx = bp.state.bank.findIndex((it) => it.answer.includes('%_v'));
forceFirst('space_0', leftIdx);
bp._setStroke(['v'], true);
bp.settleStroke();
check('空格版 左手+空格（这种 %_v）一击通过', bp.state.stats.done === 1);

// 3d. 单手题用错手判错
forceFirst('space_0', leftIdx);
const rightKeysOfV = bp.fingeringOf('v').right;   // 镜像右手键
bp._setStroke(rightKeysOfV, true);
bp.settleStroke();
check('空格版 左手题用右手判错', bp.state.stats.right === 0 && bp.state.stats.done === 0);

// 3e. 右手+空格
const rightIdx = bp.state.bank.findIndex((it) => it.answer.includes('%+'));
forceFirst('space_0', rightIdx);
const rItem = bp.state.bank[rightIdx];
const rDau = rItem.steps[0].target[0];
bp._setStroke(bp.fingeringOf(rDau).right, true);
bp.settleStroke();
check(`空格版 右手+空格（${rItem.answer}）一击通过`, bp.state.stats.done === 1);

// ---- 4. ' 版：两步流程仍正常 ----
const aposIdx = bp.state.bank.length; // 切模式后重新取
bp.loadMode('brief_0');
const aIdx = bp.state.bank.findIndex((it) => it.answer.includes('最多'));
forceFirst('brief_0', aIdx);
bp._setStroke(["'"]);
bp.settleStroke();
check("' 版 第1击 ' 通过", bp.state.step === 1, `step=${bp.state.step}`);
bp._setStroke(['w', 'l', 'm'], false);
bp.settleStroke();
check("' 版 第2击并击通过", bp.state.stats.done === 1 && bp.state.stats.right === 1);

// ---- 5. 真实按键入口：必须拦截默认行为（否则空格会滚动页面 / 激活按钮）----
for (const [label, key, code] of [
  ['空格', ' ', 'Space'],
  ["单引号", "'", 'Quote'],
  ['字母 a', 'a', 'KeyA'],
]) {
  const kd = fire('keydown', key, code);
  check(`keydown ${label} 未抛错`, kd.threw === null,
    kd.threw ? `${kd.threw.constructor.name}: ${kd.threw.message}` : '');
  check(`keydown ${label} 已 preventDefault`, kd.prevented === true);
  const ku = fire('keyup', key, code);
  check(`keyup ${label} 未抛错`, ku.threw === null,
    ku.threw ? `${ku.threw.constructor.name}: ${ku.threw.message}` : '');
}
// 空格并击一击完成（走真实 keydown/keyup，不再直接调 settleStroke）
bp.loadMode('space_0');
const bothIdxReal = bp.state.bank.findIndex((it) => it.answer.includes('%wS'));
forceFirst('space_0', bothIdxReal);
for (const k of ['w', 'l', 'm']) fire('keydown', k, 'Key' + k.toUpperCase());
fire('keydown', ' ', 'Space');
fire('keyup', 'w', 'KeyW');
fire('keyup', 'l', 'KeyL');
fire('keyup', 'm', 'KeyM');
fire('keyup', ' ', 'Space');   // 全部松开 → 结算
check('真实按键序列：空格并击一击通过',
  bp.state.stats.done === 1 && bp.state.stats.right === 1,
  `done=${bp.state.stats.done} right=${bp.state.stats.right}`);

// ---- 6. 六个模式题库规模 ----
for (const m of ['brief_0', 'brief_1', 'brief_2', 'space_0', 'space_1', 'space_2']) {
  bp.loadMode(m);
  check(`${m} 题库 ${bp.state.bank.length} 条`, bp.state.bank.length > 300,
    String(bp.state.bank.length));
}

console.log(`\n${failed === 0 ? '🎉 全部通过' : '❌ 存在失败'}: ${passed} 通过, ${failed} 失败`);
process.exit(failed === 0 ? 0 : 1);
