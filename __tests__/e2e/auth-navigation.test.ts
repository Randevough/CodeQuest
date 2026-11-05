import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { signup, authenticate } from '@/actions/auth'
import { authConfig } from '@/auth.config'
import { updateProfile, uploadProfileImage, updateFeaturedBadges } from '@/actions/profile'
import { getWorkspaceQuests, submitQuest, joinQuest } from '@/actions/quest'
import { manualReset, updateUserRole } from '@/actions/admin'
import { requireAuth, requireAdmin } from '@/lib/auth-guard'
import { Header } from '@/components/Header'
import { useSession, signOut } from 'next-auth/react'
import { signIn, auth } from '@/auth'
import { sendVerificationEmail } from '@/lib/email'
import { CredentialsSignin } from 'next-auth'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

interface TestUser {
  id: string
  email: string
  password: string | null
  name: string | null
  role: string
  points: number
  emailVerified: Date | null
  createdAt: Date
  updatedAt: Date
}

interface TestVerificationToken {
  identifier: string
  token: string
  expires: Date
}

const { mockDb, dbStore, resetDbStore, mockRedirect } = vi.hoisted(() => {
  const users: TestUser[] = []
  const verificationTokens: TestVerificationToken[] = []

  function resetDbStore() {
    users.length = 0
    verificationTokens.length = 0
  }

  const mockRedirect = vi.fn((url: string) => {
    const error = new Error(`NEXT_REDIRECT: ${url}`)
    ;(error as unknown as { digest: string }).digest = `NEXT_REDIRECT;${url}`
    throw error
  })

  const mockDb = {
    user: {
      findUnique: vi.fn(async ({ where }: { where: { email?: string; id?: string } }) => {
        if (where.email) {
          return users.find((u) => u.email.toLowerCase() === where.email?.toLowerCase()) ?? null
        }
        if (where.id) {
          return users.find((u) => u.id === where.id) ?? null
        }
        return null
      }),
      create: vi.fn(async ({ data }: { data: { email: string; password?: string; name?: string; role?: string } }) => {
        const record: TestUser = {
          id: `usr-${users.length + 1}`,
          email: data.email,
          password: data.password ?? null,
          name: data.name ?? data.email.split('@')[0],
          role: data.role ?? 'Member',
          points: 0,
          emailVerified: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        users.push(record)
        return record
      }),
      update: vi.fn(async ({ where, data }: { where: { id?: string; email?: string }; data: Record<string, unknown> }) => {
        const user = users.find((u) => (where.id && u.id === where.id) || (where.email && u.email === where.email))
        if (!user) throw new Error('User not found')
        Object.assign(user, data, { updatedAt: new Date() })
        return user
      }),
    },
    verificationToken: {
      create: vi.fn(async ({ data }: { data: { identifier: string; token: string; expires: Date } }) => {
        verificationTokens.push(data)
        return data
      }),
      findFirst: vi.fn(async ({ where }: { where: { identifier?: string; token?: string } }) => {
        return (
          verificationTokens.find(
            (t) => (where.identifier && t.identifier === where.identifier) || (where.token && t.token === where.token)
          ) ?? null
        )
      }),
    },
    snatch: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
    },
    penalty: {
      findFirst: vi.fn().mockResolvedValue(null),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    quest: {
      findUnique: vi.fn().mockResolvedValue(null),
    },
    $transaction: vi.fn(async (cb: unknown) => {
      if (typeof cb === 'function') {
        return (cb as (db: unknown) => unknown)(mockDb)
      }
      return []
    }),
  }

  return { mockDb, dbStore: { users, verificationTokens }, resetDbStore, mockRedirect }
})

vi.mock('@/lib/db', () => ({
  prisma: mockDb,
}))

vi.mock('@/auth', () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: (headerName: string) => (headerName === 'x-forwarded-for' ? '127.0.0.1' : null),
  })),
  cookies: vi.fn(async () => ({
    get: () => undefined,
  })),
}))

vi.mock('@/lib/email', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(true),
}))

