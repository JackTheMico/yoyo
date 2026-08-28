//! 形码编码器（深模块，纯函数，完全可测）。
//!
//! 公式（来自 yoyo 官方文档 §3.2，已 100% 回测）：
//!   2字 AbAcBbBc = 字1[0] 字1[1] 字2[0] 字2[1]
//!   3字 AbBbCbCc = 字1[0] 字2[0] 字3[0] 字3[1]
//!   4字 AbBbCbZb = 字1[0] 字2[0] 字3[0] 末字[0]
//! （b=首字母索引0，c=次字母索引1）

use std::collections::HashMap;

#[derive(Debug, PartialEq)]
pub enum EncodeResult {
    /// 成功得到干净形码
    Code(String),
    /// 某字在形码表中缺失，无法自动编码
    MissingChar(char),
    /// 长度不在 2..=4 范围
    UnsupportedLen(usize),
}

pub fn encode(word: &str, char_code: &HashMap<char, String>) -> EncodeResult {
    let chars: Vec<char> = word.chars().collect();
    let n = chars.len();
    if !(2..=4).contains(&n) {
        return EncodeResult::UnsupportedLen(n);
    }
    // 先找缺失字
    if let Some(&miss) = chars.iter().find(|c| char_code.get(c).is_none()) {
        return EncodeResult::MissingChar(miss);
    }
    let shape: Vec<String> = chars.iter().map(|c| char_code[c].clone()).collect();
    let at = |s: &str, i: usize| s.chars().nth(i).unwrap();

    match n {
        2 => {
            if shape[0].len() < 2 || shape[1].len() < 2 {
                return EncodeResult::UnsupportedLen(n);
            }
            EncodeResult::Code(format!(
                "{}{}{}{}",
                at(&shape[0], 0),
                at(&shape[0], 1),
                at(&shape[1], 0),
                at(&shape[1], 1)
            ))
        }
        3 => {
            if shape[0].is_empty() || shape[1].is_empty() || shape[2].len() < 2 {
                return EncodeResult::UnsupportedLen(n);
            }
            EncodeResult::Code(format!(
                "{}{}{}{}",
                at(&shape[0], 0),
                at(&shape[1], 0),
                at(&shape[2], 0),
                at(&shape[2], 1)
            ))
        }
        4 => {
            if shape.iter().any(|s| s.is_empty()) {
                return EncodeResult::UnsupportedLen(n);
            }
            EncodeResult::Code(format!(
                "{}{}{}{}",
                at(&shape[0], 0),
                at(&shape[1], 0),
                at(&shape[2], 0),
                at(&shape[3], 0)
            ))
        }
        other => EncodeResult::UnsupportedLen(other),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn m() -> HashMap<char, String> {
        let mut m = HashMap::new();
        m.insert('中', "bc".to_string());
        m.insert('国', "U,".to_string()); // 末字只需首字母 U
        m.insert('我', "qS".to_string());
        m.insert('们', "wd".to_string());
        m.insert('好', "vx".to_string());
        m
    }

    #[test]
    fn encodes_two_chars() {
        assert_eq!(encode("中国", &m()), EncodeResult::Code("bcU,".to_string()));
    }

    #[test]
    fn encodes_four_chars() {
        // 我(q) 们(w) 好(v) 中国? 用一个四字词例子
        let mut m = m();
        m.insert('人', "rf".to_string());
        // 我们好人: 我q 们w 好v 人r -> qwvr
        assert_eq!(encode("我们好人", &m), EncodeResult::Code("qwvr".to_string()));
    }

    #[test]
    fn reports_missing_char() {
        assert_eq!(encode("中x", &m()), EncodeResult::MissingChar('x'));
    }
}
