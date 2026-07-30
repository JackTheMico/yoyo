// 音形（yoyo-yx）并击练习逻辑
// 依赖 yx_data_module.js 提供的 YX_CHORDS / YX_BEST_CHORD / YX_MIRROR / YX_LEFT_ORDER /
// YX_SHENGMU / YX_YUNMU / YX_ZIGEN / YX_CHARS / YX_JIAN。
//
// 和纯形练习工具最大的不同：这里练的是**并击**，不是逐字母敲。所以要在浏览器里
// 复刻一次「击」的判定——同时按下的键归一化后查折梅表，全部松开才结算。

const LEFT_OF = {};
for (const [left, right] of Object.entries(YX_MIRROR)) LEFT_OF[right] = left;
const IS_LEFT = new Set(YX_LEFT_ORDER);
const IS_RIGHT = new Set(Object.values(YX_MIRROR));

// 键盘图示的物理排布。右手每行是左手同行的镜像，按实际从左到右的顺序列出。
const KEYBOARD = [
  { left: ['1', '2', '3', '4', '5'], right: ['8', '9', '0', '-', '='] },
  { left: ['q', 'w', 'e', 'r', 't'], right: ['u', 'i', 'o', 'p', '['] },
  { left: ['a', 's', 'd', 'f', 'g'], right: ['h', 'j', 'k', 'l', ';'] },
  { left: ['z', 'x', 'c', 'v', 'b'], right: ['y', 'n', 'm', ',', '.'] },
];

const CHANNEL_NAME = {
  A: '双手并击，不带空格',
  a: '双手并击 + 空格',
  B: '左手单手并击，不带空格',
  b: '左手单手并击 + 空格',
  C: '右手单手并击，不带空格',
  c: '右手单手并击 + 空格',
};

// ---------------------------------------------------------------- 并击解码

function orderLeft(keys) {
  return keys
    .slice()
    .sort((a, b) => YX_LEFT_ORDER.indexOf(a) - YX_LEFT_ORDER.indexOf(b))
    .join('');
}

/** 把一次「击」（同时按下的键 + 是否带空格）解成码元和通道。 */
function decodeStroke(keys, withSpace) {
  const left = [];
  const right = [];
  for (const key of keys) {
    if (IS_LEFT.has(key)) left.push(key);
    else if (IS_RIGHT.has(key)) right.push(LEFT_OF[key]);
  }
  const leftCode = left.length ? YX_CHORDS[orderLeft(left)] || null : null;
  const rightCode = right.length ? YX_CHORDS[orderLeft(right)] || null : null;
  const hands = (left.length ? 'L' : '') + (right.length ? 'R' : '');
  const channel = { LR: withSpace ? 'a' : 'A', L: withSpace ? 'b' : 'B', R: withSpace ? 'c' : 'C' }[hands];
  return {
    codes: [leftCode, rightCode].filter(Boolean),
    channel: channel || null,
    // 按了键但查不到码元，说明这个组合不是合法指法
    invalid: Boolean((left.length && !leftCode) || (right.length && !rightCode)),
  };
}

/** 某个码元该怎么按：返回左手键与对应的右手键。 */
function fingeringOf(code) {
  const chord = YX_BEST_CHORD[code];
  if (!chord) return null;
  const left = chord.split('');
  return { left, right: left.map((key) => YX_MIRROR[key]) };
}

// ---------------------------------------------------------------- 题库

/** 字根显示：多数字根有 png，PUA 字根靠 ChaiPUA 字体兜底。 */
function zigenGlyph(root) {
  const hex = root.codePointAt(0).toString(16);
  const isPua = root.length === 1 && root.codePointAt(0) >= 0xe000 && root.codePointAt(0) <= 0xf8ff;
  if (root.length === 1) {
    return `<img class="yx-glyph-img" src="../zigen_table/char_images/${hex}.png" alt="${isPua ? '' : root}"
             onerror="this.replaceWith(Object.assign(document.createElement('span'),
                      {className:'yx-glyph-text${isPua ? ' yx-pua' : ''}',textContent:${JSON.stringify(root)}}))">`;
  }
  return `<span class="yx-glyph-text">${root}</span>`;
}

