import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testPrisma } from '../setup'
import { joinQuest, submitQuest, dropQuest } from '@/actions/quest'

// Mock the auth module
vi.mock('@/lib/auth-guard', () => ({
    requireAuth: vi.fn().mockResolvedValue({ id: 'test-user' })
}))

describe('Quest Actions', () => {
    beforeEach(async () => {
        if (!process.env.DATABASE_URL_TEST) return
        
        await testPrisma.user.create({
            data: { id: 'test-user', name: 'Test User', email: 'test@example.com' }
        })
    })

    describe('joinQuest', () => {
        it('should block if user has >= 3 active quests', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-new', title: 'Q', description: 'Q', points: 10, difficulty: 'Easy', category: 'Frontend', maxSnatchers: 1 }
            })
            
            for(let i=0; i<3; i++) {
                const q = await testPrisma.quest.create({
                    data: { id: `q-${i}`, title: 'Q', description: 'Q', points: 10, difficulty: 'Easy', category: 'Frontend', maxSnatchers: 1 }
                })
                await testPrisma.snatch.create({
                    data: { userId: 'test-user', questId: q.id, status: 'ACTIVE' }
                })
            }

            const res = await joinQuest(quest.id)
            expect(res.error).toBe('You can only have up to 3 active quests at a time.')
        })
        
        it('should block if maxSnatchers is reached', async () => {
             // to be implemented with DB operations
        })
    })
    
    describe('submitQuest', () => {
        it('should update status to SUBMITTED', async () => {
            // to be implemented
        })
    })
})
