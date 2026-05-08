import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE as apiBase } from "@/lib/api";
import { Plus, Radio, Users, CalendarClock } from "lucide-react";

interface Session {
  id: number;
  sessionNumber: number;
  sessionDate: string;
  title: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

interface NumerologyReg {
  id: number;
  sessionId: number;
  sessionNumber: number;
  sessionDate: string;
  sessionTitle: string;
  contactId: number;
  contactName: string;
  contactPhone: string;
  contactLineId: string | null;
  contactEmail: string | null;
  lifeNumber: string | null;
  referralSource: string | null;
  submittedAt: string;
}

function fmt(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function NumerologySessions() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"sessions" | "registrations">("sessions");
  const [showNewForm, setShowNewForm] = useState(false);
  const [filterSession, setFilterSession] = useState<string>("all");
  const [form, setForm] = useState({
    sessionNumber: "",
    sessionDate: "",
    title: "宇宙數字原力學 線上直播講座",
    description: "",
    isActive: true,
  });

  const { data: sessions = [], isLoading: sLoad } = useQuery<Session[]>({
    queryKey: ["numerology-sessions"],
    queryFn: () => fetch(`${apiBase}/admin/numerology/sessions`, { credentials: "include" }).then(r => r.json()),
  });

  const { data: regs = [], isLoading: rLoad } = useQuery<NumerologyReg[]>({
    queryKey: ["numerology-registrations"],
    queryFn: () => fetch(`${apiBase}/admin/numerology/registrations`, { credentials: "include" }).then(r => r.json()),
  });

  const createSession = useMutation({
    mutationFn: (body: object) =>
      fetch(`${apiBase}/admin/numerology/sessions`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(r => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["numerology-sessions"] });
      setShowNewForm(false);
      setForm({ sessionNumber: "", sessionDate: "", title: "宇宙數字原力學 線上直播講座", description: "", isActive: true });
    },
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      fetch(`${apiBase}/admin/numerology/sessions/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["numerology-sessions"] }),
  });

  const filteredRegs = filterSession === "all" ? regs : regs.filter(r => r.sessionId === parseInt(filterSession));

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.sessionNumber || !form.sessionDate) return;
    createSession.mutate({
      sessionNumber: parseInt(form.sessionNumber),
      sessionDate: form.sessionDate,
      title: form.title,
      description: form.description || null,
      isActive: form.isActive,
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-serif text-primary">數字講座管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理每月線上直播場次與報名紀錄</p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 bg-primary/90 hover:bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Plus size={15} />
          新增場次
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">總場次</p>
          <p className="text-2xl font-bold font-serif">{sessions.length}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">總報名人數</p>
          <p className="text-2xl font-bold font-serif">{regs.length}</p>
        </div>
        <div className="bg-card border rounded-xl p-4 col-span-2 md:col-span-1">
          <p className="text-xs text-muted-foreground mb-1">目前開放場次</p>
          {sessions.find(s => s.isActive) ? (
            <p className="text-base font-semibold text-primary">第 {sessions.find(s => s.isActive)?.sessionNumber} 場</p>
          ) : (
            <p className="text-sm text-muted-foreground">（無）</p>
          )}
        </div>
      </div>

      {/* New Session Form */}
      {showNewForm && (
        <div className="bg-card border rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><CalendarClock size={16} /> 新增講座場次</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">場次編號 *</label>
              <input
                type="number"
                min={1}
                value={form.sessionNumber}
                onChange={e => setForm(f => ({ ...f, sessionNumber: e.target.value }))}
                placeholder="例如：1"
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">講座日期時間 *</label>
              <input
                type="datetime-local"
                value={form.sessionDate}
                onChange={e => setForm(f => ({ ...f, sessionDate: e.target.value }))}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-muted-foreground mb-1">標題</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-muted-foreground mb-1">備註說明</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder="可選填（會顯示在活動頁面）"
                className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm text-foreground">設為目前開放報名場次（會自動關閉其他場次）</label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={createSession.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {createSession.isPending ? "儲存中…" : "建立場次"}
              </button>
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-5 py-2 rounded-md text-sm border hover:bg-muted transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setTab("sessions")}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === "sessions" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Radio size={14} /> 場次列表
        </button>
        <button
          onClick={() => setTab("registrations")}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === "registrations" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Users size={14} /> 報名紀錄 {regs.length > 0 && <span className="ml-1 bg-primary/15 text-primary text-xs px-1.5 py-0.5 rounded-full">{regs.length}</span>}
        </button>
      </div>

      {/* Sessions Table */}
      {tab === "sessions" && (
        <div className="bg-card border rounded-xl overflow-hidden">
          {sLoad ? (
            <div className="p-8 text-center text-muted-foreground text-sm">載入中…</div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">尚無場次，請點上方「新增場次」</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">場次</th>
                  <th className="text-left px-4 py-3">日期時間</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">標題</th>
                  <th className="text-left px-4 py-3">報名人數</th>
                  <th className="text-left px-4 py-3">狀態</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => {
                  const count = regs.filter(r => r.sessionId === s.id).length;
                  return (
                    <tr key={s.id} className={`border-t border-border ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                      <td className="px-4 py-3 font-semibold text-primary">第 {s.sessionNumber} 場</td>
                      <td className="px-4 py-3 text-muted-foreground">{fmt(s.sessionDate)}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground max-w-[200px] truncate">{s.title}</td>
                      <td className="px-4 py-3">{count} 人</td>
                      <td className="px-4 py-3">
                        {s.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-xs bg-green-500/15 text-green-600 px-2 py-1 rounded-full font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            開放中
                          </span>
                        ) : (
                          <button
                            onClick={() => toggleActive.mutate({ id: s.id, isActive: true })}
                            className="text-xs border border-border hover:border-primary hover:text-primary px-2 py-1 rounded-full transition-colors"
                          >
                            設為開放
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Registrations Table */}
      {tab === "registrations" && (
        <div>
          {/* Filter */}
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm text-muted-foreground">篩選場次：</label>
            <select
              value={filterSession}
              onChange={e => setFilterSession(e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm bg-background"
            >
              <option value="all">全部場次</option>
              {sessions.map(s => (
                <option key={s.id} value={s.id}>第 {s.sessionNumber} 場（{fmt(s.sessionDate)}）</option>
              ))}
            </select>
          </div>

          <div className="bg-card border rounded-xl overflow-x-auto">
            {rLoad ? (
              <div className="p-8 text-center text-muted-foreground text-sm">載入中…</div>
            ) : filteredRegs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">尚無報名紀錄</div>
            ) : (
              <table className="w-full text-sm min-w-[640px]">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3">姓名</th>
                    <th className="text-left px-4 py-3">手機</th>
                    <th className="text-left px-4 py-3">LINE ID</th>
                    <th className="text-left px-4 py-3">場次</th>
                    <th className="text-left px-4 py-3">來源</th>
                    <th className="text-left px-4 py-3">報名時間</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegs.map((r, i) => (
                    <tr key={r.id} className={`border-t border-border ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                      <td className="px-4 py-3 font-medium">{r.contactName}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{r.contactPhone}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.contactLineId || "—"}</td>
                      <td className="px-4 py-3 text-primary font-medium">第 {r.sessionNumber} 場</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.referralSource || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{fmt(r.submittedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
