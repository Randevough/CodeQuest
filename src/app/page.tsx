import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { HeroSection } from '@/components/landing/HeroSection'
import { PipelineSection } from '@/components/landing/PipelineSection'
import { QuestShowcaseSection, FALLBACK_TEASERS } from '@/components/landing/QuestShowcaseSection'
import type { QuestTeaser } from '@/components/landing/QuestBubble'
import { SquadSection } from '@/components/landing/SquadSection'
import { LeaderboardSection, FALLBACK_LEADERBOARD_PODIUM } from '@/components/landing/LeaderboardSection'
import type { LeaderboardPodiumUser } from '@/components/landing/LeaderboardSection'
import { OnboardingSection } from '@/components/landing/OnboardingSection'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'CodeQuest: Gamified Coding Platform for Cyber University',
  description:
    'Platform tantangan coding interaktif mahasiswa Cyber University melalui quest software dunia nyata, squad, review kode terverifikasi, dan leaderboard kampus.',
}

async function getLandingData() {
  const [session, questsResult, activeQuestsCount, topUsersResult] = await Promise.allSettled([
    auth(),
    prisma.quest.findMany({
      where: { status: 'Active' },
      take: 3,
      orderBy: { points: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        category: true,
        points: true,
        maxSnatchers: true,
      },
    }),
    prisma.quest.count({
      where: { status: 'Active' },
    }),
    prisma.user.findMany({
      orderBy: [{ points: 'desc' }, { completedQuests: 'desc' }, { createdAt: 'asc' }],
      take: 3,
      select: {
        id: true,
        name: true,
        handle: true,
        points: true,
        avatar: true,
      },
    }),
  ])

  const rawUser = session.status === 'fulfilled' ? session.value?.user : null
  const sessionUser = rawUser
    ? {
        name: rawUser.name ?? null,
        email: rawUser.email ?? null,
        role: rawUser.role ?? undefined,
      }
    : null

  let quests: QuestTeaser[] = FALLBACK_TEASERS
  if (questsResult.status === 'fulfilled') {
    if (questsResult.value && questsResult.value.length > 0) {
      quests = questsResult.value.map((q) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        category: q.category,
        points: q.points,
        maxSnatchers: q.maxSnatchers,
      }))
    } else {
      quests = []
    }
  }

  const totalActiveQuests =
    activeQuestsCount.status === 'fulfilled' && typeof activeQuestsCount.value === 'number'
      ? activeQuestsCount.value
      : 12

  let topUsers: LeaderboardPodiumUser[] = FALLBACK_LEADERBOARD_PODIUM
  if (topUsersResult.status === 'fulfilled') {
    if (topUsersResult.value && topUsersResult.value.length > 0) {
      topUsers = topUsersResult.value.map((u) => {
        const displayName = u.name || 'Anonymous Coder'
        return {
          id: u.id,
          name: displayName,
          points: u.points,
          handle: u.handle || `@${displayName.toLowerCase().replace(/\s+/g, '')}`,
          avatar: u.avatar,
        }
      })
    } else {
      topUsers = []
    }
  }

  return {
    sessionUser,
    quests,
    totalActiveQuests,
    topUsers,
  }
}

export default async function LandingPage() {
  const { sessionUser, quests, totalActiveQuests, topUsers } = await getLandingData()
  const isLoggedIn = !!sessionUser

  return (
    <div className="soft-arcade min-h-screen flex flex-col bg-[#141925] text-[#FFF3DE] [overflow-x:clip]">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow space-y-12 sm:space-y-16 py-6 sm:py-10">
          {/* Section 1: Hero */}
          <HeroSection sessionUser={sessionUser} totalActiveQuests={totalActiveQuests} />

          {/* Section 2: Pipeline */}
          <PipelineSection />

          {/* Section 3: Quest Showcase */}
          <QuestShowcaseSection quests={quests} />

          {/* Section 4: Squads */}
          <SquadSection />

          {/* Section 5: Leaderboard */}
          <LeaderboardSection topUsers={topUsers} />

          {/* Section 6: Onboarding */}
          <OnboardingSection isLoggedIn={isLoggedIn} userName={sessionUser?.name} />
        </main>

        {/* Footer */}
        <footer className="border-t border-[#2E3A52] bg-[#141925] py-8 text-sm text-[#8A94A6]">
          <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="/icon-big.png" alt="" width={24} height={24} />
              <span className="font-display text-base text-[#FFF3DE]">CodeQuest</span>
              <span className="text-xs text-[#8A94A6] ml-2">Cyber University Coding Club</span>
            </div>
            <div className="flex items-center gap-6 text-xs font-medium">
              <Link href="/explore" className="inline-flex items-center min-h-[44px] py-2.5 px-2 hover:text-[#FFAE58] transition-colors">
                Explore Quests
              </Link>
              <Link href="/leaderboard" className="inline-flex items-center min-h-[44px] py-2.5 px-2 hover:text-[#FFAE58] transition-colors">
                Leaderboard
              </Link>
              <Link href="/about" className="inline-flex items-center min-h-[44px] py-2.5 px-2 hover:text-[#FFAE58] transition-colors">
                About
              </Link>
              <Link href="/login" className="inline-flex items-center min-h-[44px] py-2.5 px-2 hover:text-[#FFAE58] transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
