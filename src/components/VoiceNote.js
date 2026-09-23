"use client";
// VoiceNote.js (src/components/VoiceNote.js) · updated 23.09.2026 07:51 (Asia/Jerusalem)
// Customer testimonial as a voice note: phone recorder / audio file -> Cloudinary. Text transcript is typed in the quote field (CRM can transcribe later).
import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function VoiceNote({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState(0);
  const [err, setErr] = useState("");

  async function pick(list) {
    const f = list && list[0];
    if (!f) return;
    setErr("");
    setBusy(true);
    try {
      const item = await uploadToCloudinary(f, setProg);
      onChange({ url: item.url, public_id: item.public_id });
    } catch (e) {
      setErr(e.message || "העלאה נכשלה");
    }
    setBusy(false);
    setProg(0);
  }

  return (
    <div>
      <label>🎙️ הקלטת הלקוח (אופציונלי)</label>
      {value && value.url ? (
        <div className="voice">
          <audio src={value.url} controls preload="none" />
          <button type="button" className="xbtn" onClick={() => onChange(null)}>הסר</button>
        </div>
      ) : (
        <input type="file" accept="audio/*" capture="user" disabled={busy} onChange={(e) => pick(e.target.files)} />
      )}
      {busy ? <div className="upbar"><i style={{ width: prog + "%" }} /></div> : null}
      {err ? <div className="msg err">{err}</div> : null}
    </div>
  );
}
