'use client';

import type { CSSProperties } from 'react';
import { useStage, PAGE_LABEL, type PageKey } from '@/components/stage/StageContext';
import { StageLink } from '@/components/stage/StageLink';
import { useMagnetic } from '@/hooks/useMagnetic';

const styles: Record<string, CSSProperties> = {
  bar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: '20px 0',
    pointerEvents: 'none',
    background: 'rgba(20, 21, 27, 0.45)',
    backdropFilter: 'blur(14px) saturate(140%)',
    WebkitBackdropFilter: 'blur(14px) saturate(140%)',
    borderBottom: '1px solid rgba(244, 239, 230, 0.05)',
    transition: 'opacity 360ms ease',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    pointerEvents: 'auto',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textDecoration: 'none',
    color: 'var(--ink)',
    cursor: 'none',
  },
  word: {
    fontFamily: 'var(--serif)',
    fontSize: 26,
    letterSpacing: '-0.03em',
    lineHeight: 1,
    display: 'block',
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    fontWeight: 380,
    transform: 'translateY(-1px)',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 28,
    fontSize: 13,
    color: 'var(--ink-3)',
    fontFamily: 'var(--sans)',
  },
  link: {
    color: 'var(--ink-2)',
    textDecoration: 'none',
    cursor: 'none',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'var(--mono)',
    fontSize: 11,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    transition: 'opacity 360ms ease, transform 480ms cubic-bezier(0.2, 0.8, 0.2, 1), color 200ms',
    display: 'inline-block',
  },
  cta: {
    fontFamily: 'var(--mono)',
    fontSize: 11,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '12px 18px',
    border: '1px solid var(--ink)',
    color: 'var(--ink)',
    background: 'transparent',
    borderRadius: 999,
    cursor: 'none',
    textDecoration: 'none',
    transition: 'all 200ms ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  },
};

export function RenoxiumMark({ size = 32 }: { size?: number }) {
  return (
    <img
      src="/renoxium.svg"
      alt="Renoxium"
      width={size}
      height={size}
      style={{ display: 'block', width: size, height: size, objectFit: 'contain' }}
      draggable={false}
    />
  );
}

const NAV_LINKS: PageKey[] = ['craft', 'process', 'edge', 'faq', 'contact'];

export function Nav() {
  const stage = useStage();
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.3);

  const isHidden = (page: PageKey) => stage.currentPage === page;
  const transitioning = stage.phase !== 'idle';
  const isHome = stage.currentPage === 'home';

  return (
    <nav style={{ ...styles.bar, opacity: transitioning ? 0 : 1 }}>
      <div className="wrap" style={styles.inner}>
        <StageLink
          to="home"
          ariaLabel={isHome ? 'You are on the home page' : 'Back to home'}
          style={{
            ...styles.brand,
            opacity: transitioning ? 0 : 1,
            pointerEvents: transitioning ? 'none' : 'auto',
          }}
          className={`brand-hover${isHome ? ' is-home' : ''}`}
          data-current={isHome ? 'home' : ''}
        >
          <span className="renox-mark-wrap">
            <RenoxiumMark />
          </span>
          <span style={styles.word} className="renox-word">
            Renoxium
          </span>
          <span className="brand-home-dot" aria-hidden="true" />
        </StageLink>

        <div style={styles.links} className="nav-links">
          {NAV_LINKS.map((page, i) => (
            <StageLink
              key={page}
              to={page}
              style={{
                ...styles.link,
                opacity: isHidden(page) || transitioning ? 0 : 1,
                transform: transitioning ? 'translateY(-6px)' : 'translateY(0)',
                pointerEvents: isHidden(page) || transitioning ? 'none' : 'auto',
                transitionDelay: transitioning ? '0ms' : `${i * 60}ms`,
              }}
              className="hover-reveal nav-link-btn"
              data-nav-page={page}
            >
              {PAGE_LABEL[page]}
            </StageLink>
          ))}
        </div>

        <StageLink
          to="contact"
          ref={ctaRef as React.Ref<HTMLAnchorElement | HTMLButtonElement>}
          style={{
            ...styles.cta,
            opacity: isHidden('contact') || transitioning ? 0 : 1,
            pointerEvents: isHidden('contact') || transitioning ? 'none' : 'auto',
          }}
          className="magnetic nav-cta"
        >
          <span className="nav-dot" />
          <span className="nav-cta-label">Start a project</span>
        </StageLink>
      </div>

      <style>{`
        nav .nav-links a:hover { color: var(--amber) !important; }
        .renox-mark-wrap img {
          transition: transform 460ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 320ms ease;
          transform-origin: center;
          filter: drop-shadow(0 0 12px rgba(79, 179, 255, 0.0));
        }
        .brand-hover:hover .renox-mark-wrap img {
          transform: scale(1.08) rotate(-4deg);
          filter: drop-shadow(0 0 14px rgba(79, 179, 255, 0.35));
        }
        .nav-cta { position: relative; }
        .nav-cta:hover { background: var(--amber); border-color: var(--amber); color: #14151B; }
        .nav-dot {
          width: 6px; height: 6px; border-radius: 999px; background: var(--amber);
          display: inline-block; transition: background 220ms;
          animation: pulse 2.4s ease-in-out infinite;
        }
        .nav-cta:hover .nav-dot { background: #14151B; }
        .brand-hover { background: none; border: none; padding: 0; position: relative; }
        .brand-home-dot {
          position: absolute;
          right: -10px; top: 4px;
          width: 4px; height: 4px;
          border-radius: 999px;
          background: var(--amber);
          opacity: 0;
          transition: opacity 240ms ease;
        }
        .brand-hover.is-home .brand-home-dot { opacity: 1; animation: pulse 2.4s ease-in-out infinite; }
        .brand-hover.is-home { cursor: default; }
        .brand-hover.is-home .renox-word { color: var(--ink-3); }
        @media (max-width: 720px) {
          .nav-links { gap: 12px !important; }
          .nav-cta { padding: 9px 10px !important; font-size: 10px !important; gap: 0 !important; }
          .nav-cta-label { display: none; }
          .nav-link-btn { font-size: 10px !important; letter-spacing: 0.04em !important; }
          .renox-word { font-size: 18px !important; }
          .renox-mark-wrap img { width: 26px !important; height: 26px !important; }
          .brand-hover { gap: 8px !important; }
        }
        @media (max-width: 420px) {
          .nav-links { gap: 8px !important; }
          .nav-link-btn { font-size: 9px !important; }
          .renox-word { font-size: 16px !important; }
          .renox-mark-wrap img { width: 24px !important; height: 24px !important; }
        }
      `}</style>
    </nav>
  );
}
