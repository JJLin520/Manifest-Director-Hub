import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Wifi, ChevronDown, CheckCircle, Sparkles, Star } from "lucide-react";

const API = import.meta.env.VITE_API_URL ?? "";

interface Session {
  id: number;
  sessionNumber: number;
  sessionDate: string;
  title: string;
  description: string | null;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const wd = weekdays[d.getDay()];
  const h = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return { date: `${m} 月 ${day} 日（週${wd}）`, time: `${h}:${min}` };
}

const faqItems = [
  { q: "講座是線上進行嗎？", a: "是的，本講座採用 Zoom 線上直播形式，不限地區皆可參加。報名後將以 LINE 傳送入場連結。" },
  { q: "我需要有數字學基礎嗎？", a: "完全不需要！本講座從零開始，用最直覺的方式讓你快速掌握自己的數字密碼。" },
  { q: "講座時間多長？", a: "約 90 分鐘，包含 Q&A 互動時間。" },
  { q: "我的數字是怎麼算的？", a: "主命數根據你的出生日期計算，無需預先準備——講座中 JJ 老師會帶你現場計算。" },
];

const learns = [
  { num: "1", title: "主命數", desc: "你的人生使命與天賦能量" },
  { num: "2", title: "靈魂數", desc: "內心深處真正渴望的樣子" },
  { num: "3", title: "人格數", desc: "你在他人眼中呈現的形象" },
  { num: "4", title: "貴人數", desc: "誰是你此生的靈魂夥伴" },
  { num: "5", title: "成熟數", desc: "你會在何時真正活出自己" },
  { num: "6", title: "流年數", desc: "今年的宇宙能量主題" },
];

