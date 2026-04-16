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

const services = [
  {
    icon: "◎",
    title: "一對一 NLP 教練療癒",
    duration: "90 分鐘 / 次",
    desc: "針對你的核心議題——金錢、感情、事業、自我價值——進行深度的 NLP 教練對話，找到問題的根源信念，並在當次完成初步的改寫。",
    includes: ["核心信念溯源", "情緒釋放技術", "NLP 重塑技術", "行動藍圖制定"],
  },
  {
    icon: "◈",
    title: "潛意識催眠個案",
    duration: "120 分鐘 / 次",
    desc: "透過催眠引導，直接進入你的潛意識層，處理更深層的創傷記憶、情緒結節，讓改變在神經層面真正發生。",
    includes: ["放鬆引導入催眠", "時間線療法", "潛意識信念重植", "心錨建立"],
  },
  {
    icon: "◉",
    title: "生命轉化密集計畫",
    duration: "3 個月陪伴",
    desc: "最完整的個人化陪伴方案。結合每週教練對話、催眠個案、自我催眠練習，在三個月內系統性地重編你的生命劇本。",
    includes: ["每月 4 次教練對話", "每月 2 次催眠個案", "個人化自我練習計畫", "LINE 隨時文字支援"],
    highlight: true,
  },
  {
    icon: "◌",
    title: "企業 / 團體工作坊",
    duration: "半天 / 全天",
    desc: "為企業團隊、社群組織設計的客製化工作坊，透過 NLP 與教練技術，提升團隊溝通效能、領導力與心理韌性。",
    includes: ["主題客製化設計", "互動體驗形式", "後續追蹤支援", "線上線下皆可"],
  },
];

export default function ServicesPage() {
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
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase">服務介紹</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mt-3">
              一對一陪伴，<br className="md:hidden" />深度轉化
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-muted-foreground text-lg leading-relaxed">
              每個人的生命議題都是獨特的。我們不提供通用的解答，只提供量身設計的陪伴。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative z-10 py-12 px-6 pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.1}>
              <div className={`h-full p-8 rounded-2xl border space-y-6 relative overflow-hidden ${
                s.highlight
                  ? "border-primary/50 bg-gradient-to-br from-primary/15 to-primary/5 shadow-[0_0_40px_rgba(230,175,50,0.1)]"
                  : "border-primary/15 bg-card/40 hover:border-primary/30 transition-colors"
              }`}>
                {s.highlight && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    最受歡迎
                  </div>
                )}
                <div>
                  <span className="text-2xl text-primary/50">{s.icon}</span>
                  <h3 className="text-xl font-serif font-bold text-foreground mt-3">{s.title}</h3>
                  <p className="text-xs tracking-widest text-primary/60 mt-1">{s.duration}</p>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">{s.desc}</p>
                <div className="space-y-2">
                  <p className="text-xs tracking-widest text-primary/60 uppercase">包含</p>
                  <ul className="space-y-1.5">
                    {s.includes.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                        <span className="text-primary text-xs">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6 bg-card/30 overflow-hidden">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-serif font-bold">想了解適合你的服務？</h2>
            <p className="text-muted-foreground mt-4 leading-loose">
              歡迎透過 LINE 與我們聯繫，免費諮詢 15 分鐘，<br />讓我們一起找到最適合你的起點。
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <a
              href="https://lin.ee/Nq1MhuY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 font-bold text-white rounded-full transition-all duration-300 hover:scale-105 shadow-md"
              style={{ background: "#06C755" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.064-.022.134-.032.2-.032.21 0 .39.09.51.25l2.444 3.317V8.108c0-.345.282-.63.63-.63.345 0 .627.285.627.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              加入 LINE 免費諮詢
            </a>
          </FadeIn>
        </div>
      </section>

      <footer className="py-8 text-center text-muted-foreground/40 text-sm border-t border-primary/10 relative z-10">
        © 2024 宇宙序能教育品牌 ｜ JJ 林炳騰
      </footer>
    </div>
  );
}
