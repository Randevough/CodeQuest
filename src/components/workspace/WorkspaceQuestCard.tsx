'use client'

import { useState } from 'react'
import Link from 'next/link'
import { archiveQuest } from '@/actions/quest'
import Image from 'next/image'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'

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
    const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
    const { data: session } = useSession()

    // Status Logic
    const isRevision = snatch.status === 'REVISION_NEEDED'
    const isCompleted = ['ACCEPTED'].includes(snatch.status)
    const isPending = snatch.status === 'SUBMITTED'
    const isActive = snatch.status === 'ACTIVE'

    const handleArchive = async () => {
        setLoading(true)
        try {
            const result = await archiveQuest(snatch.quest.id)
            if (!result.success) {
                toast.error(result.error as string || 'Failed to archive quest')
            } else {
                toast.success('Quest archived successfully')
            }
        } catch {
            toast.error('Archive failed')
        } finally {
            setLoading(false)
            setShowArchiveConfirm(false)
        }
    }

    // Badge styling helpers - Matched to QuestCard.tsx
    const getDifficultyColor = (diff: string) => {
        const d = diff.toLowerCase()
        if (d === 'exclusive') return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30'
        if (d === 'expert' || d === 'hard' || d === 'advanced') return 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/30'
        if (d === 'intermediate') return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30'
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/30'
    }

    return (
        <article className={`group bg-white dark:bg-surface-dark border rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden relative
            border-slate-200 dark:border-slate-800
        `}>
            {/* Status Top Border Removed - Clean Look */}

            <div className="p-6 flex flex-col gap-4 relative">
                {/* Points Badge moved to Top Right (Absolute) */}
                <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 px-2.5 py-1 rounded-full border border-yellow-100 dark:border-yellow-800/50">
                    <Image
                        src="/icon.png"
                        alt="Points"
                        width={14}
                        height={14}
                        className="object-contain"
                    />
                    <span className="text-xs font-bold">{snatch.quest.points} pts</span>
                </div>
                <div className="flex justify-between items-start">
                    <div className="space-y-3 w-full">
                        <div className="flex items-center gap-3">
                            {/* Status Label (Optional visual cue) */}
                            {isRevision && (
                                <span className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                                    Revision Needed
                                </span>
                            )}
                            {isCompleted && (
                                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                    Mission Completed
                                </span>
                            )}
                            {isPending && (
                                <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                                    Pending Review
                                </span>
                            )}
                            {isActive && (
                                <span className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                                    Active Mission
                                </span>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{snatch.quest.title}</h3>

                        {/* Badges moved below title */}
                        <div className="flex items-center text-xs font-semibold tracking-wide pt-1 gap-2 flex-wrap">
                            {/* Difficulty Badge - Colorful (Swapped to First) */}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border capitalize ${getDifficultyColor(snatch.quest.difficulty)}`}>
                                {snatch.quest.difficulty}
                            </span>
                            {/* Category Badge - Neutral (Swapped to Second) */}
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 capitalize">
                                {snatch.quest.category}
                            </span>
                            {/* Squad Badge */}
                            {snatch.squad && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30">
                                    <span className="material-symbols-outlined text-[14px]">groups</span>
                                    {snatch.squad.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Feedback Section for Revision */}
                {isRevision && snatch.feedback && (
                    <div className="bg-red-50/80 dark:bg-red-900/10 backdrop-blur-md border border-red-100 dark:border-red-900/30 p-4 rounded-lg flex gap-3">
                        <div className="shrink-0 text-red-700 dark:text-red-400">
                            <span className="material-symbols-outlined">rate_review</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-red-700 dark:text-red-300 mb-1">Feedback from Admin</p>
                            <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                                &quot;{snatch.feedback}&quot;
                            </p>
                        </div>
                    </div>
                )}

                {/* Praise Section for Completed */}
                {isCompleted && snatch.feedback && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-lg flex gap-3">
                        <div className="shrink-0 text-emerald-700 dark:text-emerald-400">
                            <span className="material-symbols-outlined">thumb_up</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">Admin Feedback</p>
                            <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
                                &quot;{snatch.feedback}&quot;
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Left: User Avatar + Relative Time */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {session?.user?.avatar ? (
                            <Image src={session.user.avatar} alt={session.user.name || 'User'} width={32} height={32} className="size-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        ) : (
                            <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                {session?.user?.name || 'Snatcher'}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
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
                                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow hover:shadow-md flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">archive</span>
                                Archive Quest
                            </button>
                        ) : isRevision ? (
                            <Link href={`/quests/${snatch.quest.id}`} className="block w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow hover:shadow-md text-center">
                                Fix & Resubmit
                            </Link>
                        ) : isPending ? (
                            <Link href={`/quests/${snatch.quest.id}`} className="block w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow hover:shadow-md text-center">
                                View Submission
                            </Link>
                        ) : (
                            <Link href={`/quests/${snatch.quest.id}`} className="block w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow hover:shadow-md text-center">
                                Continue Quest
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Archive Confirmation Modal */}
            {showArchiveConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-100 dark:border-slate-800 transform transition-all">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Archive this Mission?</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">
                            It will be removed from your workspace to free up a slot.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowArchiveConfirm(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleArchive}
                                disabled={loading}
                                className="flex-1 px-4 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                            >
                                {loading ? 'Archiving...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </article>
    )
}
