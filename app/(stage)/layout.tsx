import { Analytics } from '@/components/analytics/Analytics';
import StageRoot from '@/components/stage/StageRoot';

// Route group "(stage)" — keeps StageRoot mounted across every page so the
// phase machine + ball survive route changes. The route segments below render
// directly into <PageHolder>{children}</PageHolder>.
export default function StageLayout({ children }: { children: React.ReactNode }) {
  return (
    <StageRoot>
      {children}
      <Analytics />
    </StageRoot>
  );
}
