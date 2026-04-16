import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, Registration, PAYMENT_LABELS, PAYMENT_COLORS } from "@/lib/api";
import { useState, useMemo } from "react";
import { Search, ChevronRight, ArrowLeft, Users, CheckCircle, Clock, Flame } from "lucide-react";

export default function Registrations() {
  const qc = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [editingNotes, setEditingNotes] = useState<{ id: number; notes: string } | null>(null);

  const { data: registrations = [], isLoading } = useQuery<Registration[]>({
    queryKey: ["admin-registrations"],
    queryFn: () => apiFetch("/admin/registrations"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, string> }) =>
      apiFetch(`/admin/registrations/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-registrations"] }),
  });

  // Group by event name
  const eventGroups = useMemo(() => {
    const map: Record<string, Registration[]> = {};
    for (const r of registrations) {
      if (!map[r.eventName]) map[r.eventName] = [];
      map[r.eventName].push(r);
    }
    // Sort events by latest submission
    return Object.entries(map).sort((a, b) => {
      const aLatest = Math.max(...a[1].map(r => new Date(r.submittedAt).getTime()));
      const bLatest = Math.max(...b[1].map(r => new Date(r.submittedAt).getTime()));
      return bLatest - aLatest;
    });
  }, [registrations]);

  const selectedRegistrations = useMemo(() => {
    if (!selectedEvent) return [];
    const rows = registrations.filter(r => r.eventName === selectedEvent);
    return rows.filter(r => {
      const matchSearch =
        !search ||
        r.contactName.includes(search) ||
        r.contactPhone.includes(search) ||
        (r.contactLineId || "").includes(search);
      const matchPayment = !filterPayment || r.paymentStatus === filterPayment;
      return matchSearch && matchPayment;
    });
  }, [registrations, selectedEvent, search, filterPayment]);

  // ── Event list view ──
  if (!selectedEvent) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary">報名記錄</h2>
          <p className="text-muted-foreground text-sm mt-1">選擇活動查看報名名單</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">載入中…</div>
        ) : eventGroups.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">尚無報名紀錄</div>
        ) : (
          <div className="space-y-3">
            {eventGroups.map(([eventName, rows]) => {
              const totalAttendees = rows.reduce((sum, r) => sum + parseInt(r.attendees || "1"), 0);
              const paidCount = rows.filter(r => r.paymentStatus === "paid").length;
              const unpaidCount = rows.filter(r => r.paymentStatus === "unpaid").length;
              const lanternCount = rows.filter(r => r.hasLantern === "yes").length;
              const latest = rows.reduce((latest, r) =>
                new Date(r.submittedAt) > new Date(latest) ? r.submittedAt : latest,
                rows[0].submittedAt
              );

              return (
                <button
                  key={eventName}
                  onClick={() => { setSelectedEvent(eventName); setSearch(""); setFilterPayment(""); }}
                  className="w-full text-left bg-card border border-card-border rounded-lg p-5 hover:border-primary/40 hover:bg-card/80 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {eventName}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        最新報名：{new Date(latest).toLocaleDateString("zh-TW")}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors mt-0.5 shrink-0" />
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Stat icon={<Users size={13} />} label="報名人數" value={`${rows.length} 筆`} color="text-blue-400" />
                    <Stat icon={<Users size={13} />} label="總出席人數" value={`${totalAttendees} 人`} color="text-purple-400" />
                    <Stat icon={<CheckCircle size={13} />} label="已付款" value={`${paidCount} 筆`} color="text-emerald-400" />
                    <Stat icon={<Clock size={13} />} label="未付款" value={`${unpaidCount} 筆`} color="text-orange-400" />
                  </div>

                  {lanternCount > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-yellow-400/80">
                      <Flame size={12} />
                      點燈 {lanternCount} 份
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── Event detail view ──
  const allForEvent = registrations.filter(r => r.eventName === selectedEvent);
  const totalAttendees = allForEvent.reduce((sum, r) => sum + parseInt(r.attendees || "1"), 0);
  const paidCount = allForEvent.filter(r => r.paymentStatus === "paid").length;
  const lanternCount = allForEvent.filter(r => r.hasLantern === "yes").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => { setSelectedEvent(null); setSearch(""); setFilterPayment(""); }}
          className="mt-1 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-0.5">報名記錄</p>
          <h2 className="font-serif text-xl font-bold text-primary leading-snug">{selectedEvent}</h2>
          <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users size={11} className="text-blue-400" /> {allForEvent.length} 筆報名</span>
            <span className="flex items-center gap-1"><Users size={11} className="text-purple-400" /> {totalAttendees} 人出席</span>
            <span className="flex items-center gap-1"><CheckCircle size={11} className="text-emerald-400" /> {paidCount} 筆已付款</span>
            {lanternCount > 0 && <span className="flex items-center gap-1"><Flame size={11} className="text-yellow-400" /> 點燈 {lanternCount} 份</span>}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
          <input
            className="pl-8 pr-3 py-2 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground w-52"
            placeholder="搜尋姓名 / 電話 / Line ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
        >
          <option value="">全部付款狀態</option>
          {Object.entries(PAYMENT_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <span className="self-center text-xs text-muted-foreground pl-1">
          顯示 {selectedRegistrations.length} / {allForEvent.length} 筆
        </span>
      </div>

      {/* Table */}
      {selectedRegistrations.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">找不到符合條件的記錄</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground border-b border-border">
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">#</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">姓名</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">電話</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">Line ID</th>
                <th className="text-center px-4 py-3 font-medium whitespace-nowrap">人數</th>
                <th className="text-center px-4 py-3 font-medium whitespace-nowrap">點燈</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">得知管道</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">付款狀態</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">備註</th>
                <th className="text-right px-4 py-3 font-medium whitespace-nowrap">報名日期</th>
              </tr>
            </thead>
            <tbody>
              {selectedRegistrations.map((r, idx) => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-card/60 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground text-xs">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{r.contactName}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.contactPhone}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.contactLineId || "—"}</td>
                  <td className="px-4 py-3 text-center text-foreground font-medium">{r.attendees}</td>
                  <td className="px-4 py-3 text-center">
                    {r.hasLantern === "yes" ? (
                      <Flame size={14} className="inline text-yellow-400" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">{r.referralSource || "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      className={`appearance-none text-xs px-2 py-1 rounded border font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary ${PAYMENT_COLORS[r.paymentStatus] || ""}`}
                      value={r.paymentStatus}
                      onChange={(e) =>
                        updateMutation.mutate({ id: r.id, payload: { paymentStatus: e.target.value } })
                      }
                    >
                      {Object.entries(PAYMENT_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 max-w-[180px]">
                    {editingNotes?.id === r.id ? (
                      <input
                        autoFocus
                        className="w-full text-xs bg-input border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                        value={editingNotes.notes}
                        onChange={(e) => setEditingNotes({ id: r.id, notes: e.target.value })}
                        onBlur={() => {
                          updateMutation.mutate({ id: r.id, payload: { notes: editingNotes.notes } });
                          setEditingNotes(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateMutation.mutate({ id: r.id, payload: { notes: editingNotes.notes } });
                            setEditingNotes(null);
                          }
                          if (e.key === "Escape") setEditingNotes(null);
                        }}
                      />
                    ) : (
                      <span
                        className="text-xs text-muted-foreground cursor-pointer hover:text-foreground truncate block"
                        onClick={() => setEditingNotes({ id: r.id, notes: r.notes || "" })}
                        title={r.notes || "點擊新增備註"}
                      >
                        {r.notes || <span className="text-border italic">點擊新增</span>}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(r.submittedAt).toLocaleDateString("zh-TW")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2 bg-muted/30 rounded-md px-3 py-2">
      <span className={color}>{icon}</span>
      <div>
        <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-foreground leading-none">{value}</p>
      </div>
    </div>
  );
}
