import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── 計算函式 ───────────────────────────────────────────────

function reduceToSingle(n: number): number {
  while (n > 9) {
    n = String(n).split("").reduce((sum, d) => sum + parseInt(d), 0);
  }
  return n;
}

function calcLifePath(yyyy: number, mm: number, dd: number) {
  const digits = `${yyyy}${String(mm).padStart(2,"0")}${String(dd).padStart(2,"0")}`
    .split("").reduce((sum, d) => sum + parseInt(d), 0);
  return reduceToSingle(digits);
}

function calcSoulNumber(dd: number) {
  return reduceToSingle(dd);
}

function calcPersonalityNumber(mm: number) {
  return reduceToSingle(mm);
}

function calcDestinyNumber(yyyy: number) {
  return reduceToSingle(String(yyyy).split("").reduce((s, d) => s + parseInt(d), 0));
}

function calcMaturityNumber(lifePath: number, personality: number) {
  return reduceToSingle(lifePath + personality);
}

function calcYearNumber(lifePath: number, year = 2025) {
  const yearDigits = reduceToSingle(String(year).split("").reduce((s, d) => s + parseInt(d), 0));
  return reduceToSingle(lifePath + yearDigits);
}

// ─── 數字資料 ─────────────────────────────────────────────

const NUMBER_DATA: Record<number, {
  title: string; subtitle: string; description: string;
  traits: string[]; mantra: string;
  sanguo: string; oneWord: string; oneWordMeaning: string;
  storyTitle: string; story: string; keyMoment: string; warning: string; quote: string;
}> = {
  1: {
    title: "開創者", subtitle: "The Pioneer",
    description: "你是宇宙的先行者。你天生帶有強烈的使命感，渴望開拓、創新，不甘於隨波逐流。你的靈魂在等待一個舞台，讓你的光芒可以照亮他人。",
    traits: ["領導力強","獨立自主","充滿創意","意志力堅定"],
    mantra: "我是宇宙賦予我的光，我帶著使命而來。",
    sanguo: "劉備", oneWord: "行", oneWordMeaning: "從虛空召喚現實",
    storyTitle: "願景的第一步｜先踏出去，現實跟上來",
    story: "劉備出身賣草鞋，卻說「我是漢室宗親」——這不是謊言，這是「行」的本質：先踏出那一步，現實才會跟上來。三顧茅廬是行，哭得真誠是行，跌倒了再站也是行。",
    keyMoment: "三顧茅廬——放下皇叔身段，三次走進那個山谷，先行動，再等結果。",
    warning: "行的陰影是「衝動代替了方向」。劉備的夷陵之戰，是用天下換了一口氣。",
    quote: "勿以善小而不為，勿以惡小而為之。",
  },
  2: {
    title: "連結者", subtitle: "The Connector",
    description: "你的靈魂是橋樑。你能感知他人的情感，在衝突中帶來和解，在孤獨中帶來溫暖。你的存在本身就是療癒。",
    traits: ["高度同理心","和諧共處","直覺敏銳","溫柔而深邃"],
    mantra: "我的溫柔是力量，我的連結創造奇蹟。",
    sanguo: "貂蟬", oneWord: "情", oneWordMeaning: "以情化剛，共振改變格局",
    storyTitle: "完全在場，映照對方最想看見的自己",
    story: "貂蟬是三國唯一能在董卓與呂布之間生存的人——因為她是「情」的純粹體現：完全在場，映照對方最想看見的自己。她不用武力，用共鳴瓦解了最強的聯盟。",
    keyMoment: "鳳儀亭——站在兩個最強的男人之間，用眼淚代替刀劍，改變了天下格局。",
    warning: "情的陰影是「迷失在別人的感受裡，忘記自己是誰」。",
    quote: "聽見你，也聽見自己。",
  },
  3: {
    title: "表達者", subtitle: "The Creator",
    description: "你的靈魂在說話、創造和表達中找到意義。語言是你的魔法，創意是你的天賦。宇宙透過你傳遞美麗與智慧。",
    traits: ["創意豐沛","擅長溝通","充滿熱情","感染力強"],
    mantra: "我的聲音有力量，我的創造有意義。",
    sanguo: "諸葛亮", oneWord: "智", oneWordMeaning: "語言即命運，三角穿透",
    storyTitle: "看見別人還沒看見的結構，用語言讓它成為現實",
    story: "「隆中對」——諸葛亮用一段話，把未來二十年說清楚了。舌戰群儒、草船借箭、借東風——智慧在他這裡不是知識，是穿透性的洞見。",
    keyMoment: "舌戰群儒——一個人對所有人，用智的力量讓整個東吳閉嘴。",
    warning: "智的陰影是「把智慧當成控制」。諸葛亮死前還在算計，累死自己，也拖垮了蜀漢。",
    quote: "運籌帷幄之中，決勝千里之外。",
  },
  4: {
    title: "建構者", subtitle: "The Builder",
    description: "你是現實世界的工程師。穩定、踏實、持之以恆——你用雙手和智慧在這個世界建造值得信任的事物，也守護那些你愛的人。",
    traits: ["踏實可靠","組織有序","耐心持久","值得信賴"],
    mantra: "我的根基穩固，我的建設永恆。",
    sanguo: "關羽", oneWord: "義", oneWordMeaning: "承諾比天大，義的具現",
    storyTitle: "你和我之間，有一個比利益更真實的東西",
    story: "關羽在曹操那裡得到金銀財寶和赤兔馬，但一聽到劉備消息，立刻過五關斬六將回去。他不是不知道回去很危險，他只是沒辦法不回去——因為那個義，是他的根基，也是他存在的理由。",
    keyMoment: "千里走單騎——義不是選擇，是不得不。",
    warning: "義的陰影是「固執成執念」。關羽大意失荊州，是太相信自己一個人守得住。",
    quote: "義不負心，忠不負君。",
  },
  5: {
    title: "探索者", subtitle: "The Adventurer",
    description: "自由是你的空氣，改變是你的能量。你的靈魂渴望探索、體驗和突破邊界。你是那個敢於跨越的人，讓世界因你的冒險而更寬廣。",
    traits: ["熱愛自由","適應力強","勇於冒險","多才多藝"],
    mantra: "我在流動中成長，我在自由中閃耀。",
    sanguo: "呂布", oneWord: "力", oneWordMeaning: "無邊界之力，最強也最漂泊",
    storyTitle: "突破任何框架的本能衝動",
    story: "呂布是三國第一武將，「力」在他身上不是肌肉，是突破任何框架的本能衝動。他換了三個義父，不是因為薄情，而是沒有任何結構能真正容納他的力量。問題不是力量不夠，而是力量需要找到值得落地的地方。",
    keyMoment: "白門樓被縛——他還在問曹操「你能用我嗎」。力量最後的渴望，是找到真正接住它的容器。",
    warning: "力的陰影是「力量沒有方向，變成破壞」。呂布的流動，最後讓他成了孤島。",
    quote: "天下之大，唯心所安。",
  },
  6: {
    title: "療癒者", subtitle: "The Nurturer",
    description: "你的心是一個家。你天生渴望給予愛、照顧生命、帶來美好。你的靈魂在服務他人時找到最深的滿足，也在美的事物中感到平靜。",
    traits: ["充滿愛心","責任感強","追求美感","天生養育者"],
    mantra: "我的愛是光，我的付出是禮物。",
    sanguo: "孫尚香", oneWord: "利", oneWordMeaning: "看清代價仍選擇愛",
    storyTitle: "在兩個世界的交界處，看清楚每一筆代價，然後還是選擇去愛",
    story: "孫尚香嫁給劉備是政治婚姻——這就是「利」最真實的面貌：在兩個世界的交界處，看清楚每一筆代價，然後還是選擇去愛。她不是不懂政治，她太懂了，但她懂得在利與情之間，找到屬於自己的那條線。",
    keyMoment: "得知劉備死訊，投江而去——清醒看見了所有代價，還是選擇了最深的那個。",
    warning: "利的陰影是「把愛也算成籌碼」。當利的眼光太強，容易忘記有些東西不能換算。",
    quote: "愛不是犧牲，是讓彼此都更完整。",
  },
  7: {
    title: "探真者", subtitle: "The Seeker",
    description: "你是靈魂的哲學家。你渴望穿透表象，探索更深的真理。直覺與智慧在你身上交融，引導你走向那些別人看不見的答案。",
    traits: ["直覺深邃","愛好沉思","洞察力強","追求真相"],
    mantra: "我是智慧的通道，我在靜默中看見一切。",
    sanguo: "司馬懿", oneWord: "察", oneWordMeaning: "深潛等待，看穿所有人",
    storyTitle: "比任何人都看得更深、等得更久",
    story: "司馬懿裝病三十年，看著曹家四代人一個個死去，然後在七十歲發動高平陵之變，一夕改變三國格局。他不是沒有行動，他只是在等那個「唯一值得出手的時刻」。深水不動，但力量都在裡面。",
    keyMoment: "空城計前——諸葛亮的空城，司馬懿不是看不穿，他只是還不想讓諸葛亮死。留著敵人，才能保住自己的價值。",
    warning: "察的陰影是「看透一切卻冷漠旁觀」。看穿所有人的人，容易忘記自己也需要被看見。",
    quote: "知彼知己，百戰不殆。",
  },
  8: {
    title: "掌權者", subtitle: "The Authority",
    description: "你生來就有影響世界的能量。力量、資源、成就——這些是你靈魂的語言。你的使命是在物質世界中創造豐盛，並以此服務更大的目的。",
    traits: ["雄心壯志","商業才能","執行力強","天生領袖"],
    mantra: "我是豐盛的通道，我的力量服務於光。",
    sanguo: "曹操", oneWord: "雄", oneWordMeaning: "宇宙意志，我就是那個因果",
    storyTitle: "承擔宇宙級別的格局，不推諉，不逃避",
    story: "曹操是三國最複雜的人，詩人、政治家、軍事家，他的雄不是蠻橫，是「我看見了全局，我來承擔它」的意志。「寧可我負天下人，不可天下人負我。」——這是雄的極致：承擔格局，不轉移責任。",
    keyMoment: "官渡之戰——以少勝多，靠的不是運氣，是對「勢」的精準判讀和完全投入。",
    warning: "雄的陰影是「格局大到忘記了人」。晚年的曹操，殺了太多不該殺的人。",
    quote: "老驥伏櫪，志在千里。",
  },
  9: {
    title: "渡化者", subtitle: "The Sage",
    description: "你是靈魂最古老的智慧攜帶者。慈悲、包容、視野宏大——你來這裡是為了完成一個週期，並將智慧傳遞下去。你的存在是對世界的禮物。",
    traits: ["博愛精神","視野宏觀","具有魅力","使命感深"],
    mantra: "我攜帶古老的智慧，我以愛渡化世界。",
    sanguo: "趙雲", oneWord: "道", oneWordMeaning: "無我之勇，純粹的守護",
    storyTitle: "超越所有，回到最純粹——只是做，不問為什麼",
    story: "長坂坡，趙雲七進七出曹操八十三萬大軍，只為救一個嬰兒。「道」是9的本質：超越了行、情、智、義、力、利、察、雄，回到最純粹的那個——只是做，不問為什麼。趙雲一生沒有自己的野心，他的力量全用來守護他認為值得守護的東西。",
    keyMoment: "長坂坡七進七出——那不是武力的展示，那是一個靈魂完全燃燒、無我無懼的樣子。",
    warning: "道的陰影是「消失在奉獻裡，忘了自己也是道的一部分」。很少有人問趙雲「你自己想要什麼」。",
    quote: "吾乃常山趙子龍。",
  },
};

