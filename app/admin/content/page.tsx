import { asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { craftItems, edgeRows, faqItems } from '@/db/schema';
import { adminStyles } from '@/components/admin/adminStyles';
import { updateCraft, updateEdge, updateFaq } from './actions';

export const dynamic = 'force-dynamic';

const sectionTitle = {
  fontFamily: 'var(--serif)',
  fontSize: 24,
  fontWeight: 380,
  margin: '40px 0 12px',
  letterSpacing: '-0.02em',
} as const;

export default async function ContentAdmin() {
  const [craft, faq, edge] = await Promise.all([
    db.select().from(craftItems).orderBy(asc(craftItems.ord)),
    db.select().from(faqItems).orderBy(asc(faqItems.ord)),
    db.select().from(edgeRows).orderBy(asc(edgeRows.ord)),
  ]);

  return (
    <main>
      <h1 style={adminStyles.pageTitle}>Content</h1>
      <p style={{ color: 'var(--ink-3)', fontSize: 14, marginTop: -12, marginBottom: 24 }}>
        Edit the rows that drive <code>/craft</code>, <code>/faq</code>, and <code>/edge</code>. Changes are live on save.
      </p>

      <h2 style={sectionTitle}>Craft items</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {craft.map((c) => (
          <details key={c.id} style={adminStyles.card}>
            <summary style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-4)', fontSize: 12 }}>{c.number}</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 22 }}>{c.title}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-4)' }}>
                {c.meta}
              </span>
            </summary>
            <form action={updateCraft} style={{ display: 'grid', gap: 12, marginTop: 14 }}>
              <input type="hidden" name="id" value={c.id} />
              <Field label="Title" name="title" defaultValue={c.title} />
              <Field label="Meta" name="meta" defaultValue={c.meta} />
              <FieldArea label="Body" name="body" defaultValue={c.body} />
              <FieldArea
                label="Bullets (one per line)"
                name="bullets"
                defaultValue={c.bullets.join('\n')}
              />
              <button type="submit" style={adminStyles.button as React.CSSProperties}>Save</button>
            </form>
          </details>
        ))}
      </div>

      <h2 style={sectionTitle}>FAQ</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {faq.map((f) => (
          <details key={f.id} style={adminStyles.card}>
            <summary style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--amber)', fontSize: 12 }}>
                {String(f.ord).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>{f.question}</span>
            </summary>
            <form action={updateFaq} style={{ display: 'grid', gap: 12, marginTop: 14 }}>
              <input type="hidden" name="id" value={f.id} />
              <Field label="Question" name="question" defaultValue={f.question} />
              <FieldArea label="Answer" name="answer" defaultValue={f.answer} />
              <button type="submit" style={adminStyles.button as React.CSSProperties}>Save</button>
            </form>
          </details>
        ))}
      </div>

      <h2 style={sectionTitle}>Edge comparison rows</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {edge.map((e) => (
          <details key={e.id} style={adminStyles.card}>
            <summary style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-4)', fontSize: 11 }}>
                {String(e.ord).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>{e.dimension}</span>
            </summary>
            <form action={updateEdge} style={{ display: 'grid', gap: 12, marginTop: 14 }}>
              <input type="hidden" name="id" value={e.id} />
              <Field label="Dimension" name="dimension" defaultValue={e.dimension} />
              <FieldArea label="Us" name="us" defaultValue={e.us} />
              <FieldArea label="Them" name="them" defaultValue={e.them} />
              <button type="submit" style={adminStyles.button as React.CSSProperties}>Save</button>
            </form>
          </details>
        ))}
      </div>
    </main>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={adminStyles.statLabel}>{label}</span>
      <input name={name} defaultValue={defaultValue} style={adminStyles.input as React.CSSProperties} />
    </label>
  );
}

function FieldArea({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={adminStyles.statLabel}>{label}</span>
      <textarea name={name} defaultValue={defaultValue} style={adminStyles.textarea as React.CSSProperties} />
    </label>
  );
}
