import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://codequest.dev'

    let quests: Array<{ id: string; updatedAt: Date }> = []
    try {
        quests = await prisma.quest.findMany({
            where: { status: 'Active' },
            select: { id: true, updatedAt: true }
        })
    } catch {
        // DB unreachable during build static prerender
        quests = []
    }

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0
        },
        {
            url: `${baseUrl}/explore`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9
        },
        {
            url: `${baseUrl}/leaderboard`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.8
        },
        {
            url: `${baseUrl}/workspace`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7
        }
    ]

    const dynamicRoutes: MetadataRoute.Sitemap = quests.map((quest) => ({
        url: `${baseUrl}/quests/${quest.id}`,
        lastModified: quest.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8
    }))

    return [...staticRoutes, ...dynamicRoutes]
}
