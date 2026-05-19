'use client';

import { useState, useRef, useEffect } from 'react';
import { useLang } from '@/lib/i18n/LangContext';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function ChatWidget() {
  const { t, lang } = useLang();
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [greeted, setGreeted]   = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Show greeting on first open
  useEffect(() => {
    if (open && !greeted) {
      setMessages([{ role: 'assistant', text: t('chat.greeting') }]);
      setGreeted(true);
    }
  }, [open, greeted, t]);

  // Scroll to bottom on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, lang }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply ?? t('chat.error') }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: t('chat.error') }]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [t('chat.sugg1'), t('chat.sugg2'), t('chat.sugg3')];

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform duration-200 hover:scale-105 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          boxShadow: '0 8px 32px rgba(59,130,246,0.4)',
        }}
        aria-label={t('chat.open')}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
        {/* Ping ring */}
        {!open && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: 'rgba(59,130,246,0.3)', animationDuration: '2s' }}
          />
        )}
      </button>

      {/* Chat panel */}
      <div
        className={cn(
          'fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden transition-all duration-300 origin-bottom-right',
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        )}
        style={{
          width: 'min(380px, calc(100vw - 2rem))',
          height: '500px',
          background: 'rgba(13,17,23,0.96)',
          border: '1px solid rgba(59,130,246,0.25)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.1)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(59,130,246,0.15)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.15)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: '#f1f5f9' }}>{t('chat.title')}</p>
            <p className="text-xs" style={{ color: 'rgba(148,163,184,0.7)' }}>Webdigio AI</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs" style={{ color: 'rgba(52,211,153,0.8)' }}>{t('chat.online')}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div
                className="rounded-xl px-4 py-2.5 text-sm max-w-[85%] leading-relaxed"
                style={
                  m.role === 'user'
                    ? { background: 'rgba(59,130,246,0.25)', color: '#f1f5f9', borderRadius: '16px 16px 4px 16px' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'rgba(241,245,249,0.9)', borderRadius: '4px 16px 16px 16px' }
                }
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div
                className="rounded-xl px-4 py-3 flex items-center gap-1"
                style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px 16px 16px 16px' }}
              >
                {[0,1,2].map(d => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-blue-400"
                    style={{ animation: 'chat-pulse 1.2s ease-in-out infinite', animationDelay: `${d * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions (only when no messages sent yet) */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors duration-200"
                style={{
                  background: 'rgba(59,130,246,0.12)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59,130,246,0.2)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          className="flex items-center gap-2 p-3 border-t flex-shrink-0"
          style={{ borderColor: 'rgba(59,130,246,0.12)' }}
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
            placeholder={t('chat.placeholder')}
            maxLength={500}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--color-text)', caretColor: '#3b82f6' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer disabled:opacity-40"
            style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}
            aria-label={t('chat.send')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </>
  );
}
