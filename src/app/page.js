import { Button, Container, Eyebrow, PageShell, PaperCard, Section, Stack } from '@/components';
import Link from 'next/link';

export default function Home() {
  return (
    <PageShell>
      <header className="sticky top-0 z-20 border-b border-border bg-background/95">
        <Container className="flex min-h-16 items-center justify-between">
          <Link className="label" href="/">
            E-CELL MET
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-muted md:flex">
            <a href="#about">About</a>
            <a href="#life">Life</a>
            <a href="#teams">Teams</a>
            <a href="#journey">Journey</a>
            <a href="#faq">FAQ</a>
          </nav>
          <Button className="min-h-11 sm:min-h-11" href="/apply">
            Apply Now <span className="arrow-shift" aria-hidden="true">&rarr;</span>
          </Button>
        </Container>
      </header>

      <Section spacing="hero">
        <Container className="grid items-center gap-10 lg:min-h-[78svh] lg:grid-cols-[1.05fr_0.95fr]">
          <Stack gap="lg" className="motion-settle">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>RECRUITMENT 2026-27</Eyebrow>
              <span className="body-small rounded-full bg-[var(--color-sage)] px-3 py-1 text-foreground">
                Applications Open
              </span>
            </div>
            <h1 className="display-hero">
              Don&apos;t just
              <br />
              join a club.
              <br />
              <span className="text-muted">Build one.</span>
            </h1>
            <p className="body-large max-w-[620px] text-muted">
              Join the people behind the ideas, events, stories, systems and execution that make E-CELL happen.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/apply">
                Start your application <span className="arrow-shift" aria-hidden="true">&rarr;</span>
              </Button>
              <Button href="#teams" variant="ghost">
                Explore the teams <span aria-hidden="true">&darr;</span>
              </Button>
            </div>
          </Stack>

          <div className="grid gap-4 sm:grid-cols-[1fr_0.72fr] sm:items-end lg:gap-5">
            <MediaFrame className="motion-fade-up sm:translate-y-6" label="Hero main" />
            <MediaFrame className="motion-fade-up sm:-rotate-2" label="Hero secondary" />
          </div>
        </Container>
      </Section>

      <Section spacing="compact" tone="surface">
        <Container>
          <PaperCard className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <Eyebrow>PHASE 2 BATCH A</Eyebrow>
            <Stack gap="sm">
              <h2 className="display-section">Landing shell</h2>
              <p className="body-large text-muted">
                This route is prepared for the 2026 recruitment landing experience. Full sections are deferred to the next UI batches.
              </p>
            </Stack>
          </PaperCard>
        </Container>
      </Section>
    </PageShell>
  );
}

function MediaFrame({ label, className = '' }) {
  return (
    <figure className={`relative overflow-hidden rounded-[1.75rem] border border-border bg-[var(--color-surface-muted)] ${className}`}>
      <div className="aspect-[4/3] min-h-52 w-full bg-[linear-gradient(135deg,var(--color-ivory-50),var(--color-powder-blue),var(--color-peach))]" />
      <figcaption className="absolute bottom-4 left-4 rounded-full bg-[var(--color-ivory-50)] px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-soft)]">
        {label}
      </figcaption>
    </figure>
  );
}
