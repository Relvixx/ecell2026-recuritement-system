'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TEAM_IDS } from '@/config/canonical';
import { ApplicationActions, ApplicationShell, ApplicationStepHeader, PaperCard, Stack } from '@/components';
import { DraftResumePrompt } from './DraftResumePrompt';
import {
  clearApplicationDraft,
  createEmptyApplicationData,
  hasDraftContent,
  loadApplicationDraft,
  saveApplicationDraft
} from './applicationDraft';
import { STEP_ONE_FIELDS, hasValidationErrors, normalizeStepOneData, validateStepOne } from './applicationValidation';
import { STEP_ONE_FORM_ID, StepOneYou } from './StepOneYou';

function getValidInitialTeam(searchParams) {
  const team = searchParams.get('team');
  return TEAM_IDS.includes(team) ? team : '';
}

function scrollToApplicationTop() {
  if (typeof window === 'undefined') {
    return;
  }

  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
}

export function ApplicationWizard() {
  const searchParams = useSearchParams();
  const initialTeam = useMemo(() => getValidInitialTeam(searchParams), [searchParams]);
  const [data, setData] = useState(() => createEmptyApplicationData(initialTeam));
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [autosaveStatus, setAutosaveStatus] = useState('idle');
  const [pendingDraft, setPendingDraft] = useState(null);
  const [ready, setReady] = useState(false);
  const lastSavedRef = useRef('');

  useEffect(() => {
    const draft = loadApplicationDraft();

    if (draft) {
      setPendingDraft(draft);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || pendingDraft) {
      return undefined;
    }

    if (!hasDraftContent(data)) {
      return undefined;
    }

    const payload = JSON.stringify({ data, currentStep });

    if (payload === lastSavedRef.current) {
      return undefined;
    }

    setAutosaveStatus('idle');
    const saveTimer = window.setTimeout(() => {
      saveApplicationDraft(data, currentStep);
      lastSavedRef.current = payload;
      setAutosaveStatus('saved');
    }, 650);

    return () => window.clearTimeout(saveTimer);
  }, [currentStep, data, pendingDraft, ready]);

  function updateData(field, value) {
    setData(previous => {
      const next = {
        ...previous,
        [field]: value
      };

      if (field === 'hasOtherClubs' && value === false) {
        next.otherClubDetails = '';
      }

      return next;
    });

    setTouched(previous => ({ ...previous, [field]: true }));

    if (errors[field] || (field === 'hasOtherClubs' && errors.otherClubDetails)) {
      setErrors(validateStepOne({ ...data, [field]: value, otherClubDetails: field === 'hasOtherClubs' && value === false ? '' : data.otherClubDetails }));
    }
  }

  function markTouched(field) {
    setTouched(previous => ({ ...previous, [field]: true }));
    setErrors(validateStepOne(data));
  }

  function continueFromStepOne(event) {
    event.preventDefault();

    const stepErrors = validateStepOne(data);

    if (hasValidationErrors(stepErrors)) {
      setErrors(stepErrors);
      setTouched(Object.fromEntries(STEP_ONE_FIELDS.map(field => [field, true])));
      return;
    }

    const normalized = normalizeStepOneData(data);
    setData(normalized);
    setErrors({});
    setCurrentStep(1);
    scrollToApplicationTop();
  }

  function continueDraft() {
    const stepErrors = validateStepOne(pendingDraft.data);
    const restoredStep = pendingDraft.currentStep > 0 && hasValidationErrors(stepErrors) ? 0 : pendingDraft.currentStep;

    setData(pendingDraft.data);
    setCurrentStep(restoredStep);
    setErrors({});
    setTouched({});
    setPendingDraft(null);
    lastSavedRef.current = JSON.stringify({ data: pendingDraft.data, currentStep: restoredStep });
    setAutosaveStatus('saved');
  }

  function startOver() {
    clearApplicationDraft();
    const cleanData = createEmptyApplicationData(initialTeam);
    setData(cleanData);
    setCurrentStep(0);
    setErrors({});
    setTouched({});
    setPendingDraft(null);
    lastSavedRef.current = '';
    setAutosaveStatus('idle');
  }

  function goBack() {
    setCurrentStep(previous => Math.max(previous - 1, 0));
    scrollToApplicationTop();
  }

  if (!ready) {
    return (
      <ApplicationShell currentStep={0}>
        <ApplicationStepHeader description="Preparing the application space." title="Tell us about yourself" />
      </ApplicationShell>
    );
  }

  if (pendingDraft) {
    return (
      <ApplicationShell currentStep={0}>
        <Stack gap="lg">
          <ApplicationStepHeader description="You can keep going or begin again with a clean application." title="Tell us about yourself" />
          <DraftResumePrompt onContinue={continueDraft} onStartOver={startOver} />
        </Stack>
      </ApplicationShell>
    );
  }

  if (currentStep === 1 || currentStep === 2) {
    const placeholder = currentStep === 1
      ? {
          title: 'Find your place',
          description: 'Team selection starts in Batch B. Your answers from Step 1 are preserved here.'
        }
      : {
          title: 'Almost there.',
          description: 'Review and submission are reserved for a later batch.'
        };

    return (
      <ApplicationShell
        actions={<ApplicationActions onBack={goBack} showNext={false} />}
        currentStep={currentStep}
      >
        <Stack gap="lg">
          <ApplicationStepHeader
            description={placeholder.description}
            title={placeholder.title}
          />
          <PaperCard className="bg-[var(--color-butter)]/25">
            <p className="body text-muted">
              Step {currentStep + 1} placeholder. No team questions or submission actions are active yet.
            </p>
          </PaperCard>
        </Stack>
      </ApplicationShell>
    );
  }

  return (
    <ApplicationShell
      actions={<ApplicationActions backLabel="Back" nextForm={STEP_ONE_FORM_ID} nextLabel="Continue" nextType="submit" showBack={false} />}
      currentStep={0}
    >
      <StepOneYou
        autosaveStatus={autosaveStatus}
        data={data}
        errors={errors}
        onBlur={markTouched}
        onChange={updateData}
        onSubmit={continueFromStepOne}
        touched={touched}
      />
    </ApplicationShell>
  );
}
