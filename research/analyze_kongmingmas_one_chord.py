"""空明码（宏版S）一击上屏词全量提取 + yoyo-pure-km 差集与词频分档报告。

口径（经 chord_composer 代数链仿真交叉验证）：
- 空明码词典中码长 ≤2 的条目 = 一击上屏词（≥4 码 = 两击词；单键并击输出 a=/=X 形，
  纯字母 2 码 = 左右手 2 键并击，均属一击）。
- 仿真注：'.D'←xvmk、'*B'←rgop、'7E'←sdfhi、':k'←askl、'7h'←sdfjo 已验证可达；
  少量含 '/' 的码在现行 schema 代数下不可复现，疑为词典生成期遗留，不影响词表提取。
- 词条文本必须是纯 CJK（剔除 E迅速录/扛 j 类脏数据）；单字不作为增补对象。
- yoyo-pure-km 一击上屏词 = 词典并集中净码长（去 _ + '）≤2 的多字词。
- 用 rime/yoyo-yx-word.dict.yaml（万象词频）给候选打分分档。

输出：
- research/km_one_chord_words_full.txt   空明码一击多字词全表（纯CJK，词\\t码列表）
- research/km_one_chord_tier1.txt        推荐增补清单（按词频降序）
- research/km_one_chord_words_recommend.md  报告
"""

import re
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
KM_DICT = Path("/home/jackwy/codes/rime/km-tiger/kmmime/kongmingmas.dict.yaml")
FREQ_DICT = BASE / "rime" / "yoyo-yx-word.dict.yaml"
REPORT = BASE / "research" / "km_one_chord_words_recommend.md"
FULL_OUT = BASE / "research" / "km_one_chord_words_full.txt"
TIER1_OUT = BASE / "research" / "km_one_chord_tier1.txt"
YOYO_DICTS = [BASE / "rime" / "yoyo-pure.dict.yaml", BASE / "rime" / "yoyo-user.dict.yaml"]

SLOT_CAPACITY = 3720  # 前置单引号简词位总数（60+60+3600）


def is_pure_cjk(text: str) -> bool:
    return bool(text) and all("\u4e00" <= ch <= "\u9fff" for ch in text)


def load_km():
    onechord = {}
    started = False
    with open(KM_DICT, encoding="utf-8-sig") as f:
        for line in f:
            line = line.rstrip("\r\n")
            if not started:
                if line == "...":
                    started = True
                continue
            if not line or line.startswith("#"):
                continue
            p = line.split("\t")
            if len(p) >= 2 and len(p[1]) <= 2:
                onechord.setdefault(p[0], set()).add(p[1])
    return onechord


def load_freq():
    freq = {}
    started = False
    for line in FREQ_DICT.read_text(encoding="utf-8").splitlines():
        if not started:
            if line.strip() == "...":
                started = True
            continue
        p = line.split("\t")
        if len(p) >= 3:
            try:
                w = int(p[2])
            except ValueError:
                continue
            if w > 0:
                freq[p[0]] = max(freq.get(p[0], 0), w)
    return freq


def net_len(code: str) -> int:
    return len(code.replace("_", "").replace("+", "").replace("'", ""))


def load_yoyo():
    onechord, allmap = set(), {}
    for d in YOYO_DICTS:
        started = False
        for line in d.read_text(encoding="utf-8").splitlines():
            if not started:
                if line.strip() == "...":
                    started = True
                continue
            if not line or line.startswith("#"):
                continue
            p = line.split("\t")
            if len(p) >= 2:
                text, code = p[0], p[1]
                allmap.setdefault(text, code)
                if len(text) >= 2 and net_len(code) <= 2:
                    onechord.add(text)
    return onechord, allmap


