import { prisma } from '@/lib/db'
import { QuestCard } from '@/components/QuestCard'
import { QuestSearch } from '@/components/QuestSearch'
import { getUserActiveSnatches, getAllUserQuestIds } from '@/actions/quest'
import { LoginToast } from '@/components/LoginToast'
import { Header } from '@/components/Header'
import { Pagination } from '@/components/Pagination'

export const dynamic = 'force-dynamic'

// Updated getQuests using proper Database filtering for "Availability"
async function getQuests(searchParams: { q?: string, difficulty?: string, sort?: string, page?: string }, excludedIds: string[]) {
  const page = parseInt(searchParams.page || '1')
  const limit = 9
  const offset = (page - 1) * limit

  // Build SQL conditions
  // We need to SELECT quests where:
  // 1. Matches Search
  // 2. Matches Difficulty
  // 3. ID is NOT in activeIds
  // 4. (active_snatches < maxSnatchers)

  // Prisma raw query helper
  const { Prisma } = await import('@prisma/client')

  // Base Query logic
  let whereClause = Prisma.sql`WHERE 1=1`

  // 1. Search
  if (searchParams.q) {
    whereClause = Prisma.sql`${whereClause} AND ("title" LIKE ${`%${searchParams.q}%`} OR "description" LIKE ${`%${searchParams.q}%`})`
  }

  // 2. Difficulty
  if (searchParams.difficulty && searchParams.difficulty !== 'All') {
    whereClause = Prisma.sql`${whereClause} AND "difficulty" = ${searchParams.difficulty}`
  }

  // 3. Exclude IDs (My Active)
  if (excludedIds.length > 0) {
    whereClause = Prisma.sql`${whereClause} AND "id" NOT IN (${Prisma.join(excludedIds)})`
  }

  // 4. Availability Check (Refined: "Done" means "Taken")
  // Check if count of ALL non-dropped snatches (Active + Completed) is less than maxSnatchers
  whereClause = Prisma.sql`${whereClause} AND "status" = 'Active' AND (
    SELECT COUNT(*) FROM "Snatch" 
    WHERE "Snatch"."questId" = "Quest"."id" 
    AND "Snatch"."status" IN ('ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'COMPLETED', 'ACCEPTED', 'ARCHIVED')
  ) < "maxSnatchers"`

  // Sorting
  let orderBy = Prisma.sql`ORDER BY "createdAt" DESC`
  if (searchParams.sort === 'Oldest') {
    orderBy = Prisma.sql`ORDER BY "createdAt" ASC`
  } else if (searchParams.sort === 'Points (High-Low)') {
    orderBy = Prisma.sql`ORDER BY "points" DESC`
  } else if (searchParams.sort === 'Points (Low-High)') {
    orderBy = Prisma.sql`ORDER BY "points" ASC`
  }

  try {
    // Execute Count (for pagination)
    const countQuery = Prisma.sql`SELECT COUNT(*) as count FROM "Quest" ${whereClause}`
    const totalResult = await prisma.$queryRaw<[{ count: bigint }]>(countQuery)
    const total = Number(totalResult[0].count)

    // Execute Fetch ID Query (with Limit/Offset)
    const idsQuery = Prisma.sql`SELECT "id" FROM "Quest" ${whereClause} ${orderBy} LIMIT ${limit} OFFSET ${offset}`
    const validIdsResult = await prisma.$queryRaw<{ id: string }[]>(idsQuery)
    const validIds = validIdsResult.map(r => r.id)

    if (validIds.length === 0) {
      return { quests: [], total, page, limit }
    }

    // Now sort manually or by fetching in order
    const quests = await prisma.quest.findMany({
      where: {
        id: { in: validIds }
      },
      include: {
        _count: {
          select: { snatches: { where: { status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'COMPLETED', 'ACCEPTED'] } } } }
        }
      }
    })

    // Re-sort results in JS to match ID order
    const questsMap = new Map(quests.map(q => [q.id, q]))
    const sortedQuests = validIds
      .map(id => questsMap.get(id))
      .filter(q => q !== undefined)

    return { quests: sortedQuests, total, page, limit }
  } catch (error) {
    console.error('getQuests DB fetch notice (fallback used):', error);
    return { quests: [], total: 0, page, limit };
  }
}

// Helper to get full details of active quests
async function getMyActiveQuests() {
  try {
    const activeIds = await getUserActiveSnatches();
    if (activeIds.length === 0) return [];

    return await prisma.quest.findMany({
      where: {
        id: { in: activeIds }
      },
      include: {
        _count: { select: { snatches: { where: { status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'COMPLETED', 'ACCEPTED'] } } } } }
      }
    });
  } catch (error) {
    console.error('getMyActiveQuests DB fetch notice (fallback used):', error);
    return [];
  }
}

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string, difficulty?: string, sort?: string, page?: string }> | { q?: string, difficulty?: string, sort?: string, page?: string } }) {
  const params = await searchParams;

  // 1. Get my active quests first (needed for exclusion)
  const myActiveQuests = await getMyActiveQuests();

  // 2. Get ALL interacted IDs for exclusion from board (Active + Completed + Archived)
  const allExcludedIds = await getAllUserQuestIds();

  // 3. Get filtered available quests
  const { quests: availableQuests, total, limit } = await getQuests(params, allExcludedIds);

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen flex flex-col relative text-slate-800 dark:text-slate-100 [overflow-x:clip]">

      {/* Fixed dot-pattern + glow auras */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-50 dark:hidden" style={{
          backgroundImage: 'radial-gradient(circle, #64748b 1.25px, transparent 1.25px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute inset-0 opacity-40 hidden dark:block" style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top left, rgba(249,115,22,0.15), transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at bottom right, rgba(100,116,139,0.15), transparent 60%)' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header activePage="explore" />

        <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 space-y-12">
          <LoginToast />

          {/* ── ACTIVE MISSIONS ── */}
          {myActiveQuests.length > 0 && (
            <section className="relative">
              <div className="crosshair absolute -top-1 -left-1" />
              <div className="crosshair absolute -top-1 -right-1" />
              <div className="crosshair absolute -bottom-1 -left-1" />
              <div className="crosshair absolute -bottom-1 -right-1" />

              {/* Outer glass wrapper */}
              <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 rounded-xl p-1 shadow-sm">
                {/* Inner panel */}
                <div className="bg-white/50 dark:bg-zinc-900/50 rounded-lg p-6 md:p-8 border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 mb-6 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">
                      Active Missions ({myActiveQuests.length})
                    </span>
                  </div>
                  <div className="flex overflow-x-auto styled-scrollbar items-stretch -mx-6 px-6 pb-3 gap-4">
                    {myActiveQuests.map((quest) => (
                      <div key={quest.id} className="min-w-[320px] md:min-w-[500px] max-w-[640px] flex-none">
                        <QuestCard quest={quest} isSnatched={true} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── QUEST BOARD ── */}
          <section>
            <div className="flex flex-col items-center text-center gap-2 mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Quest Board</h1>
              <p className="text-slate-500 dark:text-slate-400">Solve problems, build cool things, and earn points to climb the ranks. <br /> Your next challenge starts here!</p>
            </div>

            <div className="mb-8">
              <QuestSearch />
            </div>

            {availableQuests.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-700 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-sm">
                <p className="text-slate-500">No quests found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {availableQuests.map((quest: any) => (
                    <QuestCard key={quest.id} quest={quest} isSnatched={false} />
                  ))}
                </div>
                <div className="mt-6">
                  <Pagination totalPages={totalPages} />
                </div>
              </>
            )}
          </section>

        </main>
      </div>
    </div>
  )
}
