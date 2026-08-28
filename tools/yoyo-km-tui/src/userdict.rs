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
}
