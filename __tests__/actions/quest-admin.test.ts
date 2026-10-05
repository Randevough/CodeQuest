import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testPrisma } from '../setup'
import {
    createQuest,
    updateQuestStatus,
    deleteQuest,
    duplicateQuest,
    getQuests
} from '@/actions/quest'
import { requireAdmin } from '@/lib/auth-guard'

type AdminUser = Awaited<ReturnType<typeof requireAdmin>>

vi.mock('@/lib/auth-guard', () => ({
    requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'Admin' } as unknown as AdminUser),
    requireAuth: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'Admin' } as unknown as AdminUser)
}))

vi.mock('@/auth', () => ({
    auth: vi.fn().mockResolvedValue({
        user: { id: 'admin-1', email: 'admin@cyber-univ.ac.id', role: 'Admin' }
    })
}))

describe('Admin Quest Management Actions', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
        vi.mocked(requireAdmin).mockResolvedValue({ id: 'admin-1', role: 'Admin' } as unknown as AdminUser)

        if (!process.env.DATABASE_URL_TEST) return

        await testPrisma.user.create({
            data: {
                id: 'admin-1',
                name: 'Admin User',
                email: 'admin@cyber-univ.ac.id',
                role: 'Admin',
                emailVerified: new Date()
            }
        })
    })

    describe('createQuest', () => {
        it('should allow admin to create a quest with valid fields', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const formData = new FormData()
            formData.append('title', 'Build Admin Unit Tests')
            formData.append('description', 'Comprehensive automated test coverage for admin')
            formData.append('category', 'Web')
            formData.append('difficulty', 'Intermediate')
            formData.append('points', '150')
            formData.append('maxSnatchers', '3')
            formData.append('requirements', JSON.stringify(['Prisma', 'Vitest']))
            formData.append('resources', 'https://vitest.dev')

            const res = await createQuest(undefined, formData)
            expect(res.success).toBe(true)
            expect(res.questId).toMatch(/^CQ-\d{4}-\d{3}$/)

            const created = await testPrisma.quest.findUnique({
                where: { id: res.questId }
            })
            expect(created?.title).toBe('Build Admin Unit Tests')
            expect(created?.points).toBe(150)
            expect(created?.difficulty).toBe('Intermediate')
        })

        it('should reject quest creation if required fields are missing', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const formData = new FormData()
            formData.append('title', '') // empty title

            const res = await createQuest(undefined, formData)
            expect(res.success).toBe(false)
            expect(res.message).toBeDefined()
        })

        it('should reject quest creation if user is not an admin', async () => {
            vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Forbidden: Admin access required.'))

            const formData = new FormData()
            formData.append('title', 'Unauthorized Quest')

            const res = await createQuest(undefined, formData)
            expect(res.success).toBe(false)
            expect(res.message).toBe('Forbidden: Admin access required.')
        })
    })

    describe('updateQuestStatus', () => {
        it('should update quest status to Closed', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-status-update', title: 'Status Quest', description: 'Desc', status: 'Active' }
            })

            const res = await updateQuestStatus(quest.id, 'Closed')
            expect(res.success).toBe(true)

            const updated = await testPrisma.quest.findUnique({ where: { id: quest.id } })
            expect(updated?.status).toBe('Closed')
        })

        it('should prevent reverting to Draft if quest has active snatches', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-has-snatches', title: 'Active Quest', description: 'Desc', status: 'Active' }
            })
            await testPrisma.snatch.create({
                data: { userId: 'admin-1', questId: quest.id, status: 'ACTIVE' }
            })

            const res = await updateQuestStatus(quest.id, 'Draft')
            expect(res.success).toBe(false)
            expect('error' in res ? res.error : undefined).toBe('Cannot revert to Draft: Quest has active members.')
        })
    })

    describe('deleteQuest', () => {
        it('should prevent deletion if quest has active members', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-del-blocked', title: 'Active Quest', description: 'Desc', status: 'Active' }
            })
            await testPrisma.snatch.create({
                data: { userId: 'admin-1', questId: quest.id, status: 'ACTIVE' }
            })

            const res = await deleteQuest(quest.id)
            expect(res.success).toBe(false)
            expect('error' in res ? res.error : undefined).toBe('Cannot delete quest: Quest has active members.')
        })

        it('should delete quest successfully if there are no active members', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-del-ok', title: 'Empty Quest', description: 'Desc', status: 'Draft' }
            })

            const res = await deleteQuest(quest.id)
            expect(res.success).toBe(true)

            const deleted = await testPrisma.quest.findUnique({ where: { id: quest.id } })
            expect(deleted).toBeNull()
        })
    })

    describe('duplicateQuest', () => {
        it('should duplicate an existing quest with Copy prefix and Draft status', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const original = await testPrisma.quest.create({
                data: {
                    id: 'q-original',
                    title: 'Original Quest',
                    description: 'Original Desc',
                    category: 'AI',
                    difficulty: 'Advanced',
                    points: 300,
                    status: 'Active'
                }
            })

            const res = await duplicateQuest(original.id)
            expect(res.success).toBe(true)

            const duplicates = await testPrisma.quest.findMany({
                where: { title: 'Original Quest (Copy)' }
            })
            expect(duplicates.length).toBeGreaterThan(0)
            expect(duplicates[0].status).toBe('Draft')
            expect(duplicates[0].category).toBe('AI')
            expect(duplicates[0].points).toBe(300)
        })
    })

    describe('getQuests', () => {
        it('should filter quests by status and return pagination metadata', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            await testPrisma.quest.createMany({
                data: [
                    { id: 'q-filter-1', title: 'Draft Quest', description: 'Desc', status: 'Draft' },
                    { id: 'q-filter-2', title: 'Active Quest', description: 'Desc', status: 'Active' },
                ]
            })

            const res = await getQuests({ status: 'Draft', limit: 10, includeFull: true })
            expect(res.success).toBe(true)
            expect(res.data?.every(q => q.status === 'Draft')).toBe(true)
            expect(res.pagination?.totalItems).toBeGreaterThanOrEqual(1)
        })

        it('should search quests by title substring', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            await testPrisma.quest.create({
                data: { id: 'q-search-unique', title: 'Special Keyword Alpha', description: 'Desc', status: 'Active' }
            })

            const res = await getQuests({ search: 'Special Keyword Alpha', limit: 10, includeFull: true })
            expect(res.success).toBe(true)
            expect(res.data?.some(q => q.id === 'q-search-unique')).toBe(true)
        })
    })
})
