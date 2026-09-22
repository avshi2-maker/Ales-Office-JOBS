// DynamicForm.js (src/components/DynamicForm.js) · updated 22.09.2026 12:59 (Asia/Jerusalem)
"use client";
import { useState } from "react";
import MediaCapture from "./MediaCapture";

// props: type (job type obj), onSaved(row), onSubmit(row) async
export default function DynamicForm({ type, onSubmit }) {
  const [base, setBase] = useState({ title: "", city: "", customer: "", ales_quote: "", notes: "" });
  const [fields, setFields] = useState({});
  const [media, setMedia] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const isTesti = type.id === "testimonial";

  function setF(key, v) { setFields((p) => ({ ...p, [key]: v })); }

  function stars(key) {
    const cur = Number(fields[key] || 0);
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={"star" + (n <= cur ? " on" : "")} onClick={() => setF(key, n)}>★</span>
        ))}
      </div>
    );
  }

  function renderField(f) {
    const openWrap = { className: f.full ? "" : "" };
    if (f.type === "stars") {
      return (<div key={f.key}><label>{f.label}</label>{stars(f.key)}</div>);
    }
    if (f.type === "check") {
      return (
        <div key={f.key} className="chk" style={{ marginTop: 12 }}>
          <input type="checkbox" id={f.key} checked={!!fields[f.key]} onChange={(e) => setF(f.key, e.target.checked)} />
          <label htmlFor={f.key}>{f.label}</label>
        </div>
      );
    }
    if (f.type === "textarea") {
      return (
        <div key={f.key}>
          <label>{f.label}</label>
          <textarea value={fields[f.key] || ""} placeholder={f.placeholder || ""} onChange={(e) => setF(f.key, e.target.value)} />
        </div>
      );
    }
    if (f.type === "select") {
      return (
        <div key={f.key}>
          <label>{f.label}</label>
          <select value={fields[f.key] || ""} onChange={(e) => setF(f.key, e.target.value)}>
            <option value="">— בחר —</option>
            {f.options.map((o) => (<option key={o} value={o}>{o}</option>))}
          </select>
        </div>
      );
    }
    return (
      <div key={f.key}>
        <label>{f.label}</label>
        <input type={f.type === "number" ? "number" : "text"} value={fields[f.key] || ""} placeholder={f.placeholder || ""} onChange={(e) => setF(f.key, e.target.value)} />
      </div>
    );
  }

  async function submit() {
    if (!base.title.trim() && !base.customer.trim()) {
      setMsg({ t: "err", m: "מלא לפחות כותרת פרויקט או שם לקוח" });
      return;
    }
    setSaving(true);
    setMsg(null);
    const row = {
      job_type: type.id,
      title: base.title.trim(),
      city: base.city.trim(),
      customer: base.customer.trim(),
      ales_quote: base.ales_quote.trim(),
      notes: base.notes.trim(),
      rating: isTesti ? Number(fields.rating || 0) || null : null,
      permission: isTesti ? !!fields.permission : false,
      fields,
      media,
    };
    try {
      await onSubmit(row);
      setMsg({ t: "ok", m: "✓ נשמר בהצלחה" });
      setBase({ title: "", city: "", customer: "", ales_quote: "", notes: "" });
      setFields({});
      setMedia([]);
    } catch (e) {
      setMsg({ t: "err", m: e.message || "שמירה נכשלה" });
    }
    setSaving(false);
  }

  const fullFields = type.fields.filter((f) => f.full);
  const halfFields = type.fields.filter((f) => !f.full);

  return (
    <div>
      <div className="grid2">
        <div><label>{isTesti ? "שם הלקוח" : "כותרת הפרויקט"}</label>
          <input value={base.title} onChange={(e) => setBase({ ...base, title: e.target.value })}
            placeholder={isTesti ? "שם פרטי / מלא" : "כיור שיש שחור לווילה בהרצליה"} /></div>
        <div><label>עיר</label>
          <input value={base.city} onChange={(e) => setBase({ ...base, city: e.target.value })} placeholder="הרצליה" /></div>
      </div>
      {!isTesti ? (
        <div className="grid2">
          <div><label>שם הלקוח</label>
            <input value={base.customer} onChange={(e) => setBase({ ...base, customer: e.target.value })} placeholder="שם הלקוח" /></div>
          <div><label>הצעת מחיר / עלות</label>
            <input value={base.ales_quote} onChange={(e) => setBase({ ...base, ales_quote: e.target.value })} placeholder="₪ ..." /></div>
        </div>
      ) : null}

      <div className="grid2">{halfFields.map(renderField)}</div>
      {fullFields.map(renderField)}

      {!isTesti ? (
        <div><label>הערות</label>
          <textarea value={base.notes} onChange={(e) => setBase({ ...base, notes: e.target.value })} placeholder="כל דבר נוסף ששווה לתעד" /></div>
      ) : null}

      <MediaCapture media={media} setMedia={setMedia} />

      <button className="btn" style={{ marginTop: 18 }} disabled={saving} onClick={submit}>
        {saving ? "שומר..." : "💾 שמור עבודה"}
      </button>
      {msg ? <div className={"msg " + (msg.t === "ok" ? "ok" : "err")}>{msg.m}</div> : null}
    </div>
  );
}
