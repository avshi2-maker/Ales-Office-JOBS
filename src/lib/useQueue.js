"use client";
// useQueue.js (src/lib/useQueue.js) · updated 23.09.2026 10:31 (Asia/Jerusalem)
// React hook: live list of queued items for a draft/slot + local preview URLs.
import { useEffect, useRef, useState } from "react";
import { itemsFor, subscribe, allItems } from "./offlineQueue";

export function useQueueItems(draftKey, slot) {
  const [items, setItems] = useState([]);
  const urls = useRef(new Map());

  useEffect(() => {
    let live = true;
    async function load() {
      let list = [];
      try { list = await itemsFor(draftKey, slot); } catch (e) { list = []; }
      if (!live) return;
      const withPreview = list.map((i) => {
        if (!urls.current.has(i.id) && i.blob) urls.current.set(i.id, URL.createObjectURL(i.blob));
        return { ...i, preview: (i.result && i.result.url) || urls.current.get(i.id) };
      });
      setItems(withPreview);
    }
    load();
    const off = subscribe(load);
    return () => { live = false; off(); };
  }, [draftKey, slot]);

  useEffect(() => () => { urls.current.forEach((u) => URL.revokeObjectURL(u)); }, []);
  return items;
}

export function usePendingCount() {
  const [n, setN] = useState(0);
  const [online, setOnline] = useState(true);
  useEffect(() => {
    let live = true;
    async function load() {
      try { const all = await allItems(); if (live) setN(all.filter((i) => i.status !== "done").length); } catch (e) {}
    }
    function net() { setOnline(navigator.onLine !== false); }
    load(); net();
    const off = subscribe(load);
    window.addEventListener("online", net);
    window.addEventListener("offline", net);
    return () => { live = false; off(); window.removeEventListener("online", net); window.removeEventListener("offline", net); };
  }, []);
  return { pending: n, online };
}
