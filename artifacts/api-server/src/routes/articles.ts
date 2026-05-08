import { Router } from "express";
import { db, articlesTable } from "@workspace/db";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";

const router = Router();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\u4e00-\u9fff]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || `article-${Date.now()}`;
}

// ── Public: list published articles ──────────────────────────────

router.get("/articles", async (req, res) => {
  try {
    const { category, tag, q, limit: limitQ, offset: offsetQ } = req.query as Record<string, string>;
    const limitN = Math.min(parseInt(limitQ || "20", 10), 50);
    const offsetN = parseInt(offsetQ || "0", 10);

    let query = db.select({
      id: articlesTable.id,
      slug: articlesTable.slug,
      title: articlesTable.title,
      excerpt: articlesTable.excerpt,
      coverImage: articlesTable.coverImage,
      category: articlesTable.category,
      tags: articlesTable.tags,
      featured: articlesTable.featured,
      publishedAt: articlesTable.publishedAt,
      createdAt: articlesTable.createdAt,
    }).from(articlesTable);

    const conditions = [eq(articlesTable.status, "published")];
    if (category) conditions.push(eq(articlesTable.category, category));
    if (tag) conditions.push(ilike(articlesTable.tags, `%"${tag}"%`));
    if (q) conditions.push(or(
      ilike(articlesTable.title, `%${q}%`),
      ilike(articlesTable.excerpt, `%${q}%`),
    )!);

    const articles = await query
      .where(and(...conditions))
      .orderBy(desc(articlesTable.publishedAt), desc(articlesTable.createdAt))
      .limit(limitN)
      .offset(offsetN);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(articlesTable)
      .where(and(...conditions));

    return res.json({ articles, total: Number(count) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Public: list categories ───────────────────────────────────────

router.get("/articles/categories", async (_req, res) => {
  try {
    const rows = await db.selectDistinct({ category: articlesTable.category })
      .from(articlesTable)
      .where(and(eq(articlesTable.status, "published"), sql`${articlesTable.category} is not null`));
    return res.json(rows.map(r => r.category).filter(Boolean));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Public: single article by slug ───────────────────────────────

router.get("/articles/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const articles = await db.select().from(articlesTable)
      .where(and(eq(articlesTable.slug, slug), eq(articlesTable.status, "published")))
      .limit(1);
    if (!articles.length) return res.status(404).json({ error: "Not found" });
    return res.json(articles[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: list all articles (any status) ────────────────────────

router.get("/admin/articles", async (_req, res) => {
  try {
    const articles = await db.select().from(articlesTable)
      .orderBy(desc(articlesTable.createdAt));
    return res.json(articles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: create article ─────────────────────────────────────────

router.post("/admin/articles", async (req, res) => {
  try {
    const { title, slug, excerpt, content, coverImage, category, tags, metaTitle, metaDescription, ogImage, status, featured } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });

    const finalSlug = slug || slugify(title);

    const [article] = await db.insert(articlesTable)
      .values({
        title,
        slug: finalSlug,
        excerpt: excerpt || null,
        content: content || "",
        coverImage: coverImage || null,
        category: category || null,
        tags: tags ? JSON.stringify(tags) : null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        ogImage: ogImage || null,
        status: status || "draft",
        featured: featured || false,
        publishedAt: status === "published" ? new Date() : null,
      })
      .returning();
    return res.status(201).json(article);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("unique")) {
      return res.status(400).json({ error: "此 slug 已存在，請換一個" });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: update article ─────────────────────────────────────────

router.patch("/admin/articles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, slug, excerpt, content, coverImage, category, tags, metaTitle, metaDescription, ogImage, status, featured } = req.body;

    const current = await db.select().from(articlesTable).where(eq(articlesTable.id, id)).limit(1);
    if (!current.length) return res.status(404).json({ error: "Not found" });

    const wasPublished = current[0].status === "published";
    const nowPublished = status === "published";

    const [updated] = await db.update(articlesTable)
      .set({
        ...(title !== undefined ? { title } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(excerpt !== undefined ? { excerpt } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(coverImage !== undefined ? { coverImage } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(tags !== undefined ? { tags: JSON.stringify(tags) } : {}),
        ...(metaTitle !== undefined ? { metaTitle } : {}),
        ...(metaDescription !== undefined ? { metaDescription } : {}),
        ...(ogImage !== undefined ? { ogImage } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(featured !== undefined ? { featured } : {}),
        ...(!wasPublished && nowPublished ? { publishedAt: new Date() } : {}),
        updatedAt: new Date(),
      })
      .where(eq(articlesTable.id, id))
      .returning();
    return res.json(updated);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("unique")) {
      return res.status(400).json({ error: "此 slug 已存在，請換一個" });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: delete article ─────────────────────────────────────────

router.delete("/admin/articles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(articlesTable).where(eq(articlesTable.id, id));
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
