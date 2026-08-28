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
