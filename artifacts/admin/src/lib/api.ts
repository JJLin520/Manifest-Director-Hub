export const API_BASE = "/api";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export type Registration = {
  id: number;
  eventName: string;
  attendees: string;
  hasLantern: string | null;
  referralSource: string | null;
  paymentStatus: string;
  notes: string | null;
  submittedAt: string;
  contactId: number;
  contactName: string;
  contactPhone: string;
  contactLineId: string | null;
  contactEmail: string | null;
  contactStage: string;
};

export type Contact = {
  id: number;
  name: string;
  phone: string;
  lineId: string | null;
  email: string | null;
  paymentStatus: string;
  customerStage: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export const PAYMENT_LABELS: Record<string, string> = {
  unpaid: "未付款",
  paid: "已付款",
  partial: "部分付款",
  refunded: "已退款",
};

export const STAGE_LABELS: Record<string, string> = {
  registered: "已報名",
  contacted: "已聯絡",
  attended: "已出席",
  follow_up: "需追蹤",
  converted: "已轉換",
  inactive: "已休眠",
};

export const PAYMENT_COLORS: Record<string, string> = {
  unpaid: "bg-red-900/40 text-red-300 border-red-700/40",
  paid: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  partial: "bg-yellow-900/40 text-yellow-300 border-yellow-700/40",
  refunded: "bg-slate-700/40 text-slate-300 border-slate-600/40",
};

export const STAGE_COLORS: Record<string, string> = {
  registered: "bg-blue-900/40 text-blue-300 border-blue-700/40",
  contacted: "bg-purple-900/40 text-purple-300 border-purple-700/40",
  attended: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  follow_up: "bg-orange-900/40 text-orange-300 border-orange-700/40",
  converted: "bg-yellow-900/40 text-yellow-300 border-yellow-700/40",
  inactive: "bg-slate-700/40 text-slate-400 border-slate-600/40",
};
