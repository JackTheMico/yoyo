//! TUI 应用状态机（TEA：Model）。
//!
//! 流程：输入词 → 检索反馈 → 编码（缺码字手输）→ 确认加词 →
//! 重生成映射/反查 → 部署。所有重活（编码、生成、部署）封在别的深模块里，
//! 这里只做编排与状态迁移。

use crate::dict::{Dict, Entry};
use crate::encoder::{self, EncodeResult};
use crate::mapgen;
use crate::reversegen;
use crate::deploy;
use crate::userdict::UserDict;
use crossterm::event::{self, Event, KeyCode, KeyEvent, KeyEventKind, KeyModifiers};
use ratatui::backend::CrosstermBackend;
use ratatui::Terminal;
use std::collections::{HashMap, HashSet};
use std::io::Stdout;
use std::path::{Path, PathBuf};

pub struct Config {
    pub rime_dir: PathBuf,
    pub user_dict: PathBuf,
    pub no_restart: bool,
}

pub enum Phase {
    Input,
    BatchInput,
    BatchReview { items: Vec<BatchItem>, cursor: usize },
    Found(String, String, String),
    ConfirmAdd {
        text: String,
        code: String,
        conflict: bool,
    },
    /// 加空格并击简词：第一步收集「实际按键串」
    BriefChord,
    /// 第二步：按键串已算出 % 码，收集要绑定的词
    BriefWord { code: String },
    /// 第三步：确认添加空格并击简词
    ConfirmBrief { code: String, word: String },
    NeedChar {
        text: String,
        ch: char,
    },
    Done(String),
    Message(String),
}

/// 批量加词结果汇总（供 CLI 打印）。
pub struct BatchSummary {
    pub total: usize,
    pub added: Vec<(String, String)>,
    pub skipped_exists: Vec<String>,
    pub skipped_missing: Vec<(String, char)>,
    pub skipped_len: Vec<(String, usize)>,
}

/// 交互批量核对：每个词的在库状态。
#[derive(Clone)]
pub enum ItemStatus {
    Exists(String),
    New(String),
    MissingChar(char),
    UnsupportedLen(usize),
}

/// 交互批量核对列表中的一行。
#[derive(Clone)]
pub struct BatchItem {
    pub text: String,
    pub status: ItemStatus,
    pub selected: bool,
}

pub struct App {
    pub cfg: Config,
    pub dict: Dict,
    user: UserDict,
    pub input: String,
    pub batch_input: String,
    pub pending: String,
    pub manual: HashMap<char, String>,
    pub phase: Phase,
    pub log: Vec<String>,
    pub should_quit: bool,
}

/// 把「实际并按下的空格并击按键串」（不含空格触发符）算成 `%` 简词码。
///
/// 调用 `scripts/chord_utils.py keys-to-code`，复用与 chord_composer 一致的代数：
///   - Ok(Some(code))：算出合法 3 字符 % 码
///   - Ok(None)      ：算出但非合法空格并击简词码（两右手键等，4 字符）
///   - Err(msg)      ：按键串非法（含字母表外字符）或 python 调用失败
fn compute_brief_code(keys: &str, rime_dir: &Path) -> Result<Option<String>, String> {
    let script = rime_dir.join("scripts").join("chord_utils.py");
    let out = std::process::Command::new("python3")
        .arg(&script)
        .arg("keys-to-code")
        .arg(keys)
        .output();
    match out {
        Ok(o) => {
            if o.status.success() {
                let code = String::from_utf8_lossy(&o.stdout).trim().to_string();
                if code.is_empty() {
                    Ok(None)
                } else {
                    Ok(Some(code))
                }
            } else {
                let stderr = String::from_utf8_lossy(&o.stderr).trim().to_string();
                Err(if stderr.is_empty() {
                    format!("按键串 {keys:?} 不能构成合法空格并击简词码")
                } else {
                    stderr
                })
            }
        }
        Err(e) => Err(format!("调用 chord_utils.py 失败：{e}（需 python3 在 PATH）")),
    }
}

