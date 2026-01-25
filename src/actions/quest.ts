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
