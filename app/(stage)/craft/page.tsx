import type { Metadata } from 'next';
import { asc } from 'drizzle-orm';
import { PageShell } from '@/components/shared/PageShell';
import Craft from '@/components/pages/Craft';
import { db } from '@/lib/db';
import { craftItems } from '@/db/schema';

const TITLE = 'Craft';
const DESCRIPTION = 'Six disciplines, one studio. SaaS, AI, web, mobile, prototyping, A to Z delivery.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/craft' },
  openGraph: { title: `${TITLE} · Renoxium`, description: DESCRIPTION, url: '/craft' },
  twitter: { title: `${TITLE} · Renoxium`, description: DESCRIPTION },
};

// SSR per request — content lives in SQLite and is edited via /admin.
// Crawlers still get fully rendered HTML; only the work happens at request time.
export const dynamic = 'force-dynamic';

// Server-rendered: pulls craft_items rows on every request. Edits via /admin
// (Phase 3) or sqlite directly are reflected on next page load.
export default async function CraftRoute() {
  const services = await db.select().from(craftItems).orderBy(asc(craftItems.ord));
  return (
    <PageShell label="Craft">
      <Craft services={services} />
    </PageShell>
  );
}
