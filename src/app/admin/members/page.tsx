import { prisma } from "@/lib/db"

import Link from "next/link"
import { Pagination } from "@/components/Pagination"
import { MemberActionMenu } from "@/components/admin/MemberActionMenu"
import { MobileSidebarTrigger } from "@/components/admin/MobileSidebarTrigger"
import { SearchInput } from "@/components/ui/SearchInput"
import Image from "next/image"

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
                },
                _count: {
                    select: {
                        snatches: {
                            where: {
                                status: { in: ['ACCEPTED', 'ARCHIVED'] }
                            }
                        }
                    }
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
        <div className="min-w-0 flex-1 flex flex-col h-full overflow-hidden relative">
            <header className="min-h-16 py-3 gap-3 flex-wrap flex-shrink-0 bg-surface border-b border-border flex items-center justify-between px-4 sm:px-4 sm:px-6 lg:px-8 z-10 transition-all">
                <div className="flex items-center gap-4 transition-all">
                    <MobileSidebarTrigger className="md:hidden" />
                    <h1 className="text-2xl sm:text-3xl text-foreground font-sans">Member Directory</h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* Invite Member button removed as per request */}
                </div>
            </header>
            <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-4 sm:p-6 lg:p-8 bg-surface font-sans">
                <div className="mx-auto max-w-content flex flex-col gap-6">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                            <form className="w-full sm:max-w-xs">
                                <SearchInput
                                    name="q"
                                    aria-label="Search members"
                                    defaultValue={query}
                                    placeholder="Search members"
                                />
                            </form>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-surface border border-border rounded-card shadow-sm min-w-0 overflow-hidden">
                        <div className="max-w-full overflow-x-auto styled-scrollbar" role="region" aria-label="Members table" tabIndex={0}>
                            <table className="w-full min-w-[900px] text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border bg-surface">
                                        <th className="py-3 px-6 text-xs font-bold text-muted uppercase tracking-wider w-[35%] gap-2">Name</th>
                                        <th className="py-3 px-6 text-xs font-bold text-muted uppercase tracking-wider w-[10%]">Points</th>
                                        <th className="py-3 px-6 text-xs font-bold text-muted uppercase tracking-wider w-[10%]">Quests</th>
                                        <th className="py-3 px-6 text-xs font-bold text-muted uppercase tracking-wider w-[15%]">Joined Date</th>
                                        <th className="py-3 px-6 text-xs font-bold text-muted uppercase tracking-wider w-[10%]">Role</th>
                                        <th className="py-3 px-6 text-xs font-bold text-muted uppercase tracking-wider w-[15%]">Cooldown</th>
                                        <th className="py-3 px-6 text-xs font-bold text-muted uppercase tracking-wider text-right w-[5%]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {users.length === 0 && <tr><td colSpan={7} className="px-6 py-8 text-center text-muted">No members match this search.</td></tr>}
                                    {users.map((user) => {
                                        const hasPenalty = user.penalties.length > 0;
                                        const status = hasPenalty ? 'On Cooldown' : 'Active';

                                        return (
                                            <tr key={user.id} className="hover:bg-surface transition-colors group">
                                                <td className="py-4 px-6">
                                                    <Link href={`/profile/${user.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                                        {user.image ? (
                                                            <div className="h-9 w-9 relative rounded-full overflow-hidden ring-2 ring-control-border shrink-0">
                                                                <Image
                                                                    src={user.image}
                                                                    alt={user.name || 'User'}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="h-9 w-9 rounded-full bg-surface flex items-center justify-center text-warning text-xs font-bold ring-2 ring-control-border shrink-0">
                                                                {user.name?.[0] || user.email[0].toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-foreground">{user.name || 'Unknown'}</span>
                                                            <span className="text-xs text-muted">{user.email}</span>
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-1">
                                                        <Image src="/icon.png" alt="Points" width={16} height={16} className="object-contain" />
                                                        <span className="text-sm font-mono text-muted font-bold">{user.points.toLocaleString()}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-sm text-muted font-medium whitespace-nowrap">
                                                        {user._count?.snatches || 0} Completed
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-sm text-muted font-medium font-sans">
                                                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${user.role === 'Admin'
                                                        ? 'bg-surface text-info  '
                                                        : 'bg-surface text-warning  '
                                                        }`}>
                                                        {user.role || 'Member'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {hasPenalty ? (
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface text-warning border border-border">
                                                            <span aria-hidden="true" className="material-symbols-outlined text-[14px]">lock</span>
                                                            <span className="text-xs font-bold whitespace-nowrap">On Cooldown</span>
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface text-success border border-border">
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
                        <div className="border-t border-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-surface gap-4">
                            <p className="text-sm text-muted">Showing <span className="font-bold text-foreground">{total === 0 ? 0 : skip + 1}</span> to <span className="font-bold text-foreground">{Math.min(skip + limit, total)}</span> of <span className="font-bold text-foreground">{total}</span> results</p>
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