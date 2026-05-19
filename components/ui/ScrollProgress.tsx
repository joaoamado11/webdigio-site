'use client';

import { useScrollProgress } from '@/lib/hooks';

export default function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div
      className="scroll-progress-bar"
      style={{ transform: `scaleX(${progress})` }}
      aria-hidden="true"
    />
  );
}
