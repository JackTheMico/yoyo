//! 入口：解析参数、定位 rime 目录、启动 TUI 或单条加词。

mod dict;
mod encoder;
mod mapgen;
mod reversegen;
mod deploy;
mod userdict;
mod model;
mod view;

use clap::Parser;
use model::{App, Config};
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "yoyo-km-tui", about = "给 yoyo-pure-km 方案交互式加词的 TUI")]
struct Cli {
    /// rime 目录（含 yoyo*.yaml 与 lua/），默认取仓库内 rime/
    #[arg(long)]
    rime_dir: Option<PathBuf>,
    /// 直接加词（非交互），处理后退出；中文可用粘贴或此参数
    #[arg(long)]
    word: Option<String>,
    /// 批量加词：从文件逐行读取（每行一词，# 开头为注释，可加 \t编码 强制指定）
    #[arg(long)]
    batch: Option<PathBuf>,
    /// 部署时不重启 fcitx5（FCITX5_NO_RESTART=1）
    #[arg(long)]
    no_restart: bool,
}

fn main() -> color_eyre::Result<()> {
    color_eyre::install()?;
    let cli = Cli::parse();

    let manifest = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    // tools/yoyo-km-tui -> 上两级为仓库根
    let repo = manifest
        .parent()
        .and_then(|p| p.parent())
        .unwrap()
        .to_path_buf();
    let rime_dir = cli.rime_dir.unwrap_or_else(|| repo.join("rime"));
    let user_dict = rime_dir.join("yoyo-user.dict.yaml");
    let cfg = Config {
        rime_dir,
        user_dict,
        no_restart: cli.no_restart,
    };

    if let Some(b) = cli.batch {
        let mut app = App::new(cfg)?;
        let s = app.add_words_batch(&b)?;
        println!("批量加词完成：{}", b.display());
        println!("  待处理总数: {}", s.total);
        if !s.added.is_empty() {
            let list: Vec<String> = s
                .added
                .iter()
                .map(|(w, c)| format!("{}→{}", w, c))
                .collect();
            println!("  已添加({}): {}", s.added.len(), list.join(", "));
            println!("  已重生成 pure_dict_map.lua / reverse_*.lua 并完成部署。");
        } else {
            println!("  无新词可加，未触发重生成/部署。");
        }
        if !s.skipped_exists.is_empty() {
            println!(
                "  已存在跳过({}): {}",
                s.skipped_exists.len(),
                s.skipped_exists.join(", ")
            );
        }
        if !s.skipped_missing.is_empty() {
            let list: Vec<String> = s
                .skipped_missing
                .iter()
                .map(|(w, ch)| format!("{}（缺{}）", w, ch))
                .collect();
            println!("  缺形码跳过({}): {}", s.skipped_missing.len(), list.join(", "));
        }
        if !s.skipped_len.is_empty() {
            let list: Vec<String> = s
                .skipped_len
                .iter()
                .map(|(w, n)| format!("{}（{}字）", w, n))
                .collect();
            println!("  长度不符跳过({}): {}", s.skipped_len.len(), list.join(", "));
        }
        return Ok(());
    }

    if let Some(w) = cli.word {
        let mut app = App::new(cfg)?;
        return app.add_word_cli(&w);
    }

    let mut terminal = ratatui::init();
    let result = {
        let mut app = App::new(cfg)?;
        app.run(&mut terminal)
    };
    ratatui::restore();
    result
}
