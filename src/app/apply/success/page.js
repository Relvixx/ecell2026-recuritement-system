import { Suspense } from 'react';
import { SuccessShell } from '@/components';
import { Container, PageShell, PaperCard, Section } from '@/components/ui/layout';

function SuccessLoading() {
  return <PageShell><Section spacing="compact"><Container width="copy"><PaperCard><p className="body text-muted">Preparing your confirmation.</p></PaperCard></Container></Section></PageShell>;
}

export default function ApplySuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessShell />
    </Suspense>
  );
}
