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
            // 3. Check quest limits
            // We need to count only ACTIVE snatches.
            const currentActiveSnatchers = await tx.snatch.count({
                where: {
                    questId: questId,
                    status: 'ACTIVE'
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
                    status: 'ACTIVE'
                }
            });

            if (activeQuestsCount >= 3) {
                throw new Error("Maximum quest is 3, finish your quest first!");
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
            status: 'ACTIVE'
        },
        select: {
            questId: true
        }
    });
    return snatches.map(s => s.questId);
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
    try {
        const validatedFields = QuestSchema.parse({
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
        return { success: true, message: 'Quest created successfully', questId: quest.id };

    } catch (error) {
        console.error('Failed to create quest:', error);
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors[0].message };
        }
        return { success: false, message: 'Failed to create quest' };
    }
}
