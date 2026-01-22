'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// Stub for auth - in real app would verify session
async function getCurrentUser() {
    // TODO: Implement actual auth
    // For now, return a fixed ID or similar, or create a new user if not exists?
    // Let's assume we pass userId or it's handled. 
    // For scaffolding, I'll just create a dummy user or fetch the first one.
    const user = await prisma.user.findFirst();
    if (user) return user;

    return await prisma.user.create({
        data: {
            email: 'demo@example.com',
            name: 'Demo User'
        }
    });
}

export async function joinQuest(questId: string) {
    const user = await getCurrentUser();

    if (!user) throw new Error("Unauthorized");

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
            const quest = await tx.quest.findUniqueOrThrow({
                where: { id: questId },
                include: { _count: { select: { snatches: true } } }
            });

            if (quest._count.snatches >= quest.maxSnatchers) {
                throw new Error("Quest is full");
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
    if (!user) throw new Error("Unauthorized");

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
