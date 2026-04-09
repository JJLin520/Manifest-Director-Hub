import React from "react";
import { motion } from "framer-motion";
import jungImg from "@assets/image_1775718771895.png";

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  return (
    <div className="bg-background text-foreground font-sans min-h-screen selection:bg-primary/30 selection:text-primary">
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background z-10" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          <FadeIn>
            <p className="text-xl md:text-2xl text-muted-foreground font-serif tracking-wider mb-6 text-center">
              「你有沒有這樣的感覺——」
            </p>
          </FadeIn>
          <div className="space-y-6 md:space-y-8 font-serif">
            <FadeIn delay={0.2}>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-snug text-center">
                「明明已經很努力了，<br className="hidden md:block" />
                <span className="text-primary/90">卻總是繞回同一個地方。</span>」
              </h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="text-lg md:text-2xl text-muted-foreground/80 leading-relaxed text-center max-w-2xl mx-auto">
                「同樣的感情模式。同樣的錢的焦慮。同樣的那個聲音說：你不行。」
              </p>
            </FadeIn>
            <FadeIn delay={0.6}>
              <div className="mt-12 p-8 md:p-12 border border-primary/20 bg-card/30 backdrop-blur-sm rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <p className="text-lg md:text-xl leading-loose">
                  「不是你不夠好。<br className="md:hidden" />
                  <span className="text-foreground font-medium">是有人從來沒告訴你——你的大腦，有一套你不知道的作業系統正在運行。</span>」
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.8}>
              <div className="text-center mt-10">
                <a
                  href="https://forms.gle/LEXcQ5wtHkaXbCqL9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-10 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(230,175,50,0.3)] hover:shadow-[0_0_50px_rgba(230,175,50,0.5)]"
                >
                  「開始你的轉變之旅」→
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Jung Quote */}
      <section className="py-24 md:py-32 px-6 relative z-10 bg-card/50">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <FadeIn>
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-primary/40 shadow-[0_0_30px_rgba(230,175,50,0.2)]">
                <img
                  src={jungImg}
                  alt="Carl Jung"
                  className="w-full h-full object-cover object-top grayscale opacity-80"
                />
              </div>
              <div className="h-10 w-[1px] bg-primary/30" />
            </div>
            <blockquote className="text-2xl md:text-4xl font-serif leading-relaxed italic text-primary/90">
              「當我們不理解潛意識時，我們以為自己活在命運裡；<br className="hidden md:block" />
              當我們掌握潛意識時，命運就掌握在我們手中。」
            </blockquote>
            <p className="mt-6 text-muted-foreground tracking-widest uppercase text-sm">
              — Carl Jung
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl font-medium tracking-wide">
              「你現在的人生，正是你的潛意識程式的外在顯化。」
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-primary/90">
              「我自己也曾經以為，一切都是命運。」
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="space-y-6 text-lg md:text-xl leading-loose text-muted-foreground">
              <p>
                那一年，我創業後來失敗搞到負債。不是電影裡帥氣的那種破釜沉舟——是深夜盯著帳單、不敢接電話、不知道明天怎麼辦的真實窒息感。
              </p>
              <p>
                我開始覺得，這條路走不出去了，進入了憂鬱症的狀態。
              </p>
              <p>
                就在那個幾乎要放棄的夜晚，我因緣際會，聽到了探索「潛意識」的講座。我報名了課程。那一天，某個東西在我內部鬆動了。
              </p>
              <p>
                我開始每天對自己自我催眠，深入NLP，上了國內外大師的課程，找了教練一對一陪我走。生命開始，不是「好轉」，而是<span className="text-primary/90 font-medium">親證翻轉</span>。
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 md:py-32 px-6 relative z-10 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16 text-center">
              「你的潛意識，現在在播什麼？」
            </h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              { title: "金錢", desc: "賺得到，留不住。總覺得錢是辛苦換來的，不敢想財富自由。" },
              { title: "感情", desc: "重複吸引同一種人。或者根本築起高牆，不讓任何人靠近。" },
              { title: "事業", desc: "有夢，但有一個聲音一直說「你憑什麼」。" },
              { title: "家庭", desc: "父母的話還住在你腦袋裡，幾十年了，還在。" },
              { title: "自我", desc: "不敢失敗，所以不敢開始。完美主義是另一種逃避。" }
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="p-8 h-full border border-primary/10 bg-background/50 hover:border-primary/30 transition-colors duration-500 rounded-xl">
                  <h3 className="text-xl font-bold text-primary mb-4 font-serif">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center p-8 border-t border-b border-primary/20">
              <p className="text-xl md:text-2xl font-serif text-primary/90">
                「如果有任何一個讓你停下來——那不是你的問題。<br className="hidden md:block" />
                那是一段等待被改寫的舊程式。」
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What is System */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 text-center text-primary/90">
              「什麼是顯化導演系統？」
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-center text-muted-foreground leading-relaxed">
              融合了 NLP（40年實證，全球數百萬人使用）、催眠技術、教練技術、心理學，以及東方能量智慧。
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="bg-card p-8 md:p-12 rounded-2xl border border-primary/20 my-12">
              <p className="text-xl md:text-2xl leading-loose font-serif">
                「這不是正向思考。正向思考是在舊程式上貼新標籤。這是直接進入程式碼，找到那一行寫錯的指令，重新寫過。」
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="text-2xl md:text-3xl font-bold text-center text-primary/90 tracking-wide font-serif">
              「潛意識控制97%的行為。改變潛意識，才是真正改變人生。」
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 8 Steps */}
      <section className="py-24 md:py-32 px-6 relative z-10 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16 text-center">
              「八個步驟，從被動演員到人生導演」
            </h2>
          </FadeIn>
          
          <div className="space-y-6">
            {[
              { step: "第一步", title: "覺察掃描", desc: "看見你的程式在跑什麼" },
              { step: "第二步", title: "覺醒解碼", desc: "追溯那個信念，是從哪裡來的" },
              { step: "第三步", title: "劇本重寫", desc: "用時間線療法，釋放那個源頭事件" },
              { step: "第四步", title: "角色重塑", desc: "催眠與心錨，植入新的自我認知" },
              { step: "第五步", title: "場景重構", desc: "改變你對現實的感知方式" },
              { step: "第六步", title: "配樂濾鏡", desc: "隨時觸發巔峰狀態，靈活轉換視角" },
              { step: "第七步", title: "剪輯整合", desc: "讓新程式真正在你的日常生活裡運作" },
              { step: "第八步", title: "首映升級", desc: "建立持續創造的自我升級機制" }
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.1}>
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-6 md:p-8 rounded-xl border border-primary/10 hover:border-primary/40 bg-background/50 transition-all duration-300">
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <span className="text-sm tracking-widest text-primary/70 uppercase">{item.step}</span>
                    <span className="text-xl font-bold font-serif text-primary/90">{item.title}</span>
                  </div>
                  <div className="h-[1px] md:h-8 w-12 md:w-[1px] bg-primary/20 hidden md:block" />
                  <p className="text-lg text-muted-foreground">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Modules */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16 text-center text-primary/90">
              「六大命運模組，全面重編」
            </h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "財富", before: "我命中缺財", after: "我天生招財" },
              { title: "事業", before: "我註定平凡", after: "我註定成功" },
              { title: "關係", before: "我不值得被愛", after: "我值得被深愛" },
              { title: "身心", before: "我體質不好", after: "我天生健康" },
              { title: "情緒", before: "我天生悲觀", after: "我天生樂觀" },
              { title: "靈性", before: "我命苦，改不了", after: "我是自己命運的源頭" }
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="p-8 border border-primary/20 rounded-2xl bg-card/50 text-center space-y-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
                  <h3 className="text-2xl font-serif font-bold text-primary">{item.title}</h3>
                  <div className="space-y-4">
                    <p className="text-muted-foreground line-through decoration-primary/30">「{item.before}」</p>
                    <div className="text-primary/50">↓</div>
                    <p className="text-lg font-medium text-foreground">「{item.after}」</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 md:py-32 px-6 relative z-10 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-4xl text-primary/50 font-serif leading-none">"</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary/90 mt-4">
                「小美的故事」
              </h2>
            </div>
          </FadeIn>
          
          <div className="space-y-8 text-lg md:text-xl leading-loose text-muted-foreground">
            <FadeIn delay={0.2}>
              <p>
                「她來找我的時候，帶著三個信念：我不配擁有好的感情、錢很難賺要省著花、我做什麼都不會成功。她以為這就是她。
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="pl-6 border-l-2 border-primary/40 my-8 py-2">
                <p className="text-foreground">
                  三個月後：她遇到了她說「這次感覺不一樣」的伴侶。她獲得了超乎預期的加薪。她說，『我終於不再害怕自己了。』」
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="text-center italic font-serif text-primary/80 mt-12 text-xl">
                「以前我以為自己命不好，喜歡算命，研究玄學，<br className="hidden md:block" />
                現在才知道，是潛意識程式需要升級。」
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16 text-center text-primary/90">
              「三個階段，你可以選擇從哪裡開始」
            </h2>
          </FadeIn>

          <div className="space-y-8">
            {[
              {
                tier: "一階",
                title: "自我催眠・覺察",
                price: "NT$9,800",
                desc: "拿回你的劇本。學會自我催眠，開始與你的潛意識對話，修復那些你自己都不知道的傷。"
              },
              {
                tier: "二階",
                title: "潛意識溝通・覺醒",
                price: "NT$16,800",
                desc: "設計你的場景。穿越時間線，回到源頭，根除舊有的負面編碼。"
              },
              {
                tier: "三階",
                title: "催眠師・覺悟",
                price: "NT$26,800",
                desc: "後製整合。開發超意識，獲得療癒自己與他人的高階能力。"
              }
            ].map((item, i) => (
              <FadeIn key={item.tier} delay={i * 0.1}>
                <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between p-8 border border-primary/20 rounded-2xl bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="space-y-2 lg:w-1/3">
                    <span className="text-sm font-bold tracking-widest text-primary/70">{item.tier}</span>
                    <h3 className="text-2xl font-serif font-bold text-foreground">{item.title}</h3>
                  </div>
                  <div className="lg:w-1/2">
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="text-2xl font-bold text-primary font-sans tracking-tight">
                    {item.price}
                  </div>
                </div>
              </FadeIn>
            ))}

            <FadeIn delay={0.4}>
              <div className="mt-12 p-8 md:p-12 border-2 border-primary/40 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent text-center shadow-[0_0_50px_rgba(230,175,50,0.1)]">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4">
                  三階段合報 NT$39,800
                </h3>
                <p className="text-muted-foreground">
                  （原價 NT$49,400，整合學習，節省 NT$9,600）
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 md:py-48 px-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 rounded-[100%] blur-[100px] scale-150" />
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-12">
          <FadeIn>
            <div className="space-y-8 text-lg md:text-xl leading-loose font-serif text-muted-foreground/90">
              <p>
                「你願意讀到這裡，不是偶然的。<br />
                某個你內在的部分，已經知道是時候了。」
              </p>
              <p>
                「改變，不需要先準備好，不需要先確認自己『夠格』——那個『還沒準備好』的聲音，就是那個等著被改寫的舊程式。」
              </p>
              <p className="text-2xl md:text-3xl font-bold text-foreground mt-12">
                「你現在感受到的那個『走不出來』，不是你的本質。<br />
                那是一行程式碼。而程式碼，是可以改寫的。」
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <a 
              href="https://forms.gle/LEXcQ5wtHkaXbCqL9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-12 px-12 py-5 bg-primary text-primary-foreground font-bold text-xl rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(230,175,50,0.3)] hover:shadow-[0_0_50px_rgba(230,175,50,0.5)]"
            >
              「開始你的轉變之旅」
            </a>
          </FadeIn>
        </div>
      </section>

      <footer className="py-8 text-center text-muted-foreground/50 text-sm border-t border-primary/10 relative z-10">
        © 2024 宇宙序能教育品牌 ｜ JJ 林炳騰
      </footer>
    </div>
  );
}