#!/usr/bin/env python3
"""扩充 yoyo-pure-km 词库：并入空明码S(kongmingmas) 高频常用词，且不抬高重码率。

重建自 handoff-yoyo-km-augment.md §3 方法论（原 research/add_km_words.py 已丢失）。

流程：
  1. 读 yoyo-pure.dict.yaml + yoyo_kf.dict.yaml -> 现有文本集 / 占用码集(used) / 单字->形码映射
  2. 读 yoyo-yx-word.dict.yaml -> 万象词频 weight (高频判定基准)
  3. 读 kongmingmas.dict.yaml -> 2~4 字候选词（仅取文本，按 yoyo 公式重编码）
  4. 按词频降序贪心：已存在/含生僻字/码已占用 -> 跳过，否则加入
  5. 增量（base 码，weight>=阈值）append 进 yoyo-pure.dict.yaml（带幂等标记）
  6. 重生成 pure_dict_map.lua（状态机映射，否则顶屏误切分）
  7. 输出合并前后重码率

编码器公式（doc §3.2）：
  2字 AbAcBbBc = 字1[0] 字1[1] 字2[0] 字2[1]
  3字 AbBbCbCc = 字1[0] 字2[0] 字3[0] 字3[1]
  4字 AbBbCbZb = 字1[0] 字2[0] 字3[0] 末字[0]
（b=首字母(索引0), c=次字母(索引1)）
"""

import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent          # research/.. = repo root
RIME = ROOT / "rime"
PURE = RIME / "yoyo-pure.dict.yaml"
KFC = RIME / "yoyo_kf.dict.yaml"
WYX = RIME / "yoyo-yx-word.dict.yaml"
KONG = ROOT / ".reasonix" / "kongmingmas.dict.yaml"
MAPGEN = RIME / "scripts" / "generate_pure_dict_map.py"

# 与 generate_pure_dict.py 一致的标记字符集
MARKER = set('[]()-_=+!@')

# 本次落地的「高频」阈值（决策：常用广度 weight>=200）
THRESHOLD = 200
MARKER_COMMENT = (
    "# === kongmingmas 高频增量 (weight>=%d) 由 research/add_km_words.py 生成 ==="
    % THRESHOLD
)


def strip_code(code: str) -> str:
    """去掉单手前缀(_/+)与标记字符，得到 base 码。"""
    if code[:1] in ('_', '+'):
        code = code[1:]
    return ''.join(ch for ch in code if ch not in MARKER)


def load_dict(path: Path):
    """返回 (texts, codes, char_code, entries)。entries=(text, basecode, weight)。"""
    texts, codes, char_code, entries = set(), set(), {}, []
    raw = path.read_text(encoding='utf-8-sig')
    for line in raw.splitlines():
        line = line.rstrip('\r')
        if not line or line.startswith('#') or '\t' not in line:
            continue
        parts = line.split('\t')
        if len(parts) < 2 or not parts[0] or not parts[1]:
            continue
        text, code = parts[0], parts[1]
        weight = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 0
        sc = strip_code(code)
        if not sc:
            continue
        texts.add(text)
        codes.add(sc)
        entries.append((text, sc, weight))
        if len(text) == 1:
            char_code.setdefault(text, []).append(sc)
    cc = {ch: max(v, key=len) for ch, v in char_code.items() if v}
    return texts, codes, cc, entries


def encode(word: str, cc: dict) -> str | None:
    """按公式给词编码；任一字缺形码或所需位置越界则返回 None。"""
    n = len(word)
    shape = [cc.get(ch) for ch in word]
    if any(s is None for s in shape):
        return None
    if n == 2:
        s1, s2 = shape
        if len(s1) < 2 or len(s2) < 2:
            return None
        return s1[0] + s1[1] + s2[0] + s2[1]
    if n == 3:
        s1, s2, s3 = shape
        if len(s1) < 1 or len(s2) < 1 or len(s3) < 2:
            return None
        return s1[0] + s2[0] + s3[0] + s3[1]
    if n == 4:
        if any(len(s) < 1 for s in shape):
            return None
        return shape[0][0] + shape[1][0] + shape[2][0] + shape[3][0]
    return None


def validate(entries, cc) -> float:
    ok = tot = 0
    for text, code, _ in entries:
        if 2 <= len(text) <= 4 and len(code) == 4:
            e = encode(text, cc)
            tot += 1
            if e == code:
                ok += 1
    rate = ok / tot if tot else 0
    print(f"[验证] 编码器回测: {ok}/{tot} 匹配 ({rate*100:.2f}%)")
    return rate


