import { prisma } from '@/lib/db'
import { QuestCard } from '@/components/QuestCard'
import { QuestSearch } from '@/components/QuestSearch'
import { getUserActiveSnatches, getAllUserQuestIds } from '@/actions/quest'
import { LoginToast } from '@/components/LoginToast'
import { Header } from '@/components/Header'
import { Pagination } from '@/components/Pagination'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Explore Quests | CodeQuest',
  description: 'Discover and snatch coding missions on CodeQuest. Filter by Web, AI, and Mobile bounties across all skill tiers.',
}

interface QuestItem {
  id: string
  title: string
  description: string
  maxSnatchers: number
  difficulty?: string | null
  category?: string | null
  points?: number | null
  deadline?: Date | string | null
  _count: { snatches: number }
}

interface PageProps {
  searchParams: Promise<{
    q?: string
    difficulty?: string
    sort?: string
    page?: string
  }>
}

const DEMO_QUESTS: QuestItem[] = [
  {
    id: 'CQ-DEMO-001',
    title: 'Full-Stack Task Runner',
    description: 'Build a background task processing pipeline with webhooks and live worker status dashboard.',
    difficulty: 'Intermediate',
    category: 'Web',
    points: 250,
    maxSnatchers: 3,
    deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
    _count: { snatches: 1 },
  },
  {
    id: 'CQ-DEMO-002',
    title: 'AI Prompt Evaluator',
    description: 'Create an automated LLM benchmark suite evaluating response accuracy, token latencies, and regression suites.',
    difficulty: 'Advanced',
    category: 'AI',
    points: 400,
    maxSnatchers: 2,
    deadline: new Date(Date.now() + 8 * 86400000).toISOString(),
    _count: { snatches: 1 },
  },
  {
    id: 'CQ-DEMO-003',
    title: 'Campus Event Mobile App',
    description: 'Develop a lightweight campus event agenda app with offline QR ticketing and push alerts for club workshops.',
    difficulty: 'Beginner',
    category: 'Mobile',
    points: 150,
    maxSnatchers: 4,
    deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
    _count: { snatches: 2 },
  },
  {
    id: 'CQ-DEMO-004',
    title: 'Realtime Code Collab Canvas',
    description: 'Construct a multiplayer scratchpad using WebSockets and CRDTs for sub-50ms synchronization.',
    difficulty: 'Advanced',
    category: 'Web',
    points: 500,
    maxSnatchers: 2,
    deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
    _count: { snatches: 0 },
  },
  {
    id: 'CQ-DEMO-005',
    title: 'Cyber-Univ Bot Sentinel',
    description: 'Deploy a Discord automation bot capable of triage, role sync, and daily coding challenge broadcasts.',
    difficulty: 'Intermediate',
    category: 'AI',
    points: 300,
    maxSnatchers: 3,
    deadline: new Date(Date.now() + 6 * 86400000).toISOString(),
    _count: { snatches: 1 },
  },
  {
    id: 'CQ-DEMO-006',
    title: 'Micro-Bounty Escrow Engine',
    description: 'Design a points escrow and automated payout workflow with cryptographic audit logging and rate limiting.',
    difficulty: 'Advanced',
    category: 'Web',
    points: 450,
    maxSnatchers: 2,
    deadline: new Date(Date.now() + 12 * 86400000).toISOString(),
    _count: { snatches: 1 },
  },
  {
    id: 'CQ-DEMO-007',
    title: 'Interactive CLI Quest Runner',
    description: 'Create a terminal CLI companion tool for developers to inspect available quests and push submissions.',
    difficulty: 'Beginner',
    category: 'Web',
    points: 120,
    maxSnatchers: 5,
    deadline: new Date(Date.now() + 4 * 86400000).toISOString(),
    _count: { snatches: 2 },
  },
  {
    id: 'CQ-DEMO-008',
    title: 'Student Portfolio Showcase',
    description: 'Build an accessible, responsive personal portfolio showcasing CodeQuest achievements and verified badges.',
    difficulty: 'Beginner',
    category: 'Web',
    points: 100,
    maxSnatchers: 4,
    deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
    _count: { snatches: 0 },
  },
  {
    id: 'CQ-DEMO-009',
    title: 'Mobile Attendance Scanner',
    description: 'Build a cross-platform camera scanner that validates attendance QR tokens with instant offline verification.',
    difficulty: 'Intermediate',
    category: 'Mobile',
    points: 280,
    maxSnatchers: 3,
    deadline: new Date(Date.now() + 9 * 86400000).toISOString(),
    _count: { snatches: 1 },
  },
]

