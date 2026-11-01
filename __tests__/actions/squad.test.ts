import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSquad, joinSquad, leaveSquad } from '@/actions/squad'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/actions/notification', () => ({
  createNotification: vi.fn().mockResolvedValue({ id: 'notif-1' }),
}))

const mockTx = {
  quest: {
    findUniqueOrThrow: vi.fn(),
    findUnique: vi.fn(),
  },
  squad: {
    create: vi.fn(),
    findUniqueOrThrow: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  snatch: {
    count: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  penalty: {
    findFirst: vi.fn(),
  },
}

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(async (cb: (tx: typeof mockTx) => Promise<unknown>) => {
      return await cb(mockTx)
    }),
  },
}))

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>

describe('Squad Server Actions', () => {
  const mockUser = {
    id: 'user-1',
    name: 'Alice',
    email: 'alice@example.com',
  }

  beforeEach(() => {
    vi.resetAllMocks()
    mockAuth.mockResolvedValue({ user: mockUser })
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never)

    // Default mockTx behavior: no penalties, active quest with maxSnatchers 5
    mockTx.penalty.findFirst.mockResolvedValue(null)
    mockTx.quest.findUniqueOrThrow.mockResolvedValue({
      id: 'quest-1',
      status: 'Active',
      maxSnatchers: 5,
      deadline: null,
    })
    mockTx.squad.create.mockResolvedValue({ id: 'squad-1' })
    mockTx.snatch.count.mockResolvedValue(0)
    mockTx.snatch.findUnique.mockResolvedValue(null)
    mockTx.snatch.create.mockResolvedValue({ id: 'snatch-1' })
    mockTx.snatch.update.mockResolvedValue({ id: 'snatch-1' })
  })

  describe('createSquad', () => {
    it('redirects to /login if user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null)
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      await createSquad('quest-1')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('rejects creating squad if user has an active penalty', async () => {
      mockTx.penalty.findFirst.mockResolvedValue({
        id: 'pen-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 100000),
      })

      const res = await createSquad('quest-1')
      expect(res.success).toBe(false)
      expect(res.error).toMatch(/penalty/i)
    })

    it('rejects creating squad if quest is not Active (e.g. Closed or Draft)', async () => {
      mockTx.quest.findUniqueOrThrow.mockResolvedValue({
        id: 'quest-1',
        status: 'Closed',
        maxSnatchers: 3,
        deadline: null,
      })

      const res = await createSquad('quest-1')
      expect(res.success).toBe(false)
      expect(res.error).toMatch(/not.*available|Closed/i)
    })

    it('rejects creating squad if quest is past deadline', async () => {
      mockTx.quest.findUniqueOrThrow.mockResolvedValue({
        id: 'quest-1',
        status: 'Active',
        maxSnatchers: 3,
        deadline: new Date(Date.now() - 100000),
      })

      const res = await createSquad('quest-1')
      expect(res.success).toBe(false)
      expect(res.error).toMatch(/deadline/i)
    })

    it('rejects creating squad if quest maxSnatchers <= 1', async () => {
      mockTx.quest.findUniqueOrThrow.mockResolvedValue({
        id: 'quest-1',
        status: 'Active',
        maxSnatchers: 1,
        deadline: null,
      })

      const res = await createSquad('quest-1')
      expect(res.success).toBe(false)
      expect(res.error).toBe('This quest does not support squads.')
    })

    it('rejects creating squad if quest is full', async () => {
      mockTx.quest.findUniqueOrThrow.mockResolvedValue({
        id: 'quest-1',
        status: 'Active',
        maxSnatchers: 2,
        deadline: null,
      })
      mockTx.snatch.count.mockResolvedValueOnce(2) // 2 active snatchers >= 2

      const res = await createSquad('quest-1')
      expect(res.success).toBe(false)
      expect(res.error).toBe('Quest is full')
    })
  })

  describe('joinSquad', () => {
    it('rejects joining squad if user has an active penalty', async () => {
      mockTx.penalty.findFirst.mockResolvedValue({
        id: 'pen-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 100000),
      })

      const res = await joinSquad('squad-1')
      expect(res.success).toBe(false)
      expect(res.error).toMatch(/penalty/i)
    })

    it('rejects joining squad if quest is not Active', async () => {
      mockTx.squad.findUniqueOrThrow.mockResolvedValue({
        id: 'squad-1',
        questId: 'quest-1',
        createdById: 'leader-1',
        quest: { id: 'quest-1', status: 'Closed', maxSnatchers: 4, deadline: null },
      })

      const res = await joinSquad('squad-1')
      expect(res.success).toBe(false)
      expect(res.error).toMatch(/not.*available|Closed|active/i)
    })

    it('rejects joining squad if user already has 3 active quests even if existing snatch was dropped', async () => {
      mockTx.squad.findUniqueOrThrow.mockResolvedValue({
        id: 'squad-1',
        questId: 'quest-1',
        createdById: 'leader-1',
        quest: { id: 'quest-1', status: 'Active', maxSnatchers: 4, deadline: null },
      })
      mockTx.snatch.count
        .mockResolvedValueOnce(1) // currentActiveSnatchers on quest = 1 < 4
        .mockResolvedValueOnce(3) // activeQuestsCount for user = 3
      mockTx.snatch.findUnique.mockResolvedValue({
        id: 'snatch-dropped',
        status: 'DROPPED',
      })

      const res = await joinSquad('squad-1')
      expect(res.success).toBe(false)
      expect(res.error).toMatch(/capacity/i)
    })
  })

  describe('leaveSquad', () => {
    it('reassigns leader to another squad member when leader leaves', async () => {
      mockTx.snatch.findFirst
        .mockResolvedValueOnce({
          id: 'snatch-leader',
          squadId: 'squad-1',
          userId: 'user-1',
          status: 'ACTIVE',
        })
        .mockResolvedValueOnce({
          id: 'snatch-member',
          squadId: 'squad-1',
          userId: 'user-2',
        })

      mockTx.snatch.update.mockResolvedValue({})
      mockTx.snatch.count.mockResolvedValue(1) // 1 member remaining
      mockTx.squad.findUnique.mockResolvedValue({
        id: 'squad-1',
        createdById: 'user-1',
      })
      mockTx.squad.update.mockResolvedValue({})

      const res = await leaveSquad('squad-1')
      expect(res.success).toBe(true)
      expect(mockTx.squad.update).toHaveBeenCalledWith({
        where: { id: 'squad-1' },
        data: { createdById: 'user-2' },
      })
    })

    it('deletes squad when last member leaves', async () => {
      mockTx.snatch.findFirst.mockResolvedValue({
        id: 'snatch-last',
        squadId: 'squad-1',
        userId: 'user-1',
        status: 'ACTIVE',
      })
      mockTx.snatch.update.mockResolvedValue({})
      mockTx.snatch.count.mockResolvedValue(0) // 0 remaining
      mockTx.squad.delete.mockResolvedValue({})

      const res = await leaveSquad('squad-1')
      expect(res.success).toBe(true)
      expect(mockTx.squad.delete).toHaveBeenCalledWith({
        where: { id: 'squad-1' },
      })
    })
  })
})
