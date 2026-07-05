import { getLeaderboardUsers, seedUsers } from '@/actions/user'
import { Header } from '@/components/Header'
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable'
import { PaginationControls } from '@/components/leaderboard/PaginationControls'
import { UserStanding } from '@/components/leaderboard/UserStanding'
import { LeaderboardFilters } from '@/components/leaderboard/LeaderboardFilters'
import { auth } from '@/auth'

// Force dynamic to ensure we get latest data
export const dynamic = 'force-dynamic'

export default async function LeaderboardPage(props: { searchParams: Promise<{ page?: string; timeframe?: string }> }) {
    const searchParams = await props.searchParams
    const page = Number(searchParams.page) || 1
    const timeframe = searchParams.timeframe || 'all'
    const pageSize = 10
    const { users, total } = await getLeaderboardUsers(page, pageSize)

    const session = await auth()
    const isAdmin = session?.user?.role === 'Admin'

    return (
        <div
            className="min-h-screen bg-slate-50 dark:bg-black text-[#171717] dark:text-white flex flex-col antialiased relative"
        >
            {/* Fixed dot-pattern */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-50 dark:hidden" style={{
                    backgroundImage: 'radial-gradient(circle, #64748b 1.25px, transparent 1.25px)',
                    backgroundSize: '24px 24px',
                }} />
                <div className="absolute inset-0 opacity-40 hidden dark:block" style={{
                    backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }} />
            </div>
            <Header activePage="leaderboard" />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">

                {/* Mesh Aura — Burnt Orange top-left */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full opacity-[0.05] blur-3xl"
                    style={{ background: '#EA580C' }}
                />

                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-2">Global Leaderboard</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">Top contributors and quest masters battling for coding supremacy.</p>
                </div>

                {/* Action Bar — Ghost Button */}
                {isAdmin && (
                    <div className="flex justify-end mb-4">
                        <form action={async () => {
                            'use server'
                            await seedUsers()
                        }}>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-medium rounded-lg transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">group_add</span>
                                Populate Leaderboard (Generate 20 Users)
                            </button>
                        </form>
                    </div>
                )}

                {users.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                        <p className="text-slate-500 mb-6">No heroes have risen yet.</p>
                        {isAdmin && (
                            <form action={async () => {
                                'use server'
                                await seedUsers()
                            }}>
                                <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors shadow-lg shadow-primary/20">
                                    Seed Leaderboard Users
                                </button>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        <div className="lg:col-span-3 space-y-6">

                            <LeaderboardFilters />

                            {/* Table container with corner + markers */}
                            <div className="relative">
                                {/* Corner + markers */}
                                <div aria-hidden="true" className="pointer-events-none absolute -top-3 -left-3 text-slate-300 text-xl font-light select-none z-10">+</div>
                                <div aria-hidden="true" className="pointer-events-none absolute -top-3 -right-3 text-slate-300 text-xl font-light select-none z-10">+</div>
                                <div aria-hidden="true" className="pointer-events-none absolute -bottom-3 -left-3 text-slate-300 text-xl font-light select-none z-10">+</div>
                                <div aria-hidden="true" className="pointer-events-none absolute -bottom-3 -right-3 text-slate-300 text-xl font-light select-none z-10">+</div>

                                <div
                                    className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                                    suppressHydrationWarning
                                >
                                    <LeaderboardTable users={users.map(u => ({ ...u, role: u.role || 'Member', handle: u.handle || '@unknown' }))} page={page} pageSize={pageSize} />
                                    <PaginationControls page={page} pageSize={pageSize} total={total} />
                                </div>
                            </div>
                        </div>

                        <UserStanding timeframe={timeframe} />
                    </div>
                )}
            </main>
        </div>
    )
}
