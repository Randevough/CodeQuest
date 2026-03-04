'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createQuest, updateQuest } from '@/actions/quest';
import { CustomDropdown, Option } from '@/components/ui/CustomDropdown';
import { DatePicker } from '@/components/ui/DatePicker';

interface QuestData {
    id?: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    points: number;
    maxSnatchers: number;
    deadline?: Date | string | null;
    requirements: string[];
    resources?: string | null;
}

interface QuestFormProps {
    initialData?: QuestData;
    isEditing?: boolean;
}

const DIFFICULTY_OPTIONS: Option[] = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
    { label: '✦ Exclusive', value: 'Exclusive' },
];

const DEFAULT_CATEGORIES: Option[] = [
    { label: 'Frontend Development', value: 'Frontend' },
    { label: 'Backend Development', value: 'Backend' },
    { label: 'Fullstack App', value: 'Fullstack' },
    { label: 'UI/UX Design', value: 'UI/UX' },
    { label: 'Algorithms', value: 'Algorithms' },
];

export function QuestForm({ initialData, isEditing = false }: QuestFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form State
    const [title, setTitle] = useState(initialData?.title || '');
    const [category, setCategory] = useState(initialData?.category || '');
    const [difficulty, setDifficulty] = useState(initialData?.difficulty || '');
    const [points, setPoints] = useState(initialData?.points || 100);
    const [maxSnatchers, setMaxSnatchers] = useState(initialData?.maxSnatchers || 1);
    const [deadline, setDeadline] = useState(() => {
        if (!initialData?.deadline) return '';
        const d = new Date(initialData.deadline);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
    const [description, setDescription] = useState(initialData?.description || '');
    const [resources, setResources] = useState(initialData?.resources || '');

    const [requirements, setRequirements] = useState<string[]>(
        initialData?.requirements || []
    );
    const [newRequirement, setNewRequirement] = useState('');

    // Custom Category Logic
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState('');

    // Prepare Category Options
    // Check if initialCategory is in default list. If not, and it has value, implies it might be custom or legacy.
    // For simplicity, we just use the default list + "Create New". 
    // If the initial Category is not in the list, we treat it as a custom entry effectively?
    // Actually, if we load a quest with "DevOps" and "DevOps" is not in list, the dropdown won't show it selected unless we include it.

    // Let's verify if 'category' is in default list.
    const isKnownCategory = DEFAULT_CATEGORIES.some(c => c.value === category);

    // If we have a category that is NOT known, we should probably add it to the list dynamically OR switch to custom mode?
    // Let's just add it dynamically to the options if it exists and is valid.
    let categoryOptions = [...DEFAULT_CATEGORIES];
    if (category && !isKnownCategory) {
        // It's a custom category from DB
        categoryOptions.push({ label: category, value: category });
    }

    // Append "Create New"
    const displayCategoryOptions = [
        ...categoryOptions,
        { label: '+ Create New Category', value: '___NEW___' }
    ];

    const handleCategoryChange = (val: string) => {
        if (val === '___NEW___') {
            setIsCustomCategory(true);
            setCategory(''); // clear main category
            setCustomCategory(''); // clear custom input
        } else {
            setCategory(val);
            setIsCustomCategory(false);
        }
    };

    const cancelCustomCategory = () => {
        setIsCustomCategory(false);
        setCategory(initialData?.category || ''); // revert to initial or empty
    };

    const handleSubmit = async (draftFormData: FormData) => {
        // We need to construct the real FormData with our state values because 
        // CustomDropdown doesn't use native inputs that FormData picks up automatically (unless we hidden input it).
        // It's safer to just set them manually.

        const finalFormData = new FormData();
        finalFormData.set('title', title);

        // Category: Use custom string if custom mode, else selected value
        const finalCategory = isCustomCategory ? customCategory : category;
        finalFormData.set('category', finalCategory);

        finalFormData.set('difficulty', difficulty);
        finalFormData.set('points', points.toString());
        finalFormData.set('maxSnatchers', maxSnatchers.toString());
        if (deadline) finalFormData.set('deadline', deadline);
        finalFormData.set('requirements', JSON.stringify(requirements));
        finalFormData.set('description', description);
        if (resources) finalFormData.set('resources', resources);

        if (!title || !finalCategory || !difficulty || !points || !description) {
            toast.error("Please fill in all required fields.");
            return;
        }

        startTransition(async () => {
            let res;
            if (isEditing && initialData?.id) {
                res = await updateQuest(initialData.id, null, finalFormData);
            } else {
                res = await createQuest(null, finalFormData);
            }

            if (res.success) {
                toast.success(res.message || (isEditing ? 'Quest updated!' : 'Quest created!'));
                router.push('/admin/manage-quests');
                router.refresh();
            } else {
                toast.error(res.message || 'Something went wrong');
            }
        });
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            setRequirements([...requirements, newRequirement.trim()]);
            setNewRequirement('');
        }
    };

    const removeRequirement = (index: number) => {
        setRequirements(requirements.filter((_, i) => i !== index));
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <form action={handleSubmit} className="flex flex-col gap-8 pb-10">
            {/* Quest Details Section */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500">article</span>
                    Quest Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quest Title</label>
                        <input
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            placeholder="e.g. Build a React Kanban Board"
                            className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        />
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                        {isCustomCategory ? (
                            <div className="flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                                <input
                                    required
                                    autoFocus
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    type="text"
                                    placeholder="Enter new category..."
                                    className="flex-1 h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={cancelCustomCategory}
                                    className="px-3 h-10 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                                    title="Cancel custom category"
                                >
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>
                        ) : (
                            <CustomDropdown
                                value={category}
                                onChange={handleCategoryChange}
                                options={displayCategoryOptions}
                                placeholder="Select Category"
                            />
                        )}
                    </div>

                    {/* Difficulty Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                        <CustomDropdown
                            value={difficulty}
                            onChange={setDifficulty}
                            options={DIFFICULTY_OPTIONS}
                            placeholder="Select Difficulty"
                        />
                    </div>
                </div>
            </div>

            {/* Rewards & Limits Section */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500">military_tech</span>
                    Rewards & Limits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">XP Points</label>
                        <input
                            required
                            value={points}
                            onChange={(e) => setPoints(Number(e.target.value))}
                            type="number"
                            min="1"
                            placeholder="e.g. 100"
                            className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Snatchers</label>
                        <input
                            required
                            value={maxSnatchers}
                            onChange={(e) => setMaxSnatchers(Number(e.target.value))}
                            type="number"
                            min="1"
                            placeholder="e.g. 5"
                            className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deadline (Optional)</label>
                        <DatePicker
                            value={deadline}
                            onChange={(date) => {
                                if (!date) { setDeadline(''); return; }
                                const y = date.getFullYear();
                                const m = String(date.getMonth() + 1).padStart(2, '0');
                                const d = String(date.getDate()).padStart(2, '0');
                                setDeadline(`${y}-${m}-${d}`);
                            }}
                            minDate={today}
                        />
                    </div>
                </div>
            </div>

            {/* Requirements Section */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500">checklist</span>
                    Submission Checklist
                </h2>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addRequirement();
                                }
                            }}
                            placeholder="Add a requirement..."
                            className="flex-1 h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={addRequirement}
                            className="h-10 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-md font-medium text-sm transition-all"
                        >
                            Add
                        </button>
                    </div>

                    {requirements.length > 0 ? (
                        <ul className="space-y-2 mt-2">
                            {requirements.map((req, index) => (
                                <li key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-800">
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{req}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeRequirement(index)}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-500 italic mt-2">No requirements added yet.</p>
                    )}
                </div>
            </div>

            {/* Description Section */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500">description</span>
                    Resources & Briefing
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quest Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            placeholder="Detailed description of the quest..."
                            className="w-full p-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Resources (Markdown supported)</label>
                        <textarea
                            value={resources}
                            onChange={(e) => setResources(e.target.value)}
                            rows={4}
                            placeholder="- [Official Docs](https://...)\n- [Tutorial Video](https://...)"
                            className="w-full p-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 mt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isPending && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                    {isEditing ? 'Save Changes' : 'Create Quest'}
                </button>
            </div>
        </form>
    );
}
