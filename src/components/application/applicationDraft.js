import { TEAM_IDS } from '@/config/canonical';
import { BRANCH_OPTIONS, YEAR_OPTIONS } from '@/config/application-options';

export const APPLICATION_DRAFT_KEY = 'ecell-recruitment-2026-draft-v1';
export const APPLICATION_DRAFT_VERSION = 1;
export const APPLICATION_STEP_COUNT = 3;

const ALLOWED_FIELDS = [
  'fullName',
  'email',
  'whatsappNumber',
  'branch',
  'yearOfStudy',
  'hasOtherClubs',
  'otherClubDetails',
  'primaryTeam',
  'secondaryTeam',
  'secondaryTeamReason',
  'whyEcell',
  'whyPrimaryTeam',
  'experience',
  'availability',
  'teamAnswers',
  'confirmationAccepted'
];

export function createEmptyApplicationData(initialTeam = '') {
  return {
    fullName: '',
    email: '',
    whatsappNumber: '',
    branch: '',
    yearOfStudy: '',
    hasOtherClubs: null,
    otherClubDetails: '',
    primaryTeam: TEAM_IDS.includes(initialTeam) ? initialTeam : '',
    secondaryTeam: '',
    secondaryTeamReason: '',
    whyEcell: '',
    whyPrimaryTeam: '',
    experience: '',
    availability: '',
    teamAnswers: [],
    confirmationAccepted: false
  };
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function sanitizeBoolean(value) {
  return value === true || value === false ? value : null;
}

function sanitizeTeamAnswers(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(answer => isObject(answer))
    .map(answer => ({
      questionId: cleanString(answer.questionId).toLowerCase(),
      answerText: cleanString(answer.answerText),
      selectedOptions: Array.isArray(answer.selectedOptions)
        ? answer.selectedOptions.filter(option => typeof option === 'string').map(option => option.trim()).filter(Boolean)
        : [],
      link: cleanString(answer.link)
    }))
    .filter(answer => answer.questionId);
}

export function sanitizeApplicationData(value, initialTeam = '') {
  const empty = createEmptyApplicationData(initialTeam);

  if (!isObject(value)) {
    return empty;
  }

  const safe = { ...empty };
  const branchValues = BRANCH_OPTIONS.map(option => option.value);
  const yearValues = YEAR_OPTIONS.map(option => option.value);

  for (const field of ALLOWED_FIELDS) {
    if (!Object.hasOwn(value, field)) {
      continue;
    }

    if (field === 'hasOtherClubs') {
      safe.hasOtherClubs = sanitizeBoolean(value.hasOtherClubs);
      continue;
    }

    if (field === 'confirmationAccepted') {
      safe.confirmationAccepted = value.confirmationAccepted === true;
      continue;
    }

    if (field === 'teamAnswers') {
      safe.teamAnswers = sanitizeTeamAnswers(value.teamAnswers);
      continue;
    }

    safe[field] = cleanString(value[field]);
  }

  if (!branchValues.includes(safe.branch)) {
    safe.branch = '';
  }

  if (!yearValues.includes(safe.yearOfStudy)) {
    safe.yearOfStudy = '';
  }

  if (!TEAM_IDS.includes(safe.primaryTeam)) {
    safe.primaryTeam = '';
  }

  if (!TEAM_IDS.includes(safe.secondaryTeam)) {
    safe.secondaryTeam = '';
  }

  if (safe.secondaryTeam && safe.secondaryTeam === safe.primaryTeam) {
    safe.secondaryTeam = '';
    safe.secondaryTeamReason = '';
  }

  if (safe.hasOtherClubs !== true) {
    safe.otherClubDetails = '';
  }

  return safe;
}

export function hasDraftContent(data) {
  if (!isObject(data)) {
    return false;
  }

  return ALLOWED_FIELDS.some(field => {
    if (field === 'teamAnswers') {
      return Array.isArray(data.teamAnswers) && data.teamAnswers.length > 0;
    }

    if (field === 'hasOtherClubs') {
      return data.hasOtherClubs === true || data.hasOtherClubs === false;
    }

    if (field === 'confirmationAccepted') {
      return data.confirmationAccepted === true;
    }

    return typeof data[field] === 'string' && data[field].trim().length > 0;
  });
}

export function parseDraft(rawValue) {
  if (!rawValue) {
    return null;
  }

  let parsed;

  try {
    parsed = JSON.parse(rawValue);
  } catch {
    return null;
  }

  if (!isObject(parsed) || parsed.version !== APPLICATION_DRAFT_VERSION || !isObject(parsed.data)) {
    return null;
  }

  const currentStep = Number.isInteger(parsed.currentStep)
    ? Math.min(Math.max(parsed.currentStep, 0), APPLICATION_STEP_COUNT - 1)
    : 0;

  const data = sanitizeApplicationData(parsed.data);

  if (!hasDraftContent(data)) {
    return null;
  }

  return {
    version: APPLICATION_DRAFT_VERSION,
    data,
    currentStep,
    updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : ''
  };
}

export function loadApplicationDraft() {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(APPLICATION_DRAFT_KEY);
  const draft = parseDraft(rawValue);

  if (!draft && rawValue) {
    window.localStorage.removeItem(APPLICATION_DRAFT_KEY);
  }

  return draft;
}

export function saveApplicationDraft(data, currentStep) {
  if (typeof window === 'undefined') {
    return;
  }

  const safeData = sanitizeApplicationData(data);

  if (!hasDraftContent(safeData)) {
    return;
  }

  const draft = {
    version: APPLICATION_DRAFT_VERSION,
    data: safeData,
    currentStep: Math.min(Math.max(currentStep, 0), APPLICATION_STEP_COUNT - 1),
    updatedAt: new Date().toISOString()
  };

  window.localStorage.setItem(APPLICATION_DRAFT_KEY, JSON.stringify(draft));
}

export function clearApplicationDraft() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(APPLICATION_DRAFT_KEY);
}
