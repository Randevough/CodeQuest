import { describe, it, expect, beforeEach, vi } from 'vitest'
import { joinQuest, dropQuest } from '@/actions/quest'
import { createSquad, joinSquad } from '@/actions/squad'
import { reviewSubmission } from '@/actions/submission'
import { getNotifications } from '@/actions/notification'
import { getActivityFeed } from '@/actions/activity'
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

interface MockBadge {
  id: string
  slug: string
  name: string
  imageUrl: string
}

interface MockUserBadge {
  id: string
  userId: string
  badgeId: string
  earnedAt: Date
}

interface SnatchWhere {
  id?: string | { in?: string[] }
  questId?: string
  userId?: string
  squadId?: string | null | { not?: null }
  status?: string | { in?: string[]; notIn?: string[] }
}

interface SnatchUpdateData {
  status?: string
  squadId?: string | null
  submissionUrl?: string | null
  feedback?: string | null
  approvedAt?: Date | null
}

interface UserUpdateData {
  points?: number | { increment?: number; decrement?: number }
  completedQuests?: number | { increment?: number; decrement?: number }
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
    badges: [] as MockBadge[],
    userBadges: [] as MockUserBadge[],
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
    store.badges = [
      { id: 'badge-novice', slug: 'novice', name: 'Novice Explorer', imageUrl: '/badges/novice.png' },
    ]
    store.userBadges = []
    sessionState.user = null
  }

  function matchesSnatchWhere(snatch: MockSnatch, where: SnatchWhere): boolean {
    if (where.id) {
      if (typeof where.id === 'string' && snatch.id !== where.id) return false
      if (typeof where.id === 'object' && where.id.in && !where.id.in.includes(snatch.id)) return false
    }
    if (where.questId && snatch.questId !== where.questId) return false
    if (where.userId && snatch.userId !== where.userId) return false
    if (where.squadId !== undefined) {
      if (where.squadId === null && snatch.squadId !== null) return false
      if (typeof where.squadId === 'string' && snatch.squadId !== where.squadId) return false
      if (typeof where.squadId === 'object' && where.squadId !== null) {
        if ('not' in where.squadId && where.squadId.not === null && (snatch.squadId === null || snatch.squadId === undefined)) return false
      }
    }
    if (where.status !== undefined) {
      if (typeof where.status === 'string' && snatch.status !== where.status) return false
      if (typeof where.status === 'object' && where.status !== null) {
        if (where.status.in && !where.status.in.includes(snatch.status)) return false
        if (where.status.notIn && where.status.notIn.includes(snatch.status)) return false
      }
    }
    return true
  }

  const mockPrisma = {
    user: {
      findUnique: vi.fn(async (params: { where: { id?: string; email?: string }; include?: { snatches?: { where?: { status?: string }; include?: { quest?: boolean } }; badges?: { include?: { badge?: boolean } } } }) => {
        const u = store.users.find(user => {
          if (params.where.id && user.id === params.where.id) return true
          if (params.where.email && user.email === params.where.email) return true
          return false
        })
        if (!u) return null
        const res: Record<string, unknown> = { ...u }
        if (params.include?.snatches) {
          const matched = store.snatches.filter(s => s.userId === u.id && (!params.include?.snatches?.where?.status || s.status === params.include.snatches.where.status))
          res.snatches = matched.map(s => {
            const row: Record<string, unknown> = { ...s }
            if (params.include?.snatches?.include?.quest) {
              row.quest = store.quests.find(q => q.id === s.questId) || null
            }
            return row
          })
        }
        if (params.include?.badges) {
          res.badges = []
        }
        return res
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
    },
    quest: {
      findUnique: vi.fn(async (params: { where: { id: string } }) => {
        const q = store.quests.find(quest => quest.id === params.where.id)
        return q ? { ...q } : null
      }),
      findUniqueOrThrow: vi.fn(async (params: { where: { id: string } }) => {
        const q = store.quests.find(quest => quest.id === params.where.id)
        if (!q) throw new Error(`Quest not found: ${params.where.id}`)
        return { ...q }
      }),
      findMany: vi.fn(async (params?: { where?: { status?: string }; orderBy?: { createdAt?: 'desc' | 'asc' }; take?: number }) => {
        let list = store.quests.filter(q => {
          if (params?.where?.status && q.status !== params.where.status) return false
          return true
        })
        if (params?.orderBy?.createdAt === 'desc') {
          list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        }
        if (params?.take) {
          list = list.slice(0, params.take)
        }
        return list.map(q => ({ ...q }))
      }),
      update: vi.fn(async (params: { where: { id: string }; data: { status?: string; title?: string } }) => {
        const q = store.quests.find(quest => quest.id === params.where.id)
        if (!q) throw new Error(`Quest not found: ${params.where.id}`)
        if (params.data.status !== undefined) q.status = params.data.status
        if (params.data.title !== undefined) q.title = params.data.title
        q.updatedAt = new Date()
        return { ...q }
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
      findMany: vi.fn(async (params?: { where?: SnatchWhere; orderBy?: { approvedAt?: 'desc' | 'asc'; createdAt?: 'desc' | 'asc' }; take?: number; include?: { user?: unknown; quest?: unknown } }) => {
        const list = store.snatches.filter(snatch => matchesSnatchWhere(snatch, params?.where || {}))
        if (params?.orderBy?.approvedAt === 'desc') {
          list.sort((a, b) => {
            const timeA = a.approvedAt ? a.approvedAt.getTime() : a.updatedAt.getTime()
            const timeB = b.approvedAt ? b.approvedAt.getTime() : b.updatedAt.getTime()
            return timeB - timeA
          })
        } else if (params?.orderBy?.createdAt === 'desc') {
          list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        }
        const slice = params?.take ? list.slice(0, params.take) : list
        return slice.map(s => {
          const res: Record<string, unknown> = { ...s }
          if (params?.include?.user) {
            res.user = store.users.find(u => u.id === s.userId)
          }
          if (params?.include?.quest) {
            res.quest = store.quests.find(q => q.id === s.questId)
          }
          return res
        })
      }),
      count: vi.fn(async (params?: { where?: SnatchWhere }) => {
        if (!params?.where) return store.snatches.length
        return store.snatches.filter(snatch => matchesSnatchWhere(snatch, params.where!)).length
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
        const targets = store.snatches.filter(snatch => matchesSnatchWhere(snatch, params?.where || {}))
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
      findMany: vi.fn(async (params?: { orderBy?: { createdAt?: 'desc' | 'asc' }; take?: number; include?: { createdBy?: boolean; quest?: boolean } }) => {
        let list = [...store.squads]
        if (params?.orderBy?.createdAt === 'desc') {
          list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        }
        if (params?.take) {
          list = list.slice(0, params.take)
        }
        return list.map(sq => {
          const res: Record<string, unknown> = { ...sq }
          if (params?.include?.createdBy) {
            res.createdBy = store.users.find(u => u.id === sq.createdById) || null
          }
          if (params?.include?.quest) {
            res.quest = store.quests.find(q => q.id === sq.questId) || null
          }
          return res
        })
      }),
      delete: vi.fn(async (params: { where: { id: string } }) => {
        const idx = store.squads.findIndex(s => s.id === params.where.id)
        if (idx !== -1) store.squads.splice(idx, 1)
        return {}
      }),
    },
    penalty: {
      findFirst: vi.fn(async (params: { where: { userId?: string; expiresAt?: { gt?: Date | string } } }) => {
        const p = store.penalties.find(pen => {
          if (params.where.userId && pen.userId !== params.where.userId) return false
          if (params.where.expiresAt?.gt) {
            const gtDate = new Date(params.where.expiresAt.gt)
            if (pen.expiresAt.getTime() <= gtDate.getTime()) return false
          }
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
    },
    badge: {
      findUnique: vi.fn(async (params: { where: { slug: string } }) => {
        const b = store.badges.find(badge => badge.slug === params.where.slug)
        return b ? { ...b } : null
      }),
    },
    userBadge: {
      findMany: vi.fn(async (params?: { orderBy?: { earnedAt?: 'desc' | 'asc' }; take?: number; include?: { user?: unknown; badge?: unknown } }) => {
        let list = [...store.userBadges]
        if (params?.orderBy?.earnedAt === 'desc') {
          list.sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime())
        }
        if (params?.take) {
          list = list.slice(0, params.take)
        }
        return list.map(ub => {
          const res: Record<string, unknown> = { ...ub }
          if (params?.include?.user) {
            res.user = store.users.find(u => u.id === ub.userId) || null
          }
          if (params?.include?.badge) {
            res.badge = store.badges.find(b => b.id === ub.badgeId) || null
          }
          return res
        })
      }),
      create: vi.fn(async (params: { data: { userId: string; badgeId: string } }) => {
        const ub: MockUserBadge = {
          id: `ub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: params.data.userId,
          badgeId: params.data.badgeId,
          earnedAt: new Date(),
        }
        store.userBadges.push(ub)
        return { ...ub }
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
  auth: vi.fn(async () => (sessionState.user ? { user: sessionState.user } : null)),
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

describe('End-to-End Quest Lifecycle and Squad Gamification', () => {
  const adminUser = {
    id: 'user-admin',
    email: 'admin@codequest.dev',
    name: 'Admin Commander',
    role: 'Admin',
    points: 1000,
    completedQuests: 10,
    handle: 'admin_commander',
    avatar: 'https://example.com/admin.png',
  }

  const leaderUser = {
    id: 'user-leader',
    email: 'leader@codequest.dev',
    name: 'Squad Leader',
    role: 'Member',
    points: 350,
    completedQuests: 3,
    handle: 'squad_leader',
    avatar: 'https://example.com/leader.png',
  }

  const memberA = {
    id: 'user-member-a',
    email: 'member.a@codequest.dev',
    name: 'Member Alpha',
    role: 'Member',
    points: 200,
    completedQuests: 2,
    handle: 'member_alpha',
    avatar: 'https://example.com/alpha.png',
  }

  const memberB = {
    id: 'user-member-b',
    email: 'member.b@codequest.dev',
    name: 'Member Beta',
    role: 'Member',
    points: 150,
    completedQuests: 1,
    handle: 'member_beta',
    avatar: 'https://example.com/beta.png',
  }

  const memberC = {
    id: 'user-member-c',
    email: 'member.c@codequest.dev',
    name: 'Member Gamma',
    role: 'Member',
    points: 50,
    completedQuests: 0,
    handle: 'member_gamma',
    avatar: 'https://example.com/gamma.png',
  }

  beforeEach(() => {
    resetStore()
    vi.clearAllMocks()

    const now = new Date()
    store.users.push(
      { ...adminUser, createdAt: new Date(now.getTime() - 100000), updatedAt: now },
      { ...leaderUser, createdAt: new Date(now.getTime() - 80000), updatedAt: now },
      { ...memberA, createdAt: new Date(now.getTime() - 60000), updatedAt: now },
      { ...memberB, createdAt: new Date(now.getTime() - 40000), updatedAt: now },
      { ...memberC, createdAt: new Date(now.getTime() - 20000), updatedAt: now },
    )
  })

  it('enforces 3 active quest capacity limit: user cannot snatch a 4th quest while 3 are active', async () => {
    const quests: MockQuest[] = [
      {
        id: 'q-cap-1',
        title: 'Core Architecture',
        description: 'First active mission',
        category: 'Web',
        difficulty: 'Beginner',
        points: 50,
        maxSnatchers: 10,
        status: 'Active',
        deadline: null,
        requirements: [],
        resources: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'q-cap-2',
        title: 'Distributed Storage',
        description: 'Second active mission',
        category: 'Web',
        difficulty: 'Intermediate',
        points: 75,
        maxSnatchers: 10,
        status: 'Active',
        deadline: null,
        requirements: [],
        resources: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'q-cap-3',
        title: 'Realtime Pipeline',
        description: 'Third active mission',
        category: 'Web',
        difficulty: 'Hard',
        points: 100,
        maxSnatchers: 10,
        status: 'Active',
        deadline: null,
        requirements: [],
        resources: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'q-cap-4',
        title: 'Telemetry Dashboard',
        description: 'Fourth mission exceeding capacity limit',
        category: 'Web',
        difficulty: 'Intermediate',
        points: 80,
        maxSnatchers: 10,
        status: 'Active',
        deadline: null,
        requirements: [],
        resources: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    store.quests.push(...quests)
    sessionState.user = memberA

    // 1. Snatch 3 quests to fill active quota
    const snatch1 = await joinQuest('q-cap-1')
    const snatch2 = await joinQuest('q-cap-2')
    const snatch3 = await joinQuest('q-cap-3')

    expect(snatch1.success).toBe(true)
    expect(snatch2.success).toBe(true)
    expect(snatch3.success).toBe(true)

    const activeCount = store.snatches.filter(
      s => s.userId === memberA.id && ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'].includes(s.status)
    ).length
    expect(activeCount).toBe(3)

    // 2. Snatch 4th quest while at active quota limit -> rejected
    const snatch4 = await joinQuest('q-cap-4')
    expect(snatch4.success).toBe(false)
    expect('error' in snatch4 ? snatch4.error : undefined).toBe(
      'Mission capacity reached. Finish an active quest to snatch more.'
    )

    // 3. Create squad while at active quota limit -> rejected
    const squadCreationAttempt = await createSquad('q-cap-4', 'Quota Exceeded Team')
    expect(squadCreationAttempt.success).toBe(false)
    expect(squadCreationAttempt.error).toBe(
      'Mission capacity reached. Finish an active quest to snatch more.'
    )

    // 4. Drop one quest to free up capacity
    const dropRes = await dropQuest('q-cap-1')
    expect(dropRes.success).toBe(true)

    const updatedActiveCount = store.snatches.filter(
      s => s.userId === memberA.id && ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'].includes(s.status)
    ).length
    expect(updatedActiveCount).toBe(2)

    // 5. User can now snatch the 4th quest successfully
    const retrySnatch4 = await joinQuest('q-cap-4')
    expect(retrySnatch4.success).toBe(true)
    expect('data' in retrySnatch4 ? retrySnatch4.data : undefined).toBeDefined()

    const q4Snatch = store.snatches.find(s => s.userId === memberA.id && s.questId === 'q-cap-4')
    expect(q4Snatch?.status).toBe('ACTIVE')
  })

  it('manages squad lobby mechanics: leader creates squad for multi-snatcher quest, invite link is valid, joining obeys maxSnatchers limit', async () => {
    // 1. Quest with maxSnatchers = 1 does not support squads
    const soloQuest: MockQuest = {
      id: 'q-solo',
      title: 'Solo Reconnaissance',
      description: 'Single player mission',
      category: 'Security',
      difficulty: 'Beginner',
      points: 40,
      maxSnatchers: 1,
      status: 'Active',
      deadline: null,
      requirements: [],
      resources: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    store.quests.push(soloQuest)

    sessionState.user = leaderUser
    const soloSquadAttempt = await createSquad('q-solo', 'Solo Squad')
    expect(soloSquadAttempt.success).toBe(false)
    expect(soloSquadAttempt.error).toBe('This quest does not support squads.')

    // 2. Multi-snatcher quest with maxSnatchers = 3
    const squadQuest: MockQuest = {
      id: 'q-squad-multi',
      title: 'Multiplayer Infrastructure Defense',
      description: 'Team mission with 3 slots',
      category: 'DevOps',
      difficulty: 'Hard',
      points: 300,
      maxSnatchers: 3,
      status: 'Active',
      deadline: null,
      requirements: [],
      resources: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    store.quests.push(squadQuest)

    // 3. Leader forms squad
    const squadRes = await createSquad('q-squad-multi', 'Vanguard Prime')
    expect(squadRes.success).toBe(true)
    expect(squadRes.squadId).toBeDefined()
    const squadId = squadRes.squadId!

    const createdSquad = store.squads.find(s => s.id === squadId)
    expect(createdSquad).toBeDefined()
    expect(createdSquad?.name).toBe('Vanguard Prime')
    expect(createdSquad?.createdById).toBe(leaderUser.id)

    // Leader's snatch is attached to the squad
    const leaderSnatch = store.snatches.find(
      s => s.userId === leaderUser.id && s.questId === 'q-squad-multi'
    )
    expect(leaderSnatch).toBeDefined()
    expect(leaderSnatch?.squadId).toBe(squadId)
    expect(leaderSnatch?.status).toBe('ACTIVE')

    // 4. Invite link validation
    const inviteLink = `/quests/${squadQuest.id}?squad=${squadId}`
    const parsedUrl = new URL(inviteLink, 'https://codequest.dev')
    expect(parsedUrl.pathname).toBe(`/quests/${squadQuest.id}`)
    expect(parsedUrl.searchParams.get('squad')).toBe(squadId)

    const inviteTargetSquad = store.squads.find(s => s.id === parsedUrl.searchParams.get('squad'))
    expect(inviteTargetSquad).toBeDefined()
    expect(inviteTargetSquad?.questId).toBe(squadQuest.id)

    // 5. Member A joins via invite squadId (slot 2/3)
    sessionState.user = memberA
    const joinARes = await joinSquad(squadId)
    expect(joinARes.success).toBe(true)

    const memberASnatch = store.snatches.find(
      s => s.userId === memberA.id && s.questId === 'q-squad-multi'
    )
    expect(memberASnatch).toBeDefined()
    expect(memberASnatch?.squadId).toBe(squadId)
    expect(memberASnatch?.status).toBe('ACTIVE')

    // 6. Member B joins via invite squadId (slot 3/3 -> quest is now full)
    sessionState.user = memberB
    const joinBRes = await joinSquad(squadId)
    expect(joinBRes.success).toBe(true)

    const memberBSnatch = store.snatches.find(
      s => s.userId === memberB.id && s.questId === 'q-squad-multi'
    )
    expect(memberBSnatch).toBeDefined()
    expect(memberBSnatch?.squadId).toBe(squadId)

    // 7. Member C attempts to join filled squad (exceeds maxSnatchers) -> rejected
    sessionState.user = memberC
    const joinCRes = await joinSquad(squadId)
    expect(joinCRes.success).toBe(false)
    expect(joinCRes.error).toBe('Quest is full')

    // Member C direct joinQuest is also rejected due to maxSnatchers
    const directJoinC = await joinQuest('q-squad-multi')
    expect(directJoinC.success).toBe(false)
    expect('error' in directJoinC ? directJoinC.error : undefined).toBe('Quest is full')
  })

  it('enforces active penalty: user with unexpired penalty cannot snatch or join squad', async () => {
    const quest: MockQuest = {
      id: 'q-penalty-check',
      title: 'Security Operations',
      description: 'Operations under penalty policy',
      category: 'Security',
      difficulty: 'Intermediate',
      points: 120,
      maxSnatchers: 5,
      status: 'Active',
      deadline: null,
      requirements: [],
      resources: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    store.quests.push(quest)

    // Create a squad using unpenalized leader
    sessionState.user = leaderUser
    const squadRes = await createSquad('q-penalty-check', 'Security Brigade')
    expect(squadRes.success).toBe(true)
    const squadId = squadRes.squadId!

    // Assign active unexpired penalty to Member A
    const activePenalty: MockPenalty = {
      id: 'penalty-active-1',
      userId: memberA.id,
      reason: 'Abandoning critical mission',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour in future
      createdAt: new Date(),
    }
    store.penalties.push(activePenalty)

    sessionState.user = memberA

    // 1. Unexpired penalty blocks joining quest directly
    const directSnatchAttempt = await joinQuest('q-penalty-check')
    expect(directSnatchAttempt.success).toBe(false)
    expect('error' in directSnatchAttempt ? directSnatchAttempt.error : undefined).toBe(
      'You have an active penalty and cannot join new quests.'
    )

    // 2. Unexpired penalty blocks creating squads
    const squadCreateAttempt = await createSquad('q-penalty-check', 'Penalized Squad')
    expect(squadCreateAttempt.success).toBe(false)
    expect(squadCreateAttempt.error).toBe(
      'You have an active penalty and cannot create squads.'
    )

    // 3. Unexpired penalty blocks joining existing squad
    const squadJoinAttempt = await joinSquad(squadId)
    expect(squadJoinAttempt.success).toBe(false)
    expect(squadJoinAttempt.error).toBe(
      'You have an active penalty and cannot join squads.'
    )

    // 4. Expire the penalty
    activePenalty.expiresAt = new Date(Date.now() - 60 * 60 * 1000) // 1 hour in past

    // 5. Expired penalty permits joining squad
    const allowedJoin = await joinSquad(squadId)
    expect(allowedJoin.success).toBe(true)

    const snatchAfterExpiry = store.snatches.find(
      s => s.userId === memberA.id && s.questId === 'q-penalty-check'
    )
    expect(snatchAfterExpiry).toBeDefined()
    expect(snatchAfterExpiry?.status).toBe('ACTIVE')
    expect(snatchAfterExpiry?.squadId).toBe(squadId)
  })

  it('triggers in-app notifications to squad creator when a member joins', async () => {
    const quest: MockQuest = {
      id: 'q-notif-quest',
      title: 'Protocol Resilience Verification',
      description: 'Collaborative verification suite',
      category: 'Web',
      difficulty: 'Intermediate',
      points: 150,
      maxSnatchers: 4,
      status: 'Active',
      deadline: null,
      requirements: [],
      resources: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    store.quests.push(quest)

    // Leader creates squad
    sessionState.user = leaderUser
    const squadRes = await createSquad('q-notif-quest', 'Resilience Squad')
    expect(squadRes.success).toBe(true)
    const squadId = squadRes.squadId!

    // Member A joins squad
    sessionState.user = memberA
    const joinRes = await joinSquad(squadId)
    expect(joinRes.success).toBe(true)

    // Verify in-app notification delivered to squad creator
    const creatorNotifs = store.notifications.filter(n => n.userId === leaderUser.id)
    expect(creatorNotifs.length).toBe(1)

    const notif = creatorNotifs[0]
    expect(notif.type).toBe('SQUAD_JOIN')
    expect(notif.message).toBe(
      `${memberA.name} joined your squad for "${quest.title}"`
    )
    expect(notif.link).toBe(`/quests/${quest.id}`)
    expect(notif.read).toBe(false)

    // Query notifications using getNotifications server action
    sessionState.user = leaderUser
    const queryResult = await getNotifications(10)
    expect(queryResult.success).toBe(true)
    expect(queryResult.data).toBeDefined()
    expect(queryResult.data?.some(n => n.id === notif.id)).toBe(true)

    // Joining user does not receive self-notification
    const memberANotifs = store.notifications.filter(n => n.userId === memberA.id)
    expect(memberANotifs.length).toBe(0)
  })

  it('updates live activity feed with squad creation, joins, and quest completions in descending order', async () => {
    const t0 = new Date('2026-11-03T01:00:00Z')
    const t1SquadCreate = new Date('2026-11-03T02:00:00Z')
    const t2SquadJoin = new Date('2026-11-03T03:00:00Z')
    const t3Completion = new Date('2026-11-03T04:00:00Z')

    const questAlpha: MockQuest = {
      id: 'q-feed-alpha',
      title: 'Kernel Driver Optimization',
      description: 'System low-level performance tuning',
      category: 'Systems',
      difficulty: 'Hard',
      points: 220,
      maxSnatchers: 4,
      status: 'Active',
      deadline: null,
      requirements: [],
      resources: [],
      createdAt: t0,
      updatedAt: t0,
    }

    const questBeta: MockQuest = {
      id: 'q-feed-beta',
      title: 'Zero Knowledge Protocol Proof',
      description: 'Cryptography validation',
      category: 'Security',
      difficulty: 'Expert',
      points: 400,
      maxSnatchers: 2,
      status: 'Active',
      deadline: null,
      requirements: [],
      resources: [],
      createdAt: t0,
      updatedAt: t0,
    }

    store.quests.push(questAlpha, questBeta)

    // 1. Leader forms squad for questAlpha at t1
    sessionState.user = leaderUser
    const squadAlphaRes = await createSquad(questAlpha.id, 'Alpha Kernel Crew')
    expect(squadAlphaRes.success).toBe(true)
    const squadAlphaId = squadAlphaRes.squadId!

    const createdSquad = store.squads.find(s => s.id === squadAlphaId)
    if (createdSquad) {
      createdSquad.createdAt = t1SquadCreate
    }

    // Adjust leader's snatch creation time to t1
    const leaderSnatch = store.snatches.find(s => s.userId === leaderUser.id && s.questId === questAlpha.id)
    if (leaderSnatch) {
      leaderSnatch.createdAt = t1SquadCreate
    }

    // 2. Member A joins squad for questAlpha at t2
    sessionState.user = memberA
    const joinRes = await joinSquad(squadAlphaId)
    expect(joinRes.success).toBe(true)

    const memberASnatch = store.snatches.find(s => s.userId === memberA.id && s.questId === questAlpha.id)
    if (memberASnatch) {
      memberASnatch.createdAt = t2SquadJoin
    }

    // 3. Member B completes questBeta at t3
    const memberBSnatch: MockSnatch = {
      id: 'snatch-beta-completed',
      userId: memberB.id,
      questId: questBeta.id,
      status: 'SUBMITTED',
      submissionUrl: 'https://github.com/codequest/zk-proof-solution',
      feedback: null,
      approvedAt: null,
      assignedById: null,
      squadId: null,
      createdAt: t0,
      updatedAt: t0,
    }
    store.snatches.push(memberBSnatch)

    sessionState.user = adminUser
    const reviewRes = await reviewSubmission(memberBSnatch.id, 'ACCEPTED', 'Superb cryptographic implementation')
    expect(reviewRes.success).toBe(true)

    // Set approved timestamp to t3
    memberBSnatch.approvedAt = t3Completion
    memberBSnatch.updatedAt = t3Completion

    // 4. Retrieve live activity feed
    const feedResponse = await getActivityFeed(10)
    expect(feedResponse.success).toBe(true)
    const items = feedResponse.data

    expect(items.length).toBeGreaterThanOrEqual(3)

    // 5. Verify feed item presence and content
    const completionItem = items.find(
      i => i.type === 'quest_completed' && i.link === `/quests/${questBeta.id}`
    )
    expect(completionItem).toBeDefined()
    expect(completionItem?.userName).toBe(memberB.name)
    expect(completionItem?.message).toContain(`completed "${questBeta.title}"`)

    const squadCreatedItem = items.find(
      i => i.type === 'squad_created' && i.link === `/quests/${questAlpha.id}`
    )
    expect(squadCreatedItem).toBeDefined()
    expect(squadCreatedItem?.userName).toBe(leaderUser.name)
    expect(squadCreatedItem?.message).toContain(`formed a squad for "${questAlpha.title}"`)

    const squadJoinedItem = items.find(
      i => i.type === 'squad_joined' && i.userId === memberA.id
    )
    expect(squadJoinedItem).toBeDefined()
    expect(squadJoinedItem?.userName).toBe(memberA.name)
    expect(squadJoinedItem?.message).toContain(`joined a squad for "${questAlpha.title}"`)

    // 6. Verify timestamps are sorted in descending order
    for (let i = 0; i < items.length - 1; i++) {
      const current = items[i].timestamp.getTime()
      const next = items[i + 1].timestamp.getTime()
      expect(current).toBeGreaterThanOrEqual(next)
    }

    // Verify ordering between specific events: t3 (completion) > t2 (join) > t1 (creation)
    const completionIndex = items.indexOf(completionItem!)
    const joinIndex = items.indexOf(squadJoinedItem!)
    const createIndex = items.indexOf(squadCreatedItem!)

    expect(completionIndex).toBeLessThan(joinIndex)
    expect(joinIndex).toBeLessThan(createIndex)
  })
})
