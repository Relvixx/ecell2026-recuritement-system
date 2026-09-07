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

function answerValue(answer) {
  return answer?.selectedOptions?.length ? answer.selectedOptions.join(', ') : answer?.link || answer?.answerText;
}

function Answer({ answer, questions }) {
  const question = questions.find((item) => item.id === answer.questionId);

  return (
    <div className="border-b border-border py-4 last:border-0">
      <p className="admin-detail-label">{question?.label || answer.questionId}</p>
      <p className="admin-detail-value mt-1">{display(answerValue(answer))}</p>
    </div>
  );
}

export default function CandidateDetail({ candidate, loading, onClose, onStatus, onNotes, onDelete }) {
  const closeRef = useRef(null);
  const drawerRef = useRef(null);
  const [notes, setNotes] = useState(candidate?.internalNotes || '');
  const [confirm, setConfirm] = useState(null);
  const [pendingStatus, setPendingStatus] = useState('');

  useEffect(() => {
    setNotes(candidate?.internalNotes || '');
    setPendingStatus('');
    drawerRef.current?.scrollTo({ top: 0 });
    closeRef.current?.focus();
  }, [candidate?._id, candidate?.internalNotes]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handler = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!candidate && !loading) return null;

  const team = getTeamById(candidate?.primaryTeam);
  const secondaryTeam = getTeamById(candidate?.secondaryTeam);
  const status = candidate?.status || 'submitted';
  const candidateMeta = [
    candidate?.applicationCode,
    team?.name || candidate?.primaryTeam,
    year[candidate?.yearOfStudy] || candidate?.yearOfStudy
  ].filter(Boolean).join(' · ');

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
        className="admin-detail-drawer absolute inset-y-0 right-0 w-full overflow-y-auto border-l border-border bg-[var(--color-ivory-100)] shadow-[var(--shadow-soft)] sm:max-w-[620px]"
        ref={drawerRef}
        role="dialog"
      >
        <div className="sticky top-0 z-10 border-b border-border bg-[var(--color-ivory-100)] px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow text-muted">Candidate</p>
              <h2 className="admin-detail-title mt-1">{candidate?.fullName || 'Loading candidate'}</h2>
              {candidateMeta ? <p className="admin-detail-meta body-small mt-1 text-muted">{candidateMeta}</p> : null}
            </div>
            <Button className="min-h-10 shrink-0 px-4 sm:min-h-10" onClick={onClose} ref={closeRef} variant="secondary">
              Close
            </Button>
          </div>
        </div>

        {loading || !candidate ? (
          <div className="grid gap-3 p-6">
            <div className="h-8 animate-pulse rounded bg-[var(--color-surface-muted)]" />
            <div className="h-24 animate-pulse rounded bg-[var(--color-surface-muted)]" />
          </div>
        ) : (
          <div className="admin-detail-content px-5 py-5 sm:px-6">
            <section className="admin-status-panel rounded-[var(--radius-card)] border border-border bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="admin-detail-label">Current status</p>
                  <p className="label mt-1">{STATUS_COPY[status]?.label || status}</p>
                </div>
                <span className="admin-status-chip hidden rounded-full border border-border px-3 py-2 text-sm sm:inline-flex" style={{ background: STATUS_TOKENS[status] }}>
                  Status
                </span>
              </div>
              <label className="admin-detail-label mt-4 block" htmlFor="candidate-status">Update status</label>
              <select
                className="mt-2 min-h-11 w-full rounded-[var(--radius-control)] border border-border bg-[var(--color-ivory-50)] px-3"
                id="candidate-status"
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

            <DetailSection title="Candidate">
              <div className="admin-detail-grid">
                <Info label="Full name" value={candidate.fullName} />
                <Info label="Email" value={candidate.email} />
                <Info label="WhatsApp" value={candidate.whatsappNumber} />
                <Info label="Application ID" value={candidate.applicationCode} />
                <Info label="Branch" value={candidate.branch} />
                <Info label="Year" value={year[candidate.yearOfStudy] || candidate.yearOfStudy} />
                <Info className="sm:col-span-2" label="Other clubs" value={candidate.hasOtherClubs ? candidate.otherClubDetails || 'Yes' : 'No'} />
              </div>
            </DetailSection>

            <DetailSection title="Team preferences">
              <Info label="Primary team" value={team?.name || candidate.primaryTeam} />
              <Info label="Second preference" value={secondaryTeam?.name || candidate.secondaryTeam} />
              <Info label="Secondary reason" value={candidate.secondaryTeamReason} />
              <Info label="Availability" value={displayOption(AVAILABILITY_OPTIONS, candidate.availability)} />
            </DetailSection>

            <DetailSection title="Application">
              <Info label="Why E-CELL?" value={candidate.whyEcell} />
              <Info label="Why primary team?" value={candidate.whyPrimaryTeam} />
              <Info label="Experience" value={candidate.experience} />
            </DetailSection>

            <DetailSection title="Team questions">
              {team?.questions?.length && candidate.teamAnswers?.length ? (
                candidate.teamAnswers.map((answer) => (
                  <Answer answer={answer} key={answer.questionId} questions={team.questions} />
                ))
              ) : (
                <p className="body-small text-muted">Not provided</p>
              )}
            </DetailSection>

            <section className="admin-notes-section border-t border-border pt-5">
              <h3 className="admin-detail-section-title">Internal notes</h3>
              <p className="helper mt-1">Only admins can see these notes.</p>
              <Textarea className="mt-3 min-h-32" id="internal-notes" onChange={(event) => setNotes(event.target.value)} value={notes} />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <Button className="admin-save-note" disabled={notes === (candidate.internalNotes || '')} onClick={() => onNotes(notes)}>
                  Save note
                </Button>
                <button className="admin-more-actions text-sm text-muted underline underline-offset-4 hover:text-foreground focus-visible:text-foreground" onClick={() => setConfirm('delete')} type="button">
                  More actions
                </button>
              </div>
            </section>
          </div>
        )}
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

function DetailSection({ title, children }) {
  return (
    <section className="admin-detail-section border-t border-border pt-5">
      <h3 className="admin-detail-section-title">{title}</h3>
      <div className="mt-3 grid gap-1">{children}</div>
    </section>
  );
}

function Info({ label, value, className = '' }) {
  return (
    <div className={`border-b border-border py-3 last:border-0 ${className}`}>
      <span className="admin-detail-label">{label}</span>
      <span className="admin-detail-value mt-1">{display(value)}</span>
    </div>
  );
}
