/**
 * Features 优势特性展示组件
 * 设计风格：武侠水墨 - 卡片式特性展示
 */

import { assetUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import { Zap, Target, Brain, Sparkles } from "lucide-react";

const chunxingFeatures = [
  {
    icon: Zap,
    title: "极低击长",
    description: "单字最高三码，94.3% 的字只需一击即可打出。一击顶功，无需空格确认。",
    highlight: "一击字占比 94.3%",
  },
  {
    icon: Target,
    title: "极低重码",
    description: "前 6638 字全码无重！简码和全码都是零重码。前 60000 高频词加权重码率仅 0.25%。",
    highlight: "6638 字零重码",
  },
  {
    icon: Brain,
    title: "思维负担低",
    description: "指法更简单，单手最多同时按两个键。大字根拆分直观，打字规则简单明了。",
    highlight: "规则极简",
  },
  {
    icon: Sparkles,
    title: "独特爽点",
    description: "100% 的确定感，单字零重，词重极低。30 个一键上屏字/词，只按一个键即可上屏。",
    highlight: "确定感满满",
  },
];

const yinxingFeatures = [
  {
    icon: Brain,
    title: "先音后形，联想直接",
    description:
      "第一码是完整音节，后接首根与末根；不像纯形从第一码起全程按字根思考。代价是需要知道读音，并额外记住声韵母分组。",
    highlight: "音节码 + 首根 + 末根",
  },
  {
    icon: Zap,
    title: "一击两个字音",
    description:
      "词的前两码固定取头两个字的音节，一次双手并击同时输入两个字音。按词频计，58.66% 的词一击可出，97.58% 两击内可出。",
    highlight: "一击词频覆盖 58.66%",
  },
  {
    icon: Target,
    title: "字词起手即分流",
    description:
      "双手不带空格起词，双手带空格起单字，单手通道承载一简。字词编码从第一击起就互不重叠。",
    highlight: "字词零混选",
  },
  {
    icon: Sparkles,
    title: "更大的码位空间",
    description:
      "180 个码元是纯形的 3 倍，配合四条输入通道形成 720 个一简槽位；目前已有 700 个字词可以单手一击直接上屏。",
    highlight: "700 个一简直出",
  },
];

const featureConfigs = {
  chunxing: {
    id: "intro",
    title: "「麓鸣」的优势",
    subtitle: "追求并击的上限",
    features: chunxingFeatures,
    stats: [
      { value: "6638", label: "零重码字数" },
      { value: "94.3%", label: "一击字占比" },
      { value: "2152", label: "一击即出字" },
      { value: "0.25%", label: "词重码率" },
    ],
  },
  yinxing: {
    id: "yx-intro",
    title: "「呦呦」的优势",
    subtitle: "为极限打词而生",
    features: yinxingFeatures,
    stats: [
      { value: "<0.001%", label: "词重码率" },
      { value: "700", label: "一击直出字词（纯形为 60）" },
      { value: "96.92%", label: "一击字占比" },
      { value: "58.66%", label: "一击词占比" },
    ],
    comparison: [
      {
        name: "纯形·麓鸣",
        summary: "见形取码 · 60 码元",
        detail: "记忆集中在字根；不依赖读音，重点优化单字确定性和扩展字能力。",
      },
      {
        name: "音形·呦呦",
        summary: "先音后形 · 180 码元",
        detail: "在字根之外增加声韵母分组；重点降低连续词组击长，并扩充一简空间。",
      },
    ],
  },
} as const;

type FeatureVariant = keyof typeof featureConfigs;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function Features({
  variant = "chunxing",
}: {
  variant?: FeatureVariant;
}) {
  const config = featureConfigs[variant];

  return (
    <section
      id={config.id}
      className="scroll-mt-20 py-24 md:py-32 bg-background"
    >
      <div className="container">
        {/* 章节标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="ink-title text-3xl sm:text-4xl md:text-5xl mb-4">
            {config.title}
          </h2>
          <p className="text-lg text-muted-foreground font-serif italic">
            {config.subtitle}
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

        {/* 特性卡片 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {config.features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="ink-card p-6 md:p-8 group hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-foreground/20 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-serif font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <span className="inline-block px-3 py-1 text-sm border border-foreground/30 bg-background/50">
                    {feature.highlight}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 数据统计 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {config.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {"comparison" in config && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-16 md:mt-20"
          >
            <h3 className="text-center text-xl md:text-2xl font-serif font-semibold mb-8">
              和纯形的定位差异
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {config.comparison.map((item) => (
                <div key={item.name} className="ink-card p-6 md:p-8">
                  <h4 className="text-xl font-serif font-semibold mb-3">
                    {item.name}
                  </h4>
                  <p className="font-mono text-sm mb-4">{item.summary}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
