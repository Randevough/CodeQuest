
'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import Image from 'next/image'
import { Info, CheckCircle2, Clock, Timer } from 'lucide-react'

export function PointsInfoModal() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center size-11 rounded-full bg-surface text-muted hover:bg-surface-raised transition-colors cursor-pointer"
                aria-label="View ranking rules"
            >
                <Info className="w-4 h-4" />
            </button>

            {isOpen && (
                <Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Point & Ranking Rules">
                        {/* Body */}
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 size-8 rounded-full bg-surface flex items-center justify-center text-success">
                                        <CheckCircle2 className="w-5 h-5 text-success" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-1">Approved Quests Only</h4>
                                        <p className="text-sm text-muted leading-relaxed">
                                            Points <span className="inline-flex align-baseline translate-y-0.5"><Image src="/icon.png" alt="Points" width={14} height={14} className="object-contain" /></span> displayed on the leaderboard are strictly from quests that have been <strong className="text-foreground font-medium">&apos;Approved&apos;</strong> by the Admin team.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 size-8 rounded-full bg-surface flex items-center justify-center text-foreground">
                                        <Clock className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-1">Pending Validation</h4>
                                        <p className="text-sm text-muted leading-relaxed">
                                            Tasks with <strong className="text-foreground font-medium">&apos;Pending Review&apos;</strong> or <strong className="text-foreground font-medium">&apos;Revision Needed&apos;</strong> status will not be added to your total balance until they are officially accepted.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-surface rounded-lg border border-border">
                                <div className="flex items-start gap-3">
                                    <Timer className="w-5 h-5 text-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-sm text-foreground mb-1">Tie-Breaker Rule</h4>
                                        <p className="text-sm text-muted">
                                            In case of a point tie, the member who achieved their last approval <span className="font-medium text-foreground">earliest</span> takes the higher rank.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer - optional, removed for clean look or just padding */}
                    <button className="button-secondary mt-4" onClick={() => setIsOpen(false)}>Close rules</button>
                </Dialog>
            )}
        </>
    )
}
