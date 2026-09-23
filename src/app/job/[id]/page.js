"use client";
// job/[id]/page.js (src/app/job/[id]/page.js) · updated 23.09.2026 07:51 (Asia/Jerusalem)
// Open an existing job: summary + finish chapter (if open) or finished view.
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PinGate from "@/components/PinGate";
import Brand from "@/components/Brand";
import JobSummary from "@/components/JobSummary";
import FinishChapter from "@/components/FinishChapter";
import FinishedView from "@/components/FinishedView";
import { fetchJob, supabaseReady } from "@/lib/supabase";

export default function JobPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [err, setErr] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    let live = true;
    async function load() {
      if (!supabaseReady) { setErr("Supabase לא מוגדר"); return; }
      try {
        const row = await fetchJob(id);
        if (live) setJob(row);
      } catch (e) {
        if (live) setErr(e.message || "העבודה לא נמצאה");
      }
    }
    if (id) load();
    return () => { live = false; };
  }, [id]);

  function onDone(row) {
    setJob(row);
    setJustSaved(true);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {}
  }

  const isTesti = job && job.job_type === "testimonial";

  return (
    <PinGate>
      <div className="app">
        <Brand />
        <div className="wrap">
          {err ? <div className="warn">{err}</div> : null}
          {!job && !err ? <div className="center">טוען...</div> : null}
          {job ? <JobSummary job={job} /> : null}
          {job && !isTesti && job.status !== "finished" ? <FinishChapter job={job} onDone={onDone} /> : null}
          {job && job.status === "finished" ? <FinishedView job={job} justSaved={justSaved} /> : null}
          {isTesti ? <div className="center">רשומת המלצה עצמאית — אין פרק סיום.</div> : null}
        </div>
      </div>
    </PinGate>
  );
}
