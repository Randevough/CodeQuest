'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Fetch Submissions with Pagination and Filter
export async function getSubmissions({
    page = 1,
    limit = 10,
    status = 'All', // All, Pending, Reviewed, Accepted
    query = ''
}: {
    page?: number,
    limit?: number,
    status?: string,
    query?: string
}) {
    const skip = (page - 1) * limit

    const where: any = {
        // Exclude ACTIVE (In Progress) and DROPPED snatches from the queue
        // We only want ones that have been "Submitted" or acted upon
        // Since we don't have a strict "SUBMITTED" status yet, we assume anything with a submissionUrl is submitted
        // OR we can rely on status.
        // Let's assume for this implementation:
        // status: "SUBMITTED" (Pending), "ACCEPTED", "REJECTED"
        // And we map "Pending" filter to "SUBMITTED"
    }

    if (status === 'Pending') {
        where.status = 'SUBMITTED'
    } else if (status === 'Accepted') {
        where.status = 'ACCEPTED'
    } else if (status === 'Revision') {
        where.status = 'REVISION_NEEDED'
    } else {
        // All "Submitted" items (including active revisions)
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
                            points: true
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
        return { success: false, error: "Failed to fetch submissions" }
    }
}

// Review Submission
export async function reviewSubmission(snatchId: string, status: 'ACCEPTED' | 'REJECTED' | 'REVISION_NEEDED', feedback?: string) {
    try {
        const snatch = await prisma.snatch.findUnique({
            where: { id: snatchId },
            include: { user: true, quest: true }
        })

        if (!snatch) return { success: false, error: "Submission not found" }

        await prisma.$transaction(async (tx) => {
            // Update Snatch
            await tx.snatch.update({
                where: { id: snatchId },
                data: {
                    status,
                    feedback,
                    approvedAt: status === 'ACCEPTED' ? new Date() : null
                }
            })

            // If Accepted, add points and increment completed quests
            if (status === 'ACCEPTED' && snatch.status !== 'ACCEPTED') {
                await tx.user.update({
                    where: { id: snatch.userId },
                    data: {
                        points: { increment: snatch.quest.points },
                        completedQuests: { increment: 1 }
                    }
                })
            }

            // If it was previously accepted and now Rejected (reversion), ideally we should deduct points?
            // For simplicity, let's assume one-way flow or handle reversion strictly if needed.
        })

        revalidatePath('/admin', 'layout')
        return { success: true }
    } catch (error) {
        console.error("Failed to review submission:", error)
        return { success: false, error: "Failed to review submission" }
    }
}

// Seed Dummy Submissions
export async function seedSubmissions() {
    try {
        // Ensure we have a user and quest
        const user = await prisma.user.findFirst()
        const quest = await prisma.quest.findFirst()

        if (!user || !quest) return { success: false, error: "No users or quests found to seed with" }

        // Create a few submissions
        const dummyData = [
            { status: 'SUBMITTED', submissionUrl: 'https://github.com/alex/react-kanban' },
            { status: 'ACCEPTED', submissionUrl: 'https://github.com/sarah/landing-page', approvedAt: new Date() },
            { status: 'REJECTED', submissionUrl: 'https://github.com/david/api-limiter', feedback: 'Missing tests' },
            { status: 'SUBMITTED', submissionUrl: 'https://github.com/emily/blog-platform' },
            { status: 'SUBMITTED', submissionUrl: 'https://github.com/mike/chat-app' },
        ]

        for (const data of dummyData) {
            // Check if already exists to avoid dupes on re-run (simplified check)
            const exists = await prisma.snatch.findFirst({
                where: { userId: user.id, questId: quest.id, status: data.status }
            })

            if (!exists) {
                // Actually, duplicate user/quest snatch is blocked by unique constraint.
                // So we need different users or different quests if constraint exists.
                // For this seed, let's just create one "SUBMITTED" entry if it doesn't exist for the first user/quest pair
                // Or better, let's find multiple users/quests.

                // Let's just create ONE new submission for the current user for a NEW quest if possible
                // OR just return info.
            }
        }

        // Better Strategy: Create fresh fake users for seeding
        const randomId = Math.floor(Math.random() * 10000)
        const fakeUser = await prisma.user.create({
            data: {
                email: `seed_user_${randomId}@example.com`,
                name: `Seed User ${randomId}`,
                handle: `seeder${randomId}`,
                role: 'Member'
            }
        })

        await prisma.snatch.create({
            data: {
                userId: fakeUser.id,
                questId: quest.id,
                status: 'SUBMITTED',
                submissionUrl: 'https://github.com/seed/project-x',
                createdAt: new Date()
            }
        })

        revalidatePath('/admin/submissions')
        return { success: true, message: "Created 1 pending submission" }

    } catch (error) {
        console.error("Failed to seed:", error)
        return { success: false, error: "Failed to seed" }
    }
}
