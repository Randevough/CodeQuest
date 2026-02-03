'use client';

import { useState } from 'react';

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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md mx-4 p-6 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDestructive ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'}`}>
                            <span className="material-symbols-outlined text-[24px]">
                                {isDestructive ? 'warning' : 'info'}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                        </div>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 text-sm ml-13">
                        {description}
                    </p>

                    <div className="flex items-center justify-end gap-3 mt-2">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-md text-sm font-medium text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2 ${isDestructive
                                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                    : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                                }`}
                        >
                            {isLoading && (
                                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            )}
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
