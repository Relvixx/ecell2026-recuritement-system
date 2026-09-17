import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { ApplicationWizard } from '@/components/application/ApplicationWizard';
import { ApplicationShell, ApplicationStepHeader } from '@/components';
import { APPLICATIONS_OPEN } from '@/config/recruitment';

export default function ApplyPage() {
  if (!APPLICATIONS_OPEN) {
    redirect('/');
  }

  return (
    <Suspense
      fallback={(
        <ApplicationShell currentStep={0}>
          <ApplicationStepHeader description="Preparing the application space." title="Tell us about yourself" />
        </ApplicationShell>
      )}
    >
      <ApplicationWizard />
    </Suspense>
  );
}
