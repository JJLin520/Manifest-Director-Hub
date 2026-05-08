import { pgTable, serial, integer, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const numerologySessionsTable = pgTable("numerology_sessions", {
  id: serial("id").primaryKey(),
  sessionNumber: integer("session_number").notNull(),
  sessionDate: timestamp("session_date").notNull(),
  title: text("title").notNull().default("宇宙數字原力學 線上直播講座"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNumerologySessionSchema = createInsertSchema(numerologySessionsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertNumerologySession = z.infer<typeof insertNumerologySessionSchema>;
export type NumerologySession = typeof numerologySessionsTable.$inferSelect;
