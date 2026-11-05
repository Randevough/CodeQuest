'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { PlayerPebble } from './PlayerPebble'

export interface LeaderboardPodiumUser {
  id: string
  name: string
  points: number
  handle?: string
  avatar?: string | null
}

export const FALLBACK_LEADERBOARD_PODIUM: LeaderboardPodiumUser[] = [
  {
    id: 'user-rank-1',
    name: 'Alex Dev',
    points: 2150,
    handle: '@alexdev',
  },
  {
    id: 'user-rank-2',
    name: 'Budi Runner',
    points: 1840,
    handle: '@budirunner',
  },
  {
    id: 'user-rank-3',
    name: 'Citra Code',
    points: 1620,
    handle: '@citracode',
  },
]

export const BADGE_COLLECTION_14 = [
  { slug: 'novice', name: 'Novice', desc: '1 Quest', requirement: 'Selesaikan 1 quest pertama untuk membuka lencana ini', icon: '/badges/novice.svg' },
  { slug: 'apprentice', name: 'Apprentice', desc: '5 Quests', requirement: 'Selesaikan 5 quest terverifikasi untuk membuka lencana ini', icon: '/badges/apprentice.svg' },
  { slug: 'journeyman', name: 'Journeyman', desc: '10 Quests', requirement: 'Selesaikan 10 quest terverifikasi untuk membuka lencana ini', icon: '/badges/journeyman.svg' },
  { slug: 'expert', name: 'Expert', desc: '25 Quests', requirement: 'Selesaikan 25 quest terverifikasi untuk membuka lencana ini', icon: '/badges/expert.svg' },
  { slug: 'master', name: 'Master', desc: '50 Quests', requirement: 'Selesaikan 50 quest terverifikasi untuk membuka lencana ini', icon: '/badges/master.svg' },
  { slug: 'point-collector', name: 'Collector', desc: '100 Pts', requirement: 'Kumpulkan total 100 poin XP untuk membuka lencana ini', icon: '/badges/point-collector.svg' },
  { slug: 'high-scorer', name: 'High Scorer', desc: '500 Pts', requirement: 'Kumpulkan total 500 poin XP untuk membuka lencana ini', icon: '/badges/high-scorer.svg' },
  { slug: 'score-leader', name: 'Score Leader', desc: '1K Pts', requirement: 'Kumpulkan total 1.000 poin XP untuk membuka lencana ini', icon: '/badges/score-leader.svg' },
  { slug: 'legend', name: 'Legend', desc: '5K Pts', requirement: 'Kumpulkan total 5.000 poin XP untuk membuka lencana ini', icon: '/badges/legend.svg' },
  { slug: 'web-weaver', name: 'Web Weaver', desc: '5 Web', requirement: 'Selesaikan 5 quest Web untuk membuka lencana ini', icon: '/badges/web-weaver.svg' },
  { slug: 'ai-architect', name: 'AI Architect', desc: '5 AI', requirement: 'Selesaikan 5 quest AI & Machine Learning untuk membuka lencana ini', icon: '/badges/ai-architect.svg' },
  { slug: 'mobile-maestro', name: 'Mobile Maestro', desc: '5 Mobile', requirement: 'Selesaikan 5 quest Mobile untuk membuka lencana ini', icon: '/badges/mobile-maestro.svg' },
  { slug: 'challenger', name: 'Challenger', desc: 'Intermediate', requirement: 'Selesaikan quest tingkat menengah untuk membuka lencana ini', icon: '/badges/challenger.svg' },
  { slug: 'conqueror', name: 'Conqueror', desc: 'Advanced', requirement: 'Taklukkan quest tingkat mahir untuk membuka lencana ini', icon: '/badges/conqueror.svg' },
]

export interface LeaderboardSectionProps {
  topUsers?: LeaderboardPodiumUser[]
}

