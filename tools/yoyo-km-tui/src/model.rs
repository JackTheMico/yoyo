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
use std::collections::HashMap;
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
        let kf = cfg.rime_dir.join("yoyo_kf.dict.yaml");
        let paths: Vec<&Path> = vec![pure.as_path(), kf.as_path(), user.as_path()];
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
                "已加载词库并集: {} 条（yoyo-pure + yoyo_kf + yoyo-user）",
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

        let mut all = self.dict.entries().to_vec();
        all.push(Entry {
            text: text.to_string(),
            raw: code.to_string(),
            clean: code.to_string(),
            weight: 100.0,
            source: "yoyo-user".into(),
        });

        let map_path = self.cfg.rime_dir.join("lua/yoyo/data/pure_dict_map.lua");
        let st = mapgen::generate(&all, &map_path)?;
        self.log.push(format!(
            "✓ 状态机映射 pure_dict_map.lua: char_first={} word_first={} 4码词={} 3码字={}",
            st.char_first, st.word_first, st.words_4code, st.chars_3code
        ));

        let rev_dir = self.cfg.rime_dir.join("lua/yoyo/data");
        let rs = reversegen::generate(&self.cfg.rime_dir, &all, &rev_dir)?;
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
        self.log.push("✓ 部署完成".into());
        Ok(())
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
        match self.phase {
            Phase::Input => match key.code {
                KeyCode::Char('c') if key.modifiers.contains(KeyModifiers::CONTROL) => {
                    self.should_quit = true
                }
                KeyCode::Esc => self.should_quit = true,
                KeyCode::Enter => self.search(),
                KeyCode::Backspace => {
                    self.input.pop();
                }
                KeyCode::Char(c) => self.input.push(c),
                _ => {}
            },
            Phase::NeedChar { .. } => match key.code {
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
                KeyCode::Enter => self.do_add(),
                KeyCode::Esc | KeyCode::Char('n') | KeyCode::Char('N') => self.reset_input(),
                _ => {}
            },
            Phase::Found(_, _, _) | Phase::Message(_) | Phase::Done(_) => match key.code {
                KeyCode::Esc => self.should_quit = true,
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
