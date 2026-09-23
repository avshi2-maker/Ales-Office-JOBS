"use client";
// MediaCapture.js (src/components/MediaCapture.js) · updated 23.09.2026 10:32 (Asia/Jerusalem)
// 3 explicit buttons: 📷 photo (camera) · 🎥 video (camera) · 🖼️ gallery/files.
// Every file goes to the phone queue first (offlineQueue) and uploads when there's signal.
// props: draftKey, slot, setMedia(uploadedItems[]) — media is DERIVED from the queue.
import { useEffect, useRef } from "react";
import { addItem, removeItem, processQueue } from "@/lib/offlineQueue";
import { useQueueItems } from "@/lib/useQueue";
import { cloudinaryReady } from "@/lib/cloudinary";

const ST = { pending: "⏳ ממתין", uploading: "⬆️ מעלה", error: "⚠️ נכשל", done: "✓" };

export default function MediaCapture({ draftKey, slot = "media", setMedia, title = "תמונות ווידאו" }) {
  const items = useQueueItems(draftKey, slot);
  const photoRef = useRef(null);
  const videoRef = useRef(null);
  const galRef = useRef(null);

  useEffect(() => {
    setMedia(items.filter((i) => i.status === "done" && i.result).map((i) => i.result));
  }, [items, setMedia]);

  async function take(list) {
    const files = Array.from(list || []);
    for (const f of files) await addItem({ draftKey, slot, blob: f, name: f.name });
  }

  function onPick(e) { take(e.target.files); e.target.value = ""; }

  const waiting = items.filter((i) => i.status !== "done").length;

  return (
    <div>
      <label>{title}</label>
      <div className="mbar">
        <button type="button" className="mbtn" onClick={() => photoRef.current.click()}>📷<span>צלם תמונה</span></button>
        <button type="button" className="mbtn" onClick={() => videoRef.current.click()}>🎥<span>צלם וידאו</span></button>
        <button type="button" className="mbtn" onClick={() => galRef.current.click()}>🖼️<span>מהגלריה</span></button>
      </div>
      <input ref={photoRef} type="file" accept="image/*" capture="environment" hidden onChange={onPick} />
      <input ref={videoRef} type="file" accept="video/*" capture="environment" hidden onChange={onPick} />
      <input ref={galRef} type="file" accept="image/*,video/*" multiple hidden onChange={onPick} />

      {!cloudinaryReady ? <div className="warn" style={{ marginTop: 10 }}>Cloudinary לא מוגדר — הקבצים יישמרו בטלפון עד שיוגדר.</div> : null}

      {waiting ? (
        <div className="qline">⏳ {waiting} קבצים שמורים בטלפון וממתינים להעלאה <button type="button" className="xbtn" onClick={() => processQueue()}>⬆️ שלח עכשיו</button></div>
      ) : null}

      {items.length ? (
        <div className="thumbs">
          {items.map((i) => (
            <div key={i.id} className="qthumb">
              {i.kind === "video"
                ? <video className="thumb vid" src={i.preview} muted playsInline />
                : <img className="thumb" src={i.preview} alt="" />}
              <span className={"qst " + i.status}>{ST[i.status]}</span>
              <button type="button" className="qrm" onClick={() => removeItem(i.id)} aria-label="הסר">×</button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
