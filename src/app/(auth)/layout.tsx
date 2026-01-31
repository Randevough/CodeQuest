import '../globals.css';
import '../custom-auth.css'; // We will create this for custom styles from the HTML
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full flex-row overflow-hidden bg-white text-gray-900">
            {/* Left Side (Forms) */}
            <div className="flex w-full flex-col bg-white p-8 lg:w-1/2 lg:p-16 relative overflow-y-auto">
                <div className="flex items-center mb-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="/icon-big.png" alt="CodeQuest Logo" className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-xl font-bold tracking-tight text-gray-900 font-[Fira_Sans]">
                            CodeQuest
                        </span>
                    </Link>
                </div>

                <div className="flex flex-1 flex-col justify-center max-w-[420px] w-full mx-auto my-auto">
                    {children}
                </div>
            </div>

            {/* Right Side (Visual) */}
            <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-[#0F172A] relative overflow-hidden">
                {/* Subtle Orange Radial Gradient */}
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}>
                </div>

                {/* Floating Terminal Window */}
                <div className="relative w-[480px] rounded-xl bg-[#1E293B]/80 backdrop-blur-xl shadow-2xl border border-white/5 overflow-hidden transform transition-transform hover:scale-[1.01] duration-500 group ring-1 ring-black/50">
                    <div className="flex items-center gap-2 border-b border-white/5 bg-[#0F172A]/50 px-4 py-3">
                        <div className="h-3 w-3 rounded-full bg-[#EF4444]"></div>
                        <div className="h-3 w-3 rounded-full bg-[#F59E0B]"></div>
                        <div className="h-3 w-3 rounded-full bg-[#10B981]"></div>
                        <div className="ml-4 text-xs font-mono text-slate-500">bash — 80x24</div>
                    </div>

                    <div className="flex flex-col p-8 relative bg-[#0F172A]/90">
                        <div className="font-mono text-sm text-slate-300 leading-relaxed font-medium">
                            <span className="block"><span className="text-[#EA580C]">import</span> &#123; <span className="text-purple-400">Coffee</span>, <span className="text-purple-400">CodeQuest</span> &#125; <span className="text-[#EA580C]">from</span> <span className="text-emerald-400">'student-life'</span>;</span>
                            <span className="block mt-4"><span className="text-[#EA580C]">while</span> (<span className="text-sky-300">isDeadlineMepet</span>) &#123;</span>
                            <span className="block pl-4"><span className="text-[#EA580C]">await</span> <span className="text-blue-400">brewCoffee</span>();</span>
                            <span className="block pl-4"><span className="text-[#EA580C]">if</span> (<span className="text-purple-400">CodeQuest</span>.<span className="text-blue-400">isPointsAvailable</span>(<span className="text-emerald-400">'450pts'</span>)) &#123;</span>
                            <span className="block pl-8"><span className="text-purple-400">CodeQuest</span>.<span className="text-blue-400">submit</span>(&#123; <span className="text-sky-300">status</span>: <span className="text-emerald-400">'Manifesting Accepted'</span> &#125;);</span>
                            <span className="block pl-4">&#125;</span>
                            <span className="block">&#125;</span>
                            <span className="block mt-4"><span className="text-[#EA580C]">return</span> <span className="text-purple-400">true</span>;</span>
                            <span className="block mt-1 text-[#EA580C] animate-pulse">_</span>
                        </div>
                    </div>
                </div>

                {/* Subtitle Slogan */}
                <div className="mt-12 text-center relative z-10">
                    <p className="font-[Plus_Jakarta_Sans] text-slate-200 text-lg tracking-wide font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                        In CodeQuest We Trust
                    </p>
                </div>
            </div>
        </div>
    );
}
