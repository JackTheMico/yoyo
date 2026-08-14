#!/usr/bin/env python3
"""
修复空明拳方案字典编码：把右手大码替换成左手大码。

原因：chord_composer 的镜像规则（y→t, u→r, ...）是全局 xform，
会把所有输入（包括编码）都替换。字典编码用原始字母，但用户输入时
被镜像规则替换了，导致打不出来。

解决方案：字典编码用左手字母（镜像后的字母），这样用户输入时
镜像规则替换后的结果和字典编码一致。
"""
import re
import sys
from pathlib import Path

# 镜像映射表（右手→左手）
MIRROR = {
    'y': 't', 'u': 'r', 'i': 'e', 'o': 'w', 'p': 'q',
    'h': 'g', 'j': 'f', 'k': 'd', 'l': 's', ';': 'a',
    'n': 'b', 'm': 'v', ',': 'c', '.': 'x', '/': 'z',
    'Y': 'T', 'U': 'R', 'I': 'E', 'O': 'W', 'P': 'Q',
    'H': 'G', 'J': 'F', 'K': 'D', 'L': 'S', ':': 'A',
    'N': 'B', 'M': 'V', '<': 'C', '>': 'X', '?': 'Z',
}

def mirror_code(code: str) -> str:
    """把编码中的右手字母替换成左手字母。"""
    result = []
    for ch in code:
        result.append(MIRROR.get(ch, ch))
    return ''.join(result)

def process_dict(filepath: str, dry_run: bool = True):
    """处理字典文件，把右手大码替换成左手大码。"""
    path = Path(filepath)
    if not path.exists():
        print(f"文件不存在: {filepath}")
        return

    lines = path.read_text(encoding='utf-8').splitlines()
    changed = 0
    new_lines = []

    for line in lines:
        if '\t' in line and not line.startswith('#'):
            parts = line.split('\t')
            if len(parts) >= 2:
                text, code = parts[0], parts[1]
                new_code = mirror_code(code)
                if new_code != code:
                    changed += 1
                    if not dry_run:
                        parts[1] = new_code
                        line = '\t'.join(parts)
        new_lines.append(line)

    print(f"{filepath}: {changed} 个编码需要替换")

    if not dry_run and changed > 0:
        # 备份原文件
        backup = path.with_suffix('.yaml.bak')
        path.rename(backup)
        path.write_text('\n'.join(new_lines) + '\n', encoding='utf-8')
        print(f"已备份到: {backup}")

def create_mirrored_dict(src: str, dst: str, dry_run: bool = True):
    """创建镜像字典：把右手大码替换成左手大码。"""
    src_path = Path(src)
    dst_path = Path(dst)
    if not src_path.exists():
        print(f"源文件不存在: {src}")
        return

    lines = src_path.read_text(encoding='utf-8').splitlines()
    changed = 0
    new_lines = []

    for line in lines:
        if '\t' in line and not line.startswith('#'):
            parts = line.split('\t')
            if len(parts) >= 2:
                text, code = parts[0], parts[1]
                new_code = mirror_code(code)
                if new_code != code:
                    changed += 1
                    parts[1] = new_code
                    line = '\t'.join(parts)
        new_lines.append(line)

    print(f"{src} -> {dst}: {changed} 个编码已镜像")

    if not dry_run and changed > 0:
        dst_path.write_text('\n'.join(new_lines) + '\n', encoding='utf-8')
        print(f"已生成: {dst}")

def main():
    dry_run = '--dry-run' in sys.argv
    files = [f for f in sys.argv[1:] if not f.startswith('--')]

    if not files:
        # 为北冥和无相生成空明拳专用字典
        pairs = [
            ('rime/yoyo-bm.dict.yaml', 'rime/yoyo-bm-km.dict.yaml'),
            ('rime/yoyo-wx.dict.yaml', 'rime/yoyo-wx-km.dict.yaml'),
            ('rime/yoyo_char_kuozhan.dict.yaml', 'rime/yoyo_char_kuozhan-km.dict.yaml'),
            ('rime/yoyo_kf.dict.yaml', 'rime/yoyo_kf-km.dict.yaml'),
        ]
        for src, dst in pairs:
            if Path(src).exists():
                create_mirrored_dict(src, dst, dry_run)
    else:
        # 处理指定的文件
        for f in files:
            if Path(f).exists():
                dst = f.replace('.dict.yaml', '-km.dict.yaml')
                create_mirrored_dict(f, dst, dry_run)

if __name__ == '__main__':
    main()
