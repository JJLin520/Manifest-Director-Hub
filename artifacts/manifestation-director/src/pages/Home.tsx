import React from "react";
import { motion } from "framer-motion";
import jungImg from "@assets/image_1775719326096.png";

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.85, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

const Divider = () => (
  <div className="flex items-center justify-center my-4">
    <div className="h-16 w-[1px] bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs tracking-[0.3em] uppercase text-primary/60 font-sans mb-4">{children}</p>
);

const CTAButton = () => (
  <a
    href="https://forms.gle/LEXcQ5wtHkaXbCqL9"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block px-10 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(230,175,50,0.3)] hover:shadow-[0_0_50px_rgba(230,175,50,0.5)]"
  >
    開始你的轉變之旅 →
  </a>
);

export default function Home() {
  return (
    <div className="bg-background text-foreground font-sans min-h-screen selection:bg-primary/30 selection:text-primary">

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      {/* ── PART 1：共鳴 — 你是否也有過這樣的感覺 ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-32 px-6 overflow-hidden z-10">
        <div className="max-w-3xl mx-auto text-center space-y-10 font-serif">
          <FadeIn>
            <SectionLabel>你有沒有這樣的感覺</SectionLabel>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              明明已經很努力了，<br />
              <span className="text-primary">卻總是繞回同一個地方。</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              同樣的感情模式。同樣的錢的焦慮。<br className="hidden md:block" />
              同樣的那個聲音說：「你不行。」
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="p-8 md:p-10 border border-primary/20 bg-card/30 backdrop-blur-sm rounded-2xl relative overflow-hidden text-left">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <p className="text-lg md:text-xl leading-loose text-muted-foreground">
                不是你不夠好。<br />
                <span className="text-foreground font-semibold">是有人從來沒告訴你——你的大腦，有一套你不知道的作業系統正在運行。</span><br /><br />
                而這套系統，決定了你的收入、你的感情、你的自我價值感——
                <span className="text-primary font-semibold">在你完全沒有察覺的情況下。</span>
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.6}>
            <CTAButton />
          </FadeIn>
        </div>
      </section>

      {/* ── PART 2：WHY — 為什麼你一直卡住？科學說明 ── */}
      <section className="py-24 md:py-32 px-6 bg-card/50 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <FadeIn>
            <SectionLabel>WHY — 為什麼你一直卡住</SectionLabel>
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden border-2 border-primary/40 shadow-[0_0_30px_rgba(230,175,50,0.2)]">
                <img
                  src={jungImg}
                  alt="Carl Jung"
                  className="w-full h-full object-cover object-top grayscale opacity-80"
                />
              </div>
              <Divider />
            </div>
            <blockquote className="text-2xl md:text-4xl font-serif leading-relaxed italic text-primary/90">
              「當我們不理解潛意識時，<br className="hidden md:block" />
              我們以為自己活在命運裡；<br />
              當我們掌握潛意識時，<br className="hidden md:block" />
              命運就掌握在我們手中。」
            </blockquote>
            <p className="mt-4 text-muted-foreground tracking-widest uppercase text-sm">— Carl Jung</p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid md:grid-cols-3 gap-6 text-left mt-8">
              {[
                { num: "97%", label: "的行為由潛意識驅動", desc: "你以為是「你」在做決定，其實是舊程式在執行。" },
                { num: "5歲前", label: "核心程式就寫入完成", desc: "來自父母、環境的信念，在你有意識前就已植入。" },
                { num: "終身", label: "影響你的財富、感情、健康", desc: "除非你有意識地進入並改寫它，否則它不會自動更新。" },
              ].map((item, i) => (
                <FadeIn key={item.num} delay={0.1 * i}>
                  <div className="p-6 border border-primary/15 rounded-xl bg-background/60">
                    <div className="text-3xl font-bold text-primary font-serif mb-1">{item.num}</div>
                    <div className="text-sm font-semibold text-foreground mb-3">{item.label}</div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-xl md:text-2xl font-serif font-medium text-primary/90 pt-4">
              「你現在的人生，正是你的潛意識程式的外在顯化。」
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── PART 3：故事 — 我自己走過那段黑暗 ── */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <SectionLabel>創辦人的故事</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-10 text-primary/90">
              「我自己也曾經以為，一切都是命運。」
            </h2>
          </FadeIn>

          <div className="space-y-6 text-lg md:text-xl leading-loose text-muted-foreground relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-[-32px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/0 via-primary/20 to-primary/0" />

            <FadeIn delay={0.1}>
              <p>
                那一年，我創業失敗搞到負債。不是電影裡帥氣的那種破釜沉舟——
                是<span className="text-foreground">深夜盯著帳單、不敢接電話、不知道明天怎麼辦</span>的真實窒息感。
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p>
                我開始覺得，這條路走不出去了。<span className="text-foreground">進入了憂鬱症的狀態。</span>
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="border-l-2 border-primary/40 pl-6 py-2 my-2">
                <p className="text-foreground">
                  就在那個幾乎要放棄的夜晚，我因緣際會，聽到了探索「潛意識」的講座。
                  老實說，我半信半疑。但那個當下的我，已經沒有什麼好失去的了。
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p>
                我報名了課程。那一天，<span className="text-foreground font-medium">某個東西在我內部鬆動了。</span>
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p>
                我開始每天自我催眠，深入 NLP，上了國內外大師的課程，找了教練一對一陪我走，
                深入學習精進——生命開始，不是「好轉」，而是
                <span className="text-primary font-semibold">親證翻轉。</span>
              </p>
            </FadeIn>
            <FadeIn delay={0.35}>
              <p>
                我後來才明白：困住我的，不是負債本身，
                是我腦袋裡那套<span className="text-foreground font-medium">比負債更古老的程式。</span>
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── PART 4：你的潛意識在播什麼？ ── */}
      <section className="py-24 md:py-32 px-6 bg-card/30 relative z-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>你的狀況</SectionLabel>
              <h2 className="text-3xl md:text-5xl font-serif font-bold">「你的潛意識，現在在播什麼？」</h2>
              <p className="mt-4 text-muted-foreground text-lg">讀一下這幾個，看有沒有什麼東西在你胸口動了一下：</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {[
              { title: "金錢", desc: "賺得到，留不住。總覺得錢是辛苦換來的，不敢想財富自由。" },
              { title: "感情", desc: "重複吸引同一種人。或者根本築起高牆，不讓任何人靠近。" },
              { title: "事業", desc: "有夢，但有一個聲音一直說「你憑什麼」。" },
              { title: "家庭", desc: "父母的話還住在你腦袋裡，幾十年了，還在。" },
              { title: "自我", desc: "不敢失敗，所以不敢開始。完美主義是另一種逃避。" },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <div className="p-7 h-full border border-primary/10 bg-background/50 hover:border-primary/35 transition-colors duration-500 rounded-xl">
                  <h3 className="text-lg font-bold text-primary mb-3 font-serif">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center p-8 border-t border-b border-primary/20">
              <p className="text-xl md:text-2xl font-serif text-primary/90">
                「如果有任何一個讓你停下來——那不是你的問題。<br className="hidden md:block" />
                那是一段<span className="font-bold text-primary">等待被改寫的舊程式</span>。」
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PART 5：WHAT — 什麼是顯化導演系統 ── */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-14">
          <FadeIn>
            <div className="text-center">
              <SectionLabel>WHAT — 什麼是顯化導演系統</SectionLabel>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary/90 mb-4">
                「顯化導演系統」
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                這是我走過那段黑暗之後，整合了親身驗證的工具，為你建立的一套<strong className="text-foreground">潛意識重編系統</strong>。
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 border border-primary/15 rounded-2xl bg-card/60 space-y-3">
                <p className="text-xs tracking-widest text-primary/60 uppercase">融合了</p>
                <ul className="space-y-2 text-muted-foreground">
                  {["NLP（40年實證，全球數百萬人使用）", "催眠技術", "教練技術", "心理學", "東方能量智慧"].map(t => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="text-primary text-xs">▸</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 border border-primary/30 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent space-y-4 flex flex-col justify-center">
                <p className="text-xs tracking-widest text-primary/60 uppercase">核心原理</p>
                <p className="text-xl md:text-2xl font-serif font-bold text-foreground leading-snug">
                  潛意識控制<span className="text-primary text-4xl">97%</span>的行為。<br />
                  改變潛意識，<br />才是真正改變人生。
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-card p-8 md:p-12 rounded-2xl border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-primary/60 to-transparent rounded-l-2xl" />
              <p className="text-xl md:text-2xl leading-loose font-serif pl-4">
                這不是正向思考。<br />
                <span className="text-muted-foreground text-lg">正向思考是在舊程式上貼新標籤。</span><br /><br />
                這是直接進入程式碼，找到那一行寫錯的指令，
                <span className="text-primary font-bold">重新寫過。</span>
              </p>
            </div>
          </FadeIn>

          {/* 6 Modules */}
          <FadeIn delay={0.1}>
            <div className="text-center mb-10">
              <p className="text-xs tracking-widest text-primary/60 uppercase mb-2">覆蓋範圍</p>
              <h3 className="text-2xl md:text-3xl font-serif font-bold">六大命運模組，全面重編</h3>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "財富", before: "我命中缺財", after: "我天生招財" },
              { title: "事業", before: "我註定平凡", after: "我註定成功" },
              { title: "關係", before: "我不值得被愛", after: "我值得被深愛" },
              { title: "身心", before: "我體質不好", after: "我天生健康" },
              { title: "情緒", before: "我天生悲觀", after: "我天生樂觀" },
              { title: "靈性", before: "我命苦，改不了", after: "我是自己命運的源頭" },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <div className="p-7 border border-primary/20 rounded-2xl bg-card/50 text-center space-y-5 hover:border-primary/50 transition-colors">
                  <h3 className="text-xl font-serif font-bold text-primary">{item.title}</h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground line-through decoration-primary/30 text-sm">「{item.before}」</p>
                    <div className="text-primary/40 text-xs">↓</div>
                    <p className="font-semibold text-foreground">「{item.after}」</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PART 6：HOW — 八個步驟，這是怎麼做到的 ── */}
      <section className="py-24 md:py-32 px-6 bg-card/30 relative z-10">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>HOW — 這是怎麼做到的</SectionLabel>
              <h2 className="text-3xl md:text-5xl font-serif font-bold">
                八個步驟，<br className="md:hidden" />從被動演員到人生導演
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                不是「試試看」。這是一套有順序、有系統的改寫流程。
              </p>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {[
              { step: "01", title: "覺察掃描", desc: "看見你的程式在跑什麼——大多數人從沒停下來觀察過。" },
              { step: "02", title: "覺醒解碼", desc: "追溯那個信念，是從哪裡來的。源頭找到，力量才真正回來。" },
              { step: "03", title: "劇本重寫", desc: "用時間線療法，釋放那個源頭事件的情緒重量。" },
              { step: "04", title: "角色重塑", desc: "催眠與心錨，在神經層面植入新的自我認知。" },
              { step: "05", title: "場景重構", desc: "改變你對現實的感知方式，現實就會跟著改變。" },
              { step: "06", title: "配樂濾鏡", desc: "隨時觸發巔峰狀態，靈活轉換視角，不再被情緒劫持。" },
              { step: "07", title: "剪輯整合", desc: "讓新程式真正在日常生活裡運作，不只是課堂上的感動。" },
              { step: "08", title: "首映升級", desc: "建立持續創造的自我升級機制，你成為自己人生的導演。" },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.07}>
                <div className="flex gap-6 items-start p-6 md:p-7 rounded-xl border border-primary/10 hover:border-primary/35 bg-background/50 transition-all duration-300 group">
                  <span className="text-2xl font-bold font-serif text-primary/30 group-hover:text-primary/70 transition-colors min-w-[2rem] pt-1">{item.step}</span>
                  <div>
                    <h3 className="text-lg font-bold font-serif text-primary/90 mb-1">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PART 7：學員見證 ── */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <SectionLabel>真實的改變</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary/90">小美的故事</h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="space-y-6 text-lg md:text-xl leading-loose text-muted-foreground">
              <p>
                她來找我的時候，帶著三個信念：
              </p>
              <div className="grid md:grid-cols-3 gap-4 my-6">
                {[
                  "「我不配擁有好的感情」——從父母離異那一年種下的。",
                  "「錢很難賺，要省著花」——家裡的匱乏氛圍，從小吸進去的。",
                  "「我做什麼都不會成功」——學生時期一次次失敗堆出來的。",
                ].map((b, i) => (
                  <div key={i} className="p-5 border border-primary/10 rounded-xl bg-card/40 text-sm text-muted-foreground leading-relaxed">
                    {b}
                  </div>
                ))}
              </div>
              <p className="text-foreground/60 italic text-center">她以為這就是她。</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="my-10 pl-6 border-l-2 border-primary/50 py-4 space-y-3">
              <p className="text-xs tracking-widest text-primary/60 uppercase mb-4">三個月後</p>
              {[
                "她遇到了她說「這次感覺不一樣」的伴侶。",
                "她獲得了超乎預期的加薪。",
                "她說，「我終於不再害怕自己了。」",
              ].map((r, i) => (
                <p key={i} className="text-foreground text-lg flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span> {r}
                </p>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <blockquote className="text-center italic font-serif text-primary/80 text-xl leading-relaxed mt-10 px-6">
              「以前我以為自己命不好，喜歡算命，研究玄學，<br className="hidden md:block" />
              現在才知道，是潛意識程式需要升級。」
            </blockquote>
          </FadeIn>
        </div>
      </section>

      {/* ── PART 8：定價 ── */}
      <section className="py-24 md:py-32 px-6 bg-card/30 relative z-10">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>三個階段</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary/90">你可以選擇從哪裡開始</h2>
            </div>
          </FadeIn>

          <div className="space-y-6">
            {[
              { tier: "一階", label: "覺察", title: "自我催眠・覺察", price: "NT$9,800", desc: "拿回你的劇本。學會自我催眠，開始與你的潛意識對話，修復那些你自己都不知道的傷。" },
              { tier: "二階", label: "覺醒", title: "潛意識溝通・覺醒", price: "NT$16,800", desc: "設計你的場景。穿越時間線，回到源頭，根除舊有的負面編碼。" },
              { tier: "三階", label: "覺悟", title: "催眠師・覺悟", price: "NT$26,800", desc: "後製整合。開發超意識，獲得療癒自己與他人的高階能力。" },
            ].map((item, i) => (
              <FadeIn key={item.tier} delay={i * 0.1}>
                <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between p-8 border border-primary/20 rounded-2xl bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="flex items-center gap-4 lg:w-[30%]">
                    <span className="text-3xl font-serif font-bold text-primary/30">{item.tier}</span>
                    <div>
                      <p className="text-xs tracking-widest text-primary/60 uppercase">{item.label}</p>
                      <h3 className="text-xl font-serif font-bold text-foreground">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed lg:flex-1 text-sm">{item.desc}</p>
                  <div className="text-2xl font-bold text-primary font-sans tracking-tight lg:text-right">
                    {item.price}
                  </div>
                </div>
              </FadeIn>
            ))}

            <FadeIn delay={0.4}>
              <div className="mt-8 p-10 border-2 border-primary/50 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent text-center shadow-[0_0_60px_rgba(230,175,50,0.08)]">
                <p className="text-xs tracking-widest text-primary/60 uppercase mb-3">最超值方案</p>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3">
                  三階段合報 NT$39,800
                </h3>
                <p className="text-muted-foreground">
                  原價 NT$49,400，整合學習，節省 <span className="text-foreground font-semibold">NT$9,600</span>
                </p>
                <div className="mt-8">
                  <CTAButton />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── PART 9：最後的話 + CTA ── */}
      <section className="py-32 md:py-48 px-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 rounded-[100%] blur-[120px] scale-150 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-10">
          <FadeIn>
            <SectionLabel>給你的最後一句話</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="space-y-6 text-xl md:text-2xl leading-loose font-serif text-muted-foreground/90">
              <p>你願意讀到這裡，不是偶然的。</p>
              <p>某個你內在的部分，<span className="text-foreground">已經知道是時候了。</span></p>
              <p className="text-muted-foreground/60 text-lg">
                改變，不需要先準備好，不需要先確認自己「夠格」——<br />
                那個「還沒準備好」的聲音，就是那個等著被改寫的舊程式。
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              「你現在感受到的那個走不出來，<br />
              不是你的本質。<br />
              <span className="text-primary">那是一行程式碼。</span><br />
              而程式碼，是可以改寫的。」
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div className="mt-6">
              <CTAButton />
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
