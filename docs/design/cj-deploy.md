# 串击版部署与共存（issue #58）

`yoyo-pure-cj`（手机串击）与 `yoyo-pure-km`（桌面并击）**共存于同一 Rime 用户目录**，
互不覆盖，随时切换。本文是从零可复现的步骤与已验证的共存条件。

自动化验证：`python3 rime/scripts/test_cj_coexist.py`
（全新隔离目录 → 部署两方案 → 39 个真引擎用例 → 再部署一次验幂等）。

## 1. 为什么能共存：三份产物，两两不撞

| 产物 | 归属 | 说明 |
|---|---|---|
| `build/yoyo-pure.table.bin` | **共用** | 两方案都 `dictionary: yoyo-pure`，同一个词典只编一份表 |
| `build/yoyo-pure-cj.prism.bin` | 串击版独有 | prism 名取自 `schema_id`，与并击版不同名 |
| `build/yoyo-pure-km.prism.bin` | 并击版独有 | 同上 |
| `build/yoyo-user.table.bin` | **共用** | 用户加词表，两方案都 `import_tables: [yoyo-user]` |

关键点：**prism 必须跟 schema_id 一致**。若两个方案用了同一个 prism 名，后部署的会覆盖
前一个，症状是「切换方案后出的字变了」——因为 prism 决定了「哪些拼写合法」，而两套
方案的码元空间不同（并击版含 `_` `+` 前缀，串击版只有 60 个净码元）。

实测结论（`test_cj_coexist.py` 输出）：

```
prism：['yoyo-pure-cj.prism.bin', 'yoyo-pure-km.prism.bin', 'yoyo-user.prism.bin']
table：['yoyo-pure.table.bin']
用例通过 39 / 失败 0     ← 两方案的用例在同一目录里都跑绿
```

## 2. 从零部署（桌面 Rime / fcitx5-rime）

```bash
RIME_USER=~/.local/share/fcitx5/rime      # fcitx5；ibus 用 ~/.config/ibus/rime

mkdir -p "$RIME_USER/lua/yoyo/data" "$RIME_USER/themes"

# 方案文件（两者都要，可只装其一）
cp rime/yoyo.yaml rime/yoyo-pure-cj.schema.yaml rime/yoyo-pure-km.schema.yaml \
   rime/yoyo-pure.dict.yaml rime/yoyo-user.dict.yaml rime/yoyo-user.schema.yaml \
   "$RIME_USER/"

# Lua 组件与数据（三种 data 文件都被两方案共用或独用，一起放即可）
cp rime/lua/yoyo/*.lua            "$RIME_USER/lua/yoyo/"
cp rime/lua/yoyo/data/*.lua       "$RIME_USER/lua/yoyo/data/"

# 方案列表
cat > "$RIME_USER/default.custom.yaml" <<'YAML'
patch:
  schema_list:
    - schema: yoyo-pure-km
    - schema: yoyo-pure-cj
YAML
```

然后重新部署（fcitx5-rime：右键托盘 →「重新部署」；或 `rime_deployer --build "$RIME_USER"`）。
部署完成后 `Control+~` / `Control+Tab` 在方案选单里切换，两方案互不影响。

## 3. 手机（LyraIME）

LyraIME 的用户目录不是 `/sdcard/rime`，而是**用户设置里可改的「用户数据目录」**，
默认 `AppPrefs.kt:486` → `DataManager.defaultDataDir` = `/sdcard/Documents/LyraIME`。
其下再分三处（`DataManager.kt:61-84`）：

| 子目录 | 放什么 | 依据 |
|---|---|---|
| `<用户数据目录>/themes/` | 主题 `.lua` | `userThemesDir`，跨方案包共用 |
| `<用户数据目录>/shared/` | 方案文件、`lua/`、`build/` | 未启用方案包时 `userDataDir` 回退到 `sharedDataDir` |
| `<用户数据目录>/<方案包ID>/` | 同上（启用方案包时） | `userDataDir = userDataBaseDir/pkgId` |

所以：

```
/sdcard/Documents/LyraIME/
 ├── themes/yoyo-pure-cj.lua        ← 本仓库 rime/lyraime/themes/yoyo-pure-cj.lua
 └── shared/
      ├── yoyo-pure-cj.schema.yaml
      ├── yoyo-pure-km.schema.yaml
      ├── yoyo.yaml / yoyo-pure.dict.yaml / yoyo-user*.yaml
      └── lua/yoyo/{cj_parser,cj_popping,pure_popping}.lua
          lua/yoyo/data/cj_{decision,keymap,quickbar}.lua
```

应用内：主题选「麓鸣·纯形·串击」，方案选单切到「麓鸣·纯形·串击」。
`librime-lua` 已编进客户端，用户目录下的 `lua/` 会被加载，与桌面同构。

## 4. 用户加词表落位

`yoyo-user.dict.yaml` 被两个方案 `import_tables`，所以**加词只加一处**：

```yaml
# rime/yoyo-user.dict.yaml 正文（... 之后），制表符分隔
家乡话	jeug	1000
```

改完必须重新部署（`yoyo-user.table.bin` 才会重编）。

一处已知差异：串击版的状态机不读用户词表，空格定界时若缓冲 ≥ 4 码且其 4 位前缀不是
本表已知词，**不猜**，直接放行给 Rime 的 translator —— 所以 `jeug` 能正确出「家乡话」，
不会被按 2+2 拆成「宏话」。并击版则靠 `pure_dict_map` 的静态表，两方案在这一点上等价。

## 5. 验证清单

| 命令 | 覆盖 |
|---|---|
| `bash tools/probe/run.sh` | 真引擎黑盒：39 用例 / 134 键，两方案同时跑 |
| `python3 rime/scripts/test_cj_coexist.py` | 从零部署、产物不覆盖、幂等、README 段落 |
| `lua rime/scripts/test_cj_parser.lua` | 11 万码位全量自洽 + 主单/主词两视图 |
| `python3 rime/scripts/test_cj_keymap.py` | 60 码元键位映射数据 |
| `python3 rime/scripts/test_cj_decision_data.py` | 判定数据与字典逐条对账 |
| `python3 rime/scripts/test_cj_views.py` | 2,655 个双类 2 码位的两类首选与次选 |
| `python3 rime/scripts/test_cj_quickbar.py` | 快捷字条 12 字与字频口径 |
| `python3 rime/scripts/test_cj_theme.py` | 键盘配置与映射数据逐键对齐 |

## 6. 卸载其一

删掉对应 `*.schema.yaml` 与 `default.custom.yaml` 里的那一行即可。注意：
删 `yoyo-pure-cj` 时不要顺手删 `yoyo-pure.table.bin` 的来源（`yoyo-pure.dict.yaml`），
并击版还要用它。
