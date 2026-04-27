'use client';

import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';

function ContactArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const styles: Record<string, CSSProperties> = {
  section: { padding: '120px 0', borderTop: '1px solid var(--rule)', position: 'relative', overflow: 'hidden' },
  head: { textAlign: 'center', maxWidth: 760, margin: '0 auto 72px' },
  kicker: { color: 'var(--amber)', marginBottom: 18 },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(48px, 9vw, 140px)',
    lineHeight: 0.88,
    letterSpacing: '-0.045em',
    margin: 0,
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    fontWeight: 350,
  },
  blurb: { color: 'var(--ink-3)', fontSize: 17, lineHeight: 1.6, marginTop: 24, maxWidth: 540, marginInline: 'auto' },
  card: {
    border: '1px solid var(--rule)',
    borderRadius: 20,
    background: 'var(--bg-2)',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
  },
  form: { padding: 48, display: 'flex', flexDirection: 'column', gap: 24 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: {
    fontFamily: 'var(--mono)',
    fontSize: 11,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
  },
  input: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--rule-strong)',
    color: 'var(--ink)',
    fontFamily: 'var(--sans)',
    fontSize: 18,
    padding: '10px 0',
    outline: 'none',
    transition: 'border-color 200ms',
  },
  textarea: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--rule-strong)',
    color: 'var(--ink)',
    fontFamily: 'var(--sans)',
    fontSize: 18,
    padding: '10px 0',
    outline: 'none',
    minHeight: 60,
    resize: 'vertical',
    transition: 'border-color 200ms',
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  submit: {
    background: 'var(--amber)',
    color: '#14151B',
    border: 'none',
    borderRadius: 999,
    padding: '16px 26px',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
    transition: 'all 200ms',
  },
  side: {
    padding: 48,
    background: 'var(--bg-3)',
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    borderLeft: '1px solid var(--rule)',
  },
  block: { display: 'flex', flexDirection: 'column', gap: 8 },
  blockLabel: {
    fontFamily: 'var(--mono)',
    fontSize: 11,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--ink-4)',
  },
  blockValueBig: {
    fontFamily: 'var(--serif)',
    fontSize: 32,
    fontStyle: 'italic',
    color: 'var(--amber)',
    letterSpacing: '-0.025em',
    fontVariationSettings: '"opsz" 144, "SOFT" 100',
    fontWeight: 360,
  },
  link: { color: 'var(--amber)', textDecoration: 'none' },
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    fontFamily: 'var(--mono)',
    letterSpacing: '0.04em',
  },
};

const chipStyle = (active: boolean): CSSProperties => ({
  padding: '8px 14px',
  borderRadius: 999,
  border: `1px solid ${active ? 'var(--amber)' : 'var(--rule-strong)'}`,
  background: active ? 'var(--amber-soft)' : 'transparent',
  color: active ? 'var(--amber)' : 'var(--ink-2)',
  fontSize: 13,
  cursor: 'pointer',
  transition: 'all 200ms',
});

function fmtDubaiFull(): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dubai',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date()) + ' GST';
  } catch {
    return '...';
  }
}

const SERVICES = ['SaaS', 'Web app', 'Mobile app', 'AI product', 'Prototype', 'Audit / takeover'];
const BUDGETS = ['<$25k', '$25k to $50k', '$50k to $150k', '$150k to $500k', '$500k+'];

type SubmitState = 'idle' | 'submitting' | 'sent' | 'error';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [services, setServices] = useState<Set<string>>(new Set(['SaaS']));
  const [budget, setBudget] = useState<string>('$50k to $150k');
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    setTime(fmtDubaiFull());
    const t = setInterval(() => setTime(fmtDubaiFull()), 1000);
    return () => clearInterval(t);
  }, []);

  const toggleService = (s: string) => {
    setServices((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === 'submitting') return;
    setState('submitting');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          services: Array.from(services),
          budget,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setErrorMsg(data?.error ?? 'send_failed');
        setState('error');
        return;
      }
      setState('sent');
      setName('');
      setEmail('');
      setMessage('');
      setServices(new Set(['SaaS']));
      setBudget('$50k to $150k');
      setTimeout(() => setState('idle'), 5000);
    } catch {
      setErrorMsg('network_error');
      setState('error');
    }
  };

  const buttonLabel = (() => {
    if (state === 'submitting') return 'Sending…';
    if (state === 'sent') return 'Sent · talk soon ✓';
    if (state === 'error') return 'Retry';
    return 'Send brief';
  })();

  return (
    <section id="contact" data-screen-label="Contact" style={styles.section}>
      <div className="wrap">
        <div style={styles.head}>
          <div className="mono" style={styles.kicker}>Contact</div>
          <h1 style={styles.title}>
            Let's build<br />
            <span style={{ fontStyle: 'italic', color: 'var(--amber)' }}>something good.</span>
          </h1>
          <p style={styles.blurb}>
            Tell us a little about the project. We reply within 2 business days (tops) during Dubai business days. Usually with a calendar link and a question or two.
          </p>
        </div>

        <div className="contact-card" style={styles.card}>
          <form style={styles.form} onSubmit={onSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="form-row">
              <div style={styles.field}>
                <label style={styles.label}>Your name</label>
                <input
                  style={styles.input}
                  placeholder="Layla Hassan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Work email</label>
                <input
                  type="email"
                  style={styles.input}
                  placeholder="layla@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>What do you need?</label>
              <div style={styles.chips}>
                {SERVICES.map((s) => (
                  <button key={s} type="button" style={chipStyle(services.has(s))} onClick={() => toggleService(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Budget range</label>
              <div style={styles.chips}>
                {BUDGETS.map((b) => (
                  <button key={b} type="button" style={chipStyle(budget === b)} onClick={() => setBudget(b)}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Tell us about it</label>
              <textarea
                style={styles.textarea}
                placeholder="A few sentences is plenty. We'll ask the rest on the call."
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button type="submit" style={styles.submit} disabled={state === 'submitting'}>
              {buttonLabel}
              {state === 'idle' && <ContactArrow />}
            </button>
            {state === 'error' && errorMsg && (
              <div style={styles.errorText}>Couldn't send: {errorMsg}. Try again?</div>
            )}
          </form>

          <aside style={styles.side}>
            <div style={{ ...styles.block, gap: 14 }}>
              <div style={styles.blockLabel}>Studio</div>
              <div style={{ ...styles.blockValueBig, marginBottom: 4, lineHeight: 1.1 }}>UAE, Dubai</div>
            </div>
            <div style={styles.block}>
              <div style={styles.blockLabel}>Local time</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 22, color: 'var(--amber)' }} suppressHydrationWarning>{time}</div>
            </div>
            <div style={styles.block}>
              <div style={styles.blockLabel}>Email</div>
              <a style={styles.link} href="mailto:hello@renoxium.com">Raviouliti@renoxium.com</a>
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
