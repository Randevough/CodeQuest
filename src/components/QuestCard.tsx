'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'

import Link from 'next/link'
import Image from 'next/image'
import { dropQuest } from '@/actions/quest'

type Quest = {
    id: string
    title: string
    description: string
    maxSnatchers: number
    difficulty?: string | null
    category?: string | null
    points?: number | null
    deadline?: Date | string | null
    _count: { snatches: number }
}

export function QuestCard({ quest, isSnatched }: { quest: Quest, isSnatched: boolean }) {
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [showDropConfirm, setShowDropConfirm] = useState(false)


    const handleDrop = async () => {
        setLoading(true)
        setMsg('')
        try {
            const result = await dropQuest(quest.id)
            if (result.success) {
                setMsg('Dropped!')
                window.location.reload()
            } else {
                setMsg(result.error as string)
            }
        } catch {
            setMsg('Action failed')
        } finally {
            setLoading(false)
            setShowDropConfirm(false)
        }
    }

    const isFull = quest._count.snatches >= quest.maxSnatchers

    const getDeadlineLabel = () => {
        if (!quest.deadline) return 'No Deadline'
        const msLeft = new Date(quest.deadline).getTime() - Date.now()
        if (msLeft <= 0) return 'Expired'
        const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60))
        if (hoursLeft < 24) return `${hoursLeft}h left`
        const daysLeft = Math.floor(hoursLeft / 24)
        return `${daysLeft}d left`
    }


    const getDifficultyStyle = (diff?: string | null) => {
        const d = diff?.toLowerCase() || ''
        if (d === 'exclusive')
            return 'bg-surface   text-foreground font-bold   ring-1 ring-inset ring-focus border-0'
        if (d === 'advanced' || d === 'advance' || d === 'expert' || d === 'hard')
            return 'bg-surface text-foreground border border-border'
        if (d === 'intermediate')
            return 'bg-surface text-info border border-border'
        return 'bg-surface text-success border border-border'
    }

    return (
        <article className="group bg-surface rounded-card break-words p-6 h-full flex flex-col transition-all duration-fast border border-border hover:bg-surface-raised">
            {/* Header: difficulty + category tags + points badge */}
            <div className="flex flex-wrap gap-3 justify-between items-start mb-4">
                <div className="flex gap-2 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-bold capitalize ${getDifficultyStyle(quest.difficulty)}`}>
                        {quest.difficulty || 'Beginner'}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-semibold bg-surface text-muted border border-border">
                        {quest.category || 'Web'}
                    </span>
                </div>

                {/* Points badge — consistent with navbar style */}
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border text-warning text-sm font-semibold shrink-0 ml-2">
                    <Image src="/icon.png" alt="pts" width={13} height={13} className="object-contain" />
                    {quest.points || 100} pts
                </span>
            </div>

            {/* Title & Description */}
            <Link href={`/quests/${quest.id}`} className="min-h-11 block flex-grow">
                <h3 className="font-bold text-foreground mb-2 group-hover:text-foreground transition-colors leading-snug">
                    {quest.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                    {quest.description}
                </p>
            </Link>

            {/* Footer */}
            <div className="flex flex-wrap gap-3 items-center justify-between pt-4 border-t border-border mt-4">
                <div className="flex items-center gap-3 text-sm font-medium text-muted">
                    <div className="flex items-center gap-1">
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">group</span>
                        <span className={isFull ? 'text-danger' : 'text-foreground'}>
                            {quest._count.snatches}/{quest.maxSnatchers}
                        </span>
                        &nbsp;Devs
                    </div>
                    <div className="w-1 h-1 rounded-full bg-surface" />
                    <span>{getDeadlineLabel()}</span>
                </div>

                {isSnatched ? (
                    <button
                        onClick={() => setShowDropConfirm(true)}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-danger hover:text-danger hover:bg-surface-raised rounded border border-transparent hover:border-border transition-all"
                    >
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">delete</span>
                        Drop
                    </button>
                ) : (
                    <Link
                        href={`/quests/${quest.id}`}
                        className={`inline-flex min-h-11 items-center text-sm font-semibold px-3 py-1.5 rounded-button transition-all
                            ${isFull
                                ? 'bg-surface text-muted cursor-not-allowed'
                                : 'text-warning border border-border hover:bg-surface-raised hover:text-foreground hover:border-border'
                            }

                        `}
                    >
                        {isFull ? 'Full' : 'View Details'}
                    </Link>
                )}
            </div>

            {msg && <p role="status" className="text-sm text-center mt-2 text-muted">{msg}</p>}

            {/* Drop Confirmation Modal */}
            {showDropConfirm && (
                <Dialog open={showDropConfirm} onClose={() => setShowDropConfirm(false)} pending={loading} title="Drop this Quest?">
                        <p className="text-sm text-muted mb-6">
                            Are you sure? You won&apos;t be able to join another quest for 2 days.
                        </p>
                        <div className="flex gap-3">
                            <button
                                disabled={loading}
                                onClick={() => setShowDropConfirm(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-foreground bg-surface rounded-lg hover:bg-surface-raised transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDrop}
                                disabled={loading}
                                className="button-secondary flex-1"
                            >
                                {loading ? 'Dropping…' : 'Drop quest'}
                            </button>
                        </div>
                </Dialog>
            )}
        </article>
    )
}
