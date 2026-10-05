import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { requireAuth, requireAdmin } from '@/lib/auth-guard'
import { auth } from '@/auth'

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}))

type MockAuthReturn = {
    user?: {
        id?: string
        name?: string
        role?: string
    }
} | null

const mockAuth = auth as unknown as Mock<() => Promise<MockAuthReturn>>

describe('Auth Guards', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('requireAuth', () => {
        it('should return the user when a valid session with user id exists', async () => {
            const mockUser = { id: 'usr-123', name: 'Valid User', role: 'Member' }
            mockAuth.mockResolvedValueOnce({ user: mockUser })

            const user = await requireAuth()
            expect(user).toEqual(mockUser)
        })

        it('should throw Unauthorized error when session is null', async () => {
            mockAuth.mockResolvedValueOnce(null)

            await expect(requireAuth()).rejects.toThrow('Unauthorized: You must be logged in.')
        })

        it('should throw Unauthorized error when session has no user', async () => {
            mockAuth.mockResolvedValueOnce({})

            await expect(requireAuth()).rejects.toThrow('Unauthorized: You must be logged in.')
        })

        it('should throw Unauthorized error when user has no id', async () => {
            mockAuth.mockResolvedValueOnce({ user: { name: 'No ID' } })

            await expect(requireAuth()).rejects.toThrow('Unauthorized: You must be logged in.')
        })
    })

    describe('requireAdmin', () => {
        it('should return the user when session user has Admin role', async () => {
            const mockAdmin = { id: 'admin-1', name: 'Master Admin', role: 'Admin' }
            mockAuth.mockResolvedValueOnce({ user: mockAdmin })

            const user = await requireAdmin()
            expect(user).toEqual(mockAdmin)
        })

        it('should throw Unauthorized error when unauthenticated', async () => {
            mockAuth.mockResolvedValueOnce(null)

            await expect(requireAdmin()).rejects.toThrow('Unauthorized: You must be logged in.')
        })

        it('should throw Forbidden error when authenticated user is not an Admin', async () => {
            const mockMember = { id: 'user-2', name: 'Regular Member', role: 'Member' }
            mockAuth.mockResolvedValueOnce({ user: mockMember })

            await expect(requireAdmin()).rejects.toThrow('Forbidden: Admin access required.')
        })
    })
})
