import { Button, Container, PageShell, PaperCard, Section, Stack } from '@/components';

export default function ApplySuccessPage() {
  return (
    <PageShell>
      <Section spacing="compact">
        <Container width="copy">
          <PaperCard className="motion-settle">
            <Stack gap="lg">
              <Stack gap="sm">
                <p className="eyebrow text-muted">Application status</p>
                <h1 className="display-section">Application received.</h1>
                <p className="body-large text-muted">You&apos;re officially in the recruitment pipeline.</p>
              </Stack>
              <div className="rounded-[var(--radius-card)] border border-border bg-[var(--color-butter)]/45 p-5">
                <p className="eyebrow text-muted">YOUR APPLICATION ID</p>
                <p className="heading mt-2">Shown here after submission</p>
                <p className="helper mt-2">Keep this ID somewhere safe. You&apos;ll need it to track your application.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/track">Track your application &rarr;</Button>
                <Button href="/" variant="secondary">Back to E-CELL</Button>
              </div>
            </Stack>
          </PaperCard>
        </Container>
      </Section>
    </PageShell>
  );
}
