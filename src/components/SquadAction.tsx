'use client'

import { useState } from 'react'
import { createSquad, joinSquad, leaveSquad } from '@/actions/squad'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function SquadAction({ questId, maxSnatchers }: { questId: string, maxSnatchers: number }) {
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [squadName, setSquadName] = useState('')
    const router = useRouter()

    const handleCreate = async () => {
        setLoading(true)
        try {
            const result = await createSquad(questId, squadName)
            if (result.success) {
                toast.success('Squad Created!')
                router.refresh()
                setShowModal(false)
            } else {
                toast.error(result.error as string)
            }
        } catch {
            toast.error('Action failed')
        } finally {
            setLoading(false)
        }
    }

    if (maxSnatchers <= 1) return null;

    return (
        <div className="mt-4">
            <button
                onClick={() => setShowModal(true)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-200"
            >
                Create a Squad
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Create Squad</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
                            Form a squad to collaborate on this quest.
                        </p>
                        <input
                            type="text"
                            placeholder="Squad Name (optional)"
                            value={squadName}
                            onChange={(e) => setSquadName(e.target.value)}
                            className="w-full p-2 mb-4 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={loading}
                                className="flex-1 px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export function SquadJoinButton({ squadId, disabled }: { squadId: string, disabled: boolean }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleJoin = async () => {
        setLoading(true)
        try {
            const result = await joinSquad(squadId)
            if (result.success) {
                toast.success('Joined Squad!')
                router.refresh()
            } else {
                toast.error(result.error as string)
            }
        } catch {
            toast.error('Action failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleJoin}
            disabled={loading || disabled}
            className="text-xs bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-2 rounded disabled:opacity-50"
        >
            {loading ? '...' : 'Join'}
        </button>
    )
}

export function SquadLeaveButton({ squadId }: { squadId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLeave = async () => {
        if (!confirm('Are you sure you want to drop this quest and leave the squad?')) return;
        setLoading(true)
        try {
            const result = await leaveSquad(squadId)
            if (result.success) {
                toast.success('Left Squad')
                router.refresh()
            } else {
                toast.error(result.error as string)
            }
        } catch {
            toast.error('Action failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleLeave}
            disabled={loading}
            className="text-xs text-red-500 hover:text-red-700 font-bold py-1"
        >
            {loading ? '...' : 'Drop Quest'}
        </button>
    )
}
