'use client';

import { useEffect } from 'react';

// Syncs data-theme attribute with localStorage on the <html> element.
// The inline script in layout.tsx prevents FOUC; this component keeps
// the toggle in sync after hydration.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem('webdigio-theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  return <>{children}</>;
}
