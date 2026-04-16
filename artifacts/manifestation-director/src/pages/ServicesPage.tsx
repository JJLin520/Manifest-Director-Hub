import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINE_URL = "https://lin.ee/Nq1MhuY";

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

const services = [
  {
    id: "nlp",
    icon: "◎",
    emoji: "🧠",
    title: "一對一 NLP 教練療癒",
    tagline: "找到核心信念，當次改寫",
    duration: "90 分鐘 / 次",
    tag: "最快見效",
    desc: "針對你的核心議題——金錢、感情、事業、自我價值——進行深度的 NLP 教練對話，找到問題的根源信念，並在當次完成初步的改寫。不只是談話，而是真正有工具有技術的轉化。",
    includes: [
      "核心信念溯源",
      "情緒釋放技術（EFT + NLP）",
      "限制性信念重塑",
      "當次行動藍圖制定",
    ],
    suitable: ["卡關已久的人", "想快速清理情緒的人", "剛開始療癒旅程的人"],
    color: "from-blue-900/30 to-blue-900/5",
    border: "border-blue-500/20 hover:border-blue-400/40",
  },
  {
    id: "hypnosis",
    icon: "◈",
    emoji: "🌀",
    title: "潛意識催眠個案",
    tagline: "深層創傷，神經層面真正改變",
    duration: "120 分鐘 / 次",
    tag: "深度療癒",
    desc: "透過催眠引導，直接進入你的潛意識層，處理更深層的創傷記憶與情緒結節。許多人談了多年的問題，在催眠中一次處理。改變在神經層面真正發生，不是靠意志力強撐。",
    includes: [
      "放鬆引導進入催眠狀態",
      "時間線療法（Time Line Therapy）",
      "潛意識信念重植",
      "個人心錨建立",
    ],
    suitable: ["有童年創傷的人", "情緒模式反覆出現的人", "想深度療癒的人"],
    color: "from-purple-900/30 to-purple-900/5",
    border: "border-purple-500/20 hover:border-purple-400/40",
  },
  {
    id: "intensive",
    icon: "◉",
    emoji: "✨",
    title: "生命轉化密集計畫",
    tagline: "三個月，系統性重編你的生命劇本",
    duration: "3 個月陪伴",
    tag: "最受歡迎",
    highlight: true,
    desc: "最完整的個人化陪伴方案。結合每週教練對話、催眠個案、自我催眠練習，在三個月內系統性地重編你的生命劇本。這不是課程，是真正的人生轉化陪伴。",
    includes: [
      "每月 4 次一對一教練對話",
      "每月 2 次催眠個案",
      "個人化自我練習計畫",
      "LINE 隨時文字支援",
      "月度回顧與方向調整",
    ],
    suitable: ["準備大幅改變人生的人", "想在事業或感情上突破的人", "願意深耕三個月的人"],
    color: "from-primary/20 to-primary/5",
    border: "border-primary/40 hover:border-primary/60",
  },
  {
    id: "workshop",
    icon: "◌",
    emoji: "🏢",
    title: "企業 / 團體工作坊",
    tagline: "讓整個團隊同頻，一起升級",
    duration: "半天 / 全天",
    tag: "客製設計",
    desc: "為企業團隊、社群組織設計的客製化工作坊，透過 NLP 與教練技術，提升團隊溝通效能、領導力與心理韌性。已為多個企業與社群舉辦，口碑深厚。",
    includes: [
      "主題與流程客製化設計",
      "互動體驗形式（非單向講課）",
      "現場情緒工具練習",
      "後續一個月追蹤支援",
      "線上線下皆可執行",
    ],
    suitable: ["企業主管培訓", "創業社群共學", "親子或家庭工作坊"],
    color: "from-emerald-900/30 to-emerald-900/5",
    border: "border-emerald-500/20 hover:border-emerald-400/40",
  },
];

