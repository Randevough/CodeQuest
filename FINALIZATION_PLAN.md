# CodeQuest - Finalization Plan & Production Roadmap

**Branch Checkpoint:** `chore/finalize`  
**Tanggal Audit & Rencana:** 04 Oktober 2026  
**Status Fase 0 (Audit):** ✅ Selesai  
**Status Fase 1 (Debug & Stabilization):** ✅ Selesai (Build, TypeScript, dan Lint LOLOS 100%)  
**Status Fase 2 (Analisis Paralel Spesialis):** ✅ Selesai (READ-ONLY)  

---

## 1. Status Project Saat Ini (Hasil Audit & Verifikasi)

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

### 1.3 Ringkasan Fitur Aplikasi
- **Fitur Selesai (Ready):**
  - **Auth & Onboarding:** Registrasi akun kampus, verifikasi email token, login credential, role switching developer.
  - **Quest Hub:** Pencarian quest, filter kesulitan (`Beginner`, `Intermediate`, `Advanced`), filter kategori (`Web`, `AI`, `Mobile`), pagination.
  - **Snatch & Collaboration:** Snatching mandiri dan snatching berkelompok (Squad) dengan guard pembatasan kuota snatching.
  - **Admin Quest Management:** Pembuatan quest, edit quest, status draft/publish/closed, proteksi penghapusan quest jika terdapat snatcher aktif.
  - **Gamification & Profile:** Perhitungan poin, sistem badge (Progression, Points, Category, Difficulty), penentuan featured badges, upload avatar.
  - **Leaderboard:** Peringkat pengguna, filter kategori/periode, paginasi.
  - **Moderasi & Penalty:** Penalti anggota oleh admin, proteksi otomatis agar anggota berpenalti tidak bisa mengambil quest baru.
  - **Theming:** Dark/light mode switcher persist via cookie/local storage.

---

### 1.4 Hasil Pengujian Terkini (Pipeline Verification)
- **`npm run build`**: ✅ **PASSED** (Semua 17 rute selesai dikompilasi dan dioptimasi oleh Turbopack tanpa error).
- **`npx tsc --noEmit`**: ✅ **PASSED** (0 TypeScript compile errors).
- **`npm run lint`**: ✅ **PASSED** (0 lint errors; 34 warning minor/formatting non-blocking).
- **`npm run test` (Vitest)**: ℹ️ Exclude `.kilo/**` dan `.next/**` terpasang; siap untuk test run dengan environment test DB.

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

*Catatan: Saat ini tidak ada bug yang memblokir build atau compile (0 blocker tersisa).*

---

## 3. Hasil Analisis Spesialis (Fase 2 - READ-ONLY)

### 3.1 Agent 2: Performance & Core Web Vitals (Lighthouse)

