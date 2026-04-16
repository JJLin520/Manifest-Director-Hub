import React from "react";
import { motion } from "framer-motion";

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

const values = [
  { icon: "◎", title: "親身驗證", desc: "我們只教自己走過、驗證過的方法。不是理論，是真實走出來的路。" },
  { icon: "◈", title: "看見本質", desc: "不治標，直搗根源。找到那個信念最初是怎麼種進來的，才能真正拔除。" },
  { icon: "◉", title: "陪伴到底", desc: "轉化不是一次感動，是長期的練習。我們在你每一個步驟旁邊。" },
  { icon: "◌", title: "每個人都值得", desc: "不論你的起點在哪，改變都是可能的。這不是我說的，是神經科學。" },
];

const credentials = [
  "NLP 執行師 / 高階執行師認證",
  "催眠導師認證（NGH 美國催眠師公會）",
  "時間線療法認證執行師",
  "ACE 國際教練認證",
  "國考合格物理治療師",
  "國內外多位大師直接受訓",
];

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground font-sans min-h-screen pt-16">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      {/* Hero */}
      <section className="relative z-10 py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase">關於宇宙序能</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mt-3">
              宇宙序能<br className="md:hidden" />教育品牌
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-muted-foreground text-lg leading-relaxed">
              「序能」——整理能量，回歸秩序，讓生命的本然力量流動起來。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Founder Story */}
      <section className="relative z-10 py-16 px-6 bg-card/20">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase mb-6">創辦人 JJ 林炳騰</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-10 text-primary/90">
              「我自己也曾經以為，一切都是命運。」
            </h2>
          </FadeIn>

          <div className="space-y-6 text-lg leading-loose text-muted-foreground">
            <FadeIn delay={0.1}>
              <p>那一年，創業失敗、負債，不是電影裡帥氣的那種破釜沉舟——是深夜盯著帳單、不敢接電話、不知道明天怎麼辦的真實窒息感。我進入了憂鬱症的狀態。</p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="border-l-2 border-primary/40 pl-6 py-2">
                <p className="text-foreground">
                  就在那個幾乎要放棄的夜晚，因緣際會聽到了一場關於「潛意識」的講座。我報名了課程。那一天，某個東西在我內部鬆動了。
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p>
                我開始每天自我催眠，深入 NLP，上了國內外大師的課程，找了教練一對一陪我走。生命開始，不是「好轉」，而是<span className="text-primary font-semibold">親證翻轉</span>。
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p>
                我後來才明白：困住我的，不是負債本身，是我腦袋裡那套比負債更古老的程式。
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p>
                從那一天起，我開始學習、認證、實踐，陪伴更多人走過類似的暗夜。<strong className="text-foreground">宇宙序能</strong>，就是從這裡長出來的。
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase mb-6">專業認證</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-4">
            {credentials.map((c, i) => (
              <FadeIn key={c} delay={i * 0.08}>
                <div className="flex items-center gap-3 p-5 border border-primary/15 rounded-xl bg-card/40">
                  <span className="text-primary text-sm">▸</span>
                  <span className="text-sm text-foreground">{c}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="relative z-10 py-16 px-6 bg-card/20">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] text-primary/60 uppercase mb-3">我們的信念</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold">宇宙序能的核心價值</h2>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1}>
                <div className="p-7 border border-primary/15 rounded-2xl bg-background/60 space-y-3">
                  <span className="text-xl text-primary/50">{v.icon}</span>
                  <h3 className="font-serif font-bold text-lg text-foreground">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 rounded-[100%] blur-[120px] scale-150 pointer-events-none" />
        <div className="max-w-xl mx-auto space-y-8 relative z-10">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-serif font-bold">和我們一起走</h2>
            <p className="text-muted-foreground mt-4 leading-loose">
              不論你現在在哪個起點，歡迎加入 LINE 與我們聯繫，<br />我們很期待認識你。
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://lin.ee/Nq1MhuY"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 font-bold text-white rounded-full transition-all duration-300 hover:scale-105"
                style={{ background: "#06C755" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.064-.022.134-.032.2-.032.21 0 .39.09.51.25l2.444 3.317V8.108c0-.345.282-.63.63-.63.345 0 .627.285.627.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                加入 LINE 聯繫我們
              </a>
              <a
                href="https://forms.gle/LEXcQ5wtHkaXbCqL9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 border border-primary/40 text-foreground font-medium rounded-full hover:border-primary hover:bg-primary/5 transition-all"
              >
                課程報名 →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="py-8 text-center text-muted-foreground/40 text-sm border-t border-primary/10 relative z-10">
        © 2024 宇宙序能教育品牌 ｜ JJ 林炳騰
      </footer>
    </div>
  );
}
