// 空明拳（yoyo-km）简词练习逻辑
// 依赖 km_data_module.js（KM_CHORDS / KM_BEST_CHORD / KM_MIRROR / KM_LEFT_ORDER）
// 与 km_brief_data_module.js（KM_BRIEF_WORDS：' 版；KM_BRIEF_SPACE：空格并击版）。
//
// 两套打法（编码不同、互不干扰，可并存）：
//   ' 版（两击）   第 1 击单独点按-松开 '，第 2 击并击码元，实际输入再接下一键顶屏
//   空格版（一击） 空格与码元同时并击即上屏：%XY 双手+空格 / %_X 左手+空格 / %+X 右手+空格
//                 （由 pure_popping 的 Pattern S 在末字符到达时提交）

const LEFT_OF = {};
for (const [left, right] of Object.entries(KM_MIRROR)) LEFT_OF[right] = left;
const IS_LEFT = new Set(KM_LEFT_ORDER);
const IS_RIGHT = new Set(Object.values(KM_MIRROR));

const KEYBOARD = [
  { left: ['q', 'w', 'e', 'r', 't'], right: ['y', 'u', 'i', 'o', 'p'] },
  { left: ['a', 's', 'd', 'f', 'g'], right: ['h', 'j', 'k', 'l', ';', "'"] },
  { left: ['z', 'x', 'c', 'v', 'b'], right: ['n', 'm', ',', '.', '/'] },
];

// ---------------------------------------------------------------- 工具

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function orderLeft(keys) {
  return keys
    .slice()
    .sort((a, b) => KM_LEFT_ORDER.indexOf(a) - KM_LEFT_ORDER.indexOf(b))
    .join('');
}

/** 解一次「击」：返回左右手各自命中的码元与手别。' 与空格由调用方单独判定。 */
function decodeStroke(keys) {
  const left = [];
  const right = [];
  for (const key of keys) {
    if (key === "'") continue;
    if (IS_LEFT.has(key)) left.push(key);
    else if (IS_RIGHT.has(key)) right.push(LEFT_OF[key]);
  }
  const leftCode = left.length ? KM_CHORDS[orderLeft(left)] || null : null;
  const rightCode = right.length ? KM_CHORDS[orderLeft(right)] || null : null;
  return {
    codes: [leftCode, rightCode].filter(Boolean),
    invalid: Boolean((left.length && !leftCode) || (right.length && !rightCode)),
    hands: `${left.length ? 'L' : ''}${right.length ? 'R' : ''}`,
  };
}

function fingeringOf(code) {
  const chord = KM_BEST_CHORD[code];
  if (!chord) return null;
  const left = chord.split('');
  return { left, right: left.map((key) => KM_MIRROR[key]) };
}

/** 解析简词码 → 码元目标与手别（' 版与 % 版同一套码元规则）。 */
function parseBriefCode(code) {
  if (code[1] === '_') return { daus: [code[2]], hand: 'left' };
  if (code[1] === '+') return { daus: [code[2]], hand: 'right' };
  return { daus: [code[1], code[2]], hand: 'both' };
}

function apostropheHint(step, total) {
  if (step.hand === 'apostrophe') {
    return `第 1 击：单独点按并松开 <kbd>'</kbd>（小指右下角那个键）`;
  }
  return `第 ${total} 击：${dauHint(step)}`;
}

function spaceHint(step) {
  const handName = { both: '两手同时并击', left: '左手一击', right: '右手一击' }[step.hand];
  return `一击完成：<kbd>Space</kbd> 与 ${dauHint(step)} 同时按下（${handName}）`;
}

function dauHint(step) {
  if (step.hand === 'both') {
    const f0 = fingeringOf(step.target[0]);
    const f1 = fingeringOf(step.target[1]);
    return `左手 <b>${esc(f0.left.join(' '))}</b> 打 <b>${esc(step.target[0])}</b>，`
      + `右手 <b>${esc(f1.right.join(' '))}</b> 打 <b>${esc(step.target[1])}</b>`;
  }
  const code = step.target[0];
  const f = fingeringOf(code);
  const keys = step.hand === 'left' ? f.left : f.right;
  return `${step.hand === 'left' ? '左手' : '右手'} <b>${esc(keys.join(' '))}</b> 打 <b>${esc(code)}</b>`;
}

