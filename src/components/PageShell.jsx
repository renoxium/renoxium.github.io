import React, { useEffect, useRef } from 'react';

const pageShellStyles = {
  shell: {
    position: 'absolute',
    inset: 0,
    overflow: 'auto',
    paddingTop: 84,
    paddingBottom: 64,
    scrollbarWidth: 'thin',
  },
};

export default function PageShell({ children, label }) {
  const ref = useRef(null);

  useEffect(() => {
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
