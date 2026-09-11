'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TEAM_IDS } from '@/config/canonical';
import { getTeamById } from '@/config/teams';
import { ApplicationActions, ApplicationShell, ApplicationStepHeader, Stack } from '@/components';
import { DraftResumePrompt } from './DraftResumePrompt';
import { ApplicationReview } from './ApplicationReview';
import {
  clearApplicationDraft,
  createEmptyApplicationData,
  hasDraftContent,
  loadApplicationDraft,
  saveApplicationDraft
} from './applicationDraft';
import {
  STEP_ONE_FIELDS,
  hasValidationErrors,
  normalizeStepOneData,
  validateStepOne,
  validateStepTwo
} from './applicationValidation';
import { STEP_ONE_FORM_ID, StepOneYou } from './StepOneYou';
import { StepTwoYourSquad } from './StepTwoYourSquad';

const STEP_TWO_FORM_ID = 'application-step-two';
const REVIEW_FORM_ID = 'application-review';

function getValidInitialTeam(searchParams) {
  const team = searchParams.get('team');
  return TEAM_IDS.includes(team) ? team : '';
}

function scrollToApplicationTop() {
  if (typeof window === 'undefined') return;

  window.requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  });
}

function answerForQuestion(question, value) {
  if (question.type === 'multiselect') return { questionId: question.id, selectedOptions: Array.isArray(value) ? value : [] };
  if (question.type === 'url') return { questionId: question.id, link: typeof value === 'string' ? value : '' };
  return { questionId: question.id, answerText: typeof value === 'string' ? value : '' };
}

function buildTeamAnswersPayload(team, answersByTeam) {
  if (!team) return [];

  const answers = Array.isArray(answersByTeam[team.id]) ? answersByTeam[team.id] : [];
  const answersById = new Map(answers.map(answer => [answer.questionId, answer]));

  return team.questions.flatMap(question => {
    const answer = answersById.get(question.id);
    if (!answer) return [];
    if (question.type === 'multiselect') return [{ questionId: question.id, selectedOptions: Array.isArray(answer.selectedOptions) ? answer.selectedOptions : [] }];
    if (question.type === 'url') return answer.link ? [{ questionId: question.id, link: answer.link.trim() }] : [];
    return answer.answerText?.trim() ? [{ questionId: question.id, answerText: answer.answerText.trim() }] : [];
  });
}

function getReachableStep(savedStep, data, answersByTeam) {
  if (savedStep > 0 && hasValidationErrors(validateStepOne(data))) return 0;
  if (savedStep > 1 && hasValidationErrors(validateStepTwo(data, answersByTeam))) return 1;
  return savedStep;
}

