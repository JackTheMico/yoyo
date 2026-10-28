#!/bin/bash
# 反查候选注释宽度实测：建隔离副本 → 编译 → 部署 → 跑反查
#
# 用法:
#   bash research/run_width_probe.sh '`de'          # 显示字根（默认）
#   bash research/run_width_probe.sh '`de' no_zigen # 纯码
#
# 依赖: librime (rime_api.h + -lrime)、gcc、rime_deployer
# 不碰用户真实 rime 目录，副本建在 $HOME/tmp/yoyo-probe。

set -e

REPO=$(cd "$(dirname "$0")/.." && pwd)
RIME=$REPO/rime
T=${YOYO_PROBE_DIR:-$HOME/tmp/yoyo-probe}
BIN=$T/probe_candidate_width

if ! pkg-config --exists rime; then
  echo "缺少 librime：请先安装 librime 开发包（rime_api.h）" >&2
  exit 1
fi

# ── 建副本（只留 yoyo-pure，避免编译无关的大词库）──
if [ ! -f "$T/build/yoyo-pure.prism.bin" ] || [ "${REBUILD:-0}" = "1" ]; then
  /usr/bin/python3 -S -c "
import shutil, os, sys
p = sys.argv[1]
if os.path.exists(p): shutil.rmtree(p)
" "$T" 2>/dev/null || true

  mkdir -p "$T"
  cp -a "$RIME"/*.yaml "$T"/
  cp -a "$RIME"/lua "$T"/

  cat > "$T/default.yaml" <<'YAML'
config_version: '2026-10-28'

schema_list:
  - schema: yoyo-pure

menu:
  page_size: 6
  alternative_select_labels: [ ⒈, ⒉, ⒊, ⒋, ⒌, ⒍, ⒎, ⒏, ⒐, ⒑ ]

switcher:
  caption: 「方案选单」
  hotkeys:
    - Control+Tab
YAML

  for src in "$RIME/opencc" /usr/share/rime-data/opencc "$HOME/.local/share/fcitx5/rime/opencc"; do
    if [ -d "$src" ]; then cp -a "$src" "$T"/; break; fi
  done

  echo "构建副本 $T ..."
  mkdir -p "$T/build"
  rime_deployer --build "$T" "$T/build" "$T/build"
fi

# ── 编译探针 ──
if [ ! -x "$BIN" ] || [ "$REPO/research/probe_candidate_width.c" -nt "$BIN" ]; then
  gcc -O1 -o "$BIN" "$REPO/research/probe_candidate_width.c" -lrime
fi

# ── 跑 ──
KEYS=${1:-}
if [ -z "$KEYS" ]; then KEYS='`de'; fi
exec "$BIN" "$T" yoyo-pure "$KEYS" ${2:+"$2"}
