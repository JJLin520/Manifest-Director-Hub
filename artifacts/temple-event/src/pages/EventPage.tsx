import React, { useState } from "react";

const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || "";

type FormData = {
  name: string;
  phone: string;
  lineId: string;
  attendees: string;
  hasLantern: string;
  referralSource: string[];
};

const initialForm: FormData = {
  name: "",
  phone: "",
  lineId: "",
  attendees: "1",
  hasLantern: "",
  referralSource: [],
};

const REFERRAL_OPTIONS = [
  "雲陽寺官方臉書 / IG",
  "Line 群組轉傳",
  "親友介紹",
  "寺院現場海報",
  "其他",
];

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block font-semibold text-sm text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

const inputClass = "w-full px-4 py-3 border border-border bg-white rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

export default function EventPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleCheckbox = (value: string) => {
    setForm(f => ({
      ...f,
      referralSource: f.referralSource.includes(value)
        ? f.referralSource.filter(v => v !== value)
        : [...f.referralSource, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("請填寫報名者姓名"); return; }
    if (!form.phone.trim()) { setError("請填寫聯絡電話"); return; }
    if (!form.hasLantern) { setError("請選擇是否已點「雲陽祈願心燈」"); return; }

    setSubmitting(true);

    try {
      const { referralSource, ...rest } = form;
      const payload = {
        ...rest,
        referralSource: referralSource.join("、"),
        eventName: "新店雲陽寺｜五月點燈感恩茶禪會",
      };

      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "提交失敗");
      }

      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message || "提交時發生錯誤，請稍後再試，或直接聯繫主辦方。");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background">
        <div className="max-w-lg w-full text-center space-y-8 py-20">
          <div className="text-6xl">🪷</div>
          <h2 className="text-3xl font-serif font-bold text-primary">感謝您的報名！</h2>
          <div className="text-muted-foreground leading-loose space-y-3">
            <p>我們已收到您的報名資訊。</p>
            <p>期待在 <strong className="text-foreground">5/3 (日) 下午 2 點</strong>與您在雲陽寺相聚，<br />共度平靜溫馨的午後時光。</p>
            <p className="text-sm">如有任何問題，歡迎隨時與我們聯繫。</p>
          </div>
          <div className="pt-6 border-t border-border space-y-4">
            <p className="text-sm text-muted-foreground">新店雲陽寺｜新北市新店區銀河路23號</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
            >
              <span className="text-base">✦</span>
              回到宇宙序能
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* Hero */}
      <div className="bg-gradient-to-b from-[hsl(150,30%,22%)] to-[hsl(150,25%,30%)] text-white py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="text-4xl mb-2">🪷</div>
          <p className="text-sm tracking-[0.3em] text-white/70 uppercase">新店雲陽寺 ｜ 2025 感恩季</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
            五月感恩<br />點燈感恩茶禪會
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            將「點燈」轉化為「送給家人的福報」
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/90 pt-2">
            <span>📅 5 / 3（日）14:00 – 16:00</span>
            <span className="hidden sm:block opacity-40">｜</span>
            <span>📍 新北市新店區銀河路23號</span>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto space-y-6 text-lg leading-loose text-muted-foreground">
          <p>
            小時候，<span className="text-foreground">母親總是在佛前為我們祈求平安</span>；長大後，換我們為她點亮一盞安定的心燈。
          </p>
          <p>
            今年五月，適逢溫馨的母親節前夕，<strong className="text-foreground">新店雲陽寺</strong>誠摯邀請您與家人，一同參與「點燈感恩茶禪會」。
          </p>
          <p>
            讓我們暫時放下生活的喧囂，在茶香與禪意中沉澱心靈。這不僅僅是一場茶會，我們期盼讓傳統的「點燈」，成為一份最深切的禮物——透過誠心祈願，為摯愛的母親與家人點亮一盞平安順遂的心燈。
          </p>
          <p className="font-serif font-semibold text-foreground text-xl">
            邀請您，與我們一同品一杯好茶，結一份善緣。
          </p>
        </div>
      </section>

      {/* 孝親奉茶活動 */}
      <section className="py-16 px-6 bg-[hsl(150,20%,97%)] border-y border-[hsl(150,20%,88%)]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase">特色活動</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              🍵 孝親奉茶
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              一杯茶，獻給您最想感謝的那個人。
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[hsl(150,20%,85%)] overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-[hsl(150,30%,22%)] to-[hsl(150,25%,32%)] px-8 py-5 text-white">
              <h3 className="font-serif text-lg font-bold">孝親奉茶儀式</h3>
              <p className="text-white/70 text-sm mt-1">Mother's Day 限定 · 現場進行</p>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-muted-foreground leading-loose">
                在茶禪會中，我們特別安排一段寧靜而真摯的時光——<strong className="text-foreground">「孝親奉茶」</strong>。邀請您親手為在場的父母或長輩，沏上一盞香茶，躬身奉上，用這個最簡單卻最有力量的動作，道一聲遲來或從未說出口的感謝。
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: "🌿", title: "選茗備茶", desc: "由師父引導，挑選適合長輩的茶葉，靜心備茶。" },
                  { icon: "🫖", title: "親手沏泡", desc: "學習簡單的茶道手法，以清淨之心沏好每一杯。" },
                  { icon: "🙏", title: "躬身奉上", desc: "雙手奉茶，一鞠躬，讓愛與感恩在這一刻流動。" },
                ].map(item => (
                  <div key={item.title} className="text-center space-y-2 p-4 rounded-xl bg-[hsl(150,20%,97%)]">
                    <div className="text-3xl">{item.icon}</div>
                    <p className="font-semibold text-sm text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="border-l-4 border-primary/30 pl-4 py-1">
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  「父母在，人生尚有來處。」茶未涼時，讓我們把握這份相聚的溫度。
                </p>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                ✦ 歡迎攜帶父母、長輩共同出席，感受這份傳統禮儀的溫柔力量。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-12 px-6 bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-border rounded-2xl p-6 space-y-3">
              <p className="text-xs tracking-widest text-primary/70 uppercase">時間與地點</p>
              <div className="space-y-2 text-sm text-foreground">
                <p>📅 2025 年 5 月 3 日（日）</p>
                <p>🕑 下午 2:00 – 4:00</p>
                <p>📍 新北市新店區銀河路23號</p>
              </div>
            </div>
            <div className="bg-white border border-border rounded-2xl p-6 space-y-3">
              <p className="text-xs tracking-widest text-primary/70 uppercase">費用說明</p>
              <div className="space-y-2 text-sm text-foreground">
                <p className="text-2xl font-serif font-bold text-primary">隨喜</p>
                <p className="text-xs text-muted-foreground">量力而為，以誠心赴會即可。</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            🌸 茶席名額有限，敬請提早報名。
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <p className="text-xs tracking-widest text-primary/70 uppercase">線上報名</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              🪷 新店雲陽寺｜五月點燈感恩茶禪會
            </h2>
            <p className="text-muted-foreground text-sm">
              一盞心燈，一份福報。讓我們在茶香與禪意中，為摯愛的家人祈福。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* 1. 姓名 */}
            <Field label="報名者姓名" required hint="請填寫您的中文全名。">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="例：王小明"
                className={inputClass}
              />
            </Field>

            {/* 2. 電話 */}
            <Field label="聯絡電話" required hint="請留下您的手機號碼，以便發送行前通知。">
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="例：0912-345-678"
                className={inputClass}
              />
            </Field>

            {/* 3. Line ID */}
            <Field label="您的 Line ID" hint="方便後續活動聯繫與照片分享（選填）。">
              <input
                type="text"
                name="lineId"
                value={form.lineId}
                onChange={handleChange}
                placeholder="例：@example"
                className={inputClass}
              />
            </Field>

            {/* 4. 人數 */}
            <Field label="參加人數" required>
              <select
                name="attendees"
                value={form.attendees}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="1">1 人</option>
                <option value="2">2 人</option>
                <option value="3">3 人</option>
                <option value="4">4 人</option>
                <option value="5">5 人以上（請於備註說明）</option>
              </select>
            </Field>

            {/* 5. 是否點燈 */}
            <Field label="請問您目前是否有點「雲陽祈願心燈」？" required hint="此題協助我們了解您的參與狀況。">
              <div className="space-y-3">
                {[
                  { value: "yes", label: "是" },
                  { value: "no", label: "否" },
                  { value: "onsite_lantern", label: "預計現場點燈" },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="hasLantern"
                      value={opt.value}
                      checked={form.hasLantern === opt.value}
                      onChange={handleChange}
                      className="w-4 h-4 accent-[hsl(150,30%,30%)]"
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
                  </label>
                ))}
              </div>
            </Field>

            {/* 8. 來源 */}
            <Field label="您是透過什麼管道得知此活動？" hint="選填，可複選。">
              <div className="space-y-3">
                {REFERRAL_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.referralSource.includes(opt)}
                      onChange={() => handleCheckbox(opt)}
                      className="w-4 h-4 rounded accent-[hsl(150,30%,30%)]"
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </Field>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-8 bg-[hsl(150,30%,28%)] text-white font-bold text-lg rounded-xl hover:bg-[hsl(150,30%,23%)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {submitting ? "正在提交⋯⋯" : "🪷 送出報名"}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              提交即表示您同意主辦方使用您填寫的資訊進行活動聯繫。
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-muted-foreground bg-background border-t border-border space-y-1">
        <p>新店雲陽寺</p>
        <p>新北市新店區銀河路23號</p>
        <p>#點燈感恩茶禪會 #母親節 #感恩季 #祈福點燈</p>
      </footer>
    </div>
  );
}
