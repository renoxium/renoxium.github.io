'use client';

import { useEffect } from 'react';

// Custom amber cursor (lerped ring + dot). Mounts once into the existing
// #cursor / #cursor-ring divs that app/layout.tsx renders into <body>.
export function Cursor() {
  useEffect(() => {
    if (window.matchMedia('(max-width: 900px)').matches) return;

    const dot = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const onEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    const HOVER_SEL = 'button, a, .magnetic, [role="button"], input, textarea';
    const TEXT_SEL = 'input, textarea, [contenteditable]';

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;
      if (t.closest(HOVER_SEL)) document.body.classList.add('cursor-hover');
      if (t.closest(TEXT_SEL)) document.body.classList.add('cursor-text');
    };
    const onOut = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;
      if (t.closest(HOVER_SEL)) document.body.classList.remove('cursor-hover');
      if (t.closest(TEXT_SEL)) document.body.classList.remove('cursor-text');
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return null;
}
