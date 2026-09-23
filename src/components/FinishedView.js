"use client";
// FinishedView.js (src/components/FinishedView.js) · updated 23.09.2026 07:51 (Asia/Jerusalem)
// Shown after a job is finished: after-media, testimonial, consents. Read-only.
import Link from "next/link";
import { stampFull } from "@/lib/datestamp";

const C_LABEL = { photos: "תמונות", name_city: "שם פרטי + עיר", quote: "ציטוט" };

export default function FinishedView({ job, justSaved }) {
  const t = job.testimonial || {};
  const c = job.consent || {};
  const after = job.after_media || [];
  return (
    <div className="card chapter done">
      {justSaved ? <div className="savedbanner">✓ נשמר ונשלח לאבשי · {stampFull(job.finished_at)}</div> : null}
      <h2 className="fr">✅ העבודה הסתיימה</h2>
      {after.length ? (
        <div className="thumbs" style={{ marginTop: 8 }}>
          {after.map((m, i) => (m.type === "video"
            ? <video key={i} className="thumb vid" src={m.url} muted playsInline controls />
            : <img key={i} className="thumb" src={m.url} alt="" />))}
        </div>
      ) : null}
      {t.rating ? <div className="starline">{"★★★★★".slice(0, t.rating)}{"☆☆☆☆☆".slice(0, 5 - t.rating)}</div> : null}
      {t.quote ? <blockquote className="tq">&quot;{t.quote}&quot;{t.first_name ? <span> — {t.first_name}{job.city ? ", " + job.city : ""}</span> : null}</blockquote> : null}
      {t.voice && t.voice.url ? <audio src={t.voice.url} controls preload="none" style={{ width: "100%", marginTop: 8 }} /> : null}
      <div className="cpills">
        {Object.keys(C_LABEL).map((k) => (
          <span key={k} className={"cpill " + (c[k] ? "y" : "n")}>{c[k] ? "✓" : "✗"} {C_LABEL[k]}</span>
        ))}
      </div>
      <Link href="/gallery" className="btn ghost" style={{ marginTop: 14, textAlign: "center", display: "block" }}>← חזרה לגלריה</Link>
    </div>
  );
}
