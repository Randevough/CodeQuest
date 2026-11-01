import { getUserActiveSnatches } from "@/actions/quest"
import { Layers } from "lucide-react"

export async function WorkspaceHeader() {
    const activeSnatches = await getUserActiveSnatches()
    const activeCount = activeSnatches.length
    const isFull = activeCount >= 3

    return (
        <div className="flex items-end justify-between mb-8">
            <div>
                <h1 className="tracking-tight text-foreground">My Workspace</h1>
                <p className="text-muted text-sm mt-1">Manage your active quests and track your progress</p>
            </div>
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-mono font-semibold tracking-widest ${isFull
                ? 'bg-surface text-foreground border-border'
                : 'bg-surface dark:bg-surface-dark text-muted border-border'
                }`}>
                <Layers className="w-4 h-4 text-primary" aria-hidden="true" />
                <span>SLOTS {activeCount} / 3</span>
            </div>
        </div>
    )
}
