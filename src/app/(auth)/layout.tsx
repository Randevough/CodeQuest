import "../custom-auth.css";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-background text-foreground">
        <header className="page-container flex items-center justify-between gap-4 py-6"><Link href="/" className="flex min-h-11 items-center gap-2 font-display text-xl"><Image src="/icon-big.png" alt="" width={32} height={32} />CodeQuest</Link><ThemeToggle /></header>
        <main className="page-container py-8 sm:py-12"><div className="auth-panel mx-auto w-full max-w-lg rounded-card border border-border bg-surface p-6 sm:p-8">{children}</div></main>
    </div>;
}
