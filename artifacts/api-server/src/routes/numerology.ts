import { Router } from "express";
import { db, contactsTable, numerologySessionsTable, numerologyRegistrationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { sendEmail, buildLectureConfirmationEmail } from "../lib/resend";

const router = Router();

// GET /api/numerology/current-session — get the active session (public)
router.get("/numerology/current-session", async (_req, res) => {
  try {
    const [session] = await db
      .select()
      .from(numerologySessionsTable)
      .where(eq(numerologySessionsTable.isActive, true))
      .orderBy(desc(numerologySessionsTable.sessionDate))
      .limit(1);
    if (!session) return res.status(404).json({ error: "No active session" });
    return res.json(session);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/numerology/sessions — get all open sessions for public registration
router.get("/numerology/sessions", async (_req, res) => {
  try {
    const sessions = await db
      .select()
      .from(numerologySessionsTable)
      .orderBy(numerologySessionsTable.sessionDate);
    return res.json(sessions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/numerology/register — register for a session (public)
router.post("/numerology/register", async (req, res) => {
  try {
    const { name, phone, email, lineId, lifeNumber, referralSource, sessionId } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "姓名和手機為必填" });
    }

    // Find requested session or fall back to active
    let session;
    if (sessionId) {
      const [found] = await db
        .select()
        .from(numerologySessionsTable)
        .where(eq(numerologySessionsTable.id, parseInt(sessionId, 10)))
        .limit(1);
      session = found;
    } else {
      const [found] = await db
        .select()
        .from(numerologySessionsTable)
        .where(eq(numerologySessionsTable.isActive, true))
        .orderBy(desc(numerologySessionsTable.sessionDate))
        .limit(1);
      session = found;
    }

    if (!session) {
      return res.status(400).json({ error: "找不到指定場次，請重新選擇" });
    }

    // Upsert contact
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
      const [inserted] = await db
        .insert(contactsTable)
        .values({ name, phone, lineId: lineId || null, email: email || null })
        .returning({ id: contactsTable.id });
      contactId = inserted.id;
    }

    // Insert registration
    const [registration] = await db
      .insert(numerologyRegistrationsTable)
      .values({ contactId, sessionId: session.id, lifeNumber: lifeNumber || null, referralSource: referralSource || null })
      .returning();

    // Send confirmation email (non-blocking)
    if (email) {
      const { subject, html } = buildLectureConfirmationEmail({
        name,
        sessionNumber: session.sessionNumber,
        sessionDate: new Date(session.sessionDate),
        sessionTitle: session.title,
      });
      sendEmail(email, subject, html);
    }

    return res.status(201).json({ success: true, registrationId: registration.id, sessionId: session.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/numerology/sessions — list all sessions (admin)
router.get("/admin/numerology/sessions", async (_req, res) => {
  try {
    const sessions = await db
      .select()
      .from(numerologySessionsTable)
      .orderBy(desc(numerologySessionsTable.sessionDate));
    return res.json(sessions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/numerology/sessions — create a new session (admin)
router.post("/admin/numerology/sessions", async (req, res) => {
  try {
    const { sessionNumber, sessionDate, title, description, isActive } = req.body;
    if (!sessionNumber || !sessionDate) {
      return res.status(400).json({ error: "sessionNumber and sessionDate are required" });
    }
    // If setting as active, deactivate all others first
    if (isActive) {
      await db.update(numerologySessionsTable).set({ isActive: false });
    }
    const [session] = await db
      .insert(numerologySessionsTable)
      .values({ sessionNumber, sessionDate: new Date(sessionDate), title: title || "宇宙數字原力學 線上直播講座", description: description || null, isActive: !!isActive })
      .returning();
    return res.status(201).json(session);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/numerology/sessions/:id — update session (admin)
router.patch("/admin/numerology/sessions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { sessionDate, title, description, isActive } = req.body;
    if (isActive) {
      await db.update(numerologySessionsTable).set({ isActive: false });
    }
    const [updated] = await db
      .update(numerologySessionsTable)
      .set({
        ...(sessionDate ? { sessionDate: new Date(sessionDate) } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      })
      .where(eq(numerologySessionsTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Session not found" });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/numerology/registrations — list all registrations with contact + session info (admin)
router.get("/admin/numerology/registrations", async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: numerologyRegistrationsTable.id,
        sessionId: numerologyRegistrationsTable.sessionId,
        lifeNumber: numerologyRegistrationsTable.lifeNumber,
        referralSource: numerologyRegistrationsTable.referralSource,
        notes: numerologyRegistrationsTable.notes,
        submittedAt: numerologyRegistrationsTable.submittedAt,
        contactId: contactsTable.id,
        contactName: contactsTable.name,
        contactPhone: contactsTable.phone,
        contactLineId: contactsTable.lineId,
        contactEmail: contactsTable.email,
        sessionNumber: numerologySessionsTable.sessionNumber,
        sessionDate: numerologySessionsTable.sessionDate,
        sessionTitle: numerologySessionsTable.title,
      })
      .from(numerologyRegistrationsTable)
      .innerJoin(contactsTable, eq(numerologyRegistrationsTable.contactId, contactsTable.id))
      .innerJoin(numerologySessionsTable, eq(numerologyRegistrationsTable.sessionId, numerologySessionsTable.id))
      .orderBy(desc(numerologyRegistrationsTable.submittedAt));
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