impl App {
    pub fn new(cfg: Config) -> color_eyre::Result<Self> {
        let user = cfg.user_dict.clone();
        let ud = UserDict::open(&user)?; // 确保存在后再纳入并集
        let pure = cfg.rime_dir.join("yoyo-pure.dict.yaml");
        // 核心词典：优先 yoyo-pure，缺失时回退 yoyo-bm。
        // yoyo_kf 不纳入（用户未使用）。
        let core = if pure.exists() {
            pure
        } else {
            cfg.rime_dir.join("yoyo-bm.dict.yaml")
        };
        let paths: Vec<&Path> = vec![core.as_path(), user.as_path()];
        let dict = Dict::load(&paths)?;
        let count = dict.entries().len();
        Ok(Self {
            cfg,
            dict,
            user: ud,
            input: String::new(),
            batch_input: String::new(),
            pending: String::new(),
            manual: HashMap::new(),
            phase: Phase::Input,
            log: vec![format!(
                "已加载词库并集: {} 条（yoyo-pure + yoyo-user）",
                count
            )],
            should_quit: false,
        })
    }

    fn merged_char_codes(&self) -> HashMap<char, String> {
        let mut m = self.dict.char_code.clone();
        for (c, code) in &self.manual {
            m.insert(*c, code.clone());
        }
        m
    }

    fn search(&mut self) {
        let w = self.input.trim().to_string();
        if w.is_empty() {
            return;
        }
        self.pending = w.clone();
        if let Some(e) = self.dict.contains(&w) {
            self.phase = Phase::Found(w, e.clean.clone(), e.source.clone());
            return;
        }
        self.reencode();
    }

    fn reencode(&mut self) {
        let map = self.merged_char_codes();
        match encoder::encode(&self.pending, &map) {
            EncodeResult::Code(c) => {
                let conflict = self.dict.has_code(&c);
                self.phase = Phase::ConfirmAdd {
                    text: self.pending.clone(),
                    code: c,
                    conflict,
                };
            }
            EncodeResult::MissingChar(ch) => {
                self.phase = Phase::NeedChar {
                    text: self.pending.clone(),
                    ch,
                };
            }
            EncodeResult::UnsupportedLen(n) => {
                self.phase = Phase::Message(format!(
                    "「{}」为 {} 字，仅支持 2–4 字词自动编码",
                    self.pending, n
                ));
            }
        }
    }

    fn reset_input(&mut self) {
        self.input.clear();
        self.pending.clear();
        self.manual.clear();
        self.phase = Phase::Input;
    }

    fn perform_add(&mut self, text: &str, code: &str) -> color_eyre::Result<()> {
        self.user.append(text, code, 100.0)?;
        self.log
            .push(format!("✓ 写入 yoyo-user.dict.yaml: {} → {}", text, code));
        self.dict.entries.push(Entry {
            text: text.to_string(),
            raw: code.to_string(),
            clean: code.to_string(),
            weight: 100.0,
            source: "yoyo-user".into(),
        });
        self.rebuild()?;
        self.log.push("✓ 部署完成".into());
        Ok(())
    }

    /// 添加空格并击简词（% 前缀）到手动段：写 yoyo-user 手动段 + 同步内存 +
    /// 重生成映射/反查 + 部署。冲突保护由调用方（compute+has_code）保证。
    fn perform_add_brief(&mut self, text: &str, code: &str) -> color_eyre::Result<()> {
        self.user.append_brief(text, code, 100.0)?;
        self.log
            .push(format!("✓ 写入手动段 yoyo-user.dict.yaml: {} → {}", text, code));
        self.dict.note_brief(text, code);
        self.rebuild()?;
        self.log.push("✓ 部署完成".into());
        Ok(())
    }

