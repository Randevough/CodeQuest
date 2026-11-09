'use client'

import { useId, useState } from 'react'
import { Check } from 'lucide-react'
import { DifficultyPips } from './DifficultyPips'

type Stage = 0 | 1 | 2 | 3

const STAGES = ['Open', 'Taken', 'Submitted', 'Approved'] as const

const EXAMPLE = {
  title: 'Campus Event Check-in',
  description: 'Build a web app that lets organizers check attendees in by scanning a QR code.',
  category: 'Web',
  difficulty: 'Intermediate',
  points: 250,
  slots: 3,
  repo: 'https://github.com/your-name/event-checkin',
}

const STATUS_MESSAGES: Record<Stage, string> = {
  0: 'Quest is open.',
  1: 'Slot taken. Build the project, then submit your repository.',
  2: 'Submitted. Waiting for club staff to review.',
  3: `Approved by club staff. ${EXAMPLE.points} points added.`,
}

export interface QuestDemoProps {
  className?: string
}

export function QuestDemo({ className = '' }: QuestDemoProps) {
  const [stage, setStage] = useState<Stage>(0)
  const [repo, setRepo] = useState(EXAMPLE.repo)
  const repoId = useId()

  const slotsTaken = stage === 0 ? 1 : 2
  const earned = stage === 3 ? EXAMPLE.points : 0
  const canSubmit = repo.trim().length > 0

  return (
    <div
      data-testid="quest-demo"
      className={`panel w-full min-w-0 space-y-6 p-5 sm:p-6 ${className}`.trim()}
    >
      <ol className="flex items-center" aria-label="Quest progress">
        {STAGES.map((label, index) => {
          const reached = index <= stage
          const isCurrent = index === stage
          return (
            <li
              key={label}
              aria-current={isCurrent ? 'step' : undefined}
              className={`flex items-center ${index < STAGES.length - 1 ? 'flex-1' : ''}`}
            >
              <span className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold tabular-nums transition-colors duration-base ${
                    reached
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-control-border bg-inset text-muted'
                  }`}
                >
                  {reached && index < stage ? <Check className="size-4" aria-hidden="true" /> : index + 1}
                </span>
                <span className={`text-xs font-semibold ${isCurrent ? 'text-foreground' : 'text-muted'}`}>
                  {label}
                </span>
              </span>
              {index < STAGES.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`mx-2 mb-5 h-0.5 flex-1 rounded-full transition-colors duration-base ${
                    index < stage ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </li>
          )
        })}
      </ol>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">{EXAMPLE.category}</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
            <DifficultyPips difficulty={EXAMPLE.difficulty} />
            {EXAMPLE.difficulty}
          </span>
          <span className="chip chip-sky ml-auto">Example quest</span>
        </div>
        <h2 className="text-xl font-bold sm:text-2xl">{EXAMPLE.title}</h2>
        <p className="text-sm text-muted">{EXAMPLE.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between text-xs font-semibold">
            <span className="text-muted">Slots taken</span>
            <span className="tabular-nums">
              {slotsTaken} / {EXAMPLE.slots}
            </span>
          </div>
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: EXAMPLE.slots }, (_, i) => (
              <span
                key={i}
                className={`h-3.5 flex-1 rounded-full border-2 transition-colors duration-base ${
                  i < slotsTaken ? 'border-info-edge bg-info' : 'border-border bg-inset'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between text-xs font-semibold">
            <span className="text-muted">Points</span>
            <span className="tabular-nums" data-testid="demo-points">
              {earned} / {EXAMPLE.points}
            </span>
          </div>
          <div
            className="meter"
            role="progressbar"
            aria-label="Points earned"
            aria-valuemin={0}
            aria-valuemax={EXAMPLE.points}
            aria-valuenow={earned}
          >
            <div className="meter-fill" style={{ width: `${(earned / EXAMPLE.points) * 100}%` }} />
          </div>
        </div>
      </div>

      {stage === 1 && (
        <div className="space-y-2 animate-fade-in-up">
          <label htmlFor={repoId} className="block text-sm font-semibold">
            Repository URL
          </label>
          <input
            id={repoId}
            type="url"
            value={repo}
            onChange={(event) => setRepo(event.target.value)}
            className="w-full"
            autoComplete="off"
          />
        </div>
      )}

      {stage === 2 && (
        <p className="panel-inset p-3 text-sm animate-fade-in-up">
          Club staff open your repository and review it by hand. You see the result in your workspace.
        </p>
      )}

      {stage === 3 && (
        <div className="panel-inset space-y-2 p-3 animate-fade-in-up">
          <span className="chip chip-mint">
            <Check className="size-3.5" aria-hidden="true" />
            Approved
          </span>
          <p className="text-sm">
            <span className="text-muted">Example feedback: </span>
            Clear structure and a README that explains setup.
          </p>
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {STATUS_MESSAGES[stage]}
      </p>

      {stage === 0 && (
        <button type="button" onClick={() => setStage(1)} className="btn btn-primary btn-lg w-full">
          Take this quest
        </button>
      )}
      {stage === 1 && (
        <button
          type="button"
          onClick={() => setStage(2)}
          disabled={!canSubmit}
          className="btn btn-primary btn-lg w-full"
        >
          Submit repository
        </button>
      )}
      {stage === 2 && (
        <button type="button" onClick={() => setStage(3)} className="btn btn-primary btn-lg w-full">
          See the review result
        </button>
      )}
      {stage === 3 && (
        <button
          type="button"
          onClick={() => {
            setStage(0)
            setRepo(EXAMPLE.repo)
          }}
          className="btn btn-secondary btn-lg w-full"
        >
          Try it again
        </button>
      )}
    </div>
  )
}
