import React, { useState } from 'react';

const edgeStyles = {
  section: {
    padding: '160px 0 140px',
    position: 'relative',
    borderTop: '1px solid var(--rule)',
    borderBottom: '1px solid var(--rule)',
    overflow: 'hidden',
  },
  head: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
    alignItems: 'end', marginBottom: 80,
  },
  kicker: { color: 'var(--amber)', marginBottom: 18 },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(40px, 7vw, 100px)',
    lineHeight: 0.95, letterSpacing: '-0.04em', margin: 0,
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    fontWeight: 360,
  },
  blurb: { color: 'var(--ink-3)', fontSize: 17, lineHeight: 1.6, maxWidth: 460 },

  pillars: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 0,
    borderTop: '1px solid var(--rule)',
    borderLeft: '1px solid var(--rule)',
    marginBottom: 96,
  },
  pillar: {
    padding: '40px 36px 44px',
    borderRight: '1px solid var(--rule)',
    borderBottom: '1px solid var(--rule)',
    display: 'flex', flexDirection: 'column', gap: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  pillarNum: {
    fontFamily: 'var(--mono)', fontSize: 11,
    color: 'var(--ink-4)',
    letterSpacing: '0.1em',
  },
  pillarTitle: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(28px, 3.4vw, 44px)',
    lineHeight: 1.05,
    letterSpacing: '-0.025em',
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    fontWeight: 360,
    margin: 0,
  },
  pillarTitleAccent: {
    fontStyle: 'italic',
    fontVariationSettings: '"opsz" 144, "SOFT" 100',
    color: 'var(--amber)',
  },
  pillarBody: {
    color: 'var(--ink-3)',
    fontSize: 15,
    lineHeight: 1.65,
  },
  pillarTag: {
    marginTop: 'auto',
    paddingTop: 16,
    fontFamily: 'var(--mono)', fontSize: 11,
    color: 'var(--amber)',
    letterSpacing: '0.06em', textTransform: 'uppercase',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  pillarDot: {
    width: 5, height: 5, borderRadius: 999,
    background: 'var(--amber)',
    display: 'inline-block',
  },

  compareWrap: {
    marginTop: 24,
  },
  compareKicker: {
    fontFamily: 'var(--mono)', fontSize: 11,
    color: 'var(--amber)',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    marginBottom: 28,
  },
  compareTitle: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(32px, 4.5vw, 64px)',
    lineHeight: 1.05,
    letterSpacing: '-0.035em',
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    fontWeight: 360,
    margin: '0 0 56px',
  },
  compareTable: {
    width: '100%',
    borderTop: '1px solid var(--rule)',
  },
  compareRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr 1.2fr',
    alignItems: 'center',
    padding: '24px 0',
    borderBottom: '1px solid var(--rule)',
    gap: 32,
  },
  compareHeadRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr 1.2fr',
    alignItems: 'center',
    padding: '20px 0',
    borderBottom: '1px solid var(--rule-strong)',
    gap: 32,
  },
  compareDim: {
    fontFamily: 'var(--mono)', fontSize: 12,
    color: 'var(--ink-4)',
    letterSpacing: '0.06em', textTransform: 'uppercase',
  },
  compareUs: {
    color: 'var(--ink)',
    fontSize: 16,
    fontFamily: 'var(--sans)',
    lineHeight: 1.4,
    display: 'flex', alignItems: 'flex-start', gap: 10,
  },
  compareThem: {
    color: 'var(--ink-3)',
    fontSize: 15,
    fontFamily: 'var(--sans)',
    lineHeight: 1.4,
  },
  compareCheck: {
    flexShrink: 0,
    marginTop: 4,
    color: 'var(--amber)',
  },
  compareHead: {
    fontFamily: 'var(--mono)', fontSize: 11,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--ink-4)',
  },
  compareHeadUs: {
    color: 'var(--amber)',
    fontFamily: 'var(--mono)', fontSize: 11,
    letterSpacing: '0.08em', textTransform: 'uppercase',
  },

  closing: {
    marginTop: 96,
    padding: '48px 0 0',
    borderTop: '1px solid var(--rule)',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 48,
    alignItems: 'start',
  },
  closingQuote: {
    fontFamily: 'var(--serif)',
    fontStyle: 'italic',
    fontSize: 'clamp(28px, 3vw, 40px)',
    lineHeight: 1.25,
    letterSpacing: '-0.02em',
    fontVariationSettings: '"opsz" 144, "SOFT" 100',
    color: 'var(--ink-2)',
    fontWeight: 360,
    margin: 0,
  },
  closingMeta: {
    color: 'var(--ink-3)',
    fontSize: 15,
    lineHeight: 1.65,
  },

  bigE: {
    position: 'absolute',
    left: '-8vw',
    top: '-22vw',
    pointerEvents: 'none',
    fontFamily: 'var(--serif)',
    fontStyle: 'italic',
    fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 280',
    fontSize: '70vw',
    lineHeight: 0.78,
    color: 'var(--amber)',
    opacity: 0.06,
    zIndex: 0,
    userSelect: 'none',
  },
};

