'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createQuest } from '@/actions/quest';
import { toast } from 'sonner';

export default function CreateQuestPage() {
    // State for dynamic checklist
    const [requirements, setRequirements] = useState<string[]>(['Code must be clean and commented', 'Responsive on mobile and desktop']);
    const [newRequirement, setNewRequirement] = useState('');

    const handleAddRequirement = () => {
        if (newRequirement.trim()) {
            setRequirements([...requirements, newRequirement.trim()]);
            setNewRequirement('');
        }
    };

    const handleRemoveRequirement = (index: number) => {
        setRequirements(requirements.filter((_, i) => i !== index));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        // Append dynamic requirements
        formData.append('requirements', JSON.stringify(requirements));

        try {
            const res = await createQuest(null, formData);
            if (res.success) {
                toast.success('Quest created successfully!');
                // Redirect or reset form? For now, maybe redirect back to list
                window.location.href = '/admin/manage-quests';
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <header className="h-auto py-4 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-white dark:bg-slate-900 z-10">
                <div className="flex flex-col justify-center gap-1">
                    <Link href="/admin/manage-quests" className="flex items-center gap-1 text-slate-500 hover:text-orange-600 text-sm font-medium transition-colors mb-1">
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        <span>Back to Quests</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create New Quest</h1>
                </div>
                <div className="flex items-center gap-3 mt-auto">
                    <Link href="/admin/manage-quests" className="flex items-center justify-center h-9 px-4 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-colors focus:outline-none">
                        Cancel
                    </Link>
                    <button
                        onClick={() => document.querySelector('form')?.requestSubmit()}
                        disabled={isSubmitting}
                        className="flex items-center justify-center h-9 px-4 rounded bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium shadow-sm transition-all focus:ring-2 focus:ring-orange-600/30 focus:outline-none gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Publishing...' : 'Publish Quest'}
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="mx-auto max-w-3xl">
                    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                        {/* Quest Details */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-6 flex flex-col gap-6">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quest Details</h2>
                                <p className="text-sm text-slate-500">Provide the core information about this coding challenge.</p>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="quest-title">Quest Title</label>
                                    <input
                                        className="w-full h-10 px-3 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder:text-slate-400 transition-all shadow-sm"
                                        id="quest-title"
                                        name="title" // Added name
                                        placeholder="e.g. Build a Responsive Dashboard with CSS Grid"
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="category">Category</label>
                                        <select
                                            className="w-full h-10 px-3 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                                            id="category"
                                            name="category" // Added name
                                            defaultValue=""
                                            required
                                        >
                                            <option disabled value="">Select a category</option>
                                            <option value="web">Web Development</option>
                                            <option value="ai">Artificial Intelligence</option>
                                            <option value="mobile">Mobile Development</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="difficulty">Difficulty</label>
                                        <select
                                            className="w-full h-10 px-3 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                                            id="difficulty"
                                            name="difficulty" // Added name
                                            defaultValue=""
                                            required
                                        >
                                            <option disabled value="">Select difficulty</option>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advance">Advanced</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rewards, Limits & Timeline */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-6 flex flex-col gap-6">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Rewards, Limits & Timeline</h2>
                                <p className="text-sm text-slate-500">Set the stakes, capacity, and deadline for this quest.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="points">Points Reward</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 dark:text-yellow-400 text-[18px]">✨</span>
                                        <input
                                            className="w-full h-10 pl-9 pr-3 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder:text-slate-400 transition-all shadow-sm"
                                            id="points"
                                            name="points" // Added name
                                            placeholder="0"
                                            type="number"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="max-slots">Max Slots</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">group</span>
                                        <input
                                            className="w-full h-10 pl-9 pr-3 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder:text-slate-400 transition-all shadow-sm"
                                            id="max-slots"
                                            name="maxSnatchers" // Added name
                                            placeholder="Unlimited"
                                            type="number"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="deadline">Quest Deadline</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">calendar_today</span>
                                        <input
                                            className="w-full h-10 pl-9 pr-3 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder:text-slate-400 transition-all shadow-sm"
                                            id="deadline"
                                            name="deadline" // Added name
                                            type="datetime-local"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submission Checklist */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-6 flex flex-col gap-6">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Submission Checklist</h2>
                                <p className="text-sm text-slate-500">Define the technical requirements that must be met for submission approval.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Technical Requirements</label>
                                    <div className="flex flex-col gap-3">
                                        {requirements.map((req, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <input
                                                    className="flex-1 h-10 px-3 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder:text-slate-400 transition-all shadow-sm"
                                                    type="text"
                                                    value={req}
                                                    readOnly
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRequirement(index)}
                                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-2">
                                            <input
                                                className="flex-1 h-10 px-3 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder:text-slate-400 transition-all shadow-sm"
                                                placeholder="Add a new requirement..."
                                                type="text"
                                                value={newRequirement}
                                                onChange={(e) => setNewRequirement(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddRequirement();
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddRequirement}
                                                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-orange-600 hover:bg-orange-600/10 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resources & Briefing */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-6 flex flex-col gap-6">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Resources & Briefing</h2>
                                <p className="text-sm text-slate-500">Add important links and starter documentation for developers.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="resource-links">External Resource Links</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-slate-400 material-symbols-outlined text-[18px]">link</span>
                                        <textarea
                                            className="w-full min-h-[80px] pl-9 pr-3 py-2.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 placeholder:text-slate-400 transition-all shadow-sm resize-y"
                                            id="resource-links"
                                            name="resources" // Added name
                                            placeholder={`https://github.com/codequest/starter-repo\nhttps://docs.api-service.com/guide`}
                                        ></textarea>
                                    </div>
                                    <p className="text-xs text-slate-500">Paste one URL per line for starter repositories or documentation.</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="description">Description & Instructions</label>
                                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden transition-all focus-within:ring-1 focus-within:ring-orange-500 focus-within:border-orange-500">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 px-2 py-2 flex items-center gap-1">
                                            {/* Toolbar buttons removed for brevity, keeping layout */}
                                            <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors" title="Bold" type="button">
                                                <span className="material-symbols-outlined text-[20px]">format_bold</span>
                                            </button>
                                            <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors" title="Italic" type="button">
                                                <span className="material-symbols-outlined text-[20px]">format_italic</span>
                                            </button>
                                            <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                                            <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors" title="Link" type="button">
                                                <span className="material-symbols-outlined text-[20px]">link</span>
                                            </button>
                                            <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors" title="Bulleted List" type="button">
                                                <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                                            </button>
                                            <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors" title="Numbered List" type="button">
                                                <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
                                            </button>
                                            <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                                            <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors" title="Code Block" type="button">
                                                <span className="material-symbols-outlined text-[20px]">code</span>
                                            </button>
                                        </div>
                                        <textarea
                                            className="w-full p-4 min-h-[240px] bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none resize-y placeholder:text-slate-400"
                                            id="description"
                                            name="description" // Added name
                                            placeholder="Write your quest description here... Support for Markdown enabled."
                                            required
                                        ></textarea>
                                    </div>
                                    <p className="text-xs text-slate-500 text-right">0/5000 characters</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
