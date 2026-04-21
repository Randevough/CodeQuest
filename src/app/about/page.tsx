import { Header } from '@/components/Header'
import Link from 'next/link'

// Reusable corner crosshair 
function SectionFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative ${className}`}>
            <div className="crosshair absolute -top-2 -left-2" />
            <div className="crosshair absolute -top-2 -right-2" />
            <div className="crosshair absolute -bottom-2 -left-2" />
            <div className="crosshair absolute -bottom-2 -right-2" />
            {children}
        </div>
    )
}

// Mechanic cards data 
const mechanics = [
    {
        icon: 'bolt',
        label: 'Competitive Snatching',
        description: 'Speed is a core skill here. Secure your mission before others do—in this guild, the best opportunities are claimed in seconds.'
    },
    {
        icon: 'emoji_events',
        label: 'Sparkle Progression',
        description: 'Turn your code into prestige. Every successful submission earns you Sparkles ✨, fueling your climb through the ranks of the global elite.'
    },
    {
        icon: 'assignment_turned_in',
        label: 'Quality Governance',
        description: 'We value precision over raw speed. Submissions enter a strict review cycle where expert feedback is the forge that sharpens your technical craft.'
    },
    {
        icon: 'timer',
        label: 'Temporal Integrity',
        description: 'Reliability is non-negotiable. Missing a deadline triggers a mandatory cooldown, because a true architect delivers on time, every time.'
    },
    {
        icon: 'group',
        label: 'Collaborative Squads',
        description: 'Complexity is best tackled together. Synchronize with your team to snatch shared missions and build architectural solutions that last.'
    },
    {
        icon: 'workspace_premium',
        label: 'Progression Tiers',
        description: 'Prestige unlocks privilege. Prove your worth on standard missions to gain exclusive access to elite, high-stakes technical challenges.'
    },]

// Social links 
const socials = [
    {
        label: 'GitHub',
        href: 'https://github.com/',
        icon: (
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com/',
        icon: (
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: 'Discord',
        href: '#',
        icon: (
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
            </svg>
        ),
    },
]

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col relative text-slate-800 dark:text-slate-100 [overflow-x:clip]">

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-50 dark:hidden" style={{
                    backgroundImage: 'radial-gradient(circle, #e5e7eb 1.25px, transparent 1.25px)',
                    backgroundSize: '24px 24px',
                }} />
                <div className="absolute inset-0 opacity-30 hidden dark:block" style={{
                    backgroundImage: 'radial-gradient(circle, #94a3b8 1.25px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 10%, rgba(234,88,12,0.08), transparent 55%)' }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 80% 90%, rgba(234,88,12,0.06), transparent 55%)' }} />
            </div>

            {/* ── Header ── */}
            <div className="relative z-10">
                <Header activePage="explore" />
            </div>

            {/* ── Main content ── */}
            <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-6 py-20 flex flex-col gap-24">

                {/* ══ HERO ══ */}
                <SectionFrame>
                    <div className="text-center flex flex-col items-center gap-6 py-8">
                        {/* Eyebrow */}
                        <div className="inline-flex items-center gap-2">
                            <span className="inline-block w-8 h-px bg-slate-300 dark:bg-slate-600" />
                            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-slate-400">Internal Platform</span>
                            <span className="inline-block w-8 h-px bg-slate-300 dark:bg-slate-600" />
                        </div>

                        {/* Title with fading line accents */}
                        <div className="flex items-center gap-6 w-full">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-700 hidden sm:block" />
                            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight shrink-0">
                                What is <span className="text-orange-600">CodeQuest</span>?
                            </h1>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-700 hidden sm:block" />
                        </div>

                        <p className="max-w-2xl text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                            CodeQuest is the internal quest board for <span className="font-semibold text-slate-700 dark:text-slate-200">Cyber University&apos;s Coding Club</span>.
                            It gamifies real club projects — members snatch quests, submit work, and earn points to climb the leaderboard.
                            It&apos;s not a course. It&apos;s a competitive playground.
                        </p>

                        {/* Stat pills */}
                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                            {[
                                { icon: 'bolt', label: 'Snatch System' },
                                { icon: 'emoji_events', label: 'Live Leaderboard' },
                                { icon: 'assignment_turned_in', label: 'Review Pipeline' },
                            ].map(item => (
                                <span key={item.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">
                                    <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </SectionFrame>

                {/* ══ CORE MECHANICS ══ */}
                <SectionFrame>
                    <div className="text-center mb-10">
                        <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-slate-400">How it works</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">Core Mechanics</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mechanics.map((m) => (
                            <div
                                key={m.label}
                                className="group relative bg-white/40 dark:bg-white/5 backdrop-blur-lg border border-white/80 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800/50 transition-all duration-200"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center justify-center size-9 rounded-lg bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800/30 shrink-0 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 transition-colors">
                                        <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-[20px]">{m.icon}</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{m.label}</h3>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{m.description}</p>
                            </div>
                        ))}
                    </div>
                </SectionFrame>

                {/* ══ CREATOR ══ */}
                <SectionFrame>
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-lg border border-white/80 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                        {/* Top accent stripe */}
                        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600" />
                        <div className="p-8 sm:p-12 text-center flex flex-col items-center gap-6">
                            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-slate-400">Built by</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                The Architect Behind CodeQuest
                            </h2>

                            {/* Avatar placeholder */}
                            <div className="relative">
                                <div className="size-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-4 ring-white dark:ring-surface-dark">
                                    <span className="material-symbols-outlined text-white text-[36px]">person</span>
                                </div>
                                <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-orange-500 ring-2 ring-white dark:ring-surface-dark">
                                    <span className="material-symbols-outlined text-white text-[12px]">code</span>
                                </span>
                            </div>

                            {/* Name */}
                            <div>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">Your Name Here</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Full-Stack Developer · Coding Club Member</p>
                            </div>

                            {/* Bio */}
                            <p className="max-w-lg text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Designed and built CodeQuest as an internal tool to bring structure, competition, and
                                accountability to the club&apos;s project workflow. Crafted with Next.js, Prisma, and a lot of caffeine.
                            </p>

                            {/* Social links */}
                            <div className="flex items-center gap-3">
                                {socials.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200 dark:border-white/10 transition-all duration-150"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </SectionFrame>

                {/* ══ CALL TO ACTION ══ */}
                <SectionFrame>
                    <div className="text-center flex flex-col items-center gap-6 py-8">
                        <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-slate-400">Community</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Join the conversation
                        </h2>
                        <p className="max-w-md text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Got questions, feedback, or want to find a teammate? The club Discord is where quests are discussed,
                            help is given, and legends are made.
                        </p>
                        <a
                            href="#"
                            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                        >
                            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                            </svg>
                            Join Discord Server
                            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                        </a>

                        {/* Back to quests */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                            Back to Quest Board
                        </Link>
                    </div>
                </SectionFrame>

            </main>

            {/* ── Footer ── */}
            <footer className="relative z-10 border-t border-slate-100 dark:border-border-dark py-8 text-center">
                <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">
                    CodeQuest &mdash; Cyber University Coding Club &mdash; Internal Platform
                </p>
            </footer>
        </div>
    )
}
