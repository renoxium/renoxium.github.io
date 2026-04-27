'use client';

import { useState, type CSSProperties } from 'react';
import type { CraftItem } from '@/db/schema';

const styles: Record<string, CSSProperties> = {
  section: {
    position: 'relative',
    padding: '160px 0 140px',
    borderTop: '1px solid var(--rule)',
    borderBottom: '1px solid var(--rule)',
    overflow: 'hidden',
    cursor: 'none',
  },
  head: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 48,
    alignItems: 'end',
    marginBottom: 64,
  },
  kicker: { color: 'var(--amber)', marginBottom: 18 },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(40px, 7vw, 100px)',
    lineHeight: 1.05,
    letterSpacing: '-0.04em',
    margin: 0,
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    fontWeight: 360,
  },
  blurb: { color: 'var(--ink-3)', fontSize: 17, lineHeight: 1.6, maxWidth: 460 },
  list: { borderTop: '1px solid var(--rule)' },
  row: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '80px 1fr auto',
    alignItems: 'center',
    gap: 32,
    padding: '32px 0',
    cursor: 'none',
    overflow: 'hidden',
  },
  rowFill: {
    position: 'absolute',
    inset: 0,
    background: 'var(--bg-3)',
    transformOrigin: 'left',
    transform: 'scaleX(0)',
    transition: 'transform 600ms cubic-bezier(0.7, 0, 0.2, 1)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  rowNum: {
    position: 'relative',
    zIndex: 1,
    fontFamily: 'var(--mono)',
    fontSize: 12,
    color: 'var(--ink-4)',
    letterSpacing: '0.06em',
  },
  rowTitle: {
    position: 'relative',
    zIndex: 1,
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(36px, 6vw, 84px)',
    lineHeight: 1.05,
    letterSpacing: '-0.035em',
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    fontWeight: 360,
    transition: 'transform 460ms cubic-bezier(0.2,0.8,0.2,1), font-style 0ms, color 320ms',
    transform: 'translateX(0)',
    color: 'var(--ink)',
  },
  rowMeta: {
    position: 'relative',
    zIndex: 1,
    fontFamily: 'var(--mono)',
    fontSize: 11,
    color: 'var(--ink-4)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    transition: 'color 320ms',
  },
  rowScene: {
    position: 'absolute',
    right: '14%',
    top: '50%',
    width: 200,
    height: 200,
    transformOrigin: 'center',
    pointerEvents: 'none',
    zIndex: 0,
  },
};

type SceneName = 'saas' | 'ai' | 'web' | 'mobile' | 'proto' | 'az';

