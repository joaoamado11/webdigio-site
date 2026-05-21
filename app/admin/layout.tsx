import type { Metadata } from 'next';
import { getAdminUser } from '@/lib/auth/admin';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Webdigio', robots: 'noindex,nofollow' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <AdminSidebar email={user.email} />
      <main className="flex-1 overflow-auto p-6 md:p-10">{children}</main>
    </div>
  );
}
