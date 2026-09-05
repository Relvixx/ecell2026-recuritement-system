import { Button, Container, FormField, Input, PageShell, PaperCard, Section, Stack } from '@/components';

export default function TrackPage() {
  return (
    <PageShell>
      <Section spacing="compact">
        <Container width="form">
          <PaperCard>
            <Stack gap="lg">
              <Stack gap="sm">
                <p className="eyebrow text-muted">Tracking shell</p>
                <h1 className="display-section">Track your application</h1>
                <p className="body-large text-muted">
                  Enter the Application ID you received after submitting and the email you applied with.
                </p>
              </Stack>
              <form className="grid gap-5" aria-label="Track application placeholder form">
                <FormField id="applicationId" label="Application ID">
                  {(fieldProps) => <Input placeholder="ECR26-0000" type="text" {...fieldProps} disabled />}
                </FormField>
                <FormField id="trackingEmail" label="Email address">
                  {(fieldProps) => <Input placeholder="you@example.com" type="email" {...fieldProps} disabled />}
                </FormField>
                <Button disabled>Check status &rarr;</Button>
              </form>
            </Stack>
          </PaperCard>
        </Container>
      </Section>
    </PageShell>
  );
}
