'use client'

import { useState } from 'react'
import { joinQuest, dropQuest } from '@/actions/quest'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function QuestAction({ questId, isSnatched }: { questId: string, isSnatched: boolean }) {
    const [loading, setLoading] = useState(false)
    const [showJoinModal, setShowJoinModal] = useState(false)
    const router = useRouter()

    const handleJoin = async () => {
        setLoading(true)
        try {
            const result = await joinQuest(questId)
            if (result.success) {
                toast.success('Quest Snatched! Good luck.')
                // Refresh to update UI state
                router.refresh()
                setShowJoinModal(false)
            } else {
                toast.error(result.error as string)
            }
        } catch (e) {
            toast.error('Action failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* If Snatched, show Submission Form (Mocked) */}
            {isSnatched ? (
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="repo-url">Project Repository URL</label>
                            <div className="flex flex-col gap-3 mb-4">
                                <div className="relative w-full">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <span className="material-symbols-outlined icon-filled text-[20px]">link</span>
                                    </span>
                                    <input
                                        className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-shadow"
                                        id="repo-url"
                                        placeholder="https://your-project-link.com"
                                        type="url"
                                    />
                                </div>
                                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">send</span>
                                    Submit Quest
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 text-center sm:text-left">
                        Submissions are manually reviewed by our Admin team. Ensure all requirements are met before deployment.
                    </p>
                </div>
            ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg text-center">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Join this quest to start working on it.</p>
                    <button
                        onClick={() => setShowJoinModal(true)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200"
                    >
                        Join Quest
                    </button>
                </div>
            )}

            {/* Join Confirmation Modal */}
            {showJoinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-100 dark:border-slate-800 transform transition-all">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Join this Quest?</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">
                            Are you sure you want to start this quest? It will be added to your active quests.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowJoinModal(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleJoin}
                                disabled={loading}
                                className="flex-1 px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                            >
                                {loading ? 'Joining...' : 'Confirm Join'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
