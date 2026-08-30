//! 词库加载与检索（深模块）。
//!
//! 对外只暴露一个很薄的接口：`load` -> `contains` / `char_code` / `has_code` /
//! `word_for_code` / `entries`。内部解析 Rime `dict.yaml`（跳过 frontmatter、tab 分隔），
//! 并构建三个索引：text->条目、单字->最长干净形码、干净码集合（用于重码检测）。
//! 调用方与测试都只跨这一个 seam，行为全部封在内部。

use std::collections::{HashMap, HashSet};
use std::path::Path;

#[derive(Debug, Clone)]
pub struct Entry {
    pub text: String,
    /// 原始码（保留 `_`/`+` 一简前缀，用于映射表键）
    pub raw: String,
    /// 干净码（`_`/`+` 与并击标记已剥离），编码/重码检测都用它
    pub clean: String,
    pub weight: f64,
    /// 来源文件名，仅用于反馈展示
    pub source: String,
}

pub struct Dict {
    pub entries: Vec<Entry>,
    by_text: HashMap<String, usize>,
    /// 单字 -> 最长干净形码（编码时取最长，保证公式下标可用）
    pub char_code: HashMap<char, String>,
    codes: HashSet<String>,
}

impl Dict {
    pub fn load(paths: &[&Path]) -> color_eyre::Result<Self> {
        let mut d = Dict {
            entries: Vec::new(),
            by_text: HashMap::new(),
            char_code: HashMap::new(),
            codes: HashSet::new(),
        };
        for p in paths {
            if !p.exists() {
                continue;
            }
            let txt = std::fs::read_to_string(p)?;
            let src = p
                .file_name()
                .map(|s| s.to_string_lossy().to_string())
                .unwrap_or_default();
            parse_into(&txt, &src, &mut d);
        }
        Ok(d)
    }

    /// 词是否已存在（任意来源）
    pub fn contains(&self, text: &str) -> Option<&Entry> {
        self.by_text.get(text).map(|&i| &self.entries[i])
    }

    /// 干净码是否已被占用（重码检测）
    pub fn has_code(&self, clean: &str) -> bool {
        self.codes.contains(clean)
    }

    /// 查找占用该干净码的词（冲突时用于告知用户「被哪个词占用了」）。
    /// 返回第一个匹配条目的文本；无占用则返回 None。
    pub fn word_for_code(&self, clean: &str) -> Option<&str> {
        self.entries
            .iter()
            .find(|e| e.clean == clean)
            .map(|e| e.text.as_str())
    }

    /// 内存登记一条 % 前缀空格并击简词（文件写入后调用，使后续冲突检查可见）。
    pub fn note_brief(&mut self, text: &str, raw: &str) {
        let cl = clean_code(raw);
        let idx = self.entries.len();
        self.entries.push(Entry {
            text: text.to_string(),
            raw: raw.to_string(),
            clean: cl.clone(),
            weight: 100.0,
            source: "yoyo-user".to_string(),
        });
        self.by_text.entry(text.to_string()).or_insert(idx);
        self.codes.insert(cl);
    }

    pub fn entries(&self) -> &[Entry] {
        &self.entries
    }
}

fn clean_code(code: &str) -> String {
    code.replace('_', "").replace('+', "")
}

fn parse_into(txt: &str, src: &str, d: &mut Dict) {
    let mut in_body = false;
    for line in txt.lines() {
        let line = line.trim_end_matches('\r');
        if line.starts_with("---") {
            in_body = false;
            continue;
        }
        if line.starts_with("...") {
            in_body = true;
            continue;
        }
        if !in_body {
            continue;
        }
        if line.starts_with('#') || line.trim().is_empty() {
            continue;
        }
        let parts: Vec<&str> = line.split('\t').collect();
        if parts.len() < 2 || parts[0].is_empty() || parts[1].is_empty() {
            continue;
        }
        let text = parts[0].to_string();
        let raw = parts[1];
        let weight = parts
            .get(2)
            .and_then(|w| w.trim().parse::<f64>().ok())
            .unwrap_or(0.0);
        let cl = clean_code(raw);
        if cl.is_empty() {
            continue;
        }
        let idx = d.entries.len();
        d.entries.push(Entry {
            text: text.clone(),
            raw: raw.to_string(),
            clean: cl.clone(),
            weight,
            source: src.to_string(),
        });
        d.by_text.entry(text.clone()).or_insert(idx);
        d.codes.insert(cl.clone());

        // 单字 -> 最长干净形码
        if text.chars().count() == 1 {
            let ch = text.chars().next().unwrap();
            let cp = ch as u32;
            let is_cjk = (0x4E00..=0x9FFF).contains(&cp) || (0x3400..=0x4DBF).contains(&cp);
            if is_cjk {
                let need = match d.char_code.get(&ch) {
                    Some(existing) => cl.len() > existing.len(),
                    None => true,
                };
                if need {
                    d.char_code.insert(ch, cl.clone());
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = "\
# Rime dictionary
---
name: x
...
中国\tbcU,\t100
我\tqS\t200
";

    #[test]
    fn parses_entries_and_char_codes() {
        let d = Dict::load(&[]);
        let _ = d; // empty load ok
        let tmp = std::env::temp_dir().join("yoyo_km_test_dict.yaml");
        std::fs::write(&tmp, SAMPLE).unwrap();
        let d = Dict::load(&[tmp.as_path()]).unwrap();
        assert!(d.contains("中国").is_some());
        assert_eq!(d.char_code.get(&'我'), Some(&"qS".to_string()));
        assert!(d.has_code("bcU,"));
        std::fs::remove_file(&tmp).ok();
    }

    #[test]
    fn word_for_code_finds_space_brief_owner() {
        // 含 % 前缀空格并击简词，word_for_code 应能反查占用词
        let sample = "\
# Rime dictionary
---
name: x
...
记忆\t%u:\t100
一下\t%ff\t159752
";
        let tmp = std::env::temp_dir().join("yoyo_km_test_brief.yaml");
        std::fs::write(&tmp, sample).unwrap();
        let d = Dict::load(&[tmp.as_path()]).unwrap();
        assert_eq!(d.word_for_code("%u:"), Some("记忆"));
        assert_eq!(d.word_for_code("%ff"), Some("一下"));
        assert_eq!(d.word_for_code("%zz"), None);
        std::fs::remove_file(&tmp).ok();
    }
}
