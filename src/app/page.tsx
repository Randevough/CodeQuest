import { prisma } from '@/lib/db'
import { QuestCard } from '@/components/QuestCard'
import { QuestSearch } from '@/components/QuestSearch'
import { getUserActiveSnatches, getAllUserQuestIds } from '@/actions/quest'
import Link from 'next/link'
import { LoginToast } from '@/components/LoginToast'
import { Header } from '@/components/Header'

import { Pagination } from '@/components/Pagination'


export const dynamic = 'force-dynamic'

// Helper to get active user quest IDs (exclude these from board)
async function getMyActiveQuestIds() {
  const activeIds = await getUserActiveSnatches();
  return activeIds;
}

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
  // Note: We use specific SQL for SQLite.
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

  // Execute Count (for pagination)
  // We need to count valid items first
  const countQuery = Prisma.sql`SELECT COUNT(*) as count FROM "Quest" ${whereClause}`
  const totalResult = await prisma.$queryRaw<[{ count: bigint }]>(countQuery)
  const total = Number(totalResult[0].count)

  // Execute Fetch ID Query (with Limit/Offset)
  // We fetch IDs first using Raw SQL to handle the complex filtering
  const idsQuery = Prisma.sql`SELECT "id" FROM "Quest" ${whereClause} ${orderBy} LIMIT ${limit} OFFSET ${offset}`
  const validIdsResult = await prisma.$queryRaw<{ id: string }[]>(idsQuery)
  const validIds = validIdsResult.map(r => r.id)

  if (validIds.length === 0) {
    return { quests: [], total, page, limit }
  }

  // Now sort manually or by fetching in order (using 'in' does not guarantee order)
  // To preserve order, we can map the result.
  const quests = await prisma.quest.findMany({
    where: {
      id: { in: validIds }
    },
    include: {
      _count: {
        select: { snatches: { where: { status: 'ACTIVE' } } }
      }
    }
  })

  // Re-sort results in JS to match ID order (since 'IN' query might scramble order)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const questsMap = new Map(quests.map(q => [q.id, q]))
  const sortedQuests = validIds
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map(id => questsMap.get(id))
    .filter(q => q !== undefined)

  return { quests: sortedQuests, total, page, limit }
}

// Helper to get full details of active quests
async function getMyActiveQuests() {
  const activeIds = await getUserActiveSnatches();
  if (activeIds.length === 0) return [];

  return await prisma.quest.findMany({
    where: {
      id: { in: activeIds }
    },
    include: {
      _count: { select: { snatches: { where: { status: 'ACTIVE' } } } }
    }
  });
}

// Temporary seed action
async function seedQuests() {
  'use server'
  await prisma.quest.create({
    data: {
      title: 'Fix the Login Bug',
      description: 'The login button is misaligned by 2px. Critical priority.',
      maxSnatchers: 1,
      difficulty: 'Beginner',
      points: 100,
      category: 'Web'
    }
  })
  await prisma.quest.create({
    data: {
      title: 'Implementation Plan Review',
      description: 'Review the proposed changes for the new feature.',
      maxSnatchers: 1,
      difficulty: 'Advanced',
      points: 50,
      category: 'Design'
    }
  })
  await prisma.quest.create({
    data: {
      title: 'Refactor Auth',
      description: 'Move auth logic to a separate service. Needs 2 active devs.',
      maxSnatchers: 2,
      difficulty: 'Advanced',
      points: 300,
      category: 'AI'
    }
  })
  await prisma.quest.create({
    data: {
      title: 'Mobile Push Notifications',
      description: 'Implement push notifications for the mobile app.',
      maxSnatchers: 3,
      difficulty: 'Intermediate',
      points: 200,
      category: 'Mobile'
    }
  })
}

export default async function Home({ searchParams }: { searchParams: { q?: string, difficulty?: string, sort?: string } }) {
  const params = await searchParams; // Next 15+ await searchParams

  // Note: To show toast on the server component, we usually need a client wrapper or pass a prop.
  // Actually, for "Welcome Toast" after redirect, we can check a searchParam on the CLIENT side.
  // But this is a Server Component.
  // We can add a small Client Component just for the toaster effect, or check it in the main layout if global.
  // Let's create a Client Component `LoginToast` and embed it here.

  // 1. Get my active quests first (needed for exclusion)
  const myActiveQuests = await getMyActiveQuests();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  // 2. Get ALL interacted IDs for exclusion from board (Active + Completed + Archived)
  const allExcludedIds = await getAllUserQuestIds();

  // 3. Get filtered available quests
  // Now passing excluded IDs to handle filtering in DB
  const { quests: availableQuests, total, limit } = await getQuests(params, allExcludedIds);

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen flex flex-col relative bg-[#F9FAFB] dark:bg-black text-[#171717] dark:text-white">

      {/* Header */}
      {/* Header */}
      <Header activePage="explore" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <LoginToast />

        {/* MY ACTIVE QUESTS SECTION */}
        {myActiveQuests.length > 0 && (
          <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              Active Quests ({myActiveQuests.length})
            </h2>

            <div className="flex overflow-x-auto gap-4 no-scrollbar items-stretch -mx-6 px-6 py-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {myActiveQuests.map((quest: any) => (
                <div key={quest.id} className="min-w-[320px] md:min-w-[350px] max-w-[400px] flex-none">
                  <QuestCard
                    quest={quest}
                    isSnatched={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Filters & Header */}
        <div className="flex flex-col gap-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quest Board</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Find new challenges to tackle and earn points for your team.</p>
          </div>

          {/* Search and Filters Client Component */}
          <QuestSearch />
        </div>

        {/* Quest Grid */}
        {availableQuests.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 dark:border-border-dark rounded-3xl">
            <p className="text-zinc-500 mb-4">No quests found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {availableQuests.map((quest: any) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  isSnatched={false}
                />
              ))}
            </div >

            <div className="mt-6">
              <Pagination totalPages={totalPages} />
            </div>
          </>
        )}

        {/* Developer / Seed Section */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
          <form action={seedQuests}>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-mono transition-colors text-gray-500 dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-400">
              🌱 Seed Test Quests
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
