// supabase.js (src/lib/supabase.js) · updated 22.09.2026 12:55 (Asia/Jerusalem)
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
