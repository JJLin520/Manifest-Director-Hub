import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle, Zap, Shield, Target, Scan, Activity, FileText, Video } from "lucide-react";

type BookingForm = {
  name: string;
  gender: string;
  birthdate: string;
  phone: string;
  height: string;
  weight: string;
  email: string;
  bodyCondition: string;
};
const initBooking: BookingForm = { name: "", gender: "", birthdate: "", phone: "", height: "", weight: "", email: "", bodyCondition: "" };

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

const painPoints = [
  { icon: "😮‍💨", title: "長期肩頸僵硬", desc: "按摩、推拿做了無數次，幾天後又回到原點，問題從未真正消失。" },
  { icon: "🔄", title: "腰酸背痛一直復發", desc: "找不到根本原因，每次只能暫時緩解，卻一再循環。" },
  { icon: "🏋️", title: "身體越來越沈重", desc: "姿勢不對、肌肉緊繃，整個人的能量和活力都被拖垮。" },
  { icon: "🔍", title: "長期找不出原因", desc: "職業勞損、坐姿問題、運動傷害——傳統方式難以精準定位根源。" },
];

const scanFeatures = [
  { icon: <Activity size={18} />, title: "脊椎曲度分析", desc: "精準測量脊椎的前彎、後弓與側彎狀態" },
  { icon: <Target size={18} />, title: "骨盆是否歪斜", desc: "評估骨盆傾斜角度，找出支撐力失衡點" },
  { icon: <Zap size={18} />, title: "肩膀高低差", desc: "偵測左右肩膀的高度與旋轉偏差" },
  { icon: <Shield size={18} />, title: "身體左右平衡", desc: "分析重心分布，揪出長期代償的根源" },
  { icon: <Scan size={18} />, title: "姿勢與肌肉張力", desc: "評估整體體態，對應筋膜沾黏位置" },
];

const included = [
  { icon: <Scan size={22} />, title: "AI 骨架筋膜評測分析", desc: "幾分鐘內完成全身骨架掃描，生成精準的身體評測報告，關節骨骼變異一目瞭然。" },
  { icon: <FileText size={22} />, title: "個人脊椎肌肉報告", desc: "你的專屬報告，清楚標示問題部位、嚴重程度與建議改善優先序。" },
  { icon: <Video size={22} />, title: "居家運動教學影片", desc: "依據你的評測結果，提供針對性的居家伸展與強化訓練，讓改善不間斷。" },
];

const comparisons = [
  { item: "精準定位問題根源", ai: true, trad: false },
  { item: "客觀數據報告", ai: true, trad: false },
  { item: "5 大維度同步評估", ai: true, trad: false },
  { item: "個人化改善方案", ai: true, trad: "部分" },
  { item: "居家持續改善指引", ai: true, trad: false },
  { item: "依賴治療師主觀判斷", ai: false, trad: true },
  { item: "每次需重新評估", ai: false, trad: true },
];

const whoIsFor = [
  "長期肩頸腰背不適，試過很多方法還是反覆發作",
  "工作需要長時間坐姿或站立（辦公族、教師、廚師、美容師…）",
  "喜歡運動但容易受傷、恢復慢",
  "想在按摩、物理治療前先了解自己的身體狀況",
  "重視自己健康管理，想要有數據依據",
];

const faqs = [
  { q: "AI 評測需要多長時間？", a: "整個評測流程約 15–20 分鐘，包含拍攝、AI 分析與結果說明。" },
  { q: "評測是線上還是實體進行？", a: "目前為預約制實體服務，JJ 老師會以專業物理治療師角度協助你解讀報告。" },
  { q: "跟一般健身房的姿勢評估有什麼不同？", a: "AI 骨架筋膜評測結合醫療等級的影像分析，能量化偵測 5 大維度，不是主觀目測，而是有數據報告的精準評估。" },
  { q: "做完評測之後呢？", a: "你將拿到個人脊椎肌肉報告 + 居家訓練影片。有需要的話，也可以進一步討論後續調理方案。" },
  { q: "費用是多少？", a: "線上講座學員體驗價 $500 / 人 / 次（各大醫院評測原價 $3,000）。名額有限，透過預約表單留下資料，JJ 老師將於 24 小時內確認。" },
];

