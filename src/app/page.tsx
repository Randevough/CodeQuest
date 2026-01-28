import { prisma } from '@/lib/db'
import { QuestCard } from '@/components/QuestCard'
import { QuestSearch } from '@/components/QuestSearch'
import { getUserActiveSnatches } from '@/actions/quest'
import Link from 'next/link'
import { LoginToast } from '@/components/LoginToast'
import { Header } from '@/components/Header'

import { Pagination } from '@/components/Pagination'


export const dynamic = 'force-dynamic'

async function getQuests(searchParams: { q?: string, difficulty?: string, sort?: string, page?: string }) {
  const where: any = {}
  const page = parseInt(searchParams.page || '1')
  const limit = 9
  const skip = (page - 1) * limit

  // Search
  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q } },
      { description: { contains: searchParams.q } }
    ]
  }

  // Filter
  if (searchParams.difficulty && searchParams.difficulty !== 'All') {
    where.difficulty = searchParams.difficulty
  }

  // Sort
  let orderBy: any = { createdAt: 'desc' }
  if (searchParams.sort === 'Oldest') {
    orderBy = { createdAt: 'asc' }
  } else if (searchParams.sort === 'Points (High-Low)') {
    orderBy = { points: 'desc' }
  } else if (searchParams.sort === 'Points (Low-High)') {
    orderBy = { points: 'asc' }
  }

  const [total, quests] = await prisma.$transaction([
    prisma.quest.count({ where }),
    prisma.quest.findMany({
      where,
      include: {
        _count: {
          select: { snatches: { where: { status: 'ACTIVE' } } }
        }
      },
      orderBy,
      skip,
      take: limit
    })
  ])

  return { quests, total, page, limit }
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

  const [{ quests: allFilteredQuests, total, limit }, myActiveQuests] = await Promise.all([
    getQuests(params),
    getMyActiveQuests()
  ])

  const totalPages = Math.ceil(total / limit)

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const myActiveIds = myActiveQuests.map((q: any) => q.id);
  // Filter out active quests from the main list so they don't appear twice
  // Filter out active quests from the main list so they don't appear twice
  // Also filter out FULL quests (where active snatches >= maxSnatchers)
  const availableQuests = allFilteredQuests.filter((q: any) => {
    const isMyActive = myActiveIds.includes(q.id);
    if (isMyActive) return false;

    const isFull = q._count.snatches >= q.maxSnatchers;
    if (isFull) return false;

    return true;
  });

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
            </div>

            <Pagination totalPages={totalPages} />
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
