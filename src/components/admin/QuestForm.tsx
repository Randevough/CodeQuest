'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createQuest, updateQuest } from '@/actions/quest';
import { CustomDropdown, Option } from '@/components/ui/CustomDropdown';
import { DatePicker } from '@/components/ui/DatePicker';
import { FileText, X, Award, ListChecks, BookOpen } from 'lucide-react';

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
    resources?: string[] | string | null;
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
    const [message, setMessage] = useState('');
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
    const [resources, setResources] = useState(
        Array.isArray(initialData?.resources)
            ? initialData.resources.join('\n')
            : (initialData?.resources || '')
    );

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
    const categoryOptions = [...DEFAULT_CATEGORIES];
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

    const handleSubmit = async () => {
        if (isPending) return;
        setMessage('');
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
            setMessage("Please fill in all required fields."); toast.error("Please fill in all required fields.");
            return;
        }

        startTransition(async () => {
            try {
            let res;
            if (isEditing && initialData?.id) {
                res = await updateQuest(initialData.id, undefined, finalFormData);
            } else {
                res = await createQuest(undefined, finalFormData);
            }

            if (res.success) {
                toast.success(res.message || (isEditing ? 'Quest updated!' : 'Quest created!'));
                router.push('/admin/manage-quests');
                router.refresh();
            } else {
                setMessage(res.message || 'Something went wrong'); toast.error(res.message || 'Something went wrong');
            }
            } catch { setMessage('Could not save quest. Your changes are retained. Try again.'); }
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
        <form action={handleSubmit} className="flex flex-col gap-8 pb-10" aria-busy={isPending}>
            {message && <p role="alert" className="border border-control-border bg-surface p-4 text-danger">{message}</p>}
            {/* Quest Details Section */}
            <div className="bg-surface border border-border rounded-card p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-warning" aria-hidden="true" />
                    Quest Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label htmlFor="quest-title" className="block text-sm font-medium text-foreground mb-1">Quest Title</label>
                        <input
                            required
                            id="quest-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            placeholder="e.g. Build a React Kanban Board"
                            className="w-full h-10 px-3 rounded-md border border-control-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-control-border focus:border-control-border transition-all"
                        />
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label htmlFor="quest-category" className="block text-sm font-medium text-foreground mb-1">Category</label>
                        {isCustomCategory ? (
                            <div className="flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                                <input
                                    required
                                    autoFocus
                                    id="quest-category"
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    type="text"
                                    placeholder="Enter new category..."
                                    className="min-w-0 flex-1 h-10 px-3 rounded-md border border-control-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-control-border focus:border-control-border transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={cancelCustomCategory}
                                    className="px-3 h-10 rounded-md border border-control-border hover:bg-surface-raised text-muted transition-colors flex items-center justify-center"
                                    title="Cancel custom category" aria-label="Cancel custom category"
                                >
                                    <X className="w-4 h-4" aria-hidden="true" />
                                </button>
                            </div>
                        ) : (
                            <CustomDropdown
                                id="quest-category"
                            value={category}
                                onChange={handleCategoryChange}
                                options={displayCategoryOptions}
                                placeholder="Select Category"
                            />
                        )}
                    </div>

                    {/* Difficulty Selection */}
                    <div>
                        <label htmlFor="quest-difficulty" className="block text-sm font-medium text-foreground mb-1">Difficulty</label>
                        <CustomDropdown
                            id="quest-difficulty"
                            value={difficulty}
                            onChange={setDifficulty}
                            options={DIFFICULTY_OPTIONS}
                            placeholder="Select Difficulty"
                        />
                    </div>
                </div>
            </div>

            {/* Rewards & Limits Section */}
            <div className="bg-surface border border-border rounded-card p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-warning" aria-hidden="true" />
                    Rewards & Limits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="quest-points" className="block text-sm font-medium text-foreground mb-1">XP Points</label>
                        <input
                            required
                            id="quest-points"
                            value={points}
                            onChange={(e) => setPoints(Number(e.target.value))}
                            type="number"
                            min="1"
                            placeholder="e.g. 100"
                            className="w-full h-10 px-3 rounded-md border border-control-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-control-border focus:border-control-border transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="quest-maxSnatchers" className="block text-sm font-medium text-foreground mb-1">Max Snatchers</label>
                        <input
                            required
                            id="quest-maxSnatchers"
                            value={maxSnatchers}
                            onChange={(e) => setMaxSnatchers(Number(e.target.value))}
                            type="number"
                            min="1"
                            placeholder="e.g. 5"
                            className="w-full h-10 px-3 rounded-md border border-control-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-control-border focus:border-control-border transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="quest-deadline" className="block text-sm font-medium text-foreground mb-1">Deadline (Optional)</label>
                        <DatePicker
                            id="quest-deadline"
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
            <div className="bg-surface border border-border rounded-card p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-warning" aria-hidden="true" />
                    Submission Checklist
                </h2>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="quest-requirement" aria-label="New submission requirement"
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addRequirement();
                                }
                            }}
                            placeholder="Add a requirement..."
                            className="min-w-0 flex-1 h-10 px-3 rounded-md border border-control-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-control-border focus:border-control-border transition-all"
                        />
                        <button
                            type="button"
                            onClick={addRequirement}
                            className="h-10 px-4 bg-surface-raised hover:bg-surface-raised text-muted rounded-md font-medium text-sm transition-all"
                        >
                            Add
                        </button>
                    </div>

                    {requirements.length > 0 ? (
                        <ul className="space-y-2 mt-2">
                            {requirements.map((req, index) => (
                                <li key={index} className="flex items-center justify-between p-3 bg-surface rounded-md border border-border">
                                    <span className="text-sm text-foreground">{req}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeRequirement(index)}
                                        aria-label={`Remove requirement ${index + 1}`}
                                        className="text-muted hover:text-danger transition-colors"
                                    >
                                        <X className="w-4 h-4" aria-hidden="true" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted italic mt-2">No requirements added yet.</p>
                    )}
                </div>
            </div>

            {/* Description Section */}
            <div className="bg-surface border border-border rounded-card p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-warning" aria-hidden="true" />
                    Resources & Briefing
                </h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="quest-description" className="block text-sm font-medium text-foreground mb-1">Quest Description</label>
                        <textarea
                            required
                            id="quest-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            placeholder="Detailed description of the quest..."
                            className="w-full p-3 rounded-md border border-control-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-control-border focus:border-control-border transition-all resize-none"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="quest-resources" className="block text-sm font-medium text-foreground mb-1">Resources (Markdown supported)</label>
                        <textarea
                            id="quest-resources"
                            value={resources}
                            onChange={(e) => setResources(e.target.value)}
                            rows={4}
                            placeholder="- [Official Docs](https://...)\n- [Tutorial Video](https://...)"
                            className="w-full p-3 rounded-md border border-control-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-control-border focus:border-control-border transition-all font-mono"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 mt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={isPending}
                    className="px-6 py-2.5 rounded-card border border-border text-muted font-bold text-sm hover:bg-surface transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="button-primary"
                >
                    {isPending && <span className="w-4 h-4 border-2 border-border border-t-foreground rounded-full animate-spin"></span>}
                    {isPending ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Quest'}
                </button>
            </div>
        </form>
    );
}