def load_weights(path: Path) -> dict:
    w = {}
    raw = path.read_text(encoding='utf-8-sig')
    for line in raw.splitlines():
        line = line.rstrip('\r')
        if not line or line.startswith('#') or '\t' not in line:
            continue
        p = line.split('\t')
        if len(p) < 3:
            continue
        try:
            wt = int(p[2])
        except ValueError:
            continue
        if wt > w.get(p[0], 0):
            w[p[0]] = wt
    return w


def load_kongming(path: Path):
    words = set()
    raw = path.read_text(encoding='utf-8-sig')
    for line in raw.splitlines():
        line = line.rstrip('\r')
        if not line or line.startswith('#') or '\t' not in line:
            continue
        t = line.split('\t')[0].strip()
        if t and 2 <= len(t) <= 4:
            words.add(t)
    return words


def conflict_rate(entries):
    m = defaultdict(set)
    for t, c, _ in entries:
        m[c].add(t)
    multi = sum(1 for ts in m.values() if len(ts) > 1)
    return multi, len(m)


def main():
    print("=== 1. 读取 yoyo-pure + yoyo_kf ===")
    ptexts, pcodes, pcc, pe = load_dict(PURE)
    ktexts, kcodes, kcc, ke = load_dict(KFC)
    texts = ptexts | ktexts
    codes = pcodes | kcodes
    cc = {**kcc, **pcc}  # yoyo-pure 优先
    print(f"  yoyo-pure 词条={len(pe)}, yoyo_kf 词条={len(ke)}")
    print(f"  并集占用码数={len(codes)}, 单字形码数={len(cc)}")
    base_multi, base_total = conflict_rate(pe + ke)
    print(f"[基线] 重码码数={base_multi}, 总码数={base_total}, "
          f"重码率={100*base_multi/base_total:.4f}%")

    print("=== 2. 编码器回测 ===")
    rate = validate(pe, cc)
    if rate < 0.90:
        print("!! 编码器匹配率过低，终止。")
        sys.exit(1)

    print("=== 3. 读取万象词频 + 空明源 ===")
    w = load_weights(WYX)
    print(f"  万象带权词条={len(w)}")
    kw = load_kongming(KONG)
    print(f"  空明候选(2~4字去重)={len(kw)}")

    cands = [t for t in kw if t in w and w[t] >= THRESHOLD]
    cands.sort(key=lambda t: -w[t])
    print(f"  阈值 weight>={THRESHOLD} 候选={len(cands)}")

    print("=== 4. 贪心筛选（不抬高重码率）===")
    chosen = []
    used = set(codes)
    seen = set(texts)
    skipped_exist = skipped_char = skipped_code = 0
    for t in cands:
        if t in seen:
            skipped_exist += 1
            continue
        c = encode(t, cc)
        if c is None:
            skipped_char += 1
            continue
        if c in used:
            skipped_code += 1
            continue
        chosen.append((t, c, w[t]))
        used.add(c)
        seen.add(t)
    print(f"[结果] 可新增(weight>={THRESHOLD}) = {len(chosen)} 条 "
          f"(跳过: 已存在 {skipped_exist}, 缺形码 {skipped_char}, 码冲突 {skipped_code})")

    merged = pe + ke + [(t, c, wt) for t, c, wt in chosen]
    m_multi, m_total = conflict_rate(merged)
    print(f"[合并后] 重码码数={m_multi}, 总码数={m_total}, "
          f"重码率={100*m_multi/m_total:.4f}%")
    print(f"  新增重码 = {m_multi - base_multi} (应为 0)")

    print("=== 5. append 增量到 yoyo-pure.dict.yaml ===")
    backup = PURE.with_suffix('.dict.yaml.bak')
    backup.write_text(PURE.read_text(encoding='utf-8'), encoding='utf-8')
    lines = PURE.read_text(encoding='utf-8').splitlines()
    if MARKER_COMMENT in lines:           # 幂等：去掉上次追加块
        idx = lines.index(MARKER_COMMENT)
        lines = lines[:idx]
    block = [MARKER_COMMENT]
    for t, c, wt in sorted(chosen, key=lambda x: -x[2]):
        block.append(f"{t}\t{c}\t{wt}")
    out = "\n".join(lines) + "\n" + "\n".join(block) + "\n"
    PURE.write_text(out, encoding='utf-8')
    print(f"  已追加 {len(chosen)} 条 (备份: {backup.name})")

    print("=== 6. 重生成 pure_dict_map.lua（状态机映射）===")
    sys.path.insert(0, str(MAPGEN.parent))
    import generate_pure_dict_map as gm
    gm.generate()

    print("=== 完成 ===")
    print(f"增量词数={len(chosen)}  基线重码率={100*base_multi/base_total:.4f}%  "
          f"合并后重码率={100*m_multi/m_total:.4f}%  新增重码={m_multi-base_multi}")


if __name__ == "__main__":
    main()
