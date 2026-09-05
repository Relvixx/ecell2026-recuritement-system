import { Button, Container, FormField, Input, PageShell, PaperCard, Section, Stack } from '@/components';

export default function AdminPage() {
  return (
    <PageShell variant="admin">
      <Section spacing="compact">
        <Container width="copy" className="flex min-h-[calc(100svh-7rem)] items-center">
          <PaperCard className="w-full">
            <Stack gap="lg">
              <Stack gap="sm">
                <p className="eyebrow text-muted">E-CELL MET</p>
                <h1 className="heading">Recruitment Command Center</h1>
                <p className="body text-muted">Admin login shell for the 2026-27 recruitment workspace.</p>
              </Stack>
              <form className="grid gap-5" aria-label="Admin login placeholder form">
                <FormField id="username" label="Username">
                  {(fieldProps) => <Input autoComplete="username" placeholder="Admin username" type="text" {...fieldProps} disabled />}
                </FormField>
                <FormField id="password" label="Password">
                  {(fieldProps) => <Input autoComplete="current-password" placeholder="Password" type="password" {...fieldProps} disabled />}
                </FormField>
                <Button disabled>Sign in &rarr;</Button>
              </form>
            </Stack>
          </PaperCard>
        </Container>
      </Section>
    </PageShell>
  );
}
