'use client';

import { useState } from 'react';
import { useLang } from '@/lib/i18n/LangContext';
import { useInView } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const FAQS = [1,2,3,4,5,6].map(n => ({
  qKey: `faq.q${n}`,
  aKey: `faq.a${n}`,
  num: `0${n}`,
}));

export default function FAQ() {
  const { t } = useLang();
  const { ref, inView } = useInView(0.05);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="faq"
      className="relative py-24 md:py-36"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="section-container" style={{ maxWidth: '760px' }}>
        <div className={cn('flex flex-col items-center text-center mb-16 transition-all duration-700', inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}>
          <span className="section-tag">{t('faq.tag')}</span>
          <h2 className="section-title">{t('faq.title')}</h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map(({ qKey, aKey, num }, i) => {
            const isOpen = open === i;
            return (
              <div
                key={qKey}
                className={cn(
                  'rounded-2xl border overflow-hidden transition-all duration-700',
                  isOpen ? 'border-[rgba(59,130,246,0.35)]' : 'border-[var(--color-border)]',
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                )}
                style={{
                  background: isOpen ? 'rgba(59,130,246,0.05)' : 'var(--color-surface)',
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <button
                  className="w-full flex items-center gap-5 p-5 text-left cursor-pointer group"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-xs font-mono font-bold flex-shrink-0"
                    style={{ color: 'var(--color-primary-light)' }}
                  >
                    {num}
                  </span>
                  <span
                    className="flex-1 font-semibold text-sm md:text-base"
                    style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
                  >
                    {t(qKey)}
                  </span>
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: isOpen ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                      color: isOpen ? '#60a5fa' : 'var(--color-text-dim)',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                    aria-hidden="true"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{ maxHeight: isOpen ? '400px' : '0' }}
                >
                  <p
                    className="px-5 pb-5 text-sm leading-relaxed"
                    style={{ color: 'var(--color-text-muted)', paddingLeft: '3.25rem' }}
                  >
                    {t(aKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
