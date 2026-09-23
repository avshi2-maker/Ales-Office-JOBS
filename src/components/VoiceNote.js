"use client";
// VoiceNote.js (src/components/VoiceNote.js) · updated 23.09.2026 10:32 (Asia/Jerusalem)
// Customer conversation: in-app recorder OR upload an audio file. Saved to the phone queue,
// uploaded when there's signal. The latest uploaded recording is the job's voice note
// (url + durationSec → CRM transcribes it with the existing ElevenLabs pipeline).
import { useEffect, useRef } from "react";
import Recorder from "./Recorder";
import { addItem, removeItem, processQueue } from "@/lib/offlineQueue";
import { useQueueItems } from "@/lib/useQueue";

function audioDuration(file) {
  return new Promise((res) => {
    try {
      const a = document.createElement("audio");
      a.preload = "metadata";
      a.onloadedmetadata = () => res(isFinite(a.duration) ? Math.round(a.duration) : null);
      a.onerror = () => res(null);
      a.src = URL.createObjectURL(file);
    } catch (e) { res(null); }
  });
}

export default function VoiceNote({ draftKey, onChange }) {
  const items = useQueueItems(draftKey, "voice");
  const fileRef = useRef(null);

  useEffect(() => {
    const done = items.filter((i) => i.status === "done" && i.result);
    onChange(done.length ? done[done.length - 1].result : null);
  }, [items, onChange]);

  async function saveRec({ blob, name, durationSec }) {
    await addItem({ draftKey, slot: "voice", blob, name, kind: "audio", durationSec });
  }

  async function pickFile(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    const d = await audioDuration(f);
    await addItem({ draftKey, slot: "voice", blob: f, name: f.name, kind: "audio", durationSec: d });
  }

  const waiting = items.filter((i) => i.status !== "done").length;

  return (
    <div>
      <label>🎙️ שיחה עם הלקוח המרוצה</label>
      <Recorder onSave={saveRec} />
      <button type="button" className="xbtn" style={{ marginTop: 8 }} onClick={() => fileRef.current.click()}>📁 העלה קובץ הקלטה</button>
      <input ref={fileRef} type="file" accept="audio/*" hidden onChange={pickFile} />
      {waiting ? <div className="qline">⏳ הקלטה שמורה בטלפון וממתינה להעלאה <button type="button" className="xbtn" onClick={() => processQueue()}>⬆️ שלח עכשיו</button></div> : null}
      {items.map((i) => (
        <div key={i.id} className="voice">
          <audio src={i.preview} controls preload="none" />
          <span className={"qst " + i.status}>{i.status === "done" ? "✓ הועלה" : i.status === "error" ? "⚠️" : "⏳"}</span>
          <button type="button" className="xbtn" onClick={() => removeItem(i.id)}>הסר</button>
        </div>
      ))}
      {items.length > 1 ? <div className="hint">ההקלטה האחרונה שהועלתה היא זו שתישלח לתמלול.</div> : null}
    </div>
  );
}
