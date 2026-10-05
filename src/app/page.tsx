import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { prisma } from '@/lib/db'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'CodeQuest - Platform Gamifikasi Coding Mahasiswa Cyber University',
  description: 'Tingkatkan skill pemrograman melalui misi nyata berbasis studi kasus riil. Snatch quest coding, kirim bukti implementasi, dan raih peringkat teratas di leaderboard mahasiswa Cyber University.',
  openGraph: {
    title: 'CodeQuest - Platform Gamifikasi Coding Mahasiswa Cyber University',
    description: 'Taklukkan tantangan coding nyata, kumpulkan poin EXP dan lencana eksklusif, serta puncaki leaderboard mahasiswa kampus.',
    type: 'website',
    images: [{ url: '/icon-big.png', width: 512, height: 512, alt: 'CodeQuest' }]
  },
  twitter: {
    card: 'summary',
    title: 'CodeQuest - Platform Gamifikasi Coding Mahasiswa',
    description: 'Taklukkan tantangan coding nyata, kumpulkan poin EXP dan lencana eksklusif.',
    images: ['/icon-big.png']
  }
}

interface QuestItem {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  points: number
  maxSnatchers: number
  deadline?: Date | string | null
  _count: {
    snatches: number
  }
}

// Fallback quests for snapshot when database has 0 quests or connection fallback is triggered
const fallbackQuests: QuestItem[] = [
  {
    id: 'cq-demo-1',
    title: 'Modern Student Dashboard with Turbopack',
    description: 'Rancang antarmuka dashboard mahasiswa yang responsif dengan metrik performa tinggi, dark mode otomatis, dan komponen modular.',
    difficulty: 'Intermediate',
    category: 'Web',
    points: 350,
    maxSnatchers: 3,
    _count: { snatches: 1 }
  },
  {
    id: 'cq-demo-2',
    title: 'Autonomous Code Review Assistant API',
    description: 'Implementasikan backend REST API yang memvalidasi sintaks dan pola keamanan kode submission mahasiswa secara otomatis.',
    difficulty: 'Advanced',
    category: 'AI',
    points: 600,
    maxSnatchers: 2,
    _count: { snatches: 1 }
  },
  {
    id: 'cq-demo-3',
    title: 'Campus Schedule & Notification Mobile Module',
    description: 'Bangun integrasi push notification dan jadwal kelas offline-first untuk aplikasi seluler mahasiswa Cyber University.',
    difficulty: 'Beginner',
    category: 'Mobile',
    points: 150,
    maxSnatchers: 4,
    _count: { snatches: 2 }
  }
]

async function getFeaturedQuests(): Promise<QuestItem[]> {
  try {
    const quests = await prisma.quest.findMany({
      where: { status: 'Active' },
      take: 3,
      orderBy: { points: 'desc' },
      include: {
        _count: {
          select: {
            snatches: {
              where: {
                status: {
                  in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'COMPLETED', 'ACCEPTED']
                }
              }
            }
          }
        }
      }
    })

    if (quests.length > 0) {
      return quests as unknown as QuestItem[]
    }
  } catch (error) {
    console.error('getFeaturedQuests notice (fallback quests used):', error)
  }

  return fallbackQuests
}