const BANKS = {
  // 180 个码元，练的是「看到码元能按出来」，即声母键 + 韵母指法的肌肉记忆
  yuanma: () =>
    Object.keys(YX_BEST_CHORD)
      .sort()
      .map((code) => ({
        key: code,
        target: [code],
        prompt: `<div class="yx-code-big">${code}</div>`,
        hint: `声母键 <b>${code[0]}</b> → ${(YX_SHENGMU[code[0]] || []).join(' / ')}　·　`
          + `韵母指法 <b>${code[1]}</b> → ${(YX_YUNMU[code[1]] || []).join(' / ')}`,
        anyHand: true,
      })),

  // 466 个字根，练的是「看到字根能打出它的码元」
  zigen: () =>
    Object.entries(YX_ZIGEN).map(([root, info]) => ({
      key: root,
      target: [info.code],
      prompt: `<div class="yx-glyph">${zigenGlyph(root)}</div>`,
      hint: info.examples ? `示例：${info.examples}` : (info.stroke ? `笔画「${info.stroke}」` : ''),
      anyHand: true,
      answer: info.code,
    })),

  // 一简：一击直出，通道（哪只手、带不带空格）也必须对
  jian: () =>
    YX_JIAN.map((item) => ({
      key: `${item.text}/${item.channel}`,
      target: [item.code],
      channel: item.channel,
      prompt: `<div class="yx-word">${item.text}</div>`,
      hint: `一击直出，无需空格确认　·　通道 <b>${item.channel}</b>：${CHANNEL_NAME[item.channel]}`,
      answer: item.code,
    })),

  // 单字：走真实路径 —— 双手带空格出前两码，需要时再单手带空格补第三码
  char: () =>
    YX_CHARS.filter((c) => c.level >= 2).map((c) => ({
      key: c.char,
      steps:
        c.level >= 3
          ? [
              { target: [c.code.slice(0, 2), c.code.slice(2, 4)], channel: 'a' },
              { target: [c.code.slice(4, 6)], channel: 'bc' },
            ]
          : [{ target: [c.code.slice(0, 2), c.code.slice(2, 4)], channel: 'a' }],
      prompt: `<div class="yx-word">${c.char}</div>`,
      hint: `音节 <b>${c.syllable}</b>　·　首字根 ${c.first || '—'}　·　末字根 ${c.last || '—'}`
        + (c.level <= 2 ? '　·　<span class="yx-badge">两码即唯一，一击搞定</span>' : ''),
      answer: c.code,
    })),
};

// ---------------------------------------------------------------- 状态

const state = {
  mode: 'yuanma',
  queue: [],
  index: 0,
  step: 0,
  typed: [],
  stats: { done: 0, right: 0, wrong: 0 },
  wrongOnThis: false,
  revealed: false,
};

const pressed = new Set();
let strokeKeys = new Set();
let strokeSpace = false;

