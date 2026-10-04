import { auth } from '@/auth'
import { Header } from '@/components/Header'
import { ProfileSidebar } from '@/components/profile/ProfileSidebar'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Badge, Prisma } from '@prisma/client'

type UserWithBadges = Prisma.UserGetPayload<{
    include: {
        badges: {
            include: { badge: true }
        }
    }
}>

type ProfileSnatch = Prisma.SnatchGetPayload<{
    include: {
        quest: true
    }
}>

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user?.email) redirect('/login')

    let user: UserWithBadges | null = null
    let allBadges: Badge[] = []
    let snatches: ProfileSnatch[] = []

    try {
        user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                badges: {
                    include: { badge: true }
                }
            }
        })

        allBadges = await prisma.badge.findMany({ orderBy: { createdAt: 'asc' } })

        if (user) {
            snatches = await prisma.snatch.findMany({
                where: {
                    userId: user.id,
                    status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'ACCEPTED', 'ARCHIVED'] }
                },
                include: {
                    quest: true
                },
                orderBy: { updatedAt: 'desc' }
            })
        }
    } catch (error) {
        console.error('ProfilePage database fetch notice (fallback used):', error)
    }

    if (!user) {
        if (process.env.NODE_ENV === 'development') {
            user = {
                id: session.user.id || 'dev-user-id',
                name: session.user.name || 'Dev User',
                email: session.user.email,
                avatar: session.user.image || 'https://api.dicebear.com/7.x/bottts/svg?seed=DevUser',
                image: session.user.image || 'https://api.dicebear.com/7.x/bottts/svg?seed=DevUser',
                bio: 'Fullstack Explorer & CodeQuest Developer',
                githubUrl: 'https://github.com',
                linkedinUrl: 'https://linkedin.com',
                handle: 'dev_explorer',
                role: session.user.role || 'Member',
                points: session.user.points || 450,
                completedQuests: 5,
                badges: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                password: null,
                emailVerified: new Date(),
            } as UserWithBadges
        } else {
            redirect('/login')
        }
    }

    const activeSnatches = snatches.filter(s => ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'].includes(s.status))
    const portfolioSnatches = snatches.filter(s => ['ACCEPTED', 'ARCHIVED'].includes(s.status))

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

                            badges={user.badges.map((ub: Prisma.UserBadgeGetPayload<{ include: { badge: true } }>) => ({ ...ub.badge, isFeatured: ub.isFeatured }))}
                        />
                        <ProfileTabs
                            activeSnatches={activeSnatches}
                            portfolioSnatches={portfolioSnatches}
                            user={user}
                            isOwner={true}

                            badges={user.badges.map((ub: Prisma.UserBadgeGetPayload<{ include: { badge: true } }>) => ub.badge)}
                            allBadges={allBadges}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}
