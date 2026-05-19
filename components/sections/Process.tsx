'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLang } from '@/lib/i18n/LangContext';
import { useInView } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const STEPS = [
  { labelKey: 'process.step1_label', titleKey: 'process.step1_title', descKey: 'process.step1_desc', navKey: 'process.nav1', img: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80' },
  { labelKey: 'process.step2_label', titleKey: 'process.step2_title', descKey: 'process.step2_desc', navKey: 'process.nav2', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80' },
  { labelKey: 'process.step3_label', titleKey: 'process.step3_title', descKey: 'process.step3_desc', navKey: 'process.nav3', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80' },
  { labelKey: 'process.step4_label', titleKey: 'process.step4_title', descKey: 'process.step4_desc', navKey: 'process.nav4', img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80' },
];

export default function Process() {
  const { t } = useLang();
  const { ref, inView } = useInView(0.1);
  const [step, setStep]     = useState(0);
  const [playing, setPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setStep(s => (s + 1) % STEPS.length), 3500);
  }

  useEffect(() => {
    if (playing) startInterval();
    else if (intervalRef.current) clearInterval(intervalRef.current);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  function goTo(i: number) {
    setStep(i);
    if (playing) startInterval();
  }

  const current = STEPS[step];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="processo"
      className="relative py-24 md:py-36"
      style={{ background: 'var(--color-surface)' }}
    >
      <div className="section-container">
        {/* Header */}
        <div className={cn('flex flex-col items-center text-center mb-16 transition-all duration-700', inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}>
          <span className="section-tag">{t('process.tag')}</span>
          <h2 className="section-title">{t('process.title')}</h2>
          <p className="section-sub">{t('process.sub')}</p>
        </div>

        {/* Carousel card */}
        <div className={cn('glass-card overflow-hidden transition-all duration-700', inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12')}>
          <div className="grid md:grid-cols-2">
            {/* Text side */}
            <div className="p-8 md:p-12 flex flex-col gap-6 justify-center">
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: 'var(--color-primary-light)' }}
              >
                {t(current.labelKey)}
              </span>
              <h3
                className="text-2xl md:text-3xl font-bold"
                style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
              >
                {t(current.titleKey)}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
                {t(current.descKey)}
              </p>

              {/* Step nav */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setPlaying(p => !p)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                  style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--color-primary-light)' }}
                  aria-label={t('aria.pause')}
                >
                  {playing ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>

                {STEPS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer',
                      step === i
                        ? 'bg-[var(--color-primary)] text-white shadow-lg'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5'
                    )}
                  >
                    <span
                      className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                      style={{ background: step === i ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)' }}
                    >
                      {i + 1}
                    </span>
                    <span className="hidden sm:inline">{t(s.navKey)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Image side */}
            <div className="relative min-h-[280px] md:min-h-0 overflow-hidden">
              <Image
                key={step}
                src={current.img}
                alt={t(current.titleKey)}
                fill
                className="object-cover transition-opacity duration-500"
                style={{ opacity: 1 }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to right, var(--color-surface) 0%, transparent 30%)' }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
