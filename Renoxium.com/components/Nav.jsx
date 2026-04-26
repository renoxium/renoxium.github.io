// Nav - page-aware. Clicking a label fires Stage.goTo(page).
// Active page label is HIDDEN from the row (it's "the current room" - already there).
// Each label is wrapped so we can later use its bbox as the ball origin point.
const navStyles = {
  bar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    padding: '20px 0',
    pointerEvents: 'none',
  },
  inner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    pointerEvents: 'auto',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 12,
    textDecoration: 'none', color: 'var(--ink)',
    cursor: 'none',
  },
  word: {
    fontFamily: 'var(--serif)', fontSize: 26,
    letterSpacing: '-0.03em',
    lineHeight: 1, paddingTop: 2,
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    fontWeight: 380,
  },
  links: {
    display: 'flex', alignItems: 'center', gap: 28,
    fontSize: 13, color: 'var(--ink-3)',
    fontFamily: 'var(--sans)',
  },
  link: {
    color: 'var(--ink-2)', textDecoration: 'none',
    cursor: 'none', background: 'none', border: 'none', padding: 0,
    fontFamily: 'var(--mono)', fontSize: 11,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    transition: 'opacity 360ms ease, transform 480ms cubic-bezier(0.2, 0.8, 0.2, 1), color 200ms',
    display: 'inline-block',
  },
  cta: {
    fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '12px 18px',
    border: '1px solid var(--ink)', color: 'var(--ink)',
    background: 'transparent', borderRadius: 999,
    cursor: 'none', textDecoration: 'none',
    transition: 'all 200ms ease',
    display: 'inline-flex', alignItems: 'center', gap: 8,
  },
};

function RenoxiumMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="56 20" strokeLinecap="round" transform="rotate(-30 16 16)" className="renox-ring" />
      <circle cx="24.5" cy="12" r="2.6" fill="var(--amber)" className="renox-dot" />
    </svg>
  );
}

function Nav() {
  const stage = useStage();
  const ctaRef = useMagnetic(0.3);

  const NAV_LINKS = ['craft', 'process', 'faq', 'contact'];

  const handleNav = (page) => (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    stage.goTo(page, rect);
  };

  const isHidden = (page) => stage.currentPage === page;
  const transitioning = stage.phase !== 'idle';

  return (
    <nav style={navStyles.bar}>
      <div className="wrap" style={navStyles.inner}>
        <button
          onClick={handleNav('home')}
          style={{ ...navStyles.brand, opacity: isHidden('home') ? 0 : 1, pointerEvents: isHidden('home') ? 'none' : 'auto' }}
          className="brand-hover"
        >
          <span className="renox-mark-wrap"><RenoxiumMark /></span>
          <span style={navStyles.word} className="renox-word">Renoxium</span>
        </button>
        <div style={navStyles.links} className="nav-links">
          {NAV_LINKS.map((page) => (
            <button
              key={page}
              style={{
                ...navStyles.link,
                opacity: isHidden(page) || transitioning ? 0 : 1,
                transform: transitioning ? 'translateY(-6px)' : 'translateY(0)',
                pointerEvents: isHidden(page) || transitioning ? 'none' : 'auto',
                transitionDelay: transitioning ? '0ms' : `${NAV_LINKS.indexOf(page) * 60}ms`,
              }}
              className="hover-reveal nav-link-btn"
              onClick={handleNav(page)}
              data-nav-page={page}
            >
              {PAGE_LABEL[page]}
            </button>
          ))}
        </div>
        <button
          ref={ctaRef}
          style={{
            ...navStyles.cta,
            opacity: isHidden('contact') || transitioning ? 0 : 1,
            pointerEvents: isHidden('contact') || transitioning ? 'none' : 'auto',
          }}
          onClick={handleNav('contact')}
          className="magnetic nav-cta"
        >
          <span className="nav-dot"></span>
          <span className="nav-cta-label">Start a project</span>
        </button>
      </div>
      <style>{`
        nav .nav-links button:hover { color: var(--amber) !important; }
        .brand-hover .renox-ring { transition: transform 600ms cubic-bezier(0.2,0.8,0.2,1); transform-origin: 16px 16px; }
        .brand-hover:hover .renox-ring { transform: rotate(180deg); }
        .brand-hover .renox-dot { transition: fill 220ms; }
        .nav-cta { position: relative; }
        .nav-cta:hover { background: var(--amber); border-color: var(--amber); color: #0E0F0D; }
        .nav-dot {
          width: 6px; height: 6px; border-radius: 999px; background: var(--amber);
          display: inline-block; transition: background 220ms;
          animation: pulse 2.4s ease-in-out infinite;
        }
        .nav-cta:hover .nav-dot { background: #0E0F0D; }
        .brand-hover { background: none; border: none; padding: 0; }
        @media (max-width: 720px) {
          .nav-links { gap: 12px !important; }
          .nav-cta { padding: 9px 10px !important; font-size: 10px !important; gap: 0 !important; }
          .nav-cta-label { display: none; }
          .nav-link-btn { font-size: 10px !important; letter-spacing: 0.04em !important; }
          .renox-word { font-size: 18px !important; }
          .renox-mark-wrap svg { width: 22px !important; height: 22px !important; }
          .brand-hover { gap: 8px !important; }
        }
        @media (max-width: 420px) {
          .nav-links { gap: 8px !important; }
          .nav-link-btn { font-size: 9px !important; }
          .renox-word { font-size: 16px !important; }
          .renox-mark-wrap svg { width: 20px !important; height: 20px !important; }
        }
      `}</style>
    </nav>
  );
}

window.Nav = Nav;
window.RenoxiumMark = RenoxiumMark;
