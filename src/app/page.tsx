import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { SiteFooter } from '@/components/SiteFooter'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { HeroSection } from '@/components/landing/HeroSection'
import { PipelineSection } from '@/components/landing/PipelineSection'
import { QuestShowcaseSection } from '@/components/landing/QuestShowcaseSection'
import type { QuestTeaser } from '@/components/landing/QuestBubble'
import { SquadSection } from '@/components/landing/SquadSection'
import { LeaderboardSection } from '@/components/landing/LeaderboardSection'
import type { LeaderboardPodiumUser } from '@/components/landing/LeaderboardSection'
import { JoinSection } from '@/components/landing/JoinSection'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'CodeQuest: the quest board of UKM Coding Cyber University',
  description:
    'Take a real project quest, build it in your own Git repository, and get it reviewed by club staff. Approved quests earn points and badges.',
}

async function getLandingData() {
  const [session, questsResult, topUsersResult] = await Promise.allSettled([
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
    prisma.user.findMany({
      orderBy: [{ points: 'desc' }, { completedQuests: 'desc' }, { createdAt: 'asc' }],
      where: { points: { gt: 0 } },
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

  const quests: QuestTeaser[] | null =
    questsResult.status === 'fulfilled'
      ? questsResult.value.map((q) => ({
          id: q.id,
          title: q.title,
          description: q.description,
          difficulty: q.difficulty,
          category: q.category,
          points: q.points,
          maxSnatchers: q.maxSnatchers,
        }))
      : null

  const topUsers: LeaderboardPodiumUser[] | null =
    topUsersResult.status === 'fulfilled'
      ? topUsersResult.value.map((u) => {
          const displayName = u.name || 'Anonymous coder'
          return {
            id: u.id,
            name: displayName,
            points: u.points,
            handle: u.handle || undefined,
            avatar: u.avatar,
          }
        })
      : null

  return { sessionUser, quests, topUsers }
}

export default async function LandingPage() {
  const { sessionUser, quests, topUsers } = await getLandingData()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground [overflow-x:clip]">
      <Header />

      <main className="flex-grow space-y-20 py-8 sm:space-y-28 sm:py-12">
        <HeroSection sessionUser={sessionUser} />
        <PipelineSection />
        <QuestShowcaseSection quests={quests} />
        <SquadSection />
        <LeaderboardSection topUsers={topUsers} />
        <JoinSection isLoggedIn={!!sessionUser} userName={sessionUser?.name} />
      </main>

      <SiteFooter />
    </div>
  )
}
