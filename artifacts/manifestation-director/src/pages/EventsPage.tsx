import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Wifi, CheckCircle, ChevronDown, ChevronUp, MapPin, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const API = import.meta.env.VITE_API_URL ?? "";

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

interface Session {
  id: number;
  sessionNumber: number;
  sessionDate: string;
  title: string;
  description: string | null;
  isActive: boolean;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const wd = weekdays[d.getDay()];
  const h = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return { date: `${m} 月 ${day} 日（週${wd}）`, time: `${h}:${min}`, month: `${m}月`, day: String(day) };
}

const otherEvents = [
  {
    day: "03",
    month: "五月",
    tag: "茶禪會",
    highlight: true,
    title: "五月感恩｜點燈感恩茶禪會",
    location: "新店雲陽寺（新北市新店區銀河路23號）",
    fee: "已點燈者免費 ｜ 一般 NT$500",
    desc: "在茶香與禪意中沉澱心靈，為摯愛的母親點亮一盞平安順遂的心燈。母親節前夕，與我們一同品茶、結善緣。",
    href: "/temple-event/",
    cta: "立即報名",
    external: false,
    badges: ["實體活動"],
  },
  {
    day: "TBA",
    month: "近期",
    tag: "線上講座",
    highlight: false,
    title: "NLP 顯化人生｜定期講座",
    location: "線上 Zoom（報名後傳送連結）",
    fee: "免費",
    desc: "你的大腦是一台最強大的「現實列印機」——但大多數人的引擎，搜尋的都是壓力與不可能。這場講座教你掌握開關，透過 NLP 實作技巧調整內在語言，讓外在世界自動對齊你的頻率。",
    href: "https://lin.ee/Nq1MhuY",
    cta: "加 LINE 報名",
    external: true,
    badges: ["免費", "NLP"],
  },
  {
    day: "TBA",
    month: "近期",
    tag: "工作坊",
    highlight: false,
    title: "NLP 奧密時間線工作坊",
    location: "台北場（地點確認中）",
    fee: "詢問報名",
    desc: "為什麼有些人總是重複相同的困境？答案藏在你的「潛意識時間線」裡。這場工作坊帶你回溯卡住你的關鍵事件，重寫生命腳本，從根本修改人生劇情。",
    href: "https://lin.ee/Nq1MhuY",
    cta: "加 LINE 詢問",
    external: true,
    badges: ["NLP", "深度工作坊"],
  },
  {
    day: "TBA",
    month: "近期",
    tag: "免費講座",
    highlight: false,
    title: "潛意識覺醒體驗講座",
    location: "台北場（地點確認中）",
    fee: "免費入場",
    desc: "兩小時體驗講座，帶你了解潛意識程式如何影響金錢、感情與事業，現場進行潛意識小技術體驗。",
    href: "https://lin.ee/Nq1MhuY",
    cta: "加 LINE 搶先通知",
    external: true,
    badges: ["免費"],
  },
  {
    day: "TBA",
    month: "近期",
    tag: "工作坊",
    highlight: false,
    title: "情緒釋放 & 心錨建立工作坊",
    location: "台北場（地點確認中）",
    fee: "NT$1,500",
    desc: "半天深度工作坊，學習用 NLP 技術快速釋放情緒卡點，建立自己專屬的「巔峰狀態心錨」，讓你隨時切換到最佳狀態。",
    href: "https://lin.ee/Nq1MhuY",
    cta: "加 LINE 搶先通知",
    external: true,
    badges: ["NLP"],
  },
];

