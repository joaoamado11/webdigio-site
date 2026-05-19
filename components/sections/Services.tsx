'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useLang } from '@/lib/i18n/LangContext';
import { useInView } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  laptop: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  search: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  nodes: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3"/><circle cx="4" cy="19" r="3"/><circle cx="20" cy="19" r="3"/>
      <line x1="12" y1="8" x2="4" y2="16"/><line x1="12" y1="8" x2="20" y2="16"/>
    </svg>
  ),
  whatsapp: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
    </svg>
  ),
  backend: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  mobile: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
};

const SERVICES = [
  { icon: 'laptop',   titleKey: 'services.card1_title', textKey: 'services.card1_text' },
  { icon: 'search',   titleKey: 'services.card2_title', textKey: 'services.card2_text' },
  { icon: 'nodes',    titleKey: 'services.card3_title', textKey: 'services.card3_text' },
  { icon: 'whatsapp', titleKey: 'services.card4_title', textKey: 'services.card4_text' },
  { icon: 'backend',  titleKey: 'services.card5_title', textKey: 'services.card5_text' },
  { icon: 'mobile',   titleKey: 'services.card6_title', textKey: 'services.card6_text' },
];

// Before/After compare slider
function CompareSlider() {
  const { t } = useLang();
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const updatePos = useCallback((clientX: number) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const pct  = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 2), 98);
    setPos(pct);
  }, []);

  const onMouseDown = () => { dragging.current = true; };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updatePos(e.clientX); };
  const onMouseUp   = () => { dragging.current = false; };
  const onTouchMove = (e: React.TouchEvent) => { updatePos(e.touches[0].clientX); };

  return (
    <div
      ref={frameRef}
      className="compare-frame w-full select-none"
      style={{ aspectRatio: '16/7', cursor: 'ew-resize', userSelect: 'none' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
    >
      {/* After (base layer) */}
      <Image
        src="/assets/website_exemplo_after.png"
        alt="After — Premium Webdigio website"
        fill
        className="object-cover"
        draggable={false}
      />
      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src="/assets/website_exemplo_before.png"
          alt="Before — Amateur website"
          fill
          className="object-cover"
          draggable={false}
        />
      </div>
      {/* Handle */}
      <div
        className="compare-handle"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="compare-handle-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="4" x2="8" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/></svg>
        </div>
      </div>
      {/* Labels */}
      <span
        className="absolute top-4 left-4 text-xs font-bold px-2 py-1 rounded-md"
        style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', letterSpacing: '0.08em' }}
      >
        {t('services.before')}
      </span>
      <span
        className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-md"
        style={{ background: 'rgba(59,130,246,0.7)', color: '#fff', letterSpacing: '0.08em' }}
      >
        {t('services.after')}
      </span>
    </div>
  );
}

export default function Services() {
  const { t } = useLang();
  const { ref, inView } = useInView(0.05);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="showcase"
      className="relative py-24 md:py-36"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Orb */}
      <div
        className="orb absolute"
        style={{ width: '500px', height: '500px', top: '20%', left: '-10%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="section-container">
        {/* Header */}
        <div className={cn('flex flex-col items-center text-center mb-16 transition-all duration-700', inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}>
          <span className="section-tag">{t('services.tag')}</span>
          <h2 className="section-title">
            Um website premium.<br />
            Sem complicações.<br />
            <span className="text-gradient">Sem mensalidades.</span>
          </h2>
          <p className="section-sub">{t('services.sub')}</p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {SERVICES.map(({ icon, titleKey, textKey }, i) => (
            <div
              key={icon}
              className={cn(
                'glass-card group relative overflow-hidden cursor-default transition-all duration-700 hover:-translate-y-1 hover:shadow-2xl',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              )}
              style={{
                transitionDelay: `${i * 80}ms`,
                padding: '1.75rem',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
                aria-hidden="true"
              />
              {/* Shimmer border */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[18px] overflow-hidden"
                aria-hidden="true"
              >
                <div className="shimmer-line absolute inset-0 opacity-0 group-hover:opacity-100" />
              </div>

              <div
                className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--color-primary-light)' }}
              >
                {SERVICE_ICONS[icon]}
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
              >
                {t(titleKey)}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {t(textKey)}
              </p>
            </div>
          ))}
        </div>

        {/* Before / After slider */}
        <div className={cn('transition-all duration-700', inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')} style={{ transitionDelay: '500ms' }}>
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary-light)' }}>
              Transformação real
            </p>
          </div>
          <CompareSlider />
        </div>
      </div>
    </section>
  );
}
