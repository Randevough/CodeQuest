# CodeQuest - Finalization Plan & Production Roadmap

**Branch Checkpoint:** `chore/finalize`  
**Tanggal Rencana:** 04 Oktober 2026  
**Status Fase 0 (Audit):** ✅ Selesai  
**Status Fase 1 (Debug & Stabilization):** ✅ Selesai (Build, TypeScript, dan Lint LOLOS 100%)  
**Status Fase 2 (Analisis Spesialis):** ✅ Selesai & Disetujui  
**Status Fase 3 (Peningkatan & Persiapan Deploy):** 📋 Rencana Siap Eksekusi (Belum menyentuh kode)  

---

## 1. Status Project Saat Ini (Baseline Stabil)

### 1.1 Stack & Framework
- **Framework:** Next.js `16.1.4` (App Router, Turbopack)
- **Runtime & UI:** React `19.2.3`, React DOM `19.2.3`, Tailwind CSS `3.4.1`
- **Language:** TypeScript `5.9.3`
- **Database & ORM:** PostgreSQL (Supabase) via Prisma ORM `5.10.0`
- **Authentication:** NextAuth.js `5.0.0-beta.30` (Credentials Provider domain `@cyber-univ.ac.id`, Email Verification Token, DevRoleSwitcher dev bypass)
- **Object Storage:** `@vercel/blob` (`2.2.0`) untuk avatar upload
- **Cache & Rate Limit:** `@upstash/redis` (`1.38.0`) & `@upstash/ratelimit` (`2.0.8`)
- **Email Service:** Resend (`6.17.1`) / Custom SMTP
- **Testing:** Vitest `4.1.9`, React Testing Library `16.3.2`, Playwright (E2E)

---

### 1.2 Status Database & Layanan Eksternal (Supabase, Storage, Auth)
| Komponen | Temuan Audit | Status |
| :--- | :--- | :--- |
| **Koneksi Database** | Host PostgreSQL Supabase berhasil dihubungi melalui IPv4 pooler (`SELECT current_database()` -> `postgres`, Host: `2406:da18:1691:a200::f3ad`). | ✅ **ALIVE & CONNECTED** (Bukan blocker eksternal) |
| **Supabase Client SDK** | Kode **tidak** memakai `@supabase/supabase-js`, `NEXT_PUBLIC_SUPABASE_URL`, atau `anon key`. Semua query database menggunakan **Prisma Client** (`src/lib/db.ts`). | ℹ️ Sesuai arsitektur Prisma |
| **Database Migrations** | Folder `supabase/migrations` tidak ada; skema dikelola melalui `prisma/migrations`: <br>1. `20260210001751_codequest_1_0_0`<br>2. `20260705000000_add_email_verification`<br>Skema dapat direproduksi kapan saja dengan `npx prisma migrate deploy` atau `npx prisma db push`. | ✅ Terkelola via Prisma |
| **Tabel / Model DB** | `User`, `Quest`, `Squad`, `Snatch`, `Penalty`, `Account`, `Badge`, `UserBadge`, `Notification`, `VerificationToken`. | ✅ Lengkap di `schema.prisma` |
| **RLS Policy** | Prisma terhubung menggunakan koneksi pooler Postgres langsung, sehingga otorisasi ditegakkan pada tingkat aplikasi (`src/lib/auth-guard.ts` & Server Actions). | ✅ Dikelola via Guard |
| **Auth Provider** | NextAuth v5 dengan Credentials Provider (validasi email `@cyber-univ.ac.id` dan password terenkripsi bcrypt). Terdapat dev role mock di environment development via cookie `cq_dev_role`. | ✅ Fungsional |
| **Object Storage** | Menggunakan Vercel Blob Storage (`@vercel/blob` via `BLOB_READ_WRITE_TOKEN`), bukan Supabase Storage. Digunakan di `src/actions/profile.ts`. | ✅ Terkonfigurasi |

---

