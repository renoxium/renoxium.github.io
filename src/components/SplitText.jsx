import React, { useEffect, useRef } from 'react';

const NBSP = ' ';

export function SplitText({ text, className = '', stagger = 22, delay = 0, style }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll('.char');
    let triggered = false;
    const fire = () => {
      if (triggered) return;
      triggered = true;
      chars.forEach((c, i) => {
        setTimeout(() => c.classList.add('in'), delay + i * stagger);
      });
    };
    const fallbackTimer = setTimeout(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      if (r.top < vh && r.bottom > 0) fire();
    }, 80);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          fire();
          io.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(fallbackTimer); };
  }, [text, stagger, delay]);

  const lines = String(text).split('\n');
  return (
    <span ref={ref} className={className} style={style}>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {line.split('').map((ch, i) => (
            <span key={i} className="char-wrap">
              <span className="char">{ch === ' ' ? NBSP : ch}</span>
            </span>
          ))}
          {li < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
}
