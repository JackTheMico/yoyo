//! 重生成 `pure_dict_map.lua`（深模块）。
//!
//! 忠实移植 `rime/scripts/generate_pure_dict_map.py`：从词表并集构建
//! 双轨 dict_map（char_first / word_first，各含 dict_map / dict_map_2）、
//! `words_4code`（4码词集，状态机据此区分合法4码词与自动切分）、
//! `chars_3code`（3码单字集）。输出格式与 Python 版逐字节等价，
//! 保证 `pure_popping` 状态机正确工作。

use crate::dict::Entry;
use std::collections::{HashMap, HashSet};
use std::io::Write;
use std::path::Path;

pub struct MapStats {
    pub char_first: usize,
    pub word_first: usize,
    pub words_4code: usize,
    pub chars_3code: usize,
}

fn lua_str(s: &str) -> String {
    let mut out = String::with_capacity(s.len() + 2);
    out.push('"');
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            _ => out.push(c),
        }
    }
    out.push('"');
    out
}

fn is_letter(ch: char) -> bool {
    ch.is_alphabetic()
}

fn pick(cands: &[String], char_first: bool) -> (Option<String>, Option<String>) {
    if cands.is_empty() {
        return (None, None);
    }
    let chars: Vec<String> = cands.iter().filter(|t| t.chars().count() == 1).cloned().collect();
    let words: Vec<String> = cands.iter().filter(|t| t.chars().count() > 1).cloned().collect();
    let ordered: Vec<String> = if char_first {
        chars.into_iter().chain(words).collect()
    } else {
        words.into_iter().chain(chars).collect()
    };
    (ordered.first().cloned(), ordered.get(1).cloned())
}

pub fn generate(entries: &[Entry], out: &Path) -> color_eyre::Result<MapStats> {
    let mut code_to_cands: HashMap<String, Vec<String>> = HashMap::new();
    let mut clean_to_cands: HashMap<String, Vec<String>> = HashMap::new();
    let mut words_4code: HashSet<String> = HashSet::new();
    let mut chars_3code: HashSet<String> = HashSet::new();

    for e in entries {
        let raw = e.raw.clone();
        let clean = raw.replace('_', "").replace('+', "");
        let n_clean = clean.chars().count();
        let n_text = e.text.chars().count();
        if n_clean == 4 && n_text > 1 {
            words_4code.insert(clean.clone());
        } else if n_clean == 3 && n_text == 1 && e.text.chars().next().map(is_letter).unwrap_or(false) {
            chars_3code.insert(clean.clone());
        }
        code_to_cands.entry(raw).or_default().push(e.text.clone());
        clean_to_cands.entry(clean).or_default().push(e.text.clone());
    }
    for v in code_to_cands.values_mut() {
        v.dedup();
    }
    for v in clean_to_cands.values_mut() {
        v.dedup();
    }

    let mut cf_top: HashMap<String, String> = HashMap::new();
    let mut cf_sec: HashMap<String, String> = HashMap::new();
    let mut wf_top: HashMap<String, String> = HashMap::new();
    let mut wf_sec: HashMap<String, String> = HashMap::new();

    for (code, cands) in &code_to_cands {
        let (t, s) = pick(cands, true);
        if let Some(x) = t {
            cf_top.entry(code.clone()).or_insert(x);
        }
        if let Some(x) = s {
            cf_sec.entry(code.clone()).or_insert(x);
        }
        let (t, s) = pick(cands, false);
        if let Some(x) = t {
            wf_top.entry(code.clone()).or_insert(x);
        }
        if let Some(x) = s {
            wf_sec.entry(code.clone()).or_insert(x);
        }
    }
    for (code, cands) in &clean_to_cands {
        let (t, s) = pick(cands, true);
        if let Some(x) = t {
            cf_top.entry(code.clone()).or_insert(x);
        }
        if let Some(x) = s {
            cf_sec.entry(code.clone()).or_insert(x);
        }
        let (t, s) = pick(cands, false);
        if let Some(x) = t {
            wf_top.entry(code.clone()).or_insert(x);
        }
        if let Some(x) = s {
            wf_sec.entry(code.clone()).or_insert(x);
        }
    }

    let mut out_lines: Vec<String> = Vec::new();
    out_lines.push("-- Auto-generated pure shape dictionary dual-track maps & sets".into());
    out_lines.push("local M = {".into());
    out_lines.push("  char_first = {".into());
    out_lines.push("    dict_map = {".into());
    for (code, text) in sorted(&cf_top) {
        out_lines.push(format!("      [{}] = {},", lua_str(&code), lua_str(&text)));
    }
    out_lines.push("    },".into());
    out_lines.push("    dict_map_2 = {".into());
    for (code, text) in sorted(&cf_sec) {
        out_lines.push(format!("      [{}] = {},", lua_str(&code), lua_str(&text)));
    }
    out_lines.push("    },".into());
    out_lines.push("  },".into());
    out_lines.push("  word_first = {".into());
    out_lines.push("    dict_map = {".into());
    for (code, text) in sorted(&wf_top) {
        out_lines.push(format!("      [{}] = {},", lua_str(&code), lua_str(&text)));
    }
    out_lines.push("    },".into());
    out_lines.push("    dict_map_2 = {".into());
    for (code, text) in sorted(&wf_sec) {
        out_lines.push(format!("      [{}] = {},", lua_str(&code), lua_str(&text)));
    }
    out_lines.push("    },".into());
    out_lines.push("  },".into());
    out_lines.push("  words_4code = {".into());
    let mut w4: Vec<&String> = words_4code.iter().collect();
    w4.sort();
    for c in w4 {
        out_lines.push(format!("    [{}] = true,", lua_str(c)));
    }
    out_lines.push("  },".into());
    out_lines.push("  chars_3code = {".into());
    let mut c3: Vec<&String> = chars_3code.iter().collect();
    c3.sort();
    for c in c3 {
        out_lines.push(format!("    [{}] = true,", lua_str(c)));
    }
    out_lines.push("  },".into());
    out_lines.push("}".into());
    out_lines.push("M.dict_map = M.char_first.dict_map".into());
    out_lines.push("M.dict_map_2 = M.char_first.dict_map_2".into());
    out_lines.push("return M".into());

    if let Some(parent) = out.parent() {
        std::fs::create_dir_all(parent)?;
    }
    let mut f = std::fs::File::create(out)?;
    writeln!(f, "{}", out_lines.join("\n"))?;

    Ok(MapStats {
        char_first: cf_top.len(),
        word_first: wf_top.len(),
        words_4code: words_4code.len(),
        chars_3code: chars_3code.len(),
    })
}

fn sorted(m: &HashMap<String, String>) -> Vec<(String, String)> {
    let mut v: Vec<(String, String)> = m.iter().map(|(k, v)| (k.clone(), v.clone())).collect();
    v.sort();
    v
}
