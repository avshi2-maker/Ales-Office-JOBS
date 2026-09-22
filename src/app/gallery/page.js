// gallery/page.js (src/app/gallery/page.js) · updated 22.09.2026 13:06 (Asia/Jerusalem)
"use client";
import { useEffect, useMemo, useState } from "react";
import PinGate from "@/components/PinGate";
import Brand from "@/components/Brand";
import GalleryFilters from "@/components/GalleryFilters";
import GalleryGrid from "@/components/GalleryGrid";
import { fetchJobs, supabaseReady } from "@/lib/supabase";

export default function Gallery() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [type, setType] = useState("all");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    let live = true;
    async function load() {
      if (!supabaseReady) { setErr("Supabase לא מוגדר"); setLoading(false); return; }
      try {
        const data = await fetchJobs();
        if (live) setJobs(data);
      } catch (e) {
        if (live) setErr(e.message || "טעינה נכשלה");
      }
      if (live) setLoading(false);
    }
    load();
    return () => { live = false; };
  }, []);

  const cities = useMemo(() => {
    const s = new Set(jobs.map((j) => j.city).filter(Boolean));
    return Array.from(s).sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return jobs.filter((j) => {
      if (type !== "all" && j.job_type !== type) return false;
      if (city && j.city !== city) return false;
      if (needle) {
        const hay = [j.title, j.customer, j.city, j.notes, j.ales_quote,
          JSON.stringify(j.fields || {})].join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [jobs, type, city, q]);

  return (
    <PinGate>
      <div className="app">
        <Brand />
        <div className="wrap">
          <div className="card">
            <h2 className="fr">גלריית הפרויקטים</h2>
            <p className="hint">כל העבודות במקום אחד — סנן ושלח ללקוחות פוטנציאליים.</p>
            <GalleryFilters
              active={type} onType={setType}
              q={q} onQ={setQ}
              cities={cities} city={city} onCity={setCity}
            />
          </div>
          {loading ? <div className="center">טוען...</div> : null}
          {err ? <div className="warn">{err}</div> : null}
          {!loading && !err ? <GalleryGrid jobs={filtered} /> : null}
        </div>
      </div>
    </PinGate>
  );
}
