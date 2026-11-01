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

    // Check if user is authenticated and has Admin role
    if (!session || !session.user || session.user.role !== 'Admin') {
        redirect('/');
    }

    // Better: Check Role
    // if (session?.user?.role !== 'Admin') redirect('/');

    let memberCount = 0;
    let submissionCount = 0;
    let adminUser = null;
    let loadFailed = false;

    try {
        memberCount = await prisma.user.count();

        // Count pending and revision needed submissions
        submissionCount = await prisma.snatch.count({
            where: {
                status: { in: ['SUBMITTED', 'REVISION_NEEDED'] }
            }
        });

        // Fetch admin user data for sidebar
        if (session.user.email) {
            adminUser = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                    points: true,
                    handle: true,
                    image: true
                }
            });
        }
    } catch (error) {
        loadFailed = true;
        console.error('AdminLayout database fetch notice (fallback used):', error);
    }

    const effectiveAdminUser = adminUser || {
        id: session.user.id || 'dev-admin-id',
        name: session.user.name || 'Admin Developer',
        email: session.user.email || 'codequest@cyber-univ.ac.id',
        avatar: session.user.image || 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminDev',
        points: session.user.points || 1337,
        handle: 'admin_dev',
        image: session.user.image || 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminDev'
    };

    return (
        <AdminSidebarProvider>
            <div className="flex h-dvh w-full bg-background text-foreground font-sans">
                {/* Material Symbols support - ensure it's loaded in root layout or here */}
                <AdminSidebar memberCount={memberCount} submissionCount={submissionCount} user={effectiveAdminUser} />
                <main className="min-w-0 flex-1 flex flex-col h-full overflow-hidden relative">
                    {loadFailed && <p role="alert" className="border-b border-control-border bg-surface px-4 py-3 text-warning">Some admin data could not load. Sidebar counts and profile may show fallback values. Refresh to retry.</p>}
                    {children}
                </main>
            </div>
        </AdminSidebarProvider>
    );
}