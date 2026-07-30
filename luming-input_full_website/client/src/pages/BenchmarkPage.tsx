import CollisionBenchmark from "@/components/CollisionBenchmark";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useEffect } from "react";

export default function BenchmarkPage() {
  useEffect(() => {
    document.title = "重码测评 · 麓鸣输入法";
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-background">
          <div className="container text-center">
            <p className="mb-5 text-sm tracking-[0.3em] text-muted-foreground">
              纯形 · 音形
            </p>
            <h1 className="ink-title mb-6 text-4xl sm:text-5xl md:text-6xl">
              重码对照测评
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
              按相同频序层级并列展示纯形与音形的重码组数。
              多字简码另列音形全码的前四码结果，避免只拿纯形四码与音形六码比较。
              悬停数字即可查看具体编码和字词。
            </p>
          </div>
        </section>
        <CollisionBenchmark />
      </main>
      <Footer />
    </div>
  );
}
