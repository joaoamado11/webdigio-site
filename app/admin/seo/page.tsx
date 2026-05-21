import { createSupabaseAdminClient } from '@/lib/supabase/server';
import SeoForm from '@/components/admin/SeoForm';

export default async function SeoPage() {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from('seo_config').select('*').eq('id', 1).maybeSingle();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
        SEO Settings
      </h1>
      <SeoForm initial={data ?? {}} />
    </div>
  );
}
