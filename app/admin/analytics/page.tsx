import { count, desc, gte, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pageViews } from '@/db/schema';
import { adminStyles } from '@/components/admin/adminStyles';

export const dynamic = 'force-dynamic';

const sectionTitle = {
  fontFamily: 'var(--serif)',
  fontSize: 22,
  fontWeight: 380,
  margin: '36px 0 14px',
  letterSpacing: '-0.02em',
} as const;

export default async function AnalyticsAdmin() {
  const now = Math.floor(Date.now() / 1000);
  const since30d = new Date((now - 60 * 60 * 24 * 30) * 1000);
  const since7d = new Date((now - 60 * 60 * 24 * 7) * 1000);

  // Top paths last 7d / 30d
  const top7 = await db
    .select({ path: pageViews.path, c: count() })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since7d))
    .groupBy(pageViews.path)
    .orderBy(desc(count()))
    .limit(15);
  const top30 = await db
    .select({ path: pageViews.path, c: count() })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since30d))
    .groupBy(pageViews.path)
    .orderBy(desc(count()))
    .limit(15);

  // Daily counts last 30 days. Group by SQLite date(unixepoch) UTC.
  const daily = await db
    .select({
      day: sql<string>`strftime('%Y-%m-%d', ${pageViews.createdAt}, 'unixepoch')`,
      c: count(),
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since30d))
    .groupBy(sql`1`)
    .orderBy(sql`1 asc`);

  // Build a contiguous 30-day series so empty days still render.
  const today = new Date();
  const days: { day: string; c: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const hit = daily.find((x) => x.day === key);
    days.push({ day: key, c: hit?.c ?? 0 });
  }
  const peak = Math.max(1, ...days.map((d) => d.c));

  return (
    <main>
      <h1 style={adminStyles.pageTitle}>Analytics</h1>
      <p style={{ color: 'var(--ink-3)', fontSize: 14, marginTop: -12, marginBottom: 24 }}>
        First-party page-view counts. Admin paths are not tracked.
      </p>

      <h2 style={sectionTitle}>Daily views · last 30 days</h2>
      <div style={adminStyles.card}>
        <svg viewBox="0 0 600 140" style={{ width: '100%', height: 140, display: 'block' }}>
          {days.map((d, i) => {
            const w = 600 / days.length;
            const h = (d.c / peak) * 110;
            const x = i * w + 2;
            const y = 130 - h;
            return (
              <g key={d.day}>
                <rect x={x} y={y} width={w - 4} height={h} fill="var(--amber)" opacity={0.85}>
                  <title>{`${d.day}: ${d.c}`}</title>
                </rect>
              </g>
            );
          })}
          <line x1={0} y1={130} x2={600} y2={130} stroke="var(--rule-strong)" strokeWidth={1} />
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-4)' }}>
          <span>{days[0].day}</span>
          <span>peak {peak}/day</span>
          <span>{days[days.length - 1].day}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 24 }}>
        <PathList title="Top paths · last 7 days" rows={top7} />
        <PathList title="Top paths · last 30 days" rows={top30} />
      </div>
    </main>
  );
}

function PathList({ title, rows }: { title: string; rows: { path: string; c: number }[] }) {
  const peak = Math.max(1, ...rows.map((r) => r.c));
  return (
    <div style={adminStyles.card}>
      <h3 style={sectionTitle}>{title}</h3>
      {rows.length === 0 && (
        <div style={{ color: 'var(--ink-4)', fontSize: 13 }}>No data yet.</div>
      )}
      <div style={{ display: 'grid', gap: 8 }}>
        {rows.map((r) => (
          <div key={r.path} style={{ display: 'grid', gridTemplateColumns: '1fr 50px', gap: 12, alignItems: 'center' }}>
            <div style={{ position: 'relative', height: 22, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${(r.c / peak) * 100}%`,
                  background: 'rgba(79, 179, 255, 0.4)',
                }}
              />
              <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--ink-2)' }}>
                {r.path}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-3)' }}>{r.c}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
