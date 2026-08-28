//! RIME 部署（薄封装）。
//!
//! 直接调用仓库既有且经过验证的 `rime/scripts/deploy_to_fcitx5.sh`：
//! rsync 词表+lua 到 fcitx5 用户目录 → 注册 schema → rime_deployer 构建 →
//! fcitx5-remote -r 重新部署。部署本就要调用系统工具（rsync / rime_deployer /
//! fcitx5-remote），这是唯一一处不可避免的外部进程调用。

use std::path::Path;
use std::process::Command;

pub fn deploy(rime_dir: &Path, no_restart: bool) -> color_eyre::Result<String> {
    let script = rime_dir.join("scripts").join("deploy_to_fcitx5.sh");
    if !script.exists() {
        return Err(color_eyre::eyre::eyre!(
            "部署脚本不存在: {}（仅 fcitx5/Linux 受支持）",
            script.display()
        ));
    }
    let mut cmd = Command::new("bash");
    cmd.arg(&script);
    if no_restart {
        cmd.env("FCITX5_NO_RESTART", "1");
    }
    let out = cmd.output()?;
    let stdout = String::from_utf8_lossy(&out.stdout).to_string();
    let stderr = String::from_utf8_lossy(&out.stderr).to_string();
    if !out.status.success() {
        return Ok(format!("部署脚本返回非零状态:\n{}\n{}", stdout, stderr));
    }
    Ok(format!("{}{}", stdout, stderr))
}
