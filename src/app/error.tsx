'use client'

import { useEffect } from 'react'
import { Header } from '@/components/Header'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black font-['Plus_Jakarta_Sans'] text-[#171717] dark:text-white flex flex-col antialiased relative selection:bg-red-500/30 selection:text-red-900 dark:selection:text-red-100">
            <Header activePage="explore" />
            
            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Tech Grid Background */}
                <div 
                    className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-[0.05] pointer-events-none"
                    style={{ 
                        backgroundImage: 'linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)', 
                        backgroundSize: '32px 32px' 
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-black via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-center gap-10 md:gap-16 p-4">
                    
                    {/* Visual Graphic Side */}
                    <div className="flex-shrink-0 relative group">
                        {/* Animated Glow */}
                        <div className="absolute inset-0 bg-red-500/20 dark:bg-red-500/10 blur-[60px] rounded-full animate-pulse"></div>
                        
                        {/* Hexagon / Container */}
                        <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-2xl border border-red-200 dark:border-red-900/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-2xl flex items-center justify-center overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
                            {/* Decorative Lines */}
                            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent"></div>
                            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>
                            
                            <span className="material-symbols-outlined text-[64px] md:text-[80px] text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]">
                                data_alert
                            </span>
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-red-500/50 rounded-tl-lg transition-all group-hover:-top-4 group-hover:-left-4"></div>
                        <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-red-500/50 rounded-br-lg transition-all group-hover:-bottom-4 group-hover:-right-4"></div>
                    </div>

                    {/* Content Side */}
                    <div className="flex flex-col text-center md:text-left space-y-6 w-full max-w-xl">
                        <div className="space-y-3">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-red-500 font-bold uppercase tracking-wider text-sm mx-auto md:mx-0">
                                <span className="material-symbols-outlined text-[18px]">warning</span>
                                Error Encountered
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Quest <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Interrupted</span>
                            </h2>
                            
                            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                We're having trouble connecting to the server. Our team has been notified and is looking into the issue. Please try again in a few moments.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={() => reset()}
                                className="py-3.5 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">refresh</span>
                                <span>Try Again</span>
                            </button>
                            <a 
                                href="https://ig.me/m/coding.cyberuniversity" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-3.5 px-6 bg-transparent border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">chat</span>
                                Report to IG
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
