// GalleryGrid.js (src/components/GalleryGrid.js) · updated 22.09.2026 13:03 (Asia/Jerusalem)
"use client";
import { typeLabel } from "@/lib/jobtypes";
import ShareBar from "./ShareBar";

function stars5(n) {
  const v = Number(n || 0);
  return "★★★★★".slice(0, v) + "☆☆☆☆☆".slice(0, 5 - v);
}

function whenHe(iso) {
  try { return new Date(iso).toLocaleDateString("he-IL"); } catch (e) { return ""; }
}

export default function GalleryGrid({ jobs }) {
  if (!jobs.length) {
    return <div className="center">אין עבודות שתואמות את הסינון.</div>;
  }
  return (
    <div>
      {jobs.map((job) => {
        const media = job.media || [];
        const shown = media.slice(0, 4);
        return (
          <div key={job.id} className="gcard">
            {shown.length ? (
              <div className="gmedia">
                {shown.map((m, i) => (
                  m.type === "video"
                    ? <video key={i} src={m.url} muted playsInline controls />
                    : <img key={i} src={m.url} alt="" loading="lazy" />
                ))}
              </div>
            ) : null}
            <div className="gbody">
              <h3>
                {job.title || job.customer || "ללא כותרת"}
                <span className="tag">{typeLabel(job.job_type)}</span>
              </h3>
              <div className="meta">
                {[job.city, job.customer, whenHe(job.created_at)].filter(Boolean).join(" · ")}
                {job.job_type === "testimonial" && job.rating ? (
                  <span style={{ color: "var(--brass)", marginInlineStart: 6 }}>{stars5(job.rating)}</span>
                ) : null}
              </div>
              {job.fields && job.fields.stone ? <div className="meta">אבן: {job.fields.stone}</div> : null}
              {job.job_type === "testimonial" && job.fields && job.fields.quote ? (
                <div style={{ margin: "6px 0" }}>&quot;{job.fields.quote}&quot;</div>
              ) : null}
              {job.ales_quote ? <div className="meta">הצעת מחיר: {job.ales_quote}</div> : null}
              <ShareBar job={job} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
