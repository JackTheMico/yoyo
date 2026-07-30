/**
 * YinXingMethods 音形打法组件
 * 设计风格：武侠水墨 - 四条通道、一简、实战例子与性能数据
 *
 * 数字口径：一简与码元数据来自 rime/yoyo-yx-*.dict.yaml；
 * 词的统计按仓库发布的精简词库（60.0 万词）计算。
 */

import { motion } from "framer-motion";

const CHANNELS: [string, string, string, string][] = [
  ["B / C", "单手，不带空格", "1 码", "一简字，直接上屏"],
  ["b / c", "单手，带空格", "1 码", "第一击 → 一简词，直接上屏；前面有码 → 补单字第三码"],
  ["A", "双手，不带空格", "2 码", "打词：一击两码，两击满四码，下一键顶屏上屏"],
  ["a", "双手，带空格", "2 码", "第一击 → 单字前两码；前面有码 → 补词的第五、六码"],
];

const A_SLOTS: [string, string, string, string, string][] = [
  ["qA", "吃", "没有", "每天", "模型"],
  ["wA", "我", "我们", "问题", "味道"],
  ["eA", "是", "上", "使用", "什么"],
  ["rA", "不", "被", "比较", "不错"],
  ["tA", "小", "下", "需要", "学习"],
  ["aA", "中", "你", "这个", "知道"],
  ["sA", "和", "很", "还是", "很多"],
  ["dA", "的", "人", "但是", "都是"],
  ["fA", "有", "一", "一个", "因为"],
  ["gA", "在", "去", "自己", "其他"],
  ["zA", "他", "她", "他们", "通过"],
  ["xA", "更", "个", "公司", "感觉"],
  ["cA", "了", "来", "里面", "了解"],
  ["vA", "就", "可以", "进行", "技术"],
  ["bA", "而", "所以", "而且", "安全"],
];

