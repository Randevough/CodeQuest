import { Providers } from "@/components/Providers";
import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Removing Geist for Inter
import "./globals.css";
import { Toaster } from 'sonner';
import { auth } from "@/auth";
import { DevRoleSwitcher } from "@/components/dev/DevRoleSwitcher";

// ... (omitted code)

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* FOUT-prevention: apply theme class synchronously before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('cq-theme');if(t==='dark'){document.documentElement.classList.add('dark')}else if(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className="antialiased bg-gray-50 dark:bg-black text-gray-900 dark:text-white"
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
