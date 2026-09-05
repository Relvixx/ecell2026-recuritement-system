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
    <PageShell>
      <Section className={actions ? 'pb-32 sm:pb-24' : ''} spacing="compact">
        <Container width="form">
          <Stack gap="lg">
            <header className="flex min-h-16 items-center justify-between gap-4">
              <Link className="label" href="/">
                E-CELL MET
              </Link>
              <Button href="/" variant="ghost">
                Exit
              </Button>
            </header>
            <ApplicationProgress currentStep={currentStep} />
            <PaperCard as="section">{children}</PaperCard>
          </Stack>
        </Container>
      </Section>
      {actions}
    </PageShell>
  );
}

export function ApplicationProgress({ currentStep = 0 }) {
  return (
    <nav aria-label="Application progress" className="rounded-[var(--radius-card)] border border-border bg-[var(--color-ivory-50)] p-3">
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
              <span className="block text-xs">{step.number}</span>
              <span className="label">{step.label}</span>
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
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 pb-[calc(0.75rem+var(--safe-area-bottom))] sm:static sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0">
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

export function ReviewSection({ title, children, onEditLabel = 'Edit' }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-[var(--color-ivory-50)] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="eyebrow text-muted">{title}</h2>
        <button className="min-h-11 rounded-[var(--radius-control)] px-3 text-sm text-muted hover:bg-[var(--color-surface-muted)] hover:text-foreground" type="button">
          {onEditLabel}
        </button>
      </div>
      {children}
    </section>
  );
}
