import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testPrisma } from '../setup'
import {
    createNotification,
    getNotifications,
    getUnreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead
} from '@/actions/notification'
import { auth } from '@/auth'
import type { Mock } from 'vitest'

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}))

type MockAuthReturn = {
    user?: {
        id?: string
        email?: string
        name?: string
    }
} | null

const mockAuth = auth as unknown as Mock<() => Promise<MockAuthReturn>>

describe('Notification Actions', () => {
    let userA: { id: string; email: string }
    let userB: { id: string; email: string }

    beforeEach(async () => {
        vi.clearAllMocks()

        if (!process.env.DATABASE_URL_TEST) return

        userA = await testPrisma.user.create({
            data: { id: 'user-notif-a', email: 'userA@cyber-univ.ac.id', name: 'User A' }
        })

        userB = await testPrisma.user.create({
            data: { id: 'user-notif-b', email: 'userB@cyber-univ.ac.id', name: 'User B' }
        })

        // Default session is User A
        mockAuth.mockResolvedValue({
            user: { id: userA.id, email: userA.email }
        })
    })

    describe('createNotification', () => {
        it('should insert a notification record with read: false', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const notif = await createNotification({
                userId: userA.id,
                type: 'QUEST_ASSIGNED',
                message: 'You have been assigned to Quest Alpha',
                link: '/quests/q-1'
            })

            expect(notif.id).toBeDefined()
            expect(notif.read).toBe(false)
            expect(notif.message).toBe('You have been assigned to Quest Alpha')
        })
    })

    describe('getNotifications & getUnreadNotificationCount', () => {
        it('should return notifications ordered by createdAt desc and count unread accurately', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            await testPrisma.notification.createMany({
                data: [
                    { userId: userA.id, type: 'BADGE_EARNED', message: 'Badge 1', read: false },
                    { userId: userA.id, type: 'BADGE_EARNED', message: 'Badge 2', read: false },
                    { userId: userA.id, type: 'BADGE_EARNED', message: 'Badge 3', read: true },
                    { userId: userB.id, type: 'BADGE_EARNED', message: 'User B Badge', read: false },
                ]
            })

            const res = await getNotifications(10)
            expect(res.success).toBe(true)
            expect(res.data?.length).toBe(3)
            expect(res.data?.[0].userId).toBe(userA.id)

            const unreadCount = await getUnreadNotificationCount()
            expect(unreadCount).toBe(2)
        })

        it('should return error/zero when unauthenticated', async () => {
            mockAuth.mockResolvedValueOnce(null)

            const res = await getNotifications()
            expect(res.success).toBe(false)
            expect(res.error).toBe('Unauthorized')

            mockAuth.mockResolvedValueOnce(null)
            const count = await getUnreadNotificationCount()
            expect(count).toBe(0)
        })
    })

    describe('markNotificationRead', () => {
        it('should mark a specific notification as read', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const notif = await testPrisma.notification.create({
                data: { userId: userA.id, type: 'SUBMISSION_ACCEPTED', message: 'Accepted', read: false }
            })

            const res = await markNotificationRead(notif.id)
            expect(res.success).toBe(true)

            const updated = await testPrisma.notification.findUnique({ where: { id: notif.id } })
            expect(updated?.read).toBe(true)
        })

        it('should reject marking another user notification as read', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const notifB = await testPrisma.notification.create({
                data: { userId: userB.id, type: 'SUBMISSION_REJECTED', message: 'Rejected', read: false }
            })

            const res = await markNotificationRead(notifB.id)
            expect(res.success).toBe(false)
            expect(res.error).toBe('Notification not found')
        })
    })

    describe('markAllNotificationsRead', () => {
        it('should mark all unread notifications as read for current user', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            await testPrisma.notification.createMany({
                data: [
                    { userId: userA.id, type: 'QUEST_ASSIGNED', message: 'Notif 1', read: false },
                    { userId: userA.id, type: 'QUEST_ASSIGNED', message: 'Notif 2', read: false },
                    { userId: userB.id, type: 'QUEST_ASSIGNED', message: 'User B Notif', read: false },
                ]
            })

            const res = await markAllNotificationsRead()
            expect(res.success).toBe(true)

            const unreadA = await testPrisma.notification.count({
                where: { userId: userA.id, read: false }
            })
            expect(unreadA).toBe(0)

            // User B unread should remain untouched
            const unreadB = await testPrisma.notification.count({
                where: { userId: userB.id, read: false }
            })
            expect(unreadB).toBe(1)
        })
    })
})
