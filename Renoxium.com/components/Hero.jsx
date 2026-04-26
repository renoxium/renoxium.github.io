// Hero - editorial; replayable hover micro-animations; em-dashes removed
const heroStyles = {
  section: {
    position: 'relative',
    minHeight: '100vh',
    paddingTop: 140,
    paddingBottom: 80,
    overflow: 'hidden',
  },
  meta: {
    display: 'flex', alignItems: 'center', gap: 16,
    color: 'var(--ink-3)',
    marginBottom: 36,
    flexWrap: 'wrap',
  },
  metaDot: { width: 6, height: 6, borderRadius: 999, background: 'var(--amber)', animation: 'pulse 2.4s ease-in-out infinite' },
  headline: {
    fontFamily: 'var(--serif)',
    fontSize: 'clamp(56px, 12vw, 192px)',
    lineHeight: 1.04,
    letterSpacing: '-0.045em',
    margin: 0,
    fontWeight: 350,
    fontVariationSettings: '"opsz" 144, "SOFT" 30',
    color: 'var(--ink)',
  },
  italic: {
    fontStyle: 'italic',
    fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 320',
    color: 'var(--amber)',
    cursor: 'none',
  },
  sub: {
    maxWidth: 540,
    fontSize: 18,
    lineHeight: 1.55,
    color: 'var(--ink-2)',
    marginTop: 40,
    fontFamily: 'var(--sans)',
  },
  ctas: {
    display: 'flex', alignItems: 'center', gap: 14,
    marginTop: 36, flexWrap: 'wrap',
  },
  primary: {
    fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
    background: 'var(--amber)', color: '#0E0F0D',
    padding: '16px 24px', borderRadius: 999,
    border: 'none', cursor: 'none',
    display: 'inline-flex', alignItems: 'center', gap: 12,
    transition: 'all 200ms ease',
  },
  ghost: {
    fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
    background: 'transparent', color: 'var(--ink)',
    padding: '15px 22px', borderRadius: 999,
    border: '1px solid var(--rule-strong)', cursor: 'none',
    display: 'inline-flex', alignItems: 'center', gap: 10,
    transition: 'all 200ms ease',
  },
  stats: {
    marginTop: 80, paddingTop: 28,
    borderTop: '1px solid var(--rule)',
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
  },
  stat: { display: 'flex', flexDirection: 'column', gap: 6, cursor: 'none' },
  statN: {
    fontFamily: 'var(--serif)', fontSize: 56, lineHeight: 1,
    letterSpacing: '-0.035em',
    fontVariationSettings: '"opsz" 144', fontWeight: 350,
  },
  statL: {
    fontFamily: 'var(--mono)', fontSize: 11,
    color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase',
  },
};

function Hero() {
  const [time, setTime] = React.useState(() => fmtDubai());
  React.useEffect(() => {
    const t = setInterval(() => setTime(fmtDubai()), 1000);
    return () => clearInterval(t);
  }, []);

  const primaryRef = useMagnetic(0.35);
  const ghostRef = useMagnetic(0.25);

  const goContact = (e) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  const goProcess = (e) => {
    e.preventDefault();
    document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={heroStyles.section}>
      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        <div className="reveal in mono" style={heroStyles.meta}>
          <span style={heroStyles.metaDot}></span>
          <span>Dubai · {time} GST</span>
          <span style={{ color: 'var(--ink-4)' }}>·</span>
          <span>Est. 2005 · 20+ years</span>
          <span style={{ color: 'var(--ink-4)' }}>·</span>
          <span>Booking Q3 2026</span>
        </div>

        <h1 style={heroStyles.headline} className="hero-h1">
          <span className="split-hoverable" style={{ display: 'inline-block' }}>
            <SplitText text={'Software,\u00A0'} stagger={28} delay={0} />
          </span>
          <span style={heroStyles.italic} className="split-hoverable italic-word" data-word="curated">
            <SplitText text="curated" stagger={28} delay={200} />
          </span>
          <br />
          <span className="split-hoverable" style={{ display: 'inline-block' }}>
            <SplitText text="by humans," stagger={28} delay={400} />
          </span>
          <br />
          <span style={heroStyles.italic} className="split-hoverable italic-word" data-word="shipped">
            <SplitText text="shipped" stagger={28} delay={650} />
          </span>
          <span className="split-hoverable" style={{ display: 'inline-block' }}>
            <SplitText text={'\u00A0by machines.'} stagger={28} delay={850} />
          </span>
        </h1>

        <div className="hero-bottom" style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'end' }}>
          <p className="reveal in" style={heroStyles.sub}>
            We are a senior product studio in Dubai building SaaS, web, and mobile
            from <em style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--amber)' }}>idea</em> to <em style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--amber)' }}>scale</em>.
            Two decades of engineering, augmented by the most advanced AI, so a
            prototype lands in a week and v1 in a quarter.
          </p>
          <div className="reveal in" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
            <div style={heroStyles.ctas}>
              <a ref={primaryRef} href="#contact" onClick={goContact} style={heroStyles.primary} className="magnetic">
                Start a project<Arrow />
              </a>
              <a ref={ghostRef} href="#process" onClick={goProcess} style={heroStyles.ghost} className="magnetic">
                See how
              </a>
            </div>
            <div className="mono" style={{ color: 'var(--ink-4)', fontSize: 11 }}>
              Reply within 4 hours · Free 30 min scoping call
            </div>
          </div>
        </div>

        <div className="reveal in stats-grid" style={heroStyles.stats}>
          <Stat n="240+" l="Products shipped" delay={0} />
          <Stat n="20yr" l="Engineering pedigree" delay={100} />
          <Stat n="34" l="Countries served" delay={200} />
          <Stat n="7d" l="Median to first prototype" delay={300} />
        </div>
      </div>

      <div aria-hidden="true" style={{
        position: 'absolute', right: '-10vw', bottom: '-14vw', pointerEvents: 'none',
        fontFamily: 'var(--serif)', fontStyle: 'italic',
        fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 300',
        fontSize: '60vw', lineHeight: 0.8, color: 'var(--amber)',
        opacity: 0.10, zIndex: 0, userSelect: 'none',
      }}>R</div>

      <style>{`
        .italic-word { transition: letter-spacing 420ms cubic-bezier(0.2,0.8,0.2,1); display: inline-block; }
        .italic-word:hover { letter-spacing: 0.01em; }
        .stat-num { transition: transform 320ms cubic-bezier(0.2,0.8,0.2,1); display: inline-block; }
        .stat-card:hover .stat-num { transform: translateY(-4px); }
        @media (max-width: 900px) {
          .hero-bottom { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

function Stat({ n, l, delay = 0 }) {
  const ref = React.useRef(null);
  const playedRef = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current?.querySelector('[data-scramble]');
    if (!el) return;
    const target = n;
    el.textContent = '!@#$%'.slice(0, target.length);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !playedRef.current) {
          playedRef.current = true;
          setTimeout(() => scrambleTo(el, target, { duration: 900 }), delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [n, delay]);

  const onEnter = () => {
    const el = ref.current?.querySelector('[data-scramble]');
    if (el && playedRef.current) scrambleTo(el, n, { duration: 500 });
  };
  return (
    <div ref={ref} style={heroStyles.stat} className="stat-card" onMouseEnter={onEnter}>
      <div style={heroStyles.statN}>
        <span className="stat-num" data-scramble>{n}</span>
      </div>
      <div style={heroStyles.statL}>{l}</div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function fmtDubai() {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date());
  } catch (e) { return '00:00'; }
}

window.Hero = Hero;
window.Arrow = Arrow;
