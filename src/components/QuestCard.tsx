'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
    const router = useRouter()

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
        } catch (e) {
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
            return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white font-bold shadow-md shadow-amber-400/50 ring-1 ring-inset ring-yellow-200/40 border-0'
        if (d === 'advanced' || d === 'advance' || d === 'expert' || d === 'hard')
            return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50'
        if (d === 'intermediate')
            return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50'
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50'
    }

    return (
        <article className={`group bg-white dark:bg-zinc-800 rounded-xl p-6 h-full flex flex-col transition-all duration-300 border
            shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)]
            hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] dark:hover:bg-zinc-700/80 dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]
            ${isSnatched
                ? 'border-orange-200 dark:border-orange-500/30'
                : 'border-transparent dark:border-zinc-700/60 hover:border-orange-500/20 dark:hover:border-orange-500/30'
            }
        `}>
            {/* Header: difficulty + category tags + points badge */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold capitalize ${getDifficultyStyle(quest.difficulty)}`}>
                        {quest.difficulty || 'Beginner'}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-zinc-700">
                        {quest.category || 'Web'}
                    </span>
                </div>

                {/* Points badge — consistent with navbar style */}
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-amber-900/30 border border-yellow-200 dark:border-amber-700/50 text-yellow-700 dark:text-amber-400 text-xs font-semibold shrink-0 ml-2">
                    <Image src="/icon.png" alt="pts" width={13} height={13} className="object-contain" />
                    {quest.points || 100} pts
                </span>
            </div>

            {/* Title & Description */}
            <Link href={`/quests/${quest.id}`} className="block flex-grow">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors leading-snug">
                    {quest.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                    {quest.description}
                </p>
            </Link>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-4">
                <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">group</span>
                        <span className={isFull ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}>
                            {quest._count.snatches}/{quest.maxSnatchers}
                        </span>
                        &nbsp;Devs
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span>{getDeadlineLabel()}</span>
                </div>

                {isSnatched ? (
                    <button
                        onClick={() => setShowDropConfirm(true)}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-transparent hover:border-red-100 transition-all"
                    >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        Drop
                    </button>
                ) : (
                    <Link
                        href={`/quests/${quest.id}`}
                        className={`text-xs font-semibold px-3 py-1.5 rounded transition-all
                            ${isFull
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500'
                                : 'text-amber-500 border border-amber-500/50 hover:bg-amber-600 hover:text-white hover:border-amber-600'
                            }
                           
                        `}
                    >
                        {isFull ? 'Full' : 'View Details'}
                    </Link>
                )}
            </div>

            {msg && <p className="text-xs text-center mt-2 text-slate-400">{msg}</p>}

            {/* Drop Confirmation Modal */}
            {showDropConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-100 dark:border-zinc-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Drop this Quest?</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Are you sure? You won't be able to join another quest for 2 days.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDropConfirm(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDrop}
                                disabled={loading}
                                className="flex-1 px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </article>
    )
}
