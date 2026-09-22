// jobtypes.js (src/lib/jobtypes.js) · updated 22.09.2026 12:55 (Asia/Jerusalem)
// Single field-def table that drives the dynamic form, the gallery filters,
// and how a job renders. Add a 5th job line = add one entry here.

// field: { key, label, type, placeholder?, options?, full? }
// type: text | textarea | select | number | stars | check

export const JOB_TYPES = [
  {
    id: "sinks",
    label: "כיורים",
    icon: "🪨",
    fields: [
      { key: "sink_type", label: "סוג הכיור", type: "select",
        options: ["כיור אמבטיה תלוי", "כיור אמבטיה מובנה", "כיור מטבח", "משטח / קאונטר", "כיור trough ארוך", "אחר"] },
      { key: "stone", label: "סוג האבן", type: "select",
        options: ["Calacatta", "Statuario", "Saint Laurent", "מדגסקר", "גרניט פורצלן", "אבן אקזוטית אחרת"] },
      { key: "size", label: "מידות", type: "text", placeholder: "1.60 מ׳ ללא חיבורים" },
      { key: "prod_time", label: "זמן ייצור", type: "text", placeholder: "3 שבועות" },
      { key: "story", label: "סיפור / אתגר הפרויקט", type: "textarea", full: true,
        placeholder: "חלל לא סטנדרטי, אבן נדירה, מידה ענקית..." },
    ],
  },
  {
    id: "renovation",
    label: "שיפוצים",
    icon: "🧱",
    fields: [
      { key: "scope", label: "פנים / חוץ", type: "select", options: ["פנים", "חוץ", "פנים + חוץ"] },
      { key: "work", label: "סוג העבודה", type: "text", placeholder: "חיפוי שיש, ריצוף, מקלחת..." },
      { key: "area", label: 'שטח (מ"ר)', type: "number", placeholder: "45" },
      { key: "duration", label: "משך העבודה", type: "text", placeholder: "10 ימים" },
      { key: "story", label: "סיפור / אתגר הפרויקט", type: "textarea", full: true,
        placeholder: "מה היה מיוחד או מורכב בעבודה הזו?" },
    ],
  },
  {
    id: "doors",
    label: "דלתות שיש",
    icon: "🚪",
    fields: [
      { key: "door_kind", label: "סוג הדלת", type: "select", options: ["דלת כניסה חיצונית", "שער כניסה", "דלת פנים", "אחר"] },
      { key: "count", label: "כמות דלתות", type: "number", placeholder: "1" },
      { key: "stone", label: "סוג האבן", type: "select",
        options: ["Calacatta", "Statuario", "Saint Laurent", "מדגסקר", "גרניט פורצלן", "אבן אקזוטית אחרת"] },
      { key: "finish", label: "גימור", type: "text", placeholder: "מלוטש / מוברש / מתכת משולבת" },
      { key: "story", label: "סיפור / אתגר הפרויקט", type: "textarea", full: true,
        placeholder: "מידות חריגות, התקנה מורכבת..." },
    ],
  },
  {
    id: "testimonial",
    label: "המלצות",
    icon: "⭐",
    fields: [
      { key: "project_ref", label: "הפרויקט", type: "text", placeholder: "כיור שיש שחור לאמבטיה ראשית" },
      { key: "rating", label: "דירוג", type: "stars" },
      { key: "quote", label: "טקסט ההמלצה (במילים של הלקוח)", type: "textarea", full: true,
        placeholder: "אפשר להקליט בטלפון ולתמלל כאן" },
      { key: "permission", label: "הלקוח אישר פרסום ההמלצה, התמונות והווידאו ברשתות ובאתר Marble Art", type: "check", full: true },
    ],
  },
];

export function typeById(id) {
  return JOB_TYPES.find((t) => t.id === id) || null;
}

export function typeLabel(id) {
  const t = typeById(id);
  return t ? t.label : id;
}
