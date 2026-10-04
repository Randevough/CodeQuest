# CodeQuest - Finalization Plan & Audit Report

**Branch Checkpoint:** `chore/finalize`  
**Tanggal Audit:** 04 Oktober 2026  
**Status Fase 0 (Audit):** Selesai  
**Status Fase 1 (Debug & Build Stabilization):** ✅ Selesai (Build, TypeScript, dan Lint LOLOS)  

---

## 1. Status Project Saat Ini

### 1.1 Stack & Framework
- **Framework:** Next.js `16.1.4` (App Router, Turbopack)
- **Runtime & UI:** React `19.2.3`, React DOM `19.2.3`, Tailwind CSS `3.4.1`
- **Language:** TypeScript `5.9.3`
- **Database & ORM:** PostgreSQL (Supabase) via Prisma ORM `5.10.0`
- **Authentication:** NextAuth.js `5.0.0-beta.30` (Credentials Provider domain `@cyber-univ.ac.id`, Email Verification, DevRoleSwitcher bypass)
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

### 1.3 Audit Fitur Aplikasi
- **Fitur Selesai (Ready):**
  - **Auth & Onboarding:** Registrasi akun kampus, verifikasi email token, login credential, role switching developer.
  - **Quest Hub:** Pencarian quest, filter kesulitan (`Beginner`, `Intermediate`, `Advanced`), filter kategori (`Web`, `AI`, `Mobile`), pagination.
  - **Snatch & Collaboration:** Snatching mandiri dan snatching berkelompok (Squad) dengan guard pembatasan kuota snatching.
  - **Admin Quest Management:** Pembuatan quest, edit quest, status draft/publish/closed, proteksi penghapusan quest jika terdapat snatcher aktif.
  - **Gamification & Profile:** Perhitungan poin, sistem badge (Progression, Points, Category, Difficulty), penentuan featured badges, upload avatar.
  - **Leaderboard:** Peringkat pengguna, filter kategori/periode, paginasi.
  - **Moderasi & Penalty:** Penalti anggota oleh admin, proteksi otomatis agar anggota berpenalti tidak bisa mengambil quest baru.
  - **Theming:** Dark/light mode switcher persist via cookie/local storage.

- **Fitur Setengah Jadi / Memerlukan Perbaikan (Diperbaiki di Fase 1):**
  - **Admin Submissions (`/admin/submissions`):** Kode mati `seedSubmissions()` telah dihapus dan tipe data submission telah diperkuat.
  - **Quest Details (`/quests/[id]`):** Handling kolom array `requirements` dan `resources` telah diperbaiki untuk native array Prisma PostgreSQL.
  - **Leaderboard (`/leaderboard`):** Tipe data `LeaderboardUser` kini dieksport dan terikat kuat tanpa implicit `any`.

- **TODO / FIXME di Kode:**
  - `src/app/admin/manage-quests/page.tsx:23`: `// TODO: Update getQuests to support sorting by updatedAt desc`

---

### 1.4 Hasil Pengujian Terkini (Fase 1: Verified)
- **`npm run build`**: ✅ **PASSED** (Semua 17 rute selesai dikompilasi dan dioptimasi oleh Turbopack tanpa error).
- **`npx tsc --noEmit`**: ✅ **PASSED** (0 TypeScript compile errors).
- **`npm run lint`**: ✅ **PASSED** (0 lint errors; 34 warning minor/formatting non-blocking).
- **`npm run test` (Vitest)**: ℹ️ Exclude `.kilo` dan `.next` terpasang.

---

## 2. Daftar Bug yang Teridentifikasi & Status Perbaikan

| ID | Lokasi | Kategori | Deskripsi | Status | Solusi yang Diterapkan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | `src/app/admin/submissions/page.tsx` | Build Blocker | Pemanggilan fungsi `seedSubmissions()` yang sudah tidak didefinisikan. | ✅ **RESOLVED** | Dihapus `handleSeedData` dan tombol dead code `Seed Data`. |
| **BUG-02** | `src/app/quests/[id]/page.tsx` | Type Blocker | `quest.requirements` dipanggil dengan `JSON.parse()` dan `quest.resources` dipanggil dengan `.split()`, padahal keduanya sudah bertipe `string[]` di Prisma. | ✅ **RESOLVED** | Langsung gunakan array native Prisma dan parse markdown link aman. |
| **BUG-03** | `src/app/leaderboard/page.tsx` & `src/actions/user.ts` | Type Blocker | Return type `getLeaderboardUsers` cast `as any`, memicu TS7006 parameter `u` pada `.map()`. | ✅ **RESOLVED** | Strongly typed dengan interface `LeaderboardUser`. |
| **BUG-04** | `src/components/dev/DevRoleSwitcher.tsx` | Lint Blocker | `setMounted(true)` dipanggil sinkron di root `useEffect` sehingga memicu aturan React hook ESLint. | ✅ **RESOLVED** | Diganti menggunakan `useSyncExternalStore` dan lazy `useState`. |
| **BUG-05** | Multi-file (`src/actions/*`, `src/app/*`) | Lint Blocker | Pemakaian `any` tanpa tipe spesifik dan unused variables (`Link`, `getMyActiveQuestIds`, dll). | ✅ **RESOLVED** | Dihapus unused import/variable dan diganti dengan tipe aman (`User`, `NextRequest`, `Session`, dsb). |
| **BUG-06** | `vitest.config.ts` & `eslint.config.mjs` | Test/Lint Config | Scanner memindai folder `.kilo` worktree dan memicu duplicate error. | ✅ **RESOLVED** | Ditambahkan ignore rule untuk `.kilo/**` dan `.next/**`. |

