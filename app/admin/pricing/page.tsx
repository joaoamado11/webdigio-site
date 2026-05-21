import { createSupabaseAdminClient } from '@/lib/supabase/server';
import PricingForm from '@/components/admin/PricingForm';

export default async function PricingAdminPage() {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from('pricing').select('*').eq('id', 1).maybeSingle();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
        Pricing
      </h1>
      <PricingForm initial={data ?? {}} />
    </div>
  );
}
