import { prisma } from '@/lib/db'
import { QuestCard } from '@/components/QuestCard'
import { QuestSearch } from '@/components/QuestSearch'
import { getUserActiveSnatches } from '@/actions/quest'
import Link from 'next/link'
import { LoginToast } from '@/components/LoginToast'
import { Header } from '@/components/Header'

export const dynamic = 'force-dynamic'

async function getQuests(searchParams: { q?: string, difficulty?: string, sort?: string }) {
  const where: any = {}

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

  return await prisma.quest.findMany({
    where,
    include: {
      _count: {
        select: { snatches: true }
      }
    },
    orderBy
  })
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
      _count: { select: { snatches: true } }
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

  const [allFilteredQuests, myActiveQuests] = await Promise.all([
    getQuests(params),
    getMyActiveQuests()
  ])

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const myActiveIds = myActiveQuests.map((q: any) => q.id);
  // Filter out active quests from the main list so they don't appear twice
  const availableQuests = allFilteredQuests.filter((q: any) => !myActiveIds.includes(q.id));

  return (
    <div className="min-h-screen flex flex-col relative bg-[#fafafa] dark:bg-black text-[#171717] dark:text-white font-display">

      {/* Header */}
      {/* Header */}
      <Header activePage="explore" />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <LoginToast />

        {/* MY ACTIVE QUESTS SECTION */}
        {myActiveQuests.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-1">My Active Quests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {myActiveQuests.map((quest: any) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  isSnatched={true}
                />
              ))}
            </div>
          </div>
        )}


        {/* Filters & Header */}
        <div className="flex flex-col gap-6 mb-8">
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
            <form action={seedQuests}>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-colors text-black dark:text-white">
                Seed Test Quests
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {availableQuests.map((quest: any) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isSnatched={false}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
