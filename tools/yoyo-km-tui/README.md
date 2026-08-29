# yoyo-km-tui —— yoyo-pure-km 交互式加词工具

用 Rust + ratatui 写的终端工具，给「麓鸣·纯形·空明」(yoyo-pure-km) 方案交互式加词。
对应三条需求：

1. **检索反馈**：输入想加的词，程序在词库并集（yoyo-pure + yoyo_kf + yoyo-user）里查找，实时反馈「已存在（编码/来源）」或「可加入（预估编码）」。
2. **加词到合适位置**：词不在库中时，按官方公式自动编码（2字 `AbAcBbBc`、3字 `AbBbCbCc`、4字 `AbBbCbZb`，单字形码取自词表）。缺形码字会提示你手输该字编码再合码。确认后写入 `rime/yoyo-user.dict.yaml`。
3. **自动更新联动**：写入后自动重生成 `pure_dict_map.lua`（状态机映射）、`reverse_*.lua`（拼音反查 26 分片），并调用 `deploy_to_fcitx5.sh` 完成 RIME 部署。

## 关键设计决策

- **落点 = `yoyo-user.dict.yaml`**：`yoyo-pure.dict.yaml` 是 `generate_pure_dict.py` 的生成产物（会被整体重写覆盖），直接往里 append 下次重跑就没了。`yoyo-user` 通过两个 schema 的 `translator/import_tables: [yoyo-user]` 引入，**不被生成器覆盖**，是用户词的永久安全位。
- **纯 Rust 重写三个生成器**：`generate_pure_dict_map.py`、`generate_reverse_data.py` 的编码逻辑已用 Rust 重写（含 gzip 读 `base.dict.yaml.gz`、拼音去声调处理），二进制自包含，无需 python/bash 运行时。唯一不可避免的外部调用是部署（rsync / rime_deployer / fcitx5-remote 需系统工具）。
- **生成器读取词库并集**：两个 Rust 生成器读取 yoyo-pure + yoyo_kf + yoyo-user 的并集，与 RIME `import_tables` 的有效词典一致，确保新词进入 `words_4code`，状态机不会把它误判为非词而顶屏误切分。

## 构建

```bash
cd tools/yoyo-km-tui
cargo build --release        # 二进制在 target/release/yoyo-km-tui
cargo test                  # 运行 dict / encoder 单元测试
```

## 运行

```bash
# 交互模式（默认 rime 目录取仓库内 ../rime）
./target/release/yoyo-km-tui

# 非交互单条加词
./target/release/yoyo-km-tui --word 好我
```

`--rime-dir <PATH>` 可指定 rime 目录；`--no-restart` 部署时不重启 fcitx5。

## 批量加词（--batch）

从文件逐行读取词，一次性处理，**所有新词落盘后只重生成映射/反查并部署一次**（不是每条都部署）。

```bash
./target/release/yoyo-km-tui --batch words.txt
```

文件格式（UTF-8，每行一词）：

- 空行或以 `#` 开头的行：忽略（注释）。
- `词`：自动按公式编码；若某字缺形码或缺码则跳过并归类报告。
- `词<TAB>编码`：强制使用该编码，**绕过自动编码**，用于含「词库无单字形码」之字的词。

结束后打印汇总：待处理总数、已添加（词→码）、已存在跳过、缺形码跳过、长度不符跳过（仅 2–4 字可自动编码）。已存在的词不会被覆盖；文件内重复词会在同一次运行中去重。

## 交互说明

- 输入中文词：**raw 终端下 IME 不可用，请用粘贴**（Ctrl+Shift+V / Cmd+V）或 `--word` 参数。
- `Enter` 搜索 / 确认添加；`Ctrl+Q` 退出；`Esc` 返回上一步；`n` 添加后继续下一条。
- 缺形码字时，底部输入框变为「输入该字形码」，填完 `Enter` 即用该码参与合码（仅本次使用）。
- 编码若与现有码冲突，会提示「重码」但仍加入（与官方 add_km_words.py 行为一致）。

## 注意事项

- 拼音反查能否收录新词，取决于词是否出现在白霜拼音源 `base.dict.yaml.gz`；不在源中的词仍能正常打出，只是无法用 `` ` `` 反查其拼音。
- 部署默认针对 **fcitx5 / Linux**（`deploy_to_fcitx5.sh`）。macOS Squirrel / Windows Weasel 需另写部署脚本。
