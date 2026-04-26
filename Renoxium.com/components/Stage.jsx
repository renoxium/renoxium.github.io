// Stage - the page-router with cinematic ball transition between pages.
//
// Page system:
//   pages: home, craft, process, faq, contact
//   each page renders inside a perspective container; only one is mounted at a time.
//   transitions go through a 5-stage timeline:
//     0. idle (current page mounted)
//     1. outgoing-ball: clicked nav label morphs into a ball; ball flies in assigned direction
//     2. void: background lerps to cream/light; ball implodes off-screen
//     3. incoming-ball: a new ball flies in from the assigned direction of the new page
//     4. unfold: ball lands centre, expands, new page mounts; nav reflows
//
// Mobile fallback: simple crossfade on viewports under 720px.

const PAGES = ['home', 'craft', 'process', 'faq', 'contact'];

// direction vector per page (where the ball is sent / arrives from)
// units: viewport fractions, x then y. positive y = down.
const PAGE_DIR = {
  home:    [ 0, -1.2 ],   // top
  craft:   [-1.2,  0.9 ], // bottom-left
  process: [ 1.2,  0.9 ], // bottom-right
  faq:     [-1.2, -0.9 ], // top-left
  contact: [ 1.2, -0.9 ], // top-right
};

const PAGE_LABEL = {
  home:    'Home',
  craft:   'Craft',
  process: 'Process',
  faq:     'FAQ',
  contact: 'Contact',
};

const StageContext = React.createContext(null);
function useStage() { return React.useContext(StageContext); }

const stageStyles = {
  root: {
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    background: 'var(--bg)',
    transition: 'background 320ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  rootLight: {
    background: '#F4EFE6',
  },
  perspective: {
    position: 'absolute',
    inset: 0,
    perspective: '1400px',
    perspectiveOrigin: '50% 50%',
  },
  pageHolder: {
    position: 'absolute',
    inset: 0,
    transformStyle: 'preserve-3d',
    willChange: 'transform, opacity',
  },
  // The ball - amber sphere with soft glow. Always mounted; visibility via opacity.
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
  },
};

