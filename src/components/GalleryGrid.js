// GalleryGrid.js (src/components/GalleryGrid.js) · updated 23.09.2026 07:51 (Asia/Jerusalem)
"use client";
import { typeLabel } from "@/lib/jobtypes";
import Link from "next/link";
import ShareBar from "./ShareBar";
import { stampFull } from "@/lib/datestamp";

function stars5(n) {
  const v = Number(n || 0);
  return "★★★★★".slice(0, v) + "☆☆☆☆☆".slice(0, 5 - v);
}

export default function GalleryGrid({ jobs }) {
  if (!jobs.length) {
    return <div className="center">אין עבודות שתואמות את הסינון.</div>;
  }
  return (
    <div>
      {jobs.map((job) => {
        const done = job.status === "finished";
        const media = done ? [...(job.after_media || []), ...(job.media || [])] : (job.media || []);
        const shown = media.slice(0, 4);
        const t = job.testimonial || {};
        const isTesti = job.job_type === "testimonial";
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
              <div className="stamprow">
                {job.created_at ? <span className="dstamp">📅 {stampFull(job.created_at)}</span> : null}
                {!isTesti ? (done ? <span className="stbadge fin">✅ הסתיים</span> : <span className="stbadge open">🛠️ בביצוע</span>) : null}
              </div>
              <h3>
                {job.title || job.customer || "ללא כותרת"}
                <span className="tag">{typeLabel(job.job_type)}</span>
              </h3>
              <div className="meta">
                {[job.city, job.customer].filter(Boolean).join(" · ")}
                {job.job_type === "testimonial" && job.rating ? (
                  <span style={{ color: "var(--brass)", marginInlineStart: 6 }}>{stars5(job.rating)}</span>
                ) : null}
              </div>
              {job.fields && job.fields.stone ? <div className="meta">אבן: {job.fields.stone}</div> : null}
              {job.job_type === "testimonial" && job.fields && job.fields.quote ? (
                <div style={{ margin: "6px 0" }}>&quot;{job.fields.quote}&quot;</div>
              ) : null}
              {done && t.quote ? (
                <div style={{ margin: "6px 0" }}>
                  {t.rating ? <span style={{ color: "var(--brass)" }}>{stars5(t.rating)} </span> : null}&quot;{t.quote}&quot;
                </div>
              ) : null}
              {job.ales_quote ? <div className="meta">הצעת מחיר (פנימי): {job.ales_quote}</div> : null}
              {!isTesti ? (
                <Link href={"/job/" + job.id} className={done ? "openjob" : "openjob go"}>
                  {done ? "📂 פתח עבודה" : "✅ סיום עבודה + המלצה"}
                </Link>
              ) : null}
              <ShareBar job={job} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
