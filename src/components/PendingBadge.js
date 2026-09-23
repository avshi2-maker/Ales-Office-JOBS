"use client";
// PendingBadge.js (src/components/PendingBadge.js) · updated 23.09.2026 10:32 (Asia/Jerusalem)
// Header badge: offline indicator + number of files saved on the phone waiting to upload. Tap = send now.
import { usePendingCount } from "@/lib/useQueue";
import { processQueue } from "@/lib/offlineQueue";

export default function PendingBadge() {
  const { pending, online } = usePendingCount();
  if (!pending && online) return null;
  const txt = !online ? "📴 אין קליטה" + (pending ? " · ⏳ " + pending : "") : "⏳ " + pending + " להעלאה";
  return <button type="button" className="pbadge" onClick={() => processQueue()} title="שלח עכשיו">{txt}</button>;
}
