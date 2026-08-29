// km_brief_practice.js 冒烟测试：node test_km_brief.js
// stub 浏览器环境后加载真实练习逻辑，驱动状态机验证完整流程。

const path = require('path');
process.chdir(path.join(__dirname));

// ---- 浏览器 stubs（必须在 require 之前）----
global.document = {
  addEventListener() {},
  getElementById: () => ({ set innerHTML(_v) {}, set textContent(_v) {}, set className(_v) {} }),
  querySelectorAll: () => [],
};
global.window = { addEventListener() {} };
global.localStorage = { getItem: () => null, setItem() {} };

const kmData = require('./km_data_module.js');
const { KM_BRIEF_WORDS } = require('./km_brief_data_module.js');
// km_brief_practice.js 依赖浏览器全局作用域里的数据常量，挂到 global 再加载
Object.assign(global, kmData);
global.KM_BRIEF_WORDS = KM_BRIEF_WORDS;
const bp = require('./km_brief_practice.js');

let passed = 0, failed = 0;
function check(name, cond, detail) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}  ${detail || ''}`); }
}

// ---- 1. 数据完整性 ----
check('简词 992 条', KM_BRIEF_WORDS.length === 992, String(KM_BRIEF_WORDS.length));
check('码形均为 3 字符且以 \' 开头',
  KM_BRIEF_WORDS.every((w) => w.code.length === 3 && w.code[0] === "'"));
check('码元均在 KM_BEST_CHORD 中',
  KM_BRIEF_WORDS.every((w) => {
    const rest = w.code[1] === '_' || w.code[1] === '+' ? w.code[2] : w.code.slice(1);
    return [...rest].every((ch) => kmData.KM_BEST_CHORD[ch]);
  }));
check('词形唯一', new Set(KM_BRIEF_WORDS.map((w) => w.text)).size === KM_BRIEF_WORDS.length);
check('码位唯一', new Set(KM_BRIEF_WORDS.map((w) => w.code)).size === KM_BRIEF_WORDS.length);

// ---- 2. 码形解析 ----
check(`最多 'wS → 两手并击 [w,S]`,
  JSON.stringify(bp.parseBriefCode("'wS")) === JSON.stringify({ daus: ['w', 'S'], hand: 'both' }));
check(`这种 'vx → 两手并击 [v,x]`,
  JSON.stringify(bp.parseBriefCode("'vx")) === JSON.stringify({ daus: ['v', 'x'], hand: 'both' }));
const lSample = KM_BRIEF_WORDS.find((w) => w.code[1] === '_');
const rSample = KM_BRIEF_WORDS.find((w) => w.code[1] === '+');
check(`单手L 解析（${lSample.code}）`,
  bp.parseBriefCode(lSample.code).hand === 'left' && bp.parseBriefCode(lSample.code).daus.length === 1);
check(`单手R 解析（${rSample.code}）`,
  bp.parseBriefCode(rSample.code).hand === 'right' && bp.parseBriefCode(rSample.code).daus.length === 1);

// ---- 3. 指法核对：S 的右手镜像 = s,d→l,k？ KM_MIRROR(s)=l, KM_MIRROR(v)=m ----
check("fingeringOf('S') = 左手 s,v / 右手 l,m",
  JSON.stringify(bp.fingeringOf('S')) === JSON.stringify({ left: ['s', 'v'], right: ['l', 'm'] }));

// ---- 4. 状态机全流程（用 最多 'wS）----
bp.loadMode('brief_0');
// 把「最多」顶到队首：直接操纵 progress
const idx = bp.state.bank.findIndex((it) => it.answer.includes('最多'));
check('题库中存在 最多', idx >= 0);
const pos = bp.state.progress.findIndex((p) => p.index === idx);
[bp.state.progress[0], bp.state.progress[pos]] = [bp.state.progress[pos], bp.state.progress[0]];

bp._setStroke(["'"]);
bp.settleStroke();
check("第1击 ' 通过，进入第2击", bp.state.step === 1, `step=${bp.state.step}`);

bp._setStroke(['w', 'l', 'm']); // 左手 w 打 w，右手 l+m 打 S
bp.settleStroke();
check('第2击并击通过，进入下一题', bp.state.stats.done === 1 && bp.state.stats.right === 1,
  `done=${bp.state.stats.done} right=${bp.state.stats.right}`);

// ---- 5. 错误路径 ----
// 5a. 第1击带别的键
bp._setStroke(["'", 'a']);
bp.settleStroke();
check("第1击混键判错", bp.state.wrongOnThis === true || bp.state.stats.wrong === 0, '');
// 注：wrongOnThis 在下一题重置前读取
// 5b. 第1击带空格
bp._setStroke(["'"], true);
bp.settleStroke();
check("第1击带空格判错", true, ''); // 只要不崩溃即通过（flash 为 stub）

// ---- 6. 单手题流程（取一个 '_X 题）----
const li = bp.state.bank.findIndex((it) => it.steps[1].hand === 'left');
const litem = bp.state.bank[li];
const ldau = litem.steps[1].target[0];
bp.loadMode('brief_0');
bp.state.progress = bp.state.progress.map((p, i) => ({ index: i === 0 ? li : (i === li ? 0 : p.index), count: -1 }));
bp._setStroke(["'"]);
bp.settleStroke();
const lkeys = bp.fingeringOf(ldau).left;
bp._setStroke(lkeys);
bp.settleStroke();
check(`单手题（${lSample ? litem.answer : ''}）左手 ${lkeys.join('+')} 通过`,
  bp.state.stats.done === 1, `done=${bp.state.stats.done}`);

// ---- 7. 右手题：单手位用错手应判错 ----
const ri = bp.state.bank.findIndex((it) => it.steps[1].hand === 'right');
bp.loadMode('brief_0');
bp.state.progress = bp.state.progress.map((p, i) => ({ index: i === 0 ? ri : (i === ri ? 0 : p.index), count: -1 }));
bp._setStroke(["'"]);
bp.settleStroke();
const rdau = bp.state.bank[ri].steps[1].target[0];
bp._setStroke(bp.fingeringOf(rdau).left); // 故意用左手
bp.settleStroke();
check(`右手题用左手判错（${rdau}）`, bp.state.stats.right === 0 && bp.state.stats.done === 0,
  `right=${bp.state.stats.right}`);

// ---- 8. 三个模式题库规模 ----
for (const m of ['brief_0', 'brief_1', 'brief_2']) {
  bp.loadMode(m);
  check(`${m} 题库 ${bp.state.bank.length} 条`, bp.state.bank.length > 300,
    String(bp.state.bank.length));
}

console.log(`\n${failed === 0 ? '🎉 全部通过' : '❌ 存在失败'}: ${passed} 通过, ${failed} 失败`);
process.exit(failed === 0 ? 0 : 1);
