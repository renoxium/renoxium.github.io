'use client';

import { useEffect, useRef } from 'react';

// Magnetic hover: nudges the element toward the cursor with a 0.18 lerp easing.
// Disabled on touch / small screens.
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 900px)').matches) return;

    let raf: number | null = null;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };

    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      tx = dx * strength;
      ty = dy * strength;
      if (raf === null) raf = requestAnimationFrame(loop);
    };

    const leave = () => {
      tx = 0;
      ty = 0;
      if (raf === null) raf = requestAnimationFrame(loop);
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [strength]);
  return ref;
}
