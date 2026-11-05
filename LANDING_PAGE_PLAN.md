# RENCANA REDESIGN LANDING PAGE CODEQUEST

**Status Dokumen:** DISETUJUI MANAGER (APPROVED — SIAP REVIEW PEMILIK PRODUK)  
**Catatan Approval Manager:**  
- **Keputusan:** APPROVED.  
- **Dasar Evaluasi:** Rencana terbukti selaras dengan kode sumber aktual (`prisma/schema.prisma`, `src/actions/quest.ts`, `src/actions/squad.ts`, NextAuth v5). 3 isu blocking (ketiadaan data leaderboard, resolusi sesi auth dinamis, inkonsistensi copy headline) dan 3 saran teknis telah diperbaiki serta diverifikasi ulang oleh tim QA independen (`LANDING_PAGE_QA.md`).  
- **Batasan Ruang Lingkup:** Rencana ini mengunci scope fitur tanpa ekspansi backend/skema DB, menjaga integritas rute legacy melalui scoping token, dan mematuhi palet warna yang telah disetujui.  
- **Catatan Implementasi:** Dokumen ini siap untuk ditinjau oleh pemilik produk. Approval ini bukan otorisasi implementasi UI atau deployment produksi.  
**Target Repositori:** `/home/randevough/hermes-workspace/CodeQuest`  
**Referensi Inspirasi:** [GitMastery](https://gitmastery.me/) (Hierarki, ketegasan presentasi visual, kontras tombol taktil)  
**Palet Disetujui:** Ink Navy (`#141925`), Slate Surface (`#20283A`), Warm Cream (`#FFF3DE`), Warm Amber (`#FFAE58`), Cool Grey (`#C2C7D0`).

---

## 1. Audit Produk & Positioning

### 1.1 Identitas Produk Berbasis Realitas Codebase
CodeQuest adalah **platform manajemen proyek gamifikasi internal (gamified task & quest engine)** yang dibangun untuk mahasiswa dan pengembang di lingkungan **Cyber University Coding Club**.

Bukan LeetCode (bukan algo puzzle sebaris); bukan kursus video pasif (*tutorial hell*); bukan issue tracker korporat kering (Jira). CodeQuest menghubungkan proyek arsitektur nyata dengan mekanisme tantangan arcade berkuota ketat.

### 1.2 Aturan Bisnis & Mekanisme Inti Aktual:
1. **Siklus Quest & Snatch**: Quest diambil secara aktif (*snatched*) oleh anggota. Setiap quest memiliki kuota maksimal pengambil (`maxSnatchers`).
2. **Batas Kapasitas 3 Quest Aktif**: Concurrency guard membatasi maksimal 3 quest aktif secara bersamaan per user (`ACTIVE`, `SUBMITTED`, `REVISION_NEEDED`).
3. **Multiplayer Squad Co-Op**: Quest dengan `maxSnatchers > 1` memiliki sistem lobi tim dengan tautan undangan dan sinkronisasi status submission.
4. **Verifikasi Manusia (Admin Evaluation)**: Submission repositori proyek nyata dievaluasi oleh Admin klub dengan catatan feedback dan proteksi rollback poin anti-cheat.
5. **Engine Gamifikasi & Reputasi**: 14 badge terverifikasi, poin XP riil, pin 3 badge profil, dan global leaderboard dinamis.
6. **Autentikasi & Email Domain**: Pendaftaran aman dengan proteksi anti-disposable domain (tempmail diblokir), rate limiting IP, dan konfigurasi fleksibel (`ALLOWED_EMAIL_DOMAINS`).

### 1.3 Batasan & Hal yang Dilarang (Anti-Slop):
- DILARANG menampilkan testimoni alumni palsu atau angka metrik rekaan.
- DILARANG mengklaim "AI Code Reviewer Otomatis" (evaluasi 100% kurasi manusia).
- DILARANG menggunakan kartu bento generik melayang dengan blur neon raksasa.

---

## 2. Jawaban 6 Pertanyaan Kunci Pengunjung

1. **Apa CodeQuest?**
   Platform tugas rekayasa perangkat lunak interaktif internal kampus Cyber University untuk mengerjakan proyek nyata berbasis repositori Git.
2. **Untuk siapa?**
   Mahasiswa dan anggota Cyber University Coding Club yang ingin membangun portofolio teknis riil dan keluar dari siklus tutorial pasif.
3. **Seperti apa quest-nya?**
   Tantangan pemrograman terstruktur pada domain Web, AI, dan Mobile dengan kriteria penerimaan spesifik dan reward XP (contoh: *Full-Stack Task Runner*, *AI Benchmark Suite*, *Campus Agenda Scanner*).
4. **Bagaimana alur pengerjaannya?**
   4 Tahap: Pilih Quest -> Kunci Slot (Solo/Skuad) -> Kerjakan & Kirim URL Repositori -> Evaluasi Admin & Klaim Poin/Badge.
5. **Mengapa perlu bergabung?**
   Mendapatkan evaluasi kode nyata dari mentor/admin kampus, membangun rekam jejak portofolio terverifikasi, dan berkompetisi sehat di leaderboard klub.
6. **Apa tindakan berikutnya?**
   Pengunjung baru: Menjelajahi katalog quest aktif atau mendaftar akun. Member aktif: Membuka workspace pengerjaan.

---

## 3. Struktur Halaman & Rencana 6 Section

```
┌──────────────────────────────────────────────────────────┐
│ SECTION 1: HERO & IDENTITAS UTAMA                        │
│ Status musim, Headline tegas, Dual CTA, Telemetri Live   │
├──────────────────────────────────────────────────────────┤
│ SECTION 2: PIPELINE KERJA (HOW IT WORKS)                 │
│ 4 Langkah: Snatch -> Bangun -> Submit -> Review & Poin   │
├──────────────────────────────────────────────────────────┤
│ SECTION 3: SHOWCASE MISI AKTIF (LIVE QUEST BOARD)        │
│ 3 Kartu representatif: Web, AI, Mobile + Kuota Taktil    │
├──────────────────────────────────────────────────────────┤
│ SECTION 4: MODE KOLABORASI SKUAD (MULTIPLAYER CO-OP)     │
│ Mekanisme tim, invite link, sync submission & poin       │
├──────────────────────────────────────────────────────────┤
│ SECTION 5: PAPAN PERINGKAT & REKOGNISI REPUTASI          │
│ Top 3 Arcade Podium + Transparansi 14 Badge Keahlian     │
├──────────────────────────────────────────────────────────┤
│ SECTION 6: GERBANG ONBOARDING & AJAKAN BERGABUNG         │
│ Akses pendaftaran akun & konfirmasi domain kampus        │
└──────────────────────────────────────────────────────────┘
```

---

### Section 1: Hero & Identitas Utama

- **Pertanyaan Pengunjung:** "Tempat apa ini dan apakah relevan bagi saya?"
- **Pesan Utama:** Platform quest koding nyata untuk membangun portofolio rekayasa perangkat lunak terverifikasi.
- **Draft Copy:**
  - Status Chip: `SEASON 1 AKTIF` | `CYBER UNIVERSITY CODING CLUB`
  - Headline: `KLAIM MISI KODING KAMPUS. BANGUN PROYEK NYATA.`
  - Subheadline: `Ambil tantangan rekayasa piranti lunak terstruktur, kerjakan mandiri atau bersama skuad, kirim pull request repositori, dan dapatkan poin reputasi serta review kode dari mentor.`
  - Microcopy: `Bebas iklan, open source, terintegrasi dengan ekosistem mahasiswa developer.`
- **Hierarki CTA:**
  - Primer: `JELAJAHI DAFTAR QUEST` (menuju `/explore`)
  - Sekunder: `DAFTAR AKUN MAHASISWA` (menuju `/signup`)
  - Tersier: `Lihat Papan Peringkat` (menuju `/leaderboard`)
- **Data & Sumber:** Hitungan quest aktif via `prisma.quest.count({ where: { status: 'Active' } })`.
- **Komposisi Visual:** Grid 12 kolom; teks di sisi kiri, telemetri live card/terminal ringkas di sisi kanan.
- **Perilaku Mobile:** Stack vertikal penuh, tombol primer dan sekunder lebar penuh (`w-full`), min touch target 44px.
- **Kondisi Batas:**
  - Belum Login: Tampilkan tombol `Daftar Akun Mahasiswa` dan `Masuk`.
  - Sudah Login (Member): Tombol sekunder berubah menjadi `Buka Workspace Saya` (`/workspace`).
  - Sudah Login (Admin): Tombol sekunder menampilkan `Buka Panel Admin` (`/admin/members`).

---

### Section 2: Pipeline Kerja (How It Works)

- **Pertanyaan Pengunjung:** "Bagaimana alur teknisnya dari awal sampai akhir?"
- **Pesan Utama:** Proses 4 langkah transparan yang meniru alur kerja rekayasa piranti lunak profesional.
- **Draft Copy:**
  - Eyebrow: `ALUR SISTEM`
  - Headline: `Empat Langkah dari Tantangan Menuju Kode Terverifikasi`
  - Langkah 01: `Pilih & Kunci Quest` — Filter katalog Web, AI, atau Mobile. Kunci slot (maksimal 3 quest aktif).
  - Langkah 02: `Bangun Solusi Nyata` — Kembangkan repositori Git mandiri atau bentuk lobi skuad bersama rekan.
  - Langkah 03: `Kirim Repositori` — Sertakan URL repositori Git dan dokumentasi pengerjaan ke workspace.
  - Langkah 04: `Review & Reward` — Evaluasi langsung oleh Admin; dapatkan poin XP dan buka lencana digital.
- **Komposisi Visual:** 4 kartu proses bertahap dengan nomor monospaced besar (`01`, `02`, `03`, `04`) dan indikator panah konektor arcade.
- **Perilaku Mobile:** Carousel horizontal atau susunan vertikal 1 kolom dengan garis penunjuk progres.
- **Kondisi Batas:** Tetap statis dan konsisten karena merupakan penjelasan arsitektur sistem.

---

### Section 3: Showcase Misi Aktif (Live Quest Board)

- **Pertanyaan Pengunjung:** "Tugas seperti apa yang sebenarnya dikerjakan di sini?"
- **Pesan Utama:** Quest berbasis proyek nyata, bukan fungsi matematika teka-teki sintetis.
- **Draft Copy:**
  - Eyebrow: `KATALOG MISI PILIHAN`
  - Headline: `Tantangan Nyata yang Menunggu Diselesaikan`
  - Subheadline: `Dari otomasi webhook hingga benchmarking model AI dan aplikasi mobile kampus.`
- **Contoh Data Representatif (Sumber Nyata):**
  1. *Full-Stack Task Runner* (Web | Intermediate | +250 XP | Kuota 3 Skuad)
  2. *AI Prompt Benchmark Suite* (AI | Advanced | +400 XP | Kuota 2 Skuad)
  3. *Campus Agenda Scanner* (Mobile | Beginner | +150 XP | Kuota 4 Skuad)
- **Komposisi Visual:** Showcase bergaya **Soft Arcade "Quest Bubble"** bertumpuk (radius 20px–24px). Kartu featured menggunakan surface Warm Cream (`#FFF3DE`), teks judul tebal Ink Navy (`#141925`), tag pill oranye (`WEB • PEMULA`), chip poin `+150 PTS`, tombol aksi pill `Lihat quest →`, dan aksen retro four-point star (✦). Kartu penopang di lapisan belakang berlatar Dark Slate (`#20283A`).
- **Perilaku Mobile:** Stack vertikal 1 kolom dengan jarak 16px; tab penopang tetap terlihat dengan offset atas 8px.
- **Kondisi Batas:**
  - Jika DB kosong/offline: Tampilkan fallback kartu kurasi resmi klub (`FALLBACK_TEASERS`).
  - Quest penuh: Tampilkan badge taktil `KUOTA PENUH` pada slot pengambil.

---

### Section 4: Mode Kolaborasi Skuad (Multiplayer Co-Op)

- **Pertanyaan Pengunjung:** "Apakah saya harus bekerja sendiri atau bisa berkelompok?"
- **Pesan Utama:** Quest kompleks dirancang untuk dikerjakan bersama tim dengan sinkronisasi status submission.
- **Draft Copy:**
  - Eyebrow: `MODE MULTIPLAYER`
  - Headline: `Kerjakan Misi Bersama Skuad Pilihanmu`
  - Deskripsi: `Bentuk lobi regu untuk quest berskala besar. Bagikan tautan undangan instan, bagi beban tugas repositori, dan nikmati persetujuan poin bersama saat proyek lolos review.`
  - Highlight Aturan: Kuota multi-slot dinamis sesuai spesifikasi misi (`maxSnatchers` 2–5 orang), batas aman 3 quest aktif tetap berlaku, dan proteksi penalti aktif.
- **Komposisi Visual:** Panel horizontal berlatar Slate Surface (`#20283A`), menampilkan simulasi kartu lobi skuad dan komponen **"Reward Button & Notification"** Soft Arcade: notifikasi "Quest selesai! Kontribusi disetujui." dengan badge bintang ✦ `+150 POIN KONTRIBUSI`, tombol pill dual-tone `[✦] 150 PTS`, dan tombol aksi primer lebar pastel amber "Cari quest berikutnya →".
- **Perilaku Mobile:** Tata letak responsif menumpuk kartu detail lobi di bawah deskripsi aturan.
- **Kondisi Batas:** Jika quest berstatus solo (`maxSnatchers = 1`), sistem menerangkan bahwa quest tersebut khusus pengerjaan mandiri.

---

### Section 5: Papan Peringkat & Rekognisi Reputasi

- **Pertanyaan Pengunjung:** "Apa rekognisi nyata yang saya peroleh setelah menyelesaikan tugas?"
- **Pesan Utama:** Transparansi reputasi melalui leaderboard dinamis dan 14 lencana keahlian digital.
- **Draft Copy:**
  - Eyebrow: `REKOGNISI REPUTASI`
  - Headline: `Papan Peringkat Kampus & Lencana Keahlian`
  - Deskripsi: `Setiap kontribusi kode yang diterima mentor menambah poin XP akunmu. Naikkan peringkat kampusmu dan sematkan hingga 3 lencana pencapaian unggulan di profil publikmu.`
- **Komposisi Visual:**
  - Kiri: **Player Pebble & Soft Arcade Leaderboard list**. Rank 1 baris full pill solid Warm Amber (`#FFAE58`) dengan badge lingkaran hitam "1", ikon bintang ✦, dan teks bold Ink Navy `#141925`; Rank 2 & Rank 3 baris full pill Dark Slate (`#20283A`) dengan badge lingkaran abu-abu slate dan teks Warm Cream `#FFF3DE`. Dilengkapi kartu profil Player Pebble bar dengan avatar lingkaran `cq` + bintang oranye ✦.
  - Kanan: Grid mini 14 badge (Novice, Apprentice, Journeyman, Web Weaver, AI Architect, Mobile Maestro, Conqueror).
- **Perilaku Mobile:** Baris pill leaderboard ditampilkan vertikal responsif dengan Rank 1 di puncak, diikuti grid badge ringkas.
- **Kondisi Batas:** Jika belum ada penyelesaian, tampilkan placeholder "Musim Baru Dimulai — Jadilah yang Pertama di Puncak!".

---

### Section 6: Gerbang Onboarding & Ajakan Bergabung

- **Pertanyaan Pengunjung:** "Bagaimana cara saya mulai bergabung sekarang?"
- **Pesan Utama:** Pendaftaran akun instan, aman, dan langsung terhubung dengan katalog quest aktif.
- **Draft Copy:**
  - Headline: `SIAP MEMULAI QUEST PERTAMAMU?`
  - Subheadline: `Daftarkan akun sekarang, telusuri tantangan yang tersedia, dan buktikan keahlian kodingmu di arena CodeQuest.`
  - Tombol Aksi: `BUAT AKUN SEKARANG` (Primer) | `MASUK KE AKUN` (Sekunder)
  - Catatan Kaki: `Terbuka untuk pengembang mahasiswa. Dukungan autentikasi email terverifikasi.`
- **Komposisi Visual:** Banner kontras tinggi terpusat (*centered action box*) dengan border tebal `#47577A` dan aksen tombol amber taktil.
- **Perilaku Mobile:** Tombol bertumpuk vertikal dengan ukuran tombol penuh.
- **Kondisi Batas:** Jika pengguna sudah login, section ini otomatis menampilkan status aktif dan tombol `BUKA WORKSPACE`.

---

## 4. Wireframe Teks Lengkap

### 4.1 Wireframe Desktop (1200px Canvas)

```
================================================================================
[HEADER]: CODEQUEST (Logo) | Explore | Leaderboard | Workspace | [Masuk / Daftar]
================================================================================
[SECTION 1: HERO]
(Col 1-7)                                    (Col 8-12)
[CHIP]: SEASON 1 AKTIF | CYBER UNIV CLUB    ┌──────────────────────────────────┐
KLAIM MISI KODING KAMPUS.                    │ TELEMETRI MISI AKTIF             │
BANGUN PROYEK NYATA.                         │ > Total Quest Aktif  : 12 Misi   │
                                             │ > Pengembang Aktif   : Terhubung │
Platform tugas rekayasa piranti lunak kampus │ > Review Terverifikasi: 100% Man │
untuk membangun portofolio riil.             └──────────────────────────────────┘
[JELAJAHI DAFTAR QUEST (Amber)]  [DAFTAR AKUN (Slate)]
--------------------------------------------------------------------------------
[SECTION 2: PIPELINE KERJA]
Empat Langkah dari Tantangan Menuju Kode Terverifikasi
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ 01. AMBIL    │-->│ 02. BANGUN   │-->│ 03. KIRIM    │-->│ 04. REWARD   │
│ Kunci slot   │   │ Repositori   │   │ URL Git & PR │   │ Poin & Badge │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
--------------------------------------------------------------------------------
[SECTION 3: SHOWCASE MISI AKTIF (SOFT ARCADE QUEST BUBBLE)]
Tantangan Nyata yang Menunggu Diselesaikan
┌─────────────────────────────────┐ ┌─────────────────────────────────┐
│ TAB PENOPANG (Dark Slate)       │ │ TAB PENOPANG (Dark Slate)       │
│ ┌─────────────────────────────┐ │ │ ┌─────────────────────────────┐ │
│ │ KARTU CREAM (Warm Cream)    │ │ │ │ KARTU CREAM (Warm Cream)    │ │
│ │ [✦] [WEB • PEMULA] [+150 PTS]│ │ │ │ [✦] [AI • MENENGAH] [+250 PTS]│ │
│ │ Task Processing Pipeline    │ │ │ │ Prompt Eval Runner          │ │
│ │ [Lihat quest → (Pill)]      │ │ │ │ [Lihat quest → (Pill)]      │ │
│ └─────────────────────────────┘ │ │ └─────────────────────────────┘ │
└─────────────────────────────────┘ └─────────────────────────────────┘
--------------------------------------------------------------------------------
[SECTION 4: KOLABORASI SKUAD & REWARD NOTIFICATION]
Bentuk Skuad Co-Op untuk Misi Skala Besar
┌───────────────────────────────────────────┬──────────────────────────────────┐
│ Lobi Tim & Notifikasi Reward              │ Aturan Skuad:                    │
│ [✦ +150 POIN KONTRIBUSI] (Pill Badge)     │ - Kuota dinamis (maxSnatchers)   │
│ "Quest selesai! Kontribusi disetujui."    │ - Batas 3 misi aktif per anggota │
│ [ ✦ ] 150 PTS (Dual-Tone)                 │ - Proteksi penalti aktif         │
│ [Cari quest berikutnya → (Full Pill)]     │                                  │
└───────────────────────────────────────────┴──────────────────────────────────┘
--------------------------------------------------------------------------------
[SECTION 5: LEADERBOARD & PLAYER PEBBLE]
Papan Peringkat Kampus & 14 Lencana Keahlian
┌───────────────────────────────────────────┬──────────────────────────────────┐
│ SOFT ARCADE LEADERBOARD LIST              │ KOLEKSI 14 LENCANA DIGITAL       │
│ [cq✦] Alex Dev (Level 4)      [1,420 PTS] │ [Web Weaver] [AI Architect]      │
│ ----------------------------------------- │ [Mobile Maestro] [Conqueror]     │
│ (( 1 )) Alex Dev (Amber Pill) ✦ 2,150 PTS │                                  │
│ (( 2 )) Budi Runner (Slate)     1,840 PTS │                                  │
│ (( 3 )) Citra Code  (Slate)     1,620 PTS │                                  │
└───────────────────────────────────────────┴──────────────────────────────────┘
--------------------------------------------------------------------------------
[SECTION 6: GERBANG ONBOARDING]
SIAP MEMULAI QUEST PERTAMAMU?
[BUAT AKUN SEKARANG (Amber)]   [MASUK KE AKUN (Slate)]
================================================================================
[FOOTER]: CodeQuest © 2026 Cyber University Coding Club | Privasi | Ketentuan
================================================================================
```

---

## 5. Rencana Dependensi & Acceptance Criteria

### 5.1 Dependensi Komponen & Data
1. **Autentikasi Server Component**: `const session = await auth(); const user = session?.user;` dari `@/auth` untuk conditional CTA rendering (Guest / Member / Admin) pada Section 1 dan Section 6.
2. **Katalog Quest Pilihan**: `prisma.quest.findMany({ where: { status: 'Active' }, take: 3, orderBy: { points: 'desc' } })`
3. **Telemetri Hero**: `prisma.quest.count({ where: { status: 'Active' } })` dibungkus dengan default fallback resilient (misal `12` misi) jika DB offline/lambat.
4. **Papan Peringkat Top 3**: `getLeaderboardUsers(1, 3)` dari `@/actions/user` (atau query langsung `prisma.user.findMany({ orderBy: { points: 'desc' }, take: 3, select: { id: true, name: true, points: true, avatar: true } })`).
5. **Fallback Datasets (Resilience & Offline First)**:
   - `FALLBACK_TEASERS`: 3 quest kurasi standar (Web Runner, AI Eval Suite, Mobile Campus).
   - `FALLBACK_LEADERBOARD_PODIUM`: 3 entri dummy profil terverifikasi (Top 1 Gold, Top 2 Silver, Top 3 Bronze) jika database kosong atau mengalami gangguan koneksi.
6. **Catatan Arsitektur Transisi Token CSS**:
   - Spesifikasi `DESIGN.md` mendefinisikan token semantik baru (`--color-bg`, `--color-surface`, `--color-accent-amber`, dsb).
   - Pada fase implementasi UI nanti, styling landing page diaplikasikan secara scoped/terisolasi atau melalui Tailwind preset kelas baru tanpa merusak styling rute legacy (`/admin`, `/workspace`) sampai migrasi menyeluruh disetujui.

### 5.2 Acceptance Criteria Perencanaan
- [ ] Menggunakan palet yang telah disetujui: Ink Navy `#141925`, Surface `#20283A`, Cream `#FFF3DE`, Amber `#FFAE58`, Sekunder `#C2C7D0`.
- [ ] Tidak ada teks Cream di atas tombol Amber (kontras AAA dengan teks Ink Navy).
- [ ] Tombol memiliki bayangan taktil 3D tegas (`0 4px 0 ...`) dan efek tekan `translateY(2px)`.
- [ ] Seluruh klaim mencerminkan kapabilitas kode riil (tanpa testimoni fiktif, tanpa AI reviewer fiktif).
- [ ] Menjawab 6 pertanyaan kunci pengunjung secara tuntas.
- [ ] Struktur responsif lengkap: Mobile (`<640px`), Tablet (`640-1024px`), Desktop (`>=1024px`).
- [ ] Mendukung mode reduced motion (`motion-reduce`).
