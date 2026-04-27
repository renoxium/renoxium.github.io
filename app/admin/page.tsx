import Link from 'next/link';
import { count, sql, gte, and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { inquiries, pageViews } from '@/db/schema';
import { adminStyles } from '@/components/admin/adminStyles';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const now = Math.floor(Date.now() / 1000);
  const dayAgo = new Date((now - 60 * 60 * 24) * 1000);
  const weekAgo = new Date((now - 60 * 60 * 24 * 7) * 1000);

  const [totalInquiries] = await db.select({ c: count() }).from(inquiries);
  const [newInquiries] = await db
    .select({ c: count() })
    .from(inquiries)
    .where(eq(inquiries.status, 'new'));
  const [viewsDay] = await db
    .select({ c: count() })
    .from(pageViews)
    .where(gte(pageViews.createdAt, dayAgo));
  const [viewsWeek] = await db
    .select({ c: count() })
    .from(pageViews)
    .where(gte(pageViews.createdAt, weekAgo));
  const [recent] = await db
    .select({ c: count() })
    .from(inquiries)
    .where(and(gte(inquiries.createdAt, weekAgo)));
  void sql; // appease unused import lint

  const stats = [
    { label: 'Inquiries · all time', value: totalInquiries.c },
    { label: 'New (unread)', value: newInquiries.c },
    { label: 'Inquiries · last 7d', value: recent.c },
    { label: 'Page views · last 24h', value: viewsDay.c },
    { label: 'Page views · last 7d', value: viewsWeek.c },
  ];

  return (
    <main>
      <h1 style={adminStyles.pageTitle}>Overview</h1>

      <div style={adminStyles.statRow}>
        {stats.map((s) => (
          <div key={s.label} style={adminStyles.card}>
            <div style={adminStyles.statLabel}>{s.label}</div>
            <div style={adminStyles.statValue}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <Link href="/admin/inquiries" style={adminStyles.button as React.CSSProperties}>
          View inquiries →
        </Link>
        <Link href="/admin/content" style={adminStyles.ghostButton as React.CSSProperties}>
          Edit content
        </Link>
        <Link href="/admin/analytics" style={adminStyles.ghostButton as React.CSSProperties}>
          Analytics
        </Link>
      </div>
    </main>
  );
}
