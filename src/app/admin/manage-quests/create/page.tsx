
import { MobileSidebarTrigger } from '@/components/admin/MobileSidebarTrigger';
import { QuestForm } from '@/components/admin/QuestForm';
import { getQuestById } from '@/actions/quest';

interface CreateQuestPageProps {
    searchParams: {
        id?: string;
    };
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
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative font-['Plus_Jakarta_Sans']">
            {/* Header */}
            <header className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-white dark:bg-slate-900 z-10">
                <div className="flex items-center gap-4">
                    <MobileSidebarTrigger className="md:hidden" />
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {isEditing ? 'Edit Quest' : 'Create New Quest'}
                    </h1>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="mx-auto max-w-4xl">
                    <QuestForm initialData={initialData} isEditing={isEditing} />
                </div>
            </div>
        </div>
    );
}
