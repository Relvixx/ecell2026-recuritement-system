import { Button, Container, EditorialCard, PageShell, Section, Stack } from '@/components';
import Link from 'next/link';

const adminAreas = ['Overview', 'Candidates', 'Teams', 'Analytics'];

export default function AdminDashboardPage() {
  return (
    <PageShell variant="admin">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-border bg-[var(--color-ivory-50)] p-4 lg:border-b-0 lg:border-r lg:p-6">
          <Stack gap="lg">
            <Link className="label" href="/">
              E-CELL
            </Link>
            <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Admin workspace">
              {adminAreas.map((area) => (
                <a className="min-h-11 rounded-[var(--radius-control)] px-3 py-2 text-sm text-muted hover:bg-[var(--color-surface-muted)] hover:text-foreground" href="#" key={area}>
                  {area}
                </a>
              ))}
            </nav>
          </Stack>
        </aside>

        <Section spacing="compact" className="lg:py-10">
          <Container width="admin">
            <Stack gap="lg">
              <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Stack gap="xs">
                  <p className="eyebrow text-muted">Recruitment 2026-27</p>
                  <h1 className="heading">Admin application shell</h1>
                </Stack>
                <Button href="/admin" variant="secondary">Admin entry</Button>
              </header>

              <div className="grid gap-4 md:grid-cols-3">
                {['Total Applications', 'Under Review', 'Selected'].map((metric) => (
                  <EditorialCard key={metric}>
                    <p className="body-small text-muted">{metric}</p>
                    <p className="heading mt-3">--</p>
                  </EditorialCard>
                ))}
              </div>

              <EditorialCard as="section" className="min-h-[320px]">
                <Stack gap="sm">
                  <h2 className="heading">Candidates workspace</h2>
                  <p className="body text-muted">
                    Candidate list, filters, details drawer, status actions, internal notes and export controls are deferred to later UI batches.
                  </p>
                </Stack>
              </EditorialCard>
            </Stack>
          </Container>
        </Section>
      </div>
    </PageShell>
  );
}
