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

/** 字根显示：多数字根有 png，PUA 字根靠 ChaiPUA 字体兜底。 */
function zigenGlyph(root) {
  const hex = root.codePointAt(0).toString(16);
  const isPua = root.length === 1 && root.codePointAt(0) >= 0xe000 && root.codePointAt(0) <= 0xf8ff;
  if (root.length === 1) {
    const cls = isPua ? 'yx-glyph-text yx-pua' : 'yx-glyph-text';
    return `<img class="yx-glyph-img" src="../char_images/${hex}.png" alt="${isPua ? '' : root}"
             onerror="this.outerHTML=this.dataset.fb" data-fb='<span class="${cls}">${root}</span>'>`;
  }
  return `<span class="yx-glyph-text">${root}</span>`;
}

/**
 * 一键直出题库：只取 A 码 + 指定通道。
 * 同一个 A 码左右手打出的是两个不同字词（aA 左手是「中」，右手是「你」），
 * 所以这里必须校验通道，否则等于只练了一半。
 */
function oneKeyBank(channels) {
  const want = new Set(channels);
  return YX_JIAN
    .filter((item) => item.code[1] === 'A' && want.has(item.channel))
    .map((item) => ({
      key: `${item.text}/${item.channel}`,
      target: [item.code],
      channel: item.channel,
      prompt: `<div class="yx-word">${item.text}</div>`,
      hint: `一击直出：A 码 <b>${item.code}</b>　·　通道 <b>${item.channel}</b>：${CHANNEL_NAME[item.channel]}`,
      answer: `${item.code}　${CHANNEL_NAME[item.channel]}`,
    }));
}

const BANKS = {
  // 码元乱序：看到完整码元能直接按出来
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
            prompt: `<div class="yx-code-big">${code}</div>`,
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
      const validSyllables = [];
      for (const syl of syllables) {
        const { final } = parseSyllable(syl, initial);
        const finger = finalToFinger[final];
        if (!finger) continue;
        const code = key + finger;
        if (!YX_BEST_CHORD[code]) continue;
        if (usedCodes.has(code)) continue;
        usedCodes.add(code);
        validSyllables.push({ code, syl });
      }
      if (validSyllables.length === 0) continue;
      // 一题一条，但带 group：间隔重复在声母组内进行，整组掌握后才换下一个声母
      items.push({
        key: `声母/${initial}`,
        group: initial,
        target: [`${key}A`],
        prompt: `<div class="yx-shengmu-step"><div class="yx-code-big">${initial}</div><div class="yx-shengmu-label">声母</div></div>`,
        hint: `按声母键 <b>${key}</b>（${initial}）`,
        answer: `${key}A`,
        anyHand: true,
      });
      for (const { code, syl } of validSyllables) {
        items.push({
          key: syl,
          group: initial,
          target: [code],
          prompt: `<div class="yx-shengyun"><span class="yx-shengyun-sheng">${initial}</span><span class="yx-shengyun-arrow">→</span><span class="yx-shengyun-yun">${syl}</span></div>`,
          hint: `声母键 <b>${key}</b>（${initial}）　·　韵母指法 <b>${code[1]}</b> → ${(YX_YUNMU[code[1]] || []).join(' / ')}`,
          answer: code,
          anyHand: true,
        });
      }
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
        prompt: `<div class="yx-glyph">${zigenGlyph(root)}</div>`,
        hint: info.examples ? `示例：${info.examples}` : (info.stroke ? `笔画「${info.stroke}」` : ''),
        anyHand: true,
        answer: `${sylText}${info.code}`,
      };
    }),

  // 一键直出（30）：15 个声母键 × 左右手，不带空格（通道 B/C）。同一个码左右手是两个字，必须校验通道
  jian_zi: () => oneKeyBank(['B', 'C']),

  // 一键 + 空格直出（30）：同样 15 键 × 左右手，带空格（通道 b/c）
  jian_ci: () => oneKeyBank(['b', 'c']),

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
  progressByMode: {}, // 持久化：{mode: [{index, count, seen}, ...]}
  groupOrder: [],     // 分组模式的组顺序（声韵练习：24 个声母）
  group: undefined,   // 当前正在学的组，undefined 表示不分组或已全部掌握
  step: 0,
  typed: [],
  stats: { done: 0, right: 0, wrong: 0 },
  spaceRule: null,   // 本模式是否统一带/不带空格，null 表示不统一
  wrongOnThis: false,
  revealed: false,   // 当前是否正在显示答案（可能是限时的）
  hinted: false,     // 本题是否看过答案，只影响计分，不随限时提示消失
};

// 限时提示：首次出现自动亮 2 秒，任何时候单独按空格也亮 2 秒
const PEEK_MS = 2000;
let peekTimer = null;

function clearPeek() {
  clearTimeout(peekTimer);
  peekTimer = null;
}

