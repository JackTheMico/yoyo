#!/usr/bin/env bash
# 部署 yoyo 方案（含空明拳变体 yoyo-bm-km / yoyo-wx-km）到 fcitx5-rime 和 xsime(rimes)
#
# 用法：
#   ./deploy_to_fcitx5.sh                          # 部署到 fcitx5/rime + xsime(rimes/data)
#   FCITX5_RIME_DIR=... ./deploy_to_fcitx5.sh      # 指定 fcitx5 原生 rime 目标目录
#   RIMES_DATA_DIR=...  ./deploy_to_fcitx5.sh      # 指定 xsime 数据目录
#   FCITX5_NO_RESTART=1 ./deploy_to_fcitx5.sh      # 只同步文件+构建，不重启 fcitx5
#   SKIP_RIMES=1        ./deploy_to_fcitx5.sh      # 跳过 xsime 同步（只做 fcitx5 原生 rime）
#
# 架构说明：
#   fcitx5 上有两个独立 rime 输入法，各自维护独立数据：
#     rime   — fcitx5 官方原生插件  → ~/.local/share/fcitx5/rime/
#     rimes  — xsime 犀术IME 插件  → ~/.local/share/rimes/data/
#   脚本会同时同步两边，一次重启 fcitx5 让两边都生效。
#
# 行为（均幂等，可重复执行）：
#   1. 同步 rime/ 下 yoyo* 相关 yaml 与 lua/ 到 fcitx5/rime 目标目录
#   2. 陈旧守卫：反查分片、并击标点键位表（仅告警不阻断）
#   3. 在 fcitx5/rime 的 default.custom.yaml 注册 yoyo 方案
#   4. 构建 fcitx5/rime 部署产物
#   5. 同步相同文件到 xsime(rimes) 独立数据目录（自动检测，可 SKIP_RIMES=1 跳过）
#   6. 触发 fcitx5 重启——原生 rime 和 xsime 各自重新部署
set -euo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DST_DIR="${FCITX5_RIME_DIR:-$HOME/.local/share/fcitx5/rime}"
RIMES_DIR="${RIMES_DATA_DIR:-$HOME/.local/share/rimes/data}"

echo "== 源目录:       $SRC_DIR"
echo "== fcitx5/rime:  $DST_DIR"
echo "== xsime/rimes:  $RIMES_DIR"
mkdir -p "$DST_DIR"

# ---- 1. 同步方案文件（yaml + dict.yaml + lua）----
echo "== 同步 yoyo 方案文件 =="
rsync -a --ignore-times "$SRC_DIR"/yoyo*.yaml "$DST_DIR"/
rsync -a --ignore-times "$SRC_DIR"/yoyo*.dict.yaml "$DST_DIR"/
rsync -a --ignore-times "$SRC_DIR"/lua/ "$DST_DIR"/lua/
echo "已同步 yoyo*.yaml / yoyo*.dict.yaml / lua/（不删目标多余文件，不覆盖用户 default.yaml）"

# ---- 1.5 陈旧守卫：反查分片是否跟上了数据源 ----
# 分片是 tracked 的生成物，过期不会报错，只会让反查按旧数据出候选（注释里丢字根/丢简码）。
# 仅告警不阻断——部署本身仍然有效，只是反查提示可能不准。
echo "== 校验反查分片是否陈旧 =="
REVERSE_GEN="$SRC_DIR/scripts/generate_reverse_data.py"
if command -v python3 >/dev/null 2>&1 && [ -f "$REVERSE_GEN" ]; then
  if python3 "$REVERSE_GEN" --check --out-dir "$SRC_DIR/lua/yoyo/data" >/dev/null 2>&1; then
    echo "反查分片与数据源一致"
  else
    echo "警告：反查分片与数据源不一致（反查注释可能缺字根/简码）"
    echo "  修复：python3 $REVERSE_GEN && 重新部署"
  fi
else
  echo "跳过（缺 python3 或生成脚本）"
fi

