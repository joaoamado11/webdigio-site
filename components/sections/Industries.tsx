'use client';

import Image from 'next/image';
import { useLang } from '@/lib/i18n/LangContext';
import { useInView } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const INDUSTRIES = [
  { key: 'industries.ind1', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80' },
  { key: 'industries.ind2', img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80' },
  { key: 'industries.ind3', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80' },
  { key: 'industries.ind4', img: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&w=800&q=80' },
  { key: 'industries.ind5', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' },
  { key: 'industries.ind6', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80' },
];

export default function Industries() {
  const { t } = useLang();
  const { ref, inView } = useInView(0.05);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="industrias"
      className="relative py-24 md:py-36"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="section-container">
        <div className={cn('flex flex-col items-center text-center mb-16 transition-all duration-700', inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}>
          <span className="section-tag">{t('industries.tag')}</span>
          <h2 className="section-title">{t('industries.title')}</h2>
          <p className="section-sub">{t('industries.sub')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {INDUSTRIES.map(({ key, img }, i) => (
            <div
              key={key}
              className={cn(
                'relative rounded-2xl overflow-hidden group cursor-default aspect-[4/3] transition-all duration-700',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Image
                src={img}
                alt={t(`${key}_title`)}
                fill
                className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-5 transition-all duration-300"
                style={{ background: 'linear-gradient(to top, rgba(5,5,8,0.9) 0%, rgba(5,5,8,0.3) 60%, transparent 100%)' }}
              >
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-1"
                  style={{ color: 'var(--color-primary-light)' }}
                >
                  {t(`${key}_label`)}
                </p>
                <h3 className="text-base font-bold" style={{ color: '#f1f5f9', fontFamily: 'var(--font-heading)' }}>
                  {t(`${key}_title`)}
                </h3>
                <p
                  className="text-xs mt-1 leading-relaxed opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-400"
                  style={{ color: 'rgba(148,163,184,0.85)' }}
                >
                  {t(`${key}_desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
