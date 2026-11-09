'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserAvatar } from '@/components/ui/UserAvatar'

export interface LeaderboardPodiumUser {
  id: string
  name: string
  points: number
  handle?: string
  avatar?: string | null
}

export interface BadgeInfo {
  slug: string
  name: string
  requirement: string
  icon: string
}

/** Thresholds mirror `checkBadges` in src/lib/badges.ts. */
export const BADGE_COLLECTION: BadgeInfo[] = [
  { slug: 'novice', name: 'Novice', requirement: 'Complete 1 quest.', icon: '/badges/novice.svg' },
  { slug: 'apprentice', name: 'Apprentice', requirement: 'Complete 5 quests.', icon: '/badges/apprentice.svg' },
  { slug: 'journeyman', name: 'Journeyman', requirement: 'Complete 10 quests.', icon: '/badges/journeyman.svg' },
  { slug: 'expert', name: 'Expert', requirement: 'Complete 25 quests.', icon: '/badges/expert.svg' },
  { slug: 'master', name: 'Master', requirement: 'Complete 50 quests.', icon: '/badges/master.svg' },
  { slug: 'point-collector', name: 'Collector', requirement: 'Reach 100 points.', icon: '/badges/point-collector.svg' },
  { slug: 'high-scorer', name: 'High Scorer', requirement: 'Reach 500 points.', icon: '/badges/high-scorer.svg' },
  { slug: 'score-leader', name: 'Score Leader', requirement: 'Reach 1,000 points.', icon: '/badges/score-leader.svg' },
  { slug: 'legend', name: 'Legend', requirement: 'Reach 5,000 points.', icon: '/badges/legend.svg' },
  { slug: 'web-weaver', name: 'Web Weaver', requirement: 'Get 5 Web quests approved.', icon: '/badges/web-weaver.svg' },
  { slug: 'ai-architect', name: 'AI Architect', requirement: 'Get 5 AI quests approved.', icon: '/badges/ai-architect.svg' },
  { slug: 'mobile-maestro', name: 'Mobile Maestro', requirement: 'Get 5 Mobile quests approved.', icon: '/badges/mobile-maestro.svg' },
  { slug: 'challenger', name: 'Challenger', requirement: 'Get an Intermediate quest approved.', icon: '/badges/challenger.svg' },
  { slug: 'conqueror', name: 'Conqueror', requirement: 'Get an Advanced quest approved.', icon: '/badges/conqueror.svg' },
]

const RANK_STYLES = [
  'border-primary-edge bg-primary text-primary-foreground',
  'border-control-border bg-secondary text-secondary-foreground',
  'border-primary-edge/60 bg-surface-raised text-foreground',
]

export interface LeaderboardSectionProps {
  /** Live top players. `null` means the ranking could not be loaded. */
  topUsers: LeaderboardPodiumUser[] | null
}

export function LeaderboardSection({ topUsers }: LeaderboardSectionProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const activeBadge = BADGE_COLLECTION.find((badge) => badge.slug === activeSlug)
  const leaderPoints = Math.max(topUsers?.[0]?.points ?? 0, 1)

  return (
    <section aria-labelledby="leaderboard-section-title" className="page-container">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-6 lg:col-span-6">
          <div className="space-y-2">
            <h2 id="leaderboard-section-title">See who is leading</h2>
            <p className="max-w-prose text-muted">
              Players are ranked by points. Points are added when club staff approve a quest.
            </p>
          </div>

          {topUsers === null ? (
            <div data-testid="leaderboard-unavailable" className="panel p-6">
              <p className="mb-1 font-bold">The ranking could not be loaded</p>
              <p className="text-sm text-muted">Try again in a moment, or open the full leaderboard.</p>
            </div>
          ) : topUsers.length === 0 ? (
            <div data-testid="leaderboard-empty-state" className="panel p-6">
              <p className="mb-1 font-bold">No points on the board yet</p>
              <p className="text-sm text-muted">The first approved quest takes the top spot.</p>
            </div>
          ) : (
            <ol aria-label="Top players" className="space-y-3">
              {topUsers.map((user, index) => (
                <li
                  key={user.id}
                  data-testid={`rank-row-${index + 1}`}
                  className="panel flex items-center gap-4 p-4"
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 font-display text-base tabular-nums ${
                      RANK_STYLES[index] ?? RANK_STYLES[2]
                    }`}
                  >
                    <span className="sr-only">Rank </span>
                    {index + 1}
                  </span>
                  <UserAvatar src={user.avatar} name={user.name} size={40} className="shrink-0" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{user.name}</p>
                        {user.handle && <p className="truncate font-mono text-xs text-muted">{user.handle}</p>}
                      </div>
                      <span className="chip chip-amber shrink-0 font-mono tabular-nums">
                        {user.points.toLocaleString('en-US')} pts
                      </span>
                    </div>
                    <div className="meter" aria-hidden="true" style={{ height: 10 }}>
                      <div
                        className="meter-fill"
                        style={{ width: `${Math.max(4, Math.round((user.points / leaderPoints) * 100))}%` }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}

          <Link href="/leaderboard" className="btn btn-secondary">
            Open the full leaderboard
          </Link>
        </div>

        <div className="space-y-6 lg:col-span-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{BADGE_COLLECTION.length} badges to unlock</h3>
            <p className="max-w-prose text-muted">Select a badge to see how to earn it.</p>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5" role="group" aria-label="Badges">
            {BADGE_COLLECTION.map((badge) => {
              const isActive = badge.slug === activeSlug
              return (
                <button
                  key={badge.slug}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveSlug(isActive ? null : badge.slug)}
                  className={`flex min-h-[4.5rem] flex-col items-center justify-center gap-1.5 rounded-input border-2 p-2 text-center transition-colors ${
                    isActive
                      ? 'border-primary bg-surface-raised'
                      : 'border-border bg-surface hover:border-control-border'
                  }`}
                >
                  <Image src={badge.icon} alt="" width={36} height={36} className="size-9" />
                  <span className="text-[11px] font-semibold leading-tight">{badge.name}</span>
                </button>
              )
            })}
          </div>

          <div
            data-testid="badge-requirement-box"
            aria-live="polite"
            className="panel-inset min-h-[3.5rem] p-4 text-sm"
          >
            {activeBadge ? (
              <p>
                <span className="font-bold">{activeBadge.name}: </span>
                {activeBadge.requirement}
              </p>
            ) : (
              <p className="text-muted">No badge selected.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