// ---------------------------------------------------------------- 题库

function codeLabel(code) {
  if (code[1] === '_') return '左手一击';
  if (code[1] === '+') return '右手一击';
  return '两手并击';
}

function apostropheItem(item) {
  const { daus, hand } = parseBriefCode(item.code);
  const steps = [
    { target: ["'"], hand: 'apostrophe', space: false },
    { target: daus, hand, space: false },
  ];
  return {
    key: `${item.text}/${item.code}`,
    steps,
    prompt: `<div class="km-code-big">${esc(item.text)}</div>`,
    hint: steps.map((s, i) => apostropheHint(s, i + 1)).join('<br>'),
    answer: `${item.text}（${esc(item.code)}，${codeLabel(item.code)}）`,
  };
}

function spaceItem(item) {
  const { daus, hand } = parseBriefCode(item.code);
  const steps = [{ target: daus, hand, space: true }];
  return {
    key: `${item.text}/${item.code}`,
    steps,
    prompt: `<div class="km-code-big">${esc(item.text)}</div>`,
    hint: spaceHint(steps[0]) + '<br>（空格与码元同时按下并同时松开）',
    answer: `${item.text}（${esc(item.code)}，${codeLabel(item.code)} + 空格）`,
  };
}

function segment(list, i, n) {
  const size = Math.ceil(list.length / n);
  return list.slice(i * size, (i + 1) * size);
}

const BANKS = {
  brief_0: () => segment(KM_BRIEF_WORDS, 0, 3).map(apostropheItem),
  brief_1: () => segment(KM_BRIEF_WORDS, 1, 3).map(apostropheItem),
  brief_2: () => segment(KM_BRIEF_WORDS, 2, 3).map(apostropheItem),
  space_0: () => segment(KM_BRIEF_SPACE, 0, 3).map(spaceItem),
  space_1: () => segment(KM_BRIEF_SPACE, 1, 3).map(spaceItem),
  space_2: () => segment(KM_BRIEF_SPACE, 2, 3).map(spaceItem),
};

// ---------------------------------------------------------------- 状态（间隔重复）

const SPACED_MODES = new Set(Object.keys(BANKS));
const MASTERY_COUNT = 3;
const SPACED_INTERVALS = [2, 4, 8, 12, 20, 40, 60, 100];

const state = {
  mode: 'space_0',
  bank: [],
  progress: [],
  progressByMode: {},
  stats: { done: 0, right: 0, wrong: 0 },
  wrongOnThis: false,
  revealed: false,
  step: 0,
};

const pressed = new Set();
let strokeKeys = new Set();
let strokeSpace = false;

function loadSpacedProgress() {
  try {
    const saved = localStorage.getItem('kmBriefProgress');
    if (saved) state.progressByMode = JSON.parse(saved) || {};
  } catch (e) {
    state.progressByMode = {};
  }
}

function saveSpacedProgress() {
  try {
    localStorage.setItem('kmBriefProgress', JSON.stringify(state.progressByMode));
  } catch (e) { /* 忽略写入失败 */ }
}

function initProgressList(length) {
  return Array.from({ length }, (_, i) => ({ index: i, count: -1 }));
}

function spacedInterval(count) {
  if (count < 0) return SPACED_INTERVALS[0];
  return SPACED_INTERVALS[count] || SPACED_INTERVALS[SPACED_INTERVALS.length - 1];
}

function rearrangeProgress(correct) {
  const list = state.progress.slice();
  if (list.length === 0) return;
  const first = list.shift();
  if (correct) first.count += 1;
  else first.count = -1;
  if (!correct) {
    list.splice(0, 0, first);
  } else {
    let insertPos = spacedInterval(first.count);
    if (first.count >= MASTERY_COUNT) insertPos = list.length;
    while (insertPos < list.length && list[insertPos].count >= MASTERY_COUNT) insertPos++;
    list.splice(Math.min(insertPos, list.length), 0, first);
  }
  state.progress = list;
  state.progressByMode[state.mode] = list;
  saveSpacedProgress();
}

function countMastered() {
  return state.progress.filter((p) => p.count >= MASTERY_COUNT).length;
}

function currentItem() {
  if (!state.progress || state.progress.length === 0) return null;
  return state.bank[state.progress[0].index];
}

