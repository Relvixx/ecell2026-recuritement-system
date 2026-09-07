import Link from 'next/link';
import { Button } from '../ui/forms';
import { Container, PageShell, PaperCard, Section, Stack, cn } from '../ui/layout';

export const APPLICATION_STEPS = [
  { number: '01', label: 'You' },
  { number: '02', label: 'Your Squad' },
  { number: '03', label: 'Review' }
];

export function ApplicationShell({ children, actions, currentStep = 0 }) {
  return (
    <PageShell className="application-experience">
      <Section className={actions ? 'pb-32 sm:pb-24 lg:pb-16' : ''} spacing="compact">
        <Container width="form">
          <Stack gap="lg">
            <header className="application-topbar flex min-h-16 items-center justify-between gap-4">
              <Link className="application-brand-lockup group inline-flex items-center gap-3" href="/">
                <span aria-hidden="true" className="hidden h-2.5 w-2.5 rounded-full bg-[var(--color-butter)] transition group-hover:bg-[var(--color-sage)] lg:block" />
                <span className="grid gap-0.5">
                  <span className="text-[0.98rem] font-medium leading-none tracking-[0.03em] text-foreground">E-CELL MET</span>
                  <span className="hidden text-[0.72rem] leading-none text-muted lg:block">Recruitment 2026–27</span>
                </span>
              </Link>
              <Link className="application-exit label inline-flex min-h-10 items-center rounded-full px-2 py-2 text-muted transition hover:text-foreground focus-visible:text-foreground" href="/">
                Exit
              </Link>
            </header>
            <ApplicationProgress currentStep={currentStep} />
            <PaperCard as="section" className="application-card">{children}</PaperCard>
          </Stack>
        </Container>
      </Section>
      {actions}
    </PageShell>
  );
}

export function ApplicationProgress({ currentStep = 0 }) {
  return (
    <nav aria-label="Application progress" className="application-progress rounded-[var(--radius-card)] border border-border bg-[var(--color-ivory-50)] p-3">
      <ol className="grid grid-cols-3 gap-2">
        {APPLICATION_STEPS.map((step, index) => {
          const active = index === currentStep;
          const complete = index < currentStep;

          return (
            <li
              aria-current={active ? 'step' : undefined}
              className={cn(
                'min-h-11 rounded-[var(--radius-control)] px-3 py-2 text-sm',
                active && 'bg-[var(--color-butter)] text-foreground',
                complete && 'bg-[var(--color-sage)]/55 text-foreground',
                !active && !complete && 'text-muted'
              )}
              key={step.number}
            >
              <span className="flex items-center justify-between gap-2 text-xs">
                <span>{step.number}</span>
                {complete ? <span aria-label="Completed" className="hidden text-[0.8rem] text-muted lg:inline">&#10003;</span> : null}
              </span>
              <span className="label mt-0.5 block">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function ApplicationStepHeader({ eyebrow = 'E-CELL MET / Recruitment 2026-27', title, description }) {
  return (
    <Stack gap="sm">
      <p className="eyebrow text-muted">{eyebrow}</p>
      <h1 className="display-section">{title}</h1>
      {description ? <p className="body-large text-muted">{description}</p> : null}
    </Stack>
  );
}

export function ApplicationActions({
  backLabel = 'Back',
  nextLabel = 'Continue',
  nextDisabled = false,
  nextForm,
  nextType = 'button',
  onBack,
  onNext,
  showBack = true,
  showNext = true
}) {
  return (
    <div className="application-actions fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 pb-[calc(0.75rem+var(--safe-area-bottom))] sm:static sm:mt-5 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 lg:mt-6">
      <Container width="form" className="px-0 sm:px-0 lg:px-0 xl:px-0">
        <div className="flex items-center justify-between gap-3">
          {showBack ? (
            <Button onClick={onBack} type="button" variant="secondary">
              {backLabel}
            </Button>
          ) : (
            <span aria-hidden="true" />
          )}
          {showNext ? (
            <Button disabled={nextDisabled} form={nextForm} onClick={onNext} type={nextType}>
              {nextLabel} &rarr;
            </Button>
          ) : null}
        </div>
      </Container>
    </div>
  );
}

export function ReviewSection({ title, children, onEdit, onEditLabel = 'Edit' }) {
  return (
    <section className="review-section rounded-[1.15rem] border border-border bg-[var(--color-ivory-50)] p-4 lg:p-5">
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-border/70 pb-3">
        <h2 className="eyebrow min-w-0 flex-1 text-muted">{title}</h2>
        <button className="label min-h-10 shrink-0 whitespace-nowrap rounded-[var(--radius-control)] px-3 text-muted transition hover:bg-[var(--color-surface-muted)] hover:text-foreground focus-visible:text-foreground" onClick={onEdit} type="button">
          {onEditLabel}
          <span aria-hidden="true"> &rarr;</span>
        </button>
      </div>
      {children}
    </section>
  );
}
