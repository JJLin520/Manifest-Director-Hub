import { Router } from "express";
import { db, contactsTable, registrationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { sendEmail, buildRegistrationConfirmationEmail } from "../lib/resend";

const router = Router();

// POST /api/registrations — submit a new event registration (public)
router.post("/registrations", async (req, res) => {
  try {
    const { name, phone, email, lineId, attendees, hasLantern, referralSource, eventName } = req.body;

    if (!name || !phone || !eventName) {
      return res.status(400).json({ error: "name, phone, and eventName are required" });
    }

    // Upsert contact — find by phone, update or insert
    const existing = await db
      .select()
      .from(contactsTable)
      .where(eq(contactsTable.phone, phone))
      .limit(1);

    let contactId: number;

    if (existing.length > 0) {
      contactId = existing[0].id;
      await db
        .update(contactsTable)
        .set({
          name,
          ...(lineId ? { lineId } : {}),
          ...(email ? { email } : {}),
          updatedAt: new Date(),
        })
        .where(eq(contactsTable.id, contactId));
    } else {
      const inserted = await db
        .insert(contactsTable)
        .values({ name, phone, lineId: lineId || null, email: email || null })
        .returning({ id: contactsTable.id });
      contactId = inserted[0].id;
    }

    // Insert registration
    const [registration] = await db
      .insert(registrationsTable)
      .values({
        contactId,
        eventName,
        attendees: attendees || "1",
        hasLantern: hasLantern || null,
        referralSource: referralSource || null,
      })
      .returning();

    // Send confirmation email (non-blocking)
    if (email) {
      const { subject, html } = buildRegistrationConfirmationEmail({ name, eventName, attendees });
      sendEmail(email, subject, html);
    }

    return res.status(201).json({ success: true, registrationId: registration.id, contactId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/registrations — list all with contact info (admin)
router.get("/admin/registrations", async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: registrationsTable.id,
        eventName: registrationsTable.eventName,
        attendees: registrationsTable.attendees,
        hasLantern: registrationsTable.hasLantern,
        referralSource: registrationsTable.referralSource,
        paymentStatus: registrationsTable.paymentStatus,
        notes: registrationsTable.notes,
        submittedAt: registrationsTable.submittedAt,
        contactId: contactsTable.id,
        contactName: contactsTable.name,
        contactPhone: contactsTable.phone,
        contactLineId: contactsTable.lineId,
        contactEmail: contactsTable.email,
        contactStage: contactsTable.customerStage,
      })
      .from(registrationsTable)
      .innerJoin(contactsTable, eq(registrationsTable.contactId, contactsTable.id))
      .orderBy(desc(registrationsTable.submittedAt));

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/contacts — list all contacts
router.get("/admin/contacts", async (_req, res) => {
  try {
    const contacts = await db
      .select()
      .from(contactsTable)
      .orderBy(desc(contactsTable.createdAt));
    return res.json(contacts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/contacts/:id — update contact status / notes
router.patch("/admin/contacts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { paymentStatus, customerStage, notes, email } = req.body;

    const updated = await db
      .update(contactsTable)
      .set({
        ...(paymentStatus !== undefined ? { paymentStatus } : {}),
        ...(customerStage !== undefined ? { customerStage } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(email !== undefined ? { email } : {}),
        updatedAt: new Date(),
      })
      .where(eq(contactsTable.id, id))
      .returning();

    if (!updated.length) return res.status(404).json({ error: "Contact not found" });
    return res.json(updated[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/registrations/:id — update registration payment status
router.patch("/admin/registrations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { paymentStatus, notes } = req.body;

    const updated = await db
      .update(registrationsTable)
      .set({
        ...(paymentStatus !== undefined ? { paymentStatus } : {}),
        ...(notes !== undefined ? { notes } : {}),
      })
      .where(eq(registrationsTable.id, id))
      .returning();

    if (!updated.length) return res.status(404).json({ error: "Registration not found" });
    return res.json(updated[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