// ─── 動畫元件 ──────────────────────────────────────────────

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

// ─── 主頁面 ────────────────────────────────────────────────

export default function NumerologyPage() {
  const [birthday, setBirthday] = useState("");
  const [result, setResult] = useState<null | {
    lifePath: number; soul: number; personality: number;
    destiny: number; maturity: number; yearNum: number;
  }>(null);
  const [error, setError] = useState("");

  const handleCalc = () => {
    setError("");
    const clean = birthday.replace(/[^\d]/g, "");
    if (clean.length < 8) { setError("請輸入完整生日，例如：1992/01/05"); return; }
    const yyyy = parseInt(clean.slice(0, 4));
    const mm = parseInt(clean.slice(4, 6));
    const dd = parseInt(clean.slice(6, 8));
    if (yyyy < 1900 || yyyy > 2020 || mm < 1 || mm > 12 || dd < 1 || dd > 31) {
      setError("生日格式有誤，請重新輸入"); return;
    }
    const lifePath = calcLifePath(yyyy, mm, dd);
    const soul = calcSoulNumber(dd);
    const personality = calcPersonalityNumber(mm);
    const destiny = calcDestinyNumber(yyyy);
    const maturity = calcMaturityNumber(lifePath, personality);
    const yearNum = calcYearNumber(lifePath);
    setResult({ lifePath, soul, personality, destiny, maturity, yearNum });
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen selection:bg-primary/30 selection:text-primary pt-16">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-primary/4 blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-500/4 blur-[160px]" />
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <InputSection
            key="input"
            birthday={birthday}
            setBirthday={setBirthday}
            error={error}
            onCalc={handleCalc}
          />
        ) : (
          <ResultSection
            key="result"
            result={result}
            onReset={() => { setResult(null); setBirthday(""); }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// ─── 輸入區塊 ─────────────────────────────────────────────

function InputSection({ birthday, setBirthday, error, onCalc }: {
  birthday: string; setBirthday: (v: string) => void;
  error: string; onCalc: () => void;
}) {
  return (
    <motion.section
      key="input"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center"
    >
      <FadeIn delay={0}>
        <p className="text-xs tracking-[0.35em] uppercase text-primary/60 mb-6 font-sans">宇宙數字原力學</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
          你的數字
        </h1>
        <p className="font-serif text-3xl md:text-5xl text-primary mb-10">
          一直在 <span className="italic">說話</span>
        </p>
      </FadeIn>

      <FadeIn delay={0.2}>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-2">
          每個人出生那天<br />宇宙就寫下了一組密碼
        </p>
        <p className="text-muted-foreground/70 text-sm italic mb-12">你，讀懂了嗎？</p>
      </FadeIn>

      <FadeIn delay={0.35} className="w-full max-w-sm">
        <div className="bg-white/5 border border-primary/20 rounded-2xl p-6 backdrop-blur-sm space-y-4">
          <p className="text-xs text-muted-foreground tracking-wide">算出你的主命數</p>
          <p className="text-xs text-muted-foreground/70">將生日所有數字相加，直到剩下一位數</p>

          <input
            type="text"
            placeholder="輸入生日，如：1992/01/05"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onCalc()}
            className="w-full bg-white/8 border border-primary/30 text-foreground text-center text-lg tracking-widest rounded-xl px-4 py-4 placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition"
          />

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button
            onClick={onCalc}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_25px_rgba(230,175,50,0.25)]"
          >
            計算我的主命數 →
          </button>
        </div>
      </FadeIn>

      <FadeIn delay={0.5}>
        <div className="mt-12 border border-primary/10 rounded-xl px-5 py-4 max-w-xs backdrop-blur-sm">
          <p className="text-xs text-muted-foreground/50 mb-1">創始人</p>
          <p className="font-serif text-sm text-foreground font-semibold">JJ 林炳騰</p>
          <p className="text-xs text-muted-foreground/60 mt-0.5">NGH 催眠療癒導師 × 數字原力學創始人</p>
        </div>
      </FadeIn>
    </motion.section>
  );
}

// ─── 結果區塊 ─────────────────────────────────────────────

function ResultSection({ result, onReset }: {
  result: { lifePath: number; soul: number; personality: number; destiny: number; maturity: number; yearNum: number };
  onReset: () => void;
}) {
  const data = NUMBER_DATA[result.lifePath];
  if (!data) return null;

  const secondaryNumbers = [
    { label: "靈魂數", value: result.soul, desc: "你內心最深的渴望" },
    { label: "人格數", value: result.personality, desc: "別人眼中的你" },
    { label: "貴人數", value: result.destiny, desc: "誰是你的關鍵頻率" },
    { label: "成熟數", value: result.maturity, desc: "下半場的人生劇本" },
    { label: "流年數", value: result.yearNum, desc: "2025 你的能量主題" },
  ];

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 max-w-2xl mx-auto px-6 py-24 pb-32"
    >
      {/* Main number hero */}
      <FadeIn>
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.35em] uppercase text-primary/60 mb-4 font-sans">你的主命數</p>
          <div className="relative inline-flex items-center justify-center w-28 h-28 mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
            <div className="relative w-28 h-28 rounded-full border-2 border-primary/60 flex items-center justify-center bg-primary/8">
              <span className="font-serif text-5xl font-bold text-primary">{result.lifePath}</span>
            </div>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">{data.title}</h2>
          <p className="text-primary/70 text-base tracking-widest">{data.subtitle}</p>
        </div>
      </FadeIn>

      {/* Description */}
      <FadeIn delay={0.1}>
        <div className="bg-white/4 border border-primary/15 rounded-2xl p-6 mb-6 backdrop-blur-sm">
          <p className="text-foreground/90 text-base leading-relaxed font-serif">{data.description}</p>
        </div>
      </FadeIn>

      {/* Traits */}
      <FadeIn delay={0.15}>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {data.traits.map(t => (
            <span key={t} className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs rounded-full font-medium">
              {t}
            </span>
          ))}
        </div>
      </FadeIn>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-8" />

      {/* Three Kingdoms */}
      <FadeIn delay={0.2}>
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-primary/50 text-center mb-5 font-sans">三國能量引言</p>

          <div className="bg-white/4 border border-primary/15 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/15 border border-primary/25 flex flex-col items-center justify-center shrink-0">
                <span className="font-serif text-2xl font-bold text-primary">{data.oneWord}</span>
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-foreground">{data.sanguo}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{data.oneWordMeaning}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-primary/60 mb-2 font-sans">{data.storyTitle}</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{data.story}</p>
            </div>

            <div className="border-l-2 border-primary/30 pl-4">
              <p className="text-xs text-primary/60 mb-1 font-sans">關鍵時刻</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{data.keyMoment}</p>
            </div>

            <div className="bg-orange-500/8 border border-orange-400/20 rounded-xl p-4">
              <p className="text-xs text-orange-400/70 mb-1 font-sans">能量警示</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{data.warning}</p>
            </div>

            <div className="text-center pt-2">
              <p className="font-serif text-sm text-primary/80 italic">「{data.quote}」</p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Mantra */}
      <FadeIn delay={0.25}>
        <div className="text-center mb-8 py-6 border-y border-primary/15">
          <p className="text-xs tracking-[0.3em] uppercase text-primary/50 mb-3 font-sans">核心咒語</p>
          <p className="font-serif text-lg text-foreground/90 leading-relaxed">{data.mantra}</p>
        </div>
      </FadeIn>

      {/* Suspense — 但這只是開始 */}
      <FadeIn delay={0.3}>
        <div className="mb-8 py-8 border-t border-primary/15">
          <p className="text-xs tracking-[0.3em] uppercase text-primary/60 font-sans mb-4">但這只是開始</p>
          <h3 className="font-serif text-3xl font-bold leading-tight mb-4 text-foreground">
            主命數只是你的<br />
            <span className="text-primary">第一層。</span>
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            你還有五個維度，<br />等著被看見——
          </p>
          <div className="space-y-0 divide-y divide-primary/10 border-t border-primary/10">
            {[
              { num: "①", label: "主命數", desc: "你的天命核心" },
              { num: "②", label: "靈魂數", desc: "你內在真正渴望的" },
              { num: "③", label: "人格數", desc: "你呈現給世界的樣子" },
              { num: "④", label: "貴人數", desc: "你的貴人頻率在哪裡" },
              { num: "⑤", label: "成熟數", desc: "你人生後半段的方向" },
              { num: "⑥", label: "流年數", desc: "你現在正在走的能量" },
            ].map(({ num, label, desc }) => (
              <div key={label} className="flex items-center gap-4 py-3">
                <span className="text-primary/70 text-base w-6 shrink-0">{num}</span>
                <span className="font-bold text-foreground text-sm w-16 shrink-0">{label}</span>
                <span className="text-muted-foreground/70 text-sm">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* CTA */}
      <FadeIn delay={0.35}>
        <div className="space-y-3 text-center">
          <a
            href="https://lin.ee/Nq1MhuY"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-[#06C755] text-white font-bold rounded-xl hover:bg-[#05a847] transition-all text-sm shadow-[0_0_25px_rgba(6,199,85,0.2)]"
          >
            加入 LINE，領取完整數字解讀 →
          </a>

          <button
            onClick={onReset}
            className="block w-full py-3 border border-primary/20 text-muted-foreground rounded-xl hover:border-primary/40 hover:text-foreground transition-all text-sm"
          >
            重新計算
          </button>
        </div>
      </FadeIn>
    </motion.div>
  );
}
