import React, { useState } from 'react';

const faqStyles = {
  section: { padding: '120px 0', borderTop: '1px solid var(--rule)' },
  layout: {
    display: 'grid',
    gridTemplateColumns: '380px 1fr',
    gap: 80,
    alignItems: 'start'
  },
  side: {
    position: 'sticky', top: 120
  },
  kicker: { color: 'var(--amber)', marginBottom: 18 },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(40px, 6vw, 80px)',
    lineHeight: 0.92, letterSpacing: '-0.04em', margin: '0 0 24px',
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    fontWeight: 360
  },
  side_p: { color: 'var(--ink-3)', fontSize: 15, lineHeight: 1.6 },
  list: { borderTop: '1px solid var(--rule)' },
  item: {
    borderBottom: '1px solid var(--rule)'
  },
  q: {
    width: '100%', textAlign: 'left',
    background: 'transparent', border: 'none',
    padding: '28px 0',
    cursor: 'pointer',
    display: 'flex', alignItems: 'flex-start', gap: 24,
    color: 'var(--ink)',
    transition: 'color 200ms'
  },
  num: {
    fontFamily: 'var(--mono)', fontStyle: 'normal',
    fontSize: 14, color: 'var(--amber)', lineHeight: 1.1,
    flexShrink: 0, width: 48,
    letterSpacing: '0.04em'
  },
  qText: {
    fontFamily: 'var(--serif)', fontSize: 28, lineHeight: 1.2,
    letterSpacing: '-0.025em', flex: 1,
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    fontWeight: 360
  },
  caret: {
    flexShrink: 0, marginTop: 8,
    color: 'var(--ink-3)',
    transition: 'transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1)'
  },
  ans: {
    overflow: 'hidden',
    transition: 'max-height 320ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 280ms'
  },
  ansBody: {
    padding: '0 0 28px 64px',
    color: 'var(--ink-3)', fontSize: 16, lineHeight: 1.65,
    maxWidth: 720
  }
};

const faqs = [
  { q: 'Why a dubai studio? Where are your clients based?',  a: 'We\'re based in Dubai and we work with clients all over the world. The timezone gives us comfortable overlap with most regions, and we run async-first regardless.' },
  { q: 'How fast can you actually start?',                    a: 'For most projects: within a week. We keep one squad on rotation specifically for new engagements. Book a scoping call and you\'ll have a brief, a quote, and a start date in 48 hours.' },
  { q: 'How do you actually use AI in the work?',             a: 'Pragmatically. AI agents handle the unglamorous parts: boilerplate, test scaffolding, migrations, doc generation. Senior engineers own architecture, judgment calls, and review. The output is the same shape as a traditional studio\'s work; the throughput is roughly 2–3×.' },
  { q: 'Who owns the code and IP?',                           a: 'You do. Full source, full IP, full repository access from day one. We keep nothing proprietary. Hand-off includes documentation, deploy runbooks, and a 30-day support window for free.' },
  { q: 'What stacks do you work in?',                         a: 'Web: TypeScript, React, Next.js, Node, Python, Go. Mobile: Swift, Kotlin, React Native. AI: anything that ships, from OpenAI and Anthropic to open-weights and custom fine-tunes. We\'ll match your team\'s stack if you have one.' },
  { q: 'Can you take over a stalled project?',                a: 'Often, yes. We start with a one-week audit (fixed price), give you a candid assessment, and only continue if we believe we can help. About a third of our work is rescue engagements.' },
  { q: 'Do you sign NDAs and DPAs?',                          a: 'Always. We also work under custom MSAs, GDPR DPAs, and SOC 2 / ISO-aligned controls when required. Compliance docs available on request.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" data-screen-label="FAQ" style={faqStyles.section}>
      <div className="wrap">
        <div className="faq-layout" style={faqStyles.layout}>
          <div style={faqStyles.side}>
            <div className="mono" style={faqStyles.kicker}>FAQ</div>
            <h2 style={faqStyles.title}>
              Questions,<br />answered <span style={{ fontStyle: 'italic', color: 'var(--amber)' }}>plainly</span>.
            </h2>
            <p style={faqStyles.side_p}>
              Can't find your answer here? Email{' '}
              <a href="mailto:hello@renoxium.com" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Raviouliti@renoxium.com</a>{' '}
              and we reply within 2 business days (tops).
            </p>
          </div>

          <div style={faqStyles.list}>
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} style={faqStyles.item}>
                  <button
                    style={{ ...faqStyles.q, cursor: 'none' }}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className={`faq-q${isOpen ? ' is-open' : ''}`}>
                    <span style={faqStyles.num} className="faq-num">{String(i + 1).padStart(2, '0')}</span>
                    <span style={faqStyles.qText}>{f.q}</span>
                    <svg
                      width="20" height="20" viewBox="0 0 20 20" fill="none"
                      style={{ ...faqStyles.caret, transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>
                      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div style={{
                    ...faqStyles.ans,
                    maxHeight: isOpen ? 360 : 0,
                    opacity: isOpen ? 1 : 0
                  }}>
                    <div style={faqStyles.ansBody}>{f.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .faq-q:hover { color: var(--amber) !important; }
        .faq-q:hover .faq-num { transform: translateX(4px); }
        .faq-num { transition: transform 320ms cubic-bezier(0.2,0.8,0.2,1); display: inline-block; }
        @media (hover: none) {
          .faq-q.is-open .faq-num { transform: translateX(4px) !important; color: var(--amber) !important; }
        }
        @media (max-width: 900px) {
          .faq-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
          .faq-layout > div:first-child { position: static !important; }
        }
      `}</style>
    </section>
  );
}
