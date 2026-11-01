'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import Link from 'next/link'
import { archiveQuest } from '@/actions/quest'
import Image from 'next/image'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import { Users, FileEdit, ThumbsUp, Archive } from 'lucide-react'
import { UserAvatar } from '@/components/ui/UserAvatar'

type SnatchWithQuest = {
    id: string
    status: string
    feedback?: string | null
    submissionUrl?: string | null
    updatedAt: Date
    quest: {
        id: string
        title: string
        description: string
        points: number
        maxSnatchers: number
        category: string
        difficulty: string
        deadline?: Date | null
        _count: { snatches: number }
    }
    squad?: {
        name: string | null
    } | null
}

export function WorkspaceQuestCard({ snatch }: { snatch: SnatchWithQuest }) {
    const [loading, setLoading] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
    const { data: session } = useSession()

    // Status Logic
    const isRevision = snatch.status === 'REVISION_NEEDED'
    const isCompleted = ['ACCEPTED'].includes(snatch.status)
    const isPending = snatch.status === 'SUBMITTED'
    const isActive = snatch.status === 'ACTIVE'

    const handleArchive = async () => {
        setFeedback('')
        setLoading(true)
        try {
            const result = await archiveQuest(snatch.quest.id)
            if (!result.success) {
                setFeedback(result.error as string || 'Failed to archive quest'); toast.error(result.error as string || 'Failed to archive quest')
            } else {
                toast.success('Quest archived successfully')
            }
        } catch {
            setFeedback('Archive failed'); toast.error('Archive failed')
        } finally {
            setLoading(false)
            setShowArchiveConfirm(false)
        }
    }

    // Badge styling helpers - Matched to QuestCard.tsx
    const getDifficultyColor = (diff: string) => {
        const d = diff.toLowerCase()
        if (d === 'exclusive') return 'bg-surface text-warning border-border'
        if (d === 'expert' || d === 'hard' || d === 'advanced') return 'bg-surface text-foreground border-border'
        if (d === 'intermediate') return 'bg-surface text-info border-border'
        return 'bg-surface text-success border-border'
    }

    return (
        <article className={`group bg-surface dark:bg-surface-dark border rounded-card break-words   transition-all duration-fast overflow-hidden relative
            border-border
        `}>
            {/* Status Top Border Removed - Clean Look */}

            <div className="p-6 flex flex-col gap-4 relative">
                {/* Points Badge moved to Top Right (Absolute) */}
                <div className="self-start flex items-center gap-1.5 bg-surface text-warning px-2.5 py-1 rounded-full border border-border">
                    <Image
                        src="/icon.png"
                        alt="Points"
                        width={14}
                        height={14}
                        className="object-contain"
                    />
                    <span className="text-sm font-bold">{snatch.quest.points} pts</span>
                </div>
                <div className="flex justify-between items-start">
                    <div className="space-y-3 w-full">
                        <div className="flex items-center gap-3">
                            {/* Status Label (Optional visual cue) */}
                            {isRevision && (
                                <span className="text-danger text-sm font-bold uppercase tracking-wider">
                                    Revision Needed
                                </span>
                            )}
                            {isCompleted && (
                                <span className="text-success text-sm font-bold uppercase tracking-wider">
                                    Mission Completed
                                </span>
                            )}
                            {isPending && (
                                <span className="text-warning text-sm font-bold uppercase tracking-wider">
                                    Pending Review
                                </span>
                            )}
                            {isActive && (
                                <span className="text-info text-sm font-bold uppercase tracking-wider">
                                    Active Mission
                                </span>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-foreground leading-tight">{snatch.quest.title}</h3>

                        {/* Badges moved below title */}
                        <div className="flex items-center text-sm font-semibold tracking-wide pt-1 gap-2 flex-wrap">
                            {/* Difficulty Badge - Colorful (Swapped to First) */}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium border capitalize ${getDifficultyColor(snatch.quest.difficulty)}`}>
                                {snatch.quest.difficulty}
                            </span>
                            {/* Category Badge - Neutral (Swapped to Second) */}
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-surface text-muted border border-border capitalize">
                                {snatch.quest.category}
                            </span>
                            {/* Squad Badge */}
                            {snatch.squad && (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-sm font-medium bg-surface text-foreground border border-border">
                                    <Users className="w-3.5 h-3.5" aria-hidden="true" />
                                    {snatch.squad.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Feedback Section for Revision */}
                {isRevision && snatch.feedback && (
                    <div className="bg-surface border border-border p-4 rounded-lg flex gap-3">
                        <div className="shrink-0 text-danger">
                            <FileEdit className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-danger mb-1">Feedback from Admin</p>
                            <p className="text-sm text-danger leading-relaxed">
                                &quot;{snatch.feedback}&quot;
                            </p>
                        </div>
                    </div>
                )}

                {/* Praise Section for Completed */}
                {isCompleted && snatch.feedback && (
                    <div className="bg-surface border border-border p-4 rounded-lg flex gap-3">
                        <div className="shrink-0 text-success">
                            <ThumbsUp className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-success mb-1">Admin Feedback</p>
                            <p className="text-sm text-success leading-relaxed">
                                &quot;{snatch.feedback}&quot;
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-2 pt-4 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Left: User Avatar + Relative Time */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <UserAvatar
                            src={session?.user?.avatar}
                            name={session?.user?.name}
                            size={32}
                            className="size-8 rounded-full border border-border"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground">
                                {session?.user?.name || 'Snatcher'}
                            </span>
                            <span className="text-sm text-muted font-medium">
                                Updated {formatDistanceToNow(new Date(snatch.updatedAt), { addSuffix: true })}
                            </span>
                        </div>
                    </div>

                    {/* Right: Primary Action Button (Burnt Orange for All) */}
                    <div className="w-full sm:w-auto">
                        {isCompleted ? (
                            <button
                                onClick={() => setShowArchiveConfirm(true)}
                                disabled={loading}
                                className="button-primary w-full sm:w-auto"
                            >
                                <Archive className="w-4 h-4" aria-hidden="true" />
                                Archive Quest
                            </button>
                        ) : isRevision ? (
                            <Link href={`/quests/${snatch.quest.id}`} className="w-full sm:w-auto button-secondary">
                                Fix & Resubmit
                            </Link>
                        ) : isPending ? (
                            <Link href={`/quests/${snatch.quest.id}`} className="w-full sm:w-auto button-secondary">
                                View Submission
                            </Link>
                        ) : (
                            <Link href={`/quests/${snatch.quest.id}`} className="w-full sm:w-auto button-secondary">
                                Continue Quest
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {feedback && <p role="status" className="px-6 pb-4 text-danger">{feedback}</p>}
            {/* Archive Confirmation Modal */}
            {showArchiveConfirm && (
                <Dialog open={showArchiveConfirm} onClose={() => setShowArchiveConfirm(false)} pending={loading} title="Archive this Mission?">
                        <p className="text-sm text-muted mb-6">
                            It will be removed from your workspace to free up a slot.
                        </p>
                        <div className="flex gap-3">
                            <button
                                disabled={loading}
                                onClick={() => setShowArchiveConfirm(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-foreground bg-surface rounded-lg hover:bg-surface-raised transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleArchive}
                                disabled={loading}
                                className="button-secondary flex-1"
                            >
                                {loading ? 'Archiving...' : 'Confirm'}
                            </button>
                        </div>
                </Dialog>
            )}
        </article>
    )
}
