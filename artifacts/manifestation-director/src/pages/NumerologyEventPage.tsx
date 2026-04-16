import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Wifi, ChevronDown, CheckCircle, Sparkles } from "lucide-react";

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

const personalities = [
  { num: "1", title: "開創者", tagline: "第一個踏進未知的人", pros: "行動力強，天生領導氣場，不畏挑戰，能開創他人不敢想的局面。", cons: "容易一意孤行，難以接受他人意見，有時用強勢掩蓋內心的不安全感。" },
  { num: "2", title: "連結者", tagline: "讓人與人之間有了橋", pros: "善解人意，溫和細膩，天生的人際潤滑劑，能讓團隊和諧運作。", cons: "容易忽略自己的需求，活在別人的期待裡，有時成為默默承受的那個人。" },
  { num: "3", title: "表達者", tagline: "靈魂透過嘴巴出口", pros: "溝通力強，點子多，樂觀感染力強，能讓任何場合都活起來。", cons: "情緒起伏大，容易說了但沒做到，有時因表達不當而無意傷人。" },
  { num: "4", title: "規劃者", tagline: "讓混亂的世界有了秩序", pros: "穩定踏實，注重細節，執行力強，是團隊裡最可靠的那根柱子。", cons: "過於保守，害怕改變，有時因為追求完美的安全感而錯過機會。" },
  { num: "5", title: "探索者", tagline: "永遠在找下一個地平線", pros: "好奇心旺盛，適應力強，充滿冒險精神，能在變化中找到機會。", cons: "難以定下來，容易喜新厭舊，給出承諾後又因感覺消失而退縮。" },
  { num: "6", title: "愛人者", tagline: "愛是他的語言，也是他的課題", pros: "富有同理心，樂於付出，是家庭與團隊的精神支柱，讓人感到溫暖。", cons: "容易犧牲自己換取他人認可，對回報有隱藏期待，長期累積後容易心寒。" },
  { num: "7", title: "洞見者", tagline: "他問的問題，別人還沒想到", pros: "分析力強，思維深邃，能看穿事物本質，是團隊的智囊與思想燈塔。", cons: "容易過度思考，對人事物抱持懷疑，有時因為太理性而與人產生距離。" },
  { num: "8", title: "成就者", tagline: "把夢想變成數字的人", pros: "目標感強，執行力驚人，天生的大局觀，能帶領團隊達成難以想像的成就。", cons: "容易過度追求物質與控制，忽略情感需求，有時讓身邊的人感到壓力。" },
  { num: "9", title: "渡化者", tagline: "他的存在本身就是一種療癒", pros: "慈悲心深，靈性敏感，能感受他人看不見的痛苦，並給予真正的陪伴。", cons: "容易過度犧牲，迷失在理想中而忽略現實，有時讓自己的需求完全消失。" },
];

const outcomes = [
  { icon: "🔑", title: "一個屬於你的數字身份", desc: "不是標籤，是你第一次真正認識自己，30 秒，找到你的命運原型" },
  { icon: "🧭", title: "看見你的命運程式在哪裡卡住你", desc: "關係、金錢、事業——那個一直重複的模式，終於有了解答" },
  { icon: "⚡", title: "知道你的天生原力是什麼", desc: "不是別人說你應該怎樣，是你本來就擁有的力量" },
  { icon: "🗺️", title: "一張屬於你的人生地圖", desc: "知道自己從哪裡來，才能決定要往哪裡去" },
  { icon: "🎬", title: "一個改變的起點", desc: "看見之後，你才能真正開始導演自己的人生" },
];

const dimensions = [
  { name: "主命數（天命數）", desc: "你這輩子的核心使命" },
  { name: "靈魂數", desc: "你內在真正渴望的東西" },
  { name: "人格數", desc: "你呈現給世界的樣子" },
  { name: "導師數（貴人數）", desc: "你的貴人頻率在哪裡" },
  { name: "成熟數", desc: "你在人生後半段會走向哪裡" },
  { name: "流年數", desc: "你現在正在經歷什麼能量" },
];

