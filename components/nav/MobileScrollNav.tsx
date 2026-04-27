'use client';

import { useEffect, useRef, useState } from 'react';
import {
  PAGES,
  PAGE_LABEL,
  useStage,
  type PageKey,
} from '@/components/stage/StageContext';

const TRIGGER = 110;
const SHOW_AT = 30;

type PullDir = 'top' | 'bottom';
type PullState = { dir: PullDir; distance: number };

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

function ArrowGlyph({ dir }: { dir: PullDir }) {
  const transform = dir === 'top' ? 'rotate(-90deg)' : 'rotate(90deg)';
  return (
    <span className="mscroll-glyph" style={{ transform }}>
      <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
        <path
          d="M0 6 H18 M14 1 L19 6 L14 11"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// Mobile only: at top of page-shell pull DOWN to go previous, at bottom pull UP
// to go next. Triggers the same ball transition. Disabled at >900px.
export function MobileScrollNav() {
  const stage = useStage();
  const stageRef = useRef(stage);
  stageRef.current = stage;
  const [pull, setPull] = useState<PullState | null>(null);

  useEffect(() => {
    if (!stage.isMobile) return;
    if (typeof window === 'undefined') return;

    let startY: number | null = null;
    let activeShell: HTMLElement | null = null;
    let pullDir: PullDir | null = null;
    let pullDist = 0;
    let committed = false;

    const findShell = (): HTMLElement | null =>
      document.querySelector<HTMLElement>('.stage-page .page-shell');

    const onTouchStart = (e: TouchEvent) => {
      const s = stageRef.current;
      if (s.phase !== 'idle') return;

      const t = e.target as Element | null;
      if (
        t &&
        t.closest &&
        t.closest('input, textarea, select, button, a, [role="button"]')
      ) {
        startY = null;
        return;
      }

      activeShell = findShell();
      if (!activeShell) return;
      startY = e.touches[0].clientY;
      pullDir = null;
      pullDist = 0;
      committed = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startY === null || !activeShell) return;
      const s = stageRef.current;
      if (s.phase !== 'idle') return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      const top = activeShell.scrollTop;
      const bottomDist =
        activeShell.scrollHeight - (top + activeShell.clientHeight);
      const atTop = top <= 1;
      const atBottom = bottomDist <= 1;

      if (atTop && deltaY > 0) {
        pullDir = 'top';
        pullDist = deltaY;
        if (deltaY >= SHOW_AT) setPull({ dir: 'top', distance: deltaY });
        else setPull(null);
        return;
      }
      if (atBottom && deltaY < 0) {
        pullDir = 'bottom';
        pullDist = -deltaY;
        if (-deltaY >= SHOW_AT) setPull({ dir: 'bottom', distance: -deltaY });
        else setPull(null);
        return;
      }
      pullDir = null;
      pullDist = 0;
      setPull(null);
    };

    const onTouchEnd = () => {
      const s = stageRef.current;
      if (pullDir && pullDist >= TRIGGER && s.phase === 'idle' && !committed) {
        committed = true;
        const target =
          pullDir === 'top' ? prevPage(s.currentPage) : nextPage(s.currentPage);
        if (target) {
          const cx = window.innerWidth / 2;
          const rect =
            pullDir === 'top'
              ? { left: cx - 14, top: 36, width: 28, height: 28 }
              : { left: cx - 14, top: window.innerHeight - 60, width: 28, height: 28 };
          s.goTo(target, { originRect: rect });
        }
      }
      startY = null;
      activeShell = null;
      pullDir = null;
      pullDist = 0;
      setPull(null);
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [stage.isMobile]);

  if (!pull) return null;

  const target =
    pull.dir === 'top' ? prevPage(stage.currentPage) : nextPage(stage.currentPage);
  if (!target) return null;

  const progress = Math.min(1, pull.distance / TRIGGER);
  const ready = progress >= 1;

  return (
    <>
      <div
        className={`mscroll-pill mscroll-pill-${pull.dir}${ready ? ' is-ready' : ''}`}
        aria-hidden="true"
      >
        <div className="mscroll-pill-inner">
          <ArrowGlyph dir={pull.dir} />
          <span className="mscroll-label">
            <span className="mscroll-kicker">Pull to go to</span>
            <span className="mscroll-name">{PAGE_LABEL[target]}</span>
          </span>
          <span
            className="mscroll-progress"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>
      <style>{`
        .mscroll-pill {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9990;
          pointer-events: none;
          padding: 12px 18px;
          border: 1px solid rgba(79, 179, 255, 0.35);
          background: rgba(20, 21, 27, 0.78);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 999px;
          color: var(--amber);
          opacity: 0;
          animation: mscrollIn 220ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          overflow: hidden;
        }
        .mscroll-pill-top    { top: 18px; }
        .mscroll-pill-bottom { bottom: 18px; }

        .mscroll-pill.is-ready {
          background: rgba(79, 179, 255, 0.18);
          border-color: var(--amber);
          color: var(--amber);
        }

        .mscroll-pill-inner {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 1;
        }

        .mscroll-progress {
          position: absolute;
          inset: -12px -18px;
          background: rgba(79, 179, 255, 0.10);
          transform-origin: left;
          transform: scaleX(0);
          z-index: 0;
          transition: transform 80ms linear;
        }

        .mscroll-label {
          display: flex; flex-direction: column; gap: 2px; line-height: 1;
        }
        .mscroll-kicker {
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(244, 239, 230, 0.55);
        }
        .mscroll-name {
          font-family: var(--serif);
          font-style: italic;
          font-variation-settings: "opsz" 144, "SOFT" 100, "wght" 360;
          font-size: 16px;
          color: var(--amber);
          letter-spacing: -0.01em;
        }
        .mscroll-glyph {
          width: 22px; height: 12px;
          display: inline-flex; align-items: center; justify-content: center;
          color: var(--amber);
        }

        @keyframes mscrollIn {
          0%   { opacity: 0; transform: translateX(-50%) translateY(${pull.dir === 'top' ? '-12px' : '12px'}); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @media (min-width: 901px) {
          .mscroll-pill { display: none; }
        }
      `}</style>
    </>
  );
}
