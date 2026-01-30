
'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import PointsIcon from '@/app/icon.png'

export function PointsInfoModal() {
    const [isOpen, setIsOpen] = useState(false)
    const modalRef = useRef<HTMLDivElement>(null)

    // Close on outside click is handled by the backdrop div click handler
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false)
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden' // Prevent scroll
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center size-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="View ranking rules"
            >
                <span className="material-symbols-outlined text-[16px]">info</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div
                        className="relative bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up border border-slate-200 dark:border-slate-800"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        ref={modalRef}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                Point & Ranking Rules
                                <Image src={PointsIcon} alt="Points" width={20} height={20} className="object-contain" />
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                aria-label="Close"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 size-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Approved Quests Only</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Points <span className="inline-flex align-baseline translate-y-0.5"><Image src={PointsIcon} alt="Points" width={14} height={14} className="object-contain" /></span> displayed on the leaderboard are strictly from quests that have been <strong className="text-slate-900 dark:text-slate-200 font-medium">'Approved'</strong> by the Admin team.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 size-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                        <span className="material-symbols-outlined text-[18px]">pending</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Pending Validation</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Tasks with <strong className="text-slate-900 dark:text-slate-200 font-medium">'Pending Review'</strong> or <strong className="text-slate-900 dark:text-slate-200 font-medium">'Revision Needed'</strong> status will not be added to your total balance until they are officially accepted.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">timer</span>
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">Tie-Breaker Rule</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            In case of a point tie, the member who achieved their last approval <span className="font-medium text-slate-700 dark:text-slate-300">earliest</span> takes the higher rank.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer - optional, removed for clean look or just padding */}
                    </div>
                </div>
            )}
        </>
    )
}
