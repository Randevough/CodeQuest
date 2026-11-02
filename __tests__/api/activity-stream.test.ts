import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/events/activity/route'
import { getActivityFeed } from '@/actions/activity'

vi.mock('@/actions/activity', () => ({
  getActivityFeed: vi.fn(),
}))

describe('GET /api/events/activity', () => {
  const mockActivities = {
    success: true,
    data: [
      {
        type: 'quest_completed' as const,
        message: 'completed "Defeat the Dragon"',
        userId: 'user-1',
        userName: 'PlayerOne',
        userAvatar: null,
        timestamp: new Date('2026-03-01T12:00:00Z'),
        relativeTime: '2 hours ago',
        link: '/quests/quest-1',
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getActivityFeed).mockResolvedValue(mockActivities as never)
  })

  it('returns HTTP 200 status with SSE headers', async () => {
    const res = await GET()

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('text/event-stream')
    expect(res.headers.get('Cache-Control')).toContain('no-cache')
    expect(res.headers.get('Connection')).toBe('keep-alive')
  })

  it('streams initial heartbeat and activity payload', async () => {
    const res = await GET()
    const reader = res.body?.getReader()
    expect(reader).toBeDefined()

    const decoder = new TextDecoder()
    let streamText = ''

    if (reader) {
      const chunk1 = await reader.read()
      if (chunk1.value) {
        streamText += decoder.decode(chunk1.value)
      }

      const chunk2 = await reader.read()
      if (chunk2.value) {
        streamText += decoder.decode(chunk2.value)
      }
    }

    expect(getActivityFeed).toHaveBeenCalledWith(5)
    expect(streamText).toContain(': connected')
    expect(streamText).toContain('Defeat the Dragon')
  })

  it('handles client abort cleanup via signal', async () => {
    const controller = new AbortController()
    const req = new Request('http://localhost/api/events/activity', {
      signal: controller.signal,
    })

    const res = await GET(req)
    expect(res.status).toBe(200)

    controller.abort()
    expect(req.signal.aborted).toBe(true)
  })
})