export function LeaderboardSection({ topUsers }: LeaderboardSectionProps) {
  const isExplicitEmpty = topUsers !== undefined && topUsers.length === 0
  const users = isExplicitEmpty ? [] : topUsers && topUsers.length > 0 ? topUsers : FALLBACK_LEADERBOARD_PODIUM
  const rank1 = users[0] || FALLBACK_LEADERBOARD_PODIUM[0]
  const rank2 = users[1] || FALLBACK_LEADERBOARD_PODIUM[1]
  const rank3 = users[2] || FALLBACK_LEADERBOARD_PODIUM[2]
  const [activeBadgeSlug, setActiveBadgeSlug] = useState<string | null>(null)

  const activeBadge = BADGE_COLLECTION_14.find((b) => b.slug === activeBadgeSlug)

  const maxPoints = Math.max(rank1.points, 1)
  const rank2Progress = Math.min(100, Math.max(5, Math.round((rank2.points / maxPoints) * 100)))
  const rank3Progress = Math.min(100, Math.max(5, Math.round((rank3.points / maxPoints) * 100)))

  return (
    <section className="soft-arcade page-container py-12" aria-labelledby="leaderboard-section-title">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Player Pebble + Leaderboard List Top 3 */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-[#FFAE58]">
              Papan Peringkat Musim 1 • Top Pengembang
            </span>
            <h2
              id="leaderboard-section-title"
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FFF3DE] tracking-tight leading-snug"
            >
              Papan Peringkat Kampus
            </h2>
            <p className="text-sm sm:text-base text-[#C2C7D0] leading-relaxed">
              Musim 1 sedang berlangsung. Skor dihitung dari PR repo yang terverifikasi.
            </p>
          </div>

          {/* Profile Bar Example */}
          {!isExplicitEmpty && (
            <div className="pt-2">
              <PlayerPebble
                name={rank1.name}
                level={4}
                points={rank1.points}
                handle={rank1.handle || '@alexdev'}
              />
            </div>
          )}

          {isExplicitEmpty ? (
            <div
              data-testid="leaderboard-empty-state"
              className="w-full rounded-2xl bg-[#20283A] border-2 border-[#2E3A52] p-8 text-center text-[#C2C7D0] shadow-[0_4px_0_#141925]"
            >
              <p className="text-base font-bold text-[#FFF3DE] mb-1 font-display">
                Musim baru: jadilah yang pertama merebut poin
              </p>
              <p className="text-xs text-[#C2C7D0]">
                Belum ada submission poin musim ini. Selesaikan quest untuk menempati podium papan peringkat.
              </p>
            </div>
          ) : (
            /* Soft Arcade Podium Cards */
            <div className="space-y-3 pt-2" role="list" aria-label="Top 3 Leaderboard">
              {/* Rank 1: Solid Warm Amber card, Ink Navy text (#141925 font-bold) */}
              <div
                role="listitem"
                data-testid="podium-rank-1"
                aria-label={`Peringkat 1: ${rank1.name}, ${rank1.points.toLocaleString('en-US')} Poin Kontribusi`}
                className="w-full rounded-2xl bg-[#FFAE58] p-4 sm:p-5 border-2 border-[#C27A29] shadow-[0_4px_0_#C27A29]"
              >
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      data-testid="rank-badge-1"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black bg-[#141925] text-[#FFAE58] shrink-0 shadow-sm"
                    >
                      <span>👑</span> Juara 1
                    </span>
                    <div className="truncate">
                      <span className="text-base sm:text-lg font-bold text-[#141925] truncate">
                        {rank1.name}
                      </span>
                      {rank1.handle && (
                        <span className="text-xs font-mono font-bold text-[#141925] ml-2 hidden sm:inline">
                          {rank1.handle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[#141925] text-sm" aria-hidden="true">✦</span>
                    <span className="font-mono font-black text-sm sm:text-base text-[#141925]">
                      {rank1.points.toLocaleString('en-US')} PTS
                    </span>
                  </div>
                </div>

                {/* Visual XP Bar (Rank 1: 100%) */}
                <div className="w-full">
                  <div
                    data-testid="xp-bar-rank-1"
                    aria-label="Progress XP: 100%"
                    className="w-full h-2 rounded-full bg-[#141925]/20 overflow-hidden"
                  >
                    <div
                      className="h-full rounded-full bg-[#141925] transition-all duration-300"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

            {/* Rank 2: Dark Slate with silver accent */}
            <div
              role="listitem"
              data-testid="podium-rank-2"
              aria-label={`Peringkat 2: ${rank2.name}, ${rank2.points.toLocaleString('en-US')} Poin Kontribusi`}
              className="w-full rounded-2xl bg-[#20283A] p-4 sm:p-5 border-2 border-[#C2C7D0]/40 shadow-[0_4px_0_rgba(194,199,208,0.2)]"
            >
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    data-testid="rank-badge-2"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#C2C7D0] text-[#141925] shrink-0 shadow-sm"
                  >
                    <span>🥈</span> Peringkat 2
                  </span>
                  <div className="truncate">
                    <span className="text-base sm:text-lg font-bold text-[#FFF3DE] truncate">
                      {rank2.name}
                    </span>
                    {rank2.handle && (
                      <span className="text-xs font-mono text-[#8A94A6] ml-2 hidden sm:inline">
                        {rank2.handle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className="font-mono font-bold text-sm sm:text-base text-[#C2C7D0]">
                    {rank2.points.toLocaleString('en-US')} PTS
                  </span>
                </div>
              </div>

              {/* Visual XP Bar relative to Rank 1 */}
              <div className="w-full">
                <div
                  data-testid="xp-bar-rank-2"
                  aria-label={`Progress XP: ${rank2Progress}%`}
                  className="w-full h-2 rounded-full bg-[#141925] overflow-hidden"
                >
                  <div
                    className="h-full rounded-full bg-[#C2C7D0] transition-all duration-300"
                    style={{ width: `${rank2Progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Rank 3: Dark Slate with bronze accent */}
            <div
              role="listitem"
              data-testid="podium-rank-3"
              aria-label={`Peringkat 3: ${rank3.name}, ${rank3.points.toLocaleString('en-US')} Poin Kontribusi`}
              className="w-full rounded-2xl bg-[#20283A] p-4 sm:p-5 border-2 border-[#CD7F32]/40 shadow-[0_4px_0_rgba(205,127,50,0.2)]"
            >
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    data-testid="rank-badge-3"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#CD7F32] text-[#FFF3DE] shrink-0 shadow-sm"
                  >
                    <span>🥉</span> Peringkat 3
                  </span>
                  <div className="truncate">
                    <span className="text-base sm:text-lg font-bold text-[#FFF3DE] truncate">
                      {rank3.name}
                    </span>
                    {rank3.handle && (
                      <span className="text-xs font-mono text-[#8A94A6] ml-2 hidden sm:inline">
                        {rank3.handle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className="font-mono font-bold text-sm sm:text-base text-[#C2C7D0]">
                    {rank3.points.toLocaleString('en-US')} PTS
                  </span>
                </div>
              </div>

              {/* Visual XP Bar relative to Rank 1 */}
              <div className="w-full">
                <div
                  data-testid="xp-bar-rank-3"
                  aria-label={`Progress XP: ${rank3Progress}%`}
                  className="w-full h-2 rounded-full bg-[#141925] overflow-hidden"
                >
                  <div
                    className="h-full rounded-full bg-[#CD7F32] transition-all duration-300"
                    style={{ width: `${rank3Progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

          {/* Button: "Lihat Seluruh Peringkat" full pill with bevel shadow */}
          <div className="pt-2">
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-sm bg-[#FFAE58] text-[#141925] border-2 border-[#C27A29] shadow-[0_4px_0_#C27A29] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#C27A29] active:translate-y-0.5 active:shadow-[0_1px_0_#C27A29] transition-all font-mono uppercase tracking-wider"
            >
              <span>Lihat Seluruh Peringkat</span>
            </Link>
          </div>
        </div>

        {/* Kolom Kanan: Showcase Mini Grid of 14 Digital Badge Skill Icons */}
        <div className="lg:col-span-5 rounded-[24px] bg-[#20283A] border-2 border-[#2E3A52] p-5 sm:p-6 shadow-[0_4px_0_#182030] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2E3A52]">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#FFAE58]" aria-hidden="true" />
              <h3 className="text-sm font-bold text-[#FFF3DE]">14 Lencana Keahlian Terverifikasi</h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#141925] text-[#FFAE58] border border-[#2E3A52]">
              TERVERIFIKASI
            </span>
          </div>

          <p className="text-xs text-[#C2C7D0] leading-relaxed">
            Dapatkan rekognisi otomatis berbasis milestone progres, akumulasi poin, spesialisasi domain (Web, AI, Mobile), dan taklukkan quest berbobot tinggi.
          </p>

          {/* Active Badge Requirement Callout */}
          <div
            data-testid="badge-requirement-box"
            className="rounded-xl bg-[#141925] border border-[#FFAE58]/40 p-3 min-h-[52px] flex items-center justify-between gap-2 transition-all"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[#FFAE58] text-sm shrink-0" aria-hidden="true">✦</span>
              <p className="text-xs text-[#FFF3DE] leading-snug truncate sm:whitespace-normal">
                {activeBadge
                  ? activeBadge.requirement
                  : 'Klik atau sorot lencana untuk melihat syarat pembukaan.'}
              </p>
            </div>
            {activeBadge && (
              <span className="text-[10px] font-mono font-bold text-[#FFAE58] px-2 py-0.5 rounded bg-[#20283A] shrink-0 border border-[#2E3A52]">
                {activeBadge.desc}
              </span>
            )}
          </div>

          {/* Mini Grid 14 Badges */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1"
            role="list"
            aria-label="Koleksi 14 Lencana Keahlian"
          >
            {BADGE_COLLECTION_14.map((badge) => {
              const isSelected = activeBadgeSlug === badge.slug
              return (
                <button
                  type="button"
                  key={badge.slug}
                  onClick={() => setActiveBadgeSlug(isSelected ? null : badge.slug)}
                  onMouseEnter={() => setActiveBadgeSlug(badge.slug)}
                  aria-pressed={isSelected}
                  aria-label={`${badge.name}: ${badge.desc}`}
                  className={`group relative flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAE58] ${
                    isSelected
                      ? 'bg-[#2B354D] border-[#FFAE58] shadow-[0_0_12px_rgba(255,174,88,0.25)]'
                      : 'bg-[#141925] border-[#2E3A52] hover:border-[#FFAE58]/60 hover:bg-[#182030]'
                  }`}
                >
                  <div className="w-10 h-10 relative mb-1.5 flex items-center justify-center">
                    <Image
                      src={badge.icon}
                      alt=""
                      aria-hidden="true"
                      width={36}
                      height={36}
                      className="object-contain group-hover:scale-110 transition-transform"
                      unoptimized
                    />
                  </div>
                  <div className="text-[11px] font-bold text-[#FFF3DE] truncate w-full">
                    {badge.name}
                  </div>
                  <div className="text-[10px] font-mono text-[#8A94A6] truncate w-full">
                    {badge.desc}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="pt-3 border-t border-[#2E3A52] text-center">
            <span className="text-[11px] font-mono text-[#8A94A6]">
              ✦ Sematkan hingga 3 lencana teratas di kartu profil publikmu.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