function Stage({ pages }) {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [phase, setPhase] = React.useState('idle'); // idle | chase | unfold | mobile-fade
  const [pendingPage, setPendingPage] = React.useState(null);
  const ballRef = React.useRef(null);
  const ballTrackRef = React.useRef({ x: 0, y: 0 });
  const currentPageRef = React.useRef('home');
  const rafRef = React.useRef(null);
  const implodeOriginRef = React.useRef({ x: 0, y: 0 });
  const [, forceCamera] = React.useReducer(x => x + 1, 0);
  const [isMobile, setIsMobile] = React.useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches
  );

  // RAF loop: while in chase, force re-render so pageTransform reads ballTrackRef
  React.useEffect(() => {
    if (phase !== 'chase') return;
    let id;
    const loop = () => {
      forceCamera();
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [phase]);

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Animate the ball with WAAPI for smoothness
  const animateBall = React.useCallback((from, to, opts = {}) => {
    return new Promise((resolve) => {
      const ball = ballRef.current;
      if (!ball) { resolve(); return; }
      const dur = opts.duration ?? 700;
      const easing = opts.easing ?? 'cubic-bezier(0.7, 0, 0.2, 1)';
      const anim = ball.animate([from, to], { duration: dur, easing, fill: 'forwards' });
      anim.onfinish = () => resolve();
    });
  }, []);

  const goTo = React.useCallback(async (next, originRect) => {
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

    setPendingPage(next);

    // PHASE 1: IMPLODE - current UI gets sucked into the click point
    implodeOriginRef.current = origin;
    setPhase('implode');
    await new Promise(r => setTimeout(r, isMobile ? 480 : 720));

    // PHASE 2: ball is born at origin, then chases to center
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

    // Ball pop-in
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

    // Ball flies in arc to center, page swaps mid-flight (still hidden)
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
        ballTrackRef.current = { x: clampX(px), y: clampY(py) };
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

    // PHASE 3: EXPLODE - dark bg returns first, then UI bursts outward
    ballTrackRef.current = { x: cx, y: cy };
    setPhase('explode-init');
    // Wait for dark bg to fade in before the page surface unfurls
    await new Promise(r => setTimeout(r, isMobile ? 220 : 280));
    setPhase('explode');

    // Ball rapidly expands and dies as the burst happens
    animateBall(
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(45)', opacity: 0 },
      { duration: 520, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' }
    );

    // Wait for the explode CSS transition on pageHolder to finish
    await new Promise(r => setTimeout(r, isMobile ? 580 : 820));

    setPhase('idle');
    setPendingPage(null);
    currentPageRef.current = next;
  }, [currentPage, phase, isMobile, animateBall]);

  // Keyboard nav
  React.useEffect(() => {
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

  const inLightVoid = phase === 'chase' || phase === 'implode';

  // Page transform — implode shrinks toward origin, explode bursts from center
  const pageTransform = (() => {
    if (phase === 'idle') return 'translate3d(0,0,0) scale(1)';
    if (phase === 'implode') {
      // Scale down toward origin (transform-origin set on element)
      return 'translate3d(0,0,0) scale(0.04)';
    }
    if (phase === 'explode-init') return 'translate3d(0,0,0) scale(0)';
    if (phase === 'explode') return 'translate3d(0,0,0) scale(1)';
    if (phase === 'chase') {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cx = vw / 2;
      const cy = vh / 2;
      const bx = ballTrackRef.current.x;
      const by = ballTrackRef.current.y;
      const followFactor = isMobile ? 0.35 : 0.6;
      const tx = (cx - bx) * followFactor;
      const ty = (cy - by) * followFactor;
      const tz = isMobile ? -100 : -180;
      return `translate3d(${tx}px, ${ty}px, ${tz}px) scale(1)`;
    }
    return 'translate3d(0,0,0) scale(1)';
  })();

  const pageOpacity = (() => {
    if (phase === 'chase') return 0;
    if (phase === 'implode') return 0.6;
    if (phase === 'explode-init') return 0;
    if (phase === 'explode') return 1;
    return 1;
  })();

  // Phase-aware transition for the pageHolder
  const pageTransition = (() => {
    const implodeMs = isMobile ? 480 : 700;
    const explodeMs = isMobile ? 520 : 720;
    if (phase === 'implode') return `transform ${implodeMs}ms cubic-bezier(0.7, 0, 0.84, 0), opacity ${implodeMs}ms ease-in`;
    if (phase === 'explode') return `transform ${explodeMs}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${Math.round(explodeMs * 0.7)}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    if (phase === 'explode-init') return 'none';
    if (phase === 'chase') return `transform ${isMobile ? 1000 : 1400}ms cubic-bezier(0.7, 0, 0.2, 1), opacity ${isMobile ? 500 : 700}ms ease`;
    return 'none';
  })();
  // For explode = center so the new page bursts out from where the ball is.
  const transformOrigin = (() => {
    if (phase === 'implode') {
      return `${implodeOriginRef.current.x}px ${implodeOriginRef.current.y}px`;
    }
    if (phase === 'explode' || phase === 'explode-init') {
      return '50% 50%';
    }
    return '50% 50%';
  })();

  return (
    <StageContext.Provider value={{ currentPage, goTo, phase, isMobile }}>
      <div
        style={{
          ...stageStyles.root,
          ...(inLightVoid ? stageStyles.rootLight : {}),
        }}
      >
        <div style={stageStyles.perspective}>
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
        </div>

        <div ref={ballRef} style={stageStyles.ball} aria-hidden="true" />

        <div style={stageStyles.cornerWord}>Renoxium</div>
        <Nav />
      </div>
    </StageContext.Provider>
  );
}

window.Stage = Stage;
window.useStage = useStage;
window.PAGES = PAGES;
window.PAGE_LABEL = PAGE_LABEL;
window.PAGE_DIR = PAGE_DIR;
