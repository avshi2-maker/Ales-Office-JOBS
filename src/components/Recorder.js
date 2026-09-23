"use client";
// Recorder.js (src/components/Recorder.js) · updated 23.09.2026 10:32 (Asia/Jerusalem)
// In-app recorder for the happy-customer conversation. ● record / ■ stop, live timer,
// listen back, then save to the phone queue (uploads when there's signal).
// iPhone Safari records audio/mp4, Android Chrome audio/webm — both accepted.
import { useEffect, useRef, useState } from "react";

function pickMime() {
  if (typeof MediaRecorder === "undefined") return "";
  const opts = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", "audio/ogg"];
  return opts.find((m) => { try { return MediaRecorder.isTypeSupported(m); } catch (e) { return false; } }) || "";
}

function mmss(s) { const m = Math.floor(s / 60); const r = s % 60; return m + ":" + String(r).padStart(2, "0"); }

export default function Recorder({ onSave }) {
  const [state, setState] = useState("idle"); // idle | rec | review
  const [secs, setSecs] = useState(0);
  const [blob, setBlob] = useState(null);
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const rec = useRef(null);
  const chunks = useRef([]);
  const timer = useRef(null);
  const started = useRef(0);

  useEffect(() => () => { clearInterval(timer.current); if (url) URL.revokeObjectURL(url); }, [url]);

  const supported = typeof window !== "undefined" && !!(navigator.mediaDevices && window.MediaRecorder);

  async function start() {
    setErr("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickMime();
      const r = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunks.current = [];
      r.ondataavailable = (e) => { if (e.data && e.data.size) chunks.current.push(e.data); };
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const b = new Blob(chunks.current, { type: r.mimeType || mime || "audio/webm" });
        setBlob(b);
        setUrl(URL.createObjectURL(b));
        setState("review");
      };
      rec.current = r;
      r.start(1000);
      started.current = Date.now();
      setSecs(0);
      timer.current = setInterval(() => setSecs(Math.round((Date.now() - started.current) / 1000)), 500);
      setState("rec");
    } catch (e) {
      setErr("אין גישה למיקרופון — אשר הרשאה בדפדפן, או העלה קובץ הקלטה.");
    }
  }

  function stop() {
    clearInterval(timer.current);
    setSecs(Math.round((Date.now() - started.current) / 1000));
    if (rec.current && rec.current.state !== "inactive") rec.current.stop();
  }

  function redo() { if (url) URL.revokeObjectURL(url); setBlob(null); setUrl(""); setSecs(0); setState("idle"); }

  async function save() {
    const ext = (blob.type || "").includes("mp4") ? "m4a" : (blob.type || "").includes("ogg") ? "ogg" : "webm";
    await onSave({ blob, name: "customer-" + Date.now() + "." + ext, durationSec: secs });
    redo();
  }

  if (!supported) return <div className="hint">הקלטה בתוך האפליקציה לא נתמכת בדפדפן הזה — השתמש ב״העלה קובץ הקלטה״.</div>;

  return (
    <div className="recbox">
      {state === "idle" ? <button type="button" className="recbtn" onClick={start}>● הקלט שיחה עם הלקוח</button> : null}
      {state === "rec" ? (
        <div className="recrow">
          <span className="recdot" /> <b className="rectime">{mmss(secs)}</b>
          <button type="button" className="recstop" onClick={stop}>■ עצור</button>
        </div>
      ) : null}
      {state === "review" ? (
        <div className="recreview">
          <audio src={url} controls />
          <div className="recrow">
            <button type="button" className="btn fin row" onClick={save}>💾 שמור הקלטה ({mmss(secs)})</button>
            <button type="button" className="xbtn" onClick={redo}>🗑️ הקלט מחדש</button>
          </div>
        </div>
      ) : null}
      {err ? <div className="msg err">{err}</div> : null}
    </div>
  );
}
