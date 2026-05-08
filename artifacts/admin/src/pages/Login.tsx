import { useState } from "react";
import { login } from "@/lib/auth";

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "登入失敗，請再試一次");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs tracking-widest text-muted-foreground mb-1 font-sans">宇宙序能教育品牌</p>
          <h1 className="text-2xl font-serif font-bold text-primary">後台管理系統</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-sidebar border border-sidebar-border rounded-xl p-8 space-y-5 shadow-xl"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">帳號</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-sidebar-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="請輸入帳號"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">密碼</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-sidebar-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="請輸入密碼"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-700/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {loading ? "登入中…" : "登入"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Coach JJ 林炳騰 · 宇宙序能
        </p>
      </div>
    </div>
  );
}
