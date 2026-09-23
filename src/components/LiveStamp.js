"use client";
// LiveStamp.js (src/components/LiveStamp.js) · updated 23.09.2026 07:37 (Asia/Jerusalem)
// Shows on the capture form the exact date+time the job will be stamped with (= created_at on save).
import { useEffect, useState } from "react";
import { stampFull } from "@/lib/datestamp";

export default function LiveStamp() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  return <div className="lstamp">📅 חותמת תאריך לפרויקט: <b>{stampFull(now)}</b> (נשמרת אוטומטית)</div>;
}
