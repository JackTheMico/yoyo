import Footer from "@/components/Footer";
import Features from "@/components/Features";
import Header from "@/components/Header";
import YinXing from "@/components/YinXing";
import YinXingMethods from "@/components/YinXingMethods";
import YinXingResources from "@/components/YinXingResources";
import Install from "@/components/Install";
import { useEffect } from "react";

export default function YinXingPage() {
  useEffect(() => {
    document.title = "呦呦音形 · 麓鸣输入法";
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="min-h-[72vh] pt-32 pb-20 flex items-center bg-background">
          <div className="container text-center">
            <p className="text-sm tracking-[0.3em] text-muted-foreground mb-5">
              麓鸣输入法 · 音形分支
            </p>
            <h1 className="ink-title text-5xl sm:text-6xl md:text-7xl mb-6">
              呦呦音形
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              先打音，再取形；一击两个字
            </p>
            <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed mb-10">
              单字三码定长、一击顶功，词二击顶功。180 个码元由左右手镜像并击，
              字词从第一击开始分流。
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {["180 码元", "466 字根", "700 一简", "字词零混选"].map(
                (item) => (
                  <span
                    key={item}
                    className="px-4 py-2 bg-secondary border border-border text-sm"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="#yinxing"
                className="px-6 py-3 bg-foreground text-background border border-foreground"
              >
                从原理开始
              </a>
              <button
                onClick={() =>
                  document
                    .getElementById("yx-practice")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-6 py-3 bg-background border border-foreground hover:bg-secondary transition-colors"
              >
                直接练习
              </button>
            </div>
          </div>
        </section>
        <Features variant="yinxing" />
        <YinXing />
        <YinXingMethods />
        <YinXingResources />
        <Install />
      </main>
      <Footer />
    </div>
  );
}
