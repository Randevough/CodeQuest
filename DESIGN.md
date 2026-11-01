# Design direction — Dark Playful Arcade

Panduan visual mandiri yang terinspirasi [GitMastery](https://gitmastery.me/). Dapat digunakan sebagai acuan proyek lain tanpa bergantung pada nama produk, domain bisnis, atau stack tertentu.

Tanggal observasi: 28 Oktober 2026. Status: ekstraksi karakter visual dan usulan token untuk adaptasi, bukan spesifikasi resmi GitMastery.

## Referensi dan batas observasi

Halaman utama dan dialog sambutan GitMastery ditinjau melalui screenshot serta computed style elemen yang tampil. Karakter yang teramati: latar ungu sangat gelap, CTA lime, aksen ungu/cyan/emas, judul Bungee, teks Geist Sans, panel membulat, serta bayangan bawah tegas pada tombol sekitar 4–5 px.

Situs juga menampilkan jalur belajar, level, poin, dan ilustrasi dunia permainan. Elemen tersebut menjelaskan kesan gamified pada referensi; penerapannya pada proyek tujuan mengikuti kebutuhan produk. Logo, ilustrasi, teks, dan aset GitMastery tidak disertakan dalam dokumen ini.

Nilai HEX, ukuran, dan aturan di bawah adalah **usulan adaptasi**, bukan hasil ekstraksi persis seluruh token situs.

## Karakter visual

- Dasar gelap bernuansa ungu dengan aksen neon yang terarah.
- Judul tebal dan padat, bentuk membulat, tombol yang terasa bisa ditekan.
- Panel seperti papan permainan dengan bingkai dan kedalaman yang jelas.
- Badge, angka, node, dan indikator progres memberi rasa perkembangan jika relevan dengan produk.
- Teks isi tetap tenang, mudah dibaca, dan tidak bersaing dengan dekorasi.

Gunakan gaya gamified sebagai bahasa visual terlebih dahulu. XP, level, streak, leaderboard, hadiah, atau fitur permainan lainnya merupakan keputusan produk tersendiri; jangan menambahkannya hanya untuk meniru referensi.

## Palet warna

| Token | HEX usulan | Peran |
| --- | --- | --- |
| `--color-bg` | `#0D0A1F` | Latar utama; teks di atas lime |
| `--color-surface` | `#17112E` | Kartu, navigasi, input |
| `--color-surface-raised` | `#251B43` | Dialog dan panel menonjol |
| `--color-border` | `#4A3B68` | Bingkai dekoratif dan pemisah |
| `--color-control-border` | `#8876A8` | Batas kontrol yang perlu terlihat jelas |
| `--color-text` | `#F7F5FF` | Teks utama |
| `--color-text-muted` | `#C4BBD8` | Metadata dan petunjuk |
| `--color-primary` | `#B7F94D` | CTA utama dan highlight penting |
| `--color-primary-hover` | `#C9FF78` | Hover CTA utama |
| `--color-primary-edge` | `#609C26` | Kedalaman tombol lime |
| `--color-secondary` | `#6D28B8` | CTA pendamping dan navigasi aktif |
| `--color-secondary-hover` | `#7A32C8` | Hover CTA pendamping |
| `--color-secondary-edge` | `#41176E` | Kedalaman tombol ungu |
| `--color-focus` | `#42D9EF` | Fokus keyboard dan aksen cyan |
| `--color-info` | `#79DFF2` | Informasi |
| `--color-warning` | `#FFD166` | Peringatan; aksen emas dekoratif bila tidak ambigu |
| `--color-success` | `#80E6AD` | Hasil berhasil |
| `--color-danger` | `#FF9AAA` | Kesalahan dan tindakan berisiko |

Komposisi awal: sekitar 80% bidang gelap, 15% ungu, 5% aksen terang. Ini pedoman penekanan, bukan kuota per komponen. Pertahankan satu CTA dominan per bagian.

Pasangkan lime dengan teks gelap dan ungu dengan teks terang. Teks utama/muted serta teks status ditempatkan di atas surface gelap. Jangan memakai teks putih di atas lime. Bingkai dekoratif tidak menggantikan batas kontrol yang perlu kontras. Simpan warna sebagai token semantik terpusat, bukan HEX berulang di setiap halaman.

## Tipografi

| Peran | Usulan | Aturan |
| --- | --- | --- |
| Hero | Bungee 400, 48–80 px desktop; 32–48 px HP; line-height 1,1–1,15 | Singkat, maksimal beberapa baris |
| Judul halaman aplikasi | Bungee 400, 32–48 px | Satu blok dominan |
| Judul bagian | Geist Sans 700, 20–28 px; line-height 1,3 | Bungee opsional untuk judul pendek yang ekspresif |
| Judul kartu | Geist Sans 700, 18–20 px | Tetap terbaca saat membungkus |
| Isi dan input | Geist Sans 400–500, 16 px; line-height 1,5 | Utamakan keterbacaan |
| Tombol | Geist Sans 600–700, 14–16 px | Bungee opsional pada CTA pendek |
| Metadata dan badge | Geist Sans 500–600, 14 px | Hindari huruf kapital panjang |
| Kode atau terminal | Geist Mono, 14–16 px | Hanya jika relevan dengan produk |

Fallback sans: `"Geist Sans", system-ui, sans-serif`. Fallback display: `"Bungee", "Geist Sans", system-ui, sans-serif`. Monospace: `"Geist Mono", ui-monospace, monospace`. Periksa lisensi dan pemuatan font saat implementasi. Gunakan angka tabular untuk hitungan. Nama panjang harus bisa dibaca lengkap.

## Bentuk, kedalaman, dan jarak

- Skala jarak: 4, 8, 12, 16, 24, 32, 48, 64 px.
- Padding kartu 16–24 px; jarak antarkomponen 12–24 px; jarak bagian 32–64 px.
- Lebar konten maksimal 1200 px; gutter 16 px HP, 24 px tablet, 32 px desktop.
- Radius input 10 px, tombol 14–16 px, kartu 20 px, dialog 24 px; badge berbentuk pil.
- Bingkai kartu 1–2 px; kartu biasa cukup bingkai, panel unggulan boleh diberi bayangan offset.
- Bayangan CTA lime: `0 4px 0 var(--color-primary-edge)`.
- Bayangan CTA ungu: `0 4px 0 var(--color-secondary-edge)`.
- Bayangan panel unggulan: `4px 4px 0 var(--color-secondary-edge)`.

Kedalaman terutama berasal dari bayangan keras dan lapisan bidang. Gunakan glow atau gradient secara lokal pada hero/ilustrasi. Hindari blur dan neon pada seluruh permukaan.

## Komponen

| Komponen | Arahan |
| --- | --- |
| Navigasi | Bar gelap, logo jelas, menu aktif ungu, CTA utama lime; nama menu tetap terbaca pada HP |
| Hero | Judul pendek berkarakter, satu kata boleh disorot seperti stiker lime, teks pendukung dan CTA; ilustrasi opsional |
| Tombol utama | Lime dengan teks gelap, radius membulat, bayangan bawah tegas |
| Tombol pendamping | Ungu dengan teks terang; aksi ringan memakai surface berbingkai |
| Kartu | Surface gelap, bingkai ungu, judul jelas, metadata lebih redup; jangan membuat semua kartu menonjol sama kuat |
| Badge | Label singkat, kontras cukup, ikon opsional; warna bukan satu-satunya penanda |
| Progres | Jalur/node atau progress bar jika ada progres nyata; sertakan label dan nilai yang dapat diakses |
| Input | Label terlihat, surface gelap, bingkai kontrol, pesan kesalahan dekat field |
| Dialog | Surface-raised, judul dan dampak jelas, tindakan lanjut/kembali mudah dibedakan |
| Feedback | Ikon dan kalimat konkret; keberhasilan tampil setelah operasi benar-benar berhasil |

Keadaan tombol wajib: default, hover, pressed, focus-visible, disabled, loading. Hover meningkatkan kecerahan. Pressed menggeser isi sekitar 2 px dan mengurangi bayangan tanpa menggeser alokasi layout. Fokus memakai ring cyan 3 px dengan offset 3 px. Loading memakai label tindakan seperti “Menyimpan…” dan mencegah pengiriman berulang. Disabled memakai semantik nonaktif dan alasan bila diperlukan.

Ikon SVG konsisten, ukuran 20–24 px, stroke sekitar 2 px. Ikon dekoratif disembunyikan dari pembaca layar; kontrol ikon memiliki nama aksesibel. Emoji dan ilustrasi tidak menjadi satu-satunya pembawa informasi.

## Tata letak responsif

Usulan breakpoint: di bawah 640 px untuk HP, 640–1023 px untuk tablet, mulai 1024 px untuk desktop. Grid kartu dapat beralih dari satu ke dua lalu tiga/empat kolom sesuai panjang isi. Hero dua kolom ditumpuk pada HP, dengan pesan dan CTA sebelum ilustrasi.

Untuk aplikasi yang berorientasi tugas, tampilkan konten dan tindakan inti dekat bagian atas halaman. Untuk landing page, hero boleh lebih ekspresif. Jangan memaksakan susunan landing page ke semua layar aplikasi.

## Ilustrasi dan dekorasi

Gunakan ilustrasi orisinal dengan bentuk membulat, perspektif isometrik, jalur bercahaya, atau objek seperti kepingan permainan bila sesuai konteks. Warna ilustrasi mengikuti ungu, lime, cyan, dan emas. Stiker sedikit miring boleh dipakai pada satu highlight hero; teks isi, tabel, dan kontrol tetap lurus.

Ilustrasi tidak boleh menghalangi CTA, menurunkan kontras teks, atau menjadi syarat memahami isi. Jangan mengambil logo, maskot, ilustrasi, dan aset GitMastery sebagai aset proyek baru.

## Gerak dan keadaan data

Transisi warna/tekan 120–160 ms; dialog 160–200 ms. Hormati `prefers-reduced-motion` dengan meniadakan translasi dan animasi dekoratif. Hindari gerakan terus-menerus yang mengganggu tugas, suara otomatis, serta confetti pada kesalahan atau tindakan destruktif.

Sediakan keadaan memuat, kosong, gagal memuat, berhasil, dan gagal menyimpan. Skeleton menjaga struktur stabil. Pesan kosong menjelaskan konteks; gagal memuat tidak dianggap kosong. Formulir mempertahankan isian ketika gagal. Pesan kritis tersedia di area terkait, bukan hanya toast yang cepat hilang.

## Aksesibilitas dan pemeriksaan akhir

- Teks biasa minimal 4,5:1; teks besar minimal 3:1; kontrol/ikon bermakna minimal 3:1 terhadap bidang bersebelahan. Ukur pasangan aktual termasuk hover dan opacity.
- Semua aksi tersedia melalui keyboard, fokus terlihat, dan urutan fokus mengikuti susunan visual.
- Target sentuh diusahakan minimal 44 × 44 CSS px.
- Status dan progres memiliki label selain warna; kontrol memiliki nama dan keadaan aksesibel.
- Dialog mengelola fokus dan mengembalikannya ke pemicu setelah ditutup.
- Verifikasi pada lebar 360, 768, dan 1280 CSS px serta zoom 200%; judul panjang tidak menutupi tindakan.
- Uji reduced motion, font fallback, kontras aktual, serta keadaan loading/kosong/gagal.

Dokumen ini belum memuat implementasi atau bukti pengujian UI. Nama produk, bahasa antarmuka, fitur, stack, dan aturan bisnis ditentukan oleh proyek yang memakai panduan ini.