vi.mock('@/actions/notification', () => ({
  getNotifications: vi.fn().mockResolvedValue({ success: true, data: [] }),
  getUnreadNotificationCount: vi.fn().mockResolvedValue({ success: true, count: 0 }),
  markNotificationRead: vi.fn().mockResolvedValue({ success: true }),
  markAllNotificationsRead: vi.fn().mockResolvedValue({ success: true }),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn().mockResolvedValue(true),
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, limit: 10, remaining: 10, reset: Date.now() + 60000 }),
  resetRateLimitStore: vi.fn(),
}))

vi.mock('@vercel/blob', () => ({
  put: vi.fn().mockResolvedValue({ url: 'https://blob.vercel-storage.com/avatar.png' }),
}))

describe('End-to-End Authentication & Navigation Journey', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetDbStore()
  })

  describe('1. Signup Validation Flow', () => {
    it('rejects signup when password and confirmation mismatch', async () => {
      const formData = new FormData()
      formData.append('name', 'Mismatch User')
      formData.append('email', 'user@example.com')
      formData.append('password', 'SecretPass123!')
      formData.append('confirmPassword', 'DifferentPass456!')

      const result = await signup(undefined, formData)

      expect(result).toBe('Passwords do not match')
      expect(dbStore.users).toHaveLength(0)
      expect(dbStore.verificationTokens).toHaveLength(0)
      expect(sendVerificationEmail).not.toHaveBeenCalled()
    })

    it('rejects signup when email belongs to disposable domain', async () => {
      const formData = new FormData()
      formData.append('name', 'Temp User')
      formData.append('email', 'throwaway@tempmail.com')
      formData.append('password', 'ValidPass123!')
      formData.append('confirmPassword', 'ValidPass123!')

      const result = await signup(undefined, formData)

      expect(result).toBe('Temporary and disposable email addresses are not allowed.')
      expect(dbStore.users).toHaveLength(0)
      expect(dbStore.verificationTokens).toHaveLength(0)
      expect(sendVerificationEmail).not.toHaveBeenCalled()
    })

    it('successfully creates unverified user and verification token for generic email', async () => {
      const formData = new FormData()
      formData.append('name', 'Generic Adventurer')
      formData.append('email', 'user@example.com')
      formData.append('password', 'ValidPassword123!')
      formData.append('confirmPassword', 'ValidPassword123!')

      let caughtError: unknown
      try {
        await signup(undefined, formData)
      } catch (err: unknown) {
        caughtError = err
      }

      expect(caughtError).toBeDefined()
      expect((caughtError as Error).message).toBe('NEXT_REDIRECT: /login?signedUp=true')
      expect(mockRedirect).toHaveBeenCalledWith('/login?signedUp=true')

      expect(dbStore.users).toHaveLength(1)
      const createdUser = dbStore.users[0]
      expect(createdUser.email).toBe('user@example.com')
      expect(createdUser.name).toBe('Generic Adventurer')
      expect(createdUser.emailVerified).toBeNull()
      expect(createdUser.password).not.toBe('ValidPassword123!')

      expect(dbStore.verificationTokens).toHaveLength(1)
      const createdToken = dbStore.verificationTokens[0]
      expect(createdToken.identifier).toBe('user@example.com')
      expect(createdToken.token).toBeDefined()
      expect(sendVerificationEmail).toHaveBeenCalledWith('user@example.com', createdToken.token)
    })
  })

  describe('2. Login Credentials & Route Navigation Journey', () => {
    it('handles unverified email gracefully with verification guidance', async () => {
      dbStore.users.push({
        id: 'usr-unverified',
        email: 'unverified@example.com',
        name: 'Unverified Hero',
        password: 'hashed-password',
        role: 'Member',
        points: 0,
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const unverifiedError = new CredentialsSignin('unverified_email')
      unverifiedError.type = 'CredentialsSignin'
      unverifiedError.code = 'unverified_email'
      vi.mocked(signIn).mockRejectedValueOnce(unverifiedError)

      const formData = new FormData()
      formData.append('email', 'unverified@example.com')
      formData.append('password', 'Password123!')

      const result = await authenticate(undefined, formData)

      expect(result).toBe('Please check your email and verify your account before logging in.')
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'unverified@example.com',
        password: 'Password123!',
        redirectTo: '/?loggedIn=true',
      })
    })

    it('signs in verified regular user and routes to home/workspace', async () => {
      dbStore.users.push({
        id: 'usr-verified',
        email: 'verified@example.com',
        name: 'Verified Adventurer',
        password: 'hashed-password',
        role: 'Member',
        points: 100,
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      vi.mocked(signIn).mockResolvedValueOnce({ ok: true } as never)

      const formData = new FormData()
      formData.append('email', 'verified@example.com')
      formData.append('password', 'Password123!')

      const result = await authenticate(undefined, formData)

      expect(result).toBeUndefined()
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'verified@example.com',
        password: 'Password123!',
        redirectTo: '/?loggedIn=true',
      })
    })

    it('routes admin user to /admin/members dashboard', async () => {
      dbStore.users.push({
        id: 'usr-admin',
        email: 'admin@example.com',
        name: 'Admin Guildmaster',
        password: 'hashed-password',
        role: 'Admin',
        points: 9999,
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      vi.mocked(signIn).mockResolvedValueOnce({ ok: true } as never)

      const formData = new FormData()
      formData.append('email', 'admin@example.com')
      formData.append('password', 'AdminSecret123!')

      const result = await authenticate(undefined, formData)

      expect(result).toBeUndefined()
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'admin@example.com',
        password: 'AdminSecret123!',
        redirectTo: '/admin/members',
      })
    })

    describe('Route navigation callback authorization guards', () => {
      const authorizedCallback = authConfig.callbacks.authorized

      function createMockRequest(pathname: string): NextRequest {
        const url = new URL(`http://localhost:3000${pathname}`)
        return {
          nextUrl: url,
          cookies: {
            get: () => undefined,
          },
        } as unknown as NextRequest
      }

      it('allows admin role to access /admin/members', () => {
        const authPayload = {
          user: { id: 'usr-admin', role: 'Admin', email: 'admin@example.com' },
          expires: new Date(Date.now() + 3600000).toISOString(),
        } as Session

        const result = authorizedCallback({
          auth: authPayload,
          request: createMockRequest('/admin/members'),
        })

        expect(result).toBe(true)
      })

      it('redirects non-admin member accessing /admin/members to /explore', () => {
        const authPayload = {
          user: { id: 'usr-member', role: 'Member', email: 'member@example.com' },
          expires: new Date(Date.now() + 3600000).toISOString(),
        } as Session

        const result = authorizedCallback({
          auth: authPayload,
          request: createMockRequest('/admin/members'),
        })

        expect(result).toBeInstanceOf(Response)
        const response = result as Response
        expect(response.headers.get('location')).toBe('http://localhost:3000/explore')
      })

      it('rejects unauthenticated visitor from /admin/members', () => {
        const result = authorizedCallback({
          auth: null,
          request: createMockRequest('/admin/members'),
        })

        expect(result).toBe(false)
      })

      it('allows authenticated user to access /workspace and /profile', () => {
        const authPayload = {
          user: { id: 'usr-member', role: 'Member', email: 'member@example.com' },
          expires: new Date(Date.now() + 3600000).toISOString(),
        } as Session

        expect(
          authorizedCallback({
            auth: authPayload,
            request: createMockRequest('/workspace'),
          })
        ).toBe(true)

        expect(
          authorizedCallback({
            auth: authPayload,
            request: createMockRequest('/profile'),
          })
        ).toBe(true)
      })

      it('blocks unauthenticated visitor from /workspace and /profile', () => {
        expect(
          authorizedCallback({
            auth: null,
            request: createMockRequest('/workspace'),
          })
        ).toBe(false)

        expect(
          authorizedCallback({
            auth: null,
            request: createMockRequest('/profile'),
          })
        ).toBe(false)
      })

      it('redirects authenticated user visiting /login to /explore', () => {
        const authPayload = {
          user: { id: 'usr-member', role: 'Member', email: 'member@example.com' },
          expires: new Date(Date.now() + 3600000).toISOString(),
        } as Session

        const result = authorizedCallback({
          auth: authPayload,
          request: createMockRequest('/login'),
        })

        expect(result).toBeInstanceOf(Response)
        expect((result as Response).headers.get('location')).toBe('http://localhost:3000/explore')
      })
    })
  })

  describe('3. Protected Action Guards', () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue(null as never)
    })

    it('rejects unauthenticated callers from profile actions', async () => {
      const profileRes = await updateProfile({ name: 'Impostor' })
      expect(profileRes.success).toBe(false)
      expect(profileRes.error).toBe('Unauthorized')

      const formData = new FormData()
      formData.append('file', new File(['binary content'], 'avatar.png', { type: 'image/png' }))
      const imageRes = await uploadProfileImage(formData)
      expect(imageRes.success).toBe(false)
      expect(imageRes.error).toBe('Unauthorized')

      const badgeRes = await updateFeaturedBadges(['badge-1', 'badge-2'])
      expect(badgeRes.success).toBe(false)
      expect(badgeRes.error).toBe('Unauthorized')
    })

    it('rejects unauthenticated callers from workspace actions', async () => {
      const workspaceRes = await getWorkspaceQuests()
      expect(workspaceRes.success).toBe(false)
      expect(workspaceRes.error).toBe('Unauthorized')

      const submitRes = await submitQuest('quest-valid-id', 'https://github.com/org/quest')
      expect(submitRes.success).toBe(false)
      if ('error' in submitRes) {
        expect(submitRes.error).toBe('Unauthorized')
      }

      await expect(joinQuest('quest-valid-id')).rejects.toThrow('NEXT_REDIRECT: /login')
      expect(mockRedirect).toHaveBeenCalledWith('/login')
    })

    it('rejects unauthenticated callers from admin actions and guards', async () => {
      const resetRes = await manualReset('user-1')
      expect(resetRes.success).toBe(false)
      expect(resetRes.error).toMatch(/Unauthorized/i)

      const roleRes = await updateUserRole('user-1', 'Admin')
      expect(roleRes.success).toBe(false)
      expect(roleRes.error).toMatch(/Unauthorized/i)

      await expect(requireAuth()).rejects.toThrow(/Unauthorized/i)
      await expect(requireAdmin()).rejects.toThrow(/Unauthorized/i)
    })
  })

  describe('4. Navigation Header Session State Verification', () => {
    it('renders Sign in action and omits account dropdown menu when unauthenticated', () => {
      vi.mocked(useSession).mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: vi.fn(),
      })

      render(React.createElement(Header))

      const signInLink = screen.getByRole('link', { name: /^sign in$/i })
      expect(signInLink).toBeDefined()
      expect(signInLink.getAttribute('href')).toBe('/login')

      expect(screen.queryByLabelText(/account options menu/i)).toBeNull()
      expect(screen.getByRole('link', { name: /explore quests/i })).toBeDefined()
      expect(screen.getByRole('link', { name: /leaderboard/i })).toBeDefined()
      expect(screen.getByRole('link', { name: /my workspace/i })).toBeDefined()
    })

    it('renders user avatar and interactive account dropdown when authenticated', () => {
      vi.mocked(useSession).mockReturnValue({
        data: {
          user: {
            id: 'usr-hero-1',
            name: 'Aria Silverblade',
            email: 'aria@cyber-univ.ac.id',
            role: 'Member',
            points: 1250,
            image: 'https://images.example.com/avatar.png',
            avatar: null,
            bio: null,
            githubUrl: null,
            linkedinUrl: null,
          },
          expires: new Date(Date.now() + 86400000).toISOString(),
        },
        status: 'authenticated',
        update: vi.fn(),
      })

      render(React.createElement(Header))

      expect(screen.queryByRole('link', { name: /^sign in$/i })).toBeNull()

      const accountTrigger = screen.getByLabelText(/account options menu/i)
      expect(accountTrigger).toBeDefined()
      expect(screen.getByText('Aria Silverblade')).toBeDefined()

      fireEvent.click(accountTrigger)

      expect(screen.getByRole('menu')).toBeDefined()
      expect(screen.getByText('aria@cyber-univ.ac.id')).toBeDefined()
      expect(screen.getByText(/1,250 PTS/)).toBeDefined()

      const profileMenuItem = screen.getByRole('menuitem', { name: /profile/i })
      expect(profileMenuItem).toBeDefined()
      expect(profileMenuItem.getAttribute('href')).toBe('/profile')

      const logoutBtn = screen.getByRole('menuitem', { name: /log out/i })
      expect(logoutBtn).toBeDefined()

      fireEvent.click(logoutBtn)
      expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' })
    })
  })
})