function getDemoQuests(searchParams: { q?: string; difficulty?: string; sort?: string; page?: string }) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1)
  const limit = 9
  let filtered = [...DEMO_QUESTS]

  if (searchParams.q) {
    const q = searchParams.q.toLowerCase().trim()
    filtered = filtered.filter(
      (quest) =>
        quest.title.toLowerCase().includes(q) ||
        quest.description.toLowerCase().includes(q) ||
        quest.category?.toLowerCase().includes(q)
    )
  }

  if (searchParams.difficulty && searchParams.difficulty !== 'All') {
    filtered = filtered.filter(
      (quest) => quest.difficulty?.toLowerCase() === searchParams.difficulty?.toLowerCase()
    )
  }

  if (searchParams.sort === 'Oldest') {
    filtered.reverse()
  } else if (searchParams.sort === 'Points (High-Low)') {
    filtered.sort((a, b) => (b.points || 0) - (a.points || 0))
  } else if (searchParams.sort === 'Points (Low-High)') {
    filtered.sort((a, b) => (a.points || 0) - (b.points || 0))
  }

  const total = filtered.length
  const offset = (page - 1) * limit
  const quests = filtered.slice(offset, offset + limit)

  return { quests, total, page, limit }
}

async function getQuests(
  searchParams: { q?: string; difficulty?: string; sort?: string; page?: string },
  excludedIds: string[]
): Promise<{ quests: QuestItem[]; total: number; page: number; limit: number; error: boolean }> {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1)
  const limit = 9
  const offset = (page - 1) * limit

  try {
    const { Prisma } = await import('@prisma/client')
    let whereClause = Prisma.sql`WHERE 1=1`

    if (searchParams.q) {
      whereClause = Prisma.sql`${whereClause} AND ("title" LIKE ${`%${searchParams.q}%`} OR "description" LIKE ${`%${searchParams.q}%`})`
    }

    if (searchParams.difficulty && searchParams.difficulty !== 'All') {
      whereClause = Prisma.sql`${whereClause} AND "difficulty" = ${searchParams.difficulty}`
    }

    if (excludedIds.length > 0) {
      whereClause = Prisma.sql`${whereClause} AND "id" NOT IN (${Prisma.join(excludedIds)})`
    }

    whereClause = Prisma.sql`${whereClause} AND "status" = 'Active' AND (
      SELECT COUNT(*) FROM "Snatch"
      WHERE "Snatch"."questId" = "Quest"."id"
      AND "Snatch"."status" IN ('ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'COMPLETED', 'ACCEPTED', 'ARCHIVED')
    ) < "maxSnatchers"`

    let orderBy = Prisma.sql`ORDER BY "createdAt" DESC`
    if (searchParams.sort === 'Oldest') {
      orderBy = Prisma.sql`ORDER BY "createdAt" ASC`
    } else if (searchParams.sort === 'Points (High-Low)') {
      orderBy = Prisma.sql`ORDER BY "points" DESC`
    } else if (searchParams.sort === 'Points (Low-High)') {
      orderBy = Prisma.sql`ORDER BY "points" ASC`
    }

    const countQuery = Prisma.sql`SELECT COUNT(*) as count FROM "Quest" ${whereClause}`
    const totalResult = await prisma.$queryRaw<[{ count: bigint | number }]>(countQuery)
    const total = Number(totalResult[0]?.count ?? 0)

    const idsQuery = Prisma.sql`SELECT "id" FROM "Quest" ${whereClause} ${orderBy} LIMIT ${limit} OFFSET ${offset}`
    const validIdsResult = await prisma.$queryRaw<{ id: string }[]>(idsQuery)
    const validIds = validIdsResult.map((r) => r.id)

    if (validIds.length === 0) {
      return { quests: [], total, page, limit, error: false }
    }

    const quests = await prisma.quest.findMany({
      where: {
        id: { in: validIds },
      },
      select: {
        id: true,
        title: true,
        description: true,
        maxSnatchers: true,
        difficulty: true,
        category: true,
        points: true,
        deadline: true,
        _count: {
          select: {
            snatches: {
              where: {
                status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'COMPLETED', 'ACCEPTED'] },
              },
            },
          },
        },
      },
    })

    const questsMap = new Map(quests.map((q) => [q.id, q]))
    const sortedQuests: QuestItem[] = validIds
      .map((id) => questsMap.get(id))
      .filter((q): q is NonNullable<typeof q> => q != null)

    return { quests: sortedQuests, total, page, limit, error: false }
  } catch (error) {
    console.error('getQuests DB fetch notice (fallback used):', error)
    return { quests: [], total: 0, page, limit, error: true }
  }
}

