import { describe, it, expect, beforeEach, vi } from 'vitest'
import { testPrisma } from '../setup'
import { verifyEmail } from '@/actions/verify'
import { signup, authenticate } from '@/actions/auth'

vi.mock('next/navigation', () => ({
    redirect: vi.fn(() => { throw new Error('NEXT_REDIRECT') })
}))

vi.mock('next/headers', () => ({
    headers: vi.fn().mockReturnValue({ get: vi.fn().mockReturnValue('127.0.0.1') })
}))

vi.mock('@/lib/email', () => ({
    sendVerificationEmail: vi.fn().mockResolvedValue(true)
}))

vi.mock('@/auth', () => ({
    signIn: vi.fn(async (provider, credentials) => {
        const user = await testPrisma.user.findUnique({ where: { email: credentials.email } })
        if (!user?.emailVerified) {
            throw new Error('unverified_email')
        }
        return { success: true }
    })
}))
describe('Email Verification Action', () => {
    beforeEach(async () => {
        if (!process.env.DATABASE_URL_TEST) return

        await testPrisma.user.create({
            data: {
                id: 'unverified-user',
                name: 'Unverified',
                email: 'unverified@example.com',
                emailVerified: null,
            }
        })
    })

    it('should verify a valid token and update the user', async () => {
        if (!process.env.DATABASE_URL_TEST) return

        const expires = new Date()
        expires.setHours(expires.getHours() + 1)

        await testPrisma.verificationToken.create({
            data: {
                identifier: 'unverified@example.com',
                token: 'valid-token-123',
                expires
            }
        })

        const result = await verifyEmail('valid-token-123')
        expect(result.success).toBe(true)
        expect(result.message).toBe('Email verified successfully')

        const user = await testPrisma.user.findUnique({ where: { email: 'unverified@example.com' } })
        expect(user?.emailVerified).not.toBeNull()

        const token = await testPrisma.verificationToken.findFirst({ where: { token: 'valid-token-123' } })
        expect(token).toBeNull()
    })

    it('should reject an expired token and delete it', async () => {
        if (!process.env.DATABASE_URL_TEST) return

        const expires = new Date()
        expires.setHours(expires.getHours() - 1)

        await testPrisma.verificationToken.create({
            data: {
                identifier: 'unverified@example.com',
                token: 'expired-token-123',
                expires
            }
        })

        const result = await verifyEmail('expired-token-123')
        expect(result.success).toBe(false)
        expect(result.error).toBe('Token has expired')

        const token = await testPrisma.verificationToken.findFirst({ where: { token: 'expired-token-123' } })
        expect(token).toBeNull()
    })

    it('should handle idempotent verification for already verified users', async () => {
        if (!process.env.DATABASE_URL_TEST) return

        await testPrisma.user.update({
            where: { email: 'unverified@example.com' },
            data: { emailVerified: new Date() }
        })

        const expires = new Date()
        expires.setHours(expires.getHours() + 1)

        await testPrisma.verificationToken.create({
            data: {
                identifier: 'unverified@example.com',
                token: 'idempotent-token-123',
                expires
            }
        })

        const result = await verifyEmail('idempotent-token-123')
        expect(result.success).toBe(true)
        expect(result.message).toBe('Email already verified')
    })

    it('signup creates an UNVERIFIED user and stores a token', async () => {
        if (!process.env.DATABASE_URL_TEST) return

        const formData = new FormData()
        formData.append('email', 'newuser@cyber-univ.ac.id')
        formData.append('password', 'password123')
        formData.append('confirmPassword', 'password123')
        formData.append('name', 'New User')

        try {
            await signup(undefined, formData)
        } catch (e: unknown) {
            if (e instanceof Error) {
                expect(e.message).toBe('NEXT_REDIRECT')
            }
        }

        const user = await testPrisma.user.findUnique({ where: { email: 'newuser@cyber-univ.ac.id' } })
        expect(user).not.toBeNull()
        expect(user?.emailVerified).toBeNull()

        const token = await testPrisma.verificationToken.findFirst({ where: { identifier: 'newuser@cyber-univ.ac.id' } })
        expect(token).not.toBeNull()
        expect(token?.token).toBeDefined()
    })

    it('login is REJECTED for an unverified user', async () => {
        if (!process.env.DATABASE_URL_TEST) return

        const formData = new FormData()
        formData.append('email', 'unverified@example.com')
        formData.append('password', 'password123')

        const res = await authenticate(undefined, formData)
        expect(res).toBe('Please check your email and verify your account before logging in.')
    })
})
