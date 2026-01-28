import { getLeaderboardUsers, seedUsers } from '@/actions/user'
import { Header } from '@/components/Header'
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable'
import { PaginationControls } from '@/components/leaderboard/PaginationControls'
import { UserStanding } from '@/components/leaderboard/UserStanding'
import { LeaderboardFilters } from '@/components/leaderboard/LeaderboardFilters'

// Force dynamic to ensure we get latest data
export const dynamic = 'force-dynamic'

export default async function LeaderboardPage(props: { searchParams: Promise<{ page?: string; timeframe?: string }> }) {
    const searchParams = await props.searchParams
    const page = Number(searchParams.page) || 1
    const timeframe = searchParams.timeframe || 'all'
    const pageSize = 10
    const { users, total } = await getLeaderboardUsers(page, pageSize, timeframe)

    // Cast users to strict type if needed, or rely on implicit compatibility
    // In a real app we'd map/validate. For now we assume Prisma returns compatible types.

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-black text-[#171717] dark:text-white flex flex-col antialiased">
            <Header activePage="leaderboard" />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-2">Global Leaderboard</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">Top contributors and quest masters battling for coding supremacy.</p>
                </div>

                {/* Action Bar for Seeding/Population */}
                <div className="flex justify-end mb-4">
                    <form action={async () => {
                        'use server'
                        await seedUsers()
                    }}>
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">group_add</span>
                            Populate Leaderboard (Generate 20 Users)
                        </button>
                    </form>
                </div>

                {users.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                        <p className="text-slate-500 mb-6">No heroes have risen yet.</p>
                        <form action={async () => {
                            'use server'
                            await seedUsers()
                        }}>
                            <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors shadow-lg shadow-primary/20">
                                Seed Leaderboard Users
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        <div className="lg:col-span-3 space-y-6">

                            <LeaderboardFilters />

                            <div
                                className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
                                suppressHydrationWarning
                            >
                                <LeaderboardTable users={users.map(u => ({ ...u, role: u.role || 'Member', handle: u.handle || '@unknown' }))} page={page} pageSize={pageSize} />
                                <PaginationControls page={page} pageSize={pageSize} total={total} />
                            </div>
                        </div>

                        <UserStanding timeframe={timeframe} />
                    </div>
                )}
            </main>
        </div>
    )
}
