import { describe, it, expect, vi, beforeEach } from 'vitest'
import { joinQuest, submitQuest, dropQuest, updateQuestStatus, deleteQuest } from '@/actions/quest'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/auth-guard', () => ({
  requireAdmin: vi.fn().mockResolvedValue(true),
  requireAuth: vi.fn().mockResolvedValue({ id: 'user-1' }),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

const mockTx = {
  quest: {
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
    deleteMany: vi.fn(),
  },
  penalty: {
    findFirst: vi.fn(),
  },
  squad: {
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
}

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    quest: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    snatch: {
      count: vi.fn(),
      deleteMany: vi.fn(),
    },
    squad: {
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(async (arg: unknown) => {
      if (typeof arg === 'function') {
        return await (arg as (tx: unknown) => Promise<unknown>)(mockTx)
      }
      return Promise.all(arg as Promise<unknown>[])
    }),
  },
}))

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>

describe('Quest Lifecycle Actions', () => {
  const mockUser = {
    id: 'user-1',
    name: 'Alice',
    email: 'alice@example.com',
  }

  beforeEach(() => {
    vi.resetAllMocks()
    mockAuth.mockResolvedValue({ user: mockUser })
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never)
    mockTx.penalty.findFirst.mockResolvedValue(null)
  })

  describe('joinQuest', () => {
    it('rejects joining a Draft quest', async () => {
      mockTx.snatch.findUnique.mockResolvedValue(null)
      mockTx.snatch.count.mockResolvedValue(0)
      mockTx.quest.findUniqueOrThrow.mockResolvedValue({
        id: 'q-draft',
        status: 'Draft',
        maxSnatchers: 5,
        deadline: null,
      })

      const res = await joinQuest('q-draft')
      expect(res.success).toBe(false)
      expect(res.error).toBe('This quest is no longer available (Closed/Inactive).')
    })

    it('reactivates snatch if user previously dropped the quest', async () => {
      mockTx.snatch.findUnique.mockResolvedValue({
        id: 'snatch-dropped',
        status: 'DROPPED',
      })
      mockTx.snatch.count.mockResolvedValue(0)
      mockTx.quest.findUniqueOrThrow.mockResolvedValue({
        id: 'q-active',
        status: 'Active',
        maxSnatchers: 5,
        deadline: null,
      })
      mockTx.snatch.update.mockResolvedValue({
        id: 'snatch-dropped',
        status: 'ACTIVE',
      })

      const res = await joinQuest('q-active')
      expect(res.success).toBe(true)
      expect(mockTx.snatch.update).toHaveBeenCalledWith({
        where: { id: 'snatch-dropped' },
        data: { status: 'ACTIVE', squadId: null },
      })
    })

    it('rejects joining if already completed or archived', async () => {
      mockTx.snatch.findUnique.mockResolvedValue({
        id: 'snatch-completed',
        status: 'ACCEPTED',
      })
      mockTx.snatch.count.mockResolvedValue(0)
      mockTx.quest.findUniqueOrThrow.mockResolvedValue({
        id: 'q-active',
        status: 'Active',
        maxSnatchers: 5,
        deadline: null,
      })

      const res = await joinQuest('q-active')
      expect(res.success).toBe(false)
      expect(res.error).toBe('You have already completed this quest')
    })
  })

  describe('submitQuest', () => {
    it('rejects submission if quest is no longer active', async () => {
      mockTx.quest.findUnique.mockResolvedValue({
        deadline: null,
        status: 'Closed',
      })

      const res = await submitQuest('q-1', 'https://github.com/my-pr') as { success: boolean; error?: string }
      expect(res.success).toBe(false)
      expect(res.error).toBe('Quest is no longer active.')
    })

    it('rejects submission if snatch was dropped', async () => {
      mockTx.quest.findUnique.mockResolvedValue({
        deadline: null,
        status: 'Active',
      })
      mockTx.snatch.findUnique.mockResolvedValue({
        id: 'snatch-1',
        status: 'DROPPED',
      })

      const res = await submitQuest('q-1', 'https://github.com/my-pr') as { success: boolean; error?: string }
      expect(res.success).toBe(false)
      expect(res.error).toBe('Cannot submit a quest that is dropped or rejected.')
    })

    it('rejects submission if snatch is already completed', async () => {
      mockTx.quest.findUnique.mockResolvedValue({
        deadline: null,
        status: 'Active',
      })
      mockTx.snatch.findUnique.mockResolvedValue({
        id: 'snatch-1',
        status: 'ACCEPTED',
      })

      const res = await submitQuest('q-1', 'https://github.com/my-pr') as { success: boolean; error?: string }
      expect(res.success).toBe(false)
      expect(res.error).toBe('Mission already completed. No further submissions allowed.')
    })
  })

  describe('dropQuest', () => {
    it('cleans up squad if dropping makes the squad empty', async () => {
      mockTx.snatch.findUnique.mockResolvedValue({
        id: 'snatch-1',
        status: 'ACTIVE',
        squadId: 'squad-empty',
      })
      mockTx.snatch.update.mockResolvedValue({})
      mockTx.snatch.count.mockResolvedValue(0) // 0 remaining
      mockTx.squad.delete.mockResolvedValue({})

      const res = await dropQuest('q-1')
      expect(res.success).toBe(true)
      expect(mockTx.squad.delete).toHaveBeenCalledWith({
        where: { id: 'squad-empty' },
      })
    })
  })

  describe('updateQuestStatus', () => {
    it('rejects invalid quest status', async () => {
      const res = await updateQuestStatus('q-1', 'SUPER_STATUS')
      expect(res.success).toBe(false)
      expect(res.error).toBe('Invalid quest status')
    })
  })

  describe('deleteQuest', () => {
    it('deletes associated squads and snatches along with quest in transaction', async () => {
      vi.mocked(prisma.snatch.count).mockResolvedValue(0)

      const res = await deleteQuest('q-1')
      expect(res.success).toBe(true)
      expect(prisma.$transaction).toHaveBeenCalled()
    })
  })
})
