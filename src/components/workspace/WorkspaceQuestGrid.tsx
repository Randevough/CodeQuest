import Link from 'next/link'
import { getWorkspaceQuests } from '@/actions/quest'
import { WorkspaceQuestCard } from './WorkspaceQuestCard'
import { Prisma } from '@prisma/client'

type WorkspaceSnatch = Prisma.SnatchGetPayload<{
    include: { 
        quest: {
            select: {
                id: true;
                title: true;
                description: true;
                points: true;
                maxSnatchers: true;
                category: true;
                difficulty: true;
                deadline: true;
                _count: {
                    select: { snatches: true };
                };
            };
        };
        squad: {
            select: { name: true };
        };
    }
}>;

export async function WorkspaceQuestGrid() {
    const { success, data: snatches } = await getWorkspaceQuests();

    if (!success || !snatches) {
        return <div className="lg:col-span-8 text-red-500">Failed to load quests.</div>
    }

    const MAX_SLOTS = 3;
    const activeCount = snatches.length;
    const emptySlots = Math.max(0, MAX_SLOTS - activeCount);

    return (
        <div className="lg:col-span-8 space-y-6">
            {/* Active Quests */}
            {snatches.map((snatch: WorkspaceSnatch) => (
                <WorkspaceQuestCard key={snatch.id} snatch={snatch} />
            ))}

            {/* Empty Slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
                <article key={`empty-${i}`} className="flex flex-col items-center justify-center gap-4 h-[240px] border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-surface-dark/30 hover:bg-gray-50 dark:hover:bg-surface-dark/50 transition-colors">
                    <Link href="/" className="group/icon h-12 w-12 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm hover:border-orange-200 hover:shadow-md transition-all">
                        <span className="material-symbols-outlined text-gray-400 group-hover/icon:text-orange-500 transition-colors">add_circle</span>
                    </Link>
                    <div className="text-center">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Empty Slot Available</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[240px]">
                            Ready for more? Find a new quest to add to your list.
                        </p>
                    </div>
                    <Link href="/" className="text-sm font-bold text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center gap-1">
                        Browse New Quests <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </article>
            ))}

            {activeCount === 0 && emptySlots === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No active quests found.
                </div>
            )}
        </div>
    )
}

