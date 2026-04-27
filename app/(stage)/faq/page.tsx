import type { Metadata } from 'next';
import { asc } from 'drizzle-orm';
import { PageShell } from '@/components/shared/PageShell';
import FAQ from '@/components/pages/FAQ';
import { db } from '@/lib/db';
import { faqItems } from '@/db/schema';

const TITLE = 'FAQ';
const DESCRIPTION = 'Plain answers about how we work, what we charge, and what you own at the end.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/faq' },
  openGraph: { title: `${TITLE} · Renoxium`, description: DESCRIPTION, url: '/faq' },
  twitter: { title: `${TITLE} · Renoxium`, description: DESCRIPTION },
};

export const dynamic = 'force-dynamic';

export default async function FAQRoute() {
  const faqs = await db.select().from(faqItems).orderBy(asc(faqItems.ord));

  // FAQPage JSON-LD generated from the live DB rows so Google's rich result
  // for FAQs always matches what the page renders.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://renoxium.com/faq#faq',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <PageShell label="FAQ">
      <FAQ faqs={faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </PageShell>
  );
}
