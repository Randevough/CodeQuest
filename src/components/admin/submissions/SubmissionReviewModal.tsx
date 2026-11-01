'use client';
import { Dialog } from '@/components/ui/Dialog';
import { useState } from 'react';
import Image from 'next/image';
import { reviewSubmission, type SubmissionItem } from '@/actions/submission';
import { toast } from 'sonner';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { X, User, Users, ExternalLink, Timer, ListChecks, Circle } from 'lucide-react';

interface SubmissionReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    snatch?: SubmissionItem;
    onSuccess?: () => void;
}

export function SubmissionReviewModal({ isOpen, onClose, snatch, onSuccess }: SubmissionReviewModalProps) {
    const [message, setMessage] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !snatch) return null;

    const handleAction = async (status: 'ACCEPTED' | 'REJECTED' | 'REVISION_NEEDED') => {
        if (isSubmitting) return;
        if (status === 'REVISION_NEEDED' && !feedback.trim()) {
            setMessage('Please provide a reason for the revision.'); toast.error('Please provide a reason for the revision.');
            return;
        }

        setMessage('');
        setIsSubmitting(true);
        try {
            const res = await reviewSubmission(snatch.id, status, feedback);
            if (res.success) {
                onSuccess?.();
                onClose();
                setFeedback(''); // Reset feedback
                toast.success('Submission updated successfully');
            } else {
                setMessage('Failed to update submission'); toast.error('Failed to update submission');
            }
        } catch (error) {
            console.error(error);
            setMessage('An error occurred'); toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} title="Review Submission" pending={isSubmitting} className="max-w-4xl">
            <div className="flex flex-col min-w-0">
                {message && <p role="alert" className="mb-4 rounded-input border border-control-border bg-surface p-3 text-danger">{message}</p>}
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                    <div className="flex flex-col">

                        <p className="text-xs text-muted">{snatch.user.name} • {snatch.quest.title} (#{snatch.quest.id.slice(0, 4)})</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close review"
                        className="p-2 text-muted hover:text-muted transition-colors rounded-full hover:bg-surface-raised flex items-center justify-center"
                    >
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Body */}
                <div className="min-w-0 flex-1 overflow-y-auto p-0 sm:p-2">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Left Column */}
                        <div className="md:col-span-7 flex flex-col gap-8">
                            <section>
                                <h3 className="text-xs font-bold text-muted mb-4 uppercase tracking-widest">Submission Content</h3>
                                <div className="p-5 border border-border rounded-card bg-surface flex flex-col">
                                    <div className="w-full">
                                        <h5 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" aria-hidden="true" />
                                            Submitter
                                        </h5>
                                        <div className="flex items-center gap-3 mb-5">
                                            <UserAvatar
                                                src={snatch.user.avatar as string}
                                                name={snatch.user.name}
                                                size={40}
                                                className="size-10 rounded-full border border-border"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-foreground">{snatch.user.name}</span>
                                                <span className="text-xs text-muted">{snatch.user.email}</span>
                                            </div>
                                        </div>

                                        {/* Squad Members */}
                                        {snatch.squad && snatch.squad.snatches && snatch.squad.snatches.length > 0 && (
                                            <div className="mb-5 border-t border-b border-border py-4">
                                                <h5 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                                    <Users className="w-3.5 h-3.5" aria-hidden="true" />
                                                    Squad Members
                                                </h5>
                                                <div className="flex flex-col gap-2">
                                                    {snatch.squad.snatches.map((s) => (
                                                        <div key={s.user.id} className="flex items-center gap-2.5">
                                                            <UserAvatar
                                                                src={s.user.avatar as string}
                                                                name={s.user.name}
                                                                size={24}
                                                                className="size-6 rounded-full border border-border"
                                                            />
                                                            <span className="text-xs font-medium text-foreground">
                                                                {s.user.name}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {snatch.submissionUrl ? (
                                            <a
                                                className="flex items-center justify-center gap-2.5 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-card text-sm font-bold hover:bg-secondary transition-all shadow-sm w-full group text-secondary-foreground"
                                                href={snatch.submissionUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                                                View Submission Link
                                            </a>
                                        ) : (
                                            <div className="text-center py-4 text-muted text-sm italic">
                                                No URL provided
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                            <section>
                                <label className="block text-xs font-bold text-muted mb-4 uppercase tracking-widest" htmlFor="feedback">Admin Feedback</label>
                                <div className="relative">
                                    <textarea
                                        className="w-full rounded-card border border-control-border bg-surface text-foreground text-sm placeholder:text-muted focus:border-control-border focus:ring-1 focus:ring-control-border transition-all resize-none font-mono p-4 outline-none"
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
                                <h3 className="text-xs font-bold text-muted mb-4 uppercase tracking-widest">Quest Reference</h3>
                                <div className="border border-border rounded-xl bg-surface overflow-hidden min-w-0 flex flex-col h-full shadow-sm">
                                    <div className="p-6 flex flex-col gap-3 border-b border-border bg-surface">
                                        <div className="flex justify-between items-start gap-4">
                                            <h4 className="font-bold text-foreground leading-tight">{snatch.quest.title}</h4>
                                            <span className="bg-surface text-warning px-3 py-1.5 rounded-full text-[11px] font-extrabold border border-border flex items-center gap-1.5 whitespace-nowrap shadow-sm">
                                                <Image src="/icon.png" alt="Points" width={14} height={14} className="object-contain" />
                                                {snatch.quest.points} pts
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-surface-raised text-muted text-[10px] font-bold border border-border uppercase tracking-wider">
                                                {snatch.quest.category}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${snatch.quest.difficulty === 'Exclusive' ? 'bg-surface  text-warning  border-border ' :
                                                snatch.quest.difficulty === 'Beginner' ? 'bg-surface  text-success  border-border ' :
                                                    snatch.quest.difficulty === 'Intermediate' ? 'bg-surface  text-info  border-border ' :
                                                        snatch.quest.difficulty === 'Advanced' || snatch.quest.difficulty === 'Advance' ? 'bg-surface  text-danger  border-border ' : 'bg-surface  text-muted  border-border '
                                                }`}>
                                                {snatch.quest.difficulty}
                                            </span>
                                            {snatch.quest.deadline && (
                                                <span className="px-2.5 py-1 rounded-md bg-surface text-danger text-[10px] font-bold border border-border uppercase tracking-wider flex items-center gap-1">
                                                    <Timer className="w-3 h-3" aria-hidden="true" />
                                                    {new Date(snatch.quest.deadline).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-xs text-muted leading-relaxed max-h-32 overflow-y-auto pr-2">
                                            <h5 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Description</h5>
                                            <p>{snatch.quest.description || 'No description available.'}</p>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-6 bg-surface min-w-0 flex-1 overflow-y-auto">
                                        {/* Requirements */}
                                        {(() => {
                                            let requirements: string[] = [];
                                            try {
                                                if (snatch.quest.requirements) {
                                                    const parsed = Array.isArray(snatch.quest.requirements) ? snatch.quest.requirements : [];
                                                    if (Array.isArray(parsed)) requirements = parsed;
                                                }
                                            } catch (e) { console.error("Failed to parse requirements", e); }

                                            if (requirements.length > 0) {
                                                return (
                                                    <div>
                                                        <h5 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                                            <ListChecks className="w-3.5 h-3.5" aria-hidden="true" />
                                                            Submission Checklist
                                                        </h5>
                                                        <ul className="space-y-2">
                                                            {requirements.map((req: string, i: number) => (
                                                                <li key={i} className="flex items-start gap-2 text-xs text-muted bg-surface p-2 rounded border border-border">
                                                                    <Circle className="w-3.5 h-3.5 text-muted mt-0.5 shrink-0" aria-hidden="true" />
                                                                    <span>{req}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}



                                        <div>
                                            {/* Static requirements for demo, or real if we had them */}
                                            <h5 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Quest ID</h5>
                                            <p className="text-xs font-mono text-muted">{snatch.quest.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 lg:px-8 py-5 bg-surface border-t border-border flex flex-wrap items-center justify-end gap-4">
                    <button
                        onClick={() => handleAction('REVISION_NEEDED')}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-card border border-border text-danger text-sm font-bold hover:bg-surface transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Updating...' : 'Request Revision'}
                    </button>
                    <button
                        onClick={() => handleAction('ACCEPTED')}
                        disabled={isSubmitting}
                        className="button-primary"
                    >
                        {isSubmitting ? 'Updating...' : 'Accept & Grant Points'}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
