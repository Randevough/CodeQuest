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

export async function inviteMember() {
    // Placeholder for invite functionality
    // Real implementation would send an email
    console.log("Invite member action triggered")
    return { success: true }
}
