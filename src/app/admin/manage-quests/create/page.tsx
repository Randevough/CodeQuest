
import { MobileSidebarTrigger } from '@/components/admin/MobileSidebarTrigger';
import { QuestForm } from '@/components/admin/QuestForm';
import { getQuestById } from '@/actions/quest';

interface CreateQuestPageProps {
    searchParams: Promise<{
        id?: string;
    }>;
}

export default async function CreateQuestPage({ searchParams }: CreateQuestPageProps) {
    const params = await searchParams;
    const isEditing = !!params.id;
    let initialData = undefined;

    if (isEditing && params.id) {
        const res = await getQuestById(params.id);
        if (res.success && res.data) {
            initialData = res.data;
        }
    }

    return (
        <div className="min-w-0 flex flex-col h-full bg-surface relative font-sans">
            {/* Header */}
            <header className="min-h-16 py-3 gap-3 flex-wrap flex-shrink-0 border-b border-border flex items-center justify-between px-4 sm:px-4 sm:px-6 lg:px-8 bg-surface z-10">
                <div className="flex items-center gap-4">
                    <MobileSidebarTrigger className="md:hidden" />
                    <h1 className="text-2xl sm:text-3xl text-foreground">
                        {isEditing ? 'Edit Quest' : 'Create New Quest'}
                    </h1>
                </div>
            </header>

            {/* Content */}
            <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-4xl">
                    {isEditing && !initialData && <p role="alert" className="mb-4 border border-control-border bg-surface p-4 text-danger">Quest details could not load. Existing values are unavailable. Refresh before editing.</p>}
                    <QuestForm initialData={initialData} isEditing={isEditing} />
                </div>
            </div>
        </div>
    );
}