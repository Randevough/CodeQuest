import { prisma } from "@/lib/db"
import { manualReset } from "@/actions/admin"
import Link from "next/link"
import { Pagination } from "@/components/Pagination"
import { MemberActionMenu } from "@/components/admin/MemberActionMenu"
import { MobileSidebarTrigger } from "@/components/admin/MobileSidebarTrigger"
import Image from "next/image"
import PointsIcon from "@/app/icon.png"

export default async function MemberDirectoryPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string }>
}) {
    const params = await searchParams;
    const query = params.q || ""
    const page = Number(params.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const where = query ? {
        OR: [
            { name: { contains: query } },
            { email: { contains: query } },
        ]
    } : {}

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            include: {
                penalties: {
                    where: { expiresAt: { gt: new Date() } }
                }
            },
            take: limit,
            skip,
            orderBy: { points: 'desc' },
        }),
        prisma.user.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <header className="h-16 flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 z-10 transition-all">
                <div className="flex items-center gap-4 transition-all">
                    <MobileSidebarTrigger className="md:hidden" />
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-['Plus_Jakarta_Sans']">Member Directory</h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* Invite Member button removed as per request */}
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50 dark:bg-slate-900 font-['Plus_Jakarta_Sans']">
                <div className="mx-auto max-w-6xl flex flex-col gap-6">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                            <form className="relative group w-full sm:max-w-xs">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </span>
                                <input
                                    name="q"
                                    defaultValue={query}
                                    className="w-full h-10 pl-10 pr-4 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-500 placeholder:text-slate-400 transition-all shadow-sm"
                                    placeholder="Search members..."
                                    type="text"
                                />
                            </form>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-[35%] gap-2">Name</th>
                                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">Points</th>
                                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">Quests</th>
                                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Joined Date</th>
                                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">Role</th>
                                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Cooldown</th>
                                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[5%]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {users.map((user) => {
                                        const hasPenalty = user.penalties.length > 0;
                                        const status = hasPenalty ? 'On Cooldown' : 'Active';

                                        return (
                                            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400 text-xs font-bold ring-2 ring-white dark:ring-slate-800">
                                                            {user.name?.[0] || user.email[0].toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name || 'Unknown'}</span>
                                                            <span className="text-xs text-slate-500">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-1">
                                                        <Image src={PointsIcon} alt="Points" width={16} height={16} className="object-contain" />
                                                        <span className="text-sm font-mono text-slate-600 dark:text-slate-300 font-bold">{user.points.toLocaleString()}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">{user.completedQuests} Completed</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium font-['Plus_Jakarta_Sans']">
                                                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${user.role === 'Admin'
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                        : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                        }`}>
                                                        {user.role || 'Member'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {hasPenalty ? (
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30">
                                                            <span className="material-symbols-outlined text-[14px]">lock</span>
                                                            <span className="text-xs font-bold whitespace-nowrap">On Cooldown</span>
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
                                                            <span className="text-xs font-bold">Active</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <MemberActionMenu user={{
                                                            id: user.id,
                                                            name: user.name,
                                                            role: user.role,
                                                            status: status
                                                        }} />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Footer */}
                        <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-800 gap-4">
                            <p className="text-sm text-slate-500">Showing <span className="font-bold text-slate-900 dark:text-slate-100">{total === 0 ? 0 : skip + 1}</span> to <span className="font-bold text-slate-900 dark:text-slate-100">{Math.min(skip + limit, total)}</span> of <span className="font-bold text-slate-900 dark:text-slate-100">{total}</span> results</p>
                            <div className="mt-0">
                                <Pagination totalPages={totalPages} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
