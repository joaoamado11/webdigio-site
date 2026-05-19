'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLang } from '@/lib/i18n/LangContext';

/* ── Inline styles ───────────────────────────────────────────────────────── */
const STYLES = `
@keyframes footer-breathe {
  0%   { transform: translate(-50%, -50%) scale(1);    opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.18); opacity: 0.9; }
}
@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.cinematic-footer-wrapper {
  --pill-bg-1: rgba(255,255,255,0.04);
  --pill-bg-2: rgba(255,255,255,0.02);
  --pill-shadow: rgba(0,0,0,0.5);
  --pill-highlight: rgba(255,255,255,0.08);
  --pill-inset-shadow: rgba(0,0,0,0.6);
  --pill-border: rgba(255,255,255,0.09);
  --pill-bg-1-hover: rgba(255,255,255,0.10);
  --pill-bg-2-hover: rgba(255,255,255,0.04);
  --pill-border-hover: rgba(255,255,255,0.22);
  --pill-shadow-hover: rgba(0,0,0,0.7);
  --pill-highlight-hover: rgba(255,255,255,0.15);
}
.footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}
.footer-marquee {
  animation: footer-scroll-marquee 38s linear infinite;
}
.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, rgba(59,130,246,0.055) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(59,130,246,0.055) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(59,130,246,0.18) 0%,
    rgba(96,165,250,0.09) 40%,
    transparent 70%
  );
}
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: #f1f5f9;
}
.footer-giant-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(59,130,246,0.07);
  background: linear-gradient(180deg, rgba(59,130,246,0.10) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
  font-family: var(--font-heading);
}
.footer-text-glow {
  background: linear-gradient(180deg, #f1f5f9 0%, rgba(241,245,249,0.4) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 24px rgba(241,245,249,0.14));
}
`;

/* ── Magnetic Button ─────────────────────────────────────────────────────── */
function MagneticButton({
  children, href, className, style, onClick,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const elRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { gsap } = await import('gsap');
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * 0.38, y: y * 0.38, rotationX: -y * 0.12, rotationY: x * 0.12, scale: 1.05, ease: 'power2.out', duration: 0.4 });
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: 'elastic.out(1, 0.3)', duration: 1.2 });
      };
      el.addEventListener('mousemove', onMove as EventListener);
      el.addEventListener('mouseleave', onLeave);
      cleanup = () => {
        el.removeEventListener('mousemove', onMove as EventListener);
        el.removeEventListener('mouseleave', onLeave);
      };
    })();

    return () => cleanup?.();
  }, []);

  const shared = { ref: elRef, className: `cursor-pointer ${className ?? ''}`, style };
  if (href) return <a {...shared} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>{children}</a>;
  return <button {...shared} onClick={onClick}>{children}</button>;
}