function CraftScene({ name }: { name: string }) {
  const common = { width: '100%', height: '100%', viewBox: '0 0 220 220' } as const;
  const n = name as SceneName;
  if (n === 'saas') return (
    <svg {...common}>
      <rect x="20" y="40" width="180" height="140" rx="10" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
      <rect x="20" y="40" width="180" height="22" rx="10" fill="var(--ink-3)" opacity="0.15" />
      <circle cx="32" cy="51" r="3" fill="var(--amber)" />
      <circle cx="42" cy="51" r="3" fill="var(--ink-3)" opacity="0.4" />
      <circle cx="52" cy="51" r="3" fill="var(--ink-3)" opacity="0.4" />
      <rect x="32" y="76" width="60" height="6" rx="3" fill="var(--ink-3)" opacity="0.5">
        <animate attributeName="width" values="0;60" dur="1.6s" repeatCount="indefinite" />
      </rect>
      <rect x="32" y="92" width="100" height="6" rx="3" fill="var(--ink-3)" opacity="0.3">
        <animate attributeName="width" values="0;100" dur="1.6s" begin="0.2s" repeatCount="indefinite" />
      </rect>
      <rect x="32" y="120" width="40" height="40" rx="6" fill="var(--amber)" opacity="0.7" />
      <rect x="84" y="120" width="40" height="40" rx="6" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
      <rect x="136" y="120" width="40" height="40" rx="6" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
    </svg>
  );
  if (n === 'ai') return (
    <svg {...common}>
      <circle cx="110" cy="110" r="60" fill="none" stroke="var(--ink-3)" strokeWidth="1" opacity="0.3">
        <animate attributeName="r" values="50;70;50" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="110" cy="110" r="40" fill="none" stroke="var(--ink-3)" strokeWidth="1" opacity="0.5">
        <animate attributeName="r" values="30;50;30" dur="3s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="110" cy="110" r="14" fill="var(--amber)">
        <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
      </circle>
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const rad = (a * Math.PI) / 180;
        const x = 110 + Math.cos(rad) * 80;
        const y = 110 + Math.sin(rad) * 80;
        return (
          <g key={i}>
            <line x1="110" y1="110" x2={x} y2={y} stroke="var(--ink-3)" strokeWidth="1" opacity="0.3" />
            <circle cx={x} cy={y} r="3" fill="var(--ink-2)">
              <animate attributeName="r" values="2;5;2" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
    </svg>
  );
  if (n === 'web') return (
    <svg {...common}>
      <rect x="24" y="40" width="172" height="140" rx="8" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
      <line x1="24" y1="62" x2="196" y2="62" stroke="var(--ink-3)" strokeWidth="1" opacity="0.4" />
      <rect x="36" y="50" width="80" height="8" rx="4" fill="var(--ink-3)" opacity="0.3" />
      <rect x="36" y="76" width="74" height="74" rx="6" fill="var(--amber)" opacity="0.18" />
      <rect x="120" y="76" width="64" height="34" rx="6" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
      <rect x="120" y="116" width="64" height="34" rx="6" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
      <text x="36" y="116" fontFamily="JetBrains Mono" fontSize="10" fill="var(--amber)">
        <tspan>&lt;app/&gt;</tspan>
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </text>
    </svg>
  );
  if (n === 'mobile') return (
    <svg {...common}>
      <rect x="84" y="44" width="52" height="132" rx="11" fill="none" stroke="var(--ink-3)" strokeWidth="1.2" />
      <rect x="84" y="44" width="52" height="132" rx="11" fill="var(--bg-3)" />
      <rect x="101" y="49" width="18" height="2.5" rx="1.25" fill="var(--ink-3)" opacity="0.5" />
      <rect x="92" y="60" width="36" height="5" rx="2.5" fill="var(--ink-3)" opacity="0.4" />
      <rect x="92" y="71" width="36" height="44" rx="5" fill="var(--amber)" opacity="0.7" />
      <rect x="92" y="120" width="36" height="16" rx="3" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
      <rect x="92" y="141" width="36" height="16" rx="3" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
      <rect x="101" y="167" width="18" height="2.5" rx="1.25" fill="var(--ink-3)" opacity="0.5" />
      <circle cx="110" cy="93" r="3" fill="var(--bg-2)">
        <animate attributeName="cy" values="76;110;76" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
  if (n === 'proto') return (
    <svg {...common}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1={20 + i * 26} y1="40" x2={20 + i * 26} y2="180" stroke="var(--ink-3)" strokeWidth="0.5" opacity="0.3" />
      ))}
      <path d="M 30 160 Q 80 80 130 120 T 200 60" stroke="var(--amber)" strokeWidth="2" fill="none" strokeLinecap="round">
        <animate attributeName="stroke-dasharray" values="0 300;300 0" dur="2.4s" repeatCount="indefinite" />
      </path>
      <circle cx="30" cy="160" r="4" fill="var(--ink-3)" />
      <circle cx="200" cy="60" r="6" fill="var(--amber)">
        <animate attributeName="r" values="4;8;4" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <text x="20" y="200" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" letterSpacing="2">
        DAY 1 &gt;&gt; DAY 7
      </text>
    </svg>
  );
  if (n === 'az') return (
    <svg {...common}>
      <text x="40" y="120" fontFamily="Fraunces" fontStyle="italic" fontSize="120" fill="var(--amber)" opacity="0.6" fontWeight="350">A</text>
      <text x="135" y="180" fontFamily="Fraunces" fontStyle="italic" fontSize="120" fill="var(--ink)" fontWeight="350">Z</text>
      <line x1="60" y1="140" x2="160" y2="100" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 3">
        <animate attributeName="stroke-dashoffset" values="0;-12" dur="0.8s" repeatCount="indefinite" />
      </line>
      <circle cx="60" cy="140" r="4" fill="var(--amber)" />
      <circle cx="160" cy="100" r="4" fill="var(--ink)" />
    </svg>
  );
  return null;
}

