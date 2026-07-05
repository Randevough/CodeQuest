import { getActivityFeed } from '@/actions/activity'
import type { ActivityFeedItem } from '@/actions/activity'
import Link from 'next/link'

function FeedIcon({ type }: { type: ActivityFeedItem['type'] }) {
  const icons: Record<ActivityFeedItem['type'], { icon: string; color: string }> = {
    quest_completed: { icon: 'military_tech', color: 'text-orange-500' },
    quest_published: { icon: 'add_circle', color: 'text-emerald-500' },
    badge_earned: { icon: 'emoji_events', color: 'text-amber-500' },
  }

  const { icon, color } = icons[type]

  return (
    <span className={`material-symbols-outlined text-[18px] ${color} flex-shrink-0`}>
      {icon}
    </span>
  )
}

function FeedItem({ item }: { item: ActivityFeedItem }) {
  return (
    <Link
      href={item.link}
      className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
    >
      <div className="mt-0.5">
        <FeedIcon type={item.type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-snug text-slate-700 dark:text-slate-300">
          {item.userName && (
            <span className="font-semibold text-slate-900 dark:text-white">
              {item.userName}
            </span>
          )}{' '}
          {item.message}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
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
      {/* Glassmorphism card */}
      <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 rounded-xl p-1 shadow-sm">
        <div className="bg-white/50 dark:bg-zinc-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-700/50">
            <span className="material-symbols-outlined text-[16px] text-orange-500">
              electric_bolt
            </span>
            <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-slate-400">
              Live Feed
            </span>
            <div className="ml-auto flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
            </div>
          </div>

          {/* Feed items */}
          <div className="py-1 max-h-[480px] overflow-y-auto styled-scrollbar">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <span className="material-symbols-outlined text-[32px] text-slate-300 dark:text-slate-600 mb-2 block">
                  hourglass_empty
                </span>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  No activity yet. Be the first to complete a quest!
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
