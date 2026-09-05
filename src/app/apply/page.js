import { Button, Container, FormField, Input, PageShell, PaperCard, Section, Stack } from '@/components';
import Link from 'next/link';

export default function ApplyPage() {
  return (
    <PageShell>
      <Section spacing="compact">
        <Container width="form">
          <Stack gap="lg">
            <header className="flex min-h-16 items-center justify-between">
              <Link className="label" href="/">
                E-CELL MET
              </Link>
              <Button href="/" variant="ghost">
                Exit
              </Button>
            </header>

            <PaperCard as="section">
              <Stack gap="lg">
                <div className="flex items-center gap-3 text-sm text-muted" aria-label="Application progress">
                  <span className="text-foreground">01 You</span>
                  <span aria-hidden="true">-</span>
                  <span>02 Your Squad</span>
                  <span aria-hidden="true">-</span>
                  <span>03 Review</span>
                </div>
                <Stack gap="sm">
                  <p className="eyebrow text-muted">E-CELL MET / Recruitment 2026-27</p>
                  <h1 className="display-section">Let&apos;s start with you.</h1>
                  <p className="body-large text-muted">
                    It&apos;ll only take a few minutes. Take your time with the answers that matter.
                  </p>
                </Stack>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField helper="Application wizard fields begin here in Batch B." id="fullName" label="Full name">
                    {(fieldProps) => <Input placeholder="Your full name" type="text" {...fieldProps} disabled />}
                  </FormField>
                  <FormField id="email" label="Email address">
                    {(fieldProps) => <Input placeholder="you@example.com" type="email" {...fieldProps} disabled />}
                  </FormField>
                </div>
                <div className="flex justify-end">
                  <Button disabled>Continue &rarr;</Button>
                </div>
              </Stack>
            </PaperCard>
          </Stack>
        </Container>
      </Section>
    </PageShell>
  );
}
