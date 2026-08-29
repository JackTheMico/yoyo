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
    Found(String, String, String),
    ConfirmAdd {
        text: String,
        code: String,
        conflict: bool,
    },
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

pub struct App {
    pub cfg: Config,
    pub dict: Dict,
    user: UserDict,
    pub input: String,
    pub pending: String,
    pub manual: HashMap<char, String>,
    pub phase: Phase,
    pub log: Vec<String>,
    pub should_quit: bool,
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

    pub fn on_key(&mut self, key: KeyEvent) {
        let ctrl_q = key.code == KeyCode::Char('q')
            && key.modifiers.contains(KeyModifiers::CONTROL);
        match self.phase {
            Phase::Input => match key.code {
                _ if ctrl_q => self.should_quit = true,
                KeyCode::Enter => self.search(),
                KeyCode::Backspace => {
                    self.input.pop();
                }
                KeyCode::Char(c) => self.input.push(c),
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
        if let Phase::Input = self.phase {
            self.input.push_str(s);
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
}
