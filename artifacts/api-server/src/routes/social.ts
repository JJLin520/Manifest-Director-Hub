import { Router } from "express";
import { db, socialAccountsTable, socialPostsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { publishToFacebook, publishToInstagram, publishToThreads } from "../lib/social-publisher";

const router = Router();

// ── Social Accounts ──────────────────────────────────────────────

router.get("/admin/social/accounts", async (_req, res) => {
  try {
    const accounts = await db.select().from(socialAccountsTable).orderBy(desc(socialAccountsTable.createdAt));
    return res.json(accounts.map(a => ({ ...a, accessToken: "••••••••" })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/social/accounts", async (req, res) => {
  try {
    const { platform, accountName, accountId, accessToken } = req.body;
    if (!platform || !accountName || !accountId || !accessToken) {
      return res.status(400).json({ error: "platform, accountName, accountId, accessToken are required" });
    }
    const [account] = await db.insert(socialAccountsTable)
      .values({ platform, accountName, accountId, accessToken })
      .returning();
    return res.status(201).json({ ...account, accessToken: "••••••••" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/social/accounts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { isActive, accountName, accessToken } = req.body;
    const updated = await db.update(socialAccountsTable)
      .set({
        ...(isActive !== undefined ? { isActive } : {}),
        ...(accountName ? { accountName } : {}),
        ...(accessToken ? { accessToken } : {}),
        updatedAt: new Date(),
      })
      .where(eq(socialAccountsTable.id, id))
      .returning();
    if (!updated.length) return res.status(404).json({ error: "Account not found" });
    return res.json({ ...updated[0], accessToken: "••••••••" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/social/accounts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(socialAccountsTable).where(eq(socialAccountsTable.id, id));
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Social Posts ──────────────────────────────────────────────────

router.get("/admin/social/posts", async (_req, res) => {
  try {
    const posts = await db.select().from(socialPostsTable).orderBy(desc(socialPostsTable.createdAt));
    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/social/posts", async (req, res) => {
  try {
    const { content, platforms, imageUrl, scheduledAt } = req.body;
    if (!content || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ error: "content and platforms are required" });
    }
    const status = scheduledAt ? "scheduled" : "draft";
    const [post] = await db.insert(socialPostsTable)
      .values({
        content,
        platforms: JSON.stringify(platforms),
        imageUrl: imageUrl || null,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      })
      .returning();
    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/social/posts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { content, platforms, imageUrl, scheduledAt, status } = req.body;
    const updated = await db.update(socialPostsTable)
      .set({
        ...(content ? { content } : {}),
        ...(platforms ? { platforms: JSON.stringify(platforms) } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {}),
        ...(scheduledAt !== undefined ? { scheduledAt: scheduledAt ? new Date(scheduledAt) : null } : {}),
        ...(status ? { status } : {}),
        updatedAt: new Date(),
      })
      .where(eq(socialPostsTable.id, id))
      .returning();
    if (!updated.length) return res.status(404).json({ error: "Post not found" });
    return res.json(updated[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/social/posts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(socialPostsTable).where(eq(socialPostsTable.id, id));
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── Immediate Publish ─────────────────────────────────────────────

router.post("/admin/social/posts/:id/publish", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const posts = await db.select().from(socialPostsTable).where(eq(socialPostsTable.id, id)).limit(1);
    if (!posts.length) return res.status(404).json({ error: "Post not found" });
    const post = posts[0];

    await db.update(socialPostsTable).set({ status: "sending", updatedAt: new Date() }).where(eq(socialPostsTable.id, id));

    const platforms = JSON.parse(post.platforms) as string[];
    const results = [];
    const errors: string[] = [];

    for (const platform of platforms) {
      const accounts = await db.select().from(socialAccountsTable)
        .where(and(eq(socialAccountsTable.platform, platform), eq(socialAccountsTable.isActive, true)))
        .limit(1);

      if (!accounts.length) {
        errors.push(`${platform}：未連接帳號`);
        continue;
      }
      const account = accounts[0];

      let result;
      if (platform === "facebook") {
        result = await publishToFacebook(post.content, account.accountId, account.accessToken, post.imageUrl ?? undefined);
      } else if (platform === "instagram") {
        result = await publishToInstagram(post.content, account.accountId, account.accessToken, post.imageUrl ?? undefined);
      } else if (platform === "threads") {
        result = await publishToThreads(post.content, account.accountId, account.accessToken, post.imageUrl ?? undefined);
      }
      results.push(result);
      if (result && !result.success) errors.push(`${platform}：${result.error}`);
    }

    const finalStatus = errors.length === 0 ? "published" : "failed";
    const [updated] = await db.update(socialPostsTable)
      .set({
        status: finalStatus,
        publishedAt: finalStatus === "published" ? new Date() : null,
        errorMessage: errors.length > 0 ? errors.join(" | ") : null,
        updatedAt: new Date(),
      })
      .where(eq(socialPostsTable.id, id))
      .returning();

    return res.json({ success: finalStatus === "published", post: updated, results, errors });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
