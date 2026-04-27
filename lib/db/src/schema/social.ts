import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const socialAccountsTable = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(), // "facebook" | "instagram" | "threads"
  accountName: text("account_name").notNull(),
  accountId: text("account_id").notNull(),
  accessToken: text("access_token").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const socialPostsTable = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  platforms: text("platforms").notNull(), // JSON array string: '["facebook","instagram"]'
  imageUrl: text("image_url"),
  status: text("status").notNull().default("draft"), // "draft" | "scheduled" | "sending" | "published" | "failed"
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SocialAccount = typeof socialAccountsTable.$inferSelect;
export type SocialPost = typeof socialPostsTable.$inferSelect;
