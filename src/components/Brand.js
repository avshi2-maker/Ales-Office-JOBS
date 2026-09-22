// Brand.js (src/components/Brand.js) · updated 22.09.2026 12:57 (Asia/Jerusalem)
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Brand() {
  const path = usePathname();
  const isNew = path === "/new";
  const isGal = path === "/gallery";
  return (
    <div className="topbar">
      <Link href="/" className="brand">
        <span className="diamond" /><b>Marble Art</b>
      </Link>
      <nav className="topnav">
        <Link href="/new" className={isNew ? "on" : ""}>➕ עבודה חדשה</Link>
        <Link href="/gallery" className={isGal ? "on" : ""}>🖼️ גלריה</Link>
      </nav>
    </div>
  );
}
