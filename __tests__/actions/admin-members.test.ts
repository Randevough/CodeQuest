import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testPrisma } from '../setup'
import { assignQuest, getActiveQuestsForAssignment } from '@/actions/assignment'
import { updateUserRole, deactivateUser, deleteUser, manualReset } from '@/actions/admin'
import { requireAdmin } from '@/lib/auth-guard'
import { auth } from '@/auth'
import type { Mock } from 'vitest'

type AdminUser = Awaited<ReturnType<typeof requireAdmin>>

vi.mock('@/lib/auth-guard', () => ({
    requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-manager', role: 'Admin' } as unknown as AdminUser),
    requireAuth: vi.fn().mockResolvedValue({ id: 'admin-manager', role: 'Admin' } as unknown as AdminUser),
}))

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}))

type MockAuthReturn = {
    user?: {
        id?: string
        email?: string
        role?: string
    }
} | null

const mockAuth = auth as unknown as Mock<() => Promise<MockAuthReturn>>

describe('Admin Member Management Actions', () => {
    let adminUser: { id: string; email: string }
    let targetUser: { id: string; email: string }

    beforeEach(async () => {
        vi.clearAllMocks()
        vi.mocked(requireAdmin).mockResolvedValue({ id: 'admin-manager', role: 'Admin' } as unknown as AdminUser)

        if (!process.env.DATABASE_URL_TEST) return

        adminUser = await testPrisma.user.create({
            data: { id: 'admin-manager', email: 'admin-manager@cyber-univ.ac.id', name: 'Admin Manager', role: 'Admin' }
        })

        targetUser = await testPrisma.user.create({
            data: { id: 'target-member', email: 'target@cyber-univ.ac.id', name: 'Target Member', role: 'Member' }
        })

        mockAuth.mockResolvedValue({
            user: { id: adminUser.id, email: adminUser.email, role: 'Admin' }
        })
    })

    describe('assignQuest', () => {
        it('should successfully assign an active quest to target user', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-assign-1', title: 'Assigned Quest', description: 'Desc', status: 'Active', maxSnatchers: 3 }
            })

            const res = await assignQuest(targetUser.id, quest.id)
            expect(res.success).toBe(true)

            const snatch = await testPrisma.snatch.findUnique({
                where: { userId_questId: { userId: targetUser.id, questId: quest.id } }
            })
            expect(snatch).not.toBeNull()
            expect(snatch?.status).toBe('ACTIVE')
            expect(snatch?.assignedById).toBe(adminUser.id)
        })

        it('should block assignment if quest capacity is reached and force is false', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const other = await testPrisma.user.create({
                data: { id: 'user-other-occupant', email: 'other-occ@cyber-univ.ac.id' }
            })

            const quest = await testPrisma.quest.create({
                data: { id: 'q-assign-full', title: 'Full Quest', description: 'Desc', status: 'Active', maxSnatchers: 1 }
            })

            await testPrisma.snatch.create({
                data: { userId: other.id, questId: quest.id, status: 'ACTIVE' }
            })

            const res = await assignQuest(targetUser.id, quest.id, false)
            expect(res.success).toBe(false)
            expect(res.error).toBe('CAPACITY_EXCEEDED')
        })

        it('should allow assignment if force is true even if quest capacity is reached', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const other = await testPrisma.user.create({
                data: { id: 'user-occ-2', email: 'occ2@cyber-univ.ac.id' }
            })

            const quest = await testPrisma.quest.create({
                data: { id: 'q-force-assign', title: 'Force Assign Quest', description: 'Desc', status: 'Active', maxSnatchers: 1 }
            })

            await testPrisma.snatch.create({
                data: { userId: other.id, questId: quest.id, status: 'ACTIVE' }
            })

            const res = await assignQuest(targetUser.id, quest.id, true)
            expect(res.success).toBe(true)

            const snatch = await testPrisma.snatch.findUnique({
                where: { userId_questId: { userId: targetUser.id, questId: quest.id } }
            })
            expect(snatch?.status).toBe('ACTIVE')
        })

        it('should reactivate a DROPPED snatch when assigned', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-reactivate', title: 'Reactivate Quest', description: 'Desc', status: 'Active', maxSnatchers: 2 }
            })

            await testPrisma.snatch.create({
                data: { userId: targetUser.id, questId: quest.id, status: 'DROPPED' }
            })

            const res = await assignQuest(targetUser.id, quest.id)
            expect(res.success).toBe(true)

            const snatch = await testPrisma.snatch.findUnique({
                where: { userId_questId: { userId: targetUser.id, questId: quest.id } }
            })
            expect(snatch?.status).toBe('ACTIVE')
            expect(snatch?.assignedById).toBe(adminUser.id)
        })

        it('should return active quests list for assignment', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            await testPrisma.quest.createMany({
                data: [
                    { id: 'q-list-active', title: 'Active Listing', description: 'Desc', status: 'Active' },
                    { id: 'q-list-draft', title: 'Draft Listing', description: 'Desc', status: 'Draft' },
                ]
            })

            const quests = await getActiveQuestsForAssignment()
            expect(quests.some(q => q.id === 'q-list-active')).toBe(true)
            expect(quests.every(q => q.id !== 'q-list-draft')).toBe(true)
        })
    })

    describe('Member Role and Account Actions', () => {
        it('should update user role to Admin', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const res = await updateUserRole(targetUser.id, 'Admin')
            expect(res.success).toBe(true)

            const updated = await testPrisma.user.findUnique({ where: { id: targetUser.id } })
            expect(updated?.role).toBe('Admin')
        })

        it('should deactivate a user by creating an administrative penalty', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const res = await deactivateUser(targetUser.id)
            expect(res.success).toBe(true)

            const penalty = await testPrisma.penalty.findFirst({
                where: { userId: targetUser.id, reason: 'Administrative Deactivation' }
            })
            expect(penalty).not.toBeNull()
        })

        it('should reset/clear penalties for a user via manualReset', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            await testPrisma.penalty.create({
                data: {
                    userId: targetUser.id,
                    reason: 'Test Penalty',
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60)
                }
            })

            const res = await manualReset(targetUser.id)
            expect(res.success).toBe(true)

            const penalties = await testPrisma.penalty.findMany({ where: { userId: targetUser.id } })
            expect(penalties.length).toBe(0)
        })

        it('should delete a user and cascade their related entities', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-for-del-user', title: 'Q', description: 'D', status: 'Active' }
            })
            await testPrisma.snatch.create({
                data: { userId: targetUser.id, questId: quest.id, status: 'ACTIVE' }
            })

            const res = await deleteUser(targetUser.id)
            expect(res.success).toBe(true)

            const deletedUser = await testPrisma.user.findUnique({ where: { id: targetUser.id } })
            expect(deletedUser).toBeNull()

            const deletedSnatch = await testPrisma.snatch.findFirst({ where: { userId: targetUser.id } })
            expect(deletedSnatch).toBeNull()
        })
    })
})
