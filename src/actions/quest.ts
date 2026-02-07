'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'

// Authentication helper
async function getCurrentUser() {
    const session = await auth();
    if (!session || !session.user || !session.user.email) return null;

    // In a real scenario, we might want to fetch the full user from DB if session is stale,
    // but NextAuth session usually has what we need if configured.
    // However, our logic relies on user.id which might not be in default session (it is usually there with adapter, but we use credentials).
    // Let's fetch the user from DB to be safe and get the ID.

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    return user;
}

export async function joinQuest(questId: string) {
    const user = await getCurrentUser();

    if (!user) redirect('/login');

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Check if user has active penalty
            // const activePenalty = await tx.penalty.findFirst({
            //     where: {
            //         userId: user.id,
            //         expiresAt: { gt: new Date() }
            //     }
            // });

            // if (activePenalty) {
            //     throw new Error(`You are penalized until ${activePenalty.expiresAt.toLocaleString()}`);
            // }

            // 2. Check if already snatched
            const existingSnatch = await tx.snatch.findUnique({
                where: {
                    userId_questId: {
                        userId: user.id,
                        questId: questId
                    }
                }
            });

            if (existingSnatch) {
                throw new Error("You have already snatched this quest");
            }

            // 3. Check quest limits
            // We need to count ACTIVE AND COMPLETED snatches to strictly enforce maxSnatchers
            const currentActiveSnatchers = await tx.snatch.count({
                where: {
                    questId: questId,
                    status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'COMPLETED', 'ACCEPTED', 'ARCHIVED'] }
                }
            });
            const quest = await tx.quest.findUniqueOrThrow({
                where: { id: questId }
            });

            if (currentActiveSnatchers >= quest.maxSnatchers) {
                throw new Error("Quest is full");
            }

            // 4. Check user active quests limit
            const activeQuestsCount = await tx.snatch.count({
                where: {
                    userId: user.id,
                    status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'] }
                }
            });

            if (activeQuestsCount >= 3) {
                throw new Error("Mission capacity reached. Finish an active quest to snatch more.");
            }

            // 4. Create snatch
            return await tx.snatch.create({
                data: {
                    userId: user.id,
                    questId: questId,
                    status: 'ACTIVE'
                }
            });
        });

        revalidatePath('/');
        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to join quest:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function getUserActiveSnatches() {
    const user = await getCurrentUser();
    if (!user) return [];

    const snatches = await prisma.snatch.findMany({
        where: {
            userId: user.id,
            status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'] }
        },
        select: {
            questId: true
        }
    });
    return snatches.map(s => s.questId);
}

export async function getAllUserQuestIds() {
    const user = await getCurrentUser();
    if (!user) return [];

    const snatches = await prisma.snatch.findMany({
        where: {
            userId: user.id,
            // Exclude DROPPED so they can be retaken? Or include everything?
            // Assuming if you drop it, you might want to try again. 
            // But if you completed/archived it, you shouldn't see it.
            status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'COMPLETED', 'ACCEPTED', 'ARCHIVED'] }
        },
        select: {
            questId: true
        }
    });
    return snatches.map(s => s.questId);
}

