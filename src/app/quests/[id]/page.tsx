import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { getQuestUserStatus } from '@/actions/quest'
import Link from 'next/link'
import { QuestAction } from '@/components/QuestAction'
import { Header } from '@/components/Header'
import { QuestTimer } from '@/components/QuestTimer'
import { UserAvatar } from '@/components/ui/UserAvatar'
import Image from 'next/image'
import { ChevronLeft, Info, ListChecks, Circle, Link as LinkIcon, FileText, Timer, Users, Plus } from 'lucide-react'

// Force dynamic since we use user specific data and params
export const dynamic = 'force-dynamic'

async function getQuest(id: string) {
    const quest = await prisma.quest.findUnique({
        where: { id },
        include: {
            _count: {
                select: { snatches: { where: { status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'] } } } }
            },
            snatches: {
                where: { status: { in: ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED'] } },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            role: true,
                            handle: true
                        }
                    }
                },
                take: 5 // Limit to 5 for now in the sidebar
            }
        }
    })
    if (!quest) return null
    return quest
}

export default async function QuestPage({ params }: { params: { id: string } }) {
    // Next 15+ await params
    const resolvedParams = await params
    const quest = await getQuest(resolvedParams.id)

    if (!quest) {
        notFound()
    }

    // Check if user has snatched this quest
    const userStatus = await getQuestUserStatus(quest.id)
    const activeStatuses = ['ACTIVE', 'SUBMITTED', 'REVISION_NEEDED']
    const isSnatched = activeStatuses.includes(userStatus?.status || '')
    // Check for Team Status
    const isTeamPending = quest.snatches.some(s => s.status === 'SUBMITTED');
    const isTeamCompleted = quest.snatches.some(s => ['COMPLETED', 'ACCEPTED', 'ARCHIVED'].includes(s.status));

    const isPending = userStatus?.status === 'SUBMITTED' || isTeamPending;
    const isCompleted = ['COMPLETED', 'ACCEPTED', 'ARCHIVED'].includes(userStatus?.status || '') || isTeamCompleted;

    // Parse Requirements (Checklist)
    let requirements: string[] = [];
    if (Array.isArray(quest.requirements)) {
        requirements = quest.requirements;
    } else if (typeof quest.requirements === 'string') {
        try {
            const parsed = JSON.parse(quest.requirements);
            if (Array.isArray(parsed)) {
                requirements = parsed;
            }
        } catch (e) {
            console.error("Failed to parse requirements", e);
        }
    }

    // Difficulty badge helper
    const getDifficultyBadge = (difficulty: string | null) => {
        const d = (difficulty || 'Beginner').toLowerCase();
        if (d === 'exclusive')
            return 'bg-surface   text-foreground font-bold   ring-1 ring-inset ring-focus border-0';
        if (d === 'advanced' || d === 'advance' || d === 'expert' || d === 'hard')
            return 'bg-surface text-foreground border border-border';
        if (d === 'intermediate')
            return 'bg-surface text-info border border-border';
        return 'bg-surface text-success border border-border';
    }

    return (
        <div className="min-h-screen flex flex-col relative text-foreground">
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <Header activePage="explore" />

                <main className="page-container flex-grow py-8 lg:py-12 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
                        {/* Main Content */}
                        <div className="lg:col-span-8 min-w-0 flex flex-col gap-6">
                            <article className="bg-surface dark:bg-surface-dark rounded-card break-words border border-border overflow-hidden">
                                <div className="p-4 sm:p-6 pb-6 border-b border-border">
                                    <div className="flex flex-col gap-6">
                                        {/* Back Navigation */}
                                        <Link href="/explore" className="min-h-11 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground transition-colors font-sans mb-[-10px]">
                                            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                                            Back to Quests
                                        </Link>

                                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted break-all">
                                            <span>Quest ID: #{quest.id}</span>
                                            <span className="text-muted">•</span>
                                            <span className={`px-2 py-0.5 rounded ${isCompleted ? 'bg-surface text-foreground' :
                                                isPending ? 'bg-surface text-warning' :
                                                    isSnatched ? 'bg-surface text-success' :
                                                        'bg-surface text-muted'
                                                }`}>
                                                {isCompleted ? 'Completed' : isPending ? 'Pending Review' : isSnatched ? 'Active' : 'Available'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <h1 className="text-foreground tracking-tight leading-tight min-w-0 break-words">
                                                {quest.title}
                                            </h1>
                                            <div className="h-px flex-1 bg-surface to-transparent hidden sm:block" />
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {/* Difficulty Badge */}
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-bold capitalize ${getDifficultyBadge(quest.difficulty)}`}>
                                                {quest.difficulty || 'Beginner'}
                                            </span>

                                            {/* Points Badge */}
                                            <div className="inline-flex items-center px-2.5 py-1 rounded border bg-surface border-border text-warning">
                                                <Image src="/icon.png" alt="Points" width={13} height={13} className="mr-1.5 object-contain" />
                                                <span className="text-sm font-bold uppercase tracking-wide">{quest.points || 500} pts</span>
                                            </div>

                                            {/* Category Badge */}
                                            <span className="inline-flex items-center px-2.5 py-1 rounded text-sm font-semibold bg-surface text-muted border border-border capitalize">
                                                {quest.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 sm:p-6 space-y-8">
                                    <section>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                                            <Info className="w-4 h-4 text-primary" aria-hidden="true" /> Mission Briefing
                                        </h3>
                                        <div className="max-w-[70ch] text-foreground leading-relaxed">
                                            <p>{quest.description}</p>
                                        </div>
                                    </section>

                                    {/* Checklist Section */}
                                    {requirements.length > 0 && (
                                        <section>
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                                                <ListChecks className="w-4 h-4 text-primary" aria-hidden="true" /> Completion Requirements
                                            </h3>
                                            <ul className="space-y-3">
                                                {requirements.map((req, index) => (
                                                    <li key={index} className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-border">
                                                        <div className="flex items-center justify-center min-w-[20px] h-5">
                                                            <Circle className="w-4 h-4 text-muted" aria-hidden="true" />
                                                        </div>
                                                        <span className="text-foreground text-sm font-medium">{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    )}

                                    {/* Resources Section */}
                                    {quest.resources && (
                                        <section>
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                                                <LinkIcon className="w-4 h-4 text-primary" aria-hidden="true" /> Resources
                                            </h3>
                                            <div className="bg-surface border border-border rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <FileText className="w-4 h-4 text-info mt-0.5" aria-hidden="true" />
                                                    <div>
                                                        <h5 className="font-semibold text-info text-sm mb-1">Provided Materials</h5>
                                                        {(() => {
                                                            const resourceText = Array.isArray(quest.resources)
                                                                ? quest.resources.join('\n')
                                                                : (quest.resources || '');
                                                            const parts = resourceText.split(/(\[.*?\]\(.*?\))/g);
                                                            return (
                                                                <div className="text-muted text-sm whitespace-pre-wrap font-medium">
                                                                    {parts.map((part, i) => {
                                                                        const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                                                        if (match) {
                                                                            const [, text, url] = match;
                                                                            return (
                                                                                <a
                                                                                    key={i}
                                                                                    href={url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-info underline hover:text-info break-all"
                                                                                >
                                                                                    {text}
                                                                                </a>
                                                                            );
                                                                        }
                                                                        return part;
                                                                    })}
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    )}

                                    {/* Submission Section or Join/Drop Actions */}
                                    <section className="border-t border-border pt-8 mt-10">
                                        <div className="flex items-center gap-2 mb-6">
                                            <h3 className="text-xl font-bold text-foreground">
                                                {isCompleted ? 'Mission Status' : isPending ? 'Mission Logged' : 'Submit Your Quest'}
                                            </h3>
                                        </div>

                                        <QuestAction
                                            questId={quest.id}
                                            isSnatched={isSnatched}
                                            userStatus={userStatus}
                                            isPending={isPending}
                                            isCompleted={isCompleted}
                                        />

                                    </section>
                                </div>
                            </article>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                            {/* Time Remaining */}
                            <div className="bg-surface dark:bg-surface-dark rounded-card break-words border border-border p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Timer className="w-5 h-5 text-foreground" aria-hidden="true" />
                                    <h4 className="text-sm font-bold text-foreground">Time Remaining</h4>
                                </div>
                                <QuestTimer deadline={quest.deadline} />
                            </div>

                            {/* Squad Members */}
                            <div className="bg-surface dark:bg-surface-dark rounded-card break-words border border-border p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-foreground" aria-hidden="true" />
                                        <h4 className="text-sm font-bold text-foreground">Squad Members</h4>
                                    </div>
                                    <span className={`text-sm font-mono font-bold px-2 py-1 rounded ${quest.snatches.length >= quest.maxSnatchers ? 'bg-surface text-danger' : 'bg-surface text-foreground'}`}>
                                        {quest.snatches.length}/{quest.maxSnatchers}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {quest.snatches.map((snatch) => (
                                        <Link href={`/profile/${snatch.user.id}`} key={snatch.user.id} className="min-h-11 flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-surface-raised transition-colors group">
                                            <UserAvatar
                                                src={snatch.user.avatar}
                                                name={snatch.user.name || snatch.user.handle}
                                                size={40}
                                                className="size-10 rounded-full border border-border"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-foreground break-words group-hover:text-foreground transition-colors">
                                                    {snatch.user.name || snatch.user.handle || 'Anonymous'}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}

                                    {/* Empty Slots or "No Members" */}
                                    {quest.snatches.length === 0 && (
                                        <div className="text-center py-4 text-sm text-muted italic">
                                            No brave souls yet. Be the first!
                                        </div>
                                    )}

                                    {/* Show Open Slot indicator if there is space */}
                                    {quest.snatches.length < quest.maxSnatchers && (
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-surface border-2 border-dashed border-border flex items-center justify-center text-muted">
                                                <Plus className="w-4 h-4" aria-hidden="true" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-muted italic">Spot Open</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </aside>
                    </div>
                </main>
            </div>
        </div>
    )
}
