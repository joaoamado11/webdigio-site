'use client';

import { useLang } from '@/lib/i18n/LangContext';

const DEFAULT_VIDEOS = [
  'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4',
  'https://videos.pexels.com/video-files/4549682/4549682-hd_1920_1080_30fps.mp4',
  'https://videos.pexels.com/video-files/4884236/4884236-uhd_2560_1440_30fps.mp4',
  'https://videos.pexels.com/video-files/5137045/5137045-uhd_2560_1440_30fps.mp4',
] as const;

const videoSrc = DEFAULT_VIDEOS[Math.floor(Math.random() * DEFAULT_VIDEOS.length)];

export default function InnerHero() {
  const { t } = useLang();

  return (
    <section
      className="relative w-screen h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#060912' }}
    >
      {/* Random autoplay background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-35"
        autoPlay
        muted
        loop
        playsInline
        key={videoSrc}
        aria-hidden="true"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(6,9,18,0.5) 0%, rgba(6,9,18,0.2) 50%, rgba(6,9,18,0.7) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle animated glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'pulse-glow 3s ease-in-out infinite',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 gap-6 max-w-4xl">
        {/* Badge */}
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full bg-[#3b82f6] animate-ping"
            style={{ opacity: 0.8 }}
          />
          <span
            className="text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: 'rgba(96,165,250,0.9)' }}
          >
            {t('inner.badge')}
          </span>
          <span
            className="inline-block w-2 h-2 rounded-full bg-[#3b82f6] animate-ping"
            style={{ opacity: 0.8 }}
          />
        </div>

        {/* Headline */}
        <div>
          <p
            className="text-2xl md:text-3xl font-medium mb-2"
            style={{ color: 'rgba(241,245,249,0.7)' }}
          >
            {t('inner.pre')}
          </p>
          <h2
            className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
            style={{
              fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #fff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('inner.main')}
          </h2>
        </div>

        {/* Lead text */}
        <p
          className="text-lg md:text-xl leading-relaxed max-w-2xl"
          style={{ color: 'rgba(148,163,184,0.9)' }}
        >
          {t('inner.lead')}
        </p>

        <p
          className="text-sm"
          style={{ color: 'rgba(100,116,139,1)' }}
        >
          {t('inner.sub')}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <a
            href="#contacto"
            className="btn btn-primary text-base px-7 py-3.5"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('inner.cta1')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a
            href="#preco"
            className="btn btn-ghost text-base px-7 py-3.5"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('preco')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            {t('inner.cta2')}
          </a>
        </div>
      </div>
    </section>
  );
}
