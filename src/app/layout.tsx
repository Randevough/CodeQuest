import { Providers } from "@/components/Providers";
import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";
import { Toaster } from 'sonner';
import { auth } from "@/auth";
import { DevRoleSwitcher } from "@/components/dev/DevRoleSwitcher";



export const metadata: Metadata = {
  title: 'CodeQuest',
  description: 'CodeQuest platform',
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
