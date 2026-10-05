import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://codequest.cyber-univ.ac.id'

  let questRoutes: MetadataRoute.Sitemap = []
  try {
    const activeQuests = await prisma.quest.findMany({
      where: { status: 'Active' },
      select: {
        id: true,
        updatedAt: true,
      },
    })

    questRoutes = activeQuests.map((quest) => ({
      url: `${baseUrl}/quests/${quest.id}`,
      lastModified: quest.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('sitemap active quests query notice (fallback to static only):', error)
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  return [...staticRoutes, ...questRoutes]
}
