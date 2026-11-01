import { getLeaderboardUsers } from '@/actions/user'
import { Header } from '@/components/Header'
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable'
import { PaginationControls } from '@/components/leaderboard/PaginationControls'
import { UserStanding } from '@/components/leaderboard/UserStanding'
import { LeaderboardFilters } from '@/components/leaderboard/LeaderboardFilters'

// Force dynamic to ensure we get latest data
export const dynamic = 'force-dynamic'

export default async function LeaderboardPage(props: {
    searchParams: Promise<{ page?: string; timeframe?: string; q?: string; query?: string }>
}) {
    const searchParams = await props.searchParams
    const page = Number(searchParams.page) || 1
    const pageSize = 10
    const q = (searchParams.q || searchParams.query || '').trim()
    const { users, total } = await getLeaderboardUsers(page, pageSize, q)



    return (
        <div
            className="min-h-screen bg-surface text-foreground flex flex-col antialiased relative"
        >
            <Header activePage="leaderboard" />

            <main className="page-container flex-1 py-8 relative">

                <div className="mb-8">
                    <h1 className="tracking-tight text-foreground mb-2">Global Leaderboard</h1>
                    <p className="text-lg text-muted max-w-2xl">Club members ranked by approved quest points.</p>
                </div>



                <div className="mb-6"><LeaderboardFilters /></div>
                {users.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-card break-words">
                        <p className="text-muted mb-6">
                            {q
                                ? `No adventurers found matching '${q}'`
                                : 'No ranked members to show yet.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        <div className="lg:col-span-3 min-w-0 space-y-6">
                            <div className="relative">
                                <div
                                    className="bg-surface dark:bg-surface-dark rounded-card break-words border border-border overflow-hidden"
                                    suppressHydrationWarning
                                >
                                    <LeaderboardTable users={users} page={page} pageSize={pageSize} />
                                    <PaginationControls page={page} pageSize={pageSize} total={total} />
                                </div>
                            </div>
                        </div>

                        <UserStanding />
                    </div>
                )}
            </main>
        </div>
    )
}
