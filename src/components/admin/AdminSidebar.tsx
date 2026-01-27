
import Link from 'next/link';

export function AdminSidebar() {
    return (
        <aside className="w-64 flex-shrink-0 border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex flex-col justify-between z-20 h-screen">
            <div>
                <div className="h-16 flex items-center px-6 border-b border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">CodeQuest</span>
                    </div>
                </div>
                <nav className="flex flex-col gap-1 px-4 pt-4 pb-2 border-b border-border-light dark:border-border-dark mb-2">
                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Global Menu
                    </div>
                    <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="/quests">
                        <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary transition-colors">explore</span>
                        <span className="text-sm font-medium">Explore Quests</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="/workspace">
                        <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary transition-colors">code</span>
                        <span className="text-sm font-medium">Workspace</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="/leaderboard">
                        <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary transition-colors">emoji_events</span>
                        <span className="text-sm font-medium">Leaderboard</span>
                    </Link>
                </nav>
                <nav className="flex flex-col gap-1 px-4 py-2">
                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Admin Command Center
                    </div>
                    <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="/admin">
                        <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary transition-colors">dashboard</span>
                        <span className="text-sm font-medium">Overview</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="/admin/quests">
                        <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary transition-colors">assignment</span>
                        <span className="text-sm font-medium">Manage Quests</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" href="/admin/submissions">
                        <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary transition-colors">inbox</span>
                        <span className="text-sm font-medium">Submission Queue</span>
                        <span className="ml-auto bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">12</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/10" href="/admin/members">
                        <span className="material-symbols-outlined text-[20px] icon-filled">group</span>
                        <span className="text-sm font-medium">Member Directory</span>
                    </Link>
                </nav>
            </div>
            <div className="p-4 border-t border-border-light dark:border-border-dark flex flex-col gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/20 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-800/50">
                    <span>✨ 450 pts</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                    <div className="h-8 w-8 rounded bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        AD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Admin User</span>
                        <span className="text-xs text-slate-500">codequest@cyber-univ.ac.id</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
