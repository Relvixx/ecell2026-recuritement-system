import { ApplicationActions, ApplicationShell, ApplicationStepHeader, FormField, Input, ReviewSection, Stack } from '@/components';

export default function ApplyPage() {
  return (
    <ApplicationShell actions={<ApplicationActions nextDisabled />} currentStep={0}>
      <Stack gap="lg">
        <ApplicationStepHeader
          description="It'll only take a few minutes. Take your time with the answers that matter."
          title="Let's start with you."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField helper="Application wizard fields begin in Phase 4." id="fullName" label="Full name">
            {(fieldProps) => <Input placeholder="Your full name" type="text" {...fieldProps} disabled />}
          </FormField>
          <FormField id="email" label="Email address">
            {(fieldProps) => <Input placeholder="you@example.com" type="email" {...fieldProps} disabled />}
          </FormField>
        </div>
        <ReviewSection title="ABOUT YOU">
          <p className="body-small text-muted">Review sections are available for the future Step 3 experience.</p>
        </ReviewSection>
      </Stack>
    </ApplicationShell>
  );
}
