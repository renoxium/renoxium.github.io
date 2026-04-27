'use client';

import { useEffect, useRef, useState } from 'react';
import {
  PAGES,
  PAGE_LABEL,
  useStage,
  type PageKey,
} from '@/components/stage/StageContext';

const ZONE_FRACTION = 0.2;
const INTERACTIVE = 'button, a, input, textarea, select, [role="button"], [data-no-edge-nav]';

type Zone = 'left' | 'right' | null;

function nextPage(current: PageKey): PageKey | null {
  const i = PAGES.indexOf(current);
  if (i < 0) return null;
  return PAGES[(i + 1) % PAGES.length];
}

function prevPage(current: PageKey): PageKey | null {
  const i = PAGES.indexOf(current);
  if (i < 0) return null;
  return PAGES[(i - 1 + PAGES.length) % PAGES.length];
}

function ArrowGlyph({ dir }: { dir: 'left' | 'right' }) {
  const flip = dir === 'left' ? 'scaleX(-1)' : 'none';
  return (
    <span className="edge-arrow-glyph" style={{ transform: flip }}>
      <svg width="26" height="14" viewBox="0 0 26 14" fill="none">
        <path
          d="M0 7 H22 M16 1 L22 7 L16 13"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// When the cursor enters the left or right 1/5 of the viewport, the cursor
// turns into an arrow that points at the next/prev page. Click in the zone
// (on a non-interactive element) triggers the standard ball transition with
// the click point as origin. Disabled at <=900px.
export function EdgeNav() {
  const stage = useStage();
  const [zone, setZone] = useState<Zone>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const stageRef = useRef(stage);
  stageRef.current = stage;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 900px)').matches) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target as Element | null;
      const overInteractive = !!(t && t.closest && t.closest(INTERACTIVE));
      if (overInteractive) {
        setZone(null);
        return;
      }
      const vw = window.innerWidth;
      if (e.clientX < vw * ZONE_FRACTION) setZone('left');
      else if (e.clientX > vw * (1 - ZONE_FRACTION)) setZone('right');
      else setZone(null);
    };

    const onLeave = () => setZone(null);

    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (t && t.closest && t.closest(INTERACTIVE)) return;

      const s = stageRef.current;
      if (!s || s.phase !== 'idle') return;

      const vw = window.innerWidth;
      let target: PageKey | null = null;
      if (e.clientX < vw * ZONE_FRACTION) target = prevPage(s.currentPage);
      else if (e.clientX > vw * (1 - ZONE_FRACTION)) target = nextPage(s.currentPage);
      if (!target) return;

      const rect = {
        left: e.clientX - 14,
        top: e.clientY - 14,
        width: 28,
        height: 28,
      };
      s.goTo(target, { originRect: rect });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('click', onClick);
    };
  }, []);

  // Toggle body class so global custom cursor can hide itself.
  useEffect(() => {
    if (zone) document.body.classList.add('edge-active');
    else document.body.classList.remove('edge-active');
    return () => document.body.classList.remove('edge-active');
  }, [zone]);

  const visible = zone && stage.phase === 'idle';
  const target =
    zone === 'left'
      ? prevPage(stage.currentPage)
      : zone === 'right'
        ? nextPage(stage.currentPage)
        : null;

  return (
    <>
      <div
        className={`edge-strip edge-strip-left${zone === 'left' ? ' is-active' : ''}`}
        aria-hidden="true"
      />
      <div
        className={`edge-strip edge-strip-right${zone === 'right' ? ' is-active' : ''}`}
        aria-hidden="true"
      />
      {visible && target && (
        <div
          className={`edge-arrow edge-arrow-${zone}`}
          style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
          aria-hidden="true"
        >
          <div className="edge-arrow-inner">
            <ArrowGlyph dir={zone} />
            <span className="edge-arrow-label">
              <span className="edge-arrow-kicker">{zone === 'left' ? 'Previous' : 'Next'}</span>
              <span className="edge-arrow-name">{PAGE_LABEL[target]}</span>
            </span>
          </div>
        </div>
      )}
      <style>{`
        .edge-strip {
          position: fixed;
          top: 0; bottom: 0;
          width: 20vw;
          pointer-events: none;
          z-index: 40;
          transition: background 320ms ease, opacity 320ms ease;
          background: linear-gradient(to right, rgba(79, 179, 255, 0.0), rgba(79, 179, 255, 0.0));
          opacity: 0.55;
        }
        .edge-strip-left {
          left: 0;
          background: linear-gradient(to right, rgba(79, 179, 255, 0.04), rgba(79, 179, 255, 0));
        }
        .edge-strip-right {
          right: 0;
          background: linear-gradient(to left, rgba(79, 179, 255, 0.04), rgba(79, 179, 255, 0));
        }
        .edge-strip.is-active { opacity: 1; }
        .edge-strip-left.is-active {
          background: linear-gradient(to right, rgba(79, 179, 255, 0.14), rgba(79, 179, 255, 0));
        }
        .edge-strip-right.is-active {
          background: linear-gradient(to left, rgba(79, 179, 255, 0.14), rgba(79, 179, 255, 0));
        }

        body.edge-active #cursor,
        body.edge-active #cursor-ring { opacity: 0 !important; }

        .edge-arrow {
          position: fixed;
          left: 0; top: 0;
          z-index: 9999;
          pointer-events: none;
          will-change: transform;
        }
        .edge-arrow-inner {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px 14px 14px;
          border: 1px solid rgba(79, 179, 255, 0.38);
          background: rgba(14, 15, 13, 0.78);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 999px;
          color: var(--amber);
          opacity: 0;
          animation: edgeArrowIn 280ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .edge-arrow-right .edge-arrow-inner { flex-direction: row-reverse; padding: 14px 14px 14px 20px; }
        .edge-arrow-label {
          display: flex; flex-direction: column; gap: 2px; line-height: 1;
        }
        .edge-arrow-right .edge-arrow-label { align-items: flex-end; }
        .edge-arrow-kicker {
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(244, 239, 230, 0.55);
        }
        .edge-arrow-name {
          font-family: var(--serif);
          font-style: italic;
          font-variation-settings: "opsz" 144, "SOFT" 100, "wght" 360;
          font-size: 18px;
          color: var(--amber);
          letter-spacing: -0.01em;
        }
        .edge-arrow-glyph {
          width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          color: var(--amber);
        }
        @keyframes edgeArrowIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }

        @media (max-width: 900px) {
          .edge-strip, .edge-arrow { display: none !important; }
        }
      `}</style>
    </>
  );
}
