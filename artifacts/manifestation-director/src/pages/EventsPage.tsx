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

type Event = {
  date: string;
  month: string;
  tag: string;
  title: string;
  location: string;
  fee: string;
  desc: string;
  link: string;
  linkLabel: string;
  highlight?: boolean;
};

const events: Event[] = [
  {
    date: "03",
    month: "五月",
    tag: "茶禪會",
    title: "🪷 五月感恩｜點燈感恩茶禪會",
    location: "新店雲陽寺（新北市新店區銀河路23號）",
    fee: "已點燈者免費 ｜ 一般 $500",
    desc: "在茶香與禪意中沉澱心靈，為摯愛的母親與家人點亮一盞平安順遂的心燈。母親節前夕，與我們一同品茶、結善緣。",
    link: "/temple-event/",
    linkLabel: "立即報名",
    highlight: true,
  },
  {
    date: "TBA",
    month: "近期",
    tag: "免費講座",
    title: "潛意識覺醒體驗講座",
    location: "台北場（地點確認中）",
    fee: "免費入場",
    desc: "兩小時的體驗講座，帶你初步了解潛意識程式如何影響你的金錢、感情與事業，現場進行一個簡單的潛意識小技術體驗。",
    link: "https://lin.ee/Nq1MhuY",
    linkLabel: "加 LINE 搶先通知",
  },
  {
    date: "TBA",
    month: "近期",
    tag: "工作坊",
    title: "情緒釋放 & 心錨建立工作坊",
    location: "台北場（地點確認中）",
    fee: "NT$1,500",
    desc: "半天的深度體驗工作坊，學習用 NLP 技術快速釋放情緒卡點，並建立自己專屬的「巔峰狀態心錨」，讓你隨時可以切換到最佳狀態。",
    link: "https://lin.ee/Nq1MhuY",
    linkLabel: "加 LINE 搶先通知",
  },
  {
    date: "TBA",
    month: "規劃中",
    tag: "線上直播",
    title: "潛意識 Q&A 直播｜問 JJ 教練",
    location: "線上（Facebook / YouTube）",
    fee: "免費",
    desc: "每月定期的線上直播，你可以直接向 JJ 教練提問，聊聊你卡住的地方，現場獲得即時的教練建議。",
    link: "https://lin.ee/Nq1MhuY",
    linkLabel: "加 LINE 掌握直播通知",
  },
];

export default function EventsPage() {
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
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase">講座活動</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mt-3">
              每一場活動，<br className="md:hidden" />都是一個起點
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-muted-foreground text-lg leading-relaxed">
              不論你在哪個起點，都有適合你的第一步。免費講座、體驗工作坊、茶禪靜心，讓你在安全的空間裡，第一次感受改變。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Events List */}
      <section className="relative z-10 py-8 px-6 pb-28">
        <div className="max-w-3xl mx-auto space-y-6">
          {events.map((ev, i) => (
            <FadeIn key={ev.title} delay={i * 0.08}>
              <div className={`p-8 rounded-2xl border flex flex-col md:flex-row gap-6 relative overflow-hidden ${
                ev.highlight
                  ? "border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5"
                  : "border-primary/15 bg-card/40 hover:border-primary/30 transition-colors"
              }`}>
                {ev.highlight && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    即將舉行
                  </div>
                )}

                {/* Date */}
                <div className="flex-shrink-0 text-center md:text-left min-w-[60px]">
                  <p className="text-3xl font-serif font-bold text-primary">{ev.date}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ev.month}</p>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 border border-primary/30 text-primary/80 rounded-full">{ev.tag}</span>
                    <span className="text-xs text-muted-foreground">{ev.fee}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-foreground">{ev.title}</h3>
                  <p className="text-xs text-muted-foreground">📍 {ev.location}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ev.desc}</p>
                  <div className="pt-2">
                    {ev.link.startsWith("/") ? (
                      <a
                        href={ev.link}
                        className="inline-block px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:bg-primary/90 transition-all"
                      >
                        {ev.linkLabel} →
                      </a>
                    ) : (
                      <a
                        href={ev.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-2.5 border border-primary/40 text-primary/80 text-sm font-medium rounded-full hover:border-primary hover:text-primary transition-all"
                      >
                        {ev.linkLabel} →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <footer className="py-8 text-center text-muted-foreground/40 text-sm border-t border-primary/10 relative z-10">
        © 2024 宇宙序能教育品牌 ｜ JJ 林炳騰
      </footer>
    </div>
  );
}
