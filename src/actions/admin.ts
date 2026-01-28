'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function manualReset(userId: string) {
    try {
        await prisma.penalty.deleteMany({
            where: {
                userId: userId,
            }
        })
        revalidatePath('/admin/members')
        return { success: true }
    } catch (error) {
        console.error("Failed to reset penalty:", error)
        return { success: false, error: "Failed to reset penalty" }
    }
}

// Update User Role
export async function updateUserRole(userId: string, role: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role }
        })
        revalidatePath('/admin/members')
        return { success: true }
    } catch (error) {
        console.error("Failed to update role:", error)
        return { success: false, error: "Failed to update role" }
    }
}

// Deactivate User (apply long-term penalty)
export async function deactivateUser(userId: string) {
    try {
        await prisma.penalty.create({
            data: {
                userId,
                reason: "Administrative Deactivation",
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10) // 10 years
            }
        })
        revalidatePath('/admin/members')
        return { success: true }
    } catch (error) {
        console.error("Failed to deactivate user:", error)
        return { success: false, error: "Failed to deactivate user" }
    }
}

