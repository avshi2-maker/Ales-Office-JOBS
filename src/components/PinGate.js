// PinGate.js (src/components/PinGate.js) · updated 22.09.2026 12:57 (Asia/Jerusalem)
"use client";
import { useEffect, useState } from "react";

const SS_KEY = "ales_pin_ok";

export default function PinGate({ children }) {
  const [ok, setOk] = useState(false);
  const [ready, setReady] = useState(false);
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");

  const pin = process.env.NEXT_PUBLIC_APP_PIN || "";

  useEffect(() => {
    try {
      if (!pin) { setOk(true); }
      else if (sessionStorage.getItem(SS_KEY) === "1") { setOk(true); }
    } catch (e) {}
    setReady(true);
  }, [pin]);

  function submit(e) {
    e.preventDefault();
    if (val.trim() === pin) {
      try { sessionStorage.setItem(SS_KEY, "1"); } catch (e) {}
      setOk(true);
    } else {
      setErr("קוד שגוי");
      setVal("");
    }
  }

  if (!ready) return null;
  if (ok) return children;

  return (
    <div className="pinwrap">
      <span className="diamond" />
      <h1 className="fr">Ales Office JOBS</h1>
      <p className="hint">כלי שטח פרטי · הזן קוד כניסה</p>
      <form onSubmit={submit}>
        <input
          type="password" inputMode="numeric" value={val} autoFocus
          onChange={(e) => { setVal(e.target.value); setErr(""); }}
          placeholder="קוד"
          style={{ textAlign: "center", fontSize: "22px", letterSpacing: "6px" }}
        />
        {err ? <div className="msg err">{err}</div> : null}
        <button className="btn" style={{ marginTop: 14 }} type="submit">כניסה</button>
      </form>
    </div>
  );
}
