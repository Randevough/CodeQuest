import Link from 'next/link'

interface HeaderProps {
    activePage: 'explore' | 'leaderboard' | 'workspace'
}

export function Header({ activePage }: HeaderProps) {
    const getLinkClass = (page: string) => {
        const baseClass = "px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
        if (activePage === page) {
            return `${baseClass} text-gray-900 bg-gray-100 dark:bg-white/10 dark:text-white`
        }
        return `${baseClass} text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5`
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark h-[64px]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex h-full items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex items-center justify-center size-8 rounded bg-black text-white dark:bg-white dark:text-black shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">terminal</span>
                            </div>
                            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">CodeQuest</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-1">
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
                        <button className="flex items-center gap-2 group ml-1">
                            <div className="size-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden group-hover:border-gray-300 transition-all flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-400">person</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