export function ApplicationWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTeam = useMemo(() => getValidInitialTeam(searchParams), [searchParams]);
  const [data, setData] = useState(() => createEmptyApplicationData(initialTeam));
  const [answersByTeam, setAnswersByTeam] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [autosaveStatus, setAutosaveStatus] = useState('idle');
  const [pendingDraft, setPendingDraft] = useState(null);
  const [ready, setReady] = useState(false);
  const [returnToReview, setReturnToReview] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const lastSavedRef = useRef('');
  const submissionErrorRef = useRef(null);

  useEffect(() => {
    const draft = loadApplicationDraft();
    if (draft) setPendingDraft(draft);
    setReady(true);
  }, []);

  useEffect(() => {
    if (submissionError && submissionErrorRef.current) submissionErrorRef.current.focus();
  }, [submissionError]);

  useEffect(() => {
    if (!ready || pendingDraft || submitting || !hasDraftContent(data)) return undefined;
    const payload = JSON.stringify({ data, answersByTeam, currentStep });
    if (payload === lastSavedRef.current) return undefined;

    setAutosaveStatus('idle');
    const saveTimer = window.setTimeout(() => {
      saveApplicationDraft(data, currentStep, answersByTeam);
      lastSavedRef.current = payload;
      setAutosaveStatus('saved');
    }, 650);
    return () => window.clearTimeout(saveTimer);
  }, [answersByTeam, currentStep, data, pendingDraft, ready, submitting]);

  function updateData(field, value) {
    setData(previous => {
      const next = { ...previous, [field]: value };
      if (field === 'hasOtherClubs' && value === false) next.otherClubDetails = '';
      if (field === 'secondaryTeam' && !value) next.secondaryTeamReason = '';
      if (field === 'primaryTeam') {
        next.teamAnswers = answersByTeam[value] || [];
        if (next.secondaryTeam === value) {
          next.secondaryTeam = '';
          next.secondaryTeamReason = '';
        }
      }
      if (currentStep > 0) next.confirmationAccepted = false;
      return next;
    });

    setTouched(previous => ({ ...previous, [field]: true }));
    setSubmissionError('');
    if (currentStep === 1 && (errors[field] || field === 'primaryTeam' || field === 'secondaryTeam')) {
      setErrors(validateStepTwo({ ...data, [field]: value }, answersByTeam));
    }
  }

  function updateTeamAnswer(question, value) {
    if (!data.primaryTeam) return;
    const nextAnswer = answerForQuestion(question, value);
    const existingAnswers = answersByTeam[data.primaryTeam] || [];
    const nextAnswers = [...existingAnswers.filter(answer => answer.questionId !== question.id), nextAnswer];
    const nextMap = { ...answersByTeam, [data.primaryTeam]: nextAnswers };
    setAnswersByTeam(nextMap);
    setData(previous => ({ ...previous, teamAnswers: nextAnswers, confirmationAccepted: false }));
    setTouched(previous => ({ ...previous, [`team_${question.id}`]: true }));
    setSubmissionError('');
  }

  function markTouched(field) {
    setTouched(previous => ({ ...previous, [field]: true }));
    if (currentStep === 0) setErrors(validateStepOne(data));
    if (currentStep === 1) setErrors(validateStepTwo(data, answersByTeam));
  }

  function continueFromStepOne(event) {
    event.preventDefault();
    const stepErrors = validateStepOne(data);
    if (hasValidationErrors(stepErrors)) {
      setErrors(stepErrors);
      setTouched(Object.fromEntries(STEP_ONE_FIELDS.map(field => [field, true])));
      return;
    }
    setData(normalizeStepOneData(data));
    setErrors({});
    setCurrentStep(returnToReview ? 2 : 1);
    setReturnToReview(false);
    scrollToApplicationTop();
  }

  function continueFromStepTwo(event) {
    event.preventDefault();
    const stepErrors = validateStepTwo(data, answersByTeam);
    if (hasValidationErrors(stepErrors)) {
      setErrors(stepErrors);
      setTouched(previous => ({ ...previous, ...Object.fromEntries(Object.keys(stepErrors).map(field => [field, true])) }));
      return;
    }
    setErrors({});
    setCurrentStep(2);
    setReturnToReview(false);
    scrollToApplicationTop();
  }

  function continueDraft() {
    const restoredMap = pendingDraft.teamAnswersByTeam || {};
    const activeMap = pendingDraft.data.primaryTeam && pendingDraft.data.teamAnswers.length
      ? { ...restoredMap, [pendingDraft.data.primaryTeam]: pendingDraft.data.teamAnswers }
      : restoredMap;
    const restoredStep = getReachableStep(pendingDraft.currentStep, pendingDraft.data, activeMap);
    const restoredData = { ...pendingDraft.data, confirmationAccepted: false };
    setData(restoredData);
    setAnswersByTeam(activeMap);
    setCurrentStep(restoredStep);
    setErrors({});
    setTouched({});
    setPendingDraft(null);
    setAutosaveStatus('saved');
    lastSavedRef.current = JSON.stringify({ data: restoredData, answersByTeam: activeMap, currentStep: restoredStep });
  }

  function startOver() {
    clearApplicationDraft();
    setData(createEmptyApplicationData(initialTeam));
    setAnswersByTeam({});
    setCurrentStep(0);
    setErrors({});
    setTouched({});
    setPendingDraft(null);
    setReturnToReview(false);
    setSubmissionError('');
    setAutosaveStatus('idle');
    lastSavedRef.current = '';
  }

  function goBack() {
    setCurrentStep(previous => Math.max(previous - 1, 0));
    setErrors({});
    setSubmissionError('');
    scrollToApplicationTop();
  }

  function editStep(step) {
    setCurrentStep(step);
    setReturnToReview(true);
    setErrors({});
    setSubmissionError('');
    scrollToApplicationTop();
  }

  function changeConfirmation(value) {
    setData(previous => ({ ...previous, confirmationAccepted: value }));
    setErrors(previous => ({ ...previous, confirmationAccepted: undefined }));
  }

  async function submitApplication(event) {
    event.preventDefault();
    if (submitting) return;
    if (!data.confirmationAccepted) {
      setErrors(previous => ({ ...previous, confirmationAccepted: 'Please confirm your information before submitting.' }));
      return;
    }

    const team = getTeamById(data.primaryTeam);
    const payload = {
      fullName: data.fullName,
      email: data.email,
      whatsappNumber: data.whatsappNumber,
      branch: data.branch,
      yearOfStudy: data.yearOfStudy,
      hasOtherClubs: data.hasOtherClubs,
      otherClubDetails: data.otherClubDetails,
      primaryTeam: data.primaryTeam,
      secondaryTeam: data.secondaryTeam,
      secondaryTeamReason: data.secondaryTeamReason,
      whyEcell: data.whyEcell,
      whyPrimaryTeam: data.whyPrimaryTeam,
      experience: data.experience,
      teamAnswers: buildTeamAnswersPayload(team, answersByTeam),
      confirmationAccepted: true
    };

    setSubmitting(true);
    setSubmissionError('');
    try {
      const response = await fetch('/api/applications', {
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 409) throw new Error('An application already exists with this email or WhatsApp number.');
        throw new Error(response.status === 400 && result.error ? result.error : "We couldn't submit your application. Your answers are still safe—please try again.");
      }
      if (!result.success || typeof result.applicationCode !== 'string' || !/^EC26-[A-Z2-9]{5}$/.test(result.applicationCode)) {
        throw new Error("We couldn't submit your application. Your answers are still safe—please try again.");
      }
      clearApplicationDraft();
      router.push(`/apply/success?id=${encodeURIComponent(result.applicationCode)}`);
    } catch (error) {
      setSubmissionError(error instanceof Error && error.message ? error.message : "We couldn't submit your application. Your answers are still safe—please try again.");
      setSubmitting(false);
    }
  }

  if (!ready) return <ApplicationShell currentStep={0}><ApplicationStepHeader description="Preparing the application space." title="Tell us about yourself" /></ApplicationShell>;

  if (pendingDraft) {
    return <ApplicationShell currentStep={0}><Stack gap="lg"><ApplicationStepHeader description="You can keep going or begin again with a clean application." title="Tell us about yourself" /><DraftResumePrompt onContinue={continueDraft} onStartOver={startOver} /></Stack></ApplicationShell>;
  }

  if (currentStep === 1) {
    return <ApplicationShell actions={<ApplicationActions nextForm={STEP_TWO_FORM_ID} nextLabel="Continue" nextType="submit" onBack={goBack} />} currentStep={1}><StepTwoYourSquad answersByTeam={answersByTeam} data={data} errors={errors} onBlur={markTouched} onChange={updateData} onSubmit={continueFromStepTwo} onTeamAnswerChange={updateTeamAnswer} touched={touched} /></ApplicationShell>;
  }

  if (currentStep === 2) {
    return <ApplicationShell actions={<ApplicationActions nextDisabled={submitting} nextForm={REVIEW_FORM_ID} nextLabel={submitting ? 'Submitting...' : 'Submit application'} nextType="submit" onBack={goBack} />} currentStep={2}><ApplicationReview answersByTeam={answersByTeam} data={data} errors={errors} onChangeConfirmation={changeConfirmation} onEdit={editStep} onSubmit={submitApplication} submissionError={submissionError} submissionErrorRef={submissionErrorRef} submitting={submitting} /></ApplicationShell>;
  }

  return <ApplicationShell actions={<ApplicationActions nextForm={STEP_ONE_FORM_ID} nextLabel="Continue" nextType="submit" showBack={false} />} currentStep={0}><StepOneYou autosaveStatus={autosaveStatus} data={data} errors={errors} onBlur={markTouched} onChange={updateData} onSubmit={continueFromStepOne} touched={touched} /></ApplicationShell>;
}
