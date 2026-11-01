import { getActivityFeed } from '@/actions/activity'
import type { ActivityFeedItem } from '@/actions/activity'
import Link from 'next/link'
import { Award, PlusCircle, Trophy, Zap, Hourglass } from 'lucide-react'

function FeedIcon({ type }: { type: ActivityFeedItem['type'] }) {
  if (type === 'quest_completed') {
    return <Award className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
  }
  if (type === 'quest_published') {
    return <PlusCircle className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
  }
  return <Trophy className="w-4 h-4 text-warning shrink-0" aria-hidden="true" />
}

function FeedItem({ item }: { item: ActivityFeedItem }) {
  return (
    <Link
      href={item.link}
      className="min-h-11 flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-raised transition-colors group"
    >
      <div className="mt-0.5">
        <FeedIcon type={item.type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-snug text-foreground">
          {item.userName && (
            <span className="font-semibold text-foreground">
              {item.userName}
            </span>
          )}{' '}
          {item.message}
        </p>
        <p className="text-sm text-muted mt-0.5 font-mono">
          {item.relativeTime}
        </p>
      </div>
    </Link>
  )
}

export async function ActivityFeed() {
  const { data: items } = await getActivityFeed(10)

  return (
    <aside className="lg:sticky lg:top-24 h-fit">
      <div className="bg-surface border border-border rounded-card break-words p-1">
        <div className="bg-surface rounded-lg border border-border">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Zap className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-mono uppercase tracking-[0.2em] font-bold text-muted">
              Recent activity
            </span>

          </div>

          {/* Feed items */}
          <div className="py-1 max-h-[480px] overflow-y-auto styled-scrollbar">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Hourglass className="w-8 h-8 text-muted mx-auto mb-2 block" aria-hidden="true" />
                <p className="text-sm text-muted">
                  No activity yet. Be the first to complete a quest
                </p>
              </div>
            ) : (
              items.map((item, index) => (
                <FeedItem key={`${item.type}-${item.timestamp.getTime()}-${index}`} item={item} />
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
