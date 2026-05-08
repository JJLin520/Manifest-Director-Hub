import { pgTable, serial, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const articlesTable = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull().default(""),
  coverImage: varchar("cover_image", { length: 1000 }),
  category: varchar("category", { length: 100 }),
  tags: text("tags"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  ogImage: varchar("og_image", { length: 1000 }),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  featured: boolean("featured").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
