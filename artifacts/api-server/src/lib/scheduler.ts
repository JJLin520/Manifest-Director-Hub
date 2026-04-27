import { db, socialPostsTable, socialAccountsTable } from "@workspace/db";
import { eq, and, lte } from "drizzle-orm";
import { publishToFacebook, publishToInstagram, publishToThreads } from "./social-publisher";
import { logger } from "./logger";

async function processScheduledPosts() {
  const now = new Date();
  const duePosts = await db
    .select()
    .from(socialPostsTable)
    .where(and(eq(socialPostsTable.status, "scheduled"), lte(socialPostsTable.scheduledAt, now)));

  for (const post of duePosts) {
    await db.update(socialPostsTable)
      .set({ status: "sending", updatedAt: new Date() })
      .where(eq(socialPostsTable.id, post.id));

    const platforms = JSON.parse(post.platforms) as string[];
    const errors: string[] = [];

    for (const platform of platforms) {
      const accounts = await db.select().from(socialAccountsTable)
        .where(and(eq(socialAccountsTable.platform, platform), eq(socialAccountsTable.isActive, true)))
        .limit(1);

      if (accounts.length === 0) {
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

      if (result && !result.success) {
        errors.push(`${platform}：${result.error}`);
      }
    }

    const finalStatus = errors.length === 0 ? "published" : "failed";
    await db.update(socialPostsTable)
      .set({
        status: finalStatus,
        publishedAt: finalStatus === "published" ? new Date() : null,
        errorMessage: errors.length > 0 ? errors.join(" | ") : null,
        updatedAt: new Date(),
      })
      .where(eq(socialPostsTable.id, post.id));

    logger.info({ postId: post.id, platforms, status: finalStatus, errors }, "Scheduled post processed");
  }
}

export function startScheduler() {
  processScheduledPosts().catch(err => logger.error({ err }, "Scheduler initial run failed"));
  const interval = setInterval(() => {
    processScheduledPosts().catch(err => logger.error({ err }, "Scheduler tick failed"));
  }, 60_000);
  logger.info("Social post scheduler started (60s interval)");
  return interval;
}
