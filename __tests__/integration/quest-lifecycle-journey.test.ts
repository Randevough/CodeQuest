import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createQuest, updateQuestStatus, joinQuest, submitQuest, dropQuest } from '@/actions/quest'
import { createSquad, joinSquad } from '@/actions/squad'
import { reviewSubmission } from '@/actions/submission'
import { getNotifications } from '@/actions/notification'
import { getLeaderboardStanding, getLeaderboardUsers } from '@/actions/user'
import type { PrismaClient } from '@prisma/client'

interface MockUser {
  id: string
  email: string
  name: string | null
  avatar: string | null
  role: string
  points: number
  completedQuests: number
  handle?: string | null
  createdAt: Date
  updatedAt: Date
}

interface MockQuest {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  points: number
  maxSnatchers: number
  status: string
  deadline: Date | null
  requirements: string[]
  resources: string[]
  createdAt: Date
  updatedAt: Date
}

interface MockSnatch {
  id: string
  userId: string
  questId: string
  status: string
  submissionUrl: string | null
  feedback: string | null
  approvedAt: Date | null
  assignedById: string | null
  squadId: string | null
  createdAt: Date
  updatedAt: Date
}

interface MockSquad {
  id: string
  questId: string
  name: string | null
  createdById: string
  createdAt: Date
}

interface MockPenalty {
  id: string
  userId: string
  reason: string
  expiresAt: Date
  createdAt: Date
}

interface MockNotification {
  id: string
  userId: string
  type: string
  message: string
  read: boolean
  link: string | null
  createdAt: Date
}

interface SnatchWhere {
  id?: string | { in?: string[] }
  questId?: string
  userId?: string
  squadId?: string
  status?: string | { in?: string[]; notIn?: string[] }
}

interface UserWhere {
  id?: string
  email?: string
  OR?: Array<{
    points?: number | { gt?: number }
    completedQuests?: number | { gt?: number }
    createdAt?: { lt?: string | Date }
    name?: { contains?: string }
    handle?: { contains?: string }
  }>
}

interface OrderByClause {
  points?: 'asc' | 'desc'
  completedQuests?: 'asc' | 'desc'
  createdAt?: 'asc' | 'desc'
  id?: 'asc' | 'desc'
}

interface UserUpdateData {
  points?: number | { increment?: number; decrement?: number }
  completedQuests?: number | { increment?: number; decrement?: number }
}

interface SnatchUpdateData {
  status?: string
  squadId?: string | null
  submissionUrl?: string | null
  feedback?: string | null
  approvedAt?: Date | null
}

