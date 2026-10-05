# Plan: Batch 2 - Infrastructure & Deployment Readiness

**Slug:** `PLAN-batch-2-infra.md`  
**Target Branch:** `chore/finalize`  
**Project Type:** WEB (Next.js 16 App Router, Prisma ORM 5.10, PostgreSQL Supabase, Vercel)  
**Parent Plan:** [FINALIZATION_PLAN.md](file:///c:/Users/USER/Desktop/CodeQuest/FINALIZATION_PLAN.md) (Fase 3, Bagian 3.2)  
**Status:** 📋 Ready for Execution Approval  

---

## 1. Overview & Objective

Batch 2 berfokus pada kesiapan deployment produksi (Vercel Serverless & Supabase PostgreSQL) serta penguatan keamanan aplikasi pada tingkat HTTP header dan pipeline build.

### Masalah & Kebutuhan yang Diselesaikan:
1. **Security Headers:** Aplikasi belum memiliki header keamanan dasar (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, dan Strict-Transport-Security) untuk memitigasi clickjacking dan sniffing.
2. **Prisma Binary Target untuk Vercel:** Engine Prisma client yang di-generate di Windows (`windows` binary) akan berbeda dengan lingkungan runtime Vercel Linux container (`rhel-openssl-3.0.x`). Perlu penambahan `binaryTargets` eksplisit di `schema.prisma`.
3. **Otomasi Generate Client di Build Script:** Script `"build": "next build"` di `package.json` berisiko gagal di Vercel jika engine Prisma tidak di-generate ulang sebelum kompilasi Next.js dimulai. Perlu diubah menjadi `"build": "prisma generate && next build"`.
4. **Dokumentasi & Checklist Konfigurasi Manual:** Panduan praktis langkah demi langkah untuk konfigurasi Transaction Pooler (Port 6543) Supabase dan environment variables di Vercel.

---

## 2. Success Criteria

- [x] `next.config.ts` memuat fungsi `async headers()` dengan security headers lengkap (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS).
- [x] `prisma/schema.prisma` memuat `binaryTargets = ["native", "rhel-openssl-3.0.x"]` di blok `generator client`.
- [x] `package.json` memiliki script `"build": "prisma generate && next build"`.
- [x] `npx prisma generate` sukses mengeksekusi dan mendeteksi target binary Linux.
- [x] `npx tsc --noEmit` lolos dengan 0 error.
- [x] `npm run lint` lolos dengan 0 error (25 warnings non-blocking).
- [x] `npm run build` lolos 100% (Turbopack + Prisma build pipeline, 17/17 rute).

---

## 3. Tech Stack & Decisions

| Komponen | Spesifikasi / Konfigurasi | Alasan & Trade-off |
| :--- | :--- | :--- |
| **HTTP Security** | OWASP Secure Headers di `next.config.ts` | Melindungi aplikasi dari serangan clickjacking, MIME-sniffing, dan pembatasan izin hardware (kamera/mic/lokasi). |
| **Prisma Engine Target** | `binaryTargets = ["native", "rhel-openssl-3.0.x"]` | Menjamin Prisma Client dapat berjalan baik di mesin developer (Windows) maupun container serverless Vercel (Amazon Linux 2023 / RHEL). |
| **Build Pipeline** | `prisma generate && next build` | Memastikan tipe dan binary Prisma selalu mutakhir di CI/CD build cache Vercel. |
| **Database Pooler** | Supabase Transaction Pooler (Port 6543) | Mencegah kehabisan koneksi PostgreSQL saat traffic melonjak pada arsitektur Serverless. |

---

## 4. File Structure & Change Map

```
CodeQuest/
├── next.config.ts              # Update: Tambah async headers() security headers
├── package.json                # Update: Ubah script build menyertakan prisma generate
├── prisma/
│   └── schema.prisma           # Update: Tambah binaryTargets di generator client
└── docs/
    └── PLAN-batch-2-infra.md   # New: Dokumen rencana & checklist infra
```

---

## 5. Detailed Task Breakdown

### Task 2.1: Implementasi Security Headers di `next.config.ts`
- **Agent:** `security-auditor` / `backend-specialist`
- **Skills:** `clean-code`, `api-design-principles`
- **Target File:** [`next.config.ts`](file:///c:/Users/USER/Desktop/CodeQuest/next.config.ts)
- **Konfigurasi yang Diterapkan:**
  ```ts
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
  ```
- **Verify:** `npm run build` & validasi header saat dev/test.

---

### Task 2.2: Tambahkan Prisma Engine Target di `prisma/schema.prisma`
- **Agent:** `backend-specialist`
- **Skills:** `database-design`, `clean-code`
- **Target File:** [`prisma/schema.prisma`](file:///c:/Users/USER/Desktop/CodeQuest/prisma/schema.prisma)
- **Tindakan:**
  Ubah generator client:
  ```prisma
  generator client {
    provider      = "prisma-client-js"
    binaryTargets = ["native", "rhel-openssl-3.0.x"]
  }
  ```
- **Verify:** Jalankan `npx prisma generate` untuk memvalidasi kompatibilitas download engine.

---

### Task 2.3: Perbarui Script Build di `package.json`
- **Agent:** `orchestrator`
- **Skills:** `clean-code`
- **Target File:** [`package.json`](file:///c:/Users/USER/Desktop/CodeQuest/package.json)
- **Tindakan:**
  Ubah baris `"build"`:
  ```json
  "build": "prisma generate && next build",
  ```
- **Verify:** Jalankan `npm run build` untuk memverifikasi eksekusi berurutan `prisma generate` diikuti `next build`.

---

## 6. Panduan Konfigurasi Manual (Dashboard Supabase & Vercel)

Langkah-langkah berikut akan dieksekusi oleh user di dashboard masing-masing sebelum rilis produksi:

### 6.1 Supabase Dashboard (`app.supabase.com`)
1. Buka project **CodeQuest** -> **Project Settings** -> **Database**.
2. Di bagian **Connection string**:
   - **URI Mode:** Pilih tab **Transaction** (Port `6543`). Salin URL ini sebagai `DATABASE_URL`.
     *Saran optimal:* Tambahkan query parameter `?pgbouncer=true&connection_limit=1` di ujung URL.
   - **Direct connection:** Salin URL dengan Port `5432` sebagai `DIRECT_URL`.

### 6.2 Vercel Dashboard (`vercel.com`)
1. Hubungkan repository GitHub `Randevough/CodeQuest`.
2. Di menu **Settings -> Environment Variables**, pastikan variabel berikut terisi:
   - `DATABASE_URL`: URI Transaction Pooler (Port 6543)
   - `DIRECT_URL`: URI Direct Connection (Port 5432)
   - `AUTH_SECRET`: String acak 32-byte (hasil generate `openssl rand -base64 32`)
   - `BLOB_READ_WRITE_TOKEN`: Token read/write Vercel Blob
   - `UPSTASH_REDIS_REST_URL`: URL REST Upstash Redis
   - `UPSTASH_REDIS_REST_TOKEN`: Token Upstash Redis
   - `NEXTAUTH_URL`: URL domain production Anda (misal `https://codequest.cyber-univ.ac.id`)

### 6.3 Eksekusi Migrasi Skema ke Supabase
Jalankan dari terminal lokal sebelum switch traffic ke production:
```bash
npx prisma migrate deploy
npx tsx prisma/seed_badges.ts
```

---

## 7. Phase X: Final Verification Plan

1. `npx prisma generate` -> Berhasil men-download & membuat binary engine untuk Windows & Linux.
2. `npx tsc --noEmit` -> Lolos 0 error.
3. `npm run lint` -> Lolos 0 error.
4. `npm run build` -> Berhasil (`prisma generate` + `next build` 17 rute).
5. Buat commit terstandarisasi:
   `chore(infra): add security headers, prisma linux binary target and build script`
   `Refs: CQ-2602-009`

---

## 8. Rollback Strategy

- Jika terjadi kendala pada security headers atau generator prisma:
  `git checkout HEAD -- next.config.ts prisma/schema.prisma package.json`
- Commit checkpoint Batch 1 `b5333d7` tetap stabil dan dapat dijadikan acuan kembali kapan saja.
