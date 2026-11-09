import Link from 'next/link'
import { DifficultyPips, getDifficulty } from './DifficultyPips'

export interface QuestTeaser {
  id: string
  title: string
  description: string
  difficulty?: string
  category: string
  points: number
  maxSnatchers?: number
}

export interface QuestBubbleProps {
  quest?: QuestTeaser
  id?: string
  title?: string
  description?: string
  difficulty?: string
  category?: string
  points?: number
  maxSnatchers?: number
  href?: string
  className?: string
}

export function describePlayers(maxSnatchers?: number): string {
  if (!maxSnatchers || maxSnatchers <= 1) return 'Solo quest'
  return `Up to ${maxSnatchers} players`
}

export function QuestBubble({
  quest,
  id: propId,
  title: propTitle,
  description: propDescription,
  difficulty: propDifficulty,
  category: propCategory,
  points: propPoints,
  maxSnatchers: propMaxSnatchers,
  href: propHref,
  className = '',
}: QuestBubbleProps) {
  const id = quest?.id ?? propId ?? 'quest'
  const title = quest?.title ?? propTitle ?? 'Untitled quest'
  const description = quest?.description ?? propDescription ?? ''
  const difficulty = quest?.difficulty ?? propDifficulty
  const category = quest?.category ?? propCategory ?? 'Web'
  const points = quest?.points ?? propPoints ?? 0
  const maxSnatchers = quest?.maxSnatchers ?? propMaxSnatchers
  const targetHref = propHref ?? (id ? `/quests/${id}` : '/explore')
  const { label: difficultyLabel } = getDifficulty(difficulty)

  return (
    <article
      data-testid="quest-card"
      className={`panel flex h-full flex-col justify-between gap-6 p-6 ${className}`.trim()}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span data-testid="category-chip" className="chip">
            {category}
          </span>
          {difficulty && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
              <DifficultyPips difficulty={difficulty} />
              {difficultyLabel}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="line-clamp-3 text-sm text-muted">{description}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <span data-testid="points-chip" className="chip chip-amber font-mono tabular-nums">
            +{points} pts
          </span>
          <p className="text-xs text-muted">{describePlayers(maxSnatchers)}</p>
        </div>
        <Link href={targetHref} className="btn btn-secondary btn-sm">
          View quest
        </Link>
      </div>
    </article>
  )
}
