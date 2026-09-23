// ShareBar.js (src/components/ShareBar.js) · updated 23.09.2026 07:50 (Asia/Jerusalem)
"use client";
import { typeLabel } from "@/lib/jobtypes";
import { stampDate } from "@/lib/datestamp";

// Builds a shareable text block from a job row and shares via WhatsApp / mail /
// native share / copy. Used to send project assets to potential customers.
function buildText(job) {
  const L = [];
  L.push("*Marble Art · " + typeLabel(job.job_type) + "*");
  if (job.title) L.push(job.title);
  const meta = [job.city, job.customer, job.created_at ? stampDate(job.created_at) : ""].filter(Boolean).join(" · ");
  if (meta) L.push(meta);
  if (job.fields && job.fields.stone) L.push("אבן: " + job.fields.stone);
  if (job.fields && job.fields.size) L.push("מידות: " + job.fields.size);
  if (job.job_type === "testimonial" && job.fields && job.fields.quote) {
    L.push('"' + job.fields.quote + '"');
  }
  const t = job.testimonial || {};
  const c = job.consent || {};
  if (job.status === "finished" && c.quote && t.quote) {
    L.push("");
    L.push("⭐".repeat(Number(t.rating || 0)) + ' "' + t.quote + '"' + (c.name_city && t.first_name ? " — " + t.first_name + (job.city ? ", " + job.city : "") : ""));
  }
  if (job.notes) L.push(job.notes);
  const after = c.photos ? (job.after_media || []) : [];
  const links = [...(job.media || []), ...after].map((m) => m.url);
  if (links.length) { L.push(""); L.push("תמונות/וידאו:"); links.forEach((u) => L.push(u)); }
  L.push("");
  L.push("Marble Art · כיורי שיש בעבודת יד · https://www.marble-art.co.il");
  return L.join("\n");
}

export default function ShareBar({ job }) {
  const text = buildText(job);

  function wa() {
    window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(text), "_blank");
  }
  function mail() {
    const sub = "Marble Art · " + (job.title || typeLabel(job.job_type));
    window.location.href = "mailto:?subject=" + encodeURIComponent(sub) + "&body=" + encodeURIComponent(text);
  }
  async function native() {
    if (navigator.share) {
      try { await navigator.share({ title: "Marble Art", text }); } catch (e) {}
    } else { copy(); }
  }
  function copy() {
    try { navigator.clipboard.writeText(text); } catch (e) {}
  }

  return (
    <div className="sharebar">
      <button className="xbtn" onClick={wa}>💬 וואטסאפ</button>
      <button className="xbtn" onClick={mail}>✉️ מייל</button>
      <button className="xbtn" onClick={native}>📤 שתף</button>
      <button className="xbtn" onClick={copy}>📋 העתק</button>
    </div>
  );
}
