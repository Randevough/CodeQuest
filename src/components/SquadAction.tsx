'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { createSquad, joinSquad, leaveSquad } from '@/actions/squad'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function SquadAction({ questId, maxSnatchers }: { questId: string, maxSnatchers: number }) {
    const [loading, setLoading] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [squadName, setSquadName] = useState('')
    const router = useRouter()

    const handleCreate = async () => {
        setFeedback('')
        setLoading(true)
        try {
            const result = await createSquad(questId, squadName)
            if (result.success) {
                toast.success('Squad Created!')
                router.refresh()
                setShowModal(false)
            } else {
                setFeedback(result.error as string); toast.error(result.error as string)
            }
        } catch {
            setFeedback('Action failed'); toast.error('Action failed')
        } finally {
            setLoading(false)
        }
    }

    if (maxSnatchers <= 1) return null;

    return (
        <div className="mt-4">
            {feedback && <p role="alert" className="text-danger">{feedback}</p>}
            <button
                onClick={() => setShowModal(true)}
                className="w-full bg-surface hover:bg-surface-raised text-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-fast"
            >
                Create a Squad
            </button>

            {showModal && (
                <Dialog open={showModal} onClose={() => setShowModal(false)} pending={loading} title="Create Squad">
                        {feedback && <p role="alert" className="text-danger mb-4">{feedback}</p>}
                        <label htmlFor="squad-name">Squad name (optional)</label>
                        <p className="text-sm text-muted mb-4">
                            Form a squad to collaborate on this quest.
                        </p>
                        <input
                            type="text"
                            id="squad-name"
                            placeholder="Squad Name (optional)"
                            value={squadName}
                            onChange={(e) => setSquadName(e.target.value)}
                            className="w-full p-2 mb-4 border rounded bg-surface border-control-border text-foreground"
                        />
                        <div className="flex gap-3">
                            <button
                                disabled={loading}
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-foreground bg-surface rounded-lg hover:bg-surface-raised transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={loading}
                                className="flex-1 button-secondary"
                            >
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                </Dialog>
            )}
        </div>
    )
}

export function SquadJoinButton({ squadId, disabled }: { squadId: string, disabled: boolean }) {
    const [loading, setLoading] = useState(false)
    const [feedback, setFeedback] = useState('')
    const router = useRouter()

    const handleJoin = async () => {
        setFeedback('')
        setLoading(true)
        try {
            const result = await joinSquad(squadId)
            if (result.success) {
                toast.success('Joined Squad!')
                router.refresh()
            } else {
                setFeedback(result.error as string); toast.error(result.error as string)
            }
        } catch {
            setFeedback('Action failed'); toast.error('Action failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
        {feedback && <p role="alert" className="text-danger">{feedback}</p>}
        <button
            onClick={handleJoin}
            disabled={loading || disabled}
            className="button-secondary"
        >
            {loading ? '...' : 'Join'}
        </button>
        </div>
    )
}

export function SquadLeaveButton({ squadId }: { squadId: string }) {
    const [loading, setLoading] = useState(false)
    const [feedback, setFeedback] = useState('')
    const router = useRouter()

    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

    const handleLeave = async () => {
        setFeedback('')
        setLoading(true)
        try {
            const result = await leaveSquad(squadId)
            if (result.success) {
                toast.success('Left Squad')
                setShowLeaveConfirm(false)
                router.refresh()
            } else {
                setFeedback(result.error as string); toast.error(result.error as string)
            }
        } catch {
            setFeedback('Action failed'); toast.error('Action failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
        {feedback && <p role="alert" className="text-danger">{feedback}</p>}
        <button
            onClick={() => setShowLeaveConfirm(true)}
            disabled={loading}
            className="text-sm text-danger hover:text-danger font-bold py-1"
        >
            {loading ? 'Leaving…' : 'Drop Quest'}
        </button>
        {showLeaveConfirm && <Dialog open={showLeaveConfirm} onClose={() => setShowLeaveConfirm(false)} pending={loading} title="Leave squad?">
            <p className="text-muted mb-4">This drops your quest and leaves the squad.</p>
            {feedback && <p role="alert" className="text-danger mb-4">{feedback}</p>}
            <div className="flex flex-wrap gap-3">
                <button disabled={loading} onClick={() => setShowLeaveConfirm(false)} className="border border-control-border px-4">Cancel</button>
                <button disabled={loading} onClick={handleLeave} className="button-secondary">{loading ? 'Leaving…' : 'Leave squad'}</button>
            </div>
        </Dialog>}
        </div>
    )
}
