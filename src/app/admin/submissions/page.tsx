'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { SubmissionReviewModal } from '@/components/admin/submissions/SubmissionReviewModal';
import { getSubmissions, seedSubmissions } from '@/actions/submission';
import { Pagination } from '@/components/Pagination';

export default function SubmissionQueuePage() {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedSnatchId, setSelectedSnatchId] = useState<string | null>(null);

    // Data State
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

    // Filter State
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getSubmissions({
                page: pagination.page,
                status: filterStatus,
                query: searchQuery
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
    };

    useEffect(() => {
        fetchData();
    }, [pagination.page, filterStatus]); // Re-fetch on page or filter change

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleOpenReview = (snatchId: string) => {
        setSelectedSnatchId(snatchId);
        setIsReviewModalOpen(true);
    };

    const handleCloseReview = () => {
        setIsReviewModalOpen(false);
        setSelectedSnatchId(null);
        fetchData(); // Refresh list after review
    };

    const handleSeedData = async () => {
        await seedSubmissions();
        fetchData();
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark relative font-sans">
            <SubmissionReviewModal
                isOpen={isReviewModalOpen}
                onClose={handleCloseReview}
            // We'll need to update the Modal to accept an ID or pass the full object if we have it
            // For now, let's assume valid ID is enough or modification needed.
            // Actually, the modal likely takes data. Let's check or update it later.
            // Assuming it takes an ID or we pass props.
            // Checking previous context: it likely takes hardcoded data or no props.
            // We might need to refactor it to take `snatchId`.
            />
            <header className="h-16 flex-shrink-0 border-b border-border-light dark:border-border-dark flex items-center justify-between px-8 bg-white dark:bg-surface-dark z-10">
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Submission Queue</h1>
                <button onClick={handleSeedData} className="text-xs text-orange-500 hover:text-orange-600 underline">
                    Seed Data
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="mx-auto max-w-7xl flex flex-col gap-6">
                    {/* Filters and Search */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:max-w-xs group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </span>
                            <input
                                className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder:text-slate-400 transition-all shadow-sm"
                                placeholder="Search student or quest..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            {['All', 'Pending', 'Reviewed', 'Accepted'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === status
                                            ? 'bg-white dark:bg-surface-dark shadow-sm text-slate-900 dark:text-white'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="border border-border-light dark:border-border-dark rounded-xl overflow-hidden bg-white dark:bg-surface-dark shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800/50">
                                    <th className="py-4 px-6 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[30%]">Student</th>
                                    <th className="py-4 px-6 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[20%]">Quest</th>
                                    <th className="py-4 px-6 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[15%]">Status</th>
                                    <th className="py-4 px-6 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[15%]">Submitted</th>
                                    <th className="py-4 px-6 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[5%] text-center">Link</th>
                                    <th className="py-4 px-6 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[15%] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
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
                                        <tr key={snatch.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        {snatch.user.avatar ? (
                                                            <Image
                                                                alt={snatch.user.name}
                                                                width={36}
                                                                height={36}
                                                                className="rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                                                src={snatch.user.avatar}
                                                            />
                                                        ) : (
                                                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                                                {snatch.user.name?.charAt(0) || '?'}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{snatch.user.name}</span>
                                                            <span className="text-xs text-slate-500">{snatch.user.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{snatch.quest.title}</span>
                                                    <span className="text-[11px] text-slate-500 font-mono mt-0.5">#{snatch.quest.id.slice(0, 4)}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <StatusBadge status={snatch.status} />
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-500">
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

                    {/* Pagination */}
                    <div className="mt-12 flex items-center justify-center">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
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
    } else if (status === 'REJECTED' || status === 'REVISION') {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                <span className="text-xs font-medium">Rejected</span>
            </div>
        );
    } else {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                <span className="text-xs font-medium">Pending</span>
            </div>
        );
    }
}
