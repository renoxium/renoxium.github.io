import React, { useEffect, useState } from 'react';

function ContactArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const contactStyles = {
  section: { padding: '120px 0', borderTop: '1px solid var(--rule)', position: 'relative', overflow: 'hidden' },
  head: { textAlign: 'center', maxWidth: 760, margin: '0 auto 72px' },
  kicker: { color: 'var(--amber)', marginBottom: 18 },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(48px, 9vw, 140px)',
    lineHeight: 0.88, letterSpacing: '-0.045em', margin: 0,
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    fontWeight: 350
  },
  blurb: { color: 'var(--ink-3)', fontSize: 17, lineHeight: 1.6, marginTop: 24, maxWidth: 540, marginInline: 'auto' },
  card: {
    border: '1px solid var(--rule)',
    borderRadius: 20,
    background: 'var(--bg-2)',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr'
  },
  form: { padding: 48, display: 'flex', flexDirection: 'column', gap: 24 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: {
    fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
    color: 'var(--ink-3)'
  },
  input: {
    background: 'transparent',
    border: 'none', borderBottom: '1px solid var(--rule-strong)',
    color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 18,
    padding: '10px 0', outline: 'none',
    transition: 'border-color 200ms'
  },
  textarea: {
    background: 'transparent',
    border: 'none', borderBottom: '1px solid var(--rule-strong)',
    color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 18,
    padding: '10px 0', outline: 'none',
    minHeight: 60, resize: 'vertical',
    transition: 'border-color 200ms'
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  chip: (active) => ({
    padding: '8px 14px', borderRadius: 999,
    border: `1px solid ${active ? 'var(--amber)' : 'var(--rule-strong)'}`,
    background: active ? 'var(--amber-soft)' : 'transparent',
    color: active ? 'var(--amber)' : 'var(--ink-2)',
    fontSize: 13, cursor: 'pointer',
    transition: 'all 200ms'
  }),
  submit: {
    background: 'var(--amber)', color: '#0E0F0D',
    border: 'none', borderRadius: 999,
    padding: '16px 26px',
    fontSize: 14, fontWeight: 500,
    cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 10,
    alignSelf: 'flex-start',
    transition: 'all 200ms'
  },
  side: {
    padding: 48,
    background: 'var(--bg-3)',
    display: 'flex', flexDirection: 'column', gap: 32,
    borderLeft: '1px solid var(--rule)'
  },
  block: { display: 'flex', flexDirection: 'column', gap: 8 },
  blockLabel: {
    fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
    color: 'var(--ink-4)'
  },
  blockValue: { fontSize: 16, color: 'var(--ink)', lineHeight: 1.5 },
  blockValueBig: { fontFamily: 'var(--serif)', fontSize: 32, fontStyle: 'italic', color: 'var(--amber)', letterSpacing: '-0.025em', fontVariationSettings: '"opsz" 144, "SOFT" 100', fontWeight: 360 },
  link: { color: 'var(--amber)', textDecoration: 'none' }
};

function fmtDubaiFull() {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(new Date()) + ' GST';
  } catch (e) { return '—'; }
}

export default function Contact() {
  const [services, setServices] = useState(new Set(['SaaS']));
  const [budget, setBudget] = useState('$50k–$150k');
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(() => fmtDubaiFull());

  useEffect(() => {
    const t = setInterval(() => setTime(fmtDubaiFull()), 1000);
    return () => clearInterval(t);
  }, []);

  const toggleService = (s) => {
    setServices((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4500);
  };

  return (
    <section id="contact" data-screen-label="Contact" style={contactStyles.section}>
      <div className="wrap">
        <div style={contactStyles.head}>
          <div className="mono" style={contactStyles.kicker}>Contact</div>
          <h2 style={contactStyles.title}>
            Let's build<br /><span style={{ fontStyle: 'italic', color: 'var(--amber)' }}>something good.</span>
          </h2>
          <p style={contactStyles.blurb}>Tell us a little about the project. We reply within 2 business days (tops) during Dubai business days. Usually with a calendar link and a question or two.</p>
        </div>

        <div className="contact-card" style={contactStyles.card}>
          <form style={contactStyles.form} onSubmit={onSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="form-row">
              <div style={contactStyles.field}>
                <label style={contactStyles.label}>Your name</label>
                <input style={contactStyles.input} placeholder="Layla Hassan" required />
              </div>
              <div style={contactStyles.field}>
                <label style={contactStyles.label}>Work email</label>
                <input type="email" style={contactStyles.input} placeholder="layla@company.com" required />
              </div>
            </div>
            <div style={contactStyles.field}>
              <label style={contactStyles.label}>What do you need?</label>
              <div style={contactStyles.chips}>
                {['SaaS', 'Web app', 'Mobile app', 'AI product', 'Prototype', 'Audit / takeover'].map((s) =>
                  <button key={s} type="button" style={contactStyles.chip(services.has(s))} onClick={() => toggleService(s)}>
                    {s}
                  </button>
                )}
              </div>
            </div>
            <div style={contactStyles.field}>
              <label style={contactStyles.label}>Budget range</label>
              <div style={contactStyles.chips}>
                {['<$25k', '$25k–$50k', '$50k–$150k', '$150k–$500k', '$500k+'].map((b) =>
                  <button key={b} type="button" style={contactStyles.chip(budget === b)} onClick={() => setBudget(b)}>
                    {b}
                  </button>
                )}
              </div>
            </div>
            <div style={contactStyles.field}>
              <label style={contactStyles.label}>Tell us about it</label>
              <textarea style={contactStyles.textarea} placeholder="A few sentences is plenty. We'll ask the rest on the call." rows={3} />
            </div>
            <button type="submit" style={contactStyles.submit}>
              {submitted ? 'Sent · talk soon ✓' : 'Send brief'}
              {!submitted && <ContactArrow />}
            </button>
          </form>

          <aside style={contactStyles.side}>
            <div style={{ ...contactStyles.block, gap: 14 }}>
              <div style={contactStyles.blockLabel}>Studio</div>
              <div style={{ ...contactStyles.blockValueBig, marginBottom: 4, lineHeight: 1.1 }}>UAE, Dubai</div>
            </div>
            <div style={contactStyles.block}>
              <div style={contactStyles.blockLabel}>Local time</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 22, color: 'var(--amber)' }}>{time}</div>
            </div>
            <div style={contactStyles.block}>
              <div style={contactStyles.blockLabel}>Email</div>
              <a style={contactStyles.link} href="mailto:hello@renoxium.com">Raviouliti@renoxium.com</a>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        input:focus, textarea:focus { border-bottom-color: var(--amber) !important; }
        @media (max-width: 900px) {
          .contact-card { grid-template-columns: 1fr !important; }
          .contact-card aside { border-left: none !important; border-top: 1px solid var(--rule); }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
