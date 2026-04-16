import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";

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

const sections = [
  {
    href: "/course",
    icon: "✦",
    tag: "課程報名",
    title: "顯化導演系統",
    desc: "融合 NLP、催眠技術與神經科學，幫你改寫潛意識程式，從根本翻轉人生模式。",
    cta: "了解課程",
    accent: "from-primary/20 to-primary/5",
    border: "border-primary/30",
  },
  {
    href: "/services",
    icon: "◎",
    tag: "服務介紹",
    title: "一對一教練 & 個案服務",
    desc: "量身設計的潛意識療癒與教練陪伴，深入你的核心議題，加速你的生命轉化。",
    cta: "了解服務",
    accent: "from-[hsl(280,30%,20%)]/20 to-transparent",
    border: "border-[hsl(280,30%,60%)]/20",
  },
  {
    href: "/events",
    icon: "❋",
    tag: "講座活動",
    title: "公開講座 & 體驗工作坊",
    desc: "定期舉辦免費或低價的體驗活動，讓你在輕鬆的氛圍中初探潛意識的世界。",
    cta: "查看活動",
    accent: "from-[hsl(35,50%,30%)]/20 to-transparent",
    border: "border-[hsl(35,50%,60%)]/20",
  },
  {
    href: "/about",
    icon: "⊹",
    tag: "關於宇宙序能",
    title: "品牌故事 & 教練介紹",
    desc: "JJ 林炳騰從負債走向翻轉，以親身驗證的歷程，陪伴更多人重寫自己的人生劇本。",
    cta: "認識我們",
    accent: "from-[hsl(200,30%,20%)]/20 to-transparent",
    border: "border-[hsl(200,30%,60%)]/20",
  },
];

export default function BrandHome() {
  return (
    <div className="bg-background text-foreground font-sans min-h-screen pt-16">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      {/* Hero */}
      <section className="relative z-10 min-h-[85vh] flex items-center justify-center px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <FadeIn>
            <p className="text-xs tracking-[0.4em] text-primary/60 uppercase">宇宙序能教育品牌</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
              顯化導演系統
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-muted-foreground font-serif leading-relaxed">
              你的人生，是有劇本的。<br />
              <span className="text-foreground">而你，可以成為自己人生的導演。</span>
            </p>
          </FadeIn>
          <FadeIn delay={0.35}>
            <p className="text-muted-foreground/70 leading-loose max-w-xl mx-auto">
              透過 NLP、催眠、神經科學與東方能量智慧，幫助你看見潛意識程式、重寫人生劇本、活出真正想要的生命。
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link
                href="/course"
                className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(230,175,50,0.25)]"
              >
                探索課程 →
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 border border-primary/30 text-foreground font-medium rounded-full hover:border-primary/60 hover:bg-primary/5 transition-all duration-300"
              >
                認識我們
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4 Section Cards */}
      <section className="relative z-10 py-20 px-6 bg-card/20">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.3em] text-primary/60 uppercase mb-3">我們提供什麼</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold">從覺察到翻轉的完整陪伴</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((s, i) => (
              <FadeIn key={s.href} delay={i * 0.1}>
                <Link href={s.href}>
                  <div className={`group h-full p-8 border ${s.border} bg-gradient-to-br ${s.accent} rounded-2xl hover:border-primary/40 transition-all duration-400 cursor-pointer hover:shadow-[0_0_40px_rgba(230,175,50,0.08)] relative overflow-hidden`}>
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs tracking-[0.3em] text-primary/60 uppercase">{s.tag}</span>
                        <span className="text-2xl text-primary/40 group-hover:text-primary/80 transition-colors duration-300">{s.icon}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary/90 transition-colors duration-300">
                        {s.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                      <div className="pt-2">
                        <span className="text-sm font-medium text-primary/70 group-hover:text-primary transition-colors duration-200">
                          {s.cta} →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { num: "97%", label: "潛意識影響你的行為", desc: "你以為是你在決定，其實是舊程式在執行。" },
              { num: "500+", label: "學員陪伴轉化", desc: "每一位走過的學員，都是真實改寫過的生命。" },
              { num: "10+", label: "年潛意識研究實踐", desc: "JJ 親身驗證，才敢教你的方法。" },
            ].map((item, i) => (
              <FadeIn key={item.num} delay={i * 0.1}>
                <div className="space-y-2">
                  <div className="text-4xl font-serif font-bold text-primary">{item.num}</div>
                  <div className="font-semibold text-sm text-foreground">{item.label}</div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 px-6 bg-card/20 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 rounded-[100%] blur-[120px] scale-150 pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative z-10 space-y-8">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase">準備好了嗎</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mt-3">
              你的轉變，從這裡開始
            </h2>
            <p className="text-muted-foreground mt-4 leading-loose">
              不需要先準備好，不需要先確認自己「夠格」。<br />
              那個「還沒準備好」的聲音，就是等待被改寫的舊程式。
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://forms.gle/LEXcQ5wtHkaXbCqL9"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(230,175,50,0.3)]"
              >
                立即預約報名 →
              </a>
              <a
                href="https://lin.ee/Nq1MhuY"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 border border-primary/30 text-foreground font-medium rounded-full hover:border-primary/60 transition-all duration-300 flex items-center gap-2"
              >
                <span style={{ color: "#06C755" }}>LINE</span> 諮詢
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
