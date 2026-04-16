import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINE_URL = "https://lin.ee/s36fGtE";

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

const plans = [
  {
    id: "entry",
    emoji: "🌱",
    title: "問題解惑",
    subtitle: "單一問題諮詢",
    price: "NT$800",
    originalPrice: "NT$1,800",
    priceNote: "初次體驗",
    duration: "30 分鐘",
    tag: "最低門檻",
    tagline: "對 JJ 的工作方式好奇？從這裡開始。",
    desc: "如果你對我的工作方式好奇，想先感受一下——這是為你設計的入口。30 分鐘，我們針對你現在最想釐清的一個問題對話。你會帶走一個新的視角，以及下一步的方向感。",
    includes: [],
    note: "",
    color: "from-emerald-900/20 to-transparent",
    border: "border-emerald-500/20 hover:border-emerald-400/40",
    accent: "text-emerald-400",
  },
  {
    id: "deep",
    emoji: "🔍",
    title: "深度諮詢",
    subtitle: "認真看清楚現在生命的全貌",
    price: "NT$5,800",
    duration: "120 分鐘",
    tag: "含書面報告",
    tagline: "完整的生命掃描，帶走一份屬於你的文件。",
    desc: "如果你準備好認真坐下來看清楚自己——這不只是一次對話，而是一次完整的生命掃描。120 分鐘結束後，你會收到一份專屬的諮詢總結報告。",
    includes: [
      "A｜這次對話的核心洞察——你看見了什麼",
      "B｜你的潛意識阻礙——你卡在哪裡，為什麼",
      "C｜建議的下一步行動方向——你可以從哪裡開始走",
    ],
    note: "費用可全額折抵一季方案",
    color: "from-blue-900/20 to-transparent",
    border: "border-blue-500/20 hover:border-blue-400/40",
    accent: "text-blue-400",
  },
  {
    id: "season",
    emoji: "🌿",
    title: "一季覺醒方案",
    subtitle: "花一季，好好清理",
    price: "NT$19,800",
    duration: "三個月",
    tag: "最受歡迎",
    highlight: true,
    tagline: "用一整季的時間，真正走進你的生命地圖。",
    desc: "如果你準備好用一整季的時間，真正走進自己的生命地圖——這一季，我們會一起做五件事。",
    sessions: [
      { num: "第一次", content: "完整的生命藍圖解析，我交付你的專屬報告" },
      { num: "第二次", content: "找出第一個核心阻礙，開始清理" },
      { num: "第三次", content: "清理第二個阻礙，種下新的信念" },
      { num: "第四次", content: "檢視這一季的顯化進度，調整路徑" },
      { num: "第五次", content: "收穫這一季，設計你的下一步" },
    ],
    includes: [
      "五次深度諮詢（線上，彈性預約）",
      "專屬 LINE 群組，JJ 在裡面陪你",
      "生命藍圖報告（第一次諮詢後交付）",
      "贈送三次初次體驗（可送給你最重要的朋友）",
    ],
    note: "",
    color: "from-primary/15 to-primary/5",
    border: "border-primary/40 hover:border-primary/60",
    accent: "text-primary",
  },
  {
    id: "annual",
    emoji: "❄️",
    title: "年度生命藍圖顧問",
    subtitle: "讓這一年，真正不一樣",
    price: "NT$66,000",
    duration: "一年",
    tag: "每年僅收十人",
    tagline: "用整整一年，陪你走過四季。",
    desc: "如果你準備好讓這一年走出一條全新的路——我會用整整一年的時間陪你走過四季。「每年只收十個人」不是行銷話術，而是因為我想認真陪伴每一個人走完四季。",
    seasons: [
      { icon: "🌱", label: "春（1–3月）", content: "看見你的生命藍圖，找出三個核心阻礙" },
      { icon: "🌿", label: "夏（4–6月）", content: "逐一清除潛意識的阻礙，重寫底層程式" },
      { icon: "🍂", label: "秋（7–9月）", content: "把藍圖走進真實生活，建立新的身份認同" },
      { icon: "❄️", label: "冬（10–12月）", content: "盤點這一年的改變，設計下一年的藍圖" },
    ],
    includes: [
      "每月一次深度諮詢（線上，彈性預約）",
      "專屬 LINE 群組，訊息隨時陪伴",
      "生命藍圖報告（第一個月交付）",
      "贈送 10 次初次體驗（可送給你最重要的朋友）",
      "全年線下活動免費參加（只需場地費）",
    ],
    note: "一季方案費用可折抵",
    color: "from-indigo-900/20 to-transparent",
    border: "border-indigo-500/20 hover:border-indigo-400/40",
    accent: "text-indigo-400",
  },
];

