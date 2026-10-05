import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testPrisma } from '../setup'
import {
    updateProfile,
    updateFeaturedBadges,
    uploadProfileImage
} from '@/actions/profile'
import { auth } from '@/auth'
import type { Mock } from 'vitest'

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}))

vi.mock('@vercel/blob', () => ({
    put: vi.fn().mockResolvedValue({ url: 'https://blob.vercel-storage.com/avatar.png' })
}))

type MockAuthReturn = {
    user?: {
        id?: string
        email?: string
        name?: string
    }
} | null

const mockAuth = auth as unknown as Mock<() => Promise<MockAuthReturn>>

describe('Profile Actions', () => {
    let testUser: { id: string; email: string }

    beforeEach(async () => {
        vi.clearAllMocks()

        if (!process.env.DATABASE_URL_TEST) return

        testUser = await testPrisma.user.create({
            data: {
                id: 'user-profile-test',
                name: 'Profile Tester',
                email: 'profile@cyber-univ.ac.id',
                emailVerified: new Date()
            }
        })

        mockAuth.mockResolvedValue({
            user: { id: testUser.id, email: testUser.email }
        })
    })

    describe('updateProfile', () => {
        it('should update user profile details with valid HTTPS URLs', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            const res = await updateProfile({
                name: 'New Name',
                bio: 'Fullstack developer exploring CodeQuest.',
                githubUrl: 'https://github.com/profiletester',
                linkedinUrl: 'https://linkedin.com/in/profiletester'
            })

            expect(res.success).toBe(true)

            const updated = await testPrisma.user.findUnique({
                where: { id: testUser.id }
            })
            expect(updated?.name).toBe('New Name')
            expect(updated?.bio).toBe('Fullstack developer exploring CodeQuest.')
            expect(updated?.githubUrl).toBe('https://github.com/profiletester')
        })

        it('should reject bio that exceeds 160 characters', async () => {
            const longBio = 'a'.repeat(161)
            const res = await updateProfile({ bio: longBio })

            expect(res.success).toBe(false)
            expect(res.error).toBeDefined()
        })

        it('should reject non-HTTPS URLs', async () => {
            const res = await updateProfile({
                githubUrl: 'http://insecure-github.com/profile'
            })

            expect(res.success).toBe(false)
            expect(res.error).toBe('URL must use HTTPS')
        })

        it('should reject when unauthenticated', async () => {
            mockAuth.mockResolvedValueOnce(null)

            const res = await updateProfile({ name: 'Hacker' })
            expect(res.success).toBe(false)
            expect(res.error).toBe('Unauthorized')
        })
    })

    describe('updateFeaturedBadges', () => {
        it('should update featured badges and cap selection at 3 items', async () => {
            if (!process.env.DATABASE_URL_TEST) return

            // Seed 4 badges
            const b1 = await testPrisma.badge.create({ data: { slug: 'b-1', name: 'B1', description: 'D1', category: 'POINTS' } })
            const b2 = await testPrisma.badge.create({ data: { slug: 'b-2', name: 'B2', description: 'D2', category: 'POINTS' } })
            const b3 = await testPrisma.badge.create({ data: { slug: 'b-3', name: 'B3', description: 'D3', category: 'POINTS' } })
            const b4 = await testPrisma.badge.create({ data: { slug: 'b-4', name: 'B4', description: 'D4', category: 'POINTS' } })

            await testPrisma.userBadge.createMany({
                data: [
                    { userId: testUser.id, badgeId: b1.id, isFeatured: false },
                    { userId: testUser.id, badgeId: b2.id, isFeatured: false },
                    { userId: testUser.id, badgeId: b3.id, isFeatured: false },
                    { userId: testUser.id, badgeId: b4.id, isFeatured: false },
                ]
            })

            // Pass 4 badges, only first 3 should be featured
            const res = await updateFeaturedBadges([b1.id, b2.id, b3.id, b4.id])
            expect(res.success).toBe(true)

            const featuredCount = await testPrisma.userBadge.count({
                where: { userId: testUser.id, isFeatured: true }
            })
            expect(featuredCount).toBe(3)

            const b4UserBadge = await testPrisma.userBadge.findUnique({
                where: { userId_badgeId: { userId: testUser.id, badgeId: b4.id } }
            })
            expect(b4UserBadge?.isFeatured).toBe(false)
        })

        it('should reject when unauthenticated', async () => {
            mockAuth.mockResolvedValueOnce(null)

            const res = await updateFeaturedBadges(['some-id'])
            expect(res.success).toBe(false)
            expect(res.error).toBe('Unauthorized')
        })
    })

    describe('uploadProfileImage', () => {
        it('should reject when no file is provided in FormData', async () => {
            const formData = new FormData()
            const res = await uploadProfileImage(formData)

            expect(res.success).toBe(false)
            expect(res.error).toBe('No file provided')
        })

        it('should reject file that exceeds 2MB limit', async () => {
            const largeFile = new File(['x'.repeat(2 * 1024 * 1024 + 1)], 'big.png', { type: 'image/png' })
            const formData = new FormData()
            formData.append('file', largeFile)

            const res = await uploadProfileImage(formData)
            expect(res.success).toBe(false)
            expect(res.error).toBe('File size must be less than 2MB')
        })

        it('should reject file with non-image MIME type', async () => {
            const pdfFile = new File(['%PDF-1.4'], 'document.pdf', { type: 'application/pdf' })
            const formData = new FormData()
            formData.append('file', pdfFile)

            const res = await uploadProfileImage(formData)
            expect(res.success).toBe(false)
            expect(res.error).toBe('Only JPEG, PNG, and WebP images are allowed')
        })
    })
})
