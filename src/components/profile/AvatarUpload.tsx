'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { uploadProfileImage } from '@/actions/profile'
import { toast } from 'sonner'


interface AvatarUploadProps {
    currentAvatar?: string | null
    name?: string | null
    size?: number
    editable?: boolean
}

export function AvatarUpload({ currentAvatar, name, size = 128, editable = false }: AvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [feedback, setFeedback] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            setFeedback('File size must be less than 2MB'); toast.error('File size must be less than 2MB')
            return
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setFeedback('Only JPEG, PNG, and WebP images are allowed'); toast.error('Only JPEG, PNG, and WebP images are allowed')
            return
        }

        setFeedback('')
        setIsUploading(true)
        const formData = new FormData()
        formData.set('file', file)

        try {
            const result = await uploadProfileImage(formData)
            if (result.success) {
                toast.success('Profile picture updated!')
            } else {
                setFeedback(result.error as string); toast.error(result.error as string)
            }
        } catch {
            setFeedback('Upload failed'); toast.error('Upload failed')
        } finally {
            setIsUploading(false)
            // Clear input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleClick = () => {
        if (!isUploading) {
            fileInputRef.current?.click()
        }
    }

    const initials = name
        ? name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'U'

    return (
        <div>
        <div className={`relative flex-shrink-0 rounded-full transition-all hover:ring-2 hover:ring-focus hover:ring-offset-1 ${editable ? 'group cursor-pointer' : ''}`} style={{ width: size, height: size }}>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={isUploading || !editable}
            />

            {editable && <button type="button" onClick={handleClick} disabled={isUploading} aria-label={isUploading ? "Uploading profile picture" : "Change profile picture"} className="absolute inset-0 z-10 rounded-full" />}
            <div
                className={`w-full h-full rounded-full overflow-hidden border-2 border-border bg-surface  relative transition-all ${editable ? 'group-hover:border-border' : ''}`}
            >
                {currentAvatar ? (
                    <Image
                        src={currentAvatar}
                        alt={name || 'Profile'}
                        width={size}
                        height={size}
                        unoptimized
                        className={`w-full h-full object-cover transition-opacity ${isUploading ? '' : 'opacity-100'}`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface text-foreground font-bold text-4xl">
                        {initials}
                    </div>
                )}

                {/* Overlay for hover/loading */}
                {editable && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-surface transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {isUploading ? (
                            <div className="w-8 h-8 border-2 border-border border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <span aria-hidden="true" className="material-symbols-outlined text-foreground text-3xl">photo_camera</span>
                        )}
                    </div>
                )}
            </div>

        </div>
            {feedback && <p role="alert" className="mt-2 text-sm text-danger">{feedback}</p>}
        </div>
    )
}
