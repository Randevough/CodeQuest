import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getNotifications, getUnreadNotificationCount, markNotificationRead, markAllNotificationsRead } from '@/actions/notification'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import type { Notification } from '@prisma/client'

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    notification: {
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
})
