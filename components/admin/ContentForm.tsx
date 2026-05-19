'use client';

import { useState, useCallback } from 'react';
import { translations } from '@/lib/i18n/translations';

/* ── Section definitions ──────────────────────────────────────────────────── */
const SECTIONS = [
  { id: 'hero',       label: '🏠 Hero',          test: (k: string) => k.startsWith('hero.') || k.startsWith('inner.') },
  { id: 'cinematic',  label: '⭐ Expertise',      test: (k: string) => k.startsWith('cinematic.') },
  { id: 'services',   label: '🛠 Services',        test: (k: string) => k.startsWith('services.') },
  { id: 'why',        label: '✅ Why Webdigio',    test: (k: string) => k.startsWith('why.') },
  { id: 'process',    label: '⚡ Process',          test: (k: string) => k.startsWith('process.') },
  { id: 'industries', label: '🏢 Industries',      test: (k: string) => k.startsWith('industries.') },
  { id: 'pricing',    label: '💰 Pricing',          test: (k: string) => k.startsWith('pricing.') },
  { id: 'faq',        label: '❓ FAQ',              test: (k: string) => k.startsWith('faq.') },
  { id: 'footer',     label: '📬 Footer / CTA',    test: (k: string) => k.startsWith('footer.') || k.startsWith('cta.') },
  { id: 'nav',        label: '🧭 Navigation',       test: (k: string) => k.startsWith('nav.') },
  { id: 'chat',       label: '💬 Chat Widget',      test: (k: string) => k.startsWith('chat.') },
  { id: 'misc',       label: '⚙️ Misc',             test: (k: string) => k.startsWith('stack.') || k.startsWith('marquee.') || k.startsWith('loader.') || k.startsWith('aria.') },
];

const ALL_FULL_KEYS = Object.keys(translations);

function parseFullKey(fullKey: string) {
  const dot = fullKey.indexOf('.');
  return { section: fullKey.slice(0, dot), subkey: fullKey.slice(dot + 1) };
}

/* ── Props ────────────────────────────────────────────────────────────────── */
export interface DbRow {
  section: string;
  key: string;
  value_pt: string;
  value_en: string;
}

interface Props {
  /** Existing rows from site_content DB table */
  existing: DbRow[];
}

/* ── Shared input style ───────────────────────────────────────────────────── */
const INPUT_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  color: 'var(--color-text)',
  borderRadius: '10px',
  padding: '8px 12px',
  fontSize: '13px',
  width: '100%',
  resize: 'vertical',
  lineHeight: 1.5,
  fontFamily: 'inherit',
  outline: 'none',
};

const FOCUS_STYLE = `
  .cms-input:focus { border-color: rgba(59,130,246,0.5) !important; box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
  .cms-input:hover { border-color: rgba(255,255,255,0.18) !important; }
  .cms-section-tab { transition: all 0.2s; cursor: pointer; }
  .cms-section-tab:hover { background: rgba(255,255,255,0.06) !important; }
`;

