'use client';

import { useState, useEffect, useRef } from 'react';
import { useLang } from '@/lib/i18n/LangContext';
import { useInView } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const PILLS_PT = [
  { title: 'Sem mensalidades',                 icon: '✓' },
  { title: 'Entrega em 2 a 5 dias',            icon: '⚡' },
  { title: 'Prospeção Direta',                 icon: '🔍' },
  { title: 'Sistema de Otimização',            icon: '⚙️' },
  { title: 'Foco no que interessa: clientes',  icon: '🎯' },
  { title: 'Website vs Redes Sociais',         icon: '🌐' },
];
const PILLS_EN = [
  { title: 'No subscriptions',             icon: '✓' },
  { title: 'Delivery in 2 to 5 days',      icon: '⚡' },
  { title: 'Direct Prospecting',           icon: '🔍' },
  { title: 'Optimisation System',          icon: '⚙️' },
  { title: 'Focus on what matters: clients', icon: '🎯' },
  { title: 'Website vs Social Media',      icon: '🌐' },
];

/* â”€â”€ Per-item animated visuals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Visual0() { // No subscriptions
  return (
    <div className="flex flex-col items-center justify-center gap-5 h-full px-6">
      <div style={{ position:'relative', width:100, height:100 }}>
        <svg viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="3"/>
          <circle cx="50" cy="50" r="44" fill="none" stroke="#22c55e" strokeWidth="3"
            strokeDasharray="276.5" strokeDashoffset="0" strokeLinecap="round"
            style={{ animation: 'spin-draw 1.2s ease-out forwards', transformOrigin:'50% 50%' }}
          />
          <path d="M32 50l13 13 23-26" stroke="#22c55e" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"
            style={{ strokeDasharray:52, strokeDashoffset:52, animation:'draw-check 0.5s 0.4s ease-out forwards' }}
          />
        </svg>
      </div>
      <div className="text-center">
        <div className="text-4xl font-black" style={{ fontFamily:'var(--font-heading)', color:'#f1f5f9', letterSpacing:'-0.02em' }}>690€</div>
        <div className="text-sm font-semibold mt-1" style={{ color:'#22c55e' }}>Pagamento único</div>
        <div className="text-xs mt-1" style={{ color:'rgba(148,163,184,0.6)' }}>Sem renovações. Sem surpresas.</div>
      </div>
      <div className="flex gap-2">
        {['Manutenção', 'Suporte', 'Atualizações'].map(l => (
          <span key={l} className="text-xs px-2.5 py-1 rounded-full" style={{ background:'rgba(34,197,94,0.1)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.2)' }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function Visual1({ lang }: { lang: string }) { // Delivery speed
  const steps = lang === 'PT'
    ? ['Briefing', 'Design', 'Dev', 'Revisão', '🚀 Live']
    : ['Briefing', 'Design', 'Dev', 'Review', 'ðŸš€ Live'];
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full px-6">
      <div className="text-5xl" style={{ lineHeight:1 }}>⚡</div>
      <div className="w-full flex flex-col gap-2.5">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: i === 4 ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.12)', color: '#60a5fa' }}>
              {i === 4 ? '✓' : i+1}
            </div>
            <div className="flex-1 h-1.5 rounded-full" style={{ background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
              <div className="h-full rounded-full" style={{
                background:'linear-gradient(90deg,#3b82f6,#60a5fa)',
                width: i === 4 ? '100%' : `${(i+1)*20}%`,
                transition:'width 0.5s ease',
              }} />
            </div>
            <span className="text-xs font-medium" style={{ color: i === 4 ? '#60a5fa' : 'rgba(148,163,184,0.7)', minWidth:52, textAlign:'right' }}>{s}</span>
          </div>
        ))}
      </div>
      <div className="text-xs" style={{ color:'rgba(148,163,184,0.5)' }}>{lang === 'PT' ? '2 a 5 dias úteis' : '2 to 5 business days'}</div>
    </div>
  );
}

function Visual2({ lang }: { lang: string }) { // Direct prospecting
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full px-6">
      <div style={{ position:'relative', width:110, height:110 }}>
        {[44, 33, 22].map((r, i) => (
          <div key={r} style={{ position:'absolute', inset:0, borderRadius:'50%', border:`1px solid rgba(59,130,246,${0.12 + i*0.06})`,
            animation:`ping-ring ${1.6 + i*0.4}s ${i*0.3}s ease-out infinite` }} />
        ))}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(59,130,246,0.2)', border:'2px solid #3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🔍</div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        {(lang === 'PT'
          ? ['Cliente em Lisboa encontrou o teu site', 'Lead qualificado contactou', 'Novo orçamento pedido']
          : ['Client in Lisbon found your site', 'Qualified lead made contact', 'New quote requested']
        ).map((l, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
            style={{ background:'rgba(59,130,246,0.07)', border:'1px solid rgba(59,130,246,0.15)' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#3b82f6', flexShrink:0 }} />
            <span className="text-xs" style={{ color:'rgba(148,163,184,0.85)' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Visual3({ lang }: { lang: string }) { // Optimisation
  const bars = [45, 60, 52, 78, 70, 90, 85];
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full px-6">
      <div className="flex items-end gap-2 h-20">
        {bars.map((h, i) => (
          <div key={i} style={{
            width:20, height:`${h}%`, borderRadius:'3px 3px 0 0',
            background:`linear-gradient(180deg,#60a5fa,#3b82f6)`,
            opacity: i === bars.length - 1 ? 1 : 0.5 + i*0.07,
            transition:`height 0.5s ${i*0.07}s ease`,
          }} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-black" style={{ fontFamily:'var(--font-heading)', color:'#60a5fa' }}>+43%</span>
        <span className="text-sm" style={{ color:'rgba(148,163,184,0.7)' }}>{lang === 'PT' ? 'tráfego orgânico' : 'organic traffic'}</span>
      </div>
      <div className="w-full flex gap-2">
        {(lang === 'PT'
          ? [['PageSpeed', '98'], ['SEO', 'A+'], ['Mobile', '100']]
          : [['PageSpeed', '98'], ['SEO', 'A+'], ['Mobile', '100']]
        ).map(([label, val]) => (
          <div key={label} className="flex-1 text-center px-2 py-2 rounded-lg"
            style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.15)' }}>
            <div className="text-sm font-bold" style={{ color:'#60a5fa' }}>{val}</div>
            <div className="text-[10px]" style={{ color:'rgba(148,163,184,0.55)' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Visual4({ lang }: { lang: string }) { // Client focus
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full px-6">
      <div style={{ position:'relative', width:100, height:100 }}>
        {[42, 30, 18].map((r, i) => (
          <div key={r} style={{
            position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            width:r*2, height:r*2, borderRadius:'50%',
            border:`${i===2?2:1}px solid rgba(59,130,246,${0.15+i*0.15})`,
          }} />
        ))}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🎯</div>
      </div>
      <div className="w-full flex flex-col gap-2.5">
        {(lang === 'PT'
          ? [['Leads gerados', '+127%', '#22c55e'], ['Bounce rate', '-38%', '#f97316'], ['Conversões', '+89%', '#3b82f6']]
          : [['Leads generated', '+127%', '#22c55e'], ['Bounce rate', '-38%', '#f97316'], ['Conversions', '+89%', '#3b82f6']]
        ).map(([label, val, color]) => (
          <div key={label} className="flex items-center justify-between px-3 py-2 rounded-lg"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-xs" style={{ color:'rgba(148,163,184,0.7)' }}>{label}</span>
            <span className="text-sm font-bold" style={{ color }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Visual5({ lang }: { lang: string }) { // Website vs Social
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full px-6">
      <div className="flex items-center gap-4 w-full">
        {/* Website */}
        <div className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl"
          style={{ background:'rgba(59,130,246,0.12)', border:'2px solid rgba(59,130,246,0.4)' }}>
          <span style={{ fontSize:28 }}>🌐</span>
          <span className="text-xs font-semibold text-center" style={{ color:'#60a5fa' }}>Website</span>
          {(lang === 'PT'
            ? ['Teu', 'Eterno', 'Google']
            : ['Yours', 'Eternal', 'Google']
          ).map(l => (
            <span key={l} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:'rgba(59,130,246,0.15)', color:'rgba(148,163,184,0.8)' }}>{l}</span>
          ))}
        </div>

        <div className="flex flex-col items-center gap-1">
          <div style={{ width:2, height:20, background:'rgba(255,255,255,0.1)' }} />
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background:'rgba(255,255,255,0.06)', color:'rgba(148,163,184,0.5)' }}>VS</span>
          <div style={{ width:2, height:20, background:'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Social */}
        <div className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl"
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex gap-1.5">
            {['🔵','📸','▶️'].map(e => <span key={e} style={{ fontSize:16 }}>{e}</span>)}
          </div>
          <span className="text-xs font-semibold text-center" style={{ color:'rgba(148,163,184,0.6)' }}>{lang === 'PT' ? 'Redes' : 'Social'}</span>
          {(lang === 'PT'
            ? ['Alugado', 'Efémero', 'Algoritmo']
            : ['Rented', 'Ephemeral', 'Algorithm']
          ).map(l => (
            <span key={l} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:'rgba(255,255,255,0.05)', color:'rgba(100,116,139,0.7)' }}>{l}</span>
          ))}
        </div>
      </div>
      <p className="text-xs text-center" style={{ color:'rgba(148,163,184,0.5)', maxWidth:200 }}>
        {lang === 'PT' ? 'O teu website é um ativo. As redes sociais são um aluguer.' : 'Your website is an asset. Social media is a rental.'}
      </p>
    </div>
  );
}

