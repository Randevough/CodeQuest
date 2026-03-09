import { Header } from '@/components/Header'
import { WorkspaceQuestGrid } from '@/components/workspace/WorkspaceQuestGrid'
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar'
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'

export default function WorkspacePage() {
    return (
        <div className="min-h-screen text-[#171717] dark:text-white flex flex-col antialiased relative [overflow-x:clip]">

            {/* Background: dot-matrix + dual mesh aura — copied from Explore Quests */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[#fafafa] dark:bg-black" />
                <div className="absolute inset-0 opacity-40" style={{
                    backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top left, rgba(249,115,22,0.15), transparent 60%)' }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at bottom right, rgba(100,116,139,0.15), transparent 60%)' }} />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header activePage="workspace" />

                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
