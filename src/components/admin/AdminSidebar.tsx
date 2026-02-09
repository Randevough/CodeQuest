'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminSidebar } from './AdminSidebarContext';
import Image from 'next/image';

interface AdminSidebarProps {
    memberCount?: number;
    submissionCount?: number;
    user?: {
        name: string | null;
        email: string | null;
        image: string | null;
        avatar: string | null;
        points: number;
        handle: string | null;
    } | null;
}

export function AdminSidebar({ memberCount = 0, submissionCount = 0, user }: AdminSidebarProps) {
    const pathname = usePathname();
    const { isMobileOpen, closeMobileSidebar } = useAdminSidebar();

    const getLinkClass = (path: string) => {
        const isActive = pathname === path || (path !== '/admin' && pathname?.startsWith(path));

        if (isActive) {
            return "flex items-center gap-3 px-3 py-2 rounded-lg bg-orange-50/50 text-orange-600 relative transition-all group font-medium";
        }
        return "flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group";
    };

    // Helper to get initials
    const getInitials = (name: string | null) => {
        const displayName = name || '?';
        const parts = displayName.split(' ').filter(Boolean);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return displayName.substring(0, 2).toUpperCase();
    };

    const userImage = user?.avatar || user?.image;
    const userName = user?.name || user?.handle || 'Admin User';
    const userEmail = user?.email || '';

    return (
        <>
            {/* Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={closeMobileSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 
                border-r border-border-light dark:border-border-dark 
                bg-surface-light dark:bg-surface-dark 
                flex flex-col justify-between 
                h-screen transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
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
                        {/* Reordered Menu: Explore, Leaderboard, Workspace */}
                        <Link className={getLinkClass('/')} href="/" onClick={closeMobileSidebar}>
                            <span className={`material-symbols-outlined text-[20px] transition-colors ${pathname === '/' ? 'text-orange-600' : 'text-slate-400 group-hover:text-primary'}`}>explore</span>
                            <span className="text-sm font-medium">Explore Quests</span>
                        </Link>
                        <Link className={getLinkClass('/leaderboard')} href="/leaderboard" onClick={closeMobileSidebar}>
                            <span className={`material-symbols-outlined text-[20px] transition-colors ${pathname?.startsWith('/leaderboard') ? 'text-orange-600' : 'text-slate-400 group-hover:text-primary'}`}>emoji_events</span>
                            <span className="text-sm font-medium">Leaderboard</span>
                        </Link>
                        <Link className={getLinkClass('/workspace')} href="/workspace" onClick={closeMobileSidebar}>
                            <span className={`material-symbols-outlined text-[20px] transition-colors ${pathname?.startsWith('/workspace') ? 'text-orange-600' : 'text-slate-400 group-hover:text-primary'}`}>code</span>
                            <span className="text-sm font-medium">Workspace</span>
                        </Link>
                    </nav>
                    <nav className="flex flex-col gap-1 px-4 py-2">
                        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Admin Command Center
                        </div>
                        <Link className={getLinkClass('/admin')} href="/admin" onClick={closeMobileSidebar}>
                            <span className={`material-symbols-outlined text-[20px] transition-colors ${pathname === '/admin' ? 'text-orange-600' : 'text-slate-400 group-hover:text-primary'}`}>dashboard</span>
                            <span className="text-sm font-medium">Overview</span>
                        </Link>
                        <Link className={getLinkClass('/admin/manage-quests')} href="/admin/manage-quests" onClick={closeMobileSidebar}>
                            <span className={`material-symbols-outlined text-[20px] transition-colors ${pathname?.startsWith('/admin/manage-quests') ? 'text-orange-600' : 'text-slate-400 group-hover:text-primary'}`}>assignment</span>
                            <span className="text-sm font-medium">Manage Quests</span>
                        </Link>
                        <Link className={getLinkClass('/admin/submissions')} href="/admin/submissions" onClick={closeMobileSidebar}>
                            <span className={`material-symbols-outlined text-[20px] transition-colors ${pathname?.startsWith('/admin/submissions') ? 'text-orange-600' : 'text-slate-400 group-hover:text-primary'}`}>inbox</span>
                            <span className="text-sm font-medium whitespace-nowrap">Submission Queue</span>
                            {submissionCount > 0 && (
                                <span className="ml-auto bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-300 text-xs font-bold px-2 py-0.5 rounded-full">{submissionCount}</span>
                            )}
                        </Link>
                        <Link className={getLinkClass('/admin/members')} href="/admin/members" onClick={closeMobileSidebar}>
                            <span className={`material-symbols-outlined text-[20px] transition-colors ${pathname?.startsWith('/admin/members') ? 'text-orange-600' : 'text-slate-400 group-hover:text-primary'}`}>group</span>
                            <span className="text-sm font-medium whitespace-nowrap">Member Directory</span>
                            {memberCount > 0 && (
                                <span className="ml-auto bg-orange-50 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">{memberCount}</span>
                            )}
                        </Link>
                    </nav>
                </div>
                <div className="p-4 border-t border-border-light dark:border-border-dark flex flex-col gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800/20 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-800/50">
                        <Image src="/icon.png" alt="Points" width={14} height={14} className="object-contain" />
                        <span>{user?.points?.toLocaleString() ?? 0} pts</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                        {userImage ? (
                            <Image
                                src={userImage}
                                alt={userName}
                                width={32}
                                height={32}
                                className="rounded-full object-cover h-8 w-8 border border-slate-200 dark:border-slate-700"
                            />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200 dark:border-slate-600">
                                {getInitials(userName)}
                            </div>
                        )}
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{userName}</span>
                            <span className="text-xs text-slate-500 truncate">{userEmail}</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
