import { createSupabaseServerClient } from '@/lib/supabase/server';
import SeoForm from '@/components/admin/SeoForm';

export default async function SeoPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from('seo_config').select('*').eq('id', 1).single();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
        SEO Settings
      </h1>
      {data && <SeoForm initial={data} />}
    </div>
  );
}
