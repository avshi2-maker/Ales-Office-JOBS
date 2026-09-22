// layout.js (src/app/layout.js) · updated 22.09.2026 12:56 (Asia/Jerusalem)
import "./globals.css";

export const metadata = {
  title: "Ales Office JOBS · Marble Art",
  description: "כלי שטח לתיעוד פרויקטים — כיורים, שיפוצים, דלתות שיש והמלצות",
  robots: { index: false, follow: false }, // private field tool — keep out of search
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2B2B2B",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Frank+Ruhl+Libre:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
