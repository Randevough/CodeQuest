'use client'

import { User } from 'next-auth'
import { AvatarUpload } from './AvatarUpload'
import { useState } from 'react'
import Image from 'next/image'
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
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 lg:sticky lg:top-24">
            {/* Profile Card */}
            <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card break-words p-6 flex flex-col items-center text-center relative overflow-hidden group/card">
                {/* Decorative background accent */}

                {isOwnProfile && (
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-surface text-muted hover:text-foreground hover:bg-surface-raised border border-transparent hover:border-border transition-all z-10 flex items-center justify-center"
                        aria-label="Edit Profile"
                        title="Edit Profile"
                    >
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px] leading-none">edit</span>
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
                <h1 className="text-foreground mb-4">{user.name}</h1>


                {/* Bio Section */}
                {user.bio ? (
                    <p className="text-muted text-sm leading-relaxed mb-6 px-2">
                        {user.bio}
                    </p>
                ) : (
                    <p className="text-muted text-sm italic mb-6">
                        No bio added yet.
                    </p>
                )}

                {/* Social Actions */}
                <div className="flex flex-wrap gap-3 w-full justify-center">
                    {user.githubUrl && (
                        <a className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-border dark:border-border-dark text-muted hover:bg-surface-raised hover:border-border transition-all text-sm font-medium" href={user.githubUrl} target="_blank" rel="noopener noreferrer">
                            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">code</span>
                            GitHub
                        </a>
                    )}
                    {user.linkedinUrl && (
                        <a className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-border dark:border-border-dark text-muted hover:bg-surface-raised hover:border-border transition-all text-sm font-medium" href={user.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">work</span>
                            LinkedIn
                        </a>
                    )}

                    {!user.githubUrl && !user.linkedinUrl && (
                        <div className="text-sm text-muted">No social links added</div>
                    )}
                </div>

                {/* Featured Badges Section — shown only if user has featured some */}
                {badges.filter(b => b.isFeatured).length > 0 && (
                    <div className="w-full mt-6 pt-6 border-t border-border">
                        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3 text-left">Featured Badges</h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {badges.filter(b => b.isFeatured).map((badge) => (
                                <div
                                    key={badge.id}
                                    className="group/badge relative flex items-center justify-center p-2 rounded-lg bg-surface border border-border hover:border-border transition-all cursor-help"
                                    title={badge.description}
                                >
                                    {badge.imageUrl ? (
                                        <Image src={badge.imageUrl} alt={badge.name} width={32} height={32} className="object-contain" />
                                    ) : (
                                        <span aria-hidden="true" className="material-symbols-outlined text-foreground text-[24px]">verified</span>
                                    )}
                                    <span className="text-sm">{badge.name}</span>
                                    <span className="sr-only">{badge.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Stats Card */}
            <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card break-words p-6">
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Contribution stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Image src="/icon.png" alt="Points" width={24} height={24} className="object-contain" />
                            <span className="text-3xl font-bold text-foreground tracking-tight">{user.points?.toLocaleString('en-US') || 0}</span>
                        </div>
                        <span className="text-sm text-muted font-medium">Total Points</span>
                    </div>
                    <div className="flex flex-col border-l border-border dark:border-border-dark pl-4">
                        <span className="text-3xl font-bold text-foreground tracking-tight">{user.completedQuests}</span>
                        <span className="text-sm text-muted font-medium">Quests Done</span>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={{
                    name: user.name,
                    bio: user.bio,
                    githubUrl: user.githubUrl,
                    linkedinUrl: user.linkedinUrl
                }}
                badges={badges}
            />
        </aside>
    )
}
