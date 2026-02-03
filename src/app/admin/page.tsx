import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function AdminOverviewPage() {
    // We can keep the real counts if we want, or hardcode them to match the design exactly as requested.
    // The user said "implement that design (hardcoded) to our system".
    // I will stick to the hardcoded values from the HTML for the visual elements,
    // but maybe keep the dynamic sidebar counts since they are passed in layout.
    // Wait, the prompt says "implement that design (hardcoded)". I will use hardcoded values for the page content.

    return (
        <>
            <header className="h-16 flex-shrink-0 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-8 z-10 transition-colors">
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Dashboard Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span>Last 30 Days</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark transition-colors">
                <div className="mx-auto max-w-7xl flex flex-col gap-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="text-slate-500 text-sm font-medium mb-2">Total Members</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">2,453</div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="text-slate-500 text-sm font-medium mb-2">Live Quests</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">34</div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="text-slate-500 text-sm font-medium mb-2">Pending Reviews</div>
                                <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">12</div>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="text-slate-500 text-sm font-medium mb-2">Total Sparkles</div>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">892k</span>
                                <span className="text-2xl">✨</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Productivity Trend */}
                        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Monthly Productivity Trend</h3>
                                <div className="text-xs text-slate-400 font-medium">Last 30 Days</div>
                            </div>
                            <div className="h-64 w-full relative flex items-end justify-between gap-6 px-4">
                                <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-t-sm relative group h-[45%]">
                                    <div className="absolute -top-8 w-full text-center text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">840</div>
                                    <div className="h-full bg-accent opacity-40 rounded-t-sm w-full absolute bottom-0"></div>
                                    <div className="h-0 group-hover:h-full bg-accent transition-all duration-500 rounded-t-sm w-full absolute bottom-0"></div>
                                    <div className="absolute -bottom-6 w-full text-center text-xs text-slate-400">Week 1</div>
                                </div>
                                <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-t-sm relative group h-[65%]">
                                    <div className="absolute -top-8 w-full text-center text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">1,215</div>
                                    <div className="h-full bg-accent opacity-70 rounded-t-sm w-full absolute bottom-0"></div>
                                    <div className="h-0 group-hover:h-full bg-accent transition-all duration-500 rounded-t-sm w-full absolute bottom-0"></div>
                                    <div className="absolute -bottom-6 w-full text-center text-xs text-slate-400">Week 2</div>
                                </div>
                                <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-t-sm relative group h-[85%]">
                                    <div className="absolute -top-8 w-full text-center text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">1,892</div>
                                    <div className="h-full bg-accent rounded-t-sm w-full absolute bottom-0"></div>
                                    <div className="absolute -bottom-6 w-full text-center text-xs text-slate-400">Week 3</div>
                                </div>
                                <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-t-sm relative group h-[55%]">
                                    <div className="absolute -top-8 w-full text-center text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">1,024</div>
                                    <div className="h-full bg-accent opacity-50 rounded-t-sm w-full absolute bottom-0"></div>
                                    <div className="h-0 group-hover:h-full bg-accent transition-all duration-500 rounded-t-sm w-full absolute bottom-0"></div>
                                    <div className="absolute -bottom-6 w-full text-center text-xs text-slate-400">Week 4</div>
                                </div>
                            </div>
                        </div>

                        {/* Category Distribution */}
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Category Distribution</h3>
                            <div className="flex-1 flex items-center justify-center relative">
                                <svg className="transform -rotate-90 w-48 h-48" viewBox="0 0 100 100">
                                    <circle className="opacity-90" cx="50" cy="50" fill="transparent" r="40" stroke="#4F46E5" strokeDasharray="100 151" strokeDashoffset="0" strokeWidth="12"></circle>
                                    <circle className="opacity-90" cx="50" cy="50" fill="transparent" r="40" stroke="#3b82f6" strokeDasharray="88 163" strokeDashoffset="-100" strokeWidth="12"></circle>
                                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#cbd5e1" strokeDasharray="63 188" strokeDashoffset="-188" strokeWidth="12"></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">34</span>
                                    <span className="text-xs text-slate-500">Total Quests</span>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col gap-3">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                                        <span className="text-slate-600 dark:text-slate-400">Frontend</span>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">40%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                        <span className="text-slate-600 dark:text-slate-400">Backend</span>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">35%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                                        <span className="text-slate-600 dark:text-slate-400">DevOps</span>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">25%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Leaderboard Preview */}
                        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Leaderboard Preview</h3>
                                <button className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">View Full</button>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-3 w-16 text-center">Rank</th>
                                            <th className="px-6 py-3">Student</th>
                                            <th className="px-6 py-3 text-right">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-light dark:divide-border-dark text-sm">
                                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-3 text-center">
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 font-bold text-xs">1</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <img alt="Avatar" className="w-8 h-8 rounded-full border border-border-light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeQXoQNSTdFPsyahwYg9aRbnH2lpTSRZu8KMsUKRIE8tDepyasaLodtLgAGHHaMs6vq1YZAPNMX_UgOQtaZFjmq1HkFQVCai84QCg_N8Q_QTQRllngWtLUbbUwbzG5hxsjY_M4zZi-7s62MIp_13dV4DO4eE9EsVJoolbaCcNA7_PNhYukx4OyFt0hDVIU3M_0eRhyqhuifT8By0X2yrp468JziLFixH8dwkeeRo822m3lOyTFrXwTVua5E5nPx7ddIOv_kGAs7Ufj" />
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">Sarah Smith</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                                2,450 ✨
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-3 text-center">
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold text-xs">2</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">JD</div>
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">John Doe</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                                2,310 ✨
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-3 text-center">
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold text-xs">3</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">MK</div>
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">Mike K.</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                                2,100 ✨
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-3 text-center text-slate-400 font-medium">4</td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                        <span className="material-symbols-outlined text-[16px]">person</span>
                                                    </div>
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">Alex R.</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                                1,950 ✨
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-3 text-center text-slate-400 font-medium">5</td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                        <span className="material-symbols-outlined text-[16px]">person</span>
                                                    </div>
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">Priya S.</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                                1,820 ✨
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark shadow-sm flex flex-col">
                            <div className="px-6 py-4 border-b border-border-light dark:border-border-dark">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Quick Actions</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 gap-4 flex-1">
                                <Link href="/admin/manage-quests/create" className="group flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-accent hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all text-left">
                                    <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/20 text-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">add_circle</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">Create Quest</span>
                                        <span className="text-xs text-slate-500">Draft new challenge</span>
                                    </div>
                                </Link>
                                <Link href="/admin/submissions" className="group flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-accent hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all text-left">
                                    <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/20 text-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">rate_review</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">Review Submissions</span>
                                        <span className="text-xs text-slate-500">12 Pending items</span>
                                    </div>
                                </Link>
                                <Link href="/admin/members" className="group flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-accent hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all text-left">
                                    <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/20 text-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">manage_accounts</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">Manage Members</span>
                                        <span className="text-xs text-slate-500">View user directory</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