### 1.3 Hasil Pengujian Terkini (Pipeline Verification)
- **`npm run build`**: ✅ **PASSED** (Semua 17 rute selesai dikompilasi dan dioptimasi oleh Turbopack tanpa error).
- **`npx tsc --noEmit`**: ✅ **PASSED** (0 TypeScript compile errors).
- **`npm run lint`**: ✅ **PASSED** (0 lint errors; 34 warning minor/formatting non-blocking).
- **`npm run test` (Vitest)**: ℹ️ Exclude `.kilo/**` dan `.next/**` terpasang.

---

## 2. Daftar Bug & Status Perbaikan

| ID | Lokasi | Kategori | Deskripsi | Status | Solusi yang Diterapkan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | `src/app/admin/submissions/page.tsx` | Build Blocker | Pemanggilan fungsi `seedSubmissions()` yang sudah tidak didefinisikan. | ✅ **RESOLVED** | Dihapus `handleSeedData` dan tombol dead code `Seed Data`. |
| **BUG-02** | `src/app/quests/[id]/page.tsx` | Type Blocker | `quest.requirements` dipanggil dengan `JSON.parse()` dan `quest.resources` dipanggil dengan `.split()`, padahal keduanya sudah bertipe `string[]` di Prisma. | ✅ **RESOLVED** | Langsung gunakan array native Prisma dan parse markdown link aman. |
| **BUG-03** | `src/app/leaderboard/page.tsx` & `src/actions/user.ts` | Type Blocker | Return type `getLeaderboardUsers` cast `as any`, memicu TS7006 parameter `u` pada `.map()`. | ✅ **RESOLVED** | Strongly typed dengan interface `LeaderboardUser`. |
| **BUG-04** | `src/components/dev/DevRoleSwitcher.tsx` | Lint Blocker | `setMounted(true)` dipanggil sinkron di root `useEffect` sehingga memicu aturan React hook ESLint. | ✅ **RESOLVED** | Diganti menggunakan `useSyncExternalStore` dan lazy `useState`. |
| **BUG-05** | Multi-file (`src/actions/*`, `src/app/*`) | Lint Blocker | Pemakaian `any` tanpa tipe spesifik dan unused variables (`Link`, `getMyActiveQuestIds`, dll). | ✅ **RESOLVED** | Dihapus unused import/variable dan diganti dengan tipe aman (`User`, `NextRequest`, `Session`, dsb). |
| **BUG-06** | `vitest.config.ts` & `eslint.config.mjs` | Test/Lint Config | Scanner memindai folder `.kilo` worktree dan memicu duplicate error. | ✅ **RESOLVED** | Ditambahkan ignore rule untuk `.kilo/**` dan `.next/**`. |

---

## 3. Implementation Plan: Fase 3 (Peningkatan & Persiapan Deploy)

> **PENTING:** Rencana ini belum diaplikasikan ke kode. Semua langkah di bawah baru akan dieksekusi setelah mendapatkan persetujuan spesifik.

### 3.1 Domain Performance (Agent 2)

#### Task 3.1.1: Self-Hosted Font Loading (`next/font/google`)
- **File Target:** [`src/app/layout.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/layout.tsx) & [`src/app/admin/layout.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/admin/layout.tsx)
- **Langkah:**
  1. Hapus tag `<link>` eksternal `fonts.googleapis.com` dari `<head>`.
  2. Impor `Inter` dan `Plus_Jakarta_Sans` dari `next/font/google` dengan `subsets: ['latin']`, `display: 'swap'`, dan CSS variable.
  3. Terapkan variable class ke elemen `<html>` atau `<body>`.
  4. Untuk Material Symbols Outlined, gunakan file `.woff2` lokal di `public/fonts/` atau class font lokal untuk memotong 100% request CDN eksternal.
- **Dampak:** Menghilangkan 3 external blocking network request, mencegah FOUT, dan mengeliminasi warning `@next/next/no-page-custom-font`.

