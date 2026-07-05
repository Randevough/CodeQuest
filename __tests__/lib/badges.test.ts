import { describe, it, expect, beforeEach } from 'vitest'
import { testPrisma } from '../setup'
import { checkBadges } from '@/lib/badges'
import { User } from '@prisma/client'

describe('checkBadges', () => {
    let user: User

    beforeEach(async () => {
        if (!process.env.DATABASE_URL_TEST) return
        
        user = await testPrisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                handle: 'testuser'
            }
        })
    })

    it('grants points threshold badge', async () => {
        if (!process.env.DATABASE_URL_TEST) return

        await testPrisma.user.update({
            where: { id: user.id },
            data: { points: 100 }
        })

        const newBadges = await checkBadges(user.id)
        expect(newBadges?.length).toBeGreaterThan(0)
        expect(newBadges?.some(b => b === 'Centurion')).toBe(true)

        // Idempotent test
        const newBadges2 = await checkBadges(user.id)
        expect(newBadges2?.length ?? 0).toBe(0)
    })

    it('grants quest threshold badge', async () => {
        if (!process.env.DATABASE_URL_TEST) return

        await testPrisma.user.update({
            where: { id: user.id },
            data: { completedQuests: 1 }
        })

        const newBadges = await checkBadges(user.id)
        expect(newBadges?.some(b => b === 'First Blood')).toBe(true)
    })
    
    it('grants difficulty badge for Hard quests', async () => {
        if (!process.env.DATABASE_URL_TEST) return
        
        const quest = await testPrisma.quest.create({
            data: {
                id: 'dummy-quest-hard',
                title: 'Hard Quest',
                description: 'Hard',
                points: 100,
                difficulty: 'Hard',
                category: 'Frontend',
                maxSnatchers: 1
            }
        })

        await testPrisma.snatch.create({
            data: {
                userId: user.id,
                questId: quest.id,
                status: 'ACCEPTED'
            }
        })

        const newBadges = await checkBadges(user.id)
        expect(newBadges?.some(b => b === 'Hardened Veteran')).toBe(true)
    })
})
