# Marble Art · Ales → CRM → Site → Search → Studio — Full Handover
**Date:** 23.09.2026 EOD · **Owner:** Avshi Sapir · **Supersedes:** HANDOVER_23092026.md (kept for history)
Plan/mockups artifact: "Marble Art Case Engine".

---

## 1. THE FLOW (all live)
```
Ales phone (ales.marble-art.co.il)
  ➕ new job (before photos, saved on phone first, uploads when signal)
  → 🖼️ gallery → ✅ סיום עבודה + המלצה (after photos / 📎 use existing, rating, quote, 🎙️ recording, 3 consents)
      │  every 10 min (Vercel Cron) or 🔄 סנכרן מאלס
      ▼
CRM (crm.marble-art.co.il) → tab "תיקי פרויקטים מאלס"
  📧 email to avshi2@gmail.com (new job) + ⏰ daily reminder until opened
  📂 תיקי פרויקט → 🎙️ transcribe → ✨ צור (Claude) → 📷 הוסף תמונות → 10 gates → ✅ אשר ופרסם
      │
      ├─► marble-art.co.il/projects/<slug>  (JSON-LD, sitemap, city page, /llms-full.txt)
      ├─► Bing IndexNow ping (auto)  → Bing / ChatGPT search / Copilot
      ├─► 🔎 אינדוקס גוגל + בינג (Google = manual Request indexing; Bing = 🅱️ button)
      └─► Studio (studio.marble-art.co.il/cases, tab 📂 מאלס) → IG/FB/Pinterest texts → ✓ סמן פורסם (synced to CRM)
```

## 2. WHAT WAS BUILT TODAY (commits)
### Ales-Office-JOBS (ales.marble-art.co.il) — Supabase `oqqviohkynhmbfsqntxr`
| Commit | What |
|---|---|
| 6dc8713 | Vercel fix: framework=nextjs, next 14.2.35 |
| 1c78b06 | Live clock + date stamps (form, cards, share) |
| 7fb3933 | Phase 1: `/job/[id]` finish chapter + testimonial; rpc `finish_job` (security definer); price removed from share |
| 46c08de | 📷/🎥/🖼️ capture bar, 🎙️ in-app recorder, save-now-send-later IndexedDB queue, header pending badge |
| 15b428b | Finish: "📎 use existing photos as after" + clearer message |

### Sinks_ART CRM (crm.marble-art.co.il) — Supabase `givcxgzhfoetujhrjgvc`
| Commit | What |
|---|---|
| c59a091 | `/index-tracker` (sitemap-synced URL list, Search Console links) |
| 49566da | Bridge (pull from Ales) + `/case-studies` (transcribe, generate, 10 gates, publish, IndexNow) |
| b19b1a0 | Top tab "תיקי פרויקטים מאלס"; recordings played/transcribed as Cloudinary mp3 |
| 3e92b06 | Auto-lengthen short stories; 📣 open in Studio; social badges |
| 552bc91 | Restored `/rfq-create` + `/rfq/[token]` (404 since 05.07); nav ייצור ורכש → 📨 RFQ לאלס |
| 5496893 | Search Console link → URL-prefix property `https://www.marble-art.co.il/` |
| bfd4cfe | 📷 הוסף תמונות on case file; 🅱️ Bing in index tracker (send single/bulk, check, status) |
| 16fddc7 | Nav label "אינדוקס גוגל + בינג" |
| f5677be | 📧 Email alerts: Vercel Cron */10 → `/api/ales-notify`; daily reminder until opened |

### sinks-bathroom-design (marble-art.co.il)
| 87092ce | `/projects/[slug]` reads published cases (ISR 5 min), JSON-LD graph, projects index, sitemap, city-page block, `/llms-full.txt`, IndexNow key file |

### content-studio (studio.marble-art.co.il)
| f90a14f | Tab 📂 מאלס: cases live from CRM, texts w/ case link, copy/WhatsApp/history/variations, ✓ posted per network → CRM `social_log` |

## 3. DATABASE CHANGES (all APPLIED)
- **Ales** `ales_jobs`: status, finished_at, finish_date, after_media, testimonial, consent + rpc `finish_job`.
- **CRM**: `index_log` (+ bing_sent_at, bing_indexed_at) · `case_studies` (+ social_log, notified_at, last_reminder_at, opened_at).
- SQL files in each repo: `supabase_phase1_finish.sql` (Ales) · `supabase/phase42…phase46_*.sql` (CRM).

## 4. ENV VARS (Vercel, all set by Avshi)
- ales-office-jobs: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (dqdku88vv), _UPLOAD_PRESET (ales_unsigned), NEXT_PUBLIC_APP_PIN
- sinks-art (CRM): ALES_SUPABASE_URL, ALES_SUPABASE_ANON_KEY, CRON_SECRET (+ existing RESEND_API_KEY, LEAD_ALERT_EMAIL, ANTHROPIC_API_KEY, ELEVENLABS_API_KEY)
- content-studio: CRM_SUPABASE_URL, CRM_SUPABASE_ANON_KEY

## 5. SEARCH ENGINES (done today)
- Google Search Console (URL-prefix `https://www.marble-art.co.il/`): only `sitemap.xml` — Success, 28 pages. 3 bad double-domain entries removed.
- Bing Webmaster: imported from GSC; `sitemap.xml` Success 28; 9 core URLs submitted; 3 bad entries removed (verify). IndexNow key `35d431f30babbe96a9a401bd0d29be18` live on site.

## 6. CLEAN-UP DONE
- DEMO-TEST deleted from Ales + CRM (never published). Real case in CRM: **מלון שירותים** (generated, awaiting approval). Plus Avshi's new test job (finished, in CRM).

## 7. OPEN / NEXT (in order)
1. **Verify email for the new test job** — first alert (מלון שרותים) arrived ✓. If the new test job's email doesn't arrive within ~20 min: Vercel → sinks-art → Settings → Cron Jobs → check `/api/ales-notify` runs; logs.
2. **Delete Avshi's test job** (Ales + CRM) once email confirmed — ask Avshi item-by-item.
3. **מלון שירותים**: 📷 add 2+ photos → ✨ צור מחדש → 10/10 gates → ✅ אשר ופרסם → first real case page live.
4. **After first publish**: 🔎 tab → Google Request indexing; 🅱️ שלח הכל לבינג (all 28).
5. Optional (Avshi to decide): A) show open jobs in CRM as "🛠️ בביצוע אצל אלס"; B) clearer save message after new job.
6. Ferrari backlog: Google-review WhatsApp ask after publish (Phase 5), GBP post draft, per-case leads in /roi (Phase 6).

## 8. RESUME CHECKLIST
1. Read this file.
2. Folders: `C:\Ales-Office-JOBS`, `C:\SinkS\Sinks_ART`, `C:\SinkS\sinks-bathroom-design`, `C:\SinkS\content-studio` — token in each `.git/config` origin; request delete permission per repo (git locks).
3. Build tests: Ales `$HOME/alesbuild`; CRM `$HOME/crmbuild` (stub next/font/google in the COPY only); site `$HOME/sitebuild` (same stub); Studio `$HOME/studiobuild`.
4. CRM repo has many Avshi-local uncommitted/CRLF files — always `git add` specific paths only.
