/**
 * Home 纯形分支首页
 * 设计风格：武侠水墨 - 麓鸣纯形输入法介绍
 */

import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import EncodingRules from "@/components/EncodingRules";
import Methods from "@/components/Methods";
import Fingering from "@/components/Fingering";
import WordRules from "@/components/WordRules";
import ZigenTableStandalone from "@/components/ZigenTableStandalone";
import PracticeTool from "@/components/PracticeTool";
import Install from "@/components/Install";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    document.title = "麓鸣纯形 · 麓鸣输入法";
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <EncodingRules />
        <Methods />
        <Fingering />
        <WordRules />
        <ZigenTableStandalone />
        <section id="practice" className="py-24 bg-muted/30">
          <div className="container">
            <PracticeTool />
          </div>
        </section>
        <Install />
      </main>
      <Footer />
    </div>
  );
}
