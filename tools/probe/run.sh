#!/usr/bin/env bash
# 一条命令完成「同步方案文件 → 编译探针 → 部署 → 跑用例」。
#
#   bash tools/probe/run.sh                       # 跑 tools/probe/cases/*.case
#   bash tools/probe/run.sh cases/a.case          # 跑指定用例
#   PROBE_SCHEMAS="yoyo-pure-cj" bash tools/probe/run.sh
#   PROBE_FORCE_DEPLOY=1 bash tools/probe/run.sh  # 强制重编译 schema/prism
#
# 一切产物落在 .workbuddy/probe/（已 gitignore），不触碰真实输入法目录。
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
RIME_SRC="$ROOT/rime"
WORK="${PROBE_WORK_DIR:-$ROOT/.workbuddy/probe}"
USER_DIR="$WORK/userdir"
BUILD="$WORK/bin"
# 默认只部署串击版与并击版；桌面其它方案不参与编译，部署才能压在几秒内
SCHEMAS="${PROBE_SCHEMAS:-yoyo-pure-cj yoyo-pure-km}"
STAMP="$USER_DIR/.probe-stamp"

mkdir -p "$USER_DIR" "$BUILD"

# ── 1. 同步方案文件（只拷 yaml 与 lua；build/ 由部署生成）────────────────────
for f in "$RIME_SRC"/*.yaml; do
  cp -f "$f" "$USER_DIR/"
done
mkdir -p "$USER_DIR/lua"
cp -a "$RIME_SRC/lua/." "$USER_DIR/lua/"

# 共享目录 /usr/share/rime-data/default.custom.yaml 会把 schema_list 钉到 kongmingma，
# 用户目录的 default.custom.yaml 是最终覆盖点 —— 两处都要写，且 config_version 必须更大。
{
  echo "config_version: '2099-01-01'"
  echo "schema_list:"
  for s in $SCHEMAS; do
    echo "  - schema: $s"
  done
} > "$USER_DIR/default.yaml"
{
  echo "config_version: '2099-01-01'"
  echo "patch:"
  echo "  schema_list:"
  for s in $SCHEMAS; do
    echo "    - schema: $s"
  done
} > "$USER_DIR/default.custom.yaml"

# ── 2. 编译探针 ──────────────────────────────────────────────────────────────
cc -O1 -Wall -o "$BUILD/probe" "$HERE/probe.c" -lrime

# ── 3. 部署（schema/dict 有变动或方案集变化才重编；lua 运行时加载，不需重部署）──
need_deploy=0
want="schemas:$SCHEMAS"
if [[ ! -f "$STAMP" || "${PROBE_FORCE_DEPLOY:-0}" == "1" ]]; then
  need_deploy=1
elif [[ "$(cat "$STAMP" 2>/dev/null)" != "$want" ]]; then
  need_deploy=1
elif [[ -n "$(find "$RIME_SRC" -maxdepth 1 -name '*.yaml' -newer "$STAMP" -print -quit)" ]]; then
  need_deploy=1
fi

if [[ "$need_deploy" == "1" ]]; then
  echo "== 部署中（约 3-15 秒）=="
  PROBE_USER_DIR="$USER_DIR" "$BUILD/probe" --deploy
  echo "$want" > "$STAMP"
else
  echo "== 复用已有部署（$SCHEMAS；PROBE_FORCE_DEPLOY=1 可强制重编）=="
fi

# ── 4. 跑用例 ────────────────────────────────────────────────────────────────
if (( $# > 0 )); then
  cases=("$@")
else
  # 文件名前缀数字控制执行顺序
  mapfile -t cases < <(find "$HERE/cases" -name '*.case' | sort)
fi

if (( ${#cases[@]} == 0 )); then
  echo "没有用例文件（$HERE/cases/*.case）" >&2
  exit 2
fi

PROBE_USER_DIR="$USER_DIR" "$BUILD/probe" "${cases[@]}"
