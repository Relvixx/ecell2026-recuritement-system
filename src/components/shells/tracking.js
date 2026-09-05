import { STATUS_COPY, STATUS_TOKENS } from '@/lib/design-system';
import { Button, FormField, Input } from '../ui/forms';
import { Container, PageShell, PaperCard, Section, Stack } from '../ui/layout';

export function TrackingShell({ status = 'submitted' }) {
  return (
    <PageShell>
      <Section spacing="compact">
        <Container width="form">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
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

            <StatusDisplay status={status} />
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}

export function StatusDisplay({ status = 'submitted', className = '' }) {
  const copy = STATUS_COPY[status] || STATUS_COPY.submitted;
  const accent = STATUS_TOKENS[status] || STATUS_TOKENS.submitted;

  return (
    <aside
      aria-label={`Application status: ${copy.label}`}
      className={`rounded-[var(--radius-paper)] border border-border bg-[var(--color-ivory-50)] p-5 shadow-[var(--shadow-soft)] sm:p-7 ${className}`}
    >
      <Stack gap="md">
        <span
          className="inline-flex min-h-11 w-fit items-center rounded-full border border-border px-4 py-2 text-sm font-medium"
          style={{ background: `color-mix(in srgb, ${accent} 58%, var(--color-ivory-50))` }}
        >
          {copy.label}
        </span>
        <div>
          <h2 className="heading">{copy.title}</h2>
          <p className="body mt-3 text-muted">{copy.description}</p>
        </div>
        <p className="helper">Status uses color plus text, so the stage is never communicated by color alone.</p>
      </Stack>
    </aside>
  );
}