export default async function LandingPage() {
  const featuredQuests = await getFeaturedQuests()

  return (
    <div className="min-h-screen flex flex-col relative text-slate-800 dark:text-slate-100 [overflow-x:clip]">
      {/* Background ambient grid & lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-50 dark:hidden"
          style={{
            backgroundImage: 'radial-gradient(circle, #64748b 1.25px, transparent 1.25px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="absolute inset-0 opacity-40 hidden dark:block"
          style={{
            backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top left, rgba(249,115,22,0.14), transparent 55%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at bottom right, rgba(14,165,233,0.08), transparent 50%)' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header activePage="explore" />

        <main className="flex-grow flex flex-col">
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 1. HERO SECTION                                           */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <section className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto w-full">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
              {/* Institution Eyebrow */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 shadow-sm">
                <span className="flex size-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-orange-700 dark:text-orange-400">
                  Cyber University Coding Club Official
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Tingkatkan Skill Coding Melalui{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                  Misi Nyata
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Tinggalkan tutorial pasif. CodeQuest mengubah tugas development menjadi misi gamifikasi kompetitif. Snatch tantangan coding riil, kirimkan hasil deploy repositori, dan bangun reputasimu di kampus.
              </p>

              {/* Dual Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-2">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                  Mulai Misi Sekarang
                </Link>
                <Link
                  href="/explore"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-zinc-800/80 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">explore</span>
                  Jelajahi Quest Board
                </Link>
              </div>

              {/* Key Trust Metrics */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl border-t border-slate-200/80 dark:border-slate-800/80">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">100%</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-World Tasks</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400 font-mono">Fast Snatch</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Competitive Slots</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">Admin Verified</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Strict Code Review</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">Live Rank</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Campus Leaderboard</span>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 2. PROBLEM & SOLUTION / VALUE PROPOSITION                 */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <section className="px-6 py-20 bg-slate-100/60 dark:bg-zinc-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                <span className="text-xs font-mono uppercase tracking-[0.25em] font-bold text-orange-600 dark:text-orange-400">
                  Transformasi Belajar
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Dari Tutorial Pasif Menuju Eksekusi Nyata
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
                  Kebanyakan mahasiswa coding menghabiskan waktu menonton video tanpa hasil karya terukur. CodeQuest mendesain ulang kurva pembelajaran.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Traditional Pain Point */}
                <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-red-200/70 dark:border-red-900/30 shadow-sm space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold font-mono">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    Tantangan Klasik Mahasiswa
                  </div>
                  <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0 mt-0.5">error</span>
                      <span><strong>Tutorial Hell:</strong> Mengikuti langkah video tanpa memahami pemecahan masalah mandiri dan arsitektur kode.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0 mt-0.5">error</span>
                      <span><strong>Ketiadaan Code Review:</strong> Tidak ada feedback dari praktisi atau tim admin terkait clean code dan keamanan.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0 mt-0.5">error</span>
                      <span><strong>Portofolio Duplikat:</strong> Membuat aplikasi to-do list yang sama dengan ribuan pelamar kerja lainnya.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0 mt-0.5">error</span>
                      <span><strong>Kehilangan Motivasi:</strong> Belajar sendirian tanpa ritme kompetisi sehat dan pengakuan prestasi kampus.</span>
                    </li>
                  </ul>
                </div>

                {/* The CodeQuest Solution */}
                <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-200/70 dark:border-emerald-900/40 shadow-sm space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Keunggulan CodeQuest
                  </div>
                  <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-emerald-500 text-[20px] shrink-0 mt-0.5">task_alt</span>
                      <span><strong>Misi Berbasis Kebutuhan Nyata:</strong> Setiap quest mewakili studi kasus industri—Web, AI, Mobile, hingga Desain UI/UX.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-emerald-500 text-[20px] shrink-0 mt-0.5">task_alt</span>
                      <span><strong>Evaluasi Ketat Admin:</strong> Submission repository ditinjau langsung oleh admin sebelum poin EXP diakui.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-emerald-500 text-[20px] shrink-0 mt-0.5">task_alt</span>
                      <span><strong>Bukti Nyata Terverifikasi:</strong> Solusi deploy langsung dan repo GitHub tersimpan rapi di halaman profilmu.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-emerald-500 text-[20px] shrink-0 mt-0.5">task_alt</span>
                      <span><strong>Gamifikasi & Kebanggaan Kampus:</strong> Sistem lencana eksklusif, cooldown anti-penimbunan, dan leaderboard mahasiswa.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 3. HOW IT WORKS (3 SIMPLE STEPS)                          */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <section className="px-6 py-24 max-w-7xl mx-auto w-full">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.25em] font-bold text-orange-600 dark:text-orange-400">
                Alur Pengerjaan
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Bagaimana CodeQuest Bekerja
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
                Hanya butuh 3 langkah terarah untuk mengubah baris kode menjadi prestasi terverifikasi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="relative group p-8 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-800/80 shadow-sm transition-all duration-300 flex flex-col items-start">
                <div className="size-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-mono font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
                  01
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-orange-500 text-[20px]">bolt</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Snatch Quest</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Pilih misi di Quest Board berdasarkan tingkat kesulitan (Beginner, Intermediate, Advanced) dan kategori. Amankan slot sebelum kuota developer penuh.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative group p-8 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800/80 shadow-sm transition-all duration-300 flex flex-col items-start">
                <div className="size-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
                  02
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-amber-500 text-[20px]">code</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Solve & Submit</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Bangun solusimu dengan teknologi yang diminta. Kirimkan tautan repositori GitHub atau URL live deployment sebelum deadline timer habis.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative group p-8 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800/80 shadow-sm transition-all duration-300 flex flex-col items-start">
                <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
                  03
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-emerald-500 text-[20px]">military_tech</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Earn EXP & Badges</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Setelah admin memverifikasi kelayakan submission, poin EXP ditambahkan ke saldo akunmu, membuka lencana langka, dan menaikkan posisi leaderboard.
                </p>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 4. GAMIFICATION SHOWCASE (BADGES & TIERS)                 */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <section className="px-6 py-20 bg-slate-100/60 dark:bg-zinc-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-mono uppercase tracking-[0.25em] font-bold text-orange-600 dark:text-orange-400">
                  Sistem Gamifikasi
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Koleksi Lencana & Naikkan Rank Kampus
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
                  Setiap quest yang berhasil disetujui berkontribusi pada poin akumulatif dan reputasi profilmu.
                </p>
              </div>

              {/* Badges Display */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { file: 'novice.svg', name: 'Novice Explorer', desc: 'Selesaikan 1 Quest' },
                  { file: 'web-weaver.svg', name: 'Web Weaver', desc: '5 Quest Kategori Web' },
                  { file: 'ai-architect.svg', name: 'AI Architect', desc: '5 Quest Kategori AI' },
                  { file: 'high-scorer.svg', name: 'High Scorer', desc: 'Tembus 500+ Poin' },
                  { file: 'conqueror.svg', name: 'Conqueror', desc: 'Taklukkan Misi Advanced' },
                  { file: 'legend.svg', name: 'Living Legend', desc: 'Puncak 5000+ Poin' },
                ].map((b) => (
                  <div
                    key={b.file}
                    className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700/60 transition-all group"
                  >
                    <div className="size-16 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center p-2.5 group-hover:scale-105 transition-transform">
                      <Image
                        src={`/badges/${b.file}`}
                        alt={b.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{b.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rank Tier Progression */}
              <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-orange-500">military_tech</span>
                      Hirarki Tingkatan Developer
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Kenaikan rank otomatis terhitung dari perolehan poin quest yang telah lolos validasi.
                    </p>
                  </div>
                  <Link
                    href="/leaderboard"
                    className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center gap-1"
                  >
                    Lihat Leaderboard Live
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6">
                  {[
                    { tier: 'Novice', range: '0 - 99 pts', color: 'text-slate-600 dark:text-slate-400' },
                    { tier: 'Apprentice', range: '100 - 499 pts', color: 'text-sky-600 dark:text-sky-400' },
                    { tier: 'Journeyman', range: '500 - 999 pts', color: 'text-emerald-600 dark:text-emerald-400' },
                    { tier: 'Expert', range: '1,000 - 2,499 pts', color: 'text-amber-600 dark:text-amber-400' },
                    { tier: 'Master', range: '2,500 - 4,999 pts', color: 'text-orange-600 dark:text-orange-400' },
                    { tier: 'Legend', range: '5,000+ pts', color: 'text-red-600 dark:text-red-400' },
                  ].map((t) => (
                    <div key={t.tier} className="p-3.5 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-slate-800 text-center">
                      <span className={`text-sm font-extrabold ${t.color}`}>{t.tier}</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{t.range}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 5. LIVE QUEST SNAPSHOT                                    */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <section className="px-6 py-24 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-[0.25em] font-bold text-orange-600 dark:text-orange-400">
                  Cuplikan Misi
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Tantangan Terpopuler Hari Ini
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  Lihat beberapa misi coding terbuka yang siap untuk kamu snatch dan selesaikan.
                </p>
              </div>

              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors shrink-0"
              >
                <span>Buka Seluruh Board</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredQuests.map((quest) => (
                <article
                  key={quest.id}
                  className="p-6 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded text-xs font-bold font-mono uppercase tracking-wider bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/40">
                        {quest.category}
                      </span>
                      <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                        quest.difficulty === 'Advanced' ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/40' :
                        quest.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40' :
                        'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                      }`}>
                        {quest.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                      {quest.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {quest.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Image src="/icon.png" alt="Poin" width={16} height={16} className="object-contain" />
                      <span>{quest.points} pts</span>
                    </div>

                    <Link
                      href={`/quests/${quest.id}`}
                      className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors inline-flex items-center gap-1"
                    >
                      Detail Misi
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 6. CYBER UNIVERSITY COMMUNITY IDENTITY                    */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <section className="px-6 py-20 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />

            <div className="max-w-5xl mx-auto relative z-10 text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-mono font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">school</span>
                Eksklusif Mahasiswa Kampus
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Dibangun untuk Komunitas Developer <br className="hidden sm:block" />
                <span className="text-orange-400">Cyber University</span>
              </h2>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                CodeQuest didedikasikan bagi mahasiswa Cyber University (Teknik Informatika, Sistem Informasi, dan Ilmu Komputer) untuk berkolaborasi, mengasah problem-solving, dan memamerkan portofolio pengerjaan proyek riil.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-400">verified</span>
                  <span>Registrasi via Email Kampus (@cyber-univ.ac.id)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-400">groups</span>
                  <span>Kolaborasi Antar Angkatan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-400">badge</span>
                  <span>Portofolio Industri Siap Kerja</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-white hover:bg-slate-100 transition-colors shadow-lg"
                >
                  Daftarkan Akun Mahasiswa
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ)                       */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <section className="px-6 py-24 max-w-4xl mx-auto w-full">
            <div className="text-center mb-16 space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.25em] font-bold text-orange-600 dark:text-orange-400">
                Tanya Jawab
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                Segala hal yang perlu kamu ketahui sebelum memulai petualangan coding pertamamu.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'Siapa saja yang berhak mendaftar dan mengambil quest?',
                  a: 'CodeQuest diperuntukkan bagi mahasiswa aktif Cyber University yang memiliki alamat email institusi dengan akhiran @cyber-univ.ac.id. Akun akan terverifikasi secara otomatis saat pendaftaran.'
                },
                {
                  q: 'Bagaimana sistem penilaian dan perolehan poin EXP berlangsung?',
                  a: 'Setiap quest memiliki bobot poin tersendiri berdasarkan tingkat kesulitan. Poin baru akan masuk ke saldo profil setelah tim admin memvalidasi tautan repositori kode dan memastikan semua kriteria penerimaan (acceptance criteria) terpenuhi.'
                },
                {
                  q: 'Apa yang terjadi jika saya mengambil quest namun tidak menyelesaikannya?',
                  a: 'Setiap quest memiliki batas waktu pengerjaan (deadline). Jika quest ditelantarkan atau di-drop secara sepihak, sistem menerapkan masa cooldown (penalti waktu) agar developer tidak menimbun misi dan memberi kesempatan adil kepada mahasiswa lain.'
                },
                {
                  q: 'Apakah hasil pengerjaan quest bisa dicantumkan ke dalam resume portofolio?',
                  a: 'Tentu saja! Halaman profil CodeQuest milikmu bersifat publik dan memuat seluruh riwayat quest yang telah disetujui, badge keahlian, serta link repository GitHub yang membuktikan kemampuan coding kamu secara nyata.'
                }
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group p-6 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-slate-200 dark:border-slate-800 transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer font-bold text-slate-900 dark:text-white text-base sm:text-lg select-none">
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </main>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* FOOTER                                                      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <Footer />
      </div>
    </div>
  )
}