const testimonials = [
  {
    name: "寶兒",
    story: "她來找我的時候，剛經歷了一段背叛。那種衝擊讓她的感受完全封閉——不知道怎麼信任，不知道自己還值不值得被愛。那是她人生的深冬。\n\n我們一起工作了幾次。我幫她看見——這不是她的錯，而是潛意識裡一個舊的種子在運作。當那個種子被清除，她重新找回了自己。\n\n現在的她，找到了真正適合她的伴侶，活出了一個全新的生命狀態。",
    result: "她的春天，來了。",
  },
  {
    name: "另一位女士",
    story: "她來找我的時候，有嚴重的憂鬱症。那是生命最深的冬天——不是悲傷，而是連感受都消失了。因為朋友的介紹，她決定試試看。\n\n幾次共識之後，她重新找回了生命的力量。她自己說「很神奇」——不是因為發生了什麼奇蹟，而是她第一次真正看見了自己，理解了自己。",
    result: "後來，她開始把這份禮物介紹給她最重要的朋友。",
  },
];

const methods = [
  { level: "道", action: "理解你的生命運作法則", tools: "生命藍圖解析" },
  { level: "法", action: "找到你專屬的顯化路徑", tools: "生命數字盤 × 意識科學" },
  { level: "術", action: "清除潛意識裡的阻礙", tools: "催眠 × NLP 教練技術" },
  { level: "器", action: "讓改變在真實生活裡發生", tools: "儀式 × 群體場域 × 持續陪伴" },
];

