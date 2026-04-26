// PageShell - wraps a section as a single-screen page that fits 100vh.
// Provides internal scroll if content overflows. Triggers reveal-replay on mount.

const pageShellStyles = {
  shell: {
    position: 'absolute',
    inset: 0,
    overflow: 'auto',
    paddingTop: 84,        // clear nav
    paddingBottom: 64,     // clear corner wordmark
    scrollbarWidth: 'thin',
  },
};

function PageShell({ children, label }) {
  const ref = React.useRef(null);

  // Replay all .reveal elements when this page mounts.
  // SplitText handles its own char reveal via IntersectionObserver — we don't touch .char here.
  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reveals = root.querySelectorAll('.reveal');
    reveals.forEach(el => el.classList.remove('in'));
    requestAnimationFrame(() => {
      reveals.forEach((el, i) => {
        setTimeout(() => el.classList.add('in'), 60 + i * 40);
      });
    });
  }, []);

  return (
    <div ref={ref} data-screen-label={label} style={pageShellStyles.shell} className="page-shell">
      {children}
    </div>
  );
}

window.PageShell = PageShell;