export default function Craft({ services }: { services: CraftItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="craft" data-screen-label="Craft" style={styles.section}>
      <div className="wrap">
        <div className="craft-head reveal in" style={styles.head}>
          <div>
            <div className="mono" style={styles.kicker}>What we craft</div>
            <h1 style={styles.title}>
              Six disciplines,<br />one <span style={{ fontStyle: 'italic', color: 'var(--amber)' }}>studio</span>.
            </h1>
          </div>
          <p style={styles.blurb}>
            We do not specialize in a stack. We specialize in shipping. Hover any line for a preview, click the chevron for the full story.
          </p>
        </div>

        <div style={styles.list}>
          {services.map((s, i) => {
            const isExpanded = expanded === i;
            return (
              <div
                key={s.id}
                className={`craft-row${active === i ? ' is-active' : ''}${isExpanded ? ' is-expanded' : ''}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                <div
                  className="craft-row-head"
                  style={styles.row}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${s.title}`}
                  onClick={() => setExpanded(isExpanded ? null : i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setExpanded(isExpanded ? null : i);
                    }
                  }}
                >
                  <div className="craft-fill" style={styles.rowFill} />
                  <div
                    className="craft-scene"
                    style={{
                      ...styles.rowScene,
                      opacity: active === i && !isExpanded ? 0.85 : 0,
                      transform: active === i && !isExpanded ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0.85)',
                    }}
                    aria-hidden="true"
                  >
                    <CraftScene name={s.scene} />
                  </div>
                  <div style={styles.rowNum}>{s.number}</div>
                  <div
                    className="craft-title"
                    style={{
                      ...styles.rowTitle,
                      transform: active === i ? 'translateX(28px)' : 'translateX(0)',
                      fontStyle: active === i ? 'italic' : 'normal',
                      color: active === i ? 'var(--amber)' : 'var(--ink)',
                      fontVariationSettings: active === i
                        ? '"opsz" 144, "SOFT" 100, "wght" 360'
                        : '"opsz" 144, "SOFT" 30, "wght" 360',
                    }}
                  >
                    {s.title}
                  </div>
                  <div
                    className="craft-meta"
                    style={{
                      ...styles.rowMeta,
                      color: active === i ? 'var(--amber)' : 'var(--ink-4)',
                    }}
                  >
                    <span className="craft-meta-text">{s.meta}</span>
                    <button
                      type="button"
                      className="craft-chevron"
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? `Collapse ${s.title}` : `Expand ${s.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(isExpanded ? null : i);
                      }}
                    >
                      <svg viewBox="0 0 18 18" fill="none" width="18" height="18">
                        <path d="M4 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div
                  className="craft-body"
                  style={{
                    maxHeight: isExpanded ? 600 : 0,
                    opacity: isExpanded ? 1 : 0,
                  }}
                  aria-hidden={!isExpanded}
                >
                  <div className="craft-body-inner">
                    <p className="craft-body-text">{s.body}</p>
                    <ul className="craft-body-bullets">
                      {s.bullets.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .craft-row { border-bottom: 1px solid var(--rule); }
        .craft-row:hover .craft-fill { transform: scaleX(1); }
        .craft-row.is-expanded .craft-fill { transform: scaleX(1); }
        .craft-row.is-expanded .craft-row-head .craft-title {
          color: var(--amber) !important;
          font-style: italic !important;
        }
        .craft-scene { transition: opacity 420ms cubic-bezier(0.2,0.8,0.2,1), transform 460ms cubic-bezier(0.2,0.8,0.2,1); }

        .craft-chevron {
          appearance: none;
          background: transparent;
          border: 1px solid var(--rule-strong);
          color: var(--ink-3);
          width: 32px; height: 32px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center; justify-content: center;
          cursor: pointer;
          transition: border-color 220ms, color 220ms, background 220ms, transform 320ms cubic-bezier(0.2,0.8,0.2,1);
          margin-left: 14px;
          flex-shrink: 0;
          position: relative;
          z-index: 2;
        }
        .craft-chevron:hover { color: var(--amber); border-color: var(--amber); }
        .craft-chevron svg { transition: transform 320ms cubic-bezier(0.2,0.8,0.2,1); }
        .craft-row.is-expanded .craft-chevron {
          color: var(--amber);
          border-color: var(--amber);
          background: var(--amber-soft);
        }
        .craft-row.is-expanded .craft-chevron svg { transform: rotate(180deg); }

        .craft-row-head { user-select: none; }
        .craft-row-head:focus-visible {
          outline: 1px dashed var(--amber);
          outline-offset: 4px;
        }

        .craft-body {
          overflow: hidden;
          transition: max-height 540ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 320ms ease;
          position: relative;
          z-index: 1;
        }
        .craft-body-inner {
          padding: 8px 0 36px 112px;
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 48px;
          max-width: 100%;
          position: relative;
        }
        .craft-body-inner::before {
          content: '';
          position: absolute;
          left: 28px;
          top: 0;
          bottom: 18px;
          width: 1px;
          background: linear-gradient(to bottom, var(--amber) 0%, transparent 100%);
          transform-origin: top;
          transform: scaleY(0);
          opacity: 0;
        }
        .craft-row.is-expanded .craft-body-inner::before {
          animation: craftLine 540ms cubic-bezier(0.2, 0.8, 0.2, 1) 80ms forwards;
        }

        .craft-body-text {
          color: var(--ink-2);
          font-size: 17px;
          line-height: 1.65;
          margin: 0;
          max-width: 60ch;
          opacity: 0;
          transform: translateY(8px);
        }
        .craft-row.is-expanded .craft-body-text {
          animation: craftFadeUp 600ms cubic-bezier(0.2, 0.8, 0.2, 1) 140ms forwards;
        }

        .craft-body-bullets {
          list-style: none;
          margin: 0; padding: 0;
          display: flex; flex-direction: column;
          gap: 12px;
          font-family: var(--mono);
          font-size: 12px;
          letter-spacing: 0.04em;
          color: var(--ink-3);
        }
        .craft-body-bullets li {
          padding-left: 18px;
          position: relative;
          opacity: 0;
          transform: translateY(6px);
        }
        .craft-body-bullets li::before {
          content: '';
          position: absolute;
          left: 0; top: 8px;
          width: 8px; height: 1px;
          background: var(--amber);
          transform: scaleX(0);
          transform-origin: left;
        }
        .craft-row.is-expanded .craft-body-bullets li {
          animation: craftFadeUp 520ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .craft-row.is-expanded .craft-body-bullets li::before {
          animation: craftDash 380ms cubic-bezier(0.7, 0, 0.2, 1) forwards;
        }
        .craft-row.is-expanded .craft-body-bullets li:nth-child(1) { animation-delay: 220ms; }
        .craft-row.is-expanded .craft-body-bullets li:nth-child(2) { animation-delay: 290ms; }
        .craft-row.is-expanded .craft-body-bullets li:nth-child(3) { animation-delay: 360ms; }
        .craft-row.is-expanded .craft-body-bullets li:nth-child(4) { animation-delay: 430ms; }
        .craft-row.is-expanded .craft-body-bullets li:nth-child(1)::before { animation-delay: 280ms; }
        .craft-row.is-expanded .craft-body-bullets li:nth-child(2)::before { animation-delay: 350ms; }
        .craft-row.is-expanded .craft-body-bullets li:nth-child(3)::before { animation-delay: 420ms; }
        .craft-row.is-expanded .craft-body-bullets li:nth-child(4)::before { animation-delay: 490ms; }

        .craft-row.is-expanded .craft-row-head .craft-title {
          animation: craftTitlePulse 520ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes craftFadeUp {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes craftDash {
          0%   { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes craftLine {
          0%   { opacity: 0; transform: scaleY(0); }
          15%  { opacity: 1; }
          100% { opacity: 1; transform: scaleY(1); }
        }
        @keyframes craftTitlePulse {
          0%   { letter-spacing: -0.035em; }
          50%  { letter-spacing: -0.022em; }
          100% { letter-spacing: -0.035em; }
        }

        @media (hover: none) {
          .craft-row.is-active .craft-fill { transform: scaleX(1) !important; }
          .craft-row.is-active .craft-num,
          .craft-row.is-active .craft-title,
          .craft-row.is-active .craft-meta { color: var(--amber) !important; }
        }
        @media (max-width: 900px) {
          .craft-body-inner { grid-template-columns: 1fr !important; gap: 20px !important; padding-left: 50px !important; }
        }
        @media (max-width: 720px) {
          .craft-row-head { grid-template-columns: 40px 1fr auto !important; gap: 16px !important; }
          .craft-meta-text { display: none !important; }
          .craft-scene { display: none !important; }
          .craft-body-inner { padding-left: 40px !important; padding-bottom: 28px !important; }
          .craft-body-text { font-size: 15px !important; }
        }
      `}</style>
    </section>
  );
}
