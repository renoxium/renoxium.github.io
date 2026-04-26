// Custom amber cursor (init once, vanilla DOM)
let initialized = false;

export function initCursor() {
  if (initialized) return;
  initialized = true;
  if (window.matchMedia('(max-width: 900px)').matches) return;

  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
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

  requestAnimationFrame(tick);
}
