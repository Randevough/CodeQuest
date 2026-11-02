import { describe, it, expect, vi, beforeEach } from 'vitest'
import sitemap from '@/app/sitemap'
import robots from '@/app/robots'
import { prisma } from '@/lib/db'

vi.mock('@/lib/db', () => ({
    prisma: {
        quest: {
            findMany: vi.fn()
        }
    }
}))

describe('SEO metadata generation', () => {
    const originalNextAuthUrl = process.env.NEXTAUTH_URL

    beforeEach(() => {
        vi.clearAllMocks()
        process.env.NEXTAUTH_URL = 'https://codequest.dev'
    })

    describe('robots()', () => {
        it('returns valid robots structure with standard rules', () => {
            const result = robots()

            expect(result).toEqual({
                rules: {
                    userAgent: '*',
                    allow: '/',
                    disallow: ['/admin/', '/api/']
                },
                sitemap: 'https://codequest.dev/sitemap.xml'
            })
        })

        it('uses default fallback base URL when NEXTAUTH_URL is missing', () => {
            delete process.env.NEXTAUTH_URL

            const result = robots()

            expect(result.sitemap).toBe('https://codequest.dev/sitemap.xml')

            process.env.NEXTAUTH_URL = originalNextAuthUrl
        })
    })

    describe('sitemap()', () => {
        it('includes static routes and dynamic active quest routes', async () => {
            const mockDate = new Date('2026-03-30T00:00:00.000Z')
            vi.mocked(prisma.quest.findMany).mockResolvedValueOnce([
                {
                    id: 'quest-123',
                    updatedAt: mockDate
                } as never
            ])

            const result = await sitemap()

            expect(prisma.quest.findMany).toHaveBeenCalledWith({
                where: { status: 'Active' },
                select: { id: true, updatedAt: true }
            })

            const urls = result.map((entry) => entry.url)
            expect(urls).toContain('https://codequest.dev')
            expect(urls).toContain('https://codequest.dev/explore')
            expect(urls).toContain('https://codequest.dev/leaderboard')
            expect(urls).toContain('https://codequest.dev/workspace')
            expect(urls).toContain('https://codequest.dev/quests/quest-123')

            const questEntry = result.find((entry) => entry.url === 'https://codequest.dev/quests/quest-123')
            expect(questEntry).toBeDefined()
            expect(questEntry?.lastModified).toEqual(mockDate)
            expect(questEntry?.priority).toBe(0.8)
        })

        it('handles empty active quests list correctly', async () => {
            vi.mocked(prisma.quest.findMany).mockResolvedValueOnce([])

            const result = await sitemap()

            expect(result).toHaveLength(4)
            expect(result.map((e) => e.url)).toEqual([
                'https://codequest.dev',
                'https://codequest.dev/explore',
                'https://codequest.dev/leaderboard',
                'https://codequest.dev/workspace'
            ])
        })
    })
})
