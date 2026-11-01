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
        <div role="region" aria-label="Member rankings" tabIndex={0} className="overflow-x-auto styled-scrollbar">
            <table className="min-w-[520px] w-full divide-y divide-border">
                <caption className="sr-only">Members ranked by approved quest points</caption>
                <thead className="bg-surface">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted uppercase tracking-wider w-20" scope="col">Rank</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted uppercase tracking-wider" scope="col">Member</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted uppercase tracking-wider hidden md:table-cell" scope="col">Quests</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-muted uppercase tracking-wider" scope="col">Total Points</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface dark:bg-surface-dark">
                    {users.map((user, index) => {
                        const rank = (page - 1) * pageSize + index + 1

                        // Left border accent for top 3, transparent for rest
                        const borderAccent = ''

                        const rowClass = `${borderAccent} hover:bg-surface-raised  transition-all group`

                        let rankBadge = <span className="font-mono text-sm font-medium text-muted">{rank.toString().padStart(2, '0')}</span>

                        if (rank === 1) {
                            rankBadge = (
                                <div className="flex items-center gap-2">
                                    <span aria-hidden="true" className="material-symbols-outlined text-warning text-xl icon-filled">emoji_events</span>
                                    <span className="font-mono text-base font-bold text-warning">01</span>
                                </div>
                            )
                        } else if (rank === 2) {
                            rankBadge = (
                                <div className="flex items-center gap-2">
                                    <span aria-hidden="true" className="material-symbols-outlined text-muted text-xl icon-filled">military_tech</span>
                                    <span className="font-mono text-base font-bold text-muted">02</span>
                                </div>
                            )
                        } else if (rank === 3) {
                            rankBadge = (
                                <div className="flex items-center gap-2">
                                    <span aria-hidden="true" className="material-symbols-outlined text-foreground text-xl icon-filled">workspace_premium</span>
                                    <span className="font-mono text-base font-bold text-foreground">03</span>
                                </div>
                            )
                        }

                        return (
                            <tr key={user.id} className={rowClass}>
                                <td className={`px-6 py-4 whitespace-nowrap ${rank > 3 ? 'pl-10' : ''}`}>
                                    {rankBadge}
                                </td>
                                <td className="px-4 py-4 min-w-[180px] break-words">
                                    <Link href={`/profile/${user.id}`} className="min-h-11 flex items-center group/user hover:opacity-80 transition-opacity">
                                        <div className={`flex-shrink-0 ${rank <= 3 ? 'size-10 ring-2' : 'size-9'} rounded-full overflow-hidden ${rank === 1 ? 'ring-focus' : rank === 2 ? 'ring-focus' : rank === 3 ? 'ring-focus' : 'bg-surface'}`}>
                                            <Image alt="Member Avatar" width={40} height={40} className="h-full w-full object-cover" src={user.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=fallback"} />
                                        </div>
                                        <div className="ml-4">
                                            <div className={`text-sm ${rank <= 3 ? 'font-bold' : 'font-medium'} text-foreground group-hover/user:text-foreground transition-colors`}>
                                                {user.name}
                                            </div>
                                            <div className="text-sm text-muted capitalize">
                                                {user.role || 'Member'}
                                            </div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted hidden md:table-cell">
                                    {user.completedQuests} completed
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-1.5 text-sm font-bold font-mono transition-transform origin-right">
                                        <Image src="/icon.png" alt="Points" width={16} height={16} className="object-contain" />
                                        <span className="text-foreground">{user.points.toLocaleString('en-US')}</span>
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
