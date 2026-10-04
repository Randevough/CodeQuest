import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { getQuestUserStatus } from '@/actions/quest'
import Link from 'next/link'
import { QuestAction } from '@/components/QuestAction'
import { Header } from '@/components/Header'
import { QuestTimer } from '@/components/QuestTimer'
import Image from 'next/image'

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
            return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white font-bold shadow-md shadow-amber-400/50 ring-1 ring-inset ring-yellow-200/40 border-0';
        if (d === 'advanced' || d === 'advance' || d === 'expert' || d === 'hard')
            return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50';
        if (d === 'intermediate')
            return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50';
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50';
    }

    return (
        <div className="min-h-screen flex flex-col relative text-slate-800 dark:text-slate-100">
            {/* Fixed dot-pattern + glow auras (standard background) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-50 dark:hidden" style={{
                    backgroundImage: 'radial-gradient(circle, #64748b 1.25px, transparent 1.25px)',
                    backgroundSize: '24px 24px',
                }} />
                <div className="absolute inset-0 opacity-40 hidden dark:block" style={{
                    backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top left, rgba(249,115,22,0.15), transparent 60%)' }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at bottom right, rgba(100,116,139,0.15), transparent 60%)' }} />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <Header activePage="explore" />

                <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative">

                    {/* Micro-deco corner plus markers */}
                    <div aria-hidden="true" className="pointer-events-none absolute top-4 left-4 text-slate-300 text-xl font-light select-none">+</div>
                    <div aria-hidden="true" className="pointer-events-none absolute top-4 right-4 text-slate-300 text-xl font-light select-none">+</div>
                    <div aria-hidden="true" className="pointer-events-none absolute bottom-4 left-4 text-slate-300 text-xl font-light select-none">+</div>
                    <div aria-hidden="true" className="pointer-events-none absolute bottom-4 right-4 text-slate-300 text-xl font-light select-none">+</div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
                        {/* Main Content */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <article className="bg-white dark:bg-surface-dark rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col gap-6">
                                        {/* Back Navigation */}
                                        <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors font-['Plus_Jakarta_Sans'] mb-[-10px]">
                                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                            Back to Quests
                                        </Link>

                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            <span>Quest ID: #{quest.id}</span>
                                            <span className="text-slate-300 dark:text-slate-700">•</span>
                                            <span className={`px-2 py-0.5 rounded ${isCompleted ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                isPending ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    isSnatched ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                {isCompleted ? 'Completed' : isPending ? 'Pending Review' : isSnatched ? 'Active' : 'Available'}
                                            </span>
                                        </div>

                                        {/* Title with fading architectural line */}
                                        <div className="flex items-center gap-4">
                                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight shrink-0">
                                                {quest.title}
                                            </h1>
                                            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 hidden sm:block" />
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {/* Difficulty Badge */}
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold capitalize ${getDifficultyBadge(quest.difficulty)}`}>
                                                {quest.difficulty || 'Beginner'}
                                            </span>

                                            {/* Points Badge */}
                                            <div className="inline-flex items-center px-2.5 py-1 rounded border bg-orange-50 border-orange-100 text-orange-700  dark:bg-amber-900/30 border border-yellow-200 dark:border-amber-700/50 text-yellow-700 dark:text-amber-400">
                                                <Image src="/icon.png" alt="Points" width={13} height={13} className="mr-1.5 object-contain" />
                                                <span className="text-[11px] font-bold uppercase tracking-wide">{quest.points || 500} pts</span>
                                            </div>

                                            {/* Category Badge */}
                                            <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 capitalize">
                                                {quest.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 pt-8 space-y-10">
                                    <section>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">info</span> Mission Briefing
                                        </h3>
                                        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                            <p>{quest.description}</p>
                                        </div>
                                    </section>

                                    {/* Checklist Section */}
                                    {requirements.length > 0 && (
                                        <section>
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px]">checklist</span> Completion Requirements
                                            </h3>
                                            <ul className="space-y-3">
                                                {requirements.map((req, index) => (
                                                    <li key={index} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                                                        <div className="flex items-center justify-center min-w-[20px] h-5">
                                                            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[20px]">radio_button_unchecked</span>
                                                        </div>
                                                        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    )}

                                    {/* Resources Section */}
                                    {quest.resources && (
                                        <section>
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px]">link</span> Resources
                                            </h3>
                                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">description</span>
                                                    <div>
                                                        <h5 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">Provided Materials</h5>
                                                        {(() => {
                                                            const resourceText = Array.isArray(quest.resources)
                                                                ? quest.resources.join('\n')
                                                                : (quest.resources || '');
                                                            const parts = resourceText.split(/(\[.*?\]\(.*?\))/g);
                                                            return (
                                                                <div className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap font-medium">
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
                                                                                    className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 break-all"
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
                                    <section className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-10">
                                        <div className="flex items-center gap-2 mb-6">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
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
                            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 dark:border-slate-800 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-primary dark:text-white text-[20px]">timer</span>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Time Remaining</h4>
                                </div>
                                <QuestTimer deadline={quest.deadline} />
                            </div>

                            {/* Squad Members */}
                            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 dark:border-slate-800 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary dark:text-white text-[20px]">groups</span>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Squad Members</h4>
                                    </div>
                                    <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${quest.snatches.length >= quest.maxSnatchers ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-primary/10 text-primary dark:text-white'}`}>
                                        {quest.snatches.length}/{quest.maxSnatchers}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {quest.snatches.map((snatch) => (
                                        <Link href={`/profile/${snatch.user.id}`} key={snatch.user.id} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            {snatch.user.avatar ? (
                                                <img src={snatch.user.avatar} alt={snatch.user.name || 'User'} className="size-10 rounded-full object-cover group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 group-hover:scale-105 transition-transform">
                                                    {(snatch.user.name || snatch.user.handle || '?')[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                    {snatch.user.name || snatch.user.handle || 'Anonymous'}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}

                                    {/* Empty Slots or "No Members" */}
                                    {quest.snatches.length === 0 && (
                                        <div className="text-center py-4 text-sm text-slate-500 italic">
                                            No brave souls yet. Be the first!
                                        </div>
                                    )}

                                    {/* Show Open Slot indicator if there is space */}
                                    {quest.snatches.length < quest.maxSnatchers && (
                                        <div className="flex items-center gap-3 opacity-60">
                                            <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400">
                                                <span className="material-symbols-outlined text-[18px]">add</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-500 italic">Spot Open</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Help / Discord */}
                            <div className="bg-gradient-to-br from-[#EA580C] to-[#FB923C] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 text-white">
                                <h4 className="text-lg font-bold mb-2">Need a teammate?</h4>
                                <p className="text-white/90 text-sm mb-4 leading-relaxed">
                                    Most advanced quests are easier with a partner. Check Discord to find a buddy.
                                </p>

                                <a
                                    href="#"
                                    className="flex items-center justify-center gap-2 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                                >
                                    <svg aria-hidden="true" className="size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2763-3.68-.2763-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.0991.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.699.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1569 2.4189z"></path>
                                    </svg>
                                    Join Discord Server
                                </a>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    )
}
