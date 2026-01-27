
import { prisma } from "@/lib/db"
import { manualReset } from "@/actions/admin"
import Link from "next/link"

export default async function MemberDirectoryPage({
    searchParams,
}: {
    searchParams: { q?: string; page?: string }
}) {
    const query = searchParams.q || ""
    const page = Number(searchParams.page) || 1
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

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <header className="h-16 flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10">
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Member Directory</h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* Invite Member button removed as per request */}
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-900">
                <div className="mx-auto max-w-6xl flex flex-col gap-6">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                            <form className="relative group w-full sm:max-w-xs">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </span>
                                <input
                                    name="q"
                                    defaultValue={query}
                                    className="w-full h-10 pl-10 pr-4 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 placeholder:text-slate-400 transition-all shadow-sm"
                                    placeholder="Search members..."
                                    type="text"
                                />
                            </form>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[30%]">Name</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[10%]">Points</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[15%]">Quests</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[10%]">Role</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[15%]">Cooldown</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-[20%]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {users.map((user) => {
                                        const hasPenalty = user.penalties.length > 0;
                                        const penalty = hasPenalty ? user.penalties[0] : null;
                                        // Simple duration calc (mock)
                                        const timeLeft = penalty ? "2h 45m" : "";

                                        return (
                                            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold ring-2 ring-white dark:ring-slate-800">
                                                            {user.name?.[0] || user.email[0].toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name || 'Unknown'}</span>
                                                            <span className="text-xs text-slate-500">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-sm font-mono text-slate-600 dark:text-slate-300">{user.points.toLocaleString()}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-sm text-slate-600 dark:text-slate-300">{user.completedQuests} Completed</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.role === 'Admin'
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                                                        }`}>
                                                        {user.role || 'Member'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {hasPenalty ? (
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30">
                                                            <span className="material-symbols-outlined text-[14px]">lock</span>
                                                            <span className="text-xs font-medium">Active</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">Inactive</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="px-2.5 py-1.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors whitespace-nowrap">
                                                            Edit Profile
                                                        </button>
                                                        {hasPenalty && (
                                                            <form action={async () => {
                                                                'use server'
                                                                await manualReset(user.id)
                                                            }}>
                                                                <button className="px-2.5 py-1.5 rounded text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">
                                                                    Manual Reset
                                                                </button>
                                                            </form>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Footer */}
                        <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800">
                            <p className="text-sm text-slate-500">Showing <span className="font-medium text-slate-900 dark:text-slate-100">{skip + 1}</span> to <span className="font-medium text-slate-900 dark:text-slate-100">{Math.min(skip + limit, total)}</span> of <span className="font-medium text-slate-900 dark:text-slate-100">{total}</span> results</p>
                            {/* Pagination Controls Placeholder */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
