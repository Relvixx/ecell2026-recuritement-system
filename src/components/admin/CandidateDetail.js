'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Textarea } from '@/components';
import { getTeamById } from '@/config/teams';
import { AVAILABILITY_OPTIONS } from '@/config/application-options';
import { STATUS_COPY, STATUS_TOKENS } from '@/lib/design-system';
import AdminConfirmDialog from './AdminConfirmDialog';

const display = (value) => value || 'Not provided';
const year = { first_year: 'First Year', second_year: 'Second Year', third_year: 'Third Year' };

function displayOption(options, value) {
  return options.find((option) => option.value === value)?.label || value || 'Not provided';
}

function Answer({ answer, questions }) {
  const question = questions.find((item) => item.id === answer.questionId);
  const value = answer.selectedOptions?.length ? answer.selectedOptions.join(', ') : answer.link || answer.answerText;

  return (
    <div className="border-b border-border py-3 last:border-0">
      <p className="body-small text-muted">{question?.label || answer.questionId}</p>
      <p className="body mt-1 break-words whitespace-pre-wrap">{display(value)}</p>
    </div>
  );
}

export default function CandidateDetail({ candidate, loading, onClose, onStatus, onNotes, onDelete }) {
  const closeRef = useRef(null);
  const [notes, setNotes] = useState(candidate?.internalNotes || '');
  const [confirm, setConfirm] = useState(null);
  const [pendingStatus, setPendingStatus] = useState('');

  useEffect(() => {
    setNotes(candidate?.internalNotes || '');
    setPendingStatus('');
    closeRef.current?.focus();
  }, [candidate]);

  useEffect(() => {
    const handler = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!candidate && !loading) return null;

  const team = getTeamById(candidate?.primaryTeam);
  const status = candidate?.status || 'submitted';

  async function confirmAction() {
    const action = confirm;
    setConfirm(null);

    if (action === 'delete') {
      await onDelete();
      return;
    }

    await onStatus(action);
  }

  function cancelConfirm() {
    setConfirm(null);
    setPendingStatus('');
  }

  function requestStatusChange(nextStatus) {
    setPendingStatus(nextStatus);

    if (['selected', 'rejected'].includes(nextStatus)) {
      setConfirm(nextStatus);
      return;
    }

    onStatus(nextStatus).catch(() => setPendingStatus(''));
  }

  return (
    <div className="fixed inset-0 z-40 bg-[rgba(40,38,38,0.2)]" role="presentation">
      <aside
        aria-label="Candidate details"
        aria-modal="true"
        className="absolute inset-y-0 right-0 w-full overflow-y-auto border-l border-border bg-[var(--color-ivory-100)] p-4 shadow-[var(--shadow-soft)] sm:p-6 lg:max-w-[600px]"
        role="dialog"
      >
        <div className="mx-auto max-w-[520px]">
          <div className="sticky top-0 z-10 -mx-4 flex items-center justify-between gap-4 border-b border-border bg-[var(--color-ivory-100)] px-4 py-3 sm:-mx-6 sm:px-6">
            <span className="eyebrow text-muted">Candidate detail</span>
            <Button className="min-h-11 px-4" onClick={onClose} ref={closeRef} variant="secondary">
              Close
            </Button>
          </div>

          {loading || !candidate ? (
            <div className="grid gap-3 py-8">
              <div className="h-8 animate-pulse rounded bg-[var(--color-surface-muted)]" />
              <div className="h-24 animate-pulse rounded bg-[var(--color-surface-muted)]" />
            </div>
          ) : (
            <div className="grid gap-6 py-6">
              <header>
                <p className="eyebrow text-muted">{candidate.applicationCode}</p>
                <h2 className="display-section mt-2 text-4xl">{candidate.fullName}</h2>
                <p className="body-small mt-2 text-muted">
                  {year[candidate.yearOfStudy] || candidate.yearOfStudy} - {display(candidate.branch)}
                </p>
              </header>

              <section className="grid gap-4 rounded-[var(--radius-card)] border border-border bg-surface p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="body-small text-muted">Current status</p>
                    <p className="label mt-1">{STATUS_COPY[status]?.label || status}</p>
                  </div>
                  <span className="rounded-full border border-border px-3 py-2 text-sm" style={{ background: STATUS_TOKENS[status] }}>
                    Status
                  </span>
                </div>
                <select
                  aria-label="Update candidate status"
                  className="min-h-11 w-full rounded-[var(--radius-control)] border border-border bg-[var(--color-ivory-50)] px-3"
                  onChange={(event) => requestStatusChange(event.target.value)}
                  value={pendingStatus || status}
                >
                  {Object.keys(STATUS_COPY).map((id) => (
                    <option key={id} value={id}>
                      {STATUS_COPY[id].label}
                    </option>
                  ))}
                </select>
              </section>

              <InfoSection title="Identity">
                <Info label="Full name" value={candidate.fullName} />
                <Info label="Application ID" value={candidate.applicationCode} />
              </InfoSection>

              <InfoSection title="Contact">
                <Info label="Email" value={candidate.email} />
                <Info label="WhatsApp" value={candidate.whatsappNumber} />
              </InfoSection>

              <InfoSection title="Academic details">
                <Info label="Branch" value={candidate.branch} />
                <Info label="Year" value={year[candidate.yearOfStudy] || candidate.yearOfStudy} />
                <Info label="Other clubs" value={candidate.hasOtherClubs ? candidate.otherClubDetails || 'Yes' : 'No'} />
              </InfoSection>

              <InfoSection title="Team preferences">
                <Info label="Primary team" value={team?.name || candidate.primaryTeam} />
                <Info label="Second preference" value={getTeamById(candidate.secondaryTeam)?.name || candidate.secondaryTeam} />
                <Info label="Secondary reason" value={candidate.secondaryTeamReason} />
              </InfoSection>

              <InfoSection title="Application">
                <Info label="Why E-CELL?" value={candidate.whyEcell} />
                <Info label="Why primary team?" value={candidate.whyPrimaryTeam} />
                <Info label="Experience" value={candidate.experience} />
                <Info label="Availability" value={displayOption(AVAILABILITY_OPTIONS, candidate.availability)} />
              </InfoSection>

              <InfoSection title="Team answers">
                {team?.questions?.length && candidate.teamAnswers?.length ? (
                  candidate.teamAnswers.map((answer) => (
                    <Answer answer={answer} key={answer.questionId} questions={team.questions} />
                  ))
                ) : (
                  <p className="body-small text-muted">Not provided</p>
                )}
              </InfoSection>

              <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5">
                <h3 className="heading text-2xl">Internal notes</h3>
                <p className="helper mt-2">Only admins can see these notes.</p>
                <Textarea className="mt-4" onChange={(event) => setNotes(event.target.value)} value={notes} />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Button disabled={notes === (candidate.internalNotes || '')} onClick={() => onNotes(notes)}>
                    Save note
                  </Button>
                  <button className="text-sm text-muted underline underline-offset-4" onClick={() => setConfirm('delete')} type="button">
                    More actions
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </aside>

      {confirm ? (
        <AdminConfirmDialog
          confirmLabel={confirm === 'delete' ? 'Delete application' : 'Update status'}
          danger={confirm === 'delete'}
          onCancel={cancelConfirm}
          onConfirm={confirmAction}
          title={confirm === 'delete' ? 'Delete this application?' : `Mark ${candidate?.fullName} as ${STATUS_COPY[confirm]?.label}?`}
        >
          {confirm === 'delete'
            ? 'This action is permanent and cannot be undone.'
            : confirm === 'rejected'
              ? 'Their application will remain in the system and can still be reviewed later.'
              : "This will update the candidate's recruitment status."}
        </AdminConfirmDialog>
      ) : null}
    </div>
  );
}

function InfoSection({ title, children }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5">
      <h3 className="heading text-2xl">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="grid gap-1 border-b border-border py-3 last:border-0">
      <span className="body-small text-muted">{label}</span>
      <span className="body break-words whitespace-pre-wrap">{display(value)}</span>
    </div>
  );
}
