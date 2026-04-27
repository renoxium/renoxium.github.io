import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { inquiries } from '@/db/schema';
import { adminStyles } from '@/components/admin/adminStyles';
import { deleteInquiry, updateInquiry } from './actions';

export const dynamic = 'force-dynamic';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'won', 'lost'] as const;

const STATUS_COLOR: Record<string, string> = {
  new: 'var(--amber)',
  contacted: '#a4c46f',
  qualified: '#9ec1ff',
  won: '#5cd197',
  lost: '#ff8585',
};

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 16).replace('T', ' ');
}

export default async function InquiriesAdmin() {
  const rows = await db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt));

  return (
    <main>
      <h1 style={adminStyles.pageTitle}>Inquiries</h1>
      {rows.length === 0 && (
        <div style={adminStyles.card}>
          <div style={{ color: 'var(--ink-3)', fontSize: 14 }}>
            No inquiries yet. Submissions from the public Contact form will appear here.
          </div>
        </div>
      )}

      {rows.map((r) => (
        <details
          key={r.id}
          style={{ ...adminStyles.card, marginBottom: 12, padding: 0, overflow: 'hidden' }}
          open={r.status === 'new'}
        >
          <summary
            style={{
              cursor: 'pointer',
              padding: '14px 18px',
              display: 'grid',
              gridTemplateColumns: '110px 1fr 1.4fr 110px 100px',
              alignItems: 'center',
              gap: 14,
              listStyle: 'none',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: 999,
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: STATUS_COLOR[r.status],
                border: `1px solid ${STATUS_COLOR[r.status]}`,
              }}
            >
              {r.status}
            </span>
            <span style={{ fontWeight: 500 }}>{r.name}</span>
            <span style={{ color: 'var(--ink-3)', fontSize: 13 }}>{r.email}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-4)' }}>
              {r.budget ?? '—'}
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-4)' }}>
              {fmtDate(r.createdAt)}
            </span>
          </summary>

          <div style={{ padding: '8px 18px 18px', borderTop: '1px solid var(--rule)' }}>
            {r.servicesJson.length > 0 && (
              <div style={{ marginTop: 12, marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {r.servicesJson.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: '3px 10px',
                      borderRadius: 999,
                      border: '1px solid var(--rule-strong)',
                      fontSize: 11,
                      color: 'var(--ink-2)',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
            {r.message && (
              <div style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.55, whiteSpace: 'pre-wrap', marginBottom: 16 }}>
                {r.message}
              </div>
            )}

            <form action={updateInquiry} style={{ display: 'grid', gap: 10 }}>
              <input type="hidden" name="id" value={r.id} />
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, alignItems: 'start' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={adminStyles.statLabel}>Status</span>
                  <select name="status" defaultValue={r.status} style={adminStyles.input as React.CSSProperties}>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={adminStyles.statLabel}>Notes</span>
                  <textarea
                    name="notes"
                    defaultValue={r.notes}
                    style={adminStyles.textarea as React.CSSProperties}
                    placeholder="Internal notes…"
                  />
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" style={adminStyles.button as React.CSSProperties}>
                  Save
                </button>
              </div>
            </form>

            <form action={deleteInquiry} style={{ marginTop: 18 }}>
              <input type="hidden" name="id" value={r.id} />
              <button
                type="submit"
                style={{ ...adminStyles.ghostButton, borderColor: '#ff8585', color: '#ff8585' } as React.CSSProperties}
              >
                Delete
              </button>
            </form>
          </div>
        </details>
      ))}
    </main>
  );
}
