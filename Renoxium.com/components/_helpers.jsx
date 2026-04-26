// Shared interactive helpers — cursor, magnetic, scramble, char-split

// ─── Custom cursor (init once, vanilla) ───
(function initCursor() {
  if (window.__curatedCursor) return;
  window.__curatedCursor = true;
  if (window.matchMedia('(max-width: 900px)').matches) return;

  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let raf;

  function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    raf = requestAnimationFrame(tick);
  }

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
  });
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1'; ring.style.opacity = '1';
  });

  // Hover detection via delegation
  function onOver(e) {
    const t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('button, a, .magnetic, [role="button"], input, textarea')) {
      document.body.classList.add('cursor-hover');
    }
    if (t.closest('input, textarea, [contenteditable]')) {
      document.body.classList.add('cursor-text');
    }
  }
  function onOut(e) {
    const t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('button, a, .magnetic, [role="button"], input, textarea')) {
      document.body.classList.remove('cursor-hover');
    }
    if (t.closest('input, textarea, [contenteditable]')) {
      document.body.classList.remove('cursor-text');
    }
  }
  document.addEventListener('mouseover', onOver);
  document.addEventListener('mouseout', onOut);

  raf = requestAnimationFrame(tick);
})();

// ─── Magnetic hook: tugs element toward cursor when hovering ───
function useMagnetic(strength = 0.35) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(max-width: 900px)').matches) return;

    let raf, tx = 0, ty = 0, cx = 0, cy = 0;
    function move(e) {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      tx = dx * strength; ty = dy * strength;
      if (!raf) raf = requestAnimationFrame(loop);
    }
    function leave() {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    }
    function loop() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return ref;
}

// ─── Scramble text on hover or in-view ───
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#%$@&';
function scrambleTo(el, target, opts = {}) {
  const dur = opts.duration || 700;
  const start = performance.now();
  const oldText = el.dataset.scrambleFrom || el.textContent;
  const len = Math.max(target.length, oldText.length);
  function frame(now) {
    const p = Math.min(1, (now - start) / dur);
    let out = '';
    for (let i = 0; i < len; i++) {
      const charProgress = (p - i / len * 0.5) * 2;
      if (charProgress >= 1) {
        out += target[i] || '';
      } else if (charProgress < 0) {
        out += oldText[i] || '';
      } else {
        out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = target;
  }
  requestAnimationFrame(frame);
}

function ScrambleOnView({ children, as: Tag = 'span', style, className, delay = 0 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = String(children);
    el.textContent = SCRAMBLE_CHARS[0].repeat(target.length);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => scrambleTo(el, target, { duration: 900 }), delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [children, delay]);
  return <Tag ref={ref} style={style} className={className}>{children}</Tag>;
}

// ─── Split text into chars for staggered reveal ───
function SplitText({ text, className = '', stagger = 22, delay = 0, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll('.char');
    let triggered = false;
    const fire = () => {
      if (triggered) return;
      triggered = true;
      chars.forEach((c, i) => {
        setTimeout(() => c.classList.add('in'), delay + i * stagger);
      });
    };
    // Fallback: if visible at mount (or for any reason IO doesn't fire), fire after a short delay
    const fallbackTimer = setTimeout(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      if (r.top < vh && r.bottom > 0) fire();
    }, 80);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          fire();
          io.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(fallbackTimer); };
  }, [text, stagger, delay]);

  // Preserve spaces with non-breaking; preserve <br/> by splitting on \n
  const lines = String(text).split('\n');
  return (
    <span ref={ref} className={className} style={style}>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {line.split('').map((ch, i) => (
            <span key={i} className="char-wrap">
              <span className="char">{ch === ' ' ? '\u00A0' : ch}</span>
            </span>
          ))}
          {li < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
}

window.useMagnetic = useMagnetic;
window.ScrambleOnView = ScrambleOnView;
window.SplitText = SplitText;
window.scrambleTo = scrambleTo;
