/**
 * Install 安装引导组件
 * 设计风格：武侠水墨 - 引导用户前往 GitHub 安装使用
 */

import { assetUrl, INSTALL_URL } from "@/lib/utils";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function Install() {
  return (
    <section
      id="install"
      className="scroll-mt-20 py-24 md:py-32 bg-muted/30"
    >
      <div className="container">
        {/* 章节标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="ink-title text-3xl sm:text-4xl md:text-5xl mb-4">
            安装使用
          </h2>
          <p className="text-lg text-muted-foreground font-serif italic">
            前往仓库，三步上手
          </p>
        </motion.div>

        {/* 分隔线 */}
        <div className="flex justify-center mb-16">
          <img
            src={assetUrl("images/section-divider.png")}
            alt=""
            className="w-64 h-auto opacity-40"
          />
        </div>

        {/* 安装卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="ink-card p-8 md:p-12 max-w-2xl mx-auto text-center"
        >
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground mb-8">
            方案基于 Rime 输入法引擎，安装与配置说明已托管在 GitHub。
            前往仓库的「如何使用」章节，按指引即可在 Windows / macOS / Linux 上启用。
          </p>
          <a
            href={INSTALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background border border-foreground hover:bg-foreground/90 transition-colors"
          >
            前往 GitHub 安装
            <ExternalLink className="w-5 h-5" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