function shuffle(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function currentItem() {
  return state.queue[state.index];
}

function currentStep() {
  const item = currentItem();
  if (!item) return null;
  return item.steps ? item.steps[state.step] : { target: item.target, channel: item.channel };
}

function loadMode(mode, { random = true } = {}) {
  state.mode = mode;
  const bank = BANKS[mode]();
  state.queue = random ? shuffle(bank) : bank;
  state.index = 0;
  state.step = 0;
  state.typed = [];
  state.stats = { done: 0, right: 0, wrong: 0 };
  state.wrongOnThis = false;
  state.revealed = false;
  render();
}

function nextItem(correct) {
  state.stats.done += 1;
  if (correct) state.stats.right += 1;
  else state.stats.wrong += 1;
  state.index = (state.index + 1) % state.queue.length;
  state.step = 0;
  state.typed = [];
  state.wrongOnThis = false;
  state.revealed = false;
}

// ---------------------------------------------------------------- 判定

function channelAllowed(want, got) {
  if (!want) return true;
  if (want === 'bc') return got === 'b' || got === 'c';
  return want === got;
}

function settleStroke() {
  const item = currentItem();
  const step = currentStep();
  if (!item || !step || strokeKeys.size === 0) return;

  const result = decodeStroke([...strokeKeys], strokeSpace);
  strokeKeys = new Set();
  strokeSpace = false;

  if (result.invalid || result.codes.length === 0) {
    flash('这个组合不是合法指法', 'bad');
    state.wrongOnThis = true;
    render();
    return;
  }

  const codesOk = result.codes.join('') === step.target.join('');
  const channelOk = channelAllowed(step.channel, result.channel);

  if (codesOk && channelOk) {
    state.typed.push(...result.codes);
    const lastStep = !item.steps || state.step === item.steps.length - 1;
    if (lastStep) {
      flash('对了', 'good');
      nextItem(!state.wrongOnThis && !state.revealed);
    } else {
      state.step += 1;
    }
  } else {
    state.wrongOnThis = true;
    if (!codesOk) flash(`打出的是 ${result.codes.join('')}`, 'bad');
    else flash(`码元对了，但通道应该是 ${step.channel === 'bc' ? 'b 或 c' : step.channel}`, 'bad');
  }
  render();
}

// ---------------------------------------------------------------- 渲染

function flash(text, kind) {
  const el = document.getElementById('yx-feedback');
  el.textContent = text;
  el.className = `yx-feedback ${kind}`;
  clearTimeout(flash.timer);
  flash.timer = setTimeout(() => {
    el.textContent = '';
    el.className = 'yx-feedback';
  }, 1200);
}

function renderKeyboard(highlight) {
  const rows = KEYBOARD.map((row) => {
    const cell = (key, side) => {
      const on = highlight[side].includes(key);
      const down = pressed.has(key);
      return `<span class="yx-key${on ? ' on' : ''}${down ? ' down' : ''}">${key}</span>`;
    };
    return `<div class="yx-kb-row">
        <span class="yx-hand">${row.left.map((k) => cell(k, 'left')).join('')}</span>
        <span class="yx-gap"></span>
        <span class="yx-hand">${row.right.map((k) => cell(k, 'right')).join('')}</span>
      </div>`;
  });
  return rows.join('');
}

function render() {
  const item = currentItem();
  const step = currentStep();
  if (!item) return;

  document.getElementById('yx-prompt').innerHTML = item.prompt;
  document.getElementById('yx-hint').innerHTML = item.hint || '';

  const need = step ? step.target.join('') : '';
  document.getElementById('yx-progress-code').innerHTML = state.typed.length
    ? `已打出 <b>${state.typed.join('')}</b>`
    : '';

  const showAnswer = state.revealed || state.wrongOnThis;
  document.getElementById('yx-answer').innerHTML = showAnswer
    ? `本题答案 <b>${item.answer || need}</b>${item.steps ? `　当前第 ${state.step + 1} 击：<b>${need}</b>` : ''}`
    : '';

  // 只有在求提示或答错后才点亮键位，否则等于替用户记住了指法
  const highlight = { left: [], right: [] };
  if (showAnswer && step) {
    for (const code of step.target) {
      const fingering = fingeringOf(code);
      if (!fingering) continue;
      highlight.left.push(...fingering.left);
      highlight.right.push(...fingering.right);
    }
  }
  document.getElementById('yx-keyboard').innerHTML = renderKeyboard(highlight);

  const channel = step && step.channel;
  document.getElementById('yx-channel').innerHTML = channel
    ? `要求通道 <b>${channel === 'bc' ? 'b / c' : channel}</b>：${
        channel === 'bc' ? '单手并击 + 空格（左右手都行）' : CHANNEL_NAME[channel]
      }`
    : '单手并击即可，左右手都行（本模式不校验通道）';

  const { done, right, wrong } = state.stats;
  document.getElementById('yx-stats').textContent =
    `第 ${state.index + 1} / ${state.queue.length} 题　已练 ${done}　一遍过 ${right}　出错 ${wrong}`
    + (done ? `　正确率 ${Math.round((right / done) * 100)}%` : '');
}

// ---------------------------------------------------------------- 输入捕获

function isTracked(key) {
  return IS_LEFT.has(key) || IS_RIGHT.has(key) || key === ' ';
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
  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-mode]').forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
      loadMode(button.dataset.mode);
    });
  });
  loadMode('yuanma');
});