---

## 3. Roadmap Penyelesaian Berdasarkan Prioritas

### 🔴 MUST (Wajib Diselesaikan Sebelum Deploy)
1. **[S] Perbaiki Build & Type Errors (BUG-01 s/d BUG-03)**: ✅ **SELESAI**
2. **[S] Perbaiki Lint Errors (BUG-04 & BUG-05)**: ✅ **SELESAI**
3. **[S] Konfigurasi Scanner Worktree (BUG-06)**: ✅ **SELESAI**
4. **[S] Verifikasi Seluruh Pipeline Lokal**: ✅ **SELESAI** (`npm run build`, `tsc`, `lint` lolos 100%)

### 🟡 SHOULD (Sangat Dianjurkan Sebelum Production)
1. **[S] Optimasi Font Loading (`src/app/layout.tsx`)**:
   - Ganti Google Fonts `<link>` manual dengan `next/font/google` (`Plus_Jakarta_Sans`, `Space_Grotesk`) untuk menghindari FOUT dan warning Next.js.
2. **[M] Optimasi Gambar (`next/image`)**:
   - Migrasi sisa tag `<img>` pada `Header.tsx`, `ProfileTabs.tsx`, dan `AvatarUpload.tsx` ke komponen `<Image />` dengan konfigurasi remote pattern yang tepat.
3. **[S] SEO & Dynamic Metadata**:
   - Tambahkan fungsi `generateMetadata` pada `/quests/[id]` dan metadata umum (title template, description, OpenGraph) di `src/app/layout.tsx`.
4. **[S] Implementasi Admin Quest Sort (TODO)**:
   - Tambahkan opsi pengurutan `updatedAt desc` pada query `getQuests` di admin manage-quests.

### 🟢 NICE-TO-HAVE (Peningkatan Pasca Deploy)
1. **[S] Modernisasi Middleware**:
   - Migrasi dari file konvensi `middleware.ts` ke konvensi proxy Next.js 16 jika diperlukan sebelum rilis mayor berikutnya.
2. **[L] Upgrade Dependensi Berkala**:
   - Upgrade NextAuth dari versi beta ke versi stabil setelah rilis final.
   - Pembaruan Tailwind CSS ke v4 jika ada kebutuhan arsitektur CSS-first.
3. **[M] Sentry / Error Monitoring**:
   - Pasang integrasi error tracking (misal @sentry/nextjs) untuk menangkap runtime exception di production.

---

## 4. Checklist Deploy Langkah demi Langkah

### Langkah 1: Persiapan Environment Variables (Production)
Pastikan seluruh key berikut tersedia di dashboard hosting (misal Vercel / Railway):
- [ ] `DATABASE_URL`: Connection string PostgreSQL pooler Supabase (port 6543 dengan `pgbouncer=true`).
- [ ] `DIRECT_URL`: Connection string PostgreSQL langsung Supabase (port 5432) untuk eksekusi migrasi.
- [ ] `AUTH_SECRET`: Secret hash unik (generate via `openssl rand -base64 32`).
- [ ] `BLOB_READ_WRITE_TOKEN`: Token Vercel Blob Storage untuk media upload.
- [ ] `UPSTASH_REDIS_REST_URL`: Endpoint Upstash Redis untuk rate limiting.
- [ ] `UPSTASH_REDIS_REST_TOKEN`: Token Upstash Redis.
- [ ] `NEXTAUTH_URL`: Domain canonical production (misal `https://codequest.cyber-univ.ac.id`).
- [ ] SMTP / Resend Credentials: Jika fitur email verifikasi aktif di production.

### Langkah 2: Eksekusi Database Migration
- [ ] Jalankan migrasi Prisma ke database production:
  ```bash
  npx prisma migrate deploy
  ```
- [ ] Jika diperlukan seeding data awal badge:
  ```bash
  npx tsx prisma/seed_badges.ts
  ```

### Langkah 3: Build & Verification Pre-Flight
- [ ] Jalankan build lokal final:
  ```bash
  npm run build
  ```
- [ ] Pastikan tidak ada runtime crash pada output static generation.

### Langkah 4: Deployment & Post-Deploy Verification
- [ ] Trigger deployment di Vercel / hosting provider.
- [ ] Lakukan smoke test alur kritis:
  1. Akses halaman Landing Page (`/`).
  2. Buka Quest Hub dan periksa detail salah satu quest (`/quests/[id]`).
  3. Buka halaman Leaderboard (`/leaderboard`).
  4. Lakukan login akun tes domain `@cyber-univ.ac.id`.
  5. Uji coba submission quest dan buka halaman admin review (`/admin/submissions`).
  6. Uji coba upload foto profil ke Blob Storage.
