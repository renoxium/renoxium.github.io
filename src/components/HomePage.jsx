import React, { useEffect, useState } from 'react';
import { SplitText } from './SplitText.jsx';

const homeStyles = {
  page: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden'
  },
  inner: {
    width: '100%',
    maxWidth: 1280,
    padding: '0 32px',
    paddingTop: 100
  },
  meta: {
    display: 'flex', alignItems: 'center', gap: 14,
    color: 'var(--ink-3)',
    marginBottom: 28,
    flexWrap: 'wrap'
  },
  metaDot: { width: 6, height: 6, borderRadius: 999, background: 'var(--amber)', animation: 'pulse 2.4s ease-in-out infinite' },
  headline: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(48px, 9vw, 132px)',
    lineHeight: 0.98,
    letterSpacing: '-0.045em',
    margin: 0,
    fontWeight: 350,
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    color: 'var(--ink)',
    maxWidth: '15ch'
  },
  italic: {
    fontStyle: 'italic',
    fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 320',
    color: 'var(--amber)',
    cursor: 'none'
  },
  sub: {
    maxWidth: 520,
    fontSize: 17,
    lineHeight: 1.55,
    color: 'var(--ink-2)',
    marginTop: 28,
    fontFamily: 'var(--sans)'
  },
  hint: {
    marginTop: 36,
    color: 'var(--ink-4)',
    fontFamily: 'var(--mono)',
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    display: 'flex', alignItems: 'center', gap: 14
  },
  bigR: {
    position: 'absolute',
    right: '-6vw', bottom: '-12vw',
    pointerEvents: 'none',
    fontFamily: 'var(--serif)', fontStyle: 'italic',
    fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 300',
    fontSize: '46vw', lineHeight: 0.8, color: 'var(--amber)',
    opacity: 0.10, zIndex: 0, userSelect: 'none'
  }
};

function fmtDubai() {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: false
    }).format(new Date());
  } catch (e) { return '00:00'; }
}

export default function HomePage() {
  const [time, setTime] = useState(() => fmtDubai());
  useEffect(() => {
    const t = setInterval(() => setTime(fmtDubai()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section data-screen-label="Home" style={homeStyles.page}>
      <div style={homeStyles.inner}>
        <div className="reveal in mono" style={homeStyles.meta}>
          <span style={homeStyles.metaDot}></span>
          <span>Dubai · {time} GST</span>
          <span style={{ color: 'var(--ink-4)' }}>·</span>
          <span>EST. NOW</span>
        </div>

        <h1 style={homeStyles.headline} className="hero-h1">
          <span className="split-hoverable" style={{ display: 'inline-block' }}>
            <SplitText text={'A studio that '} stagger={28} delay={0} />
          </span>
          <span style={homeStyles.italic} className="split-hoverable italic-word">
            <SplitText text="ships" stagger={28} delay={250} />
          </span>
          <span className="split-hoverable" style={{ display: 'inline-block' }}>
            <SplitText text={'.'} stagger={28} delay={450} />
          </span>
        </h1>

        <p className="reveal in" style={homeStyles.sub}>
          A senior engineering studio headquartered in Dubai.
          A seasoned team turning briefs into prototypes in a week and v1 in a quarter.
        </p>

        <div className="reveal in" style={homeStyles.hint}>
          <span style={{ color: 'var(--amber)' }}>↗</span>
          <span>Use the nav above. Or <kbd style={{ fontFamily: 'inherit', padding: '2px 6px', border: '1px solid var(--rule-strong)', borderRadius: 3 }}>← →</kbd></span>
        </div>
      </div>

      <div aria-hidden="true" style={homeStyles.bigR}>R</div>
    </section>
  );
}
