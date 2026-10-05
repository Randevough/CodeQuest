import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testPrisma } from '../setup'
import {
    joinQuest,
    submitQuest,
    dropQuest,
    archiveQuest,
    getWorkspaceQuests,
    getQuestUserStatus,
    getUserActiveSnatches
} from '@/actions/quest'

vi.mock('@/lib/auth-guard', () => ({
    requireAuth: vi.fn().mockResolvedValue({ id: 'test-user', email: 'test@example.com' })
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
            if (!process.env.DATABASE_URL_TEST) return

            const otherUser = await testPrisma.user.create({
                data: { id: 'user-other', name: 'Other User', email: 'other@example.com', emailVerified: new Date() }
            })

            const quest = await testPrisma.quest.create({
                data: { id: 'q-maxed', title: 'Maxed Quest', description: 'Desc', status: 'Active', maxSnatchers: 1 }
            })

            await testPrisma.snatch.create({
                data: { userId: otherUser.id, questId: quest.id, status: 'ACTIVE' }
            })

            const res = await joinQuest(quest.id)
            expect(res.error).toBe('Quest is full')
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
        it('should update status to SUBMITTED with valid HTTPS URL', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-submit-1', title: 'Submit Test', description: 'Desc', status: 'Active', maxSnatchers: 5 }
            })
            await testPrisma.snatch.create({
                data: { userId: 'test-user', questId: quest.id, status: 'ACTIVE' }
            })

            const res = await submitQuest(quest.id, 'https://github.com/testuser/repo')
            expect(res.success).toBe(true)

            const updatedSnatch = await testPrisma.snatch.findUnique({
                where: { userId_questId: { userId: 'test-user', questId: quest.id } }
            })
            expect(updatedSnatch?.status).toBe('SUBMITTED')
            expect(updatedSnatch?.submissionUrl).toBe('https://github.com/testuser/repo')
        })

        it('should reject non-HTTPS URLs', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-submit-http', title: 'HTTP Test', description: 'Desc', status: 'Active', maxSnatchers: 5 }
            })
            await testPrisma.snatch.create({
                data: { userId: 'test-user', questId: quest.id, status: 'ACTIVE' }
            })

            const res = await submitQuest(quest.id, 'http://insecure-site.com')
            expect(res.success).toBe(false)
            expect('error' in res ? res.error : undefined).toBe('Please provide a valid URL (max 255 chars)')
        })

        it('should reject invalid URL format', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const res = await submitQuest('q-non-existent', 'not-a-valid-url')
            expect(res.success).toBe(false)
            expect('error' in res ? res.error : undefined).toBe('Please provide a valid URL (max 255 chars)')
        })

        it('should reject submission if quest is past deadline', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const pastDeadline = new Date(Date.now() - 1000 * 60 * 60)
            const quest = await testPrisma.quest.create({
                data: { id: 'q-past-due', title: 'Past Due', description: 'Desc', status: 'Active', maxSnatchers: 5, deadline: pastDeadline }
            })
            await testPrisma.snatch.create({
                data: { userId: 'test-user', questId: quest.id, status: 'ACTIVE' }
            })

            const res = await submitQuest(quest.id, 'https://github.com/testuser/repo')
            expect(res.success).toBe(false)
            expect('error' in res ? res.error : undefined).toBe('Mission Deadline Exceeded. Submission Rejected.')
        })

        it('should reject submission if quest is already completed (ACCEPTED)', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-completed-submit', title: 'Completed', description: 'Desc', status: 'Active', maxSnatchers: 5 }
            })
            await testPrisma.snatch.create({
                data: { userId: 'test-user', questId: quest.id, status: 'ACCEPTED' }
            })

            const res = await submitQuest(quest.id, 'https://github.com/testuser/repo')
            expect(res.success).toBe(false)
            expect('error' in res ? res.error : undefined).toBe('Mission already completed. No further submissions allowed.')
        })

        it('should update all squad members snatches when user is in a squad', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const mate = await testPrisma.user.create({
                data: { id: 'user-mate', name: 'Squad Mate', email: 'mate@example.com', emailVerified: new Date() }
            })

            const quest = await testPrisma.quest.create({
                data: { id: 'q-squad-submit', title: 'Squad Quest', description: 'Desc', status: 'Active', maxSnatchers: 5 }
            })

            const squad = await testPrisma.squad.create({
                data: { id: 'squad-1', questId: quest.id, createdById: 'test-user', name: 'Alpha Squad' }
            })

            await testPrisma.snatch.create({
                data: { userId: 'test-user', questId: quest.id, status: 'ACTIVE', squadId: squad.id }
            })
            await testPrisma.snatch.create({
                data: { userId: mate.id, questId: quest.id, status: 'ACTIVE', squadId: squad.id }
            })

            const res = await submitQuest(quest.id, 'https://github.com/alpha-squad/repo')
            expect(res.success).toBe(true)

            const mateSnatch = await testPrisma.snatch.findUnique({
                where: { userId_questId: { userId: mate.id, questId: quest.id } }
            })
            expect(mateSnatch?.status).toBe('SUBMITTED')
            expect(mateSnatch?.submissionUrl).toBe('https://github.com/alpha-squad/repo')
        })
    })

    describe('dropQuest', () => {
        it('should allow dropping an ACTIVE quest and set status to DROPPED', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-drop-1', title: 'Drop Quest', description: 'Desc', status: 'Active', maxSnatchers: 5 }
            })
            await testPrisma.snatch.create({
                data: { userId: 'test-user', questId: quest.id, status: 'ACTIVE' }
            })

            const res = await dropQuest(quest.id)
            expect(res.success).toBe(true)

            const snatch = await testPrisma.snatch.findUnique({
                where: { userId_questId: { userId: 'test-user', questId: quest.id } }
            })
            expect(snatch?.status).toBe('DROPPED')
        })

        it('should reject dropping if snatch is not in ACTIVE status', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-drop-submitted', title: 'Drop Submitted', description: 'Desc', status: 'Active', maxSnatchers: 5 }
            })
            await testPrisma.snatch.create({
                data: { userId: 'test-user', questId: quest.id, status: 'SUBMITTED' }
            })

            const res = await dropQuest(quest.id)
            expect(res.success).toBe(false)
            expect('error' in res ? res.error : undefined).toBe('You do not have an active snatch for this quest.')
        })
    })

    describe('archiveQuest', () => {
        it('should archive an ACCEPTED quest successfully', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-archive-1', title: 'Archive Quest', description: 'Desc', status: 'Active', maxSnatchers: 5 }
            })
            await testPrisma.snatch.create({
                data: { userId: 'test-user', questId: quest.id, status: 'ACCEPTED' }
            })

            const res = await archiveQuest(quest.id)
            expect(res.success).toBe(true)

            const snatch = await testPrisma.snatch.findUnique({
                where: { userId_questId: { userId: 'test-user', questId: quest.id } }
            })
            expect(snatch?.status).toBe('ARCHIVED')
        })

        it('should reject archiving a quest that is not ACCEPTED', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-archive-active', title: 'Active Quest', description: 'Desc', status: 'Active', maxSnatchers: 5 }
            })
            await testPrisma.snatch.create({
                data: { userId: 'test-user', questId: quest.id, status: 'ACTIVE' }
            })

            const res = await archiveQuest(quest.id)
            expect(res.success).toBe(false)
            expect('error' in res ? res.error : undefined).toBe('Only completed quests can be archived')
        })
    })

    describe('getWorkspaceQuests & getQuestUserStatus', () => {
        it('should return workspace snatches for the authenticated user', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-workspace', title: 'Workspace Quest', description: 'Desc', status: 'Active', maxSnatchers: 5 }
            })
            await testPrisma.snatch.create({
                data: { userId: 'test-user', questId: quest.id, status: 'ACTIVE' }
            })

            const res = await getWorkspaceQuests()
            expect(res.success).toBe(true)
            expect(res.data?.length).toBe(1)
            expect(res.data?.[0].questId).toBe(quest.id)
        })

        it('should return snatch status for getQuestUserStatus', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-status-check', title: 'Status Quest', description: 'Desc', status: 'Active', maxSnatchers: 5 }
            })
            await testPrisma.snatch.create({
                data: {
                    userId: 'test-user',
                    questId: quest.id,
                    status: 'SUBMITTED',
                    submissionUrl: 'https://example.com/demo',
                    feedback: 'Pending review'
                }
            })

            const status = await getQuestUserStatus(quest.id)
            expect(status).not.toBeNull()
            expect(status?.status).toBe('SUBMITTED')
            expect(status?.submissionUrl).toBe('https://example.com/demo')
            expect(status?.feedback).toBe('Pending review')
        })

        it('should return user active snatch quest IDs', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-active-ids', title: 'Active IDs', description: 'Desc', status: 'Active', maxSnatchers: 5 }
            })
            await testPrisma.snatch.create({
                data: { userId: 'test-user', questId: quest.id, status: 'ACTIVE' }
            })

            const ids = await getUserActiveSnatches()
            expect(ids).toContain(quest.id)
        })
    })
})