/** 亮出答案与键位 PEEK_MS 毫秒；看过就不再算「一遍过」。 */
function peek() {
  state.hinted = true;
  state.revealed = true;
  clearPeek();
  peekTimer = setTimeout(() => {
    peekTimer = null;
    state.revealed = false;
    render();
  }, PEEK_MS);
  render();
}

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
  return Array.from({ length }, (_, i) => ({ index: i, count: -1, seen: false }));
}

// 旧存档没有 seen 字段：练过（count >= 0）的视为见过，其余当作没见过
function normalizeProgressList(list) {
  return list.map((p) => ({
    index: p.index,
    count: typeof p.count === 'number' ? p.count : -1,
    seen: typeof p.seen === 'boolean' ? p.seen : p.count >= 0,
  }));
}

function groupOf(entry) {
  const item = state.bank[entry.index];
  return item ? item.group : undefined;
}

// 分组模式（声韵练习）：按题库顺序取第一个还没整组掌握的声母，学完它再换下一个。
// 全部掌握后回落到不分组，把整个题库当一个池子继续复习。
function activeGroup() {
  if (!state.groupOrder || state.groupOrder.length === 0) return undefined;
  for (const g of state.groupOrder) {
    if (state.progress.some((p) => groupOf(p) === g && p.count < MASTERY_COUNT)) return g;
  }
  return undefined;
}

// 当前该考哪一条：分组时取当前组里最靠前的，否则就是队首
function headPos() {
  const list = state.progress;
  if (!list || list.length === 0) return -1;
  if (state.group === undefined) return 0;
  return list.findIndex((p) => groupOf(p) === state.group);
}

// 待考单位第一次出现：先教再考，自动亮一下答案
function isFirstEncounter() {
  if (!isSpacedMode()) return false;
  const pos = headPos();
  return pos >= 0 && !state.progress[pos].seen;
}

// 根据连续答对次数返回应后移到的位置
function spacedInterval(count) {
  if (count < 0) return SPACED_INTERVALS[0];
  return SPACED_INTERVALS[count] || SPACED_INTERVALS[SPACED_INTERVALS.length - 1];
}

// 后移 step 个**同组**条目的位置；同组条目不够就排到该组末尾。
// 不分组时全部条目同组（group 均为 undefined），退化成原来的「后移 step 位」。
function insertPos(list, group, step) {
  let counted = 0;
  let last = list.length;
  for (let i = 0; i < list.length; i++) {
    if (groupOf(list[i]) !== group) continue;
    counted += 1;
    if (counted === step) return i + 1;
    last = i + 1;
  }
  return last;
}

// 答对/答错后重排队列：当前条目按间隔表在本组内后移
function rearrangeProgress(correct) {
  const pos = headPos();
  if (pos < 0) return;
  const list = state.progress.slice();
  const [current] = list.splice(pos, 1);
  current.seen = true;
  if (correct) current.count += 1;
  else current.count = -1;
  list.splice(insertPos(list, groupOf(current), spacedInterval(current.count)), 0, current);
  state.progress = list;
  state.progressByMode[state.mode] = list;
  saveSpacedProgress();
  state.group = activeGroup();
}

function countMastered(group) {
  return state.progress.filter(
    (p) => p.count >= MASTERY_COUNT && (group === undefined || groupOf(p) === group),
  ).length;
}

function countInGroup(group) {
  if (group === undefined) return state.progress.length;
  return state.progress.filter((p) => groupOf(p) === group).length;
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
    const pos = headPos();
    return pos < 0 ? null : state.bank[state.progress[pos].index];
  }
  return state.queue[state.index];
}

function currentStep() {
  const item = currentItem();
  if (!item) return null;
  return item.steps ? item.steps[state.step] : { target: item.target, channel: item.channel };
}

// 「带不带空格」若全模式统一，就是规则不是答案，可以先讲；否则连它也得学习者自己判断
function spaceRuleOf(bank) {
  const chans = new Set();
  for (const item of bank) {
    if (item.channel) chans.add(item.channel);
    if (item.steps) for (const s of item.steps) if (s.channel) chans.add(s.channel);
  }
  if (chans.size === 0) return null;
  const all = [...chans];
  if (all.every((c) => c === c.toUpperCase())) return '本模式一律不按空格';
  if (all.every((c) => c === c.toLowerCase())) return '本模式一律按住空格';
  return null;
}

function loadMode(mode, { random = true } = {}) {
  state.mode = mode;
  const bank = BANKS[mode]();
  state.spaceRule = spaceRuleOf(bank);
  if (isSpacedMode(mode)) {
    state.bank = bank;
    state.groupOrder = [...new Set(bank.map((item) => item.group).filter(Boolean))];
    const saved = state.progressByMode[mode];
    if (saved && saved.length === bank.length) {
      state.progress = normalizeProgressList(saved);
      state.progressByMode[mode] = state.progress;
    } else {
      state.progress = initProgressList(bank.length);
      state.progressByMode[mode] = state.progress;
      saveSpacedProgress();
    }
    state.group = activeGroup();
  } else {
    state.groupOrder = [];
    state.group = undefined;
    state.queue = random ? shuffle(bank) : bank;
    state.index = 0;
  }
  state.step = 0;
  state.typed = [];
  state.stats = { done: 0, right: 0, wrong: 0 };
  startItem();
}