function currentStep() {
  const item = currentItem();
  if (!item) return null;
  return item.steps[state.step];
}

function loadMode(mode) {
  state.mode = mode;
  state.bank = BANKS[mode]();
  const saved = state.progressByMode[mode];
  if (saved && saved.length === state.bank.length) {
    state.progress = saved;
  } else {
    state.progress = initProgressList(state.bank.length);
    state.progressByMode[mode] = state.progress;
    saveSpacedProgress();
  }
  state.stats = { done: 0, right: 0, wrong: 0 };
  state.wrongOnThis = false;
  state.revealed = false;
  state.step = 0;
  render();
}

function nextItem(correct) {
  state.stats.done += 1;
  if (correct) state.stats.right += 1;
  else state.stats.wrong += 1;
  rearrangeProgress(correct);
  state.wrongOnThis = false;
  state.revealed = false;
  state.step = 0;
}

// ---------------------------------------------------------------- 判定

function settleStroke() {
  const item = currentItem();
  const step = currentStep();
  const keys = strokeKeys;
  const hadSpace = strokeSpace;
  strokeKeys = new Set();
  strokeSpace = false;
  if (!item || !step || (keys.size === 0 && !hadSpace)) return;

  // 第 1 击（' 版）：单独点按 '
  if (step.hand === 'apostrophe') {
    if (keys.size === 1 && keys.has("'") && !hadSpace) {
      state.step += 1;
      flash('\' 对了，接着并击码元', 'good');
    } else {
      state.wrongOnThis = true;
      flash('第 1 击只按一个 ' + "'" + '（不要带其他键）', 'bad');
    }
    render();
    return;
  }

  // 码元击：空格版要求同按空格，' 版要求不带空格
  if (keys.has("'")) {
    state.wrongOnThis = true;
    flash('码元并击里不能带 ' + "'" + '（' + "'" + ' 永远单独成击）', 'bad');
    render();
    return;
  }
  if (step.space !== hadSpace) {
    state.wrongOnThis = true;
    flash(step.space ? '这一击需要同时按住空格' : '这一击不需要空格', 'bad');
    render();
    return;
  }

  const result = decodeStroke([...keys]);
  if (result.invalid) {
    flash('这个组合不是合法指法', 'bad');
    state.wrongOnThis = true;
    render();
    return;
  }
  const gotHandsName = { L: 'left', R: 'right', LR: 'both' }[result.hands] || null;
  if (step.hand === 'both' && gotHandsName !== 'both') {
    flash('请两手同时并击（左右手各出一码元）', 'bad');
    state.wrongOnThis = true;
    render();
    return;
  }
  if ((step.hand === 'left' || step.hand === 'right') && gotHandsName !== step.hand) {
    flash(`请用${step.hand === 'left' ? '左手' : '右手'}一击`, 'bad');
    state.wrongOnThis = true;
    render();
    return;
  }
  const want = step.target.slice().sort().join('');
  const got = result.codes.slice().sort().join('');
  if (got !== want) {
    state.wrongOnThis = true;
    flash(`打出的是 ${result.codes.join(' ')}`, 'bad');
    render();
    return;
  }

  const lastStep = state.step === item.steps.length - 1;
  if (lastStep) {
    flash(step.space ? '对了！空格并击一击上屏' : '对了！实际输入中再接任意下一键即上屏', 'good');
    nextItem(!state.wrongOnThis && !state.revealed);
  } else {
    state.step += 1;
    state.wrongOnThis = false;
    state.revealed = false;
    flash(`第 ${state.step} 击对了，继续第 ${state.step + 1} 击`, 'good');
  }
  render();
}

// ---------------------------------------------------------------- 渲染

function flash(text, kind) {
  const el = document.getElementById('km-feedback');
  el.textContent = text;
  el.className = `km-feedback ${kind}`;
  clearTimeout(flash.timer);
  flash.timer = setTimeout(() => {
    el.textContent = '';
    el.className = 'km-feedback';
  }, 1400);
}