function NumerologyRegForm({ sessions, onClose }: { sessions: Session[]; onClose?: () => void }) {
  const [selectedId, setSelectedId] = useState<number>(sessions[0]?.id ?? 0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", lineId: "", referralSource: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const selected = sessions.find(s => s.id === selectedId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim()) { setError("請填寫姓名和手機號碼"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/numerology/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sessionId: selectedId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "報名失敗");
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "報名失敗，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="text-primary mx-auto mb-3" size={36} />
        <p className="font-serif font-bold text-lg mb-1">報名成功！</p>
        {selected && (
          <p className="text-primary text-sm font-medium mb-1">
            第 {selected.sessionNumber} 場 · {formatDate(selected.sessionDate).date}
          </p>
        )}
        <p className="text-muted-foreground text-sm">直播連結將在講座前透過 LINE 傳送給你。</p>
        {form.email && <p className="text-primary/70 text-xs mt-2">📧 確認信已寄至 {form.email}</p>}
        {onClose && <button onClick={onClose} className="mt-4 text-xs text-muted-foreground underline">關閉</button>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Session picker */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">選擇場次</p>
        <div className="flex flex-wrap gap-2">
          {sessions.map(s => {
            const f = formatDate(s.sessionDate);
            const isSel = selectedId === s.id;
            return (
              <button type="button" key={s.id} onClick={() => setSelectedId(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${isSel ? "border-primary bg-primary/10 text-primary font-semibold" : "border-primary/20 text-muted-foreground hover:border-primary/40"}`}>
                <Calendar size={12} className={isSel ? "text-primary" : "text-muted-foreground"} />
                {f.date} {f.time}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">姓名 *</label>
          <input type="text" placeholder="你的姓名" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors" required />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">手機 *</label>
          <input type="tel" placeholder="09xx-xxx-xxx" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Email <span className="text-muted-foreground/50">（收確認信）</span></label>
          <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">LINE ID <span className="text-muted-foreground/50">（選填）</span></label>
          <input type="text" placeholder="LINE ID" value={form.lineId} onChange={e => setForm(f => ({ ...f, lineId: e.target.value }))}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">從哪裡得知這場講座？</label>
        <select value={form.referralSource} onChange={e => setForm(f => ({ ...f, referralSource: e.target.value }))}
          className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors">
          <option value="">請選擇（選填）</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="youtube">YouTube</option>
          <option value="line">LINE 好友推薦</option>
          <option value="friend">朋友介紹</option>
          <option value="other">其他</option>
        </select>
      </div>
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      <button type="submit" disabled={submitting}
        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold py-3 rounded-lg text-sm transition-colors">
        {submitting ? "送出中…" : "確認報名 · 免費入場"}
      </button>
      <p className="text-muted-foreground/50 text-xs text-center">報名成功後，JJ 老師將透過 LINE 傳送直播連結</p>
    </form>
  );
}

export default function EventsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionError, setSessionError] = useState(false);
  const [regOpen, setRegOpen] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/numerology/sessions`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setSessions)
      .catch(() => setSessionError(true));
  }, []);

  return (
    <div className="bg-background text-foreground font-sans min-h-screen pt-16">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      {/* Hero */}
      <section className="relative z-10 py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase mb-3">講座活動</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">
              每一場活動，<br className="md:hidden" />都是一個起點
            </h1>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="text-muted-foreground text-lg leading-relaxed mt-5">
              免費講座、體驗工作坊、茶禪靜心——找到最適合你的第一步。
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-28 space-y-6">

        {/* ── 數字講座 Featured Card ── */}
        <FadeIn>
          <div className="rounded-2xl border border-primary/50 bg-gradient-to-br from-primary/12 to-primary/4 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-5 p-7">
              {/* Date badge */}
              <div className="flex-shrink-0 text-center min-w-[64px]">
                <p className="text-2xl font-serif font-bold text-primary">每月</p>
                <p className="text-xs text-muted-foreground mt-0.5">定期</p>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 border border-primary/40 text-primary/90 rounded-full">線上直播</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Wifi size={10} /> Zoom · 免費</span>
                </div>
                <h3 className="text-xl font-serif font-bold">宇宙數字原力學 線上直播講座</h3>

                {/* Session list */}
                {sessionError ? (
                  <p className="text-muted-foreground text-sm">目前無開放場次，敬請期待</p>
                ) : sessions.length === 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="text-muted-foreground text-sm">載入場次資訊…</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {sessions.map(s => {
                      const f = formatDate(s.sessionDate);
                      return (
                        <span key={s.id} className="flex items-center gap-1.5 text-xs bg-primary/10 border border-primary/30 text-primary px-3 py-1.5 rounded-full">
                          <Calendar size={11} /> {f.date} {f.time}
                        </span>
                      );
                    })}
                  </div>
                )}

                <p className="text-sm text-muted-foreground leading-relaxed">
                  90 分鐘，解鎖你的靈魂藍圖——主命數、靈魂數、人格數、貴人數、成熟數、流年數，一組數字看見從未看過的自己。
                </p>

                {/* CTA row */}
                <div className="flex flex-wrap gap-3 pt-1">
                  {sessions.length > 0 && (
                    <button
                      onClick={() => setRegOpen(v => !v)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:bg-primary/90 transition-all"
                    >
                      {regOpen ? <><ChevronUp size={15} /> 收起報名表</> : <><ChevronDown size={15} /> 立即報名（免費）</>}
                    </button>
                  )}
                  <Link href="/lecture">
                    <span className="flex items-center gap-1 px-5 py-2.5 border border-primary/40 text-primary/80 text-sm font-medium rounded-full hover:border-primary hover:text-primary transition-all cursor-pointer">
                      查看完整活動頁 <ExternalLink size={12} />
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Inline registration form */}
            <AnimatePresence>
              {regOpen && sessions.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-primary/20 px-7 py-6 bg-card/60">
                    <p className="text-sm font-semibold mb-4 text-foreground">填寫報名資料</p>
                    <NumerologyRegForm sessions={sessions} onClose={() => setRegOpen(false)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>

        {/* ── 其他活動 ── */}
        {otherEvents.map((ev, i) => (
          <FadeIn key={ev.title} delay={i * 0.07}>
            <div className={`p-7 rounded-2xl border flex flex-col md:flex-row gap-5 relative overflow-hidden ${
              ev.highlight
                ? "border-primary/40 bg-gradient-to-br from-primary/8 to-primary/3"
                : "border-primary/15 bg-card/40 hover:border-primary/30 transition-colors"
            }`}>
              {ev.highlight && (
                <span className="absolute top-4 right-4 px-2.5 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">即將舉行</span>
              )}

              {/* Date */}
              <div className="flex-shrink-0 text-center min-w-[60px]">
                <p className="text-3xl font-serif font-bold text-primary">{ev.day}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{ev.month}</p>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 border border-primary/30 text-primary/80 rounded-full">{ev.tag}</span>
                  {ev.badges?.map(b => (
                    <span key={b} className="text-xs px-2 py-0.5 bg-primary/10 text-primary/70 rounded-full">{b}</span>
                  ))}
                  <span className="text-xs text-muted-foreground ml-auto">{ev.fee}</span>
                </div>
                <h3 className="text-lg font-serif font-bold">{ev.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={11} /> {ev.location}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{ev.desc}</p>
                <div className="pt-1">
                  {ev.external ? (
                    <a href={ev.href} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-5 py-2.5 border border-primary/40 text-primary/80 text-sm font-medium rounded-full hover:border-primary hover:text-primary transition-all">
                      {ev.cta} →
                    </a>
                  ) : (
                    <a href={ev.href}
                      className="inline-block px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:bg-primary/90 transition-all">
                      {ev.cta} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}

        {/* Bottom CTA */}
        <FadeIn delay={0.2}>
          <div className="text-center py-6 border-t border-primary/10">
            <p className="text-muted-foreground text-sm mb-3">想第一時間掌握新活動消息？</p>
            <a href="https://lin.ee/Nq1MhuY" target="_blank" rel="noopener noreferrer"
              className="inline-block px-7 py-3 border border-primary/40 text-primary text-sm font-medium rounded-full hover:border-primary hover:bg-primary/5 transition-all">
              加入 LINE 官方帳號，搶先獲得通知 →
            </a>
          </div>
        </FadeIn>
      </div>

      <footer className="py-8 text-center text-muted-foreground/40 text-sm border-t border-primary/10 relative z-10">
        © 2025 宇宙序能教育品牌 ｜ Coach JJ 林炳騰
      </footer>
    </div>
  );
}
