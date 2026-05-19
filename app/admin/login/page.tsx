'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router   = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail]   = useState('');
  const [pass,  setPass]    = useState('');
  const [error, setError]   = useState('');
  const [busy,  setBusy]    = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (err) {
      setError(err.message);
      setBusy(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-bg)' }}
    >
      <div
        className="rounded-2xl border p-8 w-full"
        style={{
          maxWidth: '400px',
          background: 'var(--color-surface)',
          borderColor: 'rgba(59,130,246,0.15)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
        }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Image src="/assets/simple-logo.png" alt="Webdigio" width={32} height={32} className="h-8 w-auto" />
          <div>
            <p className="font-bold" style={{ color: 'var(--color-text)' }}>Webdigio Admin</p>
            <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>Sign in to continue</p>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Email</label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn btn-primary w-full mt-2 cursor-pointer disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
