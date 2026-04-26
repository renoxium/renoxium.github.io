import React, { useState } from 'react';

const processStyles = {
  section: { padding: '160px 0 120px', position: 'relative' },
  head: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
    alignItems: 'end', marginBottom: 80
  },
  kicker: { color: 'var(--amber)', marginBottom: 18 },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(40px, 7vw, 100px)',
    lineHeight: 0.92, letterSpacing: '-0.04em', margin: 0,
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    fontWeight: 360
  },
  blurb: { color: 'var(--ink-3)', fontSize: 17, lineHeight: 1.6, maxWidth: 460 },
  rail: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 0,
    borderTop: '1px solid var(--rule)',
    borderBottom: '1px solid var(--rule)'
  },
  step: {
    padding: '40px 30px 44px',
    borderRight: '1px solid var(--rule)',
    display: 'flex', flexDirection: 'column', gap: 20,
    position: 'relative',
    cursor: 'none',
    overflow: 'hidden'
  },
  stepNum: {
    fontFamily: 'var(--serif)',
    fontStyle: 'italic',
    fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 300',
    fontSize: 64, lineHeight: 1,
    color: 'var(--amber)',
    letterSpacing: '-0.03em',
    transition: 'transform 460ms cubic-bezier(0.7,0,0.2,1)'
  },
  stepKicker: {
    fontFamily: 'var(--mono)',
    fontSize: 11, color: 'var(--ink-4)',
    letterSpacing: '0.08em', textTransform: 'uppercase'
  },
  stepTitle: {
    fontFamily: 'var(--serif)',
    fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.025em',
    fontStyle: 'italic',
    fontVariationSettings: '"opsz" 144, "SOFT" 100',
    fontWeight: 380
  },
  stepBody: {
    color: 'var(--ink-3)', fontSize: 14, lineHeight: 1.6
  },
  duration: {
    marginTop: 'auto',
    paddingTop: 24,
    fontFamily: 'var(--mono)', fontSize: 11,
    color: 'var(--ink-3)',
    letterSpacing: '0.06em',
    display: 'flex', alignItems: 'center', gap: 8
  },
  durationDot: {
    width: 5, height: 5, borderRadius: 999, background: 'var(--amber)',
    display: 'inline-block'
  },
  hoverFill: {
    position: 'absolute', inset: 0,
    background: 'var(--amber-soft)',
    transformOrigin: 'bottom',
    transform: 'scaleY(0)',
    transition: 'transform 520ms cubic-bezier(0.7, 0, 0.2, 1)',
    pointerEvents: 'none',
    zIndex: 0
  }
};

const steps = [
  { n: '01', t: 'Discover',  body: 'A 30-minute scoping call. We map the problem, the users, the constraints. You leave with a one-page brief, yours to keep, no obligation.', dur: 'Day 0 · 1 hour' },
  { n: '02', t: 'Prototype', body: 'A clickable prototype in your hands inside a week. Real screens, real flows, no Lorem Ipsum. We iterate live until it feels right.',   dur: 'Week 1' },
  { n: '03', t: 'Build',     body: 'Two-week sprints. Senior engineers shipping daily to staging, with weekly reviews you actually attend. Modern tooling where it helps, never where it shouldn\'t.', dur: 'Weeks 2 to 12' },
  { n: '04', t: 'Scale',     body: 'We hand off, or stay on as your platform team. Either way: documentation, monitoring, and a runbook your future hires will thank you for.', dur: 'Month 4 →' },
];

export default function Process() {
  const [active, setActive] = useState(-1);
  return (
    <section id="process" data-screen-label="Process" style={processStyles.section}>
      <div className="wrap">
        <div className="proc-head reveal in" style={processStyles.head}>
          <div>
            <div className="mono" style={processStyles.kicker}>How it works</div>
            <h2 style={processStyles.title}>
              Four steps,<br />no <span style={{ fontStyle: 'italic', color: 'var(--amber)' }}>guesswork</span>.
            </h2>
          </div>
          <p style={processStyles.blurb}>Twenty years of software development has taught us one thing: clarity beats velocity. Every project follows the same rhythm, a tight loop you can predict, measure, and trust.</p>
        </div>

        <div className="proc-rail" style={processStyles.rail}>
          {steps.map((s, i) =>
            <div
              key={i}
              className={`proc-step${active === i ? ' is-active' : ''}`}
              onClick={() => setActive(active === i ? -1 : i)}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(-1)}
              style={{
                ...processStyles.step,
                borderRight: i === 3 ? 'none' : '1px solid var(--rule)'
              }}>
              <div className="proc-fill" style={processStyles.hoverFill}></div>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div className="proc-num" style={processStyles.stepNum}>{s.n}</div>
                  <div style={processStyles.stepKicker}>Step {s.n} / 04</div>
                </div>
                <div style={processStyles.stepTitle}>{s.t}</div>
                <div style={processStyles.stepBody}>{s.body}</div>
                <div style={processStyles.duration}>
                  <span style={processStyles.durationDot}></span>
                  {s.dur}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .proc-step:hover .proc-fill { transform: scaleY(1); }
        .proc-step:hover .proc-num { transform: translateY(-6px) rotate(-4deg); }
        @media (hover: none) {
          .proc-step.is-active .proc-fill { transform: scaleY(1) !important; }
          .proc-step.is-active .proc-num { transform: translateY(-6px) rotate(-4deg) !important; }
        }
        @media (max-width: 900px) {
          .proc-head { grid-template-columns: 1fr !important; gap: 24px !important; }
          .proc-rail { grid-template-columns: 1fr !important; }
          .proc-step { border-right: none !important; border-bottom: 1px solid var(--rule); }
          .proc-step:last-child { border-bottom: none; }
        }
      `}</style>
    </section>
  );
}
