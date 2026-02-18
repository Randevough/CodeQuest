'use client'

import { useState } from 'react'
import Link from 'next/link'

import { formatDistanceToNow } from 'date-fns'

// Quick interfaces for props
interface Quest {
    id: string
    title: string
    difficulty: string
    category: string
    deadline: Date | null
    description: string
    points: number
}

interface Snatch {
    id: string
    status: string
    updatedAt: Date
    submissionUrl?: string | null
    quest: Quest
}

interface ProfileTabsProps {
    activeSnatches: Snatch[]
    portfolioSnatches?: Snatch[]
    user: any // Ideally typed with NextAuth User
    badges?: {
        id: string
        name: string
        imageUrl: string | null
        description: string
        slug: string
    }[]
}

export function ProfileTabs({ activeSnatches, portfolioSnatches = [], user, badges = [] }: ProfileTabsProps) {
    const [activeTab, setActiveTab] = useState<'active' | 'portfolio' | 'badges'>('active')

    return (
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark rounded-xl px-1 shadow-sm sticky top-[64px] z-40">
                <nav aria-label="Tabs" className="flex space-x-1">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`relative group flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${activeTab === 'active'
                            ? 'text-orange-600 border-orange-600'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${activeTab === 'active' ? 'filled' : ''}`}>assignment</span>
                        Active Quests
                        <span className="ml-2 bg-orange-600/10 text-orange-600 py-0.5 px-2 rounded-full text-xs">{activeSnatches.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('portfolio')}
                        className={`relative group flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${activeTab === 'portfolio'
                            ? 'text-orange-600 border-orange-600'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">folder_open</span>
                        Portfolio History
                    </button>
                    <button
                        onClick={() => setActiveTab('badges')}
                        className={`relative group flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${activeTab === 'badges'
                            ? 'text-orange-600 border-orange-600'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">military_tech</span>
                        Badges
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'active' && (
                <div className="space-y-4">
                    {activeSnatches.length > 0 ? (
                        activeSnatches.map((snatch) => (
                            <article key={snatch.id} className="group bg-white dark:bg-surface-dark border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative border-slate-200 dark:border-slate-800">
                                <div className="p-6 flex flex-col gap-4 relative">
                                    {/* Points Badge moved to Top Right (Absolute) */}
                                    <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 px-2.5 py-1 rounded-full border border-yellow-100 dark:border-yellow-800/50">
                                        <img src="/icon.png" alt="Points" className="w-3.5 h-3.5 object-contain" />
                                        <span className="text-xs font-bold">{snatch.quest.points} pts</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3 w-full">
                                            <div className="flex items-center gap-3">
                                                {(() => {
                                                    const status = snatch.status
                                                    if (status === 'SUBMITTED') {
                                                        return (
                                                            <span className="text-yellow-600 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider">
                                                                Pending Review
                                                            </span>
                                                        )
                                                    }
                                                    if (status === 'REVISION_NEEDED') {
                                                        return (
                                                            <span className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                                                                Revision Needed
                                                            </span>
                                                        )
                                                    }
                                                    return (
                                                        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                                                            Active Mission
                                                        </span>
                                                    )
                                                })()}
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{snatch.quest.title}</h3>

                                            {/* Badges moved below title */}
                                            <div className="flex items-center text-xs font-semibold tracking-wide pt-1 gap-2">
                                                {/* Difficulty Badge - Colorful */}
                                                {(() => {
                                                    const d = (snatch.quest.difficulty || '').toLowerCase()
                                                    let diffColor = 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/30'
                                                    if (d === 'expert' || d === 'hard' || d === 'advanced') diffColor = 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/30'
                                                    if (d === 'intermediate') diffColor = 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30'

                                                    return (
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border capitalize ${diffColor}`}>
                                                            {snatch.quest.difficulty}
                                                        </span>
                                                    )
                                                })()}
                                                {/* Category Badge - Neutral */}
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 capitalize">
                                                    {snatch.quest.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                        {/* Left: User Avatar + Relative Time */}
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt={user.name || 'User'} className="size-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                            ) : (
                                                <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    {user?.name || 'Snatcher'}
                                                </span>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                                    Updated {formatDistanceToNow(new Date(snatch.updatedAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right: Primary Action Button */}
                                        <div className="w-full sm:w-auto">
                                            {(() => {
                                                const status = snatch.status
                                                if (status === 'SUBMITTED') {
                                                    return (
                                                        <Link href={`/quests/${snatch.quest.id}`} className="block w-full sm:w-auto bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold px-6 py-2.5 rounded-lg text-sm transition-all text-center">
                                                            View Details
                                                        </Link>
                                                    )
                                                }
                                                if (status === 'REVISION_NEEDED') {
                                                    return (
                                                        <Link href={`/quests/${snatch.quest.id}`} className="block w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow hover:shadow-md text-center">
                                                            Update Submission
                                                        </Link>
                                                    )
                                                }
                                                return (
                                                    <Link href={`/quests/${snatch.quest.id}`} className="block w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow hover:shadow-md text-center">
                                                        Continue Quest
                                                    </Link>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-full p-12 text-center text-slate-500">
                            No active quests found.
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'portfolio' && (
                <div className="mt-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Highlights</h2>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            {portfolioSnatches.length} Completed Projects
                        </span>
                    </div>
                    <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                        <div className="divide-y divide-gray-100 dark:divide-border-dark">
                            {portfolioSnatches.length > 0 ? (
                                portfolioSnatches.map((snatch) => (
                                    <div key={snatch.id} className="p-5 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                        <div className={`p-3 rounded-lg ${(() => {
                                            const d = (snatch.quest.difficulty || '').toLowerCase()
                                            if (d === 'expert' || d === 'hard' || d === 'advanced') return 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                                            if (d === 'intermediate') return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                            return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                        })()}`}>
                                            <span className="material-symbols-outlined text-[24px]">
                                                {(() => {
                                                    const d = (snatch.quest.difficulty || '').toLowerCase()
                                                    if (d === 'expert' || d === 'hard' || d === 'advanced') return 'psychology'
                                                    if (d === 'intermediate') return 'trending_up'
                                                    return 'school'
                                                })()}
                                            </span>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                                                        <Link href={`/quest/${snatch.quest.id}`}>{snatch.quest.title}</Link>
                                                    </h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{snatch.quest.description}</p>
                                                </div>
                                                {snatch.submissionUrl && (
                                                    <a
                                                        href={snatch.submissionUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label="View Code"
                                                        className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                                                    </a>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-3">
                                                <span className="text-xs text-slate-400 font-medium">Completed {new Date(snatch.updatedAt).toLocaleDateString()}</span>
                                                <div className="flex gap-2">
                                                    {(() => {
                                                        const d = (snatch.quest.difficulty || '').toLowerCase()
                                                        let diffColor = 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/30'
                                                        if (d === 'expert' || d === 'hard' || d === 'advanced') diffColor = 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/30'
                                                        if (d === 'intermediate') diffColor = 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30'

                                                        return (
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${diffColor}`}>
                                                                {snatch.quest.difficulty}
                                                            </span>
                                                        )
                                                    })()}
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                        {snatch.quest.category}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-orange-100 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-500/20 text-orange-600 dark:text-orange-400">
                                                    <img src="/icon.png" alt="Points" className="w-3 h-3 object-contain" />
                                                    <span className="text-[10px] font-bold">{snatch.quest.points} pts</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-slate-500">
                                    No completed quests yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'badges' && (
                <div className="mt-2">
                    <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Earned Badges</h3>
                        {badges.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {badges.map((badge) => (
                                    <div key={badge.id} className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 group hover:border-orange-600/30 transition-all">
                                        <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform relative overflow-hidden">
                                            {badge.imageUrl ? (
                                                <img src={badge.imageUrl} alt={badge.name} className="w-10 h-10 object-contain max-w-full" />
                                            ) : (
                                                <span className="material-symbols-outlined text-orange-500 text-[24px]">verified</span>
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">{badge.name}</span>
                                            <span className="block text-[10px] text-slate-400 mt-1">{badge.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                <span className="material-symbols-outlined text-4xl mb-2 text-slate-300 block">military_tech</span>
                                <p>No badges earned yet. Complete quests to unlock them!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
