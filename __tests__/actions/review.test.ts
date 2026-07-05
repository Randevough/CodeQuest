import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testPrisma } from '../setup'
import { reviewSubmission } from '@/actions/submission'

vi.mock('@/lib/auth-guard', () => ({
    requireAdmin: vi.fn().mockResolvedValue(true)
}))

describe('reviewSubmission', () => {
    beforeEach(async () => {
        if (!process.env.DATABASE_URL_TEST) return

        await testPrisma.user.create({
            data: { id: 'admin-user', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' }
        })
    })

    it('should award points and complete quest upon ACCEPTED', async () => {
        // to be implemented with db
    })

    it('should settle all squad members and emit notifications', async () => {
        // to be implemented
    })
})