    /// CLI：--brief <词> <按键串>。算出 % 码、查冲突、写手动段、重生成+部署。
    /// 冲突/非法返回 Err（调用方非零退出并打印原因）。
    pub fn add_brief_cli(&mut self, word: &str, keys: &str) -> color_eyre::Result<String> {
        let code = match compute_brief_code(keys, &self.cfg.rime_dir) {
            Ok(Some(c)) => c,
            Ok(None) => {
                return Err(color_eyre::eyre::eyre!(
                    "按键串 {keys:?} 不能构成合法空格并击简词码（需 %+2字符，且为合法左右手并击）"
                ))
            }
            Err(e) => return Err(color_eyre::eyre::eyre!(e)),
        };
        if let Some(owner) = self.dict.word_for_code(&code) {
            return Err(color_eyre::eyre::eyre!(
                "该码 {} 已被「{}」占用，无法添加（冲突保护）",
                code,
                owner
            ));
        }
        self.perform_add_brief(word, &code)?;
        Ok(format!(
            "✅ 已添加空格并击简词 {} → {}（手动段，重生成+部署完成）",
            word, code
        ))
    }

    /// 批量加空格并击简词（--batch-brief）：文件每行 `按键串\t词`。
    /// 合法且未冲突的词收集后统一写手动段 + 一次重生成 + 部署。
    pub fn add_briefs_batch(&mut self, file: &Path) -> color_eyre::Result<BatchSummary> {
        use std::collections::HashMap;
        let content = std::fs::read_to_string(file)?;
        let mut to_add: Vec<(String, String)> = Vec::new();
        let mut skipped_exists: Vec<String> = Vec::new();
        let mut skipped_missing: Vec<(String, char)> = Vec::new();
        // 已占用码 -> 占用词（初始化自现有 % 简词；批量内后续行也会登记，便于批内去重提示）
        let mut taken: HashMap<String, String> = self
            .dict
            .entries()
            .iter()
            .filter(|e| e.raw.starts_with('%'))
            .map(|e| (e.raw.clone(), e.text.clone()))
            .collect();

        let mut total = 0;
        for raw in content.lines() {
            let line = raw.trim();
            if line.is_empty() || line.starts_with('#') {
                continue;
            }
            total += 1;
            let parts: Vec<&str> = line.split('\t').collect();
            if parts.len() < 2 {
                skipped_missing.push((line.to_string(), '?'));
                continue;
            }
            let (keys, word) = (parts[0].trim(), parts[1].trim());
            match compute_brief_code(keys, &self.cfg.rime_dir) {
                Ok(Some(code)) => {
                    if let Some(owner) = taken.get(&code) {
                        skipped_exists.push(format!("{}（码{}被「{}」占用）", word, code, owner));
                    } else {
                        taken.insert(code.clone(), word.to_string());
                        to_add.push((word.to_string(), code));
                    }
                }
                _ => skipped_missing.push((format!("{}（按键{}非法）", word, keys), '?')),
            }
        }

        if !to_add.is_empty() {
            for (w, c) in &to_add {
                self.user.append_brief(w, c, 100.0)?;
                self.dict.note_brief(w, c);
                self.log
                    .push(format!("✓ 写入手动段 yoyo-user.dict.yaml: {} → {}", w, c));
            }
            self.rebuild()?;
            self.log.push("✓ 部署完成".into());
        }

        Ok(BatchSummary {
            total,
            added: to_add,
            skipped_exists,
            skipped_missing: skipped_missing
                .into_iter()
                .map(|(s, _)| (s, '?'))
                .collect(),
            skipped_len: Vec::new(),
        })
    }

    /// 重生成状态机映射 + 拼音反查 + 部署（所有新词落盘后只跑一次）。
    fn rebuild(&mut self) -> color_eyre::Result<()> {
        let map_path = self.cfg.rime_dir.join("lua/yoyo/data/pure_dict_map.lua");
        let st = mapgen::generate(&self.dict.entries, &map_path)?;
        self.log.push(format!(
            "✓ 状态机映射 pure_dict_map.lua: char_first={} word_first={} 4码词={} 3码字={} '简词={} 空格简词={}",
            st.char_first, st.word_first, st.words_4code, st.chars_3code,
            st.brief_map, st.space_brief_map
        ));

        let rev_dir = self.cfg.rime_dir.join("lua/yoyo/data");
        let rs = reversegen::generate(&self.cfg.rime_dir, &self.dict.entries, &rev_dir)?;
        self.log.push(format!(
            "✓ 拼音反查 reverse_*.lua: 拼音键={} 分片={}",
            rs.keys, rs.written
        ));

        let out = deploy::deploy(&self.cfg.rime_dir, self.cfg.no_restart)?;
        for l in out.lines() {
            if !l.trim().is_empty() {
                self.log.push(format!("  {l}"));
            }
        }
        Ok(())
    }

