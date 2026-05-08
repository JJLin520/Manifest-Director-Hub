import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { contactsTable } from "./contacts";

export const registrationsTable = pgTable("registrations", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id")
    .references(() => contactsTable.id)
    .notNull(),
  eventName: text("event_name").notNull(),
  attendees: text("attendees").notNull().default("1"),
  hasLantern: text("has_lantern"),
  referralSource: text("referral_source"),
  paymentStatus: text("payment_status").notNull().default("unpaid"),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertRegistrationSchema = createInsertSchema(registrationsTable).omit({
  id: true,
  submittedAt: true,
});

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrationsTable.$inferSelect;
