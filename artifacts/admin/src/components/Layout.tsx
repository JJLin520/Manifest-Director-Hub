import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, ClipboardList, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { logout } from "@/lib/auth";

const nav = [
  { href: "/", icon: LayoutDashboard, label: "總覽" },
  { href: "/registrations", icon: ClipboardList, label: "報名記錄" },
  { href: "/contacts", icon: Users, label: "客戶管理" },
];

export default function Layout({
  children,
  onLogout,
}: {
  children: React.ReactNode;
  onLogout: () => void;
}) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    onLogout();
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-sidebar border-r border-sidebar-border z-30
          flex flex-col transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="px-6 py-6 border-b border-sidebar-border">
          <p className="text-xs text-muted-foreground mb-1 font-sans">宇宙序能教育品牌</p>
          <h1 className="font-serif text-lg font-bold text-primary leading-tight">後台管理系統</h1>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, icon: Icon, label }) => {
            const active = location === href;
            return (
              <Link key={href} href={href}>
                <div
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-sidebar-border space-y-3">
          <p className="text-xs text-muted-foreground px-3">Coach JJ 林炳騰</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent-foreground transition-colors"
          >
            <LogOut size={18} />
            登出
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-sidebar border-b border-sidebar-border">
          <button
            onClick={() => setOpen(!open)}
            className="text-sidebar-foreground p-1"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-serif text-primary font-semibold">後台管理系統</span>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
