"use client";
// MicButton.js (src/components/MicButton.js) · updated 23.09.2026 16:48 (Asia/Jerusalem)
// 🎙️ Hebrew dictation into a text field (Web Speech API, he-IL). Text is APPENDED to what's already there.
// Works in Chrome (Android/desktop) and Safari iOS 14.5+. If unsupported, tells Ales to use the keyboard mic.
import { useEffect, useRef, useState } from "react";

function getRec() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export default function MicButton({ value, onChange }) {
  const [on, setOn] = useState(false);
  const [interim, setInterim] = useState("");
  const [err, setErr] = useState("");
  const rec = useRef(null);
  const base = useRef("");
  const [supported, setSupported] = useState(true);

  useEffect(() => { setSupported(!!getRec()); return () => { try { rec.current && rec.current.stop(); } catch (e) {} }; }, []);

  function start() {
    const R = getRec();
    if (!R) { setErr("הדפדפן לא תומך בהכתבה — השתמש במיקרופון של המקלדת בטלפון 🎤"); return; }
    setErr("");
    base.current = (value || "").trim();
    const r = new R();
    r.lang = "he-IL";
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e) => {
      let fin = "", tmp = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) fin += t; else tmp += t;
      }
      if (fin) {
        base.current = (base.current ? base.current + " " : "") + fin.trim();
        onChange(base.current);
      }
      setInterim(tmp);
    };
    r.onerror = (e) => { setErr(e.error === "not-allowed" ? "אשר גישה למיקרופון בדפדפן" : "ההכתבה נעצרה (" + e.error + ")"); setOn(false); };
    r.onend = () => { setOn(false); setInterim(""); };
    rec.current = r;
    r.start();
    setOn(true);
  }

  function stop() { try { rec.current && rec.current.stop(); } catch (e) {} setOn(false); }

  return (
    <div className="microw">
      <button type="button" className={"micbtn" + (on ? " on" : "")} onClick={on ? stop : start}>
        {on ? "■ עצור הכתבה" : "🎙️ הכתב בקול"}
      </button>
      {on ? <span className="micint">{interim || "מקשיב…"}</span> : null}
      {!supported && !on ? <span className="hint">או לחץ 🎤 במקלדת הטלפון</span> : null}
      {err ? <span className="msg err">{err}</span> : null}
    </div>
  );
}
