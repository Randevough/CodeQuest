'use client'

import { useState } from 'react'
import { joinQuest, submitQuest } from '@/actions/quest'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface UserStatus {
    status: string
    submissionUrl: string | null
}

export function QuestAction({ questId, isSnatched, userStatus }: { questId: string, isSnatched: boolean, userStatus: UserStatus | null }) {
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

    const handleSubmit = async () => {
        const input = document.getElementById('repo-url') as HTMLInputElement
        const url = input?.value

        if (!url) {
            toast.error('Please enter a URL')
            return
        }

        setLoading(true)
        try {
            const result = await submitQuest(questId, url)
            if (result.success) {
                toast.success('Quest Submitted! Retrieval Drones dispatched.')
                router.refresh()
            } else {
                toast.error((result as any).error)
            }
        } catch (e) {
            toast.error('Submission failed')
        } finally {
            setLoading(false)
        }
    }

    const isPending = userStatus?.status === 'SUBMITTED'
    const isCompleted = ['COMPLETED', 'ACCEPTED', 'ARCHIVED'].includes(userStatus?.status || '')

    if (isCompleted) {
        return (
            <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30 text-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
                        <span className="material-symbols-outlined text-[24px]">trophy</span>
                    </div>
                    <h3 className="text-lg font-bold text-green-800 dark:text-green-300">Mission Accomplished!</h3>
                    <p className="text-green-700 dark:text-green-400 mb-2">
                        You have successfully completed this quest.
                    </p>
                    {userStatus?.submissionUrl && (
                        <a
                            href={userStatus.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
                        >
                            View your submission <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                    )}
                </div>
            </div>
        )
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
                                        className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                                        id="repo-url"
                                        placeholder="https://your-project-link.com"
                                        type="url"
                                        defaultValue={userStatus?.submissionUrl || ''}
                                        disabled={isPending}
                                    />
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || isPending}
                                    className={`w-full font-medium py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 ${isPending
                                        ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95'
                                        }`}
                                >
                                    {isPending ? (
                                        <>
                                            <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
                                            Awaiting Evaluation
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[20px]">send</span>
                                            {loading ? 'Submitting...' : 'Submit Quest'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 text-center sm:text-left">
                        {isPending
                            ? "Your solution is currently being evaluated by the Admin Command Center. You will be notified once the review is complete."
                            : "Submissions are manually reviewed by our Admin team. Ensure all requirements are met before deployment."
                        }
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
