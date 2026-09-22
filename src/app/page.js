// page.js (src/app/page.js) · updated 22.09.2026 13:04 (Asia/Jerusalem)
"use client";
import Link from "next/link";
import PinGate from "@/components/PinGate";
import Brand from "@/components/Brand";

export default function Home() {
  return (
    <PinGate>
      <div className="app">
        <Brand />
        <div className="wrap">
          <div className="card">
            <h1 className="fr">שלום אלס 👋</h1>
            <p className="hint">תיעוד עבודות בשטח — כיורים, שיפוצים, דלתות שיש והמלצות. מלא, צלם, שמור.</p>
            <Link href="/new"><button className="btn">➕ עבודה חדשה</button></Link>
            <Link href="/gallery"><button className="btn ghost" style={{ marginTop: 10 }}>🖼️ גלריית הפרויקטים</button></Link>
          </div>
          <div className="card">
            <h2 className="fr">איך זה עובד</h2>
            <p className="hint" style={{ margin: 0 }}>
              1. בחר סוג עבודה · 2. מלא את הפרטים מול הלקוח · 3. צלם תמונות/וידאו מהטלפון · 4. שמור.<br />
              הכל נאסף בגלריה אחת — משם אפשר לשלוח ללקוחות חדשים בוואטסאפ או במייל.
            </p>
          </div>
        </div>
      </div>
    </PinGate>
  );
}
