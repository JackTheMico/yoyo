/**
 * YinXing 音形分支「呦呦」介绍组件
 * 设计风格：武侠水墨 - 与纯形部分并列的独立分支介绍
 *
 * 表格数据来自 zigen_table/mapping-yx.yaml（由字表反推生成，与 Rime 方案一致）。
 */

import { motion } from "framer-motion";

const SHENGMU: [string, string][] = [
  ["q", "m ch"],
  ["w", "c w"],
  ["e", "p sh"],
  ["r", "b"],
  ["t", "f x"],
  ["a", "n zh"],
  ["s", "h"],
  ["d", "d r"],
  ["f", "y"],
  ["g", "z q"],
  ["z", "t"],
  ["x", "g"],
  ["c", "l"],
  ["v", "k j"],
  ["b", "s、零声母"],
];

const YUNMU: [string, string, string][] = [
  ["A", "ang ia ua ve", "最省力（单键）"],
  ["B", "ng en ie uo", "两指"],
  ["C", "ou u", "两指"],
  ["D", "ao ian", "两指"],
  ["E", "i", "两指"],
  ["F", "ing e", "两指"],
  ["G", "uai a ue iang", "三指"],
  ["H", "an in", "三指"],
  ["I", "ong o iao un", "三指"],
  ["J", "ai iu uang", "三指"],
  ["K", "iong m uan er eng v", "三指"],
  ["L", "ui ei", "三指"],
];

const CHARS: [string, string, string, string, string][] = [
  ["鸣", "míng qF", "口 vC", "鸟 aI", "qFvCaI"],
  ["想", "xiǎng tG", "木 bB", "心 tI", "tGbBtI"],
  ["谢", "xiè tB", "讠 bG", "寸 wI", "tBbGwI"],
  ["放", "fàng tA", "方 tA", "攵 tH", "tAtAtH"],
];

const WORD_RULES: [string, string, string][] = [
  ["二字", "甲① 乙① 乙② 乙③", "甲② 甲③"],
  ["三字", "甲① 乙① 丙① 丙②", "丙③ 甲②"],
  ["四字", "甲① 乙① 丙① 丁①", "丁② 丁③"],
  ["五字", "甲① 乙① 丙① 丁①", "戊① 戊②"],
  ["六字以上", "甲① 乙① 丙① 丁①", "戊① 末①"],
];

