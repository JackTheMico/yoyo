//! 重生成拼音反查分片 `reverse_*.lua`（深模块）。
//!
//! 忠实移植 `rime/scripts/generate_reverse_data.py`：从词表并集取字/词形码，
//! 结合 `pinyin.txt`（字读音）与 `base.dict.yaml.gz`（词拼音，需 gzip 解压）
//! 构建「拼音键 -> 候选(文本, 码, 权重)」，按权重降序后按拼音首字母分 26 片写出。
//! 与 Python 版一致的产出，保证 `reverse_lookup` 翻译器可用。
//!
//! 词码来源 = yoyo-pure（缺失回退 yoyo-bm）+ yoyo-user（并集）；yoyo_kf 不纳入。
//! 白霜拼音源(base.dict.yaml.gz)缺拼音的词（含用户经 yoyo-km-tui 新增的词），
//! 按 `pinyin.txt` 单字读音（取权重最高）拼接兜底，使这类词仍可被反查到。

use crate::dict::Entry;
use flate2::read::GzDecoder;
use std::collections::HashMap;
use std::io::{BufRead, BufReader};
use std::path::Path;
use unicode_normalization::UnicodeNormalization;

pub struct RevStats {
    pub keys: usize,
    pub written: usize,
}

const MARK_CHARS: &str = "!@-_+()[]=";

fn strip_tone(s: &str) -> String {
    let mut out = String::new();
    for ch in s.nfd() {
        let cp = ch as u32;
        // 组合用声调标记（U+0300..U+036F）丢弃
        if (0x300..=0x36F).contains(&cp) {
            continue;
        }
        match ch {
            'ü' | 'Ü' => out.push('v'),
            c => out.push(c),
        }
    }
    out.to_ascii_lowercase().replace(' ', "")
}

fn strip_marks(code: &str) -> String {
    code.chars().filter(|c| !MARK_CHARS.contains(*c)).collect()
}

fn is_cjk_char(ch: char) -> bool {
    let cp = ch as u32;
    (0x4E00..=0x9FFF).contains(&cp)
        || (0x3400..=0x4DBF).contains(&cp)
        || (0x20000..=0x2A6DF).contains(&cp)
        || (0x2B740..=0x2B81F).contains(&cp)
        || (0x2B820..=0x2CEAF).contains(&cp)
        || (0xF900..=0xFAFF).contains(&cp)
        || (0x2F800..=0x2FA1F).contains(&cp)
}

fn escape_lua(s: &str) -> String {
    s.replace('\\', "\\\\").replace('"', "\\\"")
}

