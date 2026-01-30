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
            <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}>
                </div>

                <div className="relative w-[480px] rounded-xl bg-white/10 backdrop-blur-md shadow-2xl border border-white/20 overflow-hidden transform transition-transform hover:scale-[1.02] duration-500 group">
                    <div className="flex items-center gap-2 border-b border-white/10 bg-black/20 px-4 py-3">
                        <div className="h-3 w-3 rounded-full bg-[#EF4444]"></div>
                        <div className="h-3 w-3 rounded-full bg-[#F59E0B]"></div>
                        <div className="h-3 w-3 rounded-full bg-[#10B981]"></div>
                        <div className="ml-4 text-xs font-mono text-white/50">bash — 80x24</div>
                    </div>

                    <div className="flex h-[320px] flex-col items-center justify-center bg-black/40 p-8 relative">
                        <div className="absolute inset-0 p-6 opacity-30 font-mono text-xs text-orange-200 select-none overflow-hidden leading-relaxed">
                            <span className="block text-blue-300">import</span> &#123; Quest &#125; <span className="block text-blue-300">from</span> &apos;forge&apos;;<br />
                            <span className="block text-purple-300">const</span> dev = <span className="text-yellow-300">new</span> Developer();<br />
                            dev.level = 99;<br />
                            <span className="block text-blue-300">await</span> dev.snatch(Quest.legendary);<br />
                            <span className="text-gray-400">// Compiling amazing features...</span><br />
                            console.log(<span className="text-emerald-300">&quot;Ship it! 🚀&quot;</span>);<br />
                            <span className="block text-blue-300">return</span> <span className="text-amber-300">true</span>;
                        </div>

                        <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                            <div className="relative">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-orange-500 blur-[64px] opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>
                                <span className="material-symbols-outlined text-white text-[80px] glow-effect drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>
                                    rocket_launch
                                </span>
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight drop-shadow-md">Level Up Your Career</h3>
                                <p className="font-mono text-xs text-orange-100/80 tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full">System Online • v2.0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
