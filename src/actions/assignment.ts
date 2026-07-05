'use server'

import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guard'
import { createNotification } from '@/actions/notification'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { hasActivePenalty } from '@/lib/penalty'

export async function getActiveQuestsForAssignment() {
    await requireAdmin()
    return await prisma.quest.findMany({
        where: { status: 'Active' },
        select: { id: true, title: true, maxSnatchers: true },
        orderBy: { createdAt: 'desc' }
    })
}

export async function assignQuest(userId: string, questId: string, force: boolean = false) {
    try {
        await requireAdmin()
        const session = await auth()
        if (!session?.user?.id) throw new Error("Unauthorized")
        
        const adminId = session.user.id

        // 1. Validate quest exists and is Active
        const quest = await prisma.quest.findUnique({
            where: { id: questId },
        })

        if (!quest) {
            return { success: false, error: "Quest not found." }
        }

        if (quest.status !== 'Active') {
            return { success: false, error: "Cannot assign a quest that is not Active." }
        }

        // 2. Validate user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return { success: false, error: "User not found." }
        }

        // 2.5 Check for active penalty
        const isPenalized = await hasActivePenalty(user.id);

        if (isPenalized) {
            return { success: false, error: "User has an active penalty and cannot be assigned quests." }
        }

        // 3. Capacity override logic
        if (quest.maxSnatchers && quest.maxSnatchers > 0) {
            const activeSnatcherCount = await prisma.snatch.count({
                where: {
                    questId: quest.id,
                    status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'ACCEPTED', 'ARCHIVED'] }
                }
            })

            if (activeSnatcherCount >= quest.maxSnatchers && !force) {
                return { 
                    success: false, 
                    error: "CAPACITY_EXCEEDED", 
                    message: "Assigning this quest would exceed its maximum capacity." 
                }
            }
        }

        // 4. Handle all existing snatch states
        const existingSnatch = await prisma.snatch.findUnique({
            where: {
                userId_questId: {
                    userId,
                    questId
                }
            }
        })

        if (existingSnatch) {
            const status = existingSnatch.status
            if (['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'].includes(status)) {
                return { success: false, error: "User is already working on this quest." }
            } else if (['ACCEPTED', 'ARCHIVED'].includes(status)) {
                return { success: false, error: "User has already completed this quest." }
            } else if (['DROPPED', 'REJECTED'].includes(status)) {
                // Reactivate
                await prisma.snatch.update({
                    where: { id: existingSnatch.id },
                    data: {
                        status: 'ACTIVE',
                        assignedById: adminId
                    }
                })
            }
        } else {
            // Create a new one
            await prisma.snatch.create({
                data: {
                    userId,
                    questId,
                    status: 'ACTIVE',
                    assignedById: adminId
                }
            })
        }

        // 5. Emit notification
        try {
            await createNotification({
                userId: userId,
                type: 'QUEST_ASSIGNED',
                message: `An admin assigned you the quest "${quest.title}".`,
                link: '/workspace'
            })
        } catch (notifError) {
            console.error("Failed to create assignment notification:", notifError)
        }

        // 6. Revalidate paths
        revalidatePath('/workspace')
        revalidatePath('/admin/members')
        revalidatePath('/admin/manage-quests')

        return { success: true }
    } catch (error) {
        console.error("Failed to assign quest:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to assign quest." }
    }
}
