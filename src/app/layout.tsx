import { Providers } from "@/components/Providers";
import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";
import { Toaster } from 'sonner';
import { auth } from "@/auth";
import { DevRoleSwitcher } from "@/components/dev/DevRoleSwitcher";



export const metadata: Metadata = {
  metadataBase: new URL('https://codequest.dev'),
  title: {
    default: 'CodeQuest — Gamified Coding Platform',
    template: '%s | CodeQuest',
  },
  description: 'Gamified coding platform for students to snatch quests, build features, and earn ranks.',
  openGraph: {
    title: 'CodeQuest',
    description: 'Gamified coding platform for students to snatch quests, build features, and earn ranks.',
    url: 'https://codequest.dev',
    siteName: 'CodeQuest',
    type: 'website',
  },
  alternates: {
    canonical: '/',
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Preload critical font */}
        <link
          rel="preload"
          href="/fonts/Geist-Variable.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        {/* FOUT-prevention: apply theme class synchronously before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('cq-theme');if(t==='dark'){document.documentElement.classList.add('dark')}else if(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className="antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        <Providers session={session}>
          {children}
          <Toaster richColors position="top-center" />
          {process.env.NODE_ENV === 'development' && <DevRoleSwitcher />}
        </Providers>
      </body>
    </html>
  );
}
