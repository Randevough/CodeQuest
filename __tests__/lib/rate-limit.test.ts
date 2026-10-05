import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { rateLimit } from '@/lib/rate-limit'

describe('Rate Limiter', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should allow requests within the limit', async () => {
        const key = `test-ip-${Date.now()}`
        const res1 = await rateLimit(key, 3, 60000)
        const res2 = await rateLimit(key, 3, 60000)
        const res3 = await rateLimit(key, 3, 60000)

        expect(res1).toBe(true)
        expect(res2).toBe(true)
        expect(res3).toBe(true)
    })

    it('should block requests that exceed the limit', async () => {
        const key = `test-block-${Date.now()}`
        await rateLimit(key, 2, 60000)
        await rateLimit(key, 2, 60000)

        const blockedRes = await rateLimit(key, 2, 60000)
        expect(blockedRes).toBe(false)
    })

    it('should reset quota after the time window expires', async () => {
        const key = `test-reset-${Date.now()}`
        await rateLimit(key, 1, 10000)

        const blocked = await rateLimit(key, 1, 10000)
        expect(blocked).toBe(false)

        // Advance time past the 10000ms window
        vi.advanceTimersByTime(10001)

        const afterReset = await rateLimit(key, 1, 10000)
        expect(afterReset).toBe(true)
    })

    it('should isolate limits between different keys', async () => {
        const keyA = `user-a-${Date.now()}`
        const keyB = `user-b-${Date.now()}`

        await rateLimit(keyA, 1, 60000)
        const blockedA = await rateLimit(keyA, 1, 60000)
        expect(blockedA).toBe(false)

        // keyB should still be allowed
        const allowedB = await rateLimit(keyB, 1, 60000)
        expect(allowedB).toBe(true)
    })
})
