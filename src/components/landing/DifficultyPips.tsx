const LEVELS: Record<string, { level: number; label: string }> = {
  beginner: { level: 1, label: 'Beginner' },
  intermediate: { level: 2, label: 'Intermediate' },
  advanced: { level: 3, label: 'Advanced' },
}

export function getDifficulty(difficulty?: string): { level: number; label: string } {
  const key = difficulty?.trim().toLowerCase() ?? ''
  return LEVELS[key] ?? { level: 1, label: difficulty?.trim() || 'Beginner' }
}

export interface DifficultyPipsProps {
  difficulty?: string
  className?: string
}

/** Three key-shaped pips. Filled pips are the difficulty level. */
export function DifficultyPips({ difficulty, className = '' }: DifficultyPipsProps) {
  const { level, label } = getDifficulty(difficulty)

  return (
    <span
      role="img"
      aria-label={`Difficulty: ${label}`}
      data-testid="difficulty-pips"
      className={`inline-flex items-center gap-1 ${className}`.trim()}
    >
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`size-3 rounded-[4px] border-2 ${
            i <= level ? 'border-primary-edge bg-primary' : 'border-control-border bg-inset'
          }`}
        />
      ))}
    </span>
  )
}
