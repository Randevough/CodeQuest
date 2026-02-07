import { Header } from '@/components/Header'
import { WorkspaceQuestGrid } from '@/components/workspace/WorkspaceQuestGrid'
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar'
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'

export default function WorkspacePage() {
    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-black text-[#171717] dark:text-white flex flex-col antialiased">
            <Header activePage="workspace" />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <WorkspaceHeader />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <WorkspaceQuestGrid />
                    <WorkspaceSidebar />
                </div>
            </main>
        </div>
    )
}
