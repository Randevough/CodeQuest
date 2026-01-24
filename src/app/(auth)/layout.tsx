import '../globals.css';
import '../custom-auth.css'; // We will create this for custom styles from the HTML
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full flex-row overflow-hidden bg-white text-gray-900 font-display">
            {/* Left Side (Forms) */}
            <div className="flex w-full flex-col bg-white p-8 md:w-1/2 md:p-12 lg:p-16 relative overflow-y-auto">
                <div className="flex items-center mb-8">
                    <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
                        CodeQuest
                    </Link>
                </div>

                <div className="flex flex-1 flex-col justify-center max-w-[420px] w-full mx-auto my-auto">
                    {children}
                </div>
            </div>

            {/* Right Side (Visual) */}
            <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-[#4F46E5] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}>
                </div>

                <div className="relative w-[480px] rounded-xl bg-[#0F0E1B] shadow-2xl border border-white/10 overflow-hidden transform transition-transform hover:scale-[1.02] duration-500">
                    <div className="flex items-center gap-2 border-b border-white/10 bg-[#1a1b26] px-4 py-3">
                        <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
                        <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                        <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
                        <div className="ml-4 text-xs font-mono text-gray-400">bash — 80x24</div>
                    </div>

                    <div className="flex h-[320px] flex-col items-center justify-center bg-[#0F0E1B] p-8 relative">
                        <div className="absolute inset-0 p-6 opacity-20 font-mono text-xs text-[#4F46E5] select-none overflow-hidden leading-relaxed">
                            <span className="block text-blue-400">import</span> &#123; Quest &#125; <span className="block text-blue-400">from</span> &apos;forge&apos;;<br />
                            <span className="block text-purple-400">const</span> user = <span className="text-yellow-300">new</span> Developer();<br />
                            user.level = 1;<br />
                            <span className="block text-blue-400">await</span> user.enter(Quest.daily);<br />
                            <span className="text-gray-500">// Ready to compile...</span><br />
                            console.log(<span className="text-green-400">&quot;Hello World&quot;</span>);<br />
                            <span className="block text-blue-400">return</span> true;
                        </div>

                        <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                            <div className="relative">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-white blur-3xl opacity-20"></div>
                                <span className="material-symbols-outlined text-white text-[80px] glow-effect" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>
                                    auto_awesome
                                </span>
                            </div>
                            <div className="text-center">
                                <p className="font-mono text-sm text-indigo-200 tracking-wider uppercase">System Online</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