    /// 批量加词（--batch）：从文件逐行读取，已存在的跳过；可自动编码的写入
    /// yoyo-user 后统一重生成+部署一次。每行格式：`词` 或 `词\t编码`
    /// （含 \t编码 时强制使用该码，绕过自动编码，用于缺形码字的词）。
    pub fn add_words_batch(&mut self, file: &Path) -> color_eyre::Result<BatchSummary> {
        let content = std::fs::read_to_string(file)?;
        let mut to_add: Vec<(String, String)> = Vec::new();
        let mut skipped_exists: Vec<String> = Vec::new();
        let mut skipped_missing: Vec<(String, char)> = Vec::new();
        let mut skipped_len: Vec<(String, usize)> = Vec::new();
        let mut added_set: HashSet<String> = HashSet::new();
        for raw in content.lines() {
            let line = raw.trim();
            if line.is_empty() || line.starts_with('#') {
                continue;
            }
            let (word, forced) = match line.split_once('\t') {
                Some((w, c)) => (w.trim().to_string(), Some(c.trim().to_string())),
                None => (line.to_string(), None),
            };
            if word.is_empty() {
                continue;
            }
            if self.dict.contains(&word).is_some() || added_set.contains(&word) {
                skipped_exists.push(word);
                continue;
            }
            match forced {
                Some(code) => {
                    added_set.insert(word.clone());
                    to_add.push((word, code));
                }
                None => match encoder::encode(&word, &self.dict.char_code) {
                    EncodeResult::Code(c) => {
                        added_set.insert(word.clone());
                        to_add.push((word, c));
                    }
                    EncodeResult::MissingChar(ch) => skipped_missing.push((word, ch)),
                    EncodeResult::UnsupportedLen(n) => skipped_len.push((word, n)),
                },
            }
        }
        let total = skipped_exists.len() + skipped_missing.len() + skipped_len.len() + to_add.len();
        if !to_add.is_empty() {
            for (w, c) in &to_add {
                self.user.append(w, c, 100.0)?;
                self.dict.entries.push(Entry {
                    text: w.clone(),
                    raw: c.clone(),
                    clean: c.clone(),
                    weight: 100.0,
                    source: "yoyo-user".into(),
                });
            }
            self.rebuild()?;
        }
        Ok(BatchSummary {
            total,
            added: to_add,
            skipped_exists,
            skipped_missing,
            skipped_len,
        })
    }

    fn do_add(&mut self) {
        let (text, code) = match &self.phase {
            Phase::ConfirmAdd { text, code, .. } => (text.clone(), code.clone()),
            _ => return,
        };
        match self.perform_add(&text, &code) {
            Ok(()) => {
                self.phase = Phase::Done(format!(
                    "✓ 已添加「{}」→ {} 并完成重生成与部署",
                    text, code
                ))
            }
            Err(e) => self.phase = Phase::Message(format!("添加失败: {e}")),
        }
    }

    /// 非交互单条加词（--word）
    pub fn add_word_cli(&mut self, w: &str) -> color_eyre::Result<()> {
        if self.dict.contains(w).is_some() {
            println!("「{}」已存在于词库，跳过。", w);
            return Ok(());
        }
        self.pending = w.to_string();
        let map = self.merged_char_codes();
        match encoder::encode(w, &map) {
            EncodeResult::Code(c) => {
                self.perform_add(w, &c)?;
                println!("已添加「{}」→ {} 并完成重生成与部署。", w, c);
                Ok(())
            }
            EncodeResult::MissingChar(ch) => {
                eprintln!(
                    "「{}」中『{}』缺形码，无法自动编码；请用交互模式手动补码。",
                    w, ch
                );
                std::process::exit(2);
            }
            EncodeResult::UnsupportedLen(n) => {
                eprintln!("「{}」为 {} 字，仅支持 2–4 字词自动编码。", w, n);
                std::process::exit(2);
            }
        }
    }

