
import { auth } from '@/auth'
import { Header } from '@/components/Header'
import { ProfileSidebar } from '@/components/profile/ProfileSidebar'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'

export default async function PublicProfilePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const session = await auth()

    // Fetch user by ID
    const user = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            // @ts-ignore: Prisma client field
            badges: {
                include: { badge: true }
            }
        }
    })

    if (!user) {
        notFound()
    }

    // Fetch all available badges (for the locked view)
    const allBadges = await prisma.badge.findMany({ orderBy: { createdAt: 'asc' } })

    // Fetch all relevant snatches for the user
    // We can show same data as private profile, maybe filtering out some sensitive statuses if needed?
    // The original query included 'ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'COMPLETED', 'ACCEPTED', 'ARCHIVED'
    // For public profile, maybe we should only show COMPLETED/ACCEPTED?
    // But the requirement implies viewing the full profile.
    // Let's keep it consistent for now.
    const snatches = await prisma.snatch.findMany({
        where: {
            userId: user.id,
            status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'COMPLETED', 'ACCEPTED', 'ARCHIVED'] }
        },
        include: {
            quest: true
        },
        orderBy: { updatedAt: 'desc' }
    })

    const activeSnatches = snatches.filter(s => ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'].includes(s.status))
    const portfolioSnatches = snatches.filter(s => ['COMPLETED', 'ACCEPTED', 'ARCHIVED'].includes(s.status))

    // Calculate completed count from local filter
    const completedQuestsCount = portfolioSnatches.length

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background-dark">
            <Header activePage="leaderboard" />

            <main className="flex-1 px-4 sm:px-6 py-8 md:py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <ProfileSidebar
                            user={{ ...user, completedQuests: completedQuestsCount }}
                            // @ts-ignore: Prisma client field
                            badges={user.badges.map((ub: any) => ({ ...ub.badge, isFeatured: ub.isFeatured }))}
                        />
                        <ProfileTabs
                            activeSnatches={activeSnatches}
                            portfolioSnatches={portfolioSnatches}
                            user={user}
                            // @ts-ignore: Prisma client field
                            badges={user.badges.map((ub: any) => ub.badge)}
                            allBadges={allBadges}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}