const {
  store,
  sessionState,
  resetStore,
  mockPrisma,
} = vi.hoisted(() => {
  const store = {
    users: [] as MockUser[],
    quests: [] as MockQuest[],
    snatches: [] as MockSnatch[],
    squads: [] as MockSquad[],
    penalties: [] as MockPenalty[],
    notifications: [] as MockNotification[],
  }

  const sessionState: {
    user: { id: string; email: string; name?: string; role?: string } | null
  } = { user: null }

  function resetStore() {
    store.users = []
    store.quests = []
    store.snatches = []
    store.squads = []
    store.penalties = []
    store.notifications = []
    sessionState.user = null
  }

  function matchesSnatchWhere(snatch: MockSnatch, where: SnatchWhere): boolean {
    if (where.id) {
      if (typeof where.id === 'string' && snatch.id !== where.id) return false
      if (typeof where.id === 'object' && where.id.in && !where.id.in.includes(snatch.id)) return false
    }
    if (where.questId && snatch.questId !== where.questId) return false
    if (where.userId && snatch.userId !== where.userId) return false
    if (where.squadId && snatch.squadId !== where.squadId) return false
    if (where.status) {
      if (typeof where.status === 'string' && snatch.status !== where.status) return false
      if (typeof where.status === 'object') {
        if (where.status.in && !where.status.in.includes(snatch.status)) return false
        if (where.status.notIn && where.status.notIn.includes(snatch.status)) return false
      }
    }
    return true
  }

  function matchesUserOr(user: MockUser, orConditions: UserWhere['OR']): boolean {
    if (!orConditions || orConditions.length === 0) return true
    return orConditions.some(cond => {
      if (cond.points && typeof cond.points === 'object' && cond.points.gt !== undefined) {
        return user.points > cond.points.gt
      }
      if (typeof cond.points === 'number' && cond.completedQuests && typeof cond.completedQuests === 'object' && cond.completedQuests.gt !== undefined) {
        return user.points === cond.points && user.completedQuests > cond.completedQuests.gt
      }
      if (typeof cond.points === 'number' && typeof cond.completedQuests === 'number' && cond.createdAt?.lt !== undefined) {
        return user.points === cond.points && user.completedQuests === cond.completedQuests && user.createdAt.getTime() < new Date(cond.createdAt.lt).getTime()
      }
      if (cond.name?.contains) {
        return (user.name ?? '').toLowerCase().includes(cond.name.contains.toLowerCase())
      }
      if (cond.handle?.contains) {
        return (user.handle ?? '').toLowerCase().includes(cond.handle.contains.toLowerCase())
      }
      return false
    })
  }

  const mockPrisma = {
    user: {
      findUnique: vi.fn(async (params: { where: { id?: string; email?: string }; include?: { snatches?: { where?: { status?: string } }; badges?: boolean } }) => {
        const u = store.users.find(user => {
          if (params.where.id && user.id === params.where.id) return true
          if (params.where.email && user.email === params.where.email) return true
          return false
        })
        if (!u) return null
        const res: Record<string, unknown> = { ...u }
        if (params.include?.snatches) {
          res.snatches = store.snatches
            .filter(s => s.userId === u.id && (!params.include?.snatches?.where?.status || s.status === params.include.snatches.where.status))
            .map(s => ({
              ...s,
              quest: store.quests.find(q => q.id === s.questId)
            }))
        }
        if (params.include?.badges) {
          res.badges = []
        }
        return res
      }),
      findFirst: vi.fn(async (params: { where?: UserWhere; orderBy?: OrderByClause[] }) => {
        const list = store.users.filter(u => {
          if (params.where?.OR) {
            return matchesUserOr(u, params.where.OR)
          }
          return true
        })

        if (params.orderBy && params.orderBy.length > 0) {
          list.sort((a, b) => {
            for (const order of params.orderBy!) {
              if (order.points) {
                const diff = order.points === 'desc' ? b.points - a.points : a.points - b.points
                if (diff !== 0) return diff
              }
              if (order.completedQuests) {
                const diff = order.completedQuests === 'desc' ? b.completedQuests - a.completedQuests : a.completedQuests - b.completedQuests
                if (diff !== 0) return diff
              }
              if (order.createdAt) {
                const diff = order.createdAt === 'desc' ? b.createdAt.getTime() - a.createdAt.getTime() : a.createdAt.getTime() - b.createdAt.getTime()
                if (diff !== 0) return diff
              }
            }
            return 0
          })
        }
        return list[0] ? { ...list[0] } : null
      }),
      findMany: vi.fn(async (params: { where?: UserWhere; orderBy?: OrderByClause[]; skip?: number; take?: number; include?: { _count?: { select?: { snatches?: { where?: { status?: { in?: string[] } } } } } } }) => {
        let list = [...store.users]
        if (params.where?.OR) {
          list = list.filter(u => matchesUserOr(u, params.where!.OR))
        }

        if (params.orderBy && params.orderBy.length > 0) {
          list.sort((a, b) => {
            for (const order of params.orderBy!) {
              if (order.points) {
                const diff = order.points === 'desc' ? b.points - a.points : a.points - b.points
                if (diff !== 0) return diff
              }
              if (order.completedQuests) {
                const diff = order.completedQuests === 'desc' ? b.completedQuests - a.completedQuests : a.completedQuests - b.completedQuests
                if (diff !== 0) return diff
              }
              if (order.createdAt) {
                const diff = order.createdAt === 'desc' ? b.createdAt.getTime() - a.createdAt.getTime() : a.createdAt.getTime() - b.createdAt.getTime()
                if (diff !== 0) return diff
              }
            }
            return 0
          })
        }

        const skip = params.skip ?? 0
        const take = params.take ?? 50
        const paged = list.slice(skip, skip + take)
        return paged.map(u => {
          const res: Record<string, unknown> = { ...u }
          if (params.include?._count?.select?.snatches) {
            const allowed = params.include._count.select.snatches.where?.status?.in || ['ACCEPTED', 'ARCHIVED']
            const count = store.snatches.filter(s => s.userId === u.id && allowed.includes(s.status)).length
            res._count = { snatches: count }
          }
          return res
        })
      }),
      count: vi.fn(async (params?: { where?: UserWhere }) => {
        const where = params?.where
        if (!where) return store.users.length
        if (where.OR) {
          return store.users.filter(u => matchesUserOr(u, where.OR)).length
        }
        return store.users.length
      }),
      update: vi.fn(async (params: { where: { id: string }; data: UserUpdateData }) => {
        const u = store.users.find(user => user.id === params.where.id)
        if (!u) throw new Error(`User not found: ${params.where.id}`)
        if (params.data.points !== undefined) {
          if (typeof params.data.points === 'number') u.points = params.data.points
          else if (params.data.points.increment !== undefined) u.points += params.data.points.increment
          else if (params.data.points.decrement !== undefined) u.points -= params.data.points.decrement
        }
        if (params.data.completedQuests !== undefined) {
          if (typeof params.data.completedQuests === 'number') u.completedQuests = params.data.completedQuests
          else if (params.data.completedQuests.increment !== undefined) u.completedQuests += params.data.completedQuests.increment
          else if (params.data.completedQuests.decrement !== undefined) u.completedQuests -= params.data.completedQuests.decrement
        }
        u.updatedAt = new Date()
        return { ...u }
      }),
      create: vi.fn(async (params: { data: Partial<MockUser> & { email: string } }) => {
        const u: MockUser = {
          id: params.data.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          email: params.data.email,
          name: params.data.name ?? null,
          avatar: params.data.avatar ?? null,
          role: params.data.role || 'Member',
          points: params.data.points || 0,
          completedQuests: params.data.completedQuests || 0,
          handle: params.data.handle || null,
          createdAt: params.data.createdAt ? new Date(params.data.createdAt) : new Date(),
          updatedAt: new Date(),
        }
        store.users.push(u)
        return { ...u }
      }),
    },
    quest: {
      findFirst: vi.fn(async (params?: { where?: { id?: { startsWith?: string } }; orderBy?: { id?: 'asc' | 'desc' } }) => {
        let list = [...store.quests]
        if (params?.where?.id?.startsWith) {
          const prefix = params.where.id.startsWith
          list = list.filter(q => q.id.startsWith(prefix))
        }
        if (params?.orderBy?.id === 'desc') {
          list.sort((a, b) => b.id.localeCompare(a.id))
        }
        return list[0] ? { ...list[0] } : null
      }),
      findUnique: vi.fn(async (params: { where: { id: string } }) => {
        const q = store.quests.find(quest => quest.id === params.where.id)
        return q ? { ...q } : null
      }),
      findUniqueOrThrow: vi.fn(async (params: { where: { id: string } }) => {
        const q = store.quests.find(quest => quest.id === params.where.id)
        if (!q) throw new Error(`Quest not found: ${params.where.id}`)
        return { ...q }
      }),
      create: vi.fn(async (params: { data: { id: string; title: string; description: string; category: string; difficulty: string; points: number; maxSnatchers?: number; status?: string; deadline?: Date | null; requirements?: string[]; resources?: string[] } }) => {
        const q: MockQuest = {
          id: params.data.id,
          title: params.data.title,
          description: params.data.description,
          category: params.data.category,
          difficulty: params.data.difficulty,
          points: params.data.points,
          maxSnatchers: params.data.maxSnatchers ?? 1,
          status: params.data.status || 'Draft',
          deadline: params.data.deadline ? new Date(params.data.deadline) : null,
          requirements: params.data.requirements || [],
          resources: params.data.resources || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        store.quests.push(q)
        return { ...q }
      }),
      update: vi.fn(async (params: { where: { id: string }; data: { status?: string; title?: string } }) => {
        const q = store.quests.find(quest => quest.id === params.where.id)
        if (!q) throw new Error(`Quest not found: ${params.where.id}`)
        if (params.data.status !== undefined) q.status = params.data.status
        if (params.data.title !== undefined) q.title = params.data.title
        q.updatedAt = new Date()
        return { ...q }
      }),
      delete: vi.fn(async (params: { where: { id: string } }) => {
        const idx = store.quests.findIndex(q => q.id === params.where.id)
        if (idx !== -1) store.quests.splice(idx, 1)
        return {}
      }),
    },
    snatch: {
      findUnique: vi.fn(async (params: { where: { id?: string; userId_questId?: { userId: string; questId: string } }; include?: { user?: boolean; quest?: boolean } }) => {
        const s = store.snatches.find(snatch => {
          if (params.where.id && snatch.id === params.where.id) return true
          if (params.where.userId_questId) {
            return snatch.userId === params.where.userId_questId.userId && snatch.questId === params.where.userId_questId.questId
          }
          return false
        })
        if (!s) return null
        const res: Record<string, unknown> = { ...s }
        if (params.include?.user) {
          res.user = store.users.find(u => u.id === s.userId)
        }
        if (params.include?.quest) {
          res.quest = store.quests.find(q => q.id === s.questId)
        }
        return res
      }),
      findFirst: vi.fn(async (params: { where: SnatchWhere }) => {
        const s = store.snatches.find(snatch => matchesSnatchWhere(snatch, params.where))
        return s ? { ...s } : null
      }),
      findMany: vi.fn(async (params: { where?: SnatchWhere; include?: { user?: boolean; quest?: boolean } }) => {
        const list = store.snatches.filter(snatch => matchesSnatchWhere(snatch, params.where || {}))
        return list.map(s => {
          const res: Record<string, unknown> = { ...s }
          if (params.include?.user) {
            res.user = store.users.find(u => u.id === s.userId)
          }
          if (params.include?.quest) {
            res.quest = store.quests.find(q => q.id === s.questId)
          }
          return res
        })
      }),
      count: vi.fn(async (params: { where: SnatchWhere }) => {
        return store.snatches.filter(snatch => matchesSnatchWhere(snatch, params.where)).length
      }),
      create: vi.fn(async (params: { data: { id?: string; userId: string; questId: string; status?: string; submissionUrl?: string | null; feedback?: string | null; approvedAt?: Date | null; assignedById?: string | null; squadId?: string | null } }) => {
        const s: MockSnatch = {
          id: params.data.id || `snatch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: params.data.userId,
          questId: params.data.questId,
          status: params.data.status || 'ACTIVE',
          submissionUrl: params.data.submissionUrl || null,
          feedback: params.data.feedback || null,
          approvedAt: params.data.approvedAt ? new Date(params.data.approvedAt) : null,
          assignedById: params.data.assignedById || null,
          squadId: params.data.squadId || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        store.snatches.push(s)
        return { ...s }
      }),
      update: vi.fn(async (params: { where: { id: string }; data: SnatchUpdateData }) => {
        const s = store.snatches.find(snatch => snatch.id === params.where.id)
        if (!s) throw new Error(`Snatch not found: ${params.where.id}`)
        if (params.data.status !== undefined) s.status = params.data.status
        if (params.data.squadId !== undefined) s.squadId = params.data.squadId
        if (params.data.submissionUrl !== undefined) s.submissionUrl = params.data.submissionUrl
        if (params.data.feedback !== undefined) s.feedback = params.data.feedback
        if (params.data.approvedAt !== undefined) s.approvedAt = params.data.approvedAt ? new Date(params.data.approvedAt) : null
        s.updatedAt = new Date()
        return { ...s }
      }),
      updateMany: vi.fn(async (params: { where?: SnatchWhere; data: SnatchUpdateData }) => {
        const targets = store.snatches.filter(snatch => matchesSnatchWhere(snatch, params.where || {}))
        for (const s of targets) {
          if (params.data.status !== undefined) s.status = params.data.status
          if (params.data.feedback !== undefined) s.feedback = params.data.feedback
          if (params.data.approvedAt !== undefined) s.approvedAt = params.data.approvedAt ? new Date(params.data.approvedAt) : null
          if (params.data.submissionUrl !== undefined) s.submissionUrl = params.data.submissionUrl
          s.updatedAt = new Date()
        }
        return { count: targets.length }
      }),
      deleteMany: vi.fn(async (params: { where: SnatchWhere }) => {
        const remaining = store.snatches.filter(snatch => !matchesSnatchWhere(snatch, params.where))
        const deletedCount = store.snatches.length - remaining.length
        store.snatches = remaining
        return { count: deletedCount }
      }),
    },
    squad: {
      create: vi.fn(async (params: { data: { id?: string; questId: string; name?: string | null; createdById: string } }) => {
        const sq: MockSquad = {
          id: params.data.id || `squad-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          questId: params.data.questId,
          name: params.data.name || null,
          createdById: params.data.createdById,
          createdAt: new Date(),
        }
        store.squads.push(sq)
        return { ...sq }
      }),
      findUnique: vi.fn(async (params: { where: { id: string }; include?: { quest?: boolean } }) => {
        const sq = store.squads.find(s => s.id === params.where.id)
        if (!sq) return null
        const res: Record<string, unknown> = { ...sq }
        if (params.include?.quest) {
          res.quest = store.quests.find(q => q.id === sq.questId)
        }
        return res
      }),
      findUniqueOrThrow: vi.fn(async (params: { where: { id: string }; include?: { quest?: boolean } }) => {
        const sq = store.squads.find(s => s.id === params.where.id)
        if (!sq) throw new Error(`Squad not found: ${params.where.id}`)
        const res: Record<string, unknown> = { ...sq }
        if (params.include?.quest) {
          res.quest = store.quests.find(q => q.id === sq.questId)
        }
        return res
      }),
      delete: vi.fn(async (params: { where: { id: string } }) => {
        const idx = store.squads.findIndex(s => s.id === params.where.id)
        if (idx !== -1) store.squads.splice(idx, 1)
        return {}
      }),
      deleteMany: vi.fn(async () => {
        const count = store.squads.length
        store.squads = []
        return { count }
      }),
    },
    penalty: {
      findFirst: vi.fn(async (params: { where: { userId?: string; expiresAt?: { gt?: Date | string } } }) => {
        const p = store.penalties.find(pen => {
          if (params.where.userId && pen.userId !== params.where.userId) return false
          if (params.where.expiresAt?.gt && !(pen.expiresAt.getTime() > new Date(params.where.expiresAt.gt).getTime())) return false
          return true
        })
        return p ? { ...p } : null
      }),
    },
    notification: {
      create: vi.fn(async (params: { data: { userId: string; type: string; message: string; read?: boolean; link?: string | null } }) => {
        const notif: MockNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: params.data.userId,
          type: params.data.type,
          message: params.data.message,
          read: params.data.read ?? false,
          link: params.data.link ?? null,
          createdAt: new Date(),
        }
        store.notifications.push(notif)
        return { ...notif }
      }),
      findMany: vi.fn(async (params: { where: { userId: string }; orderBy?: { createdAt?: 'asc' | 'desc' }; take?: number }) => {
        const list = store.notifications.filter(n => n.userId === params.where.userId)
        if (params.orderBy?.createdAt === 'desc') {
          list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        }
        const take = params.take ?? 20
        return list.slice(0, take).map(n => ({ ...n }))
      }),
      count: vi.fn(async (params?: { where?: { userId?: string; read?: boolean } }) => {
        return store.notifications.filter(n => {
          if (params?.where?.userId && n.userId !== params.where.userId) return false
          if (params?.where?.read !== undefined && n.read !== params.where.read) return false
          return true
        }).length
      }),
      update: vi.fn(async (params: { where: { id: string }; data: { read?: boolean } }) => {
        const n = store.notifications.find(item => item.id === params.where.id)
        if (n && params.data.read !== undefined) n.read = params.data.read
        return n ? { ...n } : null
      }),
      updateMany: vi.fn(async (params: { where: { userId?: string; read?: boolean }; data: { read?: boolean } }) => {
        const targets = store.notifications.filter(n => {
          if (params.where.userId && n.userId !== params.where.userId) return false
          if (params.where.read !== undefined && n.read !== params.where.read) return false
          return true
        })
        for (const n of targets) {
          if (params.data.read !== undefined) n.read = params.data.read
        }
        return { count: targets.length }
      }),
    },
    badge: {
      findUnique: vi.fn(async (params: { where: { slug: string } }) => {
        if (params.where.slug === 'novice') {
          return { id: 'badge-novice', slug: 'novice', name: 'Novice Explorer' }
        }
        return null
      }),
    },
    userBadge: {
      create: vi.fn(async (params: { data: { userId: string; badgeId: string } }) => {
        return { id: `ub-${Date.now()}`, ...params.data, earnedAt: new Date() }
      }),
    },
    $transaction: vi.fn(async (cbOrArr: unknown) => {
      if (typeof cbOrArr === 'function') {
        return await (cbOrArr as (tx: unknown) => Promise<unknown>)(mockPrisma)
      }
      return Promise.all(cbOrArr as Promise<unknown>[])
    }),
  }

  return { store, sessionState, resetStore, mockPrisma }
})

