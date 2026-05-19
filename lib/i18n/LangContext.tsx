'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type Lang, t as tFn } from './translations';

export type CmsOverrides = Record<string, { PT: string; EN: string }>;

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>({
  lang: 'PT',
  setLang: () => {},
  t: (k) => k,
  toggle: () => {},
});

export function LangProvider({
  children,
  overrides = {},
}: {
  children: React.ReactNode;
  overrides?: CmsOverrides;
}) {
  const [lang, setLangState] = useState<Lang>('PT');

  useEffect(() => {
    const saved = localStorage.getItem('webdigio-lang') as Lang | null;
    if (saved === 'PT' || saved === 'EN') setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('webdigio-lang', l);
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === 'PT' ? 'EN' : 'PT');
  }, [lang, setLang]);

  const t = useCallback((key: string) => {
    const override = overrides[key];
    if (override) return override[lang] ?? override['PT'] ?? key;
    return tFn(key, lang);
  }, [lang, overrides]);

  return (
    <LangContext.Provider value={{ lang, setLang, t, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
