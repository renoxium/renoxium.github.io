'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

const shellStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'auto',
  paddingTop: 84,
  paddingBottom: 64,
  scrollbarWidth: 'thin',
};

type Props = {
  children: ReactNode;
  label: string;
};

// Wraps each page body. Renders as <main> for the page-content landmark so
// crawlers and screen readers can find it. On mount, cascades the .reveal
// class onto every .reveal child so page-enter animations restart on
// navigation.
export function PageShell({ children, label }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reveals = root.querySelectorAll<HTMLElement>('.reveal');
    reveals.forEach((el) => el.classList.remove('in'));
    requestAnimationFrame(() => {
      reveals.forEach((el, i) => {
        setTimeout(() => el.classList.add('in'), 60 + i * 40);
      });
    });
  }, []);

  return (
    <main ref={ref} data-screen-label={label} style={shellStyle} className="page-shell">
      {children}
    </main>
  );
}
