// 空明拳（yoyo-km）纯形练习数据 —— 由 generate_km_data.py 生成，请勿手改。
// 并击表由 rime/yoyo.yaml 的「空明拳」规则模拟得出，并校验过字根表用到的码元全部可达。
// 码元是单字符（字根编码用到的 60 个字母 + 符号，不含数字）。

// 左手按键组合（排序串）→ 码元（60 种组合）
const KM_CHORDS = {"q": "q", "w": "w", "e": "e", "r": "r", "t": "t", "a": "a", "s": "s", "d": "d", "f": "f", "g": "g", "z": "z", "x": "x", "c": "c", "v": "v", "b": "b", "qw": "B", "qr": "p", "qt": "T", "qf": "P", "we": "i", "wr": "o", "wt": "Y", "wa": "O", "wd": "M", "wf": "h", "wg": "U", "wv": "W", "er": "u", "et": "R", "es": "N", "ed": ">", "ef": "y", "eg": "I", "ev": "E", "ra": "H", "rs": "L", "rd": "K", "ta": "<", "as": ":", "af": ";", "av": "A", "sd": "k", "sf": "l", "sg": "F", "sz": "V", "sc": "n", "sv": "S", "df": "j", "dg": "G", "dx": "X", "dv": "D", "fz": "Z", "fx": "J", "fc": "C", "zx": "?", "zv": "/", "xc": ",", "xv": ".", "cv": "m", "esf": "Q"};

// 每个码元的推荐左手指法，共 60 个码元
const KM_BEST_CHORD = {"a": "a", ";": "af", ":": "as", "A": "av", "b": "b", "c": "c", "m": "cv", "d": "d", "j": "df", "G": "dg", "D": "dv", "X": "dx", "e": "e", ">": "ed", "y": "ef", "I": "eg", "u": "er", "N": "es", "Q": "esf", "R": "et", "E": "ev", "f": "f", "C": "fc", "J": "fx", "Z": "fz", "g": "g", "q": "q", "P": "qf", "p": "qr", "T": "qt", "B": "qw", "r": "r", "H": "ra", "K": "rd", "L": "rs", "s": "s", "n": "sc", "k": "sd", "l": "sf", "F": "sg", "S": "sv", "V": "sz", "t": "t", "<": "ta", "v": "v", "w": "w", "O": "wa", "M": "wd", "i": "we", "h": "wf", "U": "wg", "o": "wr", "Y": "wt", "W": "wv", "x": "x", ",": "xc", ".": "xv", "z": "z", "/": "zv", "?": "zx"};

// 左手键 → 右手镜像键；两手打出同一批码元
const KM_MIRROR = {"1": "0", "2": "9", "3": "8", "4": "7", "5": "6", "q": "p", "w": "o", "e": "i", "r": "u", "t": "y", "a": ";", "s": "l", "d": "k", "f": "j", "g": "h", "z": "/", "x": ".", "c": ",", "v": "m", "b": "n"};

// 同一击内按键的归一化次序（取自 chord_composer.alphabet 的左手段）
const KM_LEFT_ORDER = "12345qwertasdfgzxcvb";

if (typeof module !== 'undefined') {
  module.exports = { KM_CHORDS, KM_BEST_CHORD, KM_MIRROR, KM_LEFT_ORDER };
}
