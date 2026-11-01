import { getLeaderboardStanding } from "@/actions/user";
import Link from "next/link";
import { PointsInfoModal } from "./PointsInfoModal";
import Image from "next/image";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { TrophyIcon, RocketLaunchIcon } from "@/components/ui/ArcadeIcons";

function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

export async function UserStanding() {
    const standing = await getLeaderboardStanding();

    if (!standing) {
        return (
            <div className="lg:col-span-1 min-w-0">
                <div className="bg-surface rounded-card border border-border p-6 text-center space-y-4 shadow-sm">
                    <div className="w-12 h-12 mx-auto rounded-full bg-surface-raised flex items-center justify-center border border-border text-muted">
                        <TrophyIcon className="w-6 h-6 text-muted" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-base">Track Your Rank</h3>
                        <p className="text-sm text-muted mt-1">Sign in to view your leaderboard standing and point progress.</p>
                    </div>
                    <Link
                        href="/login"
                        className="min-h-11 flex items-center justify-center w-full py-2.5 px-4 bg-primary text-primary-foreground font-semibold rounded-button hover:bg-primary-hover transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const ordinal = getOrdinal(standing.rank);

    return (
        <div className="lg:col-span-1 min-w-0">
            <div className="sticky top-24 bg-surface rounded-card border border-border p-6 space-y-6 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2">
                        <TrophyIcon className="w-5 h-5 text-warning" />
                        <h2 className="text-base font-bold text-foreground">Your Standing</h2>
                    </div>
                    <PointsInfoModal />
                </div>

                {/* Rank & Profile Centerpiece */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                        <UserAvatar
                            src={standing.avatar}
                            name={standing.name}
                            size={72}
                            className={`ring-4 ${
                                standing.isTop ? "ring-warning" : "ring-focus/50"
                            }`}
                        />
                        {standing.isTop && (
                            <span
                                className="absolute -top-2 -right-2 p-1.5 bg-warning text-background rounded-full shadow-md"
                                title="Champion"
                                aria-label="Champion"
                            >
                                <TrophyIcon className="w-4 h-4" />
                            </span>
                        )}
                    </div>

                    <div className="font-bold text-foreground text-lg mb-1 truncate max-w-full">
                        {standing.name || "Adventurer"}
                    </div>

                    {/* Rank Badge */}
                    <div className="inline-flex items-baseline gap-1 px-3 py-1 bg-surface-raised border border-border rounded-full font-mono mt-1">
                        <span className="text-xs uppercase font-semibold text-muted tracking-wider">Rank</span>
                        <span className="text-xl font-black text-foreground">#{standing.rank}</span>
                        <span className="text-xs text-muted font-medium">{ordinal}</span>
                    </div>
                </div>

                {/* Current Points Box */}
                <div className="p-4 bg-surface-raised rounded-card border border-border flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                        Total Points
                    </span>
                    <div className="flex items-center gap-2">
                        <Image
                            src="/icon.png"
                            alt="Points icon"
                            width={22}
                            height={22}
                            className="object-contain shrink-0"
                        />
                        <span className="text-2xl font-mono font-black text-foreground tracking-tight">
                            {standing.points.toLocaleString("en-US")}
                        </span>
                    </div>
                </div>

                {/* Progress / Motivation Banner */}
                <div className="bg-surface-raised rounded-card p-4 border border-border">
                    <div className="flex gap-3 items-start">
                        {standing.isTop ? (
                            <>
                                <div className="p-2 bg-warning/15 text-warning rounded-button shrink-0 mt-0.5">
                                    <TrophyIcon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-foreground">You are at the top!</p>
                                    <p className="text-xs text-muted mt-1 leading-relaxed">
                                        You hold 1st place. Defend your throne from challengers!
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-2 bg-focus/15 text-focus rounded-button shrink-0 mt-0.5">
                                    <RocketLaunchIcon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-foreground">Keep climbing!</p>
                                    <p className="text-xs text-muted mt-1 leading-relaxed">
                                        Need{" "}
                                        <span className="font-bold text-focus font-mono">
                                            {standing.pointsToNext.toLocaleString("en-US")} pts
                                        </span>{" "}
                                        to overtake the next rank.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Profile Link Action */}
                <Link
                    href={`/profile/${standing.id}`}
                    className="w-full min-h-11 flex items-center justify-center py-2.5 px-4 rounded-button bg-secondary text-secondary-foreground hover:bg-secondary-hover transition-colors font-semibold text-sm"
                >
                    View Full Profile
                </Link>
            </div>
        </div>
    );
}
