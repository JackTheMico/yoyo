// 空明拳（yoyo-km）纯形并击练习逻辑
// 依赖 km_data_module.js 提供的 KM_CHORDS / KM_BEST_CHORD / KM_MIRROR / KM_LEFT_ORDER，
// zigen_data_module.js 提供的 ZIGEN_DATA / ZIGEN_GROUPS，
// 以及 km_char_word_data_module.js 提供的 KM_CHARS / KM_WORDS（常用单字 / 常用词组）。
//
// 空明拳是并击输入法：一次「击」（同时按下的键）打出一个码元（单字符）。本页在浏览器
// 里复刻一次「击」的判定——同时按下的键归一化后查空明拳表，全部松开才结算，所以按键
// 先后顺序无关。左右手经镜像规则输出同一批码元。

const LEFT_OF = {};
for (const [left, right] of Object.entries(KM_MIRROR)) LEFT_OF[right] = left;
const IS_LEFT = new Set(KM_LEFT_ORDER);
const IS_RIGHT = new Set(Object.values(KM_MIRROR));
const DIGITS = new Set('0123456789'.split(''));

// 键盘图示的物理排布。空明拳打字母+符号码元不使用数字行，故只画三行（标准 QWERTY 镜像）。
const KEYBOARD = [
  { left: ['q', 'w', 'e', 'r', 't'], right: ['y', 'u', 'i', 'o', 'p'] },
  { left: ['a', 's', 'd', 'f', 'g'], right: ['h', 'j', 'k', 'l', ';'] },
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

/** 把一次「击」（同时按下的键）解成码元。返回 0/1 个码元（空明拳一击只出一个码元）。 */
function decodeStroke(keys, withSpace = false) {
  const left = [];
  const right = [];
  for (const key of keys) {
    if (IS_LEFT.has(key)) left.push(key);
    else if (IS_RIGHT.has(key)) right.push(LEFT_OF[key]);
  }
  const leftCode = left.length ? KM_CHORDS[orderLeft(left)] || null : null;
  const rightCode = right.length ? KM_CHORDS[orderLeft(right)] || null : null;
  return {
    codes: [leftCode, rightCode].filter(Boolean),
    // 按了键但查不到码元，说明这个组合不是合法指法
    invalid: Boolean((left.length && !leftCode) || (right.length && !rightCode)),
    // 左右手使用情况
    hands: `${left.length ? 'L' : ''}${right.length ? 'R' : ''}`,
    withSpace,
  };
}

/** 某个码元该怎么按：返回左手键与对应的右手键。 */
function fingeringOf(code) {
  const chord = KM_BEST_CHORD[code];
  if (!chord) return null;
  const left = chord.split('');
  return { left, right: left.map((key) => KM_MIRROR[key]) };
}

/** 字根显示：多数字根有 png，PUA 字根靠 ChaiPUA 字体兜底。 */
function zigenGlyph(root) {
  const hex = root.codePointAt(0).toString(16);
  const isPua = root.length === 1 && root.codePointAt(0) >= 0xe000 && root.codePointAt(0) <= 0xf8ff;
  if (root.length === 1) {
    const cls = isPua ? 'km-glyph-text km-pua' : 'km-glyph-text';
    return `<img class="km-glyph-img" src="../zigen_table/char_images/${hex}.png" alt="${isPua ? '' : root}"
             onerror="this.outerHTML=this.dataset.fb" data-fb='<span class="${cls}">${esc(root)}</span>'>`;
  }
  return `<span class="km-glyph-text">${esc(root)}</span>`;
}

/** 单字 / 词组的步骤提示文案（含空明拳具体指法）。 */
function stepHint(step, allSteps) {
  const spaceText = step.space ? ' + <kbd>Space</kbd>' : '';
  if (step.hand === 'both' && step.target.length === 2) {
    const f0 = fingeringOf(step.target[0]);
    const f1 = fingeringOf(step.target[1]);
    const leftKeys = f0 ? f0.left.join(' ') : '?';
    const rightKeys = f1 ? f1.right.join(' ') : '?';
    return `两手同时并击${spaceText}：左手 <b>${esc(leftKeys)}</b> 打 <b>${esc(step.target[0])}</b>，`
      + `右手 <b>${esc(rightKeys)}</b> 打 <b>${esc(step.target[1])}</b>`;
  }
  if (step.hand === 'left' || step.hand === 'right') {
    const code = step.target[0];
    const f = fingeringOf(code);
    if (!f) return `${step.hand === 'left' ? '左手' : '右手'}并击${spaceText}，打出 <b>${esc(code)}</b>`;
    const handName = step.hand === 'left' ? '左手' : '右手';
    const keys = step.hand === 'left' ? f.left : f.right;
    return `${handName}并击${spaceText}：<b>${esc(keys.join(' '))}</b> 打 <b>${esc(code)}</b>`;
  }
  // either / 其他：左右手都显示
  const code = step.target[0];
  const f = fingeringOf(code);
  if (!f) return `单手并击${spaceText}，打出 <b>${esc(code)}</b>`;
  return `单手并击${spaceText}：左手 <b>${esc(f.left.join(' '))}</b> / 右手 <b>${esc(f.right.join(' '))}</b> 打 <b>${esc(code)}</b>`;
}

// ---------------------------------------------------------------- 题库

function zigenItem(root) {
  const info = ZIGEN_DATA[root];
  const code = info.code;
  const name = (info.name || '').replace(/，示例.+$/, '');
  return {
    key: root,
    target: [code[0], code[1]],
    prompt: `<div class="km-glyph">${zigenGlyph(root)}</div>`,
    hint: `编码 <b>${esc(code)}</b>：左手 <b>${fingeringOf(code[0]).left.join(' ')}</b> 打 <b>${esc(code[0])}</b>，右手 <b>${fingeringOf(code[1]).right.join(' ')}</b> 打 <b>${esc(code[1])}</b>（两手同时并击）`
      + (name ? `<br>${esc(name)}` : ''),
    answer: code,
  };
}

/** 根据当前体系（北冥/无相）计算某一步是否需要按空格。
 *
 * 北冥空明（主单）：单字第一击（双手前两码）无空格，第三击（单手）带空格；
 *                  词的所有并击都带空格；一简字词单手无空格。
 * 无相空明（主词）：单字所有并击都带空格；词的所有并击都不带空格；
 *                  一简字词单手带空格。
 */
function resolveStepSpace(type, stepIndex, steps) {
  // 一简字词：只有一步且为单手（left/right）
  const isJian = steps.length === 1 && (steps[0].hand === 'left' || steps[0].hand === 'right');
  if (isJian) {
    return state.system === 'wx'; // 北冥一简无空格，无相一简带空格
  }
  if (state.system === 'wx') {
    // 无相空明：主词
    return type === 'char'; // 单字全部带空格，词全部不带空格
  }
  // 北冥空明：主单
  if (type === 'char') {
    return stepIndex > 0; // 单字第一击无空格，后续（第三码）带空格
  }
  return true; // 词全部带空格
}

/** 把常用单字 / 词组 / 一简字词数据包装成练习条目。 */
function charWordItem(item, type) {
  const promptText = item.text || item.char;
  const code = item.code;
  const steps = item.steps.map((s, i) => ({
    target: s.target,
    space: resolveStepSpace(type, i, item.steps),
    hand: s.hand,
  }));
  return {
    key: `${promptText}/${code}`,
    steps,
    prompt: `<div class="km-code-big">${esc(promptText)}</div>`,
    hint: steps.map((s, i) => `第 ${i + 1} 击：${stepHint(s, steps)}`).join('<br>'),
    answer: `${promptText}（${code}）`,
  };
}

const BANKS = {
  // 指法练习：60 个码元按「单键 → 双键小写 → 大写 → 符号」渐进，逐个过关
  finger: () => {
    function kind(code) {
      const c = code.charCodeAt(0);
      if (c >= 97 && c <= 122) return KM_BEST_CHORD[code].length === 1 ? 0 : 1; // 小写单键 / 双键
      if (c >= 65 && c <= 90) return 2; // 大写
      return 3; // 符号
    }
    return Object.keys(KM_BEST_CHORD)
      .sort((a, b) => kind(a) - kind(b) || a.localeCompare(b))
      .map((code) => {
        const f = fingeringOf(code);
        return {
          key: code,
          target: [code],
          prompt: `<div class="km-code-big">${esc(code)}</div>`,
          hint: `码元 <b>${esc(code)}</b> → 左手 <b>${f.left.join(' ')}</b> / 右手 <b>${f.right.join(' ')}</b>`,
          answer: code,
        };
      });
  },

  // 基础练习：277 个主字根，练「看到字根能打出它的码元」
  base: () => Object.keys(ZIGEN_GROUPS).map(zigenItem),

  // 进阶练习：全部 535 个字根
  advanced: () => Object.keys(ZIGEN_DATA).map(zigenItem),

  // 常用单字：按词频分三段（前 500 / 中 500 / 后 500），练全码
  // （前两码一手一码并击，第三码单手加空格）
  chars_0: () => KM_CHARS[0].map((item) => charWordItem(item, 'char')),
  chars_1: () => KM_CHARS[1].map((item) => charWordItem(item, 'char')),
  chars_2: () => KM_CHARS[2].map((item) => charWordItem(item, 'char')),

  // 常用词组：按词频分三段（前 500 / 中 500 / 后 500）
  words_0: () => KM_WORDS[0].map((item) => charWordItem(item, 'word')),
  words_1: () => KM_WORDS[1].map((item) => charWordItem(item, 'word')),
  words_2: () => KM_WORDS[2].map((item) => charWordItem(item, 'word')),

  // 一简字词：一击上屏的简码字词（240 个）
  jian: () => KM_JIAN.map((item) => charWordItem(item, item.is_char ? 'char' : 'word')),
};

// ---------------------------------------------------------------- 状态

// 间隔重复：除「指法练习」外，其余模式都采用间隔重复。
const SPACED_MODES = new Set(['base', 'advanced', 'chars_0', 'chars_1', 'chars_2', 'words_0', 'words_1', 'words_2', 'jian']);
const MASTERY_COUNT = 3;        // 连续答对 3 次视为「已掌握」
const SPACED_INTERVALS = [2, 4, 8, 12, 20, 40, 60, 100]; // count → 后移位置

const state = {
  mode: 'finger',
  system: 'bm',  // 指法体系：'bm' = 北冥空明（主单），'wx' = 无相空明（主词）
  // 指法练习用顺序队列 + 游标
  queue: [],
  index: 0,
  // 间隔重复模式：bank 是题目全集，progress 是 [{index, count}, ...]，队首为当前题
  bank: [],
  progress: [],
  progressByMode: {},
  stats: { done: 0, right: 0, wrong: 0 },
  wrongOnThis: false,
  revealed: false,
  // 多击（常用单字 / 词组）状态
  step: 0,
  typed: [],
};

const pressed = new Set();
let strokeKeys = new Set();
let strokeSpace = false;

function isSpacedMode(mode) {
  return SPACED_MODES.has(mode || state.mode);
}

function loadSpacedProgress() {
  try {
    const saved = localStorage.getItem('kmPracticeProgress');
    if (saved) state.progressByMode = JSON.parse(saved) || {};
  } catch (e) {
    state.progressByMode = {};
  }
}

function saveSpacedProgress() {
  try {
    localStorage.setItem('kmPracticeProgress', JSON.stringify(state.progressByMode));
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
  
  // 如果队首是已掌握的题目，且还有未掌握的题目，将未掌握的题目移到队首
  if (list[0].count >= MASTERY_COUNT) {
    const unmasteredIdx = list.findIndex(p => p.count < MASTERY_COUNT);
    if (unmasteredIdx >= 0) {
      const item = list.splice(unmasteredIdx, 1)[0];
      list.unshift(item);
    }
  }
  
  const first = list.shift();
  if (correct) first.count += 1;
  else first.count = -1;
  
  // 答错的题目插入到最前面，立即复习
  if (!correct) {
    list.splice(0, 0, first);
  } else {
    let insertPos = spacedInterval(first.count);
    // 跳过已掌握的题目
    while (insertPos < list.length && list[insertPos].count >= MASTERY_COUNT) {
      insertPos++;
    }
    list.splice(Math.min(insertPos, list.length), 0, first);
  }
  
  state.progress = list;
  state.progressByMode[state.mode] = list;
  saveSpacedProgress();
}

function countMastered() {
  return state.progress.filter((p) => p.count >= MASTERY_COUNT).length;
}

function resetSpacedProgress(mode) {
  if (mode) {
    delete state.progressByMode[mode];
  } else {
    state.progressByMode = {};
  }
  saveSpacedProgress();
}

function currentItem() {
  if (isSpacedMode()) {
    if (!state.progress || state.progress.length === 0) return null;
    return state.bank[state.progress[0].index];
  }
  return state.queue[state.index];
}

function currentStep() {
  const item = currentItem();
  if (!item) return null;
  if (item.steps) return item.steps[state.step];
  // 单码元（指法练习）左右手都行；双码元（字根）必须两手并击
  const hand = item.target && item.target.length === 1 ? 'either' : 'both';
  return { target: item.target, space: false, hand };
}

function loadMode(mode) {
  state.mode = mode;
  const bank = BANKS[mode]();
  if (isSpacedMode(mode)) {
    state.bank = bank;
    const saved = state.progressByMode[mode];
    if (saved && saved.length === bank.length) {
      state.progress = saved;
    } else {
      state.progress = initProgressList(bank.length);
      state.progressByMode[mode] = state.progress;
      saveSpacedProgress();
    }
  } else {
    state.queue = bank;
    state.index = 0;
  }
  state.stats = { done: 0, right: 0, wrong: 0 };
  state.wrongOnThis = false;
  state.revealed = false;
  state.step = 0;
  state.typed = [];
  render();
}

function nextItem(correct) {
  state.stats.done += 1;
  if (correct) state.stats.right += 1;
  else state.stats.wrong += 1;
  if (isSpacedMode()) {
    rearrangeProgress(correct);
  } else {
    state.index = (state.index + 1) % state.queue.length;
  }
  state.wrongOnThis = false;
  state.revealed = false;
  state.step = 0;
  state.typed = [];
}

// ---------------------------------------------------------------- 判定

function settleStroke() {
  const item = currentItem();
  const step = currentStep();
  if (!item || !step || strokeKeys.size === 0) {
    strokeKeys = new Set();
    strokeSpace = false;
    return;
  }

  const result = decodeStroke([...strokeKeys], strokeSpace);
  strokeKeys = new Set();
  strokeSpace = false;

  if (result.invalid) {
    flash('这个组合不是合法指法', 'bad');
    state.wrongOnThis = true;
    render();
    return;
  }

  // 是否要求按空格
  if (step.space !== result.withSpace) {
    flash(step.space ? '这一击需要同时按住空格' : '这一击不需要按空格', 'bad');
    state.wrongOnThis = true;
    render();
    return;
  }

  // 检查左右手使用是否与要求一致
  const wantHands = step.hand;
  const gotHandsName = { L: 'left', R: 'right', LR: 'both' }[result.hands] || null;
  if (wantHands === 'both' && gotHandsName !== 'both') {
    flash('请两手同时并击（左右手各出一码元）', 'bad');
    state.wrongOnThis = true;
    render();
    return;
  }
  if ((wantHands === 'left' || wantHands === 'right') && gotHandsName !== wantHands) {
    flash(`请用${wantHands === 'left' ? '左手' : '右手'}并击`, 'bad');
    state.wrongOnThis = true;
    render();
    return;
  }
  if (wantHands === 'either' && !gotHandsName) {
    flash('这个组合不是合法指法', 'bad');
    state.wrongOnThis = true;
    render();
    return;
  }

  // 双码元：两手并击，左右手各出一个码元
  if (step.target.length === 2) {
    if (result.codes.length !== 2) {
      flash(`两手同时并击应打出两个码元，现在只有 ${result.codes.length} 个`, 'bad');
      state.wrongOnThis = true;
      render();
      return;
    }
    const got = result.codes.slice().sort().join('');
    const want = step.target.slice().sort().join('');
    if (got !== want) {
      state.wrongOnThis = true;
      flash(`打出的是 ${result.codes.join('')}`, 'bad');
      render();
      return;
    }
  } else {
    // 单码元：一击一个码元
    if (result.codes.length !== 1) {
      flash('请一次只打一个码元', 'bad');
      state.wrongOnThis = true;
      render();
      return;
    }
    if (result.codes[0] !== step.target[0]) {
      state.wrongOnThis = true;
      flash(`打出的是 ${result.codes[0]}`, 'bad');
      render();
      return;
    }
  }

  // 这一击对了
  state.typed.push(...result.codes);
  const lastStep = !item.steps || state.step === item.steps.length - 1;
  if (lastStep) {
    flash('对了', 'good');
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
  }, 1200);
}

function renderKeyboard(highlight) {
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
  return rows.join('');
}

function render() {
  const item = currentItem();
  const step = currentStep();
  if (!item) return;

  document.getElementById('km-prompt').innerHTML = item.prompt;

  const showAnswer = state.revealed || state.wrongOnThis;
  const hasSteps = Boolean(item.steps);
  const dual = step ? step.target.length === 2 : item.target.length === 2;

  document.getElementById('km-hint').innerHTML = showAnswer ? (item.hint || '') : '';
  document.getElementById('km-answer').innerHTML = showAnswer
    ? `本题答案 <b>${esc(item.answer || (item.steps ? item.steps.map((s) => s.target.join('')).join('') : item.target.join('')))}</b>`
      + (hasSteps ? `　当前第 ${state.step + 1} 击：<b>${esc(step ? step.target.join('') : '')}</b>` : '')
      + ((!hasSteps && dual) ? `　两手同时并击：左手 <b>${esc(item.target[0])}</b>、右手 <b>${esc(item.target[1])}</b>` : '')
    : '';

  // 只有在求提示或答错后才点亮键位，否则等于替用户记住了指法
  // 空明拳规则：双手并击双码元时，左手打第一个码元、右手打第二个码元；
  // 单码元按 step.hand 决定亮哪只手（either 则左右都亮）。
  const highlight = { left: [], right: [] };
  if (showAnswer && step) {
    const hand = step.hand;
    if (hand === 'both' && step.target.length === 2) {
      const f0 = fingeringOf(step.target[0]);
      const f1 = fingeringOf(step.target[1]);
      if (f0) highlight.left.push(...f0.left);
      if (f1) highlight.right.push(...f1.right);
    } else {
      // 单码元（或兼容的双码元 either）：按手别点亮
      for (const code of step.target) {
        const f = fingeringOf(code);
        if (!f) continue;
        if (hand === 'left') highlight.left.push(...f.left);
        else if (hand === 'right') highlight.right.push(...f.right);
        else {
          // either 或 both 的单码元：左右手都显示
          highlight.left.push(...f.left);
          highlight.right.push(...f.right);
        }
      }
    }
  }
  document.getElementById('km-keyboard').innerHTML = renderKeyboard(highlight);

  const { done, right, wrong } = state.stats;
  if (isSpacedMode()) {
    const mastered = countMastered();
    const total = state.progress.length;
    document.getElementById('km-stats').textContent =
      `已掌握 ${mastered} / ${total}　·　本轮 已练 ${done}　一遍过 ${right}　出错 ${wrong}`
      + (done ? `　正确率 ${Math.round((right / done) * 100)}%` : '');
  } else {
    document.getElementById('km-stats').textContent =
      `第 ${state.index + 1} / ${state.queue.length} 题　已练 ${done}　一遍过 ${right}　出错 ${wrong}`
      + (done ? `　正确率 ${Math.round((right / done) * 100)}%` : '');
  }
}

// ---------------------------------------------------------------- 输入捕获

function isTracked(key) {
  return key === ' ' || ((IS_LEFT.has(key) || IS_RIGHT.has(key)) && !DIGITS.has(key));
}

document.addEventListener('keydown', (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
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
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (!isTracked(key)) return;
  event.preventDefault();
  pressed.delete(key);
  // 全部松开才算一击结束，这样同时按下的顺序就不影响结果
  if (pressed.size === 0) settleStroke();
  else render();
});

// 失焦时清空，避免残留按键把下一击算错
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
    });
  });
  document.querySelectorAll('[data-system]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-system]').forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
      state.system = button.dataset.system;
      // 切换体系后，常用单字/词组的空格规则会变，需要重新加载当前模式
      loadMode(state.mode);
      flash(state.system === 'bm' ? '已切换：北冥空明（主单）' : '已切换：无相空明（主词）', 'good');
    });
  });
  const resetBtn = document.getElementById('km-reset-progress');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetSpacedProgress();
      loadMode(state.mode);
      flash('间隔重复进度已重置', 'good');
    });
  }
  loadMode('finger');
});
