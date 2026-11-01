'use client'

import { useEffect } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminSidebar } from './AdminSidebarContext';
import Image from 'next/image';
import {
    Compass,
    Trophy,
    Code,
    LayoutDashboard,
    ScrollText,
    Inbox,
    Users,
} from 'lucide-react';
import { UserAvatar } from '@/components/ui/UserAvatar';

interface AdminSidebarProps {
    memberCount?: number;
    submissionCount?: number;
    user?: {
        id: string;
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

    useEffect(() => {
        if (!isMobileOpen) return;
        const media = window.matchMedia('(min-width: 768px)');
        const closeOnDesktop = () => { if (media.matches) closeMobileSidebar(); };
        closeOnDesktop();
        media.addEventListener('change', closeOnDesktop);
        return () => media.removeEventListener('change', closeOnDesktop);
    }, [isMobileOpen, closeMobileSidebar]);

    const getLinkClass = (path: string) => {
        const isActive = pathname === path || (path !== '/admin' && pathname?.startsWith(path));

        if (isActive) {
            return "min-h-11 flex items-center gap-3 px-3 py-2 rounded-button bg-secondary text-secondary-foreground relative transition-all group font-medium";
        }
        return "min-h-11 flex items-center gap-3 px-3 py-2 rounded-card text-muted  hover:bg-surface  hover:text-foreground  transition-colors group";
    };

    const userImage = user?.avatar || user?.image;
    const userName = user?.name || user?.handle || 'Admin User';
    const userEmail = user?.email || '';

    const content = (
        <>
                <div>
                    <div className="h-16 flex items-center px-6 border-b border-border">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg tracking-tight text-foreground">CodeQuest</span>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-1 px-4 pt-4 pb-2 border-b border-border mb-2">
                        <div className="px-3 py-2 text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                            Global Menu
                        </div>
                        {/* Reordered Menu: Explore, Leaderboard, Workspace */}
                        <Link className={getLinkClass('/explore')} aria-current={pathname === '/explore' ? 'page' : undefined} href="/explore" onClick={closeMobileSidebar}>
                            <Compass className="w-5 h-5 shrink-0" aria-hidden="true" />
                            <span>Explore Quests</span>
                        </Link>
                        <Link className={getLinkClass('/leaderboard')} aria-current={pathname === '/leaderboard' ? 'page' : undefined} href="/leaderboard" onClick={closeMobileSidebar}>
                            <Trophy className="w-5 h-5 shrink-0" aria-hidden="true" />
                            <span className="text-sm font-medium">Leaderboard</span>
                        </Link>
                        <Link className={getLinkClass('/workspace')} aria-current={pathname === '/workspace' ? 'page' : undefined} href="/workspace" onClick={closeMobileSidebar}>
                            <Code className="w-5 h-5 shrink-0" aria-hidden="true" />
                            <span className="text-sm font-medium">Workspace</span>
                        </Link>
                    </nav>
                    <nav className="flex flex-col gap-1 px-4 py-2">
                        <div className="px-3 py-2 text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                            Admin Command Center
                        </div>
                        <Link className={getLinkClass('/admin')} aria-current={pathname === '/admin' ? 'page' : undefined} href="/admin" onClick={closeMobileSidebar}>
                            <LayoutDashboard className="w-5 h-5 shrink-0" aria-hidden="true" />
                            <span className="text-sm font-medium">Overview</span>
                        </Link>
                        <Link className={getLinkClass('/admin/manage-quests')} aria-current={pathname === '/admin/manage-quests' ? 'page' : undefined} href="/admin/manage-quests" onClick={closeMobileSidebar}>
                            <ScrollText className="w-5 h-5 shrink-0" aria-hidden="true" />
                            <span className="text-sm font-medium">Manage Quests</span>
                        </Link>
                        <Link className={getLinkClass('/admin/submissions')} aria-current={pathname === '/admin/submissions' ? 'page' : undefined} href="/admin/submissions" onClick={closeMobileSidebar}>
                            <Inbox className="w-5 h-5 shrink-0" aria-hidden="true" />
                            <span className="text-sm font-medium whitespace-nowrap">Submission Queue</span>
                            {submissionCount > 0 && (
                                <span className="ml-auto bg-surface text-warning text-xs font-bold px-2 py-0.5 rounded-full">{submissionCount}</span>
                            )}
                        </Link>
                        <Link className={getLinkClass('/admin/members')} aria-current={pathname === '/admin/members' ? 'page' : undefined} href="/admin/members" onClick={closeMobileSidebar}>
                            <Users className="w-5 h-5 shrink-0" aria-hidden="true" />
                            <span className="text-sm font-medium whitespace-nowrap">Member Directory</span>
                            {memberCount > 0 && (
                                <span className="ml-auto bg-surface text-warning text-xs font-bold px-2 py-0.5 rounded-full">{memberCount}</span>
                            )}
                        </Link>
                    </nav>
                </div>
                <div className="p-4 border-t border-border flex flex-col gap-3">
                    <div className="bg-surface text-warning px-3 py-2 rounded-card text-xs font-semibold flex items-center justify-center gap-1.5 border border-border">
                        <Image src="/icon.png" alt="Points" width={14} height={14} className="object-contain" />
                        <span>{user?.points?.toLocaleString('en-US') ?? 0} pts</span>
                    </div>
                    <Link href={`/profile/${user?.id}`} className="flex items-center gap-3 p-2 rounded-card hover:bg-surface-raised cursor-pointer transition-colors min-w-0">
                        <UserAvatar
                            src={userImage}
                            name={userName}
                            size={36}
                            className="h-9 w-9 rounded-full border border-border shrink-0"
                        />
                        <div className="flex flex-col min-w-0 overflow-hidden">
                            <span className="text-sm font-semibold text-foreground truncate">{userName}</span>
                            <span className="text-xs text-muted truncate">{userEmail}</span>
                        </div>
                    </Link>
                </div>
        </>
    );
    return <>
        <aside aria-label="Admin navigation" className="hidden md:flex w-64 shrink-0 flex-col justify-between overflow-y-auto border-r border-border bg-surface h-dvh">{content}</aside>
        <Dialog open={isMobileOpen} onClose={closeMobileSidebar} title="Navigation" className="md:hidden max-w-sm">
            <button onClick={closeMobileSidebar} className="mb-3 w-full border border-control-border px-4 py-2">Close navigation</button>
            <div className="flex flex-col gap-4">{content}</div>
        </Dialog>
    </>;
}
