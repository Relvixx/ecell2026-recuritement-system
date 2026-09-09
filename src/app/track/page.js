import { Suspense } from 'react';
import { TrackingShell } from '@/components';
import { Container, PageShell, PaperCard, Section } from '@/components/ui/layout';

function TrackingLoading() {
  return <PageShell className="tracking-experience utility-experience" recruitmentTheme="midnight"><Section spacing="compact"><Container width="form"><PaperCard className="utility-card"><p className="body text-muted">Preparing application tracking.</p></PaperCard></Container></Section></PageShell>;
}

export default function TrackPage() {
  return (
    <Suspense fallback={<TrackingLoading />}>
      <TrackingShell />
    </Suspense>
  );
}
