import Link from 'next/link'
import { getWorkspaceQuests } from '@/actions/quest'
import { WorkspaceQuestCard } from './WorkspaceQuestCard'
import { Prisma } from '@prisma/client'
import { PlusCircle, ArrowRight } from 'lucide-react'

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
        return <div className="lg:col-span-8 min-w-0 text-danger">Failed to load quests.</div>
    }

    const MAX_SLOTS = 3;
    const activeCount = snatches.length;
    const emptySlots = Math.max(0, MAX_SLOTS - activeCount);

    return (
        <div className="lg:col-span-8 min-w-0 space-y-6">
            {/* Active Quests */}
            {snatches.map((snatch: WorkspaceSnatch) => (
                <WorkspaceQuestCard key={snatch.id} snatch={snatch} />
            ))}

            {/* Empty Slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
                <article key={`empty-${i}`} className="flex flex-col items-center justify-center gap-4 h-[240px] border-2 border-dashed border-border rounded-card break-words bg-surface dark:bg-surface-dark/30 hover:bg-surface-raised dark:hover:bg-surface-dark/50 transition-colors">
                    <Link href="/explore" aria-label="Browse new quests" className="min-h-11 group/icon h-12 w-12 rounded-full bg-surface dark:bg-surface-dark border border-border flex items-center justify-center hover:border-border transition-all">
                        <PlusCircle className="w-6 h-6 text-muted group-hover/icon:text-primary transition-colors" aria-hidden="true" />
                    </Link>
                    <div className="text-center">
                        <h3 className="text-sm font-semibold text-foreground">Empty Slot Available</h3>
                        <p className="text-sm text-muted mt-1 max-w-[240px]">
                            Ready for more? Find a new quest to add to your list
                        </p>
                    </div>
                    <Link href="/explore" className="min-h-11 text-sm font-bold text-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                        Browse New Quests <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </article>
            ))}

            {activeCount === 0 && emptySlots === 0 && (
                <div className="p-8 text-center text-muted">
                    No active quests found.
                </div>
            )}
        </div>
    )
}
