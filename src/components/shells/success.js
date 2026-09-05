import { Button } from '../ui/forms';
import { Container, PageShell, PaperCard, Section, Stack } from '../ui/layout';

const nextStages = ['Application Review', 'Shortlisting', 'Interaction', 'Final Decision'];

export function SuccessShell({ applicationCode = 'UI-PLACEHOLDER', primaryTeam = 'Primary team placeholder' }) {
  return (
    <PageShell>
      <Section spacing="compact">
        <Container width="copy">
          <PaperCard className="motion-settle">
            <Stack gap="lg">
              <Stack gap="sm">
                <p className="eyebrow text-muted">nice move.</p>
                <h1 className="display-section">Application received.</h1>
                <p className="body-large text-muted">You&apos;re officially in the recruitment pipeline.</p>
              </Stack>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoBlock label="YOUR APPLICATION ID" value={applicationCode} helper="UI placeholder until live submission data is wired." />
                <InfoBlock label="PRIMARY TEAM" value={primaryTeam} helper="Shown here after submission." />
              </div>

              <section>
                <h2 className="heading">What happens next?</h2>
                <ol className="mt-5 grid gap-3">
                  {nextStages.map((stage, index) => (
                    <li className="flex min-h-11 items-center gap-3 rounded-[var(--radius-control)] border border-border bg-[var(--color-ivory-50)] px-4 py-3" key={stage}>
                      <span className="body-small text-muted">{String(index + 1).padStart(2, '0')}</span>
                      <span className="label">{stage}</span>
                    </li>
                  ))}
                </ol>
              </section>

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

function InfoBlock({ label, value, helper }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-[var(--color-butter)]/35 p-5">
      <p className="eyebrow text-muted">{label}</p>
      <p className="heading mt-2">{value}</p>
      <p className="helper mt-2">{helper}</p>
    </div>
  );
}
