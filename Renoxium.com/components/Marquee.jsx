// Marquee — reverses on hover, click flips direction permanently
const marqueeStyles = {
  outer: {
    position: 'relative',
    padding: '32px 0',
    borderTop: '1px solid var(--rule)',
    borderBottom: '1px solid var(--rule)',
    overflow: 'hidden',
    background: 'var(--bg)',
    cursor: 'none',
  },
  track: {
    display: 'flex',
    gap: 56,
    width: 'max-content',
    whiteSpace: 'nowrap',
    willChange: 'transform',
  },
  item: {
    fontFamily: 'var(--serif)',
    fontSize: 72,
    fontStyle: 'italic',
    fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 320',
    letterSpacing: '-0.025em',
    color: 'var(--ink-2)',
    lineHeight: 1,
    display: 'flex', alignItems: 'center', gap: 56,
    transition: 'color 220ms',
  },
  dot: {
    display: 'inline-block', width: 12, height: 12,
    borderRadius: 999, background: 'var(--amber)',
    flexShrink: 0,
  },
  fade: {
    position: 'absolute', top: 0, bottom: 0, width: 160,
    pointerEvents: 'none', zIndex: 2,
  },
};

const services = [
  'SaaS platforms',
  'AI applications',
  'Web apps',
  'iOS & Android',
  'Rapid prototyping',
  'Design systems',
  'Backend & APIs',
  'A to Z delivery',
];

function Marquee() {
  const trackRef = React.useRef(null);
  const stateRef = React.useRef({ x: 0, dir: -1, paused: false, speed: 0.5 });

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf;
    const half = el.scrollWidth / 2;
    function tick() {
      const s = stateRef.current;
      if (!s.paused) s.x += s.dir * s.speed;
      if (s.x <= -half) s.x = 0;
      if (s.x > 0) s.x = -half;
      el.style.transform = `translate3d(${s.x}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const Row = ({ k }) => (
    <div style={marqueeStyles.item} key={k}>
      {services.map((s, i) => (
        <React.Fragment key={i}>
          <span className="mq-word">{s}</span>
          <span style={marqueeStyles.dot}></span>
        </React.Fragment>
      ))}
    </div>
  );
  return (
    <div
      style={marqueeStyles.outer}
      onMouseEnter={() => { stateRef.current.speed = 1.4; }}
      onMouseLeave={() => { stateRef.current.speed = 0.5; }}
      onClick={() => { stateRef.current.dir *= -1; }}
      title="Click to reverse"
    >
      <div style={{ ...marqueeStyles.fade, left: 0, background: 'linear-gradient(to right, var(--bg), transparent)' }}></div>
      <div style={{ ...marqueeStyles.fade, right: 0, background: 'linear-gradient(to left, var(--bg), transparent)' }}></div>
      <div ref={trackRef} style={marqueeStyles.track}>
        <Row k="a" /><Row k="b" />
      </div>
      <style>{`
        .mq-word { transition: color 220ms, transform 220ms; }
        .mq-word:hover { color: var(--amber); transform: translateY(-2px); }
      `}</style>
    </div>
  );
}

window.Marquee = Marquee;
