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
    default: 'CodeQuest: quest board of UKM Coding Cyber University',
    template: '%s | CodeQuest',
  },
  description: 'Take a real project quest, build it in your own Git repository, and get it reviewed by club staff. Approved quests earn points and badges.',
  openGraph: {
    title: 'CodeQuest',
    description: 'Take a real project quest, build it in your own Git repository, and get it reviewed by club staff. Approved quests earn points and badges.',
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
    <html lang="en" className={`${fontVariables} dark`} suppressHydrationWarning>
      <head>
        {/* Preload critical font */}
        <link
          rel="preload"
          href="/fonts/Geist-Variable.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        {/* Dark is the default. Only an explicit saved 'light' choice removes it, before React hydrates. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('cq-theme')==='light'){document.documentElement.classList.remove('dark')}}catch(e){}})()`,
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