export default function ServicesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-background text-foreground font-sans min-h-screen pt-16">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase">服務介紹</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mt-3 leading-tight">
              量身設計，深度陪伴
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-muted-foreground text-lg leading-relaxed">
              每個人的生命議題都是獨特的。<br />
              以下是目前提供的服務，點選卡片可展開詳細介紹。
            </p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 font-bold text-white rounded-full text-sm shadow-lg hover:scale-105 transition-all"
              style={{ background: "#06C755" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.03 2 11c0 3.08 1.72 5.79 4.32 7.47V22l3.36-1.85c.75.21 1.53.32 2.32.32 5.52 0 10-4.03 10-9S17.52 2 12 2z"/>
              </svg>
              立即預約諮詢
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ── Quick overview grid ──────────────────────── */}
      <section className="relative z-10 px-6 pb-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] text-primary/50 uppercase text-center mb-6">所有服務一覽</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {services.map((s, i) => (
              <FadeIn key={s.id} delay={i * 0.08}>
                <button
                  onClick={() => {
                    setExpanded(expanded === s.id ? null : s.id);
                    setTimeout(() => {
                      document.getElementById(`detail-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 bg-gradient-to-br ${s.color} ${s.border} ${
                    expanded === s.id ? "ring-1 ring-primary/40" : ""
                  }`}
                >
                  <span className="text-2xl block mb-2">{s.emoji}</span>
                  <p className="font-serif font-bold text-sm text-foreground leading-tight">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.duration}</p>
                  {s.tag && (
                    <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-bold rounded-full ${
                      s.highlight
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10 text-foreground/70"
                    }`}>
                      {s.tag}
                    </span>
                  )}
                </button>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.35}>
            <p className="text-center text-xs text-muted-foreground/50 mt-4">點選卡片查看詳細介紹 ↓</p>
          </FadeIn>
        </div>
      </section>

      {/* ── Detailed sections ────────────────────────── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-4">
          {services.map((s, i) => (
            <FadeIn key={s.id} delay={i * 0.07}>
              <div id={`detail-${s.id}`} className={`rounded-2xl border overflow-hidden bg-gradient-to-br ${s.color} ${s.border} transition-all duration-300`}>
                {/* Header — always visible */}
                <button
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  className="w-full text-left px-6 py-5 flex items-center gap-4"
                >
                  <span className="text-3xl shrink-0">{s.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-bold text-lg text-foreground">{s.title}</h3>
                      {s.highlight && (
                        <span className="px-2.5 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full shrink-0">
                          {s.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-primary/70 mt-0.5">{s.tagline}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.duration}</p>
                  </div>
                  <motion.span
                    animate={{ rotate: expanded === s.id ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-muted-foreground text-lg shrink-0"
                  >
                    ▾
                  </motion.span>
                </button>

                {/* Expanded detail */}
                <AnimatePresence initial={false}>
                  {expanded === s.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-5 border-t border-white/5 pt-5">
                        <p className="text-muted-foreground leading-relaxed">{s.desc}</p>

                        <div className="grid md:grid-cols-2 gap-5">
                          <div>
                            <p className="text-xs tracking-widest text-primary/60 uppercase mb-3">服務包含</p>
                            <ul className="space-y-2">
                              {s.includes.map(item => (
                                <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                                  <span className="text-primary mt-0.5 shrink-0">▸</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs tracking-widest text-primary/60 uppercase mb-3">適合對象</p>
                            <ul className="space-y-2">
                              {s.suitable.map(item => (
                                <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                                  <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <a
                          href={LINE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 font-bold text-white rounded-full text-sm hover:scale-105 transition-all shadow-md"
                          style={{ background: "#06C755" }}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M12 2C6.48 2 2 6.03 2 11c0 3.08 1.72 5.79 4.32 7.47V22l3.36-1.85c.75.21 1.53.32 2.32.32 5.52 0 10-4.03 10-9S17.52 2 12 2z"/>
                          </svg>
                          預約這個服務
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6 bg-card/30 border-t border-primary/10 overflow-hidden">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-serif font-bold">不確定哪個適合你？</h2>
            <p className="text-muted-foreground mt-3 leading-loose">
              歡迎加入 LINE，免費聊 15 分鐘，<br />
              我幫你找到最適合你的起點。
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 font-bold text-white rounded-full text-sm hover:scale-105 transition-all shadow-lg"
              style={{ background: "#06C755" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2C6.48 2 2 6.03 2 11c0 3.08 1.72 5.79 4.32 7.47V22l3.36-1.85c.75.21 1.53.32 2.32.32 5.52 0 10-4.03 10-9S17.52 2 12 2z"/>
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
