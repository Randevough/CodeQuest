# Plan: Batch 1 - Performance & Stabilization Fixes

**Slug:** `PLAN-batch-1-performance.md`  
**Target Branch:** `chore/finalize`  
**Project Type:** WEB (Next.js 16 App Router, React 19, Tailwind CSS 3.4, Turbopack)  
**Parent Plan:** [FINALIZATION_PLAN.md](file:///c:/Users/USER/Desktop/CodeQuest/FINALIZATION_PLAN.md) (Fase 3, Bagian 3.1)  
**Status:** 📋 Ready for Execution Approval  

---

## 1. Overview & Objective

Batch 1 difokuskan untuk menyelesaikan seluruh isu performa jaringan, eliminasi render-blocking requests eksternal, optimalisasi aset gambar Next.js, dan perbaikan bug lokal Vercel Blob Storage.

### Masalah yang Diselesaikan:
1. **Bug Hostname Vercel Blob di Local:** Sub-domain blob di-hardcode di `next.config.ts`. Gambar avatar yang dihasilkan dari blob store lain memicu error HTTP 400 (*hostname not configured*).
2. **Blocking External CDN Fonts:** Tag `<link>` ke Google Fonts di `layout.tsx` dan `admin/layout.tsx` memicu FOUT (Flash of Unstyled Text), memblokir render pertama, dan menimbulkan peringatan ESLint `@next/next/no-page-custom-font`.
3. **Peringatan ESLint `<img>` Element:** 5 tag `<img>` legacy tidak memanfaatkan WebP/AVIF automatic format conversion, responsive sizing, dan lazy loading dari `next/image`.
4. **Bundle Size Halaman Admin:** Library Recharts (~150KB+) dimuat secara sinkron di halaman utama admin (`/admin`), memperlambat inisial load serverless function.

---

## 2. Success Criteria

- [x] `next.config.ts` mengizinkan seluruh sub-domain `*.public.blob.vercel-storage.com`.
- [x] 0 external `<link rel="stylesheet">` ke `fonts.googleapis.com` di seluruh file layout.
- [x] Font Google (Inter & Plus Jakarta Sans) di-self-host otomatis via `next/font/google`.
- [x] Material Symbols Outlined di-self-host secara lokal via `public/fonts/` dan `@font-face` di `globals.css`.
- [x] 0 tag `<img>` di codebase (5 tag termigrasi ke `next/image`).
- [x] Chart admin dimuat secara dinamis via `next/dynamic` dengan skeleton placeholder tanpa tabrakan nama dengan `export const dynamic = 'force-dynamic'`.
- [x] `npx tsc --noEmit` lolos dengan 0 error.
- [x] `npm run lint` lolos dengan 0 error (warning font & img tereliminasi).
- [x] `npm run build` lolos 100% tanpa kompilasi gagal (17/17 rute terkompilasi).

---

## 3. Tech Stack & Decisions

| Kategori | Teknologi | Alasan Keputusan |
| :--- | :--- | :--- |
| **Typography** | `next/font/google` (`Plus_Jakarta_Sans`, `Inter`) | Zero layout shift, self-hosted saat build time oleh Turbopack/Next.js, no external network calls. |
| **Iconography** | Local WOFF2 (`public/fonts/material-symbols-outlined.woff2`) | Variable ligature font (100–700), memotong latensi eksternal, bebas dari pemblokiran adblocker/CSP, konsisten offline. |
| **Image Engine** | `next/image` | Otomatis kompresi WebP/AVIF, dynamic device sizing, blur placeholder, zero CLS (*Cumulative Layout Shift*). |
| **Code Splitting** | `next/dynamic` (as `nextDynamic`) | Memisahkan Recharts dari inisial SSR bundle halaman admin. |

---

## 4. File Structure & Change Map

```
CodeQuest/
├── next.config.ts                      # Update: Remote pattern wildcard *.public.blob.vercel-storage.com
├── tailwind.config.ts                  # Update: CSS variable mapping untuk fonts
├── public/
│   └── fonts/
│       └── material-symbols-outlined.woff2 # New: Self-hosted Material Symbols font
├── src/
│   ├── app/
│   │   ├── globals.css                 # Update: @font-face lokal & class helper
│   │   ├── layout.tsx                  # Update: next/font/google, hapus link Google CDN
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Update: Hapus link Google CDN duplikat
│   │   │   └── page.tsx                # Update: Dynamic import AdminCharts
│   │   └── quests/
│   │       └── [id]/
│   │           └── page.tsx            # Update: Migrasi img avatar snatcher ke Image
│   └── components/
│       ├── Header.tsx                  # Update: Migrasi 2 img avatar ke Image
│       └── profile/
│           ├── AvatarUpload.tsx        # Update: Migrasi img avatar preview ke Image
│           └── ProfileTabs.tsx         # Update: Migrasi img badge ke Image
```

---

## 5. Detailed Task Breakdown

### Task 1.1: Konfigurasi Wildcard Vercel Blob di `next.config.ts`
- **Agent:** `frontend-specialist`
- **Skills:** `nextjs-react-expert`, `clean-code`
- **Input:** Hardcoded host `6t5tfdwgh8pvy3vf.public.blob.vercel-storage.com`
- **Tindakan:** Ganti dengan `{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }`
- **Output:** File [`next.config.ts`](file:///c:/Users/USER/Desktop/CodeQuest/next.config.ts) mendukung upload blob dari environment apapun.
- **Verify:** Syntax check & `npm run build`.

---

### Task 1.2: Migrasi Typography ke `next/font/google`
- **Agent:** `frontend-specialist`
- **Skills:** `nextjs-react-expert`, `frontend-design`
- **Input:** Link CDN eksternal di `<head>` [`src/app/layout.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/layout.tsx).
- **Tindakan:**
  1. Hapus tag `<link>` Google Fonts untuk Inter dan Plus Jakarta Sans.
  2. Inisialisasi `Plus_Jakarta_Sans` dan `Inter` dari `next/font/google` dengan `subsets: ['latin']`, `display: 'swap'`, dan CSS variable:
     - `--font-plus-jakarta-sans`
     - `--font-inter`
  3. Pasang variabel font ke atribut class `<body>` di [`src/app/layout.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/layout.tsx).
  4. Sesuaikan [`tailwind.config.ts`](file:///c:/Users/USER/Desktop/CodeQuest/tailwind.config.ts) dan [`src/app/globals.css`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/globals.css) agar mengacu ke variable `--font-plus-jakarta-sans`.
- **Output:** Font self-hosted tanpa blocking CDN.
- **Verify:** `npx tsc --noEmit`.

---

### Task 1.3: Self-Hosting Material Symbols Outlined Icon Font
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `clean-code`
- **Input:** CDN link `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined...` di root layout dan admin layout.
- **Tindakan:**
  1. Buat direktori `public/fonts/`.
  2. Unduh variable font `material-symbols-outlined.woff2` ke `public/fonts/material-symbols-outlined.woff2`.
  3. Daftarkan `@font-face` dan styling `.material-symbols-outlined` di [`src/app/globals.css`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/globals.css):
     ```css
     @font-face {
       font-family: 'Material Symbols Outlined';
       font-style: normal;
       font-weight: 100 700;
       font-display: swap;
       src: url('/fonts/material-symbols-outlined.woff2') format('woff2');
     }
     .material-symbols-outlined {
       font-family: 'Material Symbols Outlined';
       font-weight: normal;
       font-style: normal;
       font-size: 24px;
       line-height: 1;
       letter-spacing: normal;
       text-transform: none;
       display: inline-block;
       white-space: nowrap;
       word-wrap: normal;
       direction: ltr;
       -webkit-font-feature-settings: 'liga';
       -webkit-font-smoothing: antialiased;
     }
     ```
  4. Hapus `<link>` Material Symbols dari [`src/app/layout.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/layout.tsx) dan [`src/app/admin/layout.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/admin/layout.tsx).
- **Output:** Icon font bekerja 100% lokal, zero external request, peringatan `@next/next/no-page-custom-font` hilang.
- **Verify:** Browser/render check icon ligature.

---

### Task 1.4: Migrasi 5 Tag `<img>` Legacy ke `next/image`
- **Agent:** `frontend-specialist`
- **Skills:** `nextjs-react-expert`, `clean-code`
- **Lokasi & Detail Penanganan:**
  1. [`src/components/Header.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/components/Header.tsx) (L103 & L222):
     - Gunakan `<Image src={session.user.avatar} alt={session.user.name || 'User'} width={32} height={32} className="w-full h-full object-cover" />`
  2. [`src/components/profile/AvatarUpload.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/components/profile/AvatarUpload.tsx) (L85):
     - Gunakan `<Image src={currentAvatar} alt={name || 'Profile'} fill sizes={`${size}px`} className={`object-cover transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`} />`
  3. [`src/components/profile/ProfileTabs.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/components/profile/ProfileTabs.tsx) (L327):
     - Gunakan `<Image src={badge.imageUrl} alt={badge.name} width={40} height={40} className={`w-10 h-10 object-contain max-w-full ${!earned ? 'grayscale' : ''}`} />`
  4. [`src/app/quests/[id]/page.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/quests/[id]/page.tsx) (L289):
     - Gunakan `<Image src={snatch.user.avatar} alt={snatch.user.name || 'User'} width={40} height={40} className="size-10 rounded-full object-cover group-hover:scale-105 transition-transform" />`
- **Output:** Semua aset grafis teroptimasi Next.js Image Optimization Pipeline.
- **Verify:** `npm run lint` tidak memunculkan peringatan `@next/next/no-img-element`.

---

### Task 1.5: Code Splitting & Dynamic Import Admin Charts
- **Agent:** `frontend-specialist`
- **Skills:** `nextjs-react-expert`, `clean-code`
- **Input:** Static import `ActivityTrendChart` dan `DifficultyDistributionChart` di [`src/app/admin/page.tsx`](file:///c:/Users/USER/Desktop/CodeQuest/src/app/admin/page.tsx).
- **Perhatian Khusus (Identifier Collision):**
  - File `src/app/admin/page.tsx` memiliki: `export const dynamic = 'force-dynamic'`.
  - Jangan gunakan `import dynamic from 'next/dynamic'`.
  - Gunakan alias: `import nextDynamic from 'next/dynamic'`.
- **Tindakan:**
  ```tsx
  import nextDynamic from 'next/dynamic';

  const ActivityTrendChart = nextDynamic(
      () => import('@/components/admin/AdminCharts').then(m => m.ActivityTrendChart),
      { ssr: false, loading: () => <div className="h-64 animate-pulse bg-slate-100 dark:bg-zinc-800 rounded-xl" /> }
  );

  const DifficultyDistributionChart = nextDynamic(
      () => import('@/components/admin/AdminCharts').then(m => m.DifficultyDistributionChart),
      { ssr: false, loading: () => <div className="h-64 animate-pulse bg-slate-100 dark:bg-zinc-800 rounded-xl" /> }
  );
  ```
- **Output:** Recharts terisolasi dalam async chunk terpisah, inisial load dashboard admin jauh lebih gesit.
- **Verify:** `npx tsc --noEmit` & `npm run build`.

---

## 6. Phase X: Final Verification Plan

Setelah semua task di atas diterapkan:
1. `npx tsc --noEmit` -> Harus lolos 0 error.
2. `npm run lint` -> Harus lolos 0 error.
3. `npm run build` -> 17 routes berhasil terkompilasi via Turbopack.
4. Update `FINALIZATION_PLAN.md` untuk menandai progress Batch 1.
5. Buat commit terstandarisasi:
   `perf(core): optimize fonts, blob storage, next-image and admin charts`
   `Refs: CQ-2602-008`

---

## 7. Rollback Strategy

Jika terjadi regresi pada tampilan ikon atau font:
- `git checkout HEAD -- src/app/layout.tsx src/app/admin/layout.tsx src/app/globals.css`
- Branch `chore/finalize` dapat dikembalikan ke commit `caa69bf` kapan saja secara instan.
