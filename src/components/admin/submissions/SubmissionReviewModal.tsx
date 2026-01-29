'use client';

import Image from 'next/image';

interface SubmissionReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SubmissionReviewModal({ isOpen, onClose }: SubmissionReviewModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="bg-white dark:bg-surface-dark w-full max-w-4xl rounded-xl shadow-2xl border border-border-light dark:border-border-dark flex flex-col max-h-[90vh] overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border-light dark:border-border-dark">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Review Submission</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Alex Johnson • React Kanban Board (Q-8821)</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        {/* Left Column */}
                        <div className="md:col-span-7 flex flex-col gap-8">
                            <section>
                                <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Submission Content</h3>
                                <div className="p-5 border border-border-light dark:border-border-dark rounded-lg bg-slate-50/50 dark:bg-slate-800/20 flex flex-col">
                                    <div className="w-full">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Squad Members</span>
                                        <div className="flex flex-col gap-3 mb-5">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    alt="Alex"
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full ring-1 ring-slate-200 dark:ring-slate-700 object-cover"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKmOjXGJHCwTp7NPnQlF4pOilC9RIvGEgT-4XYW_U3a1gqePw2bogfHlkflOgFDDzW_TfwF7gRX5yW944WY-BwA-mRtXWg0CYquSava-C5RcO_qa_dT80GjeNxok6d1CFfSJZuV4PDb_DbD04OuUcj8rJKwd9CO0Atfxeomho-jUdwhn-Al7v8z-JmKx0N5YChyr0t1IL-zmTbfMm4dSShAJHZLlWB1cI6sx6E7VQgzC0JQiTfyXdJl1r3nXT_csW6tmxRbyb1i946"
                                                />
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Alex Johnson</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    alt="Squad member 1"
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full ring-1 ring-slate-200 dark:ring-slate-700 object-cover"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeQXoQNSTdFPsyahwYg9aRbnH2lpTSRZu8KMsUKRIE8tDepyasaLodtLgAGHHaMs6vq1YZAPNMX_UgOQtaZFjmq1HkFQVCai84QCg_N8Q_QTQRllngWtLUbbUwbzG5hxsjY_M4zZi-7s62MIp_13dV4DO4eE9EsVJoolbaCcNA7_PNhYukx4OyFt0hDVIU3M_0eRhyqhuifT8By0X2yrp468JziLFixH8dwkeeRo822m3lOyTFrXwTVua5E5nPx7ddIOv_kGAs7Ufj"
                                                />
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Sarah Chen</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    alt="Squad member 2"
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full ring-1 ring-slate-200 dark:ring-slate-700 object-cover"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt0JKK42Fp1bw1kMEUZqEVGCAZHYQrBR_wmCoLDfmXzciW5M3Jq7QtvdkcIe75ItoyiRo1iCYIabsLLRdK0xXijZS11RPex_4Z1iwhsxxgj5fqNxYeJ7jQloyEnxhNpVyKR2Q4u6sbuJ8plhFAQ64oc4pVaIpiKp2VhBRRd1tMU15RDwK3vSJDN4vqiO8AvlxEbOopTQx5LycBjQYM4sTs4gfR_L7kwVkQshMGbbKqjIv2J4csuPhZYPVkHpHA_P-uWDC-sCVVkVpQ"
                                                />
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Michael Ross</span>
                                            </div>
                                        </div>
                                        <a className="flex items-center justify-center gap-2.5 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm w-full group" href="#">
                                            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                            View GitHub Repository
                                        </a>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <label className="block text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest" htmlFor="feedback">Admin Feedback</label>
                                <div className="relative">
                                    <textarea
                                        className="w-full rounded-lg border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none font-mono p-4"
                                        id="feedback"
                                        placeholder="Provide detailed review notes..."
                                        rows={8}
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="md:col-span-5 flex flex-col gap-6">
                            <section className="h-full">
                                <h3 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">Quest Reference</h3>
                                <div className="border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-surface-dark overflow-hidden flex flex-col h-full shadow-sm">
                                    <div className="p-6 flex flex-col gap-4 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
                                        <div className="flex justify-between items-start gap-4">
                                            <h4 className="font-bold text-slate-900 dark:text-white leading-tight">React Kanban Board</h4>
                                            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full text-[11px] font-extrabold border border-amber-200 dark:border-amber-800/50 flex items-center gap-1.5 whitespace-nowrap shadow-sm">
                                                ✨ 450 pts
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Build a fully functional Kanban board using React with drag and drop capabilities.</p>
                                    </div>
                                    <div className="p-6 space-y-6 bg-slate-50/30 dark:bg-slate-800/20 flex-1">
                                        <div>
                                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Technical Requirements</h5>
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
                                                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                                                    <span className="pt-0.5">Drag and drop between columns</span>
                                                </li>
                                                <li className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
                                                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                                                    <span className="pt-0.5">Persist data in local storage</span>
                                                </li>
                                                <li className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
                                                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                                                    <span className="pt-0.5">Responsive layout (Desktop & Tablet)</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-border-light dark:border-border-dark flex items-center justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                        Request Revision
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        Accept & Grant Points
                    </button>
                </div>
            </div>
        </div>
    );
}
