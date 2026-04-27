import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageViews } from '@/db/schema';

// Tiny anonymous page-view logger. The Analytics client component fires this
// on usePathname() change; admin/analytics aggregates the rows. No IP, no UA
// fingerprint — just path + referer + truncated UA so we can read which
// pages people land on.

type Body = { path?: unknown; referer?: unknown };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof body.path !== 'string') return NextResponse.json({ ok: false }, { status: 400 });
  const path = body.path.slice(0, 200);
  const referer = typeof body.referer === 'string' ? body.referer.slice(0, 500) : null;
  const ua = (req.headers.get('user-agent') ?? '').slice(0, 300) || null;

  try {
    await db.insert(pageViews).values({ path, referer, userAgent: ua });
  } catch (err) {
    console.error('page_view insert failed', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
