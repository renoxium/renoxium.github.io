import type { Metadata } from 'next';
import { asc } from 'drizzle-orm';
import { PageShell } from '@/components/shared/PageShell';
import Edge from '@/components/pages/Edge';
import { db } from '@/lib/db';
import { edgeRows } from '@/db/schema';

const TITLE = 'Edge';
const DESCRIPTION = 'Senior throughout, predictable timelines, zero lock-in, bespoke by default.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/edge' },
  openGraph: { title: `${TITLE} · Renoxium`, description: DESCRIPTION, url: '/edge' },
  twitter: { title: `${TITLE} · Renoxium`, description: DESCRIPTION },
};

export const dynamic = 'force-dynamic';

export default async function EdgeRoute() {
  const compareRows = await db.select().from(edgeRows).orderBy(asc(edgeRows.ord));
  return (
    <PageShell label="Edge">
      <Edge compareRows={compareRows} />
    </PageShell>
  );
}
