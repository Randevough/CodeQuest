import Link from 'next/link'
import { Header } from '@/components/Header'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black font-['Plus_Jakarta_Sans'] text-[#171717] dark:text-white flex flex-col antialiased relative">
            <Header activePage="explore" />
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="text-center max-w-md w-full">
                    <div className="mb-6 flex justify-center">
                        <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center transform rotate-12 shadow-sm border border-slate-300 dark:border-slate-700">
                            <span className="material-symbols-outlined text-[48px] text-slate-400 dark:text-slate-500 transform -rotate-12">map</span>
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">404</h1>
                    <h2 className="text-xl font-bold mb-4">Mission Not Found</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                        The coordinates you entered don't map to any known sector. The mission may have been archived or never existed.
                    </p>
                    <Link href="/" className="inline-block py-3 px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-sm">
                        Return to Base
                    </Link>
                </div>
            </main>
        </div>
    )
}
