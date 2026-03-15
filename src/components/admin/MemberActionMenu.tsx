'use client'

import { useState, useRef, useEffect } from 'react'
import { updateUserRole, deactivateUser, manualReset, deleteUser } from '@/actions/admin'
import { toast } from 'sonner'

type UserProp = {
    id: string
    name: string | null
    role: string | null
    status: 'Active' | 'On Cooldown'
}

export function MemberActionMenu({ user }: { user: UserProp }) {
    const [isOpen, setIsOpen] = useState(false)
    const [modal, setModal] = useState<'none' | 'role' | 'deactivate' | 'delete'>('none')
    const [confirmText, setConfirmText] = useState('')
    const [role, setRole] = useState(user.role || 'Member')
    const [position, setPosition] = useState({ top: 0, right: 0 })
    const buttonRef = useRef<HTMLButtonElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

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
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            window.addEventListener("scroll", () => setIsOpen(false)) // Close on scroll
            window.addEventListener("resize", () => setIsOpen(false)) // Close on resize
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("scroll", () => setIsOpen(false))
            window.removeEventListener("resize", () => setIsOpen(false))
        }
    }, [isOpen])

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

    const handleUpdateRole = async () => {
        await updateUserRole(user.id, role)
        setModal('none')
        setIsOpen(false)
    }

    const handleDeactivate = async () => {
        await deactivateUser(user.id)
        setModal('none')
        setIsOpen(false)
    }

    const handleResetCooldown = async () => {
        await manualReset(user.id)
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (confirmText !== 'CONFIRM') return;
        
        const result = await deleteUser(user.id)
        if (result.success) {
            toast.success(`${user.name || 'User'} permanently deleted.`)
        } else {
            toast.error(result.error || "Failed to delete user.")
        }
        
        setModal('none')
        setIsOpen(false)
    }

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                className="text-slate-400 hover:text-orange-600 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 active:text-orange-700"
            >
                <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>

            {/* Dropdown Menu - Fixed Position */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="fixed w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                    style={{ top: position.top, right: position.right }}
                >
                    <div className="py-1">
                        <button
                            onClick={() => { setModal('role'); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px] text-slate-400">admin_panel_settings</span>
                            Edit Role
                        </button>

                        {user.status === 'On Cooldown' && (
                            <button
                                onClick={handleResetCooldown}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px] text-slate-400">lock_open</span>
                                Reset Cooldown
                            </button>
                        )}

                        <button
                            onClick={() => { setModal('deactivate'); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">block</span>
                            Deactivate Member
                        </button>

                        <button
                            onClick={() => { setConfirmText(''); setModal('delete'); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/50"
                        >
                            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                            Delete User
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Role Modal */}
            {modal === 'role' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Edit Role</h3>
                        <div className="space-y-3 mb-6">
                            <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${role === 'Admin' ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                                <input type="radio" name="role" value="Admin" checked={role === 'Admin'} onChange={() => setRole('Admin')} className="accent-orange-600" />
                                <span className="ml-3 font-medium text-slate-900 dark:text-white">Admin</span>
                            </label>
                            <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${role === 'Member' ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                                <input type="radio" name="role" value="Member" checked={role === 'Member'} onChange={() => setRole('Member')} className="accent-orange-600" />
                                <span className="ml-3 font-medium text-slate-900 dark:text-white">Member</span>
                            </label>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setModal('none')} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400">Cancel</button>
                            <button onClick={handleUpdateRole} className="px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-sm shadow-orange-500/20">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deactivate Modal */}
            {modal === 'deactivate' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-6 animate-in zoom-in-95 border-t-4 border-red-600">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Deactivate {user.name}?</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                            This will restrict the user from joining quests and accessing their workspace. This action can be undone by an Admin later.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setModal('none')} className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                            <button onClick={handleDeactivate} className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm shadow-red-500/20">Confirm Deactivate</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Modal */}
            {modal === 'delete' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-6 animate-in zoom-in-95 border-t-4 border-red-600">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete {user.name}?</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                            This action is <strong>permanent</strong> and cannot be undone. All of the user's data, including their completed quests and badges, will be permanently removed.
                        </p>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Please type <span className="font-bold select-none text-red-600 dark:text-red-400">CONFIRM</span> to confirm.
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
                                placeholder="CONFIRM"
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setModal('none')} className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                            <button 
                                onClick={handleDelete} 
                                disabled={confirmText !== 'CONFIRM'}
                                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
