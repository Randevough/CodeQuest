'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
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
    const [mounted, setMounted] = useState(false)
    const [name, setName] = useState(user.name || '')
    const [bio, setBio] = useState(user.bio || '')
    const [githubUrl, setGithubUrl] = useState(user.githubUrl || '')
    const [linkedinUrl, setLinkedinUrl] = useState(user.linkedinUrl || '')

    // Badge selection — pre-populate from currently featured badges
    const [featuredIds, setFeaturedIds] = useState<string[]>(
        badges.filter(b => b.isFeatured).map(b => b.id)
    )

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    // Re-sync when the modal is freshly opened
    useEffect(() => {
        if (isOpen) {
            setName(user.name || '')
            setBio(user.bio || '')
            setGithubUrl(user.githubUrl || '')
            setLinkedinUrl(user.linkedinUrl || '')
            setFeaturedIds(badges.filter(b => b.isFeatured).map(b => b.id))
        }
    }, [isOpen])

    if (!isOpen || !mounted) return null

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
        setIsLoading(true)

        try {
            const [profileResult, badgesResult] = await Promise.all([
                updateProfile({ name, bio, githubUrl, linkedinUrl }),
                badges.length > 0 ? updateFeaturedBadges(featuredIds) : Promise.resolve({ success: true })
            ])

            if (!profileResult.success) {
                toast.error(profileResult.error as string)
            } else if (badges.length > 0 && !badgesResult.success) {
                toast.error((badgesResult as { error?: string }).error || 'Failed to update badges')
            } else {
                toast.success('Profile updated successfully')
                onClose()
            }
        } catch {
            toast.error('Failed to update profile')
        } finally {
            setIsLoading(false)
        }
    }

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-surface-dark rounded-xl shadow-xl max-w-xl w-full border border-slate-100 dark:border-slate-800 transform transition-all flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 pt-6 pb-4 shrink-0">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Scrollable body */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="px-6 pb-4 overflow-y-auto space-y-4 flex-1">
                        {/* Display Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                placeholder="Your Name"
                                maxLength={50}
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Bio
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all h-24 resize-none"
                                placeholder="Tell us about yourself..."
                                maxLength={160}
                            />
                            <div className="flex justify-end mt-1">
                                <span className="text-xs text-slate-400">{bio.length}/160</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    GitHub URL
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">code</span>
                                    <input
                                        type="url"
                                        value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    LinkedIn URL
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">work</span>
                                    <input
                                        type="url"
                                        value={linkedinUrl}
                                        onChange={(e) => setLinkedinUrl(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Featured Badges Picker */}
                        {badges.length > 0 && (
                            <div className="pt-2">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Featured Badges
                                    </label>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${featuredIds.length >= MAX_FEATURED ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                                        {featuredIds.length}/{MAX_FEATURED}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mb-3">Choose up to {MAX_FEATURED} badges to showcase on your profile card.</p>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {badges.map((badge) => {
                                        const isSelected = featuredIds.includes(badge.id)
                                        const isDisabled = !isSelected && featuredIds.length >= MAX_FEATURED
                                        return (
                                            <button
                                                key={badge.id}
                                                type="button"
                                                onClick={() => toggleBadge(badge.id)}
                                                disabled={isDisabled}
                                                title={badge.description}
                                                className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center
                                                    ${isSelected
                                                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-sm shadow-orange-500/10'
                                                        : isDisabled
                                                            ? 'border-slate-100 dark:border-slate-800 opacity-40 cursor-not-allowed'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 bg-white dark:bg-slate-900 cursor-pointer'
                                                    }`}
                                            >
                                                {/* Check mark */}
                                                {isSelected && (
                                                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-white text-[12px]">check</span>
                                                    </div>
                                                )}

                                                {/* Badge image */}
                                                <div className="w-10 h-10 flex items-center justify-center">
                                                    {badge.imageUrl ? (
                                                        <Image src={badge.imageUrl} alt={badge.name} width={40} height={40} className="object-contain" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-orange-500 text-[28px]">verified</span>
                                                    )}
                                                </div>

                                                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 leading-tight line-clamp-2">
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
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 text-sm font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-2"
                        >
                            {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}
