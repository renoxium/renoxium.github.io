import { PageShell } from '@/components/shared/PageShell';
import Home from '@/components/pages/Home';

export default function HomeRoute() {
  return (
    <PageShell label="Home">
      <Home />
    </PageShell>
  );
}
