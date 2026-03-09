import { UserStanding } from "@/components/leaderboard/UserStanding"

export async function WorkspaceSidebar() {
    return (
        <aside className="lg:col-span-4 space-y-6">
            {/* Your Standing — replaces Quick Stats */}
            <UserStanding />

            <div className="bg-gradient-to-br from-orange-600 to-orange-400 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-sm mb-2 text-white">Need a teammate?</h3>
                    <p className="text-xs text-white mb-4 leading-relaxed">Most advanced quests are easier with a partner. Check Discord to find a buddy.</p>
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-medium transition-colors text-white">
                        Join Discord Server
                    </button>
                </div>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            </div>
        </aside>
    )
}
