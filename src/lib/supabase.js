// supabase.js (src/lib/supabase.js) · updated 23.09.2026 07:50 (Asia/Jerusalem)
// Browser Supabase client + thin data helpers for ales_jobs.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(url && key);

export const supabase = supabaseReady ? createClient(url, key) : null;

export async function saveJob(row) {
  if (!supabase) throw new Error("Supabase לא מוגדר (חסר .env.local)");
  const { data, error } = await supabase
    .from("ales_jobs")
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchJobs() {
  if (!supabase) throw new Error("Supabase לא מוגדר (חסר .env.local)");
  const { data, error } = await supabase
    .from("ales_jobs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchJob(id) {
  if (!supabase) throw new Error("Supabase לא מוגדר (חסר .env.local)");
  const { data, error } = await supabase.from("ales_jobs").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

// Finish chapter: the only update path, enforced server-side by rpc finish_job.
export async function finishJob(id, payload) {
  if (!supabase) throw new Error("Supabase לא מוגדר (חסר .env.local)");
  const { data, error } = await supabase.rpc("finish_job", { p_id: id, p_payload: payload });
  if (error) throw new Error(error.message || "שמירה נכשלה");
  return data;
}
