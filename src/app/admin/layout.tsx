import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { AdminSidebarProvider } from '@/components/admin/AdminSidebarContext';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session || !session.user || session.user.email !== 'codequest@cyber-univ.ac.id') {
        redirect('/');
    }

    // Better: Check Role
    // if (session?.user?.role !== 'Admin') redirect('/');

    const memberCount = await prisma.user.count();

    // Count pending and revision needed submissions
    const submissionCount = await prisma.snatch.count({
        where: {
            status: { in: ['SUBMITTED', 'REVISION_NEEDED'] }
        }
    });

    return (
        <AdminSidebarProvider>
            <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans">
                {/* Material Symbols support - ensure it's loaded in root layout or here */}
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
                <AdminSidebar memberCount={memberCount} submissionCount={submissionCount} />
                <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                    {children}
                </main>
            </div>
        </AdminSidebarProvider>
    );
}
