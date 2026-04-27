'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useStage } from './StageContext';

const baseStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
};

type Props = {
  children: ReactNode;
  isMobile: boolean;
  implodeOrigin: { x: number; y: number };
};

// Wraps the route segment ({children}) in the transform/opacity surface
// that the Stage phase machine animates. Equivalent of the old <div className="stage-page">.
export function PageHolder({ children, isMobile, implodeOrigin }: Props) {
  const { phase } = useStage();

  const transform = (() => {
    if (phase === 'implode') return 'translate3d(0,0,0) scale(0.04)';
    if (phase === 'explode-init') return 'translate3d(0,0,0) scale(0)';
    return 'translate3d(0,0,0) scale(1)';
  })();

  const opacity = (() => {
    if (phase === 'chase') return 0;
    if (phase === 'implode') return 0.6;
    if (phase === 'explode-init') return 0;
    return 1;
  })();

  const transition = (() => {
    const implodeMs = isMobile ? 480 : 700;
    const explodeMs = isMobile ? 520 : 720;
    if (phase === 'implode') {
      return `transform ${implodeMs}ms cubic-bezier(0.7, 0, 0.84, 0), opacity ${implodeMs}ms ease-in`;
    }
    if (phase === 'explode') {
      return `transform ${explodeMs}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${Math.round(explodeMs * 0.7)}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    }
    return 'none';
  })();

  const transformOrigin = phase === 'implode'
    ? `${implodeOrigin.x}px ${implodeOrigin.y}px`
    : '50% 50%';

  return (
    <div
      style={{ ...baseStyle, transform, transformOrigin, opacity, transition }}
      className="stage-page"
    >
      {children}
    </div>
  );
}
