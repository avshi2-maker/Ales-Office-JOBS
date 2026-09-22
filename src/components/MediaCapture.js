// MediaCapture.js (src/components/MediaCapture.js) · updated 22.09.2026 12:58 (Asia/Jerusalem)
"use client";
import { useState } from "react";
import { uploadToCloudinary, cloudinaryReady } from "@/lib/cloudinary";

// props: media (array), setMedia (fn)
export default function MediaCapture({ media, setMedia }) {
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState(0);
  const [err, setErr] = useState("");

  async function handleFiles(list) {
    const files = Array.from(list || []);
    if (!files.length) return;
    setErr("");
    setBusy(true);
    const added = [];
    for (const f of files) {
      try {
        setProg(0);
        const item = await uploadToCloudinary(f, setProg);
        added.push(item);
      } catch (e) {
        setErr(e.message || "העלאה נכשלה");
      }
    }
    if (added.length) setMedia([...(media || []), ...added]);
    setBusy(false);
    setProg(0);
  }

  function removeAt(i) {
    setMedia(media.filter((_, idx) => idx !== i));
  }

  const photoLabel = { display: "block" };
  return (
    <div>
      <label>תמונות מהמצלמה</label>
      <input
        type="file" accept="image/*" capture="environment" multiple
        disabled={busy}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <label>וידאו (אופציונלי)</label>
      <input
        type="file" accept="video/*" capture="environment"
        disabled={busy}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {!cloudinaryReady ? (
        <div className="warn" style={{ marginTop: 10 }}>Cloudinary לא מוגדר — הוסף מפתחות ל־.env.local כדי להעלות מדיה.</div>
      ) : null}

      {busy ? (
        <div className="upbar"><i style={{ width: prog + "%" }} /></div>
      ) : null}
      {err ? <div className="msg err">{err}</div> : null}

      {media && media.length ? (
        <div className="thumbs">
          {media.map((m, i) => (
            <div key={i} style={{ position: "relative" }}>
              {m.type === "video" ? (
                <video className="thumb vid" src={m.url} muted playsInline />
              ) : (
                <img className="thumb" src={m.url} alt="" />
              )}
              <button
                type="button" onClick={() => removeAt(i)}
                style={rmBtn}
              >×</button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const rmBtn = {
  position: "absolute", top: -6, insetInlineStart: -6, width: 22, height: 22,
  borderRadius: "50%", border: "none", background: "#B4423A", color: "#fff",
  fontSize: 14, lineHeight: "22px", cursor: "pointer", padding: 0,
};