/* ── Marquee track ───────────────────────────────────────────────────────── */
function MarqueeTrack({ lang }: { lang: string }) {
  const words = lang === 'PT'
    ? ['WEBDIGIO', '✦', 'DESIGN', '✦', 'DESENVOLVIMENTO', '✦', 'SEO', '✦', 'RESULTADOS', '✦', 'CRESCIMENTO', '✦']
    : ['WEBDIGIO', '✦', 'DESIGN', '✦', 'DEVELOPMENT', '✦', 'SEO', '✦', 'RESULTS', '✦', 'GROWTH', '✦'];
  const doubled = [...words, ...words];
  return (
    <div className="flex items-center gap-10 px-6 text-xs font-bold tracking-[0.28em] uppercase" style={{ color: 'rgba(59,130,246,0.55)' }}>
      {doubled.map((w, i) => (
        <span key={i} style={w === '✦' ? { color: 'rgba(59,130,246,0.35)' } : {}}>{w}</span>
      ))}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function CTAFooter() {
  const { t, lang } = useLang();
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const giantRef    = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const linksRef    = useRef<HTMLDivElement>(null);

  const waNum = '351912345678';
  const waMsg = encodeURIComponent(t('footer.wa_msg'));

  const navLinks = lang === 'PT'
    ? [['Preço', '#preco'], ['FAQ', '#faq'], ['Suporte', '#contacto'], ['Portfólio', '#showcase']]
    : [['Price', '#preco'], ['FAQ', '#faq'], ['Support', '#contacto'], ['Portfolio', '#showcase']];

  /* GSAP parallax on giant text + staggered content reveal */
  useEffect(() => {
    if (!wrapperRef.current) return;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.fromTo(
          giantRef.current,
          { y: '12vh', scale: 0.82, opacity: 0 },
          { y: '0vh', scale: 1, opacity: 1, ease: 'power1.out',
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 85%', end: 'bottom bottom', scrub: 1.2 } }
        );
        gsap.fromTo(
          [headingRef.current, linksRef.current],
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.18, ease: 'power3.out',
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 45%', end: 'bottom bottom', scrub: 1 } }
        );
      }, wrapperRef);

      cleanup = () => ctx.revert();
    })();

    return () => cleanup?.();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/*
        Curtain-reveal wrapper: sits in normal flow (h-screen = scroll distance),
        the clip-path keeps the fixed footer invisible until scrolled into view.
      */}
      <div
        ref={wrapperRef}
        id="contacto"
        className="relative h-screen w-full"
        style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
      >
        {/* Fixed footer — revealed progressively through the clip above */}
        <footer
          className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden cinematic-footer-wrapper"
          style={{ background: '#050508', color: '#f1f5f9' }}
        >
          {/* Aurora glow */}
          <div
            className="footer-aurora footer-breathe absolute left-1/2 top-1/2 h-[55vh] w-[75vw] rounded-[50%] pointer-events-none z-0"
            style={{ filter: 'blur(90px)' }}
            aria-hidden="true"
          />

          {/* Grid */}
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />

          {/* Giant WEBDIGIO bg text */}
          <div
            ref={giantRef}
            className="footer-giant-text absolute -bottom-[6vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
            aria-hidden="true"
          >
            WEBDIGIO
          </div>

          {/* Diagonal marquee strip */}
          <div
            className="absolute top-10 left-0 w-full overflow-hidden py-3.5 z-10 -rotate-[1.5deg] scale-110 shadow-2xl"
            style={{ borderTop: '1px solid rgba(59,130,246,0.13)', borderBottom: '1px solid rgba(59,130,246,0.13)', background: 'rgba(5,5,8,0.82)', backdropFilter: 'blur(12px)' }}
          >
            <div className="footer-marquee flex w-max">
              <MarqueeTrack lang={lang} />
            </div>
          </div>

          {/* ── Main CTA ── */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-16 w-full max-w-5xl mx-auto text-center">
            <span className="section-tag mb-5">{t('footer.tag')}</span>

            <h2
              ref={headingRef}
              className="font-black footer-text-glow tracking-tighter mb-5 text-center"
              style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)', fontFamily: 'var(--font-heading)', maxWidth: '820px' }}
            >
              {t('footer.cta_title')}
            </h2>

            <p className="mb-10" style={{ color: 'rgba(148,163,184,0.82)', maxWidth: '460px', lineHeight: 1.72, fontSize: '1.05rem' }}>
              {t('footer.cta_sub')}
            </p>

            <div ref={linksRef} className="flex flex-col items-center gap-5 w-full">
              {/* Primary CTA buttons */}
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <MagneticButton
                  href={`https://wa.me/${waNum}?text=${waMsg}`}
                  className="footer-glass-pill px-9 py-4 rounded-full font-bold text-sm md:text-base flex items-center gap-2.5"
                  style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none', color: '#fff', boxShadow: '0 0 36px rgba(34,197,94,0.28), 0 4px 20px rgba(0,0,0,0.5)' }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
                  WhatsApp
                </MagneticButton>

                <MagneticButton
                  href="mailto:geral@webdigio.pt"
                  className="footer-glass-pill px-9 py-4 rounded-full font-bold text-sm md:text-base flex items-center gap-2.5"
                  style={{ color: '#f1f5f9' }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
                  {lang === 'PT' ? 'Enviar Email' : 'Send Email'}
                </MagneticButton>
              </div>

              {/* Secondary nav pills */}
              <div className="flex flex-wrap justify-center gap-2.5 mt-1">
                {navLinks.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="footer-glass-pill px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-colors duration-200"
                    style={{ color: 'rgba(148,163,184,0.72)' }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div
            className="relative z-20 w-full pb-7 pt-5 px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-3">
              <Image src="/assets/simple-logo.png" alt="Webdigio" width={28} height={28} className="h-7 w-auto object-contain" />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(100,116,139,0.85)' }}>
                © {new Date().getFullYear()} Webdigio. {t('footer.rights')}
              </span>
            </div>

            <MagneticButton
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-11 h-11 rounded-full footer-glass-pill flex items-center justify-center group"
              style={{ color: 'rgba(100,116,139,0.85)' }}
            >
              <svg className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}
