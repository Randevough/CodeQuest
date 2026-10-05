import { Providers } from "@/components/Providers";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { auth } from "@/auth";
import { DevRoleSwitcher } from "@/components/dev/DevRoleSwitcher";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
      </head>
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} font-sans antialiased bg-gray-50 dark:bg-black text-gray-900 dark:text-white`}
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
