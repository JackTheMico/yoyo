#!/usr/bin/env python3
"""从 yoyo-chai.yaml 抽出「只够跑分析」的最小配置。

产出 zigen_table/yoyo-analysis-0.4.yaml，供 hanzi-chai 做字形拆分，不产出任何编码。

保留：
  data       —— 字符集与字库（含私用区自定义字形），分析所需
  analysis   —— 分类器 / 退化器 / 选择器 / 自定义分析规则
  form.mapping 的**键集与值** —— 见下方说明

丢弃：
  form.alphabet / form.mapping_type / form.grouping —— 键位与取码规则，属于编码
  encoder / optimization / diagram —— 编码、优化、图示，一概不跑（ADR-0002）

关于 form.mapping 为何保留：hanzi-chai 0.3.1 的 拆分() 需要「决策」来确定合法字根集合
（repertoire.js:23 把 mapping 的单字键当字根词表，component.js / compound.js 里对它的
十几处消费全部是 `.has(名称)`）。也就是说它只用键、从不读值——它是**字根词汇表**，
不是编码规则。真正的编码规则是 alphabet / mapping_type，这里一个都不带。

关于 mapping 为何要**展开到从属字根**：字库里的许多部件是私用区字形（例如 `是` 的下半
是 U+E03A，`grouping` 记着它从属于 `疋`）。分析器只认 决策 里的键，不认识 grouping，
所以如果不把从属字根也写进 mapping，它就会把 U+E03A 拆成一堆笔画，产出与已发布编码
对不上的序列——实测只带 277 个主字根时自洽率仅 50%。补上 grouping 的 262 个从属字根
（值继承主字根的码，这正是 grouping 在编码时的语义）后词汇量 539，`是` 才拆成 日 + 疋。

用法：
  python3 zigen_table/huma/make_analysis_config.py
"""

from __future__ import annotations

import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
SRC = ROOT / "zigen_table" / "yoyo-chai.yaml"
DST = ROOT / "zigen_table" / "yoyo-analysis-0.4.yaml"


def main() -> int:
    raw = yaml.safe_load(SRC.read_text(encoding="utf-8"))

    form = raw.get("form") or {}
    if "mapping" not in form:
        print(f"错误：{SRC} 的 form 段没有 mapping", file=sys.stderr)
        return 1

    mapping = dict(form["mapping"])
    grouping = dict(form.get("grouping") or {})
    added, skipped = 0, 0
    for sub, main in grouping.items():
        if sub in mapping:
            continue
        if main not in mapping:
            skipped += 1
            continue
        mapping[sub] = mapping[main]
        added += 1

    info = dict(raw.get("info") or {})
    info["description"] = (
        "由 make_analysis_config.py 从 yoyo-chai.yaml 抽取，只供 hanzi-chai 做字形拆分。\n"
        "不含 alphabet / mapping_type / encoder / optimization / diagram——本文件不产出任何编码。\n"
        "form.mapping 保留的原因是它是字根词汇表（分析器只用它的键），不是编码规则；"
        "已展开从属字根，否则私用区部件认不出主字根。"
    )

    out = {
        "version": "0.4",
        "source": raw.get("source") or "huma",
        "info": info,
        "data": raw.get("data") or {},
        "analysis": raw.get("analysis") or {},
        "form": {"mapping": mapping, "grouping": grouping},
    }

    header = (
        "# 生成文件，勿手改。改 yoyo-chai.yaml 或 make_analysis_config.py 后重跑：\n"
        "#   python3 zigen_table/huma/make_analysis_config.py\n"
    )
    body = yaml.safe_dump(
        out,
        allow_unicode=True,
        sort_keys=False,
        default_flow_style=False,
        width=10**6,
    )
    DST.write_text(header + body, encoding="utf-8")

    roots = [k for k in mapping if len(k) == 1]
    print(f"已写入 {DST.relative_to(ROOT)}")
    print(f"  字根词汇 {len(roots)} 个（主字根 {len(form['mapping'])} + 从属字根 {added}，跳过 {skipped}）")
    print(f"  data 段保留：{', '.join((raw.get('data') or {}).keys())}")
    print(f"  analysis 段保留：{', '.join((raw.get('analysis') or {}).keys())}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
