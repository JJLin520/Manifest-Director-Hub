import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiFetch, SocialAccount, SocialPost,
  SOCIAL_PLATFORM_LABELS, SOCIAL_STATUS_LABELS, SOCIAL_STATUS_COLORS,
} from "@/lib/api";
import {
  Share2, Facebook, Instagram, AtSign, Plus, Trash2, Send,
  Calendar, Clock, CheckCircle, AlertCircle, FileText, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";

const TABS = ["帳號綁定", "排程日曆", "新增貼文", "貼文記錄"] as const;
type Tab = typeof TABS[number];

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  facebook: <Facebook size={16} />,
  instagram: <Instagram size={16} />,
  threads: <AtSign size={16} />,
};

const PLATFORM_COLORS: Record<string, string> = {
  facebook: "bg-blue-600",
  instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
  threads: "bg-slate-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${SOCIAL_STATUS_COLORS[status] || ""}`}>
      {SOCIAL_STATUS_LABELS[status] || status}
    </span>
  );
}

function parsePlatforms(p: string): string[] {
  try { return JSON.parse(p); } catch { return []; }
}

// ── Account Binding Tab ────────────────────────────────────────────────────

function AccountBinding() {
  const qc = useQueryClient();
  const { data: accounts = [], isLoading } = useQuery<SocialAccount[]>({
    queryKey: ["social-accounts"],
    queryFn: () => apiFetch("/admin/social/accounts"),
  });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ platform: "facebook", accountName: "", accountId: "", accessToken: "" });
  const [formError, setFormError] = useState("");

  const addMutation = useMutation({
    mutationFn: (data: typeof form) => apiFetch("/admin/social/accounts", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["social-accounts"] }); setShowForm(false); setForm({ platform: "facebook", accountName: "", accountId: "", accessToken: "" }); },
    onError: (e: Error) => setFormError(e.message),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      apiFetch(`/admin/social/accounts/${id}`, { method: "PATCH", body: JSON.stringify({ isActive }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["social-accounts"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/admin/social/accounts/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["social-accounts"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">社群帳號管理</h3>
          <p className="text-xs text-muted-foreground mt-0.5">連接你的 Facebook、Instagram、Threads 帳號以啟用自動發文</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={15} /> 新增帳號
        </button>
      </div>

      {/* Platform connection guide */}
      <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-5 space-y-3">
        <p className="text-amber-300 text-sm font-medium flex items-center gap-2"><AlertCircle size={14} /> 如何取得 Access Token？</p>
        <ol className="text-amber-200/70 text-xs space-y-1.5 list-decimal list-inside leading-relaxed">
          <li>前往 <span className="text-amber-300 font-medium">developers.facebook.com</span>，建立或選擇你的 App</li>
          <li>在「工具」→「Graph API 測試工具」，選擇你的粉絲專頁，產生 Page Access Token</li>
          <li>複製 Page ID（在粉絲專頁「關於」頁面可以找到）和 Access Token，貼到下方</li>
          <li>如需長效 Token（60天），請使用 FB Graph API 的 token exchange 功能</li>
          <li>Threads 帳號請前往 <span className="text-amber-300 font-medium">developers.facebook.com</span> → Threads API 取得授權</li>
        </ol>
      </div>

      {/* Existing accounts */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 size={18} className="animate-spin mr-2" /> 載入中…</div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
          <Share2 size={28} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">尚未連接任何社群帳號</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {accounts.map(acc => (
            <div key={acc.id} className="flex items-center gap-4 bg-card border border-card-border rounded-xl p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${PLATFORM_COLORS[acc.platform] || "bg-slate-600"}`}>
                {PLATFORM_ICONS[acc.platform]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{acc.accountName}</p>
                <p className="text-xs text-muted-foreground">{SOCIAL_PLATFORM_LABELS[acc.platform]} · ID: {acc.accountId}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleMutation.mutate({ id: acc.id, isActive: !acc.isActive })}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${acc.isActive ? "bg-emerald-900/40 text-emerald-300 border-emerald-700/40" : "bg-muted text-muted-foreground border-border"}`}>
                  {acc.isActive ? "啟用中" : "已停用"}
                </button>
                <button onClick={() => deleteMutation.mutate(acc.id)} className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add account form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-md space-y-4">
            <h4 className="font-semibold text-foreground">新增社群帳號</h4>
            {formError && <p className="text-red-400 text-xs bg-red-900/20 border border-red-700/30 rounded-lg px-3 py-2">{formError}</p>}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">平台</label>
                <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="facebook">Facebook 粉絲專頁</option>
                  <option value="instagram">Instagram 商業帳號</option>
                  <option value="threads">Threads 帳號</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">帳號顯示名稱</label>
                <input type="text" value={form.accountName} onChange={e => setForm(f => ({ ...f, accountName: e.target.value }))}
                  placeholder="例：宇宙序能官方粉專" className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {form.platform === "facebook" ? "粉絲專頁 Page ID" : form.platform === "instagram" ? "IG 用戶 ID" : "Threads 用戶 ID"}
                </label>
                <input type="text" value={form.accountId} onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))}
                  placeholder="例：123456789012345" className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Access Token</label>
                <textarea rows={3} value={form.accessToken} onChange={e => setForm(f => ({ ...f, accessToken: e.target.value }))}
                  placeholder="貼上從 Meta Developer Console 取得的 Access Token…" className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowForm(false); setFormError(""); }} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">取消</button>
              <button onClick={() => { setFormError(""); if (!form.accountName || !form.accountId || !form.accessToken) { setFormError("請填寫所有欄位"); return; } addMutation.mutate(form); }}
                disabled={addMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-60">
                {addMutation.isPending && <Loader2 size={13} className="animate-spin" />} 儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Schedule Calendar Tab ─────────────────────────────────────────────────

function ScheduleCalendar({ posts }: { posts: SocialPost[] }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const postsByDate = useMemo(() => {
    const map: Record<string, SocialPost[]> = {};
    for (const post of posts) {
      const dateStr = post.scheduledAt
        ? new Date(post.scheduledAt).toISOString().slice(0, 10)
        : post.publishedAt
          ? new Date(post.publishedAt).toISOString().slice(0, 10)
          : null;
      if (!dateStr) continue;
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(post);
    }
    return map;
  }, [posts]);

  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  const dayNames = ["日", "一", "二", "三", "四", "五", "六"];

  const today = new Date().toISOString().slice(0, 10);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{year} 年 {monthNames[month]}</h3>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">今天</button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 bg-muted/40 border-b border-border">
          {dayNames.map(d => (
            <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const dateStr = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
            const dayPosts = dateStr ? (postsByDate[dateStr] || []) : [];
            const isToday = dateStr === today;
            return (
              <div key={i} className={`min-h-[80px] p-2 border-b border-r border-border/50 ${!day ? "bg-muted/10" : ""} ${isToday ? "bg-primary/5" : ""}`}>
                {day && (
                  <>
                    <span className={`text-xs font-medium ${isToday ? "w-5 h-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                      {day}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {dayPosts.slice(0, 2).map(p => (
                        <div key={p.id} className={`text-[10px] px-1.5 py-0.5 rounded truncate ${p.status === "published" ? "bg-emerald-900/40 text-emerald-300" : p.status === "scheduled" ? "bg-blue-900/40 text-blue-300" : "bg-slate-700/40 text-slate-300"}`}>
                          {p.content.slice(0, 20)}…
                        </div>
                      ))}
                      {dayPosts.length > 2 && <p className="text-[10px] text-muted-foreground px-1">+{dayPosts.length - 2} 則</p>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-900/60 border border-blue-700/40" /> 排程中</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-900/60 border border-emerald-700/40" /> 已發布</span>
      </div>
    </div>
  );
}

// ── Compose Post Tab ────────────────────────────────────────────────────────

function ComposePost({ accounts }: { accounts: SocialAccount[] }) {
  const qc = useQueryClient();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleMode, setScheduleMode] = useState<"now" | "later">("later");
  const [scheduledAt, setScheduledAt] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activePlatforms = accounts.filter(a => a.isActive).map(a => a.platform);
  const uniquePlatforms = [...new Set(activePlatforms)];

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiFetch("/admin/social/posts", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social-posts"] });
      setSuccess(scheduleMode === "now" ? "草稿已儲存！" : "排程已設定！");
      setContent(""); setImageUrl(""); setSelectedPlatforms([]); setScheduledAt("");
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: (e: Error) => setError(e.message),
  });

  const publishMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const post = await apiFetch<SocialPost>("/admin/social/posts", { method: "POST", body: JSON.stringify(data) });
      return apiFetch(`/admin/social/posts/${post.id}/publish`, { method: "POST", body: JSON.stringify({}) });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social-posts"] });
      setSuccess("貼文已立即發送！"); setContent(""); setImageUrl(""); setSelectedPlatforms([]); setScheduledAt("");
      setTimeout(() => setSuccess(""), 4000);
    },
    onError: (e: Error) => setError(e.message),
  });

  const handleSubmit = () => {
    setError("");
    if (!content.trim()) { setError("請輸入貼文內容"); return; }
    if (selectedPlatforms.length === 0) { setError("請選擇至少一個發布平台"); return; }
    if (scheduleMode === "later" && !scheduledAt) { setError("請選擇排程時間"); return; }

    const payload = {
      content,
      platforms: selectedPlatforms,
      imageUrl: imageUrl || undefined,
      scheduledAt: scheduleMode === "later" ? scheduledAt : undefined,
    };

    if (scheduleMode === "now") {
      publishMutation.mutate(payload);
    } else {
      saveMutation.mutate(payload);
    }
  };

  const charCount = content.length;
  const charLimit = 2200;

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h3 className="font-semibold text-foreground mb-1">建立新貼文</h3>
        <p className="text-xs text-muted-foreground">編寫並排程你的社群貼文</p>
      </div>

      {/* Platform selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">發布平台 *</label>
        {uniquePlatforms.length === 0 ? (
          <p className="text-xs text-amber-400/80 flex items-center gap-1.5"><AlertCircle size={12} /> 請先在「帳號綁定」中連接社群帳號</p>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {uniquePlatforms.map(p => (
              <button key={p} onClick={() => togglePlatform(p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${selectedPlatforms.includes(p) ? "border-primary/60 bg-primary/15 text-primary" : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"}`}>
                {PLATFORM_ICONS[p]} {SOCIAL_PLATFORM_LABELS[p]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">貼文內容 *</label>
          <span className={`text-xs ${charCount > charLimit * 0.9 ? "text-amber-400" : "text-muted-foreground"}`}>{charCount} / {charLimit}</span>
        </div>
        <textarea
          rows={6}
          value={content}
          onChange={e => setContent(e.target.value.slice(0, charLimit))}
          placeholder="輸入你的貼文內容…&#10;&#10;💡 小提示：加上 emoji、話題標籤（#），以及清楚的 CTA 可提升互動率！"
          className="w-full px-4 py-3 text-sm bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed"
        />
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">圖片網址（選填，Instagram 必填）</label>
        <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2.5 text-sm bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      {/* Schedule mode */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">發布時間</label>
        <div className="flex gap-2">
          <button onClick={() => setScheduleMode("now")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border transition-all ${scheduleMode === "now" ? "border-primary/60 bg-primary/15 text-primary" : "border-border text-muted-foreground"}`}>
            <Send size={14} /> 立即發送
          </button>
          <button onClick={() => setScheduleMode("later")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border transition-all ${scheduleMode === "later" ? "border-primary/60 bg-primary/15 text-primary" : "border-border text-muted-foreground"}`}>
            <Clock size={14} /> 排程發送
          </button>
        </div>
        {scheduleMode === "later" && (
          <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-4 py-2.5 text-sm bg-input border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]" />
        )}
      </div>

      {error && <p className="text-red-400 text-xs bg-red-900/20 border border-red-700/30 rounded-lg px-3 py-2">{error}</p>}
      {success && (
        <p className="text-emerald-300 text-xs bg-emerald-900/20 border border-emerald-700/30 rounded-lg px-3 py-2 flex items-center gap-2">
          <CheckCircle size={12} /> {success}
        </p>
      )}

      <button onClick={handleSubmit} disabled={saveMutation.isPending || publishMutation.isPending}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-60 hover:bg-primary/90 transition-colors">
        {(saveMutation.isPending || publishMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
        {scheduleMode === "now" ? "立即發送至所選平台" : "設定排程"}
      </button>
    </div>
  );
}

