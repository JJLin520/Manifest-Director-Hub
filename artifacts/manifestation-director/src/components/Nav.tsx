import React, { useState } from "react";
import { Link, useLocation } from "wouter";

const LINE_URL = "https://lin.ee/Nq1MhuY";

const LineIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
    <path d="M12 2C6.48 2 2 6.03 2 11c0 3.08 1.72 5.79 4.32 7.47V22l3.36-1.85c.75.21 1.53.32 2.32.32 5.52 0 10-4.03 10-9S17.52 2 12 2z"/>
  </svg>
);

const links = [
  { href: "/numerology", label: "數字測驗" },
  { href: "/services", label: "服務介紹" },
  { href: "/fascia", label: "AI 身體評測" },
  { href: "/events", label: "講座活動" },
  { href: "/blog", label: "知識文章" },
  { href: "/about", label: "關於我們" },
];

export default function Nav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Top nav bar ─────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-serif text-lg font-bold text-primary tracking-widest hover:opacity-80 transition-opacity">
            宇宙序能
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.startsWith(l.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/course"
              className={`px-5 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:bg-primary/90 transition-all duration-200 ${location.startsWith("/course") ? "opacity-90" : ""}`}
            >
              顯化導演介紹
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="選單"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {open && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-primary/10 px-6 py-6 space-y-4">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block text-base font-medium py-2 transition-colors ${
                  location.startsWith(l.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/course"
              onClick={() => setOpen(false)}
              className="block text-center px-5 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:bg-primary/90 transition-all mt-4"
            >
              顯化導演介紹
            </Link>
          </div>
        )}
      </nav>

      {/* ── Mobile: fixed bottom LINE bar ───────────────── */}
      <a
        href={LINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2.5 py-4 bg-[#06C755] text-white font-bold text-sm shadow-[0_-4px_20px_rgba(0,0,0,0.3)] hover:bg-[#05b84a] active:bg-[#04a341] transition-colors"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <LineIcon />
        加入 LINE，領取免費數字解讀
      </a>

      {/* ── Desktop: floating LINE button (bottom-right) ── */}
      <a
        href={LINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-8 right-8 z-50 items-center gap-2.5 px-5 py-3.5 bg-[#06C755] text-white font-bold text-sm rounded-full shadow-[0_4px_24px_rgba(6,199,85,0.4)] hover:bg-[#05b84a] hover:scale-105 hover:shadow-[0_6px_32px_rgba(6,199,85,0.55)] active:scale-100 transition-all duration-200"
      >
        <LineIcon />
        加入 LINE
      </a>
    </>
  );
}
