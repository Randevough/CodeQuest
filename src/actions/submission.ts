'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { checkBadges } from "@/lib/badges"
import { requireAdmin } from "@/lib/auth-guard"

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

    const where: any = {}

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

        const snatch = await prisma.snatch.findUnique({
            where: { id: snatchId },
            include: { user: true, quest: true }
        })

        if (!snatch) return { success: false, error: "Submission not found" }

        await prisma.$transaction(async (tx) => {
            await tx.snatch.update({
                where: { id: snatchId },
                data: {
                    status,
                    feedback,
                    approvedAt: status === 'ACCEPTED' ? new Date() : null
                }
            })

            if (status === 'ACCEPTED' && snatch.status !== 'ACCEPTED') {
                await tx.user.update({
                    where: { id: snatch.userId },
                    data: {
                        points: { increment: snatch.quest.points },
                        completedQuests: { increment: 1 }
                    }
                })

                await checkBadges(snatch.userId)
            }
        })

        revalidatePath('/admin', 'layout')
        return { success: true }
    } catch (error) {
        console.error("Failed to review submission:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to review submission" }
    }
}

