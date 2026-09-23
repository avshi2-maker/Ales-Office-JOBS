"use client";
// JobSummary.js (src/components/JobSummary.js) · updated 23.09.2026 07:51 (Asia/Jerusalem)
// Read-only header of an existing job on /job/[id]: stamp, title, type, status, before-media strip.
import { typeLabel } from "@/lib/jobtypes";
import { stampFull, stampDate } from "@/lib/datestamp";

export default function JobSummary({ job }) {
  const media = (job.media || []).slice(0, 4);
  const done = job.status === "finished";
  const f = job.fields || {};
  return (
    <div className="card">
      <div className="dstamp">📅 {stampFull(job.created_at)}</div>
      <h2 className="fr" style={{ margin: "4px 0" }}>{job.title || job.customer || "ללא כותרת"} <span className="tag">{typeLabel(job.job_type)}</span></h2>
      <div className="meta">{[job.city, job.customer, f.stone, f.size].filter(Boolean).join(" · ")}</div>
      <div style={{ marginTop: 8 }}>
        {done
          ? <span className="stbadge fin">✅ הסתיים · {stampDate(job.finish_date || job.finished_at)}</span>
          : <span className="stbadge open">🛠️ בביצוע</span>}
      </div>
      {(job.sketches || []).length ? (
        <div style={{ marginTop: 10 }}>
          <div className="meta">📐 שרטוטים ({job.sketches.length})</div>
          <div className="thumbs">{job.sketches.map((m, i) => <a key={i} href={m.url} target="_blank" rel="noreferrer"><img className="thumb" src={m.url} alt="שרטוט" /></a>)}</div>
        </div>
      ) : null}
      {media.length ? (
        <div className="thumbs" style={{ marginTop: 10 }}>
          {media.map((m, i) => (m.type === "video"
            ? <video key={i} className="thumb vid" src={m.url} muted playsInline />
            : <img key={i} className="thumb" src={m.url} alt="" />))}
        </div>
      ) : null}
    </div>
  );
}
