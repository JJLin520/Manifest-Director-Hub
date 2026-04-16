import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, Registration, PAYMENT_LABELS, PAYMENT_COLORS } from "@/lib/api";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

export default function Registrations() {
  const qc = useQueryClient();
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

  const filtered = registrations.filter((r) => {
    const matchSearch =
      !search ||
      r.contactName.includes(search) ||
      r.contactPhone.includes(search) ||
      r.eventName.includes(search) ||
      (r.contactLineId || "").includes(search);
    const matchPayment = !filterPayment || r.paymentStatus === filterPayment;
    return matchSearch && matchPayment;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary">報名記錄</h2>
          <p className="text-muted-foreground text-sm mt-1">共 {filtered.length} 筆報名資料</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              className="pl-8 pr-3 py-2 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground w-48"
              placeholder="搜尋姓名 / 電話 / Line ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none pl-3 pr-8 py-2 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
            >
              <option value="">全部付款狀態</option>
              {Object.entries(PAYMENT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground">載入中…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          {registrations.length === 0 ? "尚無報名紀錄" : "找不到符合條件的記錄"}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground border-b border-border">
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">姓名</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">電話</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">Line ID</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">活動</th>
                <th className="text-center px-4 py-3 font-medium whitespace-nowrap">人數</th>
                <th className="text-center px-4 py-3 font-medium whitespace-nowrap">點燈</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">得知管道</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">付款狀態</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">備註</th>
                <th className="text-right px-4 py-3 font-medium whitespace-nowrap">報名日期</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-card/60 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{r.contactName}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.contactPhone}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.contactLineId || "—"}</td>
                  <td className="px-4 py-3 text-foreground whitespace-nowrap">{r.eventName}</td>
                  <td className="px-4 py-3 text-center text-foreground">{r.attendees}</td>
                  <td className="px-4 py-3 text-center">
                    {r.hasLantern === "yes" ? (
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" title="有點燈" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.referralSource || "—"}</td>
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
                      <div className="flex gap-1">
                        <input
                          autoFocus
                          className="flex-1 text-xs bg-input border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
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
                      </div>
                    ) : (
                      <span
                        className="text-xs text-muted-foreground cursor-pointer hover:text-foreground truncate block"
                        onClick={() => setEditingNotes({ id: r.id, notes: r.notes || "" })}
                        title={r.notes || "點擊新增備註"}
                      >
                        {r.notes || <span className="text-border">點擊新增</span>}
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
