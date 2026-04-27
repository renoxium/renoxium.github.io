'use client';

import { Fragment, useEffect, useRef, type CSSProperties } from 'react';

const NBSP = ' ';

type Props = {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
  style?: CSSProperties;
};

// Splits text into per-character spans, then triggers .in (cascaded) once the
// element scrolls into view. Falls back to a timer in case IntersectionObserver
// is delayed or the element is already on-screen at mount.
export function SplitText({ text, className = '', stagger = 22, delay = 0, style }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>('.char');
    let triggered = false;
    const fire = () => {
      if (triggered) return;
      triggered = true;
      chars.forEach((c, i) => {
        setTimeout(() => c.classList.add('in'), delay + i * stagger);
      });
    };
    const fallback = setTimeout(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      if (r.top < vh && r.bottom > 0) fire();
    }, 80);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fire();
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [text, stagger, delay]);

  const lines = String(text).split('\n');
  return (
    <span ref={ref} className={className} style={style}>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {line.split('').map((ch, i) => (
            <span key={i} className="char-wrap">
              <span className="char">{ch === ' ' ? NBSP : ch}</span>
            </span>
          ))}
          {li < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </span>
  );
}
