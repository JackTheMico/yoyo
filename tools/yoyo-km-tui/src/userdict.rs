//! 用户词表管理（深模块）。
//!
//! 负责 `yoyo-user.dict.yaml` 的创建（带合法 Rime 字典头）与幂等追加。
//! 该文件通过 schema 的 `import_tables` 被 yoyo-pure(-km) 引入，且**不会**被
//! `generate_pure_dict.py` 重新生成覆盖——是用户词的永久安全落点。

use std::io::Write;
use std::path::Path;

const HEADER: &str = "\
# Rime dictionary: yoyo-user
# encoding: utf-8
---
name: yoyo-user
version: 1.0
sort: by_weight
columns:
  - text
  - code
  - weight
...

";

/// 手动空格并击简词段标记（与 gen_brief_words.py 保持一致）。
const MANUAL_START: &str = "# === 手动空格并击简词（加词工具写入，gen_brief_words.py 保留）===";
const MANUAL_END: &str = "# === 手动段结束 ===";

pub struct UserDict {
    pub path: std::path::PathBuf,
}

impl UserDict {
    /// 打开用户词表；不存在则写入标准头创建。
    pub fn open(path: &Path) -> color_eyre::Result<Self> {
        if !path.exists() {
            std::fs::write(path, HEADER)?;
        }
        Ok(Self {
            path: path.to_path_buf(),
        })
    }

    /// 追加一条（默认权重 100，中等优先级）。
    pub fn append(&self, text: &str, code: &str, weight: f64) -> color_eyre::Result<()> {
        let mut f = std::fs::OpenOptions::new().append(true).open(&self.path)?;
        writeln!(f, "{}\t{}\t{}", text, code, weight as i64)?;
        Ok(())
    }

    /// 追加一条空格并击简词（% 前缀）到「手动段」（加词工具写入区）。
    /// 用 MANUAL_START/END 标记包住，gen_brief_words.py --write 重跑时原样保留。
    /// 若文件尚无标记，则在末尾创建手动段。
    pub fn append_brief(&self, text: &str, code: &str, weight: f64) -> color_eyre::Result<()> {
        let mut content = std::fs::read_to_string(&self.path)?;
        let line = format!("{}\t{}\t{}", text, code, weight as i64);
        if let Some(start) = content.find(MANUAL_START) {
            // 插入到 MANUAL_END 所在行之前
            if let Some(rel) = content[start..].find(MANUAL_END) {
                let end_abs = start + rel;
                let insert_at = content[..end_abs].rfind('\n').map(|i| i + 1).unwrap_or(end_abs);
                content.insert_str(insert_at, &format!("{}\n", line));
            } else {
                content.push_str(&format!("\n{}\n", line));
            }
        } else {
            if !content.ends_with('\n') {
                content.push('\n');
            }
            content.push_str(&format!("\n{}\n{}\n{}\n", MANUAL_START, line, MANUAL_END));
        }
        std::fs::write(&self.path, content)?;
        Ok(())
    }
}
