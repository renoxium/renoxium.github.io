'use client';

import { forwardRef } from 'react';

const ballStyle: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  top: 0,
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: 'var(--amber)',
  boxShadow: '0 0 36px rgba(79, 179, 255, 0.95), 0 0 90px rgba(79, 179, 255, 0.5)',
  pointerEvents: 'none',
  zIndex: 95,
  willChange: 'transform, opacity',
  opacity: 0,
  transform: 'translate(-50%, -50%) scale(0.6)',
};

export const Ball = forwardRef<HTMLDivElement>(function Ball(_props, ref) {
  return <div ref={ref} style={ballStyle} aria-hidden="true" />;
});
