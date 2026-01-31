'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MobileSidebarTrigger } from '@/components/admin/MobileSidebarTrigger';
import { Pagination } from '@/components/Pagination';

// Mock Data
const MOCK_QUESTS = [
    {
        id: 'Q-8921',
        title: 'Build a Responsive Dashboard',
        category: 'Web Development',
        difficulty: 'Beginner',
        applicants: 5,
        targetApplicants: 10,
        status: 'Active',
    },
    {
        id: 'Q-8922',
        title: 'AI Chatbot Integration',
        category: 'AI / ML',
        difficulty: 'Advanced',
        applicants: 0,
        targetApplicants: 5,
        status: 'Draft',
    },
    {
        id: 'Q-8805',
        title: 'Mobile E-commerce UI Kit',
        category: 'Mobile',
        difficulty: 'Intermediate',
        applicants: 15,
        targetApplicants: 15,
        status: 'Closed',
    },
    {
        id: 'Q-8910',
        title: 'React Components Library',
        category: 'Web Development',
        difficulty: 'Intermediate',
        applicants: 8,
        targetApplicants: 10,
        status: 'Active',
    },
    {
        id: 'Q-8925',
        title: 'NLP Sentiment Analysis Model',
        category: 'AI / ML',
        difficulty: 'Advanced',
        applicants: 0,
        targetApplicants: 8,
        status: 'Draft',
    },
];

export default function ManageQuestsPage() {
    // State
    const [filterStatus, setFilterStatus] = useState('Active');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter Logic (Mock)
    const filteredQuests = MOCK_QUESTS.filter(quest => {
        const matchesStatus = filterStatus === 'All' || quest.status === filterStatus; // Note: Design has 'Active', 'Draft', 'Closed' tabs, but usually 'All' is implicit or separate. The design shows tabs for Active/Draft/Closed. Let's stick to the tabs.
        const matchesSearch = quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            quest.id.toLowerCase().includes(searchQuery.toLowerCase());

        // Adjust for the specific tab behavior in the design (Active, Draft, Closed)
        // If the tabs are mutually exclusive as per design image:
        return matchesStatus && matchesSearch;
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <header className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-white dark:bg-slate-900 z-10">
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:w-80 group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 material-symbols-outlined text-[20px] transition-colors">search</span>
                            <input
                                className="w-full h-9 pl-10 pr-4 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder:text-slate-400 shadow-sm transition-all"
                                placeholder="Search quests..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center bg-white dark:bg-slate-800 rounded-md p-1 border border-slate-200 dark:border-slate-700 shadow-sm h-9">
                                {['Active', 'Draft', 'Closed'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-3 h-full text-xs font-medium rounded transition-colors ${filterStatus === status
                                            ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400 font-medium tracking-wider">
                                    <th className="px-6 py-3 w-[40%]">Quest</th>
                                    <th className="px-6 py-3">Category & Difficulty</th>
                                    <th className="px-6 py-3 text-right">Applicants</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredQuests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-500">No quests found.</td>
                                    </tr>
                                ) : (
                                    filteredQuests.map((quest) => (
                                        <tr key={quest.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">{quest.title}</span>
                                                    <span className="text-xs text-slate-500 font-mono mt-0.5">ID: {quest.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                        {quest.category}
                                                    </span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                        {quest.difficulty}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-mono text-slate-600 dark:text-slate-400">{quest.applicants}/{quest.targetApplicants}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={quest.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-sm text-slate-500">Showing {filteredQuests.length} quests</span>
                            {/* Reusing Pagination Component - passing basic props for now since it's mock data */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={1}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'Active') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Active
            </span>
        );
    } else if (status === 'Draft') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                Draft
            </span>
        );
    } else if (status === 'Closed') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Closed
            </span>
        );
    }
    return null;
}
