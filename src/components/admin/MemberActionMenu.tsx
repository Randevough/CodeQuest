'use client'

import { useState, useRef, useEffect } from 'react'
import { updateUserRole, deactivateUser, manualReset, deleteUser } from '@/actions/admin'
import { assignQuest, getActiveQuestsForAssignment } from '@/actions/assignment'
import { Dialog } from '@/components/ui/Dialog'
import { toast } from 'sonner'

type UserProp = {
    id: string
    name: string | null
    role: string | null
    status: 'Active' | 'On Cooldown'
}

export function MemberActionMenu({ user }: { user: UserProp }) {
    const [message, setMessage] = useState('')
    const [isPending, setIsPending] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [modal, setModal] = useState<'none' | 'role' | 'deactivate' | 'delete' | 'assign-quest'>('none')
    const [confirmText, setConfirmText] = useState('')
    const [role, setRole] = useState(user.role || 'Member')
    const [position, setPosition] = useState({ top: 0, right: 0 })
    const [quests, setQuests] = useState<Array<{ id: string, title: string, maxSnatchers: number }>>([])
    const [selectedQuestId, setSelectedQuestId] = useState<string>('')
    const [isAssigning, setIsAssigning] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (modal === 'assign-quest') {
            setMessage('')
            getActiveQuestsForAssignment().then(setQuests).catch(() => setMessage('Could not load active quests. Close and reopen to retry.'))
        }
    }, [modal])

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Check if click is on the button or inside the dropdown
            if (
                (buttonRef.current && buttonRef.current.contains(event.target as Node)) ||
                (dropdownRef.current && dropdownRef.current.contains(event.target as Node))
            ) {
                return
            }
            setIsOpen(false)
        }
        const closeMenu = () => setIsOpen(false)
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            window.addEventListener("scroll", closeMenu) // Close on scroll
            window.addEventListener("resize", closeMenu) // Close on resize
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("scroll", closeMenu)
            window.removeEventListener("resize", closeMenu)
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return
        dropdownRef.current?.querySelector('button')?.focus()
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { setIsOpen(false); buttonRef.current?.focus() }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [isOpen])

    const openModal = (next: 'role' | 'deactivate' | 'delete' | 'assign-quest') => {
        buttonRef.current?.focus()
        setMessage('')
        setModal(next)
        setIsOpen(false)
    }
    const toggleMenu = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            })
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
    }

    const mutate = async (action: () => Promise<{ success: boolean; error?: string }>, success: string) => {
        if (isPending) return
        setIsPending(true)
        setMessage('')
        try {
            const result = await action()
            if (result.success) {
                setMessage(success)
                setModal('none')
                setIsOpen(false)
            } else {
                setMessage(result.error || 'Could not save changes. Try again.')
            }
        } catch {
            setMessage('Could not save changes. Try again.')
        } finally {
            setIsPending(false)
        }
    }
    const handleUpdateRole = () => mutate(() => updateUserRole(user.id, role), 'Role updated.')
    const handleDeactivate = () => mutate(() => deactivateUser(user.id), 'Member deactivated.')
    const handleResetCooldown = () => mutate(() => manualReset(user.id), 'Cooldown reset.')
    const handleDelete = () => {
        if (confirmText !== 'CONFIRM') return
        return mutate(() => deleteUser(user.id), 'Member permanently deleted.')
    }

    const handleAssignQuest = async (force: boolean = false) => {
        if (!selectedQuestId || isAssigning || isPending) return
        setIsAssigning(true)

        let res;
        try {
            res = await assignQuest(user.id, selectedQuestId, force)
        } catch {
            setMessage('Could not assign quest. Try again.')
            setIsAssigning(false)
            return
        }

        setIsAssigning(false)

        if (res.success) {
            setMessage("Quest assigned.")
            toast.success(`Quest assigned to ${user.name || 'User'}!`)
            setModal('none')
            setIsOpen(false)
        } else if (res.error === 'CAPACITY_EXCEEDED') {
            const confirmForce = window.confirm(`${res.message}\n\nDo you want to override the capacity and assign anyway?`)
            if (confirmForce) {
                handleAssignQuest(true)
            }
        } else {
            setMessage(res.error || "Failed to assign quest.")
            toast.error(res.error || "Failed to assign quest.")
        }
    }

    return (
        <>
            {message && modal === 'none' && <p role="status" className="max-w-xs text-sm text-foreground">{message}</p>}
            <button
                ref={buttonRef}
                aria-label={`Actions for ${user.name || "member"}`}
                aria-expanded={isOpen}
                disabled={isPending || isAssigning}
                onClick={toggleMenu}
                className="text-muted hover:text-warning transition-colors p-1 rounded-full hover:bg-surface-raised active:text-warning"
            >
                <span aria-hidden="true" className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>

            {/* Dropdown Menu - Fixed Position */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="fixed w-48 bg-surface rounded-card shadow-xl border border-border z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                    style={{ top: position.top, right: position.right }}
                >
                    <div className="py-1">
                        <button
                            onClick={() => { openModal('role'); }}
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface flex items-center gap-2"
                        >
                            <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-muted">admin_panel_settings</span>
                            Edit Role
                        </button>

                        <button
                            onClick={() => { openModal('assign-quest'); }}
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface flex items-center gap-2"
                        >
                            <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-muted">assignment_add</span>
                            Assign Quest
                        </button>

                        {user.status === 'On Cooldown' && (
                            <button
                                onClick={handleResetCooldown}
                                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface flex items-center gap-2"
                            >
                                <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-muted">lock_open</span>
                                Reset Cooldown
                            </button>
                        )}

                        <button
                            onClick={() => { openModal('deactivate'); }}
                            className="w-full text-left px-4 py-2 text-sm text-warning hover:bg-surface flex items-center gap-2"
                        >
                            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">block</span>
                            Deactivate Member
                        </button>

                        <button
                            onClick={() => { setConfirmText(''); openModal('delete'); }}
                            className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-surface flex items-center gap-2 border-t border-border"
                        >
                            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">delete_forever</span>
                            Delete User
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Role Modal */}
            {modal === 'role' && (
                <Dialog open={true} onClose={() => setModal('none')} title="Edit Role" pending={isPending || isAssigning}>
                        {message && <p role="status" className="mb-4 border border-control-border bg-surface p-3 text-foreground">{message}</p>}
                        <h3 className="text-lg font-bold text-foreground mb-4">Edit Role</h3>
                        <div className="space-y-3 mb-6">
                            <label className={`flex items-center p-3 rounded-card border cursor-pointer transition-all ${role === 'Admin' ? 'border-border bg-surface ' : 'border-border '}`}>
                                <input type="radio" name="role" value="Admin" checked={role === 'Admin'} onChange={() => setRole('Admin')} className="accent-secondary" />
                                <span className="ml-3 font-medium text-foreground">Admin</span>
                            </label>
                            <label className={`flex items-center p-3 rounded-card border cursor-pointer transition-all ${role === 'Member' ? 'border-border bg-surface ' : 'border-border '}`}>
                                <input type="radio" name="role" value="Member" checked={role === 'Member'} onChange={() => setRole('Member')} className="accent-secondary" />
                                <span className="ml-3 font-medium text-foreground">Member</span>
                            </label>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-end">
                            <button onClick={() => setModal('none')} disabled={isPending || isAssigning} className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground">Cancel</button>
                            <button onClick={handleUpdateRole} disabled={isPending} className="px-4 py-2 text-sm font-bold bg-secondary rounded-card hover:bg-secondary shadow-sm text-secondary-foreground">{isPending ? 'Saving…' : 'Save Changes'}</button>
                        </div>

                </Dialog>
            )}

            {/* Deactivate Modal */}
            {modal === 'deactivate' && (
                <Dialog open={true} onClose={() => setModal('none')} title="Deactivate member" pending={isPending || isAssigning}>
                        {message && <p role="status" className="mb-4 border border-control-border bg-surface p-3 text-foreground">{message}</p>}
                        <h3 className="text-lg font-bold text-foreground mb-2">Deactivate {user.name}?</h3>
                        <p className="text-muted mb-6 leading-relaxed">
                            This will restrict the user from joining quests and accessing their workspace. This action can be undone by an Admin later.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-end">
                            <button onClick={() => setModal('none')} disabled={isPending || isAssigning} className="px-4 py-2 text-sm font-medium border border-border rounded-card text-muted hover:bg-surface">Cancel</button>
                            <button onClick={handleDeactivate} disabled={isPending} className="px-4 py-2 text-sm font-bold text-danger bg-surface border border-control-border rounded-button hover:bg-surface-raised shadow-sm">{isPending ? 'Deactivating…' : 'Confirm Deactivate'}</button>
                        </div>

                </Dialog>
            )}
            {/* Delete Modal */}
            {modal === 'delete' && (
                <Dialog open={true} onClose={() => setModal('none')} title="Delete member" pending={isPending || isAssigning}>
                        {message && <p role="status" className="mb-4 border border-control-border bg-surface p-3 text-foreground">{message}</p>}
                        <h3 className="text-lg font-bold text-foreground mb-2">Delete {user.name}?</h3>
                        <p className="text-muted mb-4 leading-relaxed">
                            This action is <strong>permanent</strong> and cannot be undone. All of the user&apos;s data, including their completed quests and badges, will be permanently removed.
                        </p>
                        <div className="mb-6">
                            <label htmlFor={`confirm-${user.id}`} className="block text-sm font-medium text-foreground mb-2">
                                Please type <span className="font-bold select-none text-danger">CONFIRM</span> to confirm.
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                className="w-full px-3 py-2 border border-control-border rounded-card bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-control-border focus:border-control-border transition-shadow"
                                id={`confirm-${user.id}`} aria-label="Type CONFIRM to delete member" placeholder="CONFIRM"
                            />
                        </div>
                        <div className="flex flex-wrap gap-3 justify-end">
                            <button onClick={() => setModal('none')} disabled={isPending || isAssigning} className="px-4 py-2 text-sm font-medium border border-border rounded-card text-muted hover:bg-surface">Cancel</button>
                            <button
                                onClick={handleDelete}
                                disabled={confirmText !== 'CONFIRM' || isPending}
                                className="px-4 py-2 text-sm font-bold text-danger bg-surface border border-control-border rounded-button hover:bg-surface-raised shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isPending ? 'Deleting…' : 'Delete User'}
                            </button>
                        </div>

                </Dialog>
            )}

            {/* Assign Quest Modal */}
            {modal === 'assign-quest' && (
                <Dialog open={true} onClose={() => setModal('none')} title="Assign quest" pending={isPending || isAssigning}>
                        {message && <p role="status" className="mb-4 border border-control-border bg-surface p-3 text-foreground">{message}</p>}
                        <h3 className="text-lg font-bold text-foreground mb-2">Assign Quest to {user.name}</h3>
                        <p className="text-muted mb-4 leading-relaxed text-sm">
                            Manually assign an active quest to this user. This bypasses the max 3 active quests rule.
                        </p>
                        <div className="mb-6 space-y-4">
                            <div>
                                <label htmlFor={`assignment-${user.id}`} className="block text-sm font-medium text-foreground mb-1">Select Quest</label>
                                <select
                                    id={`assignment-${user.id}`} aria-label="Select quest to assign"
                                    className="w-full px-3 py-2 border border-control-border rounded-card bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-control-border focus:border-control-border"
                                    value={selectedQuestId}
                                    onChange={(e) => setSelectedQuestId(e.target.value)}
                                    disabled={isAssigning}
                                >
                                    <option value="" disabled>-- Select a quest --</option>
                                    {quests.map(q => (
                                        <option key={q.id} value={q.id}>[{q.id}] {q.title} (Max: {q.maxSnatchers})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-end">
                            <button onClick={() => setModal('none')} disabled={isPending || isAssigning} className="px-4 py-2 text-sm font-medium border border-border rounded-card text-muted hover:bg-surface" >Cancel</button>
                            <button
                                onClick={() => handleAssignQuest(false)}
                                disabled={!selectedQuestId || isAssigning}
                                className="px-4 py-2 text-sm font-bold bg-secondary rounded-card hover:bg-secondary shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all text-secondary-foreground"
                            >
                                {isAssigning ? 'Assigning...' : 'Assign Quest'}
                            </button>
                        </div>

                </Dialog>
            )}
        </>
    )
}
