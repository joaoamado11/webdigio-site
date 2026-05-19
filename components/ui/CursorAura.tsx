'use client';

import { useEffect, useRef } from 'react';
import { useMousePosition } from '@/lib/hooks';

export default function CursorAura() {
  const auraRef = useRef<HTMLDivElement>(null);
  const pos = useMousePosition();

  useEffect(() => {
    if (!auraRef.current) return;
    auraRef.current.style.left = pos.x + 'px';
    auraRef.current.style.top  = pos.y + 'px';
  }, [pos]);

  return (
    <div
      ref={auraRef}
      className="cursor-aura"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    />
  );
}
