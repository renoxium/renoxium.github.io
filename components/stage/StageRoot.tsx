'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Cursor } from '@/components/cursor/Cursor';
import { EdgeNav } from '@/components/nav/EdgeNav';
import { MobileScrollNav } from '@/components/nav/MobileScrollNav';
import { Nav } from '@/components/nav/Nav';
import { Ball } from './Ball';
import { PageHolder } from './PageHolder';
import {
  PAGES,
  PAGE_DIR,
  PAGE_PATH,
  StageContextProvider,
  pathToPage,
  type GoToOptions,
  type PageKey,
  type Phase,
  type StageContextValue,
} from './StageContext';

const rootStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  overflow: 'hidden',
  background:
    'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(79, 179, 255, 0.06) 0%, transparent 55%),' +
    'radial-gradient(ellipse 80% 60% at 100% 100%, rgba(79, 179, 255, 0.04) 0%, transparent 55%),' +
    'var(--bg)',
};

const cornerWord: CSSProperties = {
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
  transition: 'opacity 420ms ease, transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1)',
};

const cornerCredit: CSSProperties = {
  color: 'var(--ink-4)',
  letterSpacing: '0.08em',
  textTransform: 'none',
  fontStyle: 'italic',
};

const cornerCreditName: CSSProperties = {
  color: 'var(--amber)',
  fontFamily: 'var(--serif)',
  fontStyle: 'italic',
  fontSize: 13,
  letterSpacing: '-0.01em',
  fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 360',
  textTransform: 'none',
};

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const raf = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const raf2 = () =>
  new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

type Props = { children: ReactNode };

