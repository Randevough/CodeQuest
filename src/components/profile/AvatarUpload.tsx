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
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size must be less than 2MB')
            return
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Only JPEG, PNG, and WebP images are allowed')
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.set('file', file)

        try {
            const result = await uploadProfileImage(formData)
            if (result.success) {
                toast.success('Profile picture updated!')
            } else {
                toast.error(result.error as string)
            }
        } catch {
            toast.error('Upload failed')
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
        <div className={`relative flex-shrink-0 rounded-full transition-all hover:ring-2 hover:ring-orange-400 hover:ring-offset-1 ${editable ? 'group cursor-pointer' : ''}`} style={{ width: size, height: size }} onClick={editable ? handleClick : undefined}>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={isUploading || !editable}
            />

            <div
                className={`w-full h-full rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm relative transition-all ${editable ? 'group-hover:border-orange-500' : ''}`}
            >
                {currentAvatar ? (
                    <Image
                        src={currentAvatar}
                        alt={name || 'Profile'}
                        fill
                        sizes={`${size}px`}
                        className={`object-cover transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-bold text-4xl">
                        {initials}
                    </div>
                )}

                {/* Overlay for hover/loading */}
                {editable && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {isUploading ? (
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                        )}
                    </div>
                )}
            </div>

            <div className={`absolute bottom-1 right-1 size-4 rounded-full border-2 border-white dark:border-slate-800 ${isUploading ? 'bg-yellow-400' : 'bg-green-500'}`} title={isUploading ? "Uploading..." : "Online"}></div>
        </div>
    )
}
