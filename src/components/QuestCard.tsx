'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { dropQuest } from '@/actions/quest'

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
        if (d === 'expert' || d === 'hard') return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
        if (d === 'advanced') return 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30'
        if (d === 'intermediate') return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'
        return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
    }

    const getPointsColor = (points: number) => {
        if (points >= 401) return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/30'
        if (points >= 151) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30'
        if (points >= 61) return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30'
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
    }

    return (
        <article className={`group flex flex-col bg-white dark:bg-surface-dark rounded-xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-hover
        ${isSnatched
                ? 'border-primary/50 dark:border-primary/50 ring-1 ring-primary/20'
                : 'border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-700'
            }
    `}>
            <div className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getDifficultyColor(quest.difficulty)}`}>
                            {quest.difficulty || 'Beginner'}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                            {quest.category || 'Web'}
                        </span>
                    </div>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded border ${getPointsColor(quest.points || 0)}`}>
                        +{quest.points || 100} pts
                    </div>
                </div>

                <Link href={`/quests/${quest.id}`} className="block group-hover:opacity-80 transition-opacity">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                        {quest.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                        {quest.description}
                    </p>
                </Link>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-xs text-gray-500 gap-1">
                                <span className="material-symbols-outlined text-[16px]">group</span>
                                <span className={isFull ? 'text-red-500 font-bold' : ''}>
                                    {quest._count.snatches}/{quest.maxSnatchers}
                                </span>
                            </div>
                        </div>
                        <span className="text-xs font-mono text-gray-400">{daysLeft} days left</span>
                    </div>

                    {/* Action Buttons */}
                    {isSnatched ? (
                        <>
                            <button
                                onClick={() => setShowDropConfirm(true)}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-900/10 dark:hover:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"
                            >
                                {loading ? 'Processing...' : 'Drop Quest'}
                            </button>
                            {msg && (
                                <p className="mt-2 text-xs text-center text-red-500">{msg}</p>
                            )}
                        </>
                    ) : (
                        <Link
                            href={`/quests/${quest.id}`}
                            className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-all shadow-sm
                                ${isFull
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                                    : 'bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 hover:border-primary/30 dark:bg-primary/20 dark:text-primary-100 dark:border-primary/40 dark:hover:bg-primary/30'
                                }
                            `}
                        >
                            {isFull ? 'Quest Full' : 'View Details'}
                        </Link>
                    )}


                    {/* Drop Confirmation Modal */}
                    {showDropConfirm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-100 dark:border-slate-800 transform transition-all">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Drop this Quest?</h3>
                                <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">
                                    Are you sure? You can join it again later if it's still available.
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
                                        {loading ? 'Dropping...' : 'Confirm Drop'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}
