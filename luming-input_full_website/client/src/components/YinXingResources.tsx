import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type HeightMessage =
  | { type: "yx-zigen-height"; height: number }
  | { type: "yx-practice-height"; height: number };

function OpenStandalone({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-background text-sm hover:border-foreground/40 transition-colors"
    >
      {label}
      <ExternalLink className="w-4 h-4" aria-hidden="true" />
    </a>
  );
}

function ZhemeiCard() {
  return (
    <svg
      viewBox="0 0 320 320"
      role="img"
      aria-label="折梅水墨意象"
      className="w-48 h-48 md:w-64 md:h-64 opacity-90"
    >
      <defs>
        <filter id="zhemei-ink">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="3"
            seed="12"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.8" />
        </filter>
        <radialGradient id="zhemei-paper" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#fbfaf5" />
          <stop offset="100%" stopColor="#eee9dd" />
        </radialGradient>
        <g id="zhemei-blossom">
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="0"
              cy="-8"
              rx="5.5"
              ry="8.5"
              fill="#9d332b"
              opacity="0.88"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle r="3" fill="#37251f" />
        </g>
      </defs>

      <rect width="320" height="320" fill="url(#zhemei-paper)" />
      <path
        d="M55 253 C105 240 105 198 147 177 C188 157 232 151 276 75"
        fill="none"
        stroke="#191815"
        strokeWidth="15"
        strokeLinecap="round"
        opacity="0.88"
        filter="url(#zhemei-ink)"
      />
      <path
        d="M141 181 C132 145 116 120 89 98 M184 161 C203 189 226 211 258 218 M224 139 C247 133 269 116 282 94"
        fill="none"
        stroke="#25231f"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.76"
        filter="url(#zhemei-ink)"
      />
      <path
        d="M48 260 C111 285 215 276 278 212"
        fill="none"
        stroke="#211f1b"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.18"
        filter="url(#zhemei-ink)"
      />

      <use href="#zhemei-blossom" transform="translate(89 98) scale(1.15)" />
      <use href="#zhemei-blossom" transform="translate(131 149) scale(.85)" />
      <use href="#zhemei-blossom" transform="translate(185 160) scale(1.05)" />
      <use href="#zhemei-blossom" transform="translate(240 128) scale(.9)" />
      <use href="#zhemei-blossom" transform="translate(278 82) scale(1.2)" />
      <use href="#zhemei-blossom" transform="translate(258 218) scale(.78)" />

      {[
        [66, 230, 2.4],
        [78, 217, 1.4],
        [113, 266, 1.8],
        [207, 75, 1.5],
        [288, 145, 2.1],
      ].map(([cx, cy, radius]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={radius}
          fill="#171613"
          opacity="0.38"
        />
      ))}
    </svg>
  );
}

export default function YinXingResources() {
  const zigenRef = useRef<HTMLIFrameElement>(null);
  const practiceRef = useRef<HTMLIFrameElement>(null);
  const [zigenHeight, setZigenHeight] = useState(760);
  const [practiceHeight, setPracticeHeight] = useState(1080);

  useEffect(() => {
    const handleHeight = (event: MessageEvent<HeightMessage>) => {
      if (
        event.source === zigenRef.current?.contentWindow &&
        event.data?.type === "yx-zigen-height"
      ) {
        setZigenHeight(Math.max(560, event.data.height));
      }
      if (
        event.source === practiceRef.current?.contentWindow &&
        event.data?.type === "yx-practice-height"
      ) {
        setPracticeHeight(Math.max(900, event.data.height));
      }
    };

    window.addEventListener("message", handleHeight);
    return () => window.removeEventListener("message", handleHeight);
  }, []);

  return (
    <>
      <section
        id="yx-zigen"
        className="scroll-mt-20 py-24 md:py-32 bg-background"
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
              音形指法「折梅」
            </h2>
            <p className="text-lg text-muted-foreground font-serif italic">
              单手一击声韵
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-12"
            >
              <ZhemeiCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="ink-card p-6 md:p-8 mb-8"
            >
              <blockquote className="border-l-4 border-foreground/30 pl-4 mb-6 text-lg font-serif italic">
                江南无所有，聊赠一枝春。
              </blockquote>
              <div className="text-lg leading-relaxed space-y-2">
                <div>
                  「折梅」以一次单手并击打出一个声韵码元。
                </div>
                <div>
                  具体按键采用平移与镜像布局（详见下方音形字根表），可对照各键位指法找出规律。
                  悬停每格左上角的<span className="text-rose-600">●</span>指法图可查看对应左右手按键。
                </div>
              </div>
         
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="ink-card p-3 md:p-6"
          >
            <p className="mb-4 text-center text-sm leading-relaxed text-muted-foreground">
              15 个声母键 × 12 种韵母指法构成 180
              个码元；点击字根可查看例字和编码。
            </p>
            <div className="flex justify-end mb-4">
              <OpenStandalone
                href="/yx/zigen-table.html"
                label="在新窗口打开字根表"
              />
            </div>
            <iframe
              ref={zigenRef}
              src="/yx/zigen-table.html"
              title="呦呦音形字根表"
              loading="lazy"
              width="100%"
              height={zigenHeight}
              className="block border-0 bg-transparent"
            />
          </motion.div>
        </div>
      </section>

      <section
        id="yx-practice"
        className="scroll-mt-20 py-24 md:py-32 bg-muted/30"
      >
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="ink-title text-3xl sm:text-4xl md:text-5xl mb-4">
              呦呦·音形并击练习
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              依次练习 180 个码元、466 个字根、700 个一简和单字全码。
              练习器会按真实并击结算，并校验左右手与空格通道。
            </p>
          </div>

          <div className="ink-card p-3 md:p-6">
            <div className="flex justify-end mb-4">
              <OpenStandalone
                href="/yx/practice.html"
                label="在新窗口专注练习"
              />
            </div>
            <iframe
              ref={practiceRef}
              src="/yx/practice.html"
              title="呦呦音形并击练习"
              loading="lazy"
              width="100%"
              height={practiceHeight}
              className="block border-0 bg-transparent"
            />
          </div>
        </div>
      </section>
    </>
  );
}
