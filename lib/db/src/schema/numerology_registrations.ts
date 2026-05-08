import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { contactsTable } from "./contacts";
import { numerologySessionsTable } from "./numerology_sessions";

export const numerologyRegistrationsTable = pgTable("numerology_registrations", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id")
    .references(() => contactsTable.id)
    .notNull(),
  sessionId: integer("session_id")
    .references(() => numerologySessionsTable.id)
    .notNull(),
  lifeNumber: text("life_number"),
  referralSource: text("referral_source"),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertNumerologyRegistrationSchema = createInsertSchema(numerologyRegistrationsTable).omit({
  id: true,
  submittedAt: true,
});

export type InsertNumerologyRegistration = z.infer<typeof insertNumerologyRegistrationSchema>;
export type NumerologyRegistration = typeof numerologyRegistrationsTable.$inferSelect;
