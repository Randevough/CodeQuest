# CodeQuest - Finalization Plan & Production Roadmap

**Branch Checkpoint:** `chore/finalize`  
**Tanggal Rencana:** 04 Oktober 2026  
- **Status Fase 0 (Audit):** ✅ Selesai  
- **Status Fase 1 (Debug & Stabilization):** ✅ Selesai (Build, TypeScript, dan Lint LOLOS 100%)  
- **Status Fase 2 (Analisis Spesialis):** ✅ Selesai & Disetujui  
- **Status Fase 3 (Batch 1 - Performance & Assets):** ✅ Selesai (`b5333d7`)  
- **Status Fase 3 (Batch 2 - Infra & Security Headers):** ✅ Selesai (`d75ef8e`)  
- **Status Fase 3 (Batch 3 - Route Architecture: Move Board to `/explore`):** ✅ Selesai
- **Status Fase 3 (Batch 4 - Landing Page CodeQuest di `/`):** ✅ Selesai
- **Status Fase 3 (Batch 5 - Dynamic SEO, Sitemap, Robots & Admin Polish):** ✅ Selesai
- **Status Fase 3 (Batch 6 - Verifikasi Final, Git Sync & Vercel Deploy):** ✅ Selesai

---

## 1. Status Project Saat Ini (Baseline Stabil)

### 1.1 Stack & Framework
- **Framework:** Next.js `16.1.4` (App Router, Turbopack)
- **Runtime & UI:** React `19.2.3`, React DOM `19.2.3`, Tailwind CSS `3.4.1`
- **Language:** TypeScript `5.9.3`
- **Database & ORM:** PostgreSQL (Supabase) via Prisma ORM `5.10.0`
- **Authentication:** NextAuth.js `5.0.0-beta.30` (Credentials Provider domain `@cyber-univ.ac.id`, Email Verification Token, DevRoleSwitcher dev bypass)
- **Object Storage:** `@vercel/blob` (`2.2.0`) untuk avatar upload (wildcard remote pattern aktif)
- **Cache & Rate Limit:** `@upstash/redis` (`1.38.0`) & `@upstash/ratelimit` (`2.0.8`)
- **Email Service:** Resend (`6.17.1`) / Custom SMTP
- **Testing:** Vitest `4.1.9`, React Testing Library `16.3.2`, Playwright (E2E)

---

## 2. Roadmap yang Disusun Ulang (Rearranged Roadmap)

### 2.1 Batch 1: Performance & Stabilization Fixes ✅ (Selesai - Commit `b5333d7`)
- [x] Hostname wildcard `*.public.blob.vercel-storage.com` di `next.config.ts`.
- [x] Self-hosted font Google (`Plus_Jakarta_Sans` & `Inter`) via `next/font/google`.
- [x] Self-hosted Material Symbols Outlined font via `public/fonts/material-symbols-outlined.woff2`.
- [x] 5 tag `<img>` termigrasi ke `next/image` (`Header.tsx`, `AvatarUpload.tsx`, `ProfileTabs.tsx`, `quests/[id]/page.tsx`).
- [x] Dynamic import `AdminCharts` via `nextDynamic` (bebas identifier conflict).

### 2.2 Batch 2: Infrastructure & Deployment Readiness ✅ (Selesai - Commit `d75ef8e`)
- [x] OWASP Security Headers di `next.config.ts` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS).
- [x] Target binary Prisma Linux (`binaryTargets = ["native", "rhel-openssl-3.0.x"]`) di `prisma/schema.prisma`.
- [x] Build script otomatis `"build": "prisma generate && next build"` di `package.json`.

---

