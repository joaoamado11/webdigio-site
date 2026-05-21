import { createSupabaseAdminClient } from '@/lib/supabase/server';
import ChatbotForm from '@/components/admin/ChatbotForm';

export default async function ChatbotPage() {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from('chatbot_config').select('*').eq('id', 1).maybeSingle();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
        Chatbot Config
      </h1>
      <ChatbotForm initial={data ?? {}} />
    </div>
  );
}
