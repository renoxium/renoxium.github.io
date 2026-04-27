import type { Metadata } from 'next';
import { PageShell } from '@/components/shared/PageShell';
import Contact from '@/components/pages/Contact';

const TITLE = 'Contact';
const DESCRIPTION = 'Tell us about your project. We reply within 2 business days.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/contact' },
  openGraph: { title: `${TITLE} · Renoxium`, description: DESCRIPTION, url: '/contact' },
  twitter: { title: `${TITLE} · Renoxium`, description: DESCRIPTION },
};

export default function ContactRoute() {
  return (
    <PageShell label="Contact">
      <Contact />
    </PageShell>
  );
}
