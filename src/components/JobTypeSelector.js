// JobTypeSelector.js (src/components/JobTypeSelector.js) · updated 22.09.2026 13:00 (Asia/Jerusalem)
"use client";
import { JOB_TYPES } from "@/lib/jobtypes";

// props: value (id), onChange(id)
export default function JobTypeSelector({ value, onChange }) {
  return (
    <div className="types">
      {JOB_TYPES.map((t) => {
        const cls = "typebtn" + (value === t.id ? " on" : "");
        return (
          <button key={t.id} type="button" className={cls} onClick={() => onChange(t.id)}>
            <span className="ic">{t.icon}</span>{t.label}
          </button>
        );
      })}
    </div>
  );
}
