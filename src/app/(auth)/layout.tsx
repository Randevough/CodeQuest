import "../custom-auth.css";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
            {/* Left Column: Form & Controls */}
            <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 relative z-10">
                <div>
                    <header className="flex items-center justify-between gap-4 mb-8 sm:mb-12">
                        <Link href="/" className="flex min-h-11 items-center gap-2 font-display text-xl tracking-tight">
                            <Image src="/icon-big.png" alt="" width={32} height={32} priority />
                            CodeQuest
                        </Link>
                        <ThemeToggle />
                    </header>

                    <main className="max-w-md mx-auto lg:mx-0 w-full">
                        <div className="auth-panel rounded-card border border-border bg-surface p-6 sm:p-8 shadow-sm">
                            {children}
                        </div>
                    </main>
                </div>

                <footer className="mt-8 pt-6 border-t border-border/50 text-xs text-muted text-center lg:text-left">
                    Cyber University Coding Club • Secure Campus Authentication
                </footer>
            </div>

            {/* Right Column: Arcade Visual Composition (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-center items-center p-8 lg:p-12 xl:p-16 bg-surface/40 border-l border-border relative overflow-hidden">
                {/* Background Grid Pattern */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-40 arcade-grid-bg"
                    aria-hidden="true"
                />

                {/* Ambient glow accent */}
                <div
                    className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none"
                    aria-hidden="true"
                />
                <div
                    className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
                    aria-hidden="true"
                />

                <div className="relative z-10 w-full max-w-lg space-y-6">
                    {/* Mission Terminal Header */}
                    <div className="flex items-center justify-between px-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-primary/15 text-foreground border border-primary/40">
                            <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S20.17 9 21 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                            </svg>
                            GUILD DISPATCH ONLINE
                        </div>
                        <span className="text-xs font-mono text-muted tracking-wider">PORTAL v2.4</span>
                    </div>

                    {/* Layered Arcade Quest Card Preview */}
                    <div className="arcade-panel rounded-card p-6 bg-surface relative">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-secondary/30 text-foreground border border-secondary/50 mb-2">
                                    ACTIVE BOUNTY
                                </span>
                                <h3 className="text-xl font-bold text-foreground">Full-Stack Task Runner</h3>
                                <p className="text-sm text-muted mt-1">Build background workers with live pipeline monitoring</p>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="text-2xl font-black text-primary font-mono tabular-nums">+250</span>
                                <span className="block text-[11px] font-mono uppercase text-muted tracking-wider">POINTS</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono text-muted border-t border-border pt-3">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-focus" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Squad: 2/3 Devs
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                4 Days Left
                            </span>
                            <span className="ml-auto inline-block text-[10px] uppercase font-bold text-success">
                                OPEN TO SNATCH
                            </span>
                        </div>
                    </div>

                    {/* Developer Terminal Snippet */}
                    <div className="rounded-card border border-border bg-surface-raised overflow-hidden shadow-panel">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-danger/80" />
                                <div className="w-2.5 h-2.5 rounded-full bg-warning/80" />
                                <div className="w-2.5 h-2.5 rounded-full bg-success/80" />
                                <span className="ml-2 text-xs font-mono text-muted">codequest-cli — zsh</span>
                            </div>
                            <span className="text-[11px] font-mono text-muted">utf-8</span>
                        </div>
                        <div className="p-4 font-mono text-xs leading-relaxed text-muted space-y-1.5">
                            <p className="text-foreground">
                                <span className="text-primary">$</span> codequest snatch --quest CQ-042
                            </p>
                            <p className="text-focus">[OK] Squad assembled: @alex, @jordan, @you</p>
                            <p className="text-muted">[SYNC] Pull request linked to quest repository</p>
                            <p className="text-foreground">
                                <span className="text-primary">$</span> codequest verify --status
                            </p>
                            <p className="text-success">[APPROVED] 250 PTS awarded • Badge Unlocked: Guild Pioneer</p>
                        </div>
                    </div>

                    {/* Feature highlights bar */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 rounded-button border border-border bg-surface/60">
                            <svg className="w-5 h-5 text-primary mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs font-bold block text-foreground">Real Tasks</span>
                            <span className="text-[11px] text-muted block">Campus software</span>
                        </div>
                        <div className="p-3 rounded-button border border-border bg-surface/60">
                            <svg className="w-5 h-5 text-focus mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <span className="text-xs font-bold block text-foreground">Dev Squads</span>
                            <span className="text-[11px] text-muted block">Peer review</span>
                        </div>
                        <div className="p-3 rounded-button border border-border bg-surface/60">
                            <svg className="w-5 h-5 text-warning mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M19 4h-3V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1H5a2 2 0 0 0-2 2v2a5 5 0 0 0 4.5 4.96A6 6 0 0 0 11 16.91V19H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3v-2.09a6 6 0 0 0 3.5-2.95A5 5 0 0 0 21 8V6a2 2 0 0 0-2-2zM5 8V6h3v4.61A3.01 3.01 0 0 1 5 8zm14 0a3.01 3.01 0 0 1-3 2.61V6h3v2z" />
                            </svg>
                            <span className="text-xs font-bold block text-foreground">Leaderboard</span>
                            <span className="text-[11px] text-muted block">Earn EXP ranks</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
