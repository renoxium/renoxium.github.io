import type { Metadata } from 'next';
import { PageShell } from '@/components/shared/PageShell';
import Process from '@/components/pages/Process';

const TITLE = 'Process';
const DESCRIPTION = 'Four steps, no guesswork: discover, prototype, build, scale.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/process' },
  openGraph: { title: `${TITLE} · Renoxium`, description: DESCRIPTION, url: '/process' },
  twitter: { title: `${TITLE} · Renoxium`, description: DESCRIPTION },
};

export default function ProcessRoute() {
  return (
    <PageShell label="Process">
      <Process />
    </PageShell>
  );
}
