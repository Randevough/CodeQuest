'use client'

import React, { useState, useEffect, useSyncExternalStore } from 'react'

export type DevRole = 'admin' | 'member' | 'none'

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days = 30) {
    if (typeof document === 'undefined') return
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

const emptySubscribe = () => () => {}

export function DevRoleSwitcher() {
    const isMounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    )
    const [currentRole, setCurrentRole] = useState<DevRole>(() => {
        if (typeof document === 'undefined') return 'admin'
        const saved = getCookie('cq_dev_role') as DevRole | null
        if (saved && ['admin', 'member', 'none'].includes(saved)) {
            return saved
        }
        return 'admin'
    })
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const saved = getCookie('cq_dev_role')
        if (!saved || !['admin', 'member', 'none'].includes(saved)) {
            setCookie('cq_dev_role', 'admin')
        }
    }, [])

    const handleRoleChange = (role: DevRole) => {
        setCurrentRole(role)
        setCookie('cq_dev_role', role)
        setIsOpen(false)
        // Hard reload to immediately apply changes across middleware and server components
        window.location.reload()
    }

    if (!isMounted) return null

    const roleBadgeInfo = {
        admin: {
            label: 'Admin',
            icon: '👑',
            bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        },
        member: {
            label: 'Member',
            icon: '🎓',
            bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        },
        none: {
            label: 'Guest',
            icon: '👤',
            bg: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
        },
    }[currentRole]

    return (
        <div className="fixed bottom-4 right-4 z-[9999] font-sans">
            {/* Popover Card */}
            {isOpen && (
                <div
                    className="mb-3 w-72 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-4 shadow-2xl border border-gray-200/80 dark:border-zinc-800 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-semibold text-gray-900 dark:text-white">Dev Mode View</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs px-1.5 py-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mt-3 space-y-1.5">
                        <p className="text-[11px] font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                            Active Preview Role
                        </p>

                        <button
                            type="button"
                            onClick={() => handleRoleChange('admin')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition border ${
                                currentRole === 'admin'
                                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 font-medium'
                                    : 'border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800/60 text-gray-700 dark:text-zinc-300'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-base">👑</span>
                                <div>
                                    <div className="text-xs font-semibold">Admin View</div>
                                    <div className="text-[10px] text-gray-400 dark:text-zinc-500">Access `/admin/*`, workspace, profile</div>
                                </div>
                            </div>
                            {currentRole === 'admin' && <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">✓</span>}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleRoleChange('member')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition border ${
                                currentRole === 'member'
                                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-300 font-medium'
                                    : 'border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800/60 text-gray-700 dark:text-zinc-300'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-base">🎓</span>
                                <div>
                                    <div className="text-xs font-semibold">Member (Student)</div>
                                    <div className="text-[10px] text-gray-400 dark:text-zinc-500">Workspace & profile (`/admin` blocked)</div>
                                </div>
                            </div>
                            {currentRole === 'member' && <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">✓</span>}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleRoleChange('none')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition border ${
                                currentRole === 'none'
                                    ? 'bg-zinc-500/15 border-zinc-500/40 text-zinc-800 dark:text-zinc-200 font-medium'
                                    : 'border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800/60 text-gray-700 dark:text-zinc-300'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-base">👤</span>
                                <div>
                                    <div className="text-xs font-semibold">Guest (Real Auth)</div>
                                    <div className="text-[10px] text-gray-400 dark:text-zinc-500">Unauthenticated, test real login flow</div>
                                </div>
                            </div>
                            {currentRole === 'none' && <span className="text-xs font-bold text-zinc-500">✓</span>}
                        </button>
                    </div>

                    {/* Quick Page Jump Links */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                        <p className="text-[11px] font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                            Quick Page Previews
                        </p>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                            <button
                                onClick={() => { router.push('/admin'); setIsOpen(false); }}
                                className="px-2 py-1 text-left rounded-lg bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-medium transition"
                            >
                                🛡️ Admin Dashboard
                            </button>
                            <button
                                onClick={() => { router.push('/admin/submissions'); setIsOpen(false); }}
                                className="px-2 py-1 text-left rounded-lg bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-medium transition"
                            >
                                📋 Submissions
                            </button>
                            <button
                                onClick={() => { router.push('/workspace'); setIsOpen(false); }}
                                className="px-2 py-1 text-left rounded-lg bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-medium transition"
                            >
                                💼 Workspace
                            </button>
                            <button
                                onClick={() => { router.push('/profile'); setIsOpen(false); }}
                                className="px-2 py-1 text-left rounded-lg bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-medium transition"
                            >
                                👤 Profile
                            </button>
                            <button
                                onClick={() => { router.push('/leaderboard'); setIsOpen(false); }}
                                className="px-2 py-1 text-left rounded-lg bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-medium transition"
                            >
                                🏆 Leaderboard
                            </button>
                            <button
                                onClick={() => { router.push('/login'); setIsOpen(false); }}
                                className="px-2 py-1 text-left rounded-lg bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-medium transition"
                            >
                                🔑 Login Page
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg border text-xs font-semibold transition hover:scale-105 active:scale-95 ${roleBadgeInfo.bg} bg-white/80 dark:bg-zinc-900/80`}
                title="Click to toggle Dev Preview Role"
            >
                <span className="text-sm">{roleBadgeInfo.icon}</span>
                <span>[DEV] {roleBadgeInfo.label}</span>
                <span className="opacity-60 text-[10px]">{isOpen ? '▼' : '▲'}</span>
            </button>
        </div>
    )
}
