import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function ServicesAdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: services } = await supabase.from('services').select('*').order('sort_order');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
        Services
      </h1>
      <div className="flex flex-col gap-3">
        {(services ?? []).map((s: Record<string, unknown>) => (
          <div
            key={String(s.id)}
            className="rounded-xl p-4 flex items-center gap-4"
            style={{ background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{String(s.title_pt)}</p>
              <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--color-text-muted)' }}>{String(s.description_pt)}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>
              #{String(s.sort_order)}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs mt-6" style={{ color: 'var(--color-text-dim)' }}>
        Edit services directly in Supabase Table Editor, or implement inline forms here.
      </p>
    </div>
  );
}