function renderKeyboard(highlight, wantSpace) {
  const rows = KEYBOARD.map((row) => {
    const cell = (key, side) => {
      const on = highlight[side].includes(key);
      const down = pressed.has(key);
      return `<span class="km-key${on ? ' on' : ''}${down ? ' down' : ''}">${key}</span>`;
    };
    return `<div class="km-kb-row">
        <span class="km-hand">${row.left.map((k) => cell(k, 'left')).join('')}</span>
        <span class="km-gap"></span>
        <span class="km-hand">${row.right.map((k) => cell(k, 'right')).join('')}</span>
      </div>`;
  });
  const bar = `<div class="km-kb-row"><span class="km-space${wantSpace ? ' on' : ''}">空格</span></div>`;
  return rows.join('') + bar;
}

function render() {
  const item = currentItem();
  const step = currentStep();
  if (!item) return;

  document.getElementById('km-prompt').innerHTML = item.prompt;

  const showAnswer = state.revealed || state.wrongOnThis;
  document.getElementById('km-hint').innerHTML = showAnswer ? (item.hint || '') : '';
  document.getElementById('km-answer').innerHTML = showAnswer
    ? `本题答案 <b>${esc(item.answer)}</b>　共 ${item.steps.length} 击，当前第 ${state.step + 1} 击`
    : '';

  const highlight = { left: [], right: [] };
  if (showAnswer && step) {
    if (step.hand === 'apostrophe') {
      highlight.right.push("'");
    } else {
      for (const code of step.target) {
        const f = fingeringOf(code);
        if (!f) continue;
        if (step.hand === 'left') highlight.left.push(...f.left);
        else if (step.hand === 'right') highlight.right.push(...f.right);
        else {
          highlight.left.push(...f.left);
          highlight.right.push(...f.right);
        }
      }
    }
  }
  const wantSpace = Boolean(showAnswer && step && step.space);
  document.getElementById('km-keyboard').innerHTML = renderKeyboard(highlight, wantSpace);

  const { done, right, wrong } = state.stats;
  const mastered = countMastered();
  const total = state.progress.length;
  document.getElementById('km-stats').textContent =
    `已掌握 ${mastered} / ${total}　·　本轮 已练 ${done}　一遍过 ${right}　出错 ${wrong}`
    + (done ? `　正确率 ${Math.round((right / done) * 100)}%` : '');
}

// ---------------------------------------------------------------- 输入捕获

function isTracked(key) {
  return key === ' ' || key === "'" || IS_LEFT.has(key) || IS_RIGHT.has(key);
}

document.addEventListener('keydown', (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  // 注意：这里必须是 let——早期版本用 const 又在空格分支里重新赋值，
  // 导致按空格时抛 TypeError，preventDefault 没跑到，浏览器就会滚动页面。
  let key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (event.code === 'Space') key = ' ';
  if (key === 'Enter') {
    state.revealed = true;
    render();
    return;
  }
  if (key === 'Tab') {
    event.preventDefault();
    nextItem(false);
    render();
    return;
  }
  if (!isTracked(key)) return;
  event.preventDefault();
  if (event.repeat) return;
  pressed.add(key);
  if (key === ' ') strokeSpace = true;
  else strokeKeys.add(key);
  render();
});

document.addEventListener('keyup', (event) => {
  let key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (event.code === 'Space') key = ' ';
  if (!isTracked(key)) return;
  event.preventDefault();
  pressed.delete(key);
  if (pressed.size === 0) settleStroke();
  else render();
});

window.addEventListener('blur', () => {
  pressed.clear();
  strokeKeys = new Set();
  strokeSpace = false;
  render();
});

document.addEventListener('DOMContentLoaded', () => {
  loadSpacedProgress();
  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-mode]').forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
      loadMode(button.dataset.mode);
      // 点完按钮立刻失焦，否则空格/回车会被浏览器当成「再点一次这个按钮」
      if (button.blur) button.blur();
    });
  });
  const resetBtn = document.getElementById('km-reset-progress');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.progressByMode = {};
      saveSpacedProgress();
      loadMode(state.mode);
      flash('间隔重复进度已重置', 'good');
    });
  }
  loadMode('space_0');
});

// Node 测试用导出（浏览器中无效）
if (typeof module !== 'undefined') {
  module.exports = {
    state, pressed, BANKS,
    parseBriefCode, decodeStroke, fingeringOf, apostropheItem, spaceItem, loadMode,
    settleStroke,
    _setStroke: (keys, space = false) => { strokeKeys = new Set(keys); strokeSpace = space; },
  };
}
