// Resend integration — via Replit Connectors
import { Resend } from "resend";

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error("X-Replit-Token not found for repl/depl");
  }

  connectionSettings = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=resend",
    {
      headers: {
        Accept: "application/json",
        "X-Replit-Token": xReplitToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error("Resend not connected");
  }

  // Prefer RESEND_FROM_EMAIL env var (set this to your verified domain address)
  // Fall back to connection's from_email only if it's NOT a personal email domain
  const envFrom = process.env.RESEND_FROM_EMAIL;
  const connFrom = connectionSettings.settings.from_email as string | undefined;
  const personalDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "me.com"];
  const isPersonal = connFrom ? personalDomains.some(d => connFrom.endsWith("@" + d)) : true;
  const fromEmail = envFrom ?? (isPersonal ? "onboarding@resend.dev" : connFrom ?? "onboarding@resend.dev");

  return {
    apiKey: connectionSettings.settings.api_key as string,
    fromEmail,
  };
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
export async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail,
  };
}

// ─── Email templates ──────────────────────────────────────────────────────────

function baseHtml(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0d1530;border:1px solid #c9a84c33;border-radius:12px;overflow:hidden;max-width:560px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d1530,#1a2545);padding:32px 40px;border-bottom:1px solid #c9a84c33;text-align:center;">
              <p style="margin:0 0 4px;color:#c9a84c;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">宇宙序能教育品牌</p>
              <h1 style="margin:0;color:#c9a84c;font-size:22px;font-weight:700;">${title}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;color:#e8e0d0;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #ffffff15;text-align:center;">
              <p style="margin:0 0 6px;color:#ffffff40;font-size:12px;">Coach JJ 林炳騰 · 宇宙序能教育品牌</p>
              <p style="margin:0;color:#ffffff30;font-size:11px;">LINE：<a href="https://lin.ee/Nq1MhuY" style="color:#c9a84c;text-decoration:none;">@jjloveyou520</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildLectureConfirmationEmail(opts: {
  name: string;
  sessionNumber: number;
  sessionDate: Date;
  sessionTitle: string;
}) {
  const { name, sessionNumber, sessionDate, sessionTitle } = opts;
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const m = sessionDate.getMonth() + 1;
  const d = sessionDate.getDate();
  const wd = weekdays[sessionDate.getDay()];
  const h = sessionDate.getHours().toString().padStart(2, "0");
  const min = sessionDate.getMinutes().toString().padStart(2, "0");
  const dateStr = `${m} 月 ${d} 日（週${wd}）${h}:${min} 開始`;

  const body = `
    <p style="margin:0 0 20px;font-size:17px;color:#f0e8d0;">嗨，${name} 你好 🙏</p>
    <p style="margin:0 0 24px;font-size:15px;color:#c8bea8;line-height:1.7;">
      你已成功報名以下線上直播講座，我們很期待在直播中與你相遇！
    </p>

    <!-- Session card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;border:1px solid #c9a84c44;border-radius:8px;margin:0 0 28px;">
      <tr>
        <td style="padding:8px 20px;background:#c9a84c22;border-radius:8px 8px 0 0;">
          <p style="margin:0;color:#c9a84c;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">第 ${sessionNumber} 場 · 已確認</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;color:#f0e8d0;font-size:16px;font-weight:700;">${sessionTitle}</p>
          <p style="margin:0 0 4px;color:#c8bea8;font-size:14px;">📅 ${dateStr}</p>
          <p style="margin:0 0 4px;color:#c8bea8;font-size:14px;">📡 Zoom 線上直播 · 共 90 分鐘</p>
          <p style="margin:0;color:#c8bea8;font-size:14px;">🎟 免費參加</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 12px;font-size:14px;color:#c8bea8;line-height:1.7;">
      <strong style="color:#c9a84c;">直播連結</strong> 將在活動開始前透過 LINE 傳送給你，請記得加入我們的 LINE 官方帳號：
    </p>
    <p style="margin:0 0 28px;text-align:center;">
      <a href="https://lin.ee/Nq1MhuY" style="display:inline-block;background:#00B900;color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;">➕ 加入 LINE 官方帳號</a>
    </p>

    <p style="margin:0;font-size:13px;color:#ffffff40;line-height:1.7;">
      有任何問題，歡迎直接透過 LINE 聯繫 JJ 老師。感謝你的報名，期待與你的靈魂相遇 ✨
    </p>
  `;

  return {
    subject: `【報名成功】第 ${sessionNumber} 場 ${sessionTitle}`,
    html: baseHtml(sessionTitle, body),
  };
}

export function buildRegistrationConfirmationEmail(opts: {
  name: string;
  eventName: string;
  attendees?: string;
}) {
  const { name, eventName, attendees } = opts;
  const body = `
    <p style="margin:0 0 20px;font-size:17px;color:#f0e8d0;">嗨，${name} 你好 🙏</p>
    <p style="margin:0 0 24px;font-size:15px;color:#c8bea8;line-height:1.7;">
      你已成功報名以下活動，感謝你的支持！
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;border:1px solid #c9a84c44;border-radius:8px;margin:0 0 28px;">
      <tr>
        <td style="padding:8px 20px;background:#c9a84c22;border-radius:8px 8px 0 0;">
          <p style="margin:0;color:#c9a84c;font-size:11px;letter-spacing:0.15em;">報名確認</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;color:#f0e8d0;font-size:16px;font-weight:700;">${eventName}</p>
          ${attendees && attendees !== "1" ? `<p style="margin:0;color:#c8bea8;font-size:14px;">👥 報名人數：${attendees} 人</p>` : ""}
        </td>
      </tr>
    </table>

    <p style="margin:0 0 28px;font-size:14px;color:#c8bea8;line-height:1.7;">
      若有任何問題，歡迎透過 LINE 與我們聯繫，我們將盡快回覆你。
    </p>
    <p style="margin:0;text-align:center;">
      <a href="https://lin.ee/Nq1MhuY" style="display:inline-block;background:#00B900;color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;">➕ 加入 LINE 官方帳號</a>
    </p>
  `;

  return {
    subject: `【報名成功】${eventName}`,
    html: baseHtml(eventName, body),
  };
}

// ─── Send helper ──────────────────────────────────────────────────────────────

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    const from = `宇宙序能 Coach JJ <${fromEmail}>`;
    const result = await client.emails.send({ from, to, subject, html });
    if (result.error) {
      console.error("[Resend] send error:", result.error);
    } else {
      console.log("[Resend] sent to", to, "id:", result.data?.id);
    }
  } catch (err) {
    // Email failures should not block registration — log and continue
    console.error("[Resend] failed:", err);
  }
}
