'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/auth'

// Internal helper — NOT called from client directly.
// Callers MUST wrap this in try/catch (Safeguard #2: best-effort, failure-isolated).
export async function createNotification({
  userId,
  type,
  message,
  link,
}: {
  userId: string
  type: string
  message: string
  link?: string
}) {
  return await prisma.notification.create({
    data: { userId, type, message, link },
  })
}

export async function getNotifications(limit = 20) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return { success: true, data: notifications }
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return { success: false, error: 'Failed to fetch notifications' }
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const session = await auth()
    if (!session?.user?.id) return 0

    return await prisma.notification.count({
      where: { userId: session.user.id, read: false },
    })
  } catch {
    return 0
  }
}

export async function markNotificationRead(notificationId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification || notification.userId !== session.user.id) {
      return { success: false, error: 'Notification not found' }
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
    return { success: false, error: 'Failed to mark notification as read' }
  }
}

export async function markAllNotificationsRead() {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    await prisma.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
    return { success: false, error: 'Failed to mark all notifications as read' }
  }
}
