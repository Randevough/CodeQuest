'use client'

import { useState } from 'react'
import Link from 'next/link'

import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { UserAvatar } from '@/components/ui/UserAvatar'

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

interface Badge {
    id: string
    name: string
    imageUrl: string | null
    description: string
    slug: string
}

interface ProfileTabsProps {
    activeSnatches: Snatch[]
    portfolioSnatches?: Snatch[]
    user: {
        id?: string
        name?: string | null
        avatar?: string | null
        email?: string | null
    } | null
    isOwner?: boolean
    badges?: Badge[]       // earned badges
    allBadges?: Badge[]   // every badge in the system
}

export function ProfileTabs({ activeSnatches, portfolioSnatches = [], user, isOwner = false, badges = [], allBadges = [] }: ProfileTabsProps) {
    const [activeTab, setActiveTab] = useState<'active' | 'portfolio' | 'badges'>('active')

    return (
        <div className="lg:col-span-8 min-w-0 xl:col-span-9 flex flex-col gap-6">
            {/* Tab Navigation */}
            <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card break-words px-1">
                <nav aria-label="Profile sections" className="flex flex-wrap gap-1">
                    <button
                        aria-pressed={activeTab === 'active'}
                        onClick={() => setActiveTab('active')}
                        className={`relative group flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'active'
                            ? 'text-foreground border-border'
                            : 'text-muted hover:text-foreground border-transparent hover:border-border'
                            }`}
                    >
                        <span aria-hidden="true" className={`material-symbols-outlined text-[20px] ${activeTab === 'active' ? 'filled' : ''}`}>assignment</span>
                        Active Quests
                        <span className="ml-2 bg-secondary py-0.5 px-2 rounded-full text-sm text-secondary-foreground">{activeSnatches.length}</span>
                    </button>
                    <button
                        aria-pressed={activeTab === 'portfolio'}
                        onClick={() => setActiveTab('portfolio')}
                        className={`relative group flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'portfolio'
                            ? 'text-foreground border-border'
                            : 'text-muted hover:text-foreground border-transparent hover:border-border'
                            }`}
                    >
                        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">folder_open</span>
                        Portfolio History
                    </button>
                    <button
                        aria-pressed={activeTab === 'badges'}
                        onClick={() => setActiveTab('badges')}
                        className={`relative group flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === 'badges'
                            ? 'text-foreground border-border'
                            : 'text-muted hover:text-foreground border-transparent hover:border-border'
                            }`}
                    >
                        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">military_tech</span>
                        Badges
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'active' && (
                <div className="space-y-4">
                    {activeSnatches.length > 0 ? (
                        activeSnatches.map((snatch) => (
                            <article key={snatch.id} className="group bg-surface dark:bg-surface-dark border rounded-card break-words transition-all duration-fast overflow-hidden relative border-border">
                                <div className="p-6 flex flex-col gap-4 relative">
                                    {/* Points Badge moved to Top Right (Absolute) */}
                                    <div className="self-start flex items-center gap-1.5 bg-surface text-warning px-2.5 py-1 rounded-full border border-border">
                                        <Image src="/icon.png" alt="Points" width={14} height={14} className="object-contain" />
                                        <span className="text-sm font-bold">{snatch.quest.points} pts</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3 w-full">
                                            <div className="flex items-center gap-3">
                                                {(() => {
                                                    const status = snatch.status
                                                    if (status === 'SUBMITTED') {
                                                        return (
                                                            <span className="text-warning text-sm font-bold uppercase tracking-wider">
                                                                Pending Review
                                                            </span>
                                                        )
                                                    }
                                                    if (status === 'REVISION_NEEDED') {
                                                        return (
                                                            <span className="text-danger text-sm font-bold uppercase tracking-wider">
                                                                Revision Needed
                                                            </span>
                                                        )
                                                    }
                                                    return (
                                                        <span className="text-info text-sm font-bold uppercase tracking-wider">
                                                            Active Mission
                                                        </span>
                                                    )
                                                })()}
                                            </div>

                                            <h3 className="text-lg font-bold text-foreground leading-tight">{snatch.quest.title}</h3>

                                            {/* Badges moved below title */}
                                            <div className="flex items-center text-sm font-semibold tracking-wide pt-1 gap-2 flex-wrap">
                                                {/* Difficulty Badge - Colorful */}
                                                {(() => {
                                                    const d = (snatch.quest.difficulty || '').toLowerCase()
                                                    let diffColor = 'bg-surface text-success border-border'
                                                    if (d === 'exclusive') diffColor = 'bg-surface text-warning border-border'
                                                    if (d === 'expert' || d === 'hard' || d === 'advanced') diffColor = 'bg-surface text-foreground border-border'
                                                    if (d === 'intermediate') diffColor = 'bg-surface text-info border-border'

                                                    return (
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium border capitalize ${diffColor}`}>
                                                            {snatch.quest.difficulty}
                                                        </span>
                                                    )
                                                })()}
                                                {/* Category Badge - Neutral */}
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-surface text-muted border border-border capitalize">
                                                    {snatch.quest.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-2 pt-4 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
                                        {/* Left: User Avatar + Relative Time */}
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <UserAvatar
                                                src={user?.avatar}
                                                name={user?.name}
                                                size={32}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-foreground">
                                                    {user?.name || 'Snatcher'}
                                                </span>
                                                <span className="text-sm text-muted font-medium">
                                                    Updated {formatDistanceToNow(new Date(snatch.updatedAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right: Primary Action Button — only shown to the profile owner */}
                                        {isOwner && (
                                            <div className="w-full sm:w-auto">
                                                {(() => {
                                                    const status = snatch.status
                                                    if (status === 'SUBMITTED') {
                                                        return (
                                                            <Link href={`/quests/${snatch.quest.id}`} className="min-h-11 block w-full sm:w-auto bg-surface hover:bg-surface-raised text-foreground font-bold px-6 py-2.5 rounded-lg text-sm transition-all text-center">
                                                                View Details
                                                            </Link>
                                                        )
                                                    }
                                                    if (status === 'REVISION_NEEDED') {
                                                        return (
                                                            <Link href={`/quests/${snatch.quest.id}`} className="min-h-11 block w-full sm:w-auto bg-surface hover:bg-surface-raised text-foreground font-bold px-6 py-2.5 rounded-lg text-sm transition-all text-center">
                                                                Update Submission
                                                            </Link>
                                                        )
                                                    }
                                                    return (
                                                        <Link href={`/quests/${snatch.quest.id}`} className="button-secondary w-full sm:w-auto">
                                                            Continue Quest
                                                        </Link>
                                                    )
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-full p-12 text-center text-muted">
                            No active quests found.
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'portfolio' && (
                <div className="mt-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-foreground">Recent Highlights</h2>
                        <span className="text-sm text-muted">
                            {portfolioSnatches.length} Completed Projects
                        </span>
                    </div>
                    <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card break-words overflow-hidden">
                        <div className="divide-y divide-border dark:divide-border-dark">
                            {portfolioSnatches.length > 0 ? (
                                portfolioSnatches.map((snatch) => (
                                    <div key={snatch.id} className="p-5 flex items-start gap-4 hover:bg-surface-raised transition-colors group">
                                        <div className={`p-3 rounded-lg ${(() => {
                                            const d = (snatch.quest.difficulty || '').toLowerCase()
                                            if (d === 'exclusive') return 'bg-surface text-warning'
                                            if (d === 'expert' || d === 'hard' || d === 'advanced') return 'bg-surface text-foreground'
                                            if (d === 'intermediate') return 'bg-surface text-info'
                                            return 'bg-surface text-success'
                                        })()}`}>
                                            <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
                                                {(() => {
                                                    const d = (snatch.quest.difficulty || '').toLowerCase()
                                                    if (d === 'exclusive') return 'star'
                                                    if (d === 'expert' || d === 'hard' || d === 'advanced') return 'psychology'
                                                    if (d === 'intermediate') return 'trending_up'
                                                    return 'school'
                                                })()}
                                            </span>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-base font-semibold text-foreground group-hover:text-foreground transition-colors">
                                                        <Link href={`/quests/${snatch.quest.id}`}>{snatch.quest.title}</Link>
                                                    </h4>
                                                    <p className="text-sm text-muted mt-1 line-clamp-1">{snatch.quest.description}</p>
                                                </div>
                                                {snatch.submissionUrl && (
                                                    <a
                                                        href={snatch.submissionUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label="View Code"
                                                        className="p-2 text-muted hover:text-foreground transition-colors"
                                                    >
                                                        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">open_in_new</span>
                                                    </a>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-3">
                                                <span className="text-sm text-muted font-medium">Completed {new Date(snatch.updatedAt).toLocaleDateString()}</span>
                                                <div className="flex gap-2">
                                                    {(() => {
                                                        const d = (snatch.quest.difficulty || '').toLowerCase()
                                                        let diffColor = 'bg-surface text-success border-border'
                                                        if (d === 'exclusive') diffColor = 'bg-surface text-warning border-border'
                                                        if (d === 'expert' || d === 'hard' || d === 'advanced') diffColor = 'bg-surface text-foreground border-border'
                                                        if (d === 'intermediate') diffColor = 'bg-surface text-info border-border'

                                                        return (
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium border ${diffColor}`}>
                                                                {snatch.quest.difficulty}
                                                            </span>
                                                        )
                                                    })()}
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-surface text-muted">
                                                        {snatch.quest.category}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border bg-surface text-foreground">
                                                    <Image src="/icon.png" alt="Points" width={12} height={12} className="object-contain" />
                                                    <span className="text-sm font-bold">{snatch.quest.points} pts</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-muted">
                                    No completed quests yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'badges' && (
                <div className="mt-2">
                    <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card break-words p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">All Badges</h3>
                            <span className="text-sm text-muted">{badges.length} / {allBadges.length > 0 ? allBadges.length : badges.length} Unlocked</span>
                        </div>
                        {(allBadges.length > 0 ? allBadges : badges).length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {(allBadges.length > 0 ? allBadges : badges).map((badge) => {
                                    const earned = badges.some(b => b.id === badge.id)
                                    return (
                                        <div
                                            key={badge.id}
                                            className={`group/badge flex flex-col items-center justify-center gap-3 p-4 rounded-lg border transition-all
                                                ${earned
                                                    ? 'bg-surface border-border hover:border-border'
                                                    : 'bg-surface border-border '
                                                }`}
                                        >
                                            {/* Badge image with optional lock overlay */}
                                            <div className="relative size-16 rounded-full bg-surface flex items-center justify-center transition-transform overflow-hidden">
                                                {badge.imageUrl ? (
                                                    <Image
                                                        src={badge.imageUrl}
                                                        alt={badge.name}
                                                        width={40}
                                                        height={40}
                                                        className={`w-10 h-10 object-contain max-w-full ${!earned ? 'grayscale' : ''}`}
                                                    />
                                                ) : (
                                                    <span aria-hidden="true" className={`material-symbols-outlined text-[24px] ${earned ? 'text-foreground' : 'text-muted'}`}>verified</span>
                                                )}
                                                {/* Lock overlay for unearned */}
                                                {!earned && (
                                                    <div className="absolute inset-0 bg-surface flex items-center justify-center rounded-full">
                                                        <span aria-hidden="true" className="material-symbols-outlined text-foreground text-[18px]">lock</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-center">
                                                <span className={`block text-sm font-bold ${earned ? 'text-foreground' : 'text-muted'}`}>
                                                    {badge.name}
                                                </span>
                                                <span className="block text-sm text-muted mt-1">
                                                    {earned ? badge.description : 'Locked'}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-muted">
                                <span aria-hidden="true" className="material-symbols-outlined text-4xl mb-2 text-muted block">military_tech</span>
                                <p>No badges available yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