export default function FasciaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [booking, setBooking] = useState<BookingForm>(initBooking);
  const [bookSubmitted, setBookSubmitted] = useState(false);
  const [bookSubmitting, setBookSubmitting] = useState(false);
  const [bookError, setBookError] = useState("");

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookError("");
    if (!booking.name.trim()) { setBookError("請填寫姓名"); return; }
    if (!booking.gender) { setBookError("請選擇性別"); return; }
    if (!booking.birthdate) { setBookError("請填寫出生年月日"); return; }
    if (!booking.phone.trim()) { setBookError("請填寫手機號碼"); return; }
    setBookSubmitting(true);
    const extraInfo = [
      `性別：${booking.gender}`,
      `出生日期：${booking.birthdate}`,
      booking.height ? `身高：${booking.height} cm` : null,
      booking.weight ? `體重：${booking.weight} kg` : null,
      booking.bodyCondition ? `身體狀況：${booking.bodyCondition}` : null,
    ].filter(Boolean).join(" | ");
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: booking.name,
          phone: booking.phone,
          email: booking.email || undefined,
          attendees: "1",
          referralSource: extraInfo,
          eventName: "AI 骨架筋膜評測預約",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "提交失敗");
      }
      setBookSubmitted(true);
    } catch (err) {
      setBookError((err as Error).message || "提交時發生錯誤，請稍後再試。");
    } finally {
      setBookSubmitting(false);
    }
  };

  const scrollToBook = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("book-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-white font-sans">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1530] via-[#080d1a] to-[#060b16]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-cyan-500/6 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#c9a84c]/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                AI 智能骨架筋膜精準評測
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-5">
                你的疼痛，<br />
                不該成為<br />
                <span className="text-cyan-400">生活的常態。</span>
              </h1>
              <p className="text-white/70 text-base leading-relaxed mb-4">
                很多人的痠痛、駝背、骨盆歪斜，其實不是單純「老化」，<br />而是<span className="text-cyan-300 font-medium">骨架與筋膜失衡</span>造成的。
              </p>
              <p className="text-white/80 leading-relaxed mb-8">
                透過 AI 智能脊椎肌肉評測系統，幾分鐘精準分析您的身體狀況——<br />
                <span className="text-[#c9a84c] font-medium">從根本預防，找回健康脊椎與輕鬆體態。</span>
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#book-form" onClick={scrollToBook}
                  className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-[#080d1a] font-bold rounded-full text-base transition-all">
                  立即預約 AI 檢測 →
                </a>
                <a href="#what-is-this"
                  onClick={e => { e.preventDefault(); document.getElementById("what-is-this")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="px-8 py-4 border border-white/20 hover:border-white/40 text-white/70 hover:text-white rounded-full text-base transition-all">
                  了解更多
                </a>
              </div>
            </motion.div>

            {/* Body illustration — holographic body scan */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
              className="hidden md:flex items-center justify-center">
              <div className="relative w-72 h-[440px] rounded-2xl bg-[#050d17] border border-cyan-500/25 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,_rgba(6,182,212,0.08)_0%,_transparent_70%)]" />

                {/* Scan line animation */}
                <motion.div
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent z-30 pointer-events-none"
                  animate={{ top: ["5%", "95%", "5%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                {/* Scan line glow trail */}
                <motion.div
                  className="absolute left-0 right-0 h-8 bg-gradient-to-b from-cyan-400/10 to-transparent z-30 pointer-events-none"
                  animate={{ top: ["5%", "95%", "5%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                {/* Body scan image */}
                <img
                  src="/body-scan.png"
                  alt="AI 身體掃描示意"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-80 mix-blend-screen z-10"
                />

                {/* Scan frame corners */}
                <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" viewBox="0 0 288 440" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Top-left corner bracket */}
                  <path d="M20 50 L20 20 L60 20" stroke="rgba(6,182,212,0.85)" strokeWidth="2" strokeLinecap="round"/>
                  {/* Top-right corner bracket */}
                  <path d="M268 50 L268 20 L228 20" stroke="rgba(6,182,212,0.85)" strokeWidth="2" strokeLinecap="round"/>
                  {/* Bottom-left corner bracket */}
                  <path d="M20 390 L20 420 L60 420" stroke="rgba(6,182,212,0.85)" strokeWidth="2" strokeLinecap="round"/>
                  {/* Bottom-right corner bracket */}
                  <path d="M268 390 L268 420 L228 420" stroke="rgba(6,182,212,0.85)" strokeWidth="2" strokeLinecap="round"/>

                  {/* Top center calibration bar */}
                  <rect x="114" y="12" width="60" height="6" rx="2" stroke="rgba(6,182,212,0.7)" strokeWidth="1" fill="rgba(6,182,212,0.1)"/>
                  <line x1="144" y1="8" x2="144" y2="12" stroke="rgba(6,182,212,0.7)" strokeWidth="1.5"/>

                  {/* Shoulder level measurement bracket (left) */}
                  <rect x="16" y="148" width="20" height="8" rx="2" stroke="rgba(6,182,212,0.65)" strokeWidth="1" fill="rgba(6,182,212,0.08)"/>
                  <line x1="36" y1="152" x2="80" y2="152" stroke="rgba(6,182,212,0.35)" strokeWidth="0.8" strokeDasharray="3 3"/>
                  {/* Shoulder level measurement bracket (right) */}
                  <rect x="252" y="148" width="20" height="8" rx="2" stroke="rgba(6,182,212,0.65)" strokeWidth="1" fill="rgba(6,182,212,0.08)"/>
                  <line x1="252" y1="152" x2="208" y2="152" stroke="rgba(6,182,212,0.35)" strokeWidth="0.8" strokeDasharray="3 3"/>

                  {/* Pelvis level measurement bracket (left) */}
                  <rect x="16" y="270" width="20" height="8" rx="2" stroke="rgba(6,182,212,0.65)" strokeWidth="1" fill="rgba(6,182,212,0.08)"/>
                  <line x1="36" y1="274" x2="90" y2="274" stroke="rgba(6,182,212,0.35)" strokeWidth="0.8" strokeDasharray="3 3"/>
                  {/* Pelvis level measurement bracket (right) */}
                  <rect x="252" y="270" width="20" height="8" rx="2" stroke="rgba(6,182,212,0.65)" strokeWidth="1" fill="rgba(6,182,212,0.08)"/>
                  <line x1="252" y1="274" x2="198" y2="274" stroke="rgba(6,182,212,0.35)" strokeWidth="0.8" strokeDasharray="3 3"/>

                  {/* Knee level measurement bracket (left) */}
                  <rect x="16" y="358" width="20" height="8" rx="2" stroke="rgba(6,182,212,0.5)" strokeWidth="1" fill="rgba(6,182,212,0.06)"/>
                  <line x1="36" y1="362" x2="96" y2="362" stroke="rgba(6,182,212,0.25)" strokeWidth="0.8" strokeDasharray="3 3"/>
                  {/* Knee level measurement bracket (right) */}
                  <rect x="252" y="358" width="20" height="8" rx="2" stroke="rgba(6,182,212,0.5)" strokeWidth="1" fill="rgba(6,182,212,0.06)"/>
                  <line x1="252" y1="362" x2="192" y2="362" stroke="rgba(6,182,212,0.25)" strokeWidth="0.8" strokeDasharray="3 3"/>

                  {/* Node dots at key anatomy points */}
                  {/* Head */}
                  <circle cx="144" cy="72" r="4" fill="rgba(6,182,212,0.9)" filter="url(#nodeglow)"/>
                  {/* Left shoulder */}
                  <circle cx="76" cy="152" r="5" fill="rgba(6,182,212,0.85)" filter="url(#nodeglow)"/>
                  {/* Right shoulder */}
                  <circle cx="212" cy="152" r="5" fill="rgba(6,182,212,0.85)" filter="url(#nodeglow)"/>
                  {/* Spine mid */}
                  <circle cx="144" cy="220" r="3.5" fill="rgba(6,182,212,0.7)"/>
                  {/* Left hip */}
                  <circle cx="100" cy="274" r="4.5" fill="rgba(6,182,212,0.8)" filter="url(#nodeglow)"/>
                  {/* Right hip */}
                  <circle cx="188" cy="274" r="4.5" fill="rgba(6,182,212,0.8)" filter="url(#nodeglow)"/>
                  {/* Left knee */}
                  <circle cx="108" cy="362" r="4" fill="rgba(6,182,212,0.7)"/>
                  {/* Right knee */}
                  <circle cx="180" cy="362" r="4" fill="rgba(6,182,212,0.7)"/>

                  <defs>
                    <filter id="nodeglow">
                      <feGaussianBlur stdDeviation="2.5" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>
                </svg>

                {/* Floating labels left */}
                <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around py-16 z-40">
                  {["肩膀高低差", "脊椎曲度", "骨盆平衡"].map((label, i) => (
                    <motion.div key={label}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.25 }}
                      className="flex items-center gap-1.5 bg-[#050d17]/80 border border-cyan-500/30 rounded px-2 py-1 backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span className="text-cyan-300 text-[10px] whitespace-nowrap">{label}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Floating labels right */}
                <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-around py-16 z-40">
                  {["筋膜沾黏", "肌肉張力", "左右平衡"].map((label, i) => (
                    <motion.div key={label}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 + i * 0.25 }}
                      className="flex items-center gap-1.5 bg-[#050d17]/80 border border-cyan-500/30 rounded px-2 py-1 backdrop-blur-sm">
                      <span className="text-cyan-300 text-[10px] whitespace-nowrap">{label}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 共鳴：你是不是也這樣？── */}
      <section className="bg-white/3 border-y border-white/8 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <p className="text-cyan-400 text-xs tracking-widest font-medium text-center mb-3">PAIN POINTS</p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-10">
              你是不是也有這樣的感覺——
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-4">
            {painPoints.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.08}>
                <div className="bg-white/4 border border-white/10 rounded-xl p-5 hover:border-cyan-500/20 transition-colors">
                  <p className="text-2xl mb-3">{p.icon}</p>
                  <p className="text-white font-semibold mb-2">{p.title}</p>
                  <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div className="mt-8 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-2xl px-8 py-5 text-center">
              <p className="text-white font-semibold text-lg">💡 這不是你的錯。是因為從來沒有人幫你找到真正的根源。</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 什麼是 AI 骨架筋膜評測 ── */}
      <section id="what-is-this" className="py-16 max-w-3xl mx-auto px-6">
        <FadeIn>
          <p className="text-cyan-400 text-xs tracking-widest font-medium text-center mb-3">WHAT IS THIS</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-4">
            AI 骨架筋膜精準評測
          </h2>
          <p className="text-white/50 text-center text-base leading-relaxed mb-10">
            智能科技，精準評測。<br />
            <span className="text-white/80">關節骨骼變異一目瞭然，肌肉沾黏狀態一清二楚。</span>
          </p>
          <div className="bg-white/4 border border-cyan-500/20 rounded-2xl p-7">
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              透過 AI 智能脊椎肌肉評測系統，只需要幾分鐘，就能精準分析您的身體狀況：
            </p>
            <div className="space-y-3 mb-6">
              {scanFeatures.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-4 bg-cyan-500/6 border border-cyan-500/15 rounded-lg px-4 py-3">
                  <span className="text-cyan-400 mt-0.5 shrink-0">{f.icon}</span>
                  <div>
                    <p className="text-white font-medium text-sm">✔ {f.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="border-t border-white/8 pt-5">
              <p className="text-white/60 text-sm mb-3">系統將產出您的專屬評測報告，並提供：</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "🏃", label: "居家運動建議" },
                  { icon: "🧍", label: "姿勢調整方法" },
                  { icon: "🦴", label: "脊椎保養方案" },
                ].map(item => (
                  <div key={item.label} className="text-center bg-[#c9a84c]/8 border border-[#c9a84c]/20 rounded-lg py-3 px-2">
                    <div className="text-xl mb-1">{item.icon}</div>
                    <p className="text-[#c9a84c] text-xs font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── 體驗內容 ── */}
      <section className="bg-white/3 border-y border-white/8 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <p className="text-cyan-400 text-xs tracking-widest font-medium text-center mb-3">WHAT'S INCLUDED</p>
            <h2 className="font-serif text-2xl font-bold text-center mb-10">體驗內容包含</h2>
          </FadeIn>
          <div className="space-y-4">
            {included.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="flex gap-5 bg-white/4 border border-white/10 hover:border-cyan-500/20 rounded-xl p-6 transition-colors">
                  <span className="text-cyan-400 shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-white font-semibold mb-1">{item.title}</p>
                    <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 定價 ── */}
      <section className="py-14 max-w-2xl mx-auto px-6">
        <FadeIn>
          <div className="relative bg-gradient-to-br from-[#0d1a30] to-[#080d1a] border border-[#c9a84c]/40 rounded-2xl overflow-hidden">
            {/* Gold shimmer top bar */}
            <div className="h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
            <div className="p-8 text-center">
              <span className="inline-block px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full tracking-widest mb-5">
                線上講座限定優惠
              </span>
              <div className="flex items-center justify-center gap-6 mb-4">
                <div>
                  <p className="text-white/35 text-sm line-through mb-1">各大醫院評測原價</p>
                  <p className="text-white/40 text-3xl font-bold line-through">$3,000</p>
                </div>
                <div className="text-[#c9a84c]/40 text-2xl font-light">→</div>
                <div>
                  <p className="text-cyan-400 text-sm font-medium mb-1">講座學員體驗價</p>
                  <p className="text-white text-5xl font-bold">
                    $500 <span className="text-lg font-normal text-white/50">/ 人 / 次</span>
                  </p>
                </div>
              </div>
              <p className="text-white/40 text-xs mb-6">節省 $2,500・科學評估同等標準・AI 精準量化</p>
              <a href="#book-form" onClick={scrollToBook}
                className="inline-block bg-[#c9a84c] hover:bg-[#d4b060] text-[#080d1a] font-bold px-10 py-3.5 rounded-full text-sm transition-all shadow-[0_0_30px_rgba(201,168,76,0.2)]">
                立即預約體驗 →
              </a>
              <p className="text-white/25 text-xs mt-3">名額有限，預約後 JJ 老師將確認時間</p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── 為什麼不一樣：對比表格 ── */}
      <section className="py-16 max-w-3xl mx-auto px-6">
        <FadeIn>
          <p className="text-cyan-400 text-xs tracking-widest font-medium text-center mb-3">COMPARISON</p>
          <h2 className="font-serif text-2xl font-bold text-center mb-10">AI 評測 vs 傳統方式</h2>
          <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-white/6 text-xs font-semibold text-muted-foreground px-4 py-3">
              <span></span>
              <span className="text-center text-cyan-400">AI 骨架評測</span>
              <span className="text-center text-white/40">傳統方式</span>
            </div>
            {comparisons.map((c, i) => (
              <div key={c.item} className={`grid grid-cols-3 px-4 py-3 text-sm border-t border-white/6 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                <span className="text-white/70">{c.item}</span>
                <span className="text-center">
                  {c.ai === true ? <span className="text-cyan-400 font-bold">✓</span> : <span className="text-red-400/60">✕</span>}
                </span>
                <span className="text-center">
                  {c.trad === true ? <span className="text-green-400">✓</span>
                    : c.trad === "部分" ? <span className="text-yellow-400 text-xs">部分</span>
                    : <span className="text-red-400/60">✕</span>}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── 關於 JJ 老師 ── */}
      <section className="bg-white/3 border-y border-white/8 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <p className="text-cyan-400 text-xs tracking-widest font-medium text-center mb-3">YOUR SPECIALIST</p>
            <h2 className="font-serif text-2xl font-bold text-center mb-10">你的身體，交給懂你的專家</h2>
            <div className="flex flex-col md:flex-row items-center gap-8 bg-white/4 border border-white/10 rounded-2xl p-8">
              <div className="w-24 h-24 rounded-full border-2 border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center shrink-0">
                <span className="text-4xl">👨‍⚕️</span>
              </div>
              <div className="flex-1">
                <p className="text-cyan-400 text-xs tracking-widest mb-1">物理治療師 × 潛意識教練</p>
                <h3 className="font-serif text-xl font-bold mb-3">林炳騰｜JJ</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  擁有物理治療師專業背景，深入研究筋膜與骨架系統超過十年。JJ 老師結合 AI 科技與徒手評估技術，協助數百位個案精準定位問題根源，大幅提升後續按摩、復健與物理治療的效果。
                </p>
                <div className="flex flex-wrap gap-2">
                  {["物理治療師", "NGH 催眠講師", "NLP 導師", "潛意識教練"].map(tag => (
                    <span key={tag} className="text-xs bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 適合族群 ── */}
      <section className="py-16 max-w-3xl mx-auto px-6">
        <FadeIn>
          <p className="text-cyan-400 text-xs tracking-widest font-medium text-center mb-3">WHO IS THIS FOR</p>
          <h2 className="font-serif text-2xl font-bold text-center mb-10">誰適合來做 AI 評測？</h2>
          <div className="space-y-3">
            {whoIsFor.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 bg-white/4 border border-white/10 rounded-xl px-5 py-4">
                <CheckCircle size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-white/80 text-sm leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── 預約表單 ── */}
      <section id="book-form" className="bg-gradient-to-b from-[#0d1530] to-[#080d1a] border-t border-cyan-500/15 py-20 px-6">
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-cyan-400 text-xs tracking-widest font-medium mb-2">BOOK YOUR SCAN</p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">預約 AI 骨架筋膜評測</h2>
              <p className="text-white/50 text-sm leading-relaxed">留下您的資料，JJ 老師將於 24 小時內與您確認預約時間。</p>
            </div>
          </FadeIn>

          {bookSubmitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-10 text-center space-y-4">
              <div className="text-5xl">✅</div>
              <h3 className="font-serif text-xl font-bold text-cyan-300">預約資料已送出！</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                感謝您的預約，JJ 老師將盡快透過電話或 LINE 與您確認時間。<br />
                名額有限，請留意來電通知。
              </p>
              <a href="https://lin.ee/Nq1MhuY" target="_blank" rel="noopener noreferrer"
                className="inline-block mt-2 text-cyan-400 text-sm underline underline-offset-4 hover:text-cyan-300">
                也可直接加 LINE 詢問 →
              </a>
            </motion.div>
          ) : (
            <FadeIn delay={0.1}>
              <form onSubmit={handleBooking}
                className="bg-white/4 border border-white/10 rounded-2xl p-8 space-y-6">

                {/* 姓名 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">
                    姓名 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={booking.name}
                    onChange={e => setBooking(b => ({ ...b, name: e.target.value }))}
                    placeholder="請輸入您的中文全名"
                    className="w-full px-4 py-3 bg-white/6 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition text-sm"
                  />
                </div>

                {/* 性別 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">
                    性別 <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-3">
                    {["男", "女"].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setBooking(b => ({ ...b, gender: g }))}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                          booking.gender === g
                            ? "bg-cyan-500/20 border-cyan-500/70 text-cyan-300"
                            : "bg-white/6 border-white/15 text-white/60 hover:border-white/30 hover:text-white/80"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 西元出生年月日 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">
                    西元出生年月日 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={booking.birthdate}
                    onChange={e => setBooking(b => ({ ...b, birthdate: e.target.value }))}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-white/6 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition text-sm [color-scheme:dark]"
                  />
                </div>

                {/* 手機 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">
                    手機號碼 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={booking.phone}
                    onChange={e => setBooking(b => ({ ...b, phone: e.target.value }))}
                    placeholder="例：0912-345-678"
                    className="w-full px-4 py-3 bg-white/6 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition text-sm"
                  />
                </div>

                {/* 身高 / 體重 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">身高（cm，選填）</label>
                    <input
                      type="number"
                      value={booking.height}
                      onChange={e => setBooking(b => ({ ...b, height: e.target.value }))}
                      placeholder="例：168"
                      min={100}
                      max={250}
                      className="w-full px-4 py-3 bg-white/6 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">體重（kg，選填）</label>
                    <input
                      type="number"
                      value={booking.weight}
                      onChange={e => setBooking(b => ({ ...b, weight: e.target.value }))}
                      placeholder="例：60"
                      min={30}
                      max={300}
                      className="w-full px-4 py-3 bg-white/6 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">Email（選填）</label>
                  <input
                    type="email"
                    value={booking.email}
                    onChange={e => setBooking(b => ({ ...b, email: e.target.value }))}
                    placeholder="例：yourname@gmail.com"
                    className="w-full px-4 py-3 bg-white/6 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition text-sm"
                  />
                </div>

                {/* 目前身體狀況說明 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">目前身體狀況說明（選填）</label>
                  <textarea
                    rows={4}
                    value={booking.bodyCondition}
                    onChange={e => setBooking(b => ({ ...b, bodyCondition: e.target.value }))}
                    placeholder="例：長期腰痠、肩膀高低差、骨盆歪斜…或其他想讓 JJ 老師提前了解的狀況"
                    className="w-full px-4 py-3 bg-white/6 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition text-sm resize-none"
                  />
                </div>

                {bookError && (
                  <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {bookError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookSubmitting}
                  className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-[#080d1a] font-bold rounded-xl text-base transition-all shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                >
                  {bookSubmitting ? "送出中⋯⋯" : "送出預約資料 →"}
                </button>

                <p className="text-center text-xs text-white/25">
                  名額有限，預約後 JJ 老師將於 24 小時內聯繫確認。
                </p>
              </form>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <FadeIn>
          <p className="text-cyan-400 text-xs tracking-widest font-medium text-center mb-2">FAQ</p>
          <h2 className="font-serif text-2xl font-bold text-center mb-8">常見問題</h2>
          <div className="space-y-3">
            {faqs.map((item, i) => (
              <div key={i} className="bg-white/4 border border-white/10 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-white text-sm font-medium">{item.q}</span>
                  <ChevronDown size={15} className={`text-cyan-400 shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
                      <p className="px-5 pb-4 text-white/55 text-sm leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/8 bg-white/3 py-12 text-center px-6">
        <p className="text-white/50 text-sm mb-4">還有疑問？歡迎直接加 LINE 詢問，JJ 老師親自回覆。</p>
        <a href="https://lin.ee/Nq1MhuY" target="_blank" rel="noopener noreferrer"
          className="inline-block border border-cyan-500/40 hover:border-cyan-500 text-cyan-400 hover:text-cyan-300 font-medium px-8 py-3 rounded-full text-sm transition-all">
          加入 LINE 詢問 →
        </a>
        <p className="text-white/20 text-xs mt-6">© 宇宙序能｜林炳騰 JJ · AI 骨架筋膜精準評測服務</p>
      </section>
    </div>
  );
}
