import Link from 'next/link';
import type { Metadata } from 'next';
import { AdminNav } from '@/components/admin/AdminNav';
import { adminStyles } from '@/components/admin/adminStyles';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={adminStyles.body}>
      <div style={adminStyles.shell}>
        <header style={adminStyles.header}>
          <Link href="/admin" style={adminStyles.brand}>
            Renoxium <span style={adminStyles.brandTag}>admin</span>
          </Link>
          <AdminNav />
        </header>
        {children}
      </div>
    </div>
  );
}
