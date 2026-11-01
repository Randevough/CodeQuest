'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { joinQuest, submitQuest } from '@/actions/quest'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface UserStatus {
    status: string
    submissionUrl: string | null
}

export function QuestAction({
    questId,
    isSnatched,
    userStatus,
    isPending = false,
    isCompleted = false
}: {
    questId: string,
    isSnatched: boolean,
    userStatus: UserStatus | null,
    isPending?: boolean,
    isCompleted?: boolean
}) {
    const [loading, setLoading] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [showJoinModal, setShowJoinModal] = useState(false)
    const router = useRouter()

    const handleJoin = async () => {
        setFeedback('')
        setLoading(true)
        try {
            const result = await joinQuest(questId)
            if (result.success) {
                toast.success('Quest Snatched! Good luck.')
                // Refresh to update UI state
                router.refresh()
                setShowJoinModal(false)
            } else {
                setFeedback(result.error as string); toast.error(result.error as string)
            }
        } catch {
            setFeedback('Action failed'); toast.error('Action failed')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        const input = document.getElementById('repo-url') as HTMLInputElement
        const url = input?.value

        if (!url) {
            setFeedback('Please enter a URL'); toast.error('Please enter a URL')
            return
        }

        setFeedback('')
        setLoading(true)
        try {
            const result = await submitQuest(questId, url)
            if (result.success) {
                toast.success('Quest Submitted! Retrieval Drones dispatched.')
                router.refresh()
            } else {
                setFeedback((result as { error?: string }).error || 'Error'); toast.error((result as { error?: string }).error || 'Error')
            }
        } catch {
            setFeedback('Submission failed'); toast.error('Submission failed')
        } finally {
            setLoading(false)
        }
    }

    // derived state is now props
    // const isPending = userStatus?.status === 'SUBMITTED'
    // const isCompleted = ['ACCEPTED', 'ARCHIVED'].includes(userStatus?.status || '')

    if (isCompleted) {
        return (
            <div className="p-6 bg-surface rounded-card break-words border border-border text-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="size-12 rounded-full bg-surface flex items-center justify-center text-success mb-2">
                        <span aria-hidden="true" className="material-symbols-outlined text-[24px]">trophy</span>
                    </div>
                    <h3 className="text-lg font-bold text-success">Mission Accomplished!</h3>
                    <p className="text-success mb-2">
                        You have successfully completed this quest.
                    </p>
                    {userStatus?.submissionUrl && (
                        <a
                            href={userStatus.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-success hover:underline flex items-center gap-1"
                        >
                            View your submission <span aria-hidden="true" className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            {feedback && <p role="alert" className="text-danger mb-4">{feedback}</p>}
            {/* If Snatched, show Submission Form (Mocked) */}
            {isSnatched ? (
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="repo-url">Project Repository URL</label>
                            <div className="flex flex-col gap-3 mb-4">
                                <div className="relative w-full">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none flex items-center justify-center">
                                        <span aria-hidden="true" className="material-symbols-outlined icon-filled text-[20px]">link</span>
                                    </span>
                                    <input
                                        className="block w-full pl-10 pr-3 py-2.5 bg-surface border border-control-border rounded-lg text-sm text-foreground placeholder-muted focus:border-focus transition-all disabled:cursor-not-allowed"
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
                                    className={`w-full gap-2 ${isPending
                                        ? 'font-medium py-2.5 px-6 rounded-button flex items-center justify-center bg-surface text-muted cursor-not-allowed'
                                        : 'button-primary'
                                        }`}
                                >
                                    {isPending ? (
                                        <>
                                            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">hourglass_empty</span>
                                            Awaiting Evaluation
                                        </>
                                    ) : (
                                        <>
                                            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">send</span>
                                            {loading ? 'Submitting...' : 'Submit Quest'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-muted text-center sm:text-left">
                        {isPending
                            ? "Your solution is currently being evaluated by the Admin Command Center. You will be notified once the review is complete."
                            : "Submissions are manually reviewed by our Admin team. Ensure all requirements are met before deployment."
                        }
                    </p>
                </div>
            ) : (
                <div className="p-4 bg-surface rounded-lg text-center">
                    <p className="text-muted mb-4">Join this quest to start working on it.</p>
                    <button
                        onClick={() => setShowJoinModal(true)}
                        className="button-primary w-full"
                    >
                        Join Quest
                    </button>
                </div>
            )}

            {/* Join Confirmation Modal */}
            {showJoinModal && (
                <Dialog open={showJoinModal} onClose={() => setShowJoinModal(false)} pending={loading} title="Join this Quest?">
                        {feedback && <p role="alert" className="text-danger mb-4">{feedback}</p>}
                        <p className="text-sm text-muted mb-6">
                            Are you sure you want to start this quest? It will be added to your active quests.
                        </p>
                        <div className="flex gap-3">
                            <button
                                disabled={loading}
                                onClick={() => setShowJoinModal(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-foreground bg-surface rounded-lg hover:bg-surface-raised transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleJoin}
                                disabled={loading}
                                className="flex-1 button-secondary"
                            >
                                {loading ? 'Joining...' : 'Confirm Join'}
                            </button>
                        </div>
                </Dialog>
            )}
        </>
    )
}
