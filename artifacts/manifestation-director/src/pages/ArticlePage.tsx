import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, Share2, BookOpen } from "lucide-react";

const API = "/api";
const SITE_NAME = "宇宙序能 Coach JJ";
const SITE_URL = "https://cosmicenergyedu.com";

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
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function parseTags(s: string | null): string[] {
  if (!s) return [];
  try { return JSON.parse(s); } catch { return []; }
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" });
}

function useSEO(article: Article | undefined) {
  useEffect(() => {
    if (!article) return;

    const title = article.metaTitle || `${article.title} | ${SITE_NAME}`;
    const description = article.metaDescription || article.excerpt || `${article.title} — 宇宙序能知識文章`;
    const image = article.ogImage || article.coverImage || "";
    const url = `${SITE_URL}/blog/${article.slug}`;

    const prev = document.title;
    document.title = title;

    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
      el.setAttribute(attr, val);
      return el;
    };

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:image"]', "content", image);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:type"]', "content", "article");
    setMeta('meta[property="og:site_name"]', "content", SITE_NAME);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", image);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = url;

    // JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: description,
      image: image || undefined,
      datePublished: article.publishedAt || article.createdAt,
      dateModified: article.updatedAt,
      author: { "@type": "Person", name: "Coach JJ 林炳騰", url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/jj-photo.jpg` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    };
    let ldScript = document.getElementById("article-jsonld");
    if (!ldScript) { ldScript = document.createElement("script"); ldScript.id = "article-jsonld"; ldScript.type = "application/ld+json"; document.head.appendChild(ldScript); }
    ldScript.textContent = JSON.stringify(jsonLd);

    return () => {
      document.title = prev;
      document.getElementById("article-jsonld")?.remove();
    };
  }, [article]);
}

function ArticleSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-20 animate-pulse space-y-6">
      <div className="h-6 w-24 bg-muted rounded-full" />
      <div className="h-10 bg-muted rounded-xl" />
      <div className="h-6 w-1/2 bg-muted rounded-xl" />
      <div className="h-64 bg-muted rounded-2xl" />
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-muted rounded" style={{ width: `${70 + Math.random() * 30}%` }} />)}
      </div>
    </div>
  );
}

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ["article", slug],
    queryFn: () => fetch(`${API}/articles/${slug}`).then(async r => {
      if (!r.ok) throw new Error("not_found");
      return r.json();
    }),
    enabled: !!slug,
    retry: false,
  });

  useSEO(article);

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({ title: article.title, text: article.excerpt || "", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("連結已複製！");
    }
  };

  if (isLoading) return <ArticleSkeleton />;

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        <BookOpen size={48} className="text-muted-foreground/30 mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">找不到此文章</h1>
        <p className="text-muted-foreground mb-8">該文章可能已移除或網址有誤</p>
        <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft size={16} /> 返回文章列表
        </Link>
      </div>
    );
  }

  const tags = parseTags(article.tags);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background pt-20"
    >
      {/* Cover image hero */}
      {article.coverImage && (
        <div className="relative w-full max-h-[480px] overflow-hidden">
          <img src={article.coverImage} alt={article.title} className="w-full max-h-[480px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6 pb-24 space-y-8">
        {/* Back link */}
        <div className={article.coverImage ? "-mt-20 relative z-10" : "pt-10"}>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={14} /> 返回文章列表
          </Link>
        </div>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            {article.category && (
              <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                {article.category}
              </span>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={11} /> {formatDate(article.publishedAt || article.createdAt)}
            </div>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4">
              {article.excerpt}
            </p>
          )}
          {/* Author row */}
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <div className="flex items-center gap-3">
              <img src="/jj-photo.jpg" alt="Coach JJ" className="w-9 h-9 rounded-full object-cover border border-primary/30" />
              <div>
                <p className="text-sm font-semibold text-foreground">Coach JJ 林炳騰</p>
                <p className="text-xs text-muted-foreground">潛意識教練 · 宇宙序能創辦人</p>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-full px-3 py-1.5"
            >
              <Share2 size={12} /> 分享
            </button>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-invert prose-sm md:prose-base max-w-none
            prose-headings:font-serif prose-headings:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-blockquote:border-primary/40 prose-blockquote:text-muted-foreground
            prose-code:text-primary prose-code:bg-primary/10 prose-code:rounded prose-code:px-1
            prose-img:rounded-xl prose-img:border prose-img:border-border
            prose-hr:border-border"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border/60">
            <Tag size={14} className="text-muted-foreground mt-0.5" />
            {tags.map(tag => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                <span className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted text-muted-foreground hover:border-primary/40 hover:text-primary cursor-pointer transition-colors">
                  #{tag}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
          <p className="font-serif text-xl font-bold text-foreground">想更深入探索這個主題？</p>
          <p className="text-sm text-muted-foreground leading-relaxed">加入 Coach JJ 的 LINE，獲得免費數字解讀，開啟你的顯化之旅</p>
          <a
            href="https://lin.ee/Nq1MhuY"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#06C755] text-white font-bold text-sm rounded-full hover:bg-[#05b84a] hover:scale-105 transition-all shadow-lg"
          >
            加入 LINE 免費諮詢
          </a>
        </div>
      </article>
    </motion.div>
  );
}
