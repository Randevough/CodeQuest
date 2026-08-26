import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testPrisma } from '../setup'
import { joinQuest } from '@/actions/quest'

// Mock the auth module
vi.mock('@/lib/auth-guard', () => ({
    requireAuth: vi.fn().mockResolvedValue({ id: 'test-user' })
}))

vi.mock('@/auth', () => ({
    auth: vi.fn().mockResolvedValue({ user: { id: 'test-user', email: 'test@example.com' } }),
}))

describe('Quest Actions', () => {
    beforeEach(async () => {
        if (!process.env.DATABASE_URL_TEST) return

        await testPrisma.user.create({
            data: { id: 'test-user', name: 'Test User', email: 'test@example.com', emailVerified: new Date() }
        })
    })

    describe('joinQuest', () => {
        it('should block if user has >= 3 active quests', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-new', title: 'Q', description: 'Q', points: 10, difficulty: 'Easy', category: 'Frontend', maxSnatchers: 1 }
            })

            for (let i = 0; i < 3; i++) {
                const q = await testPrisma.quest.create({
                    data: { id: `q-${i}`, title: 'Q', description: 'Q', points: 10, difficulty: 'Easy', category: 'Frontend', maxSnatchers: 1 }
                })
                await testPrisma.snatch.create({
                    data: { userId: 'test-user', questId: q.id, status: 'ACTIVE' }
                })
            }

            const res = await joinQuest(quest.id)
            expect(res.error).toBe('Mission capacity reached. Finish an active quest to snatch more.')
        })

        it('should block if maxSnatchers is reached', async () => {
            // to be implemented with DB operations
        })

        it('should reject joining a Closed quest', async () => {
            if (!process.env.DATABASE_URL_TEST) return
            const quest = await testPrisma.quest.create({
                data: { id: 'q-closed', title: 'Q', description: 'Q', status: 'Closed', maxSnatchers: 5 }
            })
            const res = await joinQuest(quest.id)
            expect(res.error).toBe('This quest is no longer available (Closed/Inactive).')
        })

        it('should reject joining an Inactive quest', async () => {
            if (!process.env.DATABASE_URL_TEST) return
            const quest = await testPrisma.quest.create({
                data: { id: 'q-inactive', title: 'Q', description: 'Q', status: 'Inactive', maxSnatchers: 5 }
            })
            const res = await joinQuest(quest.id)
            expect(res.error).toBe('This quest is no longer available (Closed/Inactive).')
        })

        it('should reject joining a past-deadline quest', async () => {
            if (!process.env.DATABASE_URL_TEST) return
            const pastDeadline = new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
            const quest = await testPrisma.quest.create({
                data: { id: 'q-deadline', title: 'Q', description: 'Q', status: 'Active', maxSnatchers: 5, deadline: pastDeadline }
            })
            const res = await joinQuest(quest.id)
            expect(res.error).toBe('This quest is past its deadline.')
        })

        it('should allow joining an open, in-deadline quest', async () => {
            if (!process.env.DATABASE_URL_TEST) return
            const futureDeadline = new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 day future
            const quest = await testPrisma.quest.create({
                data: { id: 'q-happy', title: 'Q', description: 'Q', status: 'Active', maxSnatchers: 5, deadline: futureDeadline }
            })
            const res = await joinQuest(quest.id)
            expect(res.success).toBe(true)
            
            const snatch = await testPrisma.snatch.findUnique({
                where: { userId_questId: { userId: 'test-user', questId: quest.id } }
            })
            expect(snatch).not.toBeNull()
        })
    })

    describe('submitQuest', () => {
        it('should update status to SUBMITTED', async () => {
            // to be implemented
        })
    })
})
