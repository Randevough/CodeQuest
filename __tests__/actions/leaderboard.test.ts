import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getLeaderboardStanding, getLeaderboardUsers } from '@/actions/user'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import type { User } from '@prisma/client'

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}))

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>

describe('Leaderboard Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getLeaderboardStanding', () => {
    it('returns null when user is not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null)

      const result = await getLeaderboardStanding()
      expect(result).toBeNull()
    })

    it('returns null when session has no user id or email', async () => {
      mockAuth.mockResolvedValueOnce({ user: {} })

      const result = await getLeaderboardStanding()
      expect(result).toBeNull()
    })

    it('calculates standing for top rank user (rank 1: pointsToNext = 0, isTop = true)', async () => {
      mockAuth.mockResolvedValueOnce({
        user: { id: 'top-user-id', email: 'top@cyber-univ.ac.id' }
      })

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: 'top-user-id',
        name: 'Top Scorer',
        avatar: 'https://example.com/avatar.png',
        points: 2000,
      } as unknown as User)

      // 0 users have > 2000 points
      vi.mocked(prisma.user.count).mockResolvedValueOnce(0)

      const result = await getLeaderboardStanding()

      expect(result).not.toBeNull()
      expect(result?.rank).toBe(1)
      expect(result?.isTop).toBe(true)
      expect(result?.pointsToNext).toBe(0)
      expect(result?.points).toBe(2000)
      expect(result?.name).toBe('Top Scorer')
    })

    it('calculates standing for tied top rank users (both rank 1: pointsToNext = 0, isTop = true)', async () => {
      mockAuth.mockResolvedValueOnce({
        user: { id: 'tied-user-id', email: 'tied@cyber-univ.ac.id' }
      })

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: 'tied-user-id',
        name: 'Tied Leader',
        avatar: null,
        points: 1500,
      } as unknown as User)

      // 0 users have > 1500 points
      vi.mocked(prisma.user.count).mockResolvedValueOnce(0)

      const result = await getLeaderboardStanding()

      expect(result?.rank).toBe(1)
      expect(result?.isTop).toBe(true)
      expect(result?.pointsToNext).toBe(0)
    })

    it('calculates standing with tie-breaker when points are tied', async () => {
      mockAuth.mockResolvedValueOnce({
        user: { id: 'tied-user', email: 'tied@cyber-univ.ac.id' }
      })

      const now = new Date()
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: 'tied-user',
        name: 'Tied User',
        points: 500,
        completedQuests: 3,
        createdAt: now,
      } as unknown as User)

      // Count returns 2 users ahead (either more points or same points with better tie-breaker)
      vi.mocked(prisma.user.count).mockResolvedValueOnce(2)

      // Next user above has same points (500), but more completed quests
      vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
        points: 500,
      } as unknown as User)

      const result = await getLeaderboardStanding()

      expect(result?.rank).toBe(3)
      expect(result?.isTop).toBe(false)
      // Needs at least 1 point to pass tied user above
      expect(result?.pointsToNext).toBe(1)
    })

    it('calculates standing and pointsToNext accurately for non-top rank user', async () => {
      mockAuth.mockResolvedValueOnce({
        user: { id: 'user-2', email: 'second@cyber-univ.ac.id' }
      })

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: 'user-2',
        name: 'Second Place',
        avatar: null,
        points: 850,
      } as unknown as User)

      // 1 user has > 850 points -> rank 2
      vi.mocked(prisma.user.count).mockResolvedValueOnce(1)

      // User just above has 1000 points
      vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
        points: 1000,
      } as unknown as User)

      const result = await getLeaderboardStanding()

      expect(result?.rank).toBe(2)
      expect(result?.isTop).toBe(false)
      // pointsToNext = 1000 - 850 + 1 = 151
      expect(result?.pointsToNext).toBe(151)
      expect(result?.points).toBe(850)
    })

    it('handles user with zero points accurately', async () => {
      mockAuth.mockResolvedValueOnce({
        user: { id: 'newbie-id', email: 'newbie@cyber-univ.ac.id' }
      })

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: 'newbie-id',
        name: 'Newbie',
        avatar: null,
        points: 0,
      } as unknown as User)

      // 5 users have > 0 points -> rank 6
      vi.mocked(prisma.user.count).mockResolvedValueOnce(5)

      // Next user above has 25 points
      vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
        points: 25,
      } as unknown as User)

      const result = await getLeaderboardStanding()

      expect(result?.rank).toBe(6)
      expect(result?.isTop).toBe(false)
      // pointsToNext = 25 - 0 + 1 = 26
      expect(result?.pointsToNext).toBe(26)
    })

    it('falls back to email lookup when lookup by user id returns null', async () => {
      mockAuth.mockResolvedValueOnce({
        user: { id: 'unknown-id', email: 'exists@cyber-univ.ac.id' }
      })

      // First call by ID fails
      vi.mocked(prisma.user.findUnique)
        .mockResolvedValueOnce(null)
        // Second call by email succeeds
        .mockResolvedValueOnce({
          id: 'real-db-id',
          name: 'Real User',
          avatar: null,
          points: 500,
        } as unknown as User)

      vi.mocked(prisma.user.count).mockResolvedValueOnce(2)
      vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({ points: 600 } as unknown as User)

      const result = await getLeaderboardStanding()

      expect(result?.id).toBe('real-db-id')
      expect(result?.rank).toBe(3)
      expect(result?.pointsToNext).toBe(101)
      expect(result?.isTop).toBe(false)
    })

    it('returns null when user is not found in database', async () => {
      mockAuth.mockResolvedValueOnce({
        user: { id: 'ghost-user', email: 'ghost@cyber-univ.ac.id' }
      })

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      const result = await getLeaderboardStanding()
      expect(result).toBeNull()
    })

    it('handles database errors gracefully and returns null', async () => {
      mockAuth.mockResolvedValueOnce({
        user: { id: 'user-id', email: 'user@cyber-univ.ac.id' }
      })

      vi.mocked(prisma.user.findUnique).mockRejectedValueOnce(new Error('DB connection failed'))

      const result = await getLeaderboardStanding()
      expect(result).toBeNull()
    })
  })

  describe('getLeaderboardUsers', () => {
    it('returns mapped leaderboard users and total count', async () => {
      const mockDbUsers = [
        {
          id: 'user_1',
          name: 'Alice',
          avatar: 'https://example.com/alice.png',
          role: 'Member',
          handle: 'alice_dev',
          points: 1200,
          email: 'alice@cyber-univ.ac.id',
          _count: { snatches: 8 }
        },
        {
          id: 'user_2',
          name: 'Bob',
          avatar: null,
          role: null,
          handle: null,
          points: 900,
          email: 'bob@cyber-univ.ac.id',
          _count: { snatches: 4 }
        }
      ]

      vi.mocked(prisma.user.findMany).mockResolvedValueOnce(
        mockDbUsers as unknown as Array<User & { _count: { snatches: number } }>
      )
      vi.mocked(prisma.user.count).mockResolvedValueOnce(2)

      const result = await getLeaderboardUsers(1, 20)

      expect(result.total).toBe(2)
      expect(result.users).toHaveLength(2)
      expect(result.users[0]).toEqual({
        id: 'user_1',
        name: 'Alice',
        avatar: 'https://example.com/alice.png',
        role: 'Member',
        handle: 'alice_dev',
        points: 1200,
        completedQuests: 8,
        email: 'alice@cyber-univ.ac.id'
      })
      // Defaults for null role and handle
      expect(result.users[1].role).toBe('Member')
      expect(result.users[1].handle).toBe('@unknown')
      expect(result.users[1].completedQuests).toBe(4)
    })

    it('handles negative or zero page gracefully', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValueOnce([])
      vi.mocked(prisma.user.count).mockResolvedValueOnce(0)

      const result = await getLeaderboardUsers(-1, 10)

      expect(result.users).toEqual([])
      expect(result.total).toBe(0)
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10
        })
      )
    })

    it('orders users with tie-breaker: points desc, completedQuests desc, createdAt asc', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValueOnce([])
      vi.mocked(prisma.user.count).mockResolvedValueOnce(0)

      await getLeaderboardUsers(1, 10)

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [
            { points: 'desc' },
            { completedQuests: 'desc' },
            { createdAt: 'asc' }
          ]
        })
      )
    })

    it('returns empty array on database error in production/test', async () => {
      vi.mocked(prisma.user.findMany).mockRejectedValueOnce(new Error('DB failure'))

      const result = await getLeaderboardUsers(1, 20)
      expect(result.users).toEqual([])
      expect(result.total).toBe(0)
    })
  })
})
