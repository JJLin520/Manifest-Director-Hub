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

const identities = [
  "潛意識教練",
  "國考合格物理治療師",
  "企業健康講師",
  "生命藍圖顧問",
  "NGH 催眠導師",
];

const credentials = [
  "台灣大學物理治療學系畢業",
  "台灣國考合格物理治療師",
  "NGH 美國催眠師協會認證導師",
  "NLP 執行師 / 高階執行師 / 導師",
  "時間線療法認證執行師",
  "ACE 國際教練認證",
  "國內外多位大師直接受訓",
];

const focusAreas = [
  {
    icon: "🌿",
    title: "身心健康",
    desc: "不靠意志力苦撐，讓養生成為你的生存本能。整合物理治療與潛意識教練，從根本調整身心狀態。",
  },
  {
    icon: "💛",
    title: "財富意識",
    desc: "清理對金錢的匱乏恐懼，讓你的財務決策從焦慮轉向清明，建立從內到外的豐盛感。",
  },
  {
    icon: "✨",
    title: "關係顯化",
    desc: "帶你愛上那個躲在潛意識裡的自己，自然吸引高頻率的伴侶，創造真實的連結。",
  },
];

const milestones = [
  { year: "2016", label: "台大物理治療學系畢業，通過國家高考取得物理治療師執照" },
  { year: "2019", label: "創立 YouTube 頻道【型男理療室】，走向自媒體健康教育" },
  { year: "2020", label: "成立米蔚健康顧問公司，深耕職場健康，累積 300+ 企業講座" },
  { year: "2021", label: "深度投入催眠、NLP、教練技術，學費投資超過百萬" },
  { year: "2022", label: "建立心流催眠教練系統，整合催眠、NLP、教練技術與心理學" },
  { year: "2023", label: "創立「宇宙序能」品牌，推出人生導演系統，持續陪伴學員轉化" },
];

const clients = [
  "台灣積體電路（台積電）",
  "AWS 亞馬遜網路服務",
  "荷蘭商臺灣戴爾（Dell）",
  "全家便利商店",
  "國家實驗研究院",
  "伊甸基金會",
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/jjloveyou520/", icon: "📸" },
  { label: "YouTube｜靈魂診療室", href: "https://www.youtube.com/channel/UCa0yWsASqozpHccxHffUL0A/featured", icon: "▶" },
  { label: "Facebook", href: "https://www.facebook.com/ntutraveler.lin", icon: "📘" },
  { label: "Apple Podcast", href: "https://reurl.cc/OEj0Lg", icon: "🎙" },
  { label: "電子名片", href: "https://pse.is/supercardjj", icon: "🪪" },
];

