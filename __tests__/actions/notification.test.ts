import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  createNotification,
  createSquadNotification,
} from '@/actions/notification'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import type { Notification } from '@prisma/client'

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    notification: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}))

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>

describe('Notification Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthorized users from fetching notifications', async () => {
    mockAuth.mockResolvedValueOnce(null)
    const result = await getNotifications()
    expect(result.success).toBe(false)
    expect(result.error).toBe('Unauthorized')
  })

  it('returns user notifications when authorized', async () => {
    const mockUser = { id: 'user_123', email: 'test@example.com' }
    mockAuth.mockResolvedValueOnce({ user: mockUser })
    vi.mocked(prisma.notification.findMany).mockResolvedValueOnce([
      {
        id: 'notif_1',
        userId: 'user_123',
        type: 'SUBMISSION_ACCEPTED',
        message: 'Your submission was accepted!',
        read: false,
        link: '/workspace',
        createdAt: new Date(),
      },
    ] as unknown as Notification[])

    const result = await getNotifications()
    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(1)
    expect(result.data?.[0].type).toBe('SUBMISSION_ACCEPTED')
  })

  it('returns unread notification count', async () => {
    const mockUser = { id: 'user_123' }
    mockAuth.mockResolvedValueOnce({ user: mockUser })
    vi.mocked(prisma.notification.count).mockResolvedValueOnce(3)

    const count = await getUnreadNotificationCount()
    expect(count).toBe(3)
  })

  it('returns 0 unread notifications when unauthenticated', async () => {
    mockAuth.mockResolvedValueOnce(null)
    const count = await getUnreadNotificationCount()
    expect(count).toBe(0)
  })

  it('rejects unauthorized users from marking single notification as read', async () => {
    mockAuth.mockResolvedValueOnce(null)
    const result = await markNotificationRead('notif_1')
    expect(result.success).toBe(false)
    expect(result.error).toBe('Unauthorized')
  })

  it('rejects unauthorized users from marking all notifications as read', async () => {
    mockAuth.mockResolvedValueOnce(null)
    const result = await markAllNotificationsRead()
    expect(result.success).toBe(false)
    expect(result.error).toBe('Unauthorized')
  })

  it('marks a single notification as read with ownership check', async () => {
    const mockUser = { id: 'user_123' }
    mockAuth.mockResolvedValueOnce({ user: mockUser })
    vi.mocked(prisma.notification.findUnique).mockResolvedValueOnce({
      id: 'notif_1',
      userId: 'user_123',
      read: false,
    } as unknown as Notification)
    vi.mocked(prisma.notification.update).mockResolvedValueOnce({
      id: 'notif_1',
      userId: 'user_123',
      read: true,
    } as unknown as Notification)

    const result = await markNotificationRead('notif_1')
    expect(result.success).toBe(true)
    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: 'notif_1' },
      data: { read: true },
    })
  })

  it('prevents marking notifications owned by other users', async () => {
    const mockUser = { id: 'user_123' }
    mockAuth.mockResolvedValueOnce({ user: mockUser })
    vi.mocked(prisma.notification.findUnique).mockResolvedValueOnce({
      id: 'notif_999',
      userId: 'other_user',
      read: false,
    } as unknown as Notification)

    const result = await markNotificationRead('notif_999')
    expect(result.success).toBe(false)
    expect(result.error).toBe('Notification not found')
  })

  it('marks all user notifications as read', async () => {
    const mockUser = { id: 'user_123' }
    mockAuth.mockResolvedValueOnce({ user: mockUser })
    vi.mocked(prisma.notification.updateMany).mockResolvedValueOnce({ count: 5 })

    const result = await markAllNotificationsRead()
    expect(result.success).toBe(true)
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user_123', read: false },
      data: { read: true },
    })
  })

  it('creates SQUAD_JOIN notification with proper payload', async () => {
    vi.mocked(prisma.notification.create).mockResolvedValueOnce({
      id: 'notif_squad_join',
      userId: 'creator_1',
      type: 'SQUAD_JOIN',
      message: 'Bob joined your squad for "React Mastery"',
      read: false,
      link: '/quests/quest_1',
      createdAt: new Date(),
    } as unknown as Notification)

    const result = await createNotification({
      userId: 'creator_1',
      type: 'SQUAD_JOIN',
      message: 'Bob joined your squad for "React Mastery"',
      link: '/quests/quest_1',
    })

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'creator_1',
        type: 'SQUAD_JOIN',
        message: 'Bob joined your squad for "React Mastery"',
        link: '/quests/quest_1',
      },
    })
    expect(result.type).toBe('SQUAD_JOIN')
  })

  it('creates SQUAD_SUBMISSION notification with proper payload', async () => {
    vi.mocked(prisma.notification.create).mockResolvedValueOnce({
      id: 'notif_squad_sub',
      userId: 'creator_1',
      type: 'SQUAD_SUBMISSION',
      message: 'Your squad submitted solution for "React Mastery"',
      read: false,
      link: '/workspace',
      createdAt: new Date(),
    } as unknown as Notification)

    const result = await createNotification({
      userId: 'creator_1',
      type: 'SQUAD_SUBMISSION',
      message: 'Your squad submitted solution for "React Mastery"',
      link: '/workspace',
    })

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'creator_1',
        type: 'SQUAD_SUBMISSION',
        message: 'Your squad submitted solution for "React Mastery"',
        link: '/workspace',
      },
    })
    expect(result.type).toBe('SQUAD_SUBMISSION')
  })

  it('creates squad notification using createSquadNotification helper', async () => {
    vi.mocked(prisma.notification.create).mockResolvedValueOnce({
      id: 'notif_helper',
      userId: 'creator_1',
      type: 'SQUAD_JOIN',
      message: 'Charlie joined your squad',
      read: false,
      link: '/quests/quest_2',
      createdAt: new Date(),
    } as unknown as Notification)

    const result = await createSquadNotification({
      userId: 'creator_1',
      type: 'SQUAD_JOIN',
      message: 'Charlie joined your squad',
      link: '/quests/quest_2',
    })

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'creator_1',
        type: 'SQUAD_JOIN',
        message: 'Charlie joined your squad',
        link: '/quests/quest_2',
      },
    })
    expect(result.id).toBe('notif_helper')
  })

  it('returns squad notifications when fetching user notifications', async () => {
    const mockUser = { id: 'user_123', email: 'test@example.com' }
    mockAuth.mockResolvedValueOnce({ user: mockUser })
    vi.mocked(prisma.notification.findMany).mockResolvedValueOnce([
      {
        id: 'notif_squad_1',
        userId: 'user_123',
        type: 'SQUAD_JOIN',
        message: 'A player joined your squad',
        read: false,
        link: '/quests/q1',
        createdAt: new Date(),
      },
      {
        id: 'notif_squad_2',
        userId: 'user_123',
        type: 'SQUAD_SUBMISSION',
        message: 'Squad solution submitted',
        read: false,
        link: '/quests/q1',
        createdAt: new Date(),
      },
    ] as unknown as Notification[])

    const result = await getNotifications()
    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(2)
    expect(result.data?.[0].type).toBe('SQUAD_JOIN')
    expect(result.data?.[1].type).toBe('SQUAD_SUBMISSION')
  })
})
