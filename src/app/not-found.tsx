import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col relative text-slate-800 dark:text-slate-100 [overflow-x:clip] bg-white dark:bg-[#0a0a0a]">

            {/* Background dot pattern + glow auras */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-50 dark:hidden" style={{
                    backgroundImage: 'radial-gradient(circle, #64748b 1.25px, transparent 1.25px)',
                    backgroundSize: '24px 24px',
                }} />
                <div className="absolute inset-0 opacity-40 hidden dark:block" style={{
                    backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top left, rgba(249,115,22,0.12), transparent 60%)' }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at bottom right, rgba(249,115,22,0.08), transparent 60%)' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 min-h-screen px-6 py-24 text-center">

                {/* Crosshair corners */}
                <div className="relative inline-block mb-10">
                    <div className="crosshair absolute -top-3 -left-3" />
                    <div className="crosshair absolute -top-3 -right-3" />
                    <div className="crosshair absolute -bottom-3 -left-3" />
                    <div className="crosshair absolute -bottom-3 -right-3" />

                    {/* 404 Glitch block */}
                    <div className="relative px-8 py-6 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-2 justify-center mb-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-slate-400">Error 404</span>
                        </div>
                        <div
                            className="text-[96px] sm:text-[128px] font-black leading-none tracking-tight bg-clip-text text-transparent select-none"
                            style={{
                                backgroundImage: 'linear-gradient(135deg, #f97316 0%, #fb923c 40%, #94a3b8 100%)',
                            }}
                        >
                            404
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                    Quest Not Found
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm text-base leading-relaxed mb-10">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved. Head back to the quest board and find your next mission.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                    >
                        <span className="material-symbols-outlined text-[18px]">home</span>
                        Back to Quest Board
                    </Link>
                    <Link
                        href="/leaderboard"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-sm font-bold border border-slate-200 dark:border-white/10 shadow-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                    >
                        <span className="material-symbols-outlined text-[18px]">emoji_events</span>
                        Leaderboard
                    </Link>
                </div>

                {/* Footer hint */}
                <p className="mt-16 text-xs font-mono text-slate-400 tracking-widest uppercase">
                    CodeQuest &mdash; Internal Quest Board
                </p>
            </div>
        </div>
    )
}
