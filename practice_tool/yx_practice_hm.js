// 音形（yoyo-yx-hm，寒梅指法）并击练习逻辑
// 依赖 yx_data_module.js 提供的 YX_CHORDS / YX_BEST_CHORD / YX_MIRROR / YX_LEFT_ORDER /
// YX_SHENGMU / YX_YUNMU / YX_ZIGEN / YX_CHARS / YX_JIAN。
//
// 和纯形练习工具最大的不同：这里练的是**并击**，不是逐字母敲。所以要在浏览器里
// 复刻一次「击」的判定——同时按下的键归一化后查寒梅表，全部松开才结算。

const LEFT_OF = {};
for (const [left, right] of Object.entries(YX_MIRROR)) LEFT_OF[right] = left;
const IS_LEFT = new Set(YX_LEFT_ORDER);
const IS_RIGHT = new Set(Object.values(YX_MIRROR));

// 键盘图示的物理排布。右手每行是左手同行的镜像，按实际从左到右的顺序列出。
// 寒梅不使用数字行与 - = [ ]；右手行按标准 QWERTY 镜像（q↔p w↔o e↔i r↔u t↔y，…，z↔/）
const KEYBOARD = [
  { left: ['q', 'w', 'e', 'r', 't'], right: ['y', 'u', 'i', 'o', 'p'] },
  { left: ['a', 's', 'd', 'f', 'g'], right: ['h', 'j', 'k', 'l', ';'] },
  { left: ['z', 'x', 'c', 'v', 'b'], right: ['n', 'm', ',', '.', '/'] },
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

// 真实汉语音节表（用于把码元反查为可读音节）
const INITIAL_SYLLABLES = {
  'b':  ['ba', 'bo', 'bi', 'bu', 'bai', 'bei', 'bao', 'ban', 'ben', 'bang', 'beng', 'bing'],
  'p':  ['pa', 'po', 'pi', 'pu', 'pai', 'pei', 'pao', 'pan', 'pen', 'pang', 'peng', 'ping'],
  'm':  ['ma', 'mo', 'mi', 'mu', 'mai', 'mei', 'mao', 'man', 'men', 'mang', 'meng', 'ming'],
  'f':  ['fa', 'fo', 'fu', 'fei', 'fan', 'fen', 'fang', 'feng'],
  'd':  ['da', 'de', 'di', 'du', 'dai', 'dei', 'dao', 'dou', 'dan', 'dang', 'deng', 'ding', 'dong', 'duan', 'dui', 'dun'],
  't':  ['ta', 'te', 'ti', 'tu', 'tai', 'tao', 'tou', 'tan', 'tang', 'teng', 'ting', 'tong', 'tuan', 'tui', 'tun'],
  'n':  ['na', 'ne', 'ni', 'nu', 'nv', 'nai', 'nei', 'nao', 'nan', 'nen', 'nang', 'neng', 'ning', 'nong', 'nian', 'niang', 'niao', 'nin', 'nuan', 'nve'],
  'l':  ['la', 'le', 'li', 'lu', 'lv', 'lai', 'lei', 'lao', 'lou', 'lan', 'lang', 'leng', 'ling', 'long', 'lia', 'lie', 'liao', 'liu', 'lian', 'lin', 'liang', 'luan', 'lun', 'lve'],
  'g':  ['ga', 'ge', 'gu', 'gai', 'gei', 'gao', 'gou', 'gan', 'gen', 'gang', 'geng', 'gong', 'gua', 'guo', 'guai', 'gui', 'guan', 'gun', 'guang'],
  'k':  ['ka', 'ke', 'ku', 'kai', 'kao', 'kou', 'kan', 'ken', 'kang', 'keng', 'kong', 'kua', 'kuo', 'kuai', 'kui', 'kuan', 'kun', 'kuang'],
  'h':  ['ha', 'he', 'hu', 'hai', 'hei', 'hao', 'hou', 'han', 'hen', 'hang', 'heng', 'hong', 'hua', 'huo', 'huai', 'hui', 'huan', 'hun', 'huang'],
  'j':  ['ji', 'ju', 'jia', 'jie', 'jiao', 'jiu', 'jian', 'jin', 'jiang', 'jing', 'jiong', 'juan', 'jun', 'jue'],
  'q':  ['qi', 'qu', 'qia', 'qie', 'qiao', 'qiu', 'qian', 'qin', 'qiang', 'qing', 'qiong', 'quan', 'qun', 'que'],
  'x':  ['xi', 'xu', 'xia', 'xie', 'xiao', 'xiu', 'xian', 'xin', 'xiang', 'xing', 'xiong', 'xuan', 'xun', 'xue'],
  'zh': ['zha', 'zhe', 'zhi', 'zhu', 'zhai', 'zhao', 'zhou', 'zhan', 'zhen', 'zhang', 'zheng', 'zhong', 'zhua', 'zhuo', 'zhuai', 'zhui', 'zhuan', 'zhun', 'zhuang'],
  'ch': ['cha', 'che', 'chi', 'chu', 'chai', 'chao', 'chou', 'chan', 'chen', 'chang', 'cheng', 'chong', 'chuo', 'chuai', 'chui', 'chuan', 'chun', 'chuang'],
  'sh': ['sha', 'she', 'shi', 'shu', 'shai', 'shao', 'shou', 'shan', 'shen', 'shang', 'sheng', 'shua', 'shuo', 'shuai', 'shui', 'shuan', 'shun', 'shuang'],
  'r':  ['re', 'ri', 'ru', 'rao', 'rou', 'ran', 'ren', 'rang', 'reng', 'rong', 'ruo', 'rui', 'ruan', 'run'],
  'z':  ['za', 'ze', 'zi', 'zu', 'zai', 'zei', 'zao', 'zou', 'zan', 'zen', 'zang', 'zeng', 'zong', 'zuan', 'zui', 'zun'],
  'c':  ['ca', 'ce', 'ci', 'cu', 'cai', 'cao', 'cou', 'can', 'cen', 'cang', 'ceng', 'cong', 'cuan', 'cui', 'cun'],
  's':  ['sa', 'se', 'si', 'su', 'sai', 'sao', 'sou', 'san', 'sen', 'sang', 'seng', 'song', 'suan', 'sui', 'sun'],
  'y':  ['ya', 'ye', 'yi', 'yu', 'yao', 'you', 'yan', 'yin', 'yang', 'ying', 'yong', 'yuan', 'yun', 'yue'],
  'w':  ['wa', 'wo', 'wu', 'wai', 'wei', 'wan', 'wen', 'wang', 'weng'],
  '零声母': ['a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'er'],
};

// 扁平化为集合，方便快速校验
const VALID_SYLLABLES = new Set(Object.values(INITIAL_SYLLABLES).flat());

/** 把码元（如 "dD"）反查为可读音节（如 "dian"），返回所有匹配的音节。 */
function codeToSyllables(code) {
  const key = code[0];
  const finger = code[1];
  const initials = YX_SHENGMU[key] || [];
  const finals = YX_YUNMU[finger] || [];
  const result = [];
  for (const init of initials) {
    for (const fin of finals) {
      if (init === '零声母') {
        if (VALID_SYLLABLES.has(fin)) result.push(fin);
      } else {
        const syl = init + fin;
        if (VALID_SYLLABLES.has(syl)) result.push(syl);
      }
    }
  }
  return result;
}

/** 码元可读音节文本：如 "vI" → "jiao / jiong / jun / kong / kun"；无音节码元返回空串。 */
function syllableText(code) {
  const syls = codeToSyllables(code);
  return syls.length ? syls.join(' / ') : '';
}

/** 码元音节展示 HTML：常驻显示在码元下方；无音节码元返回空串。 */
function syllablesHtml(code) {
  const text = syllableText(code);
  return text ? `<div class="yx-syllables">${text}</div>` : '';
}

/** 字根显示：多数字根有 png，PUA 字根靠 ChaiPUA 字体兜底。 */
function zigenGlyph(root) {
  const hex = root.codePointAt(0).toString(16);
  const isPua = root.length === 1 && root.codePointAt(0) >= 0xe000 && root.codePointAt(0) <= 0xf8ff;
  if (root.length === 1) {
    const cls = isPua ? 'yx-glyph-text yx-pua' : 'yx-glyph-text';
    return `<img class="yx-glyph-img" src="../zigen_table/char_images/${hex}.png" alt="${isPua ? '' : root}"
             onerror="this.outerHTML=this.dataset.fb" data-fb='<span class="${cls}">${root}</span>'>`;
  }
  return `<span class="yx-glyph-text">${root}</span>`;
}

const BANKS = {
  // 码元乱序：看到完整码元能直接按出来
  yuanma: () =>
    Object.keys(YX_BEST_CHORD)
      .sort()
      .map((code) => ({
        key: code,
        target: [code],
        prompt: `<div class="yx-code-big">${code}</div>${syllablesHtml(code)}`,
        hint: `声母键 <b>${code[0]}</b> → ${(YX_SHENGMU[code[0]] || []).join(' / ')}　·　`
          + `韵母指法 <b>${code[1]}</b> → ${(YX_YUNMU[code[1]] || []).join(' / ')}`,
        anyHand: true,
      })),

  // 码元指法（180）：先练单个声母键位，再练该声母下的全部韵母指法
  shengmu: () => {
    const groups = {};
    for (const code of Object.keys(YX_BEST_CHORD).sort()) {
      const sm = code[0];
      if (!groups[sm]) groups[sm] = [];
      groups[sm].push(code);
    }
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([sm, codes]) => ({
        key: sm,
        steps: [
          {
            target: [`${sm}A`],
            prompt: `<div class="yx-shengmu-step"><div class="yx-code-big">${sm}</div><div class="yx-shengmu-label">声母键位</div></div>`,
            hint: `先按声母键 <b>${sm}</b>（单独一击）→ ${(YX_SHENGMU[sm] || []).join(' / ')}`,
          },
          ...codes.slice(1).map((code) => ({
            target: [code],
            prompt: `<div class="yx-code-big">${code}</div>${syllablesHtml(code)}`,
            hint: `声母键 <b>${code[0]}</b> → ${(YX_SHENGMU[code[0]] || []).join(' / ')}　·　`
              + `韵母指法 <b>${code[1]}</b> → ${(YX_YUNMU[code[1]] || []).join(' / ')}`,
          })),
        ],
      }));
  },

  // 声韵练习：先显示真实声母名（如 b / ch / 零声母），按对应键；
  // 再显示该声母下的真实音节（如 ba / bo / bi），按声母键 + 韵母指法。
  shengyun: () => {
    // 反向映射：韵母 → 指法
    const finalToFinger = {};
    for (const [finger, finals] of Object.entries(YX_YUNMU)) {
      for (const f of finals) finalToFinger[f] = finger;
    }
    // 声母名 → 键位
    const smToKey = {};
    for (const [key, names] of Object.entries(YX_SHENGMU)) {
      for (const n of names) smToKey[n] = key;
    }
    // 解析音节：分离声母和韵母
    function parseSyllable(syl, initial) {
      if (initial === '零声母') return { final: syl };
      return { final: syl.slice(initial.length) };
    }
    // 为每个声母构建练习项
    const items = [];
    const INITIAL_ORDER = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h',
      'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w', '零声母'];
    for (const initial of INITIAL_ORDER) {
      const syllables = INITIAL_SYLLABLES[initial];
      if (!syllables) continue;
      const key = smToKey[initial];
      if (!key) continue;
      const usedCodes = new Set();
      const validSteps = [];
      for (const syl of syllables) {
        const { final } = parseSyllable(syl, initial);
        const finger = finalToFinger[final];
        if (!finger) continue;
        const code = key + finger;
        if (!YX_BEST_CHORD[code]) continue;
        if (usedCodes.has(code)) continue;
        usedCodes.add(code);
        validSteps.push({ code, syl });
      }
      if (validSteps.length === 0) continue;
      items.push({
        key: initial,
        steps: [
          {
            target: [`${key}A`],
            prompt: `<div class="yx-shengmu-step"><div class="yx-code-big">${initial}</div><div class="yx-shengmu-label">声母</div></div>`,
            hint: `按声母键 <b>${key}</b>（${initial}）`,
          },
          ...validSteps.map(({ code, syl }) => ({
            target: [code],
            prompt: `<div class="yx-shengyun"><span class="yx-shengyun-sheng">${initial}</span><span class="yx-shengyun-arrow">→</span><span class="yx-shengyun-yun">${syl}</span></div>`,
            hint: `声母键 <b>${key}</b>（${initial}）　·　韵母指法 <b>${code[1]}</b> → ${(YX_YUNMU[code[1]] || []).join(' / ')}`,
          })),
        ],
      });
    }
    return items;
  },

  // 466 个字根，练的是「看到字根能打出它的码元」
  zigen: () =>
    Object.entries(YX_ZIGEN).map(([root, info]) => {
      const syls = codeToSyllables(info.code);
      const sylText = syls.length ? `${syls.join(' / ')}，` : '';
      return {
        key: root,
        target: [info.code],
        // 六个基本笔画字根在数据里写作 1-6，显示时用 stroke（一丨丿丶乛乙）代替数字，与字根表一致
        prompt: `<div class="yx-glyph">${zigenGlyph(info.stroke || root)}</div>`,
        hint: info.examples ? `示例：${info.examples}` : (info.stroke ? `笔画「${info.stroke}」` : ''),
        anyHand: true,
        answer: `${sylText}${info.code}`,
      };
    }),

  // 一键字直出（60）：只看 aA、sA 等只有 A 码的单字，不校验通道
  jian_zi: () =>
    YX_JIAN.filter((item) => item.code[1] === 'A' && item.text.length === 1)
      .slice(0, 60)
      .map((item) => ({
        key: item.text,
        target: [item.code],
        prompt: `<div class="yx-word">${item.text}</div>`,
        hint: `一键字直出，按 A 码 <b>${item.code}</b>（左右手均可）`,
        answer: item.code,
        anyHand: true,
      })),

  // 一键词直出（60）：只看 aA、sA 等只有 A 码的词语，不校验通道
  jian_ci: () =>
    YX_JIAN.filter((item) => item.code[1] === 'A' && item.text.length > 1)
      .slice(0, 60)
      .map((item) => ({
        key: item.text,
        target: [item.code],
        prompt: `<div class="yx-word">${item.text}</div>`,
        hint: `一键词直出，按 A 码 <b>${item.code}</b>（左右手均可）`,
        answer: item.code,
        anyHand: true,
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
};

// ---------------------------------------------------------------- 状态

// 间隔重复：除「码元指法（180）」外，其余模式都采用间隔重复。
// 仿照麓鸣指法练习：每个条目带一个连续正确计数 count（初始 -1），
// 答对一次 count+1 并按间隔表后移；答错或跳过 count 重置为 -1 并移到队首附近。
const SPACED_MODES = new Set(['yuanma', 'shengyun', 'zigen', 'jian_zi', 'jian_ci', 'jian']);
const MASTERY_COUNT = 3;        // 连续答对 3 次视为「已掌握」
const SPACED_INTERVALS = [2, 4, 8, 12, 20, 40, 60, 100]; // count → 后移位置

const state = {
  mode: 'shengmu',
  // 码元指法（180）仍用乱序队列 + 游标
  queue: [],
  index: 0,
  // 间隔重复模式：bank 是题目全集，progress 是 [{index, count}, ...]，队首为当前题
  bank: [],
  progress: [],
  progressByMode: {}, // 持久化：{mode: [{index, count}, ...]}
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

function isSpacedMode(mode) {
  return SPACED_MODES.has(mode || state.mode);
}

function loadSpacedProgress() {
  try {
    const saved = localStorage.getItem('yxPracticeProgress');
    if (saved) state.progressByMode = JSON.parse(saved) || {};
  } catch (e) {
    state.progressByMode = {};
  }
}

function saveSpacedProgress() {
  try {
    localStorage.setItem('yxPracticeProgress', JSON.stringify(state.progressByMode));
  } catch (e) { /* 忽略写入失败 */ }
}

function initProgressList(length) {
  return Array.from({ length }, (_, i) => ({ index: i, count: -1 }));
}

// 根据连续答对次数返回应后移到的位置
function spacedInterval(count) {
  if (count < 0) return SPACED_INTERVALS[0];
  return SPACED_INTERVALS[count] || SPACED_INTERVALS[SPACED_INTERVALS.length - 1];
}

// 答对/答错后重排队列：队首条目按间隔表后移
function rearrangeProgress(correct) {
  const list = state.progress.slice();
  if (list.length === 0) return;
  const first = list.shift();
  if (correct) first.count += 1;
  else first.count = -1;
  const pos = Math.min(spacedInterval(first.count), list.length);
  list.splice(pos, 0, first);
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
  return item.steps ? item.steps[state.step] : { target: item.target, channel: item.channel };
}

function loadMode(mode, { random = true } = {}) {
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
    state.queue = random ? shuffle(bank) : bank;
    state.index = 0;
  }
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
  if (isSpacedMode()) {
    rearrangeProgress(correct);
  } else {
    state.index = (state.index + 1) % state.queue.length;
  }
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
      state.wrongOnThis = false;
      state.revealed = false;
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

  document.getElementById('yx-prompt').innerHTML = step && step.prompt ? step.prompt : item.prompt;

  const need = step ? step.target.join('') : '';

  const showAnswer = state.revealed || state.wrongOnThis;
  const hintText = step && step.hint ? step.hint : (item.hint || '');
  document.getElementById('yx-hint').innerHTML = showAnswer ? hintText : '';
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
  if (isSpacedMode()) {
    const mastered = countMastered();
    const total = state.progress.length;
    document.getElementById('yx-stats').textContent =
      `已掌握 ${mastered} / ${total}　·　本轮 已练 ${done}　一遍过 ${right}　出错 ${wrong}`
      + (done ? `　正确率 ${Math.round((right / done) * 100)}%` : '');
  } else {
    document.getElementById('yx-stats').textContent =
      `第 ${state.index + 1} / ${state.queue.length} 题　已练 ${done}　一遍过 ${right}　出错 ${wrong}`
      + (done ? `　正确率 ${Math.round((right / done) * 100)}%` : '');
  }
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
  loadSpacedProgress();
  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-mode]').forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
      loadMode(button.dataset.mode);
    });
  });
  const resetBtn = document.getElementById('yx-reset-progress');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetSpacedProgress();
      loadMode(state.mode);
      flash('间隔重复进度已重置', 'good');
    });
  }
  loadMode('shengmu');
});
