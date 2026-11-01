import { describe, it, expect, vi, beforeEach } from 'vitest'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import {
    manualReset,
    updateUserRole,
    deactivateUser,
    deleteUser
} from '@/actions/admin'
import {
    createQuest,
    updateQuestStatus,
    deleteQuest,
    duplicateQuest,
    updateQuest,
    joinQuest,
    submitQuest,
    archiveQuest,
    dropQuest
} from '@/actions/quest'
import { updateProfile } from '@/actions/profile'
import { updateProfile as userUpdateProfile } from '@/actions/user'

type ActionErrorResult = { success: boolean; error?: string }

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}))

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
}))

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}))

vi.mock('@/lib/db', () => {
    const mockDb: Record<string, unknown> = {
        user: {
            findUnique: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        quest: {
            findUnique: vi.fn(),
            findFirst: vi.fn(),
            findUniqueOrThrow: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            count: vi.fn(),
        },
        snatch: {
            findUnique: vi.fn(),
            findFirst: vi.fn(),
            count: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            updateMany: vi.fn(),
            deleteMany: vi.fn(),
        },
        penalty: {
            findFirst: vi.fn(),
            create: vi.fn(),
            deleteMany: vi.fn(),
        },
        squad: {
            delete: vi.fn(),
            deleteMany: vi.fn(),
        },
        userBadge: {
            updateMany: vi.fn(),
            deleteMany: vi.fn(),
        },
        account: {
            deleteMany: vi.fn(),
        },
    }
    mockDb.$transaction = vi.fn((cb: unknown) => (typeof cb === 'function' ? (cb as (db: unknown) => unknown)(mockDb) : Promise.resolve([])))
    return { prisma: mockDb as never }
})

describe('Security Guards & Authorization Defenses', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Admin Action Guards (Unauthorized & Non-Admin Access)', () => {
        describe('Unauthenticated User (No Session)', () => {
            beforeEach(() => {
                vi.mocked(auth).mockResolvedValue(null as never)
            })

            it('rejects manualReset when unauthenticated', async () => {
                const res = await manualReset('target-user-1')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Unauthorized/i)
            })

            it('rejects updateUserRole when unauthenticated', async () => {
                const res = await updateUserRole('target-user-1', 'Admin')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Unauthorized/i)
            })

            it('rejects deactivateUser when unauthenticated', async () => {
                const res = await deactivateUser('target-user-1')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Unauthorized/i)
            })

            it('rejects deleteUser when unauthenticated', async () => {
                const res = await deleteUser('target-user-1')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Unauthorized/i)
            })

            it('rejects createQuest when unauthenticated', async () => {
                const formData = new FormData()
                formData.set('title', 'Security Quest')
                formData.set('description', 'A quest description here')
                formData.set('category', 'Security')
                formData.set('difficulty', 'Hard')
                formData.set('points', '500')

                const res = await createQuest(undefined, formData)
                expect(res.success).toBe(false)
                expect(res.message).toMatch(/Unauthorized/i)
            })

            it('rejects updateQuestStatus when unauthenticated', async () => {
                const res = await updateQuestStatus('quest-1', 'Active')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Unauthorized/i)
            })

            it('rejects deleteQuest when unauthenticated', async () => {
                const res = await deleteQuest('quest-1')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Unauthorized/i)
            })

            it('rejects duplicateQuest when unauthenticated', async () => {
                const res = await duplicateQuest('quest-1')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Unauthorized/i)
            })

            it('rejects updateQuest when unauthenticated', async () => {
                const formData = new FormData()
                formData.set('title', 'Updated Quest')
                formData.set('description', 'A valid description for testing')
                formData.set('category', 'Security')
                formData.set('difficulty', 'Medium')
                formData.set('points', '250')

                const res = await updateQuest('quest-1', undefined, formData)
                expect(res.success).toBe(false)
                expect(res.message).toMatch(/Unauthorized/i)
            })
        })

        describe('Normal User (Role: Member) Attempting Admin Actions', () => {
            beforeEach(() => {
                vi.mocked(auth).mockResolvedValue({
                    user: { id: 'member-user', role: 'Member', email: 'member@cyber-univ.ac.id' }
                } as never)
            })

            it('blocks manualReset for normal user', async () => {
                const res = await manualReset('target-user-1')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Forbidden/i)
            })

            it('blocks updateUserRole for normal user', async () => {
                const res = await updateUserRole('target-user-1', 'Admin')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Forbidden/i)
            })

            it('blocks deactivateUser for normal user', async () => {
                const res = await deactivateUser('target-user-1')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Forbidden/i)
            })

            it('blocks deleteUser for normal user', async () => {
                const res = await deleteUser('target-user-1')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Forbidden/i)
            })

            it('blocks createQuest for normal user', async () => {
                const formData = new FormData()
                formData.set('title', 'Member Quest')
                formData.set('description', 'Trying to create quest as member')
                formData.set('category', 'Security')
                formData.set('difficulty', 'Easy')
                formData.set('points', '100')

                const res = await createQuest(undefined, formData)
                expect(res.success).toBe(false)
                expect(res.message).toMatch(/Forbidden/i)
            })

            it('blocks updateQuestStatus for normal user', async () => {
                const res = await updateQuestStatus('quest-1', 'Active')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Forbidden/i)
            })

            it('blocks deleteQuest for normal user', async () => {
                const res = await deleteQuest('quest-1')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Forbidden/i)
            })

            it('blocks duplicateQuest for normal user', async () => {
                const res = await duplicateQuest('quest-1')
                expect(res.success).toBe(false)
                expect((res as ActionErrorResult).error).toMatch(/Forbidden/i)
            })

            it('blocks updateQuest for normal user', async () => {
                const formData = new FormData()
                formData.set('title', 'Member Update')
                formData.set('description', 'Trying to update quest as member')
                formData.set('category', 'Security')
                formData.set('difficulty', 'Easy')
                formData.set('points', '100')

                const res = await updateQuest('quest-1', undefined, formData)
                expect(res.success).toBe(false)
                expect(res.message).toMatch(/Forbidden/i)
            })
        })
    })

    describe('Profile Update Sanitization & Privilege Elevation Prevention', () => {
        beforeEach(() => {
            vi.mocked(auth).mockResolvedValue({
                user: { id: 'normal-user-id', role: 'Member', email: 'member@example.com' }
            } as never)
        })

        it('blocks attempt to elevate role via updateProfile', async () => {
            const res = await updateProfile({
                name: 'Legit Name',
                role: 'Admin',
            } as never)

            expect(res.success).toBe(false)
            expect((res as ActionErrorResult).error).toMatch(/role or points cannot be updated|Unrecognized key/i)
            expect(prisma.user.update).not.toHaveBeenCalled()
        })

        it('blocks attempt to inflate points via updateProfile', async () => {
            const res = await updateProfile({
                name: 'Legit Name',
                points: 999999,
            } as never)

            expect(res.success).toBe(false)
            expect((res as ActionErrorResult).error).toMatch(/role or points cannot be updated|Unrecognized key/i)
            expect(prisma.user.update).not.toHaveBeenCalled()
        })

        it('blocks attempt to tamper with completedQuests counter', async () => {
            const res = await updateProfile({
                completedQuests: 50,
            } as never)

            expect(res.success).toBe(false)
            expect((res as ActionErrorResult).error).toMatch(/role or points cannot be updated|Unrecognized key/i)
            expect(prisma.user.update).not.toHaveBeenCalled()
        })

        it('blocks unrecognized extra keys via strict schema', async () => {
            const res = await updateProfile({
                name: 'Legit Name',
                isSuperAdmin: true,
            } as never)

            expect(res.success).toBe(false)
            expect(prisma.user.update).not.toHaveBeenCalled()
        })

        it('works identically via user.ts re-export', async () => {
            const res = await userUpdateProfile({
                role: 'Admin',
            } as never)

            expect(res.success).toBe(false)
            expect(prisma.user.update).not.toHaveBeenCalled()
        })

        it('blocks unauthenticated profile update', async () => {
            vi.mocked(auth).mockResolvedValue(null as never)

            const res = await updateProfile({ name: 'New Name' })
            expect(res.success).toBe(false)
            expect((res as ActionErrorResult).error).toBe('Unauthorized')
            expect(prisma.user.update).not.toHaveBeenCalled()
        })
    })

    describe('Payload Sanitization & Boundary Handling', () => {
        beforeEach(() => {
            vi.mocked(auth).mockResolvedValue({
                user: { id: 'admin-user', role: 'Admin', email: 'admin@example.com' }
            } as never)
        })

        it('rejects oversized name in updateProfile (> 100 chars)', async () => {
            const res = await updateProfile({
                name: 'A'.repeat(101),
            })

            expect(res.success).toBe(false)
            expect((res as ActionErrorResult).error).toMatch(/must not exceed 100 characters/i)
            expect(prisma.user.update).not.toHaveBeenCalled()
        })

        it('rejects oversized bio in updateProfile (> 160 chars)', async () => {
            const res = await updateProfile({
                bio: 'B'.repeat(161),
            })

            expect(res.success).toBe(false)
            expect((res as ActionErrorResult).error).toMatch(/must not exceed 160 characters/i)
            expect(prisma.user.update).not.toHaveBeenCalled()
        })

        it('rejects non-https URL in updateProfile githubUrl', async () => {
            const res = await updateProfile({
                githubUrl: 'http://github.com/insecure',
            })

            expect(res.success).toBe(false)
            expect((res as ActionErrorResult).error).toMatch(/HTTPS/i)
            expect(prisma.user.update).not.toHaveBeenCalled()
        })

        it('rejects javascript: pseudo-protocol in URLs', async () => {
            const res = await updateProfile({
                githubUrl: 'javascript:alert(1)',
            })

            expect(res.success).toBe(false)
            expect(prisma.user.update).not.toHaveBeenCalled()
        })

        it('rejects oversized URL (> 255 chars) in updateProfile', async () => {
            const res = await updateProfile({
                githubUrl: 'https://github.com/' + 'x'.repeat(260),
            })

            expect(res.success).toBe(false)
            expect(prisma.user.update).not.toHaveBeenCalled()
        })

        it('safely rejects malformed JSON requirements in createQuest without unhandled exception', async () => {
            const formData = new FormData()
            formData.set('title', 'Robust Quest')
            formData.set('description', 'Description with malformed requirements')
            formData.set('category', 'Security')
            formData.set('difficulty', 'Hard')
            formData.set('points', '300')
            formData.set('requirements', '{malformed-json-here')

            const res = await createQuest(undefined, formData)
            expect(res.success).toBe(false)
            expect(res.message).toBe('Invalid requirements format')
            expect(prisma.quest.create).not.toHaveBeenCalled()
        })

        it('safely rejects malformed JSON requirements in updateQuest', async () => {
            const formData = new FormData()
            formData.set('title', 'Robust Quest')
            formData.set('description', 'Description with malformed requirements')
            formData.set('category', 'Security')
            formData.set('difficulty', 'Hard')
            formData.set('points', '300')
            formData.set('requirements', '[1, 2, "not pure strings"]')

            const res = await updateQuest('quest-1', undefined, formData)
            expect(res.success).toBe(false)
            expect(res.message).toBe('Invalid requirements format')
            expect(prisma.quest.update).not.toHaveBeenCalled()
        })

        it('rejects invalid quest status in updateQuestStatus', async () => {
            const res = await updateQuestStatus('quest-1', 'UNAUTHORIZED_STATUS')
            expect(res.success).toBe(false)
            expect((res as ActionErrorResult).error).toBe('Invalid quest status')
            expect(prisma.quest.update).not.toHaveBeenCalled()
        })

        it('rejects invalid role in updateUserRole', async () => {
            const res = await updateUserRole('target-user', 'Owner')
            expect(res.success).toBe(false)
            expect((res as ActionErrorResult).error).toBe('Invalid role specified')
            expect(prisma.user.update).not.toHaveBeenCalled()
        })

        it('rejects empty or whitespace-only userId across admin actions', async () => {
            const res1 = await manualReset('   ')
            expect(res1.success).toBe(false)
            expect((res1 as ActionErrorResult).error).toBe('Invalid user ID')

            const res2 = await updateUserRole('', 'Admin')
            expect(res2.success).toBe(false)
            expect((res2 as ActionErrorResult).error).toBe('Invalid user ID')

            const res3 = await deactivateUser('   ')
            expect(res3.success).toBe(false)
            expect((res3 as ActionErrorResult).error).toBe('Invalid user ID')

            const res4 = await deleteUser('')
            expect(res4.success).toBe(false)
            expect((res4 as ActionErrorResult).error).toBe('Invalid user ID')
        })

        it('rejects invalid submission URL in submitQuest', async () => {
            vi.mocked(auth).mockResolvedValue({
                user: { id: 'user-1', email: 'user@example.com' }
            } as never)

            const resInsecure = await submitQuest('quest-1', 'http://github.com/repo')
            expect(resInsecure.success).toBe(false)
            expect((resInsecure as ActionErrorResult).error).toMatch(/valid URL/i)

            const resOversized = await submitQuest('quest-1', 'https://github.com/' + 'a'.repeat(300))
            expect(resOversized.success).toBe(false)
            expect((resOversized as ActionErrorResult).error).toMatch(/valid URL/i)
        })

        it('rejects invalid quest IDs across quest actions', async () => {
            const resJoin = await joinQuest('   ')
            expect(resJoin.success).toBe(false)

            const resArchive = await archiveQuest('')
            expect(resArchive.success).toBe(false)

            const resDrop = await dropQuest('a'.repeat(101))
            expect(resDrop.success).toBe(false)

            const resSubmit = await submitQuest('', 'https://github.com')
            expect(resSubmit.success).toBe(false)
        })
    })

    describe('IDOR Guards across Quest and Snatch Actions', () => {
        beforeEach(() => {
            vi.mocked(auth).mockResolvedValue({
                user: { id: 'attacker-id', email: 'attacker@cyber-univ.ac.id', role: 'Member' }
            } as never)
            vi.mocked(prisma.user.findUnique).mockResolvedValue({
                id: 'attacker-id',
                email: 'attacker@cyber-univ.ac.id',
                name: 'Attacker User',
                role: 'Member',
                points: 0,
                completedQuests: 0,
            } as never)
        })

        it('prevents archiving a quest when user does not have an accepted snatch for it', async () => {
            vi.mocked(prisma.snatch.findUnique).mockResolvedValue(null)

            const res = await archiveQuest('quest-other')
            expect(res.success).toBe(false)
            expect((res as ActionErrorResult).error).toBe('Quest not found in your list')
            expect(prisma.snatch.update).not.toHaveBeenCalled()
        })

        it('prevents archiving a quest if status is not ACCEPTED', async () => {
            vi.mocked(prisma.snatch.findUnique).mockResolvedValue({
                id: 'snatch-1',
                userId: 'attacker-id',
                questId: 'quest-active',
                status: 'ACTIVE',
            } as never)

            const res = await archiveQuest('quest-active')
            expect(res.success).toBe(false)
            expect((res as ActionErrorResult).error).toBe('Only completed quests can be archived')
            expect(prisma.snatch.update).not.toHaveBeenCalled()
        })

        it('prevents dropping a quest when user does not have an active snatch', async () => {
            vi.mocked(prisma.snatch.findUnique).mockResolvedValue(null)

            const res = await dropQuest('quest-foreign')
            expect(res.success).toBe(false)
            expect((res as ActionErrorResult).error).toMatch(/You do not have an active snatch for this quest/i)
        })

        it('prevents submitting a quest when user has not joined it', async () => {
            vi.mocked(prisma.quest.findUnique).mockResolvedValue({
                id: 'quest-unjoined',
                status: 'Active',
                deadline: null,
            } as never)
            vi.mocked(prisma.snatch.findUnique).mockResolvedValue(null)

            const res = await submitQuest('quest-unjoined', 'https://github.com/my/project')
            expect(res.success).toBe(false)
            expect((res as ActionErrorResult).error).toBe('You have not joined this quest.')
        })
    })
})