# ---- 1.6 陈旧守卫：并击标点键位表是否跟上了 yoyo.yaml 的指法 ----
# 16 组标点的键位散落在 yoyo.yaml（代数层）与测试/文档（人读表）两处。
# 改键位时只改 yoyo.yaml 会让测试和文档静默过期——2026-08-28 的 996f12c
# （冒号↔破折号互换、双引号 db→fb）就这样让增强测试红了两个月没人发现。
# 仅告警不阻断——部署本身仍然有效，只是「哪个键出哪个标点」的说法可能已失真。
echo "== 校验并击标点键位表是否与 yoyo.yaml 同步 =="
PUNCT_TEST="$SRC_DIR/scripts/test_pure_km_enhancements.py"
if command -v python3 >/dev/null 2>&1 && [ -f "$PUNCT_TEST" ]; then
  if PUNCT_OUT=$(python3 "$PUNCT_TEST" 2>&1); then
    echo "标点键位表与代数层一致"
  else
    echo "警告：并击标点键位表与 yoyo.yaml 不一致（测试/文档的键位可能已过期）"
    # grep/head 无匹配或提前关闭管道都会返回非 0，set -e + pipefail 下必须兜住
    { echo "$PUNCT_OUT" | grep -E "AssertionError" | head -3 | sed 's/^/  /'; } || true
    echo "  修复：比对 yoyo.yaml「空明拳」段的 16 条 xform/^[_+](..)$/~.../，"
    echo "        同步本测试的 punct_cases 与 docs/km_punct_guide.md、README.md 的键位表"
  fi
else
  echo "跳过（缺 python3 或测试脚本）"
fi

# ---- 2. 在 default.custom.yaml 注册新方案（幂等）----
CUSTOM="$DST_DIR/default.custom.yaml"
if [ -f "$CUSTOM" ]; then
  echo "== 注册新方案到 $CUSTOM =="
  python3 - "$CUSTOM" <<'PY'
import sys

path = sys.argv[1]
text = open(path, encoding="utf-8").read()

adds = [
    ("yoyo-pure-km", "    - {schema: yoyo-pure-km} # 纯形·统一流·空明（状态机0空格并击）\n"),
    ("yoyo-pure", "    - {schema: yoyo-pure} # 纯形·统一流·六脉（状态机0空格并击）\n"),
    ("yoyo-bm-km", "    - {schema: yoyo-bm-km} # 纯形·北冥·空明（空明拳指法）\n"),
    ("yoyo-wx-km", "    - {schema: yoyo-wx-km} # 纯形·无相·空明（空明拳指法）\n"),
    ("yoyo-user", "    - {schema: yoyo-user} # 纯形·用户词表（构建用，由 yoyo-km-tui 写入）\n"),
]
missing = [a for a in adds if f"schema: {a[0]}" not in text]
if not missing:
    print("default.custom.yaml 已包含新方案，跳过")
    sys.exit(0)

# 插入锚点：取 schema_list 里最后一个 yoyo 行；找不到则用 schema_list: 行；再找不到则追加文件尾
lines = text.splitlines(keepends=True)
anchor = None
for i, line in enumerate(lines):
    s = line.strip()
    if s.startswith("- {schema:") and any(k in s for k in ("yoyo-practice", "yoyo-wx", "yoyo-bm")):
        anchor = i
if anchor is None:
    for i, line in enumerate(lines):
        if "schema_list:" in line:
            anchor = i
            break

block = "".join(line for _, line in missing)
if anchor is None:
    text += block
else:
    lines.insert(anchor + 1, block)
    text = "".join(lines)
open(path, "w", encoding="utf-8").write(text)
print("已注册: " + ", ".join(m[0] for m in missing))
PY
else
  echo "== 警告：目标目录没有 default.custom.yaml，未注册到方案列表 =="
  echo "   请手动在 $DST_DIR/default.custom.yaml 的 schema_list 加入 yoyo-bm-km / yoyo-wx-km"
fi

