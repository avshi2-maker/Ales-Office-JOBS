// Brand.js (src/components/Brand.js) · updated 23.09.2026 07:37 (Asia/Jerusalem)
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LiveClock from "./LiveClock";

export default function Brand() {
  const path = usePathname();
  const isNew = path === "/new";
  const isGal = path === "/gallery";
  return (
    <div className="topbar">
      <Link href="/" className="brand">
        <span className="diamond" /><b>Marble Art</b>
      </Link>
      <LiveClock />
      <nav className="topnav">
        <Link href="/new" className={isNew ? "on" : ""}>➕ עבודה חדשה</Link>
        <Link href="/gallery" className={isGal ? "on" : ""}>🖼️ גלריה</Link>
      </nav>
    </div>
  );
}
