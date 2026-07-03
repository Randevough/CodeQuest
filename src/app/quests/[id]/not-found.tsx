import Link from 'next/link'

export default function QuestNotFound() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-black font-['Plus_Jakarta_Sans'] min-h-[600px]">
            <div className="text-center max-w-md w-full">
                <div className="mb-6 flex justify-center">
                    <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-slate-300 dark:border-slate-700 relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-300 dark:bg-slate-700 opacity-20 animate-pulse"></div>
                        <span className="material-symbols-outlined text-[48px] text-slate-400 dark:text-slate-500 relative z-10">search_off</span>
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Quest Not Found</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                    The requested quest module could not be located. It may have been archived by the administrators or never existed.
                </p>
                <Link href="/" className="inline-block py-3 px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-sm">
                    Return to Available Quests
                </Link>
            </div>
        </div>
    )
}
