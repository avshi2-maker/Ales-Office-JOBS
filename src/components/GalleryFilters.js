// GalleryFilters.js (src/components/GalleryFilters.js) · updated 22.09.2026 13:02 (Asia/Jerusalem)
"use client";
import { JOB_TYPES } from "@/lib/jobtypes";

// props: active (id|'all'), onType(id), q, onQ, cities[], city, onCity
export default function GalleryFilters({ active, onType, q, onQ, cities, city, onCity }) {
  return (
    <div>
      <div className="filters" style={{ marginBottom: 10 }}>
        <button className={"chip" + (active === "all" ? " on" : "")} onClick={() => onType("all")}>הכל</button>
        {JOB_TYPES.map((t) => (
          <button key={t.id} className={"chip" + (active === t.id ? " on" : "")} onClick={() => onType(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div className="grid2">
        <input value={q} onChange={(e) => onQ(e.target.value)} placeholder="🔎 חיפוש חופשי (כותרת / לקוח / אבן)" />
        <select value={city} onChange={(e) => onCity(e.target.value)}>
          <option value="">כל הערים</option>
          {cities.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>
    </div>
  );
}
