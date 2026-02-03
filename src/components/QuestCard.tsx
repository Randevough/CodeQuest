'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { dropQuest } from '@/actions/quest'

import Image from 'next/image'

type Quest = {
    id: string
    title: string
    description: string
    maxSnatchers: number
    difficulty?: string | null
    category?: string | null
    points?: number | null
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
                // We typically reload to update the list
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
    const daysLeft = 2; // Still mocked

    const getDifficultyColor = (diff?: string | null) => {
        const d = diff?.toLowerCase() || ''
        if (d === 'expert' || d === 'hard' || d === 'advanced') return 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/30'
        if (d === 'intermediate') return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30'
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/30'
    }

    const getPointStyle = (points: number) => {
        if (points >= 300) return 'bg-amber-100 text-amber-900 border-amber-200 font-bold dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800'
        if (points >= 150) return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-800/30'
        return 'bg-transparent text-amber-600 border-transparent shadow-none px-0 dark:text-amber-500'
    }

    return (
        <article className={`group flex flex-col bg-white dark:bg-surface-dark rounded-xl border transition-all duration-300 shadow-sm hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_6px_20px_rgba(255,255,255,0.05)]
        ${isSnatched
                ? 'border-slate-300 dark:border-gray-600 shadow-md'
                : 'border-slate-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
            }
    `}>
            <div className="p-4 flex flex-col h-full relative">
                <div className="flex justify-between items-start mb-2.5">
                    <div className="flex gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${getDifficultyColor(quest.difficulty)}`}>
                            {quest.difficulty || 'Beginner'}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                            {quest.category || 'Web'}
                        </span>
                    </div>
                    {/* Dynamic Golden Reward Badge */}
                    <div className={`absolute top-4 right-4 inline-flex items-center px-1.5 py-0.5 rounded-full border text-[11px] ${getPointStyle(quest.points || 0)}`}>
                        <Image src="/icon.png" alt="Points" width={14} height={14} className="mr-1 object-contain" />
                        <span className={quest.points && quest.points >= 300 ? 'font-bold' : 'font-medium'}>{quest.points || 100} pts</span>
                    </div>
                </div>

                <Link href={`/quests/${quest.id}`} className="block group-hover:opacity-80 transition-opacity">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 leading-snug">
                        {quest.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed h-[40px]">
                        {quest.description}
                    </p>
                </Link>

                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center text-[11px] text-gray-500 gap-1 font-medium">
                            <span className="material-symbols-outlined text-[16px]">group</span>
                            <span className={isFull ? 'text-red-600' : ''}>
                                {quest._count.snatches}/{quest.maxSnatchers}
                            </span>
                        </div>
                        <div className="flex items-center text-[11px] text-gray-400 gap-1">
                            <span className="opacity-50">•</span>
                            <span>{daysLeft}d left</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isSnatched ? (
                        <button
                            onClick={() => setShowDropConfirm(true)}
                            disabled={loading}
                            className="ml-auto flex items-center gap-1.5 text-[11px] font-medium py-1 px-2.5 rounded-lg transition-colors text-slate-400 border border-slate-200 hover:text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-gray-500 dark:border-slate-700 dark:hover:text-red-400 dark:hover:bg-red-900/20 dark:hover:border-red-500/50"
                            title="Drop Quest"
                        >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            Drop
                        </button>
                    ) : (
                        <Link
                            href={`/quests/${quest.id}`}
                            className={`ml-auto inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all shadow-sm
                                ${isFull
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                                    : 'text-orange-600 border border-orange-600/30 bg-white hover:bg-orange-50 hover:shadow-md hover:border-orange-600 dark:bg-transparent dark:text-orange-400 dark:border-orange-500/40 dark:hover:bg-orange-500/10'
                                }
                            `}
                        >
                            {isFull ? 'Full' : 'View Details'}
                        </Link>
                    )}
                </div>
            </div>
            {/* Drop Confirmation Modal */}
            {showDropConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-100 dark:border-slate-800 transform transition-all">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Drop this Quest?</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">
                            Are you sure? You won't be able to join another quest for 2 days.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDropConfirm(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
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
