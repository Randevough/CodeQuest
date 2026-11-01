import Link from 'next/link'

export default function QuestNotFound() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-surface font-sans min-h-[600px]">
            <div className="text-center max-w-md w-full">
                <div className="mb-6 flex justify-center">
                    <div className="w-24 h-24 bg-surface rounded-card break-words flex items-center justify-center border border-border relative overflow-hidden">
                        <div className="absolute inset-0 bg-surface opacity-20 animate-pulse"></div>
                        <span aria-hidden="true" className="material-symbols-outlined text-[48px] text-muted relative z-10">search_off</span>
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Quest Not Found</h2>
                <p className="text-muted mb-8 leading-relaxed">
                    The requested quest module could not be located. It may have been archived by the administrators or never existed.
                </p>
                <Link href="/explore" className="button-secondary">
                    Return to Available Quests
                </Link>
            </div>
        </div>
    )
}