# ---- 3. 构建 rime 部署产物（确保新 schema 有 build 产物）----
echo "== 构建 rime 部署产物 =="
RIME_DEPLOYER="${RIME_DEPLOYER:-rime_deployer}"
if command -v "$RIME_DEPLOYER" >/dev/null 2>&1; then
  "$RIME_DEPLOYER" --build "$DST_DIR" "$DST_DIR/build" "$DST_DIR/build" 2>&1 | grep -iE "error building|failed to save" && {
    echo "警告：部分 schema 构建失败，但 yoyo 方案可能已正常构建"
  } || true
  # 验证新 schema 构建产物
  missing_build=()
  for s in yoyo-pure-km yoyo-pure yoyo-bm-km yoyo-wx-km; do
    [ -f "$DST_DIR/build/${s}.schema.yaml" ] || missing_build+=("$s")
  done
  if [ ${#missing_build[@]} -eq 0 ]; then
    echo "已构建 yoyo-pure-km / yoyo-pure / yoyo-bm-km / yoyo-wx-km 部署产物"
  else
    echo "警告：${missing_build[*]} 构建产物缺失——方案选单可能显示英文名且无法输入中文"
    echo "  请检查 rime_deployer 输出或手动运行："
    echo "  $RIME_DEPLOYER --build $DST_DIR $DST_DIR/build $DST_DIR/build"
  fi
else
  echo "警告：未找到 $RIME_DEPLOYER，跳过构建——请手动运行 rime_deployer 或重启 fcitx5 触发自动构建"
fi

# ---- 5. 同步到 xsime(rimes) 独立数据目录 ----
# xsime 是 fcitx5 上另一个 rime 插件（/usr/lib/fcitx5/rimes.so），
# 它不读 ~/.local/share/fcitx5/rime/，而是维护自己的数据目录 ~/.local/share/rimes/data/。
# 两边文件必须分别同步，一次 fcitx5 重启后各自重新部署。
# 自动检测：rimes data 目录存在 → 同步；不存在 → 跳过（说明没装 xsime）。
# 也可强制：SKIP_RIMES=1 跳过，RIMES_DATA_DIR=/custom/path 指定路径。
if [ "${SKIP_RIMES:-0}" = "1" ]; then
  echo "== 跳过 xsime 同步（SKIP_RIMES=1） =="
elif [ -f "$RIMES_DIR/default.yaml" ] || [ -f "$RIMES_DIR/yoyo.yaml" ]; then
  echo "== 同步到 xsime(rimes) 数据目录 =="
  mkdir -p "$RIMES_DIR"
  rsync -a --ignore-times \
    --include='yoyo*.yaml' \
    --include='yoyo*.dict.yaml' \
    --include='yoyo-user.dict.yaml' \
    --include='lua/' \
    --include='lua/yoyo/' \
    --include='lua/yoyo/**' \
    --exclude='*' \
    "$SRC_DIR"/ "$RIMES_DIR"/
  echo "已同步 yoyo*.yaml + lua/yoyo/ 到 $RIMES_DIR"

  # 构建 xsime 的 rime 部署产物（如果有 rime_deployer）
  if command -v "$RIME_DEPLOYER" >/dev/null 2>&1; then
    echo "-- 构建 xsime(rimes) 部署产物 --"
    rm -rf "$RIMES_DIR/build"
    "$RIME_DEPLOYER" --build "$RIMES_DIR" "$RIMES_DIR/build" "$RIMES_DIR/build" 2>&1 | grep -iE "error building|failed to save" || true
    # 验证关键产物
    rimes_missing=()
    for s in yoyo-pure-km yoyo-user; do
      [ -f "$RIMES_DIR/build/${s}.schema.yaml" ] || rimes_missing+=("$s")
    done
    if [ ${#rimes_missing[@]} -eq 0 ]; then
      echo "xsime 构建产物就绪 (build/yoyo-pure-km, yoyo-user)"
    else
      echo "警告：xsime ${rimes_missing[*]} 构建产物缺失"
    fi
  else
    echo "跳过 xsime 构建（无 rime_deployer），xsime 启动时会自动构建"
  fi
else
  echo "== 跳过 xsime 同步（$RIMES_DIR 不存在或不是 xsime 数据目录） =="
  echo "   提示：若你安装了 xsime 犀术IME，它的数据目录应该在 $RIMES_DIR"
fi

# ---- 6. 触发 fcitx5 重新部署 ----
echo "== 触发 fcitx5 重新部署 =="
if [ "${FCITX5_NO_RESTART:-0}" = "1" ]; then
  echo "已跳过 fcitx5 重启（FCITX5_NO_RESTART=1），方案将在下次 fcitx5 重启/重新部署时生效"
elif command -v fcitx5-remote >/dev/null 2>&1 && fcitx5-remote >/dev/null 2>&1; then
  fcitx5-remote -r
  echo "已触发 fcitx5 重启——原生 rime 和 xsime 各自重新部署"
else
  echo "fcitx5 未在运行：请手动重新部署 Rime（fcitx5 托盘 → 重新部署，或 Ctrl+\` → 重新部署）"
fi

echo "== 完成 =="
