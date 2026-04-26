import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Nav from './Nav.jsx';
import EdgeNav from './EdgeNav.jsx';

export const PAGES = ['home', 'craft', 'process', 'edge', 'faq', 'contact'];

export const PAGE_DIR = {
  home:    [ 0, -1.2 ],
  craft:   [-1.2,  0.9 ],
  process: [ 1.2,  0.9 ],
  edge:    [ 0,  1.2 ],
  faq:     [-1.2, -0.9 ],
  contact: [ 1.2, -0.9 ],
};

export const PAGE_LABEL = {
  home:    'Home',
  craft:   'Craft',
  process: 'Process',
  edge:    'Edge',
  faq:     'FAQ',
  contact: 'Contact',
};

const StageContext = createContext(null);
export function useStage() { return useContext(StageContext); }

const stageStyles = {
  root: {
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    background: 'var(--bg)',
  },
  pageHolder: {
    position: 'absolute',
    inset: 0,
  },
  ball: {
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
  },
  cornerWord: {
    position: 'fixed',
    left: 28,
    bottom: 24,
    fontFamily: 'var(--mono)',
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    zIndex: 60,
    pointerEvents: 'none',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
  },
  cornerCredit: {
    color: 'var(--ink-4)',
    letterSpacing: '0.08em',
    textTransform: 'none',
    fontStyle: 'italic',
  },
  cornerCreditName: {
    color: 'var(--amber)',
    fontFamily: 'var(--serif)',
    fontStyle: 'italic',
    fontSize: 13,
    letterSpacing: '-0.01em',
    fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 360',
    textTransform: 'none',
  },
};

export default function Stage({ pages }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [phase, setPhase] = useState('idle');
  const ballRef = useRef(null);
  const currentPageRef = useRef('home');
  const rafRef = useRef(null);
  const implodeOriginRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const animateBall = useCallback((from, to, opts = {}) => {
    return new Promise((resolve) => {
      const ball = ballRef.current;
      if (!ball) { resolve(); return; }
      const dur = opts.duration ?? 700;
      const easing = opts.easing ?? 'cubic-bezier(0.7, 0, 0.2, 1)';
      const anim = ball.animate([from, to], { duration: dur, easing, fill: 'forwards' });
      anim.onfinish = () => resolve();
    });
  }, []);

  const goTo = useCallback(async (next, originRect) => {
    if (next === currentPage || phase !== 'idle') return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = vw / 2;
    const cy = vh / 2;
    const margin = isMobile ? 32 : 64;
    const clampX = (x) => Math.max(margin, Math.min(vw - margin, x));
    const clampY = (y) => Math.max(margin, Math.min(vh - margin, y));

    const rawOrigin = originRect
      ? {
          x: originRect.left + originRect.width / 2,
          y: originRect.top + originRect.height * 0.42,
        }
      : { x: cx, y: cy };
    const origin = { x: clampX(rawOrigin.x), y: clampY(rawOrigin.y) };

    implodeOriginRef.current = origin;
    setPhase('implode');
    await new Promise(r => setTimeout(r, isMobile ? 480 : 720));

    setPhase('chase');
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const ball = ballRef.current;
    if (ball) {
      ball.style.left = origin.x + 'px';
      ball.style.top = origin.y + 'px';
      ball.style.opacity = '0';
      ball.style.transform = 'translate(-50%, -50%) scale(0.4)';
    }
    await new Promise(r => requestAnimationFrame(r));

    await animateBall(
      { transform: 'translate(-50%, -50%) scale(0.4)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1.15)', opacity: 1 },
      { duration: 320, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)' }
    );
    await animateBall(
      { transform: 'translate(-50%, -50%) scale(1.15)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { duration: 180, easing: 'ease-out' }
    );

    const [dx, dy] = PAGE_DIR[next];
    const arcAmount = Math.min(240, Math.min(vw, vh) * 0.25);
    const midX = clampX((origin.x + cx) / 2 + dy * arcAmount);
    const midY = clampY((origin.y + cy) / 2 - dx * arcAmount);
    const dur = isMobile ? 1100 : 1900;
    const startT = performance.now();
    await new Promise((resolve) => {
      const tick = (t) => {
        const k = Math.min(1, (t - startT) / dur);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        const u = 1 - e;
        const px = u * u * origin.x + 2 * u * e * midX + e * e * cx;
        const py = u * u * origin.y + 2 * u * e * midY + e * e * cy;
        if (ball) {
          ball.style.left = clampX(px) + 'px';
          ball.style.top = clampY(py) + 'px';
          const dip = 1 - 0.18 * Math.sin(e * Math.PI);
          ball.style.transform = `translate(-50%, -50%) scale(${dip})`;
        }
        if (k > 0.5 && currentPageRef.current !== next) {
          currentPageRef.current = next;
          setCurrentPage(next);
        }
        if (k < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    });

    await new Promise(r => setTimeout(r, 120));

    setPhase('explode-init');
    await new Promise(r => setTimeout(r, isMobile ? 220 : 280));
    setPhase('explode');

    animateBall(
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(45)', opacity: 0 },
      { duration: 520, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' }
    );

    await new Promise(r => setTimeout(r, isMobile ? 580 : 820));

    setPhase('idle');
    currentPageRef.current = next;
  }, [currentPage, phase, isMobile, animateBall]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const idx = PAGES.indexOf(currentPage);
        goTo(PAGES[(idx + 1) % PAGES.length]);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const idx = PAGES.indexOf(currentPage);
        goTo(PAGES[(idx - 1 + PAGES.length) % PAGES.length]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentPage, goTo]);

  const pageTransform = (() => {
    if (phase === 'implode') return 'translate3d(0,0,0) scale(0.04)';
    if (phase === 'explode-init') return 'translate3d(0,0,0) scale(0)';
    return 'translate3d(0,0,0) scale(1)';
  })();

  const pageOpacity = (() => {
    if (phase === 'chase') return 0;
    if (phase === 'implode') return 0.6;
    if (phase === 'explode-init') return 0;
    if (phase === 'explode') return 1;
    return 1;
  })();

  const pageTransition = (() => {
    const implodeMs = isMobile ? 480 : 700;
    const explodeMs = isMobile ? 520 : 720;
    if (phase === 'implode') return `transform ${implodeMs}ms cubic-bezier(0.7, 0, 0.84, 0), opacity ${implodeMs}ms ease-in`;
    if (phase === 'explode') return `transform ${explodeMs}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${Math.round(explodeMs * 0.7)}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    return 'none';
  })();
  const transformOrigin = phase === 'implode'
    ? `${implodeOriginRef.current.x}px ${implodeOriginRef.current.y}px`
    : '50% 50%';

  return (
    <StageContext.Provider value={{ currentPage, goTo, phase, isMobile }}>
      <div style={stageStyles.root}>
        <div
          key={currentPage}
          style={{
            ...stageStyles.pageHolder,
            transform: pageTransform,
            transformOrigin,
            opacity: pageOpacity,
            transition: pageTransition,
          }}
          className="stage-page"
        >
          {pages[currentPage]}
        </div>

        <div ref={ballRef} style={stageStyles.ball} aria-hidden="true" />

        <EdgeNav />

        <div style={stageStyles.cornerWord}>
          <span>Renoxium</span>
          <span style={stageStyles.cornerCredit}>
            idea by <span style={stageStyles.cornerCreditName}>Raoul</span>
          </span>
        </div>
        <Nav />
      </div>
    </StageContext.Provider>
  );
}
