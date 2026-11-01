'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog } from '@/components/ui/Dialog'
import { updateProfile, updateFeaturedBadges } from '@/actions/profile'
import { toast } from 'sonner'

interface Badge {
    id: string
    name: string
    imageUrl: string | null
    description: string
    slug: string
    isFeatured?: boolean
}

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    user: {
        name?: string | null
        bio?: string | null
        githubUrl?: string | null
        linkedinUrl?: string | null
    }
    badges?: Badge[]
}

const MAX_FEATURED = 3

export function EditProfileModal({ isOpen, onClose, user, badges = [] }: EditProfileModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [name, setName] = useState(user.name || '')
    const [bio, setBio] = useState(user.bio || '')
    const [githubUrl, setGithubUrl] = useState(user.githubUrl || '')
    const [linkedinUrl, setLinkedinUrl] = useState(user.linkedinUrl || '')

    // Badge selection — pre-populate from currently featured badges
    const [featuredIds, setFeaturedIds] = useState<string[]>(
        badges.filter(b => b.isFeatured).map(b => b.id)
    )


    // Re-sync when the modal is freshly opened
    useEffect(() => {
        if (isOpen) {
            setName(user.name || '')
            setBio(user.bio || '')
            setGithubUrl(user.githubUrl || '')
            setLinkedinUrl(user.linkedinUrl || '')
            setFeaturedIds(badges.filter(b => b.isFeatured).map(b => b.id))
        }
    }, [isOpen, user.name, user.bio, user.githubUrl, user.linkedinUrl, badges])

    if (!isOpen) return null

    function toggleBadge(badgeId: string) {
        setFeaturedIds(prev => {
            if (prev.includes(badgeId)) {
                return prev.filter(id => id !== badgeId)
            }
            if (prev.length >= MAX_FEATURED) return prev // silently cap
            return [...prev, badgeId]
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFeedback('')
        setIsLoading(true)

        try {
            const [profileResult, badgesResult] = await Promise.all([
                updateProfile({ name, bio, githubUrl, linkedinUrl }),
                badges.length > 0 ? updateFeaturedBadges(featuredIds) : Promise.resolve({ success: true })
            ])

            if (!profileResult.success) {
                setFeedback(profileResult.error as string); toast.error(profileResult.error as string)
            } else if (badges.length > 0 && !badgesResult.success) {
                setFeedback((badgesResult as { error?: string }).error || 'Failed to update badges'); toast.error((badgesResult as { error?: string }).error || 'Failed to update badges')
            } else {
                toast.success('Profile updated successfully')
                onClose()
            }
        } catch {
            setFeedback('Failed to update profile'); toast.error('Failed to update profile')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onClose={onClose} pending={isLoading} title="Edit Profile">
            {feedback && <p role="alert" className="text-danger mb-4">{feedback}</p>}
                {/* Scrollable body */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                    <div className="px-0 pb-4 space-y-4 flex-1">
                        {/* Display Name */}
                        <div>
                            <label htmlFor="profile-name" className="block text-sm font-medium text-foreground mb-1">
                                Display Name
                            </label>
                            <input
                                type="text"
                                id="profile-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-control-border rounded-lg bg-surface text-foreground focus:ring-2 focus:ring-focus focus:border-focus outline-none transition-all"
                                placeholder="Your Name"
                                maxLength={50}
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label htmlFor="profile-bio" className="block text-sm font-medium text-foreground mb-1">
                                Bio
                            </label>
                            <textarea
                                id="profile-bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full px-3 py-2 border border-control-border rounded-lg bg-surface text-foreground focus:ring-2 focus:ring-focus focus:border-focus outline-none transition-all h-24 resize-none"
                                placeholder="Tell us about yourself..."
                                maxLength={160}
                            />
                            <div className="flex justify-end mt-1">
                                <span className="text-sm text-muted">{bio.length}/160</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="profile-githubUrl" className="block text-sm font-medium text-foreground mb-1">
                                GitHub URL
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted material-symbols-outlined text-[18px]">code</span>
                                    <input
                                        type="url"
                                        id="profile-githubUrl"
                                value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-control-border rounded-lg bg-surface text-foreground focus:ring-2 focus:ring-focus focus:border-focus outline-none transition-all"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="profile-linkedinUrl" className="block text-sm font-medium text-foreground mb-1">
                                LinkedIn URL
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted material-symbols-outlined text-[18px]">work</span>
                                    <input
                                        type="url"
                                        id="profile-linkedinUrl"
                                value={linkedinUrl}
                                        onChange={(e) => setLinkedinUrl(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-control-border rounded-lg bg-surface text-foreground focus:ring-2 focus:ring-focus focus:border-focus outline-none transition-all"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Featured Badges Picker */}
                        {badges.length > 0 && (
                            <div className="pt-2">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-foreground">
                                        Featured Badges
                                    </label>
                                    <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${featuredIds.length >= MAX_FEATURED ? 'bg-surface text-foreground' : 'bg-surface text-muted'}`}>
                                        {featuredIds.length}/{MAX_FEATURED}
                                    </span>
                                </div>
                                <p className="text-sm text-muted mb-3">Choose up to {MAX_FEATURED} badges to showcase on your profile card.</p>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {badges.map((badge) => {
                                        const isSelected = featuredIds.includes(badge.id)
                                        const isDisabled = !isSelected && featuredIds.length >= MAX_FEATURED
                                        return (
                                            <button
                                                key={badge.id}
                                                type="button"
                                                onClick={() => toggleBadge(badge.id)}
                                                aria-pressed={isSelected}
                                                disabled={isDisabled}
                                                title={badge.description}
                                                className={`relative flex flex-col items-center gap-1.5 p-3 rounded-card break-words border-2 transition-all text-center
                                                    ${isSelected
                                                        ? 'border-border bg-surface  '
                                                        : isDisabled
                                                            ? 'border-border  cursor-not-allowed'
                                                            : 'border-border hover:border-border bg-surface cursor-pointer'
                                                    }`}
                                            >
                                                {/* Check mark */}
                                                {isSelected && (
                                                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground">
                                                        <span aria-hidden="true" className="material-symbols-outlined text-foreground text-[12px]">check</span>
                                                    </div>
                                                )}

                                                {/* Badge image */}
                                                <div className="w-10 h-10 flex items-center justify-center">
                                                    {badge.imageUrl ? (
                                                        <Image src={badge.imageUrl} alt={badge.name} width={40} height={40} className="object-contain" />
                                                    ) : (
                                                        <span aria-hidden="true" className="material-symbols-outlined text-foreground text-[28px]">verified</span>
                                                    )}
                                                </div>

                                                <span className="text-sm font-semibold text-muted leading-tight">
                                                    {badge.name}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 px-0 py-4 border-t border-border shrink-0">
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-foreground bg-surface rounded-lg hover:bg-surface-raised transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="button-primary gap-2"
                        >
                            {isLoading && <span className="w-4 h-4 border-2 border-border border-t-transparent rounded-full animate-spin"></span>}
                            {isLoading ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </form>
        </Dialog>
    )
}
