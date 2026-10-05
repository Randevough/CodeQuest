import Link from 'next/link'
import { Header } from '@/components/Header'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative text-slate-800 dark:text-slate-100 [overflow-x:clip]">
      {/* Background glow auras */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-50 dark:hidden" style={{
          backgroundImage: 'radial-gradient(circle, #64748b 1.25px, transparent 1.25px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute inset-0 opacity-40 hidden dark:block" style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top left, rgba(249,115,22,0.15), transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at bottom right, rgba(100,116,139,0.15), transparent 60%)' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header activePage="explore" />

        <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-16 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-6">
            <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
            Platform Gamifikasi Coding Mahasiswa
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl">
            Tingkatkan Skill Pemrograman Melalui <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Misi Nyata</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Selesaikan quest coding, kumpulkan EXP dan lencana eksklusif, serta bersaing di leaderboard mahasiswa kampus.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Mulai Misi Sekarang
            </Link>
            <Link
              href="/explore"
              className="px-6 py-3.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-zinc-800/80 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 backdrop-blur-sm transition-all"
            >
              Jelajahi Quest
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
