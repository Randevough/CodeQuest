import { Header } from '@/components/Header'
import { WorkspaceQuestGrid } from '@/components/workspace/WorkspaceQuestGrid'
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar'

export default function WorkspacePage() {
    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-black text-[#171717] dark:text-white font-display flex flex-col antialiased">
            <Header activePage="workspace" />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">My Workspace</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your active quests and track your progress.</p>
                    </div>
                    <div className="hidden md:block text-sm text-gray-500">
                        Academic Term: <span className="font-medium text-gray-900 dark:text-white">Fall 2023</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <WorkspaceQuestGrid />
                    <WorkspaceSidebar />
                </div>
            </main>
        </div>
    )
}
