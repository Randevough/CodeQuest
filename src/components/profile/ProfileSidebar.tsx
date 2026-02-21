'use client'

import { User } from 'next-auth'
import { AvatarUpload } from './AvatarUpload'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { EditProfileModal } from './EditProfileModal'

interface Badge {
    id: string
    name: string
    imageUrl: string | null
    description: string
    slug: string
    isFeatured?: boolean
}

interface ProfileSidebarProps {
    user: User & {
        points: number
        completedQuests: number
        image?: string | null
    }
    badges: Badge[]
}

export function ProfileSidebar({ user, badges }: ProfileSidebarProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const { data: session } = useSession()
    const isOwnProfile = session?.user?.email === user.email

    return (
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 sticky top-[88px]">
            {/* Profile Card */}
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center relative overflow-hidden group/card">
                {/* Decorative background accent */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-orange-600/5 to-transparent pointer-events-none"></div>

                {isOwnProfile && (
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors z-10"
                        title="Edit Profile"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                )}

                <div className="relative mb-4 mt-2">
                    <AvatarUpload
                        currentAvatar={user.image || user.avatar}
                        name={user.name}
                        size={128}
                        editable={isOwnProfile}
                    />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{user.name}</h1>


                {/* Bio Section */}
                {/* @ts-ignore: Prisma client field */}
                {user.bio ? (
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 px-2">
                        {/* @ts-ignore: Prisma client field */}
                        {user.bio}
                    </p>
                ) : (
                    <p className="text-slate-400 dark:text-slate-500 text-sm italic mb-6">
                        No bio added yet.
                    </p>
                )}

                {/* Social Actions */}
                <div className="flex gap-3 w-full justify-center">
                    {/* @ts-ignore: Prisma client field */}
                    {user.githubUrl && (
                        /* @ts-ignore: Prisma client field */
                        <a className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-200 dark:border-border-dark text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-sm font-medium" href={user.githubUrl} target="_blank" rel="noopener noreferrer">
                            <span className="material-symbols-outlined text-[18px]">code</span>
                            GitHub
                        </a>
                    )}
                    {/* @ts-ignore: Prisma client field */}
                    {user.linkedinUrl && (
                        /* @ts-ignore: Prisma client field */
                        <a className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-200 dark:border-border-dark text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-sm font-medium" href={user.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            <span className="material-symbols-outlined text-[18px]">work</span>
                            LinkedIn
                        </a>
                    )}

                    {/* @ts-ignore: Prisma client field */}
                    {!user.githubUrl && !user.linkedinUrl && (
                        <div className="text-xs text-slate-400">No social links added</div>
                    )}
                </div>

                {/* Featured Badges Section — shown only if user has featured some */}
                {badges.filter(b => b.isFeatured).length > 0 && (
                    <div className="w-full mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-left">Featured Badges</h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {badges.filter(b => b.isFeatured).map((badge) => (
                                <div
                                    key={badge.id}
                                    className="group/badge relative flex items-center justify-center p-2 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 hover:border-orange-200 dark:hover:border-orange-900/40 transition-all cursor-help"
                                    title={badge.description}
                                >
                                    {badge.imageUrl ? (
                                        <img src={badge.imageUrl} alt={badge.name} className="w-8 h-8 object-contain" />
                                    ) : (
                                        <span className="material-symbols-outlined text-orange-500 text-[24px]">verified</span>
                                    )}
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-[200px] px-3 py-2 bg-slate-900 text-white text-xs rounded opacity-0 invisible group-hover/badge:opacity-100 group-hover/badge:visible transition-all z-20 pointer-events-none">
                                        <div className="font-bold mb-0.5">{badge.name}</div>
                                        <div className="text-slate-300 font-normal">{badge.description}</div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Stats Card */}
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Current Season Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <img src="/icon.png" alt="Points" className="w-6 h-6 object-contain" />
                            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{user.points?.toLocaleString('en-US') || 0}</span>
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Points</span>
                    </div>
                    <div className="flex flex-col border-l border-gray-100 dark:border-border-dark pl-4">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{user.completedQuests}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Quests Done</span>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={{
                    name: user.name,
                    // @ts-ignore: Prisma client field
                    bio: user.bio,
                    // @ts-ignore: Prisma client field
                    githubUrl: user.githubUrl,
                    // @ts-ignore: Prisma client field
                    linkedinUrl: user.linkedinUrl
                }}
                badges={badges}
            />
        </aside>
    )
}
