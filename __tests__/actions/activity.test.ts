import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getActivityFeed } from '@/actions/activity'
import { prisma } from '@/lib/db'

vi.mock('@/lib/db', () => ({
  prisma: {
    snatch: {
      findMany: vi.fn(),
    },
    quest: {
      findMany: vi.fn(),
    },
    userBadge: {
      findMany: vi.fn(),
    },
    squad: {
      findMany: vi.fn(),
    },
  },
}))

describe('getActivityFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('queries completions, quests, badges, squads, and squad snatches, sorts descending by timestamp, and limits', async () => {
    const date1 = new Date('2026-11-01T10:00:00Z')
    const date2 = new Date('2026-11-01T11:00:00Z')
    const date3 = new Date('2026-11-01T12:00:00Z')
    const date4 = new Date('2026-11-01T13:00:00Z')
    const date5 = new Date('2026-11-01T14:00:00Z')

    vi.mocked(prisma.snatch.findMany)
      // First call: completions (ACCEPTED)
      .mockResolvedValueOnce([
        {
          id: 'snatch-comp',
          approvedAt: date2,
          updatedAt: date2,
          user: { id: 'user-1', name: 'Alice', avatar: null },
          quest: { id: 'quest-1', title: 'Quest Alpha' },
        },
      ] as never)
      // Second call: squad joins (ACTIVE with squadId)
      .mockResolvedValueOnce([
        {
          id: 'snatch-join',
          createdAt: date5,
          user: { id: 'user-2', name: 'Bob', avatar: null },
          quest: { id: 'quest-2', title: 'Quest Beta' },
          questId: 'quest-2',
          squadId: 'squad-1',
        },
      ] as never)

    vi.mocked(prisma.quest.findMany).mockResolvedValueOnce([
      {
        id: 'quest-new',
        title: 'Quest Gamma',
        createdAt: date1,
      },
    ] as never)

    vi.mocked(prisma.userBadge.findMany).mockResolvedValueOnce([
      {
        id: 'ub-1',
        earnedAt: date3,
        user: { id: 'user-3', name: 'Charlie', avatar: null },
        badge: { name: 'Master Hunter', slug: 'master-hunter', imageUrl: '/hunter.png' },
      },
    ] as never)

    vi.mocked(prisma.squad.findMany).mockResolvedValueOnce([
      {
        id: 'squad-1',
        questId: 'quest-2',
        createdAt: date4,
        createdBy: { id: 'user-4', name: 'Dave', avatar: null },
        quest: { id: 'quest-2', title: 'Quest Beta' },
      },
    ] as never)

    const res = await getActivityFeed(3)

    expect(res.success).toBe(true)
    expect(res.data).toHaveLength(3)

    // Check descending timestamp sort: date5 (squad_joined) -> date4 (squad_created) -> date3 (badge_earned)
    expect(res.data[0].type).toBe('squad_joined')
    expect(res.data[0].message).toBe('Bob joined a squad for "Quest Beta"')
    expect(res.data[0].link).toBe('/quests/quest-2')
    expect(res.data[0].timestamp).toEqual(date5)

    expect(res.data[1].type).toBe('squad_created')
    expect(res.data[1].message).toBe('Dave formed a squad for "Quest Beta"')
    expect(res.data[1].link).toBe('/quests/quest-2')
    expect(res.data[1].timestamp).toEqual(date4)

    expect(res.data[2].type).toBe('badge_earned')
    expect(res.data[2].message).toBe('earned the "Master Hunter" badge')
    expect(res.data[2].timestamp).toEqual(date3)

    // Verify queries called with expected parameters
    expect(prisma.squad.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        createdBy: true,
        quest: true,
      },
    })

    expect(prisma.snatch.findMany).toHaveBeenCalledWith({
      where: {
        squadId: { not: null },
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        user: true,
        quest: true,
      },
    })
  })

  it('uses fallback text when creator or member name is missing', async () => {
    const date = new Date('2026-11-01T10:00:00Z')

    vi.mocked(prisma.snatch.findMany)
      .mockResolvedValueOnce([] as never)
      .mockResolvedValueOnce([
        {
          id: 'snatch-anon',
          createdAt: date,
          user: { id: 'user-anon', name: null, avatar: null },
          quest: { id: 'quest-anon', title: 'Secret Quest' },
          questId: 'quest-anon',
          squadId: 'squad-anon',
        },
      ] as never)

    vi.mocked(prisma.quest.findMany).mockResolvedValueOnce([] as never)
    vi.mocked(prisma.userBadge.findMany).mockResolvedValueOnce([] as never)
    vi.mocked(prisma.squad.findMany).mockResolvedValueOnce([
      {
        id: 'squad-anon',
        questId: 'quest-anon',
        createdAt: date,
        createdBy: { id: 'user-anon', name: null, avatar: null },
        quest: { id: 'quest-anon', title: 'Secret Quest' },
      },
    ] as never)

    const res = await getActivityFeed(10)

    expect(res.success).toBe(true)
    const squadCreated = res.data.find((item) => item.type === 'squad_created')
    const squadJoined = res.data.find((item) => item.type === 'squad_joined')

    expect(squadCreated?.message).toBe('A player formed a squad for "Secret Quest"')
    expect(squadJoined?.message).toBe('A player joined a squad for "Secret Quest"')
  })

  it('handles database error gracefully by returning empty array with success true', async () => {
    vi.mocked(prisma.snatch.findMany).mockRejectedValueOnce(new Error('DB Connection Failed') as never)

    const res = await getActivityFeed(10)

    expect(res.success).toBe(true)
    expect(res.data).toEqual([])
  })
})
