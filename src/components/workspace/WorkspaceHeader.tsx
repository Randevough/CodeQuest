import { getUserActiveSnatches } from "@/actions/quest"

export async function WorkspaceHeader() {
    const activeSnatches = await getUserActiveSnatches()
    const activeCount = activeSnatches.length
    const isFull = activeCount >= 3

    return (
        <div className="flex items-end justify-between mb-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">My Workspace</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your active quests and track your progress.</p>
            </div>
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${isFull
                    ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
                    : 'bg-white text-gray-600 border-gray-200 dark:bg-surface-dark dark:text-gray-300 dark:border-gray-800'
                }`}>
                <span className="material-symbols-outlined text-[18px]">list_alt</span>
                <span>Quest Slots: {activeCount} / 3</span>
            </div>
        </div>
    )
}
