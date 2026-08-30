//! TUI 渲染（View）。纯函数式：给定 App 状态，画一帧。

use crate::model::{App, Phase};
use ratatui::layout::{Constraint, Layout};
use ratatui::style::Stylize;
use ratatui::text::{Line, Text};
use ratatui::widgets::{Block, List, ListItem, Paragraph, Wrap};
use ratatui::Frame;

pub fn render(app: &App, f: &mut Frame) {
    let area = f.area();
    let [header, main, footer] = Layout::vertical([
        Constraint::Length(2),
        Constraint::Fill(1),
        Constraint::Length(3),
    ])
    .areas(area);

    let h = Line::from(vec![
        " 麓鸣·纯形 加词工具 ".bold().cyan(),
        format!(" 词库词条={} ", app.dict.entries().len()).dim(),
    ]);
    f.render_widget(Paragraph::new(h), header);

    let [left, right] = Layout::horizontal([Constraint::Percentage(55), Constraint::Fill(1)]).areas(main);
    if matches!(app.phase, Phase::BatchReview { .. }) {
        render_batch_review(app, f, left);
    } else {
        render_feedback(app, f, left);
    }
    render_log(app, f, right);

    let prompt = match &app.phase {
        Phase::NeedChar { ch, .. } => format!("为缺码字『{}』输入其形码: > {}", ch, app.input),
        Phase::BatchInput => format!("批量模式 ({} 行) >", app.batch_input.lines().count()),
        _ => format!("> {}", app.input),
    };
    let hints = match &app.phase {
        Phase::BatchReview { .. } => {
            " j/k 移动 · space 选中 · a 全选新词 · Enter 添加并部署 · Esc 返回 · Ctrl+Q 退出 "
        }
        Phase::BatchInput => " 粘贴多词 · Enter 检索 · Esc 返回 · Ctrl+Q 退出 ",
        _ => " Enter 搜索/确认 · Ctrl+Q 退出 · Esc 返回 · 粘贴中文词 · (Ctrl+B 批量) ",
    };
    let footer_line = Line::from(vec![prompt.into(), "  ".into(), hints.dim().into()]);
    f.render_widget(
        Paragraph::new(footer_line).block(Block::bordered().title("输入")),
        footer,
    );
}

fn render_feedback(app: &App, f: &mut Frame, area: ratatui::layout::Rect) {
    let (title, body): (String, Text) = match &app.phase {
        Phase::Input => (
            "检索".into(),
            Text::from(
                "输入想加入 yoyo-pure-km 的词，按 Enter 检索。\n（raw 终端下中文请用粘贴 Ctrl+Shift+V / Cmd+V）",
            ),
        ),
        Phase::Found(t, c, s) => (
            "已存在".into(),
            Text::from(vec![
                Line::from(format!("「{}」已在词库中", t)),
                Line::from(format!("编码: {}   来源: {}", c, s)),
                Line::from("无需添加。Enter 返回。").dim(),
            ]),
        ),
        Phase::ConfirmAdd { text, code, conflict } => (
            "可加入".into(),
            Text::from(vec![
                Line::from(format!("「{}」不在词库，预估编码: {}", text, code)),
                if *conflict {
                    Line::from(format!("⚠ 该码 {} 已被占用（将产生重码），仍会加入。", code)).yellow()
                } else {
                    Line::from("编码无冲突。").green()
                },
                Line::from("Enter 确认添加并触发重生成+部署 · Esc 取消").dim(),
            ]),
        ),
        Phase::NeedChar { text, ch, .. } => (
            "缺形码字".into(),
            Text::from(vec![
                Line::from(format!("「{}」中的『{}』在词库无单字形码，无法自动编码。", text, ch)),
                Line::from("请在下方输入该字的形码后按 Enter（仅用于本次合码）。").yellow(),
            ]),
        ),
        Phase::Done(msg) => ("完成".into(), Text::from(msg.clone().green())),
        Phase::Message(msg) => ("提示".into(), Text::from(msg.clone().yellow())),
        Phase::BatchInput => (
            "批量输入".into(),
            Text::from(vec![
                Line::from("粘贴/输入多个词（每行一个，或空格/逗号分隔），Enter 检索。"),
                Line::from(format!("当前 {} 行:", app.batch_input.lines().count())).dim(),
                Line::from(app.batch_input.clone()),
            ]),
        ),
        _ => ("".into(), Text::default()),
    };
    let p = Paragraph::new(body)
        .block(Block::bordered().title(title))
        .wrap(Wrap { trim: true });
    f.render_widget(p, area);
}

fn render_log(app: &App, f: &mut Frame, area: ratatui::layout::Rect) {
    let max_lines = (area.height.saturating_sub(2)) as usize;
    let start = app.log.len().saturating_sub(max_lines);
    let shown: Vec<ListItem> = app.log[start..]
        .iter()
        .map(|l| ListItem::new(l.clone()))
        .collect();
    let list = List::new(shown).block(Block::bordered().title("操作日志"));
    f.render_widget(list, area);
}

fn render_batch_review(app: &App, f: &mut Frame, area: ratatui::layout::Rect) {
    use ratatui::style::Style;
    use ratatui::widgets::ListState;
    let (items, cursor) = match &app.phase {
        Phase::BatchReview { items, cursor } => (items, *cursor),
        _ => return,
    };
    let rows: Vec<ListItem> = items
        .iter()
        .map(|it| {
            let mark = if it.selected { "[x]" } else { "[ ]" };
            let status = match &it.status {
                crate::model::ItemStatus::Exists(c) => format!("已在库: {c}"),
                crate::model::ItemStatus::New(c) => format!("建议码: {c}"),
                crate::model::ItemStatus::MissingChar(ch) => format!("缺形码字『{ch}』"),
                crate::model::ItemStatus::UnsupportedLen(n) => format!("{n} 字(不支持)"),
            };
            let mut line = Line::from(format!(" {mark} {}   {}", it.text, status));
            if matches!(it.status, crate::model::ItemStatus::Exists(_)) {
                line = line.dim();
            }
            ListItem::new(line)
        })
        .collect();
    let mut state = ListState::default();
    state.select(Some(cursor));
    let selected_count = items.iter().filter(|it| it.selected).count();
    let addable = items
        .iter()
        .filter(|it| matches!(it.status, crate::model::ItemStatus::New(_)))
        .count();
    let title = format!(
        "批量核对 (选中 {}/可加 {} 共 {})",
        selected_count,
        addable,
        items.len()
    );
    let list = List::new(rows)
        .block(Block::bordered().title(title))
        .highlight_symbol("▶ ")
        .highlight_style(Style::default().reversed());
    f.render_stateful_widget(list, area, &mut state);
}
