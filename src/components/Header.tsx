'use client'

import Link from 'next/link'
import { useState } from 'react'

interface HeaderProps {
    activePage: 'explore' | 'leaderboard' | 'workspace'
}

export function Header({ activePage }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const getLinkClass = (page: string, isMobile = false) => {
        const baseClass = isMobile
            ? "block px-3 py-2 text-base font-medium rounded-md transition-colors"
            : "px-3 py-1.5 text-sm font-medium rounded-md transition-colors"

        if (activePage === page) {
            return `${baseClass} text-[#4F46E5] bg-indigo-50 dark:bg-[#4F46E5]/10 dark:text-[#6366f1]`
        }
        return `${baseClass} text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5`
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-border-dark h-[64px] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex h-full items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex items-center justify-center size-8 rounded bg-black text-white dark:bg-white dark:text-black shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">terminal</span>
                            </div>
                            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">CodeQuest</span>
                        </Link>
                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link className={getLinkClass('explore')} href="/">Explore Quests</Link>
                            <Link className={getLinkClass('leaderboard')} href="/leaderboard">Leaderboard</Link>
                            <Link className={getLinkClass('workspace')} href="/workspace">My Workspace</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold gap-1.5">
                            <span className="text-sm">✨</span>
                            <span>450 pts</span>
                        </div>
                        <button className="hidden sm:flex items-center gap-2 group ml-1">
                            <div className="size-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden group-hover:border-gray-300 transition-all flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-400">person</span>
                            </div>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10"
                        >
                            <span className="material-symbols-outlined">
                                {isMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark absolute w-full left-0 top-[64px] shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                            className={getLinkClass('explore', true)}
                            href="/"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Explore Quests
                        </Link>
                        <Link
                            className={getLinkClass('leaderboard', true)}
                            href="/leaderboard"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Leaderboard
                        </Link>
                        <Link
                            className={getLinkClass('workspace', true)}
                            href="/workspace"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            My Workspace
                        </Link>
                        {/* Mobile User Info */}
                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center px-3 gap-3">
                                <div className="size-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-400">person</span>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">User Name</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">user@student.ac.id</div>
                                </div>
                                <div className="ml-auto flex items-center px-2 py-0.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold gap-1">
                                    <span className="text-xs">✨</span>
                                    <span>450 pts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