const faqItems = [
  { q: "我需要有數字學基礎嗎？", a: "完全不需要！這場直播從零開始，JJ 老師會帶你現場計算，任何人都能立刻看懂自己的數字。" },
  { q: "講座是線上進行嗎？", a: "是的，採用 Zoom 線上直播，不限地區，報名後將以 LINE 傳送入場連結。" },
  { q: "講座時間多長？", a: "約 90 分鐘，包含 Q&A 互動時間。" },
  { q: "直播結束後，後續還有什麼？", a: "想要更深入解碼自己命運程式的人，將有機會了解更完整的生命數字系統與個人解盤服務。" },
];

export default function NumerologyEventPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", lineId: "", referralSource: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openNum, setOpenNum] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API}/api/numerology/current-session`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setSession)
      .catch(() => setLoadError(true));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim()) { setError("請填寫姓名和手機號碼"); return; }
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

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1530] to-[#0a0f1e] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#c9a84c]/8 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
              <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full">🔴 線上直播</span>
              <span className="text-xs bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30 px-3 py-1 rounded-full">🟡 完全免費</span>
              <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/30 px-3 py-1 rounded-full">🟢 名額有限</span>
            </div>

            <p className="text-[#c9a84c] text-sm font-medium tracking-[0.15em] mb-4">宇宙序能教育品牌 × Coach JJ 林炳騰</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-5">
              你的生日數字，<br />藏著你這輩子<br className="md:hidden" />
              <span className="text-[#c9a84c]">最重要的一個秘密</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-2">不是算命。不是玄學。</p>
            <p className="text-white/80 text-lg leading-relaxed">
              是你命運程式的原始碼——<br />
              <span className="text-white/50">而你，從來沒有人教你讀懂它。</span>
            </p>
          </motion.div>

          {/* Session Info Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-10 max-w-md mx-auto">
            <div className="bg-white/5 border border-[#c9a84c]/30 rounded-2xl px-6 py-5 text-left">
              {session ? (
                <>
                  <p className="text-[#c9a84c] text-xs tracking-widest mb-3 font-medium">第 {session.sessionNumber} 場 · 現正開放報名</p>
                  <div className="flex items-center gap-3 mb-2"><Calendar size={15} className="text-[#c9a84c] shrink-0" /><span className="text-white font-semibold">{formatted?.date}</span></div>
                  <div className="flex items-center gap-3 mb-2"><Clock size={15} className="text-[#c9a84c] shrink-0" /><span className="text-white/80">{formatted?.time} 開始（共 90 分鐘）</span></div>
                  <div className="flex items-center gap-3"><Wifi size={15} className="text-[#c9a84c] shrink-0" /><span className="text-white/80">Zoom 線上直播 · 完全免費</span></div>
                </>
              ) : loadError ? (
                <p className="text-white/40 text-sm text-center py-2">目前沒有開放報名的場次，請稍後再試</p>
              ) : (
                <div className="flex items-center justify-center py-3 gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-[#c9a84c] border-t-transparent animate-spin" />
                  <span className="text-white/40 text-sm">載入場次資訊…</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <a href="#register" onClick={e => { e.preventDefault(); document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }); }}
                className="block w-full bg-[#c9a84c] hover:bg-[#d4b45e] text-[#0a0f1e] font-bold py-4 rounded-xl text-center transition-colors">
                ⚡ 現在報名，完全免費
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 共鳴段落 ── */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-10">你有沒有這樣的感覺——</h2>
          <div className="space-y-4 text-left max-w-lg mx-auto mb-10">
            {["明明很努力，卻總是卡在同一個地方。", "換了環境，卻遇見一樣的問題。", "想改變，卻不知道從哪裡開始。"].map((t, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/4 border border-white/8 rounded-xl px-5 py-4">
                <span className="text-[#c9a84c] mt-0.5 shrink-0">●</span>
                <p className="text-white/80 text-base leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-2xl px-8 py-6">
            <p className="text-white font-semibold text-lg mb-2">💬 這不是你不夠好。</p>
            <p className="text-white/60 leading-relaxed">是你有一個從來沒被看見的命運程式，一直在背後影響你。</p>
          </div>
        </motion.div>
      </section>

      {/* ── 故事段落 ── */}
      <section className="bg-white/3 border-y border-white/8 py-16">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-[#c9a84c] text-xs tracking-widest font-medium mb-6 text-center">STORY</p>
            <h2 className="font-serif text-2xl font-bold mb-8 text-center">讓我說一個真實故事。</h2>
            <div className="space-y-5 text-white/70 leading-relaxed text-[15px]">
              <p>十幾年前，我剛出社會，遇見了一個讓我非常佩服的前輩——Kevin 哥。</p>
              <p>他的事業做得很成功，但他身上有一種東西，不是錢，不是頭銜，是一種<span className="text-white font-medium">看透事物的從容</span>。</p>
              <p>有一天，我鼓起勇氣問他：「你成功的秘訣是什麼？」</p>
              <p>他沒有直接回答。他反問我：<span className="text-[#c9a84c] font-medium">「你相信嗎？看不見的力量，影響比看得見的更大。」</span></p>
              <p>那天，他幫我看了我的數字盤。我之前也學過生命數字。但那一刻我才發現——原來數字可以這麼精準地看見一個人。</p>
              <p>我的個性、我可能遇到的問題、我可以怎麼發展——他說的每一句話，都像是有人拿著手電筒，照進了我從來沒有被看見過的地方。</p>
              <div className="bg-[#c9a84c]/10 border-l-2 border-[#c9a84c] rounded-r-xl px-6 py-4 my-6">
                <p className="text-[#c9a84c] font-semibold">「數字，學很簡單。難的，是你如何應用它。」</p>
              </div>
              <p>從那天起，我開始用數字驗證我的生命。我去學了坊間三四種不同的數字系統，成為了數字的講師，用數字陪伴過數百個人看見自己。</p>
              <p className="text-white font-medium">而在這一路深入研究之後，我發現了一件事——<span className="text-[#c9a84c]">數字裡頭，藏著生命順流的秘密。</span></p>
              <p>那個秘密，我想在這場直播裡，第一次完整地說給你聽。</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 什麼是宇宙數字原力學 ── */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-[#c9a84c] text-xs tracking-widest font-medium mb-4">WHAT IS THIS</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">什麼是宇宙數字原力學？</h2>
          <p className="text-white/60 leading-relaxed text-base mb-6">
            每個人出生時，就帶著一種天生的原力——<br />
            它決定了你的思維模式、行動邏輯，<br />
            以及你在關係、金錢、事業上最深的卡點。
          </p>
          <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-2xl px-8 py-5">
            <p className="text-white font-semibold text-lg">當你看懂它，你才真正開始導演自己的人生。</p>
          </div>
        </motion.div>
      </section>

      {/* ── 九型數字人格 ── */}
      <section className="bg-white/3 border-y border-white/8 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-[#c9a84c] text-xs tracking-widest font-medium text-center mb-3">PERSONALITY TYPES</p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-3">你是哪一型數字人格？</h2>
            <p className="text-white/50 text-sm text-center mb-10">現場計算，現場揭曉。</p>
            <div className="space-y-3">
              {personalities.map((p, i) => (
                <div key={p.num} className="bg-white/4 border border-white/10 hover:border-[#c9a84c]/30 rounded-xl overflow-hidden transition-colors">
                  <button onClick={() => setOpenNum(openNum === i ? null : i)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left">
                    <div className="w-9 h-9 rounded-full border border-[#c9a84c]/50 flex items-center justify-center shrink-0">
                      <span className="text-[#c9a84c] font-bold font-serif text-sm">{p.num}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{p.title}</p>
                      <p className="text-white/40 text-xs">{p.tagline}</p>
                    </div>
                    <ChevronDown size={15} className={`text-[#c9a84c] shrink-0 transition-transform ${openNum === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openNum === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <div className="px-5 pb-5 grid md:grid-cols-2 gap-4">
                          <div className="bg-green-500/8 border border-green-500/20 rounded-lg p-4">
                            <p className="text-green-400 text-xs font-semibold mb-2">✅ 優點</p>
                            <p className="text-white/70 text-sm leading-relaxed">{p.pros}</p>
                          </div>
                          <div className="bg-orange-500/8 border border-orange-500/20 rounded-lg p-4">
                            <p className="text-orange-400 text-xs font-semibold mb-2">⚠️ 可能的盲點</p>
                            <p className="text-white/70 text-sm leading-relaxed">{p.cons}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 你將會得到 ── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-[#c9a84c] text-xs tracking-widest font-medium text-center mb-3">WHAT YOU WILL GET</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-10">來這場講座，你將會得到——</h2>
          <div className="space-y-4">
            {outcomes.map((o, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
                className="flex gap-5 bg-white/4 border border-white/10 rounded-xl px-6 py-5">
                <span className="text-2xl shrink-0">{o.icon}</span>
                <div>
                  <p className="text-white font-semibold mb-1">{o.title}</p>
                  <p className="text-white/50 text-sm leading-relaxed">{o.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 數字盤六維度 ── */}
      <section className="bg-white/3 border-y border-white/8 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-[#c9a84c] text-xs tracking-widest font-medium text-center mb-3">BONUS</p>
            <h2 className="font-serif text-2xl font-bold text-center mb-3">加映｜數字盤怎麼看</h2>
            <p className="text-white/50 text-sm text-center mb-8">你的數字盤有六個維度，六個維度合在一起，才是完整的你。</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dimensions.map((d, i) => (
                <div key={i} className="bg-[#0a0f1e] border border-[#c9a84c]/20 rounded-xl p-4">
                  <div className="w-6 h-6 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center mb-3">
                    <span className="text-[#c9a84c] text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-white text-sm font-semibold leading-tight mb-1">{d.name}</p>
                  <p className="text-white/40 text-xs leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 關於講師 ── */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 rounded-full border-2 border-[#c9a84c]/50 overflow-hidden shrink-0 bg-[#c9a84c]/10 flex items-center justify-center">
            <Sparkles className="text-[#c9a84c]" size={36} />
          </div>
          <div>
            <p className="text-[#c9a84c] text-xs tracking-widest mb-2">關於講師</p>
            <h3 className="font-serif text-xl font-bold mb-1">林炳騰｜JJ</h3>
            <p className="text-white/50 text-sm mb-3">宇宙序能品牌創辦人｜NGH 催眠講師｜NLP 導師｜潛意識教練</p>
            <p className="text-white/60 text-sm leading-relaxed">幫助過數百人從看見自己的命運程式，到真正開始導演自己的人生。</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["台積電", "AWS", "戴爾", "全家便利", "國研院", "伊甸基金會"].map(c => (
                <span key={c} className="text-xs bg-[#c9a84c]/12 text-[#c9a84c] border border-[#c9a84c]/25 px-2 py-0.5 rounded-full">{c}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 報名表 ── */}
      <section id="register" className="max-w-xl mx-auto px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-[#c9a84c] text-xs tracking-widest font-medium text-center mb-2">RESERVE YOUR SEAT</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-2">立即報名</h2>
          <p className="text-white/40 text-sm text-center mb-8">免費入場 · 名額有限 · 報名後以 LINE 傳送入場連結</p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-[#c9a84c]/40 rounded-2xl p-10 text-center">
                <CheckCircle className="text-[#c9a84c] mx-auto mb-4" size={40} />
                <h3 className="font-serif text-xl font-bold mb-2">報名成功！</h3>
                <p className="text-white/60 text-sm leading-relaxed">感謝你的報名，JJ 老師將在講座開始前<br />透過 LINE 傳送直播連結給你。</p>
                {form.email && (
                  <p className="text-[#c9a84c]/80 text-xs mt-3 bg-[#c9a84c]/8 border border-[#c9a84c]/20 rounded-lg px-4 py-2">
                    📧 報名確認信已寄至 {form.email}
                  </p>
                )}
                <p className="text-white/30 text-xs mt-4">若有任何問題，請加 LINE：@jjloveyou520</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="bg-white/4 border border-white/12 rounded-2xl p-8 space-y-5">
                {loadError && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-yellow-300 text-sm text-center">
                    ⚠ 目前沒有開放報名的場次，請稍後再試
                  </div>
                )}
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">姓名 <span className="text-[#c9a84c]">*</span></label>
                  <input type="text" placeholder="你的姓名" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/6 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-[#c9a84c]/60 transition-colors" required />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">手機號碼 <span className="text-[#c9a84c]">*</span></label>
                  <input type="tel" placeholder="09xx-xxx-xxx" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-white/6 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-[#c9a84c]/60 transition-colors" required />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">
                    Email <span className="text-white/30 text-xs font-normal">（選填，填寫後將收到報名確認信）</span>
                  </label>
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-white/6 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-[#c9a84c]/60 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">LINE ID <span className="text-white/30 text-xs">（選填）</span></label>
                  <input type="text" placeholder="你的 LINE ID" value={form.lineId} onChange={e => setForm(f => ({ ...f, lineId: e.target.value }))}
                    className="w-full bg-white/6 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-[#c9a84c]/60 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">你從哪裡得知這場講座？</label>
                  <select value={form.referralSource} onChange={e => setForm(f => ({ ...f, referralSource: e.target.value }))}
                    className="w-full bg-[#0a0f1e] border border-white/15 rounded-lg px-4 py-3 text-white/80 text-sm outline-none focus:border-[#c9a84c]/60 transition-colors">
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
                <button type="submit" disabled={submitting || loadError}
                  className="w-full bg-[#c9a84c] hover:bg-[#d4b45e] disabled:opacity-50 disabled:cursor-not-allowed text-[#0a0f1e] font-bold py-4 rounded-lg text-base transition-colors">
                  {submitting ? "送出中…" : "⚡ 確認報名 · 完全免費"}
                </button>
                <p className="text-white/25 text-xs text-center">報名成功後，JJ 老師將透過 LINE 或簡訊傳送直播連結</p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-[#c9a84c] text-xs tracking-widest font-medium text-center mb-2">FAQ</p>
          <h2 className="font-serif text-2xl font-bold text-center mb-8">常見問題</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white/4 border border-white/10 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-white text-sm font-medium">{item.q}</span>
                  <ChevronDown size={15} className={`text-[#c9a84c] shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
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
        </motion.div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-white/8 bg-white/3 py-14 text-center px-6">
        <p className="text-[#c9a84c] text-sm font-medium mb-3">先來，先看見。先看見，先改變。</p>
        <h3 className="font-serif text-2xl font-bold mb-2">你的數字一直在那裡。</h3>
        <p className="text-white/50 text-base mb-8">只是沒有人教你讀懂它。<br /><span className="text-white font-medium">今晚，我們一起來看。</span></p>
        <a href="#register" onClick={e => { e.preventDefault(); document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }); }}
          className="inline-block bg-[#c9a84c] hover:bg-[#d4b45e] text-[#0a0f1e] font-bold px-10 py-4 rounded-full text-base transition-colors">
          👇 立即報名免費講座
        </a>
        <p className="text-white/25 text-xs mt-4">© 宇宙序能｜林炳騰 JJ</p>
      </section>
    </div>
  );
}