    /// 解析批量输入缓冲（按空白/逗号/换行分词，去重），逐词检索给出在库状态，
    /// 进入核对列表。每条「新词（可自动编码）」默认选中，已存在/缺码字/长度不符默认不选中。
    fn start_batch_review(&mut self) {
        let words: Vec<String> = self
            .batch_input
            .split(|c: char| c.is_whitespace() || c == ',')
            .map(|w| w.trim().to_string())
            .filter(|w| !w.is_empty())
            .collect();
        let mut seen = HashSet::new();
        let mut items: Vec<BatchItem> = Vec::new();
        for w in words {
            if !seen.insert(w.clone()) {
                continue;
            }
            let status = if let Some(e) = self.dict.contains(&w) {
                ItemStatus::Exists(e.clean.clone())
            } else {
                match encoder::encode(&w, &self.dict.char_code) {
                    EncodeResult::Code(c) => ItemStatus::New(c),
                    EncodeResult::MissingChar(ch) => ItemStatus::MissingChar(ch),
                    EncodeResult::UnsupportedLen(n) => ItemStatus::UnsupportedLen(n),
                }
            };
            let selected = matches!(status, ItemStatus::New(_));
            items.push(BatchItem {
                text: w,
                status,
                selected,
            });
        }
        if items.is_empty() {
            self.log.push("批量输入为空，无可检索词。".into());
            return;
        }
        self.phase = Phase::BatchReview { items, cursor: 0 };
    }

    fn cursor_down(&mut self) {
        if let Phase::BatchReview { items, cursor } = &mut self.phase {
            if *cursor + 1 < items.len() {
                *cursor += 1;
            }
        }
    }

    fn cursor_up(&mut self) {
        if let Phase::BatchReview { cursor, .. } = &mut self.phase {
            if *cursor > 0 {
                *cursor -= 1;
            }
        }
    }

    fn cursor_top(&mut self) {
        if let Phase::BatchReview { cursor, .. } = &mut self.phase {
            *cursor = 0;
        }
    }

    fn cursor_bottom(&mut self) {
        if let Phase::BatchReview { items, cursor } = &mut self.phase {
            *cursor = items.len().saturating_sub(1);
        }
    }

    fn toggle_at_cursor(&mut self) {
        if let Phase::BatchReview { items, cursor } = &mut self.phase {
            if let Some(it) = items.get_mut(*cursor) {
                it.selected = !it.selected;
            }
        }
    }

    /// a：切换「所有可加新词」的选中态（全选↔全不选）。
    fn toggle_all_new(&mut self) {
        if let Phase::BatchReview { items, .. } = &mut self.phase {
            let any_unsel = items
                .iter()
                .any(|it| matches!(it.status, ItemStatus::New(_)) && !it.selected);
            for it in items.iter_mut() {
                if matches!(it.status, ItemStatus::New(_)) {
                    it.selected = any_unsel;
                }
            }
        }
    }