// ── Post History Tab ────────────────────────────────────────────────────────

function PostHistory({ posts, isLoading }: { posts: SocialPost[]; isLoading: boolean }) {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");

  const publishMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/admin/social/posts/${id}/publish`, { method: "POST", body: JSON.stringify({}) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["social-posts"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/admin/social/posts/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["social-posts"] }),
  });

  const filtered = filter === "all" ? posts : posts.filter(p => p.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "draft", "scheduled", "published", "failed"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filter === s ? "bg-primary/15 text-primary border-primary/50" : "text-muted-foreground border-border hover:text-foreground"}`}>
            {s === "all" ? "全部" : SOCIAL_STATUS_LABELS[s]}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} 筆</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 size={18} className="animate-spin mr-2" /> 載入中…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
          <FileText size={28} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">尚無貼文記錄</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(post => {
            const platforms = parsePlatforms(post.platforms);
            return (
              <div key={post.id} className="bg-card border border-card-border rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <StatusBadge status={post.status} />
                      {platforms.map(p => (
                        <span key={p} className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full text-white ${PLATFORM_COLORS[p] || "bg-slate-600"}`}>
                          {PLATFORM_ICONS[p]} {SOCIAL_PLATFORM_LABELS[p]}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap line-clamp-3">{post.content}</p>
                    {post.imageUrl && <p className="text-xs text-muted-foreground mt-1 truncate">🖼 {post.imageUrl}</p>}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {(post.status === "draft" || post.status === "failed") && (
                      <button onClick={() => publishMutation.mutate(post.id)} disabled={publishMutation.isPending}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors" title="立即發送">
                        <Send size={14} />
                      </button>
                    )}
                    <button onClick={() => { if (confirm("確定要刪除此貼文？")) deleteMutation.mutate(post.id); }}
                      className="p-1.5 text-muted-foreground hover:text-red-400 rounded-md transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                  {post.scheduledAt && <span className="flex items-center gap-1"><Clock size={10} /> 排程：{new Date(post.scheduledAt).toLocaleString("zh-TW")}</span>}
                  {post.publishedAt && <span className="flex items-center gap-1"><CheckCircle size={10} className="text-emerald-400" /> 發布：{new Date(post.publishedAt).toLocaleString("zh-TW")}</span>}
                  <span>建立：{new Date(post.createdAt).toLocaleDateString("zh-TW")}</span>
                </div>
                {post.errorMessage && (
                  <div className="text-xs text-red-400 bg-red-900/20 border border-red-700/30 rounded-lg px-3 py-2">
                    <AlertCircle size={11} className="inline mr-1" />{post.errorMessage}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function SocialMedia() {
  const [activeTab, setActiveTab] = useState<Tab>("帳號綁定");

  const { data: accounts = [] } = useQuery<SocialAccount[]>({
    queryKey: ["social-accounts"],
    queryFn: () => apiFetch("/admin/social/accounts"),
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<SocialPost[]>({
    queryKey: ["social-posts"],
    queryFn: () => apiFetch("/admin/social/posts"),
  });

  const scheduledCount = posts.filter(p => p.status === "scheduled").length;
  const publishedCount = posts.filter(p => p.status === "published").length;
  const connectedCount = accounts.filter(a => a.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary">社群管理</h2>
          <p className="text-muted-foreground text-sm mt-1">管理 Facebook、Instagram、Threads 的自動排程貼文</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-card-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{connectedCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">已連接帳號</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{scheduledCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">排程中貼文</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{publishedCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">已發布貼文</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1 -mb-px">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "帳號綁定" && <AccountBinding />}
        {activeTab === "排程日曆" && <ScheduleCalendar posts={posts} />}
        {activeTab === "新增貼文" && <ComposePost accounts={accounts} />}
        {activeTab === "貼文記錄" && <PostHistory posts={posts} isLoading={postsLoading} />}
      </div>
    </div>
  );
}
