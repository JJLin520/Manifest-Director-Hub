import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, Contact, PAYMENT_LABELS, PAYMENT_COLORS, STAGE_LABELS, STAGE_COLORS } from "@/lib/api";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

export default function Contacts() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [editingNotes, setEditingNotes] = useState<{ id: number; notes: string } | null>(null);
  const [editingEmail, setEditingEmail] = useState<{ id: number; email: string } | null>(null);

  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ["admin-contacts"],
    queryFn: () => apiFetch("/admin/contacts"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, string> }) =>
      apiFetch(`/admin/contacts/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-contacts"] }),
  });

  const filtered = contacts.filter((c) => {
    const matchSearch =
      !search ||
      c.name.includes(search) ||
      c.phone.includes(search) ||
      (c.lineId || "").includes(search) ||
      (c.email || "").includes(search);
    const matchStage = !filterStage || c.customerStage === filterStage;
    return matchSearch && matchStage;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary">客戶管理</h2>
          <p className="text-muted-foreground text-sm mt-1">共 {filtered.length} 位客戶</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              className="pl-8 pr-3 py-2 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground w-48"
              placeholder="搜尋姓名 / 電話 / 信箱"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none pl-3 pr-8 py-2 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
            >
              <option value="">全部客戶階段</option>
              {Object.entries(STAGE_LABELS).map(([k, v]) => (
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
          {contacts.length === 0 ? "尚無客戶資料" : "找不到符合條件的客戶"}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground border-b border-border">
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">姓名</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">電話</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">Line ID</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">Email</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">付款狀態</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">客戶階段</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">備註</th>
                <th className="text-right px-4 py-3 font-medium whitespace-nowrap">建立日期</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-card/60 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{c.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{c.lineId || "—"}</td>

                  {/* Email (editable) */}
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {editingEmail?.id === c.id ? (
                      <input
                        autoFocus
                        className="text-xs bg-input border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary text-foreground w-36"
                        value={editingEmail.email}
                        onChange={(e) => setEditingEmail({ id: c.id, email: e.target.value })}
                        onBlur={() => {
                          updateMutation.mutate({ id: c.id, payload: { email: editingEmail.email } });
                          setEditingEmail(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateMutation.mutate({ id: c.id, payload: { email: editingEmail.email } });
                            setEditingEmail(null);
                          }
                          if (e.key === "Escape") setEditingEmail(null);
                        }}
                      />
                    ) : (
                      <span
                        className="cursor-pointer hover:text-foreground text-xs"
                        onClick={() => setEditingEmail({ id: c.id, email: c.email || "" })}
                        title="點擊編輯信箱"
                      >
                        {c.email || <span className="text-border">點擊新增</span>}
                      </span>
                    )}
                  </td>

                  {/* Payment status */}
                  <td className="px-4 py-3">
                    <select
                      className={`appearance-none text-xs px-2 py-1 rounded border font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary ${PAYMENT_COLORS[c.paymentStatus] || ""}`}
                      value={c.paymentStatus}
                      onChange={(e) =>
                        updateMutation.mutate({ id: c.id, payload: { paymentStatus: e.target.value } })
                      }
                    >
                      {Object.entries(PAYMENT_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </td>

                  {/* Stage */}
                  <td className="px-4 py-3">
                    <select
                      className={`appearance-none text-xs px-2 py-1 rounded border font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary ${STAGE_COLORS[c.customerStage] || ""}`}
                      value={c.customerStage}
                      onChange={(e) =>
                        updateMutation.mutate({ id: c.id, payload: { customerStage: e.target.value } })
                      }
                    >
                      {Object.entries(STAGE_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </td>

                  {/* Notes */}
                  <td className="px-4 py-3 max-w-[180px]">
                    {editingNotes?.id === c.id ? (
                      <input
                        autoFocus
                        className="w-full text-xs bg-input border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                        value={editingNotes.notes}
                        onChange={(e) => setEditingNotes({ id: c.id, notes: e.target.value })}
                        onBlur={() => {
                          updateMutation.mutate({ id: c.id, payload: { notes: editingNotes.notes } });
                          setEditingNotes(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateMutation.mutate({ id: c.id, payload: { notes: editingNotes.notes } });
                            setEditingNotes(null);
                          }
                          if (e.key === "Escape") setEditingNotes(null);
                        }}
                      />
                    ) : (
                      <span
                        className="text-xs text-muted-foreground cursor-pointer hover:text-foreground truncate block"
                        onClick={() => setEditingNotes({ id: c.id, notes: c.notes || "" })}
                        title={c.notes || "點擊新增備註"}
                      >
                        {c.notes || <span className="text-border">點擊新增</span>}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleDateString("zh-TW")}
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
