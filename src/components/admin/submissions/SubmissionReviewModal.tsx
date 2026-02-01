import { useState } from 'react';
import Image from 'next/image';
import PointsIcon from '@/app/icon.png';
import { reviewSubmission } from '@/actions/submission';
import { toast } from 'sonner';

interface SubmissionReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    snatch?: any; // Using any to avoid complex type imports, ideally SnatchWithRelations
}

export function SubmissionReviewModal({ isOpen, onClose, snatch }: SubmissionReviewModalProps) {
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !snatch) return null;

    const handleAction = async (status: 'ACCEPTED' | 'REJECTED' | 'REVISION_NEEDED') => {
        if (status === 'REVISION_NEEDED' && !feedback.trim()) {
            toast.error('Please provide a reason for the revision.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await reviewSubmission(snatch.id, status, feedback);
            if (res.success) {
                onClose();
                setFeedback(''); // Reset feedback
                toast.success('Submission updated successfully');
            } else {
                toast.error('Failed to update submission');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <p className="text-xs text-slate-500 dark:text-slate-400">{snatch.user.name} • {snatch.quest.title} (#{snatch.quest.id.slice(0, 4)})</p>
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
                                        <div className="flex items-center gap-3 mb-5">
                                            {snatch.user.avatar ? (
                                                <Image
                                                    alt={snatch.user.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full ring-1 ring-slate-200 dark:ring-slate-700 object-cover"
                                                    src={snatch.user.avatar}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                                    {snatch.user.name?.charAt(0) || '?'}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{snatch.user.name}</span>
                                                <span className="text-xs text-slate-500">{snatch.user.email}</span>
                                            </div>
                                        </div>

                                        {snatch.submissionUrl ? (
                                            <a
                                                className="flex items-center justify-center gap-2.5 px-5 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-all shadow-sm w-full group"
                                                href={snatch.submissionUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                                View Submission Link
                                            </a>
                                        ) : (
                                            <div className="text-center py-4 text-slate-500 text-sm italic">
                                                No URL provided
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                            <section>
                                <label className="block text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest" htmlFor="feedback">Admin Feedback</label>
                                <div className="relative">
                                    <textarea
                                        className="w-full rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none font-mono p-4 outline-none"
                                        id="feedback"
                                        placeholder="Provide detailed review notes (optional for acceptance, required for revision)..."
                                        rows={8}
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="md:col-span-5 flex flex-col gap-6">
                            <section className="h-full">
                                <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Quest Reference</h3>
                                <div className="border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-surface-dark overflow-hidden flex flex-col h-full shadow-sm">
                                    <div className="p-6 flex flex-col gap-4 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
                                        <div className="flex justify-between items-start gap-4">
                                            <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{snatch.quest.title}</h4>
                                            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full text-[11px] font-extrabold border border-amber-200 dark:border-amber-800/50 flex items-center gap-1.5 whitespace-nowrap shadow-sm">
                                                <Image src={PointsIcon} alt="Points" width={14} height={14} className="object-contain" />
                                                {snatch.quest.points} pts
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-4">{snatch.quest.description || 'No description available.'}</p>
                                    </div>
                                    <div className="p-6 space-y-6 bg-slate-50/30 dark:bg-slate-800/20 flex-1">
                                        <div>
                                            {/* Static requirements for demo, or real if we had them */}
                                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quest ID</h5>
                                            <p className="text-xs font-mono text-slate-500">{snatch.quest.id}</p>
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
                        onClick={() => handleAction('REVISION_NEEDED')}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Updating...' : 'Request Revision'}
                    </button>
                    <button
                        onClick={() => handleAction('ACCEPTED')}
                        disabled={isSubmitting}
                        className="px-8 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Updating...' : 'Accept & Grant Points'}
                    </button>
                </div>
            </div>
        </div>
    );
}
