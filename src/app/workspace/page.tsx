import { Header } from '@/components/Header'
import { WorkspaceQuestGrid } from '@/components/workspace/WorkspaceQuestGrid'
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar'
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'

export default function WorkspacePage() {
    return (
        <div className="min-h-screen text-foreground flex flex-col antialiased relative [overflow-x:clip]">

            {/* Background: dot-matrix + dual mesh aura — copied from Explore Quests */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <Header activePage="workspace" />

                <main className="page-container flex-1 py-8 md:py-12">
                    <WorkspaceHeader />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <WorkspaceQuestGrid />
                        <WorkspaceSidebar />
                    </div>
                </main>
            </div>
        </div>
    )
}
