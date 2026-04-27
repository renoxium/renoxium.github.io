import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { inquiries } from '@/db/schema';

// Light-weight validation. Schema-level constraints catch what this misses,
// but explicit checks here let us return useful 400s instead of opaque 500s.
type Body = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  services?: unknown;
  budget?: unknown;
};

function asTrimmedString(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (!t || t.length > max) return null;
  return t;
}

function asStringArray(v: unknown, maxItems: number, maxLen: number): string[] | null {
  if (!Array.isArray(v)) return null;
  if (v.length > maxItems) return null;
  const out: string[] = [];
  for (const item of v) {
    if (typeof item !== 'string') return null;
    const t = item.trim();
    if (!t || t.length > maxLen) return null;
    out.push(t);
  }
  return out;
}

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const name = asTrimmedString(body.name, 200);
  const email = asTrimmedString(body.email, 320);
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 5000) : '';
  const services = asStringArray(body.services, 12, 60) ?? [];
  const budget = body.budget == null ? null : asTrimmedString(body.budget, 60);

  if (!name) return NextResponse.json({ ok: false, error: 'name_required' }, { status: 400 });
  if (!email || !EMAIL_RX.test(email)) {
    return NextResponse.json({ ok: false, error: 'email_invalid' }, { status: 400 });
  }

  try {
    const [row] = await db
      .insert(inquiries)
      .values({
        name,
        email,
        message,
        servicesJson: services,
        budget,
      })
      .returning({ id: inquiries.id });
    return NextResponse.json({ ok: true, id: row.id });
  } catch (err) {
    console.error('inquiry insert failed', err);
    return NextResponse.json({ ok: false, error: 'insert_failed' }, { status: 500 });
  }
}
