'use client';

import Image from 'next/image';
import { useLang } from '@/lib/i18n/LangContext';
import { useInView } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const TECHS = [
  { name: 'Next.js',     logo: '/assets/nextjs.svg' },
  { name: 'React',       logo: '/assets/react.svg' },
  { name: 'TypeScript',  logo: '/assets/typescript.svg' },
  { name: 'Tailwind',    logo: '/assets/tailwind.svg' },
  { name: 'Node.js',     logo: '/assets/nodejs.svg' },
  { name: 'HTML5',       logo: '/assets/html5.svg' },
  { name: 'CSS3',        logo: '/assets/css3.svg' },
  { name: 'JavaScript',  logo: '/assets/javascript.svg' },
  { name: 'Figma',       logo: '/assets/figma.svg' },
  { name: 'VS Code',     logo: '/assets/vscode.svg' },
];

// Duplicate for seamless loop
const TRACK = [...TECHS, ...TECHS];

export default function TechStack() {
  const { t } = useLang();
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="tecnologias"
      className="relative py-20 overflow-hidden"
      style={{ background: 'var(--color-surface)' }}
    >
      <div className={cn('text-center mb-12 transition-all duration-700', inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
        <span className="section-tag">{t('stack.tag')}</span>
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
          {t('stack.title')}
        </h2>
      </div>

      {/* Fade masks */}
      <div
        className="absolute inset-y-0 left-0 z-10 pointer-events-none"
        style={{ width: '100px', background: 'linear-gradient(to right, var(--color-surface), transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 right-0 z-10 pointer-events-none"
        style={{ width: '100px', background: 'linear-gradient(to left, var(--color-surface), transparent)' }}
        aria-hidden="true"
      />

      {/* Marquee */}
      <div className="overflow-hidden">
        <div
          className="flex items-center gap-10"
          style={{ width: 'max-content', animation: 'marquee 28s linear infinite' }}
        >
          {TRACK.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="flex flex-col items-center gap-2 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <Image
                  src={tech.logo}
                  alt={tech.name}
                  width={40}
                  height={40}
                  className="object-contain h-10 w-auto"
                />
              </div>
              <span className="text-xs font-semibold" style={{ color: 'var(--color-text-dim)' }}>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
