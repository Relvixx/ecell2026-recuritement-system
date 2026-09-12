'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '../ui/forms';
import { Container, PageShell, PaperCard, Section, Stack } from '../ui/layout';
import { RecruitmentShareSection } from '../sharing/RecruitmentShareSection';

const APPLICATION_CODE_PATTERN = /^EC26-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{5}$/;
const nextStages = ['Application Review', 'Shortlisting', 'Interaction', 'Final Decision'];

function validApplicationCode(value) {
  return typeof value === 'string' && APPLICATION_CODE_PATTERN.test(value.trim().toUpperCase());
}

export function SuccessShell({ loading = false }) {
  const searchParams = useSearchParams();
  const rawCode = searchParams.get('id');
  const applicationCode = validApplicationCode(rawCode) ? rawCode.trim().toUpperCase() : '';
  const [copyState, setCopyState] = useState('idle');

  async function copyApplicationCode() {
    if (!applicationCode || !navigator.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(applicationCode);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('unavailable');
    }
  }

  if (loading) {
    return <PageShell className="success-experience utility-experience" recruitmentTheme="midnight"><Section spacing="compact"><Container width="copy"><PaperCard className="utility-card"><p className="body text-muted">Preparing your confirmation.</p></PaperCard></Container></Section></PageShell>;
  }

  if (!applicationCode) {
    return (
      <PageShell className="success-experience utility-experience" recruitmentTheme="midnight">
        <Section spacing="compact">
          <Container width="copy">
            <PaperCard className="success-card success-receipt utility-card motion-settle">
              <Stack gap="lg">
                <Stack gap="sm">
                  <p className="eyebrow text-muted">E-CELL MET / Recruitment 2026-27</p>
                  <h1 className="display-section">We couldn&apos;t find an application ID in this link.</h1>
                  <p className="body-large text-muted">Open the confirmation link from your submission, or continue to application tracking.</p>
                </Stack>
                <div className="success-actions utility-actions flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Button href="/apply" variant="secondary">Back to application</Button>
                  <Button href="/track">Track application &rarr;</Button>
                </div>
              </Stack>
            </PaperCard>
          </Container>
        </Section>
      </PageShell>
    );
  }

  return (
    <PageShell className="success-experience utility-experience" recruitmentTheme="midnight">
      <Section spacing="compact">
        <Container width="form">
          <PaperCard className="success-card success-receipt utility-card motion-settle">
            <Stack gap="lg">
              <Stack gap="sm">
                <p className="eyebrow text-muted">E-CELL MET / Recruitment 2026-27</p>
                <h1 className="display-section">Application received.</h1>
                <p className="body-large text-muted">You&apos;re officially in the recruitment pipeline.</p>
              </Stack>

              <div className="success-receipt-rule" aria-hidden="true" />

              <section aria-labelledby="application-id-heading" className="success-id rounded-[var(--radius-card)] border border-border bg-[var(--accent-soft)]/35 p-5">
                <p className="eyebrow text-muted" id="application-id-heading">YOUR APPLICATION ID</p>
                <p className="mt-2 break-all font-mono text-[clamp(1.45rem,6vw,2rem)] font-medium tracking-[0.08em]">{applicationCode}</p>
                <p className="helper mt-2">Keep this safe. You&apos;ll need it to track your application.</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button className="min-h-11" onClick={copyApplicationCode} variant="secondary">{copyState === 'copied' ? 'Copied' : 'Copy ID'}</Button>
                  <span aria-live="polite" className="helper">{copyState === 'unavailable' ? 'Copy is unavailable here. You can select the ID manually.' : ''}</span>
                </div>
              </section>

              <div className="success-receipt-rule" aria-hidden="true" />

              <section aria-labelledby="next-heading">
                <h2 className="heading" id="next-heading">What happens next?</h2>
                <ol className="success-journey mt-5 grid gap-3">
                  {nextStages.map((stage, index) => (
                    <li className="success-stage rounded-[var(--radius-control)] border border-border bg-[var(--paper)] px-4 py-3" key={stage}>
                      <span className="success-stage-number body-small text-muted">{String(index + 1).padStart(2, '0')}</span>
                      <span className="label">{stage}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <div className="success-actions utility-actions flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button href={`/track?id=${encodeURIComponent(applicationCode)}`}>Track your application &rarr;</Button>
              </div>

              <RecruitmentShareSection />

              <div className="success-actions utility-actions flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button href="/" variant="secondary">Back to E-CELL</Button>
              </div>
            </Stack>
          </PaperCard>
        </Container>
      </Section>
    </PageShell>
  );
}
