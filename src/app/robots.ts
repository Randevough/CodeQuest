import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://codequest.cyber-univ.ac.id'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/explore', '/leaderboard', '/about', '/quests/*'],
        disallow: ['/admin/', '/workspace/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