const values = [
  { icon: "◎", title: "親身驗證", desc: "我們只教自己走過、驗證過的方法。不是理論，是真實走出來的路。" },
  { icon: "◈", title: "看見本質", desc: "不治標，直搗根源。找到那個信念最初是怎麼種進來的，才能真正拔除。" },
  { icon: "◉", title: "陪伴到底", desc: "轉化不是一次感動，是長期的練習。我們在你每一個步驟旁邊。" },
  { icon: "◌", title: "每個人都值得", desc: "不論你的起點在哪，改變都是可能的。這不是我說的，是神經科學。" },
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
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase">導師介紹</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mt-3">
              JJ 林炳騰
            </h1>
            <p className="text-primary font-serif text-xl md:text-2xl font-semibold mt-2 tracking-wide">
              你的人生普拿疼
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {identities.map((id) => (
                <span
                  key={id}
                  className="text-xs px-3 py-1.5 border border-primary/25 rounded-full text-muted-foreground"
                >
                  {id}
                </span>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              不只療癒過去，更要顯化未來。<br />
              我整合醫療專業與潛意識科學，幫你找回人生主導權。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Personal Story */}
      <section className="relative z-10 py-16 px-6 bg-card/20">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase mb-6">親身見證</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-10 text-primary/90">
              「所有的疼痛，都是潛意識發出的求救信。」
            </h2>
          </FadeIn>

          <div className="space-y-6 text-lg leading-loose text-muted-foreground">
            <FadeIn delay={0.1}>
              <p>
                身為台大物理治療師，我服務過上百間企業，做了超過 300 場健康講座。但我發現一個心碎的循環：
                個案的身體好了，生活習氣卻沒有改變——焦慮還在，問題像回力鏢一樣精準回來。
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="border-l-2 border-primary/40 pl-6 py-2">
                <p className="text-foreground">
                  我才驚覺：<strong>真正的療癒，是啟動一個人的自癒力。</strong>
                  而這股力量的開關，不在意識，而在那深達 95% 的潛意識裡。
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p>
                我自己就有整整十年的熬夜習慣。身為醫療人員，我比誰都清楚代價，
                但就是停不下來——直到我透過催眠深入潛意識，才看見那個「怕落後的小孩」。
                他覺得白天都在為別人活，只有深夜才擁有真正的自由與掌控權。
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p>
                當我看見這個結構，不再用意志力「逼」自己睡覺，而是學會與內在和解。
                結果神奇的事發生了：我不只自然早睡早起，困擾多年的過敏也<span className="text-primary font-semibold">不藥而癒</span>。
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <blockquote className="border border-primary/20 rounded-xl px-7 py-5 bg-primary/5 text-base text-foreground/80 italic leading-relaxed">
                「在潛意識未被意識之前，它會支配你的人生，而你會稱之為命運。」
                <span className="block text-right text-xs text-primary mt-3 not-italic">— 榮格</span>
              </blockquote>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Three Focus Areas */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] text-primary/60 uppercase mb-3">服務領域</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold">我能幫你轉化的三大領域</h2>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-6">
            {focusAreas.map((area, i) => (
              <FadeIn key={area.title} delay={i * 0.1}>
                <div className="p-7 border border-primary/15 rounded-2xl bg-background/60 space-y-3 text-center">
                  <span className="text-3xl block">{area.icon}</span>
                  <h3 className="font-serif font-bold text-lg text-primary">{area.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{area.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Career Milestones */}
      <section className="relative z-10 py-16 px-6 bg-card/20">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase mb-10">事業歷程</p>
          </FadeIn>
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <FadeIn key={m.year} delay={i * 0.07}>
                <div className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/60 mt-1.5 shrink-0 group-hover:bg-primary transition-colors" />
                    {i < milestones.length - 1 && (
                      <div className="w-px flex-1 bg-primary/15 my-1" />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-primary font-serif font-bold text-sm mb-1">{m.year}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{m.label}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
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

      {/* Corporate Clients */}
      <section className="relative z-10 py-16 px-6 bg-card/20">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-xs tracking-[0.3em] text-primary/60 uppercase mb-3">服務過的企業</p>
              <p className="text-muted-foreground text-sm">300+ 場企業健康講座，服務上百間台灣企業</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {clients.map((c, i) => (
              <FadeIn key={c} delay={i * 0.06}>
                <div className="text-center p-4 border border-primary/10 rounded-xl bg-background/40">
                  <p className="text-sm text-muted-foreground font-medium">{c}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="relative z-10 py-16 px-6">
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

      {/* Social Links */}
      <section className="relative z-10 py-16 px-6 bg-card/20">
        <div className="max-w-xl mx-auto text-center">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase mb-8">追蹤 JJ 林炳騰</p>
          </FadeIn>
          <div className="flex flex-col gap-3">
            {socials.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.07}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 border border-primary/15 rounded-xl bg-background/60 hover:border-primary/40 hover:bg-primary/5 transition-all text-sm text-foreground/80"
                >
                  <span className="text-base w-6 text-center">{s.icon}</span>
                  <span>{s.label}</span>
                  <span className="ml-auto text-primary/40 text-xs">→</span>
                </a>
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
              不管是頭疼、腳疼，還是心疼——<br />
              記得找 JJ 林炳騰，你的人生普拿疼。
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

      {/* ── 找到我 ── */}
      <section className="relative z-10 py-16 px-6 bg-white/2 border-t border-primary/10">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="text-primary text-xs tracking-widest font-medium text-center mb-2">FIND ME</p>
            <h2 className="font-serif text-2xl font-bold text-center mb-10">找到我</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "▶", label: "YouTube｜人生普拿疼！", desc: "每週分享潛意識觀念、NLP 技巧與真實案例", href: "https://pse.is/YTJJLIN007" },
              { icon: "📸", label: "Instagram @jjloveyou520", desc: "日常分享、限時動態能量語錄", href: "https://www.instagram.com/jjloveyou520/" },
              { icon: "💬", label: "Facebook｜JJ林炳騰", desc: "直播預告、活動資訊、文章分享", href: "https://www.facebook.com/ntutraveler.lin" },
              { icon: "🎙️", label: "Podcast｜Apple", desc: "隨時收聽潛意識與顯化的深度對話", href: "https://reurl.cc/OEj0Lg" },
              { icon: "🎵", label: "Podcast｜Spotify", desc: "在 Spotify 訂閱，不錯過每一集", href: "https://pse.is/4m36fw" },
              { icon: "📇", label: "電子名片", desc: "一鍵儲存 JJ 的完整聯絡資訊", href: "https://pse.is/supercardjj" },
            ].map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.07}>
                <a href={item.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-4 bg-white/4 border border-white/10 hover:border-primary/30 rounded-xl px-5 py-4 transition-colors group">
                  <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm group-hover:text-primary transition-colors">{item.label}</p>
                    <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                  <span className="text-white/20 group-hover:text-primary/50 text-xs mt-1 shrink-0 transition-colors">→</span>
                </a>
              </FadeIn>
            ))}
          </div>

          {/* LINE 顯化共修群 highlighted */}
          <FadeIn delay={0.4}>
            <div className="mt-4 bg-primary/10 border border-primary/30 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center gap-5">
              <div className="text-3xl shrink-0">🌟</div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-primary font-semibold text-base">加入【JJ 顯化共修群】（完全免費）</p>
                <p className="text-white/55 text-sm mt-1 leading-relaxed">每週一次群內能量校準，與同頻夥伴一起成長。</p>
              </div>
              <a href="https://line.me/R/ti/g/DIlcgURfu8" target="_blank" rel="noopener noreferrer"
                className="shrink-0 px-6 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full hover:bg-primary/90 transition-colors whitespace-nowrap">
                立即加入 →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
