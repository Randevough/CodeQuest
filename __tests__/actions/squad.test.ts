import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testPrisma } from '../setup'
import { createSquad, joinSquad, leaveSquad } from '@/actions/squad'
import { auth } from '@/auth'

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}))

describe('Squad Actions', () => {
    let leader: { id: string; email: string; name: string | null }
    let member: { id: string; email: string; name: string | null }

    beforeEach(async () => {
        vi.clearAllMocks()

        if (!process.env.DATABASE_URL_TEST) return

        leader = await testPrisma.user.create({
            data: {
                id: 'squad-leader',
                name: 'Squad Leader',
                email: 'leader@cyber-univ.ac.id',
                emailVerified: new Date()
            }
        })

        member = await testPrisma.user.create({
            data: {
                id: 'squad-member',
                name: 'Squad Member',
                email: 'member@cyber-univ.ac.id',
                emailVerified: new Date()
            }
        })

        // Default session is leader
        vi.mocked(auth).mockResolvedValue({
            user: { id: leader.id, email: leader.email, name: leader.name }
        } as unknown as Awaited<ReturnType<typeof auth>>)
    })

    describe('createSquad', () => {
        it('should allow user to create a squad for a multi-snatcher quest', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: {
                    id: 'q-multi',
                    title: 'Multi Player Quest',
                    description: 'Desc',
                    maxSnatchers: 4,
                    status: 'Active'
                }
            })

            const res = await createSquad(quest.id, 'Phoenix Squad')
            expect(res.success).toBe(true)
            expect(res.squadId).toBeDefined()

            const squad = await testPrisma.squad.findUnique({
                where: { id: res.squadId }
            })
            expect(squad?.name).toBe('Phoenix Squad')
            expect(squad?.createdById).toBe(leader.id)

            const snatch = await testPrisma.snatch.findUnique({
                where: { userId_questId: { userId: leader.id, questId: quest.id } }
            })
            expect(snatch?.squadId).toBe(res.squadId)
            expect(snatch?.status).toBe('ACTIVE')
        })

        it('should reject squad creation for solo quests (maxSnatchers <= 1)', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const soloQuest = await testPrisma.quest.create({
                data: {
                    id: 'q-solo',
                    title: 'Solo Quest',
                    description: 'Desc',
                    maxSnatchers: 1,
                    status: 'Active'
                }
            })

            const res = await createSquad(soloQuest.id, 'Solo Squad')
            expect(res.success).toBe(false)
            expect(res.error).toBe('This quest does not support squads.')
        })

        it('should reject squad creation if user is already working on the quest', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: {
                    id: 'q-already-active',
                    title: 'Already Active Quest',
                    description: 'Desc',
                    maxSnatchers: 3,
                    status: 'Active'
                }
            })
            await testPrisma.snatch.create({
                data: { userId: leader.id, questId: quest.id, status: 'ACTIVE' }
            })

            const res = await createSquad(quest.id)
            expect(res.success).toBe(false)
            expect(res.error).toBe('You are already working on this quest.')
        })

        it('should block squad creation if user has reached mission capacity (3 active quests)', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            for (let i = 0; i < 3; i++) {
                const q = await testPrisma.quest.create({
                    data: { id: `q-cap-${i}`, title: `Cap Q ${i}`, description: 'Desc', maxSnatchers: 2 }
                })
                await testPrisma.snatch.create({
                    data: { userId: leader.id, questId: q.id, status: 'ACTIVE' }
                })
            }

            const targetQuest = await testPrisma.quest.create({
                data: { id: 'q-target-cap', title: 'Target', description: 'Desc', maxSnatchers: 3 }
            })

            const res = await createSquad(targetQuest.id)
            expect(res.success).toBe(false)
            expect(res.error).toBe('Mission capacity reached. Finish an active quest to snatch more.')
        })
    })

    describe('joinSquad', () => {
        it('should allow another member to join an existing squad', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-join-squad', title: 'Joinable Squad Quest', description: 'Desc', maxSnatchers: 3 }
            })

            const squad = await testPrisma.squad.create({
                data: { id: 'sq-join-target', questId: quest.id, createdById: leader.id, name: 'Open Squad' }
            })
            await testPrisma.snatch.create({
                data: { userId: leader.id, questId: quest.id, status: 'ACTIVE', squadId: squad.id }
            })

            // Switch session to member
            vi.mocked(auth).mockResolvedValue({
                user: { id: member.id, email: member.email, name: member.name }
            } as unknown as Awaited<ReturnType<typeof auth>>)

            const res = await joinSquad(squad.id)
            expect(res.success).toBe(true)

            const memberSnatch = await testPrisma.snatch.findUnique({
                where: { userId_questId: { userId: member.id, questId: quest.id } }
            })
            expect(memberSnatch?.squadId).toBe(squad.id)
            expect(memberSnatch?.status).toBe('ACTIVE')
        })

        it('should reject joining if quest capacity is reached', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-full-squad', title: 'Full Squad Quest', description: 'Desc', maxSnatchers: 2 }
            })

            const squad = await testPrisma.squad.create({
                data: { id: 'sq-full', questId: quest.id, createdById: leader.id, name: 'Full Squad' }
            })

            // Fill all 2 slots
            await testPrisma.snatch.create({
                data: { userId: leader.id, questId: quest.id, status: 'ACTIVE', squadId: squad.id }
            })
            const filler = await testPrisma.user.create({
                data: { id: 'user-filler', email: 'filler@cyber-univ.ac.id' }
            })
            await testPrisma.snatch.create({
                data: { userId: filler.id, questId: quest.id, status: 'ACTIVE', squadId: squad.id }
            })

            // Switch session to member
            vi.mocked(auth).mockResolvedValue({
                user: { id: member.id, email: member.email, name: member.name }
            } as unknown as Awaited<ReturnType<typeof auth>>)

            const res = await joinSquad(squad.id)
            expect(res.success).toBe(false)
            expect(res.error).toBe('Quest is full')
        })
    })

    describe('leaveSquad', () => {
        it('should allow member to leave a squad and mark snatch as DROPPED', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-leave-squad', title: 'Leave Squad Quest', description: 'Desc', maxSnatchers: 3 }
            })

            const squad = await testPrisma.squad.create({
                data: { id: 'sq-leave', questId: quest.id, createdById: leader.id, name: 'Leaving Squad' }
            })

            await testPrisma.snatch.create({
                data: { userId: leader.id, questId: quest.id, status: 'ACTIVE', squadId: squad.id }
            })
            await testPrisma.snatch.create({
                data: { userId: member.id, questId: quest.id, status: 'ACTIVE', squadId: squad.id }
            })

            // Switch to member leaving
            vi.mocked(auth).mockResolvedValue({
                user: { id: member.id, email: member.email, name: member.name }
            } as unknown as Awaited<ReturnType<typeof auth>>)

            const res = await leaveSquad(squad.id)
            expect(res.success).toBe(true)

            const snatch = await testPrisma.snatch.findUnique({
                where: { userId_questId: { userId: member.id, questId: quest.id } }
            })
            expect(snatch?.status).toBe('DROPPED')
            expect(snatch?.squadId).toBeNull()

            // Squad should still exist because leader is still active
            const squadRemaining = await testPrisma.squad.findUnique({ where: { id: squad.id } })
            expect(squadRemaining).not.toBeNull()
        })

        it('should delete squad when the last active member leaves', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const quest = await testPrisma.quest.create({
                data: { id: 'q-leave-last', title: 'Last Member Quest', description: 'Desc', maxSnatchers: 2 }
            })

            const squad = await testPrisma.squad.create({
                data: { id: 'sq-last-member', questId: quest.id, createdById: leader.id, name: 'Solo Leader Squad' }
            })

            await testPrisma.snatch.create({
                data: { userId: leader.id, questId: quest.id, status: 'ACTIVE', squadId: squad.id }
            })

            const res = await leaveSquad(squad.id)
            expect(res.success).toBe(true)

            // Squad must be deleted because 0 active snatches left
            const deletedSquad = await testPrisma.squad.findUnique({ where: { id: squad.id } })
            expect(deletedSquad).toBeNull()
        })
    })
})
