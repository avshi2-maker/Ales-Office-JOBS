# Ales Office JOBS

כלי שטח נייד לתיעוד פרויקטים של Marble Art — כיורים, שיפוצים, דלתות שיש והמלצות.
מילוי מול הלקוח, צילום ישיר מהמצלמה, העלאה ל־Cloudinary, שמירה ב־Supabase,
וגלריה אחת מסוננת לשליחת נכסים ללקוחות חדשים בוואטסאפ / מייל.

## Stack
Next.js 14 (App Router, JS) · Supabase · Cloudinary (unsigned) · Vercel · Hebrew RTL.

## Setup
1. `npm install`
2. Copy `.env.local.example` → `.env.local`, fill the 5 values.
3. In Supabase → SQL Editor, run `supabase.sql` (creates `ales_jobs` + RLS).
4. In Cloudinary → Settings → Upload → create an **unsigned** preset, put its name in env.
5. `npm run dev` → open on the phone (same network) or deploy to Vercel.

## Deploy (Vercel)
Import the repo → add the 5 env vars → set the custom domain (e.g. `ales.marble-art.co.il`).

## Notes
- PIN gate (`NEXT_PUBLIC_APP_PIN`) is a light field guard, not real auth. `robots: noindex`.
- Adding a 5th job line = one entry in `src/lib/jobtypes.js`.
