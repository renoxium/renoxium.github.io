import { useEffect, useRef } from 'react';

export function useMagnetic(strength = 0.35) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(max-width: 900px)').matches) return;

    let raf, tx = 0, ty = 0, cx = 0, cy = 0;
    function move(e) {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      tx = dx * strength; ty = dy * strength;
      if (!raf) raf = requestAnimationFrame(loop);
    }
    function leave() {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    }
    function loop() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return ref;
}