export default function YinXingMethods() {
  return (
    <section id="yinxing-methods" className="scroll-mt-20 py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="ink-title text-3xl sm:text-4xl md:text-5xl mb-4">
            音形打法「四条通道」
          </h2>
          <p className="text-lg text-muted-foreground">
            字词在第一击就彻底分流
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* 四条通道 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="ink-card p-6 md:p-8 mb-8"
          >
            <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
              沿用 <code className="px-1 bg-secondary">A/a/B/b/C/c</code> 的记法：大写不带{" "}
              <code className="px-1 bg-secondary">Space</code>，小写带{" "}
              <code className="px-1 bg-secondary">Space</code>；
              <code className="px-1 bg-secondary">A/a</code> 双手并击，
              <code className="px-1 bg-secondary">B/b</code> 左手单手，
              <code className="px-1 bg-secondary">C/c</code> 右手单手。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium">通道</th>
                    <th className="text-left py-2 pr-4 font-medium">击键</th>
                    <th className="text-left py-2 pr-4 font-medium">一击出</th>
                    <th className="text-left py-2 font-medium">用途</th>
                  </tr>
                </thead>
                <tbody>
                  {CHANNELS.map(([channel, keys, count, use]) => (
                    <tr key={channel} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-4 font-mono font-semibold whitespace-nowrap">
                        {channel}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{keys}</td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{count}</td>
                      <td className="py-3 text-muted-foreground">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 className="text-lg font-serif font-semibold mt-8 mb-4">
              与纯形两套功法最要紧的两点不同
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-foreground text-background font-bold">
                  1
                </span>
                <p className="text-sm leading-relaxed pt-1 text-muted-foreground">
                  <strong className="text-foreground">
                    <code className="px-1">B</code>/<code className="px-1">C</code> 与{" "}
                    <code className="px-1">b</code>/<code className="px-1">c</code> 不再按字形结构分工。
                  </strong>
                  纯形里 <code className="px-1">b</code> 打 ⿰/⿺ 结构、<code className="px-1">c</code> 打其他结构；
                  呦呦左右手完全镜像等价，用哪只手纯看顺手。代价是少了一个结构筛选维度，
                  收益是同一个码元的四条通道能各挂一个不同的字/词。
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-foreground text-background font-bold">
                  2
                </span>
                <p className="text-sm leading-relaxed pt-1 text-muted-foreground">
                  <strong className="text-foreground">字词在第一击就彻底分流</strong>
                  <code className="px-1">A</code> 起手只出词，<code className="px-1">a</code> 起手只出单字，
                  <code className="px-1">B</code>/<code className="px-1">C</code> 只出一简字，
                  <code className="px-1">b</code>/<code className="px-1">c</code> 起手只出一简词。
                  四类编码互不重叠，不存在字词混选。
                </p>
              </div>
            </div>
          </motion.div>

          {/* 一简 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="ink-card p-6 md:p-8 mb-8"
          >
            <h3 className="text-xl md:text-2xl font-serif font-semibold mb-4">
              一简：700 个一击直出的字词
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              180 个码元 × 4 条通道 = <strong className="text-foreground">720 个一简槽位</strong>
              ，目前用掉 <strong className="text-foreground">700 个</strong>（346 个字 + 354 个词），
              跨通道零重码，全部<strong className="text-foreground">一击直接上屏，不用空格</strong>。
              对照：纯形的一简字 + 一简词共 60 个。
            </p>

            <div className="p-4 bg-foreground/5 border-l-4 border-foreground mb-6">
              <p className="text-sm leading-relaxed">
                <strong>其中 640 个不用背。</strong>
                非 A 指法的 320 个一简字和 320 个一简词，编码正好等于它自己的首码元——
                也就是「打出这个字的音、或这个词头一个字的音，它就直接上屏」。
                例如 <code className="px-1">dC</code>（如 → 如果 / 如何）、
                <code className="px-1">sD</code>（好 → 好的 / 好像）。
              </p>
            </div>

            <h4 className="text-lg font-serif font-semibold mb-4">
              只有 A 指法这 60 个是人工钉死的，建议背
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              A 是最省力的指法，值得把最高频的字词放进来，所以故意打破了上面的规律。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium">码元</th>
                    <th className="text-left py-2 pr-4 font-medium">
                      <code>_</code> 左手不带空格
                    </th>
                    <th className="text-left py-2 pr-4 font-medium">
                      <code>+</code> 右手不带空格
                    </th>
                    <th className="text-left py-2 pr-4 font-medium">
                      <code>&lt;</code> 左手带空格
                    </th>
                    <th className="text-left py-2 font-medium">
                      <code>&gt;</code> 右手带空格
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {A_SLOTS.map(([code, a, b, c, d]) => (
                    <tr key={code} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-4 font-mono font-semibold">{code}</td>
                      <td className="py-2 pr-4">{a}</td>
                      <td className="py-2 pr-4">{b}</td>
                      <td className="py-2 pr-4">{c}</td>
                      <td className="py-2">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* 实战例子 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="ink-card p-6 md:p-8 mb-8"
          >
            <h3 className="text-xl md:text-2xl font-serif font-semibold mb-6">实战</h3>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-sm font-medium bg-foreground text-background">
                  打单字
                </span>
                <span className="text-muted-foreground text-sm">
                  以「鸣」为例，<code className="px-1">鸣 = qF vC aI</code>（音 míng + 口 + 鸟）
                </span>
              </div>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>
                  第一击：<code className="px-1 bg-secondary">a</code>（双手带空格）出前两码{" "}
                  <code className="px-1 bg-secondary">qFvC</code>。两码层 4684 字零重码，此刻已唯一。
                </li>
                <li>继续输入下一键触发顶屏，「鸣」上屏。</li>
              </ol>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                若不在两码层的 4684 个之内就要补第三码。以「放」为例，两码{" "}
                <code className="px-1">tAtA</code> 被更高频的「方」占了：第一击{" "}
                <code className="px-1">a</code> 出 <code className="px-1">tAtA</code> → 第二击{" "}
                <code className="px-1">b</code> 或 <code className="px-1">c</code> 补{" "}
                <code className="px-1">tH</code>（哪只手都行）→ 下一键顶屏上屏。
              </p>
              <p className="text-sm mt-3">
                <strong>单字最多两击。</strong>346 个一简字只需一击（
                <code className="px-1">B</code>/<code className="px-1">C</code>），且直接上屏。
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-sm font-medium bg-foreground text-background">
                  打词
                </span>
                <span className="text-muted-foreground text-sm">
                  以「动物园」为例，主码 <code className="px-1">dI wC fK vJ</code>
                </span>
              </div>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>
                  第一击：<code className="px-1 bg-secondary">A</code>（双手不带空格）出{" "}
                  <code className="px-1 bg-secondary">dIwC</code>——「动」「物」两个字的音一起出来了。
                </li>
                <li>
                  第二击：<code className="px-1 bg-secondary">A</code> 出{" "}
                  <code className="px-1 bg-secondary">fKvJ</code>，满四码。四码层零重码，此刻唯一。
                </li>
                <li>继续输入下一键触发顶屏，「动物园」上屏。</li>
              </ol>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                短词常常一击就够：「中国」<code className="px-1">aIxB</code>、
                「世界」<code className="px-1">eEvB</code>、「以及」<code className="px-1">fEvE</code>
                ，一次双手并击即满两码。需要精确到全码时，第三击用{" "}
                <code className="px-1">a</code> 补末两码。若候选不是首选，按{" "}
                <code className="px-1">'</code> 选二选并立即上屏。
              </p>
              <p className="text-sm mt-3">
                <strong>词最多三击。</strong>354 个一简词只需一击（
                <code className="px-1">b</code>/<code className="px-1">c</code>），且直接上屏。
              </p>
            </div>
          </motion.div>

          {/* 性能 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="ink-card p-6 md:p-8"
          >
            <h3 className="text-xl md:text-2xl font-serif font-semibold mb-4">性能</h3>
            <p className="text-sm text-muted-foreground mb-6">
              按「几击能打出来」统计，括号内为按词频（白霜词库）加权的覆盖率。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium"></th>
                    <th className="text-left py-2 pr-4 font-medium">1 击</th>
                    <th className="text-left py-2 pr-4 font-medium">2 击</th>
                    <th className="text-left py-2 font-medium">3 击</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">单字（8105 字）</td>
                    <td className="py-3 pr-4">
                      4919 字（<strong>96.92%</strong>）
                    </td>
                    <td className="py-3 pr-4">
                      8105 字（<strong>100%</strong>）
                    </td>
                    <td className="py-3 text-muted-foreground">—</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">词（60.0 万词）</td>
                    <td className="py-3 pr-4">
                      28243 词（<strong>58.66%</strong>）
                    </td>
                    <td className="py-3 pr-4">
                      53.2 万词（<strong>97.58%</strong>）
                    </td>
                    <td className="py-3">
                      60.0 万词（<strong>100%</strong>）
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 bg-foreground/5 border-l-4 border-foreground">
              <p className="text-sm leading-relaxed">
                零重码的层：单字一简、单字两码、词一简、词两码、词四码。
                <strong>只有全码层有重码</strong>——单字 169 字、词 5772 词，
                选重（<code className="px-1">'</code>）只在这一层用得到。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
