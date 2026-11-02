import { getActivityFeed } from '@/actions/activity'

export const dynamic = 'force-dynamic'

export async function GET(req: Request = new Request('http://localhost/api/events/activity')) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      req.signal.onabort = () => {
        try {
          controller.close()
        } catch {
          // Stream already closed
        }
      }

      controller.enqueue(encoder.encode(': connected\n\n'))

      try {
        const activities = await getActivityFeed(5)
        if (!req.signal.aborted) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(activities)}\n\n`))
        }
      } catch (error) {
        try {
          controller.error(error)
        } catch {
          // Stream already closed
        }
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  })
}