#### A. Evaluasi Font Loading & CLS
- **Kondisi Saat Ini:**
  [`src/app/layout.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/layout.tsx) memuat font Inter, Plus Jakarta Sans, dan Material Symbols via tag `<link>` eksternal Google Fonts CDN (`https://fonts.googleapis.com`).
- **Masalah:**
  1. Memicu 3 HTTP network request tambahan yang memblokir rendering awal.
  2. Menyebabkan FOUT (Flash of Unstyled Text) dan Cumulative Layout Shift (CLS) saat font berganti.
  3. Memicu peringatan `@next/next/no-page-custom-font`.
- **Rekomendasi:**
  Migrasi ke `next/font/google`:
  ```ts
  import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
  const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
  const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' })
  ```
  *Dampak: Tinggi | Usaha: Rendah (S)*

#### B. Evaluasi Unoptimized Images (`<img>` vs `next/image`)
- **Kondisi Saat Ini:**
  Masih terdapat 5 tag `<img>` murni:
  - `src/components/Header.tsx:103 & 222` (Avatar pengguna)
  - `src/components/profile/AvatarUpload.tsx:85` (Preview avatar)
  - `src/components/profile/ProfileTabs.tsx:327` (Icon badge)
  - `src/app/quests/[id]/page.tsx:289` (Avatar snatcher)
- **Masalah:**
  Avatar dari Dicebear atau Vercel Blob tidak mendapatkan kompresi WebP/AVIF otomatis, tidak memiliki `srcset` responsif, dan dapat memperlambat LCP (Largest Contentful Paint).
- **Rekomendasi:**
  Ganti seluruh tag `<img>` dengan `<Image />` dari `next/image` dengan properti `width`, `height`, dan `alt` eksplisit. Hostname remote sudah terdaftar di `next.config.ts`.
  *Dampak: Sedang | Usaha: Rendah (S)*

#### C. Evaluasi Bundle Size & Code-Splitting
- **Kondisi Saat Ini:**
  Komponen berat `recharts` di [`src/components/admin/AdminCharts.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/components/admin/AdminCharts.tsx) diimpor secara statis pada halaman admin [`src/app/admin/page.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/admin/page.tsx).
- **Masalah:**
  Library `recharts` berukuran ~150KB+ di-bundle ke dalam chunk JS halaman admin, memperbesar First Load JS.
- **Rekomendasi:**
  Gunakan `next/dynamic` dengan skeleton placeholder:
  ```ts
  const ActivityTrendChart = dynamic(() => import('@/components/admin/AdminCharts').then(m => m.ActivityTrendChart), { ssr: false, loading: () => <ChartSkeleton /> })
  ```
  *Dampak: Sedang | Usaha: Rendah (S)*

#### D. Evaluasi Komponen Modal
- **Kondisi Saat Ini:**
  Modal review, modal konfirmasi delete, dan modal edit profile di-bundle langsung di halaman parent meski awalnya berstatus `isOpen = false`.
- **Rekomendasi:**
  Lazy-load modal menggunakan dynamic import saat dibuka (`next/dynamic`).
  *Dampak: Rendah-Sedang | Usaha: Rendah (S)*

---

### 3.2 Agent 3: Rekomendasi Deployment & Infrastruktur Production

#### A. Rekomendasi Platform: Vercel vs Alternatif
1. **Platform Paling Direkomendasikan: Vercel**
   - **Alasan Utama:**
     - Next.js 16 dengan Turbopack didukung native dengan performa Edge / Serverless functions optimal.
     - Project menggunakan `@vercel/blob` untuk penyimpanan avatar; integrasi token dan dashboard Vercel Blob berjalan 1-click tanpa perlu S3 adapter tambahan.
     - Server Actions, revalidation tag, dan cookie middleware berjalan mulus out-of-the-box.
2. **Alternatif: Self-Hosted Docker / Railway / VPS**
   - **Konsekuensi:**
     - Memerlukan `output: 'standalone'` di `next.config.ts`.
     - Perlu Dockerfile multi-stage dengan runtime Node.js 20+.
     - Jika tidak ingin bergantung pada Vercel Blob, harus membuat adapter penyimpanan S3/Cloudflare R2 atau MinIO mandiri.

#### B. Checklist Environment Variables Production
| Key | Tujuan | Contoh Nilai / Keterangan |
| :--- | :--- | :--- |
| `DATABASE_URL` | Koneksi database operasional (Prisma runtime) | `postgresql://postgres.[ref]:[pass]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Koneksi langsung untuk migrasi skema | `postgresql://postgres.[ref]:[pass]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres` |
| `AUTH_SECRET` | Enkripsi cookie dan JWT NextAuth | 32-byte string acak (`openssl rand -base64 32`) |
| `BLOB_READ_WRITE_TOKEN` | Akses baca/tulis Vercel Blob Storage | Dihasilkan dari Vercel Storage Dashboard |
| `UPSTASH_REDIS_REST_URL` | Endpoint Redis untuk rate limiter auth | `https://[id].upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Token otorisasi REST Redis Upstash | Token dari Upstash Console |
| `NEXTAUTH_URL` / `AUTH_URL` | Canonical URL domain production | `https://codequest.cyber-univ.ac.id` |
| `RESEND_API_KEY` | Pengiriman email verifikasi | Token API dari Resend |

#### C. Titik Rawan Produksi (Potential Failure Points) & Solusi
1. **Supabase Connection Limit & IPv4 Deprecation:**
   - Supabase mematikan port direct 5432 untuk IPv4 pada paket free.
   - **Mitigasi:** `DATABASE_URL` WAJIB mengarah ke pooler port 6543 dengan parameter `?pgbouncer=true&connection_limit=1`.
2. **Prisma Binary Target di Linux Vercel:**
   - Lingkungan lokal adalah Windows, sedangkan Vercel berjalan di Amazon Linux / Debian.
   - **Mitigasi:** Pastikan `prisma generate` dijalankan saat build (`npx prisma generate && next build` atau build cache Vercel). Jika perlu, tambahkan `binaryTargets = ["native", "rhel-openssl-3.0.x"]` di `schema.prisma`.
3. **Domain Whitelist Autentikasi Kampus:**
   - `src/auth.ts` membatasi login hanya untuk domain `@cyber-univ.ac.id`.
   - **Mitigasi:** Pastikan admin memiliki akun berakhiran `@cyber-univ.ac.id` yang sudah terverifikasi di database production sebelum launch.

---

### 3.3 Agent 4: Peningkatan Realistis (Enhancement)

#### A. Quick Wins (Rekomendasi Utama)
1. **Dynamic SEO Metadata (`src/app/quests/[id]/page.tsx`)**:
   Tambahkan `generateMetadata`:
   ```ts
   export async function generateMetadata({ params }): Promise<Metadata> {
       const quest = await getQuest(params.id)
       return {
           title: `${quest?.title || 'Quest Details'} | CodeQuest`,
           description: quest?.description.slice(0, 160),
       }
   }
   ```
2. **Sitemap & Robots Generator (`src/app/sitemap.ts` & `src/app/robots.ts`)**:
   Buat generator sitemap otomatis untuk rute publik dan blokir indexing `/admin/**`.
3. **Penyelesaian TODO Sorting di Admin Quests**:
   Perbarui [`src/app/admin/manage-quests/page.tsx:23`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/admin/manage-quests/page.tsx#L23) dengan menambahkan opsi pengurutan `updatedAt: 'desc'`.
4. **Keamanan HTTP Headers di `next.config.ts`**:
   Tambahkan header `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

#### B. Peningkatan Lanjutan (Opsional Pasca-Launch)
1. **PWA Manifest (`src/app/manifest.ts`)**:
   Konfigurasi icon aplikasi, display `standalone`, dan theme color `#0a0a0a` untuk pengalaman installable di mobile/desktop.
2. **Accessibility (a11y) Polish**:
   Pastikan modal review menangkap fokus (focus trap) dan mendukung penutupan via tombol keyboard `Escape`.
3. **Error Monitoring (Sentry)**:
   Integrasikan `@sentry/nextjs` untuk menangkap uncaught exception pada server actions dan client components.

---

## 4. Roadmap Berurutan Berdasarkan Prioritas

| Prioritas | Item Pekerjaan | Domain | Estimasi Usaha | Status |
| :--- | :--- | :--- | :---: | :---: |
| **🔴 MUST** | Fix Build Blocker (`seedSubmissions`) | Bug Fix | **S** | ✅ **DONE** |
| **🔴 MUST** | Fix Array Type Handling di Quest Details | Bug Fix | **S** | ✅ **DONE** |
| **🔴 MUST** | Strongly Type Leaderboard Response | Bug Fix | **S** | ✅ **DONE** |
| **🔴 MUST** | Fix Synchronous setState di DevRoleSwitcher | Bug Fix | **S** | ✅ **DONE** |
| **🔴 MUST** | Fix ESLint Explicit `any` & Unused Vars | Code Quality | **S** | ✅ **DONE** |
| **🔴 MUST** | Verifikasi Pipeline Build Lokal (`npm run build`) | CI/CD | **S** | ✅ **DONE** |
| **🔴 MUST** | Konfigurasi Environment Variables Production di Vercel | Deployment | **S** | ⏳ Menunggu Deploy |
| **🔴 MUST** | Eksekusi Prisma Migration ke Supabase Production | Database | **S** | ⏳ Menunggu Deploy |
| **🟡 SHOULD** | Migrasi Google Fonts ke `next/font/google` (Inter + Jakarta) | Performance | **S** | Usulan |
| **🟡 SHOULD** | Migrasi Sisa 5 Tag `<img>` ke `<Image />` | Performance | **S** | Usulan |
| **🟡 SHOULD** | Dynamic Import untuk Recharts di Admin Dashboard | Performance | **S** | Usulan |
| **🟡 SHOULD** | Dynamic SEO Metadata & OpenGraph per Quest | SEO / UX | **S** | Usulan |
| **🟡 SHOULD** | Generate `sitemap.ts` & `robots.ts` | SEO | **S** | Usulan |
| **🟡 SHOULD** | Selesaikan TODO Sort di `admin/manage-quests` | Feature Polish | **S** | Usulan |
| **🟢 NICE** | Security HTTP Headers di `next.config.ts` | Security | **S** | Usulan |
| **🟢 NICE** | Web App Manifest (`src/app/manifest.ts`) untuk PWA | UX / Mobile | **M** | Usulan |
| **🟢 NICE** | Integrasi Error Monitoring (Sentry) | Observability | **M** | Usulan |
| **🟢 NICE** | Migrasi konvensi `middleware.ts` ke Next 16 `proxy` | Maintenance | **S** | Usulan |

---

## 5. Checklist Deploy Langkah demi Langkah

### Langkah 1: Persiapan Akun & Layanan Eksternal
- [ ] **Supabase:** Pastikan project PostgreSQL aktif. Buka *Project Settings -> Database* dan salin:
  - Transaction Pooler (Port 6543) -> untuk `DATABASE_URL`
  - Direct / Session Pooler (Port 5432) -> untuk `DIRECT_URL`
- [ ] **Upstash Redis:** Buat database Redis gratis di console Upstash untuk rate limiter auth.
- [ ] **Vercel Blob:** Aktifkan Vercel Blob store pada dashboard proyek Vercel.
- [ ] **Resend:** Dapatkan API key pengiriman email domain kampus atau SMTP service.

### Langkah 2: Setup Proyek di Hosting (Vercel)
- [ ] Import repository GitHub `Randevough/CodeQuest` (pilih branch `chore/finalize` atau `master`).
- [ ] Framework preset otomatis: **Next.js**.
- [ ] Isi seluruh Environment Variables sesuai daftar di Bagian 3.2.B.
- [ ] Build command: `npm run build` (atau `npx prisma generate && next build`).

### Langkah 3: Eksekusi Migrasi Database Production
- [ ] Dari terminal lokal atau CI/CD, jalankan migrasi ke database Supabase production:
  ```bash
  npx prisma migrate deploy
  ```
- [ ] Seed badge bawaan ke database production:
  ```bash
  npx tsx prisma/seed_badges.ts
  ```

### Langkah 4: Trigger Deploy & Pre-Flight Check
- [ ] Klik **Deploy** di dashboard Vercel.
- [ ] Amati log build: pastikan Turbopack static page generation berjalan sukses tanpa exception.

### Langkah 5: Smoke Testing Pasca-Deploy
- [ ] **Halaman Publik:** Buka Landing Page (`/`), About (`/about`), Quest Hub.
- [ ] **Quest Detail:** Buka salah satu quest (`/quests/[id]`), pastikan checklist requirements dan resource link terbuka normal.
- [ ] **Autentikasi:** Coba registrasi dan login menggunakan email `@cyber-univ.ac.id`.
- [ ] **Leaderboard:** Buka halaman `/leaderboard`, cek filter dan peringkat.
- [ ] **Admin Portal:** Login dengan akun Admin, periksa dashboard statistik, daftar submission (`/admin/submissions`), dan manajemen quest (`/admin/manage-quests`).
- [ ] **Media Upload:** Uji coba upload avatar di halaman `/profile` dan pastikan file tersimpan di Vercel Blob.
