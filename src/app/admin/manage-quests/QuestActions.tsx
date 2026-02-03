'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { duplicateQuest, deleteQuest } from '@/actions/quest';
import { toast } from 'sonner';
import { DeleteQuestModal } from '@/components/admin/DeleteQuestModal';

interface QuestActionsProps {
    questId: string;
}

export function QuestActions({ questId }: QuestActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDuplicate = async () => {
        setIsLoading(true);
        setIsOpen(false);
        try {
            const res = await duplicateQuest(questId);
            if (res.success) {
                toast.success("Quest duplicated successfully");
                router.refresh();
            } else {
                toast.error(res.error || "Failed to duplicate quest");
            }
        } catch (error) {
            console.error("Failed to duplicate", error);
            toast.error("Failed to duplicate quest");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        // Just open the modal
        setIsDeleteModalOpen(true);
        setIsOpen(false);
    };

    const confirmDelete = async () => {
        setIsLoading(true);
        try {
            const res = await deleteQuest(questId);
            if (res.success) {
                toast.success("Quest deleted successfully");
                router.refresh();
            } else {
                toast.error(res.error || "Failed to delete quest");
            }
        } catch (error) {
            console.error("Failed to delete", error);
            toast.error("Failed to delete quest");
        } finally {
            setIsLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isLoading}
                    className="text-slate-400 hover:text-orange-600 dark:hover:text-orange-500 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {isLoading ? 'hourglass_empty' : 'more_vert'}
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-50 py-1 origin-top-right animate-in fade-in zoom-in-95 duration-100">
                        <Link
                            href={`/admin/manage-quests/create?id=${questId}`}
                            className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left gap-2"
                            onClick={() => setIsOpen(false)}
                        >

                            <span className="material-symbols-outlined text-[18px]">edit</span>
                            Edit Quest
                        </Link>
                        <button
                            onClick={handleDuplicate}
                            className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                            Duplicate
                        </button>
                        <div className="h-px bg-slate-200 dark:bg-slate-700 my-1 font-medium"></div>
                        <button
                            onClick={handleDelete}
                            className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <DeleteQuestModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isLoading={isLoading}
            />
        </>
    );
}