    /// 把核对列表中选中的可加词（New）写入 yoyo-user，统一重生成+部署一次。
    /// 已存在词(Eixists)、缺码字、长度不符即使被选中也跳过并提示。
    fn add_selected(&mut self) -> color_eyre::Result<()> {
        let items = match &self.phase {
            Phase::BatchReview { items, .. } => items.clone(),
            _ => return Ok(()),
        };
        let mut to_add: Vec<(String, String)> = Vec::new();
        let mut skipped_missing: Vec<(String, char)> = Vec::new();
        let mut skipped_len: Vec<(String, usize)> = Vec::new();
        for it in &items {
            if !it.selected {
                continue;
            }
            match &it.status {
                ItemStatus::New(c) => to_add.push((it.text.clone(), c.clone())),
                ItemStatus::MissingChar(ch) => skipped_missing.push((it.text.clone(), *ch)),
                ItemStatus::UnsupportedLen(n) => skipped_len.push((it.text.clone(), *n)),
                ItemStatus::Exists(_) => {}
            }
        }
        if to_add.is_empty() {
            self.phase = Phase::Message("没有选中可添加的新词（已存在的词无需加）。".into());
            return Ok(());
        }
        for (w, c) in &to_add {
            self.user.append(w, c, 100.0)?;
            self.dict.entries.push(Entry {
                text: w.clone(),
                raw: c.clone(),
                clean: c.clone(),
                weight: 100.0,
                source: "yoyo-user".into(),
            });
        }
        self.rebuild()?;
        let added_list: Vec<String> = to_add.iter().map(|(w, c)| format!("{}→{}", w, c)).collect();
        self.log.push(format!(
            "批量添加完成({}): {}",
            to_add.len(),
            added_list.join(", ")
        ));
        self.phase = Phase::Done(format!(
            "✓ 批量添加 {} 个词并完成重生成与部署",
            to_add.len()
        ));
        Ok(())
    }

