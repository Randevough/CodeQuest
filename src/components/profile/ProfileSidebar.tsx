'use client'

import { User } from 'next-auth'
import { AvatarUpload } from './AvatarUpload'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { EditProfileModal } from './EditProfileModal'

interface ProfileSidebarProps {
    user: User & {
        points: number
        completedQuests: number // We'll pass this in
        image?: string | null
    }
}

export function ProfileSidebar({ user }: ProfileSidebarProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const { data: session } = useSession()
    const isOwnProfile = session?.user?.email === user.email

    return (
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 sticky top-[88px]">
            {/* Profile Card */}
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center relative overflow-hidden group">
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
                    />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{user.name}</h1>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-600/10 text-orange-600 mb-4">
                    {user.role === 'Admin' ? 'Administrator' : 'CodeQuest Member'}
                </div>

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
            />
        </aside>
    )
}
