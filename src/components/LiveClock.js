"use client";
// LiveClock.js (src/components/LiveClock.js) · updated 23.09.2026 07:37 (Asia/Jerusalem)
// Header clock: Hebrew weekday + date + HH:MM:SS, Israel time. Renders after mount (no hydration mismatch).
import { useEffect, useState } from "react";
import { stampDate, weekdayHe } from "@/lib/datestamp";

export default function LiveClock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <div className="clock" aria-hidden="true" />;

  const time = now.toLocaleTimeString("he-IL", { timeZone: "Asia/Jerusalem", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return (
    <div className="clock">
      <span className="clock-time">{time}</span>
      <span className="clock-date">{weekdayHe(now)} · {stampDate(now)}</span>
    </div>
  );
}
