'use client';

import { useState, FormEvent } from 'react';

interface PricingRow {
  id: number;
  price: number;
  currency: string;
  plan_name: string;
  delivery_days: number;
  whatsapp_number: string;
  contact_email: string;
}

export default function PricingForm({ initial }: { initial: PricingRow }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg,  setMsg]  = useState('');

  function num(val: string) { return Number(val) || 0; }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch('/api/admin/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setMsg(res.ok ? 'Saved!' : 'Error saving.');
    setBusy(false);
    setTimeout(() => setMsg(''), 3000);
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-5 max-w-md">
      {[
        { key: 'plan_name',        label: 'Plan Name',       type: 'text' },
        { key: 'price',            label: 'Price (€)',        type: 'number' },
        { key: 'currency',         label: 'Currency',         type: 'text' },
        { key: 'delivery_days',    label: 'Delivery Days',    type: 'number' },
        { key: 'whatsapp_number',  label: 'WhatsApp Number',  type: 'text' },
        { key: 'contact_email',    label: 'Contact Email',    type: 'email' },
      ].map(({ key, label, type }) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
          <input
            type={type}
            value={String(form[key as keyof PricingRow])}
            onChange={e => setForm(f => ({
              ...f,
              [key]: type === 'number' ? num(e.target.value) : e.target.value
            }))}
            className="rounded-xl px-4 py-3 text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'var(--color-text)' }}
          />
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
