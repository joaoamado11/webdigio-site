import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin — Webdigio', robots: 'noindex,nofollow' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Unauthenticated: middleware already handles the redirect to /admin/login.
  // Here we just render children without the sidebar (login page renders itself).
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <AdminSidebar email={user.email ?? ''} />
      <main className="flex-1 overflow-auto p-6 md:p-10">{children}</main>
    </div>
  );
}