// Mounted by app/(stage)/layout.tsx so it survives across route changes inside the
// (stage) group. Owns the phase machine, the ball, all nav chrome, and the cursor.
// {children} is the matched route segment, rendered inside <PageHolder>.
export default function StageRoot({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const ballRef = useRef<HTMLDivElement | null>(null);

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches,
  );

  // currentPage is initialized synchronously from the URL on cold load, so the
  // server-rendered content matches the URL with no animation flash.
  const [currentPage, setCurrentPage] = useState<PageKey>(() => pathToPage(pathname));
  const currentPageRef = useRef<PageKey>(currentPage);
  currentPageRef.current = currentPage;

  const [phase, setPhase] = useState<Phase>('idle');
  const phaseRef = useRef<Phase>('idle');
  phaseRef.current = phase;

  // True while goTo() is driving a transition. Prevents the pathname effect
  // from snapping mid-flight.
  const inFlightRef = useRef(false);

  const implodeOriginRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [implodeOrigin, setImplodeOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  // Track viewport size — animation timings shrink on mobile.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Lock the document so the only scrollable surface is the page-shell inside
  // the route segment. Mirrors what the old App.jsx did on mount.
  useEffect(() => {
    document.documentElement.style.setProperty('--scale', '0.95');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  // Sync currentPage with the URL when an *external* nav happens
  // (popstate, direct entry, programmatic router.push outside of goTo).
  // For Phase 1 this is an instant snap — no animation. goTo() flips
  // inFlightRef so we don't fight ourselves while the cinematic is running.
  useEffect(() => {
    if (inFlightRef.current) return;
    const urlPage = pathToPage(pathname);
    if (urlPage !== currentPageRef.current) {
      setCurrentPage(urlPage);
      currentPageRef.current = urlPage;
    }
  }, [pathname]);

  const animateBall = useCallback(
    (
      from: Keyframe,
      to: Keyframe,
      opts: { duration?: number; easing?: string } = {},
    ) =>
      new Promise<void>((resolve) => {
        const ball = ballRef.current;
        if (!ball) {
          resolve();
          return;
        }
        const dur = opts.duration ?? 700;
        const easing = opts.easing ?? 'cubic-bezier(0.7, 0, 0.2, 1)';
        const anim = ball.animate([from, to], { duration: dur, easing, fill: 'forwards' });
        anim.onfinish = () => resolve();
        anim.oncancel = () => resolve();
      }),
    [],
  );

  const goTo = useCallback(
    async (next: PageKey, opts: GoToOptions = {}) => {
      if (next === currentPageRef.current || phaseRef.current !== 'idle') return;

      inFlightRef.current = true;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cx = vw / 2;
      const cy = vh / 2;
      const margin = isMobile ? 32 : 64;
      const clampX = (x: number) => Math.max(margin, Math.min(vw - margin, x));
      const clampY = (y: number) => Math.max(margin, Math.min(vh - margin, y));

      const r = opts.originRect;
      const rawOrigin = r
        ? { x: r.left + r.width / 2, y: r.top + r.height * 0.42 }
        : { x: cx, y: cy };
      const origin = { x: clampX(rawOrigin.x), y: clampY(rawOrigin.y) };
      implodeOriginRef.current = origin;
      setImplodeOrigin(origin);

      // Phase 1: implode — page scales down to origin point.
      setPhase('implode');
      await wait(isMobile ? 480 : 720);

      // Phase 2: chase. Push the URL now (Next prefetched, RSC already cached
      // for hovered links) so children swap while PageHolder is opacity:0.
      setPhase('chase');
      await raf2();
      const ball = ballRef.current;
      if (ball) {
        ball.style.left = origin.x + 'px';
        ball.style.top = origin.y + 'px';
        ball.style.opacity = '0';
        ball.style.transform = 'translate(-50%, -50%) scale(0.4)';
      }
      await raf();

      startTransition(() => {
        router.push(PAGE_PATH[next]);
      });

      await animateBall(
        { transform: 'translate(-50%, -50%) scale(0.4)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1.15)', opacity: 1 },
        { duration: 320, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)' },
      );
      await animateBall(
        { transform: 'translate(-50%, -50%) scale(1.15)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { duration: 180, easing: 'ease-out' },
      );

      // Bezier arc: origin → mid (offset by direction) → centre.
      const [dx, dy] = PAGE_DIR[next];
      const arcAmount = Math.min(240, Math.min(vw, vh) * 0.25);
      const midX = clampX((origin.x + cx) / 2 + dy * arcAmount);
      const midY = clampY((origin.y + cy) / 2 - dx * arcAmount);
      const dur = isMobile ? 1100 : 1900;
      const startT = performance.now();
      await new Promise<void>((resolve) => {
        const tick = (t: number) => {
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
            rafIdRef.current = requestAnimationFrame(tick);
          } else {
            resolve();
          }
        };
        rafIdRef.current = requestAnimationFrame(tick);
      });

      await wait(120);

      setPhase('explode-init');
      await wait(isMobile ? 220 : 280);
      setPhase('explode');

      void animateBall(
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(45)', opacity: 0 },
        { duration: 520, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
      );

      await wait(isMobile ? 580 : 820);

      setPhase('idle');
      currentPageRef.current = next;
      inFlightRef.current = false;
    },
    [isMobile, router, animateBall],
  );

  // Keyboard nav: ←/↑ previous, →/↓ next.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'idle') return;
      const idx = PAGES.indexOf(currentPageRef.current);
      if (idx < 0) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goTo(PAGES[(idx + 1) % PAGES.length]);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goTo(PAGES[(idx - 1 + PAGES.length) % PAGES.length]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  // Cancel any in-flight RAF on unmount.
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const ctxValue: StageContextValue = {
    currentPage,
    phase,
    isMobile,
    goTo,
  };

  const showCorner = currentPage === 'home' && phase === 'idle';

  return (
    <StageContextProvider value={ctxValue}>
      <div style={rootStyle}>
        <PageHolder isMobile={isMobile} implodeOrigin={implodeOrigin}>
          {children}
        </PageHolder>

        <Ball ref={ballRef} />

        <EdgeNav />
        <MobileScrollNav />

        <div
          style={{
            ...cornerWord,
            opacity: showCorner ? 1 : 0,
            transform: showCorner ? 'translateY(0)' : 'translateY(8px)',
          }}
          aria-hidden={!showCorner}
        >
          <span>Renoxium</span>
          <span style={cornerCredit}>
            design idea by <span style={cornerCreditName}>Raoul</span>
          </span>
        </div>

        <Nav />
        <Cursor />
      </div>
    </StageContextProvider>
  );
}
