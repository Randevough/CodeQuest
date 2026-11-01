import Link from 'next/link';
import Image from 'next/image';
import { MobileSidebarTrigger } from '@/components/admin/MobileSidebarTrigger';
import { Pagination } from '@/components/Pagination';
import { QuestFilters } from '@/components/admin/QuestFilters';
import { QuestActions } from './QuestActions';
import { getQuests } from '@/actions/quest';
import { Plus, Users, SearchX } from 'lucide-react';

interface ManageQuestsPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
        q?: string;
    }>;
}

export default async function ManageQuestsPage({ searchParams }: ManageQuestsPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const status = params.status || 'All';
    const query = params.q || '';

    // TODO: Update getQuests to support sorting by updatedAt desc
    const { data: quests, pagination } = await getQuests({
        page,
        limit: 10,
        search: query,
        status,
        includeFull: true,
    });

    const hasQuests = quests && quests.length > 0;

    return (
        <div className="min-w-0 flex flex-col h-full bg-surface relative font-sans">
            {/* Header */}
            <header className="min-h-16 py-3 gap-3 flex-wrap flex-shrink-0 border-b border-border flex items-center justify-between px-4 sm:px-4 sm:px-6 lg:px-8 bg-surface z-10">
                <div className="flex items-center gap-4">
                    <MobileSidebarTrigger className="md:hidden" />
                    <h1 className="text-2xl sm:text-3xl text-foreground">Manage Quests</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/manage-quests/create"
                        className="flex items-center justify-center min-h-11 px-4 rounded-button bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-medium shadow-sm transition-all focus:ring-2 focus:ring-control-border focus:outline-none gap-2"
                    >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        Create New Quest
                    </Link>
                </div>
            </header>

            {/* Content */}
            <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-content flex flex-col gap-6">
                    {/* Filters */}
                    <QuestFilters />

                    {/* Table */}
                    <div className="bg-surface border border-border rounded-card shadow-sm min-w-0 min-h-[400px]">
                        <div className="max-w-full overflow-x-auto styled-scrollbar" role="region" aria-label="Quests table" tabIndex={0}>
                        <table className="min-w-[900px] w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface border-b border-border text-xs uppercase text-muted font-medium tracking-wider">
                                    <th className="px-6 py-3 w-[35%]">Quest</th>
                                    <th className="px-6 py-3">Category & Difficulty</th>
                                    <th className="px-6 py-3 text-center">Points</th>
                                    <th className="px-6 py-3 text-center">Applicants</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {!hasQuests ? (
                                    <tr>
                                        <td colSpan={6}>
                                            <EmptyState />
                                        </td>
                                    </tr>
                                ) : (
                                    quests.map((quest) => (
                                        <tr key={quest.id} className="hover:bg-surface transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground text-sm break-words">{quest.title}</span>
                                                    <span className="text-[11px] text-muted font-mono mt-0.5">{quest.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-surface-raised text-muted border border-border">
                                                        {quest.category}
                                                    </span>
                                                    <DifficultyBadge difficulty={quest.difficulty} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center justify-center gap-1.5 font-bold text-foreground">
                                                    <span>{quest.points}</span>
                                                    <Image src="/icon.png" alt="XP" width={20} height={20} className="object-contain" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center justify-center gap-1.5 text-muted">
                                                    <Users className="w-4 h-4 text-muted" aria-hidden="true" />
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
                        </div>

                        {/* Pagination Footer */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex flex-col gap-4 sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-border bg-surface [&>*]:min-w-0 [&>*]:max-w-full">
                                <span className="text-sm text-muted">Showing {Math.min(pagination.totalItems, (pagination.currentPage - 1) * 10 + 1)}-{Math.min(pagination.totalItems, pagination.currentPage * 10)} of {pagination.totalItems} quests</span>
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
        displayClass = "   text-warning font-bold shadow-md  ring-1 ring-inset ring-control-border border-0";
    } else if (d === 'beginner') {
        displayClass = "bg-surface  text-success  border border-border ";
    } else if (d === 'intermediate') {
        displayClass = "bg-surface  text-info  border border-border ";
    } else if (d === 'advanced' || d === 'advance') {
        displayClass = "bg-surface  text-danger  border border-border ";
    } else {
        displayClass = "bg-surface  text-muted  border border-border ";
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
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-surface text-success border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-surface"></span>
                Active
            </span>
        );
    } else if (s === 'draft') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-surface text-warning border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-surface"></span>
                Draft
            </span>
        );
    } else if (s === 'closed') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-surface text-danger border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-surface"></span>
                Closed
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-surface text-foreground border border-border">
            {status}
        </span>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-surface-raised rounded-full flex items-center justify-center mb-4">
                <SearchX className="w-8 h-8 text-muted" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No quests found</h3>
            <p className="text-muted text-sm max-w-xs mb-6">
                We couldn&apos;t find any quests matching your filters. Try adjusting your search or create a new one.
            </p>
            <Link
                href="/admin/manage-quests/create"
                className="inline-flex items-center justify-center min-h-11 px-4 rounded-button bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-medium shadow-sm transition-all gap-2"
            >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Create Quest
            </Link>
        </div>
    );
}