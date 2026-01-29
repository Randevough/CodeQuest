'use client';

import Image from 'next/image';
import { useState } from 'react';
import { SubmissionReviewModal } from '@/components/admin/submissions/SubmissionReviewModal';

export default function SubmissionQueuePage() {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const handleOpenReview = () => {
        setIsReviewModalOpen(true);
    };

    const handleCloseReview = () => {
        setIsReviewModalOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark relative font-sans">
            <SubmissionReviewModal
                isOpen={isReviewModalOpen}
                onClose={handleCloseReview}
            />
            <header className="h-16 flex-shrink-0 border-b border-border-light dark:border-border-dark flex items-center justify-between px-8 bg-white dark:bg-surface-dark z-10">
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Submission Queue</h1>
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
                            />
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            <button className="px-4 py-1.5 bg-white dark:bg-surface-dark shadow-sm rounded-lg text-xs font-medium text-slate-900 dark:text-white transition-all">All</button>
                            <button className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Pending</button>
                            <button className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Reviewed</button>
                            <button className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Accepted</button>
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
                                    <th className="py-4 px-6 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[5%] text-center">Repo</th>
                                    <th className="py-4 px-6 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[15%] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                {/* Row 1 - Pending */}
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    alt="Alex"
                                                    width={36}
                                                    height={36}
                                                    className="rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKmOjXGJHCwTp7NPnQlF4pOilC9RIvGEgT-4XYW_U3a1gqePw2bogfHlkflOgFDDzW_TfwF7gRX5yW944WY-BwA-mRtXWg0CYquSava-C5RcO_qa_dT80GjeNxok6d1CFfSJZuV4PDb_DbD04OuUcj8rJKwd9CO0Atfxeomho-jUdwhn-Al7v8z-JmKx0N5YChyr0t1IL-zmTbfMm4dSShAJHZLlWB1cI6sx6E7VQgzC0JQiTfyXdJl1r3nXT_csW6tmxRbyb1i946"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Alex Johnson</span>
                                                    <span className="text-xs text-slate-500">alex.j@example.com</span>
                                                </div>
                                            </div>
                                            <div className="hidden xl:flex -space-x-2">
                                                <Image alt="" width={24} height={24} className="rounded-full ring-2 ring-white dark:ring-surface-dark bg-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeQXoQNSTdFPsyahwYg9aRbnH2lpTSRZu8KMsUKRIE8tDepyasaLodtLgAGHHaMs6vq1YZAPNMX_UgOQtaZFjmq1HkFQVCai84QCg_N8Q_QTQRllngWtLUbbUwbzG5hxsjY_M4zZi-7s62MIp_13dV4DO4eE9EsVJoolbaCcNA7_PNhYukx4OyFt0hDVIU3M_0eRhyqhuifT8By0X2yrp468JziLFixH8dwkeeRo822m3lOyTFrXwTVua5E5nPx7ddIOv_kGAs7Ufj" />
                                                <Image alt="" width={24} height={24} className="rounded-full ring-2 ring-white dark:ring-surface-dark bg-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt0JKK42Fp1bw1kMEUZqEVGCAZHYQrBR_wmCoLDfmXzciW5M3Jq7QtvdkcIe75ItoyiRo1iCYIabsLLRdK0xXijZS11RPex_4Z1iwhsxxgj5fqNxYeJ7jQloyEnxhNpVyKR2Q4u6sbuJ8plhFAQ64oc4pVaIpiKp2VhBRRd1tMU15RDwK3vSJDN4vqiO8AvlxEbOopTQx5LycBjQYM4sTs4gfR_L7kwVkQshMGbbKqjIv2J4csuPhZYPVkHpHA_P-uWDC-sCVVkVpQ" />
                                                <div className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">+1</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">React Kanban Board</span>
                                            <span className="text-[11px] text-slate-500 font-mono mt-0.5">Q-8821</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50">
                                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                                            <span className="text-xs font-medium">Pending</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-500">2h ago</td>
                                    <td className="py-4 px-6 text-center">
                                        <a href="#" className="inline-flex text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                        </a>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={handleOpenReview}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white rounded-lg shadow-sm text-xs font-bold hover:bg-orange-700 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                Review
                                            </button>
                                            <div className="flex items-center gap-1">
                                                <button className="text-slate-400 hover:text-emerald-600 transition-colors p-1" title="Approve">
                                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                </button>
                                                <button className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Reject">
                                                    <span className="material-symbols-outlined text-[20px]">cancel</span>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                {/* Row 2 - Revision Needed */}
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    alt="Sarah"
                                                    width={36}
                                                    height={36}
                                                    className="rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeQXoQNSTdFPsyahwYg9aRbnH2lpTSRZu8KMsUKRIE8tDepyasaLodtLgAGHHaMs6vq1YZAPNMX_UgOQtaZFjmq1HkFQVCai84QCg_N8Q_QTQRllngWtLUbbUwbzG5hxsjY_M4zZi-7s62MIp_13dV4DO4eE9EsVJoolbaCcNA7_PNhYukx4OyFt0hDVIU3M_0eRhyqhuifT8By0X2yrp468JziLFixH8dwkeeRo822m3lOyTFrXwTVua5E5nPx7ddIOv_kGAs7Ufj"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Sarah Smith</span>
                                                    <span className="text-xs text-slate-500">sarah.s@codequest.io</span>
                                                </div>
                                            </div>
                                            <div className="hidden xl:flex -space-x-2">
                                                <Image alt="" width={24} height={24} className="rounded-full ring-2 ring-white dark:ring-surface-dark bg-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0xdceMkZzsQbup9gC81ZpedOmj-yjEPJVj5vfRfyiTEM3_DZaH30EwGQN1E5CZ4OPgBJvLxD1lyjlL4ECUi-bb8_t9VKR08hDr6UazgOXL-yZQQ8Fc2_ztc2Fw7tTVnVj8LU-bMdrLc6TcEA9kuyllHXIW1s-Q6xUYMfNEnvnvx4HkIPv8OfZlEURdgyBT_FShlraFUZBHXpFDC9BZh7QbdgCJSvu3AoEYp5yVCDCwrGegflEtlNsyTmqgWgGWZVEvLCMC3bLnTVr" />
                                                <Image alt="" width={24} height={24} className="rounded-full ring-2 ring-white dark:ring-surface-dark bg-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1IuECnbyjKJ2jzX-WfM1Fzf2k8tCRjntChku8b55mmckfezH53tlJiqV8Cz-9R1OGinrkxnyJ4suk5HfV46uy2P7kfDgRFMrJMXogUr8yZ1Hcu4Cuk0jCUu2b9J4EK4M4Qc-urGwIBTvEKJTSSLHB4gWoAFJxPXDu2qguEiOxsbX6O7AkGp-WCtXXIitw1Xcnkhto5onNQHlZL3xGjRREJqYaNK1dcJIdxdPSyu_QPeO9CPkobvOWz75LM25I8ziNjLxA8bYhgU1Z" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">API Rate Limiter</span>
                                            <span className="text-[11px] text-slate-500 font-mono mt-0.5">Q-7734</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">
                                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                                            <span className="text-xs font-medium">Revision Needed</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-500">5h ago</td>
                                    <td className="py-4 px-6 text-center">
                                        <a href="#" className="inline-flex text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                        </a>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white rounded-lg shadow-sm text-xs font-bold hover:bg-orange-700 transition-all">
                                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                Review
                                            </button>
                                            <div className="flex items-center gap-1">
                                                <button className="text-slate-400 hover:text-emerald-600 transition-colors p-1" title="Approve">
                                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                </button>
                                                <button className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Reject">
                                                    <span className="material-symbols-outlined text-[20px]">cancel</span>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                {/* Row 3 - Accepted (New) */}
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    alt="David"
                                                    width={36}
                                                    height={36}
                                                    className="rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt0JKK42Fp1bw1kMEUZqEVGCAZHYQrBR_wmCoLDfmXzciW5M3Jq7QtvdkcIe75ItoyiRo1iCYIabsLLRdK0xXijZS11RPex_4Z1iwhsxxgj5fqNxYeJ7jQloyEnxhNpVyKR2Q4u6sbuJ8plhFAQ64oc4pVaIpiKp2VhBRRd1tMU15RDwK3vSJDN4vqiO8AvlxEbOopTQx5LycBjQYM4sTs4gfR_L7kwVkQshMGbbKqjIv2J4csuPhZYPVkHpHA_P-uWDC-sCVVkVpQ"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">David Chen</span>
                                                    <span className="text-xs text-slate-500">david.c@university.edu</span>
                                                </div>
                                            </div>
                                            <div className="hidden xl:flex -space-x-2">
                                                <Image alt="" width={24} height={24} className="rounded-full ring-2 ring-white dark:ring-surface-dark bg-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKmOjXGJHCwTp7NPnQlF4pOilC9RIvGEgT-4XYW_U3a1gqePw2bogfHlkflOgFDDzW_TfwF7gRX5yW944WY-BwA-mRtXWg0CYquSava-C5RcO_qa_dT80GjeNxok6d1CFfSJZuV4PDb_DbD04OuUcj8rJKwd9CO0Atfxeomho-jUdwhn-Al7v8z-JmKx0N5YChyr0t1IL-zmTbfMm4dSShAJHZLlWB1cI6sx6E7VQgzC0JQiTfyXdJl1r3nXT_csW6tmxRbyb1i946" />
                                                <Image alt="" width={24} height={24} className="rounded-full ring-2 ring-white dark:ring-surface-dark bg-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0xdceMkZzsQbup9gC81ZpedOmj-yjEPJVj5vfRfyiTEM3_DZaH30EwGQN1E5CZ4OPgBJvLxD1lyjlL4ECUi-bb8_t9VKR08hDr6UazgOXL-yZQQ8Fc2_ztc2Fw7tTVnVj8LU-bMdrLc6TcEA9kuyllHXIW1s-Q6xUYMfNEnvnvx4HkIPv8OfZlEURdgyBT_FShlraFUZBHXpFDC9BZh7QbdgCJSvu3AoEYp5yVCDCwrGegflEtlNsyTmqgWgGWZVEvLCMC3bLnTVr" />
                                                <div className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">+3</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">Landing Page CSS</span>
                                            <span className="text-[11px] text-slate-500 font-mono mt-0.5">Q-1029</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                            <span className="text-xs font-medium">Accepted</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-500">Yesterday</td>
                                    <td className="py-4 px-6 text-center">
                                        <a href="#" className="inline-flex text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                        </a>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white rounded-lg shadow-sm text-xs font-bold hover:bg-orange-700 transition-all">
                                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                Review
                                            </button>
                                            <div className="flex items-center gap-1">
                                                <button className="text-slate-400 hover:text-emerald-600 transition-colors p-1" title="Approve">
                                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                </button>
                                                <button className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Reject">
                                                    <span className="material-symbols-outlined text-[20px]">cancel</span>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between py-2">
                        <p className="text-xs text-slate-500">
                            Showing <span className="font-medium text-slate-900 dark:text-white">1-5</span> of <span className="font-medium text-slate-900 dark:text-white">12</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 rounded-md border border-border-light dark:border-border-dark text-xs font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" disabled>Previous</button>
                            <button className="px-3 py-1.5 rounded-md border border-border-light dark:border-border-dark text-xs font-medium text-slate-900 dark:text-white bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