export default function NumerologyEventPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", lineId: "", referralSource: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API}/api/numerology/current-session`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setSession)
      .catch(() => setLoadError(true));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim()) {
      setError("請填寫姓名和手機號碼");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/numerology/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

  const formatted = session ? formatDate(session.sessionDate) : null;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden pb-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1530] to-[#0a0f1e] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#c9a84c]/8 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#c9a84c] text-sm font-medium tracking-[0.2em] uppercase mb-4">
              宇宙序能教育品牌 × Coach JJ 林炳騰
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-4">
              宇宙數字原力學
              <br />
              <span className="text-[#c9a84c]">線上直播講座</span>
            </h1>
            <p className="text-white/60 text-lg mt-4 max-w-xl mx-auto leading-relaxed">
              一組數字，解碼你的靈魂藍圖。
              <br />
              90 分鐘，看見你從未看過的自己。
            </p>
          </motion.div>

          {/* Session Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-10 inline-block w-full max-w-md"
          >
            <div className="bg-white/5 border border-[#c9a84c]/30 rounded-2xl px-6 py-5 text-left">
              {session ? (
                <>
                  <p className="text-[#c9a84c] text-xs tracking-widest mb-3 font-medium">
                    第 {session.sessionNumber} 場 · 現正開放報名
                  </p>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={16} className="text-[#c9a84c] shrink-0" />
                    <span className="text-white font-semibold">{formatted?.date}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={16} className="text-[#c9a84c] shrink-0" />
                    <span className="text-white/80">{formatted?.time} 開始（共 90 分鐘）</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wifi size={16} className="text-[#c9a84c] shrink-0" />
                    <span className="text-white/80">Zoom 線上直播 · 免費參加</span>
                  </div>
                  {session.description && (
                    <p className="mt-3 text-white/50 text-sm border-t border-white/10 pt-3">{session.description}</p>
                  )}
                </>
              ) : loadError ? (
                <p className="text-white/50 text-sm text-center py-2">活動資訊載入中，請稍後再試</p>
              ) : (
                <div className="flex items-center justify-center py-4">
                  <div className="w-5 h-5 rounded-full border-2 border-[#c9a84c] border-t-transparent animate-spin" />
                  <span className="ml-3 text-white/50 text-sm">載入場次資訊…</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#c9a84c] text-xs tracking-widest font-medium text-center mb-2">WHAT YOU WILL DISCOVER</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-10">
            這 90 分鐘，你將解開
            <span className="text-[#c9a84c]"> 6 把靈魂密碼鑰匙</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {learns.map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-white/4 border border-white/10 hover:border-[#c9a84c]/40 rounded-xl p-5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full border border-[#c9a84c]/60 flex items-center justify-center mb-3">
                  <span className="text-[#c9a84c] text-sm font-bold font-serif">{item.num}</span>
                </div>
                <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About JJ */}
      <section className="bg-white/3 border-y border-white/8 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="w-28 h-28 rounded-full border-2 border-[#c9a84c]/50 overflow-hidden shrink-0 bg-[#c9a84c]/10 flex items-center justify-center">
              <Sparkles className="text-[#c9a84c]" size={36} />
            </div>
            <div>
              <p className="text-[#c9a84c] text-xs tracking-widest mb-2">ABOUT COACH JJ</p>
              <h3 className="font-serif text-xl font-bold mb-3">林炳騰 JJ</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                美國 NGH 認證催眠師、NLP 執行師、宇宙序能教育品牌創辦人。曾以自身的親身轉化經歷——從負債百萬到重建人生，協助過台積電、AWS、戴爾、全家便利商店等企業超過千人工作坊，用數字學解讀每一個靈魂的使命藍圖。
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["台積電", "AWS", "戴爾", "全家便利", "國研院", "伊甸基金會"].map(c => (
                  <span key={c} className="text-xs bg-[#c9a84c]/12 text-[#c9a84c] border border-[#c9a84c]/25 px-2 py-0.5 rounded-full">{c}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register" className="max-w-xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#c9a84c] text-xs tracking-widest font-medium text-center mb-2">RESERVE YOUR SEAT</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-2">
            立即報名
          </h2>
          <p className="text-white/50 text-sm text-center mb-8">免費入場 · 名額有限 · 報名後以 LINE 傳送入場連結</p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-[#c9a84c]/40 rounded-2xl p-10 text-center"
              >
                <CheckCircle className="text-[#c9a84c] mx-auto mb-4" size={40} />
                <h3 className="font-serif text-xl font-bold mb-2">報名成功！</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  感謝你的報名，JJ 老師將在講座開始前
                  <br />透過 LINE 傳送直播連結給你。
                </p>
                <p className="text-white/40 text-xs mt-4">若有任何問題，請加 LINE：@jjloveyou520</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="bg-white/4 border border-white/12 rounded-2xl p-8 space-y-5"
              >
                {loadError && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-yellow-300 text-sm text-center">
                    ⚠ 目前沒有開放報名的場次，請稍後再試
                  </div>
                )}

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">
                    姓名 <span className="text-[#c9a84c]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="你的姓名"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/6 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-[#c9a84c]/60 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">
                    手機號碼 <span className="text-[#c9a84c]">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="09xx-xxx-xxx"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-white/6 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-[#c9a84c]/60 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">LINE ID</label>
                  <input
                    type="text"
                    placeholder="你的 LINE ID（選填）"
                    value={form.lineId}
                    onChange={e => setForm(f => ({ ...f, lineId: e.target.value }))}
                    className="w-full bg-white/6 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-[#c9a84c]/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">你從哪裡得知這場講座？</label>
                  <select
                    value={form.referralSource}
                    onChange={e => setForm(f => ({ ...f, referralSource: e.target.value }))}
                    className="w-full bg-[#0a0f1e] border border-white/15 rounded-lg px-4 py-3 text-white/80 text-sm outline-none focus:border-[#c9a84c]/60 transition-colors"
                  >
                    <option value="">請選擇（選填）</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="line">LINE 好友推薦</option>
                    <option value="friend">朋友介紹</option>
                    <option value="other">其他</option>
                  </select>
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || loadError}
                  className="w-full bg-[#c9a84c] hover:bg-[#d4b45e] disabled:opacity-50 disabled:cursor-not-allowed text-[#0a0f1e] font-bold py-4 rounded-lg text-base transition-colors"
                >
                  {submitting ? "送出中…" : "確認報名 · 免費入場"}
                </button>

                <p className="text-white/30 text-xs text-center">
                  報名成功後，JJ 老師將透過 LINE 或簡訊傳送直播連結
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#c9a84c] text-xs tracking-widest font-medium text-center mb-2">FAQ</p>
          <h2 className="font-serif text-2xl font-bold text-center mb-8">常見問題</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="bg-white/4 border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-white text-sm font-medium">{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-[#c9a84c] shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-4 text-white/60 text-sm leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/8 bg-white/3 py-14 text-center px-6">
        <Star className="text-[#c9a84c] mx-auto mb-4" size={24} />
        <h3 className="font-serif text-xl font-bold mb-2">你的靈魂早已知道答案</h3>
        <p className="text-white/50 text-sm mb-6">讓數字帶你回到那個頻率。</p>
        <a
          href="#register"
          onClick={e => {
            e.preventDefault();
            document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-block bg-[#c9a84c] hover:bg-[#d4b45e] text-[#0a0f1e] font-bold px-8 py-3 rounded-full text-sm transition-colors"
        >
          立即報名免費講座
        </a>
      </section>
    </div>
  );
}
