'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminStyles } from './adminStyles';

const links = [
  { href: '/admin/inquiries', label: 'Inquiries' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/analytics', label: 'Analytics' },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav style={adminStyles.nav}>
      {links.map((l) => {
        const active = pathname === l.href || pathname.startsWith(l.href + '/');
        return (
          <Link
            key={l.href}
            href={l.href}
            style={active ? { ...adminStyles.navLink, ...adminStyles.navLinkActive } : adminStyles.navLink}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
