import { prisma } from '@/lib/db'

export async function hasActivePenalty(userId: string): Promise<boolean> {
    const activePenalty = await prisma.penalty.findFirst({
        where: {
            userId: userId,
            expiresAt: { gt: new Date() }
        }
    });

    return activePenalty !== null;
}
