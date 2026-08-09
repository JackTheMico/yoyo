#!/usr/bin/env bash
# 一键部署 yoyo 方案到 Rime 用户目录（含拼音反查组件与数据）
#
# 用法:
#   bash rime/scripts/deploy.sh                # 自动探测用户目录并部署
#   bash rime/scripts/deploy.sh --dir <路径>    # 部署到指定目录
#   bash rime/scripts/deploy.sh --regenerate    # 先重跑反查数据生成，再部署
#   bash rime/scripts/deploy.sh --dry-run       # 只预览要同步的文件，不实际写入
#
# 行为:
#   1. 从仓库 rime/ 目录同步方案文件到 Rime 用户目录
#   2. 自动排除开发产物: scripts/ *.bak* *.png *.pdf __pycache__
#   3. 覆盖前把目标目录中现有 yoyo* 文件与 lua/ 备份到 ~/.rime-yoyo-backup-<时间戳>/
#   4. 部署后提示重新部署与验证方法
#
# 依赖: rsync（缺失时退化为 cp -r 全量拷贝）
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$(dirname "$SCRIPT_DIR")"          # 仓库根下的 rime/ 源目录
REPO_ROOT="$(dirname "$SRC_DIR")"           # 仓库根（跑生成脚本用）

TARGET=""
REGENERATE=0
DRY_RUN=0

usage() {
  cat <<'EOF'
一键部署 yoyo 方案到 Rime 用户目录（含拼音反查组件与数据）

用法:
  bash rime/scripts/deploy.sh                # 自动探测用户目录并部署
  bash rime/scripts/deploy.sh --dir <路径>    # 部署到指定目录
  bash rime/scripts/deploy.sh --regenerate    # 先重跑反查数据生成，再部署
  bash rime/scripts/deploy.sh --dry-run       # 只预览要同步的文件，不实际写入

行为:
  1. 从仓库 rime/ 目录同步方案文件到 Rime 用户目录
  2. 自动排除开发产物: scripts/ *.bak* *.png *.pdf __pycache__（不同步，也不删除目标已有文件）
  3. 覆盖前把目标目录中现有 yoyo* 文件与 lua/ 备份到 ~/.rime-yoyo-backup-<时间戳>/
  4. 部署后提示重新部署与验证方法

依赖: rsync（缺失时退化为 cp -r 全量拷贝）
EOF
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir) TARGET="${2:?--dir 需要参数路径，例如 --dir ~/.local/share/fcitx5/rime}"; shift 2 ;;
    --regenerate) REGENERATE=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h|--help) usage ;;
    *) echo "未知参数: $1" >&2; usage ;;
  esac
done

probe_target() {
  local candidates=(
    "${XDG_DATA_HOME:-$HOME/.local/share}/fcitx5/rime"   # fcitx5 (Linux)
    "$HOME/.config/fcitx/rime"                            # fcitx4 (Linux)
    "$HOME/.config/ibus/rime"                             # ibus (Linux)
    "$HOME/Library/Rime"                                  # 鼠须管 (macOS)
  )
  for d in "${candidates[@]}"; do
    if [[ -d "$d" ]]; then echo "$d"; return 0; fi
  done
  return 1
}

if [[ -z "$TARGET" ]]; then
  if TARGET="$(probe_target)"; then
    echo "探测到 Rime 用户目录: $TARGET"
  else
    echo "未探测到 Rime 用户目录（fcitx5/fcitx/ibus/鼠须管 均未找到）。" >&2
    echo "请用 --dir <Rime用户目录> 指定，例如:" >&2
    echo "  bash rime/scripts/deploy.sh --dir ~/.local/share/fcitx5/rime" >&2
    exit 1
  fi
fi

# 统一去掉尾斜杠
TARGET="${TARGET%/}"

echo "源目录:   $SRC_DIR"
echo "目标目录: $TARGET"
[[ $DRY_RUN -eq 1 ]] && echo "模式:     dry-run（只预览，不写入）"

# 1. 可选: 重跑反查数据生成（词库更新/重排键位后必须）
if [[ $REGENERATE -eq 1 ]]; then
  echo ""
  echo "==> 重跑反查数据生成 (generate_reverse_data.py)"
  if [[ $DRY_RUN -eq 1 ]]; then
    echo "    (dry-run 跳过)"
  else
    (cd "$REPO_ROOT" && python3 rime/scripts/generate_reverse_data.py)
  fi
fi

# 2. 备份目标目录中将被覆盖的方案文件
TS="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$HOME/.rime-yoyo-backup-$TS"
if [[ -d "$TARGET" && $DRY_RUN -eq 0 ]]; then
  mkdir -p "$BACKUP_DIR"
  if compgen -G "$TARGET/yoyo"* > /dev/null || [[ -d "$TARGET/lua" ]] || [[ -f "$TARGET/default.yaml" ]]; then
    echo ""
    echo "==> 备份现有方案文件到 $BACKUP_DIR"
    cp -r "$TARGET"/yoyo* "$BACKUP_DIR"/ 2>/dev/null || true
    [[ -d "$TARGET/lua" ]] && cp -r "$TARGET/lua" "$BACKUP_DIR/" || true
    [[ -f "$TARGET/default.yaml" ]] && cp "$TARGET/default.yaml" "$BACKUP_DIR/" || true
  else
    rmdir "$BACKUP_DIR" 2>/dev/null || true
  fi
fi

# 3. 同步方案文件
EXCLUDES=(--exclude 'scripts/' --exclude '*.bak*' --exclude '*.png' --exclude '*.pdf' --exclude '__pycache__')
echo ""
echo "==> 同步方案文件"
if command -v rsync > /dev/null 2>&1; then
  if [[ $DRY_RUN -eq 1 ]]; then
    rsync -avn "${EXCLUDES[@]}" "$SRC_DIR/" "$TARGET/"
  else
    rsync -a "${EXCLUDES[@]}" "$SRC_DIR/" "$TARGET/"
    echo "    完成。排除的开发产物: scripts/ *.bak* *.png *.pdf __pycache__"
    echo "    注：不同步这些文件，也不删除目标目录中已有的此类文件（仅备份保护 yoyo*/lua/default.yaml）"
  fi
else
  echo "    未找到 rsync，退化为 cp -r 全量拷贝（含 scripts/ 等开发文件，无害）"
  if [[ $DRY_RUN -eq 1 ]]; then
    echo "    (dry-run: 将拷贝整个 $SRC_DIR 到 $TARGET)"
  else
    mkdir -p "$TARGET"
    cp -r "$SRC_DIR/." "$TARGET/"
    echo "    完成（cp 回退模式，全量拷贝）"
  fi
fi

# 4. 收尾提示
echo ""
echo "========================================"
echo "部署完成。请执行:"
echo "  1) 重新部署 Rime（fcitx5 托盘点“重新部署”，或运行: fcitx5 -r）"
echo "  2) 验证反查: 切换 yoyo-yx / yoyo-yx-hm 方案，按 \` 后输入 hanmei"
echo "     应出「寒梅」候选，注释 sHqL"
if [[ -d "$BACKUP_DIR" ]]; then
  echo "旧文件备份: $BACKUP_DIR（确认无误后可删除）"
fi
echo "========================================"
