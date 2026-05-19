'use client';

import { useState, FormEvent } from 'react';

interface Config {
  id: number;
  system_prompt_pt: string;
  system_prompt_en: string;
  greeting_pt: string;
  greeting_en: string;
}

export default function ChatbotForm({ initial }: { initial: Config }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg,  setMsg]  = useState('');

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch('/api/admin/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setMsg(res.ok ? 'Saved!' : 'Error saving.');
    setBusy(false);
    setTimeout(() => setMsg(''), 3000);
  }

  const fields: { key: keyof Config; label: string; rows?: number }[] = [
    { key: 'system_prompt_pt', label: 'System Prompt (PT)', rows: 5 },
    { key: 'system_prompt_en', label: 'System Prompt (EN)', rows: 5 },
    { key: 'greeting_pt',      label: 'Greeting (PT)' },
    { key: 'greeting_en',      label: 'Greeting (EN)' },
  ];

  return (
    <form onSubmit={save} className="flex flex-col gap-5 max-w-2xl">
      {fields.map(({ key, label, rows }) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
          {rows ? (
            <textarea
              rows={rows}
              value={String(form[key])}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="rounded-xl px-4 py-3 text-sm resize-y outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'var(--color-text)',
              }}
            />
          ) : (
            <input
              type="text"
              value={String(form[key])}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="rounded-xl px-4 py-3 text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'var(--color-text)',
              }}
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-4 mt-2">
        <button type="submit" disabled={busy} className="btn btn-primary cursor-pointer disabled:opacity-60">
          {busy ? 'Saving…' : 'Save'}
        </button>
        {msg && <span className="text-sm" style={{ color: msg.startsWith('S') ? '#10b981' : '#f87171' }}>{msg}</span>}
      </div>
    </form>
  );
}
