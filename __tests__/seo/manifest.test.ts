import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import manifest from '@/app/manifest'

describe('PWA Manifest', () => {
    it('returns valid manifest metadata configuration', () => {
        const config = manifest()

        expect(config.name).toBe('CodeQuest - Gamified Developer Arena')
        expect(config.short_name).toBe('CodeQuest')
        expect(config.start_url).toBe('/')
        expect(config.display).toBe('standalone')
        expect(config.background_color).toBe('#0a0b10')
        expect(config.theme_color).toBe('#00f0ff')
        expect(config.icons).toEqual([
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ])
    })
})

describe('LLMs Discovery Specs', () => {
    it('verifies public/llms.txt exists and has content', () => {
        const llmsPath = path.join(process.cwd(), 'public/llms.txt')
        expect(fs.existsSync(llmsPath)).toBe(true)

        const content = fs.readFileSync(llmsPath, 'utf8')
        expect(content.length).toBeGreaterThan(0)
        expect(content).toContain('CodeQuest')
        expect(content).toContain('/sitemap.xml')
        expect(content).toContain('/explore')
        expect(content).toContain('/leaderboard')
    })

    it('verifies public/llms-full.txt exists and has content', () => {
        const llmsFullPath = path.join(process.cwd(), 'public/llms-full.txt')
        expect(fs.existsSync(llmsFullPath)).toBe(true)

        const content = fs.readFileSync(llmsFullPath, 'utf8')
        expect(content.length).toBeGreaterThan(0)
        expect(content).toContain('CodeQuest')
        expect(content).toContain('Squad Mechanics')
    })
})
