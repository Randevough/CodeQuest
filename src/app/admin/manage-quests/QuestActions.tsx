'use client';

import { useState, useRef, useEffect, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { duplicateQuest, deleteQuest, updateQuestStatus } from '@/actions/quest';
import { toast } from 'sonner';
import { DeleteQuestModal } from '@/components/admin/DeleteQuestModal';

interface QuestActionsProps {
    questId: string;
    status: string;
    activeSnatchesCount: number;
}

export function QuestActions({ questId, status, activeSnatchesCount }: QuestActionsProps) {
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuId = useId();
    const router = useRouter();

    useEffect(() => {
        const menu = menuRef.current;
        const trigger = dropdownRef.current?.querySelector('button');
        if (!menu || !trigger) return;
        if (!isOpen) { menu.hidePopover(); return; }
        menu.showPopover();
        const rect = trigger.getBoundingClientRect();
        menu.style.left = `${Math.max(8, Math.min(rect.right - menu.offsetWidth, window.innerWidth - menu.offsetWidth - 8))}px`;
        menu.style.top = `${Math.max(8, Math.min(rect.bottom + 4, window.innerHeight - menu.offsetHeight - 8))}px`;
        menu.querySelector('a')?.focus();
        const closeMenu = (event: Event) => {
            if (event.target instanceof Node && menu.contains(event.target)) return;
            setIsOpen(false);
        };
        window.addEventListener('scroll', closeMenu, true);
        window.addEventListener('resize', closeMenu);
        return () => {
            window.removeEventListener('scroll', closeMenu, true);
            window.removeEventListener('resize', closeMenu);
        };
    }, [isOpen]);

    const handleDuplicate = async () => {
        if (isLoading) return;
        setMessage('');
        setIsLoading(true);
        setIsOpen(false);
        try {
            const res = await duplicateQuest(questId);
            if (res.success) {
                setMessage("Quest duplicated successfully"); toast.success("Quest duplicated successfully");
                router.refresh();
            } else {
                setMessage(res.error || "Failed to duplicate quest"); toast.error(res.error || "Failed to duplicate quest");
            }
        } catch (error) {
            console.error("Failed to duplicate", error);
            setMessage("Failed to duplicate quest"); toast.error("Failed to duplicate quest");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (isLoading) return;
        setMessage('');
        setIsLoading(true);
        setIsOpen(false);
        try {
            const res = await updateQuestStatus(questId, newStatus);
            if (res.success) {
                setMessage(newStatus === 'Active' ? "Quest published successfully" : "Quest reverted to draft"); toast.success(newStatus === 'Active' ? "Quest published successfully" : "Quest reverted to draft");
                router.refresh();
            } else {
                setMessage(res.error || "Failed to update quest status"); toast.error(res.error || "Failed to update quest status");
            }
        } catch (error) {
            console.error("Failed to update status", error);
            setMessage("Failed to update quest status"); toast.error("Failed to update quest status");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        // Just open the modal
        dropdownRef.current?.querySelector('button')?.focus();
        setMessage('');
        setIsDeleteModalOpen(true);
        setIsOpen(false);
    };

    const confirmDelete = async () => {
        if (isLoading) return;
        setMessage('');
        setIsLoading(true);
        try {
            const res = await deleteQuest(questId);
            if (res.success) {
                setIsDeleteModalOpen(false);
                setMessage("Quest deleted successfully"); toast.success("Quest deleted successfully");
                router.refresh();
            } else {
                setMessage(res.error || "Failed to delete quest"); toast.error(res.error || "Failed to delete quest");
            }
        } catch (error) {
            console.error("Failed to delete", error);
            setMessage("Failed to delete quest"); toast.error("Failed to delete quest");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="relative" ref={dropdownRef} onKeyDown={event => { if (event.key === 'Escape') { setIsOpen(false); (event.currentTarget.querySelector('button') as HTMLButtonElement)?.focus(); } }}>
                {message && <p role="status" className="max-w-xs text-sm text-foreground">{message}</p>}
                <button
                    popoverTarget={menuId}
                    aria-label="Quest actions"
                    aria-expanded={isOpen}
                    aria-controls={menuId}
                    disabled={isLoading}
                    className="w-8 h-8 flex items-center justify-center text-muted hover:text-warning rounded hover:bg-surface hover:border hover:border-border transition-all disabled:opacity-50"
                >
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                        {isLoading ? 'hourglass_empty' : 'more_vert'}
                    </span>
                </button>

                <div ref={menuRef} id={menuId} popover="auto"
                    onToggle={event => setIsOpen(event.currentTarget.matches(':popover-open'))}
                    className="fixed inset-auto m-0 w-48 max-w-[calc(100vw-1rem)] max-h-[calc(100dvh-1rem)] overflow-y-auto bg-surface rounded-md shadow-lg border border-control-border py-1">
                        <Link
                            href={`/admin/manage-quests/create?id=${questId}`}
                            className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-surface-raised w-full text-left gap-2"
                            onClick={() => setIsOpen(false)}
                        >

                            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">edit</span>
                            Edit Quest
                        </Link>
                        {status === 'Active' ? (
                            <button
                                onClick={() => handleStatusUpdate('Draft')}
                                disabled={activeSnatchesCount > 0}
                                title={activeSnatchesCount > 0 ? "Cannot revert to draft with active members" : ""}
                                className={`flex items-center px-4 py-2 text-sm w-full text-left gap-2 ${
                                    activeSnatchesCount > 0 
                                      ? 'text-muted  bg-surface  cursor-not-allowed'
                                      : 'text-warning  hover:bg-surface '
                                }`}
                            >
                                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">unpublished</span>
                                Back to Draft
                            </button>
                        ) : (
                            <button
                                onClick={() => handleStatusUpdate('Active')}
                                className="flex items-center px-4 py-2 text-sm text-success hover:bg-surface w-full text-left gap-2"
                            >
                                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">publish</span>
                                Publish
                            </button>
                        )}
                        <button
                            onClick={handleDuplicate}
                            className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-surface-raised w-full text-left gap-2"
                        >
                            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">content_copy</span>
                            Duplicate
                        </button>
                        <div className="h-px bg-surface-raised my-1 font-medium"></div>
                        <button
                            onClick={handleDelete}
                            disabled={activeSnatchesCount > 0}
                            title={activeSnatchesCount > 0 ? "Cannot delete quest with active members" : ""}
                            className={`flex items-center px-4 py-2 text-sm w-full text-left gap-2 ${
                                activeSnatchesCount > 0 
                                  ? 'text-muted  bg-surface  cursor-not-allowed'
                                  : 'text-danger  hover:bg-surface '
                            }`}
                        >
                            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">delete</span>
                            Delete
                        </button>
                </div>
            </div>

            <DeleteQuestModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isLoading={isLoading}
                description={message || "Are you sure you want to delete this quest? This action cannot be undone."}
            />
        </>
    );
}