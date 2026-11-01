'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { SubmissionReviewModal } from '@/components/admin/submissions/SubmissionReviewModal';
import { getSubmissions, type SubmissionItem } from '@/actions/submission';
import { Pagination } from '@/components/Pagination';
import { MobileSidebarTrigger } from '@/components/admin/MobileSidebarTrigger';

export default function SubmissionQueuePage() {
    const queueHeadingRef = useRef<HTMLHeadingElement>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedSnatchId, setSelectedSnatchId] = useState<string | null>(null);

    // Data State
    const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
    const [loadError, setLoadError] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

    // Filter State
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setLoadError('');
        try {
            const res = await getSubmissions({
                page: pagination.page,
                status: filterStatus,
                query: searchQuery
            });
            if (res.success && res.data) {
                setSubmissions(res.data);
                setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
            } else { setLoadError("Submissions could not load. Try again."); }
        } catch (err) {
            setLoadError("Submissions could not load. Try again.");
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
        // Rows may disappear during refresh or after acceptance; heading always survives.
        requestAnimationFrame(() => queueHeadingRef.current?.focus());
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const selectedSnatch = submissions.find(s => s.id === selectedSnatchId);

    return (
        <div className="min-w-0 flex flex-col h-full bg-surface relative font-sans">
            <SubmissionReviewModal
                key={selectedSnatchId}
                isOpen={isReviewModalOpen}
                onClose={handleCloseReview}
                snatch={selectedSnatch}
                onSuccess={() => setReviewMessage("Submission updated successfully.")}
            />
            <header className="min-h-16 py-3 gap-3 flex-wrap flex-shrink-0 border-b border-border flex items-center justify-between px-4 sm:px-4 sm:px-6 lg:px-8 bg-surface z-10">
                <div className="flex items-center gap-4 transition-all">
                    <MobileSidebarTrigger className="md:hidden" />
                    <h1 ref={queueHeadingRef} tabIndex={-1} className="text-2xl sm:text-3xl text-foreground">Submission Queue</h1>
                </div>
            </header>

            <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-content flex flex-col gap-6">
                    {reviewMessage && <p role="status" className="border border-control-border bg-surface p-3 text-success">{reviewMessage}</p>}
                    {loadError && <div role="alert" className="border border-control-border bg-surface p-3 text-danger">{loadError} <button onClick={fetchData} className="underline">Retry</button></div>}
                    {/* Filters and Search */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:max-w-xs group">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-warning pointer-events-none flex items-center justify-center transition-colors">
                                <span aria-hidden="true" className="material-symbols-outlined text-[20px]">search</span>
                            </span>
                            <input
                                className="w-full h-10 pl-11 pr-4 rounded-[var(--radius-input)] bg-surface border border-control-border text-sm focus:outline-none focus:ring-2 focus:ring-focus/30 focus:border-focus hover:border-border placeholder:text-muted transition-all shadow-sm"
                                aria-label="Search student or quest"
                                placeholder="Search student or quest..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap bg-surface-raised p-1 rounded-card">
                            {['All', 'Pending', 'Revision', 'Accepted'].map((status) => (
                                <button
                                    key={status}
                                    aria-pressed={filterStatus === status}
                                    onClick={() => {
                                        setFilterStatus(status);
                                        setPagination(prev => ({ ...prev, page: 1 }));
                                    }}
                                    className={`px-4 py-1.5 rounded-md text-xs transition-all ${filterStatus === status
                                        ? 'bg-surface  shadow-sm text-foreground  font-bold'
                                        : 'text-muted  hover:text-foreground  font-medium'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-surface border border-border rounded-card shadow-sm min-w-0 overflow-hidden">
                        <div className="max-w-full overflow-x-auto styled-scrollbar" role="region" aria-label="Submissions table" tabIndex={0}>
                            <table className="w-full min-w-[1000px] text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border bg-surface">
                                        <th className="py-3 px-6 text-xs font-bold text-muted uppercase tracking-wider w-[30%]">SUBMITTER</th>
                                        <th className="py-3 px-6 text-xs font-bold text-muted uppercase tracking-wider w-[20%]">Quest</th>
                                        <th className="py-3 px-6 text-xs font-bold text-muted uppercase tracking-wider w-[15%]">Status</th>
                                        <th className="py-3 px-6 text-xs font-bold text-muted uppercase tracking-wider w-[15%]">Submitted</th>
                                        <th className="py-3 px-6 text-xs font-bold text-muted uppercase tracking-wider w-[5%] text-center">Link</th>
                                        <th className="py-3 px-6 text-xs font-bold text-muted uppercase tracking-wider w-[15%] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-muted">Loading submissions...</td>
                                        </tr>
                                    ) : loadError ? (<tr><td colSpan={6} className="py-8 text-center text-danger">Submission data unavailable. Retry loading above.</td></tr>) : submissions.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-muted">No submissions found.</td>
                                        </tr>
                                    ) : (
                                        submissions.map((snatch) => (
                                            <tr key={snatch.id} className="hover:bg-surface transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-10 h-10 flex-shrink-0">
                                                                {snatch.user.avatar ? (
                                                                    <Image
                                                                        alt={snatch.user.name || 'User'}
                                                                        fill
                                                                        className="rounded-full object-cover border border-border"
                                                                        src={snatch.user.avatar}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full rounded-full bg-surface-raised flex items-center justify-center text-xs font-bold text-muted border border-border">
                                                                        {snatch.user.name?.charAt(0) || '?'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-foreground">{snatch.user.name}</span>
                                                                <span className="text-xs text-muted">{snatch.user.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-foreground">{snatch.quest.title}</span>
                                                        <span className="text-[11px] text-muted font-mono mt-0.5">#{snatch.quest.id.slice(0, 10)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <StatusBadge status={snatch.status} />
                                                </td>
                                                <td className="py-4 px-6 text-sm text-muted font-medium">
                                                    {new Date(snatch.updatedAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    {snatch.submissionUrl ? (
                                                        <a aria-label={`Open submission for ${snatch.quest.title}`} href={snatch.submissionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted hover:text-warning transition-colors">
                                                            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">link</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button
                                                            onClick={() => handleOpenReview(snatch.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-card shadow-sm text-xs font-bold hover:bg-secondary transition-all text-secondary-foreground"
                                                        >
                                                            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">visibility</span>
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
                        <div className="border-t border-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-surface gap-4">
                            <p className="text-sm text-muted">
                                Showing <span className="font-bold text-foreground">{pagination.total === 0 ? 0 : (pagination.page - 1) * 10 + 1}</span> to <span className="font-bold text-foreground">{Math.min(pagination.page * 10, pagination.total)}</span> of <span className="font-bold text-foreground">{pagination.total}</span> results
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface text-success border border-border">
                <span className="h-1.5 w-1.5 rounded-full bg-surface"></span>
                <span className="text-xs font-medium">Accepted</span>
            </div>
        );
    } else if (status === 'REJECTED') {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface text-danger border border-border">
                <span className="h-1.5 w-1.5 rounded-full bg-surface"></span>
                <span className="text-xs font-medium">Rejected</span>
            </div>
        );
    } else if (status === 'REVISION_NEEDED') {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface text-warning border border-border">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary text-secondary-foreground"></span>
                <span className="text-xs font-medium">Revision</span>
            </div>
        );
    } else {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface text-muted border border-border">
                <span className="h-1.5 w-1.5 rounded-full bg-surface"></span>
                <span className="text-xs font-medium">Pending</span>
            </div>
        );
    }
}