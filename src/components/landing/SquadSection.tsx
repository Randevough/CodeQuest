'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, UserPlus } from 'lucide-react'

const TOTAL_SLOTS = 3

export function SquadSection() {
  const [filled, setFilled] = useState(2)
  const isFull = filled >= TOTAL_SLOTS

  return (
    <section aria-labelledby="squad-section-title" className="page-container">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-5 lg:col-span-5">
          <h2 id="squad-section-title">Take on bigger quests as a squad</h2>
          <p className="max-w-prose text-muted">
            Some quests have more than one slot, and those can be done as a squad. Create a squad on the quest page,
            and other members can join it to fill the remaining slots.
          </p>
          <Link href="/explore" className="btn btn-secondary">
            Find a quest
          </Link>
        </div>

        <div className="lg:col-span-7">
          <div data-testid="squad-demo" className="panel space-y-4 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-bold">Squad lobby</p>
              <div className="flex items-center gap-2">
                <span data-testid="party-slots-badge" className="chip chip-sky tabular-nums">
                  {filled} of {TOTAL_SLOTS} slots filled
                </span>
                <span className="chip">Example</span>
              </div>
            </div>

            <ul className="space-y-3">
              {Array.from({ length: TOTAL_SLOTS }, (_, index) => {
                const isOccupied = index < filled
                if (isOccupied) {
                  return (
                    <li
                      key={index}
                      className="panel-inset flex items-center justify-between gap-3 p-3.5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-control-border bg-surface font-mono text-xs font-bold tabular-nums">
                          {index + 1}
                        </span>
                        <span className="truncate text-sm font-semibold">
                          {index === 0 ? 'Squad leader' : 'Teammate'}
                        </span>
                      </div>
                      <span className="chip chip-mint">
                        <Check className="size-3.5" aria-hidden="true" />
                        Joined
                      </span>
                    </li>
                  )
                }
                return (
                  <li key={index}>
                    <button
                      type="button"
                      data-testid="squad-slot-open"
                      onClick={() => setFilled((n) => Math.min(n + 1, TOTAL_SLOTS))}
                      className="flex w-full items-center justify-between gap-3 rounded-input border-2 border-dashed border-control-border p-3.5 text-left hover:border-primary hover:bg-inset"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-control-border text-muted">
                          <UserPlus className="size-4" aria-hidden="true" />
                        </span>
                        <span className="text-sm font-semibold">Open slot</span>
                      </span>
                      <span className="text-xs font-semibold text-muted">Press to fill</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center justify-between gap-3 border-t-2 border-border pt-4">
              <p className="text-sm text-muted">
                {isFull ? 'The squad is full.' : 'Slots fill as members join.'}
              </p>
              {filled > 2 && (
                <button
                  type="button"
                  onClick={() => setFilled(2)}
                  className="btn btn-ghost btn-sm"
                >
                  Reset example
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