// 每题开始：清掉上一题的提示状态，首次出现的题先自动亮 2 秒答案
function startItem() {
  clearPeek();
  state.wrongOnThis = false;
  state.revealed = false;
  state.hinted = false;
  // 首次出现是「教」，看过答案的这一遍不算「一遍过」
  if (isFirstEncounter()) peek();
  else render();
}

function nextItem(correct) {
  // 首次出现是「教」不是「考」，照着提示敲的这一遍不进统计
  if (!isFirstEncounter()) {
    state.stats.done += 1;
    if (correct) state.stats.right += 1;
    else state.stats.wrong += 1;
  }
  if (isSpacedMode()) {
    const before = state.group;
    rearrangeProgress(correct);
    if (state.group !== before) {
      flash(state.group === undefined
        ? `声母 ${before} 已掌握，全部声母过关！`
        : `声母 ${before} 已掌握，进入 ${state.group}`, 'good');
    }
  } else {
    state.index = (state.index + 1) % state.queue.length;
  }
  state.step = 0;
  state.typed = [];
  startItem();
}

// ---------------------------------------------------------------- 判定

function channelAllowed(want, got) {
  if (!want) return true;
  if (want === 'bc') return got === 'b' || got === 'c';
  return want === got;
}

function settleStroke() {
  // 空格没和任何键同击，就不是一次「击」，当作求提示
  if (strokeKeys.size === 0) {
    const spaceOnly = strokeSpace;
    strokeSpace = false;
    if (spaceOnly) peek();
    return;
  }

  const item = currentItem();
  const step = currentStep();
  if (!item || !step) {
    strokeKeys = new Set();
    strokeSpace = false;
    return;
  }

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
      nextItem(!state.wrongOnThis && !state.hinted);
    } else {
      state.step += 1;
      clearPeek();
      state.wrongOnThis = false;
      state.revealed = false;
      state.hinted = false;
    }
  } else {
    state.wrongOnThis = true;
    if (!codesOk) flash(`打出的是 ${result.codes.join('')}`, 'bad');
    else if (step.channel === 'bc') flash('码元对了，但通道应该是 b 或 c', 'bad');
    else flash(`码元对了，但通道应该是 ${step.channel}：${CHANNEL_NAME[step.channel]}`, 'bad');
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
    ? `${isFirstEncounter() ? '首次出现　·　' : ''}本题答案 <b>${item.answer || need}</b>`
      + `${item.steps ? `　当前第 ${state.step + 1} 击：<b>${need}</b>` : ''}`
    : '';

  // 只有在求提示或答错后才点亮键位，否则等于替用户记住了指法。
  // 通道指定了哪只手时只亮那只手，两只手都亮反而说不清该按哪边。
  const highlight = { left: [], right: [] };
  if (showAnswer && step) {
    const hand = { B: 'left', b: 'left', C: 'right', c: 'right' }[step.channel] || null;
    for (const code of step.target) {
      const fingering = fingeringOf(code);
      if (!fingering) continue;
      if (hand !== 'right') highlight.left.push(...fingering.left);
      if (hand !== 'left') highlight.right.push(...fingering.right);
    }
  }
  document.getElementById('yx-keyboard').innerHTML = renderKeyboard(highlight);

  // 哪只手本身就是答案的一部分，没揭示前不能写在这里，否则等于送分
  const channel = step && step.channel;
  let channelText;
  if (!channel) {
    channelText = '单手并击即可，左右手都行（本模式不校验通道）';
  } else if (showAnswer) {
    channelText = `要求通道 <b>${channel === 'bc' ? 'b / c' : channel}</b>：${
      channel === 'bc' ? '单手并击 + 空格（左右手都行）' : CHANNEL_NAME[channel]
    }`;
  } else {
    channelText = `本模式校验通道：${state.spaceRule ? `${state.spaceRule}，` : ''}左右手要自己判断`;
  }
  document.getElementById('yx-channel').innerHTML = channelText;

  const { done, right, wrong } = state.stats;
  if (isSpacedMode()) {
    const groupText = state.group === undefined
      ? (state.groupOrder && state.groupOrder.length ? '全部声母已掌握，进入通练　·　' : '')
      : `当前声母 ${state.group}（第 ${state.groupOrder.indexOf(state.group) + 1} / ${state.groupOrder.length} 组）`
        + `　组内已掌握 ${countMastered(state.group)} / ${countInGroup(state.group)}　·　`;
    document.getElementById('yx-stats').textContent =
      `${groupText}已掌握 ${countMastered()} / ${state.progress.length}`
      + `　·　本轮 已练 ${done}　一遍过 ${right}　出错 ${wrong}`
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
    clearPeek();
    state.revealed = true;
    state.hinted = true;
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
