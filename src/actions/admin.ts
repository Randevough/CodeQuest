'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-guard"

const VALID_ROLES = ['Admin', 'Member'] as const

function isValidId(id: unknown): id is string {
    return typeof id === 'string' && id.trim().length > 0 && id.length <= 100
}

export async function manualReset(userId: string) {
    try {
        await requireAdmin()
        if (!isValidId(userId)) {
            return { success: false, error: "Invalid user ID" }
        }
        await prisma.penalty.deleteMany({
            where: { userId }
        })
        revalidatePath('/admin/members')
        return { success: true }
    } catch (error) {
        console.error("Failed to reset penalty:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to reset penalty" }
    }
}

export async function updateUserRole(userId: string, role: string) {
    try {
        await requireAdmin()
        if (!isValidId(userId)) {
            return { success: false, error: "Invalid user ID" }
        }
        if (!role || !VALID_ROLES.includes(role as typeof VALID_ROLES[number])) {
            return { success: false, error: "Invalid role specified" }
        }
        await prisma.user.update({
            where: { id: userId },
            data: { role }
        })
        revalidatePath('/admin/members')
        return { success: true }
    } catch (error) {
        console.error("Failed to update role:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to update role" }
    }
}

export async function deactivateUser(userId: string) {
    try {
        await requireAdmin()
        if (!isValidId(userId)) {
            return { success: false, error: "Invalid user ID" }
        }
        await prisma.penalty.create({
            data: {
                userId,
                reason: "Administrative Deactivation",
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10)
            }
        })
        revalidatePath('/admin/members')
        return { success: true }
    } catch (error) {
        console.error("Failed to deactivate user:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to deactivate user" }
    }
}

export async function deleteUser(userId: string) {
    try {
        await requireAdmin()
        if (!isValidId(userId)) {
            return { success: false, error: "Invalid user ID" }
        }
        await prisma.$transaction([
            prisma.snatch.deleteMany({ where: { userId } }),
            prisma.penalty.deleteMany({ where: { userId } }),
            prisma.userBadge.deleteMany({ where: { userId } }),
            prisma.account.deleteMany({ where: { userId } }),
            prisma.user.delete({ where: { id: userId } })
        ])
        revalidatePath('/admin/members')
        return { success: true }
    } catch (error) {
        console.error("Failed to delete user:", error)
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete user" }
    }
}

