import { createSupabaseServerClient } from '@/lib/supabase/server';
import ChatbotForm from '@/components/admin/ChatbotForm';

export default async function ChatbotPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from('chatbot_config').select('*').eq('id', 1).single();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
        Chatbot Config
      </h1>
      {data && <ChatbotForm initial={data} />}
    </div>
  );
}
