import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, Tag, ArrowRight, BookOpen, Sparkles } from "lucide-react";

const API = "/api";

interface ArticleCard {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  tags: string | null;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
}

function useSEO({ title, description }: { title: string; description?: string }) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content");
    if (description && metaDesc) metaDesc.setAttribute("content", description);
    return () => {
      document.title = prev;
      if (prevDesc && metaDesc) metaDesc.setAttribute("content", prevDesc);
    };
  }, [title, description]);
}

function parseTags(s: string | null): string[] {
  if (!s) return [];
  try { return JSON.parse(s); } catch { return []; }
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" });
}

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useSEO({
    title: "知識文章｜宇宙序能 Coach JJ",
    description: "探索身心靈、顯化哲學、潛意識教練實戰觀點 — 宇宙序能 Coach JJ 林炳騰的知識專欄",
  });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ["article-categories"],
    queryFn: () => fetch(`${API}/articles/categories`).then(r => r.json()),
  });

  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (debouncedSearch) params.set("q", debouncedSearch);

  const { data, isLoading } = useQuery<{ articles: ArticleCard[]; total: number }>({
    queryKey: ["articles-public", category, debouncedSearch],
    queryFn: () => fetch(`${API}/articles?${params}`).then(r => r.json()),
  });

  const articles = data?.articles || [];
  const featured = articles.filter(a => a.featured);
  const rest = articles.filter(a => !a.featured || category || debouncedSearch);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto relative">
          <FadeIn>
            <div className="inline-flex items-center gap-2 text-primary/70 text-sm font-medium mb-4 border border-primary/20 rounded-full px-4 py-1.5 bg-primary/5">
              <BookOpen size={14} />
              知識文章 · 觀點專欄
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              探索你的<span className="text-primary">內在宇宙</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              身心靈洞見、顯化哲學、潛意識教練實戰觀點<br className="hidden md:block" />
              從 Coach JJ 的角度，帶你看見不同的可能
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-24 space-y-12">
        {/* Search + Filter */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜尋文章標題或關鍵字…"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setCategory("")}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${!category ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-border/80 bg-card"}`}
              >
                全部
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === category ? "" : cat)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${category === cat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground bg-card"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Featured articles (only when no search/filter) */}
        {!category && !debouncedSearch && featured.length > 0 && (
          <FadeIn>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <Sparkles size={14} /> 精選文章
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {featured.slice(0, 2).map(article => (
                  <Link key={article.id} href={`/blog/${article.slug}`}>
                    <div className="group cursor-pointer h-full rounded-2xl overflow-hidden border border-primary/20 bg-card hover:border-primary/50 hover:shadow-[0_0_32px_rgba(var(--primary-rgb),0.15)] transition-all duration-300">
                      {article.coverImage && (
                        <div className="relative overflow-hidden">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                        </div>
                      )}
                      <div className="p-6 space-y-3">
                        {article.category && (
                          <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                            {article.category}
                          </span>
                        )}
                        <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                          {article.title}
                        </h2>
                        {article.excerpt && (
                          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{article.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-muted-foreground">{formatDate(article.publishedAt || article.createdAt)}</span>
                          <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            閱讀 <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Article grid */}
        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">載入中…</div>
        ) : rest.length === 0 && articles.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
            <p>{debouncedSearch ? "找不到符合的文章" : "目前尚無文章"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(!category && !debouncedSearch && rest.length > 0) && (
              <h2 className="text-sm font-medium text-muted-foreground">所有文章</h2>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(category || debouncedSearch ? articles : rest).map((article, i) => (
                <FadeIn key={article.id} delay={i * 0.05}>
                  <Link href={`/blog/${article.slug}`}>
                    <div className="group cursor-pointer h-full flex flex-col rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-300">
                      {article.coverImage ? (
                        <div className="overflow-hidden">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <BookOpen size={28} className="text-primary/30" />
                        </div>
                      )}
                      <div className="flex flex-col flex-1 p-5 space-y-2">
                        {article.category && (
                          <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-wide">{article.category}</span>
                        )}
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{article.excerpt}</p>
                        )}
                        {parseTags(article.tags).length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {parseTags(article.tags).slice(0, 3).map(tag => (
                              <span key={tag} className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                <Tag size={8} /> {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex-1" />
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[11px] text-muted-foreground">{formatDate(article.publishedAt || article.createdAt)}</span>
                          <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
