import { getLeaderboardStanding } from "@/actions/user";
import Link from "next/link";
import { PointsInfoModal } from "./PointsInfoModal";
import Image from "next/image";

export async function UserStanding() {
    const standing = await getLeaderboardStanding();

    if (!standing) {
        return (
            <div className="lg:col-span-1 min-w-0 space-y-6">
                <div className="bg-surface dark:bg-surface-dark rounded-card break-words border border-border p-6 text-center">
                    <p className="text-muted">Sign in to see your standing</p>
                    <Link href="/login" className="min-h-11 mt-4 block w-full py-2 bg-primary rounded-lg text-primary-foreground">Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-1 min-w-0 space-y-6">
            <div className="sticky top-24 bg-surface dark:bg-surface-dark rounded-card break-words border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-foreground">Your Standing</h2>
                    <PointsInfoModal />
                </div>
                <div className="flex flex-col items-center mb-6">
                    <div className="size-16 rounded-full border-2 border-border p-0.5 mb-3 bg-surface flex items-center justify-center overflow-hidden">
                        {standing.avatar ? (
                            <Image width={64} height={64} className="w-full h-full object-cover rounded-full" src={standing.avatar} alt="Your Avatar" />
                        ) : (
                            <div className="w-full h-full bg-surface flex items-center justify-center text-muted font-bold">
                                {standing.name?.[0] || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="text-4xl font-black text-foreground font-mono tracking-tight">
                        {standing.rank}<span className="text-lg align-top text-muted">
                            {['st', 'nd', 'rd'][((standing.rank + 90) % 100 - 10) % 10 - 1] || 'th'}
                        </span>
                    </div>
                    <div className="text-sm text-muted font-medium">Leaderboard Rank</div>
                </div>
                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-surface rounded-card break-words border border-border">
                        <span className="text-sm font-bold text-foreground uppercase tracking-wider mb-1">Current Points</span>
                        <div className="flex items-center gap-2 text-foreground">
                            <Image src="/icon.png" alt="Points" width={24} height={24} className="object-contain" />
                            <span className="text-2xl font-mono font-bold">{standing.points.toLocaleString('en-US')}</span>
                        </div>
                    </div>

                    <div className="bg-surface rounded-lg p-4 border border-border">
                        <div className="flex gap-3">
                            {standing.isTop ? (
                                <>
                                    <span aria-hidden="true" className="material-symbols-outlined text-muted text-xl mt-0.5">emoji_events</span>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">You are at the top!</p>
                                        <div className="flex items-center gap-1 text-sm text-muted mt-1">
                                            <span>Defend your throne</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span aria-hidden="true" className="material-symbols-outlined text-muted text-xl mt-0.5">rocket_launch</span>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Keep climbing!</p>
                                        <p className="text-sm text-muted mt-1 leading-relaxed">
                                            You need <span className="font-bold text-foreground">{standing.pointsToNext.toLocaleString('en-US')} pts</span> to overtake the next rank.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <Link href={`/profile/${standing.id}`} className="w-full button-secondary">
                        View Full Profile
                    </Link>
                </div>
            </div>
        </div>
    )
}
