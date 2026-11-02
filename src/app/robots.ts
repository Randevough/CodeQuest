import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://codequest.dev'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/']
        },
        sitemap: `${baseUrl}/sitemap.xml`
    }
}