def main():
    km = load_km()
    km_words = {w: cs for w, cs in km.items() if len(w) >= 2 and is_pure_cjk(w)}
    km_chars = {w for w in km if len(w) == 1 and is_pure_cjk(w)}
    # 多字非纯 CJK 的构成：「单字+消歧后缀」vs 其他（英文/标点）
    multi_dirty = {w for w in km if len(w) >= 2 and not is_pure_cjk(w)}
    _pat = re.compile(r"^(\S) (.+)$")
    a = {w for w in multi_dirty if _pat.match(w)}
    b = multi_dirty - a

    FULL_OUT.write_text(
        "\n".join(f"{w}\t{','.join(sorted(cs))}" for w, cs in sorted(km_words.items())),
        encoding="utf-8")
    singles_nonpure = len(km) - len(km_words) - len(km_chars) - len(a) - len(b)
    print(f"空明码一击码位词形 {len(km)} = 多字词 {len(km_words)} + 单字 {len(km_chars)}"
          f" + 单字消歧后缀 {len(a)} + 英文标点 {len(b) + singles_nonpure}")

    yoyo_onechord, yoyo_all = load_yoyo()
    cand = sorted(set(km_words) - yoyo_onechord)
    print(f"yoyo 现有一击上屏词 {len(yoyo_onechord)}；差集候选 {len(cand)}")

    freq = load_freq()
    scored = sorted(((freq.get(w, 0), w, km_words[w]) for w in cand), reverse=True)
    withfreq = [x for x in scored if x[0] > 0]
    zerofreq = [x for x in scored if x[0] == 0]
    print(f"有词频候选 {len(withfreq)}，无词频 {len(zerofreq)}")

    free_slots = SLOT_CAPACITY - 3  # 扣除 3 条演示简词
    tier1 = withfreq[:free_slots]
    tier2 = withfreq[free_slots:]
    TIER1_OUT.write_text(
        "\n".join(f"{w}\t{s}\t{','.join(cs)}" for s, w, cs in tier1), encoding="utf-8")

    lines = [
        "# 空明码一击词 → yoyo-pure-km 增补候选报告", "",
        "## 口径与总量", "",
        "- 空明码词典（`km-tiger/kmmime/kongmingmas.dict.yaml`）**码长 ≤2 的条目 = 一击上屏词**",
        "  （≥4 码为两击词。已用 chord_composer 代数链仿真交叉验证：单键→`a=`/`=X` 形、",
        "  左右手 2 键并击→纯字母 2 码、3~4 键并击→符号码；'.D'←`xvmk`、'*B'←`rgop`、",
        "  '7E'←`sdfhi`、':k'←`askl`、'7h'←`sdfjo` 均仿真复现。少量含 `/` 的码疑为词典",
        "  生成期遗留，按词条仍计入一击词）",
        f"- 一击码位词形共 {len(km)}，构成为：",
        f"  - 纯 CJK 多字词 **{len(km_words)}**（增补对象）",
        f"  - 单字 {len(km_chars)}，另有 **{len(a)}** 条「单字+消歧后缀」"
        f"（如 `艾 r`/`蔼 p` 同在码 `Ab`，后缀为词典作者的重码标记，均为单字）",
        f"  - 英文/标点等 {len(b) + singles_nonpure} 条，均排除",
        "- 词典对用户示例清单覆盖 118/119（唯一未收录的「就可以」系粘贴时与「看来 @k*」粘连的误植）",
        f"- yoyo-pure-km 现有一击上屏词（净码长 ≤2 多字词）：**{len(yoyo_onechord)}** 个；",
        f"  空明码一击词与其重叠 {len(km_words) - len(cand)} 个（已按要求剔除）",
        f"- **差集候选：{len(cand)} 个**；万象词频打分后有词频 {len(withfreq)}、无词频 {len(zerofreq)}",
        f"- 简词位容量：前置单引号方案共 {SLOT_CAPACITY} 位（60+60+3600），扣除 3 条演示词后",
        f"  空闲 **{free_slots}** 位 —— 第一档全部收入后仍有约 {free_slots - len(tier1)} 位余量", "",
        "## 分档建议", "",
        f"1. **第一档（推荐全收，{len(tier1)} 个）**：有词频者全部纳入（容量足够），已按词频降序写入",
        "   `research/km_one_chord_tier1.txt`（格式：`词\\t词频\\t空明码原码`）。",
        "   注意：**尾部**（词频 < 约 200）混有时代词汇（剥削阶级/毛泽东思想/马列主义类），",
        "   录入时可从尾部按需裁剪。",
        "   码位分配在录入 yoyo-user.dict.yaml 时再定（`'` 前缀 + 左手/右手/并击 60×60），",
        "   建议高频词分配好打的码位。",
        f"2. **第三档（不建议，{len(zerofreq)} 个）**：万象词频为 0——生僻词、自造词、",
        "   空明码社区词（速录宝/空明码并击类），不占简词位；",
        "   全表见 `research/km_one_chord_words_full.txt` 可自行挑选。", "",
        "## 第一档样例（前 40）", "",
    ]
    for s, w, cs in tier1[:40]:
        lines.append(f"| {w} | {s} | `{','.join(cs)}` |")
    lines += ["", "## 第三档样例（前 30）", ""]
    for s, w, cs in zerofreq[:30]:
        lines.append(f"| {w} | — | `{','.join(cs)}` |")
    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print("报告已写", REPORT.name)
    print("第一档清单已写", TIER1_OUT.name)


if __name__ == "__main__":
    main()
