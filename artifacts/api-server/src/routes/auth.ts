import { Router } from "express";

const router = Router();

// POST /api/auth/login
router.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return res.status(500).json({ error: "Admin credentials not configured" });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    (req.session as any).authenticated = true;
    return res.json({ success: true });
  }

  return res.status(401).json({ error: "帳號或密碼錯誤" });
});

// POST /api/auth/logout
router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// GET /api/auth/me — check if logged in
router.get("/auth/me", (req, res) => {
  if ((req.session as any).authenticated) {
    return res.json({ authenticated: true });
  }
  return res.status(401).json({ authenticated: false });
});

export default router;
