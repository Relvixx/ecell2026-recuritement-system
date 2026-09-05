import { Suspense } from 'react';
import { TrackingShell } from '@/components';
import { Container, PageShell, PaperCard, Section } from '@/components/ui/layout';

function TrackingLoading() {
  return <PageShell><Section spacing="compact"><Container width="form"><PaperCard><p className="body text-muted">Preparing application tracking.</p></PaperCard></Container></Section></PageShell>;
}

export default function TrackPage() {
  return (
    <Suspense fallback={<TrackingLoading />}>
      <TrackingShell />
    </Suspense>
  );
}
