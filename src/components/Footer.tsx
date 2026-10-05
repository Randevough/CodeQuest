import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/icon-big.png"
                alt="CodeQuest Logo"
                width={32}
                height={32}
                className="rounded object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                CodeQuest
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Platform gamifikasi tugas coding internal untuk mahasiswa Cyber University Coding Club. Selesaikan misi nyata, raih EXP, dan buktikan keahlianmu.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400 dark:text-slate-500">
              <span className="text-xs font-mono font-medium">Domain: @cyber-univ.ac.id</span>
            </div>
          </div>

          {/* Quick links: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-slate-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore" className="text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Explore Quests
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/workspace" className="text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  My Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-slate-900 dark:text-white">
              Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  About CodeQuest
                </Link>
              </li>
              <li>
                <a
                  href="https://cyber-univ.ac.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors inline-flex items-center gap-1"
                >
                  Cyber University
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-600 text-xs">Coding Club Division</span>
              </li>
            </ul>
          </div>

          {/* Account & Action */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-slate-900 dark:text-white">
              Access
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Register Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} CodeQuest. Built for Cyber University Coding Club.</p>
          <p className="flex items-center gap-1">
            Engineered with <span className="text-orange-500">&hearts;</span> by Students for Students
          </p>
        </div>
      </div>
    </footer>
  )
}
