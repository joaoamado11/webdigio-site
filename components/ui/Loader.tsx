'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n/LangContext';

export default function Loader() {
  const { t } = useLang();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Hide after short delay — allows critical CSS/fonts to load
    const timer = setTimeout(() => setHidden(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div
      className="loader-overlay"
      style={{ opacity: hidden ? 0 : 1, transition: 'opacity 0.6s ease' }}
      aria-hidden="true"
    >
      <div className="loader-spinner" />
      <p className="loader-text">{t('loader.text')}</p>
    </div>
  );
}
