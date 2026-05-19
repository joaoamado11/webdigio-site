'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLang } from '@/lib/i18n/LangContext';
import { useInView } from '@/lib/hooks';

const MORPHING_WORDS_PT = ['premium', 'rápido', 'moderno', 'eficiente', 'conversivo'];
const MORPHING_WORDS_EN = ['premium', 'fast', 'modern', 'efficient', 'converting'];

/* Floating stat badge */
function StatBadge({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="glass-card flex items-center gap-2.5 px-4 py-2.5"
      style={{
        animation: `float 4s ${delay}s ease-in-out infinite`,
        animationDirection: delay > 1 ? 'alternate-reverse' : 'alternate',
      }}
    >
      {children}
    </div>
  );
}

export default function CinematicExpertise() {
  const { t, lang } = useLang();
  const { ref: sectionRef, inView } = useInView(0.1);
  const [morphIdx, setMorphIdx] = useState(0);
  const [morphFade, setMorphFade] = useState(true);
  const [count690, setCount690] = useState(0);

  const morphWords = lang === 'PT' ? MORPHING_WORDS_PT : MORPHING_WORDS_EN;

  /* Morphing word cycle */
  useEffect(() => {
    const interval = setInterval(() => {
      setMorphFade(false);
      setTimeout(() => {
        setMorphIdx(i => (i + 1) % morphWords.length);
        setMorphFade(true);
      }, 280);
    }, 2400);
    return () => clearInterval(interval);
  }, [morphWords.length]);

  /* Count-up animation for price (triggers on inView) */
  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 60;
    const target = 690;
    const timer = setInterval(() => {
      frame++;
      setCount690(Math.round((frame / total) * target));
      if (frame >= total) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="expertise"
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Background large text */}
      <div
        className="absolute inset-0 flex flex-col justify-center overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        <div
          className="font-black whitespace-nowrap"
          style={{
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            color: 'rgba(59,130,246,0.035)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            transform: 'translateX(-2%)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {t('cinematic.track')}
        </div>
        <div
          className="font-black whitespace-nowrap"
          style={{
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            color: 'rgba(59,130,246,0.035)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            transform: 'translateX(5%)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {t('cinematic.days')}
        </div>
      </div>

      {/* Orb */}
      <div
        className="orb absolute"
        style={{ width:'600px', height:'600px', top:'10%', right:'-15%', background:'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        {/* Section header â€” entrance from below */}
        <div
          className="flex flex-col items-center text-center mb-20 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(32px)' }}
        >
          <span className="section-tag">{t('why.tag')}</span>
          <h2 className="section-title mb-4" style={{ maxWidth: '720px' }}>
            {t('cinematic.desc_title')}
          </h2>
          {/* Morphing subtitle */}
          <p className="text-lg md:text-xl" style={{ color:'var(--color-text-muted)' }}>
            {lang === 'PT' ? 'Websites ' : 'Websites '}
            <span
              className="text-gradient font-bold inline-block"
              style={{
                transition: 'opacity 0.28s ease, transform 0.28s ease',
                opacity: morphFade ? 1 : 0,
                transform: morphFade ? 'translateY(0)' : 'translateY(8px)',
                minWidth: '7rem',
              }}
            >
              {morphWords[morphIdx]}
            </span>
            {lang === 'PT' ? ' — entregues.' : ' — delivered.'}
          </p>
        </div>

        {/* Main two-column layout */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left: text + badges â€” staggered entrance */}
          <div className="flex flex-col gap-8">
            {/* Description */}
            <div
              className="transition-all duration-700 delay-100"
              style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-28px)' }}
            >
              <p style={{ color:'var(--color-text-muted)', lineHeight:1.8, fontSize:'1.05rem' }}>
                <strong style={{ color:'var(--color-text)' }}>Webdigio</strong>{' '}
                {t('cinematic.desc_text').replace('Webdigio ', '')}
              </p>
            </div>

            {/* Logo + brand tagline */}
            <div
              className="flex items-center gap-5 transition-all duration-700 delay-200"
              style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-28px)' }}
            >
              <Image
                src="/assets/bigWBlogowhite.png"
                alt="Webdigio"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <div style={{ width:1, height:40, background:'rgba(255,255,255,0.12)' }} />
              <p style={{ color:'var(--color-text-muted)', fontSize:'0.95rem' }}>
              {lang === 'PT' ? 'Agência Digital — Portugal' : 'Digital Agency — Portugal'}
              </p>
            </div>

            {/* Feature badges grid */}
            <div
              className="grid grid-cols-2 gap-3 transition-all duration-700 delay-300"
              style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}
            >
              {[
                { icon: '🚀', title: t('cinematic.badge1'), sub: t('cinematic.badge1sub'), color: '#3b82f6' },
                { icon: '✅', title: t('cinematic.badge2'), sub: t('cinematic.badge2sub'), color: '#22c55e' },
                { icon: '⚡', title: lang === 'PT' ? '2–5 Dias' : '2–5 Days', sub: lang === 'PT' ? 'Entrega rápida' : 'Fast delivery', color: '#f59e0b' },
                { icon: '🔒', title: lang === 'PT' ? 'Sem Mensalidades' : 'No Subscriptions', sub: lang === 'PT' ? 'Pagamento único' : 'One-time payment', color: '#a78bfa' },
              ].map(({ icon, title, sub, color }, i) => (
                <div
                  key={title}
                  className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: `all 0.5s ${(i * 80) + 400}ms ease`,
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(16px)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${color}18` }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color:'var(--color-text)', fontFamily:'var(--font-heading)' }}>{title}</p>
                    <p className="text-xs" style={{ color:'var(--color-text-dim)' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual composition with floating badges */}
          <div
            className="relative flex items-center justify-center min-h-[420px] transition-all duration-700 delay-200"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0) scale(1)' : 'translateX(28px) scale(0.95)' }}
          >
            {/* Central price ring */}
            <div className="relative">
              <svg viewBox="0 0 200 200" width="200" height="200" className="block">
                <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="4"/>
                <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="2"
                  strokeDasharray="6 10" strokeLinecap="round"/>
                <circle cx="100" cy="100" r="72" fill="none" stroke="rgba(59,130,246,0.12)" strokeWidth="1.5"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color:'rgba(148,163,184,0.5)' }}>
                  {lang === 'PT' ? 'a partir de' : 'from'}
                </span>
                <span className="text-5xl font-black tracking-tight" style={{ fontFamily:'var(--font-heading)', color:'#f1f5f9' }}>
                  {count690}€
                </span>
                <span className="text-xs font-medium mt-1" style={{ color:'#60a5fa' }}>
                  {lang === 'PT' ? 'pagamento único' : 'one-time payment'}
                </span>
              </div>
            </div>

            {/* Floating badges orbiting the ring */}
            <div className="absolute" style={{ top:0, right:-20 }}>
              <StatBadge delay={0}>
                <span style={{ fontSize:18 }}>🚀</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color:'var(--color-text)' }}>
                    {lang === 'PT' ? '2-5 Dias' : '2-5 Days'}
                  </p>
                  <p className="text-[10px]" style={{ color:'var(--color-text-dim)' }}>
                    {lang === 'PT' ? 'entrega' : 'delivery'}
                  </p>
                </div>
              </StatBadge>
            </div>

            <div className="absolute" style={{ bottom:30, right:-10 }}>
              <StatBadge delay={1.2}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', flexShrink:0 }} />
                <span className="text-xs font-semibold" style={{ color:'var(--color-text)' }}>
                  {lang === 'PT' ? 'Suporte incluído' : 'Support included'}
                </span>
              </StatBadge>
            </div>

            <div className="absolute" style={{ top:60, left:-30 }}>
              <StatBadge delay={0.6}>
                <span style={{ fontSize:16 }}>📈</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color:'#60a5fa' }}>+127%</p>
                  <p className="text-[10px]" style={{ color:'var(--color-text-dim)' }}>leads</p>
                </div>
              </StatBadge>
            </div>

            <div className="absolute" style={{ bottom:60, left:-20 }}>
              <StatBadge delay={1.8}>
                <span style={{ fontSize:16 }}>⭐</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color:'var(--color-text)' }}>PageSpeed 98</p>
                  <p className="text-[10px]" style={{ color:'var(--color-text-dim)' }}>Google score</p>
                </div>
              </StatBadge>
            </div>

            {/* Webdigio logo watermark */}
            <div className="absolute" style={{ top:-10, left:'50%', transform:'translateX(-50%)' }}>
              <Image
                src="/assets/simple-logo.png"
                alt="Webdigio"
                width={80}
                height={24}
                className="h-5 w-auto object-contain opacity-30"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