    pub fn on_key(&mut self, key: KeyEvent) {
        let ctrl_q = key.code == KeyCode::Char('q')
            && key.modifiers.contains(KeyModifiers::CONTROL);
        match self.phase {
            Phase::Input => match key.code {
                _ if ctrl_q => self.should_quit = true,
                KeyCode::Char('b') if key.modifiers.contains(KeyModifiers::CONTROL) => {
                    self.phase = Phase::BatchInput;
                }
                KeyCode::Char('k') if key.modifiers.contains(KeyModifiers::CONTROL) => {
                    self.input.clear();
                    self.phase = Phase::BriefChord;
                }
                KeyCode::Enter => self.search(),
                KeyCode::Backspace => {
                    self.input.pop();
                }
                KeyCode::Char(c) => self.input.push(c),
                _ => {}
            },
            Phase::BriefChord => match key.code {
                _ if ctrl_q => self.should_quit = true,
                KeyCode::Enter => {
                    let keys = self.input.trim().to_string();
                    if keys.is_empty() {
                        self.phase = Phase::Message("请输入并击按键串（如 er:）".into());
                        return;
                    }
                    match compute_brief_code(&keys, &self.cfg.rime_dir) {
                        Ok(Some(code)) => {
                            if let Some(owner) = self.dict.word_for_code(&code) {
                                self.phase = Phase::Message(format!(
                                    "⚠ 该码 {} 已被「{}」占用，无法添加（冲突保护）",
                                    code, owner
                                ));
                            } else {
                                self.input.clear();
                                self.phase = Phase::BriefWord { code };
                            }
                        }
                        Ok(None) => self.phase =
                            Phase::Message("该按键串不能构成合法空格并击简词码（需 %+2字符）".into()),
                        Err(e) => self.phase = Phase::Message(format!("⚠ {e}")),
                    }
                }
                KeyCode::Esc => self.reset_input(),
                KeyCode::Backspace => {
                    self.input.pop();
                }
                KeyCode::Char(c) => self.input.push(c),
                _ => {}
            },
            Phase::BriefWord { .. } => match key.code {
                _ if ctrl_q => self.should_quit = true,
                KeyCode::Enter => {
                    let code = match &self.phase {
                        Phase::BriefWord { code } => code.clone(),
                        _ => unreachable!(),
                    };
                    let word = self.input.trim().to_string();
                    if word.is_empty() {
                        self.phase = Phase::Message("请输入要绑定的词".into());
                    } else if word.chars().count() > 4 {
                        self.phase = Phase::Message("空格并击简词仅支持 2–4 字词".into());
                    } else {
                        self.phase = Phase::ConfirmBrief { code, word };
                    }
                }
                KeyCode::Esc => self.reset_input(),
                KeyCode::Backspace => {
                    self.input.pop();
                }
                KeyCode::Char(c) => self.input.push(c),
                _ => {}
            },
            Phase::ConfirmBrief { .. } => match key.code {
                _ if ctrl_q => self.should_quit = true,
                KeyCode::Enter => {
                    let (code, word) = match &self.phase {
                        Phase::ConfirmBrief { code, word } => (code.clone(), word.clone()),
                        _ => unreachable!(),
                    };
                    if let Err(e) = self.perform_add_brief(&word, &code) {
                        self.phase = Phase::Message(format!("添加失败: {e}"));
                    } else {
                        self.phase = Phase::Done(format!(
                            "已添加 {} → {}（空格并击简词，手动段）",
                            word, code
                        ));
                    }
                }
                KeyCode::Esc | KeyCode::Char('n') | KeyCode::Char('N') => self.reset_input(),
                _ => {}
            },
            Phase::BatchInput => match key.code {
                _ if ctrl_q => self.should_quit = true,
                KeyCode::Enter => self.start_batch_review(),
                KeyCode::Esc => self.reset_input(),
                KeyCode::Backspace => {
                    self.batch_input.pop();
                }
                KeyCode::Char(c) => self.batch_input.push(c),
                _ => {}
            },
            Phase::BatchReview { .. } => match key.code {
                _ if ctrl_q => self.should_quit = true,
                KeyCode::Char('j') | KeyCode::Down => self.cursor_down(),
                KeyCode::Char('k') | KeyCode::Up => self.cursor_up(),
                KeyCode::Char('g') => self.cursor_top(),
                KeyCode::Char('G') => self.cursor_bottom(),
                KeyCode::Char(' ') => self.toggle_at_cursor(),
                KeyCode::Char('a') => self.toggle_all_new(),
                KeyCode::Enter => {
                    if let Err(e) = self.add_selected() {
                        self.phase = Phase::Message(format!("批量添加失败: {e}"));
                    }
                }
                KeyCode::Esc => self.phase = Phase::BatchInput,
                _ => {}
            },
            Phase::NeedChar { .. } => match key.code {
                _ if ctrl_q => self.should_quit = true,
                KeyCode::Enter => {
                    let ch = match &self.phase {
                        Phase::NeedChar { ch, .. } => *ch,
                        _ => ' ',
                    };
                    let code = self.input.clone();
                    self.manual.insert(ch, code);
                    self.input.clear();
                    self.reencode();
                }
                KeyCode::Esc => self.reset_input(),
                KeyCode::Backspace => {
                    self.input.pop();
                }
                KeyCode::Char(c) => self.input.push(c),
                _ => {}
            },
            Phase::ConfirmAdd { .. } => match key.code {
                _ if ctrl_q => self.should_quit = true,
                KeyCode::Enter => self.do_add(),
                KeyCode::Esc | KeyCode::Char('n') | KeyCode::Char('N') => self.reset_input(),
                _ => {}
            },
            Phase::Found(_, _, _) | Phase::Message(_) | Phase::Done(_) => match key.code {
                _ if ctrl_q => self.should_quit = true,
                KeyCode::Esc => self.reset_input(),
                KeyCode::Enter | KeyCode::Char('n') | KeyCode::Char('N') => self.reset_input(),
                _ => {}
            },
        }
    }

    pub fn on_paste(&mut self, s: &str) {
        match self.phase {
            Phase::Input => self.input.push_str(s),
            Phase::BatchInput => self.batch_input.push_str(s),
            _ => {}
        }
    }

    pub fn run(&mut self, terminal: &mut Terminal<CrosstermBackend<Stdout>>) -> color_eyre::Result<()> {
        crossterm::execute!(std::io::stdout(), crossterm::event::EnableBracketedPaste)?;
        loop {
            terminal.draw(|f| crate::view::render(self, f))?;
            if event::poll(std::time::Duration::from_millis(120))? {
                match event::read()? {
                    Event::Key(k) if k.kind == KeyEventKind::Press => self.on_key(k),
                    Event::Paste(s) => self.on_paste(&s),
                    _ => {}
                }
            }
            if self.should_quit {
                break;
            }
        }
        crossterm::execute!(std::io::stdout(), crossterm::event::DisableBracketedPaste)?;
        Ok(())
    }

