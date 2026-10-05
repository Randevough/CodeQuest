'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { SubmissionReviewModal } from '@/components/admin/submissions/SubmissionReviewModal';
import { getSubmissions, type SubmissionItem } from '@/actions/submission';
import { Pagination } from '@/components/Pagination';
import { MobileSidebarTrigger } from '@/components/admin/MobileSidebarTrigger';

export default function SubmissionQueuePage() {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedSnatchId, setSelectedSnatchId] = useState<string | null>(null);

    // Data State
    const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

    // Filter State
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery] = useDebounce(searchQuery, 400);

    const fetchData = useCallback(async (page: number, status: string, query: string) => {
        setLoading(true);
        try {
            const res = await getSubmissions({
                page,
                status,
                query
            });
            if (res.success && res.data) {
                setSubmissions(res.data);
                setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(pagination.page, filterStatus, debouncedQuery);
    }, [fetchData, pagination.page, filterStatus, debouncedQuery]);

    const handleOpenReview = (snatchId: string) => {
        setSelectedSnatchId(snatchId);
        setIsReviewModalOpen(true);
    };

    const handleCloseReview = () => {
        setIsReviewModalOpen(false);
        setSelectedSnatchId(null);
        fetchData(pagination.page, filterStatus, searchQuery); // Refresh list after review
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const selectedSnatch = submissions.find(s => s.id === selectedSnatchId);

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0a0a0a] relative font-['Plus_Jakarta_Sans']">
            <SubmissionReviewModal
                isOpen={isReviewModalOpen}
                onClose={handleCloseReview}
                snatch={selectedSnatch}
            />
            <header className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-border-dark flex items-center justify-between px-4 sm:px-8 bg-white dark:bg-surface-dark z-10">
                <div className="flex items-center gap-4 transition-all">
                    <MobileSidebarTrigger className="md:hidden" />
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Submission Queue</h1>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="mx-auto max-w-6xl flex flex-col gap-6">
                    {/* Filters and Search */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:max-w-xs group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </span>
                            <input
                                className="w-full h-10 pl-10 pr-4 rounded bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-500 placeholder:text-slate-400 transition-all shadow-sm"
                                placeholder="Search student or quest..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-slate-100 dark:bg-white/10 p-1 rounded-lg">
                            {['All', 'Pending', 'Revision', 'Accepted'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setFilterStatus(status);
                                        setPagination(prev => ({ ...prev, page: 1 }));
                                    }}
                                    className={`px-4 py-1.5 rounded-md text-xs transition-all ${filterStatus === status
                                        ? 'bg-white dark:bg-surface-dark shadow-sm text-slate-900 dark:text-white font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px] text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-border-dark bg-slate-50/50 dark:bg-white/5">
                                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-[30%]">SUBMITTER</th>
                                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Quest</th>
                                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Status</th>
                                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Submitted</th>
                                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-[5%] text-center">Link</th>
                                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-slate-500">Loading submissions...</td>
                                        </tr>
                                    ) : submissions.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-slate-500">No submissions found.</td>
                                        </tr>
                                    ) : (
                                        submissions.map((snatch) => (
                                            <tr key={snatch.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-10 h-10 flex-shrink-0">
                                                                {snatch.user.avatar ? (
                                                                    <Image
                                                                        alt={snatch.user.name || 'User'}
                                                                        fill
                                                                        className="rounded-full object-cover border border-slate-200 dark:border-border-dark"
                                                                        src={snatch.user.avatar}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-border-dark">
                                                                        {snatch.user.name?.charAt(0) || '?'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{snatch.user.name}</span>
                                                                <span className="text-xs text-slate-500">{snatch.user.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{snatch.quest.title}</span>
                                                        <span className="text-[11px] text-slate-500 font-mono mt-0.5">#{snatch.quest.id.slice(0, 10)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <StatusBadge status={snatch.status} />
                                                </td>
                                                <td className="py-4 px-6 text-sm text-slate-500 font-medium">
                                                    {new Date(snatch.updatedAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    {snatch.submissionUrl ? (
                                                        <a href={snatch.submissionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex text-slate-400 hover:text-orange-600 transition-colors">
                                                            <span className="material-symbols-outlined text-[20px]">link</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button
                                                            onClick={() => handleOpenReview(snatch.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg shadow-sm text-xs font-bold hover:bg-orange-600 transition-all"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                            Review
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="border-t border-slate-200 dark:border-border-dark px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 dark:bg-white/5 gap-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Showing <span className="font-bold text-slate-900 dark:text-slate-100">{pagination.total === 0 ? 0 : (pagination.page - 1) * 10 + 1}</span> to <span className="font-bold text-slate-900 dark:text-slate-100">{Math.min(pagination.page * 10, pagination.total)}</span> of <span className="font-bold text-slate-900 dark:text-slate-100">{pagination.total}</span> results
                            </p>
                            <div className="mt-0">
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'ACCEPTED') {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-medium">Accepted</span>
            </div>
        );
    } else if (status === 'REJECTED') {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                <span className="text-xs font-medium">Rejected</span>
            </div>
        );
    } else if (status === 'REVISION_NEEDED') {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                <span className="text-xs font-medium">Revision</span>
            </div>
        );
    } else {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-border-dark">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                <span className="text-xs font-medium">Pending</span>
            </div>
        );
    }
}
