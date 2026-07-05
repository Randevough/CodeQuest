'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { Prisma } from '@prisma/client'
import { checkBadges } from "@/lib/badges"
import { requireAdmin } from "@/lib/auth-guard"
import { createNotification } from "@/actions/notification"

export async function getSubmissions({
    page = 1,
    limit = 10,
    status = 'All',
    query = ''
}: {
    page?: number,
    limit?: number,
    status?: string,
    query?: string
}) {
    await requireAdmin()

    const skip = (page - 1) * limit

    const where: Prisma.SnatchWhereInput = {}

    if (status === 'Pending') {
        where.status = 'SUBMITTED'
    } else if (status === 'Accepted') {
        where.status = 'ACCEPTED'
    } else if (status === 'Revision') {
        where.status = 'REVISION_NEEDED'
    } else {
        where.status = { in: ['SUBMITTED', 'ACCEPTED', 'REJECTED', 'REVISION_NEEDED'] }
    }

    if (query) {
        where.OR = [
            { user: { name: { contains: query } } },
            { user: { email: { contains: query } } },
            { quest: { title: { contains: query } } }
        ]
    }

    try {
        const [snatches, total] = await Promise.all([
            prisma.snatch.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true,
                            handle: true
                        }
                    },
                    squad: {
                        include: {
                            snatches: {
                                where: { status: { notIn: ['DROPPED', 'REJECTED'] } },
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            avatar: true,
                                            handle: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    quest: {
                        select: {
                            id: true,
                            title: true,
                            points: true,
                            description: true,
                            requirements: true,
                            difficulty: true,
                            category: true,
                            deadline: true,
                            snatches: {
                                where: { status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'ACCEPTED'] } },
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            avatar: true,
                                            handle: true
                                        }
                                    }
                                },
                                take: 10
                            }
                        }
                    }
                },
                orderBy: { updatedAt: 'desc' },
                take: limit,
                skip
            }),
            prisma.snatch.count({ where })
        ])

        return {
            success: true,
            data: snatches,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                page,
                limit
            }
        }
    } catch (error) {
        console.error("Failed to fetch submissions:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to fetch submissions" }
    }
}

export async function reviewSubmission(snatchId: string, status: 'ACCEPTED' | 'REJECTED' | 'REVISION_NEEDED', feedback?: string) {
    try {
        await requireAdmin()

        const originalSnatch = await prisma.snatch.findUnique({
            where: { id: snatchId },
            include: { user: true, quest: true }
        })

        if (!originalSnatch) return { success: false, error: "Submission not found" }

        // Find all snatches that should be updated
        let targetSnatches = [originalSnatch]
        if (originalSnatch.squadId) {
            targetSnatches = await prisma.snatch.findMany({
                // Only update snatches that share the exact same status we are reviewing
                where: { squadId: originalSnatch.squadId, status: originalSnatch.status },
                include: { user: true, quest: true }
            })
        }

        await prisma.$transaction(async (tx) => {
            const snatchIds = targetSnatches.map(s => s.id)
            await tx.snatch.updateMany({
                where: { id: { in: snatchIds } },
                data: {
                    status,
                    feedback,
                    approvedAt: status === 'ACCEPTED' ? new Date() : null
                }
            })

            if (status === 'ACCEPTED' && originalSnatch.status !== 'ACCEPTED') {
                for (const s of targetSnatches) {
                    await tx.user.update({
                        where: { id: s.userId },
                        data: {
                            points: { increment: s.quest.points },
                            completedQuests: { increment: 1 }
                        }
                    })
                }
            }
        })

        // Badge check AFTER transaction commits (Safeguard #1)
        const badgesEarnedByUserId: Record<string, string[]> = {}
        if (status === 'ACCEPTED' && originalSnatch.status !== 'ACCEPTED') {
            for (const s of targetSnatches) {
                badgesEarnedByUserId[s.userId] = (await checkBadges(s.userId)) || []
            }
        }

        // Emit notifications — best-effort, failure-isolated (Safeguard #2)
        for (const s of targetSnatches) {
            try {
                if (status === 'ACCEPTED') {
                    await createNotification({
                        userId: s.userId,
                        type: 'SUBMISSION_ACCEPTED',
                        message: `Your submission for "${s.quest.title}" has been accepted! +${s.quest.points} XP`,
                        link: '/workspace',
                    })
                } else if (status === 'REVISION_NEEDED') {
                    await createNotification({
                        userId: s.userId,
                        type: 'SUBMISSION_REVISION',
                        message: `Your submission for "${s.quest.title}" needs revision. Check admin feedback.`,
                        link: '/workspace',
                    })
                } else if (status === 'REJECTED') {
                    await createNotification({
                        userId: s.userId,
                        type: 'SUBMISSION_REJECTED',
                        message: `Your submission for "${s.quest.title}" was not accepted.`,
                        link: '/workspace',
                    })
                }
            } catch (notifError) {
                console.error('Failed to create submission notification:', notifError)
            }

            // Emit badge notifications — best-effort (Safeguard #2)
            const newBadges = badgesEarnedByUserId[s.userId] || []
            for (const badgeName of newBadges) {
                try {
                    await createNotification({
                        userId: s.userId,
                        type: 'BADGE_EARNED',
                        message: `You earned the "${badgeName}" badge!`,
                        link: '/profile',
                    })
                } catch (badgeNotifError) {
                    console.error('Failed to create badge notification:', badgeNotifError)
                }
            }
        }

        revalidatePath('/admin', 'layout')
        return { success: true }
    } catch (error) {
        console.error("Failed to review submission:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to review submission" }
    }
}

