import { useQuery } from "@tanstack/react-query";
import { apiFetch, Registration, Contact, PAYMENT_LABELS, STAGE_LABELS } from "@/lib/api";
import { Users, ClipboardList, CheckCircle, Clock } from "lucide-react";

export default function Dashboard() {
  const { data: registrations = [] } = useQuery<Registration[]>({
    queryKey: ["admin-registrations"],
    queryFn: () => apiFetch("/admin/registrations"),
  });

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["admin-contacts"],
    queryFn: () => apiFetch("/admin/contacts"),
  });

  const paidCount = registrations.filter((r) => r.paymentStatus === "paid").length;
  const unpaidCount = registrations.filter((r) => r.paymentStatus === "unpaid").length;
  const totalAttendees = registrations.reduce((sum, r) => sum + parseInt(r.attendees || "1"), 0);
  const lanternCount = registrations.filter((r) => r.hasLantern === "yes").length;

  const paymentBreakdown = Object.entries(PAYMENT_LABELS).map(([key, label]) => ({
    key,
    label,
    count: registrations.filter((r) => r.paymentStatus === key).length,
  }));

  const stageBreakdown = Object.entries(STAGE_LABELS).map(([key, label]) => ({
    key,
    label,
    count: contacts.filter((c) => c.customerStage === key).length,
  }));

  const recent = [...registrations].slice(0, 5);

  const stats = [
    { label: "客戶總數", value: contacts.length, icon: Users, color: "text-blue-400" },
    { label: "報名總數", value: registrations.length, icon: ClipboardList, color: "text-purple-400" },
    { label: "已付款", value: paidCount, icon: CheckCircle, color: "text-emerald-400" },
    { label: "待付款", value: unpaidCount, icon: Clock, color: "text-orange-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-primary">總覽</h2>
        <p className="text-muted-foreground text-sm mt-1">宇宙序能教育品牌 CRM 管理後台</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-card-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Attendees / Lantern */}
        <div className="bg-card border border-card-border rounded-lg p-4 space-y-3">
          <h3 className="font-serif text-base font-semibold text-primary">活動數據</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">報名總人數</span>
            <span className="font-semibold text-foreground">{totalAttendees} 人</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">點燈人數</span>
            <span className="font-semibold text-foreground">{lanternCount} 份</span>
          </div>
        </div>

        {/* Payment breakdown */}
        <div className="bg-card border border-card-border rounded-lg p-4 space-y-3">
          <h3 className="font-serif text-base font-semibold text-primary">付款狀態</h3>
          {paymentBreakdown.map(({ key, label, count }) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold text-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stage breakdown */}
      <div className="bg-card border border-card-border rounded-lg p-4">
        <h3 className="font-serif text-base font-semibold text-primary mb-3">客戶階段分佈</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {stageBreakdown.filter((s) => s.count > 0 || true).map(({ key, label, count }) => (
            <div key={key} className="flex justify-between text-sm border border-border rounded p-2">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold text-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent registrations */}
      <div className="bg-card border border-card-border rounded-lg p-4">
        <h3 className="font-serif text-base font-semibold text-primary mb-3">最新報名</h3>
        {recent.length === 0 ? (
          <p className="text-muted-foreground text-sm">尚無報名紀錄</p>
        ) : (
          <div className="space-y-2">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                <div>
                  <span className="font-medium text-foreground">{r.contactName}</span>
                  <span className="text-muted-foreground ml-2">{r.eventName}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(r.submittedAt).toLocaleDateString("zh-TW")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
