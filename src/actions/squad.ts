'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

async function getCurrentUser() {
    const session = await auth()
    if (!session?.user?.email) return null
    return await prisma.user.findUnique({ where: { email: session.user.email } })
}

export async function createSquad(questId: string, name?: string) {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Check quest limits
            const quest = await tx.quest.findUniqueOrThrow({ where: { id: questId } })
            
            if (quest.maxSnatchers <= 1) {
                throw new Error("This quest does not support squads.")
            }

            const currentActiveSnatchers = await tx.snatch.count({
                where: {
                    questId: questId,
                    status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'ACCEPTED', 'ARCHIVED'] }
                }
            })

            if (currentActiveSnatchers >= quest.maxSnatchers) {
                throw new Error("Quest is full")
            }

            // Check if user already has a snatch for this quest
            const existingSnatch = await tx.snatch.findUnique({
                where: { userId_questId: { userId: user.id, questId: questId } }
            })

            if (existingSnatch && !['DROPPED', 'REJECTED'].includes(existingSnatch.status)) {
                throw new Error("You are already working on this quest.")
            }

            // Check max 3 active
            const activeQuestsCount = await tx.snatch.count({
                where: {
                    userId: user.id,
                    status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'] }
                }
            })

            if (activeQuestsCount >= 3) {
                throw new Error("Mission capacity reached. Finish an active quest to snatch more.")
            }

            // Create squad
            const squad = await tx.squad.create({
                data: {
                    questId,
                    createdById: user.id,
                    name: name || `${user.name || 'User'}'s Squad`
                }
            })

            // Create or reactivate snatch for leader
            if (existingSnatch) {
                await tx.snatch.update({
                    where: { id: existingSnatch.id },
                    data: {
                        status: 'ACTIVE',
                        squadId: squad.id
                    }
                })
            } else {
                await tx.snatch.create({
                    data: {
                        userId: user.id,
                        questId: questId,
                        status: 'ACTIVE',
                        squadId: squad.id
                    }
                })
            }
            
            return squad
        })

        revalidatePath(`/quests/${questId}`)
        revalidatePath('/')
        return { success: true, squadId: result.id }
    } catch (error) {
        console.error("Failed to create squad:", error)
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
}

export async function joinSquad(squadId: string) {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    try {
        await prisma.$transaction(async (tx) => {
            const squad = await tx.squad.findUniqueOrThrow({
                where: { id: squadId },
                include: { quest: true }
            })

            // Check quest capacity
            const currentActiveSnatchers = await tx.snatch.count({
                where: {
                    questId: squad.questId,
                    status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'ACCEPTED', 'ARCHIVED'] }
                }
            })

            if (currentActiveSnatchers >= squad.quest.maxSnatchers) {
                throw new Error("Quest is full")
            }

            // Check existing snatch
            const existingSnatch = await tx.snatch.findUnique({
                where: { userId_questId: { userId: user.id, questId: squad.questId } }
            })

            if (existingSnatch && !['DROPPED', 'REJECTED'].includes(existingSnatch.status)) {
                throw new Error("You are already working on this quest.")
            }

            // Check max 3
            const activeQuestsCount = await tx.snatch.count({
                where: {
                    userId: user.id,
                    status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'] }
                }
            })

            if (activeQuestsCount >= 3 && !existingSnatch) {
                throw new Error("Mission capacity reached.")
            }

            if (existingSnatch) {
                await tx.snatch.update({
                    where: { id: existingSnatch.id },
                    data: { status: 'ACTIVE', squadId: squad.id }
                })
            } else {
                await tx.snatch.create({
                    data: {
                        userId: user.id,
                        questId: squad.questId,
                        status: 'ACTIVE',
                        squadId: squad.id
                    }
                })
            }
        })

        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error("Failed to join squad:", error)
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
}

export async function leaveSquad(squadId: string) {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    try {
        await prisma.$transaction(async (tx) => {
            const snatch = await tx.snatch.findFirst({
                where: { squadId, userId: user.id, status: 'ACTIVE' }
            })

            if (!snatch) throw new Error("You don't have an active snatch in this squad.")

            await tx.snatch.update({
                where: { id: snatch.id },
                data: { status: 'DROPPED', squadId: null }
            })

            // Check if squad is empty
            const remaining = await tx.snatch.count({
                where: { squadId, status: { notIn: ['DROPPED', 'REJECTED'] } }
            })

            if (remaining === 0) {
                await tx.squad.delete({ where: { id: squadId } })
            }
        })

        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error("Failed to leave squad:", error)
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
}