    #[cfg(test)]
    pub fn phase_item_selected(&self, text: &str) -> Option<bool> {
        if let Phase::BatchReview { items, .. } = &self.phase {
            items.iter().find(|i| i.text == text).map(|i| i.selected)
        } else {
            None
        }
    }
}

    #[cfg(test)]
    mod tests {
        use super::*;
        use std::path::PathBuf;
        use std::process::Command;

    fn setup() -> PathBuf {
        let manifest = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let rime_src = manifest
            .parent()
            .and_then(|p| p.parent())
            .unwrap()
            .join("rime");
        let tmp = std::env::temp_dir().join("yoyo_ibatch_test");
        let _ = std::fs::remove_dir_all(&tmp);
        Command::new("cp")
            .arg("-r")
            .arg(&rime_src)
            .arg(&tmp)
            .status()
            .unwrap();
        let deploy = std::env::temp_dir().join("yoyo_ibatch_deploy");
        let _ = std::fs::remove_dir_all(&deploy);
        unsafe {
            std::env::set_var("FCITX5_RIME_DIR", &deploy);
        }
        tmp
    }

    #[test]
    fn interactive_batch_review_and_add() {
        let rime = setup();
        let cfg = Config {
            rime_dir: rime.clone(),
            user_dict: rime.join("yoyo-user.dict.yaml"),
            no_restart: true,
        };
        let mut app = App::new(cfg).unwrap();

        // 多词输入（换行/空格/逗号分隔皆可），含已存在词与一条新词
        app.batch_input = "生动形象 好我\n中国,测试".to_string();
        app.start_batch_review();

        // 进入核对列表
        let items = match &app.phase {
            Phase::BatchReview { items, .. } => items,
            _ => panic!("start_batch_review 未进入 BatchReview"),
        };
        assert_eq!(items.len(), 4, "应解析出 4 个去重词");
        let hao_wo = items.iter().find(|i| i.text == "好我").expect("应有 好我");
        assert!(matches!(hao_wo.status, ItemStatus::New(_)), "好我 应为 New");
        assert!(hao_wo.selected, "New 词默认选中");
        let exists = items
            .iter()
            .filter(|i| matches!(i.status, ItemStatus::Exists(_)))
            .count();
        assert_eq!(exists, 3, "其余 3 个应为已存在");
        assert_eq!(items.iter().filter(|i| i.selected).count(), 1);

        // 光标移到 好我 并 toggle 两次验证选中态切换
        let idx = items.iter().position(|i| i.text == "好我").unwrap();
        if let Phase::BatchReview { cursor, .. } = &mut app.phase {
            *cursor = idx;
        }
        app.toggle_at_cursor();
        assert!(!app.phase_item_selected("好我").unwrap_or(true));
        app.toggle_at_cursor();
        assert!(app.phase_item_selected("好我").unwrap_or(false));

        // 添加选中词 -> 应写入 yoyo-user 并进入 Done
        app.add_selected().unwrap();
        assert!(matches!(app.phase, Phase::Done(_)), "添加后应进入 Done");

        let user = std::fs::read_to_string(rime.join("yoyo-user.dict.yaml")).unwrap();
        assert!(user.contains("好我"), "yoyo-user 应包含新词 好我");
        // 每次只应写入一次（幂等，不重复）
        let hao_wo_lines = user.lines().filter(|l| l.starts_with("好我\t")).count();
        assert_eq!(hao_wo_lines, 1, "好我 应仅被写入一次");
        // 已存在词（生动形象）不应被本次批量添加重复写入 yoyo-user
        let before = std::fs::read_to_string(rime.join("yoyo-user.dict.yaml")).unwrap();
        let exists_before = before.lines().filter(|l| l.starts_with("生动形象\t")).count();
        let exists_after = user.lines().filter(|l| l.starts_with("生动形象\t")).count();
        assert_eq!(exists_before, exists_after, "已存在词不应被重复写入");
    }
}