vi.mock('@/lib/db', () => ({
  prisma: mockPrisma as unknown as PrismaClient,
}))

vi.mock('@/auth', () => ({
  auth: vi.fn(async () => sessionState.user ? { user: sessionState.user } : null),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
}))

describe('End-to-End Quest Lifecycle and Gamification Journey', () => {
  const adminUser = {
    id: 'user-admin-1',
    email: 'admin@codequest.dev',
    name: 'Ada Admin',
    role: 'Admin',
    points: 1000,
    completedQuests: 10,
    handle: 'ada_admin',
    avatar: 'https://example.com/admin.png',
  }

  const memberUser = {
    id: 'user-member-1',
    email: 'alex@codequest.dev',
    name: 'Alex Coder',
    role: 'Member',
    points: 300,
    completedQuests: 3,
    handle: 'alex_coder',
    avatar: 'https://example.com/alex.png',
  }

  const teammateUser = {
    id: 'user-teammate-1',
    email: 'taylor@codequest.dev',
    name: 'Taylor Teammate',
    role: 'Member',
    points: 200,
    completedQuests: 2,
    handle: 'taylor_team',
    avatar: 'https://example.com/taylor.png',
  }

  const competitorUser = {
    id: 'user-competitor-1',
    email: 'bob@codequest.dev',
    name: 'Bob Competitor',
    role: 'Member',
    points: 400,
    completedQuests: 4,
    handle: 'bob_comp',
    avatar: 'https://example.com/bob.png',
  }

  beforeEach(() => {
    resetStore()
    vi.clearAllMocks()

    const now = new Date()
    store.users.push(
      {
        ...adminUser,
        createdAt: new Date(now.getTime() - 1000000),
        updatedAt: now,
      },
      {
        ...competitorUser,
        createdAt: new Date(now.getTime() - 800000),
        updatedAt: now,
      },
      {
        ...memberUser,
        createdAt: new Date(now.getTime() - 500000),
        updatedAt: now,
      },
      {
        ...teammateUser,
        createdAt: new Date(now.getTime() - 200000),
        updatedAt: now,
      }
    )
  })

  it('executes full 8-step journey: creation -> snatch limit -> squad joining -> HTTPS submission -> admin review -> points -> notification -> leaderboard standing recalculation', async () => {
    // -------------------------------------------------------------
    // Step 1: Admin creates quest
    // -------------------------------------------------------------
    // 1a. Non-admin cannot create quest
    sessionState.user = memberUser
    const unauthForm = new FormData()
    unauthForm.append('title', 'Hack the Planet')
    unauthForm.append('description', 'Unauthorized quest creation attempt by standard member')
    unauthForm.append('category', 'Security')
    unauthForm.append('difficulty', 'Hard')
    unauthForm.append('points', '500')
    const unauthCreate = await createQuest(undefined, unauthForm)
    expect(unauthCreate.success).toBe(false)
    expect(unauthCreate.message).toMatch(/Forbidden/)

    // 1b. Admin creates multi-person quest
    sessionState.user = adminUser
    const questPoints = 250
    const questMaxSnatchers = 3
    const createForm = new FormData()
    createForm.append('title', 'Fullstack E2E Architecture Mastery')
    createForm.append('description', 'Build and verify an end-to-end integration test harness.')
    createForm.append('category', 'Web')
    createForm.append('difficulty', 'Intermediate')
    createForm.append('points', questPoints.toString())
    createForm.append('maxSnatchers', questMaxSnatchers.toString())
    createForm.append('requirements', JSON.stringify(['Implement test suite', 'Verify edge cases']))
    createForm.append('resources', 'https://nextjs.org')

    const createResult = await createQuest(undefined, createForm)
    expect(createResult.success).toBe(true)
    expect(createResult.questId).toBeDefined()
    const questId = createResult.questId!
    expect(questId).toMatch(/^CQ-\d{4}-\d{3}$/)

    // 1c. Quest defaults to Draft status; activate it via admin action
    const createdQuestInDb = store.quests.find(q => q.id === questId)
    expect(createdQuestInDb).toBeDefined()
    expect(createdQuestInDb?.status).toBe('Draft')

    const activateRes = await updateQuestStatus(questId, 'Active')
    expect(activateRes.success).toBe(true)
    expect(createdQuestInDb?.status).toBe('Active')

    // -------------------------------------------------------------
    // Step 2: Member snatches quest (capacity limit verified: max 3 active quests)
    // -------------------------------------------------------------
    sessionState.user = memberUser

    // 2a. Fill member capacity to 3 active quests with other placeholder quests
    const placeholderQuestIds = ['dummy-q-1', 'dummy-q-2', 'dummy-q-3']
    for (let i = 0; i < placeholderQuestIds.length; i++) {
      const qId = placeholderQuestIds[i]
      store.quests.push({
        id: qId,
        title: `Placeholder Quest ${i + 1}`,
        description: 'Placeholder description for active capacity testing',
        category: 'Web',
        difficulty: 'Beginner',
        points: 50,
        maxSnatchers: 1,
        status: 'Active',
        deadline: null,
        requirements: [],
        resources: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      store.snatches.push({
        id: `dummy-snatch-${i + 1}`,
        userId: memberUser.id,
        questId: qId,
        status: 'ACTIVE',
        submissionUrl: null,
        feedback: null,
        approvedAt: null,
        assignedById: null,
        squadId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // 2b. Attempt to snatch 4th quest while at capacity limit (3 active quests)
    const capacityExceededRes = await joinQuest(questId)
    expect(capacityExceededRes.success).toBe(false)
    expect('error' in capacityExceededRes ? capacityExceededRes.error : undefined).toBe('Mission capacity reached. Finish an active quest to snatch more.')

    // 2c. Clear the placeholder active quests to release capacity
    store.snatches = store.snatches.filter(s => s.userId !== memberUser.id)

    // 2d. Member successfully snatches quest
    const joinRes = await joinQuest(questId)
    expect(joinRes.success).toBe(true)
    expect('data' in joinRes ? joinRes.data : undefined).toBeDefined()
    const memberSnatch = store.snatches.find(s => s.userId === memberUser.id && s.questId === questId)
    expect(memberSnatch).toBeDefined()
    expect(memberSnatch?.status).toBe('ACTIVE')

    // 2e. Duplicate snatch attempt is rejected
    const dupJoinRes = await joinQuest(questId)
    expect(dupJoinRes.success).toBe(false)
    expect('error' in dupJoinRes ? dupJoinRes.error : undefined).toBe('You have already snatched this quest')

    // -------------------------------------------------------------
    // Step 3: Member forms squad / teammate joins squad (capacity limit verified)
    // -------------------------------------------------------------
    // 3a. Member drops solo snatch to form collaborative squad for this multi-person quest
    const dropRes = await dropQuest(questId)
    expect(dropRes.success).toBe(true)
    expect(memberSnatch?.status).toBe('DROPPED')

    // 3b. Member forms squad
    const squadRes = await createSquad(questId, 'Integration Strike Team')
    expect(squadRes.success).toBe(true)
    expect(squadRes.squadId).toBeDefined()
    const squadId = squadRes.squadId!
    expect(memberSnatch?.status).toBe('ACTIVE')
    expect(memberSnatch?.squadId).toBe(squadId)

    // 3c. Teammate attempts to join while exceeding active quest capacity limit (3 active)
    sessionState.user = teammateUser
    for (let i = 0; i < 3; i++) {
      store.snatches.push({
        id: `teammate-cap-snatch-${i + 1}`,
        userId: teammateUser.id,
        questId: `teammate-dummy-${i + 1}`,
        status: 'ACTIVE',
        submissionUrl: null,
        feedback: null,
        approvedAt: null,
        assignedById: null,
        squadId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    const teammateCapacityRes = await joinSquad(squadId)
    expect(teammateCapacityRes.success).toBe(false)
    expect(teammateCapacityRes.error).toBe('Mission capacity reached.')

    // 3d. Clear teammate placeholder snatches to restore capacity
    store.snatches = store.snatches.filter(s => s.userId !== teammateUser.id)

    // 3e. Teammate successfully joins squad
    const teammateJoinRes = await joinSquad(squadId)
    expect(teammateJoinRes.success).toBe(true)
    const teammateSnatch = store.snatches.find(s => s.userId === teammateUser.id && s.questId === questId)
    expect(teammateSnatch).toBeDefined()
    expect(teammateSnatch?.status).toBe('ACTIVE')
    expect(teammateSnatch?.squadId).toBe(squadId)

    // 3f. Verify notification delivered to squad creator about teammate joining
    const creatorNotifs = store.notifications.filter(n => n.userId === memberUser.id && (n.type === 'SQUAD_JOIN' || n.type === 'QUEST_ASSIGNED'))
    expect(creatorNotifs.length).toBeGreaterThan(0)
    expect(creatorNotifs[0].message).toContain('joined your squad')

    // 3g. Verify quest maxSnatchers capacity limit (maxSnatchers = 3)
    // Add third member to fill squad to capacity
    store.snatches.push({
      id: 'snatch-third-member',
      userId: competitorUser.id,
      questId,
      status: 'ACTIVE',
      submissionUrl: null,
      feedback: null,
      approvedAt: null,
      assignedById: null,
      squadId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // 4th user tries to join filled squad
    const extraUser = {
      id: 'user-extra-4',
      email: 'extra@codequest.dev',
      name: 'Extra Overflow',
      role: 'Member',
      points: 50,
      completedQuests: 1,
    }
    store.users.push({
      ...extraUser,
      avatar: null,
      handle: 'extra_overflow',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    sessionState.user = extraUser

    const overflowJoinRes = await joinSquad(squadId)
    expect(overflowJoinRes.success).toBe(false)
    expect(overflowJoinRes.error).toBe('Quest is full')

    // Remove third member to keep our primary test duo clean for submission/review
    store.snatches = store.snatches.filter(s => s.id !== 'snatch-third-member')

    // -------------------------------------------------------------
    // Step 4: Member submits valid HTTPS solution URL
    // -------------------------------------------------------------
    sessionState.user = memberUser

    // 4a. Non-HTTPS URL rejected by strict URL validation
    const invalidHttpRes = await submitQuest(questId, 'http://insecure-solution.com/repo')
    expect(invalidHttpRes.success).toBe(false)
    expect('error' in invalidHttpRes ? invalidHttpRes.error : undefined).toBe('Please provide a valid URL (max 255 chars)')

    // 4b. Malformed URL string rejected
    const malformedRes = await submitQuest(questId, 'not-a-valid-url')
    expect(malformedRes.success).toBe(false)
    expect('error' in malformedRes ? malformedRes.error : undefined).toBe('Please provide a valid URL (max 255 chars)')

    // 4c. Valid HTTPS URL accepted and propagates across squad members
    const validSolutionUrl = 'https://github.com/codequest-journey/e2e-solution-harness'
    const validSubmitRes = await submitQuest(questId, validSolutionUrl)
    expect(validSubmitRes.success).toBe(true)

    expect(memberSnatch?.status).toBe('SUBMITTED')
    expect(memberSnatch?.submissionUrl).toBe(validSolutionUrl)
    expect(teammateSnatch?.status).toBe('SUBMITTED')
    expect(teammateSnatch?.submissionUrl).toBe(validSolutionUrl)

    // -------------------------------------------------------------
    // Step 5: Admin reviews submission (accept/reject)
    // -------------------------------------------------------------
    // 5a. Non-admin cannot review submission
    sessionState.user = memberUser
    const unauthReview = await reviewSubmission(memberSnatch!.id, 'ACCEPTED')
    expect(unauthReview.success).toBe(false)
    expect(unauthReview.error).toMatch(/Forbidden/)

    // 5b. Admin first requests revision (rejection cycle with feedback)
    sessionState.user = adminUser
    const revisionRes = await reviewSubmission(memberSnatch!.id, 'REVISION_NEEDED', 'Please add integration test assertions for Step 8.')
    expect(revisionRes.success).toBe(true)
    expect(memberSnatch?.status).toBe('REVISION_NEEDED')
    expect(memberSnatch?.feedback).toBe('Please add integration test assertions for Step 8.')
    expect(teammateSnatch?.status).toBe('REVISION_NEEDED')

    // Member resubmits with revision
    sessionState.user = memberUser
    const resubmitRes = await submitQuest(questId, 'https://github.com/codequest-journey/e2e-solution-harness-v2')
    expect(resubmitRes.success).toBe(true)
    expect(memberSnatch?.status).toBe('SUBMITTED')
    expect(teammateSnatch?.status).toBe('SUBMITTED')

    // 5c. Admin approves and accepts submission
    sessionState.user = adminUser
    const acceptRes = await reviewSubmission(memberSnatch!.id, 'ACCEPTED', 'Outstanding solution! Meets all lifecycle requirements.')
    expect(acceptRes.success).toBe(true)
    expect(acceptRes.pointDelta).toBe(questPoints)
    expect(memberSnatch?.status).toBe('ACCEPTED')
    expect(memberSnatch?.approvedAt).toBeInstanceOf(Date)
    expect(teammateSnatch?.status).toBe('ACCEPTED')
    expect(teammateSnatch?.approvedAt).toBeInstanceOf(Date)

    // -------------------------------------------------------------
    // Step 6: Points awarded and completedQuests counter incremented
    // -------------------------------------------------------------
    const updatedMember = store.users.find(u => u.id === memberUser.id)
    const updatedTeammate = store.users.find(u => u.id === teammateUser.id)

    // Member: 300 initial + 250 awarded = 550 points, completedQuests: 3 -> 4
    expect(updatedMember?.points).toBe(550)
    expect(updatedMember?.completedQuests).toBe(4)

    // Teammate: 200 initial + 250 awarded = 450 points, completedQuests: 2 -> 3
    expect(updatedTeammate?.points).toBe(450)
    expect(updatedTeammate?.completedQuests).toBe(3)

    // -------------------------------------------------------------
    // Step 7: Notification delivered to user
    // -------------------------------------------------------------
    sessionState.user = memberUser
    const memberNotifsResult = await getNotifications(10)
    expect(memberNotifsResult.success).toBe(true)
    expect(memberNotifsResult.data).toBeDefined()

    const acceptNotif = memberNotifsResult.data!.find(n => n.type === 'SUBMISSION_ACCEPTED')
    expect(acceptNotif).toBeDefined()
    expect(acceptNotif?.message).toContain(`Your submission for "Fullstack E2E Architecture Mastery" has been accepted! +${questPoints} XP`)
    expect(acceptNotif?.read).toBe(false)

    // Teammate also received notification
    sessionState.user = teammateUser
    const teammateNotifsResult = await getNotifications(10)
    expect(teammateNotifsResult.success).toBe(true)
    const teammateAcceptNotif = teammateNotifsResult.data!.find(n => n.type === 'SUBMISSION_ACCEPTED')
    expect(teammateAcceptNotif).toBeDefined()

    // -------------------------------------------------------------
    // Step 8: Leaderboard standing recalculation reflects new points
    // -------------------------------------------------------------
    // Prior to quest completion:
    // 1. Admin: 1000 pts
    // 2. Bob Competitor: 400 pts
    // 3. Alex Member: 300 pts
    // 4. Taylor Teammate: 200 pts
    //
    // After quest completion:
    // 1. Admin: 1000 pts
    // 2. Alex Member: 550 pts (surpassed Bob!)
    // 3. Taylor Teammate: 450 pts (surpassed Bob!)
    // 4. Bob Competitor: 400 pts
    sessionState.user = memberUser
    const standing = await getLeaderboardStanding()
    expect(standing).not.toBeNull()
    expect(standing?.points).toBe(550)
    expect((standing as { completedQuests?: number })?.completedQuests).toBe(4)
    expect(standing?.rank).toBe(2) // Jumped from rank 3 to rank 2!
    expect(standing?.isTop).toBe(false)
    expect(standing?.pointsToNext).toBe(1000 - 550 + 1) // Next is Admin (1000 pts)

    // Check teammate standing: surpassed Bob to take Rank 3
    sessionState.user = teammateUser
    const teammateStanding = await getLeaderboardStanding()
    expect(teammateStanding).not.toBeNull()
    expect(teammateStanding?.points).toBe(450)
    expect(teammateStanding?.rank).toBe(3) // Rank 3 behind Alex (550) and Admin (1000)

    // Global leaderboard users query reflects updated order
    const globalBoard = await getLeaderboardUsers(1, 10)
    expect(globalBoard.total).toBe(store.users.length)
    const rankedUserIds = globalBoard.users.map(u => u.id)
    expect(rankedUserIds.slice(0, 4)).toEqual([
      adminUser.id,
      memberUser.id,
      teammateUser.id,
      competitorUser.id,
    ])
  })
})
