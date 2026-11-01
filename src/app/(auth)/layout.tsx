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
                            <span className="material-symbols-outlined text-[14px] text-primary" aria-hidden="true">
                                sports_esports
                            </span>
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
                                <span className="material-symbols-outlined text-[16px] text-focus" aria-hidden="true">
                                    groups
                                </span>
                                Squad: 2/3 Devs
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-warning" aria-hidden="true">
                                    schedule
                                </span>
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
                            <span className="material-symbols-outlined text-[20px] text-primary block mb-1" aria-hidden="true">
                                verified
                            </span>
                            <span className="text-xs font-bold block text-foreground">Real Tasks</span>
                            <span className="text-[11px] text-muted block">Campus software</span>
                        </div>
                        <div className="p-3 rounded-button border border-border bg-surface/60">
                            <span className="material-symbols-outlined text-[20px] text-focus block mb-1" aria-hidden="true">
                                group_add
                            </span>
                            <span className="text-xs font-bold block text-foreground">Dev Squads</span>
                            <span className="text-[11px] text-muted block">Peer review</span>
                        </div>
                        <div className="p-3 rounded-button border border-border bg-surface/60">
                            <span className="material-symbols-outlined text-[20px] text-warning block mb-1" aria-hidden="true">
                                military_tech
                            </span>
                            <span className="text-xs font-bold block text-foreground">Leaderboard</span>
                            <span className="text-[11px] text-muted block">Earn EXP ranks</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
