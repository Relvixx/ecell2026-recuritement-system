'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTeamById } from '@/config/teams';
import { STATUS_COPY, STATUS_TOKENS } from '@/lib/design-system';
import { Button, FormField, Input } from '../ui/forms';
import { Container, PageShell, PaperCard, Section, Stack } from '../ui/layout';

const APPLICATION_CODE_PATTERN = /^EC26-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{5}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TRACKING_ERROR = 'We couldn\'t find an application with those details.';
const TRACKING_ERROR_HELPER = 'Check your Application ID and registered email, then try again.';
const RATE_LIMIT_ERROR = 'Too many attempts. Please wait a bit, then try again.';
const NETWORK_ERROR = 'We couldn\'t check your application right now. Please try again.';
const PROGRESSION_STATUSES = ['submitted', 'under_review', 'shortlisted', 'interview'];
const TERMINAL_STATUSES = ['selected', 'rejected'];

function normalizeApplicationCode(value) {
  return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

function validateTrackingForm(data) {
  const errors = {};
  const applicationCode = normalizeApplicationCode(data.applicationCode);
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';

  if (!applicationCode) errors.applicationCode = 'This field is required.';
  else if (!APPLICATION_CODE_PATTERN.test(applicationCode)) errors.applicationCode = 'Enter a valid Application ID.';
  if (!email) errors.email = 'This field is required.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address.';
  return errors;
}

function isSafeResult(value) {
  return value && typeof value === 'object'
    && typeof value.applicationCode === 'string'
    && APPLICATION_CODE_PATTERN.test(value.applicationCode)
    && typeof value.firstName === 'string'
    && typeof value.primaryTeam === 'string'
    && Object.hasOwn(STATUS_COPY, value.status);
}

export function TrackingShell({ loading = false }) {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ applicationCode: '', email: '' });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState('');
  const [loadingRequest, setLoadingRequest] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    const queryCode = normalizeApplicationCode(searchParams.get('id'));
    if (APPLICATION_CODE_PATTERN.test(queryCode)) setForm(previous => ({ ...previous, applicationCode: queryCode }));
  }, [searchParams]);

  useEffect(() => {
    if (result && resultRef.current) resultRef.current.focus();
  }, [result]);

  function updateField(field, value) {
    const nextValue = field === 'applicationCode' ? normalizeApplicationCode(value) : value;
    setForm(previous => ({ ...previous, [field]: nextValue }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
    setFormError('');
  }

  async function checkStatus(event) {
    event.preventDefault();
    if (loadingRequest) return;

    const normalizedForm = {
      applicationCode: normalizeApplicationCode(form.applicationCode),
      email: typeof form.email === 'string' ? form.email.trim().toLowerCase() : ''
    };
    const validationErrors = validateTrackingForm(normalizedForm);
    setForm(normalizedForm);
    setErrors(validationErrors);
    setResult(null);
    setFormError('');
    if (Object.keys(validationErrors).length > 0) return;

    setLoadingRequest(true);
    try {
      const response = await fetch('/api/applications/track', {
        body: JSON.stringify(normalizedForm),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      });
      const body = await response.json().catch(() => ({}));
      if (response.status === 404) {
        setFormError(TRACKING_ERROR);
        return;
      }
      if (response.status === 429) {
        setFormError(RATE_LIMIT_ERROR);
        return;
      }
      if (!response.ok || !isSafeResult(body.application)) {
        setFormError(NETWORK_ERROR);
        return;
      }
      setResult(body.application);
    } catch {
      setFormError(NETWORK_ERROR);
    } finally {
      setLoadingRequest(false);
    }
  }

  function clearResult() {
    setResult(null);
    setFormError('');
    setErrors({});
  }

  if (loading) {
    return <PageShell className="tracking-experience utility-experience" recruitmentTheme="midnight"><Section spacing="compact"><Container width="form"><PaperCard className="utility-card"><p className="body text-muted">Preparing application tracking.</p></PaperCard></Container></Section></PageShell>;
  }

  return (
    <PageShell className="tracking-experience utility-experience" recruitmentTheme="midnight">
      <Section spacing="compact">
        <Container width="form">
          <PaperCard className="tracking-card tracking-paper-sheet utility-card">
            <div className="tracking-layout grid gap-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
              <Stack gap="lg">
                <Stack gap="sm">
                  <p className="eyebrow text-muted">E-CELL MET / Recruitment 2026-27</p>
                  <h1 className="display-section">Track your application</h1>
                  <p className="body-large text-muted">Enter your Application ID and the email address you used while applying.</p>
                </Stack>
                <form aria-describedby={formError ? 'tracking-form-error' : undefined} aria-label="Track application" className="tracking-form grid gap-5" noValidate onSubmit={checkStatus}>
                  <FormField error={errors.applicationCode} id="applicationCode" label="Application ID" required>
                    {(fieldProps) => <Input {...fieldProps} autoComplete="off" error={Boolean(errors.applicationCode)} onChange={(event) => updateField('applicationCode', event.target.value)} placeholder="EC26-XXXXX" type="text" value={form.applicationCode} />}
                  </FormField>
                  <FormField error={errors.email} id="trackingEmail" label="Email address" required>
                    {(fieldProps) => <Input {...fieldProps} autoComplete="email" error={Boolean(errors.email)} onChange={(event) => updateField('email', event.target.value)} placeholder="you@example.com" type="email" value={form.email} />}
                  </FormField>
                  {formError ? <div aria-live="assertive" className="rounded-[var(--radius-control)] border border-error bg-[var(--color-error-surface)]/35 p-3" id="tracking-form-error" role="alert"><p className="body-small text-error">{formError}</p>{formError === TRACKING_ERROR ? <p className="helper mt-1">{TRACKING_ERROR_HELPER}</p> : null}</div> : null}
                  <Button className="tracking-submit" disabled={loadingRequest} type="submit">{loadingRequest ? 'Checking...' : 'Check status'} &rarr;</Button>
                </form>
                {result ? <button className="tracking-change-details label w-fit rounded-full px-1 py-2 text-muted transition hover:text-foreground focus-visible:text-foreground" onClick={clearResult} type="button">Change details</button> : null}
              </Stack>
              {result ? <StatusDisplay className="tracking-result" result={result} resultRef={resultRef} /> : <TrackingHint />}
            </div>
          </PaperCard>
        </Container>
      </Section>
    </PageShell>
  );
}

function TrackingHint() {
  return <aside aria-label="Application tracking information" className="tracking-hint rounded-[var(--radius-paper)] border border-border bg-[var(--paper)] p-5 sm:p-7"><Stack gap="md"><p className="eyebrow text-muted">PRIVATE LOOKUP</p><h2 className="heading">Your status, when you need it.</h2><p className="body text-muted">Your Application ID and registered email are both needed to check an application.</p></Stack></aside>;
}

export function StatusDisplay({ result, resultRef, className = '' }) {
  const copy = STATUS_COPY[result.status];
  const accent = STATUS_TOKENS[result.status];
  const team = getTeamById(result.primaryTeam);
  const currentIndex = PROGRESSION_STATUSES.indexOf(result.status);
  const terminalStatus = TERMINAL_STATUSES.includes(result.status) ? result.status : null;
  const terminalCopy = terminalStatus ? STATUS_COPY[terminalStatus] : null;
  const terminalStep = {
    key: terminalStatus || 'final_decision',
    label: terminalCopy?.label || 'Final Decision',
    title: terminalCopy?.title || 'Pending',
    active: Boolean(terminalStatus),
    complete: false,
    rejected: terminalStatus === 'rejected'
  };

  return (
    <aside
      aria-label={`Application status: ${copy.label}`}
      className={`tracking-result-card rounded-[var(--radius-paper)] border border-border bg-[var(--paper)] p-5 shadow-[var(--shadow-soft)] sm:p-7 ${className}`}
      ref={resultRef}
      tabIndex="-1"
    >
      <Stack gap="md">
        <div className="tracking-result-heading flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow text-muted">APPLICATION STATUS</p>
          <span
            className="tracking-status-chip inline-flex min-h-11 w-fit items-center rounded-full border border-border px-4 py-2 text-sm font-medium"
            style={{ background: `color-mix(in srgb, ${accent} 46%, var(--paper))` }}
          >
            {copy.label}
          </span>
        </div>

        <div>
          <p className="tracking-code helper font-mono tracking-[0.08em]">{result.applicationCode}</p>
          <h2 className="heading mt-2">{copy.title}</h2>
          <p className="body mt-3 text-muted">{copy.description}</p>
        </div>

        <dl className="tracking-meta grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <div>
            <dt className="helper">Applicant</dt>
            <dd className="body mt-1 break-words">{result.firstName}</dd>
          </div>
          <div>
            <dt className="helper">Primary team</dt>
            <dd className="body mt-1 break-words">{team?.name || 'Team'}</dd>
          </div>
        </dl>

        <ol className="tracking-status-flow" aria-label="Recruitment status progression. Final decision resolves to selected or rejected.">
          {PROGRESSION_STATUSES.map((status, index) => {
            const statusCopy = STATUS_COPY[status];
            const active = status === result.status;
            const complete = Boolean(terminalStatus) || currentIndex > index;

            return (
              <li
                aria-current={active ? 'step' : undefined}
                className={`tracking-status-step ${active ? 'is-active' : ''} ${complete ? 'is-complete' : ''}`}
                key={status}
              >
                <span className="tracking-status-dot" aria-hidden="true" />
                <span>
                  <span className="label block">{statusCopy.label}</span>
                  <span className="helper block">{statusCopy.title}</span>
                </span>
              </li>
            );
          })}
          <li
            aria-current={terminalStep.active ? 'step' : undefined}
            aria-label={`Final decision: ${terminalStep.label}`}
            className={`tracking-status-step is-terminal ${terminalStep.active ? 'is-active' : 'is-pending'} ${terminalStep.rejected ? 'is-rejected' : ''}`}
            key={terminalStep.key}
          >
            <span className="tracking-status-dot" aria-hidden="true" />
            <span>
              <span className="label block">{terminalStep.label}</span>
              <span className="helper block">{terminalStep.title}</span>
            </span>
          </li>
        </ol>
      </Stack>
    </aside>
  );
}