/* ── Main component ───────────────────────────────────────────────────────── */
export default function ContentForm({ existing }: Props) {
  const [activeSection, setActiveSection] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  // Build initial values: DB rows override static defaults
  const [values, setValues] = useState<Record<string, { pt: string; en: string }>>(() => {
    const dbMap: Record<string, { pt: string; en: string }> = {};
    existing.forEach(r => {
      dbMap[`${r.section}.${r.key}`] = { pt: r.value_pt, en: r.value_en };
    });
    const v: Record<string, { pt: string; en: string }> = {};
    ALL_FULL_KEYS.forEach(fullKey => {
      const db = dbMap[fullKey];
      v[fullKey] = db ?? {
        pt: translations[fullKey]?.PT ?? '',
        en: translations[fullKey]?.EN ?? '',
      };
    });
    return v;
  });

  const update = useCallback((fullKey: string, lang: 'pt' | 'en', val: string) => {
    setValues(prev => ({ ...prev, [fullKey]: { ...prev[fullKey], [lang]: val } }));
    setDirty(prev => new Set(prev).add(fullKey));
  }, []);

  const activeSectionDef = SECTIONS.find(s => s.id === activeSection);
  const sectionKeys = ALL_FULL_KEYS.filter(k => activeSectionDef?.test(k) ?? false);
  const hasDirty = sectionKeys.some(k => dirty.has(k));

  async function saveSection() {
    setSaving(true);
    const rows = sectionKeys.map(fullKey => {
      const { section, subkey } = parseFullKey(fullKey);
      return { section, key: subkey, value_pt: values[fullKey].pt, value_en: values[fullKey].en };
    });
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      if (res.ok) {
        setMsg({ text: '✓ Saved! Refresh the website to see changes.', ok: true });
        setDirty(prev => {
          const next = new Set(prev);
          sectionKeys.forEach(k => next.delete(k));
          return next;
        });
      } else {
        const { error } = await res.json();
        setMsg({ text: `✗ Error: ${error}`, ok: false });
      }
    } catch {
      setMsg({ text: '✗ Network error.', ok: false });
    }
    setSaving(false);
    setTimeout(() => setMsg(null), 5000);
  }

  return (
    <>
      <style>{FOCUS_STYLE}</style>

      {/* Section tab bar */}
      <div
        className="flex flex-wrap gap-2 mb-8 pb-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {SECTIONS.map(s => {
          const active = s.id === activeSection;
          const sectionHasDirty = ALL_FULL_KEYS.filter(k => s.test(k)).some(k => dirty.has(k));
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="cms-section-tab px-4 py-2 rounded-xl text-sm font-medium relative"
              style={{
                background: active ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.03)',
                border: active ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.06)',
                color: active ? '#60a5fa' : 'var(--color-text-muted)',
              }}
            >
              {s.label}
              {sectionHasDirty && (
                <span
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                  style={{ background: '#f59e0b' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Key list */}
      <div className="flex flex-col gap-3 mb-8">
        {sectionKeys.length === 0 && (
          <p style={{ color: 'var(--color-text-dim)' }}>No keys for this section.</p>
        )}
        {sectionKeys.map(fullKey => {
          const isDirtyKey = dirty.has(fullKey);
          const isLong = (values[fullKey]?.pt?.length ?? 0) > 80 || (values[fullKey]?.en?.length ?? 0) > 80;
          return (
            <div
              key={fullKey}
              className="rounded-xl p-4"
              style={{
                background: isDirtyKey ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.025)',
                border: isDirtyKey ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <code
                  className="text-xs px-2 py-0.5 rounded-lg font-mono"
                  style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa' }}
                >
                  {fullKey}
                </code>
                {isDirtyKey && (
                  <span className="text-xs" style={{ color: '#f59e0b' }}>unsaved</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* PT */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: 'rgba(148,163,184,0.7)' }}
                  >
                    🇵🇹 Portuguese
                  </label>
                  {isLong ? (
                    <textarea
                      className="cms-input"
                      style={{ ...INPUT_STYLE, minHeight: '72px' }}
                      value={values[fullKey]?.pt ?? ''}
                      onChange={e => update(fullKey, 'pt', e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <input
                      type="text"
                      className="cms-input"
                      style={INPUT_STYLE}
                      value={values[fullKey]?.pt ?? ''}
                      onChange={e => update(fullKey, 'pt', e.target.value)}
                    />
                  )}
                </div>

                {/* EN */}
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: 'rgba(148,163,184,0.7)' }}
                  >
                    🇬🇧 English
                  </label>
                  {isLong ? (
                    <textarea
                      className="cms-input"
                      style={{ ...INPUT_STYLE, minHeight: '72px' }}
                      value={values[fullKey]?.en ?? ''}
                      onChange={e => update(fullKey, 'en', e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <input
                      type="text"
                      className="cms-input"
                      style={INPUT_STYLE}
                      value={values[fullKey]?.en ?? ''}
                      onChange={e => update(fullKey, 'en', e.target.value)}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save bar */}
      <div
        className="sticky bottom-0 flex items-center gap-4 py-4 px-6 rounded-2xl"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <button
          onClick={saveSection}
          disabled={saving || !hasDirty}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: hasDirty ? 'rgba(59,130,246,0.9)' : 'rgba(59,130,246,0.4)',
            color: '#fff',
            boxShadow: hasDirty ? '0 4px 18px rgba(59,130,246,0.35)' : 'none',
          }}
        >
          {saving ? 'Saving…' : `Save ${activeSectionDef?.label ?? 'Section'}`}
        </button>

        {msg && (
          <p
            className="text-sm font-medium"
            style={{ color: msg.ok ? '#4ade80' : '#f87171' }}
          >
            {msg.text}
          </p>
        )}

        {hasDirty && !msg && (
          <p className="text-xs" style={{ color: 'rgba(245,158,11,0.8)' }}>
            You have unsaved changes in this section.
          </p>
        )}
      </div>
    </>
  );
}
