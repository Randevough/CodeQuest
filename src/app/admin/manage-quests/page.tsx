import Link from 'next/link';
import { MobileSidebarTrigger } from '@/components/admin/MobileSidebarTrigger';
import { Pagination } from '@/components/Pagination';
import { QuestFilters } from '@/components/admin/QuestFilters';
import { QuestActions } from './QuestActions';
import { getQuests } from '@/actions/quest';

interface ManageQuestsPageProps {
    searchParams: {
        page?: string;
        status?: string;
        q?: string;
    };
}

export default async function ManageQuestsPage({ searchParams }: ManageQuestsPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const status = params.status || 'All';
    const query = params.q || '';

    // TODO: Update getQuests to support sorting by updatedAt desc
    const { success, data: quests, pagination } = await getQuests({
        page,
        limit: 10,
        search: query,
        status,
        includeFull: true,
    });

    const hasQuests = quests && quests.length > 0;

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0a0a0a] relative font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <header className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-border-dark flex items-center justify-between px-4 sm:px-8 bg-white dark:bg-surface-dark z-10">
                <div className="flex items-center gap-4">
                    <MobileSidebarTrigger className="md:hidden" />
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Manage Quests</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/manage-quests/create"
                        className="flex items-center justify-center h-9 px-4 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium shadow-sm transition-all focus:ring-2 focus:ring-orange-600/30 focus:outline-none gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Create New Quest
                    </Link>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="mx-auto max-w-6xl flex flex-col gap-6">
                    {/* Filters */}
                    <QuestFilters />

                    {/* Table */}
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-lg shadow-sm min-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-border-dark text-xs uppercase text-slate-500 dark:text-slate-400 font-medium tracking-wider">
                                    <th className="px-6 py-3 w-[35%]">Quest</th>
                                    <th className="px-6 py-3">Category & Difficulty</th>
                                    <th className="px-6 py-3 text-center">Points</th>
                                    <th className="px-6 py-3 text-center">Applicants</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                {!hasQuests ? (
                                    <tr>
                                        <td colSpan={6}>
                                            <EmptyState />
                                        </td>
                                    </tr>
                                ) : (
                                    quests.map((quest) => (
                                        <tr key={quest.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-1">{quest.title}</span>
                                                    <span className="text-[11px] text-slate-500 font-mono mt-0.5">{quest.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-border-dark">
                                                        {quest.category}
                                                    </span>
                                                    <DifficultyBadge difficulty={quest.difficulty} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center justify-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                                                    <span>{quest.points}</span>
                                                    <img src="/icon.png" alt="XP" className="w-5 h-5 object-contain" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center justify-center gap-1.5 text-slate-600 dark:text-slate-400">
                                                    <span className="material-symbols-outlined text-[18px] text-slate-400">group</span>
                                                    <span className="text-sm font-bold">
                                                        {quest._count.snatches}/{quest.maxSnatchers}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={quest.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end">
                                                    <QuestActions questId={quest.id} status={quest.status} activeSnatchesCount={quest._count.snatches} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Footer */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-border-dark bg-slate-50/50 dark:bg-white/5">
                                <span className="text-sm text-slate-500">Showing {Math.min(pagination.totalItems, (pagination.currentPage - 1) * 10 + 1)}-{Math.min(pagination.totalItems, pagination.currentPage * 10)} of {pagination.totalItems} quests</span>
                                <Pagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
    const d = difficulty.toLowerCase();
    let displayClass = "";
    if (d === 'exclusive') {
        displayClass = "bg-gradient-to-br from-yellow-400 to-amber-500 text-white font-bold shadow-md shadow-amber-400/50 ring-1 ring-inset ring-yellow-200/40 border-0";
    } else if (d === 'beginner') {
        displayClass = "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50";
    } else if (d === 'intermediate') {
        displayClass = "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50";
    } else if (d === 'advanced' || d === 'advance') {
        displayClass = "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50";
    } else {
        displayClass = "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-border-dark";
    }

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold capitalize ${displayClass}`}>
            {difficulty}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    if (s === 'active') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Active
            </span>
        );
    } else if (s === 'draft') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                Draft
            </span>
        );
    } else if (s === 'closed') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Closed
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
            {status}
        </span>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-slate-400">search_off</span>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">No quests found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-6">
                We couldn't find any quests matching your filters. Try adjusting your search or create a new one.
            </p>
            <Link
                href="/admin/manage-quests/create"
                className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium shadow-sm transition-all gap-2"
            >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Create Quest
            </Link>
        </div>
    );
}

