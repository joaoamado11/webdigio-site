'use client';

import { useLang } from '@/lib/i18n/LangContext';
import { useInView } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const FEATURES = [
  'pricing.feat1','pricing.feat2','pricing.feat3','pricing.feat4',
  'pricing.feat5','pricing.feat6','pricing.feat7','pricing.feat8',
];

const UPSELLS = [
  { key: 'pricing.upsell1', icon: '🔍' },
  { key: 'pricing.upsell2', icon: '📄' },
  { key: 'pricing.upsell3', icon: '⚙️' },
];

export default function Pricing() {
  const { t } = useLang();
  const { ref, inView } = useInView(0.1);

  const waNum  = '351912345678';
  const waMsg  = encodeURIComponent(t('pricing.wa_msg'));
  const waHref = `https://wa.me/${waNum}?text=${waMsg}`;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="preco"
      className="relative py-24 md:py-36"
      style={{ background: 'var(--color-surface)' }}
    >
      <div
        className="orb absolute"
        style={{ width: '600px', height: '600px', top: '10%', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        <div className={cn('flex flex-col items-center text-center mb-16 transition-all duration-700', inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}>
          <span className="section-tag">{t('pricing.tag')}</span>
          <h2 className="section-title">{t('pricing.title')}</h2>
          <p className="section-sub">{t('pricing.sub')}</p>
        </div>

        <div
          className={cn(
            'grid md:grid-cols-[1.4fr_1fr] gap-6 mx-auto transition-all duration-700',
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
          )}
          style={{ maxWidth: '900px' }}
        >
          {/* Main plan card */}
          <div
            className="glass-card relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(30,58,138,0.6) 0%, rgba(15,17,23,0.9) 100%)',
              borderColor: 'rgba(59,130,246,0.35)',
              padding: '2rem',
            }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.18) 0%, transparent 70%)' }}
              aria-hidden="true"
            />
            {/* Badge */}
            <div className="absolute top-5 right-5">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}
              >
                {t('pricing.badge')}
              </span>
            </div>

            <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--color-primary-light)' }}>
              {t('pricing.plan_label')}
            </p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-5xl font-black" style={{ color: '#f1f5f9', fontFamily: 'var(--font-heading)' }}>
                690€
              </span>
              <span className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                {t('pricing.once')}
              </span>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
              {t('pricing.delivery')}
            </p>

            <ul className="flex flex-col gap-2.5 mb-8">
              {FEATURES.map(key => (
                <li key={key} className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>✓</span>
                  {t(key)}
                </li>
              ))}
            </ul>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full text-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
              {t('pricing.cta')}
            </a>
          </div>

          {/* Upsells */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
              {t('pricing.upsells_title')}
            </p>
            {UPSELLS.map(({ key, icon }) => (
              <div
                key={key}
                className="glass-card p-5"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
                      {t(`${key}_title`)}
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                      {t(`${key}_desc`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-xs text-center mt-2" style={{ color: 'var(--color-text-dim)' }}>
              {t('pricing.guarantee')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
