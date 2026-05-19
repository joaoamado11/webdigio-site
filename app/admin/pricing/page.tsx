import { createSupabaseServerClient } from '@/lib/supabase/server';
import PricingForm from '@/components/admin/PricingForm';

export default async function PricingAdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from('pricing').select('*').eq('id', 1).single();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
        Pricing
      </h1>
      {data && <PricingForm initial={data} />}
    </div>
  );
}
