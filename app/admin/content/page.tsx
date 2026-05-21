import { createSupabaseClient } from '@/lib/supabase/server';
import ContentForm from '@/components/admin/ContentForm';

export default async function ContentPage() {
  const supabase = createSupabaseClient();
  const { data: existing, error } = await supabase
    .from('site_content')
    .select('section, key, value_pt, value_en')
    .order('section')
    .order('key');

  if (error) console.error('[admin/content] Supabase error:', error.message);

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-black mb-1"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
        >
          Website Content
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>
          Edit all text on the website — Portuguese and English. Changes go live on the next page load.
        </p>
      </div>

      <ContentForm existing={existing ?? []} />
    </div>
  );
}
