import { Suspense } from 'react';
import { ApplicationWizard } from '@/components/application/ApplicationWizard';
import { ApplicationShell, ApplicationStepHeader } from '@/components';

export default function ApplyPage() {
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