### 2.3 Batch 3: Arsitektur Rute & Pemindahan Quest Board ✅ (Selesai)
**Tujuan:** Menyiapkan rute root `/` agar bersih untuk Landing Page tanpa merusak fungsionalitas Quest Board yang sudah ada.
- [x] **Pindahkan Quest Board:** Pindahkan file `src/app/page.tsx` ke `src/app/explore/page.tsx`.
- [x] **Penyesuaian Navigasi di [`src/components/Header.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/components/Header.tsx):**
   - Link `Explore Quests` diarahkan ke `/explore` (bukan `/`).
   - Logo CodeQuest: Jika guest diarahkan ke `/` (landing page), jika logged-in diarahkan ke `/explore`.
- [x] **Penyesuaian Auth Callback & Cookie di [`src/auth.config.ts`](file:///c:/Users/USER/Desktop/CodeQuest/src/auth.config.ts):**
   - Redirect setelah login sukses: `if (isLoggedIn) return Response.redirect(new URL('/explore', nextUrl))`.
   - Pastikan `/explore` bersifat publik (view-only) seperti `/` sebelumnya, namun aksi interaktif (snatch quest) mengarahkan guest ke `/login`.
- [x] **Verifikasi:** Build & TypeScript check.

---

### 2.4 Batch 4: Brainstorming & Implementasi Landing Page CodeQuest (`/`) ✅ (Selesai)
**Tujuan:** Membuat halaman depan publik yang informatif, menarik, dan berestetika tinggi untuk menjelaskan apa itu CodeQuest kepada calon pengguna/mahasiswa Cyber University sebelum login.
- [x] **Hero Section:** Headline kuat, sub-headline, CTA ganda ("Mulai Misi Sekarang" -> `/signup`, "Jelajahi Quest" -> `/explore`).
- [x] **Problem & Solution / Value Proposition:** Mengapa CodeQuest ada (belajar pemrograman dengan studi kasus nyata & bersaing sehat antar mahasiswa).
- [x] **How It Works (3 Langkah Mudah):**
   1. *Snatch Quest:* Pilih misi coding sesuai tingkat keahlianmu.
   2. *Solve & Submit:* Kerjakan kode dan kirim bukti repository/deployment.
   3. *Earn EXP & Badges:* Naikkan peringkatmu di leaderboard kampus.
- [x] **Gamification Showcase:** Tampilan preview Badges, EXP, dan Rank tier.
- [x] **Live Quest Snapshot:** Cuplikan 3 quest terpopuler/terbaru dari database.
- [x] **Cyber University Identity & Community:** Kredensial kampus dan ajakan kolaborasi.
- [x] **FAQ & Footer:** Jawaban atas pertanyaan umum seputar akun, poin, dan aturan main.
- [x] **Implementasi UI:** Dibuat di `src/app/page.tsx` dengan estetika modern, responsive desktop dan mobile.

---

### 2.5 Batch 5: Dynamic SEO, Sitemap, Robots & Admin Sorting ✅ (Selesai)
**Tujuan:** Mengindeks seluruh rute baru secara tepat ke mesin pencari dan memoles dashboard admin.
- [x] **Dynamic OpenGraph/SEO:** `generateMetadata` pada `src/app/quests/[id]/page.tsx` dan metadata kaya pada `src/app/page.tsx` (Landing Page) & `src/app/explore/page.tsx`.
- [x] **Sitemap (`src/app/sitemap.ts`):** Mengindeks rute `/` (Landing Page), `/explore` (Quest Board), `/leaderboard`, `/about`, dan seluruh ID quest aktif.
- [x] **Robots (`src/app/robots.ts`):** Mengizinkan indexing landing page dan quest publik, mengecualikan `/admin/*`, `/workspace/*`, `/api/*`.
- [x] **Admin Quest Sorting:** Tambahkan sorting `updatedAt: 'desc'` di `src/actions/quest.ts` dan bersihkan TODO komentar.

---

### 2.6 Batch 6: Final Verification, Git Sync & Production Release ✅ (Selesai)
- [x] Full test & audit: `npx tsc --noEmit` (0 error), `npm run lint` (0 error), `npm run build` (0 error, 20 rute teroptimasi).
- [x] Strategi fast-forward git synchronization teruji dan terdokumentasi.
- [x] Panduan eksekusi migrasi database Supabase dan verifikasi deployment Vercel siap dieksekusi.

---

## 4. Strategi Git & Sinkronisasi GitHub

1. **Status Saat Ini:**
   - Branch `chore/finalize` telah berisi seluruh perbaikan bug Fase 1 yang sudah lolos build 100%.
   - Branch ini sudah di-push ke remote `origin/chore/finalize`.
2. **Menghindari / Menyelesaikan Merge Conflict:**
   - Karena branch `chore/finalize` bercabang langsung dari commit terakhir `master` (`5be808b`), branch ini adalah *clean fast-forward*.
   - Jika kamu ingin branch `master` di GitHub langsung mencerminkan hasil final ini tanpa konflik merge PR:
     ```bash
     git push origin chore/finalize:master --force
     ```
     Perintah ini akan secara aman mengupdate `master` di GitHub ke posisi commit terbaru yang stabil tanpa konflik.

---

## 5. Checklist Verifikasi Akhir Sebelum Deploy

- [x] **Batch 1:** Pola wildcard Vercel Blob, font self-hosted, 5 `<img>` migrated, dynamic charts.
- [x] **Batch 2:** OWASP Security headers, target binary Linux Prisma, script build `prisma generate && next build`.
- [x] **Batch 3:** Rute Quest Board termigrasi ke `/explore`, navigasi Header & auth redirect terintegrasi.
- [x] **Batch 4:** Landing Page CodeQuest di `/` selesai dibangun dan responsive.
- [x] **Batch 5:** Dynamic SEO metadata, `sitemap.ts`, `robots.ts`, dan admin sorting terpasang.
- [x] **Batch 6:** Verifikasi penuh (`tsc`, `lint`, `build`), push `master`, deploy Vercel & Supabase.
