import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testPrisma } from '../setup'
import { getLeaderboardUsers, getLeaderboardStanding } from '@/actions/user'
import { getActivityFeed } from '@/actions/activity'
import { getAdminDashboardStats } from '@/actions/admin-dashboard'
import { requireAdmin } from '@/lib/auth-guard'
import { auth } from '@/auth'
import type { Mock } from 'vitest'

type AdminUser = Awaited<ReturnType<typeof requireAdmin>>

vi.mock('@/lib/auth-guard', () => ({
    requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-analyst', role: 'Admin' } as unknown as AdminUser),
    requireAuth: vi.fn().mockResolvedValue({ id: 'admin-analyst', role: 'Admin' } as unknown as AdminUser),
}))

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}))

type MockAuthReturn = {
    user?: {
        id?: string
        email?: string
        name?: string
        role?: string
    }
} | null

const mockAuth = auth as unknown as Mock<() => Promise<MockAuthReturn>>

describe('Analytics, Leaderboard & Activity Feed Actions', () => {
    let topUser: { id: string; email: string }
    let midUser: { id: string; email: string }

    beforeEach(async () => {
        vi.clearAllMocks()
        vi.mocked(requireAdmin).mockResolvedValue({ id: 'admin-analyst', role: 'Admin' } as unknown as AdminUser)

        if (!process.env.DATABASE_URL_TEST) return

        topUser = await testPrisma.user.create({
            data: {
                id: 'user-top',
                name: 'Top Player',
                email: 'top@cyber-univ.ac.id',
                handle: 'top_player',
                points: 500,
                role: 'Member'
            }
        })

        midUser = await testPrisma.user.create({
            data: {
                id: 'user-mid',
                name: 'Mid Player',
                email: 'mid@cyber-univ.ac.id',
                handle: 'mid_player',
                points: 250,
                role: 'Member'
            }
        })

        mockAuth.mockResolvedValue({
            user: { id: midUser.id, email: midUser.email, role: 'Member' }
        })
    })

    describe('getLeaderboardUsers', () => {
        it('should return users ranked by points in descending order', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-completed-rank', title: 'Completed Q', description: 'Desc' }
            })

            await testPrisma.snatch.create({
                data: { userId: topUser.id, questId: quest.id, status: 'ACCEPTED' }
            })

            const res = await getLeaderboardUsers(1, 10)
            expect(res.users.length).toBeGreaterThanOrEqual(2)

            const topIndex = res.users.findIndex(u => u.id === topUser.id)
            const midIndex = res.users.findIndex(u => u.id === midUser.id)
            expect(topIndex).toBeLessThan(midIndex)
            expect(res.users[topIndex].completedQuests).toBe(1)
        })
    })

    describe('getLeaderboardStanding', () => {
        it('should accurately calculate user rank and pointsToNext', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            // Session is midUser (points = 250), topUser has 500
            const standing = await getLeaderboardStanding()
            expect(standing).not.toBeNull()
            expect(standing?.rank).toBe(2)
            expect(standing?.pointsToNext).toBe(500 - 250 + 1)
        })

        it('should return null when user is not authenticated', async () => {
            mockAuth.mockResolvedValueOnce(null)

            const standing = await getLeaderboardStanding()
            expect(standing).toBeNull()
        })
    })

    describe('getActivityFeed', () => {
        it('should aggregate completions, newly published quests, and badge unlocks', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-feed-test', title: 'Feed Quest', description: 'Desc', status: 'Active' }
            })

            const badge = await testPrisma.badge.create({
                data: { slug: 'feed-badge', name: 'Feed Explorer', description: 'Desc', category: 'POINTS' }
            })

            await testPrisma.userBadge.create({
                data: { userId: topUser.id, badgeId: badge.id }
            })

            const res = await getActivityFeed(10)
            expect(res.success).toBe(true)
            expect(res.data.length).toBeGreaterThanOrEqual(2)

            const types = res.data.map(item => item.type)
            expect(types).toContain('quest_published')
            expect(types).toContain('badge_earned')
            expect(res.data.some(item => item.link === `/quests/${quest.id}`)).toBe(true)
        })
    })

    describe('getAdminDashboardStats', () => {
        it('should return aggregated metrics for the admin dashboard', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-stat-active', title: 'Stat Quest', description: 'Desc', status: 'Active', points: 100 }
            })

            await testPrisma.snatch.create({
                data: { userId: topUser.id, questId: quest.id, status: 'SUBMITTED' }
            })

            const res = await getAdminDashboardStats()
            expect(res.success).toBe(true)
            expect(res.data?.totalMembers).toBeGreaterThanOrEqual(2)
            expect(res.data?.activeQuests).toBeGreaterThanOrEqual(1)
            expect(res.data?.pendingReviews).toBeGreaterThanOrEqual(1)
            expect(res.data?.activityTrend).toBeDefined()
        })

        it('should reject if caller is not an admin', async () => {
            vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Forbidden: Admin access required.'))

            const res = await getAdminDashboardStats()
            expect(res.success).toBe(false)
            expect(res.error).toBe('Failed to fetch stats')
        })
    })
})
