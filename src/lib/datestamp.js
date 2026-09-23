// datestamp.js (src/lib/datestamp.js) · updated 23.09.2026 07:37 (Asia/Jerusalem)
// One place for Hebrew/Israel-time date formatting (clock, project stamps, share text).

const TZ = "Asia/Jerusalem";

export function stampDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("he-IL", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric" });
  } catch (e) { return ""; }
}

export function stampTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString("he-IL", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
  } catch (e) { return ""; }
}

export function stampFull(iso) {
  const d = stampDate(iso);
  const t = stampTime(iso);
  return d && t ? d + " · " + t : d;
}

export function weekdayHe(iso) {
  try {
    return new Date(iso).toLocaleDateString("he-IL", { timeZone: TZ, weekday: "long" });
  } catch (e) { return ""; }
}