async function getMyActiveQuests(): Promise<QuestItem[]> {
  try {
    const activeIds = await getUserActiveSnatches()
    if (activeIds.length === 0) return []

    const quests = await prisma.quest.findMany({
      where: {
        id: { in: activeIds },
      },
      select: {
        id: true,
        title: true,
        description: true,
        maxSnatchers: true,
        difficulty: true,
        category: true,
        points: true,
        deadline: true,
        _count: {
          select: {
            snatches: {
              where: {
                status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'COMPLETED', 'ACCEPTED'] },
              },
            },
          },
        },
      },
    })
    return quests
  } catch (error) {
    console.error('getMyActiveQuests DB fetch notice (fallback used):', error)
    return []
  }
}

export default async function ExplorePage({ searchParams }: PageProps) {
  const params = await searchParams

  const myActiveQuests = await getMyActiveQuests()
  const allExcludedIds = await getAllUserQuestIds()

  const dbResult = await getQuests(params, allExcludedIds)

  let isFallback = false
  let availableQuests: QuestItem[] = dbResult.quests
  let total = dbResult.total
  let limit = dbResult.limit

  if (dbResult.error) {
    isFallback = true
  } else if (dbResult.quests.length === 0) {
    let hasDbQuests = false
    try {
      const activeCount = await prisma.quest.count({ where: { status: 'Active' } })
      hasDbQuests = activeCount > 0
    } catch {
      hasDbQuests = false
    }

    if (!hasDbQuests) {
      isFallback = true
    }
  }

  if (isFallback) {
    const demoResult = getDemoQuests(params)
    availableQuests = demoResult.quests
    total = demoResult.total
    limit = demoResult.limit
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen flex flex-col relative text-foreground [overflow-x:clip]">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header activePage="explore" />

        <main className="page-container flex-grow py-8 space-y-8">
          <LoginToast />

          {/* Active Missions (if any) */}
          {myActiveQuests.length > 0 && (
            <section
              aria-label="Your active quests"
              className="arcade-panel rounded-card p-6 bg-surface/80"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">
                  bolt
                </span>
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-muted">
                  Active Missions ({myActiveQuests.length})
                </h2>
              </div>
              <div className="flex overflow-x-auto styled-scrollbar items-stretch -mx-4 px-4 pb-3 gap-4">
                {myActiveQuests.map((quest) => (
                  <div key={quest.id} className="min-w-[300px] sm:min-w-[420px] max-w-[560px] flex-none">
                    <QuestCard quest={quest} isSnatched={true} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quest Board Heading & Search Filters */}
          <section id="explore-board" aria-labelledby="quest-board-heading" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-6">
              <div>
                <span className="inline-block text-xs font-mono font-bold uppercase tracking-wider text-primary mb-1">
                  COMMUNITY BOUNTY BOARD
                </span>
                <h1 id="quest-board-heading" className="text-2xl sm:text-4xl font-black uppercase text-foreground">
                  Explore Quests
                </h1>
                <p className="text-sm sm:text-base text-muted mt-1">
                  Claim software bounties, build with your squad, and submit verified code
                </p>
              </div>

              <div className="text-xs font-mono text-muted tabular-nums">
                {total} {total === 1 ? 'quest available' : 'quests available'}
              </div>
            </div>

            <QuestSearch />

            {availableQuests.length === 0 ? (
              <div className="text-center py-16 px-4 border border-dashed border-border rounded-card bg-surface/40">
                <span className="material-symbols-outlined text-[40px] text-muted block mb-3" aria-hidden="true">
                  search_off
                </span>
                <h3 className="text-lg font-bold text-foreground mb-1">No quests match your search</h3>
                <p className="text-sm text-muted max-w-md mx-auto">
                  Try adjusting difficulty filters or clear the search query to see all available coding missions
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} isSnatched={false} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination totalPages={totalPages} />
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
