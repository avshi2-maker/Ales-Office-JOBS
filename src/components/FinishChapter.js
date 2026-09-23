"use client";
// FinishChapter.js (src/components/FinishChapter.js) · updated 23.09.2026 07:51 (Asia/Jerusalem)
// Chapter 2 of every job: after-install photos, finish date, customer rating/quote/voice, 3 consents.
// Saves via rpc finish_job (server enforces: open jobs only, finish fields only, >=1 after photo).
import { useState } from "react";
import MediaCapture from "./MediaCapture";
import VoiceNote from "./VoiceNote";
import LiveStamp from "./LiveStamp";
import { finishJob } from "@/lib/supabase";

function todayIL() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jerusalem" });
}

const CONSENTS = [
  { key: "photos", label: "הלקוח/ה מאשר/ת פרסום התמונות והווידאו באתר Marble Art וברשתות" },
  { key: "name_city", label: "הלקוח/ה מאשר/ת פרסום שם פרטי + עיר בלבד (בלי שם משפחה, כתובת או טלפון)" },
  { key: "quote", label: "הלקוח/ה מאשר/ת ציטוט ההמלצה באתר וברשתות" },
];

export default function FinishChapter({ job, onDone }) {
  const [after, setAfter] = useState([]);
  const [date, setDate] = useState(todayIL());
  const [rating, setRating] = useState(0);
  const [quote, setQuote] = useState("");
  const [firstName, setFirstName] = useState("");
  const [voice, setVoice] = useState(null);
  const [consent, setConsent] = useState({ photos: false, name_city: false, quote: false });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  function tog(k) { setConsent((c) => ({ ...c, [k]: !c[k] })); }

  async function save() {
    if (!after.length) { setMsg({ t: "err", m: "צלם לפחות תמונה אחת של העבודה המוגמרת" }); return; }
    setSaving(true);
    setMsg(null);
    const payload = {
      finish_date: date,
      after_media: after,
      testimonial: { rating: rating || null, quote: quote.trim(), first_name: firstName.trim(), voice: voice || null },
      consent,
    };
    try {
      const row = await finishJob(job.id, payload);
      onDone(row);
    } catch (e) {
      setMsg({ t: "err", m: e.message });
    }
    setSaving(false);
  }

  const tip = after.length < 4 ? "מומלץ 4+ תמונות, כולל אחת של כל החלל — זה מה שיהפוך את העבודה לעמוד באתר" : "מצוין — מספיק תמונות לעמוד פרויקט";

  return (
    <div className="card chapter">
      <h2 className="fr">✅ פרק סיום עבודה + המלצת לקוח</h2>
      <p className="hint">ממלאים ביום הסיום, מול הלקוח. אחרי השמירה העבודה נשלחת לאבשי להפקת תיק פרויקט.</p>

      <MediaCapture media={after} setMedia={setAfter} />
      <div className={"tipline" + (after.length >= 4 ? " ok" : "")}>📸 {after.length} תמונות · {tip}</div>

      <div className="grid2">
        <div><label>תאריך סיום</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div><label>שם פרטי של הלקוח/ה</label><input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="מיכל" /></div>
      </div>

      <label>דירוג הלקוח</label>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={"star" + (n <= rating ? " on" : "")} onClick={() => setRating(n)}>★</span>
        ))}
      </div>

      <label>ההמלצה במילים של הלקוח</label>
      <textarea value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="מה הלקוח אמר על התוצאה, על ההדמיה, על ההתקנה..." />

      <VoiceNote value={voice} onChange={setVoice} />

      <label>הסכמות הלקוח</label>
      <div className="consents">
        {CONSENTS.map((c) => (
          <div key={c.key} className="chk">
            <input type="checkbox" id={"c_" + c.key} checked={consent[c.key]} onChange={() => tog(c.key)} />
            <label htmlFor={"c_" + c.key}>{c.label}</label>
          </div>
        ))}
      </div>

      <LiveStamp />
      <button className="btn fin" style={{ marginTop: 10 }} disabled={saving} onClick={save}>
        {saving ? "שומר..." : "✅ שמור וסיים — שלח לאבשי"}
      </button>
      {msg ? <div className={"msg " + (msg.t === "ok" ? "ok" : "err")}>{msg.m}</div> : null}
    </div>
  );
}
