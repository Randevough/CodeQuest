import Link from 'next/link'
import { prisma } from '@/lib/db'
import { QuestCard } from '@/components/QuestCard'
import { QuestSearch } from '@/components/QuestSearch'
import { getUserActiveSnatches, getAllUserQuestIds } from '@/actions/quest'
import { LoginToast } from '@/components/LoginToast'
import { Header } from '@/components/Header'
import { Pagination } from '@/components/Pagination'

export const dynamic = 'force-dynamic'

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

interface PlatformStats {
  totalQuests: number
  pointsAvailable: number
  clubMembers: number
  activeSnatches: number
}

interface PageProps {
  searchParams: Promise<{
    q?: string
    difficulty?: string
    sort?: string
    page?: string
  }>
}

// Fallback seed data for safe preview mode (REV-7)
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
  {
    id: 'CQ-DEMO-010',
    title: 'Smart Contract Bounty Vault',
    description: 'Implement a Solidity escrow vault for verification challenges with automated payout upon test suite clearance.',
    difficulty: 'Advanced',
    category: 'Web',
    points: 480,
    maxSnatchers: 2,
    deadline: new Date(Date.now() + 11 * 86400000).toISOString(),
    _count: { snatches: 0 },
  },
  {
    id: 'CQ-DEMO-011',
    title: 'Campus Food Order Bot',
    description: 'Build an automated ordering bot for campus cafeterias supporting asynchronous group payments and receipts.',
    difficulty: 'Beginner',
    category: 'AI',
    points: 160,
    maxSnatchers: 4,
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    _count: { snatches: 1 },
  },
  {
    id: 'CQ-DEMO-012',
    title: 'Offline Note Sync Engine',
    description: 'Engineer an SQLite-backed mobile markdown engine with bi-directional sync and conflict resolution strategies.',
    difficulty: 'Intermediate',
    category: 'Mobile',
    points: 260,
    maxSnatchers: 3,
    deadline: new Date(Date.now() + 13 * 86400000).toISOString(),
    _count: { snatches: 2 },
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

async function getPlatformStats(isFallback: boolean): Promise<PlatformStats> {
  const fallbackStats: PlatformStats = {
    totalQuests: DEMO_QUESTS.length,
    pointsAvailable: DEMO_QUESTS.reduce((sum, q) => sum + (q.points || 0), 0),
    clubMembers: 142,
    activeSnatches: DEMO_QUESTS.reduce((sum, q) => sum + q._count.snatches, 0),
  }

  if (isFallback) {
    return fallbackStats
  }

  try {
    const [questsCount, pointsAggregate, usersCount, snatchesCount] = await Promise.all([
      prisma.quest.count({ where: { status: 'Active' } }),
      prisma.quest.aggregate({
        _sum: { points: true },
        where: { status: 'Active' },
      }),
      prisma.user.count(),
      prisma.snatch.count({
        where: { status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'] } },
      }),
    ]);

    return {
      totalQuests: questsCount || fallbackStats.totalQuests,
      pointsAvailable: pointsAggregate._sum.points || fallbackStats.pointsAvailable,
      clubMembers: usersCount || fallbackStats.clubMembers,
      activeSnatches: snatchesCount || fallbackStats.activeSnatches,
    }
  } catch {
    return fallbackStats
  }
}

export default async function Home({ searchParams }: PageProps) {
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
  const stats = await getPlatformStats(isFallback)

  return (
    <div className="min-h-screen flex flex-col relative text-foreground [overflow-x:clip]">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header activePage="explore" />

        <main className="page-container flex-grow py-8 space-y-8">
          <LoginToast />

          {/* ── ARCADE HERO SECTION (REV-1) ── */}
          <section
            aria-label="Platform introduction"
            className="arcade-grid-bg rounded-card border border-border p-6 sm:p-10 md:p-12 bg-surface/70 relative overflow-hidden"
          >
            <div className="max-w-3xl relative z-10">
              {/* Arcade badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-primary/15 text-foreground border border-primary/40 shadow-sm">
                  <span className="material-symbols-outlined text-[15px] text-primary" aria-hidden="true">
                    sports_esports
                  </span>
                  SEASON 1 ACTIVE
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-surface-raised text-muted border border-border shadow-sm">
                  <span className="material-symbols-outlined text-[15px] text-focus" aria-hidden="true">
                    verified_user
                  </span>
                  CYBER-UNIV PROTOCOL
                </span>
              </div>

              {/* Bold typography headline */}
              <h1 className="text-3xl sm:text-5xl font-black text-foreground uppercase tracking-tight mb-4 leading-none">
                LEVEL UP YOUR CODE
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-muted font-medium mb-8 max-w-2xl leading-relaxed">
                The internal quest engine for Cyber University Coding Club. Claim real software bounties, ship code in squads, and climb the verified guild ranks.
              </p>

              {/* Quick CTA jump buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#explore-board"
                  className="button-primary text-sm uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                    explore
                  </span>
                  Browse Quests
                </a>
                <Link
                  href="/workspace"
                  className="button-secondary text-sm uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                    terminal
                  </span>
                  Open Workspace
                </Link>
                <Link
                  href="/leaderboard"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-button border border-control-border bg-surface px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-foreground hover:bg-surface-raised transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                    leaderboard
                  </span>
                  View Leaderboard
                </Link>
              </div>
            </div>
          </section>

          {/* ── ARCADE STATS BANNER TICKER (REV-1) ── */}
          <section
            aria-label="Club platform statistics"
            className="arcade-panel rounded-card p-4 sm:p-6"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                    assignment
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted">Total Quests</p>
                  <p className="font-mono text-xl sm:text-2xl font-black text-foreground tabular-nums">
                    {stats.totalQuests}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 border-t sm:border-t-0 sm:border-l border-border">
                <div className="w-10 h-10 rounded-lg bg-focus/10 border border-focus/30 flex items-center justify-center text-focus shrink-0">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                    stars
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted">Points Available</p>
                  <p className="font-mono text-xl sm:text-2xl font-black text-foreground tabular-nums">
                    {stats.pointsAvailable.toLocaleString()}{' '}
                    <span className="text-xs text-muted font-sans font-normal">PTS</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 border-t lg:border-t-0 lg:border-l border-border">
                <div className="w-10 h-10 rounded-lg bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary-foreground shrink-0">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                    group
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted">Club Members</p>
                  <p className="font-mono text-xl sm:text-2xl font-black text-foreground tabular-nums">
                    {stats.clubMembers}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 border-t sm:border-t-0 sm:border-l border-border">
                <div className="w-10 h-10 rounded-lg bg-warning/10 border border-warning/30 flex items-center justify-center text-warning shrink-0">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                    bolt
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted">Active Snatches</p>
                  <p className="font-mono text-xl sm:text-2xl font-black text-foreground tabular-nums">
                    {stats.activeSnatches}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 3-STEP GAMIFIED WORKFLOW CARDS (REV-1) ── */}
          <section aria-label="Quest workflow">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-xl" aria-hidden="true">
                route
              </span>
              <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-muted">
                How It Works
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="arcade-panel rounded-card p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-fast hover:border-control-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-primary">01</span>
                  <span className="material-symbols-outlined text-muted text-2xl" aria-hidden="true">
                    travel_explore
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">Select Mission</h3>
                  <p className="text-sm text-muted">Filter by difficulty, scope &amp; bounty.</p>
                </div>
              </div>

              <div className="arcade-panel rounded-card p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-fast hover:border-control-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-focus">02</span>
                  <span className="material-symbols-outlined text-muted text-2xl" aria-hidden="true">
                    terminal
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">Squad Up &amp; Code</h3>
                  <p className="text-sm text-muted">Solo or team up in squads, commit your repo.</p>
                </div>
              </div>

              <div className="arcade-panel rounded-card p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-fast hover:border-control-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-warning">03</span>
                  <span className="material-symbols-outlined text-muted text-2xl" aria-hidden="true">
                    military_tech
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">Submit &amp; Rank Up</h3>
                  <p className="text-sm text-muted">Review by club leads, earn points, climb the leaderboard.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── LIVE QUEST BOARD ANCHOR (REV-1 & REV-7) ── */}
          <section id="explore-board" className="scroll-mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Mission Board</h2>
                <p className="text-sm text-muted">Find a project to build. Filter by difficulty or search the requirements.</p>
              </div>
              {isFallback && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold bg-surface-raised text-muted border border-border">
                  <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                    info
                  </span>
                  Safe Preview Mode
                </span>
              )}
            </div>

            <QuestSearch />

            {/* Active Missions (if user has active snatches) */}
            {myActiveQuests.length > 0 && (
              <section className="relative">
                <div className="bg-surface border border-border rounded-card break-words p-1">
                  <div className="bg-surface rounded-lg p-6 md:p-8 border border-border">
                    <div className="flex items-center gap-2 mb-6 text-muted">
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                        bolt
                      </span>
                      <span className="text-sm font-mono uppercase tracking-[0.2em] font-bold">
                        Active Missions ({myActiveQuests.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {myActiveQuests.map((quest) => (
                        <div key={quest.id} className="min-w-0">
                          <QuestCard quest={quest} isSnatched={true} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Available Quests Grid */}
            <div>
              {availableQuests.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-surface">
                  <p className="text-muted">No available quests match these filters. Try another search or difficulty.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableQuests.map((quest) => (
                      <QuestCard key={quest.id} quest={quest} isSnatched={false} />
                    ))}
                  </div>
                  <div className="mt-6">
                    <Pagination totalPages={totalPages} />
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
