'use client';
import { Dialog } from '@/components/ui/Dialog';


interface DeleteQuestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isLoading: boolean;
    title?: string;
    description?: string;
    confirmLabel?: string;
    isDestructive?: boolean;
}

export function DeleteQuestModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    title = "Delete Quest",
    description = "Are you sure you want to delete this quest? This action cannot be undone.",
    confirmLabel = "Delete",
    isDestructive = true
}: DeleteQuestModalProps) {
    return (
        <Dialog open={isOpen} onClose={onClose} title={title} pending={isLoading}>
            <p className="text-muted">{description}</p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button onClick={onClose} disabled={isLoading} className="px-4 py-2 border border-control-border">Cancel</button>
                <button onClick={onConfirm} disabled={isLoading} className={isDestructive ? 'px-4 py-2 border border-control-border bg-surface text-danger' : 'button-secondary'}>
                    {isLoading ? 'Processing…' : confirmLabel}
                </button>
            </div>
        </Dialog>
    );
}