function BookBtn({ label = "立即預約諮詢", small = false }: { label?: string; small?: boolean }) {
  return (
    <a
      href={LINE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 font-bold text-white rounded-full hover:scale-105 transition-all shadow-lg ${
        small ? "px-5 py-2.5 text-sm" : "px-8 py-3.5 text-sm"
      }`}
      style={{ background: "#06C755" }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M12 2C6.48 2 2 6.03 2 11c0 3.08 1.72 5.79 4.32 7.47V22l3.36-1.85c.75.21 1.53.32 2.32.32 5.52 0 10-4.03 10-9S17.52 2 12 2z" />
      </svg>
      {label}
    </a>
  );
}

export default function ServicesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggle(id: string) {
    setExpanded(prev => (prev === id ? null : id));
    if (expanded !== id) {
      setTimeout(() => {
        document.getElementById(`detail-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }

  return (
    <div className="bg-background text-foreground font-sans min-h-screen pt-16">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase">服務方案</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mt-3 leading-tight">
              我能為你做什麼
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-muted-foreground text-lg leading-relaxed">
              我不只是告訴你你是誰。<br />
              我幫你設計你要去哪裡，然後陪你走過去。
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <BookBtn />
          </FadeIn>
        </div>
      </section>

      {/* ── 道法術器 ──────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {methods.map((m, i) => (
                <motion.div
                  key={m.level}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="bg-card/40 border border-primary/15 rounded-xl p-4 text-center"
                >
                  <p className="text-2xl font-serif font-bold text-primary mb-2">{m.level}</p>
                  <p className="text-xs text-foreground/80 leading-snug mb-2">{m.action}</p>
                  <p className="text-xs text-primary/60">{m.tools}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Plans overview ──────────────────────────── */}
      <section className="relative z-10 px-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] text-primary/50 uppercase text-center mb-6">所有方案一覽</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {plans.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                onClick={() => toggle(p.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 bg-gradient-to-br ${p.color} ${p.border} ${
                  expanded === p.id ? "ring-1 ring-primary/40" : ""
                }`}
              >
                <span className="text-2xl block mb-2">{p.emoji}</span>
                <p className="font-serif font-bold text-sm text-foreground leading-tight">{p.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.duration}</p>
                <p className={`text-sm font-bold mt-1.5 ${p.highlight ? "text-primary" : p.accent}`}>{p.price}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-bold rounded-full ${
                  p.highlight ? "bg-primary text-primary-foreground" : "bg-white/10 text-foreground/70"
                }`}>
                  {p.tag}
                </span>
              </motion.button>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <p className="text-center text-xs text-muted-foreground/50 mt-4">點選方案查看完整說明 ↓</p>
          </FadeIn>
        </div>
      </section>

      {/* ── Plan detail accordions ───────────────────── */}
      <section className="relative z-10 px-6 pb-16">
        <div className="max-w-3xl mx-auto space-y-3">
          {plans.map((p) => (
            <div
              key={p.id}
              id={`detail-${p.id}`}
              className={`rounded-2xl border overflow-hidden bg-gradient-to-br ${p.color} ${p.border} transition-all duration-300`}
            >
              <button
                onClick={() => toggle(p.id)}
                className="w-full text-left px-6 py-5 flex items-center gap-4"
              >
                <span className="text-3xl shrink-0">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif font-bold text-lg text-foreground">{p.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      p.highlight ? "bg-primary text-primary-foreground" : "bg-white/10 text-foreground/60"
                    }`}>{p.tag}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.subtitle}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-lg font-bold ${p.highlight ? "text-primary" : p.accent}`}>{p.price}</span>
                    {p.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">{p.originalPrice}</span>
                    )}
                    <span className="text-xs text-muted-foreground">／{p.duration}</span>
                  </div>
                </div>
                <motion.span
                  animate={{ rotate: expanded === p.id ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-muted-foreground text-lg shrink-0"
                >
                  ▾
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {expanded === p.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-5 border-t border-white/5 pt-5">
                      <p className="text-muted-foreground leading-relaxed">{p.desc}</p>

                      {/* Season plan: sessions table */}
                      {"sessions" in p && p.sessions && (
                        <div>
                          <p className="text-xs tracking-widest text-primary/60 uppercase mb-3">五次的旅程</p>
                          <div className="space-y-2">
                            {(p.sessions as { num: string; content: string }[]).map((s) => (
                              <div key={s.num} className="flex gap-3 text-sm">
                                <span className="text-primary font-bold shrink-0 w-14">{s.num}</span>
                                <span className="text-foreground/80">{s.content}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Annual plan: seasons */}
                      {"seasons" in p && p.seasons && (
                        <div>
                          <p className="text-xs tracking-widest text-primary/60 uppercase mb-3">四季的陪伴</p>
                          <div className="space-y-2">
                            {(p.seasons as { icon: string; label: string; content: string }[]).map((s) => (
                              <div key={s.label} className="flex gap-3 text-sm items-start">
                                <span className="shrink-0 w-6">{s.icon}</span>
                                <span className="text-primary/80 font-medium shrink-0 w-28">{s.label}</span>
                                <span className="text-foreground/80">{s.content}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Includes for deep/season/annual */}
                      {p.includes && p.includes.length > 0 && (
                        <div>
                          <p className="text-xs tracking-widest text-primary/60 uppercase mb-3">方案包含</p>
                          <ul className="space-y-2">
                            {p.includes.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                                <span className="text-primary mt-0.5 shrink-0">▸</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {p.note && (
                        <p className="text-xs text-primary/70 bg-primary/10 rounded-lg px-3 py-2 border border-primary/20">
                          → {p.note}
                        </p>
                      )}

                      <BookBtn label="預約這個方案" small />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────── */}
      <section className="relative z-10 px-6 pb-16 bg-card/20 border-y border-primary/10 py-16">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] text-primary/50 uppercase text-center mb-2">他們的故事</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-10">
              他們的冬天，後來都變成了春天
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.15}>
                <div className="bg-card/40 border border-primary/15 rounded-2xl p-6 space-y-4 h-full">
                  <p className="text-primary/80 font-bold text-sm">{t.name}</p>
                  <div className="space-y-3">
                    {t.story.split("\n\n").map((para, j) => (
                      <p key={j} className="text-muted-foreground text-sm leading-relaxed">{para}</p>
                    ))}
                  </div>
                  <p className="text-primary font-serif font-bold text-sm pt-2 border-t border-primary/15">
                    {t.result}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment info ────────────────────────────── */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <h2 className="text-xl font-serif font-bold text-center mb-6">預約與付款</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="bg-card/40 border border-primary/15 rounded-2xl p-6 space-y-5">
              <div>
                <p className="text-xs tracking-widest text-primary/60 uppercase mb-3">付款資訊</p>
                <div className="space-y-1.5 text-sm text-foreground/80">
                  <p>銀行：中國信託（822）</p>
                  <p>帳號：082540541607</p>
                  <p>戶名：林炳騰</p>
                  <p className="text-muted-foreground text-xs mt-1">匯款後請告知帳號末五碼</p>
                </div>
              </div>
              <div className="border-t border-primary/10 pt-5">
                <p className="text-xs tracking-widest text-primary/60 uppercase mb-3">注意事項</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex gap-2"><span className="text-primary shrink-0">·</span>請準備穩定網路與獨立不受打擾的空間</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">·</span>預約前 24 小時需付清款項</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">·</span>24 小時前可取消或改期；24 小時內改期視同取消，不予退費</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">·</span>描述你的問題越清晰，效果越精準</li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────── */}
      <section className="relative z-10 py-20 px-6 bg-card/30 border-t border-primary/10 overflow-hidden text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <FadeIn>
            <p className="text-primary/60 text-sm italic leading-loose">
              「你不是走錯了路，你只是正處在冬天。<br />而冬天，是有它的意義的。<br />讓我幫你讀懂你的生命藍圖，陪你走到下一個春天。」
            </p>
            <p className="text-muted-foreground text-sm mt-3">— JJ 林炳騰，你的生命藍圖顧問</p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h2 className="text-2xl md:text-3xl font-serif font-bold">準備好了嗎？</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              加入 LINE，告訴我你現在最想釐清的一件事，<br />我會幫你找到最適合的入口。
            </p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <BookBtn label="加入 LINE，開始你的旅程" />
          </FadeIn>
        </div>
      </section>

      <footer className="py-8 text-center text-muted-foreground/40 text-sm border-t border-primary/10 relative z-10">
        © 2024 宇宙序能教育品牌 ｜ JJ 林炳騰
      </footer>
    </div>
  );
}
