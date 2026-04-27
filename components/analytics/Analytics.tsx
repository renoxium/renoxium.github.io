'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Minimal first-party page-view logger. Honors `navigator.doNotTrack`.
// Skips the /admin tree so admin browsing doesn't pollute analytics.
export function Analytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pathname.startsWith('/admin')) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    if (navigator.doNotTrack === '1') return;

    const referer = document.referrer || null;
    // Fire-and-forget. Using keepalive so tracking survives nav-away.
    fetch('/api/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: pathname, referer }),
      keepalive: true,
    }).catch(() => {
      // Swallow — analytics never blocks UX.
    });
  }, [pathname]);

  return null;
}