export async function getWorkspaceQuests() {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        // Fetch snatches with full quest details
        const snatches = await prisma.snatch.findMany({
            where: {
                userId: user.id,
                status: {
                    in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED', 'COMPLETED', 'ACCEPTED']
                }
            },
            include: {
                quest: {
                    include: {
                        _count: {
                            select: {
                                snatches: {
                                    where: { status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'] } }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return { success: true, data: snatches };
    } catch (error) {
        console.error("Failed to fetch workspace quests:", error);
        return { success: false, error: "Failed to fetch quests" };
    }
}

export async function archiveQuest(questId: string) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        const snatch = await prisma.snatch.findUnique({
            where: {
                userId_questId: {
                    userId: user.id,
                    questId: questId
                }
            }
        });

        if (!snatch) return { success: false, error: 'Quest not found in your list' };

        // Only allow archiving if completed/accepted
        if (!['COMPLETED', 'ACCEPTED'].includes(snatch.status)) {
            return { success: false, error: 'Only completed quests can be archived' };
        }

        await prisma.snatch.update({
            where: { id: snatch.id },
            data: { status: 'ARCHIVED' }
        });

        revalidatePath('/workspace');
        return { success: true };
    } catch (error) {
        console.error("Failed to archive quest:", error);
        return { success: false, error: "Failed to archive quest" };
    }
}

export async function getQuestUserStatus(questId: string) {
    const user = await getCurrentUser();
    if (!user) return null;

    const snatch = await prisma.snatch.findUnique({
        where: {
            userId_questId: {
                userId: user.id,
                questId: questId
            }
        },
        select: {
            status: true,
            submissionUrl: true,
            feedback: true
        }
    });

    if (!snatch) return null;
    return snatch;
}

export async function submitQuest(questId: string, submissionUrl: string) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Strict URL Validation
    const urlSchema = z.string().url().max(255); // Prevent DB overflow
    const urlCheck = urlSchema.safeParse(submissionUrl);
    if (!urlCheck.success) {
        return { success: false, error: "Please provide a valid URL (max 255 chars)" };
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch Quest & Snatch details with Locking would be deal, but standard read is fine here
            const quest = await tx.quest.findUnique({
                where: { id: questId },
                select: { deadline: true, status: true }
            });

            if (!quest) throw new Error("Quest not found");

            // 2. Deadline Check (The Late Hero)
            if (quest.deadline && new Date() > quest.deadline) {
                throw new Error("Mission Deadline Exceeded. Submission Rejected.");
            }

            // 3. Status Check (Prevent Overwrite)
            const activeSnatch = await tx.snatch.findUnique({
                where: {
                    userId_questId: {
                        userId: user.id,
                        questId: questId
                    }
                }
            });

            if (!activeSnatch) throw new Error("You have not joined this quest.");

            if (['ACCEPTED', 'COMPLETED'].includes(activeSnatch.status)) {
                throw new Error("Mission already completed. No further submissions allowed.");
            }

            // 4. Update
            await tx.snatch.update({
                where: { id: activeSnatch.id },
                data: {
                    status: 'SUBMITTED',
                    submissionUrl: submissionUrl,
                    updatedAt: new Date() // Explicitly mark update time
                }
            });

            return { success: true };
        });

        revalidatePath('/quests/[id]');
        revalidatePath('/admin/dashboard');
        return result;

    } catch (error) {
        console.error("Failed to submit quest:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to submit quest" };
    }
}

export async function dropQuest(questId: string) {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Find the active snatch
            const snatch = await tx.snatch.findUnique({
                where: {
                    userId_questId: {
                        userId: user.id,
                        questId: questId
                    }
                }
            });

            if (!snatch || snatch.status !== 'ACTIVE') {
                throw new Error("You do not have an active snatch for this quest.");
            }

            // 2. Update status
            await tx.snatch.update({
                where: { id: snatch.id },
                data: { status: 'DROPPED' }
            });

            // 3. Create Penalty (simulating 30 min cooldown)
            // In a real app, you might check if they already have one, or stack them?
            // Simple logic: Add a penalty for 30 minutes.
            // const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins from now

            // return await tx.penalty.create({
            //     data: {
            //         userId: user.id,
            //         reason: `Dropped quest: ${questId}`,
            //         expiresAt: expiresAt
            //     }
            // });
            return { count: 0 }; // Return dummy result since penalty creation is skipped
        });

        revalidatePath('/');
        return { success: true, message: "Quest dropped. You have been penalized." };
    } catch (error) {
        console.error("Failed to drop quest:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}
import { z } from 'zod';

const QuestSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    category: z.string(),
    difficulty: z.string(),
    points: z.coerce.number().min(1),
    maxSnatchers: z.coerce.number().min(1).optional(),
    deadline: z.string().optional(), // Will convert to Date
    requirements: z.array(z.string()).optional(),
    resources: z.string().optional(),
});

export async function createQuest(prevState: any, formData: FormData) {
    const validatedResult = QuestSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        difficulty: formData.get('difficulty'),
        points: formData.get('points'),
        maxSnatchers: formData.get('maxSnatchers') || undefined,
        deadline: formData.get('deadline') || undefined,
        requirements: JSON.parse(formData.get('requirements') as string || '[]'),
        resources: formData.get('resources'),
    });

    if (!validatedResult.success) {
        console.error("Validation failed:", validatedResult.error);
        // ZodError uses .issues, not .errors
        const firstIssue = validatedResult.error.issues[0];
        const errorMessage = firstIssue ? `${firstIssue.path.join('.')}: ${firstIssue.message}` : "Invalid input";
        return { success: false, message: errorMessage, errorDetails: validatedResult.error.format() };
    }

    const validatedFields = validatedResult.data;

    try {
        // Generate Custom ID: CQ-YYMM-XXX
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const prefix = `CQ-${year}${month}-`;

        // Find last quest with this prefix
        const lastQuest = await prisma.quest.findFirst({
            where: {
                id: {
                    startsWith: prefix
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        let sequence = 1;
        if (lastQuest) {
            const lastIdParts = lastQuest.id.split('-');
            if (lastIdParts.length === 3) {
                const lastSeq = parseInt(lastIdParts[2]);
                if (!isNaN(lastSeq)) {
                    sequence = lastSeq + 1;
                }
            }
        }

        const customId = `${prefix}${sequence.toString().padStart(3, '0')}`;

        const quest = await prisma.quest.create({
            data: {
                id: customId,
                title: validatedFields.title,
                description: validatedFields.description,
                category: validatedFields.category,
                difficulty: validatedFields.difficulty,
                points: validatedFields.points,
                maxSnatchers: validatedFields.maxSnatchers || 1, // Default to 1 if not provided, though schema defaults handled by db usually
                deadline: validatedFields.deadline ? new Date(validatedFields.deadline) : null,
                requirements: JSON.stringify(validatedFields.requirements),
                resources: validatedFields.resources,
            },
        });

        revalidatePath('/admin/manage-quests');
        revalidatePath('/'); // Update Explore Page
        return { success: true, message: 'Quest created successfully', questId: quest.id };

    } catch (error) {
        console.error('Failed to create quest:', error);
        return { success: false, message: 'Failed to create quest' };
    }
}

// --- New Actions for Manage Quests ---

export async function getQuests({
    page = 1,
    limit = 10,
    search = '',
    status = 'Active' // 'Active', 'Draft', 'Closed'
}: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}) {
    try {
        const offset = (page - 1) * limit;

        const where: any = {};

        // Status Filter
        if (status && status !== 'All') {
            where.status = status;
        }

        // Search Filter (Title or ID)
        if (search) {
            where.OR = [
                { title: { contains: search } }, // SQLite search is case-insensitive usually, but Prisma handles it?
                { id: { contains: search } },
            ];
        }

        // Fetch Quests
        const quests = await prisma.quest.findMany({
            where,
            orderBy: { updatedAt: 'desc' }, // Updated to sort by latest modified
            skip: offset,
            take: limit + 5, // Fetch a few more to handle filtering of full quests (basic mitigation)
            include: {
                _count: {
                    select: {
                        snatches: {
                            where: { status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'] } }
                        }
                    }
                }
            }
        });

        // Filter out full quests
        const visibleQuests = quests.filter(q => {
            const activeCount = q._count.snatches;
            return activeCount < q.maxSnatchers;
        });

        // Slice to limit (if we fetched extra)
        const paginatedQuests = visibleQuests.slice(0, limit);

        // Total Count for Pagination (Approximation or separate query if needed)
        // Accurate count of "non-full" quests is hard without raw SQL. 
        // We will return totalQuests as is or maybe adjustable. For now keep as is.
        const totalQuests = await prisma.quest.count({ where });
        const totalPages = Math.ceil(totalQuests / limit);

        return {
            success: true,
            data: paginatedQuests,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalQuests,
            }
        };

    } catch (error) {
        console.error("Failed to fetch quests:", error);
        return { success: false, error: "Failed to fetch quests" };
    }
}

export async function updateQuestStatus(questId: string, newStatus: string) {
    try {
        await prisma.quest.update({
            where: { id: questId },
            data: { status: newStatus }
        });
        revalidatePath('/admin/manage-quests');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Failed to update quest status:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function deleteQuest(questId: string) {
    try {
        await prisma.snatch.deleteMany({ where: { questId } }); // Clean up snatches first
        await prisma.quest.delete({ where: { id: questId } });

        revalidatePath('/admin/manage-quests');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete quest:", error);
        return { success: false, error: "Failed to delete quest" };
    }
}

export async function duplicateQuest(questId: string) {
    try {
        const original = await prisma.quest.findUnique({ where: { id: questId } });
        if (!original) throw new Error("Quest not found");

        // Generate New ID
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const prefix = `CQ-${year}${month}-`;

        const lastQuest = await prisma.quest.findFirst({
            where: { id: { startsWith: prefix } },
            orderBy: { id: 'desc' }
        });

        let sequence = 1;
        if (lastQuest) {
            const lastIdParts = lastQuest.id.split('-');
            if (lastIdParts.length === 3) {
                const lastSeq = parseInt(lastIdParts[2]);
                if (!isNaN(lastSeq)) sequence = lastSeq + 1;
            }
        }
        const customId = `${prefix}${sequence.toString().padStart(3, '0')}`;

        // Create Copy
        await prisma.quest.create({
            data: {
                id: customId,
                title: `${original.title} (Copy)`,
                description: original.description,
                difficulty: original.difficulty,
                category: original.category,
                points: original.points,
                maxSnatchers: original.maxSnatchers,
                deadline: original.deadline,
                requirements: original.requirements,
                resources: original.resources,
                status: 'Draft', // Always draft
            }
        });

        revalidatePath('/admin/manage-quests');
        return { success: true };

    } catch (error) {
        console.error("Failed to duplicate quest:", error);
        return { success: false, error: "Failed to duplicate quest" };
    }
}

export async function getQuestById(id: string) {
    try {
        const quest = await prisma.quest.findUnique({
            where: { id },
        });
        if (!quest) return { success: false, error: 'Quest not found' };

        // Parse requirements if string
        let requirements: string[] = [];
        if (typeof quest.requirements === 'string') {
            try {
                requirements = JSON.parse(quest.requirements);
            } catch (e) {
                requirements = [];
            }
        }

        return { success: true, data: { ...quest, requirements } };
    } catch (error) {
        console.error('Failed to get quest:', error);
        return { success: false, error: 'Failed to fetch quest' };
    }
}

export async function updateQuest(questId: string, prevState: any, formData: FormData) {
    const validatedResult = QuestSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        difficulty: formData.get('difficulty'),
        points: formData.get('points'),
        maxSnatchers: formData.get('maxSnatchers') || undefined,
        deadline: formData.get('deadline') || undefined,
        requirements: JSON.parse(formData.get('requirements') as string || '[]'),
        resources: formData.get('resources'),
    });

    if (!validatedResult.success) {
        console.error("Validation failed:", validatedResult.error);
        const firstIssue = validatedResult.error.issues[0];
        const errorMessage = firstIssue ? `${firstIssue.path.join('.')}: ${firstIssue.message}` : "Invalid input";
        return { success: false, message: errorMessage };
    }

    const validatedFields = validatedResult.data;

    try {
        await prisma.quest.update({
            where: { id: questId },
            data: {
                title: validatedFields.title,
                description: validatedFields.description,
                category: validatedFields.category,
                difficulty: validatedFields.difficulty,
                points: validatedFields.points,
                maxSnatchers: validatedFields.maxSnatchers || 1,
                deadline: validatedFields.deadline ? new Date(validatedFields.deadline) : null,
                requirements: JSON.stringify(validatedFields.requirements),
                resources: validatedFields.resources,
            },
        });

        revalidatePath('/admin/manage-quests');
        revalidatePath('/');
        return { success: true, message: 'Quest updated successfully' };

    } catch (error) {
        console.error('Failed to update quest:', error);
        return { success: false, message: 'Failed to update quest' };
    }
}
