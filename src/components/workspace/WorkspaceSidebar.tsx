import { UserStanding } from "@/components/leaderboard/UserStanding"

export async function WorkspaceSidebar() {
    return <aside className="lg:col-span-4 min-w-0"><UserStanding /></aside>
}