export default function YinXing() {
  return (
    <section
      id="yinxing"
      className="scroll-mt-20 py-24 md:py-32 bg-secondary/30"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="ink-title text-3xl sm:text-4xl md:text-5xl mb-4">
            音形分支「呦呦」
          </h2>
          <p className="text-lg text-muted-foreground">
            呦呦鹿鸣，好听好听
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* 它和纯形是什么关系 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="ink-card p-6 md:p-8 mb-8"
          >
            <h3 className="text-xl md:text-2xl font-serif font-semibold mb-4">
              先说清它和纯形的关系
            </h3>
            <p className="text-lg leading-relaxed mb-4">
              「呦呦」不是前面两套功法的第三种打法，而是<strong>换掉了取码规则</strong>的独立分支：
              单字的第一码由字根改成了<strong>音节</strong>，所以叫「音形」。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              字根沿用同一张字根表，但码元空间从 60 个扩到 180 个，编码全不一样——
              纯形的「北冥 / 无相」所有编码示例在这里都不适用。本节独立完整，不必先读纯形部分。
            </p>
            <div className="mt-6 p-4 bg-foreground/5 border-l-4 border-foreground">
              <p className="text-sm leading-relaxed">
                音形混合、字词由第一击分流、<strong>单字三码定长（一击顶功） / 词六码定长（二击顶功）</strong>、180 码元、
                【4684 字两码零重码】、【50 万词四码零重码】、【700 个一击直出】。
              </p>
            </div>
          </motion.div>

          {/* 码元 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="ink-card p-6 md:p-8 mb-8"
          >
            <h3 className="text-xl md:text-2xl font-serif font-semibold mb-4">
              心法「音形基础」：一码 = 一个码元 = 一次单手并击
            </h3>
            <div className="p-4 bg-background border border-border mb-6 text-center">
              <code className="text-base md:text-lg">
                码元 = 声母键（小写，15 个）+ 韵母指法（大写，12 个）
              </code>
              <div className="mt-2 text-sm text-muted-foreground">
                15 × 12 = <strong>180 个码元</strong>，既用来写音节，也用来写字根
              </div>
            </div>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">一次单手并击 = 一个码元。</strong>
                如按 <code className="px-1 bg-secondary">q</code> 出{" "}
                <code className="px-1 bg-secondary">qA</code>，
                <code className="px-1 bg-secondary">q</code>+
                <code className="px-1 bg-secondary">w</code> 出{" "}
                <code className="px-1 bg-secondary">qF</code>。
              </p>
              <p>
                <strong className="text-foreground">左右手镜像对称</strong>，两只手都能打出全部 180 个码元。
              </p>
              <p>
                <strong className="text-foreground">一次双手并击 = 两个码元 = 四个字母</strong>
                ，这就是「一击两个字」。
              </p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              下文说「几码」，一码即一个码元、两个字母。所以单字全码是六个字母、词全码是十二个字母。
            </p>
            <p className="mt-4 p-4 bg-foreground/5 border-l-4 border-foreground text-sm leading-relaxed">
              这套 180 码元并击指法名为<strong>「折梅」</strong>。
              这里不另展开指法介绍，具体按键位置见下方音形字根表。
            </p>
          </motion.div>

          {/* 声母表 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="ink-card p-6 md:p-8 mb-8"
          >
            <h3 className="text-xl md:text-2xl font-serif font-semibold mb-6">
              声母 → 键位（15 组）
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {SHENGMU.map(([key, initials]) => (
                <div
                  key={key}
                  className="p-3 bg-background border border-border text-center"
                >
                  <div className="font-mono text-lg font-semibold">{key}</div>
                  <div className="text-xs text-muted-foreground mt-1">{initials}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 韵母表 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="ink-card p-6 md:p-8 mb-8"
          >
            <h3 className="text-xl md:text-2xl font-serif font-semibold mb-6">
              韵母 → 指法（12 组）
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium">指法</th>
                    <th className="text-left py-2 pr-4 font-medium">韵母</th>
                    <th className="text-left py-2 font-medium">省力程度</th>
                  </tr>
                </thead>
                <tbody>
                  {YUNMU.map(([finger, finals, effort]) => (
                    <tr key={finger} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-4 font-mono font-semibold">{finger}</td>
                      <td className="py-2 pr-4 font-mono text-muted-foreground">{finals}</td>
                      <td className="py-2 text-muted-foreground">{effort}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              <code className="px-1 bg-secondary">v</code> = ü；
              <code className="px-1 bg-secondary">ue</code> 是 jue/que/xue 的韵母，
              <code className="px-1 bg-secondary">ve</code> 是 lve/nve 的韵母。
              A 最省力，所以 A 指法上的一简是人工挑选的高频字词（见下节）。
            </p>
          </motion.div>

          {/* 单字取码 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="ink-card p-6 md:p-8 mb-8"
          >
            <h3 className="text-xl md:text-2xl font-serif font-semibold mb-6">
              取码规则·单字：三码定长
            </h3>
            <div className="p-4 bg-background border border-border mb-6 text-center">
              <code className="text-base">单字全码 = 音节码 + 首字根码 + 末字根码</code>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium">字</th>
                    <th className="text-left py-2 pr-4 font-medium">音节</th>
                    <th className="text-left py-2 pr-4 font-medium">首字根</th>
                    <th className="text-left py-2 pr-4 font-medium">末字根</th>
                    <th className="text-left py-2 font-medium">全码</th>
                  </tr>
                </thead>
                <tbody>
                  {CHARS.map(([char, syllable, first, last, code]) => (
                    <tr key={char} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-4 font-serif text-lg">{char}</td>
                      <td className="py-2 pr-4 font-mono text-muted-foreground">{syllable}</td>
                      <td className="py-2 pr-4 font-mono text-muted-foreground">{first}</td>
                      <td className="py-2 pr-4 font-mono text-muted-foreground">{last}</td>
                      <td className="py-2 font-mono font-semibold">{code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 bg-foreground/5 border-l-4 border-foreground">
              <p className="text-sm leading-relaxed">
                同偏旁的字第二码必然相同，这是形码部分带来的确定感：
                吃 <code className="px-1">qEvC</code>、吗 <code className="px-1">qGvC</code>、
                吧 <code className="px-1">rGvC</code>、听 <code className="px-1">zFvC</code>、
                叫 <code className="px-1">vIvC</code>、鸣 <code className="px-1">qFvC</code>
                ——后面那个 <code className="px-1">vC</code> 都是「口」。
              </p>
            </div>
          </motion.div>

          {/* 词取码 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="ink-card p-6 md:p-8"
          >
            <h3 className="text-xl md:text-2xl font-serif font-semibold mb-4">
              取码规则·词：四码顶功，全码六码
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              甲乙丙…表示词中各字，①②③ 表示该字的第 1 / 2 / 3 码。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium">词长</th>
                    <th className="text-left py-2 pr-4 font-medium">前四码（主码）</th>
                    <th className="text-left py-2 font-medium">全码后两码</th>
                  </tr>
                </thead>
                <tbody>
                  {WORD_RULES.map(([length, main, tail]) => (
                    <tr key={length} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-4">{length}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{main}</td>
                      <td className="py-2 text-muted-foreground">{tail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <p>
                一个 = 一① 个① 个② 个③ ={" "}
                <code className="px-2 py-1 bg-secondary border">fExFvDeC</code>
                ，全码补 一②③ → <code className="px-1">fExFvDeCsKfE</code>
              </p>
              <p>
                动物园 = 动① 物① 园① 园② ={" "}
                <code className="px-2 py-1 bg-secondary border">dIwCfKvJ</code>
                ，全码补 园③ 动② → <code className="px-1">dIwCfKvJeIfI</code>
              </p>
            </div>
            <p className="mt-6 text-base leading-relaxed">
              <strong>词的前两码永远是头两个字的音节码</strong>
              ，所以一次双手并击就把两个字的音一起打出来了——这是呦呦「一击两个字」的由来。
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
