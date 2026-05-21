import { createSupabaseAdminClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = createSupabaseAdminClient();

  const [
    { count: serviceCount },
    { count: faqCount },
    { count: industryCount },
  ] = await Promise.all([
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('faq').select('*', { count: 'exact', head: true }),
    supabase.from('industries').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    { label: 'Services', value: serviceCount ?? 0, icon: '⊛' },
    { label: 'FAQ Items', value: faqCount ?? 0,     icon: '?' },
    { label: 'Industries', value: industryCount ?? 0, icon: '⊞' },
  ];

  return (
    <div>
      <h1
        className="text-2xl font-bold mb-8"
        style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
      >
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map(s => (
          <div
            key={s.label}
            className="rounded-xl p-5 flex items-center gap-4"
            style={{ background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>{s.value}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Quick Links</h2>
        <ul className="flex flex-col gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <li><a href="/admin/content"  className="hover:text-blue-400 transition-colors">→ Edit Website Content</a></li>
          <li><a href="/admin/services" className="hover:text-blue-400 transition-colors">→ Manage Services</a></li>
          <li><a href="/admin/chatbot"  className="hover:text-blue-400 transition-colors">→ Edit Chatbot Config</a></li>
          <li><a href="/admin/seo"      className="hover:text-blue-400 transition-colors">→ Edit SEO Settings</a></li>
          <li><a href="/admin/pricing"  className="hover:text-blue-400 transition-colors">→ Edit Pricing</a></li>
        </ul>
      </div>
    </div>
  );
}
