import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testPrisma } from '../setup'
import { reviewSubmission } from '@/actions/submission'
vi.mock('@/lib/auth-guard', () => ({
    requireAdmin: vi.fn().mockResolvedValue(true)
}))

describe('reviewSubmission', () => {
    beforeEach(async () => {
        if (!process.env.DATABASE_URL_TEST) return

        await testPrisma.user.create({
            data: { id: 'admin-user', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', emailVerified: new Date() }
        })
    })

    it('first review awards points', async () => {
        if (!process.env.DATABASE_URL_TEST) return
        const user = await testPrisma.user.create({ data: { email: 'rev1@test.com', points: 0 } })
        const quest = await testPrisma.quest.create({ data: { title: 'Q', description: 'Q', points: 100 } })
        const snatch = await testPrisma.snatch.create({ data: { userId: user.id, questId: quest.id, status: 'SUBMITTED' } })
        
        const res = await reviewSubmission(snatch.id, 'ACCEPTED')
        expect(res.success).toBe(true)
        expect(res.isReReview).toBe(false)
        expect(res.pointDelta).toBe(100)
        
        const updatedUser = await testPrisma.user.findUnique({ where: { id: user.id } })
        expect(updatedUser?.points).toBe(100)
    })

    it('re-review ACCEPTED->REJECTED revokes points', async () => {
        if (!process.env.DATABASE_URL_TEST) return
        const user = await testPrisma.user.create({ data: { email: 'rev2@test.com', points: 100 } })
        const quest = await testPrisma.quest.create({ data: { title: 'Q', description: 'Q', points: 100 } })
        const snatch = await testPrisma.snatch.create({ data: { userId: user.id, questId: quest.id, status: 'ACCEPTED' } })
        
        const res = await reviewSubmission(snatch.id, 'REJECTED')
        expect(res.success).toBe(true)
        expect(res.isReReview).toBe(true)
        expect(res.pointDelta).toBe(-100)
        
        const updatedUser = await testPrisma.user.findUnique({ where: { id: user.id } })
        expect(updatedUser?.points).toBe(0)
    })

    it('re-review ACCEPTED->ACCEPTED is idempotent (no double points)', async () => {
        if (!process.env.DATABASE_URL_TEST) return
        const user = await testPrisma.user.create({ data: { email: 'rev3@test.com', points: 100 } })
        const quest = await testPrisma.quest.create({ data: { title: 'Q', description: 'Q', points: 100 } })
        const snatch = await testPrisma.snatch.create({ data: { userId: user.id, questId: quest.id, status: 'ACCEPTED' } })
        
        const res = await reviewSubmission(snatch.id, 'ACCEPTED')
        expect(res.success).toBe(true)
        expect(res.isReReview).toBe(true)
        expect(res.pointDelta).toBe(0)
        
        const updatedUser = await testPrisma.user.findUnique({ where: { id: user.id } })
        expect(updatedUser?.points).toBe(100)
    })
})