pub fn generate(rime_dir: &Path, entries: &[Entry], out_dir: &Path) -> color_eyre::Result<RevStats> {
    let data_dir = rime_dir
        .join("scripts")
        .join("编码生成和重码可视化")
        .join("data");
    let pinyin_txt = data_dir.join("pinyin.txt");
    let base_gz = data_dir.join("base.dict.yaml.gz");

    // 1. 字/词形码（取权重最高，同权重取较短——反查展示用主码）
    let mut char_codes: HashMap<char, (String, f64)> = HashMap::new();
    let mut word_codes: HashMap<String, (String, f64)> = HashMap::new();
    for e in entries {
        let stripped = strip_marks(&e.raw);
        if stripped.is_empty() {
            continue;
        }
        let w = e.weight;
        if e.text.chars().count() == 1 {
            let ch = e.text.chars().next().unwrap();
            if !is_cjk_char(ch) {
                continue;
            }
            match char_codes.get(&ch) {
                None => {
                    char_codes.insert(ch, (stripped.clone(), w));
                }
                Some((cur, cur_w)) => {
                    if w > *cur_w || (w == *cur_w && stripped.len() < cur.len()) {
                        char_codes.insert(ch, (stripped.clone(), w));
                    }
                }
            }
        } else if e.text.chars().count() > 1 {
            match word_codes.get(&e.text) {
                None => {
                    word_codes.insert(e.text.clone(), (stripped.clone(), w));
                }
                Some((cur, cur_w)) => {
                    if w > *cur_w || (w == *cur_w && stripped.len() < cur.len()) {
                        word_codes.insert(e.text.clone(), (stripped.clone(), w));
                    }
                }
            }
        }
    }

    // 2. 字读音: char -> [(key, weight)]
    let mut char_pinyin: HashMap<char, Vec<(String, f64)>> = HashMap::new();
    let ptxt = std::fs::read_to_string(&pinyin_txt)?;
    for line in ptxt.lines() {
        let p: Vec<&str> = line.split('\t').collect();
        if p.len() < 3 {
            continue;
        }
        let ch = match p[0].chars().next() {
            Some(c) => c,
            None => continue,
        };
        let key = strip_tone(p[1]);
        if key.is_empty() {
            continue;
        }
        let w: f64 = p[2].trim().parse().unwrap_or(0.0);
        char_pinyin.entry(ch).or_default().push((key, w));
    }

    // 3. 词拼音: word -> (key, weight)，来自 gzip 的 base.dict.yaml.gz
    let mut word_pinyin: HashMap<String, (String, f64)> = HashMap::new();
    let gz = std::fs::File::open(&base_gz)?;
    let reader = BufReader::new(GzDecoder::new(gz));
    let mut in_body = false;
    for line in reader.lines() {
        let line = match line {
            Ok(l) => l,
            Err(_) => break,
        };
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
        let p: Vec<&str> = line.split('\t').collect();
        if p.len() < 2 {
            continue;
        }
        let text = p[0];
        if text.chars().count() <= 1 {
            continue;
        }
        let key = p[1].to_lowercase().replace(' ', "");
        if key.is_empty() || !key.is_ascii() || !key.chars().all(|c| c.is_alphabetic()) {
            continue;
        }
        let w: f64 = p.get(2).and_then(|x| x.trim().parse().ok()).unwrap_or(0.0);
        word_pinyin.entry(text.to_string()).or_insert((key, w));
    }

    // 3.5 拼音兜底：白霜拼音源缺拼音的词（含用户经 yoyo-km-tui 新增的词），
    // 按 pinyin.txt 单字读音（取权重最高者）拼接，使其仍有拼音键可索引。
    let mut synth_count = 0usize;
    for (word, _) in &word_codes {
        if word_pinyin.contains_key(word) {
            continue;
        }
        if word.chars().count() <= 1 {
            continue;
        }
        let mut keys = String::new();
        let mut ok = true;
        for ch in word.chars() {
            match char_pinyin.get(&ch) {
                Some(readings) => {
                    let best = readings
                        .iter()
                        .max_by(|a, b| {
                            a.1.partial_cmp(&b.1).unwrap_or(std::cmp::Ordering::Equal)
                        })
                        .map(|(k, _)| k.clone())
                        .unwrap_or_default();
                    if best.is_empty() {
                        ok = false;
                        break;
                    }
                    keys.push_str(&best);
                }
                None => {
                    ok = false;
                    break;
                }
            }
        }
        if ok && !keys.is_empty() && keys.is_ascii() && keys.chars().all(|c| c.is_alphabetic()) {
            word_pinyin.insert(word.clone(), (keys, 0.0));
            synth_count += 1;
        }
    }
    if synth_count > 0 {
        eprintln!(
            "[reverse] 拼音兜底(单字拼接): {} 个词（白霜源缺拼音，已按 pinyin.txt 合成）",
            synth_count
        );
    }

    // 4. 合并候选: key -> [(text, code, weight)]
    let mut candidates: HashMap<String, Vec<(String, String, f64)>> = HashMap::new();
    let mut missing_words = 0usize;
    for (&ch, keys) in &char_pinyin {
        let code = match char_codes.get(&ch) {
            Some((c, _)) => c.clone(),
            None => continue,
        };
        for (key, w) in keys {
            candidates
                .entry(key.clone())
                .or_default()
                .push((ch.to_string(), code.clone(), *w));
        }
    }
    for (word, (code, _)) in &word_codes {
        match word_pinyin.get(word) {
            Some((key, w)) => {
                candidates
                    .entry(key.clone())
                    .or_default()
                    .push((word.clone(), code.clone(), *w));
            }
            None => missing_words += 1,
        }
    }

    // 5. 排序: 键字母序；候选按权重降序、同权重按文本稳定序
    let mut keys: Vec<String> = candidates.keys().cloned().collect();
    keys.sort();
    let mut sorted_cands: Vec<(String, Vec<(String, String, f64)>)> = Vec::new();
    for k in &keys {
        let mut items = candidates.remove(k).unwrap();
        items.sort_by(|a, b| {
            b.2.partial_cmp(&a.2)
                .unwrap_or(std::cmp::Ordering::Equal)
                .then(a.0.cmp(&b.0))
        });
        sorted_cands.push((k.clone(), items));
    }

    // 6. 写 26 分片（按拼音首字母）
    std::fs::create_dir_all(out_dir)?;
    let mut written = 0usize;
    for initial in "abcdefghijklmnopqrstuvwxyz".chars() {
        let shard: Vec<(String, Vec<(String, String, f64)>)> = sorted_cands
            .iter()
            .filter(|(k, _)| k.starts_with(initial))
            .cloned()
            .collect();
        if shard.is_empty() {
            continue;
        }
        let mut content =
            String::from("-- 自动生成，请勿手改。由 yoyo-km-tui (Rust) 生成。\nreturn {\n");
        for (key, items) in &shard {
            let inner: Vec<String> = items
                .iter()
                .map(|(t, c, w)| format!("{{\"{}\",\"{}\",{:.1}}}", escape_lua(t), escape_lua(c), w))
                .collect();
            content.push_str(&format!(
                "  [\"{}\"] = {{{}}},\n",
                escape_lua(key),
                inner.join(", ")
            ));
        }
        content.push_str("}\n");
        std::fs::write(out_dir.join(format!("reverse_{}.lua", initial)), content)?;
        written += 1;
    }

    if missing_words > 0 {
        eprintln!(
            "[reverse] 注意: {} 个词库词在白霜拼音源中缺拼音，未进入反查（数据源差异，非错误）",
            missing_words
        );
    }

    Ok(RevStats {
        keys: keys.len(),
        written,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::dict::Entry;
    use std::path::PathBuf;

    #[test]
    fn synthesizes_pinyin_for_word_absent_in_baishuang() {
        // 词库并集里有一个白霜拼音源(base.dict.yaml.gz)缺拼音的词，
        // 应由 pinyin.txt 单字读音拼接出拼音键，使其可被反查到。
        let manifest = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let rime_dir = manifest
            .parent()
            .and_then(|p| p.parent())
            .unwrap()
            .join("rime");
        let entries = vec![Entry {
            text: "生动形象".into(),
            raw: "GNf,".into(),
            clean: "GNf,".into(),
            weight: 100.0,
            source: "yoyo-user".into(),
        }];
        let tmp = std::env::temp_dir().join("yoyo_rev_synth_test");
        let st = generate(&rime_dir, &entries, &tmp).unwrap();
        let shard = std::fs::read_to_string(tmp.join("reverse_s.lua")).unwrap();
        assert!(
            shard.contains("shengdongxingxiang"),
            "期望合成拼音键 shengdongxingxiang 出现在分片:\n{}",
            shard
        );
        let _ = st;
        std::fs::remove_dir_all(&tmp).ok();
    }
}
