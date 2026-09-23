// offlineQueue.js (src/lib/offlineQueue.js) · updated 23.09.2026 10:31 (Asia/Jerusalem)
// Save-now-send-later: every captured photo/video/recording is written to the phone
// (IndexedDB) FIRST, then uploaded to Cloudinary when there is signal.
// Survives closing the browser. Items are grouped by draftKey + slot.
//   draftKey: "new:<type>" for the new-job form, "finish:<jobId>" for the finish chapter
//   slot:     "media" | "after" | "voice"
import { uploadToCloudinary } from "./cloudinary";

const DB_NAME = "ales-media";
const STORE = "items";
let dbp = null;
const subs = new Set();
let running = false;

function db() {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("no indexedDB"));
  if (!dbp) {
    dbp = new Promise((res, rej) => {
      const r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = () => {
        const s = r.result.createObjectStore(STORE, { keyPath: "id" });
        s.createIndex("draft", "draftKey");
      };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  return dbp;
}

function tx(mode, fn) {
  return db().then((d) => new Promise((res, rej) => {
    const t = d.transaction(STORE, mode);
    const out = fn(t.objectStore(STORE));
    t.oncomplete = () => res(out && out.result !== undefined ? out.result : out);
    t.onerror = () => rej(t.error);
  }));
}

function emit() { subs.forEach((f) => { try { f(); } catch (e) {} }); }

export function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }

export async function allItems() {
  const req = await tx("readonly", (s) => s.getAll());
  return (req || []).sort((a, b) => a.createdAt - b.createdAt);
}

export async function itemsFor(draftKey, slot) {
  const all = await allItems();
  return all.filter((i) => i.draftKey === draftKey && (!slot || i.slot === slot));
}

export async function pendingCount() {
  const all = await allItems();
  return all.filter((i) => i.status !== "done").length;
}

export async function addItem({ draftKey, slot, blob, name, kind, durationSec }) {
  const item = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    draftKey, slot, blob,
    name: name || "file",
    mime: blob.type || "",
    kind: kind || (blob.type.startsWith("video") ? "video" : blob.type.startsWith("audio") ? "audio" : "image"),
    durationSec: durationSec || null,
    status: "pending", error: "", result: null, createdAt: Date.now(),
  };
  await tx("readwrite", (s) => s.put(item));
  emit();
  processQueue();
  return item;
}

async function patch(id, fields) {
  const d = await db();
  await new Promise((res, rej) => {
    const t = d.transaction(STORE, "readwrite");
    const s = t.objectStore(STORE);
    const g = s.get(id);
    g.onsuccess = () => { if (g.result) s.put({ ...g.result, ...fields }); };
    t.oncomplete = res;
    t.onerror = () => rej(t.error);
  });
  emit();
}

export async function removeItem(id) {
  await tx("readwrite", (s) => s.delete(id));
  emit();
}

export async function clearDraft(draftKey, slot) {
  const list = await itemsFor(draftKey, slot);
  for (const i of list) await tx("readwrite", (s) => s.delete(i.id));
  emit();
}

export function isOnline() { return typeof navigator === "undefined" ? true : navigator.onLine !== false; }

// Uploads every pending/error item, one by one. Safe to call any time.
export async function processQueue(onProgress) {
  if (running || !isOnline()) return;
  running = true;
  try {
    const list = (await allItems()).filter((i) => i.status !== "done");
    for (const it of list) {
      if (!isOnline()) break;
      await patch(it.id, { status: "uploading", error: "" });
      try {
        const file = new File([it.blob], it.name, { type: it.mime || undefined });
        const r = await uploadToCloudinary(file, (p) => onProgress && onProgress(it.id, p));
        const result = { url: r.url, type: it.kind === "audio" ? "audio" : r.type, public_id: r.public_id };
        if (it.durationSec) result.durationSec = it.durationSec;
        await patch(it.id, { status: "done", result });
      } catch (e) {
        await patch(it.id, { status: "error", error: e.message || "העלאה נכשלה" });
      }
    }
  } finally {
    running = false;
    emit();
  }
}

// Auto-resume when signal comes back / app regains focus.
if (typeof window !== "undefined") {
  window.addEventListener("online", () => processQueue());
  document.addEventListener("visibilitychange", () => { if (!document.hidden) processQueue(); });
  setInterval(() => processQueue(), 30000);
}
