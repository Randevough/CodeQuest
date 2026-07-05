'use server'

import { prisma } from '@/lib/db'
import { formatDistanceToNow } from 'date-fns'

export interface ActivityFeedItem {
  type: 'quest_completed' | 'quest_published' | 'badge_earned'
  message: string
  userId: string | null
  userName: string | null
  userAvatar: string | null
  timestamp: Date
  relativeTime: string
  link: string
}

export async function getActivityFeed(limit = 10): Promise<{ success: boolean; data: ActivityFeedItem[] }> {
  try {
    const [completions, published, badges] = await Promise.all([
      // Quest completions (ACCEPTED snatches)
      prisma.snatch.findMany({
        where: { status: 'ACCEPTED' },
        orderBy: { approvedAt: 'desc' },
        take: limit,
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          quest: { select: { id: true, title: true } },
        },
      }),

      // Newly published quests
      prisma.quest.findMany({
        where: { status: 'Active' },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),

      // Badge unlocks
      prisma.userBadge.findMany({
        orderBy: { earnedAt: 'desc' },
        take: limit,
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          badge: { select: { name: true, slug: true, imageUrl: true } },
        },
      }),
    ])

    const items: ActivityFeedItem[] = []

    for (const s of completions) {
      items.push({
        type: 'quest_completed',
        message: `completed "${s.quest.title}"`,
        userId: s.user.id,
        userName: s.user.name,
        userAvatar: s.user.avatar,
        timestamp: s.approvedAt ?? s.updatedAt,
        relativeTime: formatDistanceToNow(s.approvedAt ?? s.updatedAt, { addSuffix: true }),
        link: `/quests/${s.quest.id}`,
      })
    }

    for (const q of published) {
      items.push({
        type: 'quest_published',
        message: `New quest available: "${q.title}"`,
        userId: null,
        userName: null,
        userAvatar: null,
        timestamp: q.createdAt,
        relativeTime: formatDistanceToNow(q.createdAt, { addSuffix: true }),
        link: `/quests/${q.id}`,
      })
    }

    for (const ub of badges) {
      items.push({
        type: 'badge_earned',
        message: `earned the "${ub.badge.name}" badge`,
        userId: ub.user.id,
        userName: ub.user.name,
        userAvatar: ub.user.avatar,
        timestamp: ub.earnedAt,
        relativeTime: formatDistanceToNow(ub.earnedAt, { addSuffix: true }),
        link: `/profile/${ub.user.id}`,
      })
    }

    // Sort by timestamp descending, then slice to limit
    items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    return { success: true, data: items.slice(0, limit) }
  } catch (error) {
    console.error('Failed to fetch activity feed:', error)
    return { success: true, data: [] }
  }
}