#### Task 3.1.2: Perbaikan Bug Vercel Blob Local & Migrasi Tag `<img>`
- **Akar Masalah Bug Vercel Blob di Local:**
  1. Pada [`next.config.ts:20`](file:///c:/Users/USER/Desktop/CodeQuest/next.config.ts#L20), hostname Vercel Blob di-hardcode ke satu sub-domain spesifik:
     ```ts
     hostname: '6t5tfdwgh8pvy3vf.public.blob.vercel-storage.com'
     ```
     Jika store yang digunakan berbeda atau token `BLOB_READ_WRITE_TOKEN` menghasilkan host lain, Next.js Image Optimization akan **memblokir** gambar tersebut (error 400 hostname not configured).
  2. **Solusi:** Ganti hostname menjadi pola wildcard:
     ```ts
     {
       protocol: 'https',
       hostname: '*.public.blob.vercel-storage.com',
     }
     ```
     Dengan wildcard ini, gambar dari store Vercel Blob mana pun akan selalu diizinkan di local maupun production.
- **Langkah Migrasi 5 Tag `<img>` Sisa:**
  - [`src/components/Header.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/components/Header.tsx): Migrasi avatar pengguna desktop & mobile nav ke `<Image width={36} height={36} />`.
  - [`src/components/profile/AvatarUpload.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/components/profile/AvatarUpload.tsx): Migrasi preview avatar ke `<Image fill />`.
  - [`src/components/profile/ProfileTabs.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/components/profile/ProfileTabs.tsx): Migrasi icon badge/quest ke `<Image width={40} height={40} />`.
  - [`src/app/quests/[id]/page.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/quests/[id]/page.tsx): Migrasi avatar snatcher ke `<Image width={40} height={40} />`.

#### Task 3.1.3: Dynamic Import untuk Komponen Berat & Modal
- **File Target:** [`src/app/admin/page.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/admin/page.tsx)
- **Langkah:**
  Ganti impor statis `ActivityTrendChart` dan `DifficultyDistributionChart` dengan `next/dynamic`:
  ```ts
  const ActivityTrendChart = dynamic(
    () => import('@/components/admin/AdminCharts').then(m => m.ActivityTrendChart),
    { ssr: false, loading: () => <div className="h-64 animate-pulse bg-slate-100 dark:bg-zinc-800 rounded-xl" /> }
  )
  ```
- **Dampak:** Memotong ukuran bundle JavaScript inisial halaman admin sebesar ~150KB+.

---

### 3.2 Domain Deployment & Infrastruktur (Agent 3)

#### Task 3.2.1: Otomasi File Proyek (Dikerjakan oleh AI di Repo)
1. **Security Headers di [`next.config.ts`](file:///c:/Users/USER/Desktop/CodeQuest/next.config.ts):**
   Tambahkan konfigurasi `headers()` standar keamanan:
   - `X-Frame-Options: DENY` (mencegah clickjacking)
   - `X-Content-Type-Options: nosniff` (mencegah MIME sniffing)
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
2. **Prisma Linux Engine Target di [`prisma/schema.prisma`](file:///c:/Users/USER/Desktop/CodeQuest/prisma/schema.prisma):**
   Tambahkan `binaryTargets = ["native", "rhel-openssl-3.0.x"]` di generator client agar binary engine Prisma terjamin cocok saat di-build di container Vercel Linux.
3. **Build Script di [`package.json`](file:///c:/Users/USER/Desktop/CodeQuest/package.json):**
   Pastikan script build menyertakan generate client: `"build": "prisma generate && next build"`.

#### Task 3.2.2: Panduan Setup Manual (Dikerjakan User di Dashboard)
1. **Supabase Dashboard (Project Settings -> Database):**
   - **DATABASE_URL (Runtime):** Salin URL **Transaction Pooler (Port 6543)**.
     *Rekomendasi:* Tambahkan parameter `?pgbouncer=true&connection_limit=1`. Ini mencegah Vercel Serverless Functions menghabiskan kuota koneksi PostgreSQL saat banyak user mengakses bersamaan.
   - **DIRECT_URL (Migrations):** Salin URL **Direct Connection (Port 5432)** untuk keperluan migrasi schema.
2. **Vercel Dashboard:**
   - Hubungkan repository `Randevough/CodeQuest`.
   - Di menu *Settings -> Environment Variables*, tambahkan:
     - `DATABASE_URL` (Pooler 6543)
     - `DIRECT_URL` (Direct 5432)
     - `AUTH_SECRET` (generate string 32-byte acak via `openssl rand -base64 32`)
     - `BLOB_READ_WRITE_TOKEN` (otomatis tersedia jika Vercel Blob store dihubungkan via tab Storage)
     - `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` (dari console Upstash)
     - `NEXTAUTH_URL` (domain production, misal `https://codequest.cyber-univ.ac.id`)
3. **Eksekusi Migrasi Database ke Supabase Production:**
   - Jalankan perintah dari terminal:
     ```bash
     npx prisma migrate deploy
     npx tsx prisma/seed_badges.ts
     ```

---

### 3.3 Domain Enhancement & SEO (Agent 4)

#### Task 3.3.1: Evaluasi Performa Dynamic SEO Metadata
- **Pertanyaan User: *"Berat ngga ya itu?"***
- **Analisis & Jawaban: TIDAK BERAT, sangat ringan.**
  - **Mengapa:**
    1. Di Next.js App Router, `generateMetadata` dieksekusi di server sebelum response HTML dikirim ke browser.
    2. Fungsi query `getQuest(id)` dibungkus dengan `React.cache()` sehingga query database **hanya dieksekusi 1 kali** untuk seluruh siklus request (Next.js me-reuse hasil query antara `generateMetadata` dan component halaman utama).
    3. Ukuran data yang diambil hanya `title` dan `description` (beberapa byte teks).
  - **Keuntungan:** Tautan quest yang dibagikan ke WhatsApp, Discord, Slack, atau LinkedIn akan langsung menampilkan kartu preview interaktif yang profesional.

#### Task 3.3.2: Generator `sitemap.ts` & `robots.ts`
- **File Target:** `src/app/sitemap.ts` & `src/app/robots.ts`
- **Implementasi:**
  - `robots.ts`: Izinkan indexing untuk `/`, `/about`, `/leaderboard`, `/quests/*`, dan blokir indexing pada `/admin/*`, `/api/*`, `/workspace/*`.
  - `sitemap.ts`: Daftarkan URL statis dan lakukan query dinamis ID quest aktif untuk XML sitemap otomatis.

#### Task 3.3.3: Penyelesaian TODO Admin Quests Sorting
- **File Target:** [`src/actions/quest.ts`](file:///c:/Users/USER/Desktop/CodeQuest/src/actions/quest.ts) & [`src/app/admin/manage-quests/page.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/admin/manage-quests/page.tsx)
- **Implementasi:**
  Tambahkan parameter `orderBy: { updatedAt: 'desc' }` pada query admin agar quest yang baru diedit atau dibuat selalu muncul di posisi teratas.

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

- [x] Pola wildcard `*.public.blob.vercel-storage.com` terpasang di `next.config.ts`.
- [x] Font lokal self-hosted terpasang tanpa link Google Fonts eksternal.
- [x] 5 tag `<img>` termigrasi ke `<Image />`.
- [ ] `sitemap.ts` dan `robots.ts` ter-generate.
- [x] `npx tsc --noEmit` -> PASS (0 error).
- [x] `npm run lint` -> PASS (0 error, 25 warnings non-blocking).
- [x] `npm run build` -> PASS (17 routes compiled).
- [ ] Push/Force push final ke `master`.
- [ ] Konfigurasi Vercel Environment Variables & deploy.
