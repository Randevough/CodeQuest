'use server'

import { put } from '@vercel/blob'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function uploadProfileImage(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized' }
    }

    const file = formData.get('file') as File
    if (!file) {
        return { success: false, error: 'No file provided' }
    }

    // Validation
    if (file.size > 2 * 1024 * 1024) { // 2MB
        return { success: false, error: 'File size must be less than 2MB' }
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        return { success: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
    }

    try {
        const userId = session.user.id
        const filename = `${userId}-${Date.now()}.${file.name.split('.').pop()}`

        const blob = await put(`avatars/${filename}`, file, {
            access: 'public',
        })

        // Update user in database
        await prisma.user.update({
            where: { id: userId },
            data: {

                avatar: blob.url // Keep avatar in sync for backward compatibility/simplicity
            }
        })

        revalidatePath('/profile')
        return { success: true, url: blob.url }
    } catch (error) {
        console.error('Upload failed:', error)
        return { success: false, error: 'Failed to upload image' }
    }
}

import { z } from 'zod'

interface UpdateProfileData {
    name?: string
    bio?: string
    githubUrl?: string
    linkedinUrl?: string
}

const profileSchema = z.object({
    name: z.string().optional(),
    bio: z.string().max(160).optional(),
    githubUrl: z.string().url().refine(val => val.startsWith('https:'), { message: 'URL must use HTTPS' }).optional().or(z.literal('')),
    linkedinUrl: z.string().url().refine(val => val.startsWith('https:'), { message: 'URL must use HTTPS' }).optional().or(z.literal(''))
})

export async function updateProfile(data: UpdateProfileData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized' }
    }

    const validated = profileSchema.safeParse(data);
    if (!validated.success) {
        return { success: false, error: validated.error.issues[0].message }
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: validated.data.name,
                bio: validated.data.bio,
                githubUrl: validated.data.githubUrl,
                linkedinUrl: validated.data.linkedinUrl
            }
        })

        revalidatePath('/profile')
        return { success: true }
    } catch (error) {
        console.error('Profile update failed:', error)
        return { success: false, error: 'Failed to update profile' }
    }
}

export async function updateFeaturedBadges(badgeIds: string[]) {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized' }
    }

    // Limit to 3 featured badges max
    const limited = badgeIds.slice(0, 3)

    try {
        const userId = session.user.id

        // Reset all featured flags for this user
        await prisma.userBadge.updateMany({
            where: { userId },
            data: { isFeatured: false }
        })

        // Set selected ones as featured
        if (limited.length > 0) {
            await prisma.userBadge.updateMany({
                where: { userId, badgeId: { in: limited } },
                data: { isFeatured: true }
            })
        }

        revalidatePath('/profile')
        return { success: true }
    } catch (error) {
        console.error('Failed to update featured badges:', error)
        return { success: false, error: 'Failed to update featured badges' }
    }
}
