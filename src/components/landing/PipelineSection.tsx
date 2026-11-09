export interface PipelineStep {
  step: string
  title: string
  description: string
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: '1',
    title: 'Take a slot',
    description: 'Pick a quest and take one of its open slots. You can hold up to 3 active quests at a time.',
  },
  {
    step: '2',
    title: 'Build in your repo',
    description: 'Work in your own Git repository. Quests with more than one slot can be done with a squad.',
  },
  {
    step: '3',
    title: 'Submit the URL',
    description: 'When the work is ready, send your repository URL from your workspace.',
  },
  {
    step: '4',
    title: 'Get reviewed by staff',
    description:
      'Club staff read your work by hand. Approved quests add their points to your total. If changes are needed, you get feedback and can resubmit.',
  },
]

export interface PipelineSectionProps {
  className?: string
}

export function PipelineSection({ className = '' }: PipelineSectionProps) {
  return (
    <section
      id="how-it-works"
      aria-labelledby="pipeline-heading"
      className={`page-container scroll-mt-6 ${className}`.trim()}
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-3 lg:col-span-4">
          <h2 id="pipeline-heading">How a quest works</h2>
          <p className="text-muted">The same four steps apply to every quest on the board.</p>
        </div>

        <ol className="lg:col-span-8">
          {PIPELINE_STEPS.map((item, index) => {
            const isLast = index === PIPELINE_STEPS.length - 1
            return (
              <li
                key={item.step}
                data-testid={`pipeline-step-${item.step}`}
                className="relative flex gap-5 pb-10 last:pb-0"
              >
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[21px] top-12 h-[calc(100%-3rem)] w-0.5 rounded-full bg-border"
                  />
                )}
                <span
                  data-testid={`step-number-${item.step}`}
                  className="relative flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-inset font-display text-lg tabular-nums"
                >
                  {item.step}
                </span>
                <div className="min-w-0 space-y-1.5 pt-1.5">
                  <h3>{item.title}</h3>
                  <p className="max-w-prose text-muted">{item.description}</p>
                  {isLast && <span className="chip chip-mint mt-2">Reviewed by a person</span>}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
