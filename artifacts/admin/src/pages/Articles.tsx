import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import {
  FileText, Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff,
  ExternalLink, Loader2, AlertCircle, CheckCircle, X, Globe, Lock,
} from "lucide-react";

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string | null;
  tags: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  status: string;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_LABELS: Record<string, string> = { draft: "草稿", published: "已發布" };
const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-700/40 text-slate-300 border-slate-600/40",
  published: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[\s\u4e00-\u9fff]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || `article-${Date.now()}`;
}

function parseTags(s: string | null): string[] {
  if (!s) return [];
  try { return JSON.parse(s); } catch { return []; }
}

type FormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tagsRaw: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  status: string;
  featured: boolean;
};

const EMPTY_FORM: FormData = {
  title: "", slug: "", excerpt: "", content: "", coverImage: "",
  category: "", tagsRaw: "", metaTitle: "", metaDescription: "",
  ogImage: "", status: "draft", featured: false,
};

function ArticleModal({
  article,
  onClose,
  onSave,
  saving,
  error,
}: {
  article: Article | null;
  onClose: () => void;
  onSave: (data: FormData) => void;
  saving: boolean;
  error: string;
}) {
  const [form, setForm] = useState<FormData>(() => {
    if (!article) return EMPTY_FORM;
    return {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content,
      coverImage: article.coverImage || "",
      category: article.category || "",
      tagsRaw: parseTags(article.tags).join(", "),
      metaTitle: article.metaTitle || "",
      metaDescription: article.metaDescription || "",
      ogImage: article.ogImage || "",
      status: article.status,
      featured: article.featured,
    };
  });
  const [tab, setTab] = useState<"basic" | "content" | "seo">("basic");
  const [slugManual, setSlugManual] = useState(!!article);

  const set = (key: keyof FormData, val: string | boolean) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h3 className="font-semibold text-foreground text-lg">{article ? "編輯文章" : "新增文章"}</h3>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6">
          {(["basic", "content", "seo"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t === "basic" ? "基本資訊" : t === "content" ? "文章內容" : "SEO 設定"}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4 min-h-[360px]">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-700/30 rounded-lg px-4 py-3">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {tab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Field label="文章標題 *">
                  <input type="text" value={form.title} onChange={e => {
                    set("title", e.target.value);
                    if (!slugManual) set("slug", slugify(e.target.value));
                  }} className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="輸入文章標題…" />
                </Field>
                <Field label={<span>Slug（網址）<span className="text-muted-foreground text-xs ml-1">— 影響 SEO，建議用英文</span></span>}>
                  <input type="text" value={form.slug} onChange={e => { setSlugManual(true); set("slug", e.target.value); }}
                    className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs" placeholder="my-article-title" />
                </Field>
                <Field label="摘要（顯示在列表頁，也作為 meta description 備用）">
                  <textarea rows={3} value={form.excerpt} onChange={e => set("excerpt", e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" placeholder="簡短描述文章內容（建議 50–160 字）…" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="分類">
                    <input type="text" value={form.category} onChange={e => set("category", e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="例：顯化哲學" />
                  </Field>
                  <Field label="標籤（逗號分隔）">
                    <input type="text" value={form.tagsRaw} onChange={e => set("tagsRaw", e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="顯化, 潛意識, 身心靈" />
                  </Field>
                </div>
                <Field label="封面圖片網址">
                  <input type="url" value={form.coverImage} onChange={e => set("coverImage", e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="https://example.com/cover.jpg" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="發布狀態">
                    <select value={form.status} onChange={e => set("status", e.target.value)} className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                      <option value="draft">草稿</option>
                      <option value="published">立即發布</option>
                    </select>
                  </Field>
                  <Field label="精選文章">
                    <div className="flex items-center gap-3 mt-2">
                      <button type="button" onClick={() => set("featured", !form.featured)}
                        className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl border transition-all ${form.featured ? "border-primary/60 bg-primary/15 text-primary" : "border-border text-muted-foreground"}`}>
                        {form.featured ? <Star size={14} className="fill-current" /> : <StarOff size={14} />}
                        {form.featured ? "精選中" : "設為精選"}
                      </button>
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          )}

          {tab === "content" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <AlertCircle size={11} /> 支援 HTML 格式，可使用 &lt;h2&gt;、&lt;p&gt;、&lt;strong&gt;、&lt;ul&gt;、&lt;img&gt; 等標籤
              </p>
              <textarea
                rows={22}
                value={form.content}
                onChange={e => set("content", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none font-mono text-xs leading-relaxed"
                placeholder={`<p>在這裡輸入文章內容…</p>\n\n<h2>小標題</h2>\n<p>段落文字…</p>`}
              />
            </div>
          )}

          {tab === "seo" && (
            <div className="space-y-4">
              <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4 text-xs text-amber-300/80 space-y-1">
                <p className="font-medium text-amber-300">💡 SEO 設定說明</p>
                <p>若不填寫，系統會自動使用文章標題和摘要作為 SEO 描述。建議主動填寫以獲得更好的搜尋排名。</p>
              </div>
              <Field label={`Meta 標題（建議 30–60 字元）${form.metaTitle ? ` — 目前 ${form.metaTitle.length} 字` : ""}`}>
                <input type="text" value={form.metaTitle} onChange={e => set("metaTitle", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder={`${form.title} | 宇宙序能 Coach JJ`} maxLength={80} />
              </Field>
              <Field label={`Meta 描述（建議 50–160 字元）${form.metaDescription ? ` — 目前 ${form.metaDescription.length} 字` : ""}`}>
                <textarea rows={4} value={form.metaDescription} onChange={e => set("metaDescription", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" placeholder={form.excerpt || "填寫頁面描述，顯示在 Google 搜尋結果中…"} maxLength={200} />
              </Field>
              <Field label="OG Image（社群分享預覽圖，建議 1200×630）">
                <input type="url" value={form.ogImage} onChange={e => set("ogImage", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder={form.coverImage || "https://example.com/og-image.jpg"} />
              </Field>
              {/* Google preview */}
              {(form.metaTitle || form.title) && (
                <div className="border border-border rounded-xl p-4 space-y-1 bg-muted/20">
                  <p className="text-xs text-muted-foreground mb-2">Google 搜尋預覽：</p>
                  <p className="text-blue-400 text-sm font-medium line-clamp-1">{form.metaTitle || `${form.title} | 宇宙序能 Coach JJ`}</p>
                  <p className="text-green-500/70 text-xs">cosmicenergyedu.com/blog/{form.slug}</p>
                  <p className="text-muted-foreground text-xs line-clamp-2">{form.metaDescription || form.excerpt || "填寫 Meta 描述，顯示在這裡…"}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {form.status === "published" ? <Globe size={12} className="text-emerald-400" /> : <Lock size={12} />}
            {form.status === "published" ? "公開發布" : "草稿（不公開）"}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">取消</button>
            <button
              onClick={() => onSave(form)}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-60 hover:bg-primary/90 transition-colors"
            >
              {saving && <Loader2 size={13} className="animate-spin" />}
              {article ? "儲存變更" : "建立文章"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground block">{label}</label>
      {children}
    </div>
  );
}

export default function Articles() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formError, setFormError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState("");

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["admin-articles"],
    queryFn: () => apiFetch("/admin/articles"),
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiFetch("/admin/articles", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-articles"] }); setShowModal(false); showToast("文章已建立！"); },
    onError: (e: Error) => setFormError(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      apiFetch(`/admin/articles/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-articles"] }); setShowModal(false); showToast("文章已更新！"); },
    onError: (e: Error) => setFormError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/admin/articles/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-articles"] }); showToast("文章已刪除"); },
  });

  const toggleStatus = (article: Article) => {
    const next = article.status === "published" ? "draft" : "published";
    updateMutation.mutate({ id: article.id, data: { status: next } });
  };

  const toggleFeatured = (article: Article) => {
    updateMutation.mutate({ id: article.id, data: { featured: !article.featured } });
  };

  const handleSave = (form: FormData) => {
    setFormError("");
    if (!form.title.trim()) { setFormError("請填寫文章標題"); return; }
    if (!form.slug.trim()) { setFormError("請填寫 Slug"); return; }
    const tags = form.tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content,
      coverImage: form.coverImage || null,
      category: form.category || null,
      tags,
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
      ogImage: form.ogImage || null,
      status: form.status,
      featured: form.featured,
    };
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filtered = filterStatus === "all" ? articles : articles.filter(a => a.status === filterStatus);
  const publishedCount = articles.filter(a => a.status === "published").length;
  const draftCount = articles.filter(a => a.status === "draft").length;
  const featuredCount = articles.filter(a => a.featured).length;
  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 text-sm text-emerald-300 bg-emerald-900/80 border border-emerald-700/50 rounded-xl px-5 py-3 shadow-xl">
          <CheckCircle size={14} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary">知識文章</h2>
          <p className="text-muted-foreground text-sm mt-1">管理網站的文章與知識內容，已支援 SEO 優化</p>
        </div>
        <button onClick={() => { setEditingArticle(null); setFormError(""); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus size={15} /> 新增文章
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-card-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{publishedCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">已發布</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-400">{draftCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">草稿</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{featuredCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">精選文章</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-border -mb-2 pb-0">
        {[["all", "全部"], ["published", "已發布"], ["draft", "草稿"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilterStatus(val)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${filterStatus === val ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {label}
            <span className="ml-1.5 text-xs opacity-60">
              ({val === "all" ? articles.length : articles.filter(a => a.status === val).length})
            </span>
          </button>
        ))}
      </div>

      {/* Article list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground"><Loader2 size={18} className="animate-spin mr-2" /> 載入中…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl text-muted-foreground">
          <FileText size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">尚無文章</p>
          <button onClick={() => { setEditingArticle(null); setFormError(""); setShowModal(true); }}
            className="mt-4 text-xs text-primary hover:underline">建立第一篇文章</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(article => (
            <div key={article.id} className="flex items-start gap-4 bg-card border border-card-border rounded-xl p-4 hover:border-primary/20 transition-colors">
              {article.coverImage && (
                <img src={article.coverImage} alt="" className="w-20 h-16 rounded-lg object-cover shrink-0 border border-border" />
              )}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[article.status] || ""}`}>
                    {STATUS_LABELS[article.status] || article.status}
                  </span>
                  {article.featured && (
                    <span className="text-xs px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium flex items-center gap-0.5">
                      <Star size={9} className="fill-current" /> 精選
                    </span>
                  )}
                  {article.category && (
                    <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">{article.category}</span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-1">{article.title}</h3>
                {article.excerpt && <p className="text-xs text-muted-foreground line-clamp-1">{article.excerpt}</p>}
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>/{article.slug}</span>
                  <span>{new Date(article.createdAt).toLocaleDateString("zh-TW")}</span>
                  {article.publishedAt && <span>發布：{new Date(article.publishedAt).toLocaleDateString("zh-TW")}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleFeatured(article)}
                  className={`p-1.5 rounded-md transition-colors ${article.featured ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  title={article.featured ? "取消精選" : "設為精選"}>
                  {article.featured ? <Star size={14} className="fill-current" /> : <StarOff size={14} />}
                </button>
                <button onClick={() => toggleStatus(article)}
                  className={`p-1.5 rounded-md transition-colors ${article.status === "published" ? "text-emerald-400 hover:text-red-400" : "text-muted-foreground hover:text-emerald-400"}`}
                  title={article.status === "published" ? "切換為草稿" : "發布文章"}>
                  {article.status === "published" ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => { setEditingArticle(article); setFormError(""); setShowModal(true); }}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-md transition-colors">
                  <Pencil size={14} />
                </button>
                <a href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 text-muted-foreground hover:text-primary rounded-md transition-colors">
                  <ExternalLink size={14} />
                </a>
                <button onClick={() => { if (confirm(`確定刪除「${article.title}」？`)) deleteMutation.mutate(article.id); }}
                  className="p-1.5 text-muted-foreground hover:text-red-400 rounded-md transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ArticleModal
          article={editingArticle}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          saving={saving}
          error={formError}
        />
      )}
    </div>
  );
}

