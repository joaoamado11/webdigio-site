'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useLang } from '@/lib/i18n/LangContext';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ui/ThemeToggle';

const NAV_LINKS = [
  { href: '#expertise',  key: 'nav.expertise' },
  { href: '#showcase',   key: 'nav.servicos' },
  { href: '#processo',   key: 'nav.processo' },
  { href: '#preco',      key: 'nav.preco' },
] as const;

export default function Navbar() {
  const { t, lang, toggle: toggleLang } = useLang();
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobile]   = useState(false);
  const [shareOpen, setShare]     = useState(false);
  const [portalDone, setPortalDone] = useState(false);

  useEffect(() => {
    // If page already scrolled past hero on mount, show navbar immediately
    if (window.scrollY > window.innerHeight * 0.8) {
      setPortalDone(true);
    }

    const onComplete = () => setPortalDone(true);
    const onReset    = () => setPortalDone(false);
    window.addEventListener('portal-complete', onComplete);
    window.addEventListener('portal-reset', onReset);

    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });

    return () => {
      window.removeEventListener('portal-complete', onComplete);
      window.removeEventListener('portal-reset', onReset);
      window.removeEventListener('scroll', handler);
    };
  }, []);

  const handleAnchor = useCallback((href: string) => {
    setMobile(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleShare = useCallback(async (platform: string) => {
    const url = window.location.href;
    const text = 'Webdigio — Agência Digital Premium';
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
    } else if (platform === 'x') {
      window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'li') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    }
    setShare(false);
  }, []);

  return (
    <>
      {/* Main nav pill */}
      <nav
        className={cn(
          'fixed top-4 left-1/2 -translate-x-1/2 z-50',
          'w-[calc(100%-2rem)] max-w-5xl',
          'transition-[opacity,transform] duration-700 ease-out',
          portalDone
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-3 pointer-events-none'
        )}
        aria-label="Main navigation"
      >
        <div
          className={cn(
            'glass rounded-2xl px-4 py-2.5 flex items-center justify-between gap-4',
            'transition-all duration-300',
            scrolled ? 'shadow-2xl' : 'shadow-lg'
          )}
        >
          {/* Logo */}
          <a
            href="#"
            className="flex-shrink-0 flex items-center"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <Image src="/assets/simple-logo.png" alt="Webdigio" width={110} height={28} className="h-7 w-auto object-contain" priority />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, key }) => (
              <button
                key={href}
                onClick={() => handleAnchor(href)}
                className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors cursor-pointer"
              >
                {t(key)}
              </button>
            ))}
            <button
              onClick={() => handleAnchor('#contacto')}
              className="ml-2 px-4 py-1.5 rounded-xl text-sm font-semibold bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              {t('nav.contactar')}
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Lang toggle */}
            <button
              onClick={toggleLang}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Toggle language"
            >
              {lang}
            </button>

            {/* Share */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShare(p => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                {t('nav.share')}
              </button>
              {shareOpen && (
                <div className="absolute right-0 top-full mt-2 glass rounded-xl p-2 flex gap-1 shadow-xl">
                  <button onClick={() => handleShare('x')} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer" aria-label="Share on X"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></button>
                  <button onClick={() => handleShare('li')} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer" aria-label="Share on LinkedIn"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></button>
                  <div className="w-px bg-white/10 mx-1" />
                  <button onClick={() => handleShare('copy')} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer" aria-label="Copy link"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobile(p => !p)}
              className="md:hidden flex flex-col gap-1 w-8 h-8 items-center justify-center cursor-pointer"
              aria-label={t('aria.menu')}
              aria-expanded={mobileOpen}
            >
              <span className={cn('block w-5 h-0.5 bg-[var(--color-text)] transition-all', mobileOpen && 'rotate-45 translate-y-1.5')} />
              <span className={cn('block w-5 h-0.5 bg-[var(--color-text)] transition-all', mobileOpen && 'opacity-0')} />
              <span className={cn('block w-5 h-0.5 bg-[var(--color-text)] transition-all', mobileOpen && '-rotate-45 -translate-y-1.5')} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          'md:hidden glass mt-2 rounded-2xl overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        )}>
          <div className="p-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, key }) => (
              <button
                key={href}
                onClick={() => handleAnchor(href)}
                className="text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors cursor-pointer"
              >
                {t(key)}
              </button>
            ))}
            <button
              onClick={() => handleAnchor('#contacto')}
              className="mt-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity text-center cursor-pointer"
            >
              {t('nav.contactar')}
            </button>
            <div className="flex items-center gap-2 mt-2 px-2">
              <ThemeToggle />
              <button onClick={toggleLang} className="px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--color-text-muted)] hover:bg-white/5 cursor-pointer">{lang}</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Click-outside overlay for share */}
      {shareOpen && <div className="fixed inset-0 z-40" onClick={() => setShare(false)} />}
    </>
  );
}
