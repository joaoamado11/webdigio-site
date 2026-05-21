'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin',           label: 'Dashboard',  icon: '⊞' },
  { href: '/admin/content',   label: 'Content',    icon: '✏️' },
  { href: '/admin/services',  label: 'Services',   icon: '⊛' },
  { href: '/admin/chatbot',   label: 'Chatbot',    icon: '◈' },
  { href: '/admin/seo',       label: 'SEO',        icon: '⊕' },
  { href: '/admin/pricing',   label: 'Pricing',    icon: '◉' },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router   = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside
      className="flex flex-col w-56 shrink-0 border-r py-6 px-4 gap-2"
      style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'var(--color-surface)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <Image src="/assets/simple-logo.png" alt="Webdigio" width={24} height={24} className="h-6 w-auto" />
        <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Webdigio</span>
        <span
          className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold"
          style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}
        >
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/admin' && (pathname ?? '').startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200',
                active ? 'bg-[rgba(59,130,246,0.15)] text-[#60a5fa]' : 'text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]'
              )}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t pt-4 mt-2" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <p className="text-xs px-3 mb-3 truncate" style={{ color: 'var(--color-text-dim)' }}>{email}</p>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer text-left"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
