import Link from 'next/link'
import { LeaderboardUser } from '@/types/user'
import Image from 'next/image'

interface LeaderboardTableProps {
    users: LeaderboardUser[]
    page: number
    pageSize: number
}

export function LeaderboardTable({ users, page, pageSize }: LeaderboardTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-black/20">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-20" scope="col">Rank</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider" scope="col">Member</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell" scope="col">Quests</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider" scope="col">Total Points</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-surface-dark">
                    {users.map((user, index) => {
                        const rank = (page - 1) * pageSize + index + 1

                        // Left border accent for top 3, transparent for rest
                        const borderAccent =
                            rank === 1 ? 'border-l-4 border-l-amber-400' :
                                rank === 2 ? 'border-l-4 border-l-slate-300' :
                                    rank === 3 ? 'border-l-4 border-l-orange-300' :
                                        'border-l-4 border-l-transparent'

                        const rowClass = `${borderAccent} hover:bg-slate-50/80 dark:hover:bg-white/5 hover:shadow-sm transition-all group`

                        let rankBadge = <span className="font-mono text-sm font-medium text-slate-400 dark:text-slate-500">{rank.toString().padStart(2, '0')}</span>

                        if (rank === 1) {
                            rankBadge = (
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-amber-500 dark:text-amber-400 text-xl icon-filled">emoji_events</span>
                                    <span className="font-mono text-base font-bold text-amber-600 dark:text-amber-400">01</span>
                                </div>
                            )
                        } else if (rank === 2) {
                            rankBadge = (
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-400 text-xl icon-filled">military_tech</span>
                                    <span className="font-mono text-base font-bold text-slate-500 dark:text-slate-300">02</span>
                                </div>
                            )
                        } else if (rank === 3) {
                            rankBadge = (
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-400 dark:text-orange-400 text-xl icon-filled">workspace_premium</span>
                                    <span className="font-mono text-base font-bold text-orange-500 dark:text-orange-400">03</span>
                                </div>
                            )
                        }

                        return (
                            <tr key={user.id} className={rowClass}>
                                <td className={`px-6 py-4 whitespace-nowrap ${rank > 3 ? 'pl-10' : ''}`}>
                                    {rankBadge}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link href={`/profile/${user.id}`} className="flex items-center group/user hover:opacity-80 transition-opacity">
                                        <div className={`flex-shrink-0 ${rank <= 3 ? 'size-10 ring-2' : 'size-9'} rounded-full overflow-hidden ${rank === 1 ? 'ring-amber-400' : rank === 2 ? 'ring-slate-300 dark:ring-slate-500' : rank === 3 ? 'ring-orange-300 dark:ring-orange-600' : 'bg-slate-100'}`}>
                                            <Image alt="Member Avatar" width={40} height={40} className="h-full w-full object-cover" src={user.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=fallback"} />
                                        </div>
                                        <div className="ml-4">
                                            <div className={`text-sm ${rank <= 3 ? 'font-bold' : 'font-medium'} text-slate-900 dark:text-white group-hover/user:text-orange-600 dark:group-hover/user:text-orange-400 transition-colors`}>
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                                {user.role || 'Member'}
                                            </div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden md:table-cell">
                                    {user.completedQuests} completed
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-1.5 text-sm font-bold font-mono group-hover:scale-105 transition-transform origin-right">
                                        <Image src="/icon.png" alt="Points" width={16} height={16} className="object-contain" />
                                        <span className="text-slate-900 dark:text-white">{user.points.toLocaleString('en-US')}</span>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
