import Link from 'next/link'
import { QuestBubble, QuestTeaser } from './QuestBubble'

export interface QuestShowcaseSectionProps {
  /** Live quests. `null` means the board could not be loaded. */
  quests: QuestTeaser[] | null
  className?: string
}

export function QuestShowcaseSection({ quests, className = '' }: QuestShowcaseSectionProps) {
  return (
    <section
      aria-labelledby="quest-showcase-heading"
      className={`page-container ${className}`.trim()}
    >
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <h2 id="quest-showcase-heading">What is on the board now</h2>
          <p className="max-w-xl text-muted">
            The highest-value open quests right now. Open one to see its requirements, slots and deadline.
          </p>
        </div>
        <Link href="/explore" className="btn btn-secondary btn-sm shrink-0 self-start sm:self-auto">
          See all quests
        </Link>
      </div>

      {quests === null ? (
        <div data-testid="quests-unavailable" className="panel p-8 text-center">
          <p className="mb-1 font-bold">The quest board could not be loaded</p>
          <p className="text-sm text-muted">Try again in a moment, or open the full quest list.</p>
        </div>
      ) : quests.length === 0 ? (
        <div data-testid="quests-empty-state" className="panel p-8 text-center">
          <p className="mb-1 font-bold">No active quests right now</p>
          <p className="text-sm text-muted">Club staff post new quests here when they are ready.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {quests.map((quest) => (
            <li key={quest.id}>
              <QuestBubble quest={quest} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