const pillars = [
  {
    n: '01',
    titleStart: 'A senior team,',
    titleAccent: 'deeply seasoned',
    body: 'Every line is reviewed by an engineer with a decade or more on production systems. We have seen the patterns, the pitfalls, the tradeoffs. That judgment is the foundation of everything we ship.',
    tag: 'Senior throughout.',
  },
  {
    n: '02',
    titleStart: 'Shipping is',
    titleAccent: 'the practice',
    body: 'We commit to a date and stand by it. Daily deploys to staging, weekly demos to you. If a feature has to slip, we cut scope before we cut quality, and we tell you 48 hours ahead, not the day of.',
    tag: 'Predictable timelines.',
  },
  {
    n: '03',
    titleStart: 'You own',
    titleAccent: 'every byte',
    body: "Code, IP, repository, deploy keys, infrastructure: yours from commit one. We don't sell hosting, we don't lock you to a CMS, we don't own a shred of your stack. Hand off is documented, runbooked, and non negotiable.",
    tag: 'Zero lock in.',
  },
  {
    n: '04',
    titleStart: 'Crafted to',
    titleAccent: 'your shape',
    body: "We don't run a factory. Each engagement is scoped, designed, and built around the specific business in front of us: your users, your constraints, your team's strengths. The work bends to your reality, not to a template we reuse on the next client.",
    tag: 'Bespoke by default.',
  },
];

const compareRows = [
  { dim: 'Engineering team',  us: 'Only senior engineers (10+ yrs)',          them: 'Senior lead, mid + junior delivery' },
  { dim: 'Time to prototype', us: '7 days, working software',                 them: '4 to 8 weeks of discovery' },
  { dim: 'Code & IP',         us: 'Yours from day 1, full repo access',       them: 'Handed over at end, sometimes' },
  { dim: 'Review culture',    us: 'Senior review on every commit',           them: 'Lead review at milestones, if at all' },
  { dim: 'Hand-off',          us: 'Runbooks, monitoring, 30-day support',     them: 'Slack channel that goes quiet' },
  { dim: 'Engagement model',  us: 'Bespoke scope, shaped to your business',   them: 'Fixed playbook, applied to every client' },
];

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Edge() {
  return (
    <section id="edge" data-screen-label="Edge" style={edgeStyles.section}>
      <div aria-hidden="true" style={edgeStyles.bigE}>E</div>

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <div className="edge-head reveal in" style={edgeStyles.head}>
          <div>
            <div className="mono" style={edgeStyles.kicker}>What sets us apart</div>
            <h2 style={edgeStyles.title}>
              Our <span style={{ fontStyle: 'italic', color: 'var(--amber)' }}>edge</span>,<br />
              spelled out.
            </h2>
          </div>
          <p style={edgeStyles.blurb}>
            A boutique technology studio. A seasoned senior engineering team that crafts each engagement to fit, delivering work shaped by the kind of judgment only years of production experience can produce.
          </p>
        </div>

        <div className="edge-pillars" style={edgeStyles.pillars}>
          {pillars.map((p) => (
            <div key={p.n} className="edge-pillar" style={edgeStyles.pillar}>
              <div style={edgeStyles.pillarNum}>{p.n}</div>
              <h3 style={edgeStyles.pillarTitle}>
                {p.titleStart}{' '}
                <span style={edgeStyles.pillarTitleAccent}>{p.titleAccent}</span>
              </h3>
              <p style={edgeStyles.pillarBody}>{p.body}</p>
              <div style={edgeStyles.pillarTag}>
                <span style={edgeStyles.pillarDot}></span>
                {p.tag}
              </div>
            </div>
          ))}
        </div>

        <div style={edgeStyles.compareWrap} className="edge-compare reveal in">
          <div style={edgeStyles.compareKicker}>Us vs. the usual</div>
          <h3 style={edgeStyles.compareTitle}>
            Read the <span style={{ fontStyle: 'italic', color: 'var(--amber)' }}>delta</span>.
          </h3>

          <div style={edgeStyles.compareTable} className="compare-table">
            <div style={edgeStyles.compareHeadRow} className="compare-row">
              <div style={edgeStyles.compareHead}>Dimension</div>
              <div style={edgeStyles.compareHeadUs}>Renoxium</div>
              <div style={edgeStyles.compareHead}>Typical agency</div>
            </div>
            {compareRows.map((row) => (
              <div key={row.dim} style={edgeStyles.compareRow} className="compare-row">
                <div style={edgeStyles.compareDim}>{row.dim}</div>
                <div style={edgeStyles.compareUs}>
                  <span style={edgeStyles.compareCheck}><CheckIcon /></span>
                  <span>{row.us}</span>
                </div>
                <div style={edgeStyles.compareThem}>{row.them}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={edgeStyles.closing} className="edge-closing reveal in">
          <p style={edgeStyles.closingQuote}>
            "Deliberately small. Deliberately senior. Carefully crafted. That is what makes the work hold."
          </p>
          <div style={edgeStyles.closingMeta}>
            That is the edge. A boutique team of seasoned engineers shipping software the way it ought to be shipped: with deliberate craft, a clear timeline, and a runbook your team can actually run. If that lines up with what you need, we should talk.
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .edge-head { grid-template-columns: 1fr !important; gap: 24px !important; }
          .edge-pillars { grid-template-columns: 1fr !important; }
          .edge-closing { grid-template-columns: 1fr !important; gap: 24px !important; }
          .compare-row { grid-template-columns: 1fr !important; gap: 6px !important; padding: 18px 0 !important; }
          .compare-row > div:nth-child(1) { font-size: 10px !important; }
        }
      `}</style>
    </section>
  );
}
