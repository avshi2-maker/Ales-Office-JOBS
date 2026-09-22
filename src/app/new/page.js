// new/page.js (src/app/new/page.js) · updated 22.09.2026 13:05 (Asia/Jerusalem)
"use client";
import { useState } from "react";
import PinGate from "@/components/PinGate";
import Brand from "@/components/Brand";
import JobTypeSelector from "@/components/JobTypeSelector";
import DynamicForm from "@/components/DynamicForm";
import { typeById } from "@/lib/jobtypes";
import { saveJob, supabaseReady } from "@/lib/supabase";

export default function NewJob() {
  const [typeId, setTypeId] = useState("sinks");
  const type = typeById(typeId);

  async function onSubmit(row) {
    await saveJob(row);
  }

  return (
    <PinGate>
      <div className="app">
        <Brand />
        <div className="wrap">
          <div className="card">
            <h2 className="fr">בחר סוג עבודה</h2>
            <JobTypeSelector value={typeId} onChange={setTypeId} />
          </div>

          {!supabaseReady ? (
            <div className="warn">Supabase לא מוגדר — הוסף מפתחות ל־.env.local כדי שהשמירה תעבוד.</div>
          ) : null}

          <div className="card">
            <h2 className="fr">{type.icon} {type.label}</h2>
            <p className="hint">מלא מול הלקוח בשטח. אפשר לצלם ישירות מהמצלמה.</p>
            <DynamicForm key={typeId} type={type} onSubmit={onSubmit} />
          </div>
        </div>
      </div>
    </PinGate>
  );
}