const VISUALS = [Visual0, Visual1, Visual2, Visual3, Visual4, Visual5];

export default function WhyWebdigio() {
  const { t, lang } = useLang();
  const { ref, inView } = useInView(0.1);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pills = lang === 'PT' ? PILLS_PT : PILLS_EN;
  const descs = ['why.pill0_desc','why.pill1_desc','why.pill2_desc','why.pill3_desc','why.pill4_desc','why.pill5_desc'];

  function startInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive(i => (i + 1) % pills.length);
    }, 3200);
  }

  useEffect(() => {
    if (playing) startInterval();
    else if (intervalRef.current) clearInterval(intervalRef.current);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, pills.length]);

  function selectPill(idx: number) {
    setActive(idx);
    if (playing) startInterval();
  }

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="porque-nos"
      className="relative py-24 md:py-36"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* keyframes for visual animations */}
      <style>{`
        @keyframes spin-draw {
          from { stroke-dashoffset: 276.5; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes ping-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      <div
        className="orb absolute"
        style={{ width:'500px', height:'500px', top:'20%', right:'-10%', background:'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="section-container">
        {/* Header */}
        <div className={cn('flex flex-col items-center text-center mb-16 transition-all duration-700', inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}>
          <span className="section-tag">{t('why.tag')}</span>
          <h2 className="section-title">{t('why.title')}</h2>
        </div>

        <div className={cn('grid md:grid-cols-[1fr_auto] gap-10 items-start transition-all duration-700', inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12')}>
          {/* Left: controls + accordion pills */}
          <div className="flex flex-col gap-3">
            {/* Play/Pause + Nav */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setPlaying(p => !p)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--color-primary-light)' }}
                aria-label={t('aria.pause')}
              >
                {playing ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              <button
                onClick={() => setActive(a => (a - 1 + pills.length) % pills.length)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                style={{ background: 'rgba(59,130,246,0.08)', color: 'var(--color-text-muted)' }}
                aria-label={t('aria.prev')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
              </button>
              <button
                onClick={() => setActive(a => (a + 1) % pills.length)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                style={{ background: 'rgba(59,130,246,0.08)', color: 'var(--color-text-muted)' }}
                aria-label={t('aria.next')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>

            {pills.map((pill, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer',
                  active === i
                    ? 'border-[rgba(59,130,246,0.4)] bg-[rgba(59,130,246,0.08)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                )}
                onClick={() => selectPill(i)}
              >
                <div className="flex items-center gap-3 p-4">
                  <span
                    className="text-sm font-bold w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{
                      background: active === i ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                      color: active === i ? 'var(--color-primary-light)' : 'var(--color-text-dim)',
                    }}
                  >
                    {pill.icon}
                  </span>
                  <span
                    className="font-semibold text-sm flex-1"
                    style={{ color: active === i ? 'var(--color-text)' : 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}
                  >
                    {pill.title}
                  </span>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="transition-transform duration-300"
                    style={{ color:'var(--color-text-dim)', transform: active === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{ maxHeight: active === i ? '200px' : '0', padding: active === i ? '0 1rem 1rem 3.25rem' : '0 1rem' }}
                >
                  <p style={{ color:'var(--color-text-muted)', fontSize:'0.9rem', lineHeight:1.7 }}>
                    {t(descs[i])}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: per-item animated visual panel */}
          <div className="hidden md:flex justify-end">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                width: 260,
                height: 340,
                background: 'linear-gradient(160deg, rgba(15,17,23,0.95) 0%, rgba(10,12,20,0.98) 100%)',
                border: '1px solid rgba(59,130,246,0.15)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              {/* Tab indicators */}
              <div className="absolute top-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                {VISUALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => selectPill(i)}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      width: active === i ? 18 : 5,
                      height: 4,
                      borderRadius: 2,
                      background: active === i ? '#3b82f6' : 'rgba(255,255,255,0.15)',
                    }}
                    aria-label={`Visual ${i+1}`}
                  />
                ))}
              </div>

              {/* Visual panels â€” cross-fade */}
              <div className="absolute inset-0 pt-8">
                {VISUALS.map((VisualComponent, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      opacity: active === i ? 1 : 0,
                      transform: active === i ? 'translateY(0)' : 'translateY(8px)',
                      pointerEvents: active === i ? 'auto' : 'none',
                    }}
                  >
                    <VisualComponent lang={lang} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

