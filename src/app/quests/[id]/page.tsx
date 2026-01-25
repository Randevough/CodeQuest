import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { getUserActiveSnatches } from '@/actions/quest'
import Link from 'next/link'
import { QuestAction } from '@/components/QuestAction'
import { Header } from '@/components/Header'

// Force dynamic since we use user specific data and params
export const dynamic = 'force-dynamic'

async function getQuest(id: string) {
    const quest = await prisma.quest.findUnique({
        where: { id },
        include: {
            _count: {
                select: { snatches: { where: { status: 'ACTIVE' } } }
            },
            snatches: {
                where: { status: 'ACTIVE' },
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
    const activeSnatches = await getUserActiveSnatches();
    const isSnatched = activeSnatches.includes(quest.id);

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-black text-slate-800 dark:text-slate-200 font-display">
            {/* Header - Reused from layout/page or just simplified for now as per design which doesn't explicitly show the full nav in the body snippet, 
                but assuming we keep the app shell. The snippet above only had <main>, so we'll wrap it.
            */}
            {/* Header */}
            {/* Header */}
            <Header activePage="explore" />

            <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Main Content */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <article className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest">
                                        <span>Quest ID: #{quest.id.slice(0, 6)}</span>
                                        <span className="text-slate-300 dark:text-slate-700">•</span>
                                        <span>{quest.category || 'Core Infrastructure'}</span>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                                        {quest.title}
                                    </h1>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30">
                                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[16px] mr-1.5 icon-filled">bolt</span>
                                            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">{quest.difficulty || 'Advanced'}</span>
                                        </div>

                                        {/* Dynamic Points Badge */}
                                        {(() => {
                                            const pts = quest.points || 0;
                                            let colors = 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300';
                                            let iconColor = 'text-gray-500';

                                            if (pts >= 401) {
                                                colors = 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/30';
                                                iconColor = 'text-indigo-600 dark:text-indigo-400';
                                            } else if (pts >= 151) {
                                                colors = 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30';
                                                iconColor = 'text-green-600 dark:text-green-400';
                                            } else if (pts >= 61) {
                                                colors = 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30';
                                                iconColor = 'text-blue-600 dark:text-blue-400';
                                            }

                                            return (
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full border ${colors}`}>
                                                    <span className={`material-symbols-outlined ${iconColor} text-[16px] mr-1.5 icon-filled`}>auto_awesome</span>
                                                    <span className="text-xs font-bold uppercase tracking-wide">{quest.points || 500} XP</span>
                                                </div>
                                            );
                                        })()}

                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 font-mono">Backend / Node.js</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 pt-8 space-y-10">
                                <section>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">info</span> Briefing
                                    </h3>
                                    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                        <p>{quest.description}</p>
                                    </div>
                                </section>

                                {/* Static Deliverables as per design - in real app this would be part of quest data */}
                                <section className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6 border border-slate-100 dark:border-slate-800">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span> Deliverables
                                    </h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3 group">
                                            <div className="mt-0.5 size-5 rounded border-2 border-slate-300 dark:border-slate-600 group-hover:border-primary transition-colors flex items-center justify-center shrink-0"></div>
                                            <span className="text-slate-700 dark:text-slate-300 leading-snug">Audit current JWT implementation for security vulnerabilities.</span>
                                        </li>
                                        {/* Mock items */}
                                        <li className="flex items-start gap-3 group">
                                            <div className="mt-0.5 size-5 rounded border-2 border-slate-300 dark:border-slate-600 group-hover:border-primary transition-colors flex items-center justify-center shrink-0"></div>
                                            <span className="text-slate-700 dark:text-slate-300 leading-snug">Achieve &gt;90% unit test coverage.</span>
                                        </li>
                                    </ul>
                                </section>

                                {/* Submission Section or Join/Drop Actions */}
                                <section className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ready to level up?</h3>
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${isSnatched ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                            {isSnatched ? 'Active' : 'Available'}
                                        </span>
                                    </div>

                                    <QuestAction questId={quest.id} isSnatched={isSnatched} />

                                </section>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        {/* Time Remaining */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-md border border-slate-100 dark:border-slate-800 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Time Remaining</h4>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center border border-slate-100 dark:border-slate-800">
                                    <span className="block text-2xl font-mono font-bold text-slate-900 dark:text-white">02</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Days</span>
                                </div>
                                <div className="flex items-center text-slate-300 dark:text-slate-600 text-xl font-bold">:</div>
                                <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center border border-slate-100 dark:border-slate-800">
                                    <span className="block text-2xl font-mono font-bold text-slate-900 dark:text-white">04</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hrs</span>
                                </div>
                                <div className="flex items-center text-slate-300 dark:text-slate-600 text-xl font-bold">:</div>
                                <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center border border-slate-100 dark:border-slate-800">
                                    <span className="block text-2xl font-mono font-bold text-slate-900 dark:text-white">12</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mins</span>
                                </div>
                            </div>
                        </div>

                        {/* Squad Members */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-md border border-slate-100 dark:border-slate-800 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Squad Members</h4>
                                </div>
                                <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${quest.snatches.length >= quest.maxSnatchers ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'}`}>
                                    {quest.snatches.length}/{quest.maxSnatchers}
                                </span>
                            </div>
                            <div className="space-y-4">
                                {quest.snatches.map((snatch) => (
                                    <div key={snatch.user.id} className="flex items-center gap-3">
                                        {snatch.user.avatar ? (
                                            <img src={snatch.user.avatar} alt={snatch.user.name || 'User'} className="size-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                                                {(snatch.user.name || snatch.user.handle || '?')[0].toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                {snatch.user.name || snatch.user.handle || 'Anonymous'}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">{snatch.user.role || 'Member'}</p>
                                        </div>
                                    </div>
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
                        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-md border border-slate-100 dark:border-slate-800 p-5">
                            <div className="flex gap-3 items-start">
                                <div className="bg-[#5865F2]/10 p-2 rounded-lg shrink-0 flex items-center justify-center">
                                    <svg aria-hidden="true" className="size-5 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2763-3.68-.2763-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.0991.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.699.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1569 2.4189z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">
                                        Need help? Join the discussion on our <a className="text-primary hover:underline font-semibold" href="#">Discord channel</a>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}
